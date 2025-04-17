import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native'; // ✅ Import emitter

const CHAT_SESSIONS_KEY = '@chat_sessions';
const CHAT_PREFIX = '@chat_';

export const useChatStorage = () => {
  const [sessionList, setSessionList] = useState([]);

  const loadSessions = useCallback(async () => {
    try {
      const sessions = await AsyncStorage.getItem(CHAT_SESSIONS_KEY);
      const parsed = sessions ? JSON.parse(sessions) : [];

      const normalized = parsed.map((item, index) => {
        if (typeof item === 'string') {
          return { id: item, name: `Session ${item.slice(0, 6)}` };
        }
        return {
          id: item.id ?? `fallback-${index}`,
          name: item.name ?? `Session ${item.id?.slice(0, 6) || index}`,
        };
      });

      setSessionList(normalized);
      return normalized;
    } catch (error) {
      console.error('❌ Failed to load sessions:', error);
      return [];
    }
  }, []);

  const saveSession = useCallback(async (session) => {
    if (!session?.id) {
      console.warn('⚠️ Tried to save session with no ID');
      return;
    }

    try {
      const existingStr = await AsyncStorage.getItem(CHAT_SESSIONS_KEY);
      const existingSessions = existingStr ? JSON.parse(existingStr) : [];

      const updated = [...existingSessions, session];
      await AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(updated));

      DeviceEventEmitter.emit('sessionUpdated'); // ✅ Emit instead of loadSessions
    } catch (err) {
      console.error('❌ Error saving session:', err);
    }
  }, []);

  const deleteSession = useCallback(async (sessionId) => {
    if (!sessionId) return;

    try {
      await AsyncStorage.removeItem(`${CHAT_PREFIX}${sessionId}`);

      const existingStr = await AsyncStorage.getItem(CHAT_SESSIONS_KEY);
      let existingSessions = existingStr ? JSON.parse(existingStr) : [];

      existingSessions = existingSessions.filter((s) => s.id !== sessionId);
      await AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(existingSessions));

      DeviceEventEmitter.emit('sessionUpdated'); // ✅ Emit here too
    } catch (err) {
      console.error('❌ Error deleting session:', err);
    }
  }, []);

  const renameSession = useCallback(async (sessionId, newName) => {
    if (!sessionId) return;

    try {
      const existingStr = await AsyncStorage.getItem(CHAT_SESSIONS_KEY);
      let existingSessions = existingStr ? JSON.parse(existingStr) : [];

      existingSessions = existingSessions.map((s) =>
        s.id === sessionId ? { ...s, name: newName } : s
      );

      await AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(existingSessions));

      DeviceEventEmitter.emit('sessionUpdated'); // ✅ Emit here too
    } catch (err) {
      console.error('❌ Error renaming session:', err);
    }
  }, []);

  const saveChatMessages = useCallback(async (sessionId, messages) => {
    if (!sessionId) {
      console.warn('⚠️ Tried to save messages with empty sessionId');
      return;
    }

    try {
      await AsyncStorage.setItem(`${CHAT_PREFIX}${sessionId}`, JSON.stringify(messages));
    } catch (err) {
      console.error('❌ Error saving messages:', err);
    }
  }, []);

  const getChatMessages = useCallback(async (sessionId) => {
    if (!sessionId) return [];

    try {
      const stored = await AsyncStorage.getItem(`${CHAT_PREFIX}${sessionId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('❌ Error loading messages:', err);
      return [];
    }
  }, []);

  return {
    sessionList,
    setSessionList, 
    loadSessions,
    saveSession,
    deleteSession,
    renameSession,
    saveChatMessages,
    getChatMessages,
  };
};
