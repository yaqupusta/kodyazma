# Memleket App 🏠

**Memleketinizi Bulun** - Hometown Connection App

A React Native mobile application designed to help people living in cities other than their hometown easily meet fellow citizens and find common ground in their current city.

## 🎯 Target Audience

- **University students** and recent graduates who have moved to big cities and feel lonely
- **Working professionals** who have left their hometown for work or marriage and want to expand their social circle
- **Individuals** who enjoy meeting people from different cultures but want to maintain their connection with their hometown
- **Entrepreneurs** starting a business in a new city who want to network with people from their hometown

## ✨ Features

### 🔐 Authentication & Profile Setup
- User registration with email validation
- Comprehensive profile setup with hometown selection
- Support for different user types (Student, Professional, Entrepreneur)
- Turkish language interface

### 🔍 Discovery & Connections
- Find people from your hometown living in your current city
- Filter by distance, user type, and interests
- Smart matching algorithm based on hometown and location
- View detailed profiles with interests and background

### 📅 Events & Networking
- Create and join hometown-based events
- Categories: Social, Professional, Cultural, Sports
- Event management with attendee limits
- RSVP functionality

### 💬 Messaging & Social Features
- Direct messaging between users
- Real-time online status indicators
- Message history and unread badges
- Search functionality

### 🏠 Hometown-Centric Features
- Comprehensive Turkish city database
- Hometown verification system
- Location-based discovery
- Cultural event recommendations

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **UI Components**: Custom components with React Native Paper
- **State Management**: React Hooks
- **Styling**: StyleSheet with Flexbox
- **Icons**: Expo Vector Icons
- **Location**: Expo Location
- **Internationalization**: Custom Turkish localization system

## 📱 Screens

### Authentication Flow
- **Welcome Screen**: App introduction and feature highlights
- **Sign Up Screen**: User registration with validation
- **Profile Setup Screen**: Hometown selection and profile completion

### Main Application
- **Home Screen**: Dashboard with stats and quick actions
- **Discover Screen**: Find and connect with people from your hometown
- **Events Screen**: Browse and create events
- **Messages Screen**: Chat with your connections
- **Profile Screen**: Manage your profile and settings

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/memleket-app.git
   cd MemleketApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on device/simulator**
   - For iOS: `npm run ios`
   - For Android: `npm run android`
   - For Web: `npm run web`

## 📁 Project Structure

```
MemleketApp/
├── src/
│   ├── localization/          # Turkish language support
│   │   ├── tr.ts             # Turkish translations
│   │   └── index.ts          # Localization service
│   ├── navigation/           # Navigation configuration
│   │   └── AppNavigator.tsx  # Main navigation setup
│   ├── screens/              # All app screens
│   │   ├── auth/             # Authentication screens
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── SignUpScreen.tsx
│   │   │   └── ProfileSetupScreen.tsx
│   │   └── main/             # Main app screens
│   │       ├── HomeScreen.tsx
│   │       ├── DiscoverScreen.tsx
│   │       ├── EventsScreen.tsx
│   │       ├── MessagesScreen.tsx
│   │       └── ProfileScreen.tsx
│   └── types/                # TypeScript type definitions
│       └── User.ts           # User-related types
├── App.tsx                   # Main app component
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🎨 Design Features

- **Modern UI**: Clean, intuitive interface with Turkish UX considerations
- **Color Scheme**: Vibrant gradients and hometown-inspired colors
- **Responsive Design**: Works seamlessly on different screen sizes
- **Accessibility**: Proper contrast ratios and touch targets
- **Turkish Localization**: Complete Turkish language support

## 🌟 Key Features Implementation

### Hometown Selection System
- Comprehensive list of Turkish cities
- Visual city picker with search functionality
- Current city vs. hometown distinction

### User Type Categories
- **Students**: University information and academic networking
- **Professionals**: Career-focused connections and networking
- **Entrepreneurs**: Business networking and startup community
- **Others**: Flexible category for diverse users

### Event Categories
- **Social**: Coffee meetups, casual gatherings
- **Professional**: Networking events, career talks
- **Cultural**: Traditional events, cultural celebrations
- **Sports**: Sports activities and tournaments

### Interest-Based Matching
- Predefined interest categories in Turkish
- Tag-based interest selection
- Smart matching based on common interests

## 🔮 Future Enhancements

- **Real-time Chat**: WebSocket-based messaging
- **Push Notifications**: Event reminders and message notifications
- **Advanced Matching**: AI-powered recommendation system
- **Photo Sharing**: Profile pictures and event photos
- **Rating System**: User and event rating system
- **Payment Integration**: Premium features and event payments
- **Map Integration**: Visual location-based discovery
- **Video Calls**: In-app video communication

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@memleketapp.com or join our Telegram channel.

## 🙏 Acknowledgments

- Turkish expatriate community for inspiration
- React Native community for excellent documentation
- Expo team for simplifying mobile development
- All contributors and beta testers

---

**Memleket App** - Bringing hometown connections to your new city! 🏠❤️