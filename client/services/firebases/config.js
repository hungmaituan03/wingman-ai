// src/services/firebases/config.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC729Dno_E4me-2NDaipl8Akf-z-K0zSBg",
  authDomain: "wingman-ai-4d85e.firebaseapp.com",
  projectId: "wingman-ai-4d85e",
  storageBucket: "wingman-ai-4d85e.appspot.com",  // ← fix to .appspot.com
  messagingSenderId: "685641076893",
  appId: "1:685641076893:web:84dcdc0d997ec37a010474",
  measurementId: "G-G8B5GQ1BRH",
};

const app = initializeApp(firebaseConfig);

let authInstance = null;
export function getAuthInstance() {
  if (!authInstance) {
    try {
      authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      authInstance = getAuth(app);
    }
  }
  return authInstance;
}

export const db = getFirestore(app);
