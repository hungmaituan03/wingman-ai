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
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: Colours[900],
  },
  tipText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: 'black',
    marginTop: 8,
  },
});
