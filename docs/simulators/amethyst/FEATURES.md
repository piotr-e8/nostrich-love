# Amethyst Features

Complete breakdown of all features implemented in the Amethyst simulator.

## Feature Overview

Amethyst simulator implements **10 core features**, making it the most feature-complete simulator:

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 1 | Direct Messages | | Private encrypted messaging |
| 2 | Zaps | | Lightning Network payments |
| 3 | Threads/Replies | | Conversation threading |
| 4 | Search | | Advanced content discovery |
| 5 | Relay Management | | Full relay controls |
| 6 | Badges | | NIP-58 achievements |
| 7 | NIP-05 Identity | | Verified usernames |
| 8 | Long-form Content | | Articles and blogs |
| 9 | Live Streaming | | NIP-53 live events |
| 10 | Mute Lists | | Content filtering |

---

## 1. Direct Messages (DMs)

### What It Is
End-to-end encrypted private messaging between Nostr users (NIP-04).

### Amethyst Implementation
- **Material Design**: Clean chat interface
- **Encryption Indicator**: Shows lock icon
- **Online Status**: Real-time presence (simulated)
- **Typing Indicators**: Shows when typing (simulated)

### User Flow
1. Tap Messages in bottom nav
2. View conversation list
3. Tap conversation to open
4. See message history
5. Type and send messages
6. See encryption badges

### Visual Elements
- **Conversation List**:
  - Avatar with online indicator (green dot)
  - Name and last message preview
  - Timestamp and unread badge
  - Encryption badge (lock icon)

- **Chat Interface**:
  - Material cards for messages
  - Different colors for sent/received
  - Timestamp on each message
  - Input field with send button
  - Message status (sent/delivered/read)

### Encryption Features
- **NIP-04**: Standard DM encryption
- **NIP-17**: Gift wrap for metadata privacy
- **Visual Lock**: Indicates encrypted
- **Key Exchange**: Simulated key sharing

### Message Types
- **Text**: Plain text messages
- **Media**: Images (if implemented)
- **Reactions**: Emoji responses
- **Voice**: Voice messages (if implemented)

---

## 2. Zaps

### What It Is
Lightning Network payments to tip content creators (NIP-57).

### Amethyst Implementation
- **Material Button**: Zap button with lightning icon
- **Amount Dialog**: Material dialog for amount selection
- **Message Support**: Optional zap message
- **Zap Receipts**: Visual confirmation

### User Flow
1. Find post to zap
2. Tap lightning bolt button
3. Select amount in dialog:
   - 100 sats
   - 1,000 sats
   - 10,000 sats
   - Custom amount
4. Add optional message
5. Tap "Zap" to confirm
6. See Material confirmation

### Visual Elements
- **Zap Button**:
  - Lightning bolt icon
  - Total zap count
  - Total sats zapped
  - Animated on tap

- **Zap Dialog**:
  - Material dialog container
  - Amount preset buttons
  - Custom amount input
  - Message text field
  - Zap button with ripple

- **Zap Receipt**:
  - Material card
  - Amount with Bitcoin symbol
  - Sender info
  - Message (if included)
  - Timestamp

### Zap Features
- **Anonymous Zaps**: Send without revealing identity
- **Public Zaps**: Visible to everyone
- **Zap Messages**: Include text with payment
- **Zap Splits**: Auto-split to multiple recipients

---

## 3. Threads and Replies

### What It Is
Nested conversation threading for organized discussions (NIP-10).

### Amethyst Implementation
- **Material Cards**: Elevated reply cards
- **Thread Lines**: Visual connections
- **Reply Context**: Shows parent post
- **Depth Indicators**: Nesting levels

### User Flow
1. Tap any post
2. See full thread view
3. View root post at top
4. See replies in nested order
5. Tap "Reply" to respond
6. View your reply in context

### Visual Elements
- **Root Post**:
  - Full-size Material card
  - All engagement actions
  - Reply count badge

- **Reply Cards**:
  - Elevated Material cards
  - Indentation shows depth
  - Connector lines
  - Collapsible threads

- **Thread Actions**:
  - Reply button
  - Like/repost/zap
  - View parent
  - Copy link

### Thread Features
- **Thread Collapse**: Hide/show branches
- **Jump to Parent**: Navigate up thread
- **Reply Context**: Shows quoted text
- **Thread Summary**: Shows total replies

---

## 4. Search

### What It Is
Advanced content and user discovery with filters.

### Amethyst Implementation
- **Material SearchBar**: Elevated search input
- **Categories**: Users, Notes, Hashtags
- **Trending**: Popular topics
- **Recent History**: Past searches

### User Flow
1. Tap Search in bottom nav
2. See Material SearchBar
3. Enter search query
4. View categorized results
5. Tap result to view
6. See recent searches

### Visual Elements
- **SearchBar**:
  - Elevated container
  - Leading search icon
  - Text input field
  - Trailing clear button
  - Ripple effects

- **Results Categories**:
  - **Users**: Avatar, name, NIP-05
  - **Notes**: Preview, author, time
  - **Hashtags**: Tag name, post count

- **Trending Section**:
  - Material chips
  - Trending hashtags
  - Hot topics
  - Tap to search

