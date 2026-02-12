# Bug & Issue Tracking

**Project:** Nostr Client Simulators  
**Format:** GitHub-style issues  
**Last Updated:** 2026-02-11  

---

## Issue Status Legend

- 🟢 **Open** - Issue confirmed, awaiting fix
- 🟡 **In Progress** - Being worked on
- 🔵 **Under Review** - Fix implemented, needs testing
- ✅ **Resolved** - Fixed and verified
- ⬜ **Backlog** - Future consideration

---

## Damus Simulator Issues

### Issue #D1: Tab Bar Not Visible on Login Screen
**Status:** ✅ RESOLVED (By Design)  
**Priority:** Low  
**Type:** Enhancement  

**Description:**
Tab bar should not be visible on login screen, which is current behavior. This is intentional design choice.

**Expected Behavior:**
- Tab bar hidden on login screen ✅
- Tab bar appears after login ✅

**Verification:**
- [x] Login screen shows no tab bar
- [x] Home screen shows tab bar
- [x] All authenticated screens show tab bar

---

### Issue #D2: Pull-to-Refresh Trigger Too Sensitive
**Status:** ⬜ BACKLOG  
**Priority:** Low  
**Type:** UX Enhancement  

**Description:**
The pull-to-refresh gesture triggers at -50px scroll, which may be too sensitive. Consider increasing threshold to -80px for better UX.

**Current Code:**
```tsx
if (scrollTop < -50 && !refreshing) {
  handleRefresh();
}
```

**Recommendation:**
```tsx
if (scrollTop < -80 && !refreshing) {
  handleRefresh();
}
```

**Impact:** Low - Functionality works, just UX refinement

---

### Issue #D3: Avatar Images Use HTTP (Mixed Content Warning)
**Status:** 🟢 OPEN  
**Priority:** Medium  
**Type:** Security/Compatibility  

**Description:**
Some mock avatar URLs use HTTP instead of HTTPS, causing mixed content warnings when site is served over HTTPS.

**Location:** `/src/data/mock/users.ts`

**Current:**
```typescript
avatar: 'http://example.com/avatar.jpg'
```

**Fix:**
```typescript
avatar: 'https://example.com/avatar.jpg'
// Or use protocol-relative URLs
avatar: '//example.com/avatar.jpg'
```

**Affected Files:**
- [ ] `/src/data/mock/users.ts`
- [ ] Check all mock data files for HTTP URLs

---

### Issue #D4: NoteCard Content Overflow on Long Words
**Status:** ⬜ BACKLOG  
**Priority:** Low  
**Type:** UI/Visual  

**Description:**
Very long words (URLs, hashes) in note content can overflow card boundaries on small screens.

**Fix:**
```css
.note-content {
  word-break: break-word;
  overflow-wrap: break-word;
}
```

---

### Issue #D5: Settings Screen Mock Only
**Status:** ✅ ACCEPTED (By Design)  
**Priority:** Low  
**Type:** Feature  

**Description:**
Settings screen is visual mock only - buttons don't perform actions. This is acceptable for simulator purposes.

**Acceptance:**
- Visual representation sufficient ✅
- Logout button works ✅
- Navigation works ✅

---

## Amethyst Simulator Issues

### Issue #A1: Theme Switcher Has No Persistence
**Status:** ✅ ACCEPTED (By Design)  
**Priority:** Low  
**Type:** Feature  

**Description:**
Theme selection (Light/Dark/Auto) resets on page reload. This is expected behavior for simulators (no persistence).

**Note:** Session-only state is by design for all simulators.

---

### Issue #A2: FAB Animation Sometimes Stuck
**Status:** 🟢 OPEN  
**Priority:** Medium  
**Type:** Animation  

**Description:**
Floating Action Button occasionally gets stuck in exit animation state when rapidly switching tabs.

**Reproduction:**
1. Go to Home tab (FAB visible)
2. Rapidly click Messages tab then Home tab
3. FAB may not reappear or appears with wrong animation state

**Root Cause:**
Framer Motion AnimatePresence timing issue with rapid state changes.

**Potential Fix:**
```tsx
// Add key to force remount
<motion.div
  key={`fab-${activeTab}`} // Force remount on tab change
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
>
```

---

