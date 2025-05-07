// src/screens/TripPlanner.styles.js

import { StyleSheet } from "react-native";

export default (colors) =>
  StyleSheet.create({
    /** Layout Base **/
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },

    /** ScrollView **/
    scrollView: {
      backgroundColor: colors.background,
    },
    contentContainer: {
      flexGrow: 1,
      padding: 16,
    },

    /** Form Field Wrappers **/
    fieldContainer: {
      marginBottom: 16,
    },
    fieldLabel: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.subtext,
      fontFamily: "Poppins_400Regular",
      marginBottom: 4,
    },

    /** Inputs **/
    icon: {
      position: "absolute",
      top: 14,
      left: 12,
      color: colors.subtext,
      zIndex: 1,
    },
    input: {
      width: "100%",
      height: 50,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      fontSize: 16,
      fontFamily: "Poppins_400Regular",
      color: colors.text,             // <-- text color for dark/light
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    multiLineInput: {
      textAlignVertical: "top",
      paddingTop: 8,
      paddingBottom: 8,
      fontFamily: "Poppins_400Regular",
      color: colors.text,             // <-- also ensure multiline text is visible
    },

    /** Budget + Currency Row **/
    budgetCurrencyContainer: {
      flexDirection: "row",
      marginBottom: 16,
    },
    budgetColumn: {
      flex: 2,
      marginRight: 8,
    },
    currencyColumn: {
      flex: 1,
    },

    /** Advanced Filters **/
    advancedButton: {
      marginTop: 16,
      color: colors.primary,
      textAlign: "center",
      fontFamily: "Poppins_600SemiBold",
    },
    advancedContainer: {
      marginTop: 12,
      backgroundColor: colors.subcard,
      borderRadius: 16,
      padding: 16,
    },
    advancedRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 8,
    },
    advancedLabel: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
      fontFamily: "Poppins_600SemiBold",
    },

    /** Interests Rating Box **/
    ratingBox: {
      marginTop: 20,
      padding: 16,
      backgroundColor: colors.subcard,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
    },
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
      borderColor: colors.subcard,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 4,
      backgroundColor: colors.surface,
    },
    circleSelected: {
      backgroundColor: colors.primary,
    },
    circleText: {
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: colors.text,
    },
    circleTextSelected: {
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: colors.background,
    },

    /** Submit Button **/
    buttonBox: {
      marginTop: 24,
      alignItems: "center",
    },
    generateButton: {
      width: 64,
      height: 64,
      backgroundColor: colors.primary,
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
      color: colors.error,
      textAlign: "center",
      marginTop: 8,
      fontFamily: "Poppins_400Regular",
    },
    loader: {
      marginTop: 16,
    },
  });
