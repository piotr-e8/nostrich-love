# Rule Documentation Template

> **When to use this:** Creating new rule documentation files for the nostrich.love project.

This template ensures consistency across all rule files. Each section serves a specific purpose in helping agents quickly understand and apply the knowledge.

**Note:** These are **Agent Rules** (project-specific documentation), not OpenCode **Skills** (which use the `skill` tool and have a different format). See `AGENTS.md` for the distinction.

---

## Template Structure (9 Sections)

Copy this structure for each new skill file:

```markdown
# [Skill Name]

> **Load this skill when:** [One-line description of when to use this skill]

## 1. Quick Reference

**One-line summary:** [What this skill covers in 10 words or less]

**Essential commands:**
```bash
# Most useful command 1
command-here

# Most useful command 2
command-here
```

---

## 2. Architecture Overview

**What this system does:** [2-3 sentence description]

**Key components:**
- Component A - What it does
- Component B - What it does
- Component C - What it does

**How data flows:** [Simple description of the flow]

---

## 3. Common Patterns (3-5 examples)

### Pattern 1: [Pattern Name]

**When to use:** [Context]

**Example:**
```typescript
// Code example here
```

**Key points:**
- Important detail 1
- Important detail 2

### Pattern 2: [Pattern Name]

**When to use:** [Context]

**Example:**
```typescript
// Code example here
```

### Pattern 3: [Pattern Name]

**When to use:** [Context]

**Example:**
```typescript
// Code example here
```

---

## 4. Critical Rules

**⚠️ These mistakes cause bugs:**

| Mistake | Why It's Wrong | Correct Way |
|---------|----------------|-------------|
| Wrong pattern A | Explanation | Correct pattern |
| Wrong pattern B | Explanation | Correct pattern |
| Wrong pattern C | Explanation | Correct pattern |

**Red flags to watch for:**
- [ ] Symptom 1 → Check: [what to verify]
- [ ] Symptom 2 → Check: [what to verify]
- [ ] Symptom 3 → Check: [what to verify]

---

## 5. Workflow

### Task: [Common Task Name]

**Step-by-step:**

1. **Step name**
   - Action to take
   - Verification: How to check it worked

2. **Step name**
   - Action to take
   - Verification: How to check it worked

3. **Step name**
   - Action to take
   - Verification: How to check it worked

4. **Final verification:**
   ```bash
   command-to-verify
   ```

---

## 6. Common Mistakes & Fixes

### Mistake: [Name]

**Symptoms:**
- What goes wrong
- Error message or behavior

**Root cause:**
Brief explanation of why this happens

**Fix:**
```typescript
// Before (wrong)
wrong-code-example

// After (correct)
correct-code-example
```

### Mistake: [Name]

**Symptoms:**
- What goes wrong

**Fix:**
Brief description and code example

---

## 7. Validation Checklist

Before completing work in this domain:

- [ ] Verification item 1
- [ ] Verification item 2
- [ ] Verification item 3
- [ ] Verification item 4
- [ ] Run: `npm run build` (no errors)
- [ ] No console warnings about this domain

---

## 8. Integration with Other Skills

**Related skills:**
- **[SKILL_NAME.md]** - How it relates to this skill
- **[SKILL_NAME.md]** - How it relates to this skill

**Skill combinations:**
- **Task A:** Load SKILL_A + SKILL_B
- **Task B:** Load SKILL_A + SKILL_C

---

## 9. Reference

### Type Definitions

```typescript
// Key TypeScript interfaces
interface ExampleInterface {
  property: string;
  method(): void;
}
```

### Key Terminology

- **Term A** - Definition
- **Term B** - Definition
- **Term C** - Definition

### File Locations

- `/path/to/file-a` - Purpose
- `/path/to/file-b` - Purpose

---

*Last Updated: [Date]*
*Purpose: [One-line purpose]*
*Status: [draft/stable/deprecated]*
*Next Review: [Date]*
```

---

## Special-Purpose Checklists

