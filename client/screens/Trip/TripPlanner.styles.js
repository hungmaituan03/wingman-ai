import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { Colours } from "../../constants/Colours";

const commonContainer = {
  backgroundColor: "white",
  borderRadius: 16,
  padding: 16,
};

export default StyleSheet.create({
  /** Layout Base **/
  safeArea: {
    flex: 1,
    backgroundColor: Colours[50],
    position: 'relative',
    overflow: 'visible',
  },
  flex: {
    flex: 1,
  },

  /** Header **/
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: Colours[50],

  },
  backIcon: {
    position: "absolute",
    left: 16,
    padding: 4,
  },
  header: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: Colors.dark.primary,
    zIndex: 1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  /** Main Form Container **/
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: Colours[50],
    overflow: 'visible',
  },
  inputContainer: {
    ...commonContainer,
    backgroundColor: Colours[50],
    overflow: 'visible',
    zIndex: 10,
    position: 'relative',
    elevation: 5,
  },
  input: {
    backgroundColor: "white",
    color: Colours[950],
    borderRadius: 20,
    height: 44,
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colours[100],
    fontFamily: "Poppins_400Regular",
  },

  multiLineInput: {
    textAlignVertical: "top",
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: "Poppins_400Regular",
    lineHeight: 20,
    color: Colours[950],
  },

  /** Budget + Currency Row **/
  budgetCurrencyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  budgetInput: {
    flex: 2,
    backgroundColor: "white",
    color: Colours[950],
    borderRadius: 20,
    height: 44,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colours[100],
    fontFamily: "Poppins_400Regular",
  },
  currencyInput: {
    flex: 1,
    backgroundColor: "white",
    color: Colours[950],
    borderRadius: 20,
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colours[100],
    fontFamily: "Poppins_400Regular",
  },

  /** Advanced Filters **/
  advancedButton: {
    marginTop: 16,
    color: Colours[900],
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
  advancedContainer: {
    position: "relative",
    marginTop: 12,
    backgroundColor: Colours[200],
    borderRadius: 16,
    padding: 16,
    flexDirection: "column",
    flexShrink: 0,
    alignSelf: "stretch",
  },
  advancedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  advancedLabel: {
    fontSize: 16,
    color: Colours[800],
    flex: 1,
    fontFamily: "Poppins_600SemiBold",
  },
  ratingBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colours[400],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colours[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  /** Circle Rating (for Interests, Mobility, Engagement) **/
  circleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "white",
  },
  circleSelected: {
    backgroundColor: Colours[700],
  },
  circleText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: Colours[950],
  },
  circleTextSelected: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "white",
  },

  /** Submit Button **/
  buttonBox: {
    marginTop: 24,
    alignItems: "center",
  },
  generateButton: {
    width: 64,
    height: 64,
    backgroundColor: Colours[900],
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  /** Error and Loading **/
  errorText: {
    color: Colors.dark.error,
    textAlign: "center",
    marginTop: 8,
    fontFamily: "Poppins_400Regular",
  },
  loader: {
    marginTop: 16,
  },
});