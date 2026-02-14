# React/Frontend Agent - Guides System Fix Context

## Your Role
Handle path-aware navigation components for the guides system fix.

## Files You Own
1. `src/components/navigation/GuideNavigation.tsx`
2. `src/components/navigation/ContinueLearning.tsx`
3. `src/components/navigation/EnhancedGuideCompletionIndicator.tsx`

---

## Critical Issues to Fix

### 1. GuideNavigation - Wrong Navigation
**File:** `src/components/navigation/GuideNavigation.tsx`

**Current Problem:**
- Server renders with `GUIDE_ORDER` (global sequence)
- Client tries to "fix" it after hydration
- Flash of wrong content
- Navigation doesn't respect user's chosen path

**Root Cause:** SSR vs client-side mismatch. Server can't access localStorage.

**Required Fix:** Client-only navigation calculation

**Implementation Strategy:**

```typescript
import { useState, useEffect } from 'react';
import { LEARNING_PATHS, getPreviousGuideInPath, getNextGuideInPath } from '../../data/learning-paths';
import { getActivePath } from '../../lib/progress';

export function GuideNavigation({ guideTitles }) {
  const [prevGuide, setPrevGuide] = useState<GuideInfo | null>(null);
  const [nextGuide, setNextGuide] = useState<GuideInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPathComplete, setIsPathComplete] = useState(false);
  const [showOffPathMessage, setShowOffPathMessage] = useState(false);
  const [activePath, setActivePath] = useState<string>('beginner');

  useEffect(() => {
    // Get current guide from URL
    const pathParts = window.location.pathname.split('/');
    const currentSlug = pathParts[pathParts.length - 1];
    
    // Get user's active path from localStorage
    const userPath = getActivePath();
    setActivePath(userPath);
    
    const pathConfig = LEARNING_PATHS[userPath];
    
    // CASE 1: Guide not in current path
    if (!pathConfig?.sequence.includes(currentSlug)) {
      setShowOffPathMessage(true);
      setPrevGuide(null);
      setNextGuide(null);
      setIsLoading(false);
      return;
    }
    
    // CASE 2: Guide is in path - calculate navigation
    const currentIndex = pathConfig.sequence.indexOf(currentSlug);
    
    // Check if this is the last guide
    if (currentIndex === pathConfig.sequence.length - 1) {
      setIsPathComplete(true);
      // Previous guide (if not first)
      if (currentIndex > 0) {
        const prevSlug = pathConfig.sequence[currentIndex - 1];
        setPrevGuide({
          slug: prevSlug,
          title: guideTitles?.[prevSlug] || formatTitle(prevSlug)
        });
      }
      setNextGuide(null);
    } else {
      // Normal case - middle of path
      setIsPathComplete(false);
      
      // Previous guide
      if (currentIndex > 0) {
        const prevSlug = pathConfig.sequence[currentIndex - 1];
        setPrevGuide({
          slug: prevSlug,
          title: guideTitles?.[prevSlug] || formatTitle(prevSlug)
        });
      } else {
        setPrevGuide(null); // First guide
      }
      
      // Next guide
      const nextSlug = pathConfig.sequence[currentIndex + 1];
      setNextGuide({
        slug: nextSlug,
        title: guideTitles?.[nextSlug] || formatTitle(nextSlug)
      });
    }
    
    setIsLoading(false);
  }, []);

  // UI RENDER STATES:
  
  if (isLoading) {
    return <NavigationSkeleton />;
  }
  
  if (showOffPathMessage) {
    return (
      <OffPathMessage 
        currentPath={activePath}
        suggestedPath={findPathContainingGuide(currentSlug)}
      />
    );
  }
  
  if (isPathComplete) {
    return (
      <div>
        {/* Last guide celebration */}
        <div className="path-complete-celebration">
          <h3>🎉 Path Complete!</h3>
          <p>You've completed all guides in the {LEARNING_PATHS[activePath].label} path</p>
        </div>
        
        {/* Show previous button if exists */}
        {prevGuide && <PreviousButton guide={prevGuide} />}
        
        {/* Link to explore other paths */}
        <a href="/guides" className="explore-other-paths">
          Explore Other Paths →
        </a>
      </div>
    );
  }
  
  // Normal navigation (first, middle guides)
  return (
    <div className="guide-navigation">
      {prevGuide ? <PreviousButton guide={prevGuide} /> : <div className="flex-1" />}
      {nextGuide ? <NextButton guide={nextGuide} /> : <div className="flex-1" />}
    </div>
  );
}
```

