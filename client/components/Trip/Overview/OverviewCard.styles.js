import { StyleSheet } from "react-native";
import { Colours } from "../../../constants/Colours";

export default StyleSheet.create({
  card: {
    backgroundColor: Colours[200],
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
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: Colours[900],
  },

  chevron: {
    color: Colours[600],
  },

  summaryText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "black",
    lineHeight: 20,
  },
});
