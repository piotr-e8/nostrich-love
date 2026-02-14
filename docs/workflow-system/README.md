# Workflow System Documentation

Welcome to the Agent Workflow System - a declarative, agent-driven approach to automating repeatable tasks.

## Quick Start

### For Users

**To run a workflow, simply say:**

```
"Add a simulator for [Client Name] on [platform]"
```

The Head HR Agent will:
1. Load the appropriate workflow from `/workflows/`
2. Assemble the required agents
3. Execute the workflow
4. Report progress

### For Developers

**To create a new workflow:**

1. Copy `/workflows/template.yaml` to `/workflows/your-workflow.yaml`
2. Define inputs, steps, and outputs
3. Reference existing agent definitions in `/agents/`
4. Test with a minimal case

## System Architecture

```
┌─────────────────┐
│   User Request  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Head HR Agent   │
│ (Orchestrator)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌─────────┐
│Research│ │  Code   │
│ Agent  │ │  Agent  │
└───────┘ └─────────┘
    │         │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│ QA Agent        │
│ Integration     │
│ Agent           │
└─────────────────┘
```

## Directory Structure

```
/agents/          # Agent role definitions
/workflows/       # Workflow specifications
/scripts/         # Reusable utility scripts
/progress/        # Workflow execution tracking
/docs/workflow-system/  # This documentation
```

## Core Concepts

### Agents

Specialized workers with defined capabilities and decision boundaries:

- **research-agent**: Gathers information and assets
- **code-agent**: Implements following existing patterns
- **qa-agent**: Reviews quality and completeness
- **integration-agent**: Integrates into existing systems

See `/agents/README.md` for details.

### Workflows

Declarative YAML files that define:
- Inputs required from user
- Steps to execute (in dependency order)
- Which agent handles each step
- Decision gates where human approval is needed

See `/workflows/README.md` for details.

### Decision Authority

**98% Autonomous, 2% Human**

Agents make their own decisions about:
- Implementation details
- Code organization
- Which sources to use
- How to structure output

**Escalate to human for:**
- Architectural changes
- New dependencies/frameworks
- Conflicting requirements
- Design direction (at decision gates)

## Common Workflows

### Add Simulator

Creates a complete Nostr client simulator:

```yaml
workflow: add-simulator
inputs:
  client_name: "Iris"
  platform: "web"
```

Steps:
1. Research client (branding, features, screenshots)
2. Create design specification
3. **Decision Gate**: Approve design direction
4. Implement page, tour, and components
5. Integrate into system
6. Quality check
7. **Decision Gate**: Approve final implementation

## Progress Tracking

Each workflow run creates a progress file in `/progress/`:

```
progress/add-simulator-20240101-120000.md
```

Track:
- Current status
- Completed steps
- Pending items
- Errors and blockers

## Best Practices

### When Creating Workflows

1. **Start simple**: Begin with 2-3 steps, expand as needed
2. **Use decision gates sparingly**: Only for major design choices
3. **Reference patterns**: Always point agents to existing code
4. **Define clear inputs/outputs**: Make dependencies explicit

### When Running Workflows

1. **Provide clear inputs**: Be specific about what you want
2. **Review at decision gates**: This is your 2% input
3. **Check progress files**: See what's happening
4. **Iterate**: Workflows can be re-run with adjustments

## Troubleshooting

### Workflow fails to start
- Check workflow ID exists in `/workflows/`
- Verify required inputs are provided

### Agent makes wrong decision
- Check agent definition in `/agents/`
- Provide more specific inputs
- Add constraints to workflow step

### Pattern not found
- Ensure `pattern_reference` points to existing code
- Check directory structure matches expected format

## Next Steps

- [Create your first workflow](../workflows/template.yaml)
- [Review agent capabilities](../agents/README.md)
- [Check existing workflows](../workflows/)
- [See example simulator additions](../../src/pages/simulators/)
