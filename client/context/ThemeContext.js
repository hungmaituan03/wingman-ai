import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define light and dark palettes with improved contrast
const lightColors = {
  primary:        '#005BB5',   // Darkened blue
  secondary:      '#2E7D32',   // Darkened green
  accent:         '#D32F2F',
  background:     '#F5F5F5',
  surface:        '#FFFFFF',   // Base surface (e.g. screens, large cards)
  card:           '#FFFFFF',   // Main card color
  subcard:        '#F0F0F5',   // Nested cards, panels, list items
  overlay:        'rgba(0,0,0,0.5)',
  text:           '#212121',
  subtext:        '#6E6E6E',
  border:         '#BDBDBD',
  inputBackground:'#FFFFFF',
  mapMarker:      '#D32F2F',
  routeLine:      '#005BB5',
  success:        '#388E3C',
  error:          '#D32F2F',
  warning:        '#FFA000',
};

const darkColors = {
  primary:        '#90CAF9',
  secondary:      '#81C784',
  accent:         '#FFCA28',
  background:     '#121212',
  surface:        '#1E1E1E',   // Base surface
  card:           '#1E1E1E',   // Main card
  subcard:        '#55555F',   // Nested cards
  overlay:        'rgba(0,0,0,0.7)',
  text:           '#E0E0E0',
  subtext:        '#BDBDBD',
  border:         '#424242',
  inputBackground:'#1E1E1E',
  mapMarker:      '#E57373',
  routeLine:      '#90CAF9',
  success:        '#81C784',
  error:          '#E57373',
  warning:        '#FFB300',
};

// Shared spacing & typography tokens
const spacing = { small: 8, medium: 16, large: 24, xlarge: 32 };
const typography = {
  header:  { fontSize: 24, fontWeight: 'bold' },
  title:   { fontSize: 20, fontWeight: '600' },
  body:    { fontSize: 16 },
  caption: { fontSize: 12 },
};

const ThemeContext = createContext();
const STORAGE_KEY = 'user-color-scheme';

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [userScheme, setUserScheme] = useState(null);
  const [systemPreference, setSystemPreference] = useState(systemScheme);

  // Load persisted user theme preference
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        setUserScheme(saved);
      }
    })();
  }, []);

  // Listen to system color scheme changes
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemPreference(colorScheme);
    });
    return () => sub.remove();
  }, []);

  // Toggle and persist user override
  const toggleTheme = async (mode) => {
    await AsyncStorage.setItem(STORAGE_KEY, mode);
    setUserScheme(mode);
  };

  // Determine active scheme
  const colorScheme = userScheme || systemPreference;
  const isDark = colorScheme === 'dark';

  // Memoize theme object
  const theme = useMemo(() => ({
    colors: isDark ? darkColors : lightColors,
    spacing,
    typography,
    isDark,
    colorScheme,
    toggleTheme,
  }), [isDark, colorScheme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
