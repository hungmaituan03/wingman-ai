// src/components/Trip/Header/TripDrawer.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colours } from '../../../constants/Colours';

const MAX_LABEL_LENGTH = 20;
function truncate(str = '', len = MAX_LABEL_LENGTH) {
  return str.length > len ? str.slice(0, len - 1) + '…' : str;
}

export default function TripDrawer({
  tripHistory = [],
  onSelectTrip,   // { view: true, trip } or { delete: true, id }
  onNewTrip,
}) {
  const [filter, setFilter] = useState('');

  const filtered = tripHistory
    .map(t => ({
      ...t,
      label: truncate(
        t.summary?.split('.')[0] ||
        t.general_places?.[0]?.name ||
        t.id
      ),
    }))
    .filter(t => t.label.toLowerCase().includes(filter.toLowerCase()));

  return (
    <View style={styles.container}>
      {/* Search + New-Trip row */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search trips…"
          placeholderTextColor="#888"
          value={filter}
          onChangeText={setFilter}
        />
        <TouchableOpacity onPress={onNewTrip}>
          <Icon name="add-circle-outline" size={30} color={Colours[900]} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Previous Trips</Text>

      {filtered.length === 0 ? (
        <Text style={styles.empty}>No trips saved.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() =>
                    onSelectTrip({ delete: true, id: item.id })
                  }
                >
                  <Icon name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                style={styles.item}
                activeOpacity={0.7}
                onPress={() =>
                  onSelectTrip({ view: true, trip: item })
                }
              >
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colours[50],
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colours[200],
    paddingHorizontal: 8,
    marginRight: 8,
    color: Colours[900],
    fontFamily: 'Poppins_400Regular',
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    color: Colours[800],
    marginBottom: 8,
  },
  empty: {
    color: Colours[600],
    fontFamily: 'Poppins_400Regular',
  },
  item: {
    paddingVertical: 12,
  },
  itemText: {
    fontFamily: 'Poppins_400Regular',
    color: Colours[900],
  },
  deleteBtn: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
  },
});
