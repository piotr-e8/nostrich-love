# Nostrich.love Agent Rules

> **Agent Rules** provide detailed project workflows, patterns, and reference documentation. Load these files on-demand based on your specific task. For the critical rules that apply to every session, see `AGENTS.md` in the project root.

## Project Overview

**Nostrich.love** is a beginner-friendly educational platform for learning Nostr (Notes and Other Stuff Transmitted by Relays), a decentralized social media protocol. The site uses gamification, interactive components, and progressive learning paths to help users go from complete beginners to advanced Nostr users.

**Core Philosophy:**
- Friendly, approachable design (warm purple/gold theme)
- Beginner-first content (no crypto background assumed)
- Multi-language support (English, Polish, Spanish, German)
- Interactive learning (simulators, quizzes, hands-on components)
- Progressive disclosure (complexity revealed gradually)

## ⚡ Quick Start - READ FIRST (30 seconds)

**New session? Start here:**
1. Read `AGENTS.md` for critical rules (always loaded)
2. Load relevant rule files based on your task (see below)
3. Run `npm run build` before finishing

**Quick Rule Selector:**

| Task | Load These Files |
|------|------------------|
| Creating a new guide | RULES.md → NOSTR_KNOWLEDGE.md → TEACHING_METHODS.md → I18N_PATTERNS.md → CONTENT_TRANSLATION.md |
| Fixing translations | RULES.md → I18N_PATTERNS.md |
| Writing about Nostr tech | RULES.md → NOSTR_KNOWLEDGE.md |
| Building UI components | RULES.md → I18N_PATTERNS.md |
| Debugging build errors | RULES.md → I18N_PATTERNS.md (check translation keys) |
| Translating content to PL/ES/DE | RULES.md → CONTENT_TRANSLATION.md → I18N_PATTERNS.md |

**Line counts for reference:**
- AGENTS.md: ~100 lines (critical rules, loaded automatically)
- RULES.md: ~400 lines (this file - detailed workflows)
- NOSTR_KNOWLEDGE.md: ~520 lines
- TEACHING_METHODS.md: ~505 lines  
- I18N_PATTERNS.md: ~294 lines (core patterns)
- I18N_REFERENCE.md: ~235 lines (complete key reference)
- CONTENT_TRANSLATION.md: ~364 lines (language-specific guidelines)

---

## Critical Rules - READ FIRST

### 1. Internationalization (i18n) is MANDATORY

**⚠️ NEVER hardcode strings in components.** Always use the translation system.

**Supported Locales:** `en` (English), `pl` (Polish), `es` (Spanish), `de` (German)

**Server-side (Astro files):**
```typescript
import { getTranslations } from '../../../i18n';
const translations = getTranslations(currentLocale);
const title = translations.guides.whatIsNostr?.title || 'Fallback';
```

**Client-side (React components):**
```typescript
import { useTranslation } from "../../hooks/useTranslation";
const { t, locale } = useTranslation();
const title = t('guides.whatIsNostr.title');
```

**When adding new content:**
1. Add English translations to `/src/i18n/locales/en.json`
2. Copy the SAME keys to `pl.json`, `es.json`, `de.json`
3. Translate content for each locale
4. **Verify all 4 files have identical key structure**

**Translation File Locations:**
- `/src/i18n/locales/en.json` (source of truth)
- `/src/i18n/locales/pl.json`
- `/src/i18n/locales/es.json`
- `/src/i18n/locales/de.json`

### 2. Guide Links MUST Include Locale Prefix

**❌ WRONG:** `/guides/what-is-nostr`
**✅ CORRECT:** `/en/guides/what-is-nostr` or `/${locale}/guides/what-is-nostr`

**In Astro:** Use hardcoded locale: `/en/guides/what-is-nostr`
**In React:** Use dynamic locale: `` `/${locale}/guides/what-is-nostr` ``

**Link Validation:** Always verify links work by running `npm run build`

### 3. Dark Mode Colors

**❌ AVOID:** `dark:bg-gray-900/50` (creates muddy brown color)
**✅ USE:** `dark:bg-gray-900` (solid dark gray)

**Badges/Borders:** Use friendly theme colors (`friendly-purple`, `friendly-gold`) instead of generic colors like `green-200`

### 4. Build Verification is REQUIRED

