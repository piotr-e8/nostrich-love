# Tour System Audit Report
**Date:** 2026-02-14
**Scope:** Nostr Client Simulator Tour System
**Auditor:** AI Code Review

---

## Executive Summary

The tour system is a comprehensive guided tour framework for Nostr client simulators. It consists of:
- **7 tour config files** (amethyst, damus, keychat, olas, primal, snort, yakihonne)
- **8 tour wrapper files** (7 WithTour wrappers + 2 custom implementations)
- **Core tour system** (11 components in src/components/tour/)
- **Tour command system** for driving simulator state from tour steps

**Overall Status:** PARTIALLY FUNCTIONAL
- 3 simulators have full tour command integration (Damus, Keychat, Olas)
- 4 simulators lack tour command integration (Amethyst, Primal, Snort, YakiHonne)
- 2 simulators use custom tour implementations (Coracle, Gossip)
- 2 simulators have NO tour configs (Coracle, Gossip)

---

## Summary Table: Tour Status Per Simulator

| Simulator | Tour Config | WithTour Wrapper | Command System | Tour Button | Status |
|-----------|-------------|------------------|----------------|-------------|--------|
| **Amethyst** | 10 steps | Basic | NO | Yes | PARTIAL |
| **Damus** | 10 steps | Full | YES | Yes | FULL |
| **Keychat** | 10 steps | Full | YES | Yes | FULL |
| **Olas** | 9 steps | Full | YES* | Yes | FULL* |
| **Primal** | 10 steps | Basic | NO | Yes | PARTIAL |
| **Snort** | 10 steps | Basic | NO | Yes | PARTIAL |
| **YakiHonne** | 10 steps | Basic | NO | Yes | PARTIAL |
| **Coracle** | NONE | Custom | N/A | Yes | MISSING |
| **Gossip** | NONE | Custom | N/A | Yes | MISSING |

*Olas has command system but wrapper doesn't pass commands to simulator base

---

## Critical Issues (Tours That Don't Work At All)

### 1. Coracle - NO TOUR CONFIG
- **File:** `src/simulators/coracle/components/GuidedTour.tsx` (custom implementation)
- **Issue:** No tour config file exists (`src/data/tours/coracle-tour.ts` is MISSING)
- **Impact:** Uses custom GuidedTour component instead of shared tour system
- **Simulator Page:** Uses `CoracleSimulator` directly, not a WithTour wrapper
- **Steps:** 5 hardcoded steps in custom component
- **Fix Required:** 
  - Create `coracle-tour.ts` config file
  - Create `CoracleSimulatorWithTour.tsx` wrapper
  - Update page to use wrapper
  - Add data-tour attributes to Coracle screens

### 2. Gossip - NO TOUR CONFIG  
- **File:** `src/simulators/gossip/components/OnboardingTour.tsx` (custom implementation)
- **Issue:** No tour config file exists (`src/data/tours/gossip-tour.ts` is MISSING)
- **Impact:** Uses custom OnboardingTour component instead of shared tour system
- **Simulator Page:** Uses `GossipSimulator` directly, not a WithTour wrapper
- **Steps:** 4 hardcoded steps + keyboard shortcuts
- **Fix Required:**
  - Create `gossip-tour.ts` config file
  - Create `GossipSimulatorWithTour.tsx` wrapper
  - Update page to use wrapper
  - Add data-tour attributes to Gossip screens

---

## Major Issues (Broken Integration)

### 3. OlasSimulatorWithTour - NOT EXPORTED
- **File:** `src/simulators/olas/OlasSimulatorWithTour.tsx` exists
- **Issue:** NOT exported in `src/simulators/olas/index.ts`
- **Impact:** Cannot be imported by pages
- **Current State:** Page uses `OlasSimulatorWithTour` directly from file path
- **Fix Required:** Add export to `src/simulators/olas/index.ts`:
  ```typescript
  export { OlasSimulatorWithTour } from './OlasSimulatorWithTour';
  ```

### 4. Olas - Command System Not Connected
- **File:** `src/simulators/olas/OlasSimulatorWithTour.tsx` (lines 88-90)
- **Issue:** `tourCommand` prop is NOT passed to `OlasSimulatorBase`
  ```tsx
  <OlasSimulatorBase />  // Missing: tourCommand={currentCommand}
  ```
