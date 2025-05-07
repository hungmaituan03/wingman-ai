// src/screens/Trip/TripCard.styles.js

import { StyleSheet, Dimensions, Platform } from "react-native";
const { width } = Dimensions.get("window");
const ICON_CIRCLE_SIZE = 25;

export default function createTripCardStyles(colors) {
  return StyleSheet.create({
    // ─── Layout ───────────────────────────────────────────────────────────────
    safeArea: {
      flex: 1,
      paddingHorizontal: 16,
    },
    scrollView: {
      flex: 1,
      width: "100%",
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 20,
      backgroundColor: colors.background,
    },

    // ─── Card Container ──────────────────────────────────────────────────────
    card: {
      backgroundColor: colors.subcard,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      marginBottom: 20,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },

    // ─── Header Row ─────────────────────────────────────────────────────────
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingRight: ICON_CIRCLE_SIZE + 16,
      marginBottom: 8,
    },
    headerIcons: {
      position: "absolute",
      top: 16,
      right: 16,
      width: ICON_CIRCLE_SIZE,
      height: ICON_CIRCLE_SIZE,
      // backgroundColor removed for transparent icon button
      justifyContent: "center",
      alignItems: "center",
    },

    // ─── Typography ──────────────────────────────────────────────────────────
    cardHeader: {
      flex: 1,
      fontFamily: "Poppins-Bold",
      fontSize: 20,
      color: colors.text,
    },
    addressText: {
      fontFamily: "Poppins-Regular",
      fontSize: 14,
      color: colors.subtext,
      marginBottom: 6,
    },
    ratingText: {
      fontFamily: "Poppins-Regular",
      fontSize: 14,
      color: colors.subtext,
      marginBottom: 6,
    },

    // ─── Tag Row / Pills ─────────────────────────────────────────────────────
    tagRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginVertical: 8,
    },
    tagBox: {
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 8,
    },
    tagBoxText: {
      fontFamily: "Poppins-Medium",
      fontSize: 12,
      color: colors.background,
    },

    // ─── Info‐Bar ────────────────────────────────────────────────────────────
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 12,
    },
    infoBox: {
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.surface,
      paddingVertical: 8,
      marginHorizontal: 4,
      borderRadius: 8,
    },
    infoIcon: {
      marginBottom: 4,
      color: colors.text,
    },
    infoValue: {
      fontFamily: "Poppins-Medium",
      marginTop: 5,
      fontSize: 14,
      color: colors.subtext,
    },

    // ─── Photo Grid ─────────────────────────────────────────────────────────
    photoContainer: {
      marginTop: 12,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    image: {
      width: (width - 64) / 2,
      height: 150,
      borderRadius: 8,
      marginBottom: 10,
    },
  });
}
