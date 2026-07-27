/**
 * Configurable Gamification Engine
 * 
 * Simplified gamification system that reads from config/gamification.ts
 * Makes it easy to change what gets rewarded without touching code.
 */

import { GAMIFICATION_CONFIG, type ActivityId, type BadgeId } from '../config/gamification';
import { SKILL_LEVELS, type SkillLevel } from '../data/learning-paths';
import { 
  loadGamificationData, 
  saveGamificationData,
  completeGuide,
  completeGuideInLevel,
  recordActivity as recordGamificationActivity
} from './gamification';

const STORAGE_KEY = 'nostrich-gamification-v1';
const CURRENT_VERSION = 1;

// Storage format - MUST match gamification.ts interface
interface GamificationData {
  badges: Record<string, { earned: boolean; earnedAt: number }>;
  progress: {
    completedGuides: string[];
    completedGuidesWithTimestamps: { id: string; completedAt: string }[];
    streakDays: number;
    lastActive: number | null;
    // NEW: Skill level fields (from Phase 1)
    currentLevel: 'beginner' | 'intermediate' | 'advanced';
    unlockedLevels: ('beginner' | 'intermediate' | 'advanced')[];
    manualUnlock: boolean;
    completedByLevel: {
      beginner: string[];
      intermediate: string[];
      advanced: string[];
    };
    lastInterestFilter: string | null;
  };
  stats: Record<string, number | boolean>;
  version: number;
}

// Check if running in browser
const isBrowser = () => typeof window !== 'undefined';

/**
 * Get default/empty gamification data
 */
function getDefaultData(): GamificationData {
  // Initialize all badges as unearned
  const badges: Record<string, { earned: boolean; earnedAt: number }> = {};
  Object.keys(GAMIFICATION_CONFIG.badges).forEach((badgeId) => {
    badges[badgeId] = { earned: false, earnedAt: 0 };
  });

  return {
    badges,
    progress: {
      completedGuides: [],
      completedGuidesWithTimestamps: [],
      streakDays: 0,
      lastActive: null,
      // NEW: Skill level defaults
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
    stats: {},
    version: CURRENT_VERSION,
  };
}

/**
 * Load gamification data from localStorage
 */
function loadData(): GamificationData {
  if (!isBrowser()) return getDefaultData();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as GamificationData;
      
      // Ensure all badges exist (migration for new badges)
      const defaultData = getDefaultData();
      Object.keys(defaultData.badges).forEach((badgeId) => {
        if (!parsed.badges[badgeId]) {
          parsed.badges[badgeId] = { earned: false, earnedAt: 0 };
        }
      });
      
      // Ensure completedGuidesWithTimestamps exists
      if (!parsed.progress.completedGuidesWithTimestamps) {
        parsed.progress.completedGuidesWithTimestamps = [];
      }
      
      // NEW: Ensure skill level fields exist (migration for Phase 1)
      if (!parsed.progress.currentLevel) {
        parsed.progress.currentLevel = 'beginner';
      }
      if (!parsed.progress.unlockedLevels) {
        parsed.progress.unlockedLevels = ['beginner'];
      }
      if (parsed.progress.manualUnlock === undefined) {
        parsed.progress.manualUnlock = false;
      }
      if (!parsed.progress.completedByLevel) {
        parsed.progress.completedByLevel = {
          beginner: [],
          intermediate: [],
          advanced: []
        };
      }
      if (parsed.progress.lastInterestFilter === undefined) {
        parsed.progress.lastInterestFilter = null;
      }
      
      return parsed;
    }
  } catch (error) {
    console.warn('Error loading gamification data:', error);
  }

  return getDefaultData();
}

/**
 * Save gamification data to localStorage
 */
function saveData(data: GamificationData): void {
  if (!isBrowser()) return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving gamification data:', error);
  }
}

/**
 * Record an activity
 * This is the main function to call from components
 * Delegates ALL data mutations to gamification.ts to avoid dual-write conflicts
 * 
 * @param activityId - The activity that occurred (from config)
 * @param metadata - Optional metadata (e.g., count, guideId, etc.)
 */
export function recordActivity(
  activityId: ActivityId,
  metadata?: { count?: number; guideId?: string }
): void {
  const activity = GAMIFICATION_CONFIG.activities[activityId];
  
  if (!activity) {
    console.warn(`Unknown activity: ${activityId}`);
    return;
  }

  console.log(`[Gamification] Recording activity: ${activity.name}`);

  // Delegate streak update to gamification.ts's recordActivity()
  // which loads, mutates, and saves in a single atomic operation
  if (activity.triggers.streak) {
    recordGamificationActivity();
  }

  // Check and award badges if configured
  if (activity.triggers.badges.length > 0) {
    const data = loadGamificationData() as unknown as GamificationData;
    checkAndAwardBadgesForActivity(data, activityId, metadata);
    saveGamificationData(data as any);
  }
  
  // Dispatch event for real-time updates
  if (isBrowser()) {
    window.dispatchEvent(new Event('gamification-updated'));
  }
}

