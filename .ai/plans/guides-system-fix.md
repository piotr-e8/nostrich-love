# Guides System Fix - Implementation Plan

**Created:** 2026-02-14  
**Status:** Ready for execution  
**Priority:** High

## Overview

Fixing 5 critical issues in guides gamification/navigation system. Using existing `gamification.ts` system only - no changes to the 8 badges.

---

## Issues Being Fixed

1. ✅ **Duplicate Badges** - Inline script and gamification.ts both awarding
2. ✅ **Progress Not Tracked** - `trackingEnabled: false` by default
3. ✅ **Wrong Navigation** - Server SSR vs client path mismatch
4. ✅ **Streak Banner Missing** - Tracking disabled
5. ✅ **Data Corruption** - Multiple storage keys/formats

---

## Confirmed Decisions

1. **Last guide in path:** Show "🎉 Path Complete!" celebration message
2. **Off-path guide:** Show "Back to Guides" + smart path switch suggestion
3. **Path switching:** Global completion status, per-path progress percentages

---

## Phase 1: Data Cleanup (Foundation)

### 1.1 Remove Inline Script from [slug].astro
**File:** `src/pages/guides/[slug].astro`  
**Lines:** 295-540 (the entire `<script>` block)

**Remove:**
- Badge definitions (BADGES object)
- `trackGuideCompletion()` function
- `checkAndAwardBadges()` function
- `badge-earned` CustomEvent dispatch
- All inline gamification logic

**Keep:**
- `guide-completed` event (for streak updates)
- Component imports and usage

### 1.2 Enable Progress Tracking by Default
**File:** `src/lib/progressService.ts`  
**Lines:** 24-29

```typescript
// BEFORE
const defaultPrivacySettings: PrivacySettings = {
  trackingEnabled: false,
  dataRetention: 'forever',
  showProgressIndicators: false,
  toursEnabled: true,
};

// AFTER
const defaultPrivacySettings: PrivacySettings = {
  trackingEnabled: true,        // ← Change from false
  dataRetention: 'forever',
  showProgressIndicators: true, // ← Change from false
  toursEnabled: true,
};
```

**Impact:** Streak banner displays, progress tracking works immediately

### 1.3 Unify Path Storage
**Files to update:**
- `src/pages/guides/index.astro` (lines 504, 577+)
- `src/pages/index.astro`
- `src/lib/progress.ts`

**Changes:**
- Remove `PATH_STORAGE_KEY = 'nostrich-user-path'` usage
- Use `getActivePath()` / `setActivePath()` from `progress.ts`
- Migrate existing `nostrich-user-path` data on first read

---

## Phase 2: Navigation (Strictly Path-Only)

### 2.1 GuideNavigation Component
**File:** `src/components/navigation/GuideNavigation.tsx`

**Implementation:**
```typescript
// Initial state shows loading
const [prevGuide, setPrevGuide] = useState<GuideInfo | undefined>(undefined);
const [nextGuide, setNextGuide] = useState<GuideInfo | undefined>(undefined);

useEffect(() => {
  const path = getActivePath();
  const currentSlug = getCurrentSlugFromURL();
  const pathConfig = LEARNING_PATHS[path];
  
  if (!pathConfig?.sequence.includes(currentSlug)) {
    // Off-path: show back button + path switch suggestion
    setShowOffPathMessage(true);
    setSuggestedPath(findPathContainingGuide(currentSlug));
    setPrevGuide(null);
    setNextGuide(null);
    return;
  }
  
  // In-path: calculate from sequence
  const currentIndex = pathConfig.sequence.indexOf(currentSlug);
  
  if (currentIndex === pathConfig.sequence.length - 1) {
    // Last guide: show completion message
    setIsPathComplete(true);
    setPrevGuide(getGuideInfo(pathConfig.sequence[currentIndex - 1]));
    setNextGuide(null);
  } else {
    setPrevGuide(currentIndex > 0 ? getGuideInfo(pathConfig.sequence[currentIndex - 1]) : null);
    setNextGuide(getGuideInfo(pathConfig.sequence[currentIndex + 1]));
  }
  
  setIsLoading(false);
}, []);
```

**UI States:**
- **Loading:** Spinner or skeleton
- **First guide:** "Start of [Path] Path" (no previous)
- **Middle guides:** Prev/Next with titles
- **Last guide:** "🎉 Path Complete!" + prev button + "Explore Other Paths"
- **Off-path:** "Back to Guides" + "Switch to [Path] Path"

### 2.2 ContinueLearning Component
**File:** `src/components/navigation/ContinueLearning.tsx`

**Same pattern:**
- Calculate `nextGuide` from path sequence
- Handle last-guide case (show completion message instead)
- Handle off-path case (hide or show different CTA)

### 2.3 EnhancedGuideCompletionIndicator
**File:** `src/components/navigation/EnhancedGuideCompletionIndicator.tsx`

**Update data source:**
```typescript
// Change from progressService.ts
const gamificationData = loadGamificationData();
const completedGuides = gamificationData.progress.completedGuides;

// Convert to component's expected format
const progress = {};
completedGuides.forEach(slug => {
  progress[slug] = { status: 'completed' };
});
```

