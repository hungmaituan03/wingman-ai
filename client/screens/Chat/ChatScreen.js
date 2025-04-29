// src/screens/Chat/ChatScreen.js

import React, { useState, useRef, useEffect } from 'react';
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
import styles from './ChatScreen.styles';
import { useChatStorage } from '../../hooks/useChatStorage';
import { summarizeOpeningHours, parsePriceLevel } from '../../utils/stringParsers';
import colors from '../../constants/Colors';

const API_URL = 'http://172.16.44.32:5000/chat';

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [placeInput, setPlaceInput] = useState('');
  const [radiusInput, setRadiusInput] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionOptions, setSessionOptions] = useState([]);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);

  const { getChatMessages, saveChatMessages, loadSessions, saveSession } = useChatStorage();

  const [fontsLoaded] = useFonts({ Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular });

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('sessionUpdated', async () => {
      const updated = await loadSessions();
      setSessionOptions(updated);
      if (!updated.some(s => s.id === sessionId)) resetChat();
    });
    return () => sub.remove();
  }, [sessionId, loadSessions]);

  useEffect(() => {
    (async () => setSessionOptions(await loadSessions()))();
  }, []);

  useEffect(() => {
    (async () => {
      const id = typeof route.params?.sessionId === 'string' ? route.params.sessionId : null;
      setSessionId(id);
      if (id) {
        const chat = await getChatMessages(id);
        setMessages(chat.length ? chat : [getWelcomeMessage()]);
      } else {
        setMessages([getWelcomeMessage()]);
      }
    })();
  }, [route.params?.sessionId]);

  useEffect(() => {
    if (messages.length) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  useEffect(() => {
    const listener = Keyboard.addListener('keyboardDidHide', () => setAutocompleteResults([]));
    return () => listener.remove();
  }, []);

  const getWelcomeMessage = () => ({
    text: "Hi there! 👋 I can help you find great places nearby.",
    sender: 'bot',
    id: uuidv4(),
    timestamp: Date.now(),
  });

  const resetChat = () => {
    setSessionId(null);
    setMessages([getWelcomeMessage()]);
    setPlaceInput('');
    setRadiusInput('');
    setDescriptionInput('');
    navigation.setParams({ sessionId: null, newChat: true });
  };

  const fetchAutocomplete = async text => {
    if (!text.trim()) return setAutocompleteResults([]);
    try {
      setAutocompleteLoading(true);
      const res = await fetch(`${API_URL.replace('/chat', '')}/autocomplete?query=${encodeURIComponent(text)}`);
      setAutocompleteResults((await res.json()) || []);
    } catch {
      setAutocompleteResults([]);
    } finally {
      setAutocompleteLoading(false);
    }
  };

  const debouncedFetch = useRef(debounce(fetchAutocomplete, 300)).current;

  const handleRetry = async msg => {
    if (!msg.retryData) return;
    const { placeInput, radiusInput, descriptionInput, distanceUnit } = msg.retryData;
    setPlaceInput(placeInput);
    setRadiusInput(radiusInput);
    setDistanceUnit(distanceUnit);
    setDescriptionInput(descriptionInput);
    await sendMessage();
  };

  const sendMessage = async () => {
    if (!placeInput.trim() || !radiusInput.trim() || !descriptionInput.trim() || isTyping) return;

    const sessionName = `${placeInput} - ${radiusInput}${distanceUnit} - ${descriptionInput}`;
    const now = Date.now();
    const userMsg = {
      text: `📍 ${placeInput}\n📏 ${radiusInput} ${distanceUnit}\n🔍 ${descriptionInput}`,
      sender: 'user',
      id: uuidv4(),
      timestamp: now,
      retryData: { placeInput, radiusInput, descriptionInput, distanceUnit },
    };

    const updated = [...messages, userMsg];
    const typingMsg = { id: 'typing', sender: 'bot', typing: true, timestamp: now };
    setMessages([...updated, typingMsg]);
    setIsTyping(true);
    Keyboard.dismiss();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          place: placeInput,
          radius: radiusInput,
          unit: distanceUnit,
          description: descriptionInput,
          conversation_id: sessionId,
        }),
      });
      setPlaceInput('');
      setRadiusInput('');
      setDescriptionInput('');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      let activeId = sessionId;
      if (!sessionId && data.conversation_id) {
        activeId = data.conversation_id;
        setSessionId(activeId);
        navigation.setParams({ sessionId: activeId, newChat: false });
      }

      const botMsg = {
        text: data.summary,
        explanations: data.explanations,
        sender: 'bot',
        id: uuidv4(),
        timestamp: Date.now(),
        places: data.places || [],
      };

      const newMessages = [...updated, botMsg];
      setMessages(newMessages);

      if (activeId) {
        await saveChatMessages(activeId, newMessages);
        await saveSession({ id: activeId, name: sessionName });
        setSessionOptions(await loadSessions());
        DeviceEventEmitter.emit('sessionUpdated');
      }
    } catch {
      const failed = updated.map(m => (m.id === userMsg.id ? { ...m, failed: true } : m));
      setMessages(failed);
    } finally {
      setIsTyping(false);
    }
  };

  const navigateToMapScreen = places => navigation.navigate('MapScreen', { places });

  const renderMessage = ({ item }) => {
    const hasPlaces = Array.isArray(item.places) && item.places.length > 0;

    if (item.typing) {
      return (
        <View style={[styles.messageRow, styles.botRow]}>
          <View style={styles.botAvatar}>
            <Image source={require('../../assets/images/kitty.png')} style={styles.avatarImage} />
          </View>
          <View style={[styles.messageContainer, styles.botContainer]}>
            <View style={[styles.messageBubble, styles.botBubble]}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.messageRow, item.sender === 'user' ? styles.userRow : styles.botRow]}>
        {item.sender === 'bot' && (
          <View style={styles.botAvatar}>
            <Image source={require('../../assets/images/kitty.png')} style={styles.avatarImage} />
          </View>
        )}
        <View style={[styles.messageContainer, item.sender === 'user' ? styles.userContainer : styles.botContainer]}>
          <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            {hasPlaces ? (
              <>
                <Text style={styles.placeSummary}>{item.text}</Text>
                {item.places.map((place, i) => (
                  <BlurView key={place.id} intensity={90} tint="light" style={styles.placeCard}>
                    <Text style={styles.placeName}>
                      {i + 1}. {place.name}
                    </Text>
                    <Text style={styles.placeAddress}>📍 {place.address}</Text>
                    <Text style={styles.placeRating}>
                      ⭐ {place.rating} ({place.user_ratings_total} reviews)
                    </Text>
                    {place.opening_hours?.length > 0 && (
                      <Text style={styles.placeOpeningHours}>
                        🕒 {summarizeOpeningHours(place.opening_hours)}
                      </Text>
                    )}
                    {place.price_level !== undefined && (
                      <Text style={styles.placePrice}>
                        💵 {parsePriceLevel(place.price_level)}
                      </Text>
                    )}
                    {item.explanations?.[i] && (
                      <Text style={styles.placeExplanation}>
                        💬 {item.explanations[i]}
                      </Text>
                    )}
                  </BlurView>
                ))}
                <TouchableOpacity style={styles.mapButton} onPress={() => navigateToMapScreen(item.places)}>
                  <Text style={styles.mapButtonText}>
                    <Icon name="map-outline" size={16} /> View on Map
                  </Text>
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
        {item.sender === 'user' && (
          <View style={styles.userAvatar}>
            <Icon name="person" size={20} color="#fff" />
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
      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ChatHeader
          title="Find Place"
          onBackPress={() => navigation.goBack()}
          selectedValue={sessionId}
          onValueChange={value => navigation.setParams({ sessionId: value, newChat: false })}
          sessionOptions={sessionOptions}
        />

        {/* Messages */}
        <View style={styles.messagesWrapper} pointerEvents="box-none">
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => item.id ? `${item.id}-${item.timestamp}` : `msg-${index}`}
            renderItem={renderMessage}
            contentContainerStyle={{ paddingBottom: 300 }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Input Card */}
        <View style={styles.inputContainer}>
          <View style={styles.inputCard}>
            {/* Row 1: Place + Radius */}
            <View style={styles.inputRow}>
              <View style={styles.placeInputWrapper}>
                <TextInput
                  style={[styles.input, styles.placeInput]}
                  placeholder="Location (e.g. New York)"
                  placeholderTextColor="#999"
                  value={placeInput}
                  onChangeText={text => {
                    setPlaceInput(text);
                    debouncedFetch(text);
                  }}
                />
              </View>
              <View style={styles.radiusContainer}>
                <TextInput
                  style={[styles.input, styles.radiusInput]}
                  placeholder="5"
                  placeholderTextColor="#999"
                  value={radiusInput}
                  onChangeText={setRadiusInput}
                  keyboardType="numeric"
                  onFocus={() => setAutocompleteResults([])}
                />
                <TouchableOpacity style={styles.unitButton} onPress={() => setDistanceUnit(u => (u === 'km' ? 'mi' : 'km'))}>
                  <Text style={styles.unitText}>{distanceUnit}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Suggestions */}
            {autocompleteResults.length > 0 && (
              <ScrollView style={styles.suggestionsContainer} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                {autocompleteResults.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    onPress={() => {
                      setPlaceInput(item.description);
                      setAutocompleteResults([]);
                    }}
                    style={styles.suggestionItem}
                  >
                    <Text style={styles.suggestionText}>{item.description}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Row 3: Description + Send */}
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="What would you like to find?"
                placeholderTextColor="#999"
                value={descriptionInput}
                onChangeText={setDescriptionInput}
                multiline
                onFocus={() => setAutocompleteResults([])}
              />
              <TouchableOpacity
                style={[styles.sendButton, (!placeInput || !radiusInput || !descriptionInput || isTyping) && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!placeInput || !radiusInput || !descriptionInput || isTyping}
              >
                <Icon name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
