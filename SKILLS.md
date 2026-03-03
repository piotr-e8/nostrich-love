# Nostrich.love Agent Skills

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
1. Read Critical Rules below (lines 14-76)
2. Load companion skills based on your task
3. Run `npm run build` before finishing

**Quick Skill Selector:**

| Task | Load These Skills |
|------|-------------------|
| Creating a new guide | SKILLS.md → NOSTR_KNOWLEDGE.md → TEACHING_METHODS.md → I18N_PATTERNS.md |
| Fixing translations | SKILLS.md → I18N_PATTERNS.md |
| Writing about Nostr tech | SKILLS.md → NOSTR_KNOWLEDGE.md |
| Building UI components | SKILLS.md → UI_UX_SKILLS.md → I18N_PATTERNS.md |
| Debugging build errors | SKILLS.md → I18N_PATTERNS.md (check translation keys) |

**Line counts for reference:**
- SKILLS.md: ~340 lines (this file)
- NOSTR_KNOWLEDGE.md: ~520 lines
- TEACHING_METHODS.md: ~340 lines  
- I18N_PATTERNS.md: ~300 lines (core)

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
3. **Copy to all locales:**
   - `/src/content/guides/pl/guide-name.mdx`
   - `/src/content/guides/es/guide-name.mdx`
   - `/src/content/guides/de/guide-name.mdx`
4. **Translate JSON:** Update `pl.json`, `es.json`, `de.json` with same keys
5. **Update links:** Any links to this guide must use locale prefix
6. **Run build:** Verify no errors

**⚠️ FAILURE MODE:** Forgetting step 3 or 4 causes "Translation key not found" errors.

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

## Companion Skills

Load these additional skill files when working on specific areas:

**For Nostr protocol content:**
→ `NOSTR_KNOWLEDGE.md` - Deep understanding of Nostr, NIPs, clients

**For translation work:**
→ `I18N_PATTERNS.md` - Complete i18n system documentation

**For creating educational content:**
→ `TEACHING_METHODS.md` - Pedagogy, content structure, examples

**For UI/UX work:**
→ `UI_UX_SKILLS.md` - Design system, component usage

**For content guidelines:**
→ `CONTENT_GUIDELINES.md` - Nostr education best practices

**Creating a new skill file?**
→ See `SKILL_TEMPLATE.md` - Standardized 9-section template for consistency

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

### 7. Creating Companion Skills
**When adding new SKILL.md companion files:**
- Create ONE file at a time
- Verify it works before creating next
- Follow the 150-400 line guideline
- Include both knowledge and practical examples
- Reference back to SKILLS.md core
- Add to "Companion Skills" section in main file

---

*Last Updated: March 2026*
*Project: nostrich.love*
*Purpose: Agent guidelines for maintaining and creating beginner-friendly Nostr educational content*