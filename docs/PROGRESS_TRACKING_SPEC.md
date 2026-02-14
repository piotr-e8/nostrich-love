# Anonymous Progress Tracking System Specification
## Nostrich.love Technical Specification v1.0

---

## 1. Executive Summary

This specification defines an anonymous, privacy-first progress tracking system for Nostrich.love that uses localStorage only. The system is designed to be minimal, non-gamified, and respectful of user privacy while providing helpful progress visualization. It includes a migration path for optional npub-based login in the future.

**Core Principles:**
- Privacy-first: No server storage, no cookies, no tracking
- Minimal UI: Subtle indicators, no gamification
- User control: Easy opt-out and data deletion
- Future-proof: Designed for optional npub login expansion

---

## 2. localStorage Schema

### 2.1 Key Naming Convention

All keys use the prefix `nostrich-` to avoid collisions:

```typescript
const STORAGE_KEYS = {
  PROGRESS: 'nostrich-progress',           // Main progress data
  SESSION: 'nostrich-session',             // Current session info
  PREFERENCES: 'nostrich-prefs',           // User preferences
  META: 'nostrich-meta',                   // Metadata (version, etc.)
  CHECKLISTS: 'nostrich-checklist-',       // Per-guide checklist prefix
} as const;
```

### 2.2 Data Structures

#### Main Progress Data (`nostrich-progress`)

```typescript
interface GuideProgress {
  id: string;                    // Guide slug (e.g., "quickstart")
  status: 'not-started' | 'viewed' | 'engaged' | 'completed';
  firstViewedAt: number;         // Timestamp (ms)
  lastViewedAt: number;          // Timestamp (ms)
  timeSpentMs: number;           // Total time on page (ms)
  scrollDepth: number;           // Max scroll % (0-100)
  completionCriteria: {          // What triggered completion
    minTimeMet: boolean;         // Met minimum time requirement
    scrollDepthMet: boolean;     // Scrolled to threshold
    checklistCompleted: boolean; // Interactive checklist done
  };
}

interface LearningPath {
  id: string;                    // Path identifier
  title: string;                 // Human-readable name
  guideIds: string[];            // Ordered guide IDs
  requiredCount: number;         // Number required for completion
}

interface ProgressData {
  version: number;               // Schema version (for migrations)
  deviceId: string;              // Anonymous device identifier (UUID v4)
  createdAt: number;             // First visit timestamp
  updatedAt: number;             // Last update timestamp
  guides: Record<string, GuideProgress>;  // Map of guideId -> progress
  paths: Record<string, {        // Learning paths progress
    startedAt: number;
    completedAt: number | null;
    completedGuideIds: string[];
  }>;
  preferences: {
    optOut: boolean;             // User opted out of tracking
    showProgress: boolean;       // Show progress indicators
    anonymizeStats: boolean;     // Don't include in anonymous analytics
  };
}
```

#### Session Data (`nostrich-session`)

```typescript
interface SessionData {
  sessionId: string;             // UUID for this session
  startedAt: number;
  currentGuideId: string | null; // Currently viewing
  guideStartTime: number | null; // When current guide was opened
  lastActivityAt: number;        // Last interaction timestamp
}
```

#### User Preferences (`nostrich-prefs`)

```typescript
interface UserPreferences {
  progressIndicators: 'minimal' | 'hidden' | 'detailed';
  autoMarkComplete: boolean;     // Auto-mark when criteria met
  showTimeEstimates: boolean;    // Show time tracking
  dataRetention: 'forever' | '30days' | 'session'; // Auto-cleanup
  lastPrivacyNotice: number;     // When privacy notice was shown
}
```

#### Metadata (`nostrich-meta`)

```typescript
interface StorageMetadata {
  version: number;               // Current schema version
  lastMigration: number;         // Timestamp of last migration
  dataSize: number;              // Approximate size in bytes
  purgeHistory: Array<{         // Record of data purges
    purgedAt: number;
    reason: string;
    bytesFreed: number;
  }>;
}
```

### 2.3 JSON Storage Example

```json
{
  "version": 1,
  "deviceId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": 1709251200000,
  "updatedAt": 1709337600000,
  "guides": {
    "what-is-nostr": {
      "id": "what-is-nostr",
      "status": "completed",
      "firstViewedAt": 1709251200000,
      "lastViewedAt": 1709254800000,
      "timeSpentMs": 420000,
      "scrollDepth": 100,
      "completionCriteria": {
        "minTimeMet": true,
        "scrollDepthMet": true,
        "checklistCompleted": true
      }
    },
    "keys-and-security": {
      "id": "keys-and-security",
      "status": "engaged",
      "firstViewedAt": 1709334000000,
      "lastViewedAt": 1709337600000,
      "timeSpentMs": 180000,
      "scrollDepth": 65,
      "completionCriteria": {
        "minTimeMet": false,
        "scrollDepthMet": false,
        "checklistCompleted": false
      }
    }
  },
  "paths": {
    "beginner": {
      "startedAt": 1709251200000,
      "completedAt": null,
      "completedGuideIds": ["what-is-nostr"]
    }
  },
  "preferences": {
    "optOut": false,
    "showProgress": true,
    "anonymizeStats": false
  }
}
```

