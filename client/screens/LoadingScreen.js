import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import colors from '../constants/Colors'; // Make sure to import colors

export default function LoadingScreen({ navigation }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      navigation.reset({
        index: 0,
        routes: [{ name: user ? 'Main' : 'Auth' }]
      });
    }
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.dark.secondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark.background,
  },
});