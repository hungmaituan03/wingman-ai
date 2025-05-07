import { StyleSheet } from 'react-native';

export default function createTipsCardStyles(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 18,
      fontFamily: 'Poppins_600SemiBold',
      color: colors.text,
      flexShrink: 1,
      flexWrap: 'wrap',
    },
    tipText: {
      fontSize: 14,
      fontFamily: 'Poppins_400Regular',
      color: colors.text,
      marginVertical: 4,

      // allow text to wrap and shrink to fit within the container
      flexShrink: 1,
      flexWrap: 'wrap',
    },
  });
}
