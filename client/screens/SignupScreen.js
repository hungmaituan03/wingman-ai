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
  ScrollView  // Added ScrollView import
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import colors from '../constants/Colors';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import Lottie from 'lottie-react-native';
import { register } from '../services/firebases/auth';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const signupValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Please enter valid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password requires at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password requires at least one special character')
    .matches(/[A-Z]/, 'Password requires at least one uppercase letter')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const SignupScreen = () => {
  const navigation = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useAuth();

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular
  });

  const handleSignup = async (values) => {
    setIsSubmitting(true);
    try {
      const userCredential = await register(values.email, values.password);
      // You might want to update the user profile with the name here
      // await updateProfile(userCredential.user, { displayName: values.name });
      setUser(userCredential.user);
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Main'); // Navigate to main app after signup
    } catch (error) {
      let errorMessage = "Signup failed. Please try again.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Email already in use";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email format";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak";
          break;
      }
      Alert.alert('Signup Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.dark.secondary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.dark.secondary} />
        </TouchableOpacity>

        <View style={styles.topContainer}>
          <Lottie 
            source={require('../assets/animations/signup.json')} 
            autoPlay 
            loop 
            style={styles.animation} 
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Wingman AI</Text>
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
                  errors.name && touched.name && styles.inputError
                ]}
                placeholder="Full Name"
                placeholderTextColor={colors.dark.textSecondary}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                returnKeyType="next"
              />
              {errors.name && touched.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  errors.email && touched.email && styles.inputError
                ]}
                placeholder="Email"
                placeholderTextColor={colors.dark.textSecondary}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
              {errors.email && touched.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              <View style={[
                styles.passwordContainer,
                errors.password && touched.password && styles.inputError
              ]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor={colors.dark.textSecondary}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={secureTextEntry}
                  autoCapitalize="none"
                  returnKeyType="next"
                />
                <TouchableOpacity 
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                  style={styles.eyeIcon}
                >
                  <Icon 
                    name={secureTextEntry ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={colors.dark.textSecondary} 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.requirementsContainer}>
                <Text style={[
                  styles.requirementText,
                  values.password?.length >= 8 && styles.requirementMet
                ]}>
                  {values.password?.length >= 8 ? '✓' : '•'} At least 8 characters
                </Text>
                <Text style={[
                  styles.requirementText,
                  /[0-9]/.test(values.password) && styles.requirementMet
                ]}>
                  {/[0-9]/.test(values.password) ? '✓' : '•'} At least 1 number
                </Text>
                <Text style={[
                  styles.requirementText,
                  /[^A-Za-z0-9]/.test(values.password) && styles.requirementMet
                ]}>
                  {/[^A-Za-z0-9]/.test(values.password) ? '✓' : '•'} At least 1 special character
                </Text>
                <Text style={[
                  styles.requirementText,
                  /[A-Z]/.test(values.password) && styles.requirementMet
                ]}>
                  {/[A-Z]/.test(values.password) ? '✓' : '•'} At least 1 uppercase letter
                </Text>
              </View>

              <View style={[
                styles.passwordContainer,
                errors.confirmPassword && touched.confirmPassword && styles.inputError
              ]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm Password"
                  placeholderTextColor={colors.dark.textSecondary}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={confirmSecureTextEntry}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity 
                  onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
                  style={styles.eyeIcon}
                >
                  <Icon 
                    name={confirmSecureTextEntry ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={colors.dark.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.error}>{errors.confirmPassword}</Text>
              )}

              <TouchableOpacity 
                style={[
                  styles.signupButton,
                  isSubmitting && styles.buttonDisabled
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark.background
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 30,
    left: 16,
    zIndex: 1,
  },
  topContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  animation: {
    width: width * 0.4,
    height: width * 0.4,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: colors.dark.text,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  input: {
    backgroundColor: 'rgba(110, 68, 255, 0.1)',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    fontFamily: 'Poppins_400Regular',
    color: colors.dark.text,
    borderWidth: 1,
    borderColor: 'rgba(110, 68, 255, 0.2)',
  },
  inputError: {
    borderColor: colors.dark.error,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(110, 68, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(110, 68, 255, 0.2)',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.dark.text,
  },
  eyeIcon: {
    padding: 4,
  },
  requirementsContainer: {
    marginBottom: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  requirementText: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginVertical: 2,
  },
  requirementMet: {
    color: '#4CAF50',
  },
  error: {
    color: colors.dark.error,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 8,
    marginLeft: 4,
  },
  signupButton: {
    backgroundColor: colors.dark.secondary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  loginText: {
    color: colors.dark.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  loginLink: {
    color: colors.dark.secondary,
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default SignupScreen;