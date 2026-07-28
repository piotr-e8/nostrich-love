// Progress tracking service for anonymous localStorage-based progress
// Aligned with Nostr values: privacy-first, no server contact, user control
// Now unified with gamification system (nostrich-gamification-v1)
//
// ARCHITECTURE NOTE (#35): this module and utils/gamification.ts both write
// the same storage key but model it differently (per-guide map here vs
// badges/stats/levels there). Routing all gamification writes through this
// service would mean rebuilding its lossy guides-map model around badges,
// streaks and per-level progress — a rewrite, not a consolidation. Instead,
// the single choke point for privacy enforcement is
// gamification.saveGamificationData() (which reads the same
// nostrich-privacy-settings key), and this module's own writes stay guarded
// by getPrivacySettings(). Import/restore is an explicit user action and is
// allowed to write regardless of the tracking toggle.

import {
  loadGamificationData,
  saveGamificationData,
  mergeImportedGamificationData,
  type GamificationData,
} from '../utils/gamification';
import { getGuideLevel } from '../data/learning-paths';

const STORAGE_KEY = 'nostrich-gamification-v1';
const DEVICE_ID_KEY = 'nostrich-device-id';
const PRIVACY_SETTINGS_KEY = 'nostrich-privacy-settings';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Generate anonymous device ID
function getDeviceId(): string {
  if (!isBrowser) return 'server-render';
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

// Default privacy settings — tracking is ON by default (opt-out via the
// settings page). Everything stays on this device either way.
const defaultPrivacySettings: PrivacySettings = {
  trackingEnabled: true,
  dataRetention: 'forever',
  showProgressIndicators: true,
  toursEnabled: true,
};

export interface PrivacySettings {
  trackingEnabled: boolean;
  dataRetention: 'session' | '30d' | '90d' | 'forever';
  showProgressIndicators: boolean;
  toursEnabled: boolean;
}

export interface GuideProgress {
  guideId: string;
  status: 'not-started' | 'viewed' | 'engaged' | 'completed';
  timeSpentSeconds: number;
  maxScrollDepth: number;
  checklistCompleted: string[];
  lastVisitedAt: string;
  completedAt?: string;
}

export interface ProgressData {
  deviceId: string;
  schemaVersion: number;
  guides: Record<string, GuideProgress>;
  preferences: PrivacySettings;
  lastUpdatedAt: string;
  /**
   * Full gamification state (badges, streak, stats, per-level progress).
   * Present in exports since #52 so a restore on a fresh browser loses
   * nothing; imports of older exports without it are still accepted.
   */
  gamification?: GamificationData;
}

// Get privacy settings
export function getPrivacySettings(): PrivacySettings {
  if (!isBrowser) return defaultPrivacySettings;
  try {
    const stored = localStorage.getItem(PRIVACY_SETTINGS_KEY);
    if (stored) {
      return { ...defaultPrivacySettings, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error reading privacy settings:', e);
  }
  return defaultPrivacySettings;
}

// Update privacy settings
export function updatePrivacySettings(settings: Partial<PrivacySettings>): void {
  if (!isBrowser) return;
  const current = getPrivacySettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(PRIVACY_SETTINGS_KEY, JSON.stringify(updated));
}

// Get full progress data (reads from unified gamification storage)
export function getProgressData(): ProgressData {
  if (!isBrowser) {
    return {
      deviceId: 'server-render',
      schemaVersion: 1,
      guides: {},
      preferences: defaultPrivacySettings,
      lastUpdatedAt: new Date().toISOString(),
    };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert gamification format (completedGuides array) to guides object format
      const guides: Record<string, GuideProgress> = {};
      const completedGuides = parsed.progress?.completedGuides || [];
      completedGuides.forEach((guideId: string) => {
        guides[guideId] = {
          guideId,
          status: 'completed',
          timeSpentSeconds: 0,
          maxScrollDepth: 100,
          checklistCompleted: [],
          lastVisitedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        };
      });
      
      return {
        deviceId: getDeviceId(),
        schemaVersion: 1,
        guides,
        preferences: getPrivacySettings(),
        lastUpdatedAt: parsed.progress?.lastActive ? new Date(parsed.progress.lastActive).toISOString() : new Date().toISOString(),
      };
    }
  } catch (e) {
    console.error('Error reading progress data:', e);
  }
  
  return {
    deviceId: getDeviceId(),
    schemaVersion: 1,
    guides: {},
    preferences: getPrivacySettings(),
    lastUpdatedAt: new Date().toISOString(),
  };
}

// Save progress data (merges with existing gamification data)
// @returns whether anything was persisted — 'session' retention drops the
// write by design, and import must not report success for a dropped write
function saveProgressData(data: ProgressData): boolean {
  if (!isBrowser) return false;

  const settings = getPrivacySettings();

  // Check retention policy
  if (settings.dataRetention === 'session') {
    // Don't save to localStorage - session only
    return false;
  }
  
  // Clean old data based on retention
  const cleanedData = cleanOldData(data, settings.dataRetention);
  
  // Merge with existing gamification data to preserve badges, stats, etc.
  let existingData: Record<string, unknown> = {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      existingData = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading existing gamification data:', e);
  }
  
  // Convert guides object to completedGuides array format. Union with the
  // already-persisted list so this writer can never silently drop
  // completions recorded by the gamification writers (#35).
  const existingProgress = (existingData.progress as Record<string, unknown>) || {};
  const existingCompleted = Array.isArray(existingProgress.completedGuides)
    ? (existingProgress.completedGuides as string[])
    : [];
  const derivedCompleted = Object.values(cleanedData.guides)
    .filter(g => g.status === 'completed')
    .map(g => g.guideId);
  const completedGuides = [...new Set([...existingCompleted, ...derivedCompleted])];

  // Keep the per-level view and the Recent Activity timestamps in sync with
  // the flat list, so /progress does not diverge from it (#35).
  const existingByLevel = (existingProgress.completedByLevel as Record<string, string[]>) || {};
  const completedByLevel = {
    beginner: [...(existingByLevel.beginner || [])],
    intermediate: [...(existingByLevel.intermediate || [])],
    advanced: [...(existingByLevel.advanced || [])],
  };
  const completedGuidesWithTimestamps = Array.isArray(existingProgress.completedGuidesWithTimestamps)
    ? [...(existingProgress.completedGuidesWithTimestamps as { id: string; completedAt: string }[])]
    : [];
  completedGuides.forEach((guideId) => {
    const level = getGuideLevel(guideId);
    if (level && !completedByLevel[level].includes(guideId)) {
      completedByLevel[level].push(guideId);
    }
    if (!completedGuidesWithTimestamps.find((g) => g.id === guideId)) {
      completedGuidesWithTimestamps.push({
        id: guideId,
        completedAt: cleanedData.guides[guideId]?.completedAt || new Date().toISOString(),
      });
    }
  });

  // Merge: keep existing gamification data, update progress fields
  const mergedData = {
    ...existingData,
    progress: {
      ...existingProgress,
      completedGuides,
      completedByLevel,
      completedGuidesWithTimestamps,
      // recordActivity() in gamification.ts is the SOLE owner of lastActive
      // (#48). Stamping Date.now() here let a scroll-progress write land
      // before the day's recordActivity() ran, which then saw a same-day
      // repeat and silently skipped the streak increment.
      lastActive: existingProgress.lastActive ?? null,
    },
    // Only update version if not present
    version: (existingData.version as number) || 1,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
  return true;
}

// Clean old data based on retention policy
function cleanOldData(data: ProgressData, retention: string): ProgressData {
  const now = new Date();
  const cleanedGuides: Record<string, GuideProgress> = {};
  
  const retentionDays = {
    '30d': 30,
    '90d': 90,
    'forever': Infinity,
  }[retention] || Infinity;
  
  for (const [guideId, guide] of Object.entries(data.guides)) {
    const lastVisit = new Date(guide.lastVisitedAt);
    const daysSince = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSince <= retentionDays) {
      cleanedGuides[guideId] = guide;
    }
  }
  
  return {
    ...data,
    guides: cleanedGuides,
    lastUpdatedAt: now.toISOString(),
  };
}

// Get progress for a specific guide
export function getGuideProgress(guideId: string): GuideProgress | null {
  const settings = getPrivacySettings();
  if (!settings.trackingEnabled) return null;
  
  const data = getProgressData();
  return data.guides[guideId] || null;
}

// Update guide progress
export function updateGuideProgress(
  guideId: string,
  updates: Partial<Omit<GuideProgress, 'guideId'>>
): void {
  const settings = getPrivacySettings();
  if (!settings.trackingEnabled) return;
  
  const data = getProgressData();
  const existing = data.guides[guideId];
  
  data.guides[guideId] = {
    guideId,
    status: updates.status || existing?.status || 'not-started',
    timeSpentSeconds: updates.timeSpentSeconds ?? existing?.timeSpentSeconds ?? 0,
    maxScrollDepth: updates.maxScrollDepth ?? existing?.maxScrollDepth ?? 0,
    checklistCompleted: updates.checklistCompleted || existing?.checklistCompleted || [],
    lastVisitedAt: new Date().toISOString(),
    completedAt: updates.completedAt || existing?.completedAt,
  };
  
  saveProgressData(data);
}

// Calculate completion status based on multiple factors
export function calculateCompletionStatus(
  guideId: string,
  estimatedTimeMinutes: number,
  hasChecklist: boolean
): 'not-started' | 'viewed' | 'engaged' | 'completed' {
  const progress = getGuideProgress(guideId);
  if (!progress) return 'not-started';
  
  const timeThreshold = estimatedTimeMinutes * 60 * 0.6; // 60% of estimated time
  const scrollThreshold = 0.8; // 80% scroll depth
  const checklistThreshold = hasChecklist ? 0.5 : 0; // 50% of checklist items
  
  const timeMet = progress.timeSpentSeconds >= timeThreshold;
  const scrollMet = progress.maxScrollDepth >= scrollThreshold;
  const checklistMet = !hasChecklist || 
    (progress.checklistCompleted.length / (hasChecklist ? 3 : 1)) >= checklistThreshold;
  
  // Require 2 of 3 criteria for completion
  const criteriaMet = [timeMet, scrollMet, checklistMet].filter(Boolean).length;
  
  if (criteriaMet >= 2) return 'completed';
  if (progress.timeSpentSeconds > 30 || progress.maxScrollDepth > 0.3) return 'engaged';
  if (progress.timeSpentSeconds > 0) return 'viewed';
  return 'not-started';
}

// Mark guide as completed manually
export function markGuideCompleted(guideId: string): void {
  updateGuideProgress(guideId, {
    status: 'completed',
    completedAt: new Date().toISOString(),
  });
}

// Export progress data as JSON.
// Includes the FULL persisted gamification state (badges, streak, stats,
// per-level progress) — the guides map alone loses everything else (#52).
export function exportProgressData(): string {
  const data: ProgressData = {
    ...getProgressData(),
    gamification: loadGamificationData(),
  };
  return JSON.stringify(data, null, 2);
}

// Import progress data from JSON.
// Accepts both the old partial shape ({schemaVersion, guides, ...}) and the
// full shape that additionally carries `gamification` (#52). Import is an
// explicit user action, so it restores data even when tracking is disabled.
export function importProgressData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as ProgressData;
    if (!data || typeof data !== 'object') return false;

    let imported = false;

    if (data.schemaVersion && data.guides) {
      const wrote = saveProgressData(data);
      // saveProgressData writes only the progress section; on a fresh
      // browser that leaves a state without badges/stats. Run it through
      // the normalizing loader so raw readers see the full schema. Forced:
      // an import is an explicit user action (#51). Skipped under 'session'
      // retention, where saveProgressData deliberately persisted nothing —
      // and where reporting success would show "imported" for a no-op.
      if (wrote) {
        saveGamificationData(loadGamificationData(), { force: true });
        imported = true;
      }
    }

    if (data.gamification && data.gamification.badges && data.gamification.progress) {
      mergeImportedGamificationData(data.gamification);
      imported = true;
    }

    return imported;
  } catch (e) {
    console.error('Error importing progress data:', e);
  }
  return false;
}