### Component Validation Checklist

**When creating new React components (especially quizzes):**

```markdown
## Component Validation

Before completing component:

- [ ] Found reference component (e.g., WhatIsNostrQuiz.tsx)
- [ ] Copied exact color patterns (`success-500` not `green-500`)
- [ ] Matched button styling (`rounded-xl shadow-md hover:shadow-lg`)
- [ ] Matched animation variants (slideVariants, optionVariants)
- [ ] Used semantic icons (not letters) via renderOptionIcon()
- [ ] Matched HTML structure (header, footer, main)
- [ ] Component is under 600 lines
- [ ] Props interface matches reference pattern
- [ ] Exports follow same pattern (default vs named)
- [ ] Run: `npm run build` (no errors)
```

### Learning Path Integration Checklist

**When adding new guides:**

```markdown
## Learning Path Integration

Before completing guide addition:

- [ ] Position determined in learning-paths.ts
- [ ] Added to appropriate skill level sequence (beginner/intermediate/advanced)
- [ ] Metadata added to `/src/pages/en/guides/index.astro`
- [ ] Metadata added to `/src/pages/pl/guides/index.astro`
- [ ] Metadata added to `/src/pages/es/guides/index.astro`
- [ ] Metadata added to `/src/pages/de/guides/index.astro`
- [ ] English MDX created: `/src/content/guides/en/guide-name.mdx`
- [ ] Polish MDX created: `/src/content/guides/pl/guide-name.mdx`
- [ ] Spanish MDX created: `/src/content/guides/es/guide-name.mdx`
- [ ] German MDX created: `/src/content/guides/de/guide-name.mdx`
- [ ] Translations added to `en.json`
- [ ] Translations added to `pl.json`
- [ ] Translations added to `es.json`
- [ ] Translations added to `de.json`
- [ ] Guide links use locale prefix (`/en/guides/...`)
- [ ] Run: `npm run build` (no errors)
- [ ] Navigation (prev/next) verified manually
```

**Total files for complete guide: 9 minimum (1 learning path + 4 metadata + 4 MDX)**

---

## Section Guidelines

### Section 1: Quick Reference
**Purpose:** 30-second scan for context
**Length:** 5-10 lines
**Must include:**
- One-line summary
- 2-3 essential commands
- Line count for quick sizing

### Section 2: Architecture Overview
**Purpose:** Mental model of how it works
**Length:** 10-20 lines
**Must include:**
- What the system does
- Key components
- Data flow

### Section 3: Common Patterns
**Purpose:** Copy-paste ready examples
**Length:** 30-50 lines per pattern
**Must include:**
- 3-5 concrete patterns
- Code examples
- When to use each

### Section 4: Critical Rules
**Purpose:** Prevent common mistakes
**Length:** 20-30 lines
**Must include:**
- Table of mistakes vs corrections
- Red flag checklist

### Section 5: Workflow
**Purpose:** Step-by-step process
**Length:** 20-40 lines
**Must include:**
- Numbered steps
- Verification at each step
- Final check command

### Section 6: Mistakes & Fixes
**Purpose:** Troubleshooting guide
**Length:** 30-50 lines
**Must include:**
- Symptoms to recognize
- Root cause explanation
- Before/after code

### Section 7: Validation Checklist
**Purpose:** Pre-completion verification
**Length:** 10-15 lines
**Must include:**
- 5-8 checklist items
- Build verification

### Section 8: Integration
**Purpose:** How this skill connects to others
**Length:** 10-20 lines
**Must include:**
- Related skills list
- Common combinations

### Section 9: Reference
**Purpose:** Deep details and lookup
**Length:** 20-40 lines
**Must include:**
- Type definitions
- Terminology
- File locations

---

## Style Guidelines

### Writing Style
- **Concise:** Every line should earn its place
- **Action-oriented:** Use imperatives ("Run", "Check", "Add")
- **Specific:** Avoid "etc", "various", "some" - be precise
- **Consistent:** Same terminology throughout

