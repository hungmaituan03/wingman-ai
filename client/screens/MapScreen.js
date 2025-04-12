import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import styles from './styles/MapScreen.styles';
import colors from '../constants/Colors';

const MapScreen = ({ route, navigation }) => {
  const { places } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Icon name="chevron-back" size={24} color={colors.dark.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Places on Map</Text>
        </View>

        {/* Right-side placeholder for balance */}
        <View style={styles.rightPlaceholder} />
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: places[0].lat,
          longitude: places[0].lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {places.map((place) => (
          <Marker
            key={place.name}
            coordinate={{ latitude: place.lat, longitude: place.lng }}
            title={place.name}
            description={place.address}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
};

export default MapScreen;
