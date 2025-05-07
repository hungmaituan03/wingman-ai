// src/screens/Trip/BudgetCard.js

import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../context/ThemeContext";
import { getCurrencySymbol } from "../../../utils/currency";

// Static imports for Metro bundler
import iconAccommodation from "../../../assets/icons/accomodation.png";
import iconTransport     from "../../../assets/icons/transport.png";
import iconFood          from "../../../assets/icons/food.png";
import iconActivities    from "../../../assets/icons/activities.png";

export default function BudgetCard({ budget }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [open, setOpen] = useState(true);
  const { total_per_person, currency, breakdown } = budget;
  const symbol = getCurrencySymbol(currency);

  // Prepare each line with its icon and label
  const lines = [
    { label: "Accommodation", amount: breakdown.accommodation, icon: iconAccommodation },
    { label: "Transport",     amount: breakdown.transport,     icon: iconTransport },
    { label: "Food",          amount: breakdown.food,          icon: iconFood },
    { label: "Activities",    amount: breakdown.activities,    icon: iconActivities },
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setOpen((o) => !o)}
      >
        <Text style={styles.cardTitle} numberOfLines={2}>
          Budget: {symbol} {total_per_person}
        </Text>
        <Ionicons
          name={open ? "chevron-up-outline" : "chevron-down-outline"}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>

      {/* Breakdown */}
      {open &&
        lines.map(({ label, amount, icon }) => (
          <View style={styles.cardRow} key={label}>
            <Image style={styles.icon} source={icon} />
            <Text style={styles.line}>
              {label}: {symbol} {amount}
            </Text>
          </View>
        ))}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginVertical: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    cardTitle: {
      flex: 1,
      marginRight: 8,
      fontSize: 18,
      fontFamily: "Poppins_600SemiBold",
      color: colors.text,
      flexWrap: "wrap",
    },
    cardRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 8,
      tintColor: colors.primary,
    },
    line: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: colors.text,
      flexWrap: "wrap",
    },
  });