### Code Examples
- Use real code from the project when possible
- Include comments explaining the "why"
- Show wrong vs right patterns side by side

### Formatting
- Use `code blocks` for file paths, commands, code
- Use **bold** for important warnings and actions
- Use tables for comparisons (mistake vs fix)
- Use emojis sparingly: ⚠️ 🎯 ✅ ❌

### Length Targets
- **Total file:** 250-400 lines
- **Per section:** See guidelines above
- **If over 400 lines:** Consider splitting into multiple skills

---

## Examples from Existing Skills

### Good Quick Reference (from I18N_PATTERNS.md):
```markdown
## Quick Reference

```bash
# Check translation completeness
jq -S 'paths' src/i18n/locales/en.json | sort > /tmp/en_paths.txt && \\
  jq -S 'paths' src/i18n/locales/pl.json | sort > /tmp/pl_paths.txt && \\
  diff /tmp/en_paths.txt /tmp/pl_paths.txt
```
```

### Good Mistake Pattern (from RULES.md):
```markdown
| Red Flag | Corrective Action |
|----------|-------------------|
| "Let me create 5 files at once" | STOP. Create 1 file, verify, then next. |
| >3 files OR >100 lines changed | BREAK into smaller independent tasks |
```

### Good Architecture Description (from NOSTR_KNOWLEDGE.md):
```markdown
**Event Structure (NIP-01):**
```json
{
  "id": "<32-bytes sha256 hash of serialized event>",
  "pubkey": "<32-bytes hex public key>",
  ...
}
```

**Serialization Rules:**
- Must use canonical JSON (no extra whitespace)
- UTF-8 encoding only
```

---

## Meta Information

**For this template file:**
- *Last Updated: March 2026*
- *Purpose: Standardize rule file structure*
- *Status: stable*
- *Next Review: When creating next rule file*

**Rule File Naming:**
- Use UPPERCASE_WITH_UNDERSCORES.md
- Match the section names in RULES.md Reference Documentation
- Keep names descriptive but concise

**When to Create New Rule Files:**
- Domain is complex (>3 common mistakes)
- Requires specialized knowledge (Nostr protocol, teaching methods)
- Used frequently (i18n patterns)
- Differs significantly from existing rule files

**When NOT to Create New Rule Files:**
- Information fits in existing rule file
- Only used for one specific task
- Can be covered in 20 lines
- Overlaps significantly with existing rule file

---

## Integration with Project Documentation

After creating a new rule file:

1. Add to **Quick Rule Selector** table in RULES.md
2. Add to **Reference Documentation** section in AGENTS.md
3. Update line count in Quick Reference
4. Reference back to AGENTS.md and RULES.md in Integration section

**Current rule file inventory:**
- AGENTS.md (critical rules, ~100 lines, loaded automatically)
- RULES.md (detailed workflows, ~400 lines)
- NOSTR_KNOWLEDGE.md (Nostr protocol)
- TEACHING_METHODS.md (pedagogy)
- I18N_PATTERNS.md (core i18n patterns)
- I18N_REFERENCE.md (complete key reference)
- CONTENT_TRANSLATION.md (language-specific translation)
- RULES_TEMPLATE.md (this file)

---

*Last Updated: March 2026*
*Purpose: Template for creating consistent rule files*
*Status: stable*
*Next Review: After creating 3+ rule files using this template*

## Changelog

**March 2026 - Renamed from SKILL_TEMPLATE.md to RULES_TEMPLATE.md:**
- Updated all references from "skills" to "rules" to match opencode terminology
- Clarified distinction between Agent Rules vs OpenCode Skills
- Updated file references (SKILLS.md → RULES.md, etc.)
- Added note about AGENTS.md being the main critical rules file

**March 2026 - Outbox Model Test Learnings:**
- Added Component Validation Checklist (for quiz/components)
- Added Learning Path Integration Checklist (for guides)
- Documented 9-file minimum for complete guide addition
- Emphasized reference component comparison pattern
