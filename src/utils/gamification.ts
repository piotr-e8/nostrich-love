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
 * - 9 achievement badges with auto-award logic
 * - Progress tracking (guides, streaks, activity)
 * - Quiz results: the only record here of understanding rather than attendance
 * - Optional NIP-58 badge publishing to Nostr network
 */

import { generateSecretKey, getPublicKey, finalizeEvent, nip19 } from 'nostr-tools';
import { SKILL_LEVELS, getLevelQuizzes, type SkillLevel } from '../data/learning-paths';

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
  | 'relay-explorer'
  | 'privacy-expert';

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

/**
 * Best result a reader has reached on one guide's quiz.
 *
 * Best-of, not last-of: retaking a quiz can only improve the record, so a reader
 * revisiting a guide months later cannot lose a level they already earned.
 */
export interface QuizResult {
  score: number;
  total: number;
  attempts: number;
  /** Timestamp of the first passing attempt; 0 while still unpassed. */
  passedAt: number;
}

/** A quiz counts as passed at this share of correct answers. */
export const QUIZ_PASS_RATIO = 0.7;

/** User progress tracking */
export interface GamificationProgress {
  // EXISTING FIELDS (keep these)
  completedGuides: string[]; // Array of guide IDs
  completedGuidesWithTimestamps?: { id: string; completedAt: string }[]; // Track when guides were completed
  /**
   * Quiz outcomes keyed by guide slug. This is the site's only record of
   * comprehension as opposed to attendance — everything else here counts visits.
   */
  quizResults: Record<string, QuizResult>;
  streakDays: number; // Consecutive days active
  lastActive: number | null; // Unix timestamp of last activity

  // LEGACY FIELDS (keep for migration, mark deprecated)
  /** @deprecated Use currentLevel instead */
  activePath?: string; // Currently selected learning path
  /** @deprecated Use completedByLevel instead */
  pathProgress?: Record<string, PathProgress>; // Per-path progress tracking

  // NEW FIELDS (add these)
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  unlockedLevels: ('beginner' | 'intermediate' | 'advanced')[];
  manualUnlock: boolean;
  completedByLevel: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
  lastInterestFilter: string | null;
}

export interface PathProgress {
  completedGuides: string[];
  startedAt: number;
  lastActiveAt: number;
}

