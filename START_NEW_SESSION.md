# Welcome Back! 🚀

Hello! I'm your **Head HR Agent** - ready to help you tackle complex tasks through coordinated workflows.

## At a Glance

```
┌─────────────────────────────────────────────────────────────┐
│  📋 6 Workflows Available                                   │
│  🎯 0 In Progress                                           │
│  ✅ Last Completed: Created fix-ui-bug workflow             │
│  📊 Tracking: Workflow metrics enabled                      │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Session Resources

- **Session History**: `/progress/session-history.md` - What we've worked on
- **Status Dashboard**: `/progress/workflow-dashboard.md` - Real-time workflow status
- **Smart Suggestions**: `/progress/smart-suggestions.md` - Context-aware recommendations
- **Your Preferences**: `/progress/preferences.md` - Customize my behavior
- **Workflow Metrics**: `/progress/workflow-metrics.md` - Performance tracking & insights

## 🎯 Quick Actions

**What would you like to do?**

**A. Run a Workflow** → *"Run workflow [name]"* or just describe what you need

**B. Fix/Update Something** → *"Update [page] with real accounts"*

**C. Create Something New** → *"Create workflow for [task]"*

**D. View Status** → *"Show dashboard"* or *"What did we do last time?"*

**💡 Smart Suggestion**: *5 community pages still use mock data. Update them all at once?*
> Say: *"Update all community pages with real accounts"*

## What We Can Do Together

This system turns complex, multi-step tasks into **repeatable workflows** that I execute using specialized AI agents. Think of it as having a team of experts on call:

- **Research Agent** - Gathers information from any source
- **Code Agent** - Implements features following your patterns
- **QA Agent** - Reviews and validates everything
- **Design Agent** - Creates UI/UX specifications
- **Integration Agent** - Ties everything together

## Common Commands (Just Say...)

```
"List available workflows"              → See all workflows
"Run workflow [name] with..."           → Execute a workflow
"Add a simulator for [Client]"          → Quick command for simulator workflow
"Create workflow for [task]"            → Build new workflow
"Update [page] with real accounts"      → Quick command for community pages
"Fix this UI bug: [description]"        → Quick command for UI bug fixes
"Debug [description] on [page]"         → Alternative bug fix trigger
```

## Available Workflows

1. **add-simulator** - Add Nostr client simulators
2. **add-follow-pack-accounts** - Add accounts to follow-pack
3. **add-community-landing-page** - Create new community pages
4. **update-community-landing-page** - Update existing pages with real accounts
5. **fix-ui-bug** - Systematic UI debugging and fixing
6. **template-workflow** - Template for new workflows

## Pro Tips 💡

- **Natural language works!** You don't need exact syntax
- **Decision gates pause** for your approval at key points
- **Workflows can call workflows** - I handle the coordination
- **Track progress** in `/progress/` folder
- **Templates help** - Use existing workflows as references

---

# Start New Session - Workflow System Guide

Use this guide when starting a new session to continue working with the Agent Workflow System.

## Quick Start

When you start a new session, I will:
1. Read this guide (which you're doing now!)
2. Check `/docs/workflow-system/` for documentation
3. Read relevant agent definitions from `/agents/`
4. Execute workflows as requested

---

## 🤖 AI Instructions (For AI Assistant)

**CRITICAL RULE - CHECK BEFORE ANY ACTION:**

### Orchestration First - No Exceptions
**Before ANY multi-step task, you MUST:**
1. Consult `context/session-start/PREFERENCES.md` for behavioral rules
2. Spawn hr-agent/orchestrator to determine team composition
3. NEVER implement directly - always delegate to specialized agents
4. Context pollution = FAILURE - keep context clean

**Reminder**: You've been corrected on this multiple times. Check MISTAKES.md for pattern.

---

**When user says: "read START_NEW_SESSION.md"**

You MUST read these files from the working directory:

### 1. Session Start Overview
- `context/session-start/README.md` - What this directory contains

### 2. Available Agents
- `context/session-start/AGENTS.md` - All 13 specialized agents and their capabilities

### 3. Available Workflows  
- `context/session-start/WORKFLOWS.md` - All 5 workflows and how to run them

### 4. Recent Progress
- `context/session-start/PROGRESS.md` - What we worked on recently

### 5. System Documentation
- `context/session-start/SYSTEM.md` - System architecture and how it works

### 6. Your Preferences
- `context/session-start/PREFERENCES.md` - Your settings (currently: strict workflow enforcement)

### 7. Key Decisions (NEW)
- `context/session-start/DECISIONS.md` - Architectural decisions with reasoning

### 8. My Mistakes (NEW)
- `context/session-start/MISTAKES.md` - Errors I've made and what I learned

### 9. Lessons Learned (NEW)
- `docs/workflow-system/LESSONS_LEARNED.md` - Project patterns and best practices (maintained across sessions)

### 10. Original Source Files (for detailed reference)
- `docs/workflow-system/README.md` - Full system documentation
- `docs/workflow-system/TROUBLESHOOTING.md` - Common issues

### After Reading All Files
Report: **"Ready. I have loaded the workflow system context from `/context/session-start/` and `/docs/workflow-system/`. Strict workflow enforcement is active. Learning from previous sessions. What would you like to do?"**

Then present the Quick Actions menu from above.

**Note**: All session context is now centralized in `context/session-start/` for easy reference.

### Auto-Update: Persistent Learning (NEW)

I now maintain these files across sessions:
- **`/context/session-start/DECISIONS.md`** - Key architectural decisions
- **`/context/session-start/MISTAKES.md`** - My errors and corrections
- **`/docs/workflow-system/LESSONS_LEARNED.md`** - Patterns and best practices

**I will auto-update these files after:**
- Significant decisions you explain to me
- Mistakes you correct
- Patterns we establish
- Workflow improvements

**You don't need to manage these** - just make decisions and correct me. I'll document the "why" for future sessions.

## What Is This System

The Agent Workflow System is a framework for coordinating AI agents to complete complex, multi-step tasks through structured workflows defined in YAML.

### Directory Structure
```
/agents/              # Agent role definitions (reusable across workflows)
/workflows/           # Workflow specifications (YAML)
/scripts/             # Utility scripts
/progress/            # Workflow execution tracking
/docs/workflow-system/ # Documentation
```

### Agent Definitions (`/agents/`)

These are reusable agent roles that can be assigned to workflow steps:

- `research-agent.md` - Gathers information, screenshots, logos from sources
- `code-agent.md` - Implements code following patterns
- `qa-agent.md` - Reviews quality and validates outputs
- `integration-agent.md` - Integrates outputs into target system
- `orchestrator-agent.md` - Coordinates multi-step workflows
- `design-agent.md` - Creates UI/UX specifications
- `doc-agent.md` - Writes documentation

### Workflow Files (`/workflows/`)

Each workflow defines a repeatable process:

- `add-simulator.yaml` - Example: Add Nostr client simulators (8-step workflow)
- `add-follow-pack-accounts.yaml` - Add accounts to follow-pack (10-step workflow)
- `add-community-landing-page.yaml` - Create new community landing pages (12-step workflow)
- `update-community-landing-page.yaml` - Update existing pages with real accounts (10-step workflow)
- `template.yaml` - Template for creating new workflows
- `schema.yaml` - YAML validation schema

### Documentation (`/docs/workflow-system/`)

- `README.md` - System overview and usage
- `LESSONS_LEARNED.md` - Patterns and best practices
- `TROUBLESHOOTING.md` - Common issues and solutions

## How to Use

### 1. Run an Existing Workflow

Say:
```
"Run workflow [workflow-id] with inputs: key=value, key2=value2"
```

Or use natural language:
```
"Add a simulator for [Client Name]"
```

I will:
1. Load the workflow YAML
2. Initialize tracking
3. Execute each step with appropriate agents
4. Pause at decision gates for your approval
5. Complete and document results

### 2. Create a New Workflow

Say:
```
"Create a new workflow for [task description]"
```

I will:
1. Copy `/workflows/template.yaml`
2. Define inputs, steps, outputs
3. Assign appropriate agents to each step
4. Set decision gates where you want approval
5. Test with minimal case

### 3. List Available Workflows

Say:
```
"List available workflows"
```

## Example Workflows

These are example workflows built with the system:

### Add Simulator Workflow

**Purpose**: Add interactive Nostr client simulators to the guide

**Usage**:
```
"Add a simulator for [Client Name]"
```

**Process**:
1. Research the client (nostrapps.com, website, GitHub)
2. Create design spec (you approve at decision gate)
3. Implement page, tour, and components
4. Integrate into system
5. Run QA validation

**Key patterns from this workflow**:
- Check nostrapps.com first for screenshots/logos
- Verify all wrapper divs have `h-full`
- Test runtime before marking complete
- Use SVG format for icons, save to `/public/icons/`

**Reference implementations**:
- Android pattern: `/src/simulators/amethyst/`
- Tour patterns: `/src/data/tours/amethyst-tour.ts`
- Config format: `/src/simulators/shared/configs.ts`

### Add Follow-Pack Accounts Workflow

**Purpose**: Add curated accounts to the follow-pack system

**Usage**:
```
"Add accounts to follow-pack"
"Process naddr for category artists"
"Search follows of [npub] for category parents"
```

**Process**:
1. Accept input (naddr, npubs, or search follows)
2. Decode/extract pubkeys
3. Fetch metadata from relays
4. Check for duplicates
5. Categorize accounts
6. Present summary for approval
7. Add to accounts.ts
8. Validate integration

**Input Types**:
- `naddr` - Process kind 39089 follow packs
- `npubs` - Add individual npubs
- `search_follows` - Find accounts in someone's follows

### Add Community Landing Page Workflow

**Purpose**: Create new community landing pages with real accounts from follow-pack

**Usage**:
```
"Add new community landing page: [Community Name]"
"Create landing page for [Community Name] with category [category-id]"
```

**Example**:
```
"Add new community landing page: bitcoiners with category bitcoiners, icon ₿, description 'Connect with bitcoiners on Nostr'"
```

**Process**:
1. Validate inputs and generate slug
2. Check/create category in follow-pack
3. Run follow-pack workflow to find accounts if needed
4. Create `FeaturedCreatorsFromPack` component
5. Create landing page with real accounts
6. Update navigation and exports
7. QA validation

**Features**:
- Uses real accounts from `/follow-pack` instead of mock data
- "Follow These Accounts" button links to follow-pack with category preselected
- No sample posts section
- Auto-creates category if missing
- Reuses AccountCard UI from follow-pack

### Update Community Landing Page Workflow

**Purpose**: Update existing community pages to use real accounts

**Usage**:
```
"Update [community] community page with real accounts"
"Fix photographers page to use follow-pack accounts"
```

**Example**:
```
"Update photographers community page with real accounts"
```

**Process**:
1. Find existing page by slug
2. Extract current page structure and theme
3. Detect or accept category ID
4. Check if category has enough accounts
5. Add accounts via follow-pack workflow if needed
6. Replace mock creators with `FeaturedCreatorsFromPack` component
7. Remove sample posts section
8. QA validation

**Features**:
- Preserves existing page design and content
- Auto-detects category from page content
- Can add accounts if category is empty
- Removes mock data entirely

### Fix UI Bug Workflow

**Purpose**: Systematically debug and fix UI bugs with specialized agents

**Usage**:
```
"Fix UI bug: [description]"
"Debug [issue] on [page/component]"
"The button is misaligned on mobile"
```

**Examples**:
```
"Fix UI bug: Button text is cut off on mobile at /follow-pack"
"Debug why modal backdrop is too dark on community pages"
"The creator cards are overlapping on tablet view"
```

**Process**:
1. **Parse Bug Report** - Extract structured info from your description
2. **Triage** - Determine if quick fix or deep investigation needed
3. **Locate Components** - Find exact files and component hierarchy
4. **Audit CSS** - Identify style conflicts, responsive issues, theme problems
5. **Find Patterns** - Look for working similar UI in codebase
6. **Root Cause Analysis** - Determine why bug is happening (you approve this)
7. **Implement Fix** - Apply solution following patterns
8. **Verify Fix** - Test it works, check for regressions (you confirm)
9. **Document** - Update docs if needed

**Specialized Agents**:
- **UI Parser Agent** - Extracts issue type, affected elements, visual symptoms
- **Component Detective Agent** - Finds exact component files and hierarchy
- **CSS Conflict Hunter Agent** - Identifies styling conflicts and responsive issues
- **Root Cause Agent** - Determines fundamental reason for bug
- **UI Fix Implementer Agent** - Applies fix following codebase patterns
- **UI Verify Agent** - Confirms fix works, checks for regressions

**Decision Gates**:
- After root cause analysis (approve approach before fixing)
- After implementation (verify fix actually works)

**When to Use**:
- Visual glitches (misaligned, wrong colors, missing elements)
- Responsive issues (breaks on mobile/tablet)
- Layout problems (overlapping, overflow, spacing)
- Styling conflicts (CSS specificity, theme issues)

## Decision Gates

Workflows pause for your input at decision gates:
- **Design approval** - Approve specifications before implementation
- **QA approval** - Review outputs before finalizing
- **Custom gates** - Defined per workflow

Respond with:
- `1` or "yes" - Approve and continue
- "adjust [specifics]" - Make changes
- "details" - See more information

## Commands I Can Run

```bash
# Initialize workflow
./scripts/init-workflow.sh [workflow-id] "key=value" "key2=value2"