- **Recent Searches**:
  - List of past queries
  - Delete individual
  - Clear all option

### Search Features
- **Instant Results**: Real-time filtering
- **Npub Search**: Direct key lookup
- **Hashtag Discovery**: Browse topics
- **Advanced Filters**: Date, type, author

---

## 5. Relay Management

### What It Is
Full control over Nostr relay connections.

### Amethyst Implementation
- **Material List**: Relay list with actions
- **Connection States**: Visual indicators
- **Policy Controls**: Read/write toggles
- **Performance Metrics**: Latency display

### User Flow
1. Go to Settings → Relays
2. View current relay list
3. Toggle relay on/off
4. Tap relay for details
5. Add new relay URL
6. Set read/write policy

### Visual Elements
- **Relay List Items**:
  - Material list item
  - URL text
  - Connection status badge
  - Latency indicator
  - Toggle switch

- **Connection Status**:
  - **Connected**: Green badge
  - **Connecting**: Yellow badge with spinner
  - **Disconnected**: Gray badge
  - **Error**: Red badge

- **Relay Details**:
  - Material dialog
  - Full URL
  - Connection info
  - Policy toggles:
    - Read (receive events)
    - Write (publish events)
  - Remove button

- **Add Relay**:
  - Text input field
  - URL validation
  - Add button with ripple

### Relay Features
- **Multiple Relays**: Connect to many
- **Relay Sets**: Save preset groups
- **Paid Relays**: Support paid services
- **NIP-65**: Relay recommendations

---

## 6. Badges

### What It Is
NIP-58 badges for achievements and participation.

### Amethyst Implementation
- **Material Chips**: Badge display
- **Badge Grid**: Organized layout
- **Detail View**: Full badge info
- **Issuer Info**: Shows creator

### User Flow
1. View user profile
2. Scroll to badges section
3. See badge chips
4. Tap badge for details
5. View name, description, issuer

### Visual Elements
- **Badge Display**:
  - Material chip design
  - Badge thumbnail
  - Badge name
  - Tap to expand

- **Badge Grid**:
  - Responsive grid layout
  - Multiple rows
  - Count indicator
  - "View All" button

- **Badge Detail**:
  - Material dialog
  - Large badge image
  - Full name
  - Description text
  - Issuer information
  - Award date

### Badge Types
- **Participation**: Event attendance
- **Achievement**: Milestones reached
- **Community**: Group membership
- **Skills**: Technical abilities
- **Reputation**: Social standing

---

## 7. NIP-05 Identity

### What It Is
Verified human-readable identifiers (username@domain.com).

### Amethyst Implementation
- **Verified Badge**: Blue checkmark
- **NIP-05 Display**: Email-like format
- **Verification Info**: Shows proof
- **Domain Linking**: Tap to visit domain

### User Flow
1. Browse feed or profiles
2. Look for blue checkmark
3. Tap verified name
4. See full NIP-05 address
5. View verification details

### Visual Elements
- **Verified Badge**:
  - Blue Material icon
  - Tooltip on hover
  - Tap for details

- **NIP-05 Display**:
  - Username@domain format
  - Different color (often blue)
  - Tap to copy

- **Verification Card**:
  - Material card
  - Full NIP-05
  - Domain info
  - Verification date
  - Public key

### NIP-05 Features
- **Self-Hosted**: Verify your own domain
- **Service Providers**: Use verification services
- **Multiple Identities**: One key, multiple names
- **Revocation**: Remove verification

---

## 8. Long-form Content

### What It Is
NIP-23 long-form articles and blog posts.

### Amethyst Implementation
- **Article Cards**: Enhanced post cards
- **Reading View**: Full article layout
- **Metadata Display**: Title, summary, image
- **Article Actions**: Special actions for articles

### User Flow
1. Browse feed for articles
2. See article preview cards
3. Tap to read full article
4. View formatted content
5. Engage with article actions

### Visual Elements
- **Article Card**:
  - Featured image (hero)
  - Title (larger text)
  - Summary/preview
  - Author info
  - Read time estimate
  - "Read more" button

- **Article View**:
  - Full-screen reading mode
  - Large title
  - Author byline
  - Publication date
  - Formatted content
  - Engagement bar

- **Article Actions**:
  - Like, repost, zap
  - Bookmark
  - Share
  - Report

### Article Features
- **Markdown Support**: Rich formatting
- **Images**: Inline images
- **Links**: Clickable references
- **Table of Contents**: Navigation
- **Reading Time**: Estimate display

---

## 9. Live Streaming

### What It Is
NIP-53 live streaming events and participation.

### Amethyst Implementation
- **Live Indicators**: Red "LIVE" badges
- **Stream Cards**: Special live cards
- **Viewer Count**: Shows participants
- **Chat Integration**: Live chat (simulated)

### User Flow
1. Go to Home or Discover
2. Look for "LIVE" indicators
3. Tap live stream card
4. View stream (simulated)
5. See viewer count
6. Read live chat

### Visual Elements
- **Live Badge**:
  - Red "LIVE" pill badge
  - Pulsing animation
  - On profile/stream card

