import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Linking, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import ImageView from 'react-native-image-viewing';

const MessageBubble = ({ text, isUser, colors }) => {
  const [visible, setIsVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const handleLinkPress = (url) => {
    if (/\.(jpeg|jpg|gif|png|webp)$/i.test(url)) {
      setCurrentImage(url);
      setIsVisible(true);
    } else {
      Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
    }
  };

  const markdownStyles = {
    body: {
      color: isUser ? '#FFFFFF' : colors.dark.text,
      fontFamily: 'Poppins_400Regular',
      fontSize: 15,
      lineHeight: 22,
    },
    link: {
      color: isUser ? '#ADD8E6' : colors.dark.primary,
      textDecorationLine: 'underline',
    },
  };

  const rules = {
    image: {
      react: (node, output, state) => {
        return (
          <TouchableOpacity 
            key={node.key}
            onPress={() => {
              setCurrentImage(node.attributes.src);
              setIsVisible(true);
            }}
          >
            <Image 
              source={{ uri: node.attributes.src }}
              style={styles.image}
            />
          </TouchableOpacity>
        );
      }
    }
  };

  return (
    <>
      <View style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.botBubble,
        { backgroundColor: isUser ? colors.dark.primary : colors.dark.inputBackground }
      ]}>
        <Markdown
          style={markdownStyles}
          onLinkPress={handleLinkPress}
          rules={rules}
        >
          {text}
        </Markdown>
      </View>

      <ImageView
        images={[{ uri: currentImage }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    borderTopRightRadius: 4,
    alignSelf: 'flex-end',
  },
  botBubble: {
    borderTopLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 8,
    marginVertical: 8,
  },
});

export default MessageBubble;
