import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';

// Define your color palettes
const lightColors = {
  primary: '#FF6B6B',       // Romantic coral
  secondary: '#4ECDC4',     // Soft teal
  background: '#F7FFF7',    // Very light green
  card: '#FFFFFF',          // White
  text: '#292F36',          // Dark gray
  textSecondary: '#5C6B73', // Medium gray
  border: '#E0E0E0',        // Light gray
  success: '#4CAF50',       // Green
  warning: '#FFC107',       // Amber
  danger: '#F44336',        // Red
  overlay: 'rgba(0,0,0,0.5)',
};

const darkColors = {
  primary: '#FF6B6B',       // Same coral for brand consistency
  secondary: '#4ECDC4',     // Same teal
  background: '#121212',    // Dark background
  card: '#1E1E1E',          // Slightly lighter dark
  text: '#E0E0E0',          // Light text
  textSecondary: '#9E9E9E', // Medium light gray
  border: '#424242',        // Dark gray
  success: '#81C784',       // Light green
  warning: '#FFD54F',       // Light amber
  danger: '#E57373',        // Light red
  overlay: 'rgba(0,0,0,0.8)',
};

// Define spacing and typography (consistent across themes)
const spacing = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

const typography = {
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
  },
};

// Create context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  
  // Toggle between light/dark mode
  const toggleTheme = () => setIsDark(!isDark);
  
  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });
    
    return () => subscription.remove();
  }, []);
  
  // Current theme values
  const theme = {
    colors: isDark ? darkColors : lightColors,
    spacing,
    typography,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy theme access
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};