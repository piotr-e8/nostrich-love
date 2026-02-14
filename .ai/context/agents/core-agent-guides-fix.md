# Core/TypeScript Agent - Guides System Fix Context

## Your Role
Handle data layer, storage unification, and badge logic for the guides system fix.

## Files You Own
1. `src/lib/progressService.ts`
2. `src/utils/gamification.ts`
3. `src/lib/progress.ts`

---

## Critical Issues to Fix

### 1. Enable Progress Tracking by Default
**File:** `src/lib/progressService.ts` (lines 24-29)

**Current (BROKEN):**
```typescript
const defaultPrivacySettings: PrivacySettings = {
  trackingEnabled: false,           // ← WRONG
  dataRetention: 'forever',
  showProgressIndicators: false,    // ← WRONG
  toursEnabled: true,
};
```

**Required Fix:**
```typescript
const defaultPrivacySettings: PrivacySettings = {
  trackingEnabled: true,            // ← FIX: Enable tracking
  dataRetention: 'forever',
  showProgressIndicators: true,     // ← FIX: Show indicators
  toursEnabled: true,
};
```

**Impact:** 
- Streak banner will display immediately
- Guide completion tracking will work
- No privacy concerns (all localStorage, no server)

---

### 2. Add Data Migration Logic
**File:** `src/lib/progress.ts`

**Problem:** Path stored in two places:
- `nostrich-gamification-v1` → `progress.activePath` (correct)
- `nostrich-user-path` → separate key (legacy, needs migration)

**Add to `getGamificationData()` or create `migrateLegacyData()`:**

```typescript
function migrateLegacyData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const oldPath = localStorage.getItem('nostrich-user-path');
    const data = getGamificationData();
    
    // Migrate old path storage to new unified storage
    if (oldPath && !data.progress?.activePath) {
      if (!data.progress) {
        data.progress = { completedGuides: [], streakDays: 0, lastActive: Date.now() };
      }
      data.progress.activePath = oldPath as LearningPathId;
      saveGamificationData(data);
      
      // Clean up old key after successful migration
      localStorage.removeItem('nostrich-user-path');
      console.log('[Guides] Migrated legacy path storage:', oldPath);
    }
  } catch (e) {
    console.error('[Guides] Migration error:', e);
  }
}

// Call migration on module load (browser only)
if (typeof window !== 'undefined') {
  migrateLegacyData();
}
```

---

### 3. Add Guide Badge Check Logic
**File:** `src/utils/gamification.ts`

**Task:** Add automatic badge checking for guide completion

**Context:** 
- Inline script in `[slug].astro` currently awards 5 guide badges
- We need to move this logic to gamification.ts
- Keep ONLY the 8 existing badges, add check logic for guide-based ones

**Existing badges in gamification.ts:**
1. `key-master` - Generated keys
2. `first-post` - Made first post
3. `zap-receiver` - Received zap
4. `community-builder` - Followed 10+ accounts
5. `knowledge-seeker` - Completed 3 beginner guides (EXISTING!)
6. `nostr-graduate` - Completed all beginner guides (EXISTING!)
7. `security-conscious` - Backed up keys
8. `relay-explorer` - Connected to 3+ relays

**Add function to check and award guide badges:**

```typescript
import { LEARNING_PATHS } from '../data/learning-paths';

export function checkAndAwardGuideBadges(): BadgeCheckResult {
  const data = loadGamificationData();
  const completedCount = data.progress.completedGuides.length;
  const newlyEarned: BadgeId[] = [];
  
  // knowledge-seeker: 3 guides (badge #5 in list)
  if (completedCount >= 3 && !data.badges['knowledge-seeker'].earned) {
    awardBadge('knowledge-seeker');
    newlyEarned.push('knowledge-seeker');
  }
  
  // nostr-graduate: ALL beginner guides
  const beginnerGuides = LEARNING_PATHS.beginner.sequence;
  const completedBeginner = beginnerGuides.filter(guide => 
    data.progress.completedGuides.includes(guide)
  );
  
  if (completedBeginner.length === beginnerGuides.length && 
      !data.badges['nostr-graduate'].earned) {
    awardBadge('nostr-graduate');
    newlyEarned.push('nostr-graduate');
  }
  
  return {
    newlyEarned,
    alreadyEarned: Object.keys(data.badges).filter(id => data.badges[id as BadgeId].earned) as BadgeId[],
    progress: (completedCount / beginnerGuides.length) * 100,
  };
}
```

**Call this function:**
- When guide is marked complete (in progress.ts `markGuideCompleted()`)
- After component loads (for delayed badge awards)

---

## Data Structures You Must Know

### Gamification Data Format (STORAGE_KEY: 'nostrich-gamification-v1')
```typescript
{
  badges: {
    'key-master': { earned: boolean, earnedAt: number },
    'first-post': { earned: boolean, earnedAt: number },
    ...
  },
  progress: {
    completedGuides: string[],  // ['what-is-nostr', 'quickstart', ...]
    streakDays: number,
    lastActive: number | null,  // Unix timestamp
    activePath?: LearningPathId, // 'beginner' | 'bitcoiner' | 'privacy' | 'general'
    lastViewed?: LastViewedGuide,
    pathProgress?: Record<string, PathProgress>
  },
  stats: {
    keysGenerated: boolean,
    firstPostMade: boolean,
    ...
  },
  version: 1
}
```

