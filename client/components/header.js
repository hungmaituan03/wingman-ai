import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Colours } from "../constants/Colours";

const HeaderRow = ({ title = "Back" }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
        <Ionicons name="chevron-back" size={28} color={Colours[900]} />
      </TouchableOpacity>
      <Text style={styles.header}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: Colours[900],
    zIndex: 1,
    textShadowColor: Colours[400],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default HeaderRow;
