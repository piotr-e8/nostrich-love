/**
 * Nostrich.love Gamification System - Phase 2
 * Privacy-first badge and progress tracking system
 * 
 * Storage Schema:
 * - Primary: localStorage (privacy-preserving, no server contact)
 * - Key: 'nostrich-gamification-v1'
 * - Structure: { badges, progress, stats }
 * 
 * Features:
 * - 8 achievement badges with auto-award logic
 * - Progress tracking (guides, streaks, activity)
 * - Optional NIP-58 badge publishing to Nostr network
 */

import { generateSecretKey, getPublicKey, finalizeEvent, nip19 } from 'nostr-tools';

// =============================================================================
// TYPES
// =============================================================================

/** Unique identifier for each badge */
export type BadgeId = 
  | 'key-master'
  | 'first-post'
  | 'zap-receiver'
  | 'community-builder'
  | 'knowledge-seeker'
  | 'nostr-graduate'
  | 'security-conscious'
  | 'relay-explorer';

/** Badge rarity level for UI display */
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

/** Individual badge data structure */
export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  requirement: string;
}

/** Badge with earned status */
export interface EarnedBadge extends Badge {
  earned: boolean;
  earnedAt: number | null; // Unix timestamp in milliseconds
}

/** Storage format for earned badge status */
export interface BadgeStatus {
  earned: boolean;
  earnedAt: number; // Unix timestamp in milliseconds
}

/** User progress tracking */
export interface GamificationProgress {
  completedGuides: string[]; // Array of guide IDs
  streakDays: number; // Consecutive days active
  lastActive: number | null; // Unix timestamp of last activity
}

/** Additional statistics for progress calculation */
export interface GamificationStats {
  keysGenerated: boolean;
  firstPostMade: boolean;
  firstZapReceived: boolean;
  accountsFollowed: number;
  keysBackedUp: boolean;
  relaysConnected: number;
}

/** Complete gamification data stored in localStorage */
export interface GamificationData {
  badges: Record<BadgeId, BadgeStatus>;
  progress: GamificationProgress;
  stats: GamificationStats;
  version: number;
}

/** NIP-58 badge award event (Kind 8) */
export interface NIP58BadgeAward {
  kind: 8;
  pubkey: string;
  created_at: number;
  tags: string[][];
  content: string;
  id: string;
  sig: string;
}

/** Result of badge check operation */
export interface BadgeCheckResult {
  newlyEarned: BadgeId[];
  alreadyEarned: BadgeId[];
  progress: number; // 0-100 percentage
}

/** Progress calculation result */
export interface ProgressStats {
  totalBadges: number;
  earnedBadges: number;
  percentage: number;
  streakDays: number;
  guidesCompleted: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const GAMIFICATION_STORAGE_KEY = 'nostrich-gamification-v1';
const STORAGE_KEY = GAMIFICATION_STORAGE_KEY;
const CURRENT_VERSION = 1;

/** All 8 badge definitions */
export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'key-master',
    name: 'Key Master',
    description: 'Generated your first Nostr key pair',
    icon: '🔑',
    rarity: 'common',
    requirement: 'Generate keys in the Key Generator',
  },
  {
    id: 'first-post',
    name: 'First Post',
    description: 'Made your first post on Nostr',
    icon: '📝',
    rarity: 'common',
    requirement: 'Publish your first note',
  },
  {
    id: 'zap-receiver',
    name: 'Zap Receiver',
    description: 'Received your first Lightning zap',
    icon: '⚡',
    rarity: 'rare',
    requirement: 'Receive a zap from another user',
  },
  {
    id: 'community-builder',
    name: 'Community Builder',
    description: 'Followed 10 or more accounts',
    icon: '🤝',
    rarity: 'common',
    requirement: 'Follow 10+ accounts',
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Completed 3 beginner guides',
    icon: '📚',
    rarity: 'rare',
    requirement: 'Complete any 3 guides',
  },
  {
    id: 'nostr-graduate',
    name: 'Nostr Graduate',
    description: 'Completed all beginner guides',
    icon: '🎓',
    rarity: 'epic',
    requirement: 'Complete every beginner guide',
  },
  {
    id: 'security-conscious',
    name: 'Security Conscious',
    description: 'Backed up your private keys',
    icon: '🛡️',
    rarity: 'rare',
    requirement: 'Backup your keys using the backup feature',
  },
  {
    id: 'relay-explorer',
    name: 'Relay Explorer',
    description: 'Connected to 3 or more relays',
    icon: '🌐',
    rarity: 'common',
    requirement: 'Connect to 3+ relays',
  },
];

