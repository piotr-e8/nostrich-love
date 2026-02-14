# Simulator Tours Fix

**Date**: 2026-02-13  
**Issue**: Client simulator tours not working  
**Status**: ✅ Fixed

---

## Problem

Tours for client simulators (Damus, Amethyst, Keychat, etc.) were not working - they wouldn't start automatically or show UI.

---

## Root Causes

### 1. Tours Disabled by Default
**File**: `src/lib/progressService.ts` (line 27)

```typescript
// BEFORE
toursEnabled: false, // Default OFF - client tours are opt-in

// AFTER  
toursEnabled: true, // Default ON - client tours help users learn
```

The `shouldAutoStartTour()` function checks this setting and was returning `false`.

### 2. Missing CSS for Tour Buttons
**File**: `src/components/tour/tour.css`

Tour buttons (Start Tour, Retake Tour, etc.) had no styles defined. Added complete button styling including:
- Size variants (sm, md, lg)
- Style variants (primary, secondary, ghost, icon)
- Hover states
- Dark mode support

### 3. Tour CSS Not Imported
**Files**: All simulator `index.ts` files

The tour CSS was only imported in `tour/index.ts` but wasn't being loaded by simulators. Added import to:
- `src/simulators/keychat/index.ts`
- `src/simulators/damus/index.ts`
- `src/simulators/amethyst/index.ts`
- `src/simulators/yakihonne/index.ts`
- `src/simulators/snort/index.ts`
- `src/simulators/primal/index.ts`

---

## Changes Made

### 1. Enabled Tours by Default
```typescript
// src/lib/progressService.ts
const defaultPrivacySettings: PrivacySettings = {
  trackingEnabled: false,
  dataRetention: 'forever',
  showProgressIndicators: false,
  toursEnabled: true, // ← Changed from false
};
```

### 2. Added Tour Button CSS
Added ~100 lines of CSS for `.tour-btn*` classes including responsive and dark mode styles.

### 3. Added CSS Imports
```typescript
// In each simulator's index.ts
import '../../components/tour/tour.css';
```

### 4. Added Debugging
Added console logs to `TourAutoStarter` to help verify tours are being checked and started.

---

## How It Works

1. **TourWrapper** wraps the simulator component
2. **TourAutoStarter** checks if tour should auto-start (based on privacy settings + localStorage)
3. **TourProvider** manages tour state
4. **TourOverlay** renders spotlight, tooltip, and controls
5. **TourButton** allows manual start/restart

---

## Testing

Visit any simulator page:
- `/simulators/keychat`
- `/simulators/damus`
- `/simulators/amethyst`
- etc.

**Expected behavior**:
1. Tour should auto-start after 500ms delay
2. Spotlight highlights elements
3. Tooltip shows instructions
4. Can navigate with arrow keys or buttons
5. Can skip with ESC key
6. "Start Tour" button visible in top-right

**Debug output** in console:
```
[TourAutoStarter] keychat-tour: autoStart=true, shouldStart=true
[TourAutoStarter] Starting tour: keychat-tour
```

---

## Files Modified

1. `src/lib/progressService.ts` - Enable tours by default
2. `src/components/tour/tour.css` - Add button styles
3. `src/components/tour/TourWrapper.tsx` - Add debugging
4. `src/simulators/*/index.ts` - Import tour CSS (6 files)

---

## Tour Features

- **Auto-start**: Tours start automatically on first visit
- **Spotlight**: Dark overlay with highlighted element
- **Tooltips**: Contextual instructions with positioning
- **Action-driven steps**: Wait for user interaction before advancing
- **Keyboard navigation**: Arrow keys, Enter, ESC
- **Progress indicator**: Visual progress through tour steps
- **Manual restart**: TourButton to restart anytime
- **Persistence**: Completion/skip status saved to localStorage
