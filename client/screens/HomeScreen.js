import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { logout } from '../services/firebases/auth';

const HomeScreen = ({ navigation }) => {
  const { user, setUser } = useAuth();

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigation.navigate('Loading');
      Alert.alert(
        'Logged Out',
        'You have been successfully logged out.',
        [{ text: 'OK' }]
      );
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
      <View style={styles.mainContent}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>WELCOME TO</Text>
          <Text style={styles.appName}>TRAVELION</Text>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Hello,</Text>
            <Text style={styles.userName}>{displayName}!</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Icon name="log-out-outline" size={20} color={colors.dark.secondary} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Floating Rounded Icon Navigation Bar */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <View style={[styles.bubble, styles.activeBubble]}>
              <Icon name="home" size={26} color={colors.dark.secondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Chat', {
              screen: 'ChatMain',
              params: {
                screen: 'ChatScreen',
                params: { newChat: true }, // ← explicitly pass newChat flag
              },
            })}
          >
            <View style={styles.bubble}>
              <Icon name="chatbubble-ellipses" size={26} color={colors.dark.textSecondary} />
            </View>
          </TouchableOpacity>


          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Event')}
          >
            <View style={styles.bubble}>
              <Icon name="today" size={26} color={colors.dark.textSecondary} />
            </View>
          </TouchableOpacity>
        
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Map')}
          >
            <View style={styles.bubble}>
              <Icon name="map" size={26} color={colors.dark.textSecondary} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Account')}
          >
            <View style={styles.bubble}>
              <Icon name="person" size={26} color={colors.dark.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 90,
  },
  welcomeContainer: {
    alignItems: 'center',
    width: '90%',
  },
  welcomeText: {
    color: colors.dark.secondary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  appName: {
    color: colors.dark.secondary,
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 30,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(110, 68, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  greetingText: {
    color: colors.dark.textSecondary,
    fontSize: 24,
    fontWeight: '300',
    marginBottom: -8,
  },
  userName: {
    color: colors.dark.secondary,
    fontSize: 32,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(110, 68, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(110, 68, 255, 0.3)',
  },
  logoutText: {
    color: colors.dark.secondary,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  // Floating Rounded Navigation Bar
  bottomNavContainer: {
    position: 'absolute',
    bottom: 25,
    left: '10%',
    right: '10%',
    backgroundColor: colors.dark.card,
    borderRadius: 30,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(110, 68, 255, 0.15)',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    alignItems: 'center',
  },
  bubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBubble: {
    backgroundColor: 'rgba(110, 68, 255, 0.2)',
    transform: [{ scale: 1.1 }],
  },
});

export default HomeScreen;