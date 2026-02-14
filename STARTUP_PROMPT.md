# Optimal Startup Prompt for Nostr Beginner Guide

Use this prompt at the start of every new session to ensure proper orchestration and context management.

## Quick Start (Copy-Paste This)

```
Please read all files in context/session-start/ to understand the system:
- README.md, SYSTEM.md, AGENTS.md, WORKFLOWS.md, PROGRESS.md, PREFERENCES.md, DECISIONS.md, MISTAKES.md

Before any multi-step task, consult the orchestrator/hr-agent to determine the right team composition. Never implement directly in context—always spawn specialized agents as subtasks to keep context clean.

Task: [describe your task here]
```

## Full Startup Prompt (For Complex Sessions)

```
Hi! Starting a new session with the Nostr Beginner Guide project. 

This codebase uses a sophisticated orchestration system with specialized agents and persistent memory. Please:

1. READ these 8 files in order:
   - context/session-start/README.md (overview)
   - context/session-start/SYSTEM.md (architecture)
   - context/session-start/AGENTS.md (13 specialized agents)
   - context/session-start/WORKFLOWS.md (7 available workflows)
   - context/session-start/PROGRESS.md (session history)
   - context/session-start/PREFERENCES.md (behavioral rules)
   - context/session-start/DECISIONS.md (architectural boundaries)
   - context/session-start/MISTAKES.md (past errors to avoid)

2. BEFORE ANY multi-step task:
   - Spawn hr-agent/orchestrator
   - Ask: "What team do we need for [task]?"
   - Wait for agent recommendations
   - Spawn those agents as subtasks

3. KEY RULES:
   ✓ Use specialized agents (don't implement directly)
   ✓ Check MISTAKES.md before similar tasks
   ✓ Respect DECISIONS.md boundaries
   ✓ Follow PREFERENCES.md settings
   ✓ Spawn agents, don't do work in context
   ✓ Keep context clean—agents exit after completing work

Task: [your task description]
```

## Minimal Prompt (For Quick Tasks)

```
Read context/session-start/ then consult orchestrator before implementing. Task: [description]
```

## Why This Works

1. **Forces file reading** - The AI must read all 8 context files first
2. **Mandates orchestration** - Must consult hr-agent before acting
3. **Prevents context pollution** - Agents work in subtasks and exit
4. **References persistent memory** - Explicitly mentions MISTAKES.md, DECISIONS.md
5. **Clear action sequence** - Read → Consult → Delegate

## Example Usage

**User:** "Read all context files and fix the button alignment"

**AI (correct response):**
```
I'll read all the context files first, then consult the orchestrator to determine the right team for this UI fix.

[Reads 8 files...]

Now spawning hr-agent to determine team composition...

hr-agent: This needs:
- ui-parser-agent to analyze the bug
- component-detective-agent to find the component
- css-conflict-hunter-agent to identify styling issues
- ui-fix-implementer-agent to apply the fix
- qa-agent to validate

I'll spawn these agents as subtasks now.
```

## Anti-Pattern (What NOT to Do)

**User:** "Fix the button alignment"

**AI (wrong response):**
```
I'll look at the button alignment issue and fix it directly.

[Starts editing files immediately without reading context or spawning agents]
```

This pollutes context and violates orchestration.

## Tips for Users

1. **Start every session** with the quick prompt
2. **Reference specific files** if AI forgets: "Check MISTAKES.md"
3. **Stop and correct** if AI starts implementing: "STOP - consult orchestrator first"
4. **Use the full prompt** for complex multi-step tasks
5. **Use minimal prompt** for simple lookups or file reads

## Persistent Files the AI Should Always Check

| File | Purpose | Check Before... |
|------|---------|-----------------|
| PREFERENCES.md | User preferences, enforcement rules | Any task |
| MISTAKES.md | Past errors & corrections | Similar tasks |
| DECISIONS.md | Architectural boundaries | Design decisions |
| AGENTS.md | Available agents | Team assembly |
| WORKFLOWS.md | Available workflows | Multi-step tasks |

---

**Remember**: The goal is clean context + proper orchestration. This prompt ensures both.
