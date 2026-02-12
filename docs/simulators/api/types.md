# API Reference - Types

Complete TypeScript type definitions for the Nostr Client Simulator system.

## Table of Contents

- [Core Enums](#core-enums)
- [Configuration Types](#configuration-types)
- [State Types](#state-types)
- [User Types](#user-types)
- [Content Types](#content-types)
- [Social Types](#social-types)
- [Relay Types](#relay-types)
- [Action Types](#action-types)
- [Component Prop Types](#component-prop-types)
- [Mock Data Types](#mock-data-types)

## Core Enums

### SimulatorClient

Identifies which Nostr client is being simulated.

```typescript
export enum SimulatorClient {
  DAMUS = 'damus',
  AMETHYST = 'amethyst',
  PRIMAL = 'primal',
  SNORT = 'snort',
  YAKIHONNE = 'yakihonne',
  CORACLE = 'coracle',
  GOSSIP = 'gossip',
}
```

**Usage:**
```typescript
const isDamus = config.id === SimulatorClient.DAMUS;
```

---

### SimulatorFeature

Features that clients may support.

```typescript
export enum SimulatorFeature {
  DM = 'dm',
  ZAPS = 'zaps',
  THREADS = 'threads',
  SEARCH = 'search',
  RELAYS = 'relays',
  BADGES = 'badges',
  NIP05 = 'nip05',
  LONG_FORM = 'long_form',
  LIVE_STREAMING = 'live_streaming',
  MARKETPLACE = 'marketplace',
  MUTE_LIST = 'mute_list',
  PINNED_NOTES = 'pinned_notes',
}
```

**Usage:**
```typescript
const supportsZaps = config.supportedFeatures.includes(
  SimulatorFeature.ZAPS
);
```

---

### SimulatorView

Available navigation views/screens.

```typescript
export enum SimulatorView {
  HOME = 'home',
  FEED = 'feed',
  NOTIFICATIONS = 'notifications',
  MESSAGES = 'messages',
  PROFILE = 'profile',
  SEARCH = 'search',
  SETTINGS = 'settings',
  THREAD = 'thread',
  RELAYS = 'relays',
  EXPLORE = 'explore',
}
```

**Usage:**
```typescript
navigateTo(SimulatorView.PROFILE);
```

---

### SimulatorModal

Available modal dialogs.

```typescript
export enum SimulatorModal {
  NONE = 'none',
  COMPOSE = 'compose',
  RELAY_DETAILS = 'relay_details',
  USER_PROFILE = 'user_profile',
  SETTINGS = 'settings',
  SEARCH = 'search',
  IMAGE_VIEWER = 'image_viewer',
  ZAP = 'zap',
  REACTIONS = 'reactions',
  SHARE = 'share',
}
```

**Usage:**
```typescript
openModal(SimulatorModal.COMPOSE);
```

## Configuration Types

### SimulatorConfig

Configuration object for each client simulator.

```typescript
export interface SimulatorConfig {
  /** Unique client identifier */
  id: SimulatorClient;
  
  /** Display name */
  name: string;
  
  /** Brief description */
  description: string;
  
  /** Target platform */
  platform: 'ios' | 'android' | 'web' | 'desktop';
  
  /** Primary brand color (hex) */
  primaryColor: string;
  
  /** Secondary brand color (hex) */
  secondaryColor: string;
  
  /** Path to client icon */
  icon: string;
  
  /** List of supported features */
  supportedFeatures: SimulatorFeature[];
  
  /** Default view on load */
  defaultView: SimulatorView;
}
```

**Example:**
```typescript
const damusConfig: SimulatorConfig = {
  id: SimulatorClient.DAMUS,
  name: 'Damus',
  description: 'The Nostr client for iOS',
  platform: 'ios',
  primaryColor: '#8B5CF6',
  secondaryColor: '#A78BFA',
  icon: '/icons/damus.png',
  supportedFeatures: [
    SimulatorFeature.DM,
    SimulatorFeature.ZAPS,
    SimulatorFeature.THREADS,
  ],
  defaultView: SimulatorView.FEED,
};
```

## State Types

### SimulatorState

Complete state object managed by useSimulator hook.

```typescript
export interface SimulatorState {
  // Identity
  currentUser: SimulatorUser | null;
  isLoggedIn: boolean;
  
  // Navigation
  currentView: SimulatorView;
  previousView: SimulatorView | null;
  activeModal: SimulatorModal;
  modalData: Record<string, unknown> | null;
  
  // Content
  feed: SimulatorFeedItem[];
  notifications: SimulatorNotification[];
  messages: SimulatorMessage[];
  currentThread: SimulatorThread | null;
  
  // Social
  following: string[];
  followers: string[];
  mutedUsers: string[];
  mutedWords: string[];
  pinnedNotes: string[];
  
  // Relays
  connectedRelays: string[];
  relayConfigs: Record<string, SimulatorRelayConfig>;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  searchResults: SimulatorSearchResult | null;
  
  // Session metadata
  sessionStartTime: number;
  lastActivityTime: number;
}
```

### SimulatorContextValue

Context value provided by SimulatorProvider.

```typescript
export interface SimulatorContextValue {
  // State and dispatch
  state: SimulatorState;
  dispatch: Dispatch<SimulatorAction>;
  config: SimulatorConfig;
  
  // Auth actions
  login: (user: SimulatorUser) => void;
  logout: () => void;
  
  // Navigation actions
  navigateTo: (view: SimulatorView) => void;
  goBack: () => void;
  openModal: (modal: SimulatorModal, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  
  // Content actions
  likeNote: (noteId: string) => void;
  unlikeNote: (noteId: string) => void;
  repostNote: (noteId: string) => void;
  unrepostNote: (noteId: string) => void;
  createNote: (content: string, tags?: string[][]) => void;
  createReply: (parentId: string, content: string) => void;
  
  // Social actions
  followUser: (pubkey: string) => void;
  unfollowUser: (pubkey: string) => void;
  muteUser: (pubkey: string) => void;
  unmuteUser: (pubkey: string) => void;
  pinNote: (noteId: string) => void;
  unpinNote: (noteId: string) => void;
  
  // Relay actions
  connectRelay: (url: string) => void;
  disconnectRelay: (url: string) => void;
  
  // Other actions
  search: (query: string) => void;
  zapNote: (noteId: string, amount: number, message?: string) => void;
}
```

## User Types

### SimulatorUser

User profile representation.

```typescript
export interface SimulatorUser {
  /** Public key (hex) */
  pubkey: string;
  
  /** Public key (bech32 npub) */
  npub: string;
  
  /** Display name */
  displayName: string;
  
  /** Username handle */
  username: string;
  
  /** Avatar URL */
  avatar: string;
  
  /** Bio text */
  bio: string;
  
  /** Website URL (optional) */
  website?: string;
  
  /** Location (optional) */
  location?: string;
  
  /** Lightning address (optional) */
  lightningAddress?: string;
  
  /** NIP-05 identifier (optional) */
  nip05?: string;
  
  /** Follower count */
  followersCount: number;
  
  /** Following count */
  followingCount: number;
  
  /** Notes count */
  notesCount: number;
  
  /** Account creation timestamp */
  createdAt: number;
  
  /** NIP-05 verification status */
  isVerified: boolean;
}
```

**Example:**
```typescript
const user: SimulatorUser = {
  pubkey: 'abc123...',
  npub: 'npub1abc...',
  displayName: 'Alice',
  username: 'alice',
  avatar: '/avatars/alice.png',
  bio: 'Nostr enthusiast',
  nip05: 'alice@example.com',
  followersCount: 150,
  followingCount: 75,
  notesCount: 42,
  createdAt: 1704067200,
  isVerified: true,
};
```

## Content Types

### SimulatorFeedItem

Item in the main feed.

```typescript
export interface SimulatorFeedItem {
  /** Unique item ID */
  id: string;
  
  /** Content type */
  type: 'note' | 'repost' | 'reply' | 'long_form';
  
  /** The note content */
  note: MockNote;
  
  /** Note author */
  author: SimulatorUser;
  
  /** User who reposted (if repost) */
  repostedBy?: SimulatorUser;
  
  /** Read status */
  isRead: boolean;
  
  /** Timestamp */
  timestamp: number;
}
```

### SimulatorNotification

User notification.

```typescript
export interface SimulatorNotification {
  /** Unique notification ID */
  id: string;
  
  /** Notification type */
  type: 'like' | 'repost' | 'reply' | 'zap' | 'follow' | 'mention';
  
  /** User who triggered notification */
  actor: SimulatorUser;
  
  /** Related note (if applicable) */
  targetNote?: MockNote;
  
  /** Timestamp */
  timestamp: number;
  
  /** Read status */
  isRead: boolean;
  
  /** Zap amount (for zap notifications) */
  amount?: number;
}
```

### SimulatorMessage

Direct message.

```typescript
export interface SimulatorMessage {
  /** Unique message ID */
  id: string;
  
  /** Conversation partner's pubkey */
  pubkey: string;
  
  /** Message content */
  content: string;
  
  /** Timestamp */
  timestamp: number;
  
  /** Read status */
  isRead: boolean;
  
  /** True if sent by current user */
  isOutgoing: boolean;
}
```

### SimulatorThread

Conversation thread.

```typescript
export interface SimulatorThread {
  /** Root/original note */
  rootNote: MockNote;
  
  /** Root note author */
  rootAuthor: SimulatorUser;
  
  /** All replies */
  replies: SimulatorReply[];
}

export interface SimulatorReply {
  /** Reply note */
  note: MockNote;
  
  /** Reply author */
  author: SimulatorUser;
  
  /** Parent note ID */
  parentId: string;
  
  /** Nesting depth */
  depth: number;
}
```

## Social Types

### SimulatorSearchResult

Search results structure.

```typescript
export interface SimulatorSearchResult {
  /** Matching users */
  users: SimulatorUser[];
  
  /** Matching notes */
  notes: MockNote[];
  
  /** Matching hashtags */
  hashtags: string[];
}
```

## Relay Types

### SimulatorRelayConfig

Relay connection configuration.

```typescript
export interface SimulatorRelayConfig {
  /** Relay URL */
  url: string;
  
  /** Connection status */
  isConnected: boolean;
  
  /** Is default relay */
  isDefault: boolean;
  
  /** Is paid relay */
  isPaid: boolean;
  
  /** Read policy (receive events) */
  readPolicy: boolean;
  
  /** Write policy (publish events) */
  writePolicy: boolean;
  
  /** Connection latency in ms */
  latency: number;
}
```

## Action Types

### SimulatorAction

All possible state actions (discriminated union).

```typescript
export type SimulatorAction =
  | { type: 'LOGIN'; payload: { user: SimulatorUser } }
  | { type: 'LOGOUT' }
  | { type: 'SET_VIEW'; payload: { view: SimulatorView } }
  | { type: 'GO_BACK' }
  | { type: 'OPEN_MODAL'; payload: { modal: SimulatorModal; data?: Record<string, unknown> } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_FEED'; payload: { feed: SimulatorFeedItem[] } }
  | { type: 'ADD_FEED_ITEMS'; payload: { items: SimulatorFeedItem[] } }
  | { type: 'LIKE_NOTE'; payload: { noteId: string } }
  | { type: 'UNLIKE_NOTE'; payload: { noteId: string } }
  | { type: 'REPOST_NOTE'; payload: { noteId: string } }
  | { type: 'UNREPOST_NOTE'; payload: { noteId: string } }
  | { type: 'CREATE_NOTE'; payload: { content: string; tags?: string[][] } }
  | { type: 'CREATE_REPLY'; payload: { parentId: string; content: string } }
  | { type: 'FOLLOW_USER'; payload: { pubkey: string } }
  | { type: 'UNFOLLOW_USER'; payload: { pubkey: string } }
  | { type: 'MUTE_USER'; payload: { pubkey: string } }
  | { type: 'UNMUTE_USER'; payload: { pubkey: string } }
  | { type: 'PIN_NOTE'; payload: { noteId: string } }
  | { type: 'UNPIN_NOTE'; payload: { noteId: string } }
  | { type: 'CONNECT_RELAY'; payload: { url: string } }
  | { type: 'DISCONNECT_RELAY'; payload: { url: string } }
  | { type: 'SET_RELAY_POLICY'; payload: { url: string; read: boolean; write: boolean } }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'MARK_MESSAGES_READ'; payload: { pubkey: string } }
  | { type: 'SEARCH'; payload: { query: string } }
  | { type: 'SET_SEARCH_RESULTS'; payload: { results: SimulatorSearchResult } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'SET_THREAD'; payload: { thread: SimulatorThread | null } }
  | { type: 'UPDATE_USER_PROFILE'; payload: { updates: Partial<SimulatorUser> } }
  | { type: 'ZAP_NOTE'; payload: { noteId: string; amount: number; message?: string } }
  | { type: 'UPDATE_TIMESTAMP' };
```

**Usage:**
```typescript
// Direct dispatch
dispatch({ type: 'LIKE_NOTE', payload: { noteId: '123' } });

// Using convenience method
likeNote('123');
```

## Component Prop Types

### SimulatorShellProps

Props for the SimulatorShell component.

```typescript
export interface SimulatorShellProps {
  /** Child components */
  children: React.ReactNode;
  
  /** Client configuration */
  config: SimulatorConfig;
  
  /** Additional CSS classes */
  className?: string;
}
```

### SimulatorHeaderProps

Props for header components.

```typescript
export interface SimulatorHeaderProps {
  /** Header title */
  title?: string;
  
  /** Show back button */
  showBack?: boolean;
  
  /** Right-side action element */
  rightAction?: React.ReactNode;
}
```

### SimulatorNavigationProps

Props for navigation components.

```typescript
export interface SimulatorNavigationProps {
  /** Currently active view */
  activeView: SimulatorView;
  
  /** Navigation callback */
  onNavigate: (view: SimulatorView) => void;
}
```

### NoteCardProps

Props for note card components.

```typescript
export interface NoteCardProps {
  /** Feed item data */
  item: SimulatorFeedItem;
  
  /** Compact mode (no actions) */
  compact?: boolean;
  
  /** Show action buttons */
  showActions?: boolean;
  
  /** Like action callback */
  onLike?: () => void;
  
  /** Repost action callback */
  onRepost?: () => void;
  
  /** Reply action callback */
  onReply?: () => void;
  
  /** Zap action callback */
  onZap?: () => void;
  
  /** Share action callback */
  onShare?: () => void;
}
```

### UserAvatarProps

Props for avatar components.

```typescript
export interface UserAvatarProps {
  /** User data */
  user: SimulatorUser;
  
  /** Avatar size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** Show online status */
  showStatus?: boolean;
  
  /** Click handler */
  onClick?: () => void;
}
```

### ComposeModalProps

Props for compose modal.

```typescript
export interface ComposeModalProps {
  /** Modal visibility */
  isOpen: boolean;
  
  /** Close callback */
  onClose: () => void;
  
  /** Parent note (for replies) */
  replyTo?: MockNote;
  
  /** Submit callback */
  onSubmit: (content: string) => void;
}
```

## Mock Data Types

### MockKeyPair

Mock cryptographic key pair.

```typescript
export interface MockKeyPair {
  /** Public key (hex) */
  pubkey: string;
  
  /** Public key (bech32 npub) */
  npub: string;
  
  /** Private key (bech32 nsec) */
  nsec: string;
  
  /** Suggested display name */
  displayName: string;
}
```

### KeyDisplayProps

Props for key display component.

```typescript
export interface KeyDisplayProps {
  /** Public key (npub) */
  npub: string;
  
  /** Private key (nsec, optional) */
  nsec?: string;
  
  /** Show copy button */
  showCopy?: boolean;
  
  /** Show QR code */
  showQr?: boolean;
  
  /** Compact display mode */
  compact?: boolean;
}
```

## Type Utilities

### Extracting Types

```typescript
// Get action payload types
type LikeAction = Extract<SimulatorAction, { type: 'LIKE_NOTE' }>;
type LikePayload = LikeAction['payload']; // { noteId: string }

// Get state property types
type FeedType = SimulatorState['feed']; // SimulatorFeedItem[]

// Create partial types
type UserUpdate = Partial<SimulatorUser>;
```

### Type Guards

```typescript
function isFeedItem(item: unknown): item is SimulatorFeedItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'type' in item &&
    'note' in item
  );
}
```

## Import Reference

```typescript
// All types from shared module
import type {
  SimulatorClient,
  SimulatorConfig,
  SimulatorFeature,
  SimulatorView,
  SimulatorModal,
  SimulatorState,
  SimulatorContextValue,
  SimulatorUser,
  SimulatorFeedItem,
  SimulatorNotification,
  SimulatorMessage,
  SimulatorThread,
  SimulatorReply,
  SimulatorRelayConfig,
  SimulatorSearchResult,
  SimulatorAction,
  MockKeyPair,
  KeyDisplayProps,
  SimulatorShellProps,
  NoteCardProps,
  UserAvatarProps,
  ComposeModalProps,
} from '@/simulators/shared/types';

// Mock data types
import type {
  MockUser,
  MockNote,
  MockRelay,
  EventKind,
} from '@/data/mock/types';
```

## TypeScript Configuration

Recommended `tsconfig.json` settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Best Practices

1. **Use strict types**: Enable all strict TypeScript options
2. **Prefer interfaces over types**: For object shapes
3. **Use enums for fixed values**: Client IDs, views, features
4. **Export all public types**: From index.ts files
5. **Document with JSDoc**: Add descriptions to interfaces
6. **Use discriminated unions**: For actions with type field
7. **Leverage type inference**: Let TypeScript infer when clear

## See Also

- [Hooks API](./hooks.md) - Custom React hooks
- [Components API](./components.md) - Component props and usage
- [Architecture](../ARCHITECTURE.md) - System architecture
