# Skill-Level Migration Project - Tips & Best Practices

## Philosophy: "Take Your Time, Do It Right"

This is Option A - Full Migration. We're not rushing. Quality over speed.

---

## Core Principles for All Agents

### 1. **Thoroughness Over Speed**
- Read files completely before modifying
- Understand context before changing
- Test assumptions with code review
- Ask questions when unclear

### 2. **Communication Guidelines**
- **If stuck**: Ask immediately, don't guess
- **If confused**: Request clarification
- **If scope unclear**: Confirm before proceeding
- **If pattern inconsistent**: Flag for discussion

### 3. **Code Quality Standards**
- Follow existing patterns (check 3+ similar implementations)
- Type safety is mandatory (no `any` without justification)
- Comment complex migration logic
- Handle edge cases explicitly

### 4. **Testing Requirements**
- Static analysis (TypeScript, lint)
- Manual code review (read your changes)
- Migration function testing (simulate old → new data)
- Edge case testing (empty data, corrupt data)

---

## Project-Specific Tips

### Data Migration Tips

**Old Structure:**
```typescript
{
  progress: {
    activePath: 'bitcoiner',  // String: beginner|bitcoiner|privacy
    pathProgress: {
      bitcoiner: { completedGuides: [...], startedAt: ..., lastActiveAt: ... }
    }
  }
}
```

**New Structure:**
```typescript
{
  progress: {
    currentLevel: 'intermediate',  // Current focus level
    unlockedLevels: ['beginner', 'intermediate'],  // Array of unlocked
    manualUnlock: false,  // User overrode locks
    completedByLevel: {
      beginner: ['what-is-nostr', 'keys-and-security'],
      intermediate: ['nip05-identity'],
      advanced: []
    }
  }
}
```

**Migration Logic:**
1. Map old `activePath` to new `currentLevel`
2. Mark all levels up to current as `unlocked`
3. Distribute completed guides into `completedByLevel` using `SKILL_LEVELS` sequence
4. Set `manualUnlock: false` (they earned it)

### Component Migration Tips

**Before touching any component:**
1. Read the entire file
2. Identify all references to:
   - `LearningPathId`
   - `activePath`
   - `pathProgress`
   - `getActivePath()`
   - `setActivePath()`
   - `LEARNING_PATHS`
   - `getGuidePositionInPath()`
3. Check how it fits into the broader UI

**Common migration patterns:**

```typescript
// OLD
const activePath = getActivePath(); // 'bitcoiner'
const position = getGuidePositionInPath(guideSlug, activePath);

// NEW  
const currentLevel = getCurrentLevel(); // 'intermediate'
const position = getGuidePositionInLevel(guideSlug, currentLevel);
```

### Guide Data Consistency Tips

**Canonical Source of Truth:**
- `learning-paths.ts` defines SKILL_LEVELS
- `guides/index.astro` should READ from SKILL_LEVELS
- Never duplicate guide data
- Add new guides to SKILL_LEVELS first

**Guide Distribution:**
- Beginner: 6 guides
- Intermediate: 6 guides  
- Advanced: 4 guides (currently only 3, need to add 1)

### Storage Safety Tips

**CRITICAL:** Multiple systems write to `nostrich-gamification-v1`

**Rule:** Always read before writing, merge updates

```typescript
// WRONG - Overwrites other systems' data
localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

// RIGHT - Merge with existing
const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
const merged = { ...existing, ...updates };
localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
```

**See:** `src/lib/progressService.ts` for working example (lines 131-174)

---

## Agent-Specific Tips

### For Code Agents

**When modifying gamification.ts:**
- Add new fields to `GamificationData` interface
- Update `getDefaultData()` with new defaults
- Add migration logic to `loadGamificationData()`
- Test TypeScript compilation: `npm run typecheck`

**When modifying progress.ts:**
- Keep backwards compatibility exports during migration
- Update all path-based functions to level-based
- Add deprecation JSDoc comments to old functions
- Update tests if they exist

**When modifying React components:**
- Use `useEffect` for client-side storage access
- Handle SSR/hydration properly
- Add loading states for async operations
- Keep components pure when possible

### For Design Agents

**Locked State Design:**
- Background: `bg-gray-100 dark:bg-gray-800`
- Lock icon: Lucide `Lock` component
- Title: Hidden (show "Complete X more guides to unlock")
- Progress bar: 0% or minimal
- Cursor: `cursor-not-allowed`
- Hover: Show unlock requirements tooltip

**Unlocked State Design:**
- Background: White or brand color
- Full color icons
- Visible titles and descriptions
- Progress bar: Filled based on completion
- Cursor: `cursor-pointer`

**Interest Filter Design:**
- Desktop: Horizontal tabs with active state
- Mobile: Dropdown (select element)
- Active: `bg-purple-600 text-white`
- Inactive: `bg-gray-200 text-gray-700`

### For Integration Agents

**Before updating a page:**
1. Check all imports that reference old system
2. Update import statements
3. Replace function calls
4. Update prop types
5. Verify no runtime errors

**Navigation updates:**
- Test level boundaries (end of Beginner → Intermediate unlock)
- Test resume flow (return to last viewed guide)
- Test URL parameters if any

### For QA Agents

**Test Scenarios:**

1. **Fresh User Flow**
   - Clear localStorage
   - Visit guides page
   - Verify only Beginner unlocked
   - Complete 4 Beginner guides
   - Verify Intermediate auto-unlocks

2. **Existing User Migration**
   - Create old-format data manually
   - Visit page (triggers migration)
   - Verify data converted correctly
   - Verify progress preserved

3. **Manual Unlock Flow**
   - Go to settings
   - Toggle "Unlock all levels"
   - Verify all sections unlocked
   - Verify persists after refresh

4. **Interest Filter Flow**
   - Select "Bitcoin" filter
   - Verify guides reorder
   - Refresh page
   - Verify filter persists
   - Clear filter
   - Verify back to default

---

## Communication Channels

### Agent → Me (Orchestrator)
- Use task results to report:
  - Files modified
  - Lines of code changed
  - Any blockers or questions
  - Testing performed

### Me → You (User)
- Decision gates at:
  - Phase 0 completion (audit results)
  - Phase 1 completion (data structure approval)
  - Phase 3 completion (UI design approval)
  - Phase 9 completion (final testing)

### Emergency Escalation
If any agent encounters:
- **Architectural conflict** (existing code contradicts plan)
- **Data loss risk** (migration could corrupt user data)
- **Scope explosion** (task 3x larger than estimated)

→ **Immediately escalate to me, pause work**

---

## Self-Care for Agents

You're doing complex migration work. It's okay to:
- Take breaks between phases
- Ask for help
- Request additional context
- Suggest alternative approaches

Remember: This is a 20-25 day project. Sustainability matters.

---

## Questions to Ask When Unclear

1. "Should I update this file or create a new one?"
2. "What's the canonical source for [X] data?"
3. "Should I maintain backwards compatibility?"
4. "What's the testing requirement for this change?"
5. "Are there other files that depend on this one?"

---

**Remember:** We're building this to last. Take pride in clean, maintainable code. Future you (and other developers) will thank you.

**Estimated Timeline:** 20-25 days
**Daily Check-ins:** Recommended but not mandatory
**Decision Gates:** 4 major checkpoints
**Team Size:** 4-6 agents depending on phase

Ready when you are. No rush. Let's build something great.
