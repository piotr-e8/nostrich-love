# Amethyst Simulator Improvement Specification

**Date**: 2026-02-13  
**Workflow**: improve-simulator  
**Client**: Amethyst  
**Platform**: Android  
**Status**: ✅ **APPROVED** - Implementation in Progress

---

## Research Summary

### Sources Analyzed
- **nostrapps.com**: Retrieved 3 screenshots showing feed, profile, and notifications
- **Existing screenshots**: `/reference/screenshots/amethyst/` (3 files)
- **Current simulator**: `/src/simulators/amethyst/` (analyzed all components)

### Key Findings from Real App

#### 1. Stories/Highlights Row
**Real App**: Has horizontal scrollable stories at top of feed with:
- "Add Story" button (first position)
- User avatars with gradient rings for stories
- Live streaming indicators (gradient badges)
- Username labels below avatars

**Current Simulator**: ❌ **MISSING** - No stories section at all

#### 2. Top App Bar
**Real App**: Material Design 3 app bar with:
- Hamburger menu (left)
- Amethyst logo + name (center)
- Search icon (right)
- Notification bell with badge (right)
- Sticky with shadow

**Current Simulator**: ⚠️ **PARTIAL** - Has basic structure but:
- Missing notification badge
- Missing proper centering
- Less polished styling

#### 3. Pull-to-Refresh
**Real App**: Native Android pull-to-refresh gesture with:
- Circular spinner animation
- Resistance-based pull
- Smooth spring animation
- Material Design colors

**Current Simulator**: ❌ **MISSING** - No gesture support

#### 4. Card Design
**Real App**: Material Design 3 cards with:
- NIP-05 verification badges on avatars
- Community tags ("Posted in [community]")
- Live streaming badges
- Better action button spacing
- Proper Material shadows

**Current Simulator**: ⚠️ **PARTIAL** - Basic cards exist but missing:
- NIP-05 badges
- Community support
- Live indicators
- Refined action buttons

#### 5. Bottom Navigation
**Real App**: Material Design 3 bottom nav with:
- Labels always visible
- Active indicator line at top
- Secondary container background
- Proper badge styling
- Safe area support

**Current Simulator**: ⚠️ **PARTIAL** - Functional but needs refinement

---

## Discrepancy Analysis

| Feature | Real App | Current | Priority |
|---------|----------|---------|----------|
| Stories/Highlights | ✅ Present | ❌ Missing | **HIGH** |
| Pull-to-Refresh | ✅ Native | ❌ Missing | **HIGH** |
| NIP-05 Badges | ✅ Verified | ❌ Missing | **HIGH** |
| Top App Bar | ✅ Polished | ⚠️ Basic | **MEDIUM** |
| Community Tags | ✅ Present | ❌ Missing | **MEDIUM** |
| Live Indicators | ✅ Gradient badges | ❌ Missing | **MEDIUM** |
| Bottom Nav | ✅ MD3 compliant | ⚠️ Needs work | **MEDIUM** |
| Action Buttons | ✅ Refined | ⚠️ Basic | **LOW** |

---

## Improvement Specification

### Phase 1: Stories/Highlights Implementation
**Files to Modify**:
- `screens/HomeScreen.tsx` - Add stories section
- `amethyst.theme.css` - Add story ring styles

**Implementation**:
1. Add horizontal scrollable stories row below app bar
2. Generate mock stories from existing mock users
3. Add "Add Story" button with dashed border
4. Implement gradient ring for users with stories
5. Add live streaming indicator badges
6. Add touch scrolling support

**Time Estimate**: 30-45 minutes

---

### Phase 2: Pull-to-Refresh Gesture
**Files to Modify**:
- `screens/HomeScreen.tsx` - Add gesture handlers
- `amethyst.theme.css` - Add spinner styles

**Implementation**:
1. Add touch event handlers (touchstart, touchmove, touchend)
2. Detect pull gesture when at top of scroll
3. Show circular spinner with rotation based on pull distance
4. Trigger refresh at 80px threshold
5. Add loading indicator during refresh
6. Spring animation on release

**Time Estimate**: 20-30 minutes

---

### Phase 3: NIP-05 Verification Badges
**Files to Modify**:
- `components/MaterialCard.tsx` - Add badges
- `amethyst.theme.css` - Badge styles

**Implementation**:
1. Add verification badge overlay on avatars
2. Show NIP-05 handle with checkmark icon
3. Different styling for verified vs unverified
4. Ensure proper positioning and z-index

**Time Estimate**: 15-20 minutes

---

### Phase 4: Enhanced Top App Bar
**Files to Modify**:
- `screens/HomeScreen.tsx` - Update app bar

**Implementation**:
1. Add notification bell with badge showing count
2. Improve search icon positioning
3. Better centering of logo/title
4. Add proper Material Design shadow
5. Sticky positioning

**Time Estimate**: 15-20 minutes

---

### Phase 5: Communities & Live Features
**Files to Modify**:
- `components/MaterialCard.tsx` - Add badges

**Implementation**:
1. Add community tag display ("Posted in [community]")
2. Add live streaming badge with gradient
3. Show timestamp with live indicator
4. Support community field in post data

**Time Estimate**: 20-25 minutes

---

### Phase 6: Bottom Navigation Refinement
**Files to Modify**:
- `components/BottomNav.tsx` - Update styling

**Implementation**:
1. Labels always visible
2. Active indicator line at top
3. Secondary container background on active
4. Better badge positioning
5. Safe area inset support
6. Spring animations

**Time Estimate**: 20-25 minutes

---

### Phase 7: Action Button Improvements
**Files to Modify**:
- `components/MaterialCard.tsx` - Update buttons

**Implementation**:
1. Better touch targets
2. Hover background colors
3. Improved spacing
4. Better icon sizing

**Time Estimate**: 15-20 minutes

---

## Total Time Estimate

**Phase 1**: 30-45 min  
**Phase 2**: 20-30 min  
**Phase 3**: 15-20 min  
**Phase 4**: 15-20 min  
**Phase 5**: 20-25 min  
**Phase 6**: 20-25 min  
**Phase 7**: 15-20 min  

**Total**: ~2.5 - 3 hours

---

## Files to be Modified

1. `/src/simulators/amethyst/screens/HomeScreen.tsx`
2. `/src/simulators/amethyst/components/MaterialCard.tsx`
3. `/src/simulators/amethyst/components/BottomNav.tsx`
4. `/src/simulators/amethyst/amethyst.theme.css`

---

## Expected Outcome

After implementation, the Amethyst simulator will:
- ✅ Match real app screenshots from nostrapps.com
- ✅ Include Stories/Highlights row
- ✅ Support pull-to-refresh gesture
- ✅ Show NIP-05 verification badges
- ✅ Display community tags
- ✅ Indicate live streaming
- ✅ Follow Material Design 3 guidelines
- ✅ Have polished UI matching real Android app

---

## Decision Gate: ✅ APPROVED

**Date**: 2026-02-13  
**Decision**: Proceed with all 7 phases as specified  
**Status**: Implementation in progress

---

## Implementation Log

### Phase 1: Stories/Highlights (IN PROGRESS)
**Started**: 2026-02-13
**Files**: HomeScreen.tsx, amethyst.theme.css

### Phase 2: Pull-to-Refresh (PENDING)

### Phase 3: NIP-05 Badges (PENDING)

### Phase 4: Top App Bar (PENDING)

### Phase 5: Communities & Live (PENDING)

### Phase 6: Bottom Navigation (PENDING)

### Phase 7: Action Buttons (PENDING)

---

**Next Update**: After Phase 1 completion
