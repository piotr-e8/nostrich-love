# Skill-Level Learning System Migration - Master Execution Plan

**Project Type**: Option A - Full Migration  
**Timeline**: 25 Days  
**Philosophy**: Take Your Time, Do It Right

---

## Executive Summary

This migration transforms the current **persona-based learning paths** (beginner/bitcoiner/privacy) into a **skill-level progression system** (Beginner → Intermediate → Advanced) with gamified unlock mechanics.

### Current State Analysis

✅ **Completed**: `learning-paths.ts` has SKILL_LEVELS with 6-6-4 guide distribution  
❌ **To Migrate**: 8 files with 72 references to old `activePath`/`pathProgress` system  
⚠️ **Critical**: Data migration required for existing users

### Target State

```typescript
// NEW DATA STRUCTURE
{
  progress: {
    currentLevel: 'intermediate',
    unlockedLevels: ['beginner', 'intermediate'],
    manualUnlock: false,
    completedByLevel: {
      beginner: ['what-is-nostr', 'keys-and-security'],
      intermediate: ['nip05-identity'],
      advanced: []
    }
  }
}
```

---

## Phase 0: Complete Audit (Days 1-2)

### Goal
Map every reference to the old path system with precision.

### Audit Inventory

| File | Line | Reference Type | Current Value | Migration Action |
|------|------|----------------|---------------|------------------|
| `src/data/learning-paths.ts` | 227 | Type alias | `LearningPathId` | Keep for backwards compat |
| `src/lib/progress.ts` | 8 | Import | `LearningPathId` | Update imports |
| `src/lib/progress.ts` | 18 | Interface field | `path: LearningPathId` | Migrate to `level: SkillLevel` |
| `src/lib/progress.ts` | 38 | Storage field | `activePath?: LearningPathId` | Migrate to `currentLevel` |
| `src/lib/progress.ts` | 40 | Storage field | `pathProgress?: Record<string, PathProgress>` | Migrate to `completedByLevel` |
| `src/lib/progress.ts` | 53 | Default value | `activePath: 'beginner'` | Update to `currentLevel` |
| `src/lib/progress.ts` | 72 | Default value | `activePath: 'beginner'` | Update to `currentLevel` |
| `src/lib/progress.ts` | 91-97 | Migration logic | Legacy path migration | Enhance for v1→v2 migration |
| `src/lib/progress.ts` | 130 | Function | `getActivePath()` | Create `getCurrentLevel()` |
| `src/lib/progress.ts` | 138 | Function | `setActivePath()` | Create `setCurrentLevel()` |
| `src/lib/progress.ts` | 151-170 | Path progress init | `pathProgress` structure | Replace with `completedByLevel` |
| `src/lib/progress.ts` | 200-215 | Guide completion | Updates `pathProgress[pathId]` | Update to use levels |
| `src/lib/progress.ts` | 260 | Last viewed | `activePath` | Update to `currentLevel` |
| `src/lib/progress.ts` | 269-271 | Path tracking | `pathProgress[pathId]` | Update logic |
| `src/lib/progress.ts` | 307-336 | Progress calc | `getCurrentPathProgress()` | Create `getLevelProgress()` |
| `src/utils/gamification.ts` | 64 | Interface field | `activePath?: string` | Add `currentLevel` |
| `src/utils/gamification.ts` | 65 | Interface field | `pathProgress?: Record<string, PathProgress>` | Add `completedByLevel` |
| `src/utils/gamification.ts` | 230 | Default value | `activePath: 'beginner'` | Add `currentLevel` |
| `src/utils/gamification.ts` | 231 | Default value | `pathProgress: {}` | Add `completedByLevel` |
| `src/pages/guides/index.astro` | 537 | Storage read | `activePath` | Update to `currentLevel` |
| `src/pages/guides/index.astro` | 553 | Storage write | `activePath = path` | Update to `currentLevel` |
| `src/pages/guides/index.astro` | 206-228 | Path config | `pathConfig` object | Remove entirely |
| `src/pages/guides/index.astro` | 271-286 | Path selector UI | Persona buttons | Replace with skill level display |
| `src/pages/guides/index.astro` | 510-529 | Client path config | Path sequences | Remove, use SKILL_LEVELS |
| `src/layouts/Layout.astro` | 169 | Default value | `activePath: 'beginner'` | Update to `currentLevel` |
| `src/layouts/Layout.astro` | 170 | Default value | `pathProgress: {}` | Update to `completedByLevel` |
| `src/layouts/Layout.astro` | 208 | Validation | `activePath` check | Update to `currentLevel` |
| `src/layouts/Layout.astro` | 209 | Validation | `pathProgress` check | Update to `completedByLevel` |
| `src/components/navigation/GuideNavigation.tsx` | 5 | Import | `getActivePath` | Update import |
| `src/components/navigation/GuideNavigation.tsx` | 26 | State | `activePath` | Update to `currentLevel` |
| `src/components/navigation/GuideNavigation.tsx` | 35 | Function call | `getActivePath()` | Update to `getCurrentLevel()` |
| `src/components/navigation/GuideNavigation.tsx` | 38 | Path config | `LEARNING_PATHS[userPath]` | Use `SKILL_LEVELS` |
| `src/components/navigation/GuideNavigation.tsx` | 41-47 | Path check | Sequence includes | Update logic |
| `src/components/navigation/GuideNavigation.tsx` | 53-64 | Completion check | Last in sequence | Update for level boundaries |
| `src/components/navigation/GuideNavigation.tsx` | 118 | Message | Path label display | Update messaging |
| `src/components/navigation/GuideNavigation.tsx` | 144 | Message | Completion message | Update messaging |
| `src/components/navigation/GuideNavigation.tsx` | 193 | Message | Start of path | Update messaging |
| `src/components/navigation/ResumeBanner.tsx` | 5 | Import | `getActivePath`, etc | Update imports |
| `src/components/navigation/ResumeBanner.tsx` | 15 | State | `pathProgress` | Update to `levelProgress` |
| `src/components/navigation/ResumeBanner.tsx` | 16 | State | `activePath` | Update to `currentLevel` |
| `src/components/navigation/ResumeBanner.tsx` | 25 | Function call | `getActivePath()` | Update to `getCurrentLevel()` |
| `src/components/navigation/ResumeBanner.tsx` | 27 | Function call | `getCurrentPathProgress()` | Update to `getLevelProgress()` |
| `src/components/navigation/ResumeBanner.tsx` | 64 | Path config | `LEARNING_PATHS[activePath]` | Use `SKILL_LEVELS` |
| `src/components/navigation/ResumeBanner.tsx` | 83-86 | Progress calc | Path-based | Update to level-based |
| `src/components/navigation/ContinueLearning.tsx` | 5 | Import | `getActivePath` | Update import |
| `src/components/navigation/ContinueLearning.tsx` | 33 | State | `activePath` | Update to `currentLevel` |
| `src/components/navigation/ContinueLearning.tsx` | 42 | Function call | `getActivePath()` | Update to `getCurrentLevel()` |
| `src/components/navigation/ContinueLearning.tsx` | 45 | Path config | `LEARNING_PATHS[userPath]` | Use `SKILL_LEVELS` |
| `src/components/navigation/ContinueLearning.tsx` | 47-58 | Level boundary | Path completion | Update for level unlocks |
| `src/components/navigation/ContinueLearning.tsx` | 146 | Message | Path label | Update messaging |
| `src/components/progress/MinimalProgress.tsx` | 4 | Import | `LEARNING_PATHS` | Update to `SKILL_LEVELS` |
| `src/components/progress/MinimalProgress.tsx` | 44 | State | `activePath` | Update to `currentLevel` |
| `src/components/progress/MinimalProgress.tsx` | 56 | Storage read | `activePath` | Update to `currentLevel` |
| `src/components/progress/MinimalProgress.tsx` | 69 | Import | `LEARNING_PATHS` | Use `SKILL_LEVELS` |
| `src/components/progress/MinimalProgress.tsx` | 71 | Path check | Sequence includes | Update logic |
| `src/components/progress/MinimalProgress.tsx` | 72 | Function call | `getGuidePositionInPath` | Use `getGuidePositionInLevel` |
| `src/components/progress/MinimalProgress.tsx` | 73 | Function call | `getPathLength` | Use `getLevelLength` |
| `src/components/progress/MinimalProgress.tsx` | 84 | Path label | `LEARNING_PATHS[activePath]` | Use `SKILL_LEVELS` |
| `src/pages/progress.astro` | 241 | Storage read | `activePath` | Update to `currentLevel` |
| `src/pages/progress.astro` | 428-429 | Path logic | `getActivePath()`, learningPaths | Update to levels |
| `src/pages/progress.astro` | 437 | Path label | Path name mapping | Update messaging |
| `src/pages/progress.astro` | 443 | Message | Path completion | Update messaging |
| `src/pages/index.astro` | 418 | Legacy key | `nostrich-user-path` | Remove (already migrated) |
| `src/pages/index.astro` | 424-428 | Legacy handling | `general` path | Remove (already migrated) |

