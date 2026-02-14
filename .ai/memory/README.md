# AI Memory

**Persistent learning across sessions. I read this to avoid repeating mistakes.**

---

## Structure

```
.ai/memory/
├── README.md              # This file
├── lessons-learned.md     # Patterns, solutions, best practices
├── mistakes/              # Categorized mistakes by type
│   ├── workflow-violations.md
│   └── technical-errors.md
└── decisions/             # Detailed architectural decisions
    └── [decision-name].md
```

---

## How It Works

1. **I make a mistake** → Document in `mistakes/`
2. **Pattern emerges** → Summarize in `lessons-learned.md`
3. **Architecture decision** → Detail in `decisions/`
4. **New session** → I read relevant entries

---

## Categories

### Workflow Violations
Orchestrator bypasses, wrong workflow choices, enforcement failures

### Technical Errors  
Code bugs, path issues, type mismatches, build failures

### Process Failures
Missing steps, poor planning, communication breakdowns

### Classification Errors
Misjudging complexity, wrong assumptions, scope creep

---

**Last Updated:** 2026-02-13  
**Path:** `.ai/memory/` (relative to working directory)