/** Additional statistics for progress calculation */
export interface GamificationStats {
  keysGenerated: boolean;
  firstPostMade: boolean;
  firstZapReceived: boolean;
  accountsFollowed: number;
  keysBackedUp: boolean;
  relaysConnected: number;
  privacyQuizPerfectScore?: boolean;
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

/**
 * Name of the window CustomEvent fired whenever a badge is earned.
 * Shared by every award path and by BadgeEarnedModalListener so the
 * dispatcher and the listener can never drift apart again (#49).
 */
export const BADGE_EARNED_EVENT = 'badge-earned';

/**
 * Fired when a quiz is completed, carrying the result. Progress UI listens for
 * this so a reader who finishes a quiz sees their level move without a reload.
 * Same dispatcher/listener discipline as BADGE_EARNED_EVENT.
 */
export const QUIZ_COMPLETED_EVENT = 'quiz-completed';

export interface QuizCompletedDetail {
  guideSlug: string;
  /** This attempt's result — not necessarily the reader's best. */
  score: number;
  total: number;
  /** Did THIS attempt reach the pass mark? */
  attemptPassed: boolean;
  /**
   * Has the reader passed this quiz at all? Best-of, so it stays true after a
   * careless retake. Kept separate from `attemptPassed` because a listener that
   * conflated the two would announce a pass next to a failing score.
   */
  hasPassed: boolean;
}

/** Same key progressService uses for the privacy toggle (read-only here). */
const PRIVACY_SETTINGS_KEY = 'nostrich-privacy-settings';

/**
 * Guides whose completion earns the repurposed client badges (#54).
 * The in-app posting/zap simulators moved to the standalone sandstr project,
 * so these badges are now earned by completing the guides that teach the
 * same skills. The legacy stats (firstPostMade/firstZapReceived) still count.
 */
const FIRST_POST_GUIDE = 'quickstart';
const ZAP_GUIDE = 'zaps-and-lightning';

/** All 9 badge definitions */
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
    description: 'Learned how to make your first post on Nostr',
    icon: '📝',
    rarity: 'common',
    requirement: 'Complete the Quickstart guide',
  },
  {
    id: 'zap-receiver',
    name: 'Zap Receiver',
    description: 'Learned how Lightning zaps work',
    icon: '⚡',
    rarity: 'rare',
    requirement: 'Complete the Zaps guide',
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
    description: 'Completed 3 learning guides',
    icon: '📚',
    rarity: 'rare',
    requirement: 'Complete any 3 guides',
  },
  {
    id: 'nostr-graduate',
    name: 'Nostr Graduate',
    description: 'Completed 9 guides',
    icon: '🎓',
    rarity: 'epic',
    requirement: 'Complete any 9 guides',
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
  {
    id: 'privacy-expert',
    name: 'Privacy Expert',
    description: 'Scored 100% on the Privacy & Security quiz',
    icon: '🕵️',
    rarity: 'epic',
    requirement: 'Complete the Privacy & Security quiz with a perfect score',
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
 * Mirror of progressService.getPrivacySettings().trackingEnabled, read
 * directly from localStorage to avoid a module cycle (progressService imports
 * from this file). Tracking defaults to enabled; only an explicit opt-out
 * blocks writes (#51).
 */
function isTrackingEnabled(): boolean {
  try {
    const stored = localStorage.getItem(PRIVACY_SETTINGS_KEY);
    if (stored) {
      const settings = JSON.parse(stored);
      if (settings && settings.trackingEnabled === false) return false;
    }
  } catch {
    // Unreadable settings must not block writes; fall through to enabled.
  }
  return true;
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
      // Existing
      completedGuides: [],
      completedGuidesWithTimestamps: [],
      quizResults: {},
      streakDays: 0,
      lastActive: null,

      // Legacy (for migration detection)
      activePath: undefined,
      pathProgress: undefined,

      // NEW
      currentLevel: 'beginner',
      unlockedLevels: ['beginner'],
      manualUnlock: false,
      completedByLevel: {
        beginner: [],
        intermediate: [],
        advanced: []
      },
      lastInterestFilter: null
    },
    stats: {
      keysGenerated: false,
      firstPostMade: false,
      firstZapReceived: false,
      accountsFollowed: 0,
      keysBackedUp: false,
      relaysConnected: 0,
      privacyQuizPerfectScore: false,
    },
    version: CURRENT_VERSION,
  };
}

/**
 * Migrate from old path-based system to new skill-level system
 * 
 * OLD FORMAT:
 * {
 *   progress: {
 *     activePath: 'bitcoiner',
 *     pathProgress: {
 *       bitcoiner: { completedGuides: ['guide1', 'guide2'] }
 *     }
 *   }
 * }
 * 
 * NEW FORMAT:
 * {
 *   progress: {
 *     currentLevel: 'intermediate',
 *     unlockedLevels: ['beginner', 'intermediate'],
 *     completedByLevel: {
 *       beginner: ['guide1'],
 *       intermediate: ['guide2'],
 *       advanced: []
 *     }
 *   }
 * }
 */
function migrateFromLegacyPaths(data: GamificationData): GamificationData {
  // If no legacy data, return as-is
  if (!data.progress?.activePath && !data.progress?.pathProgress) {
    return data;
  }

  const activePath = data.progress.activePath;
  const pathProgress = data.progress.pathProgress || {};

  // Map old paths to new levels
  const pathToLevel: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
    'beginner': 'beginner',
    'bitcoiner': 'intermediate',
    'privacy': 'beginner',
    'general': 'beginner'
  };

  const currentLevel = activePath ? pathToLevel[activePath] || 'beginner' : 'beginner';

  // Determine unlocked levels based on current level
  const allLevels: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner', 'intermediate', 'advanced'];
  const currentIndex = allLevels.indexOf(currentLevel);
  const unlockedLevels = allLevels.slice(0, currentIndex + 1);

  // Distribute completed guides to appropriate levels using SKILL_LEVELS sequence
  const completedByLevel = {
    beginner: [] as string[],
    intermediate: [] as string[],
    advanced: [] as string[]
  };

  // Get all completed guides from legacy structure
  const allCompletedGuides = new Set<string>();
  Object.values(pathProgress).forEach((progress) => {
    if (progress?.completedGuides) {
      progress.completedGuides.forEach((guideId: string) => {
        allCompletedGuides.add(guideId);
      });
    }
  });

  // Also check old completedGuides array
  if (data.progress?.completedGuides) {
    data.progress.completedGuides.forEach((guideId: string) => {
      allCompletedGuides.add(guideId);
    });
  }

  // Distribute guides to appropriate levels using imported SKILL_LEVELS
  allCompletedGuides.forEach((guideId) => {
    // Find which level this guide belongs to
    if (SKILL_LEVELS.beginner.sequence.includes(guideId)) {
      completedByLevel.beginner.push(guideId);
    } else if (SKILL_LEVELS.intermediate.sequence.includes(guideId)) {
      completedByLevel.intermediate.push(guideId);
    } else if (SKILL_LEVELS.advanced.sequence.includes(guideId)) {
      completedByLevel.advanced.push(guideId);
    }
  });

  // Update the data structure
  // Remove legacy fields to prevent infinite migration loops
  const progressWithoutLegacy = { ...data.progress };
  delete (progressWithoutLegacy as any).activePath;
  delete (progressWithoutLegacy as any).pathProgress;
  
  return {
    ...data,
    progress: {
      ...progressWithoutLegacy,
      currentLevel,
      unlockedLevels,
      manualUnlock: false,
      completedByLevel,
    }
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
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Stored gamification value is not an object');
      }

      // Normalization: a partial writer (e.g. an old-shape import via
      // progressService) may have persisted a state missing whole sections.
      // That is migratable, not corrupt — only unparseable/non-object JSON
      // is quarantined below (#111).
      const defaultData = getDefaultData();
      if (!parsed.badges) parsed.badges = defaultData.badges;
      if (!parsed.progress) parsed.progress = defaultData.progress;
      if (!parsed.stats) parsed.stats = defaultData.stats;
      if (!Array.isArray(parsed.progress.completedGuides)) parsed.progress.completedGuides = [];
      if (!Array.isArray(parsed.progress.completedGuidesWithTimestamps)) parsed.progress.completedGuidesWithTimestamps = [];
      // Readers who were here before quizzes recorded anything have no such key.
      if (!parsed.progress.quizResults || typeof parsed.progress.quizResults !== 'object' || Array.isArray(parsed.progress.quizResults)) {
        parsed.progress.quizResults = {};
      }
      if (typeof parsed.progress.streakDays !== 'number') parsed.progress.streakDays = 0;
      if (parsed.progress.lastActive === undefined) parsed.progress.lastActive = null;

      // Migration: ensure all badge IDs exist
      BADGE_DEFINITIONS.forEach((badge) => {
        if (!parsed.badges[badge.id]) {
          parsed.badges[badge.id] = { earned: false, earnedAt: 0 };
        }
      });

      // Migration: check if we need to migrate from legacy paths
      const hasActivePath = parsed.progress?.activePath !== undefined;
      const hasPathProgress = parsed.progress?.pathProgress !== undefined;
      if (hasActivePath || hasPathProgress) {
        console.log('[Gamification] Migrating from legacy path system...', { hasActivePath, hasPathProgress, activePath: parsed.progress?.activePath });
        const migrated = migrateFromLegacyPaths(parsed);
        console.log('[Gamification] Migration complete, checking for old fields:', { 
          hasActivePathAfter: 'activePath' in migrated.progress, 
          hasPathProgressAfter: 'pathProgress' in migrated.progress 
        });
        saveGamificationData(migrated); // Save migrated data immediately
        return migrated;
      }

      // Migration: ensure new fields exist (for users who started after Phase 1)
      if (!parsed.progress?.currentLevel) {
        parsed.progress.currentLevel = 'beginner';
      }
      if (!parsed.progress?.unlockedLevels) {
        parsed.progress.unlockedLevels = ['beginner'];
      }
      if (parsed.progress?.manualUnlock === undefined) {
        parsed.progress.manualUnlock = false;
      }
      if (!parsed.progress?.completedByLevel) {
        parsed.progress.completedByLevel = {
          beginner: [],
          intermediate: [],
          advanced: []
        };
      }
      if (parsed.progress?.lastInterestFilter === undefined) {
        parsed.progress.lastInterestFilter = null;
      }

      return parsed;
    }
  } catch (error) {
    console.warn('Error loading gamification data, quarantining corrupt state:', error);
    // Remove the corrupt value so it cannot latch every future read AND
    // write into failure (#111). The user restarts from defaults.
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage itself is unavailable — nothing more we can do
    }
  }

  return getDefaultData();
}

