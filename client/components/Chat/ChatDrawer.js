import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { Menu, MenuItem } from 'react-native-material-menu';
import stylesFactory from './styles/ChatDrawer.styles';

// --- SessionRow: a separate component so we can use hooks ---
function SessionRow({ item, index, onSelect, promptRename, confirmDelete, colors, styles }) {
  const menuRef = useRef(null);
  const showMenu = () => menuRef.current?.show();
  const hideMenu = () => menuRef.current?.hide();

  return (
    <View style={styles.sessionItem}>
      <TouchableOpacity
        style={styles.sessionTextContainer}
        onPress={() => onSelect(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.sessionText}>
          {item.name || `Session ${item.id?.slice(0, 6) || index}`}
        </Text>
      </TouchableOpacity>

      {/* Overflow “⋯” button */}
      <Menu
        ref={menuRef}
        anchor={
          <TouchableOpacity
            onPress={showMenu}
            style={styles.moreBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="More actions"
          >
            <Icon name="ellipsis-vertical" size={20} color={colors.subtext} />
          </TouchableOpacity>
        }
      >
        <MenuItem>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: 150 }}>
            <TouchableOpacity
              onPress={() => {
                hideMenu();
                promptRename(item.id);
              }}
              style={{ padding: 8 }}
            >
              <Icon name="create-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                hideMenu();
                confirmDelete(item.id);
              }}
              style={{ padding: 8 }}
            >
              <Icon name="trash-outline" size={24} color={colors.error} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={hideMenu}
              style={{ padding: 8 }}
            >
              <Icon name="close-outline" size={24} color={colors.subtext} />
            </TouchableOpacity>
          </View>
        </MenuItem>
      </Menu>
    </View>
  );
}

export default function ChatDrawer({ sessionList, onSelect, onNewChat, sessionActions }) {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const { deleteSession, renameSession } = sessionActions;
  const { colors } = useTheme();
  const styles = stylesFactory(colors);

  const filtered = sessionList.filter(session =>
    (session?.name ?? '').toLowerCase().includes(searchText.toLowerCase())
  );

  const handleNewChat = () => onNewChat();
  const confirmDelete = id =>
    Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteSession(id, navigation),
      },
    ]);
  const promptRename = id =>
    Alert.prompt(
      'Rename Chat',
      'Enter a new name:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: name => {
            if (name?.trim()) renameSession(id, name.trim());
          },
        },
      ],
      'plain-text'
    );

  return (
    <>
      <View style={styles.drawerContainer}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats..."
            placeholderTextColor={colors.subtext}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
            <Icon name="add-circle" size={35} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.drawerTitle, { color: colors.text }]}>Chat Sessions</Text>

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No saved chats yet.</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item, idx) => item.id || `sess-${idx}`}
            renderItem={({ item, index }) => (
              <SessionRow
                item={item}
                index={index}
                onSelect={onSelect}
                promptRename={promptRename}
                confirmDelete={confirmDelete}
                colors={colors}
                styles={styles}
              />
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <TouchableWithoutFeedback onPress={() => navigation.closeDrawer()}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
    </>
  );
}
