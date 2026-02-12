# Damus Simulator

## Overview

The Damus simulator is a faithful recreation of the Damus iOS Nostr client. It demonstrates the clean, minimalist iOS design that has made Damus one of the most popular Nostr clients.

## What is Damus?

Damus is the premier Nostr client for iOS, known for its:
- Clean, Twitter-like interface
- Purple accent color scheme
- Fast and responsive design
- Strong privacy focus
- Native iOS look and feel

**Real Client**: [damus.io](https://damus.io) | [App Store](https://apps.apple.com/app/damus/id1628663131)

## Features Demonstrated

### 1. Login Screen
- Welcome screen with logo
- Key entry (nsec/npub) input
- Generate new keys option
- Privacy information

**How to Use**:
1. View the welcome screen
2. Click "Create Account" to generate mock keys
3. Observe the key generation process
4. Click "Login" to proceed

### 2. Home Feed
- Pull-to-refresh (simulated)
- Filter tabs (Following, Global)
- Infinite scroll simulation
- Post cards with engagement

**How to Navigate**:
- Scroll through the feed
- Click filter tabs to switch views
- Tap any post to view details
- Use the compose button to create posts

### 3. Profile Screen
- Banner and avatar display
- User stats (followers, following, posts)
- Bio and website links
- Tabbed content (Posts, Replies, Likes)

**Navigation**:
- Tap any avatar to view profile
- See user statistics
- Browse user's posts
- Follow/Unfollow button

### 4. Compose Screen
- Text input with character counter
- Media attachment options
- Post visibility settings
- Preview before posting

**How to Compose**:
1. Tap the compose button (+ icon)
2. Type your message
3. Watch the character counter
4. Tap "Post" to submit (simulated)

### 5. Settings Screen
- Relay management
- Push notification settings
- Theme preferences
- Account settings

**Settings Options**:
- View connected relays
- Toggle notification preferences
- Change theme (if implemented)
- Logout option

## Visual Design

### Color Scheme
- **Primary**: Purple (#8B5CF6)
- **Secondary**: Light Purple (#A78BFA)
- **Background**: Black (#000000) / White (#FFFFFF)
- **Card Background**: Dark Gray (#1C1C1E)
- **Text**: White / Black depending on theme
- **Borders**: Gray (#38383A)

### Typography
- **Font**: San Francisco (iOS system font)
- **Styles**:
  - Headlines: 20-24px, semibold
  - Body: 16px, regular
  - Captions: 12-14px, regular
  - Username: 15px, semibold
  - Handle: 14px, regular, muted color

### Layout
- **Mobile-First**: Designed for iPhone dimensions
- **Responsive**: Scales to desktop with mobile frame
- **Safe Areas**: Respects iOS safe area insets
- **Status Bar**: Simulated iOS status bar

### Components

#### TabBar
- iOS-style bottom navigation
- 5 tabs: Home, Search, Notifications, Messages, Profile
- Center compose button (floating)
- Selected state highlighting

#### NoteCard
- Avatar (left)
- User info (top)
- Content (middle)
- Actions (bottom): Reply, Repost, Like, Zap, Share
- Timestamp

#### ProfileHeader
- Banner image (cover photo)
- Avatar (overlapping banner)
- Display name and username
- Bio text
- Stats row (posts, followers, following)
- Action buttons (Follow, Message)

## Interactions

### Touch Gestures
- **Tap**: Select items, open screens
- **Long Press**: (if implemented) Preview content
- **Swipe**: (if implemented) Navigate back

### Button Actions
- **Like**: Heart icon, toggles like state
- **Repost**: Retweet icon, toggles repost state
- **Zap**: Lightning icon, opens zap dialog
- **Share**: Share icon, opens share options
- **Reply**: Comment icon, opens compose for reply

### Navigation
- **Tab Bar**: Switch between main sections
- **Back Button**: Navigate to previous screen
- **Profile Tap**: View user profile
- **Note Tap**: View note thread

## Keyboard Shortcuts

When viewing on desktop:
- **H**: Go to Home
- **S**: Go to Search
- **N**: Go to Notifications
- **M**: Go to Messages
- **P**: Go to Profile
- **C**: Open Compose
- **Esc**: Close modal / Go back

## Mobile vs Desktop

### Mobile Experience
- Full-screen immersive view
- Touch-optimized interactions
- Bottom tab navigation
- Pull-to-refresh gesture
- Swipe navigation

### Desktop Experience
- Centered mobile frame
- Mouse-optimized interactions
- Clickable navigation
- Scroll-based refresh
- Keyboard shortcuts available

## Data Simulation

### Mock Content
- **55 Mock Users**: Diverse profiles with avatars
- **200+ Mock Posts**: Realistic Nostr content
- **Realistic Timestamps**: Relative time display
- **Engagement Metrics**: Likes, reposts, zaps

### Content Types
- Text posts
- Posts with mentions
- Posts with hashtags
- Replies and threads
- Reposted content

## Limitations

### Not Implemented
- Real protocol connections
- Actual key cryptography
- Image uploading
- Push notifications
- Deep linking
- Offline support

### Simplified Features
- Search is filtered mock data
- DMs are simulated conversations
- Relays show static status
- Zaps don't use real Lightning

## How to Use the Simulator

### First Time Setup
1. Navigate to `/simulators/damus`
2. View the welcome screen
3. Click "Create Account" to see key generation
4. Login to access the app

### Basic Navigation
1. **Home**: View your feed
2. **Search**: Find users and content
3. **Notifications**: See activity on your posts
4. **Messages**: View direct messages
5. **Profile**: View and edit your profile

### Interacting with Posts
1. **Like**: Tap the heart icon
2. **Repost**: Tap the retweet icon
3. **Reply**: Tap the comment icon
4. **Zap**: Tap the lightning icon
5. **Share**: Tap the share icon

### Creating Content
1. Tap the compose button (+)
2. Type your message
3. Add mentions with @username
4. Add hashtags with #topic
5. Tap "Post" to publish

## Tips for Users

### Learning Nostr
- Use the simulator to learn the interface before installing Damus
- Practice composing posts and interacting
- Explore all screens to understand the app flow
- Try different features risk-free

### Comparing Clients
- Open multiple simulators in different tabs
- Compare Damus with Amethyst (Android)
- Notice platform-specific design differences
- Identify features unique to each client

## Technical Notes

### Implementation Details
- **Platform**: iOS simulation
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS + custom iOS theme
- **State**: React Context + useReducer
- **Animations**: CSS transitions + Framer Motion

### File Structure
```
/src/simulators/damus/
├── DamusSimulator.tsx        # Main container
├── damus.theme.css           # iOS styles
├── index.ts                  # Exports
├── screens/
│   ├── LoginScreen.tsx       # Welcome/login
│   ├── HomeScreen.tsx        # Main feed
│   ├── ProfileScreen.tsx     # User profile
│   ├── ComposeScreen.tsx     # Post composer
│   └── SettingsScreen.tsx    # App settings
└── components/
    ├── TabBar.tsx            # Bottom navigation
    ├── NoteCard.tsx          # Post display
    └── ProfileHeader.tsx     # Profile header
```

### State Management
- Uses shared `useSimulator` hook
- Isolated state per simulator instance
- No persistence between sessions

## Frequently Asked Questions

**Q: Is this the real Damus app?**
A: No, this is a visual simulation for educational purposes only.

**Q: Can I use my real Nostr keys?**
A: No, only mock keys are used. Never enter real keys in simulators.

**Q: Will my actions be posted to Nostr?**
A: No, all actions are simulated locally in your browser.

**Q: Can I switch between light and dark mode?**
A: Check the settings screen. Theme support depends on implementation.

**Q: How accurate is the simulation?**
A: The UI closely matches Damus, but some features are simplified.

## Resources

### Official Damus Links
- Website: [damus.io](https://damus.io)
- GitHub: [github.com/damus-io/damus](https://github.com/damus-io/damus)
- App Store: Search "Damus" on iOS

### Nostr Resources
- Protocol: [nostr.com](https://nostr.com)
- Documentation: [github.com/nostr-protocol/nostr](https://github.com/nostr-protocol/nostr)

### Support
- Damus issues: Use the real Damus app support
- Simulator issues: Check [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)

## Updates and Versioning

This simulator is updated periodically to reflect changes in the real Damus app. However, there may be a delay between Damus updates and simulator updates.

**Current Version**: Based on Damus v1.5+

## Contributing

To suggest improvements to the Damus simulator:
1. Review [CONTRIBUTING.md](../CONTRIBUTING.md)
2. Check existing issues
3. Submit detailed feature requests
4. Follow the style guide

## License

The Damus simulator is part of the Nostr Beginner Guide project. Damus is an independent open-source project with its own license.
