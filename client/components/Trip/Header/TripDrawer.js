// src/screens/TripDrawer.js

import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Menu } from 'react-native-material-menu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../context/ThemeContext';
import { useTripStorage } from '../../../hooks/useTripStorage';

const { height } = Dimensions.get('window');
const MAX_LABEL_LENGTH = 20;

function truncate(str = '', len = MAX_LABEL_LENGTH) {
  return str.length > len ? str.slice(0, len - 1) + '…' : str;
}

function TripRow({ item, onView, onRename, onDelete, styles, colors }) {
  const menuRef = useRef(null);
  const showMenu = () => menuRef.current?.show();
  const hideMenu = () => menuRef.current?.hide();

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemTextContainer}
        activeOpacity={0.7}
        onPress={() => onView(item)}
      >
        <Text style={styles.itemText}>{item.label}</Text>
      </TouchableOpacity>

      <Menu
        ref={menuRef}
        anchor={
          <TouchableOpacity onPress={showMenu} style={styles.menuBtn}>
            <Icon name="ellipsis-vertical" size={20} color={colors.subtext} />
          </TouchableOpacity>
        }
      >
        <View style={styles.overflowRow}>
          <TouchableOpacity
            onPress={() => { hideMenu(); onRename(item); }}
            style={styles.actionBtn}
          >
            <Icon name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { hideMenu(); onDelete(item); }}
            style={styles.actionBtn}
          >
            <Icon name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={hideMenu}
            style={styles.actionBtn}
          >
            <Icon name="close-outline" size={24} color={colors.subtext} />
          </TouchableOpacity>
        </View>
      </Menu>
    </View>
  );
}

export default function TripDrawer({ onSelectTrip, onNewTrip }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);

  const { tripList, renameTrip, deleteTrip } = useTripStorage();
  const [filter, setFilter] = useState('');

  // Rename modal state
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [renameId, setRenameId] = useState(null);

  const openRename = item => {
    setRenameId(item.id);
    setRenameValue(item.label);
    setRenameModalVisible(true);
  };
  const confirmRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed && renameId) {
      renameTrip(renameId, trimmed);
    }
    setRenameModalVisible(false);
  };

  const handleDelete = item => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTrip(item.id) },
      ]
    );
  };

  const handleView = item => onSelectTrip({ view: true, trip: item });

  const filtered = tripList
    .map(t => ({
      ...t,
      label: truncate(
        t.name
          ?? t.summary?.split('.')[0]
          ?? t.general_places?.[0]?.name
          ?? t.id
      ),
    }))
    .filter(t =>
      t.label.toLowerCase().includes(filter.toLowerCase())
    );

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.container,
            {
              paddingTop: insets.top || styles.container.paddingTop,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search trips…"
              placeholderTextColor={colors.subtext}
              value={filter}
              onChangeText={setFilter}
            />
            <TouchableOpacity onPress={onNewTrip} style={styles.newTripButton}>
              <Icon name="add-circle-outline" size={30} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Previous Trips</Text>

          {filtered.length === 0 ? (
            <Text style={styles.empty}>No trips saved.</Text>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <TripRow
                  item={item}
                  styles={styles}
                  colors={colors}
                  onView={handleView}
                  onRename={openRename}
                  onDelete={handleDelete}
                />
              )}
            />
          )}
        </View>
      </SafeAreaView>

      <Modal
        visible={renameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Rename Trip
            </Text>
            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              value={renameValue}
              onChangeText={setRenameValue}
              placeholder="New name"
              placeholderTextColor={colors.subtext}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setRenameModalVisible(false)}>
                <Text style={[styles.modalActionText, { color: colors.subtext }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmRename}>
                <Text style={[styles.modalActionText, { color: colors.primary }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = colors => {
  const drawerPaddingTop =
    Platform.OS === 'android'
      ? StatusBar.currentHeight || 30
      : 60;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.card,
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: drawerPaddingTop,
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
      fontSize: 16,
      color: colors.text,
    },
    newTripButton: {
      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontFamily: 'Poppins_700Bold',
      color: colors.text,
      paddingVertical: 10,
    },
    empty: {
      textAlign: 'center',
      fontSize: 16,
      color: colors.subtext,
      marginTop: 20,
    },
    listContainer: {
      paddingBottom: height * 0.25,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.subcard,
      borderRadius: 8,
      marginBottom: 8,
    },
    itemTextContainer: {
      flex: 1,
    },
    itemText: {
      fontSize: 16,
      fontFamily: 'Poppins_400Regular',
      color: colors.text,
    },
    overflowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: 150,
      paddingVertical: 8,
    },
    actionBtn: {
      padding: 8,
    },
    menuBtn: {
      padding: 6,
      borderRadius: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalBox: {
      width: '80%',
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: 'Poppins_600SemiBold',
      marginBottom: 12,
    },
    modalInput: {
      borderWidth: 1,
      borderRadius: 6,
      padding: 8,
      marginBottom: 16,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    modalActionText: {
      fontSize: 16,
      fontFamily: 'Poppins_600SemiBold',
      marginLeft: 16,
    },
  });
};
