/**
 * Mock Event Structure Utilities
 * Utilities for creating and manipulating mock Nostr events
 */

import type { 
  NostrEvent, 
  MockNote, 
  MockUser, 
  MockReaction,
  EventKind 
} from '../../../data/mock/types';

// ============================================
// EVENT ID GENERATION
// ============================================

/**
 * Generate a mock event ID (64 hex characters)
 */
export function generateEventId(): string {
  return Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

/**
 * Generate a mock signature (128 hex characters)
 */
export function generateSignature(): string {
  return Array.from({ length: 128 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

// ============================================
// TIMESTAMP UTILITIES
// ============================================

/**
 * Get current Unix timestamp
 */
export function now(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Generate a timestamp within the last N hours
 */
export function recentTimestamp(hoursAgo: number = 24): number {
  const now_ts = now();
  const secondsAgo = hoursAgo * 3600;
  return now_ts - Math.floor(Math.random() * secondsAgo);
}

/**
 * Generate a timestamp within a date range
 */
export function timestampInRange(startDate: Date, endDate: Date): number {
  const start = Math.floor(startDate.getTime() / 1000);
  const end = Math.floor(endDate.getTime() / 1000);
  return start + Math.floor(Math.random() * (end - start));
}

/**
 * Format timestamp to relative time (e.g., "2h ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now_ts = now();
  const diff = now_ts - timestamp;
  
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format timestamp to absolute time
 */
export function formatAbsoluteTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ============================================
// TAG UTILITIES
// ============================================

/**
 * Create a mention tag (NIP-08/NIP-27)
 */
export function createMentionTag(pubkey: string, relayUrl?: string): string[] {
  const tag = ['p', pubkey];
  if (relayUrl) tag.push(relayUrl);
  return tag;
}

/**
 * Create an event reference tag (NIP-10)
 */
export function createEventRefTag(
  eventId: string, 
  relayUrl?: string, 
  marker?: 'reply' | 'root' | 'mention'
): string[] {
  const tag = ['e', eventId];
  if (relayUrl) tag.push(relayUrl);
  if (marker) tag.push(marker);
  return tag;
}

/**
 * Create a subject tag (NIP-14)
 */
export function createSubjectTag(subject: string): string[] {
  return ['subject', subject];
}

/**
 * Extract mentions from tags
 */
export function extractMentions(tags: string[][]): string[] {
  return tags
    .filter(tag => tag[0] === 'p')
    .map(tag => tag[1])
    .filter(Boolean);
}

/**
 * Extract hashtags from content
 */
export function extractHashtags(content: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const matches = content.match(hashtagRegex);
  return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : [];
}

/**
 * Extract URLs from content
 */
export function extractUrls(content: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return content.match(urlRegex) || [];
}

/**
 * Extract image URLs from content
 */
export function extractImageUrls(content: string): string[] {
  const urls = extractUrls(content);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return urls.filter(url => 
    imageExtensions.some(ext => url.toLowerCase().includes(ext))
  );
}

// ============================================
// CONTENT UTILITIES
// ============================================

/**
 * Parse content and replace mentions with display names
 */
export function parseContentWithMentions(
  content: string, 
  userMap: Map<string, MockUser>
): string {
  // Simple mention replacement (NIP-08 style)
  let parsed = content;
  
  // Replace nostr:npub1... mentions
  const mentionRegex = /nostr:npub1[a-z0-9]+/g;
  parsed = parsed.replace(mentionRegex, (match) => {
    const npub = match.replace('nostr:', '');
    const user = Array.from(userMap.values()).find(u => u.pubkey === npub);
    return user ? `@${user.displayName || user.username}` : match;
  });
  
  return parsed;
}

/**
 * Truncate content to specified length
 */
export function truncateContent(content: string, maxLength: number = 280): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength - 3) + '...';
}

/**
 * Check if content is a reply (contains reply tags)
 */
export function isReply(tags: string[][]): boolean {
  return tags.some(tag => 
    tag[0] === 'e' && (tag[3] === 'reply' || tag[3] === 'root')
  );
}

/**
 * Get root event ID from tags
 */
export function getRootEventId(tags: string[][]): string | null {
  const rootTag = tags.find(tag => tag[0] === 'e' && tag[3] === 'root');
  return rootTag ? rootTag[1] : null;
}

/**
 * Get parent event ID from tags (reply marker)
 */
export function getParentEventId(tags: string[][]): string | null {
  const replyTag = tags.find(tag => tag[0] === 'e' && tag[3] === 'reply');
  return replyTag ? replyTag[1] : null;
}

// ============================================
// EVENT VALIDATION
// ============================================

/**
 * Validate event structure (mock validation)
 */
export function validateEvent(event: Partial<NostrEvent>): boolean {
  if (!event.id || event.id.length !== 64) return false;
  if (!event.pubkey || event.pubkey.length !== 64) return false;
  if (typeof event.created_at !== 'number') return false;
  if (typeof event.kind !== 'number') return false;
  if (!Array.isArray(event.tags)) return false;
  if (typeof event.content !== 'string') return false;
  if (!event.sig || event.sig.length !== 128) return false;
  return true;
}

/**
 * Check if event is a text note
 */
export function isTextNote(event: NostrEvent): boolean {
  return event.kind === EventKind.TEXT_NOTE;
}

/**
 * Check if event is a metadata event (profile)
 */
export function isMetadataEvent(event: NostrEvent): boolean {
  return event.kind === EventKind.METADATA;
}

/**
 * Check if event is a contacts list
 */
export function isContactsEvent(event: NostrEvent): boolean {
  return event.kind === EventKind.CONTACTS;
}

// ============================================
// MOCK EVENT CREATION
// ============================================

interface CreateMockNoteOptions {
  content: string;
  authorPubkey: string;
  replyTo?: string;
  rootEvent?: string;
  tags?: string[][];
  created_at?: number;
}

/**
 * Create a mock note with proper structure
 */
export function createMockNote(options: CreateMockNoteOptions): MockNote {
  const id = generateEventId();
  const created_at = options.created_at || now();
  
  const tags: string[][] = [...(options.tags || [])];
  
  // Add reply tags if specified
  if (options.rootEvent) {
    tags.push(createEventRefTag(options.rootEvent, undefined, 'root'));
  }
  if (options.replyTo) {
    tags.push(createEventRefTag(options.replyTo, undefined, 'reply'));
  }
  
  // Extract and add hashtag tags
  const hashtags = extractHashtags(options.content);
  hashtags.forEach(tag => {
    if (!tags.some(t => t[0] === 't' && t[1] === tag)) {
      tags.push(['t', tag]);
    }
  });
  
  return {
    id,
    pubkey: options.authorPubkey,
    created_at,
    kind: EventKind.TEXT_NOTE,
    tags,
    content: options.content,
    sig: generateSignature(),
    likes: 0,
    reposts: 0,
    replies: 0,
    zaps: 0,
    zapAmount: 0,
    images: extractImageUrls(options.content),
    mentions: extractMentions(tags),
    hashtags,
    links: extractUrls(options.content),
    category: 'nostr' as const,
  };
}

/**
 * Create a mock reaction event
 */
export function createMockReaction(
  targetEventId: string,
  targetPubkey: string,
  reactorPubkey: string,
  content: string = '+'
): MockReaction {
  return {
    id: generateEventId(),
    pubkey: reactorPubkey,
    created_at: now(),
    kind: EventKind.REACTION,
    tags: [
      ['e', targetEventId],
      ['p', targetPubkey],
    ],
    content,
    sig: generateSignature(),
    targetEventId,
    targetPubkey,
  };
}

// ============================================
// SORTING UTILITIES
// ============================================

/**
 * Sort events by timestamp (newest first)
 */
export function sortByTimestampDesc<T extends { created_at: number }>(
  events: T[]
): T[] {
  return [...events].sort((a, b) => b.created_at - a.created_at);
}

/**
 * Sort events by timestamp (oldest first)
 */
export function sortByTimestampAsc<T extends { created_at: number }>(
  events: T[]
): T[] {
  return [...events].sort((a, b) => a.created_at - b.created_at);
}

/**
 * Sort notes by engagement (likes + reposts + replies + zaps)
 */
export function sortByEngagement(notes: MockNote[]): MockNote[] {
  return [...notes].sort((a, b) => {
    const engagementA = a.likes + a.reposts + a.replies + a.zaps;
    const engagementB = b.likes + b.reposts + b.replies + b.zaps;
    return engagementB - engagementA;
  });
}

// ============================================
// FILTER UTILITIES
// ============================================

interface FilterOptions {
  authors?: string[];
  kinds?: number[];
  since?: number;
  until?: number;
  limit?: number;
}

/**
 * Filter events by criteria
 */
export function filterEvents<T extends NostrEvent>(
  events: T[],
  options: FilterOptions
): T[] {
  return events.filter(event => {
    if (options.authors && !options.authors.includes(event.pubkey)) return false;
    if (options.kinds && !options.kinds.includes(event.kind)) return false;
    if (options.since && event.created_at < options.since) return false;
    if (options.until && event.created_at > options.until) return false;
    return true;
  }).slice(0, options.limit);
}

/**
 * Filter notes by search query
 */
export function filterBySearch(notes: MockNote[], query: string): MockNote[] {
  const lowerQuery = query.toLowerCase();
  return notes.filter(note => 
    note.content.toLowerCase().includes(lowerQuery) ||
    note.hashtags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