### Dependency Graph

```
src/data/learning-paths.ts (canonical source)
    ↓
src/utils/gamification.ts (data layer)
    ↓
src/lib/progress.ts (core logic)
    ↓
├── src/components/navigation/GuideNavigation.tsx
├── src/components/navigation/ResumeBanner.tsx
├── src/components/navigation/ContinueLearning.tsx
├── src/components/progress/MinimalProgress.tsx
├── src/pages/progress.astro
├── src/pages/guides/index.astro
└── src/layouts/Layout.astro
```

### Complexity Assessment

| File | Complexity | Risk | Notes |
|------|-----------|------|-------|
| `src/utils/gamification.ts` | Medium | Low | Add fields, update defaults |
| `src/lib/progress.ts` | High | High | Core logic, 30+ refs, data migration |
| `src/pages/guides/index.astro` | High | Medium | Complete UI rebuild needed |
| `src/components/navigation/GuideNavigation.tsx` | Medium | Low | Replace path refs with level refs |
| `src/components/navigation/ResumeBanner.tsx` | Low | Low | Update progress display |
| `src/components/navigation/ContinueLearning.tsx` | Medium | Low | Update completion logic |
| `src/components/progress/MinimalProgress.tsx` | Low | Low | Update position indicators |
| `src/pages/progress.astro` | Medium | Low | Update progress display |
| `src/layouts/Layout.astro` | Low | Low | Update initialization |
| `src/pages/index.astro` | Medium | Low | Remove old path selector |

