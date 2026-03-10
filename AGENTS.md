# Nostrich.love - Agent Rules

> **Nostrich.love** is a beginner-friendly educational platform for Nostr (Notes and Other Stuff Transmitted by Relays), a decentralized social media protocol. Uses Astro + React + Tailwind with i18n support for 4 languages.

---

## Critical Rules - READ FIRST

### 1. Internationalization is MANDATORY

**⚠️ NEVER hardcode strings in components.** Always use the translation system.

**4 Locales:** `en` (English), `pl` (Polish), `es` (Spanish), `de` (German)

```typescript
// Client-side (React)
const { t } = useTranslation();
<button>{t('ui.buttons.submit')}</button>

// Server-side (Astro)
const translations = getTranslations(currentLocale);
const title = translations.guides.whatIsNostr?.title;
```

**Translation Files:** `/src/i18n/locales/{en,pl,es,de}.json`

### 2. Guide Links MUST Include Locale Prefix

**❌ WRONG:** `/guides/what-is-nostr`
**✅ CORRECT:** `/en/guides/what-is-nostr` or `/${locale}/guides/what-is-nostr`

### 3. Dark Mode Colors

**❌ AVOID:** `dark:bg-gray-900/50` (creates muddy brown)
**✅ USE:** `dark:bg-gray-900` (solid dark gray)

### 4. Build Verification is REQUIRED

```bash
npm run build
```

Watch for: "Translation key not found" warnings, TypeScript errors, link validation issues.

### 5. File Scope Limits

- **Maximum 3 files per task**
- **1 file at a time** when creating new content
- Break complex tasks into sequential small tasks
- Build after EVERY component creation or guide file

---

## Project Structure

```
/src
├── content/guides/{en,pl,es,de}/   # MDX guide content
├── i18n/locales/{en,pl,es,de}.json # Translations
├── components/
│   ├── interactive/                # Quiz components
│   └── ui/                         # Reusable UI
├── data/learning-paths.ts          # Guide sequences
└── pages/[lang]/guides/            # Guide pages
```

---

## Reference Documentation

**CRITICAL:** When working on specific tasks, load the relevant documentation file:

| Task | Load This File |
|------|----------------|
| Understanding project workflow and rules | @RULES.md |
| Creating a new guide | @RULES.md → @TEACHING_METHODS.md → @I18N_PATTERNS.md → @CONTENT_TRANSLATION.md |
| Nostr protocol knowledge | @NOSTR_KNOWLEDGE.md |
| Translation system details | @I18N_PATTERNS.md → @I18N_REFERENCE.md |
| Educational content structure | @TEACHING_METHODS.md |
| Language-specific translation | @CONTENT_TRANSLATION.md |
| Building UI components (quizzes, etc.) | @RULES.md → @I18N_PATTERNS.md |
| **SEO / International SEO** | **@SEO_LESSONS_LEARNED.md → @DEPLOYMENT_CHECKLIST.md** |
| **Adding new languages** | **@ADDING_LOCALES.md** |

**Key Terminology:**
- **npub** - Public key (safe to share, your identity)
- **nsec** - Private key (NEVER share, proves ownership)
- **Relay** - Server storing/forwarding messages
- **NIP** - Nostr Implementation Possibility (protocol spec)

---

## Content Classification: AGENTS vs SKILL

**Always explicitly state** whether content is **AGENTS** (knowledge/rules) or **SKILL** (action).

### Treat as AGENTS / KNOWLEDGE if it describes:

- Project context or domain knowledge
- Folder or file structure
- Rules, conventions, or constraints
- Workflows or processes
- Terminology
- Specifications or standards (APIs, protocols, formats)

**Examples in this project:**
- AGENTS.md (this file) - Critical rules
- RULES.md - Detailed workflows
- NOSTR_KNOWLEDGE.md - Protocol knowledge
- TEACHING_METHODS.md - Pedagogical patterns
- I18N_PATTERNS.md - Translation conventions

