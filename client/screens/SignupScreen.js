import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import { register } from '../services/firebases/auth';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const signupValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'At least 8 characters')
    .matches(/[0-9]/, 'One number required')
    .matches(/[^A-Za-z0-9]/, 'One special character required')
    .matches(/[A-Z]/, 'One uppercase letter required')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function SignupScreen() {
  const navigation = useNavigation();
  const { setUser } = useAuth();
  const { colors } = useTheme();

  const [secureEntry, setSecureEntry] = useState(true);
  const [confirmSecureEntry, setConfirmSecureEntry] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>          
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const handleSignup = async (values) => {
    setIsSubmitting(true);
    try {
      const userCred = await register(values.email.trim(), values.password);
      setUser(userCred.user);
      Alert.alert('Success', 'Account created!');
      navigation.replace('Main');
    } catch (err) {
      let msg = 'Signup failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') msg = 'Email already in use';
      else if (err.code === 'auth/invalid-email') msg = 'Invalid email';
      else if (err.code === 'auth/weak-password') msg = 'Password too weak';
      Alert.alert('Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[styles.backButton, { top: Platform.OS === 'ios' ? 24 : 10 }]} 
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.topContainer}>
            <Text style={[styles.title, { color: colors.primary }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>Join Travelion</Text>
          </View>

          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={signupValidationSchema}
            onSubmit={handleSignup}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.formContainer}>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                    errors.name && touched.name && { borderColor: colors.error },
                  ]}
                  placeholder="Full Name"
                  placeholderTextColor={colors.subtext}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                {errors.name && touched.name && (
                  <Text style={[styles.error, { color: colors.error }]}>{errors.name}</Text>
                )}

                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                    errors.email && touched.email && { borderColor: colors.error },
                  ]}
                  placeholder="Email"
                  placeholderTextColor={colors.subtext}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {errors.email && touched.email && (
                  <Text style={[styles.error, { color: colors.error }]}>{errors.email}</Text>
                )}

                <View style={[
                  styles.passwordContainer,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  errors.password && touched.password && { borderColor: colors.error },
                ]}>
                  <TextInput
                    style={[styles.passwordInput, { color: colors.text }]}
                    placeholder="Password"
                    placeholderTextColor={colors.subtext}
                    secureTextEntry={secureEntry}
                    autoCapitalize="none"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                  <TouchableOpacity
                    onPress={() => setSecureEntry(!secureEntry)}
                    style={styles.eyeIcon}
                  >
                    <Icon
                      name={secureEntry ? 'eye-off' : 'eye'}
                      size={20}
                      color={colors.subtext}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.requirementsContainer}>
                  {[
                    { label: 'At least 8 characters', met: values.password.length >= 8 },
                    { label: 'At least 1 number', met: /[0-9]/.test(values.password) },
                    { label: 'At least 1 special char', met: /[^A-Za-z0-9]/.test(values.password) },
                    { label: 'At least 1 uppercase', met: /[A-Z]/.test(values.password) },
                  ].map(({ label, met }) => (
                    <Text
                      key={label}
                      style={[styles.requirementText, met && styles.requirementMet]}
                    >
                      {met ? '✓' : '•'} {label}
                    </Text>
                  ))}
                </View>

                <View style={[
                  styles.passwordContainer,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  errors.confirmPassword && touched.confirmPassword && { borderColor: colors.error },
                ]}>
                  <TextInput
                    style={[styles.passwordInput, { color: colors.text }]}
                    placeholder="Confirm Password"
                    placeholderTextColor={colors.subtext}
                    secureTextEntry={confirmSecureEntry}
                    autoCapitalize="none"
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    onSubmitEditing={handleSubmit}
                  />
                  <TouchableOpacity
                    onPress={() => setConfirmSecureEntry(!confirmSecureEntry)}
                    style={styles.eyeIcon}
                  >
                    <Icon
                      name={confirmSecureEntry ? 'eye-off' : 'eye'}
                      size={20}
                      color={colors.subtext}
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && touched.confirmPassword && (
                  <Text style={[styles.error, { color: colors.error }]}>{errors.confirmPassword}</Text>
                )}

                <TouchableOpacity
                  style={[styles.signupButton, { backgroundColor: colors.primary, opacity: isSubmitting ? 0.7 : 1 }]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={colors.card} />
                  ) : (
                    <Text style={[styles.buttonText, { color: colors.card }]}>Sign Up</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <View style={styles.loginPrompt}>
            <Text style={[styles.loginText, { color: colors.subtext }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { flexGrow: 1, paddingBottom: 40 },
  backButton: { position: 'absolute', left: 16, zIndex: 10 },
  topContainer: { alignItems: 'center', marginTop: 60, marginBottom: 20 },
  title: { fontSize: 24, fontFamily: 'Poppins_700Bold', textAlign: 'center', marginVertical: 4 },
  subtitle: { fontSize: 16, fontFamily: 'Poppins_400Regular', textAlign: 'center' },
  formContainer: { paddingHorizontal: 24, marginTop: 20 },
  input: { borderRadius: 8, borderWidth: 1, padding: 14, marginBottom: 8, fontFamily: 'Poppins_400Regular', fontSize: 16 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, borderWidth: 1, paddingHorizontal: 14, marginBottom: 8 },
  passwordInput: { flex: 1, paddingVertical: 14, fontFamily: 'Poppins_400Regular', fontSize: 16 },
  eyeIcon: { padding: 4 },
  requirementsContainer: { marginVertical: 12, paddingHorizontal: 4 },
  requirementText: { fontSize: 12, fontFamily: 'Poppins_400Regular', marginVertical: 2 },
  requirementMet: { color: '#4CAF50' },
  error: { fontSize: 12, fontFamily: 'Poppins_400Regular', marginBottom: 8, marginLeft: 4 },
  signupButton: { borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  buttonText: { fontFamily: 'Poppins_600SemiBold', fontSize: 16 },
  loginPrompt: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  loginText: { fontFamily: 'Poppins_400Regular', fontSize: 14 },
  loginLink: { fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
});
