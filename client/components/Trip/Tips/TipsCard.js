import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./TipsCard.styles";

export default function TipsCard({ tips }) {
  const [open, setOpen] = useState(true);

  return (
    <View style={styles.card}>
      {/* header with chevron */}
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setOpen(o => !o)}
      >
        <Text style={styles.cardTitle}>Travel Tips</Text>
        <Ionicons
          name={open ? "chevron-up-outline" : "chevron-down-outline"}
          size={24}
          color="#333"
        />
      </TouchableOpacity>

      {/* tips list */}
      {open && tips.map((tip, i) => (
        <Text key={i} style={styles.tipText}>
          • {tip}
        </Text>
      ))}
    </View>
  );
}