---

## Phase 1: Data Layer Restructure (Days 3-5)

### Agent Assignment
**Primary**: `code-agent` (data/storage specialist)  
**Support**: `qa-agent` (migration testing)

### Files to Modify

1. **src/utils/gamification.ts**
2. **src/lib/progress.ts** (migration functions only)

### Tasks

#### 1.1 Update GamificationData Interface (gamification.ts)

```typescript
// ADD NEW FIELDS (keep old for backwards compat during migration)
export interface GamificationProgress {
  // Existing fields
  completedGuides: string[];
  completedGuidesWithTimestamps?: { id: string; completedAt: string }[];
  streakDays: number;
  lastActive: number | null;
  
  // OLD - Mark @deprecated
  /** @deprecated Use currentLevel instead */
  activePath?: string;
  /** @deprecated Use completedByLevel instead */
  pathProgress?: Record<string, PathProgress>;
  
  // NEW - Skill level system
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  unlockedLevels: ('beginner' | 'intermediate' | 'advanced')[];
  manualUnlock: boolean;
  completedByLevel: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
  lastInterestFilter: string | null;
}
```

#### 1.2 Update Default Data Structure (gamification.ts)

Update `getDefaultData()` to include new fields:
- `currentLevel: 'beginner'`
- `unlockedLevels: ['beginner']`
- `manualUnlock: false`
- `completedByLevel: { beginner: [], intermediate: [], advanced: [] }`
- `lastInterestFilter: null`
- Keep old fields for migration period

#### 1.3 Create Migration Function (progress.ts)

```typescript
/**
 * Migrate v1 data structure to v2 skill-level system
 * Runs automatically on module load
 */
function migrateToSkillLevelSystem(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const data = getGamificationData();
    
    // Check if already migrated
    if (data.progress?.currentLevel !== undefined) {
      return; // Already on v2
    }
    
    // Migration: Map old activePath to new currentLevel
    const oldPath = data.progress?.activePath || 'beginner';
    const levelMap: Record<string, SkillLevel> = {
      'beginner': 'beginner',
      'bitcoiner': 'intermediate',  // Bitcoiners skip to intermediate
      'privacy': 'beginner',        // Privacy advocates start at beginner
      'general': 'beginner'         // Legacy general path
    };
    
    const currentLevel = levelMap[oldPath] || 'beginner';
    
    // Build unlockedLevels based on currentLevel
    const allLevels: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];
    const currentIndex = allLevels.indexOf(currentLevel);
    const unlockedLevels = allLevels.slice(0, currentIndex + 1);
    
    // Distribute completed guides by level
    const completedByLevel: Record<SkillLevel, string[]> = {
      beginner: [],
      intermediate: [],
      advanced: []
    };
    
    const completedGuides = data.progress?.completedGuides || [];
    completedGuides.forEach(guideId => {
      const level = getGuideLevel(guideId);
      if (level && completedByLevel[level]) {
        completedByLevel[level].push(guideId);
      }
    });
    
    // Update data structure
    data.progress = {
      ...data.progress,
      currentLevel,
      unlockedLevels,
      manualUnlock: false,
      completedByLevel,
      lastInterestFilter: oldPath !== currentLevel ? oldPath : null
    };
    
    // Keep old fields for backwards compatibility during transition
    // They will be removed in Phase 9
    
    saveGamificationData(data);
    console.log('[Migration] Migrated to skill-level system:', { 
      oldPath, 
      currentLevel, 
      unlockedLevels,
      completedByLevel 
    });
    
  } catch (e) {
    console.error('[Migration] Migration error:', e);
  }
}

// Run migration on module load
if (typeof window !== 'undefined') {
  migrateToSkillLevelSystem();
}
```

#### 1.4 Create New Helper Functions (progress.ts)