/** Total number of beginner guides (for Nostr Graduate calculation) */
const TOTAL_BEGINNER_GUIDES = 9; // Based on the sequence in guides/index.astro

// =============================================================================
// STORAGE FUNCTIONS
// =============================================================================

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Get default gamification data structure
 */
function getDefaultData(): GamificationData {
  const badges: Record<BadgeId, BadgeStatus> = {} as Record<BadgeId, BadgeStatus>;
  
  // Initialize all badges as not earned
  BADGE_DEFINITIONS.forEach((badge) => {
    badges[badge.id] = {
      earned: false,
      earnedAt: 0,
    };
  });

  return {
    badges,
    progress: {
      completedGuides: [],
      streakDays: 0,
      lastActive: null,
    },
    stats: {
      keysGenerated: false,
      firstPostMade: false,
      firstZapReceived: false,
      accountsFollowed: 0,
      keysBackedUp: false,
      relaysConnected: 0,
    },
    version: CURRENT_VERSION,
  };
}

/**
 * Load gamification data from localStorage
 * @returns Current gamification data or default if not found
 */
export function loadGamificationData(): GamificationData {
  if (!isBrowser()) {
    return getDefaultData();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as GamificationData;
      
      // Migration: ensure all badge IDs exist
      const defaultData = getDefaultData();
      BADGE_DEFINITIONS.forEach((badge) => {
        if (!parsed.badges[badge.id]) {
          parsed.badges[badge.id] = { earned: false, earnedAt: 0 };
        }
      });
      
      return parsed;
    }
  } catch (error) {
    console.warn('Error loading gamification data:', error);
  }

  return getDefaultData();
}

/**
 * Save gamification data to localStorage
 * @param data - Gamification data to save
 */
export function saveGamificationData(data: GamificationData): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Error saving gamification data:', error);
  }
}

/**
 * Clear all gamification data (for testing or reset)
 */
export function clearGamificationData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export gamification data as JSON string
 * @returns JSON string of all gamification data
 */
export function exportGamificationData(): string {
  const data = loadGamificationData();
  return JSON.stringify(data, null, 2);
}

/**
 * Import gamification data from JSON string
 * @param jsonString - JSON string to import
 * @returns True if import successful
 */
export function importGamificationData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as GamificationData;
    
    // Validate structure
    if (data.badges && data.progress && data.stats && data.version) {
      saveGamificationData(data);
      return true;
    }
  } catch (error) {
    console.error('Error importing gamification data:', error);
  }
  return false;
}

// =============================================================================
// BADGE FUNCTIONS
// =============================================================================

/**
 * Get all badge definitions with current earned status
 * @returns Array of badges with earned status
 */
export function getAllBadges(): EarnedBadge[] {
  const data = loadGamificationData();
  
  return BADGE_DEFINITIONS.map((badge) => ({
    ...badge,
    earned: data.badges[badge.id].earned,
    earnedAt: data.badges[badge.id].earnedAt || null,
  }));
}

/**
 * Get a specific badge by ID
 * @param badgeId - Badge identifier
 * @returns Badge with earned status or null if not found
 */
export function getBadge(badgeId: BadgeId): EarnedBadge | null {
  const data = loadGamificationData();
  const definition = BADGE_DEFINITIONS.find((b) => b.id === badgeId);
  
  if (!definition) return null;
  
  return {
    ...definition,
    earned: data.badges[badgeId].earned,
    earnedAt: data.badges[badgeId].earnedAt || null,
  };
}

