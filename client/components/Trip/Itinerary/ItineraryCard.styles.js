// src/screens/Trip/Itinerary/ItineraryCard.styles.js
import { StyleSheet } from "react-native";

export default function createItineraryCardStyles(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.subcard,
      borderRadius: 8,
      marginVertical: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    cardTitle: {
      fontSize: 18,
      fontFamily: "Poppins_600SemiBold",
      color: colors.text,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      flexWrap: "wrap",
      flexShrink: 1,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    chevronButton: {
      padding: 4,
    },
    segmentBlock: {
      backgroundColor: colors.surface,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      marginBottom: 16,
      padding: 10,
      borderRadius: 8,
    },
    segmentHeader: {
      flex: 1,
      fontSize: 16,
      fontFamily: "Poppins_600SemiBold",
      color: colors.text,
      flexWrap: "wrap",
      flexShrink: 1,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: colors.text,
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontStyle: "italic",
      flexWrap: "wrap",
    },
  });
}
