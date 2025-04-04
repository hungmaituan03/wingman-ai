import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { logout } from '../services/firebases/auth'; // Import your Firebase logout function

const HomeScreen = ({ navigation }) => {
  const { user, setUser } = useAuth(); // Get user and setUser from AuthContext

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const handleLogout = async () => {
    try {
      await logout(); // Call Firebase logout
      setUser(null); // Update context to remove user
      
      // Optional: Show confirmation message
      Alert.alert(
        'Logged Out',
        'You have been successfully logged out.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
      
      // Navigation will be handled by your auth flow (likely in LoadingScreen)
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert(
        'Logout Error',
        error.message || 'Failed to log out. Please try again.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appName}>Wingman AI</Text>
        <Text style={styles.userGreeting}>Hello, {displayName}!</Text>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Icon name="log-out-outline" size={20} color={colors.dark.text} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.dark.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    welcomeContainer: {
      alignItems: 'center',
      padding: 30,
      backgroundColor: colors.dark.card,
      borderRadius: 20,
      width: '80%',
    },
    welcomeText: {
      color: colors.dark.textSecondary,
      fontSize: 18,
      marginBottom: 5,
    },
    appName: {
      color: colors.dark.primary,
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    userGreeting: {
      color: colors.dark.text,
      fontSize: 24,
      fontWeight: '600',
    },
});

export default HomeScreen;