---

## 3. Completion Criteria Definition

### 3.1 Multi-Factor Completion Model

A guide is considered "completed" when at least 2 of 3 criteria are met:

| Criterion | Threshold | Weight | Rationale |
|-----------|-----------|--------|-----------|
| **Time on Page** | 60% of estimated reading time | 1.0 | Ensures content was consumed |
| **Scroll Depth** | 80% of page height | 1.0 | Confirms content was viewed |
| **Checklist Items** | 50% of required items checked | 1.5 | Shows active engagement |

### 3.2 Status Levels

```typescript
type GuideStatus = 
  | 'not-started'    // Never viewed
  | 'viewed'         // Viewed < 10 seconds
  | 'engaged'        // Viewed > 30s OR scrolled > 50%
  | 'completed';     // Met completion criteria
```

### 3.3 Time Calculation

```typescript
interface TimeConfig {
  // Minimum time to count as "viewed" (ms)
  MIN_VIEW_TIME: 10000,           // 10 seconds
  
  // Minimum time to count as "engaged" (ms)
  MIN_ENGAGE_TIME: 30000,         // 30 seconds
  
  // Percentage of estimated time needed for completion
  COMPLETION_TIME_PERCENT: 0.6,   // 60%
  
  // Maximum time to count (prevents inflation from idle tabs)
  MAX_TIME_PER_SESSION: 1800000,  // 30 minutes
  
  // Idle detection (no mouse/keyboard activity)
  IDLE_THRESHOLD: 60000,          // 1 minute
}
```

### 3.4 Scroll Depth Tracking

```typescript
interface ScrollConfig {
  // Debounce time for scroll events (ms)
  SCROLL_DEBOUNCE: 250,
  
  // Minimum scroll % to save
  MIN_SCROLL_SAVE: 10,
  
  // Thresholds for status changes
  VIEWED_THRESHOLD: 25,           // 25% = viewed
  ENGAGED_THRESHOLD: 50,          // 50% = engaged
  COMPLETED_THRESHOLD: 80,        // 80% = scroll complete
}
```

---

## 4. Progress Visualization Design

### 4.1 Design Philosophy

- **Minimal**: Progress should enhance, not distract
- **Informative**: Users should understand their journey
- **Respectful**: No badges, points, or gamification
- **Subtle**: Blend with existing design system

### 4.2 Visual Components

#### 4.2.1 Reading Progress Bar (Subtle)

**Location**: Fixed at top of page, 2px height

```typescript
// Component: ReadingProgressBar
interface ReadingProgressBarProps {
  color?: 'primary' | 'success' | 'gradient';
  height?: 2 | 3 | 4;  // pixels
  showOnScroll?: boolean;  // Only show when scrolling
}
```

**Visual Design:**
- Height: 2px (minimal)
- Position: Fixed top, z-index: 50
- Color: Gradient from primary-500 to secondary-500
- Behavior: Smooth width transition (0% → 100% based on scroll)
- Optional: Fade in only when scrolling, fade out after 2s idle

#### 4.2.2 Guide Card Progress Indicator

**Location**: Bottom-right corner of guide cards on index page

```typescript
// Component: GuideCardProgress
interface GuideCardProgressProps {
  guideId: string;
  status: GuideStatus;
  progress: number;  // 0-100
}
```

**Visual States:**

| Status | Visual |
|--------|--------|
| not-started | No indicator (clean card) |
| viewed | Small dot (primary-500, 6px) |
| engaged | Partial arc (30-90% circle, 16px) |
| completed | Checkmark icon (success-500) |

**Example:**
```
┌─────────────────────────────────┐
│                                 │
│  Guide Title                    │
│  Description text...            │
│                                 │
│  5 min read           ●        │  <- Small dot for viewed
└─────────────────────────────────┘

┌─────────────────────────────────┐
│                                 │
│  Guide Title                    │
│  Description text...            │
│                                 │
│  5 min read           ⟳ 65%    │  <- Arc for engaged
└─────────────────────────────────┘
```

#### 4.2.3 Section Progress Indicator (Guide Pages)

**Location**: Sticky sidebar or floating button

```typescript
// Component: SectionProgress
interface SectionProgressProps {
  sections: Array<{
    id: string;
    title: string;
    status: GuideStatus;
  }>;
  currentSection: string;
}
```

