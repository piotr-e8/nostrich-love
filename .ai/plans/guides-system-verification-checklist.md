# Guides System Fix - Verification Checklist

**Created:** 2026-02-14  
**Purpose:** Step-by-step verification at each checkpoint

---

## Verification Philosophy

**Don't trust:**
- ❌ Agent "✅ Done" summaries
- ❌ Build passing
- ❌ No TypeScript errors

**Do verify:**
- ✅ Read actual changed files
- ✅ Check logic matches requirements
- ✅ Verify integration points
- ✅ Test edge cases

---

## Per-File Verification

After agent completes each file:

### 1. Automated Checks (1 minute)
- [ ] File exists and is readable
- [ ] TypeScript LSP shows no errors
- [ ] All imports resolve
- [ ] All exports present
- [ ] No syntax errors

### 2. Manual Review (5 minutes)
- [ ] Read the entire file
- [ ] Logic matches requirements
- [ ] Error handling present (try/catch)
- [ ] Edge cases handled
- [ ] Follows codebase patterns

### 3. Integration Check (2 minutes)
- [ ] Functions exported correctly
- [ ] API matches contract (from context)
- [ ] No breaking changes to existing code
- [ ] Props/arguments correct

### 4. Documentation
- [ ] Add comment: `// Verified: [timestamp]`
- [ ] Note any issues found
- [ ] If issues: send back to agent
- [ ] If good: 👍 and proceed

---

## Per-Phase Verification

After all files in a phase complete:

### Phase 1: Foundation
**Files:** progressService.ts, progress.ts, gamification.ts

**Integration Tests:**
```typescript
// Test 1: Fresh user gets tracking enabled
const settings = loadPrivacySettings();
assert(settings.trackingEnabled === true);

// Test 2: Legacy migration works
localStorage.setItem('nostrich-user-path', 'bitcoiner');
migrateLegacyData();
const data = loadGamificationData();
assert(data.progress.activePath === 'bitcoiner');

// Test 3: Badge functions exported
assert(typeof checkAndAwardGuideBadges === 'function');
assert(typeof markGuideCompleted === 'function');
assert(typeof getActivePath === 'function');
```

**Manual Checks:**
- [ ] progressService.ts: `trackingEnabled: true`
- [ ] progress.ts: Migration logic present
- [ ] gamification.ts: Badge check functions added
- [ ] All functions exported
- [ ] Error handling in all localStorage operations

### Phase 2: Navigation
**Files:** GuideNavigation.tsx, ContinueLearning.tsx, EnhancedGuideCompletionIndicator.tsx

**Integration Tests:**
```typescript
// Test 1: Uses getActivePath()
const navigation = render(<GuideNavigation guideTitles={titles} />);
expect(navigation).toUseHook('getActivePath');

// Test 2: Path-aware calculation
// Select beginner path, visit 'what-is-nostr'
// Next should be 'keys-and-security'

// Test 3: Last guide shows completion
// Visit last guide in path
// Should not show next button
```

**Manual Checks:**
- [ ] GuideNavigation.tsx: Client-only calculation
- [ ] ContinueLearning.tsx: Path-based next guide
- [ ] EnhancedGuideCompletionIndicator.tsx: Uses gamification.ts
- [ ] All handle loading states
- [ ] All handle off-path cases
- [ ] All handle last guide case

### Phase 3: Guide Cards
**File:** guides/index.astro

**Integration Tests:**
```typescript
// Test 1: Green dots show completed guides
// Complete a guide → visit /guides
// Green dot should appear

// Test 2: Per-path progress
// Beginner path shows X/Y completed
// Bitcoiner path shows different count
```

**Manual Checks:**
- [ ] Uses setActivePath() from progress.ts
- [ ] No longer uses 'nostrich-user-path' key
- [ ] Green dots work with unified data
- [ ] Per-path progress displayed

### Phase 4: Badges
**File:** gamification.ts additions