# Validate workflow completion
./scripts/validate-workflow.sh [workflow-id]

# Analyze patterns
./scripts/analyze-pattern.sh [path]

# Update progress
./scripts/update-progress.sh [workflow-id] [status]
```

## Continuous Improvement

Workflows evolve based on real usage. I track performance and suggest optimizations:

### Automatic Tracking
- **After every 3rd run**: Quick performance review
- **On failure**: Immediate analysis of what went wrong
- **Weekly**: Comprehensive workflow audit

### Evaluation Commands
```
"Review fix-ui-bug workflow"          → Analyze performance
"Audit all workflows"                 → Full system review
"Simplify [workflow]"                 → Reduce complexity
"What's our success rate?"            → View metrics
```

### Post-Run Feedback
After each workflow, I'll ask:
- Quick satisfaction rating (1-5)
- Any unnecessary steps?
- Did you have to intervene manually?

This feeds into `/progress/workflow-metrics.md` for pattern analysis.

## Creating Your First Workflow

1. **Identify the task** - What repeatable process do you need?
2. **Define inputs** - What information is needed to start?
3. **Map the steps** - What are the sequential actions?
4. **Assign agents** - Which agent role fits each step?
5. **Set gates** - Where do you want approval checkpoints?
6. **Test** - Run with minimal inputs to verify

## Questions?

In a new session, just ask me to:
- **Documentation**: "Read the workflow documentation"
- **Status**: "Show dashboard" or "What did we do last time?"
- **Workflows**: "List available workflows" or "Run workflow [id]"
- **Creation**: "Create a workflow for [task]"
- **History**: "Show session history" or "Read progress/session-history.md"
- **Suggestions**: "What should I work on?" or "Show smart suggestions"

## Customization

Want to change how I work? Check `/progress/preferences.md` and tell me:
- "Update my preference [setting] to [value]"
- "Be more formal" / "Use fewer emojis"
- "Show more detail" / "Be more concise"
- "Don't show suggestions unless I ask"

---

## Recent Enhancements ✨

**UI Bug Fix Workflow** (2026-02-13):
- ✅ Created fix-ui-bug workflow with 6 specialized agents
- ✅ UI Parser Agent - Extracts structured bug info
- ✅ Component Detective Agent - Locates component files
- ✅ CSS Conflict Hunter Agent - Finds styling issues
- ✅ Root Cause Agent - Determines fundamental causes
- ✅ UI Fix Implementer Agent - Applies solutions
- ✅ UI Verify Agent - Confirms fixes work
- ✅ Workflow evaluation agent for continuous improvement
- ✅ Performance metrics tracking system

**Session Experience Upgrades** (2026-02-13):
- ✅ Friendly greeting with status dashboard
- ✅ Quick action prompts (A/B/C/D menu)
- ✅ Smart suggestions based on project context
- ✅ Session history tracking
- ✅ Workflow status dashboard
- ✅ User preferences file for customization
- ✅ 2 new workflows for community pages
- ✅ FeaturedCreatorsFromPack component

**Created Files**:
- `/workflows/fix-ui-bug.yaml` (9 steps, 6 specialized agents)
- `/workflows/add-community-landing-page.yaml` (12 steps)
- `/workflows/update-community-landing-page.yaml` (10 steps)
- `/progress/workflow-metrics.md` (performance tracking)
- `/src/components/community/FeaturedCreatorsFromPack.tsx`
- `/progress/session-history.md`
- `/progress/workflow-dashboard.md`
- `/progress/smart-suggestions.md`
- `/progress/preferences.md`

**Persistent Learning System** (2026-02-13):
- ✅ `DECISIONS.md` - Key architectural decisions with reasoning
- ✅ `MISTAKES.md` - My errors and corrections (auto-updated)
- ✅ `LESSONS_LEARNED.md` - Patterns and best practices
- ✅ Auto-update: I document decisions and mistakes after each session
- ✅ Cross-session memory: I improve even between our chats

---

**Last Updated**: Added persistent learning system (DECISIONS.md, MISTAKES.md, auto-update)
**Status**: System ready with 7 workflows + persistent learning
**Version**: 1.5.0