- **Impact:** Tour can queue commands but simulator never receives them
- **Fix Required:** Pass props to base component:
  ```tsx
  <OlasSimulatorBase 
    tourCommand={currentCommand}
    onCommandHandled={handleCommandHandled}
  />
  ```

---

## Minor Issues (Missing Features)

### 5. Amethyst - Missing Tour Command System
- **File:** `src/simulators/amethyst/AmethystSimulatorWithTour.tsx`
- **Issue:** Only basic TourWrapper, no `onStepChange` handler
- **Impact:** Tour cannot drive simulator state automatically
- **Current Steps:** All 10 steps work manually but simulator doesn't auto-navigate
- **Fix Required:** Add command system similar to Damus:
  - Define `AmethystSimulatorCommand` interface
  - Add `onStepChange` handler to wrapper
  - Add command processing to `AmethystSimulator.tsx`
  - Pass `tourCommand` prop to base

### 6. Primal - Missing Tour Command System
- **File:** `src/simulators/primal/PrimalWebSimulatorWithTour.tsx`
- **Issue:** Only basic TourWrapper, no `onStepChange` handler
- **Impact:** Tour cannot drive simulator state automatically
- **Fix Required:** Same pattern as Amethyst fix

### 7. Snort - Missing Tour Command System
- **File:** `src/simulators/snort/SnortSimulatorWithTour.tsx`
- **Issue:** Only basic TourWrapper, no `onStepChange` handler
- **Impact:** Tour cannot drive simulator state automatically
- **Fix Required:** Same pattern as Amethyst fix

### 8. YakiHonne - Missing Tour Command System
- **File:** `src/simulators/yakihonne/YakiHonneSimulatorWithTour.tsx`
- **Issue:** Only basic TourWrapper, no `onStepChange` handler
- **Impact:** Tour cannot drive simulator state automatically
- **Fix Required:** Same pattern as Amethyst fix

---

## Tour System Components Health Check

### Core Components - ALL FUNCTIONAL

| Component | Status | Notes |
|-----------|--------|-------|
| `TourProvider.tsx` | OK | State management working |
| `TourWrapper.tsx` | OK | Integration wrapper working |
| `TourOverlay.tsx` | OK | Spotlight and portal rendering |
| `TourTooltip.tsx` | OK | Auto-positioning working |
| `TourProgress.tsx` | OK | Step indicators functional |
| `TourControls.tsx` | OK | Navigation buttons working |
| `TourButton.tsx` | OK | Start/Resume/Retake working |
| `types.ts` | OK | Type definitions complete |
| `tourStorage.ts` | OK | LocalStorage persistence |
| `useTourElement.ts` | OK | Element positioning with retry |
| `tour.css` | OK | Styling complete |

### Tour System Features - ALL WORKING

| Feature | Status | Notes |
|---------|--------|-------|
| Auto-start on load | OK | Respects `shouldAutoStartTour()` |
| Spotlight highlight | OK | CSS clip-path spotlight |
| Tooltip positioning | OK | Viewport boundary detection |
| Keyboard navigation | OK | Arrow keys, Enter, Escape |
| Progress persistence | OK | LocalStorage with privacy check |
| Action triggers | OK | `trigger: 'action'` steps work |
| Restart/Resume | OK | Via SimulatorSidebar button |
| Step validation | OK | `validateStep()` callback |
| Click-through | OK | `allowClickThrough` property |

---

## Tour Config Files Analysis

### All Tour Configs Present (7/7)

| File | Steps | Triggers | Status |
|------|-------|----------|--------|
| `amethyst-tour.ts` | 10 | 8 action triggers | OK |
| `damus-tour.ts` | 10 | 0 action triggers (manual) | OK |
| `keychat-tour.ts` | 10 | 0 action triggers (manual) | OK |
| `olas-tour.ts` | 9 | 7 action triggers | OK |
| `primal-tour.ts` | 10 | 0 action triggers (manual) | OK |
| `snort-tour.ts` | 10 | 0 action triggers (manual) | OK |
| `yakihonne-tour.ts` | 10 | 0 action triggers (manual) | OK |

### Missing Tour Configs (2/9)