---

## Phase 3: Guide Cards Progress

### 3.1 Update guides/index.astro
**File:** `src/pages/guides/index.astro`

**Progress calculation:**
```javascript
const parsed = JSON.parse(localStorage.getItem('nostrich-gamification-v1'));
const completedGuides = parsed.progress?.completedGuides || [];

// Per-path progress display
const getPathProgress = (pathId) => {
  const path = LEARNING_PATHS[pathId];
  const completedInPath = path.sequence.filter(g => completedGuides.includes(g));
  return {
    completed: completedInPath.length,
    total: path.sequence.length,
    percentage: Math.round((completedInPath.length / path.sequence.length) * 100)
  };
};
```

**UI Updates:**
- Show per-path progress on path selector cards
- Green dots on guide cards

---

## Phase 4: Badge Integration

### 4.1 Add Guide Badge Checks to gamification.ts
**File:** `src/utils/gamification.ts`

**Add function:**
```typescript
export function checkGuideBadges(data: GamificationData): BadgeCheckResult {
  const completedCount = data.progress.completedGuides.length;
  const newlyEarned: BadgeId[] = [];
  
  // knowledge-seeker: 3 guides
  if (completedCount >= 3 && !data.badges['knowledge-seeker'].earned) {
    newlyEarned.push('knowledge-seeker');
  }
  
  // nostr-graduate: all beginner guides
  const beginnerGuides = LEARNING_PATHS.beginner.sequence;
  const completedBeginner = beginnerGuides.filter(g => 
    data.progress.completedGuides.includes(g)
  );
  if (completedBeginner.length === beginnerGuides.length && 
      !data.badges['nostr-graduate'].earned) {
    newlyEarned.push('nostr-graduate');
  }
  
  return { newlyEarned, alreadyEarned: [], progress: 0 };
}
```

**Call on guide completion:**
```typescript
const result = checkGuideBadges(data);
result.newlyEarned.forEach(badgeId => {
  awardBadge(badgeId);
});
```

### 4.2 Remove Duplicate Events
**Ensure only one system awards badges:**
- ✅ gamification.ts (kept)
- ❌ Inline script (removed in Phase 1.1)

---

## Phase 5: Testing Checklist

### Test Scenarios

| Scenario | Expected Result |
|----------|----------------|
| Fresh user selects Beginner path | Path indicator shows, navigation uses Beginner sequence |
| Complete 3rd guide | 'knowledge-seeker' badge awarded ONCE |
| Visit last guide in path | "🎉 Path Complete!" message shows, no next button |
| Visit guide not in path | "Back to Guides" + "Switch to [Path]" suggestion |
| Switch from Beginner to Bitcoiner | Progress % updates, completed guides stay green |
| Scroll to 80% on guide | Guide marked complete, streak banner appears |

### Data Migration

**Existing users:**
```typescript
function migrateLegacyData() {
  const oldPath = localStorage.getItem('nostrich-user-path');
  const gamification = loadGamificationData();
  
  if (oldPath && !gamification.progress.activePath) {
    gamification.progress.activePath = oldPath;
    saveGamificationData(gamification);
    localStorage.removeItem('nostrich-user-path');
  }
}
```

---

## File Summary (9 files modified)

| File | Changes |
|------|---------|
| `src/pages/guides/[slug].astro` | Remove inline script (~240 lines) |
| `src/lib/progressService.ts` | Enable tracking by default |
| `src/pages/guides/index.astro` | Use unified path storage, show per-path progress |
| `src/pages/index.astro` | Use unified path storage |
| `src/components/navigation/GuideNavigation.tsx` | Path-aware navigation with all states |
| `src/components/navigation/ContinueLearning.tsx` | Path-aware next guide calculation |
| `src/components/navigation/EnhancedGuideCompletionIndicator.tsx` | Read from gamification.ts |
| `src/utils/gamification.ts` | Add guide badge checks |
| `src/lib/progress.ts` | Add data migration logic |

---

## Estimated Effort
- **Phase 1 (Cleanup):** 1-2 hours
- **Phase 2 (Navigation):** 3-4 hours  
- **Phase 3 (Cards):** 1 hour
- **Phase 4 (Badges):** 1-2 hours
- **Phase 5 (Testing):** 2-3 hours

**Total: 8-12 hours**

---

## Root Causes Documented

### Why These Issues Happened

1. **Duplicate Badges:** Two systems evolved separately - inline script for quick guide badges, gamification.ts for comprehensive system
2. **Progress Disabled:** Conservative privacy defaults, never updated after GDPR review
3. **Navigation Flash:** SSR architecture clash - server can't access client localStorage
4. **Data Fragmentation:** Multiple developers added features without unifying storage strategy

### Prevention Going Forward

- Single source of truth: `gamification.ts` for all progress/gamification
- Document storage keys in one place
- Test SSR/hydration behavior for all new features
- Enable features by default when no privacy impact

---

## Next Steps

1. Review this plan
2. Confirm edge case handling
3. Execute implementation
4. Test all scenarios
5. Monitor for issues
