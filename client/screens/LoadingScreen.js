import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoadingScreen({ navigation }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Navigate to the appropriate screen based on auth state
      navigation.replace(user ? 'Auth' : 'Main');
    }
  }, [user, loading, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 