/**
 * Progress Tracking Utilities
 * 
 * Updated for Phase 2: Skill-Level Migration
 * This file now acts as a bridge/wrapper layer around gamification.ts
 * All functions delegate to the new skill level system.
 */

import { useState, useEffect } from 'react';

// Import skill level utilities
import {
  SKILL_LEVELS,
  type SkillLevel,
  getSkillLevel,
  getLevelSequence,
  getLevelLength,
  getGuidePositionInLevel,
  isGuideInLevel,
  getGuideLevel
} from '../data/learning-paths';

// Import gamification functions
import {
  getCurrentLevel,
  setCurrentLevel,
  getUnlockedLevels,
  isLevelUnlocked,
  unlockLevel,
  unlockAllLevels,
  hasManualUnlock,
  getCompletedInLevel,
  isGuideCompletedInLevel,
  completeGuideInLevel,
  getLevelProgress,
  getLastInterestFilter,
  setLastInterestFilter,
  loadGamificationData,
  saveGamificationData as saveGamificationDataBase,
  checkAndAwardBadges,
  type GamificationData
} from '../utils/gamification';

// Export SkillLevel type for consumers
export type { SkillLevel };

// Types
export interface LastViewedGuide {
  slug: string;
  title: string;
  level: SkillLevel;  // Changed from path: LearningPathId
  timestamp: number;
  scrollPosition?: number;
  percentage?: number;
}

/** @deprecated Use SkillLevel from learning-paths instead */
export type LearningPathId = SkillLevel;

/** @deprecated Use LevelProgress from gamification instead */
export interface PathProgress {
  completedGuides: string[];
  startedAt: number;
  lastActiveAt: number;
}

/**
 * Get gamification data from localStorage
 * Wrapper around gamification.ts function
 */
function getGamificationData(): GamificationData {
  if (typeof window === 'undefined') {
    // Return default data structure for SSR (server-side)
    // This is a fallback that matches the structure from gamification.ts
    return {
      badges: {} as Record<string, { earned: boolean; earnedAt: number }>,
      progress: {
        completedGuides: [],
        completedGuidesWithTimestamps: [],
        streakDays: 0,
        lastActive: null,
        currentLevel: 'beginner',
        unlockedLevels: ['beginner'],
        manualUnlock: false,
        completedByLevel: { beginner: [], intermediate: [], advanced: [] },
        lastInterestFilter: null
      },
      stats: {},
      version: 1
    };
  }

  // Use the gamification.ts loader which handles migration
  return loadGamificationData();
}

/**
 * Legacy migration handler
 * Actual migration happens in gamification.ts loadGamificationData()
 * This function now just logs for debugging
 */
function migrateLegacyData(): void {
  if (typeof window === 'undefined') return;

  // Migration is now handled automatically in loadGamificationData()
  // This function remains for compatibility but does nothing
  console.log('[progress.ts] Legacy migration handled by gamification.ts');
}

// No need to run on load - gamification.ts handles it
// if (typeof window !== 'undefined') {
//   migrateLegacyData();
// }

/**
 * Save gamification data to localStorage
 * Wrapper that ensures SSR safety
 */
function saveGamificationData(data: GamificationData): void {
  if (typeof window === 'undefined') return;
  saveGamificationDataBase(data);
}

/**
 * Get the currently active learning path
 * @deprecated Use getCurrentLevel() from gamification.ts instead
 */
export function getActivePath(): SkillLevel {
  return getCurrentLevel();
}

/**
 * Get the currently active skill level (new version)
 */
export function getCurrentLevelLocal(): SkillLevel {
  return getCurrentLevel();
}

/**
 * Set the active learning path
 * @deprecated Use setCurrentLevel() from gamification.ts instead
 */
export function setActivePath(pathId: SkillLevel): void {
  setCurrentLevel(pathId);
}

/**
 * Set the current skill level (new version)
 */
export function setCurrentLevelLocal(level: SkillLevel): void {
  setCurrentLevel(level);
}

/**
 * Mark a guide as completed
 * Uses the new skill level system
 */
export function markGuideCompleted(guideSlug: string): void {
  // Find which level this guide belongs to
  const level = getGuideLevel(guideSlug);

  if (!level) {
    console.warn(`[progress.ts] Guide ${guideSlug} not found in any level`);
    return;
  }

  // Use the gamification.ts function which handles:
  // - Adding to completedByLevel
  // - Adding to global completedGuides
  // - Checking unlock thresholds
  // - Awarding badges
  completeGuideInLevel(guideSlug, level);

  console.log('[progress.ts] Guide marked complete:', guideSlug, 'Level:', level);
}

/**
 * Check if a guide is completed
 */
export function isGuideCompleted(guideSlug: string): boolean {
  const level = getGuideLevel(guideSlug);
  if (!level) return false;
  return isGuideCompletedInLevel(guideSlug, level);
}

/**
 * Update last viewed guide
 */