/**
 * Check and award badges for an activity
 */
function checkAndAwardBadgesForActivity(
  data: GamificationData,
  activityId: ActivityId,
  metadata?: { count?: number; guideId?: string }
): void {
  const activity = GAMIFICATION_CONFIG.activities[activityId];
  
  activity.triggers.badges.forEach(({ badgeId, trigger }) => {
    // Skip if already earned
    if (data.badges[badgeId]?.earned) return;
    
    let shouldAward = false;
    
    switch (trigger.type) {
      case 'boolean':
        // Award on first occurrence
        shouldAward = true;
        break;
        
      case 'count':
        // Award when count reaches threshold
        if (trigger.threshold && metadata?.guideId) {
          // For guide completions, check completedGuides array
          if (activityId === 'completeGuide') {
            const completedCount = data.progress.completedGuides.length;
            shouldAward = completedCount >= trigger.threshold;
          }
        }
        break;
        
      case 'threshold':
        // Award when count reaches threshold (for relays, accounts, etc.)
        if (trigger.threshold && metadata?.count !== undefined) {
          shouldAward = metadata.count >= trigger.threshold;
        }
        break;
    }
    
    if (shouldAward) {
      awardBadge(data, badgeId);
    }
  });
}

/**
 * Award a badge
 */
function awardBadge(data: GamificationData, badgeId: string): void {
  if (!data.badges[badgeId]) {
    data.badges[badgeId] = { earned: false, earnedAt: 0 };
  }
  
  if (!data.badges[badgeId].earned) {
    data.badges[badgeId].earned = true;
    data.badges[badgeId].earnedAt = Date.now();
    
    const badge = GAMIFICATION_CONFIG.badges[badgeId as BadgeId];
    console.log(`[Gamification] Badge awarded: ${badge?.name || badgeId}`);
    
    // BadgeEarnedModalListener listens for 'badge-earned' and expects a full
    // Badge object. This used to emit 'badge-awarded' with only an id and a
    // name, so the modal never opened — and would have rendered blank if it had.
    if (isBrowser() && badge) {
      window.dispatchEvent(
        new CustomEvent('badge-earned', {
          detail: {
            id: badgeId,
            name: badge.name,
            description: badge.description,
            emoji: badge.icon,
            rarity: badge.rarity,
            requirement: badge.requirement,
            unlockedAt: new Date(),
          },
        })
      );
    }
  }
}

/**
 * Mark a guide as completed
 * Delegates to gamification.ts to avoid data conflicts
 */
export function markGuideComplete(guideId: string): void {
  const guideLevel = getGuideLevel(guideId);
  
  if (guideLevel) {
    // Use gamification.ts function which handles completedByLevel properly
    completeGuideInLevel(guideId, guideLevel);
  } else {
    // Fallback: use completeGuide for guides not in any level
    completeGuide(guideId);
  }
}

/**
 * Get the skill level for a guide
 */
function getGuideLevel(guideId: string): SkillLevel | null {
  if (SKILL_LEVELS.beginner.sequence.includes(guideId)) return 'beginner';
  if (SKILL_LEVELS.intermediate.sequence.includes(guideId)) return 'intermediate';
  if (SKILL_LEVELS.advanced.sequence.includes(guideId)) return 'advanced';
  return null;
}

/**
 * Get current streak info
 */
export function getStreakInfo(): { streakDays: number; lastActive: number | null } {
  const data = loadGamificationData() as unknown as GamificationData;
  return {
    streakDays: data.progress.streakDays,
    lastActive: data.progress.lastActive,
  };
}

/**
 * Get all earned badges
 */
export function getEarnedBadges(): string[] {
  const data = loadGamificationData() as unknown as GamificationData;
  return Object.entries(data.badges)
    .filter(([_, status]) => status.earned)
    .map(([badgeId]) => badgeId);
}

/**
 * Get badge progress for display
 */
export function getBadgeProgress(): Array<{
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
}> {
  const data = loadGamificationData() as unknown as GamificationData;
  
  return Object.entries(GAMIFICATION_CONFIG.badges).map(([badgeId, badge]) => {
    const earned = data.badges[badgeId]?.earned || false;
    let progress = 0;
    
    // Calculate progress based on badge type
    if (badgeId === 'knowledge-seeker') {
      progress = Math.min(100, (data.progress.completedGuides.length / 3) * 100);
    } else if (badgeId === 'nostr-graduate') {
      progress = Math.min(100, (data.progress.completedGuides.length / 9) * 100);
    } else {
      progress = earned ? 100 : 0;
    }
    
    return {
      id: badgeId,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      earned,
      progress,
    };
  });
}

/**
 * Reset all gamification data (for testing)
 */
export function resetGamificationData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  console.log('[Gamification] Data reset');
}

// Re-export config for convenience
export { GAMIFICATION_CONFIG };
export type { ActivityId, BadgeId };
