// src/screens/AccountScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { getAuthInstance } from '../../services/firebases/config';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import HeaderRow from '../../components/header';
import createAccountScreenStyles from './AccountScreen.styles';

export default function AccountScreen({ navigation }) {
  const { colors, colorScheme, toggleTheme } = useTheme();
  const { user, setUser, signOut } = useAuth();
  const styles = createAccountScreenStyles(colors);

  // form state
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notifications, setNotifications] = useState(true);

  const handleToggleChangePwd = () => {
    if (showChangePwd) {
      // clear fields when hiding
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setShowChangePwd(v => !v);
  };

  const signOutAndRedirect = async () => {
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Loading' }],
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: signOutAndRedirect },
      ],
      { cancelable: true }
    );
  };

  const handleSave = async () => {
    // 1) Validate display name
    if (!displayName.trim()) {
      return Alert.alert('Validation', 'Name cannot be empty.');
    }

    // 2) If changing password, validate passwords
    if (showChangePwd) {
      if (!currentPassword) {
        return Alert.alert('Validation', 'Please enter your current password.');
      }
      if (!newPassword || newPassword.length < 6) {
        return Alert.alert('Validation', 'New password must be at least 6 characters.');
      }
      if (newPassword !== confirmPassword) {
        return Alert.alert('Validation', 'New passwords do not match.');
      }
    }

    try {
      const auth = getAuthInstance();
      const curUser = auth.currentUser;

      // 3) Re-authenticate if changing password
      if (showChangePwd) {
        const cred = EmailAuthProvider.credential(curUser.email, currentPassword);
        await reauthenticateWithCredential(curUser, cred);
      }

      // 4) Update displayName if changed
      if (curUser.displayName !== displayName.trim()) {
        await updateProfile(curUser, { displayName: displayName.trim() });
      }

      // 5) Update password if requested
      if (showChangePwd) {
        await updatePassword(curUser, newPassword);
      }

      // 6) Refresh context user
      setUser({ ...curUser });

      // 7) Clear fields & hide password section
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePwd(false);

      // 8) Notify user
      if (showChangePwd) {
        Alert.alert(
          'Password Changed',
          'Your password was updated. Please log in again.',
          [{ text: 'OK', onPress: signOutAndRedirect }]
        );
      } else {
        Alert.alert('Success', 'Your profile has been updated.');
      }
    } catch (err) {
      console.error('Save error:', err);
      if (err.code === 'auth/wrong-password') {
        return Alert.alert('Authentication Failed', 'Current password is incorrect.');
      }
      if (err.code === 'auth/requires-recent-login') {
        return Alert.alert(
          'Session Expired',
          'Please log out and log back in to change your password.'
        );
      }
      Alert.alert('Error', err.message || 'Could not update profile.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderRow title="Settings" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Display Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Name</Text>
          <View style={styles.inputWrapper}>
            <Icon name="person-outline" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={colors.subtext}
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>
        </View>

        {/* Toggle Change Password */}
        <TouchableOpacity
          style={styles.togglePwdBtn}
          onPress={handleToggleChangePwd}
        >
          <Text style={styles.togglePwdTxt}>
            {showChangePwd ? 'Cancel Password Change' : 'Change Password'}
          </Text>
        </TouchableOpacity>

        {/* Password Fields (conditionally rendered) */}
        {showChangePwd && (
          <>
            {/* Current Password */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Current Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock-closed-outline" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.subtext}
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
              </View>
            </View>

            {/* New Password */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>New Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock-closed-outline" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.subtext}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>
            </View>

            {/* Confirm New Password */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Confirm New Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock-closed-outline" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter new password"
                  placeholderTextColor={colors.subtext}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>
          </>
        )}

        {/* Notifications Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.fieldLabel}>Enable Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor={colors.background}
          />
        </View>

        {/* Dark Mode Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.fieldLabel}>Dark Mode</Text>
          <Switch
            value={colorScheme === 'dark'}
            onValueChange={v => toggleTheme(v ? 'dark' : 'light')}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>

        {/* Save Changes */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutRow}>
            <Icon name="log-out-outline" size={20} color="red" />
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