```typescript
// Level management
export function getCurrentLevel(): SkillLevel {
  const data = getGamificationData();
  return data.progress?.currentLevel || 'beginner';
}

export function setCurrentLevel(level: SkillLevel): void {
  const data = getGamificationData();
  if (!data.progress) {
    data.progress = getDefaultData().progress;
  }
  data.progress.currentLevel = level;
  data.progress.lastActive = Date.now();
  saveGamificationData(data);
}

export function getUnlockedLevels(): SkillLevel[] {
  const data = getGamificationData();
  return data.progress?.unlockedLevels || ['beginner'];
}

export function isLevelUnlocked(level: SkillLevel): boolean {
  const unlocked = getUnlockedLevels();
  return unlocked.includes(level);
}

export function unlockLevel(level: SkillLevel): void {
  const data = getGamificationData();
  if (!data.progress) return;
  
  if (!data.progress.unlockedLevels.includes(level)) {
    data.progress.unlockedLevels.push(level);
    data.progress.unlockedLevels.sort((a, b) => {
      const order = ['beginner', 'intermediate', 'advanced'];
      return order.indexOf(a) - order.indexOf(b);
    });
    saveGamificationData(data);
  }
}

export function getCompletedInLevel(level: SkillLevel): string[] {
  const data = getGamificationData();
  return data.progress?.completedByLevel?.[level] || [];
}

export function completeGuideInLevel(guideId: string, level: SkillLevel): void {
  const data = getGamificationData();
  if (!data.progress) return;
  
  if (!data.progress.completedByLevel[level].includes(guideId)) {
    data.progress.completedByLevel[level].push(guideId);
  }
  
  // Also update legacy completedGuides for backwards compatibility
  if (!data.progress.completedGuides.includes(guideId)) {
    data.progress.completedGuides.push(guideId);
  }
  
  saveGamificationData(data);
}

export function shouldUnlockNextLevel(): { 
  shouldUnlock: boolean; 
  nextLevel: SkillLevel | null;
  progress: { completed: number; required: number };
} {
  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel(currentLevel);
  
  if (!nextLevel) {
    return { shouldUnlock: false, nextLevel: null, progress: { completed: 0, required: 0 } };
  }
  
  if (isLevelUnlocked(nextLevel)) {
    return { shouldUnlock: false, nextLevel, progress: { completed: 0, required: 0 } };
  }
  
  const completedInCurrent = getCompletedInLevel(currentLevel).length;
  const required = getUnlockThreshold(nextLevel);
  const totalInLevel = getLevelLength(currentLevel);
  
  // Use 70% threshold or absolute count, whichever is higher
  const thresholdCount = Math.ceil(totalInLevel * 0.7);
  const requiredCount = Math.max(required, thresholdCount);
  
  return {
    shouldUnlock: completedInCurrent >= requiredCount,
    nextLevel,
    progress: { completed: completedInCurrent, required: requiredCount }
  };
}

export function getLevelProgress(level: SkillLevel): {
  completed: number;
  total: number;
  percentage: number;
  nextIncompleteGuide: string | null;
} {
  const levelConfig = SKILL_LEVELS[level];
  if (!levelConfig) {
    return { completed: 0, total: 0, percentage: 0, nextIncompleteGuide: null };
  }
  
  const completed = getCompletedInLevel(level);
  const total = levelConfig.sequence.length;
  const percentage = total > 0 ? Math.round((completed.length / total) * 100) : 0;
  
  const nextIncompleteGuide = levelConfig.sequence.find(
    guideId => !completed.includes(guideId)
  ) || null;
  
  return { completed: completed.length, total, percentage, nextIncompleteGuide };
}
```

### Deliverables

- [ ] Updated `gamification.ts` with new data structure
- [ ] Migration function in `progress.ts`
- [ ] New level-based helper functions
- [ ] Unit tests for migration logic
- [ ] Test scenarios:
  - [ ] Fresh user (no data)
  - [ ] User with old path data (beginner/bitcoiner/privacy)
  - [ ] User with completed guides
  - [ ] Corrupt data handling

### Decision Gate

**User approval required** for:
1. Data structure design
2. Migration mapping (bitcoiner → intermediate)
3. Unlock threshold (70% or 4/6)

---

## Phase 2: Progress Layer Update (Days 6-7)

### Agent Assignment
**Primary**: `code-agent` (progress tracking specialist)  
**Support**: `qa-agent` (function testing)

### Files to Modify

1. **src/lib/progress.ts** (complete refactor)

### Tasks

#### 2.1 Refactor Core Functions

Update existing functions to use new level-based system:

```typescript
// BEFORE
export function markGuideCompleted(guideSlug: string): void {
  // ... old path-based logic
}

// AFTER
export function markGuideCompleted(guideSlug: string): void {
  const data = getGamificationData();
  const level = getGuideLevel(guideSlug);
  
  if (!level) {
    console.warn(`[progress.ts] Guide ${guideSlug} not found in any level`);
    return;
  }
  
  // Mark complete in level
  completeGuideInLevel(guideSlug, level);
  
  // Check for level unlock
  const unlockCheck = shouldUnlockNextLevel();
  if (unlockCheck.shouldUnlock && unlockCheck.nextLevel) {
    unlockLevel(unlockCheck.nextLevel);
    
    // Optional: Show toast/notification about unlock
    console.log(`[progress.ts] Unlocked ${unlockCheck.nextLevel} level!`);
  }
  
  // Check badges
  checkAndAwardBadges();
}
```

#### 2.2 Add Backwards Compatibility Wrappers

```typescript
/**
 * @deprecated Use getCurrentLevel() instead
 */
export function getActivePath(): LearningPathId {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[progress.ts] getActivePath() is deprecated. Use getCurrentLevel() instead.');
  }
  return getCurrentLevel();
}

/**
 * @deprecated Use setCurrentLevel() instead
 */
export function setActivePath(pathId: LearningPathId): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[progress.ts] setActivePath() is deprecated. Use setCurrentLevel() instead.');
  }
  setCurrentLevel(pathId as SkillLevel);
}

/**
 * @deprecated Use getLevelProgress() instead
 */
export function getCurrentPathProgress() {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[progress.ts] getCurrentPathProgress() is deprecated. Use getLevelProgress() instead.');
  }
  const currentLevel = getCurrentLevel();
  return getLevelProgress(currentLevel);
}
```

