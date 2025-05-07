import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import makeStyles from './HomeScreen.styles';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const displayName =
    user?.displayName || user?.email?.split('@')[0] || 'Traveler';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.mainContent}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>WELCOME TO</Text>
          <Text style={styles.appName}>TRAVELION</Text>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Hello,</Text>
            <Text style={styles.userName}>{displayName}!</Text>
          </View>

          {/* App Introduction Section */}
          <View style={styles.introContainer}>
            <Text style={styles.introTitle}>Discover, Plan, Explore.</Text>
            <Text style={styles.introText}>
              Travelion helps you explore new destinations, plan perfect trips,
              and get tailored travel recommendations based on your interests,
              location, and budget.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Home')}
          >
            <View style={[styles.bubble, styles.activeBubble]}>
              <Icon name="home" size={26} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Chat')}
          >
            <View style={styles.bubble}>
              <Icon
                name="chatbubble-ellipses"
                size={26}
                color={colors.text}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Trip')}
          >
            <View style={styles.bubble}>
              <Icon
                name="trail-sign"
                size={26}
                color={colors.text}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Account')}
          >
            <View style={styles.bubble}>
              <Icon name="person" size={26} color={colors.text} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
