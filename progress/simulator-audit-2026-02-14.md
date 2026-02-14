# Nostr Client Simulator Audit Report

**Date:** 2026-02-14  
**Auditor:** AI Assistant  
**Scope:** All 10 Nostr client simulators in `src/simulators/`

---

## Executive Summary

| Simulator | Platform | Status | Critical | Minor |
|-----------|----------|--------|----------|-------|
| amethyst | Android | Working | 0 | 2 |
| coracle | Web | Working | 0 | 1 |
| damus | iOS | Needs Work | 1 | 2 |
| gossip | Desktop | Working | 0 | 2 |
| keychat | Android | Broken | 2 | 2 |
| nostr-kitten | Web | Broken | 2 | 3 |
| olas | iOS | Needs Work | 1 | 2 |
| primal | Web/Mobile | Working | 0 | 1 |
| snort | Web | Working | 0 | 1 |
| yakihonne | Cross-platform | Needs Work | 1 | 2 |

**Overall Status:** 6 Working, 3 Needs Work, 2 Broken

---

## Detailed Findings by Simulator

### 1. Amethyst (Android)

**Platform:** Android  
**Status:** Working  
**Location:** `src/simulators/amethyst/`

#### Critical Issues
- None

#### Minor Issues
1. **CSS Duplication** (`amethyst.theme.css` lines 64-77)
   - `--bitcoin-orange` variables declared 3 times (lines 64-66, 69-71, 74-76)
   - **Impact:** Code bloat, potential override confusion
   - **Fix:** Remove duplicate declarations

2. **Bottom Navigation Positioning** (`amethyst.theme.css` line 372)
   - Uses `position: absolute` for bottom nav
   - **Impact:** May render outside device frame if parent lacks `position: relative`
   - **Fix:** Ensure parent container has proper positioning context

#### Overall Assessment
Fully functional Material Design 3 simulator. CSS duplication is cosmetic only.

---

### 2. Coracle (Web)

**Platform:** Web  
**Status:** Working  
**Location:** `src/simulators/coracle/`

#### Critical Issues
- None

#### Minor Issues
1. **Missing Accessibility Tests**
   - Claims high contrast support but no automated tests
   - **Impact:** Accessibility features unverified
   - **Fix:** Add a11y test coverage

#### Overall Assessment
Clean, accessible web client simulator. Well-structured and functional.

---

### 3. Damus (iOS)

**Platform:** iOS  
**Status:** Needs Work  
**Location:** `src/simulators/damus/`

#### Critical Issues
1. **Tab Bar Outside Device Frame** (`damus.theme.css` lines 247, 284)
   - `.damus-tab-bar` uses `position: absolute` (line 247)
   - `.damus-fab` uses `position: fixed` (line 284)
   - **Impact:** Tab bar and FAB may render outside the iPhone device frame
   - **Fix:** Change to `position: relative` within device container or ensure proper parent context

#### Minor Issues
1. **Dark Mode Inheritance**
   - Relies on parent theme but has incomplete dark variable mappings
   - **Impact:** Some elements may not fully adapt to dark mode
   - **Fix:** Audit all CSS variables for dark mode coverage

2. **iOS-specific Styling**
   - Uses hardcoded iOS radius values that may not match current iOS versions
   - **Impact:** Slight visual inconsistency
   - **Fix:** Update to latest iOS design tokens

#### Overall Assessment
Core functionality works but positioning issues need fixing for proper device frame rendering.

---

### 4. Gossip (Desktop)

**Platform:** Desktop  
**Status:** Working  
**Location:** `src/simulators/gossip/`

#### Critical Issues
- None

#### Minor Issues
1. **No Login Screen**
   - Screens directory lacks `LoginScreen.tsx` (only has Feed, People, Relays, Settings, Thread)
   - **Impact:** Simulator skips authentication flow
   - **Fix:** Add LoginScreen.tsx for consistency with other simulators

2. **Fixed Positioning Issues** (`gossip.theme.css` lines 444, 797)
   - Uses `position: fixed` for modals/overlays
   - **Impact:** May break within iframe or containerized contexts
   - **Fix:** Use `position: absolute` relative to simulator container

#### Overall Assessment
Functional desktop simulator. Missing login screen is a gap in the user flow.

---

### 5. Keychat (Android)

**Platform:** Android  
**Status:** Broken  
**Location:** `src/simulators/keychat/`

