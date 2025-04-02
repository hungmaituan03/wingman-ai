import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import colors from '../constants/Colors'
import { useFonts, Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';


const { width } = Dimensions.get('window');


const LoginScreen = () => {
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
                <Text style={styles.userName}>userName</Text>
                <Text style={styles.password}>password</Text>
            </View>
        </View>
    );           
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

})

export default LoginScreen;