/**
 * Check if a specific badge has been earned
 * @param badgeId - Badge identifier
 * @returns True if badge is earned
 */
export function hasBadge(badgeId: BadgeId): boolean {
  const data = loadGamificationData();
  return data.badges[badgeId]?.earned ?? false;
}

/**
 * Award a badge to the user
 * @param badgeId - Badge identifier to award
 * @returns True if badge was newly awarded, false if already had it
 */
export function awardBadge(badgeId: BadgeId): boolean {
  const data = loadGamificationData();
  
  if (data.badges[badgeId].earned) {
    return false; // Already earned
  }
  
  data.badges[badgeId] = {
    earned: true,
    earnedAt: Date.now(),
  };
  
  saveGamificationData(data);
  return true;
}

/**
 * Get earned badges sorted by earn date (newest first)
 * @returns Array of earned badges
 */
export function getEarnedBadges(): EarnedBadge[] {
  const badges = getAllBadges();
  return badges
    .filter((b) => b.earned)
    .sort((a, b) => (b.earnedAt || 0) - (a.earnedAt || 0));
}

/**
 * Get unearned badges
 * @returns Array of badges not yet earned
 */
export function getUnearnedBadges(): EarnedBadge[] {
  const badges = getAllBadges();
  return badges.filter((b) => !b.earned);
}

// =============================================================================
// PROGRESS TRACKING
// =============================================================================

/**
 * Mark a guide as completed
 * @param guideId - Guide identifier
 */
export function completeGuide(guideId: string): void {
  const data = loadGamificationData();
  
  if (!data.progress.completedGuides.includes(guideId)) {
    data.progress.completedGuides.push(guideId);
    saveGamificationData(data);
    
    // Trigger badge check after completing a guide
    checkAndAwardBadges();
  }
}

/**
 * Get list of completed guide IDs
 * @returns Array of completed guide IDs
 */
export function getCompletedGuides(): string[] {
  const data = loadGamificationData();
  return [...data.progress.completedGuides];
}

/**
 * Check if a specific guide is completed
 * @param guideId - Guide identifier
 * @returns True if guide is completed
 */
export function isGuideCompleted(guideId: string): boolean {
  const data = loadGamificationData();
  return data.progress.completedGuides.includes(guideId);
}

/**
 * Update activity timestamp and calculate streak
 * Call this when user performs any activity
 */
export function recordActivity(): void {
  const data = loadGamificationData();
  const now = Date.now();
  const lastActive = data.progress.lastActive;
  
  if (lastActive) {
    const lastDate = new Date(lastActive).setHours(0, 0, 0, 0);
    const today = new Date(now).setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day
      data.progress.streakDays += 1;
    } else if (daysDiff > 1) {
      // Streak broken
      data.progress.streakDays = 1;
    }
    // If same day, don't change streak
  } else {
    // First activity
    data.progress.streakDays = 1;
  }
  
  data.progress.lastActive = now;
  saveGamificationData(data);
}

/**
 * Get current streak information
 * @returns Object with streak days and last active timestamp
 */
export function getStreakInfo(): { streakDays: number; lastActive: number | null } {
  const data = loadGamificationData();
  return {
    streakDays: data.progress.streakDays,
    lastActive: data.progress.lastActive,
  };
}

/**
 * Calculate overall progress percentage
 * @returns Progress stats including percentage
 */
export function calculateProgress(): ProgressStats {
  const data = loadGamificationData();
  const totalBadges = BADGE_DEFINITIONS.length;
  const earnedBadges = BADGE_DEFINITIONS.filter(
    (b) => data.badges[b.id].earned
  ).length;
  
  return {
    totalBadges,
    earnedBadges,
    percentage: Math.round((earnedBadges / totalBadges) * 100),
    streakDays: data.progress.streakDays,
    guidesCompleted: data.progress.completedGuides.length,
  };
}

