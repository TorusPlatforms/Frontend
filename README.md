# Torus Platforms - Frontend

A React Native social media application built with Expo, designed for college communities. Torus enables users to create and join "Loops" (groups), share "Pings" (posts), organize events, and connect with their campus community.

## Technical Stack

### Core Framework
- **React Native**: `0.74.5`
- **React**: `18.2.0`
- **Expo SDK**: `~51.0.31`
- **TypeScript**: `~5.3.3` (configured)

### Navigation
- **React Navigation**: `^6.1.9`
  - Native Stack Navigator
  - Bottom Tab Navigator
  - Material Top Tab Navigator

### Authentication & Backend
- **Firebase**: `^10.4.0`
  - Firebase Authentication with AsyncStorage persistence
  - Email verification required
- **REST API**: Custom backend integration
  - Base URL configured in `components/handlers/api.config.js`
  - JWT token-based authentication

### Key Dependencies
- **State Management**: React Hooks (useState, useEffect, useRef)
- **Storage**: `@react-native-async-storage/async-storage`
- **Notifications**: `expo-notifications` (`~0.28.16`)
- **Image Handling**: 
  - `expo-image-picker` (`~15.0.7`)
  - `react-native-fast-image` (`^8.6.3`)
  - `expo-image-manipulator` (`^12.0.5`)
- **Location Services**: `expo-location` (`~17.0.1`)
- **Chat**: `react-native-gifted-chat` (`^2.4.0`)
- **UI Components**:
  - `react-native-elements` (`^3.4.3`)
  - `react-native-vector-icons` (`^10.0.3`)
  - `@expo/react-native-action-sheet` (`^4.1.0`)
- **Utilities**:
  - `lodash` (`^4.17.21`)
  - `moment` (`^2.30.1`)
  - `react-native-reanimated` (`~3.10.1`)
  - `react-native-gesture-handler` (`~2.16.1`)

## Features

### Core Functionality
- **Social Feed**: Personalized content feed with posts, events, and announcements
- **Loops**: Create and join campus groups/communities
- **Pings**: Create posts with text, images, polls, and location
- **Events**: Organize and RSVP to campus events
- **Announcements**: Share important updates within loops
- **Direct Messaging**: One-on-one and group chat functionality
- **Comments & Interactions**: Like, comment, and vote on content
- **User Profiles**: View and edit profiles with follower/following lists
- **Search**: Discover users, loops, and colleges
- **Notifications**: Real-time push notifications via Expo

### Navigation Structure
- **Bottom Tab Navigation**: Feed, Discover, Create, My Loops, Profile
- **Stack Navigation**: Modal presentations for creation screens, detail views
- **Deep Linking**: Configured for ping, loop, user profile, and message routes

## Project Structure

```
Frontend/
├── App.js                 # Root component with navigation setup
├── app.config.js          # Expo configuration
├── components/
│   ├── handlers/          # API handlers and business logic
│   │   ├── api.config.js  # Backend API configuration
│   │   └── index.js       # API functions
│   ├── announcements/     # Announcement components
│   ├── chat/              # Chat/messaging components
│   ├── comments/          # Comment components
│   ├── events/            # Event components
│   ├── loops/             # Loop components
│   ├── pings/             # Post/ping components
│   └── utils/             # Utility functions
├── screens/
│   ├── auth/              # Authentication screens
│   ├── feed/              # Main feed screen
│   ├── profile/           # User profile screens
│   ├── loop/              # Loop detail screens
│   ├── messages/          # Messaging screens
│   ├── notifications/     # Notifications screen
│   └── settings/          # Settings screens
└── assets/                # Images and static assets
```

## Configuration

### Environment Setup
- **API Configuration**: Edit `components/handlers/api.config.js` to set backend URL
- **Firebase**: Configured in `App.js` with Firebase project credentials
- **Deep Linking**: Scheme `torus://` configured in `app.config.js`

### Build Configuration
- **iOS**: 
  - Bundle ID: `com.torusplatforms.torus`
  - Associated Domain: `applinks:torusplatforms.com`
  - Build Number: `27`
- **Android**: 
  - Package: `com.torusplatforms.torus`
  - Version Code: `24`
  - Google Services configured via environment variable

### Permissions
- Camera access
- Photo library access
- Location services (coarse and fine)
- Audio recording
- Push notifications

## Architecture

### Authentication Flow
1. User signs up/logs in via Firebase Authentication
2. Email verification required before accessing app
3. JWT token obtained from Firebase and sent to backend API
4. Token stored and used for all authenticated API requests

### API Communication
- All API calls go through `components/handlers/index.js`
- Token automatically attached to requests via `getToken()` function
- Base URL configurable for development/production environments

### State Management
- React Hooks for local component state
- AsyncStorage for persistent authentication state
- Navigation state managed by React Navigation

### UI Theme
- Dark theme with primary background: `rgb(22, 23, 24)`
- Light content on dark background
- Custom splash screen and app icons

## Version Information
- **App Version**: `1.0.13`
- **Package Version**: `1.0.0`

## License
Private project - All rights reserved