**UI States to Implement:**

1. **Loading State:**
   - Show skeleton or spinner while calculating
   - No flash of wrong content

2. **First Guide in Path:**
   - No "Previous" button (or disabled state)
   - Show "Start of [Path Name] Path" text
   - "Next" button shows actual next guide title

3. **Middle Guides:**
   - Both Previous and Next buttons
   - Show guide titles
   - Use path sequence (not global order)

4. **Last Guide in Path:**
   - No "Next" button
   - Show "🎉 Path Complete!" celebration
   - Show Previous button
   - Link to "Explore Other Paths"

5. **Off-Path Guide:**
   - Message: "This guide isn't part of your current [Path] path"
   - Button: "← Back to All Guides"
   - Button: "Switch to [Correct Path] Path" (if guide exists in another path)

---

### 2. ContinueLearning - Wrong Next Guide
**File:** `src/components/navigation/ContinueLearning.tsx`

**Current Problem:**
- Uses server-provided `initialNextGuide` (from global order)
- Shows at 80% scroll
- Doesn't respect path

**Required Fix:** Calculate from path sequence

```typescript
useEffect(() => {
  const currentSlug = window.location.pathname.split('/').pop();
  const userPath = getActivePath();
  const pathConfig = LEARNING_PATHS[userPath];
  
  if (pathConfig?.sequence.includes(currentSlug)) {
    const currentIndex = pathConfig.sequence.indexOf(currentSlug);
    
    // Check if last guide
    if (currentIndex === pathConfig.sequence.length - 1) {
      // Show path completion message instead of "Continue Learning"
      setIsPathComplete(true);
      setNextGuide(null);
    } else {
      const nextSlug = pathConfig.sequence[currentIndex + 1];
      setNextGuide({
        slug: nextSlug,
        title: guideTitles?.[nextSlug] || formatTitle(nextSlug)
      });
      setIsPathComplete(false);
    }
  } else {
    // Off-path: hide or show different message
    setShowOffPath(true);
  }
}, []);
```

**Last Guide UI:**
```typescript
if (isPathComplete && isVisible) {
  return (
    <div className="path-complete-modal">
      <h3>🎉 Guide Complete!</h3>
      <p>You've finished the {pathConfig.label} learning path!</p>
      <a href="/guides">Explore Other Paths →</a>
    </div>
  );
}
```

---

### 3. EnhancedGuideCompletionIndicator - Wrong Data Source
**File:** `src/components/navigation/EnhancedGuideCompletionIndicator.tsx`

**Current Problem:**
- Uses `progressService.ts` which has different data format
- Expects `{ guides: { [id]: GuideProgress } }`
- gamification.ts uses `{ progress: { completedGuides: string[] } }`

**Required Fix:** Read from gamification.ts

```typescript
// BEFORE (broken):
import { getProgressData } from '../../lib/progressService';
const data = getProgressData();
const progress = data.guides; // Wrong format!

// AFTER (fixed):
import { loadGamificationData } from '../../utils/gamification';
const gamificationData = loadGamificationData();
const completedGuides = gamificationData.progress.completedGuides;

// Convert to component's expected format
const progress: Record<string, { status: string }> = {};
completedGuides.forEach(slug => {
  progress[slug] = { status: 'completed' };
});
```

---

## Functions Available From Core Agent

```typescript
// From '../../lib/progress'
getActivePath(): LearningPathId  // Returns 'beginner' | 'bitcoiner' | 'privacy' | 'general'
setActivePath(pathId: LearningPathId): void
markGuideCompleted(guideSlug: string): void
isGuideCompleted(guideSlug: string): boolean

// From '../../data/learning-paths'
LEARNING_PATHS: Record<string, {
  id: string,
  label: string,
  icon: string,
  description: string,
  sequence: string[],
  hideAdvanced: boolean
}>

getPreviousGuideInPath(slug: string, pathId: string): string | null
getNextGuideInPath(slug: string, pathId: string): string | null
getGuidePositionInPath(slug: string, pathId: string): number
getPathLength(pathId: string): number
```

---

## Learning Paths Data Structure

```typescript
LEARNING_PATHS = {
  beginner: {
    label: 'Beginner',
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
    label: 'Bitcoiner',
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
    label: 'Privacy Advocate',
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
  }
}
```