#### 2.3 Update Type Exports

```typescript
// Export both old and new types during transition
export type { SkillLevel, SkillLevelConfig } from '../data/learning-paths';

/** @deprecated Use SkillLevel instead */
export type LearningPathId = SkillLevel;
```

### Deliverables

- [ ] Complete `progress.ts` refactor
- [ ] Backwards compatibility wrappers with deprecation warnings
- [ ] Updated type exports
- [ ] Unit tests for all new functions
- [ ] Migration validation script

---

## Phase 3: Guide Listing Page Rebuild (Days 8-11)

### Agent Team
- **design-agent**: Create component specifications
- **code-agent**: Implement components  
- **integration-agent**: Update guides/index.astro

### Files to Modify

1. **src/pages/guides/index.astro** (complete rebuild)
2. **New components** (to be created)

### Tasks

#### 3.1 Create Component Specifications

**GuideSection Component**:
```typescript
interface GuideSectionProps {
  level: SkillLevel;
  isLocked: boolean;
  onUnlock: () => void;
  progress: { completed: number; total: number; percentage: number };
}
```

**GuideCard Component**:
```typescript
interface GuideCardProps {
  guide: Guide;
  isLocked: boolean;
  isCompleted: boolean;
  onClick: () => void;
}
```

**InterestFilter Component**:
```typescript
interface InterestFilterProps {
  options: { id: string; label: string; icon: string }[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}
```

**UnlockButton Component**:
```typescript
interface UnlockButtonProps {
  level: SkillLevel;
  progress: { completed: number; required: number };
  onUnlock: () => void;
}
```

#### 3.2 Rebuild guides/index.astro

**Remove**:
- `pathConfig` object
- Persona selector buttons
- Path-based filtering logic
- `guideSections` hardcoded array

**Add**:
- Read guides from `SKILL_LEVELS`
- Locked state UI (gray overlay, lock icon)
- Progress bars per level
- Interest filter (desktop tabs, mobile dropdown)
- Unlock buttons with progress indicators
- Mystery/locked guide cards

**New Structure**:
```astro
---
// Server-side: Get guide metadata from SKILL_LEVELS
import { SKILL_LEVELS, getAllGuides } from '../../data/learning-paths';

// Interest filters
const interestFilters = [
  { id: null, label: 'All Topics', icon: '🌟' },
  { id: 'bitcoin', label: 'Bitcoin', icon: '₿' },
  { id: 'privacy', label: 'Privacy', icon: '🔒' },
  { id: 'technical', label: 'Technical', icon: '⚙️' },
  { id: 'social', label: 'Social', icon: '👥' },
];
---

<!-- Client-side: React components for interactivity -->
<GuideLevelContainer client:load>
  {Object.entries(SKILL_LEVELS).map(([levelId, config]) => (
    <GuideSection 
      level={levelId}
      config={config}
      client:load
    />
  ))}
</GuideLevelContainer>
```

#### 3.3 Create New Components

Create the following in `src/components/guides/`:

1. **GuideLevelContainer.tsx** - Main container with client-side state
2. **GuideSection.tsx** - Level section with lock/unlock state
3. **GuideCard.tsx** - Individual guide card with locked/unlocked variants
4. **InterestFilter.tsx** - Filter tabs/dropdown
5. **UnlockButton.tsx** - Unlock CTA with progress
6. **LevelProgressBar.tsx** - Progress indicator

### Deliverables

- [ ] Complete guides/index.astro rebuild
- [ ] 6 new React components
- [ ] Locked state UI implementation
- [ ] Interest filter functionality
- [ ] Unlock mechanics
- [ ] Mobile-responsive design

### Decision Gate

**User approval required** for:
1. Locked state visual design
2. Interest filter categories
3. Unlock button placement and styling

---

## Phase 4: Navigation Migration (Days 12-16)

### Agent Team
- **code-agent** × 3: One per complexity level
- **integration-agent**: System-wide updates
- **qa-agent**: Component testing

### Files to Modify

1. src/components/navigation/GuideNavigation.tsx
2. src/components/navigation/ResumeBanner.tsx
3. src/components/navigation/ContinueLearning.tsx
4. src/components/progress/MinimalProgress.tsx
5. src/pages/progress.astro
6. src/layouts/Layout.astro

### Tasks by File

#### 4.1 GuideNavigation.tsx (Medium Complexity)

**Changes**:
```typescript
// Update imports
import { SKILL_LEVELS, type SkillLevel, getGuideLevel } from '../../data/learning-paths';
import { getCurrentLevel } from '../../lib/progress';

// Update logic
const userLevel = getCurrentLevel();
const levelConfig = SKILL_LEVELS[userLevel];

// Handle level boundaries
// When at end of Beginner, check if Intermediate is unlocked
// If not, show "Complete X more guides to unlock Intermediate"
```

#### 4.2 ResumeBanner.tsx (Low Complexity)

