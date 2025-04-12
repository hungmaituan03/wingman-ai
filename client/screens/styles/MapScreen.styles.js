import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../constants/Colors';

const screen = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.textSecondary,
    backgroundColor: colors.dark.background,
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  rightPlaceholder: {
    width: 40,
  },
  map: {
    flex: 1,
    width: screen.width,
  },
});

export default styles;
