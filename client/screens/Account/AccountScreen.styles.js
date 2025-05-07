// src/screens/AccountScreen.styles.js

import { StyleSheet } from 'react-native';

export default function createAccountScreenStyles(colors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    container: {
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontFamily: 'Poppins_600SemiBold',
      color: colors.text,
      marginBottom: 24,
    },
    fieldContainer: {
      marginBottom: 20,
    },
    fieldLabel: {
      fontSize: 14,
      fontFamily: 'Poppins_400Regular',
      color: colors.text,
      marginBottom: 8,
    },
    inputWrapper: {
      position: 'relative',
    },
    icon: {
      position: 'absolute',
      left: 12,
      top: 14,
      color: colors.textSecondary,
    },
    input: {
      width: '100%',
      height: 48,
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingLeft: 40,
      paddingRight: 12,
      fontSize: 16,
      fontFamily: 'Poppins_400Regular',
      color: colors.text,
    },
    placeholder: {
      color: colors.subtext,
    },

    // ← NEW: toggle password fields button
    togglePwdBtn: {
      marginVertical: 16,
      alignSelf: 'flex-start',
    },
    togglePwdTxt: {
      fontSize: 14,
      fontFamily: 'Poppins_500Medium',
      color: colors.primary,
    },

    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 32,
    },
    saveButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    saveButtonText: {
      color: colors.background,
      fontSize: 16,
      fontFamily: 'Poppins_600SemiBold',
    },
    logoutButton: {
      marginTop: 32,
      alignSelf: 'center',
    },
    logoutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    logoutText: {
      fontSize: 16,
      color: 'red',
      fontFamily: 'Poppins_500Medium',
    },
  });
}