**Changes**:
```typescript
// Update imports
import { SKILL_LEVELS } from '../../data/learning-paths';
import { getCurrentLevel, getLevelProgress } from '../../lib/progress';

// Update display
const currentLevel = getCurrentLevel();
const levelProgress = getLevelProgress(currentLevel);
const levelConfig = SKILL_LEVELS[currentLevel];

// Update text
<p>Continue your {levelConfig.label} journey</p>
<p>{levelProgress.completed} of {levelProgress.total} {levelConfig.label} guides completed</p>
```

#### 4.3 ContinueLearning.tsx (Medium Complexity)

**Changes**:
```typescript
// Update imports
import { SKILL_LEVELS, getNextLevel } from '../../data/learning-paths';
import { getCurrentLevel, getCompletedInLevel, isLevelUnlocked } from '../../lib/progress';

// Update logic
const currentLevel = getCurrentLevel();
const completedInLevel = getCompletedInLevel(currentLevel);
const totalInLevel = SKILL_LEVELS[currentLevel].sequence.length;

// Check if level is complete
if (completedInLevel.length === totalInLevel) {
  const nextLevel = getNextLevel(currentLevel);
  if (nextLevel && isLevelUnlocked(nextLevel)) {
    // Show "Level Complete! Continue to Intermediate"
  } else if (nextLevel) {
    // Show "Complete X more guides to unlock Intermediate"
  } else {
    // Show "All Levels Complete! 🎉"
  }
}
```

#### 4.4 MinimalProgress.tsx (Low Complexity)

**Changes**:
```typescript
// Update imports
import { SKILL_LEVELS, getGuideLevel, getGuidePositionInLevel, getLevelLength } from '../../data/learning-paths';
import { getCurrentLevel } from '../../lib/progress';

// Update usage
const currentLevel = getCurrentLevel();
const guideLevel = getGuideLevel(currentSlug);
const position = getGuidePositionInLevel(currentSlug, currentLevel);
const length = getLevelLength(currentLevel);
```

#### 4.5 progress.astro (Medium Complexity)

**Changes**:
- Replace single progress bar with 3 progress bars (one per level)
- Add level lock/unlock status indicators
- Show completed guides per level
- Add level cards with icons and descriptions

#### 4.6 Layout.astro (Low Complexity)

**Changes**:
```typescript
// Update initialization
const defaultState = {
  progress: {
    // ... existing fields
    currentLevel: 'beginner',
    unlockedLevels: ['beginner'],
    manualUnlock: false,
    completedByLevel: {
      beginner: [],
      intermediate: [],
      advanced: []
    },
    // Keep old fields during transition
    activePath: 'beginner',
    pathProgress: {}
  }
};
```

### Deliverables

- [ ] All 6 navigation files updated
- [ ] Level-based progress display
- [ ] Level boundary handling
- [ ] Deprecation warnings removed (old functions still work)
- [ ] Component tests passing

---

## Phase 5: Home Page Redesign (Days 17-18)

### Agent Assignment
- **design-agent**: UI specifications
- **code-agent**: Implementation

### Files to Modify

1. **src/pages/index.astro**

### Tasks

#### 5.1 Remove Persona Selector

Remove the 3-path selector cards (beginner/bitcoiner/privacy).

#### 5.2 Add Large CTA

```astro
<!-- New Hero CTA -->
<div class="mt-12 text-center">
  <a
    href="/guides"
    class="inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-white bg-friendly-purple-600 hover:bg-friendly-purple-700 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1"
  >
    Start Learning
    <svg class="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  </a>
  <p class="mt-4 text-gray-500 dark:text-gray-400">
    Beginner-friendly • No signup required • Self-paced
  </p>
</div>
```

#### 5.3 Add "Browse by Interest" Section

```astro
<section class="py-16 bg-gray-50 dark:bg-gray-900/30">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-2xl font-bold text-center mb-8">Browse by Interest</h2>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="/guides?interest=bitcoin" class="interest-chip">Bitcoin</a>
      <a href="/guides?interest=privacy" class="interest-chip">Privacy</a>
      <a href="/guides?interest=art" class="interest-chip">Art</a>
      <a href="/guides?interest=music" class="interest-chip">Music</a>
      <a href="/guides?interest=photography" class="interest-chip">Photography</a>
      <a href="/guides?interest=food" class="interest-chip">Food</a>
      <a href="/guides?interest=parenting" class="interest-chip">Parenting</a>
    </div>
  </div>
</section>
```

#### 5.4 Add Community Links Section

```astro
<section class="py-16">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-2xl font-bold text-center mb-8">Nostr for Everyone</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
      <a href="/nostr-for-artists" class="community-card">
        <span class="text-3xl">🎨</span>
        <span>Artists</span>
      </a>
      <!-- Repeat for: Parents, Foodies, Bitcoiners, Privacy, Musicians, Photographers -->
    </div>
  </div>
</section>
```

### Deliverables

- [ ] index.astro redesigned
- [ ] New CTA implemented
- [ ] Interest section added
- [ ] Community links added
- [ ] Old path selector removed

---

## Phase 6: Progress Page Update (Day 19)

### Agent Assignment
**Primary**: `code-agent`

### Files to Modify

1. **src/pages/progress.astro**

### Tasks

#### 6.1 Replace Single Progress with 3-Level Display

