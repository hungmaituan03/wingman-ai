import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';
import Lottie from 'lottie-react-native';
import colors from '../constants/Colors';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
    const navigation = useNavigation();

    let [fontsLoaded] = useFonts({
        Poppins_700Bold,
        Poppins_600SemiBold
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Lottie 
                    source={require('../assets/animations/Texting.json')} 
                    autoPlay 
                    loop 
                    speed={0.3} 
                    style={styles.animation} 
                />

                <View style={styles.textContainer}>
                    <Text style={styles.welcomeText}>Welcome to</Text>
                    <Text style={styles.appNameText}>Wingman AI</Text>
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.primaryButtonText}>Log In</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>Sign Up</Text>
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
    contentContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    animation: {
        width: width * 0.8,
        height: width * 0.8,
        marginBottom: 8,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    welcomeText: {
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
    buttonGroup: {
        width: '100%',
    },
    primaryButton: {
        width: '100%',
        backgroundColor: colors.dark.secondary,
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 3,
    },
    secondaryButton: {
        width: '100%',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.dark.secondary,
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
    },
    secondaryButtonText: {
        color: colors.dark.secondary,
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
    },
});

export default WelcomeScreen;