**Visual Design:**
- Collapsed: Small floating button showing overall %
- Expanded: Minimal list with dots (no numbers, no gamification)
- Auto-collapse after 5 seconds of no interaction
- Keyboard accessible (Tab to expand)

**Example (Expanded):**
```
┌─────────────────┐
│ Your Progress   │
│                 │
│ ● Introduction  │  <- filled dot = completed
│ ● Concepts      │
│ ○ Next Steps    │  <- empty dot = not started
│                 │
│ [45% complete]  │
└─────────────────┘
```

#### 4.2.4 Completion Subtle Indicator

**Location**: Bottom of guide page

```typescript
// Component: CompletionIndicator
interface CompletionIndicatorProps {
  status: GuideStatus;
  onMarkComplete?: () => void;
  onMarkIncomplete?: () => void;
}
```

**Visual Design:**
- No confetti, no animations
- Simple text: "You've completed this guide"
- Option to mark incomplete (if user wants to re-read)
- Fade in smoothly when criteria met

### 4.3 Color Palette

```typescript
const PROGRESS_COLORS = {
  notStarted: 'transparent',
  viewed: 'rgb(var(--primary-500))',        // Purple dot
  engaged: 'rgb(var(--primary-400))',       // Lighter purple
  completed: 'rgb(var(--success-500))',     // Green checkmark
  progressBar: 'linear-gradient(90deg, 
    rgb(var(--primary-500)) 0%, 
    rgb(var(--secondary-500)) 100%)',
};
```

### 4.4 Animation Guidelines

- **Duration**: 300ms max for any transition
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- **No**: Bouncing, pulsing, or attention-grabbing animations
- **Yes**: Smooth fades, gentle width transitions
- **Respect**: `prefers-reduced-motion` media query

---

## 5. Privacy Considerations

### 5.1 Data Collection Policy

**What We Store:**
- Guide view timestamps (anonymous)
- Time spent on pages (anonymous)
- Scroll depth percentages (anonymous)
- Checklist completion states (anonymous)
- User preferences (opt-in/opt-out)

**What We NEVER Store:**
- IP addresses
- User agent strings
- Referrer information
- Personal identifiers
- Cross-site tracking data
- Keys or npubs (unless user opts in to future sync)

### 5.2 Data Retention

```typescript
interface RetentionPolicy {
  // Default: Keep progress indefinitely
  DEFAULT_RETENTION: 'indefinite',
  
  // User can choose shorter retention
  OPTIONS: {
    SESSION: 'clear-on-close',      // Clear when browser closes
    THIRTY_DAYS: '30d',             // Auto-purge after 30 days
    NINETY_DAYS: '90d',             // Auto-purge after 90 days
    INDEFINITE: 'forever',          // Keep until user deletes
  },
  
  // Purge inactive data after 1 year (configurable)
  AUTO_PURGE_AFTER: 31536000000,    // 365 days in ms
}
```

### 5.3 User Controls

**Privacy Settings UI:**
```typescript
interface PrivacyControls {
  // Master toggle
  enableProgressTracking: boolean;
  
  // Granular controls
  trackTimeSpent: boolean;
  trackScrollDepth: boolean;
  trackChecklists: boolean;
  
  // Data management
  dataRetentionPeriod: RetentionPolicy['OPTIONS'];
  
  // Actions
  exportData: () => void;      // Download as JSON
  importData: () => void;      // Upload JSON
  deleteAllData: () => void;   // Clear localStorage
}
```

### 5.4 Privacy Policy Updates

Add to existing privacy policy:

```markdown
## Progress Tracking

Nostrich.love offers optional progress tracking to help you keep track of guides you've read:

**How it works:**
- All progress data is stored locally in your browser (localStorage)
- No data is sent to our servers
- We cannot see your reading progress
- You can disable tracking at any time

**What we track:**
- Which guides you've viewed
- Approximate time spent reading
- How far you've scrolled
- Checklist item completion (within guides)

**What we don't track:**
- Your identity or personal information
- Your IP address or location
- Your Nostr keys or npub
- Activity on other websites

**Your controls:**
- Enable/disable progress tracking in settings
- Export your progress data anytime
- Delete all progress data with one click
- Set automatic data expiration
```

### 5.5 Security Considerations

```typescript
// Data sanitization
function sanitizeProgressData(data: unknown): ProgressData | null {
  // Validate structure
  // Check for XSS in guide IDs
  // Ensure no prototype pollution
  // Return null if invalid
}

// Storage size limits
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB (browser limit is ~5-10MB)

function checkStorageQuota(): boolean {
  const usage = JSON.stringify(localStorage).length;
  return usage < MAX_STORAGE_SIZE * 0.9; // Alert at 90%
}
```

---

