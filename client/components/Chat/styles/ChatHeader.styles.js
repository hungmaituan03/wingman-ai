import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../../constants/Colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  headerContainer: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
    zIndex: 2,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: Colors.dark.secondary,
    zIndex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 }, // slightly downward
    textShadowRadius: 2,
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  dropdownWrapper: {
    width: 130,
    marginRight: 4,
  },
  dropdown: {
    height: 30,
    color: '#333',
  },
  menuButton: {
    padding: 8,
  },
  
});