#### Critical Issues
1. **Not Exported from Main Index** (`src/simulators/index.ts`)
   - Keychat is NOT included in main simulators index exports
   - **Impact:** Simulator unavailable to the application
   - **Fix:** Add `export * from './keychat';` to `src/simulators/index.ts`

2. **Bottom Nav Positioning** (`keychat.theme.css` line 52)
   - `.keychat-bottom-nav` styling may conflict with device frame
   - **Impact:** Tab bar may render incorrectly
   - **Fix:** Audit positioning within MobilePhoneFrame component

#### Minor Issues
1. **Limited Component Library**
   - Only has `BottomNav.tsx` in components directory
   - **Impact:** Less reusable than other simulators
   - **Fix:** Extract common UI components

2. **Debug Comments in Code**
   - Contains debug console.log statements
   - **Impact:** Console noise in production
   - **Fix:** Remove or wrap in development flags

#### Overall Assessment
Cannot be used until exported from main index. Code quality issues need cleanup.

---

### 6. Nostr-Kitten (Web)

**Platform:** Web  
**Status:** Broken  
**Location:** `src/simulators/nostr-kitten/`

#### Critical Issues
1. **No Index File** (`src/simulators/nostr-kitten/index.ts` - MISSING)
   - No export file present
   - **Impact:** Simulator cannot be imported or used
   - **Fix:** Create `index.ts` with proper exports

2. **Empty Directories**
   - `screens/` directory is empty (tabs defined inline in main file)
   - `components/` directory is empty
   - **Impact:** Unconventional structure, no component reusability
   - **Fix:** Either populate directories or remove them

#### Minor Issues
1. **Fixed Positioning Chaos** (`nostr-kitten.theme.css` lines 9, 45, 629, 643)
   - Multiple `position: fixed` elements (starfield, MIDI player, floating elements)
   - **Impact:** Elements may render outside device/simulator bounds
   - **Fix:** Scope all positioning to simulator container

2. **External Image Dependency**
   - References external hit counter image (line 103)
   - **Impact:** Broken image if external service fails
   - **Fix:** Use local asset or remove

3. **Deprecated HTML Tags**
   - Uses `<marquee>` tag (line 135, 268)
   - **Impact:** Non-standard, may not render in all browsers
   - **Fix:** Replace with CSS animations

#### Overall Assessment
Fun GeoCities theme but structurally broken. Needs complete index file and directory cleanup.

---

### 7. Olas (iOS)

**Platform:** iOS  
**Status:** Needs Work  
**Location:** `src/simulators/olas/`

#### Critical Issues
1. **No Login Screen Component**
   - Login is inline in `OlasSimulator.tsx` (lines 84-114)
   - No separate `LoginScreen.tsx` in screens directory
   - **Impact:** Inconsistent with other simulators, harder to maintain
   - **Fix:** Extract to separate `screens/LoginScreen.tsx` file

#### Minor Issues
1. **Toast Positioning** (`OlasSimulator.tsx` line 169)
   - Toast uses absolute positioning that may clip
   - **Impact:** Notifications may be cut off
   - **Fix:** Use portal or ensure proper z-index and overflow handling

2. **Missing Export in Index**
   - `index.ts` doesn't export LoginScreen (since it doesn't exist)
   - **Impact:** Incomplete public API
   - **Fix:** Create and export LoginScreen

#### Overall Assessment
Functional photo-sharing simulator but needs LoginScreen extraction for consistency.

---

### 8. Primal (Web/Mobile)

**Platform:** Web & Mobile  
**Status:** Working  
**Location:** `src/simulators/primal/`

#### Critical Issues
- None

#### Minor Issues
1. **Fixed Positioning in Mobile** (`primal-mobile.theme.css` lines 496, 523)
   - Uses `position: fixed` for bottom nav and header
   - **Impact:** May cause issues in iframe contexts
   - **Fix:** Use sticky positioning within container

#### Overall Assessment
Well-implemented dual-variant simulator. Both web and mobile versions functional.

---

### 9. Snort (Web)

**Platform:** Web  
**Status:** Working  
**Location:** `src/simulators/snort/`

#### Critical Issues
- None

#### Minor Issues
1. **SSR Compatibility Code** (`SnortSimulator.tsx` lines 40-60)
   - Has workaround for SSR but may cause hydration mismatches
   - **Impact:** Potential React hydration warnings
   - **Fix:** Use proper useEffect for client-side only data

