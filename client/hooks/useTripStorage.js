import { useState, useCallback, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRIP_SESSIONS_KEY = '@trip_sessions';

export function useTripStorage() {
  const [tripList, setTripList] = useState([]);

  const loadTrips = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(TRIP_SESSIONS_KEY);
      setTripList(raw ? JSON.parse(raw) : []);
    } catch (e) {
      console.error('❌ loadTrips', e);
    }
  }, []);

  useEffect(() => {
    loadTrips();
    const sub = DeviceEventEmitter.addListener('tripUpdated', loadTrips);
    return () => sub.remove();
  }, [loadTrips]);

  const saveTrip = useCallback(async trip => {
    if (!trip.id) return;
    try {
      const raw = await AsyncStorage.getItem(TRIP_SESSIONS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const newArr = [...arr, trip];
      await AsyncStorage.setItem(TRIP_SESSIONS_KEY, JSON.stringify(newArr));
      DeviceEventEmitter.emit('tripUpdated');
    } catch (e) {
      console.error('❌ saveTrip', e);
    }
  }, []);

  const deleteTrip = useCallback(async id => {
    try {
      const raw = await AsyncStorage.getItem(TRIP_SESSIONS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const newArr = arr.filter(t => t.id !== id);
      await AsyncStorage.setItem(TRIP_SESSIONS_KEY, JSON.stringify(newArr));
      DeviceEventEmitter.emit('tripUpdated');
    } catch (e) {
      console.error('❌ deleteTrip', e);
    }
  }, []);

  const renameTrip = useCallback(async (id, newName) => {
    try {
      const raw = await AsyncStorage.getItem(TRIP_SESSIONS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const newArr = arr.map(t =>
        t.id === id
          ? { ...t, name: newName }
          : t
      );
      await AsyncStorage.setItem(TRIP_SESSIONS_KEY, JSON.stringify(newArr));
      DeviceEventEmitter.emit('tripUpdated');
    } catch (e) {
      console.error('❌ renameTrip', e);
    }
  }, []);

  return { tripList, saveTrip, deleteTrip, renameTrip };
}
