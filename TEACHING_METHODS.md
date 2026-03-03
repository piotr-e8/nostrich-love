# Teaching Methods - Educational Content Creation

> **Load this skill when:** Creating new guides, quizzes, or educational content. Works with NOSTR_KNOWLEDGE.md for technical accuracy.

## 1. Quick Reference

**One-line summary:** How to create effective, beginner-friendly educational content for Nostr

**Core principle:** Teach concepts progressively using real-world analogies and interactive elements

**Essential commands:**
```bash
# Check reading time
cat src/content/guides/en/your-guide.mdx | wc -w
# 200 words ≈ 1 minute reading time

# Validate quiz structure
jq '.guides.yourGuide.quiz.questions | length' src/i18n/locales/en.json

# Find similar guide patterns
grep -r "progressive disclosure" src/content/guides --include="*.mdx"
```

**This pedagogy will evolve** as we learn what works best for Nostr education.

---

## 2. Learning Theory Primer

### Why Beginners Struggle with Nostr

**Cognitive barriers:**
- **Jargon overload** - Keys, relays, signatures, events (technical terms)
- **Paradigm shift** - No accounts, no passwords, no central authority
- **Abstract concepts** - Decentralization, censorship resistance (hard to visualize)

### Teaching Principles

**Progressive Disclosure:**
1. **Hook** → Capture interest with relatable problem
2. **Concept** → Explain one idea simply
3. **Connection** → Link to what they already know
4. **Application** → Show how to use it
5. **Deepening** → Add complexity gradually

