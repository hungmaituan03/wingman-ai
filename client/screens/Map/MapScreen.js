// src/screens/MapScreen.js

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  LayoutAnimation,
  UIManager,
  Platform,
  Linking,
} from 'react-native';

import {
  isFavorited,
  addFavorite,
  removeFavorite,
} from '../../services/storage/favoritesStorage';

import {
  getTodayOpeningHours,
  parsePriceLevel,
} from '../../utils/stringParsers';

import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import colors from '../../constants/Colors';
import styles from './MapScreen.styles';

// Enable smooth layout transitions on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

/** InfoBox: Reusable component to display a titled box with custom content */
const InfoBox = ({ title, children }) => (
  <View style={styles.infoBox}>
    <Text style={styles.boxHeader}>{title}</Text>
    <View style={styles.boxContent}>{children}</View>
  </View>
);

const MapScreen = ({ route, navigation }) => {
  const { places } = route.params;
  const [activeMarker, setActiveMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const place = activeMarker !== null ? places[activeMarker] : {};

  useEffect(() => {
    if (activeMarker === null) return;
    (async () => {
      const fav = await isFavorited(place.id);
      setIsFavorite(fav);
    })();
  }, [activeMarker, place.id]);

  const toggleFavorite = useCallback(async () => {
    if (activeMarker === null) return;
    if (isFavorite) {
      await removeFavorite(place.id);
    } else {
      await addFavorite({
        id:      place.id,
        name:    place.name,
        address: place.address,
        lat:     place.lat,
        lng:     place.lng,
        rating:  place.rating,
        photo:   place.photoUrls?.[0] ?? null,
      });
    }
    setIsFavorite(prev => !prev);
  }, [activeMarker, isFavorite, place]);

  const toggleCard = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(prev => !prev);
  }, []);

  const renderCollapsedContent = () => (
    <View>
      <Text style={styles.placeAddress}>{place.address}</Text>
      <View style={styles.infoRow}>
        <InfoBox title="Rating">
          <Text style={styles.placeRating}>{place.rating} ⭐</Text>
          <Text style={styles.boxText}>
            {place.user_ratings_total ?? 0} reviews
          </Text>
        </InfoBox>
        <InfoBox title="Hours">
          <Text style={styles.boxText}>
            {getTodayOpeningHours(place.opening_hours)}
          </Text>
        </InfoBox>
        <InfoBox title="Prices">
          <Text style={styles.boxText}>
            {parsePriceLevel(place.price_level)}
          </Text>
        </InfoBox>
      </View>
    </View>
  );

  const renderExpandedContent = () => (
    <ScrollView
      style={styles.expandedContentInner}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Tags */}
      {place.types?.length > 0 && (
        <View style={styles.tagRow}>
          {place.types.map(type => {
            const label = `#${type
              .split(/[_-]/)
              .map(s => s[0].toUpperCase() + s.slice(1))
              .join(' ')}`;
            return (
              <View key={type} style={styles.tagBox}>
                <Text style={styles.tagBoxText}>{label}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Address */}
      <Text style={styles.sectionHeader}>Address</Text>
      <Text style={styles.sectionText}>{place.address}</Text>

      {/* Boxes */}
      <View style={styles.infoRow}>
        <InfoBox title="Rating">
          <Text style={styles.placeRating}>{place.rating} ⭐</Text>
          <Text style={styles.boxText}>
            {place.user_ratings_total ?? 0} reviews
          </Text>
        </InfoBox>
        <InfoBox title="Hours">
          <Text style={styles.boxText}>
            {getTodayOpeningHours(place.opening_hours)}
          </Text>
        </InfoBox>
        <InfoBox title="Prices">
          <Text style={styles.boxText}>
            {parsePriceLevel(place.price_level)}
          </Text>
        </InfoBox>
      </View>

      {/* Photos */}
      <Text style={styles.sectionHeader}>Photos</Text>
      <View style={styles.imageRow}>
        {(place.photoUrls ?? []).map((url, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              setSelectedImage(url);
              setModalVisible(true);
            }}
          >
            <Image source={{ uri: url }} style={styles.placeImage} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: places[0].lat,
          longitude: places[0].lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {places.map((p, i) => (
          <Marker
            key={`${p.id}-${i}`}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            onPress={() => {
              setActiveMarker(i);
              setIsExpanded(false);
            }}
          >
            <View
              style={[
                styles.markerBase,
                activeMarker === i
                  ? styles.activeMarker
                  : styles.inactiveMarker,
              ]}
            >
              <Text style={styles.markerText}>
                {p.rating?.toFixed(1) ?? 'N/A'}
              </Text>
              <Icon name="star" size={12} color="#FFD700" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Back button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.floatingBackTouchable}
        >
          <Icon name="chevron-back" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {activeMarker !== null && (
        <View style={isExpanded ? styles.expandedCard : styles.collapsedCard}>
          {/* ─── Header Row ───────────────────────────── */}
          <View style={styles.headerRow}>
            <Text style={styles.placeTitle}>{place.name}</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => Linking.openURL(place.google_maps_url)}
              >
                <Icon name="map-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.iconButtonSpacing]}
                onPress={toggleFavorite}
              >
                <Icon
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? 'red' : colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.iconButtonSpacing]}
                onPress={toggleCard}
              >
                <Icon
                  name={isExpanded ? 'chevron-down-circle' : 'chevron-up-circle'}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ─── Body Content ─────────────────────────── */}
          <View style={styles.cardBody}>
            {isExpanded
              ? renderExpandedContent()
              : renderCollapsedContent()}
          </View>
        </View>
      )}

      {/* Full-screen image modal */}
      {modalVisible && selectedImage && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => {
                setModalVisible(false);
                setSelectedImage(null);
              }}
            >
              <Icon name="close" size={30} color="#FFF" />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default MapScreen;
