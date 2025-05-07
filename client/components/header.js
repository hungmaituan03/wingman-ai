import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

export default function HeaderRow({ title = "Back" }) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  // recreate styles only when theme colors change
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.headerRow}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backIcon}
      >
        <Ionicons
          name="chevron-back"
          size={28}
          color={colors.primary}
        />
      </TouchableOpacity>
      <Text style={styles.header}>{title}</Text>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      backgroundColor: colors.surface,
    },
    backIcon: {
      position: "absolute",
      left: 16,
      padding: 4,
    },
    header: {
      fontSize: 18,
      fontFamily: "Poppins_700Bold",
      color: colors.primary,
      zIndex: 1,
      textShadowColor: colors.border,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
  });
