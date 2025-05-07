import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
  });
  if (!fontsLoaded) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.contentContainer}>
        {/* App name & intro */}
        <View style={styles.textContainer}>
          <Text style={[styles.appNameText, { color: colors.primary }]}>
            Travelion
          </Text>
          <Text style={[styles.introText, { color: colors.subtext }]}>
            Plan, explore, and share your journeys with Travelion’s AI-powered trip planner.
          </Text>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('LoginScreen')}
            activeOpacity={0.8}
          >
            <Text style={[styles.primaryButtonText, { color: colors.background }]}>
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { borderColor: colors.primary },
            ]}
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  animation: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 32,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  appNameText: {
    fontSize: 36,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 1,
  },
  introText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },
  buttonGroup: {
    width: '100%',
    paddingHorizontal: 16,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  primaryButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
  },
});
