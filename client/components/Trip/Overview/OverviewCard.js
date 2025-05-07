// src/components/Trip/Overview/OverviewCard.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../context/ThemeContext";
import createOverviewCardStyles from "./OverviewCard.styles";

export default function OverviewCard({ summary }) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(true);
  const styles = createOverviewCardStyles(colors);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setOpen(o => !o)}
      >
        <Text style={styles.cardTitle}>Overview</Text>
        <Ionicons
          name={open ? "chevron-up-outline" : "chevron-down-outline"}
          size={24}
          style={styles.chevron}
        />
      </TouchableOpacity>

      {open && (
        <ScrollView style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            {summary}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}