export function setLastViewedGuide(
  guideSlug: string,
  title: string,
  options?: {
    scrollPosition?: number;
    percentage?: number;
  }
): void {
  const data = getGamificationData();
  const currentLevel = getCurrentLevel();

  if (!data.progress) {
    data.progress = {
      completedGuides: [],
      completedGuidesWithTimestamps: [],
      streakDays: 0,
      lastActive: Date.now(),
      currentLevel: 'beginner',
      unlockedLevels: ['beginner'],
      manualUnlock: false,
      completedByLevel: { beginner: [], intermediate: [], advanced: [] },
      lastInterestFilter: null
    };
  }

  // Store lastViewed in a separate localStorage key for now
  // This avoids modifying the core GamificationData type
  const lastViewed: LastViewedGuide = {
    slug: guideSlug,
    title,
    level: currentLevel,
    timestamp: Date.now(),
    scrollPosition: options?.scrollPosition,
    percentage: options?.percentage
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('nostrich-last-viewed', JSON.stringify(lastViewed));
  }

  data.progress.lastActive = Date.now();

  saveGamificationData(data);
}

/**
 * Get last viewed guide info
 */
export function getLastViewedGuide(): LastViewedGuide | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem('nostrich-last-viewed');
    if (stored) {
      return JSON.parse(stored) as LastViewedGuide;
    }
  } catch (e) {
    console.error('[progress.ts] Error reading last viewed guide:', e);
  }

  return null;
}

/**
 * Check if there's a recent guide to resume
 * Returns true if last viewed within 7 days
 */
export function hasRecentProgress(): boolean {
  const lastViewed = getLastViewedGuide();
  if (!lastViewed) return false;

  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  return lastViewed.timestamp > sevenDaysAgo;
}

/**
 * Get progress for current path
 * @deprecated Use getLevelProgress() from gamification.ts instead
 */
export function getCurrentPathProgress(): {
  completed: number;
  total: number;
  percentage: number;
  nextGuide: string | null;
} {
  const currentLevel = getCurrentLevel();
  const progress = getLevelProgress(currentLevel);

  // Find next incomplete guide in the level
  const level = getSkillLevel(currentLevel);
  let nextGuide: string | null = null;

  if (level) {
    for (const guideSlug of level.sequence) {
      if (!isGuideCompleted(guideSlug)) {
        nextGuide = guideSlug;
        break;
      }
    }
  }

  return {
    completed: progress.completed,
    total: progress.total,
    percentage: progress.percentage,
    nextGuide
  };
}

/**
 * Get progress for a specific skill level (new version)
 */
export function getLevelProgressLocal(level: SkillLevel): {
  completed: number;
  total: number;
  percentage: number;
  canUnlockNext: boolean;
} {
  return getLevelProgress(level);
}

/**
 * Get completed guides for current path
 * @deprecated Use getCompletedInLevel() from gamification.ts instead
 */
export function getCompletedGuidesInPath(): string[] {
  const currentLevel = getCurrentLevel();
  return getCompletedInLevel(currentLevel);
}

/**
 * Get completed guides for a specific level (new version)
 */
export function getCompletedGuidesInLevel(level: SkillLevel): string[] {
  return getCompletedInLevel(level);
}

/**
 * Reset all progress (use with caution!)
 */
export function resetProgress(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('nostrich-gamification-v1');
}

/**
 * Calculate reading progress based on scroll position
 */
export function calculateReadingProgress(): number {
  if (typeof window === 'undefined') return 0;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (docHeight <= 0) return 0;

  const progress = (scrollTop / docHeight) * 100;
  return Math.min(Math.round(progress), 100);
}

/**
 * Get all completed guides (for backward compatibility)
 */
export function getCompletedGuides(): string[] {
  const data = getGamificationData();
  return data.progress?.completedGuides || [];
}

/**
 * Get streak days (for backward compatibility)
 */
export function getStreakDays(): number {
  const data = getGamificationData();
  return data.progress?.streakDays || 0;
}

/**
 * Legacy function to check if progress indicators should show
 * Maintains compatibility with existing code
 */
export function shouldShowProgressIndicators(): boolean {
  // Always show progress indicators in this version
  return true;
}

// =============================================================================
// NEW SKILL LEVEL FUNCTIONS
// =============================================================================

/**
 * Get array of unlocked levels
 */
export function getUnlockedLevelsLocal(): SkillLevel[] {
  return getUnlockedLevels();
}

/**
 * Check if a specific level is unlocked
 */
export function isLevelUnlockedLocal(level: SkillLevel): boolean {
  return isLevelUnlocked(level);
}

/**
 * Unlock a specific level
 */
export function unlockLevelLocal(level: SkillLevel): void {
  unlockLevel(level);
}

/**
 * Manually unlock all levels
 */
export function unlockAllLevelsLocal(): void {
  unlockAllLevels();
}

/**
 * Check if user has manually unlocked all levels
 */
export function hasManualUnlockLocal(): boolean {
  return hasManualUnlock();
}

/**
 * Get the last used interest filter
 */
export function getLastInterestFilterLocal(): string | null {
  return getLastInterestFilter();
}

/**
 * Set the last used interest filter
 */
export function setLastInterestFilterLocal(filter: string | null): void {
  setLastInterestFilter(filter);
}

/**
 * Check if a guide is completed in a specific level
 */
export function isGuideCompletedInLevelLocal(guideSlug: string, level: SkillLevel): boolean {
  return isGuideCompletedInLevel(guideSlug, level);
}

// React hook for scroll progress tracking
export function useScrollProgress(callback?: (progress: number) => void): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const newProgress = calculateReadingProgress();
      setProgress(newProgress);
      callback?.(newProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback]);

  return progress;
}