/**
 * Save gamification data to localStorage
 * @param data - Gamification data to save
 * @param options - force bypasses the privacy gate (explicit user actions
 *   such as import/restore only)
 * @returns whether the write actually landed — callers that celebrate an
 *   award (modal dispatch) must not do so when the gate dropped the write,
 *   or users with tracking disabled get a phantom celebration on every retry
 */
export function saveGamificationData(data: GamificationData, options?: { force?: boolean }): boolean {
  if (!isBrowser()) return false;

  // Respect the privacy toggle for every tracking write (#51). All badge,
  // streak, stats and completion mutations funnel through this function.
  if (!options?.force && !isTrackingEnabled()) return false;

  try {
    // Read existing data directly from localStorage (without triggering migration)
    let existing: GamificationData;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        existing = JSON.parse(stored);
        if (typeof existing !== 'object' || existing === null || Array.isArray(existing)) {
          throw new Error('Stored gamification value is not an object');
        }
      } catch (parseError) {
        // A corrupt stored value used to throw here on EVERY save, silently
        // disabling all future writes (#111). Quarantine it instead.
        console.warn('Corrupt gamification data found, resetting it:', parseError);
        localStorage.removeItem(STORAGE_KEY);
        existing = getDefaultData();
      }
    } else {
      existing = getDefaultData();
    }

    // Merge data
    const merged = {
      ...existing,
      ...data,
      badges: { ...existing.badges, ...data.badges },
      progress: {
        ...existing.progress,
        ...data.progress,
        completedByLevel: {
          beginner: data.progress?.completedByLevel?.beginner || existing.progress?.completedByLevel?.beginner || [],
          intermediate: data.progress?.completedByLevel?.intermediate || existing.progress?.completedByLevel?.intermediate || [],
          advanced: data.progress?.completedByLevel?.advanced || existing.progress?.completedByLevel?.advanced || []
        }
      },
      stats: { ...existing.stats, ...data.stats }
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    console.log('[saveGamificationData] Saved data with unlockedLevels:', merged.progress.unlockedLevels);
    return true;
  } catch (error) {
    console.warn('Error saving gamification data:', error);
    return false;
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
      mergeImportedGamificationData(data);
      return true;
    }
  } catch (error) {
    console.error('Error importing gamification data:', error);
  }
  return false;
}

