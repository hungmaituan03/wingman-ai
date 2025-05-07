import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../context/ThemeContext";
import TripCard from "../Trip/TripCard";
import createStyles from "./EssentialsCard.styles";

export default function EssentialsCard({ places }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [open, setOpen] = useState(true);

  return (
    <View style={styles.card}>
      {/* Header row: only this is touchable */}
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setOpen(o => !o)}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Essentials
        </Text>
        <Ionicons
          name={open ? "chevron-up-outline" : "chevron-down-outline"}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>

      {open && places.map((place, idx) => (
        <TripCard
          key={place.id ?? idx}
          place={place}
        />
      ))}
    </View>
  );
}
