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
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const colors = {
  dark: {
    primary: '#AE9BFA',
    secondary: '#6E44FF',
    background: '#F5F3FF',
    card: '#FFFFFF',
    text: '#4A3E7A',
    textSecondary: '#A5A3B8',
    accent: '#FF9F4B',
    success: '#4CAF50',
    error: '#F44336'
  }
};

const ChatScreen = ({ navigation }) => { // Make sure to destructure navigation prop correctly
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef(null);
  const API_URL = "http://172.16.44.32:8080/chat";

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || isTyping) return;
  
    const userMessage = { text: inputText, sender: 'user', id: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    Keyboard.dismiss();
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          conversation_id: "user-session-id",
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      setMessages((prev) => [
        ...prev,
        {
          text: data.response,
          sender: 'bot',
          id: Date.now() + 1,
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
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, keyboardHeight]);

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Minimal Back Button */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        >
          <Icon 
            name="chevron-back" 
            size={24} 
            color={colors.dark.primary} 
          />
        </TouchableOpacity>

        {/* Chat messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[
              styles.messageContainer,
              item.sender === 'user' ? styles.userContainer : styles.botContainer
            ]}>
              <View style={[
                styles.messageBubble, 
                item.sender === 'user' ? styles.userBubble : styles.botBubble
              ]}>
                <Text style={[
                  styles.messageText,
                  item.sender === 'user' ? styles.userText : styles.botText
                ]}>
                  {item.text}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.messagesContainer}
          ListHeaderComponent={<View style={styles.headerSpacer} />}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        />

        {/* Keyboard avoiding input area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          style={[
            styles.inputWrapper,
            { bottom: keyboardHeight > 0 ? keyboardHeight : 20 }
          ]}
        >
          {isTyping && (
            <View style={styles.typingIndicator}>
              <View style={[styles.typingDot, { backgroundColor: colors.dark.primary }]} />
              <View style={[styles.typingDot, { backgroundColor: colors.dark.primary }]} />
              <View style={[styles.typingDot, { backgroundColor: colors.dark.primary }]} />
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={colors.dark.textSecondary}
              multiline
              editable={!isTyping}
            />
            
            <TouchableOpacity 
              style={[
                styles.sendButton,
                inputText ? styles.activeSendButton : styles.inactiveSendButton
              ]} 
              onPress={sendMessage}
              disabled={isTyping || !inputText}
            >
              <Icon 
                name="send" 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark.background,
  },
  headerSpacer: {
    height: 50, // Increased to accommodate back button
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  messageContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: colors.dark.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: colors.dark.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Poppins_400Regular',
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: colors.dark.text,
  },
  inputWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    color: colors.dark.text,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    paddingVertical: 12,
    paddingRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  activeSendButton: {
    backgroundColor: colors.dark.primary,
  },
  inactiveSendButton: {
    backgroundColor: colors.dark.textSecondary,
  },
  typingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});

export default ChatScreen;