### Issue #A3: Search Screen Non-Functional
**Status:** ✅ ACCEPTED (Visual Mock)  
**Priority:** Low  
**Type:** Feature  

**Description:**
Search screen displays trending topics and suggested users but search functionality is not implemented (visual simulation only).

**Acceptance:**
- Search UI present ✅
- Trending topics display ✅
- Suggested users display ✅
- Full text search not required for simulator ✅

---

### Issue #A4: Character Counter Shows Incorrect Value on Paste
**Status:** 🟢 OPEN  
**Priority:** Low  
**Type:** Functional  

**Description:**
When pasting text into compose modal, character counter doesn't immediately update.

**Location:** `ComposeScreen.tsx`

**Current:**
```tsx
const [content, setContent] = useState('');
// Counter based on content.length
```

**Fix:**
Ensure onChange handler properly updates state before counter calculation.

---

### Issue #A5: Dark Theme Card Contrast Issues
**Status:** 🟢 OPEN  
**Priority:** Medium  
**Type:** Accessibility  

**Description:**
In dark theme, some card backgrounds and text colors don't meet WCAG contrast requirements.

**Affected Elements:**
- Card surface color on dark background
- Secondary text on cards
- Disabled button states

**Fix:**
Update CSS variables in `amethyst.theme.css`:
```css
[data-theme="dark"] {
  --md-surface: #1C1B1F; /* Darker for better contrast */
  --md-on-surface-variant: #CAC4D0; /* Lighter text */
}
```

---

### Issue #A6: Bottom Nav Active State Not Clear
**Status:** ⬜ BACKLOG  
**Priority:** Low  
**Type:** Accessibility  

**Description:**
Active tab in bottom navigation could have stronger visual indication beyond just color change.

**Recommendation:**
- Add label visibility change (icon + text always visible for active)
- Add subtle background highlight
- Add top border indicator

---

## Cross-Simulator Issues

### Issue #X1: Shared Mock Data Not Immutable
**Status:** 🟢 OPEN  
**Priority:** Medium  
**Type:** Code Quality  

**Description:**
Mock data arrays/objects are exported directly and could be accidentally mutated by simulators.

**Location:** `/src/data/mock/index.ts`

**Current:**
```typescript
export const mockUsers = [/* ... */];
export const mockNotes = [/* ... */];
```

**Fix:**
```typescript
// Deep freeze or return copies
export const getMockUsers = () => [...mockUsers];
export const getMockNotes = () => [...mockNotes];
```

**Impact:**
- Prevents state pollution between simulators
- Prevents accidental data corruption

---

### Issue #X2: No Error Boundary for Simulators
**Status:** 🟢 OPEN  
**Priority:** High  
**Type:** Error Handling  

**Description:**
Simulator errors can crash the entire page. Need error boundaries to isolate simulator failures.

**Fix:**
```tsx
// Wrap each simulator
<ErrorBoundary fallback={<SimulatorError />}>
  <DamusSimulator />
</ErrorBoundary>
```

**Implementation:**
```tsx
// src/components/ErrorBoundary.tsx
class SimulatorErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-600">Simulator error. Please refresh.</div>;
    }
    return this.props.children;
  }
}
```

---

### Issue #X3: Console Logs in Production
**Status:** 🟢 OPEN  
**Priority:** Low  
**Type:** Code Quality  

**Description:**
Simulator actions log to console (e.g., `[Damus] Logged in as: alice`). Should be removed or disabled in production builds.

**Current:**
```typescript
console.log('[Damus] Logged in as:', user.username);
```

**Fix:**
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('[Damus] Logged in as:', user.username);
}
```

**Affected Simulators:**
- [ ] Damus
- [ ] Amethyst
- [ ] All future simulators

---

### Issue #X4: Mobile Responsiveness Issues on Small Screens
**Status:** 🟢 OPEN  
**Priority:** Medium  
**Type:** Responsive Design  

**Description:**
On very small screens (<350px), some elements overflow or become too small.

**Issues Noted:**
- Tab text truncates awkwardly
- Some buttons too small for touch
- Horizontal scrolling appears

**Test Matrix:**
- [ ] iPhone SE (375px)
- [ ] Galaxy Fold folded (320px)
- [ ] Small Android devices (360px)

---

### Issue #X5: Missing Simulator Index Page
**Status:** 🟢 OPEN  
**Priority:** Medium  
**Type:** UX  

**Description:**
`/simulators` page exists but needs better navigation and organization.

**Current:** Basic list of links  
**Desired:** Grid of simulator cards with previews and descriptions

**Design:**
```
[Damus Card]    [Amethyst Card]
[iOS Preview]   [Android Preview]

