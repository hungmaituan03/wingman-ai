// src/components/Trip/Itinerary/ItineraryCard.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../context/ThemeContext';
import createStyles from './ItineraryCard.styles';
import TripCard from '../Trip/TripCard';

const SECTIONS = [
  { key: 'morning', label: 'Morning' },
  { key: 'afternoon', label: 'Afternoon' },
  { key: 'evening', label: 'Evening' },
];

export default function ItineraryCard({ itinerary = {} }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [openSections, setOpenSections] = useState({
    morning: true,
    afternoon: true,
    evening: true,
  });

  // ensure each segment is at least an array
  const sanitized = {
    morning: Array.isArray(itinerary.morning) ? itinerary.morning : [],
    afternoon: Array.isArray(itinerary.afternoon) ? itinerary.afternoon : [],
    evening: Array.isArray(itinerary.evening) ? itinerary.evening : [],
  };

  const toggleSection = key =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Itinerary</Text>

      {SECTIONS.map(({ key, label }) => {
        const places = sanitized[key];
        const isOpen = openSections[key];

        return (
          <View style={styles.segmentBlock} key={key}>
            <View style={styles.headerRow}>
              <Text style={styles.segmentHeader}>{label}</Text>
              <TouchableOpacity
                onPress={() => toggleSection(key)}
                style={styles.chevronButton}
              >
                <Ionicons
                  name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={20}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            {isOpen && (
              places.length > 0 ? (
                places.map(place => (
                  <TripCard key={place.id ?? place.name} place={place} small />
                ))
              ) : (
                <Text style={styles.emptyText}>
                  No {label.toLowerCase()} stops.
                </Text>
              )
            )}
          </View>
        );
      })}
    </View>
  );
}
