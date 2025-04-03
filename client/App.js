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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Navigation
import AuthStack from './navigation/AuthStack';
// import AppStack from './navigation/AppStack';
import LoadingScreen from './screens/LoadingScreen';

const RootStack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <NavigationContainer>
            <RootStack.Navigator
              screenOptions={{
                headerShown: false
              }}
            >
              <RootStack.Screen 
                name="Loading" 
                component={LoadingScreen}
                options={{ gestureEnabled: false }}
              />
              <RootStack.Screen 
                name="Auth" 
                component={AuthStack}
              />
              {/* <RootStack.Screen 
                name="Main" 
                component={AppStack}
              /> */}
            </RootStack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;