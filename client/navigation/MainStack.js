import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen.js';
import ChatScreen from '../screens/ChatScreen.js'
import MapScreen from "../screens/MapScreen.js";

const Stack = createNativeStackNavigator();

const MainStack = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="MapScreen" component={MapScreen} />
        </Stack.Navigator>
    )
}

export default MainStack;