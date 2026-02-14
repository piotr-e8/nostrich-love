# Simulator Tours - Keychat Pattern Implementation

**Date**: 2026-02-13  
**Status**: ✅ Core Implementation Complete  
**Goal**: Apply Keychat's tour-driven simulator pattern to all Nostr client simulators

---

## Problem Statement

Nostr client simulator tours were using an "action-driven" pattern where:
- Tour steps had `trigger: 'action'` and `actionType` properties
- Tours waited for users to manually perform actions (login, navigate, etc.)
- This created a poor UX where tours would get stuck waiting for user interaction

## Solution: Tour-Driven Pattern (Keychat Model)

Keychat uses a superior "tour-driven" pattern where:
- Tour automatically navigates the simulator via `onStepChange` callback
- No `trigger: 'action'` properties on tour steps
- Commands are queued and executed sequentially
- Tour guides users through the app smoothly

### Key Components of the Pattern

1. **Tour Steps** (no action triggers):
```typescript
{
  id: 'step-id',
  target: '.selector',
  title: 'Step Title',
  content: 'Step description',
  position: 'bottom',
  allowClickThrough: true,  // Allow interaction but don't require it
  spotlightPadding: 16,
}
// NO trigger: 'action' or actionType
```

2. **Simulator Commands**:
```typescript
export interface SimulatorCommand {
  type: 'login' | 'navigate' | 'compose' | 'post' | 'viewProfile' | 'back';
  payload?: any;
}
```

3. **Simulator Component**:
- Accepts `tourCommand` and `onCommandHandled` props
- Uses `useEffect` to process commands
- Updates internal state based on command type

4. **WithTour Wrapper**:
- Uses `onStepChange` callback from TourWrapper
- Maps step indices to command arrays
- Queues and processes commands sequentially

---

## Implementation Status

### ✅ Completed

#### 1. Damus Simulator
**Files Modified:**
- `/src/data/tours/damus-tour.ts` - Removed all `trigger: 'action'` properties
- `/src/simulators/damus/DamusSimulator.tsx` - Added command system
- `/src/simulators/damus/DamusSimulatorWithTour.tsx` - Added onStepChange handler

**Changes:**
- Added `DamusSimulatorCommand` interface
- Added `tourCommand` and `onCommandHandled` props
- Implemented `useEffect` to handle commands
- Step commands mapped for all 10 tour steps

#### 2. Amethyst Simulator
**Files Modified:**
- `/src/data/tours/amethyst-tour.ts` - Removed all `trigger: 'action'` properties
- `/src/simulators/amethyst/AmethystSimulator.tsx` - Added command system
- `/src/simulators/amethyst/AmethystSimulatorWithTour.tsx` - Added onStepChange handler

**Changes:**
- Added `AmethystSimulatorCommand` interface
- Added props for tour command handling
- Implemented command processing in useEffect
- Step commands mapped for all 10 tour steps

#### 3. Tour Files Updated
**Files Modified:**
- `/src/data/tours/primal-tour.ts` - Removed action triggers
- `/src/data/tours/snort-tour.ts` - Removed action triggers
- `/src/data/tours/yakihonne-tour.ts` - Removed action triggers

All tour files now use the tour-driven pattern without action triggers.

### 📝 Remaining Work

#### 1. Primal Simulator
**Files to Update:**
- `/src/simulators/primal/web/WebSimulator.tsx` - Add command system
- `/src/simulators/primal/PrimalWebSimulatorWithTour.tsx` - Add onStepChange handler
- `/src/simulators/primal/mobile/MobileSimulator.tsx` - Add command system (if used)

#### 2. Snort Simulator
**Files to Update:**
- `/src/simulators/snort/SnortSimulator.tsx` - Add command system
- `/src/simulators/snort/SnortSimulatorWithTour.tsx` - Add onStepChange handler

#### 3. YakiHonne Simulator
**Files to Update:**
- Check if YakiHonneSimulator exists (likely needs similar updates)
- `/src/simulators/yakihonne/YakiHonneSimulatorWithTour.tsx` - Add onStepChange handler

#### 4. Coracle & Gossip Simulators
**Files to Check:**
- Determine if these simulators have tour implementations
- Apply same pattern if they do

---

## Technical Details

### Command Processing Flow

