// navigation/ChatStack.js

import React, { useEffect, useCallback } from 'react';
import { Dimensions, DeviceEventEmitter } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useChatStorage } from '../hooks/useChatStorage';

import ChatScreen from '../screens/Chat/ChatScreen';
import MapScreen from '../screens/Map/MapScreen';
import ChatDrawer from '../components/Chat/ChatDrawer';

const Drawer = createDrawerNavigator();
const Stack  = createNativeStackNavigator();
const drawerWidth = Dimensions.get('window').width * 0.8;

export default function ChatStack({ navigation }) {
  const { colors } = useTheme();
  const {
    sessionList,
    loadSessions,
    deleteSession,
    renameSession,
  } = useChatStorage();

  // Load sessions on mount and when "sessionUpdated" fires
  useEffect(() => {
    loadSessions();
    const sub = DeviceEventEmitter.addListener('sessionUpdated', loadSessions);
    return () => sub.remove();
  }, [loadSessions]);

  // Re-load whenever this screen regains focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadSessions);
    return unsubscribe;
  }, [navigation, loadSessions]);

  const handleSelectSession = useCallback(
    id => {
      navigation.navigate('Chat', {
        screen: 'ChatMain',
        params: {
          screen: 'ChatScreen',
          params: { sessionId: id },
        },
      });
    },
    [navigation]
  );

  const handleNewChat = useCallback(() => {
    navigation.navigate('Chat', {
      screen: 'ChatMain',
      params: {
        screen: 'ChatScreen',
        params: { newChat: true },
      },
    });
  }, [navigation]);

  const renderDrawerContent = props => (
    <ChatDrawer
      {...props}
      sessionList={sessionList}
      onSelect={handleSelectSession}
      onNewChat={handleNewChat}
      sessionActions={{ deleteSession, renameSession }}
    />
  );

  return (
    <Drawer.Navigator
      drawerContent={renderDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: drawerWidth,
          backgroundColor: colors.card,
        },
        overlayColor: colors.overlay,
        drawerType: 'slide',
      }}
    >
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
}
