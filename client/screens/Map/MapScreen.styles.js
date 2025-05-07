// src/screens/MapScreen.styles.js

import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');
const COLLAPSED_HEIGHT = height * 0.28;
const EXPANDED_HEIGHT  = height * 0.62;

const SPACING = { xs: 4, s: 8, m: 16, l: 24 };
const RADIUS  = { sm: 8, md: 16 };

const SHADOW = {
  card: {
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  box: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
};

const TYPE = { body: 15, header: 18, title: 22 };
const ITEM_WIDTH = (width - (SPACING.l * 2 + SPACING.s * 2)) / 3;

export default (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },

    backButtonContainer: {
      position: 'absolute',
      top: Platform.OS === 'android'
        ? (StatusBar.currentHeight || 0) + SPACING.l + SPACING.m
        : SPACING.l + SPACING.m,
      left: SPACING.l,
      zIndex: 10,
    },
    floatingBackTouchable: {
      borderRadius: RADIUS.md,
      elevation: 2,
      padding: SPACING.s,
      backgroundColor: colors.surface,
    },

    markerBase: {
      alignItems: 'center',
      borderRadius: RADIUS.md,
      flexDirection: 'row',
      padding: SPACING.s,
      ...SHADOW.box,
    },
    activeMarker: {
      backgroundColor: 'black',
    },
    inactiveMarker: {
      backgroundColor: 'gray',
    },
    markerText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '700',
    },

    collapsedCard: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.card,
      borderTopLeftRadius: RADIUS.md,
      borderTopRightRadius: RADIUS.md,
      paddingHorizontal: SPACING.l,
      paddingBottom: SPACING.m,
      maxHeight: COLLAPSED_HEIGHT,
      ...SHADOW.card,
    },
    expandedCard: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.card,
      borderTopLeftRadius: RADIUS.md,
      borderTopRightRadius: RADIUS.md,
      paddingHorizontal: SPACING.l,
      paddingBottom: SPACING.m,
      maxHeight: EXPANDED_HEIGHT,
      ...SHADOW.card,
    },

    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.s,
    },
    placeTitle: {
      flex: 1,
      fontSize: TYPE.title,
      fontWeight: '800',
      color: colors.text,
    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconButton: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.sm,
      padding: SPACING.s,
    },
    iconButtonSpacing: {
      marginLeft: SPACING.s,
    },

    cardBody: {
      // content flows here
    },

    sectionHeader: {
      fontSize: TYPE.header,
      fontWeight: '700',
      color: colors.text,
      marginTop: SPACING.s,
      marginBottom: SPACING.xs,
    },
    sectionText: {
      fontSize: TYPE.body,
      color: colors.text,
      marginBottom: SPACING.s,
    },

    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: SPACING.s,
    },
    infoBox: {
      width: ITEM_WIDTH,
      backgroundColor: colors.subcard,
      borderColor: colors.primary,
      borderWidth: 1.5,
      borderRadius: RADIUS.sm,
      padding: SPACING.s,
      ...SHADOW.box,
    },
    boxHeader: {
      fontWeight: '600',
      marginBottom: SPACING.xs,
      color: colors.text,
    },
    boxContent: {
      alignItems: 'center',
    },

    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: SPACING.m,
    },
    tagBox: {
      backgroundColor: colors.primary,
      borderRadius: RADIUS.sm,
      paddingVertical: SPACING.xs,
      paddingHorizontal: SPACING.s,
      marginRight: SPACING.s,
      marginBottom: SPACING.s,
    },
    tagBoxText: {
      fontSize: TYPE.body,
      fontWeight: '600',
      color: colors.background,
    },

    imageRow: {
      flexDirection: 'row',
      marginTop: SPACING.m,
    },
    placeImage: {
      width: ITEM_WIDTH,
      height: height * 0.12,
      borderRadius: RADIUS.sm,
      marginRight: SPACING.s,
    },

    modalContainer: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalClose: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 60 : 40,
      right: SPACING.m,
      zIndex: 10,
    },
    fullScreenImage: {
      width: '90%',
      height: '80%',
    },
    placeRating: {
      color: colors.text,
    }
  });
