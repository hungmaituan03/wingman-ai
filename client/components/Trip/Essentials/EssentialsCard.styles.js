import { StyleSheet, Platform } from "react-native";

export default function createStyles(colors) {
  return StyleSheet.create({
    /** Card container **/
    card: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginVertical: 8,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
        },
        android: {
          elevation: 3,
        },
      }),
    },

    /** Header row (title + chevron) **/
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },

    /** Card title **/
    cardTitle: {
      flex: 1,
      fontSize: 18,
      fontFamily: "Poppins_700Bold",
      color: colors.text,
    },
  });
}