**Before considering any task complete:**
```bash
npm run build
```

**Watch for:**
- "Translation key not found" warnings
- TypeScript errors
- Link validation issues

## Directory Structure

```
/src
├── content/guides/          # Guide content (MDX files)
│   ├── en/                 # English guides
│   ├── pl/                 # Polish guides
│   ├── es/                 # Spanish guides
│   └── de/                 # German guides
├── i18n/
│   ├── locales/            # Translation JSON files
│   │   ├── en.json
│   │   ├── pl.json
│   │   ├── es.json
│   │   └── de.json
│   └── index.ts            # Translation utilities
├── components/
│   ├── interactive/        # Quiz components, simulators
│   ├── guides/             # Guide-related components
│   └── ui/                 # Reusable UI components
├── pages/
│   ├── index.astro         # Landing page (English)
│   ├── [lang]/guides/      # Localized guide pages
│   └── ...
└── hooks/
    └── useTranslation.ts   # Client-side translation hook
```

## Common Pitfalls

### Guide Creation Workflow (CRITICAL)

When adding a new guide:

1. **Create English MDX:** `/src/content/guides/en/guide-name.mdx`
2. **Add metadata:** Update `/src/i18n/locales/en.json` with title/description
3. **Update learning path:** Add to `/src/data/learning-paths.ts` in appropriate sequence
4. **Add guide metadata:** Update `/src/pages/[lang]/guides/index.astro` for each locale
5. **Copy to all locales:**
   - `/src/content/guides/pl/guide-name.mdx`
   - `/src/content/guides/es/guide-name.mdx`
   - `/src/content/guides/de/guide-name.mdx`
6. **Translate JSON:** Update `pl.json`, `es.json`, `de.json` with same keys
7. **Update links:** Any links to this guide must use locale prefix
8. **Run build:** Verify no errors

**⚠️ FAILURE MODE:** Forgetting steps 3, 4, 5, or 6 causes broken navigation or "Translation key not found" errors.

### Component Validation (CRITICAL)

**When creating new components (especially quizzes):**

1. **Find reference component:** Look for existing similar component (e.g., `WhatIsNostrQuiz.tsx` for quizzes)
2. **Compare patterns:** Match exactly:
   - **Colors:** `text-success-500` / `text-error-500` (NOT `text-green-500` / `text-red-500`)
   - **Buttons:** `rounded-xl` with `shadow-md hover:shadow-lg`
   - **Icons:** Use semantic icons (not letters) via `renderOptionIcon()`
   - **Animation:** Use `slideVariants`, `optionVariants` with proper delays
3. **Copy structure:** Keep same HTML structure, prop names, and export pattern
4. **Verify:** Run build after component creation

**⚠️ FAILURE MODE:** Using wrong colors (green/red) breaks theme consistency.

### Link Patterns

**Guide links in MDX:**
```mdx
<a href="/en/guides/what-is-nostr">Learn more</a>
```

**Dynamic links in React:**
```tsx
<a href={`/${locale}/guides/what-is-nostr`}>Learn more</a>
```

**Quiz answer links:**
```tsx
// Always include locale from useTranslation()
const { locale } = useTranslation();
href={`/${locale}/guides/keys-and-security`}
```

## Learning Path Integration

When adding a new guide to the learning path:

### 1. Determine Position
- Check `/src/data/learning-paths.ts` for current sequences
- Choose appropriate skill level: `beginner`, `intermediate`, or `advanced`
- Insert guide slug in logical progression order

### 2. Update Guide Metadata
For **each locale** in `/src/pages/[lang]/guides/index.astro`:
```astro
{ slug: 'your-guide-slug', title: t('guides.yourGuide.title'), description: t('guides.yourGuide.description'), level: 'beginner', readTime: '8 min' }
```

### 3. Verify Navigation
- Prev/Next links auto-generate from learning path order
- Test navigation flow manually after build
- Check that sequence makes pedagogical sense

### 4. Translation Requirements
**For 4-locale support, you MUST update:**
- `/src/data/learning-paths.ts` (slugs are shared, language-agnostic)
- `/src/pages/en/guides/index.astro`
- `/src/pages/pl/guides/index.astro`
- `/src/pages/es/guides/index.astro`
- `/src/pages/de/guides/index.astro`
- `/src/i18n/locales/en.json`
- `/src/i18n/locales/pl.json`
- `/src/i18n/locales/es.json`
- `/src/i18n/locales/de.json`

