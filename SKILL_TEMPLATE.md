# Skill Template

> **When to use this:** Creating new companion skill files for the nostrich.love project.

This template ensures consistency across all skill files. Each section serves a specific purpose in helping agents quickly understand and apply the knowledge.

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

### Good Mistake Pattern (from SKILLS.md):
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
- *Purpose: Standardize skill file structure*
- *Status: stable*
- *Next Review: When creating next skill*

**Skill File Naming:**
- Use UPPERCASE_WITH_UNDERSCORES.md
- Match the section names in SKILLS.md Companion Skills
- Keep names descriptive but concise

**When to Create New Skills:**
- Domain is complex (>3 common mistakes)
- Requires specialized knowledge (Nostr protocol, teaching methods)
- Used frequently (i18n patterns)
- Differs significantly from existing skills

**When NOT to Create New Skills:**
- Information fits in existing skill
- Only used for one specific task
- Can be covered in 20 lines
- Overlaps significantly with existing skill

---

## Integration with SKILLS.md

After creating a new skill:

1. Add to **Quick Skill Selector** table in SKILLS.md
2. Add to **Companion Skills** section in SKILLS.md
3. Update line count in Quick Reference
4. Reference back to SKILLS.md in Integration section

---

*Last Updated: March 2026*
*Purpose: Template for creating consistent skill files*
*Status: stable*
*Next Review: After creating 3+ skills using this template*
