import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

import { useTheme } from '../context/ThemeContext';
import { login } from '../services/firebases/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { signOut } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // load fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });
  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const userCred = await login(email.trim(), password);
      Alert.alert('Login Successful', `Welcome back, ${userCred.user.email}!`);
      navigation.replace('Loading');
    } catch (err) {
      console.error('Login error', err);
      Alert.alert('Login Failed', err.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {/* Go Back Button */}
      <TouchableOpacity
        style={[styles.goBack, { top: Platform.OS === 'ios' ? 50 : 30 }]}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-back-outline" size={24} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.inner}>
        <Text style={[styles.title, { color: colors.primary }]}>Welcome Back</Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Email"
          placeholderTextColor={colors.subtext}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Password"
          placeholderTextColor={colors.subtext}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
          disabled={submitting}
        >
          {submitting
            ? <ActivityIndicator color={colors.card} />
            : <Text style={[styles.buttonText, { color: colors.card }]}>Log In</Text>
          }
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.subtext }]}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={[styles.linkText, { color: colors.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    position: 'relative',
  },
  inner: {
    width: '100%',
  },
  goBack: {
    position: 'absolute',
    left: 16,
    padding: 8,
    zIndex: 10,
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginRight: 4,
  },
  linkText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
});