```astro
<!-- Level Progress Cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
  {Object.entries(SKILL_LEVELS).map(([levelId, config]) => (
    <div class={`level-card ${isLocked(levelId) ? 'locked' : ''}`}>
      <div class="flex items-center gap-3 mb-4">
        <span class="text-3xl">{config.icon}</span>
        <div>
          <h3 class="font-bold">{config.label}</h3>
          {isLocked(levelId) ? (
            <span class="text-sm text-gray-500">🔒 Locked</span>
          ) : (
            <span class="text-sm text-green-600">✓ Unlocked</span>
          )}
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style={`width: ${getLevelProgress(levelId).percentage}%`}></div>
      </div>
      <p class="text-sm text-gray-600 mt-2">
        {getLevelProgress(levelId).completed} of {config.sequence.length} guides
      </p>
    </div>
  ))}
</div>
```

#### 6.2 Add Level-Specific Guide Lists

Show completed guides grouped by level:
- Expandable sections for each level
- Checkmarks for completed guides
- Lock icons for locked levels

### Deliverables

- [ ] 3-level progress visualization
- [ ] Lock/unlock status display
- [ ] Per-level guide lists
- [ ] Responsive design

---

## Phase 7: Settings Page - Manual Unlock (Day 20)

### Agent Assignment
**Primary**: `code-agent`

### Files to Modify

1. **src/pages/settings.astro**
2. **src/components/progress/PrivacyControls.tsx** (extend)

### Tasks

#### 7.1 Add Manual Unlock Section

```astro
<!-- Manual Unlock Section -->
<section class="py-8 border-t border-gray-200 dark:border-gray-700">
  <h2 class="text-xl font-bold mb-4">Learning Progress</h2>
  
  <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
    <div class="flex items-start gap-4">
      <span class="text-2xl">⚠️</span>
      <div class="flex-1">
        <h3 class="font-semibold text-amber-900 dark:text-amber-400 mb-2">
          Unlock All Levels
        </h3>
        <p class="text-sm text-amber-800 dark:text-amber-300 mb-4">
          Skip the progression system and access all guides immediately. 
          Your current progress will be preserved.
        </p>
        
        <ManualUnlockToggle client:load />
      </div>
    </div>
  </div>
</section>
```

#### 7.2 Create ManualUnlockToggle Component

```typescript
// src/components/settings/ManualUnlockToggle.tsx
export function ManualUnlockToggle() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleToggle = () => {
    if (!isUnlocked) {
      setShowConfirm(true);
    } else {
      // Re-locking
      disableManualUnlock();
      setIsUnlocked(false);
    }
  };
  
  const confirmUnlock = () => {
    enableManualUnlock();
    setIsUnlocked(true);
    setShowConfirm(false);
  };
  
  return (
    <>
      <button
        onClick={handleToggle}
        className={`toggle-switch ${isUnlocked ? 'active' : ''}`}
      >
        {isUnlocked ? 'All Levels Unlocked' : 'Lock Levels'}
      </button>
      
      {showConfirm && (
        <ConfirmModal
          title="Unlock All Levels?"
          message="This will bypass the progression system. You can re-enable it anytime."
          onConfirm={confirmUnlock}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
```

#### 7.3 Add Helper Functions (progress.ts)

```typescript
export function isManualUnlockEnabled(): boolean {
  const data = getGamificationData();
  return data.progress?.manualUnlock || false;
}

export function enableManualUnlock(): void {
  const data = getGamificationData();
  if (!data.progress) return;
  
  data.progress.manualUnlock = true;
  data.progress.unlockedLevels = ['beginner', 'intermediate', 'advanced'];
  saveGamificationData(data);
}

export function disableManualUnlock(): void {
  const data = getGamificationData();
  if (!data.progress) return;
  
  data.progress.manualUnlock = false;
  
  // Recalculate unlocked levels based on progress
  const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];
  const unlockedLevels: SkillLevel[] = ['beginner'];
  
  for (let i = 0; i < levels.length - 1; i++) {
    const currentLevel = levels[i];
    const nextLevel = levels[i + 1];
    const completed = getCompletedInLevel(currentLevel).length;
    const threshold = getUnlockThreshold(nextLevel);
    
    if (completed >= threshold) {
      unlockedLevels.push(nextLevel);
    }
  }
  
  data.progress.unlockedLevels = unlockedLevels;
  saveGamificationData(data);
}
```

### Deliverables

- [ ] Manual unlock toggle in settings
- [ ] Confirmation modal
- [ ] Enable/disable functionality
- [ ] Persist manualUnlock setting

---

## Phase 8: Community Pages (Days 21-22)

### Agent Assignment
**Primary**: `integration-agent`

### Tasks

#### 8.1 Create Community Hub Pages

Create new pages for:
- `/nostr-for-bitcoiners`
- `/nostr-for-privacy`

Each page should:
- Explain why Nostr is great for that community
- Link to relevant guides
- Show "Start Learning" CTA

#### 8.2 Update Existing Community Pages

Add "Learn" section to:
- `/nostr-for-artists`
- `/nostr-for-parents`
- `/nostr-for-foodies`
- etc.

