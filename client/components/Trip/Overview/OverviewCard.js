import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./OverviewCard.styles";

export default function OverviewCard({ summary }) {
  const [open, setOpen] = useState(true);

  return (
    <View style={styles.card}>
      {/* Header row: title + chevron */}
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setOpen(o => !o)}
      >
        <Text style={styles.cardTitle}>Overview</Text>
        <Ionicons
          name={open ? "chevron-up-outline" : "chevron-down-outline"}
          size={24}
          color="#633e2b"
        />
      </TouchableOpacity>

      {/* Collapsible summary */}
      {open && (
        <Text style={styles.summaryText}>{summary}</Text>
      )}
    </View>
  );
}
