# Damus Features

Complete breakdown of all features implemented in the Damus simulator.

## Feature Overview

Damus simulator implements **9 core features** that match the real iOS client:

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 1 | Direct Messages | | Private messaging between users |
| 2 | Zaps | | Lightning Network payments |
| 3 | Threads/Replies | | Conversation threading |
| 4 | Search | | Find users and content |
| 5 | Relay Management | | Connect to Nostr relays |
| 6 | Badges | | NIP-58 badge display |
| 7 | NIP-05 Identity | | Verified username system |
| 8 | Mute Lists | | Block/mute functionality |
| 9 | Pinned Notes | | Pin important posts |

---

## 1. Direct Messages (DMs)

### What It Is
Private, encrypted messaging between Nostr users.

### How It Works in Real Damus
- End-to-end encrypted using NIP-04
- Messages stored on relays
- Only sender and recipient can decrypt

### Simulator Implementation
- **Visual**: DM conversation list and chat interface
- **Interactive**: Send/receive simulated messages
- **Limitations**: No real encryption, messages are simulated

### User Flow
1. Tap Messages tab
2. See conversation list
3. Tap conversation to open
4. View message history
5. Type and send new messages

### Screens
- **Messages List**: Shows active conversations
- **Conversation View**: Individual chat thread
- **New Message**: Start conversation with user

### Visual Elements
- **Conversation List**: Avatar, name, last message preview, timestamp
- **Chat Bubbles**: Different colors for sent/received
- **Input Field**: Text input with send button
- **Encryption Badge**: Shows "Encrypted" indicator

---

## 2. Zaps

### What It Is
Lightning Network payments to tip/support content creators.

### How It Works in Real Damus
- Uses NIP-57 (Lightning Zaps)
- Sends Bitcoin over Lightning Network
- Can include messages with zaps
- Shows zap amount publicly

### Simulator Implementation
- **Visual**: Zap button and dialog
- **Interactive**: Click to simulate zapping
- **Limitations**: No real Bitcoin transactions

### User Flow
1. Find post to zap
2. Tap lightning bolt icon
3. Select amount (100, 1000, 10000 sats)
4. Add optional message
5. Tap "Zap" to confirm
6. See zap animation

### Visual Elements
- **Zap Button**: Lightning bolt icon with count
- **Zap Dialog**: Amount selector, message input
- **Zap Animation**: Visual feedback on action
- **Zap Receipt**: Shows completed zap

### Zap Amounts
- 100 sats (small tip)
- 1,000 sats (standard tip)
- 10,000 sats (generous tip)
- Custom amount (if implemented)

---

## 3. Threads and Replies

### What It Is
Nested conversation threads for organized discussions.

### How It Works in Real Damus
- Replies reference parent note (NIP-10)
- Thread view shows full conversation
- Indentation shows reply depth

### Simulator Implementation
- **Visual**: Thread view with nested replies
- **Interactive**: Reply to posts, view threads
- **Limitations**: Simplified threading logic

### User Flow
1. Tap any post
2. View thread with original post
3. See all replies in chronological order
4. Tap "Reply" to add response
5. View reply in thread context

### Visual Elements
- **Root Post**: Original post at top
- **Reply Cards**: Indented based on depth
- **Reply Lines**: Connect replies visually
- **Reply Count**: Shows total replies

### Thread Depth
- **Level 0**: Original post
- **Level 1**: Direct replies
- **Level 2**: Replies to replies
- **Level 3+**: Deep nesting (may be collapsed)

---

## 4. Search

### What It Is
Find users, posts, and hashtags across Nostr.

### How It Works in Real Damus
- Searches across connected relays
- Real-time results
- Supports npub, hashtags, keywords

### Simulator Implementation
- **Visual**: Search bar and results
- **Interactive**: Type queries, view results
- **Limitations**: Searches mock data only

### User Flow
1. Tap Search tab
2. Enter search query
3. View results in real-time
4. Tap result to view details
5. Filter by users, posts, or hashtags

### Search Types
- **User Search**: Find by display name or npub
- **Content Search**: Find posts by text
- **Hashtag Search**: Find #topics
- **Npub Search**: Direct lookup by public key

### Visual Elements
- **Search Bar**: Text input with clear button
- **Search Tabs**: Users, Posts, Hashtags
- **Result Cards**: Preview of each result
- **Recent Searches**: History of past searches

---

## 5. Relay Management

### What It Is
Connect to Nostr relays to publish and retrieve content.

### How It Works in Real Damus
- Connects to WebSocket relays
- Reads events from relays
- Publishes events to relays
- Each relay has read/write policies

### Simulator Implementation
- **Visual**: Relay list with connection status
- **Interactive**: Connect/disconnect relays
- **Limitations**: No real relay connections

### User Flow
1. Go to Settings
2. Tap "Relays"
3. View current relays
4. Toggle relay connections
5. Add new relay URL
6. Set read/write policies

### Relay States
- **Connected**: Green indicator, actively used
- **Connecting**: Yellow indicator, in progress
- **Disconnected**: Gray indicator, not connected
- **Error**: Red indicator, connection failed

### Visual Elements
- **Relay List**: URL, status, latency
- **Toggle Switches**: Connect/disconnect
- **Policy Badges**: Read, Write indicators
- **Add Relay**: Input field for new URL

### Default Relays
- wss://relay.damus.io
- wss://nostr.wine
- wss://relay.nostr.band
- wss://nos.lol

---

## 6. Badges

### What It Is
NIP-58 badges awarded to users for achievements.

### How It Works in Real Damus
- Badges issued by badge creators
- Displayed on user profiles
- Prove participation or achievements