// Delete all progress data
export function deleteAllProgress(): void {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DEVICE_ID_KEY);
  // Keep privacy settings so user preferences are remembered
}

// Get overall progress stats
export function getOverallProgress(): {
  totalGuides: number;
  completedGuides: number;
  inProgressGuides: number;
  percentage: number;
} {
  const data = getProgressData();
  const guides = Object.values(data.guides);
  
  const completed = guides.filter(g => g.status === 'completed').length;
  const inProgress = guides.filter(g => g.status === 'engaged' || g.status === 'viewed').length;
  
  return {
    totalGuides: guides.length,
    completedGuides: completed,
    inProgressGuides: inProgress,
    percentage: guides.length > 0 ? Math.round((completed / guides.length) * 100) : 0,
  };
}

// Check if user has opted out of tracking
export function isTrackingEnabled(): boolean {
  return getPrivacySettings().trackingEnabled;
}

// Check if progress indicators should be shown
export function shouldShowProgressIndicators(): boolean {
  const settings = getPrivacySettings();
  return settings.trackingEnabled && settings.showProgressIndicators;
}

// Check if a guide is completed
export function isGuideCompleted(guideId: string): boolean {
  const progress = getGuideProgress(guideId);
  return progress?.status === 'completed';
}

// Check prerequisites for a guide
export function checkPrerequisites(guideId: string, prerequisites: string[]): { completed: string[]; incomplete: string[] } {
  const completed: string[] = [];
  const incomplete: string[] = [];
  
  for (const prereqId of prerequisites) {
    if (isGuideCompleted(prereqId)) {
      completed.push(prereqId);
    } else {
      incomplete.push(prereqId);
    }
  }
  
  return { completed, incomplete };
}