Example addition:
```astro
<section class="py-12">
  <h2 class="text-2xl font-bold mb-6">Learn Nostr</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <a href="/guides/what-is-nostr" class="guide-link-card">
      <h3>What is Nostr?</h3>
      <p>Understand the basics</p>
    </a>
    <!-- More relevant guides -->
  </div>
  <a href="/guides" class="mt-6 inline-block btn-primary">
    Browse All Guides
  </a>
</section>
```

### Deliverables

- [ ] 2 new community hub pages
- [ ] "Learn" sections on existing community pages
- [ ] Cross-linking between communities and guides

---

## Phase 9: Testing & Cleanup (Days 23-25)

### Agent Team
- **qa-agent**: Test all scenarios
- **code-agent**: Fix bugs
- **integration-agent**: Remove old code

### Test Scenarios

#### 9.1 Fresh User (No Data)
- [ ] Clean start with `currentLevel: 'beginner'`
- [ ] `unlockedLevels: ['beginner']`
- [ ] Empty `completedByLevel`
- [ ] All components load correctly

#### 9.2 Existing User (Old Data)
- [ ] Migration runs automatically
- [ ] Old `activePath` mapped to `currentLevel`
- [ ] Completed guides distributed by level
- [ ] `unlockedLevels` calculated correctly
- [ ] Legacy data preserved during transition

#### 9.3 Manual Unlock
- [ ] Toggle enables all levels
- [ ] Toggle reverts to calculated levels
- [ ] Setting persists across sessions
- [ ] UI reflects manual unlock state

#### 9.4 Interest Filters
- [ ] Filter persists across sessions
- [ ] Desktop tabs work
- [ ] Mobile dropdown works
- [ ] Filter clears correctly

#### 9.5 Level Unlocks
- [ ] 70% threshold triggers unlock
- [ ] 4/6 guides triggers unlock (whichever is higher)
- [ ] Unlock notification shows
- [ ] Progress bars update

#### 9.6 Edge Cases
- [ ] Corrupt data handling
- [ ] Partial migration recovery
- [ ] Network errors (localStorage full)
- [ ] Browser back/forward navigation
- [ ] Direct URL access to locked guides

#### 9.7 Cross-Browser
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Cleanup Tasks

- [ ] Remove old `activePath` field from storage
- [ ] Remove old `pathProgress` field from storage
- [ ] Remove deprecated functions from `progress.ts`
- [ ] Remove backwards compatibility code from components
- [ ] Update all imports to use new functions
- [ ] Remove old `LearningPathId` type alias
- [ ] Update documentation

### Final Deliverables

- [ ] Test report with all scenarios
- [ ] Bug fixes documented
- [ ] Clean codebase (no old references)
- [ ] Migration documentation
- [ ] User-facing changelog

---

## Communication Schedule

### Agent → Orchestrator
- Daily standup: Files modified, LOC changed, blockers
- Immediate escalation for:
  - Architectural conflicts
  - Data loss risks
  - Scope explosion

### Orchestrator → User (Decision Gates)
1. **Phase 0 completion**: Audit results presentation
2. **Phase 1 completion**: Data structure approval
3. **Phase 3 completion**: UI design approval
4. **Phase 9 completion**: Final approval & launch

### Communication Channels
- Daily progress updates
- Decision gate meetings
- Emergency escalation protocol

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Data migration failure | Medium | High | Comprehensive testing, backup/restore |
| User confusion from change | Medium | Medium | Clear messaging, onboarding flow |
| Performance regression | Low | Medium | Code splitting, lazy loading |
| Browser compatibility | Low | Medium | Cross-browser testing |
| Scope creep | High | Medium | Strict phase boundaries |

---

## Emergency Protocols

### If Migration Fails
1. Pause all work immediately
2. Restore from backup
3. Debug with isolated test case
4. Escalate to user

### If Scope Explodes
1. Document all new requirements
2. Assess impact on timeline
3. Present options to user
4. Adjust phases as needed

### If Critical Bug Found
1. Create hotfix branch
2. Fix immediately
3. Test thoroughly
4. Deploy patch

---

## Success Criteria

- ✅ Zero data loss for existing users
- ✅ Clean migration from old system
- ✅ All 72 references updated
- ✅ Locked/unlocked states work correctly
- ✅ Manual unlock functions properly
- ✅ Interest filters persist
- ✅ Mobile-responsive design
- ✅ All tests passing
- ✅ No console errors
- ✅ Documentation updated

---

## Timeline Summary

| Phase | Days | Focus |
|-------|------|-------|
| 0 | 1-2 | Audit & Planning |
| 1 | 3-5 | Data Layer |
| 2 | 6-7 | Progress Layer |
| 3 | 8-11 | Guide Listing |
| 4 | 12-16 | Navigation |
| 5 | 17-18 | Home Page |
| 6 | 19 | Progress Page |
| 7 | 20 | Manual Unlock |
| 8 | 21-22 | Community Pages |
| 9 | 23-25 | Testing & Cleanup |

**Total Duration**: 25 Days  
**Start Date**: [TBD]  
**Target Completion**: [TBD]

---

*Remember: Take your time, do it right. Quality over speed.*
