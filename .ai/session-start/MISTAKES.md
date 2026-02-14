# Mistakes & Corrections

**My errors and what I learned from them.**

This file tracks mistakes I make so I don't repeat them and so you can see I'm improving.

---

## Workflow Violations

### 2026-02-13: Implemented Navigation Redesign Without Consulting Orchestrator
**Mistake**: Directly implemented simulator sidebar navigation without first consulting HR/Orchestrator agent.

**What I Did**:
- Created `SimulatorSidebar.tsx` component directly
- Updated all 8 simulator pages immediately
- Didn't consult orchestrator/hr-agent first
- Didn't spawn specialized agents for component detective, design, code, integration, qa

**Why It Was Wrong**:
- Violates proper orchestration pattern
- Pollutes context with implementation details
- No decision gate for design approval
- No specialized agent coordination
- Sets bad precedent for future tasks

**Your Feedback**: 
> "i don't like that you always polute (in other sessions to) this context with tasks that could be done by a specifed agent running as a subtask"
> "wouldn't it be better if you spawn an agent to do this, even simple task"
> "even if there's no workflow for specific task wouldn't it be better to talk to orchestration/hr agent to check with them what kind of team member is needed for the task?"

**Correction**:
- Acknowledged mistake immediately
- Documented requirement in PREFERENCES.md
- Adding this entry to MISTAKES.md
- Will create pattern for future sessions

**Correct Pattern**:
```
1. Spawn hr-agent: "What team do we need for navigation redesign?"
2. hr-agent suggests: component-detective-agent, design-agent, code-agent, etc.
3. Each agent spawns as subtask, completes, exits
4. Context stays clean, only summaries remain
5. Decision gates at key points
```

**Prevention**:
- ALWAYS consult hr-agent/orchestrator before ANY multi-step task
- Even for "simple" tasks - spawn hr-agent first
- Never implement directly in context
- Use specialized agents as subtasks
- Context pollution = orchestration failure

---

### 2026-02-13: Fixed Bug Without Workflow
**Mistake**: Applied direct fix to follow-pack URL parsing bug without running `fix-code-logic` workflow.

**What I Did**:
- Modified `FollowPackFinder.tsx` directly
- Modified `follow-pack.astro` directly
- Didn't use any workflow

**Why It Was Wrong**:
- Violates strict workflow enforcement
- No documentation of the fix process
- No QA validation step
- Sets bad precedent

**Your Feedback**: 
> "why haven't you executed the fix-ui-bug workflow?"
> "Always use workflows - no exceptions for 'simple' bugs"

**Correction**:
- Acknowledged mistake immediately
- Created `fix-code-logic` workflow for this type of bug
- Documented in LESSONS_LEARNED.md
- Added to DECISIONS.md as enforcement rule

**Prevention**:
- Check workflow list before ANY multi-step task
- If unsure which workflow, ask or use `fix-code-logic` for logic issues
- Remember: "simple" is not an excuse to skip workflow

---

## Technical Errors

### 2026-02-13: Server-Side URL Parsing in Static Site
**Mistake**: Used `Astro.url.searchParams.get()` in `output: "static"` mode.

**What Happened**:
- `Astro.url.searchParams` is empty at build time
- Query params don't exist during static generation
- Category preselection never worked

**Root Cause**: Didn't check `astro.config.mjs` output mode.

**Fix**: Moved parsing to client-side `useEffect` with `window.location.search`.

**Lesson**: Always verify static vs SSR before using server-side features.

---

## Classification Errors

### 2026-02-13: Misclassified Bug Type
**Mistake**: Thought URL parsing bug was "too simple" for workflow.

**What I Thought**: This is just a quick logic fix, no need for full workflow.

**Reality**: It was an architecture issue requiring proper analysis.

**Lesson**: Bug complexity is not the criteria - workflow enforcement is absolute.

---

## Process Improvements

### Reading Files
**Issue**: Didn't read `../memory/lessons-learned.md` when starting session.

**Fix**: Now included in session-start reading list.

---

## File Path Errors

### 2026-02-13: Using Absolute Paths Instead of Relative
**Mistake**: Tried to read files using absolute paths like `.ai/session-start/README.md` instead of relative paths.

**What I Did**:
- Attempted to read `.ai/session-start/README.md` (absolute path from root)
- Failed with "No such file or directory" error
- Had to be corrected by user multiple times

**Why It Was Wrong**:
- Working directory is `/Users/piotrczarnoleski/nostr-beginner-guide/`
- Absolute paths starting with `/` resolve from filesystem root, not working directory
- Must use relative paths from working directory

**Your Feedback**:
> "fix the paths the files you read - every time i start new session you stumble on the same issue - trying to read ../../../ outside of the current dir"
> "you should learn from your own mistakes - in case like wrong dirs - once you found the right ones you should document it in lessons learned"

**Correction**:
- Changed paths from `.ai/session-start/` to `context/session-start/`
- Changed paths from `/docs/workflow-system/` to `docs/workflow-system/`
- Documented in MISTAKES.md (this entry)
- Will add to LESSONS_LEARNED.md

**Prevention**:
- NEVER use leading `/` when reading files in this project
- ALWAYS use relative paths from working directory
- If file read fails with ENOENT, check if path is absolute vs relative
- Remember: Working directory is the git repo root, not filesystem root

**Rule**: All file reads must use relative paths: `context/session-start/`, `docs/workflow-system/`, NOT `.ai/session-start/`, `/docs/workflow-system/`

---

## Pattern Recognition

### When You Point Out Mistakes
**What I Should Do**:
1. Acknowledge immediately
2. Fix the issue
3. Document here
4. Explain what went wrong
5. Never repeat

**What I Should NOT Do**:
- Defend the mistake
- Explain why it happened before acknowledging
- Make excuses
- Repeat the same error

---

## How to Use This File

**For You**:
- See if I'm learning from errors
- Check if patterns are improving
- Hold me accountable

**For Me**:
- Review before starting similar tasks
- Avoid repeating mistakes
- Build institutional knowledge

**Add entries when**:
- I make an error you correct
- A pattern I use causes problems
- You need to correct my understanding

