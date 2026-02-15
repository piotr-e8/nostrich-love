# Phase 4 Integration Testing Checklist

**Date:** 2026-02-14  
**Phase:** 4 Complete - Ready for Testing  
**Scope:** Full navigation flow testing

---

## Pre-Test Setup

- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Refresh page
- [ ] Verify fresh start state

---

## Test Suite 1: Fresh User Flow

### 1.1 Guide Page Load
- [ ] Visit `/guides`
- [ ] Verify Beginner section unlocked
- [ ] Verify Intermediate/Advanced locked
- [ ] Check locked cards show "Complete X guides to unlock"

### 1.2 First Guide Navigation
- [ ] Click first Beginner guide (what-is-nostr)
- [ ] Verify GuideNavigation shows:
  - [ ] "Start of Beginner Level" on left
  - [ ] Next guide button on right
- [ ] Scroll to 80% to complete guide
- [ ] Check localStorage shows 1 completed guide

### 1.3 Resume Functionality
- [ ] Go back to `/guides`
- [ ] Verify ContinueReadingCard shows
- [ ] Click "Resume" button
- [ ] Returns to correct guide

---

## Test Suite 2: Level Completion Flow

### 2.1 Complete 4 Beginner Guides
- [ ] Complete what-is-nostr
- [ ] Complete keys-and-security
- [ ] Complete quickstart
- [ ] Complete finding-community
- [ ] Check localStorage: 4 guides in beginner completedByLevel

### 2.2 Unlock Intermediate
- [ ] Complete 5th Beginner guide
- [ ] Check console for "Unlocking intermediate!"
- [ ] Go to `/guides`
- [ ] Verify Intermediate section now unlocked
- [ ] Verify can click Intermediate guides

### 2.3 Level Boundary Navigation
- [ ] Complete last Beginner guide
- [ ] GuideNavigation should show:
  - [ ] "Beginner Complete!" message
  - [ ] "Continue to Intermediate" button
- [ ] Click "Continue to Intermediate"
- [ ] Navigate to first Intermediate guide

---

## Test Suite 3: Progress Page

### 3.1 Overall Stats
- [ ] Visit `/progress`
- [ ] Verify 3 sections: Beginner, Intermediate, Advanced
- [ ] Check progress bars show correct completion
- [ ] Verify locked levels have lock icons

### 3.2 Level Details
- [ ] Click Beginner section
- [ ] Verify all 6 guides listed
- [ ] Completed guides have checkmarks
- [ ] Incomplete guides clickable

---

## Test Suite 4: Edge Cases

### 4.1 Guide Not in Level
- [ ] Manually visit guide URL
- [ ] Verify "not part of your current level" message
- [ ] "Back to All Guides" button works

### 4.2 All Levels Complete
- [ ] Complete ALL guides (simulated or real)
- [ ] Visit last guide
- [ ] Verify "Advanced Complete!" message
- [ ] No "Continue" button (no next level)

### 4.3 Refresh Persistence
- [ ] Complete a guide
- [ ] Refresh page
- [ ] Verify progress persisted
- [ ] GuideNavigation still works

---

## Console Checks

During all tests, verify console has:
- [ ] No "require is not defined" errors
- [ ] No infinite migration loops
- [ ] No "activePath" or "pathProgress" warnings
- [ ] Clean completion logs

---

## Mobile Testing

- [ ] Test on mobile viewport
- [ ] GuideNavigation buttons accessible
- [ ] Progress page scrollable
- [ ] Touch interactions work

---

## Sign-Off

**Tested by:** _______________  
**Date:** _______________  
**Status:** ⬜ PASS / ⬜ FAIL  
**Notes:** _______________

---

**If all tests pass:** Phase 4 is COMPLETE! 🎉

**If issues found:** Document in Phase 10 bug list

**Next:** Phase 5 - Home Page Redesign
