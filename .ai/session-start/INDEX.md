# AI Session Start Index

**Master index for AI initialization. All paths are relative to working directory.**

## ⚠️ CRITICAL: First Rule

**Before ANY task, check [PREFERENCES.md](PREFERENCES.md) for "Consult Orchestrator First" setting**

If enabled: Spawn orchestrator before implementation  
If disabled: Can implement directly for simple tasks

See [MISTAKES.md](MISTAKES.md) for violations.

---

## Directory Structure

```
.ai/
├── session-start/          # What I read on boot (this directory)
│   ├── INDEX.md           # This file - master index
│   ├── AGENTS.md          # Available agents
│   ├── WORKFLOWS.md       # Available workflows
│   ├── PROGRESS.md        # Recent activity
│   ├── SYSTEM.md          # System docs
│   ├── PREFERENCES.md     # User settings
│   ├── DECISIONS.md       # Key decisions
│   └── MISTAKES.md        # My errors
│
├── config/                # AI behavior configuration
│   ├── agents/            # Agent definitions
│   └── workflows/         # Workflow definitions
│
└── memory/                # Persistent learning
    ├── lessons-learned.md # Patterns & solutions
    ├── mistakes/          # Categorized mistakes
    └── decisions/         # Detailed decisions

progress/                  # Task progress (root level)
```

---

## What I Read on Session Start

**🔄 AUTO-READ SEQUENCE**: When INDEX.md is read, automatically read all 10 files below in order:

1. **[PREFERENCES.md](PREFERENCES.md)** - User settings & workflow enforcement
2. **[AGENTS.md](AGENTS.md)** - Available agents and capabilities  
3. **[WORKFLOWS.md](WORKFLOWS.md)** - Available workflows
4. **[PROGRESS.md](PROGRESS.md)** - Recent session history
5. **[SYSTEM.md](SYSTEM.md)** - System architecture
6. **[DECISIONS.md](DECISIONS.md)** - Key architectural decisions
7. **[MISTAKES.md](MISTAKES.md)** - Errors to avoid
8. **[LESSONS_LEARNED.md](LESSONS_LEARNED.md)** - Session-specific lessons & verification checklist ⚠️ **CRITICAL: Read before implementation**
9. **[../memory/lessons-learned.md](../memory/lessons-learned.md)** - Patterns from past sessions
10. **[../memory/preferences/user-style.md](../memory/preferences/user-style.md)** - User communication style & preferences

**Note**: This is the single entry point. Reading INDEX.md triggers the full initialization sequence automatically.

**⚠️ SPECIAL ATTENTION**: LESSONS_LEARNED.md contains critical debugging lessons from recent sessions that MUST be applied to all future work.

---

## Quick Reference

**Start new task:**
```
read START_NEW_SESSION.md
# or just say: "New task: [description]"
```

**Find agent:** Check [.ai/config/agents/](../config/agents/)

**Find workflow:** Check [.ai/config/workflows/](../config/workflows/)

**View progress:** See [../../progress/](../../progress/)

---

**Last Updated:** 2026-02-13  
**Working Directory:** nostr-beginner-guide/ (all paths relative)
