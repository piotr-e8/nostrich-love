# Project Decisions

**Key architectural and workflow decisions with reasoning.**

This file tracks important decisions made during the project so I understand the "why" behind patterns and can make better choices in future sessions.

---

## Workflow Enforcement

### 2026-02-13: Always Use Workflows
**Decision**: ALL bug fixes and multi-step tasks must go through workflows, no exceptions.

**Context**: Fixed follow-pack URL parsing bug directly without workflow.

**Your Feedback**: "Always use workflows - no exceptions for 'simple' bugs"

**Reasoning**:
- Workflows ensure consistency and quality
- Even "simple" bugs may have complexity we miss
- Provides audit trail and documentation
- Forces proper analysis instead of quick fixes

**Implementation**:
- Created `fix-code-logic` workflow for data/logic bugs
- `fix-ui-bug` for visual/UI bugs only
- Strict enforcement - no direct fixes

---

## Bug Classification

### 2026-02-13: Logic vs UI Bugs
**Decision**: Separate workflows for different bug types.

**Rule**:
- **fix-ui-bug**: CSS, layout, responsive, visual glitches
- **fix-code-logic**: Data flow, state, parsing, configuration, API issues

**Example**:
- URL not parsing correctly → `fix-code-logic` (logic issue)
- Button misaligned → `fix-ui-bug` (UI issue)

---

## Static Site Architecture

### 2026-02-13: URL Parameter Handling
**Decision**: Client-side only for URL params in static sites.

**Context**: Used `Astro.url.searchParams` in `output: "static"` mode - always returns empty.

**Solution**:
```typescript
// WRONG - server-side in static
const category = Astro.url.searchParams.get('category');

// CORRECT - client-side
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
}, []);
```

**Remember**: Check `astro.config.mjs` output mode before using server features.

---

## File Naming Conventions

### 2026-02-13: Community Pages
**Pattern**: `nostr-for-[community].astro`

**Examples**:
- `nostr-for-artists.astro`
- `nostr-for-photographers.astro`

---

## Component Architecture

### FeaturedCreatorsFromPack Pattern
**Decision**: Use real accounts from follow-pack, never mock data.

**Requirements**:
- Accept `categoryId`, `maxDisplay`, `followPackUrl` props
- Filter from `curatedAccounts` by category
- Link to `/follow-pack?category=X` with preselection
- Handle empty states gracefully

---

## Agent Team Approach

### 2026-02-13: Multi-Agent for All Tasks
**Decision**: Never use single agent for complex tasks.

**Wrong**:
```
"Act as code-agent and implement all 7 phases"
```

**Correct**:
```
component-detective → analyze
ui-parser → create spec
code-agent → implement
ui-fix-implementer → fix UI
qa-agent → validate
integration-agent → finalize
```

---

## Add to This File

**When to add entries**:
- You explain "why" we do something
- Architecture decisions
- Workflow patterns that work/don't work
- Corrections to my assumptions

**Format**:
```markdown
### YYYY-MM-DD: Title
**Decision**: [What we decided]

**Context**: [Why we made this choice]

**Your Feedback**: [Direct quotes if applicable]

**Reasoning**: [The logic behind it]

**Implementation**: [How it affects code]
```
