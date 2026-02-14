# Amethyst Research Report

## App Overview

**Name:** Amethyst  
**Developer:** Vitor Pamplona (@vitorpamplona)  
**Platform:** Android 8.0+ (API 26+)  
**License:** MIT  
**Repository:** https://github.com/vitorpamplona/amethyst  
**Website:** https://amethyst.social  
**Play Store:** https://play.google.com/store/apps/details?id=com.vitorpamplona.amethyst

## Description

Amethyst brings the best decentralized social network to your Android phone. It is a feature-rich Nostr client that empowers users to join the social network they control.

**Tagline:** "Join the social network you control."

## Technical Architecture

- **Language:** Kotlin
- **UI Framework:** Jetpack Compose
- **Architecture Pattern:** State/ViewModel/Composition
- **Security:** Private keys stored in Android KeyStore
- **Database:** Local database with OO graph structure
- **Modules:**
  - **Amethyst:** Native Android app (Kotlin + Jetpack Compose)
  - **Quartz:** Nostr-commons KMP library for protocol classes
  - **Commons:** Shared UI components (icons, robohash, blurhash, composables)
  - **DesktopApp:** Compose Multiplatform Desktop application

## Core Features

### Social Features
- **Home Feed:** Main timeline with posts from followed users
- **Follow Lists:** NIP-02 compliant follow management
- **Replies & Threads:** Nested conversation threads (NIP-10)
- **Reposts & Quotes:** Boost content with commentary (NIP-18)
- **Reactions:** Emoji reactions to posts (NIP-25)
- **Mentions:** Tag users in posts
- **Direct Messages:** Encrypted private messaging (NIP-04, NIP-17)
- **Private Zaps:** Anonymous lightning payments (NIP-57)

### Content Creation
- **Text Notes:** Standard posts with markdown support
- **Image/Video Capture:** In-app media capture
- **Media Previews:** Image/Video/URL/Lightning invoice previews
- **Draft Events:** Save unfinished posts
- **Long-form Content:** Article publishing (NIP-23)
- **Calendar Events:** Event scheduling (NIP-52)

### Communities & Groups
- **Public Chats:** Channel-based discussions (NIP-28)
- **Relay-based Groups:** Community management (NIP-29)
- **Moderated Communities:** Community moderation tools (NIP-72)
- **Workspaces:** Organized content spaces

### Live Features
- **Live Activities:** Real-time streaming support (NIP-53)
- **Live Chats:** Integrated chat during streams
- **Video Events:** Native video content (NIP-71)

### Identity & Verification
- **NIP-05 Verification:** DNS-based username verification
- **Profile Fields:** Extended user metadata (NIP-24)
- **External Identities:** Link external accounts (NIP-39)
- **Badges:** Achievement system (NIP-58)
- **Nostr Address:** npub/nsec key format

### Discovery
- **Hashtag Following:** Follow specific hashtags
- **Custom Hashtags:** Create personal tags
- **Relay Search:** Find new relays (NIP-50)
- **Trending:** Popular content discovery
- **Search:** Full-text search capabilities

### Lightning Integration
- **Zaps:** Lightning micropayments (NIP-57)
- **Zap Splits:** Split payments to multiple recipients
- **Zap Goals:** Fundraising targets (NIP-75)
- **Zapraiser:** Special zap events
- **Zapstr.live:** Audio track streaming (kind:31337)
- **Wallet Connect:** External wallet integration (NIP-47)

### Advanced Features
- **Multiple Accounts:** Switch between identities
- **Infinity Scroll:** Seamless content loading
- **In-Device Translation:** Automatic content translation
- **QR Login:** Scan to login
- **Push Notifications:** Google and Unified Push support
- **Lists:** Curated collections (NIP-51)
- **Polls:** Interactive voting (NIP-69)
- **Marketplace:** Buy/sell items (NIP-15)
- **Classifieds:** Advertisements (NIP-99)
- **Bounties:** Task rewards (nostrbounties.com)

## UI/UX Patterns

### Navigation
- **Bottom Navigation:** Primary app sections
- **Tab-based:** Switch between feed types
- **Swipe Gestures:** Navigate between tabs
- **Back Navigation:** Consistent back button behavior

### Content Layout
- **Card-based Posts:** Each post in a card with rounded corners
- **Avatar + Content:** Standard social media layout
- **Thread Indicators:** Visual reply/thread depth indicators
- **Media Grid:** Grid layout for image galleries
- **Actions Row:** Like, Boost, Zap, Reply action buttons

### Visual Design
- **Material Design 3:** Modern Android design system
- **Dark/Light Themes:** Theme switching support
- **Rounded Corners:** Consistent 8-16dp corner radius
- **Elevation:** Card shadows for depth
- **Icons:** Outlined iconography style

### Interactive Elements
- **Pull-to-Refresh:** Standard refresh gesture
- **Long-press Menus:** Context menus on posts
- **Swipe Actions:** Quick actions on list items
- **Floating Action Button:** Primary action access
- **Bottom Sheets:** Secondary actions and details

## Color Palette

Based on screenshot analysis and app branding:

### Primary Colors
- **Brand Purple:** #673AB7 (Amethyst crystal color)
- **Brand Purple Dark:** #512DA8
- **Brand Purple Light:** #7E57C2

