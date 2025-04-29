import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Colours } from "../../../constants/Colours";

const TripHeader = ({ title = "Back" }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      {/* Menu button opens the drawer */}
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.iconButton}
      >
        <Icon name="menu-outline" size={24} color={Colours[900]} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconButton}
      >
        <Icon name="chevron-back" size={24} color={Colours[900]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colours[50],
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: Colours[900],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default TripHeader;