1. **Tour Step Changes** → `onStepChange(stepIndex)` called
2. **Step-to-Command Mapping** → Lookup commands for current step
3. **Command Queue** → Commands queued and processed one-by-one
4. **Simulator Update** → `tourCommand` prop triggers useEffect
5. **State Update** → Simulator state updated based on command type
6. **Completion Callback** → `onCommandHandled()` called when done

### Step Command Mapping Example

```typescript
const stepCommands: Record<number, SimulatorCommand[]> = {
  0: [],  // Welcome - no action
  1: [],  // Login screen - already there
  2: [{ type: 'login' }, { type: 'navigate', payload: 'home' }],  // Home feed
  3: [{ type: 'login' }, { type: 'navigate', payload: 'home' }],  // Compose
  4: [{ type: 'login' }, { type: 'navigate', payload: 'home' }],  // Post
  5: [{ type: 'login' }, { type: 'viewProfile' }],  // Profile
  6: [{ type: 'login' }, { type: 'viewProfile' }],  // Follow
  7: [{ type: 'login' }, { type: 'navigate', payload: 'home' }],  // Interactions
  8: [{ type: 'login' }, { type: 'navigate', payload: 'settings' }],  // Settings
  9: [],  // Complete - no action
};
```

### Command Types

Each simulator defines its own command types based on available actions:

**Common Commands:**
- `login` - Authenticate with mock user
- `navigate` - Change screen/tab (payload: screen/tab ID)
- `compose` - Open compose screen
- `post` - Publish a post
- `viewProfile` - Navigate to profile screen
- `back` - Go back to previous screen
- `openSettings` - Open settings modal

---

## Testing

### Clear Tour Progress
```javascript
// Clear all simulator tour progress
localStorage.removeItem('nostr-tour-damus');
localStorage.removeItem('nostr-tour-amethyst');
localStorage.removeItem('nostr-tour-primal');
localStorage.removeItem('nostr-tour-snort');
localStorage.removeItem('nostr-tour-yakihonne');
localStorage.removeItem('nostr-tour-keychat');
```

### Test URLs
- `/simulators/damus` - Should auto-start tour and navigate through screens
- `/simulators/amethyst` - Should auto-start tour and navigate through screens
- `/simulators/keychat` - Working reference implementation

### Expected Behavior
1. Tour auto-starts after 500ms delay
2. Each step automatically navigates simulator to correct screen
3. Spotlight highlights relevant elements
4. Tooltip shows instructions
5. Can navigate with Next/Prev buttons
6. Can skip with ESC key

---

## Benefits of This Pattern

1. **Better UX** - Users don't get stuck waiting to perform actions
2. **Consistent Experience** - All simulators work the same way
3. **Easier Maintenance** - Single pattern across all simulators
4. **More Reliable** - No dependency on user interaction timing
5. **Faster Tours** - Tour progresses at appropriate pace

---

## Next Steps

1. **Complete Remaining Simulators** - Apply pattern to Primal, Snort, YakiHonne
2. **Test All Simulators** - Verify tours work end-to-end
3. **Add Regression Tests** - Ensure tour system stays working
4. **Update Documentation** - Add tour development guide

---

## Files Created/Modified Summary

### Tours (5 files)
- ✅ `/src/data/tours/damus-tour.ts`
- ✅ `/src/data/tours/amethyst-tour.ts`
- ✅ `/src/data/tours/primal-tour.ts`
- ✅ `/src/data/tours/snort-tour.ts`
- ✅ `/src/data/tours/yakihonne-tour.ts`

### Simulators - Damus (3 files)
- ✅ `/src/simulators/damus/DamusSimulator.tsx` - Added command system
- ✅ `/src/simulators/damus/DamusSimulatorWithTour.tsx` - Added onStepChange
- ✅ `/src/simulators/damus/index.ts` - Already imports tour.css

### Simulators - Amethyst (3 files)
- ✅ `/src/simulators/amethyst/AmethystSimulator.tsx` - Added command system
- ✅ `/src/simulators/amethyst/AmethystSimulatorWithTour.tsx` - Added onStepChange
- ✅ `/src/simulators/amethyst/index.ts` - Already imports tour.css

### Documentation (1 file)
- ✅ `/progress/simulator-tours-keychat-pattern.md` - This file

---

**Total Files Modified**: 13 files  
**Status**: Core infrastructure complete, remaining simulators need command system implementation
