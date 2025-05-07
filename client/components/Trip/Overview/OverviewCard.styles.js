// src/components/Trip/Overview/OverviewCard.styles.js
import { StyleSheet } from "react-native";

export default function createOverviewCardStyles(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
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
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    cardTitle: {
      flex: 1,
      flexWrap: "wrap",
      fontSize: 18,
      fontFamily: "Poppins_600SemiBold",
      color: colors.text,
    },
    chevron: {
      marginLeft: 8,
      color: colors.text,
    },
    summaryContainer: {
      maxHeight: 200,         // limit the height
      paddingVertical: 8,
    },
    summaryText: {
      flexWrap: "wrap",
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: colors.subtext,
      lineHeight: 20,
    },
  });
}