| Simulator | Missing File | Priority |
|-----------|--------------|----------|
| Coracle | `coracle-tour.ts` | HIGH |
| Gossip | `gossip-tour.ts` | HIGH |

---

## Tour Button Integration

**Location:** `src/components/navigation/SimulatorSidebar.tsx` (lines 254-281)

**Status:** FULLY FUNCTIONAL

**Features:**
- Shows "Start Tour" for new users
- Shows "Resume Tour" for skipped tours
- Shows "Retake Tour" for completed tours
- Dispatches `start-{tourId}` custom event
- Resets tour progress before starting
- Handles all 10 simulators via `tourIdMap`

**Tour ID Mapping:**
```typescript
const tourIdMap: Record<SimulatorClient, string> = {
  [SimulatorClient.DAMUS]: 'damus-tour',
  [SimulatorClient.AMETHYST]: 'amethyst-tour',
  [SimulatorClient.PRIMAL]: 'primal-tour',
  [SimulatorClient.SNORT]: 'snort-tour',
  [SimulatorClient.YAKIHONNE]: 'yakihonne-tour',
  [SimulatorClient.CORACLE]: 'coracle-tour',  // No config exists!
  [SimulatorClient.GOSSIP]: 'gossip-tour',    // No config exists!
  [SimulatorClient.KEYCHAT]: 'keychat-tour',
  [SimulatorClient.OLAS]: 'olas-tour',
};
```

---

## Data-Tour Attributes (Selectors)

### Well-Implemented Selectors

| Simulator | Attribute Coverage | Notes |
|-----------|-------------------|-------|
| Damus | Good | 5 screens have data-tour |
| Keychat | Good | 7 screens have data-tour |
| Olas | Good | 5 screens have data-tour |

### Partial Selectors

| Simulator | Missing Coverage | Notes |
|-----------|-----------------|-------|
| Amethyst | Incomplete | Some steps target CSS classes only |
| Primal | Incomplete | Login screen only |
| Snort | Incomplete | Login screen only |
| YakiHonne | Incomplete | Login screen only |

### No Selectors

| Simulator | Status | Notes |
|-----------|--------|-------|
| Coracle | NONE | Uses custom tour (no data-tour needed) |
| Gossip | NONE | Uses custom tour (no data-tour needed) |

---

## Step Flow Analysis

### Action-Driven Steps (Require User Interaction)

| Simulator | Action Steps | Works? |
|-----------|--------------|--------|
| Amethyst | 8 steps | PARTIAL - No command system |
| Damus | 0 steps | N/A - All manual |
| Keychat | 0 steps | N/A - All manual |
| Olas | 7 steps | PARTIAL - Commands not connected |

### Manual Steps (Click Next to Advance)

All simulators support manual step progression via:
- Next/Prev buttons in TourControls
- Keyboard arrow keys
- Clicking step indicators in TourProgress

---

## Command System Architecture

### Working Command System Pattern

**Damus Example:**
```typescript
// 1. Define commands
export interface DamusSimulatorCommand {
  type: 'login' | 'navigate' | 'compose' | 'post' | 'viewProfile' | 'back';
  payload?: any;
}

// 2. Wrapper queues commands on step change
const stepCommands: Record<number, DamusSimulatorCommand[]> = {
  2: [{ type: 'login' }, { type: 'navigate', payload: 'home' }],
  // ...
};

// 3. Simulator processes commands via useEffect
useEffect(() => {
  if (!tourCommand) return;
  switch (tourCommand.type) {
    case 'login': /* ... */ break;
    case 'navigate': /* ... */ break;
    // ...
  }
  onCommandHandled?.();
}, [tourCommand, /* deps */]);

// 4. Simulator registers actions for trigger steps
const registerAction = (actionType: string) => {
  if (tourContext?.registerAction) {
    tourContext.registerAction(actionType);
  }
};
```

### Simulators Missing Command System

1. **Amethyst** - No command interface in base simulator
2. **Primal** - No command interface in base simulator  
3. **Snort** - No command interface in base simulator
4. **YakiHonne** - No command interface in base simulator

---

## Recommended Priority Fixes

### P0 - Critical (Fix Immediately)

1. **Create Coracle Tour Config**
   - File: `src/data/tours/coracle-tour.ts`
   - Steps: ~10 steps covering login, home, profile, relays, settings
   - Add data-tour attributes to Coracle screens

