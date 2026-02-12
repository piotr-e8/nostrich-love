# Amethyst - Android Nostr Client

## Client Information
- **Name**: Amethyst
- **Platform**: Android
- **Repository**: https://github.com/vitorpamplona/amethyst
- **Website**: https://amethyst.social
- **License**: MIT
- **Tech Stack**: Kotlin, Jetpack Compose

## Official Resources

### Logo
- **Location**: `/docs/design/3rd Logo - Zitron/amethyst.svg`
- **Format**: SVG
- **Colors**: Purple gradient

### Screenshots (from GitHub)
Located in `/docs/screenshots/`:

1. **home.png** - Home feed view
   - Shows: Event cards, navigation tabs, composer button
   - Features: Infinity scroll, reactions, zaps

2. **messages.png** - Direct messages interface
   - Shows: Chat list, conversation threads
   - Features: NIP-04 & NIP-17 support

3. **replies.png** - Thread/replies view
   - Shows: Nested conversation threading
   - Features: Reply chains, context display

4. **notifications.png** - Notifications screen
   - Shows: Mentions, reactions, follows
   - Features: Categorized alerts

## UI Components

### Navigation
- Bottom tab bar with 5 sections
- Floating action button (FAB) for new posts
- Swipe gestures for quick actions

### Feed Cards
- Profile picture (circular)
- Display name + nip-05 (if available)
- Timestamp
- Content text
- Media attachments
- Action bar: Reply, Repost, Reaction, Zap

### Profile View
- Banner image
- Avatar (circular, 96px)
- Display name + username
- Bio/description
- Stats: Posts, Followers, Following
- Relay list
- Action buttons: Follow, Message, Zap

### Composer
- Full-screen modal
- Text input with markdown support
- Media attachment options
- Emoji picker
- Custom hashtags

## Color Scheme

### Light Theme
- Primary: #9B59B6 (Purple)
- Surface: #FFFFFF
- Background: #F5F5F5
- Text: #212121
- Accent: #8E44AD

### Dark Theme
- Primary: #BB86FC (Light Purple)
- Surface: #1E1E1E
- Background: #121212
- Text: #FFFFFF
- Accent: #9B59B6

## Typography
- **Font**: System default (Roboto on Android)
- **Sizes**: 
  - Display: 20sp
  - Headline: 18sp
  - Title: 16sp
  - Body: 14sp
  - Caption: 12sp

## Key Features Supported

### NIPs (100+ supported)
- NIP-01: Basic protocol
- NIP-04 & NIP-17: Encrypted DMs
- NIP-25: Reactions
- NIP-57: Lightning Zaps
- NIP-65: Relay lists
- NIP-72: Communities
- And many more...

### Unique Features
- Image capture in-app
- Video capture in-app
- In-device translations
- Multiple accounts
- Workspace support
- QR code login

## References

### Video Demos
- Search YouTube: "Amethyst Nostr Android"
- GitHub README has feature screenshots

### Similar UIs
- Twitter/X mobile app
- Mastodon mobile apps
- Generic social feed apps

## Notes for Recreation
- Use Material Design 3 components
- Implement Jetpack Compose patterns
- Support both light and dark themes
- Include pull-to-refresh
- Implement bottom sheet modals
- Add haptic feedback on interactions
