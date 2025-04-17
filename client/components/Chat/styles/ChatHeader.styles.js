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
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
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
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.dark.secondary,
    zIndex: 1,
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
