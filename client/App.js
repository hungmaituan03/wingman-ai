/**
 * AI Dating Assistant - App.js
 * 
 * MAIN APPLICATION ENTRY POINT
 * 
 * Responsibilities:
 * 1. Sets up core navigation structure
 * 2. Initializes global providers
 * 3. Manages screen hierarchy
 * 
 * Navigation Flow:
 * Loading → [Auth Screens] → Main App
 *   • LoadingScreen: Checks auth status
 *   • Auth Screens: Login/Register
 *   • Main App: Home, Chat, Profile, Preferences
 * 
 * Providers:
 *   • SafeAreaProvider: Handles device notches
 *   • ThemeProvider: Manages light/dark mode
 *   • AuthProvider: Handles user authentication
 * 
 * Screen Options:
 *   • Default: hidden headers
 *   • Preferences: visible header
 *   • Loading: disabled back gesture
 */

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './navigation/AuthStack';
// import AppStack from './navigation/AppStack';

function App(){
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}

export default App;