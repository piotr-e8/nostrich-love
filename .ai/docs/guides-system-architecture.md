# Guides System Architecture

**Purpose:** Architecture overview for future maintenance and extension  
**Last Updated:** 2026-02-14  
**Status:** Being Implemented

---

## Overview

The guides system provides:
- **Learning Paths:** Curated sequences of guides (beginner, bitcoiner, privacy, general)
- **Progress Tracking:** Which guides user has completed
- **Navigation:** Previous/next guide within current path
- **Badges:** Achievement rewards for completing guides
- **Streaks:** Daily activity tracking

---

## Architecture Principles

### 1. **Privacy-First**
- All data stored in localStorage
- No server communication
- User owns their data

### 2. **Client-Side Only**
- Server can't access localStorage
- Navigation calculated client-side
- No SSR for dynamic content

### 3. **Single Source of Truth**
- One storage key: `nostrich-gamification-v1`
- One badge system: `gamification.ts`
- One progress system: `progress.ts`

### 4. **Graceful Degradation**
- Works if localStorage unavailable
- Handles corrupted data
- Never crashes on errors

---

## Data Flow

```
User Action
    ↓
React Component (GuideNavigation, ContinueLearning)
    ↓
Progress/Gamification Functions (progress.ts, gamification.ts)
    ↓
localStorage (`nostrich-gamification-v1`)
    ↓
UI Update (green dots, badges, streak banner)
```

---

## Storage Schema

### Primary Key: `nostrich-gamification-v1`

```typescript
{
  // Badge achievements
  badges: {
    'key-master': { earned: boolean, earnedAt: timestamp },
    'first-post': { earned: boolean, earnedAt: timestamp },
    'zap-receiver': { earned: boolean, earnedAt: timestamp },
    'community-builder': { earned: boolean, earnedAt: timestamp },
    'knowledge-seeker': { earned: boolean, earnedAt: timestamp },
    'nostr-graduate': { earned: boolean, earnedAt: timestamp },
    'security-conscious': { earned: boolean, earnedAt: timestamp },
    'relay-explorer': { earned: boolean, earnedAt: timestamp }
  },
  
  // Progress tracking
  progress: {
    // All completed guides (global)
    completedGuides: string[],
    
    // Streak tracking
    streakDays: number,
    lastActive: timestamp,
    
    // Current path
    activePath: 'beginner' | 'bitcoiner' | 'privacy' | 'general',
    
    // Last viewed guide
    lastViewed: {
      slug: string,
      title: string,
      path: string,
      timestamp: number
    },
    
    // Per-path progress
    pathProgress: {
      [pathId]: {
        completedGuides: string[],
        startedAt: timestamp,
        lastActiveAt: timestamp
      }
    }
  },
  
  // Action tracking
  stats: {
    keysGenerated: boolean,
    firstPostMade: boolean,
    firstZapReceived: boolean,
    accountsFollowed: number,
    keysBackedUp: boolean,
    relaysConnected: number
  },
  
  version: 1
}
```

---

## Learning Paths

### Path Definitions (`data/learning-paths.ts`)

```typescript
LEARNING_PATHS = {
  beginner: {
    sequence: [
      'what-is-nostr',
      'keys-and-security',
      'quickstart',
      'relays-demystified',
      'nip05-identity',
      'zaps-and-lightning',
      'finding-community',
      'nostr-tools',
      'troubleshooting'
    ]
  },
  
  bitcoiner: {
    sequence: [
      'quickstart',
      'zaps-and-lightning',
      'relays-demystified',
      'finding-community',
      'nostr-tools',
      'troubleshooting',
      'relay-guide',
      'faq'
    ]
  },
  
  privacy: {
    sequence: [
      'what-is-nostr',
      'keys-and-security',
      'quickstart',
      'relays-demystified',
      'privacy-security',
      'nip05-identity',
      'troubleshooting',
      'faq'
    ]
  },
  
  general: {
    sequence: [
      // All 15 guides in order
    ]
  }
}
```

---

## Component Architecture

### GuideNavigation.tsx
**Purpose:** Previous/Next navigation within current path

**Data Flow:**
1. Mount: Get activePath from localStorage
2. Calculate: Find current position in path sequence
3. Render: Previous/Next buttons based on position
4. Edge Cases: First guide (no previous), Last guide (path complete), Off-path