2. **Fixed Positioning** (`snort.theme.css` line 1000)
   - Modal uses `position: fixed`
   - **Impact:** May break in containerized contexts
   - **Fix:** Use absolute positioning within simulator

#### Overall Assessment
Excellent developer-focused simulator. Minor SSR considerations.

---

### 10. YakiHonne (Cross-platform)

**Platform:** iOS/Android  
**Status:** Needs Work  
**Location:** `src/simulators/yakihonne/`

#### Critical Issues
1. **Bottom Nav Positioning** (`yakihonne.theme.css` lines 176-180)
   - `.yakihonne-bottom-nav` uses `position: absolute; bottom: 0`
   - **Impact:** Will render outside device frame
   - **Fix:** Use flexbox layout within device container instead of absolute positioning

#### Minor Issues
1. **Toast Positioning** (`yakihonne.theme.css` line 246)
   - Toast uses absolute positioning
   - **Impact:** May not be visible or may overflow
   - **Fix:** Ensure proper container context

2. **Dark Mode Variable Inconsistency**
   - Some color variables don't have proper dark mode fallbacks
   - **Impact:** Visual glitches in dark mode
   - **Fix:** Audit all CSS custom properties

#### Overall Assessment
Feature-rich simulator with wallet integration. Positioning issues need fixing.

---

## Cross-Cutting Issues

### CSS Positioning Problems
Multiple simulators use `position: absolute` or `position: fixed` for bottom navigation:

| Simulator | File | Line | Issue |
|-----------|------|------|-------|
| amethyst | amethyst.theme.css | 372 | `position: absolute` on bottom nav |
| damus | damus.theme.css | 247, 284 | Tab bar and FAB positioning |
| gossip | gossip.theme.css | 444, 797 | Fixed modal positioning |
| keychat | keychat.theme.css | 52 | Bottom nav styling |
| nostr-kitten | nostr-kitten.theme.css | 9, 45, 629, 643 | Multiple fixed elements |
| olas | olas.theme.css | 110 | Toast positioning |
| primal-mobile | primal-mobile.theme.css | 496, 523 | Fixed header/nav |
| snort | snort.theme.css | 1000 | Modal positioning |
| yakihonne | yakihonne.theme.css | 176, 246 | Bottom nav and toast |

**Recommendation:** All simulators should use flexbox layouts with `position: relative` containers to ensure proper rendering within device frames.

### Missing Login Screens
- **gossip**: No LoginScreen.tsx
- **olas**: Login inline in simulator

### Missing Exports
- **keychat**: Not in main `src/simulators/index.ts`
- **nostr-kitten**: No `index.ts` file

### CSS Duplication
- **amethyst**: `--bitcoin-orange` declared 3 times (lines 64-77)

---

## Recommendations by Priority

### High Priority (Fix Immediately)
1. Create `nostr-kitten/index.ts` export file
2. Add `export * from './keychat';` to main simulators index
3. Fix YakiHonne bottom nav positioning (change from absolute to flex)
4. Fix Damus tab bar positioning

### Medium Priority (Fix Soon)
1. Extract Olas login screen to separate component
2. Create Gossip LoginScreen.tsx
3. Remove CSS duplication in Amethyst theme
4. Fix Nostr-Kitten fixed positioning elements

### Low Priority (Nice to Have)
1. Replace deprecated `<marquee>` tags in Nostr-Kitten
2. Add accessibility tests to Coracle
3. Remove debug console.log statements from Keychat
4. Standardize all simulators to use flexbox layouts

---

## Build/TypeScript Status

No TypeScript compilation errors detected in audited files. All imports resolve correctly (except for the missing exports noted above).

---

## Appendix: File Structure Issues

```
src/simulators/
├── amethyst/          - Complete
├── coracle/           - Complete
├── damus/             - Complete (positioning issues)
├── gossip/            - Missing LoginScreen.tsx
├── keychat/           - Not exported in index.ts
├── nostr-kitten/      - Missing index.ts, empty dirs
├── olas/              - Missing LoginScreen.tsx
├── primal/            - Complete
├── snort/             - Complete
├── yakihonne/         - Complete (positioning issues)
└── index.ts           - Missing keychat export
```

---

*End of Audit Report*