- **Stream Card**:
  - Video thumbnail (placeholder)
  - Stream title
  - Streamer info
  - Viewer count
  - Duration
  - "Watch" button

- **Stream View**:
  - Video player area (simulated)
  - Stream info panel
  - Chat sidebar
  - Viewer list
  - Stream controls

- **Live Chat**:
  - Message list
  - User avatars
  - Timestamps
  - Emoji support
  - Input field

### Live Features
- **Go Live**: Start your stream (simulated)
- **View Streams**: Watch others
- **Live Chat**: Real-time chat
- **Notifications**: Alerts for followed streamers
- **Recordings**: View past streams

---

## 10. Mute Lists

### What It Is
Filter unwanted users, words, and content.

### Amethyst Implementation
- **Settings Integration**: In app settings
- **Material Lists**: Organized mute lists
- **Quick Actions**: Easy add/remove
- **Import/Export**: Share mute lists

### User Flow
1. Go to Settings → Privacy
2. Tap "Muted Users" or "Muted Words"
3. View current mute list
4. Add new mute
5. Remove existing mute
6. Import/export lists

### Visual Elements
- **Mute List**:
  - Material list items
  - Avatar/name for users
  - Word text for words
  - Date muted
  - Remove button

- **Add Mute**:
  - Text input field
  - Search users
  - Add word
  - Confirm button

- **Mute Categories**:
  - **Muted Users**: Hide all from user
  - **Muted Words**: Filter content
  - **Muted Threads**: Hide conversation
  - **Muted Hashtags**: Filter topics

### Mute Features
- **Global Mute**: Across all views
- **Temporary Mute**: Time-limited
- **Regex Support**: Advanced filtering
- **Import Lists**: Load shared lists
- **Export Lists**: Share your filters

---

## Feature Comparison

### Amethyst vs Other Clients

| Feature | Amethyst | Damus | Primal | Snort | YakiHonne | Coracle | Gossip |
|---------|----------|-------|--------|-------|-----------|---------|--------|
| DMs | | | | | | | |
| Zaps | | | | | | | |
| Threads | | | | | | | |
| Search | | | | | | | |
| Relays | | | | | | | |
| Badges | | | | | | | |
| NIP-05 | | | | | | | |
| Long-form | | - | | - | | | |
| Live Stream | | - | - | - | | | - |
| Mute List | | | | | | | |
| Marketplace | - | - | | - | - | | - |
| Pinned Notes | - | | | | | | |

**Legend:** - Complete  - Planned - Not Available

### Amethyst Advantages
- **Most Features**: 10/10 core features
- **Live Streaming**: Unique feature
- **Long-form**: Full article support
- **Material Design**: Modern Android UI
- **Rich Settings**: Extensive customization

---

## Feature Usage Guide

### Beginner Path
1. **Home Feed**: Get familiar with content
2. **Like/Repost**: Engage with posts
3. **Compose**: Create your first post
4. **Profile**: Set up your identity
5. **Search**: Find interesting users

### Intermediate Path
1. **Threads**: Join conversations
2. **Zaps**: Support creators
3. **DMs**: Private messaging
4. **Relays**: Optimize connections
5. **Badges**: Collect achievements

### Advanced Path
1. **Live Streaming**: Go live
2. **Long-form**: Write articles
3. **NIP-05**: Verify identity
4. **Mute Lists**: Curate experience
5. **Community**: Join groups

### Power User Tips
- Use filter chips to customize feed
- Set up optimal relay configuration
- Verify your identity with NIP-05
- Create long-form content
- Go live to engage audience
- Use mute lists effectively
- Collect and display badges

---

## Technical Implementation

### State Management
```typescript
const {
  state,
  likeNote,
  createReply,
  followUser,
  zapNote,
  connectRelay,
  muteUser,
  pinNote,
  sendMessage,
  startLiveStream,
} = useSimulator();
```

### Feature Detection
```typescript
const hasFeature = (feature: SimulatorFeature) =>
  config.supportedFeatures.includes(feature);

const supportsLongForm = hasFeature(SimulatorFeature.LONG_FORM);
const supportsLiveStreaming = hasFeature(SimulatorFeature.LIVE_STREAMING);
```

### Conditional UI
```typescript
{supportsLongForm && (
  <FilterChip
    label="Articles"
    selected={filter === 'articles'}
    onClick={() => setFilter('articles')}
  />
)}

{supportsLiveStreaming && (
  <LiveBadge count={liveStreams.length} />
)}
```

---

## Future Enhancements

### Planned Features
- [ ] Bookmarks
- [ ] Lists/Circles
- [ ] Calendar Events
- [ ] Classifieds/Marketplace
- [ ] Polls and Surveys
- [ ] Audio Rooms
- [ ] Video Uploads
- [ ] Advanced Search

### Under Consideration
- Cashu ecash integration
- Nostr Wallet Connect
- Advanced moderation tools
- Cross-posting to other networks

---

## Feature Requests

To suggest new features:
1. Verify feature exists in real Amethyst
2. Check [FEATURES.md](./FEATURES.md) for current status
3. Submit detailed request with use cases
4. Include mockups if possible

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
