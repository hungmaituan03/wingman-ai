import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import debounce from 'lodash.debounce';
import { Colours } from '../constants/Colours';

export default function LocationAutocomplete({
  value,
  onChangeText,
  onSelect,
  placeholder = 'Enter location',
  endpoint,
  debounceTime = 300,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Create a debounced fetch function
  const fetchSuggestions = useCallback(
    debounce(async query => {
      if (!query) {
        setSuggestions([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${endpoint}?query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Autocomplete error:', err);
      } finally {
        setLoading(false);
      }
    }, debounceTime),
    [endpoint, debounceTime]
  );

  // 2. Wrap the parent callback so we can fetch at the same time
  const handleChangeText = txt => {
    onChangeText(txt);
    fetchSuggestions(txt);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#b67340"
        onChangeText={handleChangeText}
      />

      {loading && <ActivityIndicator size="small" style={styles.loader} />}

      {suggestions.length > 0 && (
        <View style={styles.listInFlow}>
          {suggestions.map(item => (
            <TouchableOpacity
              key={item.place_id}
              style={styles.item}
              onPress={() => {
                onSelect(item);
                setSuggestions([]);  // clear list on selection
              }}
            >
              <Text style={styles.itemText}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },

  input: {
    backgroundColor: "white",
    color: Colours[950],
    borderRadius: 20,
    height: 44,
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colours[100],
    fontFamily: "Poppins_400Regular",
  },

  loader: { position: 'absolute', right: 12, top: 12 },

  listInFlow: {
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colours[100],
    marginTop: 4,
    marginBottom: 12,
    zIndex: 10,
    overflow: 'hidden',
    ...Platform.select({ android: { elevation: 4 } }),
  },

  item: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colours[100],
  },

  itemText: {
    fontSize: 16,
    color: Colours[950],
    fontFamily: "Poppins_400Regular",
  },
});

