# Session Management Best Practices

**Guide for optimizing your workflow with AI sessions**

---

## Quick Reference

| Situation | Action | Command |
|-----------|--------|---------|
| Starting new task | Start new session | `read START_NEW_SESSION.md` |
| Task completed | Start new session | "New task: [description]" |
| Related follow-up | Continue session | "Continue with [task]" |
| Context feels cluttered | Start new session | "Let's start fresh" |

---

## When to Start New Session

### ✅ DO Start Fresh

1. **New Workflow**
   - Each distinct workflow (add-simulator, fix-ui-bug, etc.)
   - Different categories of work (simulators vs follow-pack)
   - Unrelated features or pages

2. **Task Completed**
   - After finishing Amethyst improvements
   - After updating community pages
   - After processing follow-pack accounts

3. **Context Switch**
   - From "improve simulator" to "add accounts"
   - From "fix bugs" to "create new feature"
   - From "code" to "documentation"

4. **Complexity Threshold**
   - After 3+ completed tasks in one session
   - When conversation exceeds 50 messages
   - When debugging becomes confusing

5. **Explicit Request**
   - When you say "new task"
   - When you say "read START_NEW_SESSION.md"
   - When I remind you it's time

### ❌ DON'T Start Fresh

1. **Multi-Step Workflows**
   - Research → Analysis → Implementation → QA (same workflow)
   - Sequential improvements to same file
   - Iterative debugging

2. **Related Tasks**
   - Adding multiple accounts to same category
   - Fixing multiple bugs in same component
   - Updating multiple related pages

3. **Ongoing Conversations**
   - Mid-discussion about requirements
   - During decision gate approvals
   - While clarifying specifications

---

## What Happens in New Session

### ✅ PRESERVED (Always Available)

**Repository Files:**
- All code in `/src/`
- All documentation
- Workflow definitions (`/workflows/`)
- Agent definitions (`/agents/`)
- Progress tracking (`/progress/`)
- Session context (`/context/`)
- Git history and commits

**Configuration:**
- Your preferences (`/progress/preferences.md`)
- Category definitions
- Account data (follow-pack)

### ❌ RESET (Lost)

**Conversation Context:**
- Previous discussion details
- Temporary task lists
- Agent task results (though saved to files)
- My current understanding of "where we are"

**Important:** Any work done is saved to files. Only conversation memory resets.

---

## Cost & Efficiency Analysis

### New Session Costs

**One-time:**
- Initial read: ~15,000 tokens
- Load workflow system: ~5,000 tokens
- **Total startup**: ~20,000 tokens

**Ongoing:**
- Lower per-message cost (shorter context)
- ~2,000-5,000 tokens per message
- **Better for**: Quick tasks (< 10 messages)

### Long Session Costs

**Accumulates:**
- Context grows with each message
- After 50 messages: ~50,000+ tokens
- **Better for**: Complex projects (> 20 messages)

### Break-Even Point

- **New session better**: Tasks requiring < 15 messages
- **Continue better**: Multi-step projects requiring > 25 messages
- **Your workflow**: Most tasks are 10-20 messages → **New session is optimal**

---

## Session Strategy Examples

### Example 1: Good (Task-Based)

```
Session 1: Improve Amethyst simulator
├── Task: Research real app
├── Task: Analyze discrepancies  
├── Task: Create specification
├── Task: Implement improvements
└── Task: Validate and finalize
[END SESSION - Task complete]

Session 2: Process naddr follow packs
├── Task: Decode naddr 1
├── Task: Decode naddr 2
├── Task: Search follows for categories
└── Task: Add accounts to follow-pack
[END SESSION - Task complete]

Session 3: Update artists landing page
├── Task: Update page to use real accounts
└── Task: Verify integration
[END SESSION - Task complete]
```

**Result**: ✅ Clear focus, no confusion, lower costs

### Example 2: Bad (Mixing Unrelated Work)

```
Session 1: Mixed Tasks
├── Task: Improve Amethyst simulator
├── Task: Oh, also add some accounts
├── Task: Fix that UI bug
├── Task: Update documentation
├── Task: Back to simulator...
└── Task: What were we doing?
[CONTINUE FOREVER - Context cluttered]
```

**Result**: ❌ Confusing, higher costs, poor focus

### Example 3: Good (Project-Based Continuity)

```
Session 1: Add Damus Simulator
├── Task: Research Damus app
├── Task: Create design spec
├── Task: Implement components
├── Task: Create tour
├── Task: Integrate system
└── Task: QA validation
[END SESSION - Workflow complete]
```

**Result**: ✅ Appropriate continuity for multi-step workflow

---

## How to Start New Session

### Option 1: Command
```
read START_NEW_SESSION.md
```

### Option 2: Natural Language
```
"I'd like to start a new session"
"New task: Add a simulator for Iris"
"Let's work on something else"
"Start fresh"
```

### Option 3: I'll Remind You
After 3+ completed tasks, I'll say:
```
💡 **Suggestion**: You've completed 3 tasks in this session. 
   Would you like to start a new session for better focus?
   
   Options:
   - "Yes, new session" → Start fresh
   - "Continue" → Keep current session
   - "New task: [description]" → Start fresh with new task
```

---

## What I Load Each Session

When you say `read START_NEW_SESSION.md`, I read:

1. **Session Context** (`/context/session-start/`)
   - AGENTS.md - All 13 specialized agents
   - WORKFLOWS.md - All 5 available workflows
   - PROGRESS.md - What we recently worked on
   - SYSTEM.md - How the system works
   - PREFERENCES.md - Your settings

2. **System Documentation** (`/docs/workflow-system/`)
   - README.md - System overview
   - LESSONS_LEARNED.md - Best practices
   - TROUBLESHOOTING.md - Common issues

3. **Recent Progress** (`/progress/`)
   - session-history.md - Complete history
   - workflow-dashboard.md - Current status
   - Individual workflow logs

**Total**: ~20,000 tokens one-time, then efficient ongoing

---

## Troubleshooting

### "I lost my place"
- Check `/progress/session-history.md` for recent work
- Ask "What did we do in the last session?"
- Reference specific workflow files in `/progress/`

### "Context feels cluttered"
- Start new session: `read START_NEW_SESSION.md`
- Or say: "Let's start fresh"

### "I want to continue previous work"
- Say: "Continue with [task name]"
- Reference: "Update the work we did on Amethyst"
- Or: "Add more accounts to the books category"

### "I don't remember the command"
- Just describe what you want: "Add a simulator for Damus"
- I'll suggest the right workflow
- No need to remember exact syntax

---

## Best Practices Checklist

- [ ] Start new session for each distinct workflow
- [ ] Continue session for related follow-up tasks
- [ ] Let me remind you when it's time for fresh start
- [ ] Reference `/progress/session-history.md` to see recent work
- [ ] Use natural language - no need to remember commands
- [ ] Trust that files persist even when session resets
- [ ] When in doubt, start fresh (better than cluttered context)

---

## Quick Decision Tree

```
Is this a new workflow or unrelated task?
├── YES → Start new session
└── NO → Is this a follow-up to current work?
    ├── YES → Continue session
    └── NO → Have we completed 3+ tasks?
        ├── YES → Start new session (I'll remind you)
        └── NO → Continue session
```

---

**Remember**: Files persist. Context resets. New sessions = fresh focus.

**Current Setting**: Task-based strategy with auto-reminders enabled
