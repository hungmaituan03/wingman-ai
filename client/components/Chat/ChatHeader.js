// components/ChatHeader.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from './styles/ChatHeader.styles';

const ChatHeader = ({ title, onBackPress }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Icon name="chevron-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightControls}>
        <TouchableOpacity style={styles.menuButton} onPress={navigation.openDrawer}>
          <Icon name="menu-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;
