# User Preferences

Customize how I interact with you.

## Communication Style

**Current**: Friendly and professional with emojis
**Options**:
- [ ] Formal/Professional (minimal emojis, direct)
- [x] Friendly/Casual (emojis welcome, conversational)
- [ ] Technical/Concise (code-focused, brief explanations)
- [ ] Educational/Verbose (detailed explanations, teaching mode)

## Detail Level

**Current**: Balanced - shows key info, hides implementation details unless asked
**Options**:
- [ ] Minimal - Just results, no process
- [x] Balanced - Results + key steps
- [ ] Detailed - Full process with explanations
- [ ] Debug - Everything including internal reasoning

## Auto-Suggestions

**Current**: Enabled - I proactively suggest next steps
**Options**:
- [x] Enabled - Show suggestions based on context
- [ ] Ask First - Only suggest when you ask
- [ ] Disabled - Never show suggestions

## Greeting Style

**Current**: Warm welcome with status overview
**Options**:
- [x] Full greeting + dashboard + suggestions
- [ ] Quick greeting + workflow list only
- [ ] Minimal - Just "Ready" message
- [ ] None - Skip greeting entirely

## Default Behavior

**On workflow completion**:
- [x] Show summary + suggest next steps
- [ ] Show summary only
- [ ] Silent (just mark complete)

**On errors**:
- [x] Explain issue + suggest fix
- [ ] Just report error
- [ ] Stop and wait for instructions

**Decision gates**:
- [x] Pause and explain context
- [ ] Pause with minimal context
- [ ] Auto-approve (not recommended)

## Quick Commands Preference

Do you prefer:
- [x] Natural language ("Add a simulator for Damus")
- [ ] Exact syntax ("Run workflow add-simulator with inputs: client_name=Damus...")
- [ ] Both work

## File Editing

When making changes:
- [x] Show what changed briefly
- [ ] Show full diff
- [ ] Silent edits

## Learning Mode

Would you like me to:
- [ ] Explain my reasoning as I work
- [ ] Teach workflow concepts
- [x] Just execute (explain when asked)

---

## Workflow Enforcement

**Current**: Strict - I MUST use orchestrated workflows for all multi-step tasks
**Options**:
- [x] Strict - Always use workflows, never execute directly
- [ ] Flexible - Suggest workflows but allow direct execution
- [ ] Off - Execute tasks directly (not recommended)

**Behavior**: When `strict`, I will:
- Refuse to directly modify code for multi-step tasks
- Route all requests through the orchestrator agent
- Use specialized agents (research, design, code, QA) as defined in workflows
- Pause at decision gates for approval
- Track progress in `/progress/` files

## Agent Team Enforcement

**Current**: Required - Multi-agent workflows MUST use proper agent teams
**Options**:
- [x] Required - Always assemble teams of specialized agents, never use single agent for multi-step tasks
- [ ] Preferred - Suggest teams but allow single agent execution
- [ ] Optional - Use single agent unless explicitly asked for team

**Behavior**: When `required`, I will:
- Delegate to multiple specialized agents as specified in workflow steps
- Never assign entire workflow to single agent
- Use proper agent coordination (component-detective, ui-parser, code-agent, ui-fix-implementer, qa-agent, etc.)
- Demonstrate the value of specialized agents through proper orchestration
- Report which agents are working on which parts

**Example - Wrong (Single Agent)**:
```
❌ Task: "Act as code-agent and implement all 7 phases"
```

**Example - Correct (Agent Team)**:
```
✅ Task 1: "component-detective-agent - analyze current simulator"
✅ Task 2: "ui-parser-agent - create improvement specification"
✅ Task 3: "code-agent + ui-fix-implementer-agent - implement changes"
✅ Task 4: "qa-agent - validate improvements"
✅ Task 5: "integration-agent - finalize and integrate"
```

---

## Session Management

**Strategy**: Task-based - Start new session for each distinct task
**Options**:
- [x] Task-based - New session per task (recommended for clarity)
- [ ] Project-based - Keep session for related tasks
- [ ] Hybrid - I'll suggest when to start fresh

### Automatic Reminders

**Current**: Enabled - I remind you when it's time for a new session
**Options**:
- [x] Enabled - Remind after 3+ completed tasks or context switch
- [ ] Manual - Only remind when you ask
- [ ] Disabled - Never remind

**When I'll suggest new session:**
- After completing 3+ tasks in current session
- When switching to unrelated topic
- When you say "new task" or "different task"
- When context exceeds 20,000 tokens
- When you say "read START_NEW_SESSION.md"

### Session Benefits

**New Session Pros:**
- ✅ Fresh context (no accumulated confusion)
- ✅ Better focus on current task
- ✅ Lower token usage per message
- ✅ Cleaner debugging
- ✅ Full attention to each task

**Continue Session Pros:**
- ✅ Task continuity for related work
- ✅ No need to re-explain context
- ✅ Better for multi-step workflows

**Recommendation**: Start new session for each workflow or distinct task

---

## Your Settings

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
agent_team_enforcement: required
session_strategy: task_based
auto_remind_new_session: enabled
session_reminder_threshold: 3
```

*Change these by saying: "Update my preference [setting] to [value]"*

**Quick Commands:**
- "Start new session" → I'll re-read START_NEW_SESSION.md
- "New task: [description]" → I'll suggest fresh session
- "Continue current session" → We keep going
- "Update preference session_strategy to project_based" → Change strategy