2. **Create Gossip Tour Config**
   - File: `src/data/tours/gossip-tour.ts`
   - Steps: ~10 steps covering split-pane, navigation, compose, relays
   - Add data-tour attributes to Gossip screens

### P1 - High Priority (Fix Soon)

3. **Fix Olas Command Connection**
   - File: `src/simulators/olas/OlasSimulatorWithTour.tsx`
   - Pass `tourCommand` and `onCommandHandled` to base

4. **Export OlasSimulatorWithTour**
   - File: `src/simulators/olas/index.ts`
   - Add: `export { OlasSimulatorWithTour } from './OlasSimulatorWithTour';`

### P2 - Medium Priority (Enhancement)

5. **Add Command System to Amethyst**
   - Add interface, wrapper handler, base simulator support

6. **Add Command System to Primal**
   - Add interface, wrapper handler, base simulator support

7. **Add Command System to Snort**
   - Add interface, wrapper handler, base simulator support

8. **Add Command System to YakiHonne**
   - Add interface, wrapper handler, base simulator support

---

## Appendix: File Locations

### Tour Configs
```
src/data/tours/
├── amethyst-tour.ts      (10 steps) 
├── damus-tour.ts         (10 steps)
├── keychat-tour.ts       (10 steps)
├── olas-tour.ts          (9 steps)
├── primal-tour.ts        (10 steps)
├── snort-tour.ts         (10 steps)
├── yakihonne-tour.ts     (10 steps)
├── index.ts              (exports)
├── MISSING: coracle-tour.ts
└── MISSING: gossip-tour.ts
```

### Tour Wrappers
```
src/simulators/
├── amethyst/AmethystSimulatorWithTour.tsx      (Basic)
├── damus/DamusSimulatorWithTour.tsx            (Full commands)
├── keychat/KeychatSimulatorWithTour.tsx        (Full commands)
├── olas/OlasSimulatorWithTour.tsx              (Full, NOT EXPORTED)
├── primal/PrimalWebSimulatorWithTour.tsx       (Basic)
├── snort/SnortSimulatorWithTour.tsx            (Basic)
├── yakihonne/YakiHonneSimulatorWithTour.tsx    (Basic)
├── coracle/components/GuidedTour.tsx           (Custom)
└── gossip/components/OnboardingTour.tsx        (Custom)
```

### Tour System Core
```
src/components/tour/
├── TourProvider.tsx        (State management)
├── TourWrapper.tsx         (Integration)
├── TourOverlay.tsx         (Spotlight/portal)
├── TourTooltip.tsx         (Positioning)
├── TourProgress.tsx        (Step indicators)
├── TourControls.tsx        (Navigation)
├── TourButton.tsx          (Manual trigger)
├── useTourElement.ts       (DOM positioning)
├── tourStorage.ts          (Persistence)
├── types.ts                (Type definitions)
├── tour.css                (Styling)
└── index.ts                (Exports)
```

### Simulator Pages
```
src/pages/simulators/
├── amethyst.astro     (Uses AmethystSimulatorWithTour)
├── damus.astro        (Uses DamusSimulatorWithTour)
├── keychat.astro      (Uses KeychatSimulatorWithTour)
├── olas.astro         (Uses OlasSimulatorWithTour)
├── primal.astro       (Uses PrimalWebSimulatorWithTour)
├── snort.astro        (Uses SnortSimulatorWithTour)
├── yakihonne.astro    (Uses YakiHonneSimulatorWithTour)
├── coracle.astro      (Uses CoracleSimulator - NO TOUR)
└── gossip.astro       (Uses GossipSimulator - NO TOUR)
```

---

## Conclusion

The tour system has a solid foundation with:
- Well-designed component architecture
- Working state management and persistence
- Functional UI (spotlight, tooltips, controls)
- Proper integration with sidebar navigation

**However, it needs work in:**
1. Complete tour configs for Coracle and Gossip
2. Command system rollout to 4 remaining simulators
3. Export fixes for Olas

**Estimated effort to complete:**
- P0 fixes: 2-3 hours
- P1 fixes: 1 hour  
- P2 fixes: 4-6 hours
- **Total: 7-10 hours** to have all 9 simulators with fully functional tours

---

*End of Audit Report*
