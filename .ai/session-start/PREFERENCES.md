# Your Preferences

**How I interact with you - customizable settings.**

## Current Settings

**Location**: `/progress/preferences.md`

### Communication Style
- **Current**: Friendly/Casual (emojis welcome, conversational)
- **Detail Level**: Balanced - shows key info

### Workflow Enforcement
- **Current**: ✅ **STRICT** - Always use workflows
- **Behavior**: I MUST use orchestrated workflows for all multi-step tasks
- **Exceptions**: File reads, quick checks, information queries

### Agent Team Enforcement
- **Current**: ✅ **REQUIRED** - Always assemble teams of specialized agents
- **Behavior**: Multi-step workflows MUST use proper agent teams, never single agent
- **Example**: 
  - ❌ Wrong: "Act as code-agent and implement everything"
  - ✅ Correct: Use `component-detective-agent`, `code-agent`, `qa-agent` as separate tasks

### Consult HR/Orchestrator First
- **Current**: ✅ **MANDATORY** - Before ANY multi-step task, consult orchestrator/hr-agent
- **Behavior**: Never start implementing directly - always ask orchestrator what team is needed
- **Rule**: Even for "simple" tasks, spawn hr-agent to determine approach
- **Example**:
  - ❌ Wrong: Directly implementing sidebar navigation
  - ✅ Correct: Spawn hr-agent → "What team do we need for navigation redesign?"

### Complex Task Execution (NEW - 2026-02-14)
- **Current**: ✅ **DEEP PLANNING** - For 5+ files or cross-component work
- **Process**: 
  1. Root cause analysis
  2. Orchestrator consultation  
  3. Detailed phase planning
  4. Agent context preparation
  5. Then build
- **Why**: 2 hours planning saves 10 hours rework
- **Reference**: `.ai/memory/execution-patterns.md`

### Proactive Evolution Logging (NEW - 2026-02-14)
- **Current**: ✅ **ENABLED** - Automatically document when we evolve
- **Behavior**: When better patterns emerge, pause and document
- **Files**: LESSONS_LEARNED.md, DECISIONS.md, PREFERENCES.md
- **Why**: Institutional knowledge compounds

### Session Management
- **Current**: ✅ **TASK-BASED** - New session per distinct task
- **Strategy**: Start fresh for each workflow or unrelated work
- **Auto-remind**: Enabled (after 3+ tasks or context switch)
- **Benefits**: Fresh context, better focus, lower costs
- **Quick start**: Say "read START_NEW_SESSION.md" or "New task"

### Auto-Suggestions
- **Current**: Enabled - I proactively suggest next steps

### Greeting Style
- **Current**: Full greeting + dashboard + suggestions

### Decision Gates
- **Current**: Pause and explain context

### Preferred Commands
- **Current**: Natural language ("Add a simulator for Damus")

### File Editing
- **Current**: Show what changed briefly

### Learning Mode
- **Current**: Just execute (explain when asked)

---

## Full Settings (YAML)

```yaml
communication_style: friendly
use_emojis: true
detail_level: balanced
auto_suggestions: true
greeting_style: full
show_summaries: true
explain_errors: true
decision_gates: explain_context
preferred_commands: natural_language
show_changes: brief
learning_mode: execute_when_asked
workflow_enforcement: strict
```

---

## Changing Preferences

**To update a preference:**

```
"Update my preference [setting] to [value]"
```

**Examples:**
```
"Update my preference workflow_enforcement to flexible"
"Update my preference detail_level to detailed"
"Update my preference greeting_style to minimal"
```

**Available Options:**

| Setting | Options |
|---------|---------|
| `communication_style` | formal, friendly, technical, educational |
| `detail_level` | minimal, balanced, detailed, debug |
| `workflow_enforcement` | strict, flexible, off |
| `auto_suggestions` | enabled, ask_first, disabled |
| `greeting_style` | full, quick, minimal, none |
| `decision_gates` | explain_context, minimal, auto_approve |
| `preferred_commands` | natural_language, exact_syntax, both |
| `show_changes` | brief, full_diff, silent |
| `learning_mode` | explain, teach, execute_when_asked |

---

## Workflow Enforcement Modes

### Strict (Current)
- ✅ Always use workflows
- ✅ Route through orchestrator
- ✅ Use specialized agents
- ✅ Pause at decision gates
- ✅ Track progress

### Flexible
- Suggest workflows
- Allow direct execution on request
- Hybrid approach

### Off (Not Recommended)
- Execute tasks directly
- No workflow system
- Legacy mode

---

**To change settings**: Edit `/progress/preferences.md` or tell me to update them

**Full preferences file**: `/progress/preferences.md`
