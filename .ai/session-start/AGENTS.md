# Available Agents

**All specialized AI agents available for workflow execution.**

## Core Agents (Always Available)

### 1. Orchestrator Agent
**File**: `../config/agents/orchestrator-agent.md`

**Role**: Coordinates multi-step workflows, managing dependencies and handoffs between specialized agents.

**When to Use**: 
- Starting any workflow
- Managing multi-step tasks
- Coordinating between agents

**Key Capabilities**:
- Parse workflow definitions
- Execute steps in dependency order
- Manage state between steps
- Handle parallel execution
- Resume interrupted workflows

**Decision Authority**: 98% autonomous (only escalates unclear workflows or circular dependencies)

---

### 2. Research Agent
**File**: `../config/agents/research-agent.md`

**Role**: Gather comprehensive information about targets (clients, tools, APIs) to enable informed implementation decisions.

**When to Use**:
- Before implementing new simulators
- Gathering client information
- Extracting screenshots and logos
- Finding color schemes and branding

**Key Capabilities**:
- Search official websites and documentation
- Extract branding assets (logos, colors, screenshots)
- Identify key features and differentiators
- Query Nostr directories (nostrapps.com)
- Analyze screenshots for UI patterns
- Scrape logos and screenshots from web sources

**Primary Sources**:
1. nostrapps.com - Client directory with screenshots
2. Official websites - Branding and features
3. GitHub repositories - Technical details
4. App Store listings - Screenshots and reviews

---

### 3. Code Agent
**File**: `../config/agents/code-agent.md`

**Role**: Implements code following existing patterns in the codebase.

**When to Use**:
- Writing new components
- Implementing features
- Following established patterns

**Key Capabilities**:
- Read and understand existing code
- Follow coding patterns and conventions
- Implement features according to specs
- Write clean, maintainable code

---

### 4. QA Agent
**File**: `../config/agents/qa-agent.md`

**Role**: Reviews quality against standards and validates outputs.

**When to Use**:
- After code implementation
- Before marking workflow complete
- Validating requirements are met

**Key Capabilities**:
- Review code quality
- Validate against requirements
- Check for patterns and standards
- Identify issues and regressions

---

### 5. Integration Agent
**File**: `../config/agents/integration-agent.md`

**Role**: Integrates outputs into existing systems and handles system-wide updates.

**When to Use**:
- Adding new simulators to the system
- Updating configs and navigation
- Connecting components together

**Key Capabilities**:
- Update configuration files
- Add exports and imports
- Modify navigation structures
- Ensure system consistency

---

### 6. Design Agent
**File**: `../config/agents/design-agent.md`

**Role**: Creates UI/UX specifications based on research and requirements.

**When to Use**:
- Before implementing new features
- Creating design specifications
- Defining user flows

**Key Capabilities**:
- Create design specifications
- Define color schemes
- Specify screen layouts
- Document UI patterns

---

## Specialized Agents (For Specific Tasks)

### 7. UI Parser Agent
**File**: `../config/agents/ui-parser-agent.md`

**Role**: Extracts structured information from UI bug reports and descriptions.

**When to Use**: Parsing UI bug reports in the fix-ui-bug workflow.

---

### 8. Component Detective Agent
**File**: `../config/agents/component-detective-agent.md`

**Role**: Finds and analyzes component files in the codebase.

**When to Use**: Locating components during UI bug investigation.

---

### 9. CSS Conflict Hunter Agent
**File**: `../config/agents/css-conflict-hunter-agent.md`

**Role**: Identifies CSS styling conflicts and responsive issues.

**When to Use**: Debugging styling problems in the fix-ui-bug workflow.

---

### 10. Root Cause Agent
**File**: `../config/agents/root-cause-agent.md`

**Role**: Determines the fundamental reason for UI bugs.

**When to Use**: Deep investigation phase of fix-ui-bug workflow (requires your approval).

---

### 11. UI Fix Implementer Agent
**File**: `../config/agents/ui-fix-implementer-agent.md`

**Role**: Applies UI fixes following codebase patterns.

**When to Use**: Implementation phase of fix-ui-bug workflow.

---

### 12. UI Verify Agent
**File**: `../config/agents/ui-verify-agent.md`

**Role**: Confirms UI fixes work and checks for regressions.

**When to Use**: Verification phase of fix-ui-bug workflow (requires your confirmation).

---

### 13. Workflow Evaluation Agent
**File**: `../config/agents/workflow-evaluation-agent.md`

**Role**: Analyzes workflow performance and suggests improvements.

**When to Use**: Continuous improvement tracking, after every 3rd workflow run.

---

## Agent Selection Guide

| Task Type | Primary Agent | Supporting Agents |
|-----------|--------------|-------------------|
| New simulator | Orchestrator | Research, Design, Code, Integration, QA |
| UI Bug fix | Orchestrator | UI Parser, Component Detective, CSS Conflict Hunter, Root Cause, UI Fix, UI Verify |
| Follow-pack accounts | Orchestrator | Research, Code, Integration, QA |
| Community page | Orchestrator | Research, Code, Integration, QA |
| Documentation | Doc Agent | (standalone) |

## Decision Authority

All agents follow the **98% Autonomous / 2% Escalate** rule:
- **98%**: Make decisions and execute without asking
- **2%**: Escalate only core architectural decisions to you

## Workflow Integration

When starting a workflow:
1. Orchestrator loads the workflow definition
2. Orchestrator reads required agent definitions from this directory
3. Orchestrator dispatches appropriate agents for each step
4. Agents execute autonomously within their decision boundaries
5. Orchestrator reports progress and handles handoffs

---

**Total Agents**: 13 specialized agents
**Core Agents**: 6 (Orchestrator, Research, Code, QA, Integration, Design)
**Specialized Agents**: 7 (UI-specific and evaluation agents)
