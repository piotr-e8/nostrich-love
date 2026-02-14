/**
 * Configurable Gamification Engine
 * 
 * Simplified gamification system that reads from config/gamification.ts
 * Makes it easy to change what gets rewarded without touching code.
 */

import { GAMIFICATION_CONFIG, type ActivityId, type BadgeId } from '../config/gamification';

const STORAGE_KEY = 'nostrich-gamification-v1';
const CURRENT_VERSION = 1;

// Storage format
interface GamificationData {
  badges: Record<string, { earned: boolean; earnedAt: number }>;
  progress: {
    completedGuides: string[];
    completedGuidesWithTimestamps: { id: string; completedAt: string }[];
    streakDays: number;
    lastActive: number | null;
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
 * 
 * @param activityId - The activity that occurred (from config)
 * @param metadata - Optional metadata (e.g., count, guideId, etc.)
 */
export function recordActivity(
  activityId: ActivityId,
  metadata?: { count?: number; guideId?: string }
): void {
  const data = loadData();
  const activity = GAMIFICATION_CONFIG.activities[activityId];
  
  if (!activity) {
    console.warn(`Unknown activity: ${activityId}`);
    return;
  }

  console.log(`[Gamification] Recording activity: ${activity.name}`);

  // 1. Update streak if configured
  if (activity.triggers.streak) {
    updateStreak(data);
  }

  // 2. Check and award badges if configured
  if (activity.triggers.badges.length > 0) {
    checkAndAwardBadgesForActivity(data, activityId, metadata);
  }

  // 3. Save updated data
  saveData(data);
  
  // 4. Dispatch event for real-time updates
  if (isBrowser()) {
    window.dispatchEvent(new Event('gamification-updated'));
  }
}

/**
 * Update streak based on activity
 */
function updateStreak(data: GamificationData): void {
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
    // First activity ever
    data.progress.streakDays = 1;
  }
  
  data.progress.lastActive = now;
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
    
    // Could dispatch a custom event here for toast notifications
    if (isBrowser()) {
      window.dispatchEvent(new CustomEvent('badge-awarded', { 
        detail: { badgeId, badgeName: badge?.name } 
      }));
    }
  }
}

/**
 * Mark a guide as completed
 * Convenience function for guide completion
 */
export function markGuideComplete(guideId: string): void {
  const data = loadData();
  
  // Add to completed guides if not already there
  if (!data.progress.completedGuides.includes(guideId)) {
    data.progress.completedGuides.push(guideId);
    data.progress.completedGuidesWithTimestamps.push({
      id: guideId,
      completedAt: new Date().toISOString(),
    });
    
    saveData(data);
    
    // Now record the activity (which will check badges)
    recordActivity('completeGuide', { guideId });
  }
}

/**
 * Get current streak info
 */
export function getStreakInfo(): { streakDays: number; lastActive: number | null } {
  const data = loadData();
  return {
    streakDays: data.progress.streakDays,
    lastActive: data.progress.lastActive,
  };
}

/**
 * Get all earned badges
 */
export function getEarnedBadges(): string[] {
  const data = loadData();
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
  const data = loadData();
  
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
