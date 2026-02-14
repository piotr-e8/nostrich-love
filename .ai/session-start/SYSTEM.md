# System Documentation

**Core system architecture and documentation.**

## System Overview

The Agent Workflow System is a framework for coordinating AI agents to complete complex, multi-step tasks through structured workflows.

## Key Concepts

### 1. Agent-Based Architecture
- **Head HR Agent**: The main coordinator (me)
- **Specialized Agents**: Each has specific capabilities
- **Orchestrator**: Routes tasks to appropriate agents
- **98% Autonomous**: Agents make decisions without asking
- **2% Escalation**: Only core decisions need your approval

### 2. Workflow-Driven Execution
- Workflows defined in YAML (`/workflows/*.yaml`)
- Steps have dependencies and can run in parallel
- Decision gates pause for human approval
- Progress tracked in `/progress/*.md`

### 3. File Organization

```
/agents/           # Agent role definitions
/workflows/        # Workflow specifications  
/progress/         # Execution tracking
/context/          # Session context (NEW)
/docs/             # Documentation
```

## Directory Structure

### `/agents/`
Reusable agent roles assigned to workflow steps:
- `orchestrator-agent.md` - Coordinates workflows
- `research-agent.md` - Gathers information
- `code-agent.md` - Implements code
- `qa-agent.md` - Reviews quality
- Plus 9 more specialized agents

### `/workflows/`
Repeatable processes for common tasks:
- `add-simulator.yaml` - Add Nostr client simulators
- `add-follow-pack-accounts.yaml` - Add follow-pack accounts
- `add-community-landing-page.yaml` - Create community pages
- `update-community-landing-page.yaml` - Update with real accounts
- `fix-ui-bug.yaml` - Systematic UI debugging

### `/progress/`
Workflow execution tracking:
- `session-history.md` - Complete work history
- `workflow-dashboard.md` - Real-time status
- `smart-suggestions.md` - Context-aware recommendations
- `workflow-metrics.md` - Performance tracking
- Individual workflow logs

### `/context/session-start/` (NEW)
Centralized session initialization:
- `README.md` - Overview
- `AGENTS.md` - All available agents
- `WORKFLOWS.md` - All executable workflows
- `PROGRESS.md` - Recent activities
- `SYSTEM.md` - This file
- `PREFERENCES.md` - Your settings

## How It Works

### Starting a Workflow

1. **User Request**: "Add a simulator for Amethyst"
2. **Orchestrator**: Loads `add-simulator.yaml`
3. **Agent Dispatch**: Orchestrator assigns agents to steps
4. **Step Execution**: Agents execute autonomously
5. **Decision Gates**: Pause for your approval
6. **Progress Tracking**: Updates `/progress/` files
7. **Completion**: Final summary and next steps

### Decision Gates

Workflows pause at key points:
- **Design approval**: Approve specs before implementation
- **Root cause analysis**: Approve bug fix approach
- **Verification**: Confirm fix works
- **QA approval**: Review outputs before finalizing

**How to Respond**:
- `1` or "yes" - Approve and continue
- "adjust [specifics]" - Make changes
- "details" - See more information

## Best Practices

### 1. Always Use Workflows
- Never execute multi-step tasks directly
- Route through orchestrator agent
- Follow proper agent delegation

### 2. Track Everything
- Update `/progress/` files after steps
- Log decisions and outcomes
- Maintain session history

### 3. Patterns First
- Check existing implementations
- Follow established conventions
- Reuse proven patterns

### 4. Validate Often
- QA validation before completion
- Test runtime when possible
- Check for regressions

## System Rules

### Strict Workflow Enforcement
When `workflow_enforcement: strict` (currently enabled):
- I MUST use orchestrated workflows
- I will refuse direct execution of multi-step tasks
- All requests route through proper channels

### Agent Team Enforcement
When `agent_team_enforcement: required` (currently enabled):
- I MUST assemble teams of specialized agents for multi-step tasks
- I will NEVER delegate entire workflow to single agent
- Each workflow step gets its appropriate specialized agent
- I demonstrate value of specialization through proper orchestration

**Wrong (Single Agent)**:
```
❌ "Act as code-agent and implement all 7 phases"
```

**Correct (Agent Team)**:
```
✅ component-detective-agent → analyze current simulator
✅ ui-parser-agent → create improvement specification  
✅ code-agent → implement core changes
✅ ui-fix-implementer-agent → apply UI fixes
✅ qa-agent → validate improvements
✅ integration-agent → finalize integration
```

### Exceptions (Single Actions Allowed)
- File reads you explicitly request
- Quick lookups or checks
- Information queries
- Running existing commands

## Troubleshooting

### Common Issues

**Workflow not found**:
- Check `/workflows/` directory
- Verify workflow ID matches filename

**Agent not available**:
- Check `/agents/` directory
- Verify agent definition exists

**Decision gate unclear**:
- Ask "details" for more context
- Request specific information

## Resources

### Documentation
- `/docs/workflow-system/README.md` - System overview
- `/docs/workflow-system/LESSONS_LEARNED.md` - Patterns
- `/docs/workflow-system/TROUBLESHOOTING.md` - Issues

### Reference
- `START_NEW_SESSION.md` - Session initialization guide
- `/workflows/template.yaml` - Create new workflows
- `/workflows/schema.yaml` - YAML validation

---

**System Status**: ✅ Operational
**Workflows Available**: 5
**Agents Available**: 13
**Enforcement Mode**: Strict + Agent Team Required
**Last Updated**: 2026-02-13