// =============================================================================
// STATS FUNCTIONS
// =============================================================================

/**
 * Record that keys were generated
 */
export function recordKeysGenerated(): void {
  const data = loadGamificationData();
  data.stats.keysGenerated = true;
  saveGamificationData(data);
  checkAndAwardBadges();
}

/**
 * Record first post
 */
export function recordFirstPost(): void {
  const data = loadGamificationData();
  data.stats.firstPostMade = true;
  saveGamificationData(data);
  checkAndAwardBadges();
}

/**
 * Record first zap received
 */
export function recordZapReceived(): void {
  const data = loadGamificationData();
  data.stats.firstZapReceived = true;
  saveGamificationData(data);
  checkAndAwardBadges();
}

/**
 * Update followed accounts count
 * @param count - Number of accounts followed
 */
export function updateFollowedAccounts(count: number): void {
  const data = loadGamificationData();
  data.stats.accountsFollowed = count;
  saveGamificationData(data);
  checkAndAwardBadges();
}

/**
 * Record keys backup
 */
export function recordKeysBackedUp(): void {
  const data = loadGamificationData();
  data.stats.keysBackedUp = true;
  saveGamificationData(data);
  checkAndAwardBadges();
}

/**
 * Update connected relays count
 * @param count - Number of relays connected
 */
export function updateConnectedRelays(count: number): void {
  const data = loadGamificationData();
  data.stats.relaysConnected = count;
  saveGamificationData(data);
  checkAndAwardBadges();
}

// =============================================================================
// BADGE CHECKING & AUTO-AWARD
// =============================================================================

/**
 * Check all badge requirements and auto-award eligible badges
 * @returns Result with newly earned and already earned badges
 */
export function checkAndAwardBadges(): BadgeCheckResult {
  const data = loadGamificationData();
  const newlyEarned: BadgeId[] = [];
  const alreadyEarned: BadgeId[] = [];
  
  // Check each badge
  BADGE_DEFINITIONS.forEach((badge) => {
    if (data.badges[badge.id].earned) {
      alreadyEarned.push(badge.id);
      return;
    }
    
    const shouldAward = checkBadgeRequirement(badge.id, data);
    
    if (shouldAward) {
      data.badges[badge.id] = {
        earned: true,
        earnedAt: Date.now(),
      };
      newlyEarned.push(badge.id);
    }
  });
  
  // Save if any badges were awarded
  if (newlyEarned.length > 0) {
    saveGamificationData(data);
  }
  
  const progress = calculateProgress();
  
  return {
    newlyEarned,
    alreadyEarned,
    progress: progress.percentage,
  };
}

/**
 * Check if requirements are met for a specific badge
 * @param badgeId - Badge to check
 * @param data - Current gamification data
 * @returns True if requirements are met
 */
function checkBadgeRequirement(badgeId: BadgeId, data: GamificationData): boolean {
  switch (badgeId) {
    case 'key-master':
      return data.stats.keysGenerated;
      
    case 'first-post':
      return data.stats.firstPostMade;
      
    case 'zap-receiver':
      return data.stats.firstZapReceived;
      
    case 'community-builder':
      return data.stats.accountsFollowed >= 10;
      
    case 'knowledge-seeker':
      return data.progress.completedGuides.length >= 3;
      
    case 'nostr-graduate':
      return data.progress.completedGuides.length >= TOTAL_BEGINNER_GUIDES;
      
    case 'security-conscious':
      return data.stats.keysBackedUp;
      
    case 'relay-explorer':
      return data.stats.relaysConnected >= 3;
      
    default:
      return false;
  }
}

// =============================================================================
// NIP-58 BADGE PUBLISHING (OPTIONAL)
// =============================================================================

/**
 * NIP-58 Badge Definition URI
 * These are example URIs - in production, these would point to actual badge definitions
 * hosted on a Nostr relay or external service
 */