### Treat as SKILL if it describes:

- A concrete action to perform
- A technical operation
- An executable function
- Something with clear input and output
- Something that can be invoked

**Example:**
```yaml
---
name: generate-keys
description: Generate Nostr key pairs (npub/nsec)
---
## Inputs
- format: "hex" | "bech32" (default: bech32)

## Outputs
- npub: Public key
- nsec: Private key

## Action
1. Generate 32-byte random private key
2. Derive public key from private key
3. Encode both in requested format
4. Return keys
```

### If an item contains both aspects:

**Split it:**
- Descriptive part → AGENTS / KNOWLEDGE
- Executable part → SKILL

### If unsure:

**ASK THE USER:** "Should this be AGENTS/Knowledge or a SKILL?"

### Location differences:

- **AGENTS:** `AGENTS.md` in project root (auto-loaded)
- **KNOWLEDGE:** `{NAME}.md` files in project root (loaded on-demand)
- **SKILL:** `.opencode/skills/{name}/SKILL.md` (invoked via `skill` tool)

---

## Skill Usage Policy (Hybrid Approach)

**Installed Skills:** Located in `.agents/skills/` (9 skills total)

### How Skills Are Used:

**I can see available skills** automatically via the `skill` tool description. When relevant to a task, I should:

1. **Proactively identify** when a skill applies to the current task
2. **Suggest the skill** to you before using it
3. **Wait for your approval** or explicit instruction

### Examples:

**Debugging a build error:**
```
Me: "This looks like a debugging issue. I can see the `systematic-debugging` 
skill which provides a 4-phase methodical approach. Should I load it?"

You: "Yes, use it" or "No, just fix it directly"
```

**Planning a complex feature:**
```
Me: "This is a complex multi-file task. The `writing-plans` skill can create 
a detailed implementation plan with bite-sized steps. Should I use it?"

You: "Yes, create a plan" or "No, let's just start coding"
```

### You Can Also Be Explicit:

- "Use `writing-plans` to create an implementation plan"
- "Apply `systematic-debugging` to this error"
- "Load `tailwind-design-system` for this component"

### Current Installed Skills:

| Skill | Use When | Installs |
|-------|----------|----------|
| `systematic-debugging` | Debugging any issue | 21.6K |
| `writing-plans` | Complex feature planning | 19.7K |
| `vercel-react-best-practices` | React performance | 188.9K |
| `tailwind-design-system` | UI components | 13.8K |
| `frontend-design` | Visual design | 119.5K |
| `webapp-testing` | Testing components | 17.8K |
| `content-strategy` | Educational content | 16.2K |
| `web-design-guidelines` | General design | 145.8K |
| `skill-creator` | Creating new skills | 59.4K |

**See:** `.agents/skills/README.md` for detailed documentation

### Skill Tool Bug - Workaround Required

**Issue:** The `skill` tool sometimes returns "none available" even when skills exist in the filesystem.

**When this happens:**
```
Error: Skill "writing-plans" not found. Available skills: none
```

**DO NOT SKIP SKILLS - Use this workaround:**

1. **Verify skills exist:**
   ```bash
   ls .agents/skills/
   # Should show: content-strategy, writing-plans, systematic-debugging, etc.
   ```

2. **Load skill content directly:**
   Read the SKILL.md file directly instead of using the tool:
   ```
   Read: .agents/skills/{skill-name}/SKILL.md
   ```

3. **Follow the skill manually:**
   - Apply the patterns and rules from the SKILL.md content
   - Use the exact file paths and commands specified
   - Follow the workflow described in the skill

**Example workflow when skill tool fails:**
```
User: "Create an implementation plan"
Me: [tries skill tool, gets error]
Me: "The skill tool is not working. Loading writing-plans skill directly from file..."
[Read .agents/skills/writing-plans/SKILL.md]
Me: "I'm now using the writing-plans skill. Creating bite-sized implementation plan..."
[Proceeds with skill guidelines]
```

