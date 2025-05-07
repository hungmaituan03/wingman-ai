// src/utils/apiQuota.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DAILY_TRIP_LIMIT = 10;
export const DAILY_CHAT_LIMIT = 20;

// existing trip‐quota helper
export async function canCallTripApi() {
  const key = 'API_USAGE_TRIP';
  const today = new Date().toISOString().slice(0,10);
  const raw = await AsyncStorage.getItem(key);
  let usage = raw ? JSON.parse(raw) : { date: today, count: 0 };

  if (usage.date !== today) {
    usage = { date: today, count: 1 };
  } else if (usage.count < DAILY_TRIP_LIMIT) {
    usage.count += 1;
  } else {
    return false;
  }

  await AsyncStorage.setItem(key, JSON.stringify(usage));
  return true;
}

// **new** chat‐quota helper
export async function canCallChatApi() {
  const key = 'API_USAGE_CHAT';
  const today = new Date().toISOString().slice(0,10);
  const raw = await AsyncStorage.getItem(key);
  let usage = raw ? JSON.parse(raw) : { date: today, count: 0 };

  if (usage.date !== today) {
    usage = { date: today, count: 1 };
  } else if (usage.count < DAILY_CHAT_LIMIT) {
    usage.count += 1;
  } else {
    return false;
  }

  await AsyncStorage.setItem(key, JSON.stringify(usage));
  return true;
}