### Simulator Implementation
- **Visual**: Badge display on profiles
- **Interactive**: View badge details
- **Limitations**: Static badge display

### User Flow
1. View user profile
2. See badges section
3. Tap badge to view details
4. See badge name, description, issuer

### Visual Elements
- **Badge Icons**: Small thumbnail images
- **Badge Grid**: Multiple badges display
- **Badge Detail**: Full badge information
- **Badge Count**: Shows total badges

### Common Badges
- Early Adopter
- Nostr Developer
- Content Creator
- Event Attendee

---

## 7. NIP-05 Identity

### What It Is
Verified human-readable usernames using DNS (NIP-05).

### How It Works in Real Damus
- Maps email-like addresses to pubkeys
- Verified via DNS TXT records
- Shows checkmark for verified users

### Simulator Implementation
- **Visual**: Checkmark badge on verified users
- **Interactive**: Tap to view NIP-05 info
- **Limitations**: Mock verification display

### User Flow
1. Browse feed or profiles
2. Look for checkmark icons
3. Tap verified name to see full NIP-05
4. View format: `username@domain.com`

### Visual Elements
- **Checkmark Badge**: Blue verified icon
- **NIP-05 Display**: username@domain format
- **Verification Info**: Shows domain and proof

### Example NIP-05
- `jack@cash.app`
- `fiatjaf@fiatjaf.com`
- `pablo@primal.net`

---

## 8. Mute Lists

### What It Is
Block or mute users and content you don't want to see.

### How It Works in Real Damus
- Muted users' posts hidden from feed
- Muted words filter content
- Stored in user's contact list

### Simulator Implementation
- **Visual**: Mute settings interface
- **Interactive**: Mute/unmute users
- **Limitations**: Session-only muting

### User Flow
1. Go to Settings
2. Tap "Muted Users" or "Muted Words"
3. Add user or word to mute list
4. Remove items from mute list
5. Muted content no longer appears

### Mute Types
- **Mute User**: Hide all posts from user
- **Mute Thread**: Hide specific conversation
- **Mute Word**: Hide posts containing word

### Visual Elements
- **Mute List**: Shows muted items
- **Add Button**: Add new mute
- **Remove Button**: Unmute items
- **Mute Toggle**: Quick mute/unmute

---

## 9. Pinned Notes

### What It Is
Pin important posts to the top of your profile.

### How It Works in Real Damus
- Pinned notes appear first on profile
- Only shows on your own profile view
- Limited number of pinned notes

### Simulator Implementation
- **Visual**: Pinned section on profile
- **Interactive**: Pin/unpin posts
- **Limitations**: Session-only pinning

### User Flow
1. Find post to pin
2. Tap post menu (...)
3. Select "Pin to Profile"
4. View profile to see pinned note
5. Unpin by repeating steps

### Visual Elements
- **Pinned Indicator**: Pin icon on posts
- **Pinned Section**: Separate area on profile
- **Pin Button**: Menu option to pin/unpin
- **Pin Count**: Shows number of pinned notes

### Pin Limits
- Typically 1-5 pins per profile
- Oldest pins auto-unpin when limit reached

---

## Feature Comparison

### Damus vs Other Clients

| Feature | Damus | Amethyst | Primal | Snort | YakiHonne | Coracle | Gossip |
|---------|-------|----------|--------|-------|-----------|---------|--------|
| DMs | | | | | | | |
| Zaps | | | | | | | |
| Threads | | | | | | | |
| Search | | | | | | | |
| Relays | | | | | | | |
| Badges | | | | | | | |
| NIP-05 | | | | | | | |
| Mute List | | | | | | | |
| Pinned Notes | | | | | | | |
| Long-form | - | | | - | | | |
| Live Stream | - | | - | - | | | - |
| Marketplace | - | - | | - | - | | - |

**Legend:** - Complete  - Planned - Not Available

---

## Feature Usage Tips

### For Beginners
1. **Start with Feed**: Browse and like posts
2. **Try Replies**: Join conversations
3. **Explore Search**: Find interesting users
4. **Send DMs**: Private messaging
5. **Try Zapping**: Support creators

### For Power Users
1. **Relay Management**: Optimize your relay set
2. **Mute Lists**: Curate your experience
3. **Pinned Notes**: Showcase your best content
4. **NIP-05**: Get verified identity
5. **Badges**: Collect achievements

### Best Practices
- Use DMs for private conversations
- Zap quality content you enjoy
- Mute rather than argue
- Pin your most important posts
- Verify your identity with NIP-05

---

## Technical Implementation Notes

### State Management
Each feature uses the shared `useSimulator` hook:

```typescript
const { 
  state,
  likeNote,
  createReply,
  followUser,
  zapNote,
  connectRelay,
  muteUser,
  pinNote 
} = useSimulator();
```

### Feature Detection
Check if client supports a feature:

```typescript
const supportsZaps = config.supportedFeatures.includes(
  SimulatorFeature.ZAPS
);
```

### Feature-Specific UI
Show UI elements only for supported features:

```typescript
{supportsZaps && (
  <button onClick={() => openZapDialog(note)}>
    <ZapIcon />
  </button>
)}
```

---

## Future Enhancements

### Planned Features
- [ ] Reactions beyond likes
- [ ] Bookmarks
- [ ] Lists/Circles
- [ ] Content warnings
- [ ] Image galleries
- [ ] Video support
- [ ] Polls
- [ ] Calendar events

### Under Consideration
- Nostr Wallet Connect integration
- Cashu tokens
- Nostr Marketplace
- Advanced search filters

---

## Feature Requests

To request new features:
1. Check if feature exists in real Damus
2. Review existing feature requests
3. Submit detailed proposal
4. Include use cases and mockups

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