**Integration Tests:**
```typescript
// Test 1: Complete 3 guides
const data = loadGamificationData();
data.progress.completedGuides = ['g1', 'g2', 'g3'];
saveGamificationData(data);
checkAndAwardGuideBadges();
assert(data.badges['knowledge-seeker'].earned === true);

// Test 2: Complete all beginner guides
// Should award 'nostr-graduate'
```

**Manual Checks:**
- [ ] checkAndAwardGuideBadges() function added
- [ ] Called from markGuideCompleted()
- [ ] Awards correct badges
- [ ] No duplicate awards

### Phase 5: Full Integration
**All files working together**

**End-to-End Tests:**
1. **Fresh User Flow:**
   - Visit /guides
   - Select beginner path
   - Navigate to first guide
   - ✅ Navigation shows "Next: Keys & Security"
   - ✅ No "Previous" button

2. **Progress Tracking:**
   - Scroll through guide
   - ✅ Guide marked complete
   - ✅ Green dot appears on /guides
   - ✅ Progress bar updates

3. **Badge Awarding:**
   - Complete 3 guides
   - ✅ 'knowledge-seeker' badge awarded
   - ✅ Badge modal shows
   - ✅ No duplicate awards

4. **Last Guide:**
   - Navigate to last guide in path
   - ✅ "🎉 Path Complete!" shows
   - ✅ No next button
   - ✅ Previous button works

5. **Off-Path:**
   - On beginner path, visit relay-guide
   - ✅ "Back to Guides" message
   - ✅ "Switch to Bitcoiner Path" option

6. **Streak Banner:**
   - Visit guide
   - ✅ Streak banner appears
   - ✅ Days count correct

---

## Error Handling Verification

For every localStorage operation:

```typescript
// MUST have try/catch
[ ] try/catch around all localStorage.getItem()
[ ] try/catch around all localStorage.setItem()
[ ] try/catch around all JSON.parse()
[ ] try/catch around all JSON.stringify()
[ ] Graceful fallback values
[ ] Error logging to console
[ ] App doesn't crash on error
```

---

## Browser Testing Checklist

Manual testing in browser:

### Setup
- [ ] Clear localStorage
- [ ] Refresh page
- [ ] Verify fresh state

### Test Scenarios
- [ ] Select path → path indicator shows
- [ ] Navigate guide → correct next/previous
- [ ] Complete guide → green dot appears
- [ ] Complete 3 guides → badge awarded
- [ ] Last guide → celebration message
- [ ] Off-path → helpful message
- [ ] Streak banner → appears
- [ ] Switch paths → progress updates

### Edge Cases
- [ ] Invalid path in URL
- [ ] Guide not in any path
- [ ] localStorage cleared mid-session
- [ ] Browser back button
- [ ] Refresh on guide page

---

## Build Verification

Before declaring phase complete:

```bash
# 1. TypeScript check
npm run typecheck
[ ] No TypeScript errors

# 2. Build check
npm run build
[ ] Build succeeds
[ ] No build warnings related to guides

# 3. Lint check (if available)
npm run lint
[ ] No linting errors
```

---

## Sign-Off Checklist

Before proceeding to next phase:

- [ ] All files in phase verified
- [ ] All integration tests pass
- [ ] Build succeeds
- [ ] Manual browser testing complete
- [ ] Edge cases handled
- [ ] Error handling present
- [ ] Documentation updated
- [ ] User approval

**Phase Complete?** Get user confirmation before proceeding.

---

## Time Estimates

| Activity | Time |
|----------|------|
| Per-file verification | 8 minutes |
| Per-phase integration | 15 minutes |
| Browser testing | 20 minutes |
| Build verification | 5 minutes |
| Documentation | 5 minutes |
| **Total per phase** | **~1 hour** |

---

## Tools

**For verification:**
- VS Code LSP (TypeScript errors)
- Browser DevTools (localStorage inspection)
- Console logs (error tracking)
- Build output (warnings/errors)

**Commands:**
```bash
# Check localStorage
devtools → Application → Local Storage → nostrich-gamification-v1

# Watch console for errors
devtools → Console → filter by "[Guides]"

# Test quickly
clear localStorage → refresh → complete guides → verify state
```

---

## Questions?

If unsure about any verification step, ask before proceeding.
