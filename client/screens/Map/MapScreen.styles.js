import { StyleSheet, Dimensions, Platform } from 'react-native';
import colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  messagesWrapper: {
    flex: 1,
    marginBottom: Platform.select({
      ios: 120,
      android: 100,
    }),
  },
  inputContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.select({
      ios: 16,
      android: 8,
    }),
  },
  safeArea: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: width,
  },
  backButtonContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  floatingBackTouchable: {
    borderRadius: 24,
  },
  
  customMarker: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderColor: '#fff',
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  markerBase: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: 'row',
  },
  activeMarker: {
    backgroundColor: colors.dark.secondary,
  },
  inactiveMarker: {
    backgroundColor: 'black',
  },
  markerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3, // 30% of screen height
    backgroundColor: "#DAD0FF",
    paddingVertical: height * 0.025, // ~1.5% of screen height
    paddingHorizontal: width * 0.05, // 5% of screen width
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  placeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  placeRating: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  imageScrollContainer: {
    marginTop: height * 0.01,
    width: '100%',
    height: height * 0.2, // responsive height
  },

  imageRow: {
    flexDirection: 'row',
    marginTop: height * 0.008,
  },

  placeImage: {
    width: (width - width * 0.1) / 3, // match 8% padding on both sides
    height: height * 0.12,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '90%',
    height: '80%',
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  
});

export default styles;
