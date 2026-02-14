# Changelog

All notable changes, bug fixes, and improvements to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Fixed

#### Guide Progress Tracking (2026-02-14)

- **Fixed**: Guide progress was not persisting - localStorage key `nostrich-gamification-v1:progress` was being deleted when visiting a guide and scrolling
- **Root Cause**: Two systems (`progressService.ts` and `gamification.ts`) were writing incompatible data formats to the same localStorage key, causing data corruption on every scroll event
- **Solution**: Updated `saveProgressData()` to merge updates into the existing gamification format instead of overwriting the entire object
- **Files Changed**: `src/lib/progressService.ts` (lines 130-174)

#### Badge Awarding System (2026-02-14)

- **Fixed**: Badges were not being awarded when users completed actions
- **Root Cause**: Gamification trigger functions existed in `utils/gamification.ts` but were never imported or called from components
- **Solution**: Added imports and function calls to award badges when users perform qualifying actions:
  - **KeyGenerator.tsx**: Added `recordKeysGenerated()` when keys are generated (key-master badge) and `recordKeysBackedUp()` when keys are downloaded (security-conscious badge)
  - **RelayExplorer.tsx**: Added `updateConnectedRelays()` when relays are selected (relay-explorer badge)
  - **FollowPackFinder.tsx**: Added `updateFollowedAccounts()` when accounts are selected (community-builder badge)
- **Files Changed**:
  - `src/components/interactive/KeyGenerator.tsx` (imports + 2 calls)
  - `src/components/interactive/RelayExplorer.tsx` (imports + 1 call)
  - `src/components/follow-pack/FollowPackFinder.tsx` (imports + effect)

**Note**: `first-post` and `zap-receiver` badges require actual Nostr client interaction which is not part of this web guide. These badges cannot be earned through the website itself.

#### Progress Page Non-Functional (2026-02-14)

- **Fixed**: Progress page (`/progress`) was not displaying user progress correctly - showing 0 guides completed and empty activity feed
- **Root Cause**: Progress page was reading from deprecated localStorage key `nostrich-progress-v1` instead of the unified `nostrich-gamification-v1` key. Additionally, the page expected the old data format with per-guide status objects, but the app now uses arrays for completed guides.
- **Solution**: 
  - Updated `STORAGE_KEY` to use `nostrich-gamification-v1`
  - Refactored `getProgressData()` to read from the unified gamification format
  - Added `completedGuidesWithTimestamps` field to track when guides were completed (for activity feed)
  - Updated `calculateProgress()`, `updateSummaryCards()`, `updateRecentActivity()`, and `updateNextSteps()` functions to work with the new data structure
  - Modified `markGuideCompleted()` in `src/lib/progress.ts` to record timestamps when guides are completed
  - Updated default data initialization to include `completedGuidesWithTimestamps` array
- **Files Changed**:
  - `src/pages/progress.astro` - Complete refactor of data reading logic
  - `src/lib/progress.ts` - Added timestamp tracking to guide completion
  - `src/utils/gamification.ts` - Added `completedGuidesWithTimestamps` field to interface and default data

**Technical Details**:
- Old format: `{ guides: { [id]: { status: 'completed', completedAt: '...' } } }`
- New format: `{ progress: { completedGuides: ['id1', 'id2'], completedGuidesWithTimestamps: [{ id: 'id1', completedAt: '...' }] } }`
- Timestamps now recorded in ISO format and displayed in "X minutes/hours/days ago" format on the activity feed

## [Previous Releases]

- Initial project setup and documentation

---

## How to Read This Changelog

### Sections
- **Added** - New features or capabilities
- **Changed** - Changes to existing functionality
- **Deprecated** - Features being phased out
- **Removed** - Deleted features
- **Fixed** - Bug fixes
- **Security** - Security improvements

### Format
Each entry includes:
- **Title** - Brief description
- **Fixed/Changed** - What was done
- **Root Cause** - Why it happened (for bugs)
- **Solution** - How it was resolved
- **Files Changed** - Where to find the changes

---

**Last Updated**: 2026-02-14

---

### Summary of Recent Changes

**Progress & Gamification System Fixes** (2026-02-14):
1. ✅ Fixed guide progress persistence issue (localStorage data corruption)
2. ✅ Fixed badge awarding (functions not being called from components)
3. ✅ Fixed progress page functionality (wrong localStorage key and data format)
4. ✅ Added timestamp tracking for guide completions (activity feed)
5. ✅ Added compact "Continue Reading" card to /guides page
6. ✅ Added full resume banner to landing page

All progress tracking, badge awarding, and gamification features are now fully functional and consistent across the application.

#### Progress Page UI & Logic Fixes (2026-02-14)