### Learning Paths (from '../data/learning-paths')
```typescript
LEARNING_PATHS = {
  beginner: {
    sequence: ['what-is-nostr', 'keys-and-security', 'quickstart', 'relays-demystified', 'nip05-identity', 'zaps-and-lightning', 'finding-community', 'nostr-tools', 'troubleshooting']
  },
  bitcoiner: {
    sequence: ['quickstart', 'zaps-and-lightning', 'relays-demystified', 'finding-community', 'nostr-tools', 'troubleshooting', 'relay-guide', 'faq']
  },
  privacy: {
    sequence: ['what-is-nostr', 'keys-and-security', 'quickstart', 'relays-demystified', 'privacy-security', 'nip05-identity', 'troubleshooting', 'faq']
  },
  general: {
    sequence: [...] // All 15 guides
  }
}
```

---

## Functions You Must Provide

### For React Components:
```typescript
// Get current active path
export function getActivePath(): LearningPathId {
  const data = getGamificationData();
  return data.progress?.activePath || 'beginner';
}

// Set active path
export function setActivePath(pathId: LearningPathId): void {
  const data = getGamificationData();
  if (!data.progress) {
    data.progress = { completedGuides: [], streakDays: 0, lastActive: Date.now() };
  }
  data.progress.activePath = pathId;
  saveGamificationData(data);
}

// Mark guide as complete + check badges
export function markGuideCompleted(guideSlug: string): void {
  const data = getGamificationData();
  if (!data.progress.completedGuides.includes(guideSlug)) {
    data.progress.completedGuides.push(guideSlug);
    data.progress.lastActive = Date.now();
    saveGamificationData(data);
    
    // Check for new badges
    checkAndAwardGuideBadges();
  }
}
```

---

## Success Criteria

- [ ] `trackingEnabled: true` by default
- [ ] Legacy `nostrich-user-path` data migrated successfully
- [ ] `knowledge-seeker` badge awards at 3 guides
- [ ] `nostr-graduate` badge awards at all beginner guides complete
- [ ] No duplicate badge awards
- [ ] All functions exported and usable by React components

---

## Testing Checklist

```typescript
// Test 1: Fresh user gets tracking enabled
const settings = loadPrivacySettings();
assert(settings.trackingEnabled === true);

// Test 2: Legacy migration
localStorage.setItem('nostrich-user-path', 'bitcoiner');
localStorage.setItem('nostrich-gamification-v1', JSON.stringify({
  progress: { completedGuides: [], streakDays: 0, lastActive: null }
}));
migrateLegacyData();
const data = loadGamificationData();
assert(data.progress.activePath === 'bitcoiner');

// Test 3: Badge awarding
// Simulate completing 3 guides
data.progress.completedGuides = ['guide1', 'guide2', 'guide3'];
saveGamificationData(data);
const result = checkAndAwardGuideBadges();
assert(result.newlyEarned.includes('knowledge-seeker'));
```

---

## Coordination Notes

- **Phase 1** you work first (Foundation)
- **Phase 2** Frontend agent depends on your `getActivePath()` function
- **Phase 4** you add badge logic after navigation is fixed
- Export all new functions clearly for other agents

## Error Handling Requirements

### All localStorage Operations MUST Use try/catch

**Pattern:**
```typescript
function safeLocalStorageRead(key: string): any {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error(`[Guides] Failed to read ${key}:`, e);
    return null;
  }
}

function safeLocalStorageWrite(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`[Guides] Failed to write ${key}:`, e);
    return false;
  }
}
```

### Specific Error Cases to Handle

**1. localStorage Full (QuotaExceededError)**
```typescript
try {
  localStorage.setItem(key, value);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    console.warn('[Guides] localStorage full, clearing old data');
    // Clear old/completed guide data, keep essential
    cleanupOldData();
    // Retry once
    try {
      localStorage.setItem(key, value);
    } catch (e2) {
      console.error('[Guides] localStorage still full after cleanup');
    }
  }
}
```

**2. Corrupted JSON (SyntaxError)**
```typescript
try {
  return JSON.parse(data);
} catch (e) {
  console.error('[Guides] Corrupted data, resetting:', e);
  return getDefaultData();
}
```

**3. Missing Data (null/undefined)**
```typescript
const data = getGamificationData();
if (!data.progress) {
  data.progress = { completedGuides: [], streakDays: 0, lastActive: Date.now() };
}
if (!data.progress.activePath) {
  data.progress.activePath = 'beginner';
}
```

**4. Invalid Path IDs**
```typescript
const validPaths = ['beginner', 'bitcoiner', 'privacy', 'general'];
if (!validPaths.includes(pathId)) {
  console.warn(`[Guides] Invalid path: ${pathId}, defaulting to beginner`);
  return 'beginner';
}
```

**5. Missing Guide Slugs**
```typescript
const validGuides = LEARNING_PATHS.general.sequence; // All guides
if (!validGuides.includes(guideSlug)) {
  console.warn(`[Guides] Invalid guide slug: ${guideSlug}`);
  return false;
}
```

### Graceful Degradation

**If gamification data is corrupted:**
- Return default values
- Log error
- Continue functioning (don't crash)

**If localStorage unavailable:**
- Return default values
- Disable tracking features
- Log warning

**If migration fails:**
- Keep old data intact
- Try again on next load
- Don't lose user progress

---

## Questions?

Ask the orchestrator if anything is unclear before starting.
