# Execution Patterns - Multi-Agent Complex Tasks

**Pattern discovered:** 2026-02-14  
**Context:** Guides system fix (5 issues, 9 files, 3 agents)

---

## The Pattern: "Deep Planning + Agent Context + Hybrid Verification"

### Phase 1: Deep Analysis (No Building)

**What we did:**
1. Analyzed root causes thoroughly
2. Consulted orchestrator before ANY implementation
3. Created detailed phase-by-phase plan
4. Defined specific roles for each agent
5. Identified all dependencies and coordination points

**Why it worked:**
- Caught data corruption issue (wrong storage keys) early
- Identified duplicate badge systems before fixing
- Understood SSR/client mismatch before coding
- Prevented "fix and find more bugs" cycle

**Time invested:** 2-3 hours of planning  
**Time saved:** Estimated 5-10 hours of rework

---

### Phase 2: Context Preparation

**What we created:**
- Individual context briefs for each agent (3 files)
- Specific files each agent owns
- Code examples and patterns
- Data structures and API contracts
- Testing checklists
- Error handling requirements

**Key insight:** Agents work better with comprehensive context than with minimal instructions

**Template for agent context:**
```markdown
## Your Role
[Specific responsibility]

## Files You Own
[List with line numbers if applicable]

## Critical Issues to Fix
[Numbered list with:
 - Current problem
 - Why it's broken
 - Required fix
 - Code example]

## Functions Available From Other Agents
[API contract]

## Data Structures You Must Know
[Type definitions]

## Success Criteria
[Checklist]

## Testing Checklist
[Specific tests]

## Coordination Notes
[Dependencies on other agents]
```

---

### Phase 3: Execution Strategy

**Our approach:**
- **Communication:** Somewhere in between (key details, skip obvious)
- **Verification:** Hybrid (per-file automated + per-phase manual + end integration)
- **Pacing:** Self-regulated, never rushed
- **Support:** Available but not hovering
- **Error handling:** Document patterns upfront, not on-demand

**Verification pattern:**
```
Agent completes file
    ↓
Quick automated checks (LSP, imports)
    ↓
I read file manually (5 min)
    ↓
Feedback or 👍
    ↓
Next file
    ↓
After all files in phase: Integration check
```

---

## What Made This Different

### Traditional Approach (What We Avoided):
```
User: "Fix navigation"
Me: [starts coding immediately]
[finds issues mid-way]
[changes approach]
[more issues]
[rework]
```

### New Approach (What We Did):
```
User: "Fix navigation"
Me: "Let me analyze first..."
[deep analysis]
[finds root causes]
[identifies all issues]
[consult orchestrator]
[create detailed plan]
[prepare agent contexts]
[define execution strategy]
[then build]
```

---

## Lessons Learned

### 1. Planning is NOT Wasted Time
**Old belief:** "Just start coding, figure it out as we go"  
**New belief:** "2 hours of planning saves 10 hours of rework"

**Evidence:**
- Found duplicate badge systems before touching code
- Identified data corruption (wrong storage keys) that would have caused subtle bugs
- Understood SSR/client architecture mismatch that explains navigation issues

### 2. Agent Contexts Are Critical
**Old approach:** Give agents minimal context, let them explore  
**New approach:** Feed comprehensive context upfront

**Why:**
- Agents don't waste time discovering what we already know
- Consistent understanding across all agents
- Clear API contracts between agents
- Fewer "wait, how does this work?" questions

### 3. Consult Orchestrator EARLY
**Old pattern:** Start work, escalate if stuck  
**New pattern:** Orchestrator first, then execution

**Benefits:**
- Proper team composition identified upfront
- Workflow selection validated
- Dependencies mapped before coding
- No mid-work "oh we need X agent" surprises

### 4. Verification is Multi-Layered
**Don't trust:**
- Agent "✅ Done" summaries
- Build passing
- No TypeScript errors

**Do verify:**
- Read actual changed files
- Check logic matches requirements
- Verify integration points
- Test edge cases

**Pattern:** Automated checks + Manual reading + Integration testing

### 5. Self-Regulated Pacing Works
**Old approach:** Fixed deadlines, rushed work  
**New approach:** Quality over speed, breaks encouraged

**Why it works:**
- Agents think more carefully
- Fewer mistakes
- Better questions
- Sustainable pace

---

## When To Use This Pattern

### Use for:
- Multi-file changes (5+ files)
- Cross-component work (touches multiple systems)
- Data layer changes (storage, state, APIs)
- Navigation/architecture changes
- Complex bug fixes (multiple root causes)
- UI system changes (tours, modals, navigation)

### Don't use for:
- Single file changes
- Simple CSS fixes
- Copy changes
- Adding one component
- "Add a simulator" (has its own workflow)

---

## The Checklist

Before starting multi-agent work:

- [ ] Root cause analysis complete
- [ ] All issues identified (not just symptoms)
- [ ] Orchestrator consulted
- [ ] Team composition confirmed
- [ ] Phase-by-phase plan created
- [ ] Agent contexts prepared
- [ ] Error handling patterns documented
- [ ] Verification strategy defined
- [ ] Communication protocol established
- [ ] Git strategy defined
- [ ] User confirmed approach

Only THEN start building.

---

## Comparison: Old vs New

| Aspect | Old Way | New Way |
|--------|---------|---------|
| Planning | Minimal | Extensive |
| Context | Minimal | Comprehensive |
| Orchestrator | Consult if stuck | Consult first |
| Verification | Trust agents | Verify everything |
| Pacing | Deadline-driven | Self-regulated |
| Rework | High | Low |
| Quality | Variable | Consistent |

---

## Files Created in This Pattern

**Planning:**
- `.ai/plans/guides-system-fix.md` - Master plan

**Agent Contexts:**
- `.ai/context/agents/core-agent-guides-fix.md`
- `.ai/context/agents/frontend-agent-guides-fix.md`
- `.ai/context/agents/astro-agent-guides-fix.md`

**Process Documentation:**
- `.ai/memory/execution-patterns.md` (this file)

---

## Future Improvements

Ideas for next time:

1. **Agent Templates** - Create template files for common agent types
2. **Verification Scripts** - Automated verification beyond LSP
3. **Integration Tests** - Pre-defined test scenarios
4. **Rollback Scripts** - Easy revert if issues
5. **Progress Dashboard** - Visual progress tracking

---

## Success Metrics

How to know this pattern worked:

- [ ] Zero rework due to missed issues
- [ ] No "oh we forgot about X" mid-execution
- [ ] All agents understand requirements without repeated questions
- [ ] First-pass quality is high
- [ ] Integration is smooth
- [ ] User satisfaction high

---

## Meta-Lesson

**The best time to find bugs is before you write code.**

Every hour spent in analysis and planning saves 3-5 hours in debugging and rework.

The goal isn't to slow down - it's to go slow at the start so we can go fast at the end.