/**
 * Merge an imported gamification snapshot into the current state without
 * losing anything earned locally (#52): a badge stays earned if either side
 * earned it, guide lists are unioned, and counters keep their higher value.
 * Used by both import paths (settings page via progressService, and
 * importGamificationData above).
 */
export function mergeImportedGamificationData(imported: GamificationData): void {
  const existing = loadGamificationData();
  const merged = getDefaultData();

  // Badges: earned wins; keep the local record when both sides earned it
  BADGE_DEFINITIONS.forEach((badge) => {
    const local = existing.badges[badge.id];
    const incoming = imported.badges?.[badge.id];
    if (local?.earned) {
      merged.badges[badge.id] = local;
    } else if (incoming?.earned) {
      merged.badges[badge.id] = { earned: true, earnedAt: incoming.earnedAt || Date.now() };
    }
  });

  const union = (a?: string[], b?: string[]) => [...new Set([...(a || []), ...(b || [])])];
  const toMillis = (value: number | string | null | undefined): number | null => {
    if (value === null || value === undefined) return null;
    const ms = typeof value === 'number' ? value : new Date(value).getTime();
    return Number.isFinite(ms) ? ms : null;
  };
  const lastActiveCandidates = [
    toMillis(existing.progress.lastActive),
    toMillis(imported.progress?.lastActive),
  ].filter((ms): ms is number => ms !== null);

  // Completion timestamps: union by guide id, local entry wins
  const timestamps = new Map<string, { id: string; completedAt: string }>();
  (imported.progress?.completedGuidesWithTimestamps || []).forEach((g) => timestamps.set(g.id, g));
  (existing.progress.completedGuidesWithTimestamps || []).forEach((g) => timestamps.set(g.id, g));

  // Quiz results: best attempt wins per guide, whichever side it came from.
  // Merging by "local wins" would let importing an older export erase a level a
  // reader had already earned on this device.
  const quizResults: Record<string, QuizResult> = {};
  // The imported half is a user-supplied file, so entries are validated rather
  // than trusted: a total of 0 or a non-numeric field would make every ratio NaN,
  // and NaN comparisons are all false, which would freeze the quiz as unpassable.
  const usable = (r: QuizResult | undefined): r is QuizResult =>
    !!r &&
    Number.isFinite(r.score) &&
    Number.isFinite(r.total) &&
    r.total > 0 &&
    r.score >= 0;

  for (const source of [imported.progress?.quizResults, existing.progress.quizResults]) {
    for (const [slug, entry] of Object.entries(source || {})) {
      if (!usable(entry)) continue;
      const result: QuizResult = {
        ...entry,
        attempts: Number.isFinite(entry.attempts) ? entry.attempts : 1,
        passedAt: Number.isFinite(entry.passedAt) ? entry.passedAt : 0,
      };
      const best = quizResults[slug];
      const isBetter =
        !best ||
        result.score / result.total > best.score / best.total ||
        (best.passedAt === 0 && result.passedAt > 0);
      quizResults[slug] = isBetter
        ? { ...result, attempts: (best?.attempts || 0) + result.attempts }
        : { ...best, attempts: best.attempts + result.attempts };
      // A pass is never undone by a later merge.
      const passes = [best?.passedAt || 0, result.passedAt].filter((t) => t > 0);
      quizResults[slug].passedAt = passes.length ? Math.min(...passes) : 0;
    }
  }

  merged.progress = {
    ...existing.progress,
    completedGuides: union(existing.progress.completedGuides, imported.progress?.completedGuides),
    completedGuidesWithTimestamps: [...timestamps.values()],
    quizResults,
    streakDays: Math.max(existing.progress.streakDays || 0, imported.progress?.streakDays || 0),
    lastActive: lastActiveCandidates.length > 0 ? Math.max(...lastActiveCandidates) : null,
    currentLevel: imported.progress?.currentLevel || existing.progress.currentLevel,
    unlockedLevels: union(
      existing.progress.unlockedLevels,
      imported.progress?.unlockedLevels
    ) as GamificationProgress['unlockedLevels'],
    manualUnlock: Boolean(existing.progress.manualUnlock || imported.progress?.manualUnlock),
    completedByLevel: {
      beginner: union(existing.progress.completedByLevel?.beginner, imported.progress?.completedByLevel?.beginner),
      intermediate: union(existing.progress.completedByLevel?.intermediate, imported.progress?.completedByLevel?.intermediate),
      advanced: union(existing.progress.completedByLevel?.advanced, imported.progress?.completedByLevel?.advanced),
    },
    lastInterestFilter: existing.progress.lastInterestFilter ?? imported.progress?.lastInterestFilter ?? null,
  };

  merged.stats = {
    keysGenerated: Boolean(existing.stats.keysGenerated || imported.stats?.keysGenerated),
    firstPostMade: Boolean(existing.stats.firstPostMade || imported.stats?.firstPostMade),
    firstZapReceived: Boolean(existing.stats.firstZapReceived || imported.stats?.firstZapReceived),
    accountsFollowed: Math.max(existing.stats.accountsFollowed || 0, imported.stats?.accountsFollowed || 0),
    keysBackedUp: Boolean(existing.stats.keysBackedUp || imported.stats?.keysBackedUp),
    relaysConnected: Math.max(existing.stats.relaysConnected || 0, imported.stats?.relaysConnected || 0),
    privacyQuizPerfectScore: Boolean(existing.stats.privacyQuizPerfectScore || imported.stats?.privacyQuizPerfectScore),
  };

  // The imported progress may satisfy requirements the snapshot predates —
  // award those inside the same forced write (checkAndAwardBadges' own save
  // would be blocked while tracking is disabled).
  const newlyEarned: BadgeId[] = [];
  BADGE_DEFINITIONS.forEach((badge) => {
    if (!merged.badges[badge.id].earned && checkBadgeRequirement(badge.id, merged)) {
      merged.badges[badge.id] = { earned: true, earnedAt: Date.now() };
      newlyEarned.push(badge.id);
    }
  });

  // Import is an explicit user action: it may write even when tracking is
  // disabled (#51) — the user is restoring their own data.
  saveGamificationData(merged, { force: true });
  newlyEarned.forEach((badgeId) => dispatchBadgeEarned(badgeId));
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
 * Notify the UI that a badge was just earned. BadgeEarnedModalListener shows
 * the celebration modal for this event, so EVERY award path must dispatch it
 * — not only the config-driven engine (#49).
 */
function dispatchBadgeEarned(badgeId: BadgeId): void {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;

  const definition = BADGE_DEFINITIONS.find((b) => b.id === badgeId);
  if (!definition) return;

  window.dispatchEvent(
    new CustomEvent(BADGE_EARNED_EVENT, {
      detail: {
        id: definition.id,
        name: definition.name,
        description: definition.description,
        emoji: definition.icon,
        rarity: definition.rarity,
        requirement: definition.requirement,
        unlockedAt: new Date(),
      },
    })
  );
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

  // Celebrate only when the award actually persisted — with tracking
  // disabled the gate drops the write, and dispatching anyway would show
  // the modal on every retry while /badges keeps the badge locked.
  if (!saveGamificationData(data)) return false;
  dispatchBadgeEarned(badgeId);
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

// ============================================================================
// QUIZ RESULTS
// ============================================================================
//
// Until this existed, twelve of the site's thirteen quizzes recorded nothing at
// all — a reader could answer every question in the course correctly and the
// site would know only that some pages had been opened. Quizzes are the only
// measure of understanding here; guide completion measures attendance.

/**
 * Record an attempt at a guide's quiz. Safe to call on every completion —
 * only an improvement is persisted, so retakes cannot lower a stored result.
 *
 * @returns true if the stored best result now counts as a pass
 */
export function recordQuizResult(guideSlug: string, score: number, total: number): boolean {
  if (!guideSlug || !Number.isFinite(score) || !Number.isFinite(total) || total <= 0) return false;

  const data = loadGamificationData();
  const stored = data.progress.quizResults[guideSlug];
  // A previous entry with total <= 0 can only come from a hand-edited or corrupt
  // import. Left in place its ratio is NaN, every comparison against it is false,
  // and the quiz could never be passed again. Treat it as absent.
  const previous = stored && stored.total > 0 ? stored : undefined;
  const improved = !previous || score / total > previous.score / previous.total;

  const result: QuizResult = {
    score: improved ? score : previous.score,
    total: improved ? total : previous.total,
    attempts: (stored?.attempts || 0) + 1,
    passedAt: previous?.passedAt || 0,
  };

  const hasPassed = result.score / result.total >= QUIZ_PASS_RATIO;
  if (hasPassed && result.passedAt === 0) {
    result.passedAt = Date.now();
  }

  data.progress.quizResults[guideSlug] = result;

  // Report and celebrate only when the write actually landed. With the privacy
  // toggle off the gate drops it, and answering anyway would announce a pass the
  // site has not recorded — the same phantom celebration awardBadge guards
  // against just above.
  if (!saveGamificationData(data)) return false;

  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    const detail: QuizCompletedDetail = {
      guideSlug,
      score,
      total,
      attemptPassed: score / total >= QUIZ_PASS_RATIO,
      hasPassed,
    };
    window.dispatchEvent(new CustomEvent(QUIZ_COMPLETED_EVENT, { detail }));
  }

  return hasPassed;
}

/** Best stored result for a guide's quiz, or null if never attempted. */
export function getQuizResult(guideSlug: string): QuizResult | null {
  const data = loadGamificationData();
  return data.progress.quizResults[guideSlug] || null;
}

/** Has the reader reached the pass mark on this guide's quiz? */
export function hasPassedQuiz(guideSlug: string): boolean {
  const result = getQuizResult(guideSlug);
  return result !== null && result.passedAt > 0;
}

/** Every guide whose quiz the reader has passed. */
export function getPassedQuizzes(): string[] {
  const data = loadGamificationData();
  return Object.entries(data.progress.quizResults)
    .filter(([, result]) => result.passedAt > 0)
    .map(([slug]) => slug);
}

// ============================================================================
// LEVEL COMPLETION
// ============================================================================

export interface LevelCompletion {
  level: SkillLevel;
  guidesRead: number;
  guidesTotal: number;
  quizzesPassed: number;
  quizzesTotal: number;
  /** 0–100, guides and quizzes weighted equally by count. */
  percent: number;
  /** Every guide read AND every quiz in the level passed. */
  complete: boolean;
}

/**
 * How far through a level the reader is.
 *
 * A level is finished when its guides have been read and its quizzes passed —
 * reading alone is attendance, and this is the distinction the whole reframe
 * turns on. Levels are never locked; this measures progress, it does not gate.
 */
export function getLevelCompletion(level: SkillLevel): LevelCompletion {
  const data = loadGamificationData();
  const sequence = SKILL_LEVELS[level]?.sequence || [];
  const quizzes = getLevelQuizzes(level);

  const guidesRead = sequence.filter((slug) =>
    data.progress.completedGuides.includes(slug)
  ).length;
  const quizzesPassed = quizzes.filter(
    (slug) => (data.progress.quizResults[slug]?.passedAt || 0) > 0
  ).length;

  const done = guidesRead + quizzesPassed;
  const required = sequence.length + quizzes.length;

  return {
    level,
    guidesRead,
    guidesTotal: sequence.length,
    quizzesPassed,
    quizzesTotal: quizzes.length,
    percent: required === 0 ? 0 : Math.round((done / required) * 100),
    complete: guidesRead === sequence.length && quizzesPassed === quizzes.length,
  };
}

/** Progress across all three levels, in course order. */
export function getAllLevelCompletion(): LevelCompletion[] {
  return (['beginner', 'intermediate', 'advanced'] as SkillLevel[]).map(getLevelCompletion);
}

/**
 * The level the reader is currently working through: the first unfinished one,
 * or 'advanced' once everything is done. Derived, never stored — a stored
 * `currentLevel` is what let the old data drift away from what was actually read.
 */
export function getActiveLevel(): SkillLevel {
  const levels = getAllLevelCompletion();
  return (levels.find((l) => !l.complete) || levels[levels.length - 1]).level;
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

export function recordPrivacyQuizPerfectScore(): void {
  const data = loadGamificationData();
  data.stats.privacyQuizPerfectScore = true;
  saveGamificationData(data);
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
  
  // Save if any badges were awarded; a dropped write (tracking disabled)
  // means nothing was earned — don't dispatch and don't report awards.
  if (newlyEarned.length > 0) {
    if (saveGamificationData(data)) {
      newlyEarned.forEach((badgeId) => dispatchBadgeEarned(badgeId));
    } else {
      newlyEarned.length = 0;
    }
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
      // Repurposed (#54): the posting simulators moved to sandstr, so the
      // Quickstart guide (which walks through the first post) earns this now.
      return data.stats.firstPostMade || data.progress.completedGuides.includes(FIRST_POST_GUIDE);

    case 'zap-receiver':
      return data.stats.firstZapReceived || data.progress.completedGuides.includes(ZAP_GUIDE);
      
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
      
    case 'privacy-expert':
      return data.stats.privacyQuizPerfectScore === true;
      
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
  'privacy-expert': 'nostr:badges:privacy-expert:nostrich-love',
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
// SKILL LEVEL FUNCTIONS (NEW)
// =============================================================================

/**
 * Get the user's current skill level
 */
export function getCurrentLevel(): 'beginner' | 'intermediate' | 'advanced' {
  const data = loadGamificationData();
  return data.progress?.currentLevel || 'beginner';
}

/**
 * Set the user's current skill level
 */
export function setCurrentLevel(level: 'beginner' | 'intermediate' | 'advanced'): void {
  const data = loadGamificationData();
  data.progress.currentLevel = level;
  saveGamificationData(data);
}





/**
 * Check if user has manually unlocked all levels
 */
export function hasManualUnlock(): boolean {
  const data = loadGamificationData();
  return data.progress?.manualUnlock || false;
}

/**
 * Get completed guides for a specific level
 */
export function getCompletedInLevel(level: 'beginner' | 'intermediate' | 'advanced'): string[] {
  const data = loadGamificationData();
  return data.progress?.completedByLevel?.[level] || [];
}

/**
 * Check if a guide is completed in its level
 */
export function isGuideCompletedInLevel(
  guideId: string,
  level: 'beginner' | 'intermediate' | 'advanced'
): boolean {
  const data = loadGamificationData();
  return data.progress?.completedByLevel?.[level]?.includes(guideId) || false;
}

/**
 * Mark a guide as completed in its level
 * Also checks if next level should be unlocked
 */
export function completeGuideInLevel(
  guideId: string,
  level: 'beginner' | 'intermediate' | 'advanced'
): void {
  const data = loadGamificationData();

  // Add to level-specific completed list
  if (!data.progress.completedByLevel[level].includes(guideId)) {
    data.progress.completedByLevel[level].push(guideId);
  }

  // Also add to global completed list (for backwards compatibility)
  if (!data.progress.completedGuides.includes(guideId)) {
    data.progress.completedGuides.push(guideId);
  }

  // Add to completed guides with timestamps for Recent Activity
  if (!data.progress.completedGuidesWithTimestamps) {
    data.progress.completedGuidesWithTimestamps = [];
  }
  if (!data.progress.completedGuidesWithTimestamps.find(g => g.id === guideId)) {
    data.progress.completedGuidesWithTimestamps.push({
      id: guideId,
      completedAt: new Date().toISOString()
    });
  }

  saveGamificationData(data);

  // Trigger badge check
  checkAndAwardBadges();
}


/**
 * Canonical unlock-threshold formula (#50). Level gating is gone from the UI,
 * but canUnlockNext is still part of getLevelProgress' public shape — every
 * consumer must derive it from this single function instead of re-deriving
 * the number.
 */
export function getLevelUnlockThreshold(totalGuidesInLevel: number): number {
  return Math.max(4, Math.ceil(totalGuidesInLevel * 0.7));
}

/**
 * Get progress stats for a specific level
 */
export function getLevelProgress(level: 'beginner' | 'intermediate' | 'advanced'): {
  completed: number;
  total: number;
  percentage: number;
  canUnlockNext: boolean;
} {
  const data = loadGamificationData();

  const completed = data.progress?.completedByLevel?.[level]?.length || 0;
  const total = SKILL_LEVELS[level]?.sequence?.length || 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const canUnlockNext = completed >= getLevelUnlockThreshold(total);

  return { completed, total, percentage, canUnlockNext };
}

/**
 * Get last used interest filter
 */
export function getLastInterestFilter(): string | null {
  const data = loadGamificationData();
  return data.progress?.lastInterestFilter || null;
}

/**
 * Set last used interest filter
 */
export function setLastInterestFilter(filter: string | null): void {
  const data = loadGamificationData();
  data.progress.lastInterestFilter = filter;
  saveGamificationData(data);
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
    
    // NEW: Skill level functions
    getCurrentLevel,
    setCurrentLevel,
    hasManualUnlock,
    getCompletedInLevel,
    isGuideCompletedInLevel,
    completeGuideInLevel,
    getLevelProgress,
    getLastInterestFilter,
    setLastInterestFilter,
    
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

  // NEW: Skill level exports
  getCurrentLevel,
  setCurrentLevel,
  hasManualUnlock,
  getCompletedInLevel,
  isGuideCompletedInLevel,
  completeGuideInLevel,
  getLevelProgress,
  getLastInterestFilter,
  setLastInterestFilter,
};
