// components/ChatHeader.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import styles from './styles/ChatHeader.styles';

const ChatHeader = ({ title, onBackPress }) => {
  const navigation = useNavigation();

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Icon name="chevron-back" size={24} color="#6E44FF" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightControls}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Icon name="menu-outline" size={24} color="#6E44FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;