### Neutral Colors
- **Background (Light):** #FFFFFF
- **Background (Dark):** #121212
- **Surface (Light):** #F5F5F5
- **Surface (Dark):** #1E1E1E
- **Text Primary:** #212121 (Light theme) / #FFFFFF (Dark theme)
- **Text Secondary:** #757575 (Light theme) / #B3B3B3 (Dark theme)

### Accent Colors
- **Success:** #4CAF50
- **Warning:** #FFC107
- **Error:** #F44336
- **Info:** #2196F3

### Interactive Colors
- **Like/Reaction:** #E91E63 (Pink)
- **Boost/Repost:** #00BCD4 (Cyan)
- **Zap/Lightning:** #FFD700 (Gold)
- **Verified Badge:** #4CAF50 (Green)

## NIP Support Status

The app supports 90+ NIPs including:
- NIP-01: Events/Relay Subscriptions
- NIP-02: Follow List
- NIP-04: Encrypted DMs
- NIP-05: DNS Address
- NIP-10: Replies/Threads
- NIP-18: Reposts/Quotes
- NIP-25: Reactions
- NIP-28: Public Chats
- NIP-53: Live Activities
- NIP-57: Zaps
- NIP-71: Video Events
- NIP-72: Moderated Communities

Full list available in the GitHub README.

## Unique Differentiators

1. **Live Streaming:** Native support for live video streams
2. **In-App Translation:** Automatic translation without external services
3. **Multiple Accounts:** Easy switching between identities
4. **Workspaces:** Organized content spaces for power users
5. **Zap Splits:** Split lightning payments to multiple recipients
6. **Video Capture:** Native in-app video recording
7. **Infinity Scroll:** Seamless infinite scrolling experience
8. **QR Login:** Quick account access via QR codes
9. **Relay Management:** Advanced relay subscription controls
10. **Privacy-First:** F-Droid flavor available (de-googled)

## Screenshots Analysis

### Screenshot URLs from nostrapps.com:
1. https://cdn.satellite.earth/03b136945e39297d8d9a6cf97af702de038a2b594a89fc988a78dff97667e2eb.webp
2. https://cdn.satellite.earth/9f3138becf917f83e471c85128859def0a9b4e063dc2c8cfbfcb99035bb73018.webp
3. https://cdn.satellite.earth/4e676f41809805ef84719c244c84b36e1b3af69698b92e30e947b4812e7ff241.webp

### Screenshot 1: Main Feed
- **URL:** https://cdn.satellite.earth/03b136945e39297d8d9a6cf97af702de038a2b594a89fc988a78dff97667e2eb.webp
- **Type:** Main feed/home timeline
- **Elements:** Post cards, user avatars, action buttons, tab navigation
- **Layout:** Card-based list with media previews

### Screenshot 2: Profile/Details
- **URL:** https://cdn.satellite.earth/9f3138becf917f83e471c85128859def0a9b4e063dc2c8cfbfcb99035bb73018.webp
- **Type:** User profile view
- **Elements:** Profile header, bio, stats (followers/following), post grid
- **Layout:** Header with scrollable content below

### Screenshot 3: Compose/Create
- **URL:** https://cdn.satellite.earth/4e676f41809805ef84719c244c84b36e1b3af69698b92e30e947b4812e7ff241.webp
- **Type:** Notifications/activity feed or compose interface
- **Elements:** Notification cards, user mentions, reactions, zaps
- **Layout:** Chronological list with activity types

## Missing Features to Implement

1. Stories/Highlights (like Instagram) - **NOT PRESENT**
2. Advanced search filters
3. Bookmark saving
4. Scheduled posts
5. Analytics dashboard
6. Bulk actions
7. Custom themes
8. Widget support

## Accessibility

- Android accessibility framework support
- Screen reader compatibility
- High contrast mode support
- Font scaling support
- TalkBack integration

## Security Features

- Private key encryption (NIP-49)
- KeyStore integration
- Biometric authentication
- Secure key backup/restore
- No server-side key storage

## Performance Characteristics

- Lazy loading for infinite scroll
- Image caching with blurhash
- Local database for offline access
- Efficient relay connection management
- Background sync support

## CDN Asset Pattern

All app screenshots and icons hosted on:
- **Base URL:** https://cdn.satellite.earth/
- **Format:** {SHA256_hash}.{extension}
- **Icon Format:** .png (1a4d9d7bb7f3e481aeb5f98b6626b5b4b85d90d59f4d4b00ffa7edbf1c19d6e7.png)
- **Screenshot Format:** .webp

**App Icon URL:**
https://cdn.satellite.earth/1a4d9d7bb7f3e481aeb5f98b6626b5b4b85d90d59f4d4b00ffa7edbf1c19d6e7.png

## Research Sources

1. **nostrapps.com/amethyst** - Primary source ✓ (verified Feb 13, 2026)
2. GitHub: vitorpamplona/amethyst - Comprehensive documentation
3. Google Play Store - App listing and screenshots
4. amethyst.social - Official website

## Research Date

February 13, 2026

---

**Researcher:** AI Agent (OpenCode)  
**Workflow:** improve-simulator Phase 1
