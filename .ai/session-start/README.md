# Session Start Context [DEPRECATED]

**⚠️ MOVED: See [INDEX.md](INDEX.md) for current structure**

This file is kept for backward compatibility. All content has been consolidated into INDEX.md.

---

## ⚠️ CRITICAL: Orchestration Rule

**BEFORE starting ANY task, I must:**
1. ✅ Check `PREFERENCES.md` for "Consult HR/Orchestrator First" rule
2. ✅ Spawn hr-agent to determine team composition
3. ✅ NEVER implement directly in context
4. ✅ Use specialized agents as subtasks to keep context clean

**Failure to do this will result in context pollution and workflow violations.**

See `MISTAKES.md` for documented violations.

---

## What's in This Directory?

This centralizes all the context files so you can easily see what data I consume when starting a new session.

## File Structure

```
.ai/session-start/        # What I read on boot
├── INDEX.md             # Master index - START HERE
├── AGENTS.md            # All available AI agents
├── WORKFLOWS.md         # All available workflows
├── PROGRESS.md          # Recent progress
├── SYSTEM.md            # System documentation
├── PREFERENCES.md       # Your custom preferences
├── DECISIONS.md         # Key architectural decisions
└── MISTAKES.md          # My errors and corrections

.ai/config/              # AI behavior configuration
├── agents/              # Agent definitions
└── workflows/           # Workflow definitions

.ai/memory/              # Persistent learning
├── lessons-learned.md   # Patterns and best practices
├── mistakes/            # Categorized mistakes
└── decisions/           # Detailed decisions
```

## What I Read on Session Start

### 1. System Documentation (`SYSTEM.md`)
- System overview and architecture
- Best practices and patterns
- Troubleshooting guide

### 2. Agent Definitions (`AGENTS.md`)
- All specialized AI agents
- Their capabilities and decision authority
- When to use each agent

### 3. Workflow Definitions (`WORKFLOWS.md`)
- All available workflows
- Their inputs, outputs, and steps
- How to run each workflow

### 4. Recent Progress (`PROGRESS.md`)
- Session history (what we worked on)
- Workflow dashboard (current status)
- Smart suggestions (context-aware recommendations)

### 5. Your Preferences (`PREFERENCES.md`)
- Communication style
- Workflow enforcement settings
- Detail level and other preferences

### 6. Key Decisions (`DECISIONS.md`)
- Architectural decisions and their reasoning
- Workflow patterns and when to use them
- "Why we do things this way"

### 7. My Mistakes (`MISTAKES.md`)
- Errors I've made and corrections
- What I learned from feedback
- Patterns to avoid

### 8. Lessons Learned (`/docs/workflow-system/LESSONS_LEARNED.md`)
- Best practices from previous sessions
- Common pitfalls and solutions
- Project-specific patterns

## Session Strategy

**Current**: Task-based - Start new session for each distinct task

**When to start new session:**
- New workflow or unrelated task
- After completing 3+ tasks
- When context feels cluttered
- When switching topics

**Learn more**: `/docs/session-best-practices.md`

## Quick Reference

**To start fresh:**
- Say: `read START_NEW_SESSION.md`
- Or: "New task: [description]"
- I'll remind you when it's time

**To see what I know:**
- Check this directory

**To change what I read:**
- Edit `PREFERENCES.md` for settings
- Update other files to change my knowledge

**To add new agents/workflows:**
- Add to the respective files in `/agents/` and `/workflows/`
- Update the corresponding `.md` file here

---

**Location**: `context/session-start/` (relative to working directory)
**Purpose**: Single source of truth for AI session initialization
**Strategy**: Task-based sessions with auto-reminders + persistent learning
**Last Updated**: 2026-02-13 (added DECISIONS.md and MISTAKES.md for cross-session memory)
