import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DeviceEventEmitter } from 'react-native';

import ChatScreen from '../screens/Chat/ChatScreen';
import MapScreen from '../screens/Map/MapScreen';
import ChatDrawer from '../components/Chat/ChatDrawer';
import { useChatStorage } from '../hooks/useChatStorage';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const ChatStack = ({ navigation }) => {
  const { sessionList, loadSessions, deleteSession, renameSession } = useChatStorage(); // ✅ Add deleteSession, renameSession

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', loadSessions);
    const subscription = DeviceEventEmitter.addListener('sessionUpdated', async () => {
      console.log('🛎️ Received sessionUpdated event, reloading sessions...');
      await loadSessions();
    });

    return () => {
      unsubscribeFocus();
      subscription.remove();
    };
  }, [navigation, loadSessions]);

  const handleSelectSession = (id) => {
    navigation.navigate('Chat', {
      screen: 'ChatMain',
      params: {
        screen: 'ChatScreen',
        params: { sessionId: id },
      },
    });
  };

  const handleNewChat = async () => {
    console.log('🆕 New chat button clicked');
    navigation.navigate('Chat', {
      screen: 'ChatMain',
      params: {
        screen: 'ChatScreen',
        params: { newChat: true },
      },
    });
  };

  const renderDrawerContent = (props) => (
    <ChatDrawer
      {...props}
      sessionList={sessionList}
      onSelect={handleSelectSession}
      onNewChat={handleNewChat}
      sessionActions={{ deleteSession, renameSession }} // ✅ Pass sessionActions cleanly
    />
  );

  return (
    <Drawer.Navigator drawerContent={renderDrawerContent} screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="ChatMain">
        {() => (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="MapScreen" component={MapScreen} />
          </Stack.Navigator>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default ChatStack;
