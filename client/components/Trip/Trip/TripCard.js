import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Linking,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { parsePriceLevel, getOpeningStatus } from "../../../utils/stringParsers";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./TripCard.styles";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TripCard = ({ place }) => {
  const [expanded, setExpanded] = useState(false);
  const {
    name,
    address,
    rating,
    user_ratings_total,
    types,
    price_level,
    phone_number,
    website,
    opening_hours,
    google_maps_url,
    photoUrls,
    photo_url,
  } = place;

  // pick whichever photo array/URL
  const images = Array.isArray(photoUrls)
    ? photoUrls
    : photo_url
    ? [photo_url]
    : [];

  useEffect(() => {
    images.forEach((uri) => Image.prefetch(uri));
  }, [images]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((e) => !e);
  };

  // build info-bar (excluding map)
  const infoBoxes = [
    price_level != null && {
      key: "price",
      icon: "cash-outline",
      value: parsePriceLevel(price_level),
      onPress: null,
    },
    phone_number && {
      key: "phone",
      icon: "call-outline",
      value: 'Phone',
      onPress: () => Linking.openURL(`tel:${phone_number}`),
    },
    website && {
      key: "site",
      icon: "globe-outline",
      value: "Website",
      onPress: () => Linking.openURL(website),
    },
    Array.isArray(opening_hours) &&
      opening_hours.length > 0 && {
        key: "hours",
        icon: "time-outline",
        value: getOpeningStatus(opening_hours),
        onPress: null,
      },
  ].filter(Boolean);

  return (
    <TouchableOpacity
      onPress={toggleExpand}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        {/* ─── Title Row ─────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <Text style={styles.cardHeader} numberOfLines={2}>
            {name}
          </Text>
        </View>

        {/* ─── Map Icon (fixed at top-right) ─────────────────────── */}
        {google_maps_url && (
          <TouchableOpacity
            onPress={() => Linking.openURL(google_maps_url)}
            style={styles.headerIcons}
          >
            <Ionicons name="map-outline" size={18} />
          </TouchableOpacity>
        )}

        {/* ─── Body ──────────────────────────────────────────────── */}
        <Text style={styles.addressText}>{address}</Text>
        <Text style={styles.ratingText}>
          ⭐ {rating} ({user_ratings_total ?? 0})
        </Text>

        {expanded && (
          <>
            {/* Tags */}
            {types?.length > 0 && (
              <View style={styles.tagRow}>
                {Array.from(new Set(types)).map((t) => (
                  <View key={t} style={styles.tagBox}>
                    <Text style={styles.tagBoxText}>
                      #{t.replace(/[_-]/g, " ")}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Info Bar */}
            <View style={styles.infoRow}>
              {infoBoxes.map((b) => (
                <TouchableOpacity
                  key={b.key}
                  style={styles.infoBox}
                  onPress={b.onPress}
                  disabled={!b.onPress}
                >
                  <Ionicons
                    name={b.icon}
                    size={20}
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoValue}>{b.value}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Photos */}
            {images.length > 0 && (
              <View style={styles.photoContainer}>
                {images.map((uri, i) => (
                  <Image
                    key={i}
                    source={{ uri }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default TripCard;
