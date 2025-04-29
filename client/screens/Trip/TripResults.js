// src/screens/Trip/TripResults.js

import React, { useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  Animated,
  StyleSheet,
} from "react-native";
import HeaderRow from "../../components/header";
import OverviewCard from "../../components/Trip/Overview/OverviewCard";
import TipsCard from "../../components/Trip/Tips/TipsCard";
import BudgetCard from "../../components/Trip/Budget/BudgetCard";
import EssentialsCard from "../../components/Trip/Essentials/EssentialsCard";
import ItineraryCard from "../../components/Trip/Itinerary/ItineraryDayCard";
import styles from "./TripPlanner.styles";

export default function TripResults({ route }) {
  const {
    summary,
    tips = [],
    budget,
    general_places = [],
    itinerary = [],
  } = route.params;

  // build an array of the sections we’re actually rendering
  const sections = [
    summary && { key: "overview",      component: <OverviewCard summary={summary} /> },
    tips.length > 0 && { key: "tips",   component: <TipsCard tips={tips} /> },
    budget && { key: "budget",          component: <BudgetCard budget={budget} /> },
    general_places.length > 0 && { key: "essentials", component: <EssentialsCard places={general_places} /> },
    itinerary && { key: "itinerary",    component: <ItineraryCard itinerary={itinerary} /> },
  ].filter(Boolean);

  // one Animated.Value per section
  const animValues = useRef(sections.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // stagger them by 150ms, fade & slide up
    const animations = animValues.map((av) =>
      Animated.timing(av, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    );
    Animated.stagger(150, animations).start();
  }, [animValues]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderRow title="Trip Results" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {sections.map((sec, i) => {
          const translateY = animValues[i].interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          });
          return (
            <Animated.View
              key={sec.key}
              style={[
                styles.section,
                {
                  opacity: animValues[i],
                  transform: [{ translateY }],
                },
              ]}
            >
              {sec.component}
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
