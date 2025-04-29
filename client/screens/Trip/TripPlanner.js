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
import tripMock from "../../mocks/tripMock.json";
import styles from "./TripPlanner.styles";
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
  // ─── Form state ───────────────────────────────────────────────────
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

  // ─── Prefill when editing an existing trip ─────────────────────────
  useEffect(() => {
    if (initialTrip) {
      setBasicInfo({
        location: initialTrip.location ?? "",
        description: initialTrip.description ?? "",
        budget:
          initialTrip.budget != null
            ? initialTrip.budget.toString()
            : "",
        currency: initialTrip.currency ?? "",
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
    }
  }, [initialTrip]);

  // ─── Validation ───────────────────────────────────────────────────
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

  // ─── Submit handler ───────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    setError(null);

    const requestPayload = {
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

    {/*if (__DEV__) {
      console.log("🧪 [DEV] using tripMock data");
      onTripSubmit(tripMock);
      setLoading(false);
      return;
    }*/}

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const text = await response.text();
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

      const data = await response.json();
      onTripSubmit(data);
    } catch (err) {
      console.error(err);
      setError("Network error. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  // ─── Field updaters ───────────────────────────────────────────────
  const updateBasicInfo = (key, value) =>
    setBasicInfo(prev => ({ ...prev, [key]: value }));
  const updateAdvancedOptions = (key, value) =>
    setAdvancedOptions(prev => ({ ...prev, [key]: value }));

  // ─── Render ───────────────────────────────────────────────────────
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
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputContainer}>
              {/* Location autocomplete */}
              <LocationAutocomplete
                value={basicInfo.location}
                onChangeText={t => updateBasicInfo("location", t)}
                onSelect={item =>
                  updateBasicInfo("location", item.description)
                }
                placeholder="Where are you going?"
                endpoint={AUTOCOMPLETE_URL}
              />

              {/* Description */}
              <TextInput
                style={[
                  styles.input,
                  styles.multiLineInput,
                  { height: descriptionHeight },
                ]}
                placeholder="Describe your trip"
                placeholderTextColor="#b67340"
                value={basicInfo.description}
                onChangeText={t =>
                  updateBasicInfo("description", t)
                }
                multiline
                textAlignVertical="top"
                onContentSizeChange={e => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut
                  );
                  setDescriptionHeight(
                    Math.min(
                      e.nativeEvent.contentSize.height + 10,
                      200
                    )
                  );
                }}
              />

              {/* Budget & Currency */}
              <View style={styles.budgetCurrencyRow}>
                <TextInput
                  style={styles.budgetInput}
                  placeholder="Enter budget"
                  placeholderTextColor="#b67340"
                  value={basicInfo.budget}
                  onChangeText={t => updateBasicInfo("budget", t)}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.currencyInput}
                  placeholder="Currency"
                  placeholderTextColor="#b67340"
                  value={basicInfo.currency}
                  onChangeText={t =>
                    updateBasicInfo("currency", t)
                  }
                  maxLength={3}
                />
              </View>

              {/* Advanced Filters Toggle */}
              <TouchableOpacity
                onPress={() => setAdvancedOpen(o => !o)}
              >
                <Text style={styles.advancedButton}>
                  {advancedOpen
                    ? "Hide Advanced Filters ▲"
                    : "Show Advanced Filters ▼"}
                </Text>
              </TouchableOpacity>

              {/* Advanced Filters */}
              {advancedOpen && (
                <View style={styles.advancedContainer}>
                  {["theme", "ageGroup", "numberOfMembers"].map(key => (
                    <TextInput
                      key={key}
                      style={styles.input}
                      placeholder={key
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                      placeholderTextColor="#b67340"
                      value={advancedOptions[key]}
                      onChangeText={t =>
                        updateAdvancedOptions(key, t)
                      }
                    />
                  ))}

                  {/* Avoid Activities */}
                  <TextInput
                    style={[
                      styles.input,
                      styles.multiLineInput,
                      { height: avoidActivitiesHeight },
                    ]}
                    placeholder="Activities to Avoid"
                    placeholderTextColor="#b67340"
                    value={advancedOptions.avoidActivities}
                    onChangeText={t =>
                      updateAdvancedOptions("avoidActivities", t)
                    }
                    multiline
                    textAlignVertical="top"
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

                  {/* Interest sliders */}
                  <View style={styles.ratingBox}>
                    {Object.keys(interests).map(key => (
                      <View key={key} style={styles.advancedRow}>
                        <Text style={styles.advancedLabel}>
                          {key
                            .replace("_", " ")
                            .replace(
                              /\b\w/g,
                              l => l.toUpperCase()
                            )}
                        </Text>
                        <View style={styles.circleRow}>
                          {[1, 2, 3, 4, 5].map(value => (
                            <TouchableOpacity
                              key={value}
                              style={[
                                styles.circle,
                                interests[key] === value &&
                                  styles.circleSelected,
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

              {/* Submit Button */}
              <View style={styles.buttonBox}>
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Ionicons
                    name="airplane-outline"
                    size={28}
                    color="white"
                  />
                </TouchableOpacity>
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}
              {loading && (
                <ActivityIndicator
                  size="large"
                  style={styles.loader}
                />
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