**States:**
- Loading (initial mount)
- First guide
- Middle guides
- Last guide (path complete celebration)
- Off-path (not in current path)

### ContinueLearning.tsx
**Purpose:** Modal shown when guide nearly complete

**Data Flow:**
1. Track scroll position (80% threshold)
2. Calculate next guide from path
3. Show modal with next guide info
4. Handle last guide (show completion message)

**States:**
- Hidden (scrolling)
- Visible with next guide
- Visible with path complete
- Off-path (hide or different message)

### EnhancedGuideCompletionIndicator.tsx
**Purpose:** Expandable timeline of all guides in path

**Data Flow:**
1. Read completedGuides from localStorage
2. Map to path sequence
3. Show completion status for each guide
4. Handle prerequisites

**Features:**
- Collapsed view (mini progress bar)
- Expanded view (full timeline)
- Prerequisite warnings
- Current guide highlight

---

## Key Functions

### progress.ts

```typescript
// Get current path
getActivePath(): LearningPathId

// Set current path
setActivePath(pathId: LearningPathId): void

// Mark guide complete
markGuideCompleted(guideSlug: string): void

// Check if guide complete
isGuideCompleted(guideSlug: string): boolean

// Get progress for current path
getCurrentPathProgress(): { completed, total, percentage, nextGuide }
```

### gamification.ts

```typescript
// Load all gamification data
loadGamificationData(): GamificationData

// Save gamification data
saveGamificationData(data: GamificationData): void

// Award a badge
awardBadge(badgeId: BadgeId): void

// Check and award guide badges
checkAndAwardGuideBadges(): BadgeCheckResult
```

---

## Navigation Logic

### Calculating Previous/Next

```typescript
function getNavigation(currentSlug: string, activePath: string) {
  const pathConfig = LEARNING_PATHS[activePath];
  
  // CASE: Guide not in current path
  if (!pathConfig.sequence.includes(currentSlug)) {
    return {
      prev: null,
      next: null,
      showOffPathMessage: true
    };
  }
  
  const currentIndex = pathConfig.sequence.indexOf(currentSlug);
  
  // CASE: First guide
  if (currentIndex === 0) {
    return {
      prev: null,
      next: pathConfig.sequence[1],
      isFirst: true
    };
  }
  
  // CASE: Last guide
  if (currentIndex === pathConfig.sequence.length - 1) {
    return {
      prev: pathConfig.sequence[currentIndex - 1],
      next: null,
      isLast: true
    };
  }
  
  // CASE: Middle guide
  return {
    prev: pathConfig.sequence[currentIndex - 1],
    next: pathConfig.sequence[currentIndex + 1],
    isFirst: false,
    isLast: false
  };
}
```

---

## Badge System

### Guide Completion Badges

**knowledge-seeker:**
- Requirement: Complete 3 guides
- Check: `completedGuides.length >= 3`

**nostr-graduate:**
- Requirement: Complete all beginner guides
- Check: All guides in `LEARNING_PATHS.beginner.sequence` completed

### Awarding Logic

```typescript
function checkAndAwardGuideBadges() {
  const data = loadGamificationData();
  const completedCount = data.progress.completedGuides.length;
  
  // Check knowledge-seeker
  if (completedCount >= 3 && !data.badges['knowledge-seeker'].earned) {
    awardBadge('knowledge-seeker');
  }
  
  // Check nostr-graduate
  const beginnerGuides = LEARNING_PATHS.beginner.sequence;
  const allBeginnerComplete = beginnerGuides.every(guide => 
    data.progress.completedGuides.includes(guide)
  );
  
  if (allBeginnerComplete && !data.badges['nostr-graduate'].earned) {
    awardBadge('nostr-graduate');
  }
}
```

---

## Error Handling Strategy

### localStorage Errors

**QuotaExceeded:**
- Clear old/completed data
- Retry once
- If still full, disable tracking

**Corrupted JSON:**
- Reset to defaults
- Log error
- Preserve essential data if possible

**Missing Data:**
- Initialize with defaults
- Continue gracefully

### React Component Errors

**Error Boundaries:**
- Wrap navigation components
- Show fallback UI on error
- Allow retry

---

## Migration Strategy

### Legacy Data (Before This Fix)