---

## UI/UX Requirements

### GuideNavigation

**Previous Button:**
- Position: Left side
- Icon: Arrow left
- Text: "Previous" label + guide title
- Style: Card with hover effect

**Next Button:**
- Position: Right side
- Icon: Arrow right
- Text: "Next" label + guide title
- Style: Card with hover effect

**Progress Indicator:**
- Show "Guide X of Y"
- Show path name (e.g., "(Beginner path)")

### Path Complete Celebration

**Visual:**
- 🎉 Emoji
- Gradient background
- Confetti animation (optional)

**Content:**
- "Path Complete!" headline
- "You've completed all guides in the [Path Name] path"
- Previous button (if exists)
- "Explore Other Paths" link

### Off-Path Message

**Content:**
- "This guide isn't part of your current [Path] path"
- Context: "It's in the [Other Path] path instead"

**Actions:**
- "← Back to All Guides" (link to /guides)
- "Switch to [Other Path] Path" (button that changes path)

---

## Success Criteria

- [ ] No flash of wrong content on page load
- [ ] Navigation strictly follows active path sequence
- [ ] First guide shows "Start of path" (no previous)
- [ ] Last guide shows "Path Complete!" celebration
- [ ] Off-path guides show helpful message
- [ ] Progress indicators read from gamification.ts
- [ ] Loading state shown during calculation

---

## Testing Checklist

```typescript
// Test 1: Path navigation
// User on 'what-is-nostr' in beginner path
// Next should be 'keys-and-security' (not 'protocol-comparison' from global order)

// Test 2: Last guide
// User on 'troubleshooting' (last in beginner path)
// Should show "Path Complete!" not "Next: relay-guide"

// Test 3: Off-path
// User on beginner path, visits 'relay-guide' (only in bitcoiner path)
// Should show off-path message with "Switch to Bitcoiner Path"

// Test 4: Loading state
// On slow connection, should show skeleton not wrong navigation
```

---

## Coordination Notes

- **Phase 2** you work after Core Agent finishes Phase 1
- You depend on `getActivePath()` function from Core Agent
- Test with different paths: beginner, bitcoiner, privacy
- Make sure to handle edge cases: empty path, invalid slug, etc.

## Error Handling Requirements

### React Component Error Boundaries

**Wrap navigation components:**
```typescript
import { ErrorBoundary } from 'react-error-boundary';

function NavigationErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-700">Navigation error. Please refresh.</p>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

// Usage in parent component
<ErrorBoundary FallbackComponent={NavigationErrorFallback}>
  <GuideNavigation guideTitles={guideTitles} />
</ErrorBoundary>
```

### localStorage Access Errors

**Always check for browser environment:**
```typescript
const [activePath, setActivePath] = useState('beginner');

useEffect(() => {
  try {
    const path = getActivePath();
    setActivePath(path);
  } catch (e) {
    console.error('[GuideNavigation] Failed to load path:', e);
    setActivePath('beginner'); // Safe fallback
  }
}, []);
```

### Invalid Guide Data

**Handle missing guide info gracefully:**
```typescript
function getGuideInfo(slug: string): GuideInfo | undefined {
  try {
    const title = guideTitles?.[slug];
    if (!title) {
      console.warn(`[GuideNavigation] No title for guide: ${slug}`);
      return {
        slug,
        title: formatTitle(slug) // Fallback
      };
    }
    return { slug, title };
  } catch (e) {
    console.error(`[GuideNavigation] Error getting guide info:`, e);
    return undefined;
  }
}
```

### Path Not Found

**Handle gracefully:**
```typescript
const pathConfig = LEARNING_PATHS[userPath];
if (!pathConfig) {
  console.error(`[GuideNavigation] Unknown path: ${userPath}`);
  setActivePath('beginner'); // Reset to default
  return;
}
```

### URL Parsing Errors

**Defensive URL parsing:**
```typescript
let currentSlug: string;
try {
  const pathParts = window.location.pathname.split('/');
  currentSlug = pathParts[pathParts.length - 1];
  if (!currentSlug) {
    throw new Error('Empty slug');
  }
} catch (e) {
  console.error('[GuideNavigation] Invalid URL:', e);
  return; // Don't render navigation
}
```

---

## Questions?

Ask the orchestrator if anything is unclear before starting.
