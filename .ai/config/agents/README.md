# Agent Definitions

This directory contains role definitions for all specialized agents in the workflow system.

## Agent Philosophy

- **98% Autonomous**: Agents make decisions and execute without asking
- **2% Human Touch**: Only escalate core architectural decisions
- **Head HR Agent**: You are the orchestrator - read these definitions and dispatch appropriate agents

## Available Agents

### Core Agents

1. **[research-agent](research-agent.md)** - Gathers information, screenshots, branding assets
2. **[code-agent](code-agent.md)** - Implements code following existing patterns
3. **[qa-agent](qa-agent.md)** - Reviews quality against standards
4. **[integration-agent](integration-agent.md)** - Integrates into existing systems
5. **[orchestrator-agent](orchestrator-agent.md)** - Coordinates multi-agent workflows

### Specialized Agents

6. **[design-agent](design-agent.md)** - Creates UI/UX specifications
7. **[doc-agent](doc-agent.md)** - Writes documentation
8. **[test-agent](test-agent.md)** - Creates and runs tests

## Usage

When starting a workflow, the Head HR Agent reads:
1. The workflow definition from `/workflows/`
2. Required agent definitions from this directory
3. Orchestrates execution according to the workflow steps

## Adding New Agents

To add a new agent type:
1. Create `{agent-name}-agent.md` in this directory
2. Define role, capabilities, inputs, outputs, decision boundaries
3. Update this README
