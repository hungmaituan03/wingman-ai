import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getAuthInstance } from './config';

// Register a new user
export const register = (email, pass) =>
  createUserWithEmailAndPassword(getAuthInstance(), email, pass);

// Sign in
export const login = (email, pass) =>
  signInWithEmailAndPassword(getAuthInstance(), email, pass);

// Send a password reset email
export const resetPassword = (email) =>
  sendPasswordResetEmail(getAuthInstance(), email);

// Sign out
export const logout = () =>
  firebaseSignOut(getAuthInstance());

// Listen for auth state changes
export const onAuthStateChangedListener = (cb) =>
  onAuthStateChanged(getAuthInstance(), cb);
