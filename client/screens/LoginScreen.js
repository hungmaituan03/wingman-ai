import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import colors from '../constants/Colors';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import Lottie from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const loginValidationSchema = yup.object().shape({
  email: yup.string().email('Please enter valid email').required('Email Address is Required'),
  password: yup.string().min(8, ({ min }) => `Password must be at least ${min} characters`).required('Password is required'),
});

const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login would be implemented here');
  };

  const handleFacebookLogin = () => {
    Alert.alert('Facebook Login', 'Facebook login would be implemented here');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.dark.background }]}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={colors.dark.secondary} />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Lottie 
          source={require('../assets/animations/login.json')} 
          autoPlay 
          loop 
          speed={0.5}
          style={styles.image} 
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome back to</Text>
          <Text style={styles.appNameText}>Wingman AI</Text>
        </View>

        <Formik
          validationSchema={loginValidationSchema}
          initialValues={{ email: '', password: '' }}
          onSubmit={values => Alert.alert('Success', JSON.stringify(values))}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor={colors.dark.textSecondary}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.passwordInput}>
                  <TextInput
                    style={[styles.passwordTextInput, { color: colors.dark.text }]}
                    placeholder="Password"
                    placeholderTextColor={colors.dark.textSecondary}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity 
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                    style={styles.eyeIcon}
                  >
                    <Icon 
                      name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'} 
                      size={20} 
                      color={colors.dark.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity 
                style={[styles.loginButton, { backgroundColor: colors.dark.secondary }]}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Log In</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={handleGoogleLogin}
                >
                  <Icon name="logo-google" size={24} color="#DB4437" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={handleFacebookLogin}
                >
                  <Icon name="logo-facebook" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.forgotPasswordButton}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );           
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 50,
  },
  image: {
    height: height * 0.25,
    width: width * 0.7,
    marginBottom: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: colors.dark.secondary,
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.5,
  },
  appNameText: {
    color: colors.dark.secondary,
    fontSize: 36,
    fontFamily: 'Poppins_700Bold',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(110, 68, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    color: colors.dark.text,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(110, 68, 255, 0.3)',
  },
  passwordInput: {
    width: '100%',
    backgroundColor: 'rgba(110, 68, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(110, 68, 255, 0.3)',
  },
  passwordTextInput: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
    shadowColor: colors.dark.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dark.textSecondary,
    opacity: 0.3,
  },
  dividerText: {
    color: colors.dark.textSecondary,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginHorizontal: 10,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: colors.dark.secondary,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: colors.dark.textSecondary,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  signupLink: {
    color: colors.dark.secondary,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  errorText: {
    color: colors.dark.error,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
    marginLeft: 4,
  },
});

export default LoginScreen;