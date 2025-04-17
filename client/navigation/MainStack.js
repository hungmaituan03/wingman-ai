import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../screens/HomeScreen';
import ChatStack from './ChatStack'; // ✅ Import from your new file!

const Drawer = createDrawerNavigator();

const MainStack = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Chat" component={ChatStack} />
    </Drawer.Navigator>
  );
};

export default MainStack;