**Important:** Always attempt the skill tool first. Only use the workaround if it fails. Never skip using skills entirely - they're critical for consistent, high-quality work.

---

## Self-Correction Protocols

**STOP and re-evaluate when you see yourself doing:**

| Red Flag | Corrective Action |
|----------|-------------------|
| "Let me create 5 files at once" | STOP. Create 1 file, verify, then next. |
| >3 files OR >100 lines changed | BREAK into smaller independent tasks |
| No build verification in 10+ min | RUN `npm run build` immediately |
| 3 failed attempts at same issue | ASK FOR HELP, don't keep trying |
| Adding strings without `t()` function | REVERT. Use translation system. |
| Writing `/guides/` without locale | ADD locale prefix: `/en/guides/...` |
| Creating quiz without reference | Compare with WhatIsNostrQuiz.tsx FIRST |

---

## Quick Verification Commands

```bash
# Build and check for errors
npm run build

# Verify SEO implementation (hreflang, HTML lang, OG locale)
npm run verify-seo

# Find hardcoded strings (should use t() instead)
grep -r "Submit\|Next\|Previous" src/components --include="*.tsx" | grep -v "t('"

# Find missing client:load directives
grep -r "<KeyGenerator\|<WhatIsNostrQuiz" src/content/guides --include="*.mdx" | grep -v "client:load"

# Check translation completeness
jq -S 'paths' src/i18n/locales/en.json | sort > /tmp/en.txt && jq -S 'paths' src/i18n/locales/pl.json | sort > /tmp/pl.txt && diff /tmp/en.txt /tmp/pl.txt
```

---

## Success Metrics

✅ Build passes with no errors or warnings
✅ All 4 translation files updated for new content
✅ Guide links include locale prefix
✅ No hardcoded strings (all use `t()`)
✅ Dark mode colors look correct
✅ Changes are small and verifiable
✅ **SEO verification passes** (`npm run verify-seo` shows all green)
✅ **No hreflang errors** (check with `npm run verify-seo`)
✅ **Dynamic HTML lang** set correctly for each locale

---

*Last Updated: March 2026*
*Project: nostrich.love*
*Purpose: Agent rules for creating beginner-friendly Nostr educational content*

---

## Lessons Learned (March 2026)

### 1. Creator vs Developer Distinction is NON-NEGOTIABLE

**Context:** Project wants to onboard creators (writers, artists, podcasters), NOT developers.