## 6. Future Evolution: Optional npub Login

### 6.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  CURRENT STATE (Anonymous)                                  │
│  ┌─────────────┐         ┌─────────────┐                   │
│  │  Browser    │────────▶│ localStorage│                   │
│  │  (User)     │         │ (Progress)  │                   │
│  └─────────────┘         └─────────────┘                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  FUTURE STATE (Optional Npub Sync)                          │
│  ┌─────────────┐         ┌─────────────┐                   │
│  │  Browser    │────────▶│ localStorage│                   │
│  │  (User)     │         │ (Progress)  │                   │
│  └──────┬──────┘         └──────┬──────┘                   │
│         │                       │                           │
│         │  Nostr Event          │                           │
│         │  (Kind 30078)         │                           │
│         ▼                       ▼                           │
│  ┌─────────────────────────────────────┐                   │
│  │         Nostr Relays                │                   │
│  │  (Encrypted progress events)        │                   │
│  └─────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Nostr Event Structure (Kind 30078 - App-Specific Data)

```typescript
// NIP-78: Arbitrary app data
interface ProgressSyncEvent {
  kind: 30078;
  pubkey: string;           // User's npub
  created_at: number;
  tags: [
    ['d', 'nostrich-progress'],           // D-tag for retrieval
    ['t', 'progress-sync'],               // Type tag
    ['v', '1'],                           // Schema version
    ['device', '<device-hash>'],          // Anonymized device ID
    ['retention', '<retention-policy>'],  // User's retention preference
  ];
  content: string;          // Encrypted JSON (NIP-44)
}

// Content (encrypted) structure
interface EncryptedProgressData {
  deviceId: string;
  progress: ProgressData;
  syncedAt: number;
  schemaVersion: number;
}
```

### 6.3 Migration Path

#### Phase 1: Anonymous Only (Current)
- localStorage-based tracking
- No authentication required
- Full privacy

#### Phase 2: Optional npub Connection
- User can "connect" their npub (read-only)
- Generate proof-of-ownership without revealing nsec
- Optional: Sign message to verify ownership

#### Phase 3: Encrypted Sync
- Encrypt progress data with user's pubkey
- Publish to relays (Kind 30078)
- Retrieve and decrypt on new devices

#### Phase 4: Cross-Device Sync
- Automatic sync when npub connected
- Conflict resolution (last-write-wins or merge)
- Device management (view/remove devices)

### 6.4 Implementation Considerations

```typescript
// Future sync service (interface)
interface ProgressSyncService {
  // Check if npub is connected
  isConnected(): boolean;
  
  // Connect npub (sign challenge message)
  connect(npub: string): Promise<boolean>;
  
  // Disconnect (stop syncing)
  disconnect(): void;
  
  // Push local changes to relays
  syncToRelays(): Promise<void>;
  
  // Pull changes from relays
  syncFromRelays(): Promise<void>;
  
  // Merge remote with local (conflict resolution)
  mergeProgress(local: ProgressData, remote: ProgressData): ProgressData;
}

// Sync trigger conditions
const SYNC_TRIGGERS = {
  ON_COMPLETE: true,        // Sync when guide completed
  ON_INTERVAL: 300000,      // Sync every 5 minutes if changed
  ON_DEMAND: true,          // Manual sync button
  ON_NAVIGATE: false,       // Don't sync on every page change
};
```

### 6.5 Backwards Compatibility

```typescript
// Schema migration for future versions
interface SchemaMigration {
  fromVersion: number;
  toVersion: number;
  migrate: (oldData: unknown) => ProgressData;
}

const MIGRATIONS: SchemaMigration[] = [
  {
    fromVersion: 0,
    toVersion: 1,
    migrate: (old: any) => {
      // Migrate from old InteractiveChecklist format
      return {
        version: 1,
        deviceId: generateUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        guides: migrateOldGuides(old),
        paths: {},
        preferences: {
          optOut: false,
          showProgress: true,
          anonymizeStats: false,
        },
      };
    },
  },
];
```

---

## 7. Sample Code Snippets

### 7.1 Core Progress Service