const NIP58_BADGE_URIS: Record<BadgeId, string> = {
  'key-master': 'nostr:badges:key-master:nostrich-love',
  'first-post': 'nostr:badges:first-post:nostrich-love',
  'zap-receiver': 'nostr:badges:zap-receiver:nostrich-love',
  'community-builder': 'nostr:badges:community-builder:nostrich-love',
  'knowledge-seeker': 'nostr:badges:knowledge-seeker:nostrich-love',
  'nostr-graduate': 'nostr:badges:nostr-graduate:nostrich-love',
  'security-conscious': 'nostr:badges:security-conscious:nostrich-love',
  'relay-explorer': 'nostr:badges:relay-explorer:nostrich-love',
};

/**
 * Create a NIP-58 badge award event (Kind 8)
 * 
 * IMPORTANT: This is OPTIONAL functionality. Users can choose to publish
 * their badges to the Nostr network, but it's not required for the badges
 * to function in the local gamification system.
 * 
 * NIP-58 defines:
 * - Kind 30009: Badge Definition (created by badge issuer)
 * - Kind 8: Badge Award (issued to recipients)
 * 
 * This function creates a Kind 8 event that awards a badge to the user's pubkey.
 * 
 * @param badgeId - Badge to publish
 * @param npub - User's npub (public key in bech32 format)
 * @param privateKeyHex - User's private key in hex format (needed for signing)
 * @returns Signed Nostr event ready to publish, or null if error
 */
export function publishBadgeToNostr(
  badgeId: BadgeId,
  npub: string,
  privateKeyHex: string
): NIP58BadgeAward | null {
  try {
    // Verify the badge is earned
    if (!hasBadge(badgeId)) {
      console.warn(`Cannot publish unearned badge: ${badgeId}`);
      return null;
    }
    
    // Decode npub to get hex pubkey
    const decoded = nip19.decode(npub);
    if (decoded.type !== 'npub') {
      throw new Error('Invalid npub format');
    }
    const pubkey = decoded.data as string;
    
    // Convert private key from hex to Uint8Array
    const privateKey = hexToBytes(privateKeyHex);
    
    // Get badge URI
    const badgeUri = NIP58_BADGE_URIS[badgeId];
    
    // Create Kind 8 event (Badge Award)
    const event = {
      kind: 8,
      pubkey,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['a', `30009:${pubkey}:${badgeId}`], // Badge definition reference
        ['p', pubkey], // Awarded to
        ['u', badgeUri], // Badge URI
      ],
      content: '', // Badge awards typically have empty content
    };
    
    // Sign the event
    const signedEvent = finalizeEvent(event, privateKey) as NIP58BadgeAward;
    
    return signedEvent;
  } catch (error) {
    console.error('Error creating NIP-58 badge award:', error);
    return null;
  }
}

/**
 * Publish multiple badges to Nostr at once
 * 
 * @param badgeIds - Array of badge IDs to publish
 * @param npub - User's npub
 * @param privateKeyHex - User's private key in hex
 * @returns Array of signed events
 */
export function publishMultipleBadgesToNostr(
  badgeIds: BadgeId[],
  npub: string,
  privateKeyHex: string
): NIP58BadgeAward[] {
  return badgeIds
    .map((id) => publishBadgeToNostr(id, npub, privateKeyHex))
    .filter((event): event is NIP58BadgeAward => event !== null);
}

/**
 * Helper function to convert hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get badge rarity color for UI theming
 * @param rarity - Badge rarity level
 * @returns Tailwind color class
 */
export function getBadgeRarityColor(rarity: BadgeRarity): string {
  switch (rarity) {
    case 'common':
      return 'text-gray-500 bg-gray-100';
    case 'rare':
      return 'text-blue-500 bg-blue-100';
    case 'epic':
      return 'text-purple-500 bg-purple-100';
    case 'legendary':
      return 'text-yellow-500 bg-yellow-100';
    default:
      return 'text-gray-500 bg-gray-100';
  }
}

