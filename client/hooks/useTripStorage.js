import { useState, useCallback, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRIP_SESSIONS_KEY = '@trip_sessions';

export function useTripStorage() {
  const [tripList, setTripList] = useState([]);

  // 1. Load all sessions from AsyncStorage
  const loadTrips = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(TRIP_SESSIONS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setTripList(parsed);
    } catch (e) {
      console.error('❌ loadTrips', e);
    }
  }, []);

  // 2. On mount, load trips AND subscribe to your "tripUpdated" event
  useEffect(() => {
    loadTrips();  // initial load

    // 👇 pass the function reference, NOT loadTrips()
    const sub = DeviceEventEmitter.addListener(
      'tripUpdated',
      loadTrips
    );

    return () => sub.remove();
  }, [loadTrips]);

  // 3. Save a new trip: persist, update state, then notify
  const saveTrip = useCallback(async trip => {
    if (!trip.id) return;
    try {
      const raw = await AsyncStorage.getItem(TRIP_SESSIONS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const newArr = [...arr, trip];
      await AsyncStorage.setItem(
        TRIP_SESSIONS_KEY,
        JSON.stringify(newArr)
      );
      setTripList(newArr);
      DeviceEventEmitter.emit('tripUpdated');
    } catch (e) {
      console.error('❌ saveTrip', e);
    }
  }, []);

  // 4. Delete a trip: persist, update state, then notify
  const deleteTrip = useCallback(async id => {
    try {
      const raw = await AsyncStorage.getItem(TRIP_SESSIONS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const newArr = arr.filter(t => t.id !== id);
      await AsyncStorage.setItem(
        TRIP_SESSIONS_KEY,
        JSON.stringify(newArr)
      );
      setTripList(newArr);
      DeviceEventEmitter.emit('tripUpdated');
    } catch (e) {
      console.error('❌ deleteTrip', e);
    }
  }, []);

  return { tripList, saveTrip, deleteTrip };
}
