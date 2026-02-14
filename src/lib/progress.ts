/**
 * Progress Tracking Utilities
 * 
 * Merged with existing gamification system (nostrich-gamification-v1)
 * Extends existing storage with path-aware progress tracking.
 */

import { LEARNING_PATHS, type LearningPathId } from '../data/learning-paths';
import { checkAndAwardBadges } from '../utils/gamification';

// Use existing gamification storage key
const STORAGE_KEY = 'nostrich-gamification-v1';

// Types
export interface LastViewedGuide {
  slug: string;
  title: string;
  path: LearningPathId;
  timestamp: number;
  scrollPosition?: number;
  percentage?: number;
}

export interface PathProgress {
  completedGuides: string[];
  startedAt: number;
  lastActiveAt: number;
}

// Extended gamification data structure
interface GamificationData {
  badges?: Record<string, unknown>;
  progress?: {
    completedGuides: string[];
    completedGuidesWithTimestamps?: { id: string; completedAt: string }[];
    streakDays: number;
    lastActive: number | null;
    activePath?: LearningPathId;
    lastViewed?: LastViewedGuide;
    pathProgress?: Record<string, PathProgress>;
  };
  stats?: Record<string, unknown>;
  version?: number;
}

/**
 * Get gamification data from localStorage (merged with progress tracking)
 */
function getGamificationData(): GamificationData {
  if (typeof window === 'undefined') {
    return {
      badges: {},
      progress: { completedGuides: [], streakDays: 0, lastActive: null, activePath: 'beginner' },
      stats: {},
      version: 1
    };
  }
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed;
    }
  } catch (error) {
    console.error('Error loading gamification data:', error);
  }
  
  // Default structure
  return {
    badges: {},
    progress: { completedGuides: [], streakDays: 0, lastActive: null, activePath: 'beginner' },
    stats: {},
    version: 1
  };
}

/**
 * Migrate legacy path storage to unified gamification storage
 * Handles migration from 'nostrich-user-path' to 'nostrich-gamification-v1'
 */
function migrateLegacyData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const oldPath = localStorage.getItem('nostrich-user-path');
    if (!oldPath) return;
    
    const data = getGamificationData();
    
    // Only migrate if no activePath set yet
    if (!data.progress?.activePath) {
      if (!data.progress) {
        data.progress = { completedGuides: [], streakDays: 0, lastActive: Date.now() };
      }
      
      data.progress.activePath = oldPath as LearningPathId;
      saveGamificationData(data);
      
      // Clean up old key
      localStorage.removeItem('nostrich-user-path');
      console.log('[Guides] Migrated legacy path storage:', oldPath);
    }
  } catch (e) {
    console.error('[Guides] Migration error:', e);
  }
}

// Run migration on module load
if (typeof window !== 'undefined') {
  migrateLegacyData();
}

/**
 * Save gamification data to localStorage
 */
function saveGamificationData(data: GamificationData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving gamification data:', error);
  }
}

/**
 * Get the currently active learning path
 */
export function getActivePath(): LearningPathId {
  const data = getGamificationData();
  return data.progress?.activePath || 'beginner';
}

/**
 * Set the active learning path
 */
export function setActivePath(pathId: LearningPathId): void {
  if (!LEARNING_PATHS[pathId]) {
    console.warn(`Invalid path ID: ${pathId}`);
    return;
  }
  
  const data = getGamificationData();
  
  // Initialize progress structure if needed
  if (!data.progress) {
    data.progress = { completedGuides: [], streakDays: 0, lastActive: Date.now() };
  }
  
  // Initialize pathProgress if needed
  if (!data.progress.pathProgress) {
    data.progress.pathProgress = {};
  }
  
  // If switching paths, initialize new path progress
  if (data.progress.activePath !== pathId) {
    if (!data.progress.pathProgress[pathId]) {
      data.progress.pathProgress[pathId] = {
        completedGuides: [],
        startedAt: Date.now(),
        lastActiveAt: Date.now()
      };
    }
    
    data.progress.activePath = pathId;
    data.progress.lastActive = Date.now();
    saveGamificationData(data);
  }
}

/**
 * Mark a guide as completed
 */
