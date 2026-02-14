# Astro/Template Agent - Guides System Fix Context

## Your Role
Handle template cleanup and SSR coordination for the guides system fix.

## Files You Own
1. `src/pages/guides/[slug].astro`
2. `src/pages/guides/index.astro`
3. `src/pages/index.astro`

---

## Critical Issues to Fix

### 1. Remove Inline Script from [slug].astro
**File:** `src/pages/guides/[slug].astro`

**Lines to Remove:** Approximately 295-540 (the entire `<script>` block)

**What to Remove:**

```astro
<!-- REMOVE THIS ENTIRE SCRIPT BLOCK -->
<script>
  (function() {
    // Lines ~297-540
    const STORAGE_KEY = 'nostrich-gamification';  // Wrong key!
    const GUIDE_COMPLETION_THRESHOLD = 0.8;
    
    // Badge definitions (5 badges)
    const BADGES = {
      'first-steps': { ... },
      'quick-learner': { ... },
      'dedicated-student': { ... },
      'nostr-expert': { ... },
      'completionist': { ... }
    };
    
    // Duplicate gamification functions
    function getGamificationData() { ... }
    function saveGamificationData() { ... }
    function updateStreak() { ... }
    function checkAndAwardBadges() { ... }  // Awards duplicate badges!
    function showBadgeCelebration() { ... }
    
    // Event dispatchers
    function trackGuideCompletion() {
      // ... dispatches 'badge-earned' events
    }
    
    // Scroll tracking
    function handleScroll() { ... }
    
    // Initialize
    trackGuideCompletion();
    window.addEventListener('scroll', handleScroll);
  })();
</script>
```

**Why Remove:**
- Uses wrong storage key (`nostrich-gamification` not `nostrich-gamification-v1`)
- Duplicates badge awarding logic (causes duplicate badges!)
- Conflicting with gamification.ts system
- Stores data in wrong format

**What to Keep:**

```astro
<!-- KEEP THESE COMPONENT IMPORTS -->
<script>
  // Only keep streak update event (if needed)
  window.dispatchEvent(new CustomEvent('guide-completed', { 
    detail: { guideSlug: 'current-guide-slug' }
  }));
</script>
```

**Result after removal:**
- No inline gamification logic
- Components handle everything via React/hydration
- Single source of truth: gamification.ts

---

### 2. Unify Path Storage in guides/index.astro
**File:** `src/pages/guides/index.astro`

**Current Problem:**
```javascript
// Line 504 - Using separate storage key
const PATH_STORAGE_KEY = 'nostrich-user-path';

// Reading from wrong place
const storedPath = localStorage.getItem(PATH_STORAGE_KEY);
```

**Required Fix:** Use unified storage

```javascript
// REPLACE WITH:
import { getActivePath, setActivePath } from '../../lib/progress';

// Use these functions instead of direct localStorage
const currentPath = getActivePath();

// When user selects path
setActivePath(selectedPathId);
```

**Also Update (lines 577-588):**

Current inline script reads directly:
```javascript
const parsed = JSON.parse(localStorage.getItem('nostrich-gamification-v1'));
const completedGuides = parsed.progress?.completedGuides || [];
```

This is actually CORRECT - keep it. But verify it works with unified data.

---

### 3. Unify Path Storage in index.astro
**File:** `src/pages/index.astro`

**Current Problem:**
```javascript
const PATH_STORAGE_KEY = 'nostrich-user-path';
localStorage.setItem(PATH_STORAGE_KEY, pathId);
```

**Required Fix:**
```javascript
// Use the progress module
import { setActivePath } from '../lib/progress';

setActivePath(pathId);
```

---

### 4. Update SSR/Client Coordination

**Understanding the Issue:**

Astro pages are server-side rendered (SSRG). The server CANNOT access localStorage.
Current code tries to calculate navigation server-side:

```astro
---
// Server-side code
const prevGuideSlug = GUIDE_ORDER[currentGuideNumGlobal - 2]; // WRONG - uses global order
const nextGuideSlug = GUIDE_ORDER[currentGuideNumGlobal];     // WRONG - uses global order
---
```

**Solution:** Pass minimal data, let React handle navigation

**What to Pass to Components:**

```astro
---
// Server can provide guide titles (static data)
const guideTitles = {
  'what-is-nostr': 'What is Nostr?',
  'keys-and-security': 'Keys & Security',
  // ... all guides
};
---

<!-- Client handles navigation calculation -->
<GuideNavigation 
  client:load 
  guideTitles={guideTitles}  <!-- Static data only -->
/>
```

**What NOT to pass:**
- Don't pass `prevGuide` / `nextGuide` from server
- Don't calculate navigation server-side
- Let React read from localStorage and calculate

---

## Component Props to Update

### GuideNavigation in [slug].astro

**Current (BROKEN):**
```astro
<GuideNavigation 
  client:load 
  prevGuide={prevGuide}      <!-- Server-calculated (wrong!) -->
  nextGuide={nextGuide}      <!-- Server-calculated (wrong!) -->
  currentGuideNum={currentGuideNumGlobal}
  totalGuides={totalGuidesGlobal}
  guideTitles={guideTitles}
/>
```

**Required (FIXED):**
```astro
<GuideNavigation 
  client:load 
  guideTitles={guideTitles}  <!-- Only pass titles -->
  // Remove all other props - React will calculate
/>
```

