import { useState, useCallback, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@trip_sessions';

export function useTripStorage() {
  const [tripList, setTripList] = useState([]);

  const loadTrips = useCallback(async () => {
    const raw = await AsyncStorage.getItem(KEY);
    setTripList(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => {
    loadTrips();
    const sub = DeviceEventEmitter.addListener('tripUpdated', loadTrips);
    return () => sub.remove();
  }, [loadTrips]);

  const saveTrip = useCallback(async trip => {
    if (!trip.id) return;
    const raw = await AsyncStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const next = [...arr, trip];
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    DeviceEventEmitter.emit('tripUpdated');
  }, []);

  const deleteTrip = useCallback(async id => {
    const raw = await AsyncStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const next = arr.filter(t => t.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    DeviceEventEmitter.emit('tripUpdated');
  }, []);

  return { tripList, saveTrip, deleteTrip };
}
