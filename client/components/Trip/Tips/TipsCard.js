// src/components/Trip/Tips/TipsCard.js

import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../context/ThemeContext";
import createTipsCardStyles from "./TipsCard.styles";

export default function TipsCard({ tips = [] }) {
  const { colors } = useTheme();
  const styles = createTipsCardStyles(colors);
  const [open, setOpen] = useState(true);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setOpen(o => !o)}
      >
        <Text style={styles.cardTitle}>Travel Tips</Text>
        <Ionicons
          name={open ? "chevron-up-outline" : "chevron-down-outline"}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>

      {open && tips.map((tip, i) => (
        <Text key={i} style={styles.tipText}>
          • {tip}
        </Text>
      ))}
    </View>
  );
}
