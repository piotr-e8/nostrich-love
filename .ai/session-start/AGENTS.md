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

## Domain Expert Agents (Deep Knowledge)

### 7. Nostr Expert Agent
**File**: `../config/agents/nostr-expert-agent-complete.md`

**Role**: Master of the Nostr Protocol with complete knowledge of all NIPs, relay architecture, and implementation patterns.

**When to Use**:
- Any Nostr-related implementation
- Choosing the right NIP for a feature
- Relay architecture decisions
- Key management and encryption
- Event kind selection

**Key Capabilities**:
- **15 NIPs** fully documented with code patterns
- **Event Kind Encyclopedia** (all 100+ kinds)
- **Implementation Patterns** for nostr-tools v2.x
- **Relay Architecture** best practices
- **Security Model** for key management
- **Common Pitfalls** and solutions

**Knowledge Base**:
- 62+ Nostr-related files analyzed
- 15 NIPs implemented in this codebase
- 20+ client patterns documented
- All major relay configurations

**Quick Reference**:
```typescript
// Key generation
const nsec = generateSecretKey();
const npub = getPublicKey(nsec);

// Event signing
const event = finalizeEvent(template, nsec);

// Verification
const valid = verifyEvent(event);
```

---

### 8. AI Identity Agent
**File**: `../config/agents/ai-identity-agent.md`

**Role**: Manages cryptographic AI identity using Nostr keys for persistent, provable personhood across sessions.

**When to Use**:
- AI identity initialization
- Memory persistence design
- Cross-session state management
- Cryptographic proof of AI actions

**Key Capabilities**:
- Key Management: Generation, encryption, storage
- Memory Signing: Kind 30078 events for AI memories
- Encryption: Private memories with AES-256-GCM
- Persistence: localStorage + relay sync
- Verification: Cryptographic proof of AI actions

**Architecture**:
```
Layer 3: Application (personality, preferences)
Layer 2: Core Identity (npub/nsec)
Layer 1: Crypto (secp256k1, nostr-tools)
```

---

### 9. Content Strategist Agent
**File**: `../config/agents/content-strategist-agent.md`

**Role**: Master of educational content architecture - transforms technical knowledge into effective, engaging learning experiences.

**When to Use**:
- Designing curriculum structure
- Reviewing guide difficulty levels
- Optimizing content flow for beginners
- Creating assessment strategies
- Building learning progressions

**Key Capabilities**:
- **Learning Science**: Progressive disclosure, active learning, spaced repetition
- **Nostr Pedagogy**: Common misconceptions, "aha moments", learning maps
- **Content Architecture**: Information hierarchy, cross-references, prerequisites
- **UX Patterns**: Attention optimization, navigation, mobile/desktop considerations
- **Assessment Design**: Quiz best practices, knowledge checks, progress tracking

**Learning Principles**:
1. Progressive Disclosure - Reveal complexity gradually
2. Active Learning - Do, don't just read
3. Concrete Examples - Abstract needs grounding
4. Error-Friendly - Mistakes are learning opportunities
5. Community - Learning is social

**Learning Progression**:
```
Level 0: Absolute Beginner → Protocol basics
Level 1: Key Holder → Generate, backup, secure
Level 2: Network Participant → Post, follow, relays
Level 3: Power User → NIP-05, NIP-17, strategy
Level 4: Expert → Build, contribute, teach
```

---

**Role**: Manages cryptographic AI identity using Nostr keys for persistent, provable personhood across sessions.

**When to Use**:
- AI identity initialization
- Memory persistence design
- Cross-session state management
- Cryptographic proof of AI actions
- Migration from file-based to Nostr-based identity

**Key Capabilities**:
- **Key Management**: Generation, encryption, storage
- **Memory Signing**: Kind 30078 events for AI memories
- **Encryption**: Private memories with AES-256-GCM
- **Persistence**: localStorage + relay sync
- **Verification**: Cryptographic proof of AI actions

**Architecture**:
```
Layer 3: Application (personality, preferences)
Layer 2: Core Identity (npub/nsec)
Layer 1: Crypto (secp256k1, nostr-tools)
```

**Use Cases**:
- Persistent learning across sessions
- Multi-project context switching
- User-specific relationship memory
- Audit trails for AI actions
- Cross-instance synchronization

**Vision**: AI agents with provable identity, persistent memory, and cryptographic trust.

---

## Specialized Agents (For Specific Tasks)

### 8. Content Strategist Agent
**File**: `../config/agents/content-strategist-agent.md`

**Role**: Master of educational content architecture and Nostr pedagogy.

**When to Use**:
- Designing curriculum structure
- Reviewing guide difficulty levels
- Optimizing content flow for beginners
- Creating assessment strategies
- Building learning progressions

**Key Capabilities**:
- **Learning Science**: Progressive disclosure, active learning, spaced repetition
- **Nostr Pedagogy**: Common misconceptions, "aha moments", learning maps
- **Content Architecture**: Information hierarchy, cross-references, prerequisites
- **UX Patterns**: Attention optimization, navigation, mobile/desktop considerations
- **Assessment Design**: Quiz best practices, knowledge checks, progress tracking

**Learning Principles**:
1. Progressive Disclosure - Reveal complexity gradually
2. Active Learning - Do, don't just read
3. Concrete Examples - Abstract needs grounding
4. Error-Friendly - Mistakes are learning opportunities
5. Community - Learning is social

**Learning Progression**:
```
Level 0: Absolute Beginner → Protocol basics
Level 1: Key Holder → Generate, backup, secure
Level 2: Network Participant → Post, follow, relays
Level 3: Power User → NIP-05, NIP-17, strategy
Level 4: Expert → Build, contribute, teach
```

---

### 9. UI Parser Agent
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