### ContinueLearning in [slug].astro

**Current (BROKEN):**
```astro
<ContinueLearning 
  client:load 
  nextGuide={nextGuide}      <!-- Server-calculated -->
  guideTitles={guideTitles}
/>
```

**Required (FIXED):**
```astro
<ContinueLearning 
  client:load 
  guideTitles={guideTitles}  <!-- Only pass titles -->
  // React calculates next guide from path
/>
```

---

## Guide Cards Progress Indicators

**File:** `src/pages/guides/index.astro`

**Current Implementation (lines 427-429):**
```astro
<div class="progress-indicator" data-guide-id={guide.id}>
  <div class="w-2.5 h-2.5 rounded-full bg-gray-300 opacity-0"></div>
</div>
```

**JavaScript Logic (lines 577-588):**
```javascript
// This is already correct - reads from unified storage
const parsed = JSON.parse(localStorage.getItem('nostrich-gamification-v1'));
const completedGuides = parsed.progress?.completedGuides || [];

// Update indicators (lines 671-685)
if (status === 'completed') {
  dot.classList.add('bg-green-500');
} else if (status === 'in-progress') {
  dot.classList.add('bg-blue-400');
}
```

**Required:** Keep this logic, just verify it works after data unification.

---

## Per-Path Progress Display

**Add to guides/index.astro path cards:**

Show progress percentage for each path:

```astro
<script>
  // Calculate per-path progress
  function getPathProgress(pathId) {
    const path = pathConfig[pathId];
    const completedInPath = path.sequence.filter(g => 
      completedGuides.includes(g)
    );
    return {
      completed: completedInPath.length,
      total: path.sequence.length,
      percentage: Math.round((completedInPath.length / path.sequence.length) * 100)
    };
  }
  
  // Update path card UI
  Object.keys(pathConfig).forEach(pathId => {
    const progress = getPathProgress(pathId);
    const card = document.querySelector(`[data-path="${pathId}"]`);
    if (card) {
      card.querySelector('.progress-text').textContent = 
        `${progress.completed}/${progress.total} guides (${progress.percentage}%)`;
    }
  });
</script>
```

---

## SSR Considerations

### What Works on Server:
- Static content (guide titles, descriptions)
- Component imports
- Guide content rendering

### What Does NOT Work on Server:
- localStorage access
- User's active path
- Completed guides list
- Navigation calculation

### Solution Pattern:

```astro
---
// Server: Provide static data only
const guideTitles = await getAllGuideTitles();
---

<!-- Client: Handle dynamic data -->
<Component 
  client:load 
  staticData={staticData}
/>

<!-- Component reads localStorage after hydration -->
```

---

## Success Criteria

- [ ] Inline script removed from [slug].astro (~240 lines deleted)
- [ ] No server-side navigation calculation
- [ ] Components receive only static data (titles)
- [ ] guides/index.astro uses `setActivePath()` from progress.ts
- [ ] index.astro uses `setActivePath()` from progress.ts
- [ ] Guide cards show correct green/gray dots
- [ ] Per-path progress shown on path selector cards

---

## Testing Checklist

```javascript
// Test 1: Inline script removed
// Check that [slug].astro has no <script> block with gamification logic

// Test 2: Path storage unified
// Select path on guides/index.astro
// Check localStorage has:
// - 'nostrich-gamification-v1' with progress.activePath set
// - No 'nostrich-user-path' key (or it's migrated then deleted)

// Test 3: SSR doesn't leak wrong navigation
// View page source - should not have prevGuide/nextGuide in HTML

// Test 4: Guide cards show progress
// Visit guides/index.astro
// Completed guides should show green dots
// In-progress guides should show blue dots
```

---

## Coordination Notes

- **Phase 1** you work alongside Core Agent
- You remove inline script while Core Agent fixes data layer
- **Phase 3** you update guide cards display
- Test after each change - Astro files need careful SSR/client coordination
- Use `client:load` directive for React components that need localStorage

## Error Handling Requirements

### Inline Script Safety

**When removing inline script, preserve error handling:**
```astro
<!-- Keep minimal error handling for guide-completed event -->
<script is:inline>
  try {
    window.dispatchEvent(new CustomEvent('guide-completed', { 
      detail: { guideSlug: 'current-guide-slug' }
    }));
  } catch (e) {
    console.error('[Guides] Failed to dispatch event:', e);
  }
</script>
```

### Astro Component Props

**Always provide defaults:**
```astro
---
interface Props {
  guideTitles?: Record<string, string>;
}

const { guideTitles = {} } = Astro.props;
---
```

### Client-Side Script Errors

**Wrap all client scripts:**
```astro
<script>
  (function() {
    try {
      // Your code here
    } catch (e) {
      console.error('[Guides] Script error:', e);
    }
  })();
</script>
```

### Missing Data Handling

**Handle missing localStorage gracefully:**
```javascript
const completedGuides = (() => {
  try {
    const data = localStorage.getItem('nostrich-gamification-v1');
    return data ? JSON.parse(data).progress?.completedGuides || [] : [];
  } catch (e) {
    console.error('[Guides] Failed to read progress:', e);
    return [];
  }
})();
```

---

## Questions?

Ask the orchestrator if anything is unclear before starting.
