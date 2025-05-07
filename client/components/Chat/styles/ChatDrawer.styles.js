import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export default colors =>
  StyleSheet.create({
    drawerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: width * 0.8,
      height,
      backgroundColor: colors.card,
      paddingTop:
        Platform.OS === 'android'
          ? StatusBar.currentHeight || 30
          : 60,
      paddingHorizontal: 16,
      zIndex: 999,
      overflow: 'hidden',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },

    drawerTitle: {
      fontSize: 20,
      fontFamily: 'Poppins_700Bold',
      color: colors.primary,
      padding: 10,
    },

    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      backgroundColor: colors.subcard,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginRight: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      fontFamily: 'Poppins_400Regular',
      fontSize: 16,
      color: colors.text,
    },

    newChatButton: {
      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    newChatText: {
      color: colors.primary,
      fontSize: 16,
      fontFamily: 'Poppins_600SemiBold',
    },

    sessionList: {
      flex: 1,
      marginBottom: 16,
    },

    sessionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.subcard,
      borderRadius: 8,
      marginBottom: 8,
    },
    sessionTextContainer: {
      flex: 1,
    },
    sessionText: {
      fontSize: 16,
      fontFamily: 'Poppins_400Regular',
      color: colors.text,
    },

    moreBtn: {
      padding: 6,
      borderRadius: 4,
    },

    emptyText: {
      textAlign: 'center',
      fontSize: 16,
      color: colors.subtext,
      marginTop: 20,
      fontFamily: 'Poppins_400Regular',
    },
  });