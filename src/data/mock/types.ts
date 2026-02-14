/**
 * Nostr Event Types and Mock Data Interfaces
 * Based on NIP-01 and related specifications
 */

// Nostr Event Kinds
export enum EventKind {
  METADATA = 0,        // User metadata (profile)
  TEXT_NOTE = 1,       // Text post
  RECOMMEND_SERVER = 2, // Relay recommendation
  CONTACTS = 3,        // Contact list/following
  ENCRYPTED_DM = 4,    // Encrypted direct message
  DELETE = 5,          // Deletion request
  REPOST = 6,          // Repost/boost
  REACTION = 7,        // Reaction/like
  BADGE_AWARD = 8,     // Badge award
  CHAT_MESSAGE = 9,    // Chat message
  THREAD = 11,         // Thread
  LIVE_CHAT_MESSAGE = 1311,
  ZAP_REQUEST = 9734,  // Zap request
  ZAP = 9735,          // Zap receipt
  HIGHLIGHT = 9802,    // Highlight
  LONG_FORM = 30023,   // Long-form content (article)
  FILE_HEADER = 1063,  // File header
}

// Base Nostr Event Interface
export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: EventKind;
  tags: string[][];
  content: string;
  sig: string;
}

// Mock User Profile (Kind 0)
export interface MockUser {
  pubkey: string;           // npub format
  displayName: string;
  username: string;
  avatar: string;           // URL or gradient CSS
  bio: string;
  website?: string;
  location?: string;
  lightningAddress?: string;
  nip05?: string;
  followersCount: number;
  followingCount: number;
  createdAt: number;
  lastActive: number;
  // Internal fields
  isVerified?: boolean;
  badges?: string[];
}

// Mock Note/Post (Kind 1)
export interface MockNote {
  id: string;
  pubkey: string;
  created_at: number;
  kind: EventKind.TEXT_NOTE | EventKind.REPOST | EventKind.LONG_FORM;
  tags: string[][];
  content: string;
  sig: string;
  // Enrichment fields
  likes: number;
  reposts: number;
  replies: number;
  zaps: number;
  zapAmount: number;        // Total sats zapped
  isRepost?: boolean;
  repostedBy?: string;      // pubkey of reposter
  images?: string[];        // Attached image URLs
  mentions?: string[];      // Mentioned user pubkeys
  hashtags?: string[];      // Extracted hashtags
  links?: string[];         // URLs in content
  category: ContentCategory;
  community?: string;       // Community/forum the note was posted in
  isLive?: boolean;         // Whether the post is from a live stream
}

// Mock Thread (conversation)
export interface MockThread {
  id: string;
  rootNoteId: string;
  participants: string[];   // Array of pubkeys
  notes: MockNote[];        // All notes in thread, including root
  replyCount: number;
  lastActivity: number;
  category: ContentCategory;
}

// Mock Relay Configuration
export interface MockRelay {
  id: string;
  url: string;
  name: string;
  description: string;
  owner?: string;
  supportedNips: number[];
  software?: string;
  version?: string;
  isPaid: boolean;
  paymentTerms?: string;    // e.g., "1000 sats/month"
  isOnline: boolean;
  latency: number;          // ms
  userCount: number;        // Connected users
  lastSeen: number;         // Last successful connection
  restrictions?: {
    authRequired: boolean;
    paymentRequired: boolean;
    writeRestricted: boolean;
  };
  features?: string[];      // e.g., ["search", "trending"]
}

// Mock Reaction (Kind 7)
export interface MockReaction {
  id: string;
  pubkey: string;
  created_at: number;
  kind: EventKind.REACTION;
  tags: string[][];         // ["e", <event-id>], ["p", <pubkey>]
  content: string;          // Emoji or "+"
  sig: string;
  targetEventId: string;
  targetPubkey: string;
}

// Mock Contact List (Kind 3)
export interface MockContactList {
  pubkey: string;
  created_at: number;
  kind: EventKind.CONTACTS;
  tags: string[][];         // ["p", <pubkey>, <relay-url>, <petname>]
  content: string;          // Usually empty or encrypted
  sig: string;
  following: string[];      // Array of pubkeys being followed
}

// Content Categories for Organization
export enum ContentCategory {
  BITCOIN = 'bitcoin',
  TECH = 'tech',
  PROGRAMMING = 'programming',
  PHILOSOPHY = 'philosophy',
  PERSONAL = 'personal',
  MEMES = 'memes',
  QUESTIONS = 'questions',
  NOSTR = 'nostr',
  ART = 'art',
  MUSIC = 'music',
  POLITICS = 'politics',
  SCIENCE = 'science',
  NEWS = 'news',
  OTHER = 'other',
}

// Content Themes for Generation
export interface ContentTheme {
  category: ContentCategory;
  topics: string[];
  hashtags: string[];
  tone: 'serious' | 'casual' | 'humorous' | 'technical' | 'inspirational';
}

// Feed Filters
export interface FeedFilter {
  kinds?: EventKind[];
  authors?: string[];
  since?: number;
  until?: number;
  tags?: Record<string, string[]>;
  search?: string;
  category?: ContentCategory;
}

// Export all mock data types
declare global {
  interface Window {
    __MOCK_DATA__?: {
      users: MockUser[];
      notes: MockNote[];
      threads: MockThread[];
      relays: MockRelay[];
    };
  }
}
