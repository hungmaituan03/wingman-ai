import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TripCard from '../Trip/TripCard';
import styles from './ItineraryCard.styles';

const SECTIONS = [
  { key: 'morning', label: 'Morning' },
  { key: 'afternoon', label: 'Afternoon' },
  { key: 'evening', label: 'Evening' },
];

export default function ItineraryCard({ itinerary = {} }) {
  // ensure each segment is at least an empty array
  const sanitized = {
    morning: Array.isArray(itinerary.morning) ? itinerary.morning : [],
    afternoon: Array.isArray(itinerary.afternoon) ? itinerary.afternoon : [],
    evening: Array.isArray(itinerary.evening) ? itinerary.evening : [],
  };

  // all sections open by default
  const [openSections, setOpenSections] = useState({
    morning: true,
    afternoon: true,
    evening: true,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

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
                  color="#333"
                />
              </TouchableOpacity>
            </View>

            {isOpen && (
              places.length > 0
                ? places.map((place) => (
                    <TripCard key={place.id} place={place} small />
                  ))
                : <Text style={styles.emptyText}>
                    No {label.toLowerCase()} stops.
                  </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}