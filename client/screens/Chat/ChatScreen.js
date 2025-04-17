import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
  DeviceEventEmitter, // ✅ Add this
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';

import ChatHeader from '../../components/Chat/ChatHeader';
import styles from './ChatScreen.styles';
import { useChatStorage } from '../../hooks/useChatStorage';

const API_URL = 'http://172.16.44.32:8080/chat';

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

  const {
    sessionList,
    getChatMessages,
    saveChatMessages,
    loadSessions,
    saveSession,
  } = useChatStorage();

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  useEffect(() => {
    (async () => {
      const sessions = await loadSessions();
      setSessionOptions(sessions);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const params = route?.params || {};
      const id = typeof params.sessionId === 'string' ? params.sessionId : null;
      setSessionId(id);

      if (id) {
        const chat = await getChatMessages(id);
        setMessages(
          chat.length > 0
            ? chat
            : [{
                text: "Hi there! 👋 I can help you find great places nearby.",
                sender: 'bot',
                id: Date.now(),
              }]
        );
      } else {
        setMessages([{
          text: "Hi there! 👋 I can help you find great places nearby.",
          sender: 'bot',
          id: Date.now(),
        }]);
      }
    })();
  }, [route.params?.sessionId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!placeInput.trim() || !radiusInput.trim() || !descriptionInput.trim() || isTyping) {
      console.warn('Blocked: One or more input fields are empty or isTyping is true.');
      return;
    }

    const sessionName = `${placeInput.trim()} - ${radiusInput.trim()}${distanceUnit} - ${descriptionInput.trim()}`;

    const userMessage = {
      text: `📍 ${placeInput}\n📏 ${radiusInput} ${distanceUnit}\n🔍 ${descriptionInput}`,
      sender: 'user',
      id: Date.now(),
    };

    const userUpdatedMessages = [...messages, userMessage];
    setMessages(userUpdatedMessages);
    
    setIsTyping(true);
    Keyboard.dismiss();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          place: placeInput,
          radius: radiusInput,
          unit: distanceUnit,
          description: descriptionInput,
          conversation_id: sessionId || null,
        }),
      });

      setPlaceInput('');
      setRadiusInput('');
      setDescriptionInput('');

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      let activeSessionId = sessionId;
      if (!sessionId && data.conversation_id) {
        console.log(`🆕 New conversation created: ${data.conversation_id}`);
        activeSessionId = data.conversation_id;
        setSessionId(data.conversation_id);
        navigation.setParams({
          sessionId: data.conversation_id,
          newChat: false,
        });
      }

      const botMessage = {
        text: data.response,
        sender: 'bot',
        id: Date.now() + 1,
        places: data.places || [],
      };

      const fullUpdatedMessages = [...userUpdatedMessages, botMessage];
      setMessages(fullUpdatedMessages);

      if (activeSessionId) {
        await saveChatMessages(activeSessionId, fullUpdatedMessages);
        await saveSession({ id: activeSessionId, name: sessionName });
        const updatedSessions = await loadSessions();
        setSessionOptions(updatedSessions);

        // ✅ Emit a global event to tell the ChatDrawer/Stack to reload sessions
        DeviceEventEmitter.emit('sessionUpdated');
      }

    } catch (error) {
      console.error('❌ Error during sending message:', error);

      const fallbackMessage = {
        text: "Sorry, I'm having trouble responding. Please try again later.",
        sender: 'bot',
        id: Date.now() + 1,
      };

      const errorUpdatedMessages = [...userUpdatedMessages, fallbackMessage];
      setMessages(errorUpdatedMessages);

      if (sessionId) {
        await saveChatMessages(sessionId, errorUpdatedMessages);
        await saveSessionMetadata(sessionId, sessionName);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const navigateToMapScreen = (places) => {
    navigation.navigate('MapScreen', { places });
  };

  const renderMessage = ({ item }) => {
    const hasMap = item.places?.length > 0;
    return (
      <View style={[styles.messageRow, item.sender === 'user' ? styles.userRow : styles.botRow]}>
        {item.sender === 'bot' && (
          <View style={styles.botAvatar}>
            <Image source={require('../../assets/images/kitty.png')} style={styles.avatarImage} />
          </View>
        )}
        <View style={[styles.messageContainer, item.sender === 'user' ? styles.userContainer : styles.botContainer]}>
          <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            {hasMap ? (
              <View>
                {item.places.map((place, index) => (
                  <BlurView intensity={90} tint="light" style={styles.placeCard} key={`${place.name}-${index}`}>
                    <Text style={styles.placeName}>{index + 1}. {place.name}</Text>
                    <Text style={styles.placeAddress}>📍 {place.address}</Text>
                    <Text style={styles.placeRating}>⭐ {place.rating}</Text>
                  </BlurView>
                ))}
                <TouchableOpacity style={styles.mapButton} onPress={() => navigateToMapScreen(item.places)}>
                  <Text style={styles.mapButtonText}>
                    <Icon name="map-outline" size={16} /> View on Map
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.messageText}>{item.text}</Text>
            )}
          </View>
          <Text style={styles.messageTime}>
            {new Date(item.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ChatHeader
          title="Recommend Place"
          onBackPress={() => navigation.goBack()}
          selectedValue={sessionId}
          onValueChange={(value) => {
            navigation.setParams({ sessionId: value, newChat: false });
          }}
          sessionOptions={sessionOptions}
        />

        <View style={styles.messagesWrapper}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => item?.id?.toString() || `msg-${index}`}
            renderItem={renderMessage}
            contentContainerStyle={[styles.messagesContainer, { paddingBottom: 180 }]}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              isTyping && (
                <View style={[styles.messageRow, styles.botRow]}>
                  <View style={styles.botAvatar}>
                    <Image source={require('../../assets/images/kitty.png')} style={styles.avatarImage} />
                  </View>
                  <View style={[styles.messageContainer, styles.botContainer]}>
                    <View style={[styles.messageBubble, styles.botBubble]}>
                      <ActivityIndicator size="small" color="#6E44FF" />
                    </View>
                  </View>
                </View>
              )
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.placeInput]}
                placeholder="Location (e.g. New York)"
                placeholderTextColor="#999"
                value={placeInput}
                onChangeText={setPlaceInput}
              />
              <View style={styles.radiusContainer}>
                <TextInput
                  style={[styles.input, styles.radiusInput]}
                  placeholder="5"
                  placeholderTextColor="#999"
                  value={radiusInput}
                  onChangeText={setRadiusInput}
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.unitButton} onPress={() => setDistanceUnit(unit => (unit === 'km' ? 'mi' : 'km'))}>
                  <Text style={styles.unitText}>{distanceUnit}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="What would you like to find? (e.g. cozy coffee shops)"
                placeholderTextColor="#999"
                value={descriptionInput}
                onChangeText={setDescriptionInput}
                multiline
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