```typescript
// src/services/progress.ts

import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'nostrich-progress';
const SESSION_KEY = 'nostrich-session';
const SCHEMA_VERSION = 1;

// Initialize or load progress data
export function initProgress(): ProgressData {
  const existing = loadProgress();
  if (existing) return existing;
  
  const newData: ProgressData = {
    version: SCHEMA_VERSION,
    deviceId: uuidv4(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    guides: {},
    paths: {},
    preferences: {
      optOut: false,
      showProgress: true,
      anonymizeStats: false,
    },
  };
  
  saveProgress(newData);
  return newData;
}

// Load from localStorage
export function loadProgress(): ProgressData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return migrateIfNeeded(parsed);
  } catch {
    return null;
  }
}

// Save to localStorage
export function saveProgress(data: ProgressData): void {
  try {
    data.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

// Update guide progress
export function updateGuideProgress(
  guideId: string,
  updates: Partial<GuideProgress>
): void {
  const data = loadProgress() || initProgress();
  
  if (data.preferences.optOut) return;
  
  const existing = data.guides[guideId] || {
    id: guideId,
    status: 'not-started',
    firstViewedAt: Date.now(),
    lastViewedAt: Date.now(),
    timeSpentMs: 0,
    scrollDepth: 0,
    completionCriteria: {
      minTimeMet: false,
      scrollDepthMet: false,
      checklistCompleted: false,
    },
  };
  
  data.guides[guideId] = { ...existing, ...updates };
  
  // Auto-evaluate completion status
  data.guides[guideId].status = evaluateStatus(data.guides[guideId]);
  
  saveProgress(data);
}

// Evaluate completion status based on criteria
function evaluateStatus(guide: GuideProgress): GuideStatus {
  const { minTimeMet, scrollDepthMet, checklistCompleted } = guide.completionCriteria;
  const criteriaMet = [minTimeMet, scrollDepthMet, checklistCompleted].filter(Boolean).length;
  
  if (criteriaMet >= 2) return 'completed';
  if (guide.timeSpentMs > 30000 || guide.scrollDepth > 50) return 'engaged';
  if (guide.timeSpentMs > 10000) return 'viewed';
  return 'not-started';
}

// Clear all progress data
export function clearAllProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SESSION_KEY);
  // Clear checklist data
  Object.keys(localStorage)
    .filter(key => key.startsWith('nostrich-checklist-'))
    .forEach(key => localStorage.removeItem(key));
}

// Export progress data (for user download)
export function exportProgress(): string {
  const data = loadProgress();
  if (!data) return '{}';
  
  return JSON.stringify({
    exportedAt: Date.now(),
    data,
  }, null, 2);
}

// Import progress data (from user upload)
export function importProgress(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.data || !parsed.data.version) return false;
    
    saveProgress(parsed.data);
    return true;
  } catch {
    return false;
  }
}

// Migration handler
function migrateIfNeeded(data: any): ProgressData {
  const currentVersion = data?.version || 0;
  
  if (currentVersion < SCHEMA_VERSION) {
    // Apply migrations sequentially
    for (const migration of MIGRATIONS) {
      if (migration.fromVersion === currentVersion) {
        data = migration.migrate(data);
      }
    }
  }
  
  return data;
}
```

### 7.2 Time Tracking Hook

```typescript
// src/hooks/useTimeTracking.ts

import { useEffect, useRef, useCallback } from 'react';
import { updateGuideProgress } from '../services/progress';

interface TimeTrackingConfig {
  guideId: string;
  estimatedTimeMinutes: number;
}

export function useTimeTracking({ guideId, estimatedTimeMinutes }: TimeTrackingConfig) {
  const startTimeRef = useRef<number>(Date.now());
  const totalTimeRef = useRef<number>(0);
  const idleStartRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  
  // Save progress periodically
  const saveProgress = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const minTimeNeeded = estimatedTimeMinutes * 60 * 1000 * 0.6; // 60% of estimated
    
    updateGuideProgress(guideId, {
      timeSpentMs: totalTimeRef.current + elapsed,
      lastViewedAt: Date.now(),
      completionCriteria: {
        minTimeMet: (totalTimeRef.current + elapsed) >= minTimeNeeded,
        // Preserve other criteria
        scrollDepthMet: false,
        checklistCompleted: false,
      },
    });
  }, [guideId, estimatedTimeMinutes]);
  
  useEffect(() => {
    // Track idle state
    const handleActivity = () => {
      if (idleStartRef.current) {
        const idleTime = Date.now() - idleStartRef.current;
        totalTimeRef.current += Date.now() - startTimeRef.current - idleTime;
        startTimeRef.current = Date.now();
        idleStartRef.current = null;
      }
    };
    
    const handleIdle = () => {
      if (!idleStartRef.current) {
        idleStartRef.current = Date.now();
      }
    };
    
    // Set up activity listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, handleActivity));
    
    // Idle detection
    const idleInterval = setInterval(() => {
      if (Date.now() - startTimeRef.current > 60000 && !idleStartRef.current) {
        handleIdle();
      }
    }, 10000);
    
    // Periodic save (every 30 seconds)
    const saveInterval = setInterval(saveProgress, 30000);
    
    return () => {
      events.forEach(event => document.removeEventListener(event, handleActivity));
      clearInterval(idleInterval);
      clearInterval(saveInterval);
      saveProgress(); // Final save on unmount
    };
  }, [saveProgress]);
  
  return {
    getTimeSpent: () => totalTimeRef.current + (Date.now() - startTimeRef.current),
  };
}
```

