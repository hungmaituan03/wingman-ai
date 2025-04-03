import React, { useState, useContext } from 'react';
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
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import colors from '../constants/Colors';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import Lottie from 'lottie-react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebases/config';
import { AuthContext } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const loginValidationSchema = yup.object().shape({
  email: yup.string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
  password: yup.string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useContext(AuthContext);

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular
  });

  const handleLogin = async (values) => {
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      setUser(userCredential.user);
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email format";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many attempts. Try again later or reset your password";
          break;
      }
      Alert.alert('Login Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert(
      'Coming Soon', 
      'Google login will be available in our next update!',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
  };

  const handleFacebookLogin = () => {
    Alert.alert(
      'Coming Soon', 
      'Facebook login will be available in our next update!',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
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
          style={styles.animation} 
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome back to</Text>
          <Text style={styles.appName}>Wingman AI</Text>
        </View>

        <Formik
          validationSchema={loginValidationSchema}
          initialValues={{ email: '', password: '' }}
          onSubmit={handleLogin}
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
                    style={styles.passwordTextInput}
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
                style={[
                  styles.loginButton,
                  isSubmitting && styles.loginButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>Log In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={handleGoogleLogin}
                >
                  <Icon name="logo-google" size={24} color="#DB4437" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={handleFacebookLogin}
                >
                  <Icon name="logo-facebook" size={24} color="#3b5998" />
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
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 50,
  },
  animation: {
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
  appName: {
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(110, 68, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(110, 68, 255, 0.3)',
  },
  passwordTextInput: {
    flex: 1,
    color: colors.dark.text,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    width: '100%',
    backgroundColor: colors.dark.secondary,
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
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
    marginBottom: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: colors.dark.secondary,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
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
  },
  signupLink: {
    color: colors.dark.secondary,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
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