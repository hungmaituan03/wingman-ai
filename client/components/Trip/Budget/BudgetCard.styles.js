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
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  line: {
    fontSize: 14,
    flexShrink: 1,
    fontFamily: "Poppins_400Regular",
    color: 'black',
  },
});