- **Fixed**: Next Steps section had white/transparent background in dark mode
  - **Root Cause**: `friendly-purple-900` and `friendly-gold-900` color shades didn't exist in Tailwind config (only went up to 700 and 600), causing Tailwind to fall back to white/transparent
  - **Solution**: 
    - Added missing color shades to `tailwind.config.js`:
      - `friendly-purple`: 800 (#5C3D99), 900 (#3D2673)
      - `friendly-gold`: 700 (#B45309), 800 (#92400E), 900 (#78350F)
    - Updated gradient classes from `dark:from-friendly-purple-900/30` to `dark:from-friendly-purple-900` (removed opacity)
  - **Files**: 
    - `tailwind.config.js` - Added missing color definitions
    - `src/pages/progress.astro` - Updated gradient classes

- **Fixed**: Next step logic was showing incorrect guide
  - **Root Cause**: Used `Object.keys(guideMetadata)` which doesn't guarantee order, showing a random incomplete guide
  - **Solution**: 
    - Added `learningPaths` object with sequences for beginner, bitcoiner, and privacy paths
    - Added `getActivePath()` function to read user's selected learning path
    - Modified next step logic to find the first incomplete guide in the user's active path sequence
    - Now shows context-appropriate message like "Continue your Bitcoiner path journey with this intermediate guide"
  - **File**: `src/pages/progress.astro` (lines 228-250, 406-424)

#### Streak Banner Not Displaying (2026-02-14)

- **Fixed**: Streak banner was not appearing even when users had activity
- **Root Cause**: The `recordActivity()` function existed in `gamification.ts` but was never called from any components, so `streakDays` remained 0
- **Solution**: Added `recordActivity()` calls to key user interactions:
  - `ProgressTracker.tsx` - Called when user views a guide
  - `KeyGenerator.tsx` - Called when keys are generated
  - `RelayExplorer.tsx` - Called when relays are selected
  - `FollowPackFinder.tsx` - Called when accounts are selected
- **Files Changed**:
  - `src/components/progress/ProgressTracker.tsx`
  - `src/components/interactive/KeyGenerator.tsx`
  - `src/components/interactive/RelayExplorer.tsx`
  - `src/components/follow-pack/FollowPackFinder.tsx`

**Note**: Streak logic: First activity = 1, consecutive days = increment, skip a day = reset to 1

---

### Summary of Recent Changes

**February 2026 - Major Bug Fixes & Improvements:**

**Progress & Gamification System:**
1. ✅ Fixed guide progress persistence (localStorage data corruption)
2. ✅ Fixed badge awarding (functions not being called from components)  
3. ✅ Fixed progress page functionality (wrong localStorage key and data format)
4. ✅ Fixed streak banner not displaying (recordActivity never called)
5. ✅ Added timestamp tracking for guide completions (activity feed)

**UI/UX Improvements:**
6. ✅ Added compact "Continue Reading" card to /guides page
7. ✅ Added full resume banner to landing page
8. ✅ Fixed progress page Next Steps background in dark mode
9. ✅ Fixed Next Steps logic to use correct learning path
10. ✅ Added missing Tailwind color shades (friendly-purple-800/900, friendly-gold-700/800/900)

**All progress tracking, badge awarding, streak tracking, and gamification features are now fully functional and consistent across the application.**

#### Configurable Gamification System (2026-02-14)

- **Added**: New centralized configuration system for badges and streak tracking
- **Problem**: Previously, changing what activities triggered badges required modifying multiple component files
- **Solution**: Created `src/config/gamification.ts` - a single config file that controls all gamification behavior

**New Features:**
1. **Centralized Config** (`src/config/gamification.ts`):
   - Define all badges in one place (name, icon, description, rarity)
   - Define all activities and their rewards
   - Three trigger types: `boolean` (one-time), `count` (cumulative), `threshold` (state-based)
   - Toggle streak tracking per activity

2. **Simplified API** (`src/utils/gamificationEngine.ts`):
   - Single function: `recordActivity(activityId, metadata?)`
   - No more separate functions for each activity
   - Automatic badge checking and awarding
   - Automatic streak tracking

3. **Easy Customization**:
   ```typescript
   // Change threshold for badge
   { badgeId: 'knowledge-seeker', trigger: { type: 'count', threshold: 5 } } // Changed from 3
   
   // Toggle streak tracking
   triggers: { streak: false, badges: [...] }
   
   // Add new activity
   myActivity: {
     id: 'my-activity',
     triggers: {
       streak: true,
       badges: [{ badgeId: 'my-badge', trigger: { type: 'boolean' } }]
     }
   }
   ```

**Files Created:**
- `src/config/gamification.ts` - Configuration file
- `src/utils/gamificationEngine.ts` - New simplified engine
- `docs/GAMIFICATION_CONFIG.md` - Documentation

**Files Modified:**
- `src/components/progress/ProgressTracker.tsx` - Uses `recordActivity('viewGuide')` and `recordActivity('completeGuide')`
- `src/components/interactive/KeyGenerator.tsx` - Uses `recordActivity('generateKeys')` and `recordActivity('backupKeys')`
- `src/components/interactive/RelayExplorer.tsx` - Uses `recordActivity('selectRelays', { count })`
- `src/components/follow-pack/FollowPackFinder.tsx` - Uses `recordActivity('followAccounts', { count })`
- `src/components/gamification/StreakBannerWrapper.tsx` - Uses new `getStreakInfo()` function

**Migration:**
- Old functions (`recordKeysGenerated`, `updateConnectedRelays`, etc.) replaced with `recordActivity()`
- All existing data preserved (same localStorage key)
- Backward compatible with existing progress

