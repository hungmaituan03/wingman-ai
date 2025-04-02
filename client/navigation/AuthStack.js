import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// import OnBoardingScreen from '../screens/OnBoardingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {/* <Stack.Screen name="Onboarding" component={OnBoardingScreen} /> */}
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name='SignUp' component={SignupScreen} />
        </Stack.Navigator>
    );
};

export default AuthStack;