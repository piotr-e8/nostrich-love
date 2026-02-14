// Progress tracking service for anonymous localStorage-based progress
// Aligned with Nostr values: privacy-first, no server contact, user control

const STORAGE_KEY = 'nostrich-progress-v1';
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

// Default privacy settings - all opt-in, disabled by default
const defaultPrivacySettings: PrivacySettings = {
  trackingEnabled: false,
  dataRetention: 'forever', // 'session' | '30d' | '90d' | 'forever'
  showProgressIndicators: false, // Default OFF (opt-in)
  toursEnabled: true, // Default ON - client tours help users learn
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

// Get full progress data
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
      return {
        deviceId: parsed.deviceId || getDeviceId(),
        schemaVersion: parsed.schemaVersion || 1,
        guides: parsed.guides || {},
        preferences: getPrivacySettings(),
        lastUpdatedAt: parsed.lastUpdatedAt || new Date().toISOString(),
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

// Save progress data
function saveProgressData(data: ProgressData): void {
  if (!isBrowser) return;
  
  const settings = getPrivacySettings();
  
  // Check retention policy
  if (settings.dataRetention === 'session') {
    // Don't save to localStorage - session only
    return;
  }
  
  // Clean old data based on retention
  const cleanedData = cleanOldData(data, settings.dataRetention);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedData));
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

// Export progress data as JSON
export function exportProgressData(): string {
  const data = getProgressData();
  return JSON.stringify(data, null, 2);
}

// Import progress data from JSON
export function importProgressData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as ProgressData;
    if (data.schemaVersion && data.guides) {
      saveProgressData(data);
      return true;
    }
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