### 7.3 Scroll Tracking Hook

```typescript
// src/hooks/useScrollTracking.ts

import { useEffect, useRef, useCallback } from 'react';
import { updateGuideProgress } from '../services/progress';

interface ScrollTrackingConfig {
  guideId: string;
}

export function useScrollTracking({ guideId }: ScrollTrackingConfig) {
  const maxScrollRef = useRef<number>(0);
  const lastSaveRef = useRef<number>(0);
  
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    
    if (scrollPercent > maxScrollRef.current) {
      maxScrollRef.current = scrollPercent;
      
      // Debounce saves (max once per second)
      if (Date.now() - lastSaveRef.current > 1000) {
        updateGuideProgress(guideId, {
          scrollDepth: maxScrollRef.current,
          completionCriteria: {
            scrollDepthMet: maxScrollRef.current >= 80,
            minTimeMet: false,
            checklistCompleted: false,
          },
        });
        lastSaveRef.current = Date.now();
      }
    }
  }, [guideId]);
  
  useEffect(() => {
    let rafId: number;
    let ticking = false;
    
    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);
  
  return {
    getScrollDepth: () => maxScrollRef.current,
  };
}
```

### 7.4 Subtle Progress Bar Component

```typescript
// src/components/progress/ReadingProgressBar.tsx

import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface ReadingProgressBarProps {
  className?: string;
  showOnScrollOnly?: boolean;
}

export function ReadingProgressBar({ 
  className,
  showOnScrollOnly = true 
}: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(!showOnScrollOnly);
  const hideTimeoutRef = React.useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setProgress(Math.min(scrollPercent, 100));
      
      if (showOnScrollOnly) {
        setIsVisible(true);
        
        // Clear existing timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        
        // Hide after 2 seconds of no scrolling
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [showOnScrollOnly]);
  
  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-[2px]',
        'transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
        style={{ 
          width: `${progress}%`,
          transition: 'width 100ms linear'
        }}
      />
    </div>
  );
}
```

### 7.5 Guide Card Progress Component

```typescript
// src/components/progress/GuideCardProgress.tsx

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { GuideStatus } from '../../services/progress';

interface GuideCardProgressProps {
  guideId: string;
  status: GuideStatus;
  progress?: number;
  className?: string;
}

export function GuideCardProgress({ 
  status, 
  progress = 0,
  className 
}: GuideCardProgressProps) {
  // Don't show anything for not-started
  if (status === 'not-started') return null;
  
  // Completed: Checkmark
  if (status === 'completed') {
    return (
      <div className={cn("flex items-center gap-1 text-green-500", className)}>
        <Check className="w-4 h-4" />
        <span className="text-xs">Done</span>
      </div>
    );
  }
  
  // Engaged: Progress arc
  if (status === 'engaged') {
    const circumference = 2 * Math.PI * 12; // r=12
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    return (
      <div className={cn("relative w-6 h-6", className)}>
        <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
          {/* Background circle */}
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress arc */}
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-purple-500"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: 'stroke-dashoffset 300ms ease-out',
            }}
          />
        </svg>
      </div>
    );
  }
  
  // Viewed: Small dot
  return (
    <div 
      className={cn(
        "w-2 h-2 rounded-full bg-purple-500",
        className
      )} 
    />
  );
}
```

### 7.6 Privacy Controls Component

```typescript
// src/components/progress/PrivacyControls.tsx

import React, { useState, useEffect } from 'react';
import { Download, Upload, Trash2, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  loadProgress, 
  saveProgress, 
  exportProgress, 
  importProgress,
  clearAllProgress 
} from '../../services/progress';

export function PrivacyControls() {
  const [preferences, setPreferences] = useState({
    optOut: false,
    showProgress: true,
    anonymizeStats: false,
  });
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const data = loadProgress();
    if (data) {
      setPreferences(data.preferences);
    }
  }, []);
  
  const updatePreference = (key: string, value: boolean) => {
    const data = loadProgress();
    if (data) {
      data.preferences = { ...data.preferences, [key]: value };
      saveProgress(data);
      setPreferences(data.preferences);
    }
  };
  
  const handleExport = () => {
    const data = exportProgress();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nostrich-progress-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importProgress(event.target?.result as string);
      if (success) {
        alert('Progress imported successfully!');
        window.location.reload();
      } else {
        alert('Failed to import progress. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure? This will permanently delete all your progress data.')) {
      clearAllProgress();
      window.location.reload();
    }
  };
  
  if (!mounted) return null;
  
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <div className="flex items-center gap-3">
        <Shield className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold">Privacy & Data</h3>
      </div>
      
      {/* Tracking Toggle */}
      <div className="space-y-3">
        <label className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Enable progress tracking
          </span>
          <input
            type="checkbox"
            checked={!preferences.optOut}
            onChange={(e) => updatePreference('optOut', !e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-purple-600"
          />
        </label>
        
        <label className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Show progress indicators
          </span>
          <input
            type="checkbox"
            checked={preferences.showProgress}
            onChange={(e) => updatePreference('showProgress', e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-purple-600"
          />
        </label>
      </div>
      
      {/* Data Management */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your data is stored locally in your browser. You can export, import, or delete it anytime.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
          
          <label className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <Upload className="w-4 h-4" />
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete All Data
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 8. Integration Guide

### 8.1 Adding to Guide Pages

```astro
---
// src/pages/guides/[slug].astro
import { ReadingProgressBar } from '../../components/progress/ReadingProgressBar';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { useScrollTracking } from '../../hooks/useScrollTracking';