[Primal Card]   [Snort Card]
[Web Preview]   [Web Preview]
```

---

## Infrastructure Issues

### Issue #I1: No Automated Testing
**Status:** ⬜ BACKLOG  
**Priority:** High  
**Type:** Testing  

**Description:**
No automated tests for simulators. Need to add:
- Unit tests for utilities
- Component tests with React Testing Library
- E2E tests with Cypress or Playwright

**Plan:**
1. Add Jest + React Testing Library
2. Write tests for shared utilities
3. Add component tests for base components
4. Add E2E tests for critical user flows

---

### Issue #I2: No Visual Regression Testing
**Status:** ⬜ BACKLOG  
**Priority:** Medium  
**Type:** Testing  

**Description:**
Changes to shared components could break simulator visuals without detection.

**Solution:**
- Implement Chromatic or Storybook visual testing
- Snapshot tests for each simulator screen

---

### Issue #I3: Build Process Not Optimized
**Status:** ⬜ BACKLOG  
**Priority:** Low  
**Type:** Build  

**Description:**
Simulators are built into main bundle. Consider lazy loading for better initial page load.

**Current:**
```typescript
import { DamusSimulator } from './simulators/damus';
```

**Optimized:**
```typescript
const DamusSimulator = lazy(() => import('./simulators/damus'));
```

---

## Resolved Issues

| Issue | Simulator | Description | Resolution |
|-------|-----------|-------------|------------|
| #D5 | Damus | Settings screen mock | Accepted - by design |
| #A1 | Amethyst | Theme no persistence | Accepted - by design |
| #A3 | Amethyst | Search non-functional | Accepted - visual mock |

---

## Issue Template

When creating new issues, use this format:

```markdown
## Issue #[ID]: [Title]

**Status:** 🟢 Open / 🟡 In Progress / 🔵 Under Review / ✅ Resolved
**Priority:** Critical / High / Medium / Low
**Type:** Bug / Feature / Enhancement / Accessibility / Performance
**Simulator:** Damus / Amethyst / Primal / Snort / YakiHonne / Coracle / Gossip / All

### Description
[Brief description of the issue]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Screenshots/Logs
[If applicable]

### Environment
- Browser: [Chrome/Firefox/Safari]
- Device: [Desktop/Mobile]
- OS: [Windows/macOS/Linux/iOS/Android]

### Additional Context
[Any other relevant information]
```

---

## Sprint Planning

### Current Sprint (Week of 2026-02-11)

**In Progress:**
- None

**Backlog for Next Sprint:**
- [ ] Issue #D3 - HTTP avatar URLs
- [ ] Issue #A5 - Dark theme contrast
- [ ] Issue #X2 - Error boundaries
- [ ] Issue #X3 - Remove console logs

**Backlog (Future):**
- [ ] Issue #D2 - Pull-to-refresh sensitivity
- [ ] Issue #A2 - FAB animation fix
- [ ] Issue #A6 - Bottom nav improvements
- [ ] Issue #X1 - Immutable mock data
- [ ] Issue #X4 - Mobile responsiveness
- [ ] Issue #X5 - Simulator index page
- [ ] Issue #I1 - Automated testing
- [ ] Issue #I2 - Visual regression
- [ ] Issue #I3 - Build optimization

---

## Metrics

| Category | Open | In Progress | Resolved | Total |
|----------|------|-------------|----------|-------|
| Damus | 2 | 0 | 3 | 5 |
| Amethyst | 3 | 0 | 2 | 5 |
| Cross-Simulator | 5 | 0 | 0 | 5 |
| Infrastructure | 3 | 0 | 0 | 3 |
| **Total** | **13** | **0** | **5** | **18** |

---

**QA Lead:** QA Agent  
**Last Updated:** 2026-02-11  
**Next Review:** Weekly
