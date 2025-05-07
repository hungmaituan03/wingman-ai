// components/styles/ChatHeader.styles.js
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default colors =>
  StyleSheet.create({
    headerContainer: {
      width,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.backgroundColor,
    },
    backButton: {
      padding: 8,
      zIndex: 2,
    },
    title: {
      position: 'absolute',
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 18,
      fontFamily: Platform.OS === 'ios' ? 'Poppins_700Bold' : 'Poppins-Bold',
      color: colors.primary,                   // themed
      zIndex: 1,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',// subtle shadow for legibility
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    rightControls: {
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 2,
    },
    dropdownWrapper: {
      width: 130,
      marginRight: 4,
    },
    dropdown: {
      height: 30,
      color: colors.textSecondary,
    },
    menuButton: {
      padding: 8,
    },
  });
