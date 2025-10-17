# ContactManagerApp

A React Native contact management application with performance optimizations, accessibility features, and a clean, user-friendly interface.

## Features

- **Contact Management**: Add, edit, view, and delete contacts with full CRUD operations.
- **Search and Sort**: Search contacts by name, email, or company; sort by name, company, or recent additions.
- **Favorites**: Mark contacts as favorites for quick access.
- **Persistent Storage**: Uses AsyncStorage for local data persistence.
- **Responsive UI**: Optimized for both Android and iOS with keyboard handling and accessibility support.
- **Performance Optimized**: Implements React hooks (useCallback, useMemo), memoization, and FlatList optimizations for smooth performance.

## Key Implementations

### Navigation and Routing
- Uses React Navigation with stack navigator for seamless screen transitions.
- Screens: ContactList, ContactDetails, AddContact.

### Accessibility
- Screen reader support with accessibility labels and roles.
- Keyboard navigation with refs and KeyboardAvoidingView.

## Getting Started

### Prerequisites
- Node.js
- React Native CLI or Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd ContactManagerApp
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. For iOS, install CocoaPods:
   ```sh
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

### Running the App

#### Start Metro
```sh
npm start
```

#### Android
```sh
npm run android
```

#### iOS
```sh
npm run ios
```
