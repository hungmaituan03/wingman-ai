import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for AsyncStorage
const FAVORITES_KEY = 'FAVORITES_MAP';

/**
 * Load the entire favorites map from local storage.
 * @returns {Promise<Object>} Map of placeId -> place snapshot
 */
export async function loadFavoritesMap() {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json ? JSON.parse(json) : {};
  } catch (err) {
    console.error('Failed to load favorites map', err);
    return {};
  }
}

/**
 * Persist the entire favorites map to local storage.
 * @param {Object} map
 */
export async function saveFavoritesMap(map) {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to save favorites map', err);
  }
}

/**
 * Check if a given placeId is favorited.
 * @param {string} placeId
 * @returns {Promise<boolean>}
 */
export async function isFavorited(placeId) {
  const map = await loadFavoritesMap();
  return Boolean(map[placeId]);
}

/**
 * Add a place to favorites.
 * @param {Object} place - Place snapshot (must include id, name, address, lat, lng, rating, photo)
 */
export async function addFavorite(place) {
  const map = await loadFavoritesMap();
  map[place.id] = {
    ...place,
    addedAt: Date.now(),
  };
  await saveFavoritesMap(map);
}

/**
 * Remove a place from favorites.
 * @param {string} placeId
 */
export async function removeFavorite(placeId) {
  const map = await loadFavoritesMap();
  if (map[placeId]) {
    delete map[placeId];
    await saveFavoritesMap(map);
  }
}

/**
 * Get all favorited places as an array.
 * @returns {Promise<Array<Object>>}
 */
export async function getAllFavorites() {
  const map = await loadFavoritesMap();
  return Object.values(map);
}