**Total: 9 files minimum for a complete guide addition**

## Self-Correction Protocols

**STOP and re-evaluate when you see yourself doing:**

| Red Flag | Corrective Action |
|----------|-------------------|
| "Let me create 5 files at once" | STOP. Create 1 file, verify, then next. |
| "I'll fix everything" | STOP. Ask: "What's the smallest change that helps?" |
| >3 files OR >100 lines changed | BREAK into smaller independent tasks |
| No build verification in 10+ min | RUN `npm run build` immediately |
| 3 failed attempts at same issue | ASK FOR HELP, don't keep trying |
| Adding strings without `t()` function | REVERT. Use translation system. |
| Writing `/guides/` without locale | ADD locale prefix: `/en/guides/...` |
| Creating quiz without reference | Compare with WhatIsNostrQuiz.tsx FIRST |
| Adding guide without learning path | Check learning-paths.ts integration |

### File Scope Limits (CRITICAL)

**Maximum scope per task:**
- **3 files maximum** in any single task
- **1 file at a time** when creating new content
- Break larger changes into sequential small tasks

**Complex tasks requiring multiple files:**
- Create guide + metadata + translations = 3+ files → BREAK INTO STEPS
- Step 1: Create English guide
- Step 2: Update learning path and metadata
- Step 3: Add translations (4 locales)
- Step 4: Build verification

**Build Verification Timing:**
- After EVERY component creation
- After EVERY new guide file
- After EVERY translation batch
- Never go more than 10 minutes without building

## Companion Skills

Load these additional skill files when working on specific areas:

**For Nostr protocol content:**
→ `NOSTR_KNOWLEDGE.md` - Deep understanding of Nostr, NIPs, clients

**For translation work:**
→ `I18N_PATTERNS.md` - Complete i18n system documentation
→ `I18N_REFERENCE.md` - Complete key reference listing

**For content translation to Polish/Spanish/German:**
→ `CONTENT_TRANSLATION.md` - Language-specific guidelines, Nostr terminology

**Creating a new rule file?**
→ See `RULES_TEMPLATE.md` - Standardized 9-section template for consistency

## Quiz Component Standards

**Reference implementation:** `src/components/interactive/WhatIsNostrQuiz.tsx` (510 lines)

**Required patterns:**
```typescript
// Colors (theme-consistent)
const successColor = "text-success-500";  // NOT "text-green-500"
const errorColor = "text-error-500";      // NOT "text-red-500"

// Button styling
className="rounded-xl shadow-md hover:shadow-lg transition-shadow"

// Icons (semantic, not letters)
const renderOptionIcon = (option: string) => {
  switch (option) {
    case 'A': return <Users className="..." />;
    case 'B': return <Server className="..." />;
    // etc.
  }
};

// Animation variants (exact pattern)
const slideVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -50, opacity: 0 }
};

const optionVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1 }
  })
};
```

**Structure:**
- Use semantic HTML: `<header>`, `<footer>`, `<main>`
- 5 questions minimum per quiz
- Include severity levels in question data
- Progress indicator showing X of Y
- Links to related guides in answers

## Quick Reference Commands

```bash
# Build and check for errors
npm run build

# Search for hardcoded strings (should use t() instead)
grep -r "some text" src/ --include="*.tsx" --include="*.astro"

# Find broken guide links (missing locale prefix)
grep -r 'href="/guides/' src/ --include="*.tsx" --include="*.astro" --include="*.mdx"

# Check translation completeness
diff <(jq 'paths' src/i18n/locales/en.json | sort) <(jq 'paths' src/i18n/locales/pl.json | sort)

# Find wrong quiz colors (should use success/error theme)
grep -r "text-green-500\|text-red-500" src/components/interactive/
```

## Key Terminology

**Nostr Basics:**
- **npub** - Public key (starts with `npub1...`), safe to share, your identity
- **nsec** - Private key (starts with `nsec1...`), NEVER share, proves ownership
- **Relay** - Server storing/forwarding messages, anyone can run one
- **Client** - App used to access Nostr (Damus, Amethyst, Primal, Iris)
- **Zaps** - Bitcoin micropayments via Lightning Network
- **NIP** - Nostr Implementation Possibility (protocol specification)

