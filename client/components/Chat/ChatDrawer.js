import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import styles from './styles/ChatDrawer.styles';
import Colors from '../../constants/Colors';

const ChatDrawer = ({ 
  sessionList, 
  onSelect, 
  onNewChat, 
  sessionActions // ✅ { deleteSession, renameSession }
}) => {
  const [searchText, setSearchText] = useState('');

  const { deleteSession, renameSession } = sessionActions; // ✅ use passed-down actions

  const filteredSessions = sessionList.filter(session =>
    (session?.name ?? '').toLowerCase().includes(searchText.toLowerCase())
  );

  const handleNewChatPress = () => {
    onNewChat();
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSession(id);
          }
        }
      ]
    );
  };

  const handleRename = (id) => {
    Alert.prompt(
      'Rename Chat',
      'Enter a new name for the chat session:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (newName) => {
            if (newName?.trim()) {
              await renameSession(id, newName.trim());
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const renderRightActions = (id) => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#f0f0f0' }]}
        onPress={() => handleRename(id)}
      >
        <Icon name="create-outline" size={22} color={Colors.dark.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#ffe6e6' }]}
        onPress={() => handleDelete(id)}
      >
        <Icon name="trash-outline" size={22} color="red" />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity
        style={styles.sessionItem}
        onPress={() => onSelect(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.sessionText}>
          {item?.name || `Session ${item.id?.slice(0, 6) || index}`}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.drawerContainer}>
      {/* Search bar and New Chat button */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          onPress={handleNewChatPress}
          style={styles.newChatButton}
        >
          <Icon name="add-circle" size={35} color={Colors.dark.primary} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.drawerTitle}>Chat Sessions</Text>

      {/* Chat list */}
      {filteredSessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No saved chats yet.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSessions}
          keyExtractor={(item, index) => item?.id || `fallback-${index}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ChatDrawer;
