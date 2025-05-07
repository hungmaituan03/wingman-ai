// src/screens/Chat/ChatScreen.js

import React, { useState, useRef, useEffect, useMemo } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  DeviceEventEmitter,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import Icon from 'react-native-vector-icons/Ionicons';

import ChatHeader from '../../components/Chat/ChatHeader';
import createStyles from './ChatScreen.styles';
import { useChatStorage } from '../../hooks/useChatStorage';
import { summarizeOpeningHours, parsePriceLevel } from '../../utils/stringParsers';
import { useTheme } from '../../context/ThemeContext';

const API_URL = 'http://172.16.44.32:5000/chat';

// Simple debounce utility
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export default function ChatScreen() {
  // theme
  const { colors, isDark } = useTheme();

  // navigation & refs
  const navigation = useNavigation();
  const route = useRoute();
  const flatListRef = useRef(null);

  // font loading
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  // storage hooks
  const {
    getChatMessages,
    saveChatMessages,
    loadSessions,
    saveSession,
  } = useChatStorage();

  // chat form state
  const [messages, setMessages] = useState([]);
  const [placeInput, setPlaceInput] = useState('');
  const [radiusInput, setRadiusInput] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // session & autocomplete state
  const [sessionId, setSessionId] = useState(null);
  const [sessionOptions, setSessionOptions] = useState([]);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);

  // welcome message generator
  const getWelcome = () => ({
    id: uuidv4(),
    sender: 'bot',
    text: "Hi there! 👋 I can help you find great places nearby.",
    timestamp: Date.now(),
  });

  // load sessions + subscribe to updates
  useEffect(() => {
    loadSessions().then(setSessionOptions);
    const sub = DeviceEventEmitter.addListener('sessionUpdated', async () => {
      const updated = await loadSessions();
      setSessionOptions(updated);
      if (!updated.find(s => s.id === sessionId)) {
        resetChat();
      }
    });
    return () => sub.remove();
  }, [sessionId]);

  // initialize chat on session param change
  useEffect(() => {
    (async () => {
      const idParam = route.params?.sessionId;
      const id = typeof idParam === 'string' ? idParam : null;
      setSessionId(id);

      if (id) {
        const saved = await getChatMessages(id);
        setMessages(saved.length ? saved : [getWelcome()]);
      } else {
        setMessages([getWelcome()]);
      }
    })();
  }, [route.params?.sessionId]);

  // auto-scroll on new messages
  useEffect(() => {
    if (messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // clear autocomplete on keyboard hide
  useEffect(() => {
    const listener = Keyboard.addListener('keyboardDidHide', () => {
      setAutocompleteResults([]);
    });
    return () => listener.remove();
  }, []);

  // reset chat state
  const resetChat = () => {
    setSessionId(null);
    setMessages([getWelcome()]);
    setPlaceInput('');
    setRadiusInput('');
    setDescriptionInput('');
    navigation.setParams({ sessionId: null, newChat: true });
  };

  // autocomplete fetch
  const fetchAutocomplete = async query => {
    if (!query.trim()) {
      setAutocompleteResults([]);
      return;
    }
    try {
      setAutocompleteLoading(true);
      const res = await fetch(
        `${API_URL.replace('/chat', '')}/autocomplete?query=${encodeURIComponent(query)}`
      );
      const list = await res.json();
      setAutocompleteResults(list || []);
    } catch {
      setAutocompleteResults([]);
    } finally {
      setAutocompleteLoading(false);
    }
  };
  const debouncedFetch = useRef(debounce(fetchAutocomplete, 300)).current;

  // send or retry message
  const sendMessage = async retryData => {
    const place = retryData?.placeInput ?? placeInput;
    const radius = retryData?.radiusInput ?? radiusInput;
    const desc = retryData?.descriptionInput ?? descriptionInput;
    const unit = retryData?.distanceUnit ?? distanceUnit;
    if (!place.trim() || !radius.trim() || !desc.trim() || isTyping) return;

    const now = Date.now();
    const userMsg = {
      id: uuidv4(),
      sender: 'user',
      timestamp: now,
      text: `📍 ${place}\n📏 ${radius} ${unit}\n🔍 ${desc}`,
      retryData: { placeInput: place, radiusInput: radius, descriptionInput: desc, distanceUnit: unit },
    };

    // show typing indicator
    setMessages(prev => [...prev, userMsg, { id: 'typing', sender: 'bot', typing: true, timestamp: now }]);
    setIsTyping(true);
    Keyboard.dismiss();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          place,
          radius,
          unit,
          description: desc,
          conversation_id: sessionId,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // clear inputs
      setPlaceInput('');
      setRadiusInput('');
      setDescriptionInput('');

      // possibly set new session
      let activeId = sessionId;
      if (!sessionId && data.conversation_id) {
        activeId = data.conversation_id;
        setSessionId(activeId);
        navigation.setParams({ sessionId: activeId, newChat: false });
      }

      const botMsg = {
        id: uuidv4(),
        sender: 'bot',
        timestamp: Date.now(),
        text: data.summary,
        explanations: data.explanations,
        places: data.places || [],
      };

      const updated = messages.filter(m => m.id !== 'typing').concat(botMsg);
      setMessages(updated);

      if (activeId) {
        await saveChatMessages(activeId, updated);
        await saveSession({ id: activeId, name: `${place} - ${radius}${unit} - ${desc}` });
        DeviceEventEmitter.emit('sessionUpdated');
      }
    } catch {
      setMessages(prev =>
        prev.map(m => (m.id === userMsg.id ? { ...m, failed: true } : m))
      );
    } finally {
      setIsTyping(false);
    }
  };

  // navigate retry
  const handleRetry = item => {
    if (item.retryData) sendMessage(item.retryData);
  };

  // navigate to map
  const goToMap = places => {
    if (Array.isArray(places) && places.length) {
      navigation.navigate('MapScreen', { places });
    }
  };

  // create styles
  const styles = useMemo(() => createStyles(colors), [colors]);

  // wait for fonts
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // render a message
  const renderMessage = ({ item }) => {
    if (item.typing) {
      return (
        <View style={[styles.messageRow, styles.botRow]}>
          <View style={styles.botAvatar}>
            <Image source={require('../../assets/images/kitty.png')} style={styles.avatarImage} />
          </View>
          <View style={[styles.messageContainer, styles.botContainer]}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        </View>
      );
    }

    const isUser = item.sender === 'user';
    const hasPlaces = Array.isArray(item.places) && item.places.length > 0;

    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}>
        {!isUser && (
          <View style={styles.botAvatar}>
            <Image source={require('../../assets/images/kitty.png')} style={styles.avatarImage} />
          </View>
        )}
        <View style={[styles.messageContainer, isUser ? styles.userContainer : styles.botContainer]}>
          <View style={isUser ? styles.userBubble : styles.botBubble}>
            {hasPlaces ? (
              <>
                <Text style={styles.placeSummary}>{item.text}</Text>
                {item.places.map((place, idx) => (
                  <BlurView
                    key={place.id}
                    tint={isDark ? 'dark' : 'light'}
                    intensity={90}
                    style={styles.placeCard}
                  >
                    <Text style={styles.placeName}>{idx + 1}. {place.name}</Text>
                    <Text style={styles.placeAddress}>📍 {place.address}</Text>
                    <Text style={styles.placeRating}>
                      ⭐ {place.rating} ({place.user_ratings_total})
                    </Text>
                    {place.opening_hours?.length > 0 && (
                      <Text style={styles.placeOpeningHours}>
                        🕒 {summarizeOpeningHours(place.opening_hours)}
                      </Text>
                    )}
                    {place.price_level != null && (
                      <Text style={styles.placePrice}>
                        💵 {parsePriceLevel(place.price_level)}
                      </Text>
                    )}
                    {item.explanations?.[idx] && (
                      <Text style={styles.placeExplanation}>
                        💬 {item.explanations[idx]}
                      </Text>
                    )}
                  </BlurView>
                ))}
                <TouchableOpacity style={styles.mapButton} onPress={() => goToMap(item.places)}>
                  <Icon name="map-outline" size={16} color={colors.card} />
                  <Text style={styles.mapButtonText}>View on Map</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.messageText}>{item.text}</Text>
            )}
          </View>
          <Text style={styles.messageTime}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {isUser && (
          <View style={styles.userAvatar}>
            <Icon name="person" size={20} color={colors.card} />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 44 : 0}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />

        <ChatHeader
          title="Find Place"
          onBackPress={() => navigation.goBack()}
          selectedValue={sessionId}
          onValueChange={value => navigation.setParams({ sessionId: value, newChat: false })}
          sessionOptions={sessionOptions}
        />

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingBottom: 300 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.placeInput]}
                placeholder="Location (e.g. New York)"
                placeholderTextColor={colors.subtext}
                value={placeInput}
                onChangeText={text => {
                  setPlaceInput(text);
                  debouncedFetch(text);
                }}
              />
              <View style={styles.radiusContainer}>
                <TextInput
                  style={[styles.input, styles.radiusInput]}
                  placeholder="dst."
                  placeholderTextColor={colors.subtext}
                  value={radiusInput}
                  onChangeText={setRadiusInput}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.unitButton}
                  onPress={() => setDistanceUnit(u => (u === 'km' ? 'mi' : 'km'))}
                >
                  <Text style={styles.unitText}>{distanceUnit}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {autocompleteLoading && (
              <ActivityIndicator size="small" color={colors.primary} />
            )}
            {autocompleteResults.length > 0 && (
              <ScrollView style={styles.suggestionsContainer} keyboardShouldPersistTaps="handled">
                {autocompleteResults.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setPlaceInput(item.description);
                      setAutocompleteResults([]);
                    }}
                  >
                    <Text style={styles.suggestionText}>{item.description}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="What would you like to find?"
                placeholderTextColor={colors.subtext}
                value={descriptionInput}
                onChangeText={setDescriptionInput}
                multiline
              />
              <TouchableOpacity
                style={[styles.sendButton, (!placeInput || !radiusInput || !descriptionInput || isTyping) && styles.sendButtonDisabled]}
                onPress={() => sendMessage()}
                disabled={!placeInput || !radiusInput || !descriptionInput || isTyping}
              >
                <Icon name="send" size={20} color={colors.card} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
