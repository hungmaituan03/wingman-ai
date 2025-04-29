// src/screens/Trip/BudgetCard.js

import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getCurrencySymbol, getCurrencyIconName } from "../../../utils/currency";
import styles from "./BudgetCard.styles";

export default function BudgetCard({ budget }) {
  const [open, setOpen] = useState(true);
  const { total_per_person, currency, breakdown } = budget;

  const symbol = getCurrencySymbol(currency);
  const iconName = getCurrencyIconName(currency);

  return (
    <View style={styles.card}>
      {/* Header row: title + chevron */}
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setOpen((o) => !o)}
      >
        <Text style={styles.cardTitle}>
          Budget: {symbol} {total_per_person}
        </Text>
        <Ionicons
          name={open ? "chevron-up-outline" : "chevron-down-outline"}
          size={24}
          color="#633e2b"
        />
      </TouchableOpacity>

      {/* Collapsible breakdown */}
      {open && (
        <View>
          <View style={styles.cardRow}>
            <Image
              style={styles.icon}
              source={require("../../../assets/icons/accomodation.png")}
            />
            <Text style={styles.line}>
              Accommodation: {symbol} {breakdown.accommodation}
            </Text>
          </View>

          <View style={styles.cardRow}>
            <Image
              style={styles.icon}
              source={require("../../../assets/icons/transport.png")}
            />
            <Text style={styles.line}>
              Transport: {symbol} {breakdown.transport}
            </Text>
          </View>

          <View style={styles.cardRow}>
            <Image
              style={styles.icon}
              source={require("../../../assets/icons/food.png")}
            />
            <Text style={styles.line}>
              Food: {symbol} {breakdown.food}
            </Text>
          </View>

          <View style={styles.cardRow}>
            <Image
              style={styles.icon}
              source={require("../../../assets/icons/activities.png")}
            />
            <Text style={styles.line}>
              Activities: {symbol} {breakdown.activities}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
