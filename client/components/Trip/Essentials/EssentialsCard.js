import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import TripCard from "../Trip/TripCard";
import styles from "./EssentialsCard.styles";

export default function EssentialsCard({ places }) {
  const [open, setOpen] = useState(true);

  return (
    <View style={styles.card}>
      {/* only this headerRow is touchable */}
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setOpen((o) => !o)}
      >
        <Text style={styles.cardTitle}>Essentials</Text>
        <Ionicons
          name={open ? "chevron-up-outline" : "chevron-down-outline"}
          size={24}
          color="#333"
        />
      </TouchableOpacity>

      {open &&
        places.map((place, idx) => (
          <TripCard key={place.id ?? idx} place={place} />
        ))}
    </View>
  );
}