**Project-Specific:**
- **Guide** - Educational MDX file in `/src/content/guides/`
- **Simulator** - Interactive React component (e.g., KeyGenerator, NostrSimulator)
- **Quiz** - Assessment component with translations
- **Locale** - Language code: `en`, `pl`, `es`, `de`

## Success Metrics

How to know you're following the skills correctly:

- ✅ Build passes with no errors or warnings
- ✅ All 4 translation files updated for new content
- ✅ Guide links include locale prefix
- ✅ No hardcoded strings (all use `t()`)
- ✅ Dark mode colors look correct (no brown/muddy backgrounds)
- ✅ Content follows Storybrand structure (Problem → Solution → Action)
- ✅ Changes are small and verifiable

## When to Ask for Help

**Ask the user when:**
- Unclear on target audience for new content
- Design decisions beyond existing patterns
- Uncertain if feature fits project scope
- After 3 failed attempts at same issue
- Breaking changes to architecture
- New language/locale additions

## Maintenance

**This file should be updated when:**
- New critical patterns discovered
- Common mistakes identified
- Project structure changes
- New locales added
- Build process changes

**Auto-capture significant learnings:**
- Critical translation mistakes
- Broken link patterns
- Major architectural understanding

**Suggest for approval:**
- Minor UI preferences
- New client information
- Content style refinements
- Edge cases

## Skill Acquisition Guidelines

**How to effectively learn and integrate new domain knowledge:**

### 1. Research Strategy
When learning new domain (e.g., Nostr NIPs, UI patterns, teaching methods):
- Start with authoritative sources (official repos, protocol specs, established patterns)
- Fetch current/live documentation when possible
- Identify top 15-20 most relevant items for target audience
- **Distinguish:** What I need to know (advanced/intermediate) vs what users need (beginner)

### 2. Knowledge Translation Process
**Technical Concept → Beginner-Friendly Explanation:**
1. Understand the technical implementation fully
2. Find real-world analogies (email, postal system, keys, etc.)
3. Identify the "why it matters" for users
4. Remove implementation details, keep practical benefits
5. **Test:** Would a non-technical person understand this?

### 3. Validation Before Implementation
Before using new knowledge:
- Cross-reference with existing project code
- Verify against current best practices
- Check if examples still work (run build/test)
- Confirm alignment with project philosophy

### 4. Progressive Skill Loading
When creating companion skill files:
- Start with core concepts (breadth first)
- Add depth through concrete examples
- Include common mistakes (practical wisdom)
- Reference related skills (create connections)
- Keep under 400 lines per file (maintainability)

### 5. Source Evaluation
**Prioritize sources:**
1. Official protocol documentation (authoritative)
2. Existing project guides (contextually proven)
3. Well-maintained community resources
4. Cross-verify conflicting information
5. Note last-verified dates for changing specs

### 6. Integration Checklist
After acquiring new skill knowledge:
- [ ] Can I explain this to a beginner?
- [ ] Does it align with existing project patterns?
- [ ] Can I provide concrete examples from codebase?
- [ ] Are there edge cases I should document?
- [ ] Should this trigger updates to existing skills?
- [ ] Have I verified information is current?

### 7. Creating Companion Rule Files
**When adding new rule documentation files:**
- Create ONE file at a time
- Verify it works before creating next
- Follow the 150-400 line guideline
- Include both knowledge and practical examples
- Reference back to AGENTS.md (critical rules) and RULES.md (detailed workflows)
- Add to "Reference Documentation" section in AGENTS.md

---

*Last Updated: March 2026*
*Project: nostrich.love*
*Purpose: Agent guidelines for maintaining and creating beginner-friendly Nostr educational content*

## Changelog

**March 2026 - Outbox Model Test Learnings:**
- Added Component Validation section (quiz standards)
- Added Learning Path Integration section (9 files minimum)
- Enhanced Self-Correction Protocols (build timing, file limits)
- Added Quiz Component Standards section
- Documented WhatIsNostrQuiz.tsx as reference standard
- Added CONTENT_TRANSLATION.md to companion skills
- Emphasized: Never create >3 files per task