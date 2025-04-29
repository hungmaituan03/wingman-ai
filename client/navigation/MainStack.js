import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import ChatStack from "./ChatStack";
import TripStack from "./TripStack";

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatStack} />
      <Stack.Screen name="Trip"component={TripStack} />
    </Stack.Navigator>
  );
}
