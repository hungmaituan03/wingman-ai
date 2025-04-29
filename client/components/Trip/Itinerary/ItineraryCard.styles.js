// src/components/Trip/Itinerary/ItineraryCard.styles.js
import { StyleSheet } from "react-native";
import { Colours } from "../../../constants/Colours";

export default StyleSheet.create({
  card: {
    backgroundColor: Colours[200],
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
    color: Colours[900],
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
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
    backgroundColor: Colours[300],
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: 16,
    padding: 10,
    borderRadius: 8,
  },
  segmentHeader: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: Colours[800],
  },
});
