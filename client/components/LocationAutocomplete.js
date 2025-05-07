// src/components/LocationAutocomplete.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

export default function LocationAutocomplete({
  value,
  onChangeText,
  onSelect,
  placeholder = 'Enter location',
  endpoint,
  debounceTime = 300,
  minLength = 3,
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const didMountRef = useRef(false);

  // Sync internal state to parent
  useEffect(() => {
    if (searchTerm !== value) {
      onChangeText(searchTerm);
    }
  }, [searchTerm]);

  // Debounced suggestion fetching
  useEffect(() => {
    // Avoid firing on first render
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (searchTerm.trim().length < minLength) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${endpoint}?query=${encodeURIComponent(searchTerm)}`
        );
        if (!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Autocomplete error:', err);
      } finally {
        setLoading(false);
      }
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [searchTerm, endpoint, debounceTime, minLength]);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{placeholder}</Text>
      <View style={styles.inputWithIcon}>
        <Ionicons
          name="location-outline"
          size={20}
          color={colors.subtext}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={searchTerm}
          placeholder=""
          placeholderTextColor={colors.subtext}
          onChangeText={setSearchTerm}
          onBlur={Keyboard.dismiss}
        />
        {loading && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={styles.loader}
          />
        )}
      </View>

      {suggestions.length > 0 && (
        <View style={styles.listInFlow}>
          {suggestions.map(item => (
            <TouchableOpacity
              key={item.place_id}
              style={styles.item}
              onPress={() => {
                onSelect(item);
                setSearchTerm(item.description);
                setSuggestions([]);
              }}
            >
              <Text style={[styles.itemText, { color: colors.text }]}>
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const createStyles = colors =>
  StyleSheet.create({
    fieldContainer: {
      marginBottom: 16,
      width: '100%',
    },
    fieldLabel: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
      marginBottom: 4,
      fontFamily: 'Poppins_400Regular',
    },
    inputWithIcon: {
      position: 'relative',
    },
    icon: {
      position: 'absolute',
      top: 15,
      left: 12,
      zIndex: 1,
    },
    input: {
      height: 50,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 40,
      fontSize: 16,
      fontFamily: 'Poppins_400Regular',
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      color: colors.text,
    },
    loader: {
      position: 'absolute',
      right: 12,
      top: 15,
    },
    listInFlow: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 4,
      marginBottom: 12,
      overflow: 'hidden',
      ...Platform.select({
        android: { elevation: 4 },
        ios: {
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
        },
      }),
    },
    item: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    itemText: {
      fontSize: 16,
      fontFamily: 'Poppins_400Regular',
    },
  });
