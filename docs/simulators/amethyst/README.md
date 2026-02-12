# Amethyst Simulator

## Overview

The Amethyst simulator recreates the Amethyst Android Nostr client with full Material Design 3 implementation. It showcases the rich features and modern Android design that make Amethyst the most feature-complete Nostr client.

## What is Amethyst?

Amethyst is the premier Nostr client for Android, featuring:
- Material Design 3 (Material You)
- Deep purple color scheme
- Rich feature set
- Live streaming support
- Community features
- Advanced relay management

**Real Client**: [GitHub](https://github.com/vitorpamplona/amethyst) | [Google Play](https://play.google.com/store/apps/details?id=com.vitorpamplona.amethyst)

## Features Demonstrated

### 1. Login Screen
- Welcome with Material Design branding
- Key input with secure display
- Generate new keys
- Account recovery options

**How to Use**:
1. View the Material Design welcome
2. Click "Create New Account" for mock keys
3. Or enter existing nsec/npub
4. Click "Login" to proceed

### 2. Home Feed
- Material Design card layout
- Filter chips for content types
- Pull-to-refresh animation
- Floating Action Button for compose

**Navigation**:
- Scroll through elevated cards
- Use filter chips (Following, Global, Trending)
- Pull down to refresh
- Tap FAB to compose

### 3. Search Screen
- Material SearchBar component
- Trending topics display
- Suggested users section
- Recent searches history

**How to Search**:
1. Tap search icon in bottom nav
2. Enter query in search bar
3. See results categorized by type
4. Tap any result to view

### 4. Notifications Screen
- Activity feed with Material cards
- Type-based icons (like/repost/zap/follow)
- Unread count badges
- Mark all as read option

**Notification Types**:
- Someone liked your post
- Someone reposted your content
- Someone zapped you
- Someone followed you
- Someone mentioned you

### 5. Messages Screen
- DM conversation list
- Online status indicators
- Encrypted message badges
- Avatar and last message preview

**Message Features**:
- Start new conversations
- View encrypted chat
- See online/offline status
- Message timestamps

### 6. Profile Screen
- Material Design profile layout
- Large avatar with banner
- Stats cards (followers, following, zaps)
- Tabbed content sections

**Profile Sections**:
- **Posts**: User's notes
- **Replies**: User's replies
- **Likes**: Liked content
- **Media**: Image/video posts

### 7. Settings Screen
- Material Design settings list
- Theme selector (Light/Dark/Auto)
- Relay management
- Notification preferences
- Privacy settings

**Settings Categories**:
- Appearance (themes, colors)
- Relays (connection management)
- Notifications (push settings)
- Privacy (mute lists, blocks)
- Account (keys, logout)

### 8. Compose Screen
- Full-screen compose dialog
- Character counter with circular progress
- Media attachment options
- Privacy level selector
- Mentions and hashtags support

**Compose Features**:
1. Type message (up to 2000 chars)
2. Watch circular progress indicator
3. Add media attachments
4. Select privacy (Public/Followers/Private)
5. Add mentions (@user) and hashtags (#topic)
6. Preview before posting

## Visual Design

### Material Design 3
Amethyst uses Google's Material Design 3 with:
- **Dynamic Color**: CSS custom properties
- **Elevation**: 5 levels of shadows
- **Motion**: Smooth transitions
- **Typography**: Roboto font family
- **Shapes**: Rounded corners (8-28dp)

### Color Scheme
- **Primary**: Deep Purple (#6B21A8)
- **Secondary**: Purple (#A855F7)
- **Tertiary**: Light Purple (#C084FC)
- **Surface**: Light/Dark backgrounds
- **Error**: Red (#EF4444)
- **Success**: Green (#22C55E)

### Theme Support
- **Light Mode**: Clean white surfaces
- **Dark Mode**: Dark gray surfaces
- **Auto**: Follows system preference
- **Dynamic**: Material You color extraction (mock)

### Typography
- **Font**: Roboto (Android system font)
- **Headline Large**: 32-40px
- **Headline Medium**: 24-28px
- **Title Large**: 18-22px
- **Body Large**: 16px
- **Label Medium**: 12px

### Layout
- **Mobile-First**: Android phone dimensions
- **Material Spacing**: 8dp grid system
- **Responsive**: Adapts to screen size
- **Safe Areas**: Respects Android insets

### Components

#### BottomNav
- Material Design 3 bottom navigation
- 5 destinations: Home, Search, Notifications, Messages, Profile
- Badge support for notifications
- Active state with icon/text color change

#### MaterialCard
- Elevated card container
- 1-5 elevation levels
- Optional ripple effects
- Content slots (header, media, actions)

#### FloatingActionButton
- Primary circular FAB
- Extended FAB with text
- Secondary FAB variant
- Proper elevation and shadow

#### FilterChips
- Assist chips for filtering
- Input chips for tags
- Choice chips for single selection
- Filter chips with checkmarks

## Interactions

### Material Motion
- **Ripple Effects**: Touch feedback
- **Elevation Changes**: On press/hover
- **Shared Elements**: Screen transitions
- **Fade/Scale**: Modal animations

### Touch Gestures
- **Tap**: Primary action
- **Long Press**: Secondary actions
- **Swipe**: Dismiss or archive
- **Pull**: Refresh content

### Button Actions
- **Elevated Button**: Primary actions
- **Filled Button**: High emphasis
- **Outlined Button**: Medium emphasis
- **Text Button**: Low emphasis

### Navigation
- **Bottom Nav**: Main sections
- **Top App Bar**: Contextual actions
- **Navigation Drawer**: (if implemented)
- **Bottom Sheet**: Additional options

## Keyboard Shortcuts

When viewing on desktop:
- **1**: Go to Home
- **2**: Go to Search
- **3**: Go to Notifications
- **4**: Go to Messages
- **5**: Go to Profile
- **N**: Open Compose (New Note)
- **S**: Focus Search
- **Esc**: Close modal / Go back
- **R**: Refresh feed

## Mobile vs Desktop

### Mobile Experience
- Full-screen Android simulation
- Touch-optimized (tap targets 48dp+)
- Bottom navigation for easy thumb reach
- Swipe gestures for navigation
- Native Android animations

### Desktop Experience
- Centered phone frame
- Mouse hover states
- Click interactions
- Keyboard navigation
- Larger touch targets

## Data Simulation

### Mock Content
- **55 Mock Users**: Various profiles
- **200+ Mock Posts**: Rich content
- **Realistic Timestamps**: Relative time
- **Engagement**: Likes, reposts, zaps, replies

### Content Types
- Text notes
- Media posts (images)
- Long-form articles
- Replies and threads
- Reposts with quotes
- Live stream announcements

## Unique Amethyst Features

### Live Streaming (Live Activities)
Amethyst supports NIP-53 live streaming:
- View current/live streams
- See stream participants
- Chat in stream
- Start your own stream (simulated)

### Community Features
- **Communities**: Join topic-based groups
- **Channels**: Public discussion rooms
- **Badges**: Achievement system
- **Classifieds**: Marketplace listings

### Advanced Settings
- **Tor Support**: (indicated)
- **Proxy Settings**: Connection routing
- **Data Saver**: Reduce bandwidth
- **Language**: Multiple language support

## Limitations

### Not Implemented
- Real protocol connections
- Cryptographic operations
- Push notifications
- File uploads
- Real-time updates
- Offline support

### Simplified Features
- Search uses mock data
- Relays show static state
- Zaps are simulated
- DMs are mock conversations
- Live streams are placeholders

## How to Use the Simulator

### First Time Setup
1. Navigate to `/simulators/amethyst`
2. See Material Design welcome
3. Click "Create New Account"
4. View generated mock keys
5. Click "Login" to enter

### Basic Navigation
1. **Home**: Browse feed with Material cards
2. **Search**: Find content and users
3. **Notifications**: Check activity
4. **Messages**: View DMs
5. **Profile**: See your profile

### Using the Feed
1. Scroll through elevated cards
2. Tap filter chips to change view
3. Tap FAB (+) to create post
4. Like, repost, zap posts
5. Tap cards to view threads

### Creating Content
1. Tap the FAB (+ button)
2. Enter text (watch progress ring)
3. Add mentions with @
4. Add hashtags with #
5. Select privacy level
6. Tap "Post" to publish

### Customizing Settings
1. Go to Profile → Settings
2. Change theme (Light/Dark/Auto)
3. Manage relay connections
4. Configure notifications
5. Set up mute lists

## Tips for Users

### Material Design Tips
- Look for elevation to indicate importance
- Use FAB for primary actions
- Long press for more options
- Pull to refresh content
- Swipe to dismiss notifications

### Android-Specific
- Bottom nav for one-handed use
- Back button support
- System theme integration
- Material You dynamic colors

### Comparing with iOS
- Open Damus and Amethyst simulators
- Notice platform design differences
- Compare navigation patterns
- See how features are presented differently

## Technical Notes

### Implementation Details
- **Platform**: Android simulation
- **Framework**: React + TypeScript
- **Design System**: Material Design 3
- **Styling**: Tailwind + custom MD3 CSS
- **State**: React Context + useReducer
- **Animations**: Framer Motion + CSS

### File Structure
```
/src/simulators/amethyst/
├── AmethystSimulator.tsx      # Main container
├── amethyst.theme.css         # MD3 theme (600+ lines)
├── index.ts                   # Exports
├── screens/
│   ├── HomeScreen.tsx         # Feed with chips
│   ├── SearchScreen.tsx       # Search with trending
│   ├── NotificationsScreen.tsx # Activity feed
│   ├── MessagesScreen.tsx     # DM list
│   ├── ProfileScreen.tsx      # User profile
│   ├── SettingsScreen.tsx     # App settings
│   └── ComposeScreen.tsx      # Post composer
└── components/
    ├── BottomNav.tsx          # MD3 navigation
    ├── MaterialCard.tsx       # Elevated cards
    └── FloatingActionButton.tsx # FAB component
```

### Material Design Tokens
```css
:root {
  --md-sys-color-primary: #6B21A8;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #F3E8FF;
  --md-sys-color-secondary: #A855F7;
  --md-sys-color-surface: #FEF7FF;
  --md-sys-color-surface-variant: #E7E0EC;
  --md-sys-elevation-level1: 0px 2px 4px rgba(0,0,0,0.1);
  --md-sys-elevation-level2: 0px 4px 8px rgba(0,0,0,0.15);
}
```

## Frequently Asked Questions

**Q: Does this use real Material Design components?**
A: No, these are custom React components styled to match Material Design 3.

**Q: Can I export my theme settings?**
A: No, all settings are session-only and reset on refresh.

**Q: Is the live streaming real?**
A: No, live streaming is simulated with placeholder content.

**Q: How accurate is the Material Design implementation?**
A: We follow Material Design 3 guidelines closely, but some elements may differ.

**Q: Can I switch between iOS and Android simulators?**
A: Yes! Open `/simulators/damus` and `/simulators/amethyst` in separate tabs.

## Resources

### Official Amethyst Links
- GitHub: [github.com/vitorpamplona/amethyst](https://github.com/vitorpamplona/amethyst)
- Google Play: Search "Amethyst" on Android
- F-Droid: Available on F-Droid store

### Material Design Resources
- Material 3: [m3.material.io](https://m3.material.io)
- Guidelines: [material.io/design](https://material.io/design)
- Components: [material.io/components](https://material.io/components)

### Nostr Resources
- Protocol: [nostr.com](https://nostr.com)
- Documentation: [github.com/nostr-protocol/nostr](https://github.com/nostr-protocol/nostr)

## Updates and Versioning

This simulator is updated to match Amethyst's evolving feature set. Check the implementation date for version alignment.

**Current Version**: Based on Amethyst v0.87+

## Contributing

To suggest improvements:
1. Review [CONTRIBUTING.md](../CONTRIBUTING.md)
2. Check Material Design 3 compliance
3. Test on multiple screen sizes
4. Follow the style guide

## License

The Amethyst simulator is part of the Nostr Beginner Guide project. Amethyst is an independent open-source project under the MIT license.