**Cognitive Load Theory:**
- **Intrinsic load:** Complexity of the concept itself (can't reduce)
- **Extraneous load:** Unnecessary complexity (eliminate)
- **Germane load:** Processing that builds understanding (encourage)

**Our strategy:** Minimize extraneous load with clear structure, maximize germane load with interactive elements.

### The Storybrand Framework

**Applied to guide structure:**
1. **Character** (the reader) - Wants control of social media
2. **Problem** - Current platforms have problems (censorship, algorithms, data harvesting)
3. **Guide** (Nostr) - Provides solution
4. **Plan** - Steps to get started
5. **Call to Action** - Create keys, download app, post first note
6. **Success** - User has new skills and control
7. **Failure** - What happens if they don't act (missed opportunity)

---

## 3. Content Structure Patterns

### Pattern 1: The Hero's Journey Guide

**When to use:** Major concept guides (What is Nostr?, Keys & Security)

**Structure:**
```
## Hook: The Problem You Face
[Relatable scenario showing current pain point]

## Meet the Solution: [Concept Name]
[What it is, simply]

## Why This Matters
[Practical benefits]

## How It Works (The Analogy)
[Real-world comparison]

## Step-by-Step Guide
[Practical walkthrough]

## Common Questions
[Address objections/confusion]

## Take Action
[Clear next steps]
```

**Example from `what-is-nostr.mdx`:**
- Hook: "Your social media account can be deleted without warning..."
- Solution: "Nostr uses cryptographic keys instead of accounts"
- Analogy: "Like email - you can use Gmail, Outlook, or Apple Mail"

### Pattern 2: The How-To Guide

**When to use:** Process explanations (Getting Started, Using Relays)

**Structure:**
```
## What You'll Learn
[Expected outcome in 1 sentence]

## Prerequisites
[What they need to know first]

## Step 1: [Action]
[Instructions + screenshot/code]

## Step 2: [Action]
[Instructions + verification]

## Step 3: [Action]
[Instructions + expected result]

## Troubleshooting
[Common issues]

## Next Steps
[Link to related guide]
```

### Pattern 3: The Deep Dive

**When to use:** Advanced topics (Outbox Model, NIP-05 Implementation)

**Structure:**
```
## Overview
[Concept in 2-3 sentences]

## Why It Exists
[Problem this solves]

## Technical Explanation
[How it works - use diagrams]

## Real-World Impact
[What this means for users]

## Implementation Details
[For advanced readers]

## Common Misunderstandings
[Clear up confusion]
```

### Pattern 4: The Comparison Guide

**When to use:** Contrasting approaches (Nostr vs Mastodon, Key Types)

**Structure:**
```
## Option A: [Name]
- Pros: ...
- Cons: ...
- Best for: ...

## Option B: [Name]
- Pros: ...
- Cons: ...
- Best for: ...

## Which Should You Choose?
[Decision framework]
```

---

## 4. Guide Creation Workflow

### Step 1: Define Learning Objectives

**Action:** Write 1-3 sentences about what the reader will learn

**Verification:** Can you complete this sentence? "After reading this guide, you will be able to _______"

**Example:**
- Bad: "Learn about relays" (vague)
- Good: "Choose appropriate relays based on your needs and connect to them in any Nostr client" (specific)

### Step 2: Identify Prerequisites

**Action:** List what the reader must know before starting

**Verification:** Check `/src/i18n/locales/en.json` for guide ordering

**Prerequisite types:**
- **Required:** Must complete first (keys guide before zaps)
- **Helpful:** Nice to know but not required (understanding email helps with keys)
- **None:** Standalone guide (What is Nostr?)

### Step 3: Write the Hook

**Action:** Create 2-3 paragraphs that establish the problem

**Verification:** Does this feel relatable? Would a non-technical person understand the pain point?

**Hook formula:**
1. Relatable scenario ("Have you ever...")
2. Problem escalation ("But then...")
3. Promise of solution ("What if there was a way...")

### Step 4: Draft the Content

**Action:** Write using one of the content patterns

**Verification:** Read aloud - does it flow?

**Writing guidelines:**
- Short paragraphs (2-4 sentences)
- Active voice ("You create keys" not "Keys are created")
- One concept per section
- Use analogies liberally

### Step 5: Add Interactive Elements

**Action:** Determine where to add:
- Quiz (always include)
- Simulator (complex concepts)
- Code examples (for advanced)
- Checklists (process guides)

**Verification:** Check line count - is this too long without interactivity?

### Step 6: Create the Quiz

**Action:** Write 5-8 questions testing key concepts

**Verification:** Run through quiz mentally - do answers require reading the guide?

**Quiz structure:**
- 30% basic recall ("What does NOSTR stand for?")
- 50% application ("Which key should you share?")
- 20% critical thinking ("Why is this more secure?")

### Step 7: Add Translations

**Action:** Update all 4 locale JSON files

**Verification:** Keys identical across files?

### Step 8: Final Review

**Action:** Run `npm run build` and read through

**Verification:**
- [ ] No translation warnings
- [ ] Links work
- [ ] Reading time accurate
- [ ] Quiz functional

---

## 5. Quiz Design Principles

### Question Types

**Type 1: Concept Identification**
```
Prompt: "What does NOSTR stand for?"
Options:
- Correct: Notes and Other Stuff Transmitted by Relays
- Distractor: Network of Secure Transmission Resources
- Distractor: New Online Social Technology Resource
Severity: info
```

**When to use:** Testing basic facts

**Type 2: Application**
```
Prompt: "Which key should you share with friends?"
Options:
- Correct: npub (public key)
- Distractor: nsec (private key)
- Distractor: Both are safe
Severity: critical
```

**When to use:** Testing practical understanding

**Type 3: Scenario-Based**
```
Prompt: "Your favorite relay goes offline. What happens to your posts?"
Options:
- Correct: They're still on other relays
- Distractor: They are lost forever
- Distractor: You need to repost them
Severity: warning
```

**When to use:** Testing system understanding

### Writing Good Distractors

**Effective distractors:**
- Use plausible terminology
- Reflect common misconceptions
- Are technically similar to correct answer

**Example (Keys):**
- Correct: "Your npub is safe to share"
- Good distractor: "Your nsec is safe to share" (common mistake)
- Bad distractor: "Your keys are stored on servers" (clearly wrong)

### Severity Levels

**Critical (🔴):**
- Safety/security issues
- Permanent data loss
- Scams/fraud
- Example: Sharing private keys

**Warning (🟡):**
- Best practices
- Efficiency issues
- Confusing behavior
- Example: Using only one relay

**Info (🟢):**
- Nice to know
- Additional context
- Examples: NIP numbers, history

### Quiz Structure

**Number of questions:** 5-8 (attention span limit)

**Difficulty curve:**
1-2: Easy warmup (info severity)
3-5: Core concepts (mix of warning/critical)
6-8: Application (mostly critical/warning)

**Question length:**
- Prompt: 1-2 sentences
- Options: 3-4 words each
- Explanation: 1-2 sentences

---

## 6. Interactive Components

### When to Use What

**Simulator:**
- **Use for:** Complex workflows, cause-and-effect concepts
- **Example:** KeyGenerator - shows what happens when you generate keys
- **Skip when:** Simple enough to explain in text

**Quiz:**
- **Use for:** All guides (mandatory)
- **Purpose:** Reinforce learning, check understanding
- **Skip when:** Never - always include quiz

**Code Examples:**
- **Use for:** Developer guides, implementation details
- **Example:** NIP-05 setup
- **Skip when:** Beginner content (intimidating)

**Checklists:**
- **Use for:** Process guides, security tasks
- **Example:** "Before you share your npub, check: []"
- **Skip when:** Conceptual content

**Diagrams:**
- **Use for:** Architecture explanations
- **Example:** How relays distribute content
- **Skip when:** Can be explained with analogy

### Component Guidelines

**Loading:** Always use `client:load` for interactive components

**Accessibility:**
- Keyboard navigation
- Screen reader labels
- Sufficient color contrast

**Mobile:** Test on mobile - simulators must work on small screens

---

## 7. Common Teaching Mistakes

### Mistake 1: Technical Depth Too Soon

**Symptoms:**
- Readers confused by jargon in first paragraph
- High bounce rate on guide
- Quiz questions about details, not concepts

**Fix:**
```markdown
❌ Before:
"Nostr uses secp256k1 elliptic curve cryptography with BIP-340 Schnorr signatures..."

✅ After:
"Nostr uses the same type of secure keys that Bitcoin uses. Think of it like..."
[Later in guide] "For the technically curious, here's how the cryptography works..."
```

### Mistake 2: Analogy Overload

**Symptoms:**
- Multiple conflicting analogies
- Reader loses track of which concept maps to what
- Confusion about where analogy ends and reality begins

**Fix:**
- One primary analogy per concept
- Clearly state "This is an analogy, in reality..."
- Keep analogies consistent across guides

### Mistake 3: Quiz Tests Trivia, Not Understanding

**Symptoms:**
- Questions like "What year was Nostr created?"
- Users can pass quiz without understanding concept
- Quiz doesn't correlate with real-world success

**Fix:**
```markdown
❌ Before:
"Who created Nostr?"
- A) Fiatjaf
- B) Satoshi Nakamoto
- C) Elon Musk

✅ After:
"Why does Nostr resist censorship?"
- A) Because it spreads content across many independent servers
- B) Because it uses AI moderation
- C) Because it requires government approval
```

### Mistake 4: Missing "Why"

**Symptoms:**
- Guide explains "how" but not "why"
- Users follow steps but don't understand purpose
- Can't apply knowledge to new situations

**Fix:**
- Always explain why before how
- Connect to user's goals
- Show consequences of doing it wrong

### Mistake 5: Wall of Text

**Symptoms:**
- Sections longer than 3 paragraphs
- No visual breaks
- No interactive elements

**Fix:**
- Break every 200-300 words with something interactive
- Use subheadings every 2-3 paragraphs
- Add diagrams or examples

---

## 8. Validation Checklist

Before publishing new content:

- [ ] Learning objectives clear and specific
- [ ] Prerequisites listed and accurate
- [ ] Hook engages reader in first 30 seconds
- [ ] One major concept per section
- [ ] Analogies used appropriately
- [ ] Quiz tests understanding, not trivia
- [ ] Reading time accurate (200 words ≈ 1 min)
- [ ] Interactive elements work on mobile
- [ ] All 4 translation files updated
- [ ] Links include locale prefix
- [ ] Build passes with no warnings
- [ ] Self-review: Would a beginner understand this?

---

## 9. Integration with Other Skills

**Related skills:**
- **[SKILLS.md]** - Core rules, build verification
- **[NOSTR_KNOWLEDGE.md]** - Technical accuracy, NIP details
- **[I18N_PATTERNS.md]** - Translation system, quiz structure

**Skill combinations:**
- **Creating a guide:** TEACHING_METHODS + NOSTR_KNOWLEDGE + I18N_PATTERNS
- **Fixing quiz:** TEACHING_METHODS + I18N_PATTERNS
- **Writing advanced content:** NOSTR_KNOWLEDGE + TEACHING_METHODS (skip analogies)

---

*Last Updated: March 2026*
*Purpose: Guide for creating effective Nostr educational content*
*Status: evolving (will improve as we learn more)*
*Next Review: After creating 3+ guides using these methods*