const { guide } = Astro.props;
const estimatedTime = guide.data.estimatedTime || '5 min';
const timeMinutes = parseInt(estimatedTime);
---

<Layout title={guide.data.title}>
  <!-- Reading progress bar at top -->
  <ReadingProgressBar client:load showOnScrollOnly={true} />
  
  <!-- Track time and scroll -->
  <GuideTracker 
    client:load 
    guideId={guide.slug} 
    estimatedTimeMinutes={timeMinutes}
  />
  
  <article class="prose">
    <Content />
  </article>
  
  <!-- Completion indicator at bottom -->
  <CompletionIndicator 
    client:load 
    guideId={guide.slug}
    onMarkComplete={() => {/* manual completion */}}
  />
</Layout>
```

### 8.2 Adding to Guide Index

```astro
---
// src/pages/guides/index.astro
import { GuideCardProgress } from '../../components/progress/GuideCardProgress';
import { getGuideStatus } from '../../services/progress';

// Client-side script to hydrate progress
---

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {guides.map((guide) => (
    <a href={`/guides/${guide.slug}`} class="group relative">
      <div class="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors">
        <h3 class="font-semibold text-lg mb-2">{guide.data.title}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">{guide.data.description}</p>
        
        <!-- Progress indicator (client-side hydrated) -->
        <GuideCardProgressWrapper 
          client:load 
          guideId={guide.slug}
          className="absolute top-4 right-4"
        />
      </div>
    </a>
  ))}
</div>

<script>
  // Hydrate progress indicators on client
  import { loadProgress } from '../services/progress';
  
  const progress = loadProgress();
  if (progress) {
    document.querySelectorAll('[data-guide-id]').forEach((el) => {
      const guideId = el.getAttribute('data-guide-id');
      const guideProgress = progress.guides[guideId];
      if (guideProgress) {
        el.setAttribute('data-status', guideProgress.status);
      }
    });
  }
</script>
```

---

## 9. Testing Strategy

### 9.1 Unit Tests

```typescript
// src/services/__tests__/progress.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  initProgress, 
  loadProgress, 
  saveProgress, 
  updateGuideProgress,
  clearAllProgress 
} from '../progress';

describe('Progress Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with default data', () => {
    const progress = initProgress();
    
    expect(progress.version).toBe(1);
    expect(progress.deviceId).toBeDefined();
    expect(progress.preferences.optOut).toBe(false);
    expect(progress.guides).toEqual({});
  });

  it('should not track when opted out', () => {
    const progress = initProgress();
    progress.preferences.optOut = true;
    saveProgress(progress);
    
    updateGuideProgress('test-guide', { timeSpentMs: 1000 });
    
    const updated = loadProgress();
    expect(updated?.guides['test-guide']).toBeUndefined();
  });

  it('should evaluate completion status correctly', () => {
    // Test completion criteria
    const guide = {
      id: 'test',
      status: 'not-started' as const,
      completionCriteria: {
        minTimeMet: true,
        scrollDepthMet: true,
        checklistCompleted: false,
      },
      timeSpentMs: 0,
      scrollDepth: 0,
      firstViewedAt: Date.now(),
      lastViewedAt: Date.now(),
    };
    
    updateGuideProgress('test', guide);
    
    const progress = loadProgress();
    expect(progress?.guides['test']?.status).toBe('completed');
  });
});
```

### 9.2 E2E Tests

```typescript
// cypress/e2e/progress.cy.ts

