/**
 * Nostr Client Simulator - Core Types
 * Foundation types for all 7 client simulators
 */

import type { MockUser, MockNote, MockRelay, EventKind } from '../../../data/mock/types';

// Re-export mock data types for convenience
export type { MockUser, MockNote, MockRelay, EventKind };

// ============================================
// SIMULATOR IDENTIFICATION
// ============================================

export enum SimulatorClient {
  DAMUS = 'damus',
  AMETHYST = 'amethyst',
  PRIMAL = 'primal',
  SNORT = 'snort',
  YAKIHONNE = 'yakihonne',
  CORACLE = 'coracle',
  GOSSIP = 'gossip',
  KEYCHAT = 'keychat',
  OLAS = 'olas',
}

export interface SimulatorConfig {
  id: SimulatorClient;
  name: string;
  description: string;
  platform: 'ios' | 'android' | 'web' | 'desktop';
  primaryColor: string;
  secondaryColor: string;
  icon: string;
  supportedFeatures: SimulatorFeature[];
  defaultView: SimulatorView;
}

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

// ============================================
// SIMULATOR STATE
// ============================================

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

export interface SimulatorUser {
  pubkey: string;
  npub: string;
  displayName: string;
  username: string;
  avatar: string;
  bio: string;
  website?: string;
  location?: string;
  lightningAddress?: string;
  nip05?: string;
  followersCount: number;
  followingCount: number;
  notesCount: number;
  createdAt: number;
  isVerified: boolean;
}

export interface SimulatorFeedItem {
  id: string;
  type: 'note' | 'repost' | 'reply' | 'long_form';
  note: MockNote;
  author: SimulatorUser;
  repostedBy?: SimulatorUser;
  isRead: boolean;
  timestamp: number;
}

export interface SimulatorNotification {
  id: string;
  type: 'like' | 'repost' | 'reply' | 'zap' | 'follow' | 'mention';
  actor: SimulatorUser;
  targetNote?: MockNote;
  timestamp: number;
  isRead: boolean;
  amount?: number; // For zaps
}

export interface SimulatorMessage {
  id: string;
  pubkey: string;
  content: string;
  timestamp: number;
  isRead: boolean;
  isOutgoing: boolean;
}

export interface SimulatorThread {
  rootNote: MockNote;
  rootAuthor: SimulatorUser;
  replies: SimulatorReply[];
}

export interface SimulatorReply {
  note: MockNote;
  author: SimulatorUser;
  parentId: string;
  depth: number;
}

export interface SimulatorRelayConfig {
  url: string;
  isConnected: boolean;
  isDefault: boolean;
  isPaid: boolean;
  readPolicy: boolean;
  writePolicy: boolean;
  latency: number;
}

export interface SimulatorSearchResult {
  users: SimulatorUser[];
  notes: MockNote[];
  hashtags: string[];
}

// ============================================
// SIMULATOR ACTIONS
// ============================================

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

// ============================================
// SIMULATOR CONTEXT
// ============================================

import type { Dispatch } from 'react';

export interface SimulatorContextValue {
  state: SimulatorState;
  dispatch: Dispatch<SimulatorAction>;
  config: SimulatorConfig;
  // Convenience methods
  login: (user: SimulatorUser) => void;
  logout: () => void;
  navigateTo: (view: SimulatorView) => void;
  goBack: () => void;
  openModal: (modal: SimulatorModal, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  likeNote: (noteId: string) => void;
  unlikeNote: (noteId: string) => void;
  repostNote: (noteId: string) => void;
  unrepostNote: (noteId: string) => void;
  createNote: (content: string, tags?: string[][]) => void;
  createReply: (parentId: string, content: string) => void;
  followUser: (pubkey: string) => void;
  unfollowUser: (pubkey: string) => void;
  muteUser: (pubkey: string) => void;
  unmuteUser: (pubkey: string) => void;
  pinNote: (noteId: string) => void;
  unpinNote: (noteId: string) => void;
  connectRelay: (url: string) => void;
  disconnectRelay: (url: string) => void;
  search: (query: string) => void;
  zapNote: (noteId: string, amount: number, message?: string) => void;
}

// ============================================
// MOCK KEY TYPES
// ============================================

export interface MockKeyPair {
  pubkey: string;
  npub: string;
  nsec: string;
  displayName: string;
}

export interface KeyDisplayProps {
  npub: string;
  nsec?: string;
  showCopy?: boolean;
  showQr?: boolean;
  compact?: boolean;
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface SimulatorShellProps {
  children: React.ReactNode;
  config: SimulatorConfig;
  className?: string;
}

export interface SimulatorHeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export interface SimulatorNavigationProps {
  activeView: SimulatorView;
  onNavigate: (view: SimulatorView) => void;
}

export interface NoteCardProps {
  item: SimulatorFeedItem;
  compact?: boolean;
  showActions?: boolean;
  onLike?: () => void;
  onRepost?: () => void;
  onReply?: () => void;
  onZap?: () => void;
  onShare?: () => void;
}

export interface UserAvatarProps {
  user: SimulatorUser;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  onClick?: () => void;
}

export interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  replyTo?: MockNote;
  onSubmit: (content: string) => void;
}
