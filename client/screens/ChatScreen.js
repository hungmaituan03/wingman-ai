import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard, 
  SafeAreaView, 
  StatusBar, 
  Image,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import colors from '../constants/Colors';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([ 
    { 
      text: "Hi there! 👋 I can help you find great places nearby. Tell me what you're looking for!", 
      sender: 'bot', 
      id: 1 
    },
  ]);
  const [placeInput, setPlaceInput] = useState('');
  const [radiusInput, setRadiusInput] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const API_URL = "http://172.16.44.32:8080/chat";
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardHeight(0)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const sendMessage = async () => {
    if (!placeInput.trim() || !radiusInput.trim() || !descriptionInput.trim() || isTyping) return;

    const userMessageText = `📍 ${placeInput}\n📏 ${radiusInput} ${distanceUnit}\n🔍 ${descriptionInput}`;
    const userMessage = { text: userMessageText, sender: 'user', id: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
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
          conversation_id: 'user-session-id',
        }),
      });

      setPlaceInput('');
      setRadiusInput('');
      setDescriptionInput('');

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          text: data.response,
          sender: 'bot',
          id: Date.now() + 1,
          places: data.places || [],
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble responding. Please try again later.",
          sender: 'bot',
          id: Date.now() + 1,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const navigateToMapScreen = (places) => {
    navigation.navigate('MapScreen', { places });
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  const renderMessage = ({ item }) => {
    const hasMap = item.places && item.places.length > 0;
    return (
      <View style={[styles.messageRow, item.sender === 'user' ? styles.userRow : styles.botRow]}>
        
        {item.sender === 'bot' && (
          <View style={styles.botAvatar}>
            <Image 
              source={require('../assets/images/kitty.png')} 
              style={styles.avatarImage}
            />
          </View>
        )}
        <View style={[styles.messageContainer, item.sender === 'user' ? styles.userContainer : styles.botContainer]}>
          <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.botText]}>
              {item.text}
            </Text>
            
            {hasMap && (
              <TouchableOpacity style={styles.mapButton} onPress={() => navigateToMapScreen(item.places)}>
                <Text style={styles.mapButtonText}>
                  <Icon name="map-outline" size={16} /> View on Map
                </Text>
              </TouchableOpacity>
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
        <StatusBar barStyle="dark-content" backgroundColor={colors.dark.background} />
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="chevron-back" size={24} color={colors.dark.text} />
            </TouchableOpacity>
          </View>
    
          {/* Chat Messages */}
          <View style={styles.messagesWrapper}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderMessage}
              contentContainerStyle={[styles.messagesContainer, { paddingBottom: 180 }]}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={isTyping ? (
                <View style={[styles.messageRow, styles.botRow]}>
                  <View style={styles.botAvatar}>
                    <Image 
                      source={require('../assets/images/kitty.png')} 
                      style={styles.avatarImage}
                    />
                  </View>
                  <View style={[styles.messageContainer, styles.botContainer]}>
                    <View style={[styles.messageBubble, styles.botBubble]}>
                      <ActivityIndicator size="small" color={colors.dark.text} />
                    </View>
                  </View>
                </View>
              ) : null}
            />
          </View>
    

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <View style={styles.inputCard}>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.placeInput]}
                  placeholder="Location (e.g. New York)"
                  placeholderTextColor={colors.dark.textSecondary}
                  value={placeInput}
                  onChangeText={setPlaceInput}
                />
                <View style={styles.radiusContainer}>
                  <TextInput
                    style={[styles.input, styles.radiusInput]}
                    placeholder="5"
                    placeholderTextColor={colors.dark.textSecondary}
                    value={radiusInput}
                    onChangeText={setRadiusInput}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity 
                    style={styles.unitButton} 
                    onPress={() => setDistanceUnit(unit => unit === 'km' ? 'mi' : 'km')}
                  >
                    <Text style={styles.unitText}>{distanceUnit}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  placeholder="What would you like to find? (e.g. cozy coffee shops)"
                  placeholderTextColor={colors.dark.textSecondary}
                  value={descriptionInput}
                  onChangeText={setDescriptionInput}
                  multiline
                />
                <TouchableOpacity 
                  style={[styles.sendButton, 
                    (!placeInput || !radiusInput || !descriptionInput) && styles.sendButtonDisabled
                  ]} 
                  onPress={sendMessage} 
                  disabled={!placeInput || !radiusInput || !descriptionInput || isTyping}
                >
                  <Icon name="send" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  messagesWrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.dark.background,
  },
  backButton: {
    padding: 8,
  },
  messagesContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.dark.background,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  messageContainer: {
    maxWidth: '80%',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: colors.dark.primary, // #AE9BFA
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#D3C1FF', // light purple glow
    shadowColor: '#D3C1FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  
  botBubble: {
    backgroundColor: colors.dark.primary, // #6E44FF
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#BBA5FF', // subtle lavender glow
    shadowColor: '#BBA5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 7,
  },
  
  userBubble: {
    backgroundColor: colors.dark.primary,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#D3C1FF', // glow edge based on primary
    shadowColor: '#D3C1FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  
  messageText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
  },
  botText: {
    color: '#E0D7FF',
    fontFamily: 'Poppins_600SemiBold',
  },
  userText: {
    color: '#E0D7FF',
    fontFamily: 'Poppins_600SemiBold',
  },
  messageTime: {
    fontSize: 11,
    color: colors.dark.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
  },
  mapButton: {
    marginTop: 8,
  },
  mapButtonText: {
    color: colors.dark.accent,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputCard: {
    borderRadius: 24,
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#F4F0FF', // Updated input text color
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#BDAAFF', // Updated border color
  },
  placeInput: {
    marginRight: 8,
  },
  radiusContainer: {
    flexDirection: 'row',
    width: 120,
  },
  radiusInput: {
    flex: 1,
    marginRight: 8,
    textAlign: 'center',
  },
  unitButton: {
    width: 50,
    height: 40,
    backgroundColor: colors.dark.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitText: {
    color: '#E0D7FF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  descriptionInput: {
    marginRight: 8,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.dark.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatScreen;
