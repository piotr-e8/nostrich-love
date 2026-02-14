# Phase 4: Navigation Migration Plan

**Date:** 2026-02-14  
**Phase:** 4 of 10  
**Scope:** Update 94 references across 8 navigation files  
**Estimated Duration:** 3-4 days  

---

## 📁 Files to Update (8 Total)

### 1. `src/components/navigation/GuideNavigation.tsx`
**Complexity:** High  
**Lines:** ~200 lines  
**References:** 3 direct  

**Current State:**
- Uses `getActivePath()` - returns old path ID
- Navigation logic based on `LEARNING_PATHS`
- Gets guide position in path

**Changes Needed:**
- [ ] Import `getCurrentLevel()` instead of `getActivePath()`
- [ ] Replace `activePath` with `currentLevel`  
- [ ] Use `SKILL_LEVELS` instead of `LEARNING_PATHS`
- [ ] Update `getGuidePositionInPath()` → `getGuidePositionInLevel()`
- [ ] Handle level boundaries (end of Beginner → Intermediate)
- [ ] Test next/prev navigation within level

**Risk:** HIGH - Core navigation component, affects all guide pages

---

### 2. `src/components/navigation/ResumeBanner.tsx`
**Complexity:** Medium  
**Lines:** ~100 lines  
**References:** 3 direct  

**Current State:**
- Displays "Continue your X journey" with path name
- Shows progress percentage for current path
- "Resume" button links to next guide in path

**Changes Needed:**
- [ ] Replace path-based text with level-based
- [ ] Show "Continue your Beginner journey" instead of "Bitcoiner journey"
- [ ] Update progress calculation to use `completedByLevel`
- [ ] Change "X% of Y path" → "X/Y Beginner guides"
- [ ] Link to next incomplete guide in current level

**Risk:** MEDIUM - UI text changes, affects user understanding

---

### 3. `src/components/navigation/ContinueLearning.tsx`
**Complexity:** Medium  
**Lines:** ~150 lines  
**References:** 1 direct  

**Current State:**
- Shows completion card when path is done
- "Start next path" button
- Handles path transitions

**Changes Needed:**
- [ ] Replace path completion logic with level completion
- [ ] "You've completed all Beginner guides!"
- [ ] "Unlock Intermediate" or "Continue to Intermediate" button
- [ ] Handle locked/unlocked state for next level

**Risk:** MEDIUM - User flow at level boundaries

---

### 4. `src/components/progress/MinimalProgress.tsx`
**Complexity:** Low  
**Lines:** ~80 lines  
**References:** 4 direct  

**Current State:**
- Thin progress bar at top of guide pages
- Shows reading progress + path progress
- Uses `activePath` to determine context

**Changes Needed:**
- [ ] Remove path-based progress display
- [ ] Keep reading progress (scroll-based)
- [ ] Optionally show level progress
- [ ] Simplify - just reading progress indicator

**Risk:** LOW - Mostly UI simplification

---

### 5. `src/pages/progress.astro`
**Complexity:** Medium  
**Lines:** ~300 lines  
**References:** 3 direct  

**Current State:**
- Progress dashboard page
- Shows overall stats
- Per-path progress bars (beginner/bitcoiner/privacy)

**Changes Needed:**
- [ ] Replace 3 path sections with 3 level sections
- [ ] Add Beginner, Intermediate, Advanced progress bars
- [ ] Show locked/unlocked status per level
- [ ] Display `completedByLevel` data
- [ ] Add unlock requirements/thresholds

**Risk:** MEDIUM - Complete page redesign

---

### 6. `src/layouts/Layout.astro`
**Complexity:** Low  
**Lines:** ~230 lines (script section)  
**References:** 2 direct  

**Current State:**
- Already updated! Has new skill level fields
- No old path references remaining
- Initialization uses `currentLevel`, `unlockedLevels`

**Changes Needed:**
- [ ] ✅ Already done in earlier fix
- [ ] Remove any remaining path-related code
- [ ] Test that layout loads without errors

**Risk:** LOW - Already updated

---

### 7. `src/components/navigation/ContinueReadingCard.tsx`
**Complexity:** Low  
**Lines:** ~100 lines  
**References:** 1 indirect  

**Current State:**
- Shows "Continue reading" card on guides page
- Uses `lastViewedGuide` from localStorage
- May reference old path structure

**Changes Needed:**
- [ ] Check if it uses path/level fields
- [ ] Update to use new data structure
- [ ] Test resume functionality

**Risk:** LOW - Simple component

---

### 8. `src/lib/progress.ts` (Cleanup)
**Complexity:** Medium  
**Lines:** ~400 lines  
**References:** 30+  

**Current State:**
- Wrapper around gamification.ts
- Has deprecated functions marked with @deprecated
- Some old path references

**Changes Needed:**
- [ ] Verify all functions work with new system
- [ ] Remove truly unused deprecated functions
- [ ] Update types to use `SkillLevel` not `LearningPathId`
- [ ] Test all exports

**Risk:** MEDIUM - Core utility file

---

## 🎯 Implementation Order

**Recommended Sequence:**

### Day 1: Low Risk Components
1. **MinimalProgress.tsx** - Simple, isolated
2. **ContinueReadingCard.tsx** - Simple resume logic
3. **Layout.astro** - Verify already done

### Day 2: Medium Risk Components  
4. **ResumeBanner.tsx** - Text updates
5. **ContinueLearning.tsx** - Level completion flow
6. **progress.astro** - Page redesign

### Day 3: High Risk Components
7. **GuideNavigation.tsx** - Core navigation (save for when confident)
8. **progress.ts cleanup** - Final verification

### Day 4: Integration & Testing
- Full navigation flow test
- Level boundary testing (Beginner → Intermediate)
- Edge cases (all guides complete)

---

## 🧪 Testing Strategy

### Per Component:
1. Update code
2. Check TypeScript compilation
3. Manual test in browser
4. Verify console has no errors
5. Test user flow

### Integration Tests:
- Start fresh user
- Complete Beginner guides
- Verify Intermediate unlocks
- Navigate through levels
- Check progress page
- Resume functionality

### Edge Cases:
- User with old data (migration)
- User with partial progress
- All guides complete
- Manual unlock enabled

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| GuideNavigation breaks | HIGH | Test thoroughly, have rollback ready |
| Progress data mismatch | MEDIUM | Verify data structure compatibility |
| User confusion (UI text) | LOW | Clear messaging, test with users |
| Performance issues | LOW | Code review, profile if needed |

---

## 📝 Dependencies

**Must Complete First:**
- ✅ Phase 1-3 (data layer working)
- ✅ Bug fixes from today

**Can Parallelize:**
- Components 1-4 (days 1-2) are independent
- Save GuideNavigation for last

**Blocks:**
- Phase 5-9 depend on navigation working

---

## 🎸 Riff's Notes

**Key Insights:**
- GuideNavigation is the heart - get it right
- Test level transitions carefully (Beginner → Intermediate)
- Keep UI text clear - "path" → "level" everywhere
- Don't rush - better to get it right than fast

**Lessons Applied:**
- ✅ Test after every component
- ✅ Check console for errors
- ✅ Verify data persists
- ✅ Document changes

---

**Ready to Start?** Pick your first component! 🚀