/**
 * Format timestamp to readable date
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export function formatBadgeEarnedDate(timestamp: number | null): string {
  if (!timestamp) return 'Not earned yet';
  
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get next badge to earn (closest to requirements)
 * @returns Badge that is closest to being earned, or null if all earned
 */
export function getNextBadgeToEarn(): EarnedBadge | null {
  const data = loadGamificationData();
  const unearned = BADGE_DEFINITIONS.filter((b) => !data.badges[b.id].earned);
  
  if (unearned.length === 0) return null;
  
  // Calculate progress towards each unearned badge
  const badgeProgress = unearned.map((badge) => {
    let progress = 0;
    let target = 1;
    
    switch (badge.id) {
      case 'community-builder':
        progress = data.stats.accountsFollowed;
        target = 10;
        break;
      case 'knowledge-seeker':
        progress = data.progress.completedGuides.length;
        target = 3;
        break;
      case 'nostr-graduate':
        progress = data.progress.completedGuides.length;
        target = TOTAL_BEGINNER_GUIDES;
        break;
      case 'relay-explorer':
        progress = data.stats.relaysConnected;
        target = 3;
        break;
      default:
        // Binary badges (0 or 1)
        progress = checkBadgeRequirement(badge.id, data) ? 1 : 0;
        target = 1;
    }
    
    return { badge, percent: progress / target };
  });
  
  // Sort by closest to completion (highest percentage)
  badgeProgress.sort((a, b) => b.percent - a.percent);
  
  const next = badgeProgress[0];
  return {
    ...next.badge,
    earned: false,
    earnedAt: null,
  };
}

// =============================================================================
// REACT HOOK (Optional)
// =============================================================================

/**
 * React hook for using gamification in components
 * This is a simple wrapper - for production, consider using useLocalStorage
 * or a state management library
 * 
 * Example usage:
 * ```tsx
 * const { badges, progress, completeGuide } = useGamification();
 * ```
 */
export function useGamification() {
  return {
    // Data getters
    getAllBadges,
    getEarnedBadges,
    getUnearnedBadges,
    getBadge,
    hasBadge,
    calculateProgress,
    getStreakInfo,
    getCompletedGuides,
    isGuideCompleted,
    getNextBadgeToEarn,
    
    // Action functions
    completeGuide,
    recordActivity,
    recordKeysGenerated,
    recordFirstPost,
    recordZapReceived,
    updateFollowedAccounts,
    recordKeysBackedUp,
    updateConnectedRelays,
    checkAndAwardBadges,
    awardBadge,
    
    // NIP-58 publishing (optional)
    publishBadgeToNostr,
    publishMultipleBadgesToNostr,
    
    // Storage functions
    exportGamificationData,
    importGamificationData,
    clearGamificationData,
    
    // Utilities
    formatBadgeEarnedDate,
    getBadgeRarityColor,
    
    // Constants
    BADGE_DEFINITIONS,
    TOTAL_BEGINNER_GUIDES,
  };
}

// Default export for convenient importing
export default {
  BADGE_DEFINITIONS,
  TOTAL_BEGINNER_GUIDES,
  loadGamificationData,
  saveGamificationData,
  getAllBadges,
  getEarnedBadges,
  getUnearnedBadges,
  getBadge,
  hasBadge,
  awardBadge,
  completeGuide,
  getCompletedGuides,
  isGuideCompleted,
  recordActivity,
  getStreakInfo,
  calculateProgress,
  recordKeysGenerated,
  recordFirstPost,
  recordZapReceived,
  updateFollowedAccounts,
  recordKeysBackedUp,
  updateConnectedRelays,
  checkAndAwardBadges,
  publishBadgeToNostr,
  publishMultipleBadgesToNostr,
  exportGamificationData,
  importGamificationData,
  clearGamificationData,
  formatBadgeEarnedDate,
  getBadgeRarityColor,
  getNextBadgeToEarn,
  useGamification,
};
