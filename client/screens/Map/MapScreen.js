import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import colors from '../../constants/Colors';
import styles from './MapScreen.styles';

const { width } = Dimensions.get('window');

const MapScreen = ({ route, navigation }) => {
  const { places } = route.params;
  const [activeMarker, setActiveMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <SafeAreaView style={styles.safeArea}>
    {/* Map Fullscreen */}
    <MapView
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude: places[0].lat,
        longitude: places[0].lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {places.map((place, index) => {
        const isActive = activeMarker === index;
        return (
          <Marker
            key={place.name}
            coordinate={{ latitude: place.lat, longitude: place.lng }}
            onPress={() => setActiveMarker(index)}
            title={place.name}
            description={place.address}
          >
            <View
              style={[
                styles.markerBase,
                isActive ? styles.activeMarker : styles.inactiveMarker,
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.markerText}>
                  {place.rating?.toFixed(1) || 'N/A'}
                </Text>
                <Icon
                  name="star"
                  size={12}
                  color="#FFD700"
                  style={{ marginRight: 3 }}
                />
              </View>
            </View>
          </Marker>
        );
      })}
    </MapView>
  
    {/* Back Button Floating */}
    <View style={[styles.backButtonContainer, { position: 'absolute', top: 40, left: 16, zIndex: 10 }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.floatingBackTouchable}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Icon name="chevron-back" size={28} color='#6E44FF' />
      </TouchableOpacity>
    </View>

    {/* Info Card Floating */}
    {activeMarker !== null && (
      <View style={styles.infoCard}>
        <Text style={styles.placeTitle}>{places[activeMarker].name}</Text>
        <Text style={styles.placeAddress}>
          {places[activeMarker].address}
        </Text>
        <Text style={styles.placeRating}>
          ⭐ {places[activeMarker].rating?.toFixed(1) || 'N/A'}
        </Text>
  
        {places[activeMarker].photoUrls?.length > 0 && (
          <View style={styles.imageRow}>
            {places[activeMarker].photoUrls.slice(0, 3).map((url, index, arr) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedImage(url);
                  setModalVisible(true);
                }}
              >
                <Image
                  source={{ uri: url }}
                  style={[
                    styles.placeImage,
                    index !== arr.length - 1 && { marginRight: 3 },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    )}
  
    {/* Modal for Full Image */}
    {selectedImage && (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.modalClose}
          >
            <Icon name="close" size={30} color="#fff" />
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
