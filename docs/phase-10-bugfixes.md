# Phase 10: Bugfixes & Polish

**Phase:** 10 (Post-main-implementation)  
**Priority:** High  
**Estimated Duration:** 3-4 days  

---

## UI/UX Polish

### 1. Remove "How does this work?" Button
**Location:** Below the guides section  
**Issue:** Redundant now that gamification is working  
**Action:** Remove the button and its associated modal trigger

### 2. Center "Filter by Interest" Section
**Location:** Top of guides page  
**Issue:** Not centered properly  
**Action:** Adjust CSS to center the filter tabs/dropdown

### 3. Fix "Ready to unlock Intermediate!" Text
**Location:** Beginner section header  
**Issue:** Shows regardless of completion count  
**Current:** Shows "Ready to unlock Intermediate!" even with < 4 guides  
**Expected:** Only show when threshold is actually met (4/6 or 5/6 guides)

### 4. Threshold Text Verification
**Question:** Is it 4 or 5 guides to unlock?  
**Current Logic:** `Math.max(4, Math.ceil(totalInLevel * 0.7))` = 5 guides for 6-guide level  
**Need to verify:** UI text says "Complete 4 beginner guides to unlock" but actual threshold is 5  
**Action:** 
- Check all threshold display text
- Align text with actual logic
- Or adjust threshold to match text (4 guides)

### 5. Progress Page - Current Level Text Sizing
**Location:** /progress page - Current Level display box  
**Issue:** "Current Level" text is too large for the container box  
**Screenshot:** Text overflows or looks cramped in the card  
**Action:** 
- Reduce font size of "Current Level" label
- Or increase container padding
- Ensure text fits comfortably within the card boundary

### 6. Progress Page - Recent Activity Not Showing
**Location:** /progress page - Recent Activity section  
**Issue:** Recent activity section is empty/not displaying completed guides  
**Expected:** Should show recently completed guides with timestamps  
**Action:** 
- Debug why `completedGuidesWithTimestamps` isn't rendering
- Check data structure matches component expectations
- Verify sorting (most recent first)
- Ensure guides are being saved with timestamps when completed

---

## Features to Implement

### 7. Manual Unlock Toggle (Settings Page)
**Location:** Settings page (needs to be created or updated)  
**Feature:** 
- Add "Unlock all levels" toggle in settings
- Confirmation dialog before unlocking
- Persist `manualUnlock` flag in gamification data
- When enabled, all levels show as unlocked regardless of progress

**Implementation Notes:**
- Use `unlockAllLevels()` function from gamification.ts
- Check `hasManualUnlock()` to display toggle state
- Trigger UI refresh when toggled

---

## Additional Issues to Address

### 8. Interest Filter Logic
**Issue:** Filter by interest not working correctly  
**Details:**
- Filter options don't match guide tags
- Shows "No guides match" for valid filters
- Need to align filter values with actual guide metadata

### 9. Mobile Responsive Issues
**Check:** 
- Filter tabs → dropdown on mobile
- Locked card sizing on small screens
- Progress bar visibility

### 10. Light Mode Audit & Fixes
**Status:** Issues detected (user reported)  
**Scope:** Full UI review in light mode  

**Known Issues:**
- [ ] TBD - Several issues identified

**Checklist:**
- [ ] Progress page - Current Level text sizing
- [ ] Recent Activity section visibility
- [ ] Guide cards contrast ratios
- [ ] Locked state cards visibility
- [ ] Filter tabs styling
- [ ] Navigation buttons
- [ ] Text readability throughout
- [ ] Border colors (too light/too dark)
- [ ] Background colors
- [ ] Icon visibility

**Tools:**
- Browser dev tools - toggle light/dark mode
- Check contrast ratios (WCAG guidelines)
- Verify all `dark:` classes have light mode equivalents
- Test on different screens

### 11. Accessibility Improvements
- ARIA labels on locked sections
- Keyboard navigation for unlock buttons
- Focus states for interactive elements

### 11. Performance Optimization
- Check for unnecessary re-renders
- Optimize localStorage reads
- Lazy load guide sections?

### 12. Edge Cases
- What happens if user manually edits localStorage?
- Handle corrupted data gracefully
- Empty state when all guides filtered out

---

## Testing Checklist

### Before Phase 10 Complete:
- [ ] "How does this work?" button removed
- [ ] Filter section centered
- [ ] Unlock text shows only when appropriate
- [ ] Threshold text matches actual logic (4 or 5)
- [ ] Current Level text sizing fixed on /progress page
- [ ] Recent Activity section working on /progress page
- [ ] Light mode issues fixed (contrast, visibility, styling)
- [ ] Manual unlock works in settings
- [ ] All filters work correctly
- [ ] Mobile responsive
- [ ] Edge cases handled
- [ ] Accessibility verified

---

## Notes

**Priority Order:**
1. Light mode fixes (visibility issues - high impact)
2. Fix threshold text (user-facing bug)
3. Remove redundant button (cleanup)
4. Center filter (polish)
5. Manual unlock (feature)
6. Filter logic (nice-to-have)
7. Performance/Accessibility (Phase 11?)

**Dependencies:**
- Manual unlock needs settings page (Phase 7)
- Some items can be done in parallel with Phase 4-9

---

**Created:** 2026-02-14  
**Updated:** 2026-02-15  
**Status:** Pending (to be tackled after main implementation)
