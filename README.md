# Travelion

A mobile travel companion app that helps you discover, plan, and navigate day trips using AI-powered recommendations and interactive maps. Built with React Native (Expo) on the frontend, FastAPI on the backend, OpenAI’s GPT-3.5 for natural-language reasoning, and Google Maps for place data.

---

## 🚀 Key Features

- **Chat-Based Discovery**  
  Describe what you’re looking for (“best coffee spots in Brooklyn”, “family-friendly parks”) and get friendly, concise summaries and explanations of nearby places.

- **Trip Planner**  
  Generate a complete day-trip itinerary by entering:
  - **Location** & **Description**  
  - **Budget** & **Currency**  
  - **Advanced Options**: theme, avoid-activities, age group, group size, interest ratings  
  - Instantly see essential places (hotel, restaurant, quick stop), a 5-place itinerary segmented by morning/afternoon/evening, and a budget breakdown.

- **Interactive Map View**  
  View recommended places on a map, tap markers for details, and get directions.

- **Persistent Sessions**  
  Sign in with Firebase Auth to save chat sessions and trip plans to Firestore, with local caching in AsyncStorage for offline access.

- **Cost Controls**  
  Client-side daily quotas (configurable via AsyncStorage) to keep your OpenAI costs predictable.

---

## 🏗️ Tech Stack

- **Frontend**  
  - React Native (Expo)  
  - React Navigation  
  - Redux / Context for state (AuthContext, ThemeContext)  
  - AsyncStorage for local caching  

- **Backend**  
  - Python 3.9+ & FastAPI  
  - Uvicorn for ASGI server  
  - OpenAI GPT-3.5-turbo for recommendation logic  
  - Google Maps Places API for place data  

- **Auth & Data**  
  - Firebase Auth (email/password)  
  - Firestore for session & plan persistence  
  - AsyncStorage for offline-first caching  

- **Deployment**  
  - EAS Build for iOS/Android binaries  
  - Render (or Heroku/AWS) for FastAPI backend

---

## 🔧 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/travelion.git
cd travelion
