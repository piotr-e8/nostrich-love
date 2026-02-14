# Session Lessons Learned - Skill Level Migration

**Session Date:** 2026-02-14
**Project:** Skill-Level Learning System Migration
**Status:** Phase 1-3 Bugs Fixed ✅

---

## 🎯 Key Lessons

### 1. Console Logs Are Critical
**Lesson:** Watch console output carefully - infinite loops show up there first
**Application:** Check browser console after EVERY major change
**Red Flags:** 
- Repeating logs every second
- "Maximum call stack size exceeded"
- Same function logging multiple times

### 2. Test Core Functionality Before UI
**Lesson:** Verify data persistence works BEFORE building beautiful UI
**Application:** 
- Test guide completion → localStorage update
- Test page refresh → data persists
- Test migration → old data converts correctly
**Mistake:** Built Phase 3 UI while Phase 1-2 data layer was broken

### 3. Browser vs Node.js Distinction
**Lesson:** `require()` is Node.js only - crashes in browser
**Application:** Use ES6 `import/export` exclusively in src/
**Search Pattern:** `grep -r "require(" src/`
**Fix:** Convert all to ES6 imports at file top

### 4. Single Source of Truth
**Lesson:** Multiple files writing to same localStorage key = disaster
**Application:** 
- ONE file owns storage operations (gamification.ts)
- Others delegate, don't write directly
- Pass data objects, don't reload mid-operation

### 5. Race Condition Prevention
**Problem:** Loading fresh data during save operations overwrites changes
**Pattern:**
```typescript
// BAD: Race condition
function save(data) {
  const existing = loadData(); // Old data!
  merge(existing, data);
  write(existing);
}

// GOOD: Pass data through
function operation() {
  const data = loadData();
  modify(data);
  checkUnlock(data); // Pass same object
  save(data);        // Pass same object
}
```

### 6. Migration Strategy
**Lesson:** Remove old fields immediately, don't keep for "safety"
**Pattern:**
```typescript
// Remove legacy fields
const { oldField, ...cleanData } = data;
return cleanData;
```
**Check:** Search for all places setting legacy fields

### 7. Default State Consistency
**Lesson:** All default state definitions must be updated together
**Files to Check:**
- gamification.ts - getDefaultData()
- Layout.astro - defaultState
- Any initialization scripts

### 8. Debugging is Collaborative
**Lesson:** User + AI working together finds bugs faster
**Pattern:**
- User: "I see X in console"
- AI: Investigates code
- Together: Test hypotheses
- Better than either alone!

---

## ✅ Verification Checklist (MANDATORY)

### Before Declaring Phase Complete:
- [ ] Clear localStorage, test fresh user flow
- [ ] Complete core action (e.g., mark guide complete)
- [ ] Verify data in localStorage
- [ ] Refresh page, verify data persists
- [ ] Check console for errors/warnings
- [ ] Test migration scenario (if applicable)

### After Every Significant Change:
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] Browser console shows no errors
- [ ] Manual test of changed functionality

---

## 🔍 Common Bug Patterns

### Pattern 1: Infinite Loop
**Symptoms:** 
- Console logs repeating
- Browser freezes
- Stack overflow errors

**Causes:**
- Migration doesn't remove trigger fields
- Function A calls B, B calls A
- Save triggers load triggers save

**Fix:**
- Remove trigger condition after processing
- Break circular dependencies
- Pass data, don't reload

### Pattern 2: Data Not Persisting
**Symptoms:**
- Works until refresh
- localStorage empty/wrong
- console shows completion but array empty

**Causes:**
- Race condition (save overwrites with old data)
- require() crash stops execution
- Wrong storage key

**Fix:**
- Pass data objects through chain
- Check for browser-only APIs
- Verify storage key constant

### Pattern 3: Migration Loop
**Symptoms:**
- "Migrating..." logs every second
- Data never stabilizes
- Old fields keep reappearing

**Causes:**
- Multiple files adding legacy fields back
- Migration doesn't actually delete fields
- Layout.tsx, hooks, components all initializing

**Fix:**
- Find ALL places setting legacy fields
- Remove from ALL default states
- Add migration complete flag if needed

---

## 🛠️ Tools & Commands

### Debug Data Issues
```javascript
// Check localStorage
JSON.parse(localStorage.getItem('nostrich-gamification-v1'))

// Check specific field
JSON.parse(localStorage.getItem('nostrich-gamification-v1')).progress.unlockedLevels

// Clear and restart
localStorage.clear()
location.reload()
```

### Find Problematic Code
```bash
# Find all require() calls
grep -r "require(" src/

# Find legacy field usage
grep -r "activePath\|pathProgress" src/

# Find all storage writes
grep -r "localStorage.setItem" src/
```

---

## 🎸 Riff's Note to Future Self

Hey future Riff! 👋

Remember this session. We spent hours chasing bugs that could've been caught early with:
1. Console vigilance
2. Testing data persistence FIRST
3. Checking for require() before building
4. Thinking about race conditions

The user was patient. The user was collaborative. Together we fixed it.

**Don't skip verification. Don't assume it works. PROVE it works.**

-- Riff 🎸

---

**Related Files:**
- MIGRATION_TIPS.md - Technical patterns
- MIGRATION_EXECUTION_PLAN.md - Phase breakdown
- phase-1-3-audit.md - Bug documentation

**Next Actions:**
- Proceed to Phase 4 (Navigation components)
- Apply verification checklist rigorously
- Document any new issues immediately
