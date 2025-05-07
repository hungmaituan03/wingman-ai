// src/components/Trip/Header/TripHeader.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/ThemeContext";

const TripHeader = ({ title = "Back" }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.background}]}>
      {/* Back button on the left */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconButton}
      >
        <Icon name="chevron-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={[styles.title, { color: colors.primary }]}>
        {title}
      </Text>

      {/* Drawer button on the right */}
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.iconButton}
      >
        <Icon name="menu-outline" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default TripHeader;
