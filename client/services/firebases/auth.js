import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
  } from 'firebase/auth';
  import { auth } from './config';
  
  // Register new user
  export const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  
  // Login existing user
  export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  // Password reset
  export const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  
  // Logout
  export const logout = async () => {
    await auth.signOut();
  };
  
  // Auth state listener
  export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
  };