describe('Progress Tracking', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/guides/quickstart');
  });

  it('should show reading progress bar on scroll', () => {
    cy.get('[data-testid="reading-progress-bar"]').should('not.be.visible');
    cy.scrollTo(0, 500);
    cy.get('[data-testid="reading-progress-bar"]').should('be.visible');
  });

  it('should save progress to localStorage', () => {
    cy.scrollTo('bottom');
    cy.wait(2000);
    
    cy.window().then((win) => {
      const data = win.localStorage.getItem('nostrich-progress');
      expect(data).to.not.be.null;
      
      const parsed = JSON.parse(data!);
      expect(parsed.guides['quickstart']).to.exist;
      expect(parsed.guides['quickstart'].scrollDepth).to.be.greaterThan(50);
    });
  });

  it('should respect opt-out preference', () => {
    // Opt out
    cy.visit('/settings');
    cy.get('[data-testid="opt-out-checkbox"]').click();
    
    // Visit guide
    cy.visit('/guides/quickstart');
    cy.scrollTo('bottom');
    cy.wait(2000);
    
    // Should not save
    cy.window().then((win) => {
      const data = win.localStorage.getItem('nostrich-progress');
      const parsed = JSON.parse(data!);
      expect(parsed.guides['quickstart']).to.be.undefined;
    });
  });
});
```

---

## 10. Summary

### Key Design Decisions

1. **Anonymous by Default**: No user identification required
2. **Minimal UI**: Progress indicators are subtle, not gamified
3. **User Control**: Full opt-out and data management
4. **Future-Proof**: Clear migration path to npub-based sync
5. **Privacy First**: No server storage, no tracking, no cookies

### Implementation Checklist

- [ ] Create progress service (`src/services/progress.ts`)
- [ ] Implement time tracking hook
- [ ] Implement scroll tracking hook  
- [ ] Create ReadingProgressBar component
- [ ] Create GuideCardProgress component
- [ ] Create PrivacyControls component
- [ ] Add to guide pages
- [ ] Add to guide index
- [ ] Update privacy policy
- [ ] Write tests
- [ ] Document for users

### Next Steps

1. **Phase 1** (Week 1-2): Implement anonymous tracking with subtle UI
2. **Phase 2** (Week 3): Add privacy controls and data export/import
3. **Phase 3** (Week 4): Testing, documentation, and launch
4. **Future Phase**: Design and implement optional npub sync (Kind 30078)

---

## 11. Bug Fixes & Improvements

### 11.1 localStorage Data Format Conflict (Fixed 2026-02-14)

**Issue:** Guide progress key `nostrich-gamification-v1:progress` was being deleted when visiting a guide and scrolling.

**Root Cause:** Two systems were writing incompatible data formats to the same localStorage key:
- `progressService.ts` - Saved data in `ProgressData` format (with `deviceId`, `schemaVersion`, `guides` object, etc.)
- `gamification.ts` / `progress.ts` - Expected `GamificationData` format (with `badges`, `progress.completedGuides` array, `stats`, `version`)

When `useProgressTracking.ts` called `updateGuideProgress()` on scroll, `saveProgressData()` **overwrote** the gamification data with the incompatible `ProgressData` format, corrupting localStorage.

**Fix Applied:**

Updated `saveProgressData()` in `src/lib/progressService.ts` (lines 130-174) to merge with existing data instead of overwriting:

```typescript
function saveProgressData(data: ProgressData): void {
  // ... validation code ...
  
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
  
  // Convert guides object to completedGuides array format
  const completedGuides = Object.values(cleanedData.guides)
    .filter(g => g.status === 'completed')
    .map(g => g.guideId);
  
  // Merge: keep existing gamification data, update progress fields
  const mergedData = {
    ...existingData,
    progress: {
      ...(existingData.progress as Record<string, unknown> || {}),
      completedGuides,
      lastActive: new Date().toISOString(),
    },
    version: (existingData.version as number) || 1,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
}
```

**Lessons Learned:**

1. **Multiple writers + single storage key = conflict risk**
   - When two systems share localStorage, define one canonical format
   - All writers must conform to that format
   - Use merge strategy to preserve data from other writers
   - Never assume you own the entire storage object

2. **Pattern: Merge-First LocalStorage Updates**
   ```typescript
   function updateSharedStorage(key: string, updates: Partial<Data>) {
     // 1. Read existing
     const existing = JSON.parse(localStorage.getItem(key) || '{}');
     
     // 2. Merge (deep merge for nested objects)
     const merged = deepMerge(existing, updates);
     
     // 3. Write back
     localStorage.setItem(key, JSON.stringify(merged));
   }
   ```

**Affected Files:**
- `src/lib/progressService.ts` - Fixed (lines 130-174)
- `src/lib/progress.ts` - Uses gamification format (unchanged)
- `src/utils/gamification.ts` - Defines canonical format (unchanged)
- `src/lib/useProgressTracking.ts` - Triggers updates (unchanged)

---

**Document Version**: 1.1  
**Last Updated**: February 2026  
**Author**: Agent 3 - Progress Tracking Spec Writer  
**Review Status**: Ready for Implementation