export function markGuideCompleted(guideSlug: string): void {
  const data = getGamificationData();
  
  // Initialize progress structure
  if (!data.progress) {
    data.progress = { completedGuides: [], streakDays: 0, lastActive: Date.now() };
  }
  
  // Initialize timestamps array if not exists
  if (!data.progress.completedGuidesWithTimestamps) {
    data.progress.completedGuidesWithTimestamps = [];
  }
  
  // Add to global completed guides if not already there
  if (!data.progress.completedGuides.includes(guideSlug)) {
    data.progress.completedGuides.push(guideSlug);
    
    // Track completion timestamp
    data.progress.completedGuidesWithTimestamps.push({
      id: guideSlug,
      completedAt: new Date().toISOString()
    });
  }
  
  // Also update path-specific progress
  const pathId = data.progress.activePath || 'beginner';
  if (!data.progress.pathProgress) {
    data.progress.pathProgress = {};
  }
  
  if (!data.progress.pathProgress[pathId]) {
    data.progress.pathProgress[pathId] = {
      completedGuides: [],
      startedAt: Date.now(),
      lastActiveAt: Date.now()
    };
  }
  
  if (!data.progress.pathProgress[pathId].completedGuides.includes(guideSlug)) {
    data.progress.pathProgress[pathId].completedGuides.push(guideSlug);
    data.progress.pathProgress[pathId].lastActiveAt = Date.now();
  }
  
  data.progress.lastActive = Date.now();
  saveGamificationData(data);
  
  console.log('[progress.ts] Guide marked complete:', guideSlug, 'Total:', data.progress.completedGuides.length);
  
  // Check for new badges after marking complete
  try {
    const result = checkAndAwardBadges();
    console.log('[progress.ts] Badges checked:', result);
  } catch (error) {
    console.error('[progress.ts] Error checking badges:', error);
  }
}

/**
 * Check if a guide is completed
 */
export function isGuideCompleted(guideSlug: string): boolean {
  const data = getGamificationData();
  return data.progress?.completedGuides?.includes(guideSlug) || false;
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
  
  if (!data.progress) {
    data.progress = { completedGuides: [], streakDays: 0, lastActive: Date.now() };
  }
  
  data.progress.lastViewed = {
    slug: guideSlug,
    title,
    path: data.progress.activePath || 'beginner',
    timestamp: Date.now(),
    scrollPosition: options?.scrollPosition,
    percentage: options?.percentage
  };
  
  data.progress.lastActive = Date.now();
  
  // Update path last active time
  const pathId = data.progress.activePath || 'beginner';
  if (data.progress.pathProgress?.[pathId]) {
    data.progress.pathProgress[pathId].lastActiveAt = Date.now();
  }
  
  saveGamificationData(data);
}

/**
 * Get last viewed guide info
 */
export function getLastViewedGuide(): LastViewedGuide | null {
  const data = getGamificationData();
  return data.progress?.lastViewed || null;
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
 */
export function getCurrentPathProgress(): {
  completed: number;
  total: number;
  percentage: number;
  nextGuide: string | null;
} {
  const data = getGamificationData();
  const pathId = data.progress?.activePath || 'beginner';
  const path = LEARNING_PATHS[pathId];
  
  if (!path) {
    return { completed: 0, total: 0, percentage: 0, nextGuide: null };
  }
  
  const pathProgress = data.progress?.pathProgress?.[pathId];
  const completed = pathProgress?.completedGuides.length || 0;
  const total = path.sequence.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Find next incomplete guide
  let nextGuide: string | null = null;
  for (const guideSlug of path.sequence) {
    if (!isGuideCompleted(guideSlug)) {
      nextGuide = guideSlug;
      break;
    }
  }
  
  return { completed, total, percentage, nextGuide };
}

/**
 * Get completed guides for current path
 */
export function getCompletedGuidesInPath(): string[] {
  const data = getGamificationData();
  const pathId = data.progress?.activePath || 'beginner';
  const path = LEARNING_PATHS[pathId];
  
  if (!path) return [];
  
  const completedGuides = data.progress?.completedGuides || [];
  return path.sequence.filter(slug => completedGuides.includes(slug));
}

/**
 * Reset all progress (use with caution!)
 */
export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEY);
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

// React hook for scroll progress tracking
import { useState, useEffect } from 'react';

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