**What happened:** Proposed practical exercises format (like learnnostr.org's day-by-day tasks) - user rejected with "hmm not really"

**Rule:** Always clarify user type before suggesting features. Nostr already has developer tools; this project targets creators.

### 2. Translation Gaps Happen Even With Rules

**What happened:** Outbox Model Quiz was only in English despite i18n being mandatory rule

**Fix:** Added quiz translations to all 4 locales (en, pl, es, de)

**New verification step:** Check ALL interactive components have translations in all locales before marking complete

### 3. Competitor Analysis Needs User Validation

**What happened:** Analyzed learnnostr.org's structured format, proposed borrowing it

**Reality:** User explicitly NOT interested in developer-focused content or structured learning tracks

**Lesson:** Ask "would this help YOUR target users?" before implementing competitor features

### 4. External Campaigns = User Territory

**Context:** Phase 4 Community Campaign involves posting on Nostr with 21 sats rewards

**Rule:** Don't document or code for external campaigns unless user explicitly requests. User handles Phase 4 directly on Nostr.

### 5. Preference Discovery Takes Iteration

**What happened:** Required 3+ clarifying questions to understand what user actually wanted

**Better approach:** Ask "what would creators find valuable that's missing?" BEFORE proposing solutions

**Anti-pattern to avoid:** Presenting solutions before understanding actual needs

---

## Lessons Learned from International SEO Implementation (March 2026)

### 6. Centralized Locale Configuration is Critical

**Context:** Implemented multi-language SEO with dynamic HTML lang, OG locale, and hreflang tags.

**What happened:** Initially considered inline locale definitions, but centralized config in `/src/config/locales.ts` proved essential.

**Rule:** Always use the centralized locale config:

```typescript
import { type Locale, locales, getLocaleConfig } from '../config/locales';

// Access locale-specific settings
const config = getLocaleConfig('de');
// Returns: { htmlLang: 'de', ogLocale: 'de_DE', name: 'Deutsch' }
```

**Why:** Single source of truth, type-safe, easy to add new languages.

### 7. Type Casting Required for Locale Props

**Context:** Passing locale from Astro pages to Layout component.

**What happened:** TypeScript error: `Type 'string' is not assignable to type '"en" | "pl" | "es" | "de"'`

**Fix:** Explicit type cast when passing locale:

```typescript
import type { Locale } from '../config/locales';

// In [slug].astro
<Layout locale={locale as Locale} />
```

**Rule:** Always import and cast `Locale` type when passing locale props.

### 8. @astrojs/sitemap i18n Feature is Powerful

**Context:** Need hreflang annotations in sitemap for Google indexing.

**What happened:** Discovered `i18n` config option in @astrojs/sitemap that auto-generates xhtml:link alternates.

**Implementation:**

```javascript
// astro.config.mjs
sitemap({
  i18n: {
    defaultLocale: 'en',
    locales: {
      en: 'en-US',
      pl: 'pl-PL',
      es: 'es-ES',
      de: 'de-DE',
    },
  },
}),
```

**Result:** Auto-generates 281 hreflang link elements across all pages. Saves hours of manual work.

**Rule:** Use sitemap i18n config instead of manual hreflang in sitemap.

### 9. Remove Legacy Static Files When Auto-Generating

**Context:** Site had old `public/sitemap.xml` file alongside auto-generated one.

**What happened:** Old sitemap had only 24 URLs, no hreflang, missing 3 locales. Confused which to submit to Google.

**Fix:** Deleted `/public/sitemap.xml`. Now only `dist/sitemap-index.xml` exists (auto-generated with 101 URLs).

**Rule:** When switching to auto-generated sitemaps, remove static ones to avoid confusion.

### 10. SEO Verification Script is Essential

**Context:** Need to verify hreflang, HTML lang, OG locale across all 4 locales.

**What happened:** Created `npm run verify-seo` script that checks 101 pages automatically.

**What it verifies:**
- Sitemap exists with hreflang annotations
- HTML lang attribute per locale (e.g., `lang="de"`)
- OG locale meta tags (e.g., `de_DE`)
- All 4 locales present
- x-default hreflang fallback

**Usage:**
```bash
npm run build
npm run verify-seo
```

**Rule:** Always run verification script after SEO changes before deploying.

### 11. Build Verification Catches Translation Gaps

**Context:** Running `npm run build` shows warnings.

**What happened:** Saw "Translation key not found: zapSimulator.buttons.copy" warnings during build.

**Rule:** Watch for translation warnings in build output. Fix immediately - they indicate missing i18n coverage.

### 12. Hreflang Implementation Requires Both HTML and Sitemap

**Context:** Google needs to discover language relationships.

**What we implemented:**

1. **HTML tags** in every page `<head>`:
```html
<link rel="alternate" hreflang="en" href="..." />
<link rel="alternate" hreflang="pl" href="..." />
<link rel="alternate" hreflang="es" href="..." />
<link rel="alternate" hreflang="de" href="..." />
<link rel="alternate" hreflang="x-default" href="..." />
```

2. **Sitemap annotations** via xhtml:link

**Why both:** HTML helps discovery during crawling, sitemap consolidates signals for Google.

**Rule:** Never implement only one - always use both HTML hreflang and sitemap hreflang.
