import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  LayoutAnimation,
  UIManager,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import createStyles from "./TripPlanner.styles";
import TripHeader from "../../components/Trip/Header/TripHeader";
import LocationAutocomplete from "../../components/LocationAutocomplete";

const API_URL = "http://172.16.44.32:5000/generateTrip";
const AUTOCOMPLETE_URL = API_URL.replace("/generateTrip", "/autocomplete");

// enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TripPlanner({ initialTrip, onTripSubmit, onNewTrip }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [basicInfo, setBasicInfo] = useState({
    location: "",
    description: "",
    budget: "",
    currency: "",
  });
  const [advancedOptions, setAdvancedOptions] = useState({
    theme: "",
    avoidActivities: "",
    ageGroup: "",
    numberOfMembers: "",
  });
  const [interests, setInterests] = useState({
    history: 3,
    art: 3,
    food: 3,
    nature: 3,
    mobility: 3,
    physical_activities: 3,
  });

  const [descriptionHeight, setDescriptionHeight] = useState(80);
  const [avoidActivitiesHeight, setAvoidActivitiesHeight] = useState(80);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialTrip) return;

    const parsedBudget =
      typeof initialTrip.budget === "object" && initialTrip.budget
        ? initialTrip.budget.amount?.toString() || ""
        : initialTrip.budget?.toString() || "";

    setBasicInfo({
      location: initialTrip.location ?? "",
      description: initialTrip.description ?? "",
      budget: parsedBudget,
      currency: initialTrip.currency ?? initialTrip.budget?.type ?? "",
    });

    setAdvancedOptions({
      theme: initialTrip.theme ?? "",
      avoidActivities: initialTrip.avoid_activities ?? "",
      ageGroup: initialTrip.age_group ?? "",
      numberOfMembers:
        initialTrip.number_of_members != null
          ? initialTrip.number_of_members.toString()
          : "",
    });

    setInterests(initialTrip.interests || interests);
  }, [initialTrip]);

  const validateInputs = () => {
    if (
      !basicInfo.location.trim() ||
      !basicInfo.description.trim() ||
      !basicInfo.budget.trim()
    ) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (isNaN(basicInfo.budget) || parseFloat(basicInfo.budget) <= 0) {
      setError("Budget must be a positive number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    setError(null);

    const payload = {
      conversation_id: initialTrip?.conversation_id,
      location: basicInfo.location.trim(),
      description: basicInfo.description.trim(),
      budget: parseFloat(basicInfo.budget),
      currency: basicInfo.currency.trim().toUpperCase(),
      theme: advancedOptions.theme.trim(),
      avoid_activities: advancedOptions.avoidActivities.trim(),
      age_group: advancedOptions.ageGroup.trim(),
      number_of_members:
        parseInt(advancedOptions.numberOfMembers, 10) || 1,
      interests,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        let detail = text;
        try {
          const errJson = JSON.parse(text);
          detail = Array.isArray(errJson.detail)
            ? errJson.detail
                .map(e => `${e.loc.join(" → ")}: ${e.msg}`)
                .join("\n")
            : errJson.detail || text;
        } catch {}
        setError(detail);
        return;
      }
      const data = await res.json();
      onTripSubmit(data);
    } catch {
      setError("Network error. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  const updateBasicInfo = (key, value) =>
    setBasicInfo(prev => ({ ...prev, [key]: value }));
  const updateAdvancedOptions = (key, value) =>
    setAdvancedOptions(prev => ({ ...prev, [key]: value }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <TripHeader onNewTrip={onNewTrip} title="Trip Planner" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* LOCATION */}
            <LocationAutocomplete
              value={basicInfo.location}
              onChangeText={t => updateBasicInfo("location", t)}
              onSelect={item => updateBasicInfo("location", item.description)}
              placeholder="Where are you going"
              placeholderTextColor={colors.subtext}
              endpoint={AUTOCOMPLETE_URL}
              style={styles.input}
            />

            {/* DESCRIPTION */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Describe your trip
              </Text>
              <TextInput
                style={[styles.input, styles.multiLineInput]}
                placeholderTextColor={colors.subtext}
                value={basicInfo.description}
                onChangeText={t => updateBasicInfo("description", t)}
                multiline
                onContentSizeChange={e => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut
                  );
                  setDescriptionHeight(
                    Math.min(e.nativeEvent.contentSize.height + 10, 200)
                  );
                }}
              />
            </View>

            {/* BUDGET & CURRENCY */}
            <View style={styles.budgetCurrencyContainer}>
              <View style={[styles.fieldContainer, styles.budgetColumn]}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>
                  Budget
                </Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={colors.subtext}
                  value={basicInfo.budget}
                  onChangeText={t => updateBasicInfo("budget", t)}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.fieldContainer, styles.currencyColumn]}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>
                  Currency
                </Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={colors.subtext}
                  value={basicInfo.currency}
                  onChangeText={t => updateBasicInfo("currency", t)}
                  maxLength={3}
                />
              </View>
            </View>

            {/* ADVANCED FILTERS TOGGLE */}
            <TouchableOpacity onPress={() => setAdvancedOpen(o => !o)}>
              <Text style={[styles.advancedButton, { color: colors.primary }]}>
                {advancedOpen
                  ? "Hide Advanced Filters ▲"
                  : "Show Advanced Filters ▼"}
              </Text>
            </TouchableOpacity>

            {/* ADVANCED FILTERS */}
            {advancedOpen && (
              <View style={styles.advancedContainer}>
                {["theme", "ageGroup", "numberOfMembers"].map(key => (
                  <View key={key} style={styles.fieldContainer}>
                    <Text style={[styles.fieldLabel, { color: colors.text }]}>
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholderTextColor={colors.subtext}
                      value={advancedOptions[key]}
                      onChangeText={t => updateAdvancedOptions(key, t)}
                    />
                  </View>
                ))}

                <View style={styles.fieldContainer}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>
                    Activities to Avoid
                  </Text>
                  <TextInput
                    style={[styles.input, styles.multiLineInput]}
                    placeholderTextColor={colors.subtext}
                    value={advancedOptions.avoidActivities}
                    onChangeText={t =>
                      updateAdvancedOptions("avoidActivities", t)
                    }
                    multiline
                    onContentSizeChange={e => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut
                      );
                      setAvoidActivitiesHeight(
                        Math.min(
                          e.nativeEvent.contentSize.height + 10,
                          200
                        )
                      );
                    }}
                  />
                </View>

                <View style={styles.ratingBox}>
                  {Object.keys(interests).map(key => (
                    <View key={key} style={styles.advancedRow}>
                      <Text style={[styles.advancedLabel, { color: colors.text }]}>
                        {key
                          .replace("_", " ")
                          .replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                      <View style={styles.circleRow}>
                        {[1, 2, 3, 4, 5].map(value => (
                          <TouchableOpacity
                            key={value}
                            style={[
                              styles.circle,
                              interests[key] === value && styles.circleSelected,
                            ]}
                            onPress={() =>
                              setInterests(prev => ({
                                ...prev,
                                [key]: value,
                              }))
                            }
                          >
                            <Text
                              style={[
                                styles.circleText,
                                interests[key] === value &&
                                  styles.circleTextSelected,
                              ]}
                            >
                              {value}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* SUBMIT */}
            <View style={styles.buttonBox}>
              <TouchableOpacity
                style={[
                  styles.generateButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Ionicons
                  name="airplane-outline"
                  size={28}
                  color={colors.background}
                />
              </TouchableOpacity>
            </View>

            {error && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            )}
            {loading && (
              <ActivityIndicator
                size="large"
                style={styles.loader}
                color={colors.primary}
              />
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