**Old storage keys:**
- `nostrich-user-path` → Migrate to `progress.activePath`
- Inline script format → Migrate to gamification format

**Migration on load:**
```typescript
function migrateLegacyData() {
  const oldPath = localStorage.getItem('nostrich-user-path');
  if (oldPath && !data.progress?.activePath) {
    data.progress.activePath = oldPath;
    localStorage.removeItem('nostrich-user-path');
  }
}
```

---

## Extension Points

### Adding a New Path

1. Add to `LEARNING_PATHS` in `data/learning-paths.ts`
2. Add sequence of guide slugs
3. Update UI to show new path option
4. Test navigation through new path

### Adding a New Badge

1. Add badge definition to `BADGE_DEFINITIONS` in `gamification.ts`
2. Add check logic in `checkAndAwardGuideBadges()`
3. Add UI component to display badge
4. Test badge awarding

### Adding Guide Completion Tracking

1. Call `markGuideCompleted(slug)` when guide read
2. Threshold: 80% scroll or manual completion
3. Check badges after marking complete

---

## Testing Strategy

### Unit Tests
- Badge awarding logic
- Path navigation calculation
- Data migration

### Integration Tests
- End-to-end guide flow
- Path switching
- Badge awarding
- Streak tracking

### Manual Tests
- All 4 paths
- First/middle/last guide
- Off-path navigation
- Badge celebrations
- Streak banner

---

## Common Issues & Solutions

### Issue: Navigation shows wrong guides
**Cause:** Using global order instead of path sequence  
**Fix:** Calculate from `LEARNING_PATHS[activePath].sequence`

### Issue: Duplicate badges awarded
**Cause:** Multiple systems awarding badges  
**Fix:** Use only `gamification.ts` for badge awarding

### Issue: Progress not tracked
**Cause:** `trackingEnabled: false` by default  
**Fix:** Enable by default in `progressService.ts`

### Issue: Streak banner not showing
**Cause:** Tracking disabled or streakDays = 0  
**Fix:** Enable tracking, verify streak calculation

### Issue: Off-path guides show weird navigation
**Cause:** Guide not in current path sequence  
**Fix:** Show "Back to Guides" message

---

## Performance Considerations

### localStorage Access
- Cache frequently accessed data in component state
- Batch writes (debounce)
- Avoid reading on every render

### React Re-renders
- Use `useMemo` for expensive calculations
- Debounce scroll handlers
- Memoize guide titles map

### Bundle Size
- Lazy load gamification components
- Tree-shake unused badge definitions

---

## Security Considerations

### localStorage
- User can modify their own data (expected)
- No sensitive data stored
- XSS protection: Validate data before use

### No Server Contact
- All gamification is client-side
- No authentication needed
- User controls their own progress

---

## Future Improvements

### Potential Features
- Sync progress across devices (optional)
- Export/import progress
- Analytics (opt-in)
- More badge types
- Path recommendations

### Technical Debt
- Consolidate progressService.ts and progress.ts
- Add proper TypeScript strict mode
- Add unit tests
- Add E2E tests with Playwright

---

## Related Files

**Data:**
- `src/data/learning-paths.ts` - Path definitions

**Logic:**
- `src/lib/progress.ts` - Path/progress functions
- `src/lib/progressService.ts` - Privacy settings
- `src/utils/gamification.ts` - Badge system

**Components:**
- `src/components/navigation/GuideNavigation.tsx`
- `src/components/navigation/ContinueLearning.tsx`
- `src/components/navigation/EnhancedGuideCompletionIndicator.tsx`
- `src/components/gamification/StreakBannerWrapper.tsx`

**Pages:**
- `src/pages/guides/index.astro` - Guide listing
- `src/pages/guides/[slug].astro` - Individual guide

---

## Changelog

### 2026-02-14 - Initial Architecture
- Unified storage under `nostrich-gamification-v1`
- Client-only navigation calculation
- Path-aware progress tracking
- Guide completion badges

---

## Questions?

For future maintenance, refer to:
- `.ai/plans/guides-system-fix.md` - Implementation plan
- `.ai/context/agents/*` - Agent context files
- `.ai/memory/execution-patterns.md` - Execution pattern

For debugging, check:
- Browser DevTools → Application → Local Storage
- Console for `[Guides]` tagged errors
- Network tab (no requests expected)
