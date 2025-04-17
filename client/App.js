import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Navigation
import AuthStack from './navigation/AuthStack';
import MainStack from './navigation/MainStack';
import LoadingScreen from './screens/LoadingScreen';

const RootStack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                <RootStack.Screen 
                  name="Main" 
                  component={MainStack}
                />
              </RootStack.Navigator>
            </NavigationContainer>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
 

export default App;