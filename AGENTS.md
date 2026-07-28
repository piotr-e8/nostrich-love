# Nostrich.love - Agent Rules

> **Nostrich.love** is a beginner-friendly educational platform for Nostr (Notes and Other Stuff Transmitted by Relays), a decentralized social media protocol. Uses Astro + React + Tailwind with i18n support for 7 languages (including RTL Arabic and Hindi).

---

## Philosophy, Mission & Essence

**Core Philosophy:**  
Nostr shouldn't require technical expertise to use. Decentralization is meaningless if only developers can access it.

**Mission:**  
Make Nostr onboarding so smooth that creators (writers, artists, musicians) can start using it without friction, confusion, or fear.

**Essence:**  
An interactive, hands-on learning platform where you **try Nostr before committing to it** - test clients in browser, find curated communities, learn by experimentation.

**What it's all about:**
- **Human over protocol:** People first, technical specs second
- **Practice over theory:** Browser simulators, not documentation
- **Curation over chaos:** 300+ accounts organized by interest, not "figure it out yourself"
- **Accessibility over complexity:** 7 languages (including RTL Arabic and Hindi), visual guides, no assumptions

**The Stance:**  
Nostr keeps building infrastructure. Someone needed to build the **front door**.

**Why this matters for content:**  
Every post, guide, and feature should embody this philosophy. We're not explaining Nostr - we're making it usable.

---

## Critical Rules - READ FIRST

### 1. Internationalization is MANDATORY

**⚠️ NEVER hardcode strings in components.** Always use the translation system.

**7 Locales:** `en` (English), `pl` (Polish), `es` (Spanish), `de` (German), `zh` (Chinese), `ar` (Arabic - RTL), `hi` (Hindi)

```typescript
// Client-side (React)
const { t } = useTranslation();
<button>{t('ui.buttons.submit')}</button>

// Server-side (Astro)
const translations = getTranslations(currentLocale);
const title = translations.guides.whatIsNostr?.title;
```

**Translation Files:** `/src/i18n/locales/{en,pl,es,de,zh,ar,hi}.json`

---

### ⚠️ MANDATORY: New Locale Checklist (6 Hardcoded Files)

**When adding a new locale, these 6 files ALL have hardcoded locale arrays that MUST be updated — missing any one causes 404s or missing language switcher entries:**

Rewritten July 2026 — the old list named three files that no longer exist and
several places that now derive the locale list instead of hardcoding it.

**Single source of truth:** `src/config/locales.ts`. Add the locale there first;
everything that iterates (`getStaticPaths`, the sitemap, the path helpers) picks
it up automatically.

| # | File | What to Update |
|---|------|---------------|
| 1 | `src/config/locales.ts` | Add the code plus `htmlLang`, `ogLocale`, `name`, `direction`. **Start here.** |
| 2 | `src/i18n/types.ts` | Add the code to the `Locale` union |
| 3 | `src/i18n/locales/{locale}.json` | Full translation file — keys must match `en.json` exactly, camelCase under `guides` |
| 4 | `src/i18n/locales.server.ts` | Add the static import (server needs all locales; the client loads one) |
| 5 | `src/content/guides/{locale}/` | All 16 guide MDX files, same slugs as `en/` |
| 6 | `src/components/LanguageSwitcher.tsx` | Add to the `languages` display array (flag + label only) |
| 7 | `astro.config.mjs` | Add to `i18n.locales` and to the sitemap `i18n.locales` map |
| 8 | `src/pages/progress.astro` | Inline script cannot import config — add to its locale array |

`src/pages/[...lang]/guides/*.astro` no longer needs touching: it iterates
`locales` from config. There is no `src/pages/guides/index.astro` any more —
English is served from the rest route.

**Verify with the gates, not by eye:**
```bash
npm run test        # guide-slug parity, key casing, missing keys
npm run build && npm run check:links
```

### 2. Guide Links: English is UN-prefixed

Reversed in July 2026. `astro.config.mjs` sets `prefixDefaultLocale: false`, so
English lives at `/guides/<slug>` and **`/en/guides/*` only 301-redirects**.
Linking through a redirect wastes crawl budget and is a bug, not a style issue.

**❌ WRONG:** `/en/guides/what-is-nostr`, or `` `/${locale}/guides/x` `` built by hand
**✅ CORRECT:** import the helper — it is the single source of truth and is unit tested

```ts
import { guidePath, guidesIndexPath, localePath } from '@/i18n/paths';

guidePath('what-is-nostr')        // -> /guides/what-is-nostr
guidePath('what-is-nostr', 'pl')  // -> /pl/guides/what-is-nostr
```

Inside MDX, link to your own locale: a Polish guide links to `/pl/guides/x`, an
English guide to `/guides/x`. `tests/content-integrity.test.ts` fails the build
if a translated guide links at an English path, or if anything links to `/en/`.

Inline `<script>` in `.astro` cannot import the helper — compute the prefix
locally there (`locale === 'en' ? '/guides' : `/${locale}/guides``).

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

### 6. Placeholder Syntax Patterns

**CRITICAL: The codebase uses TWO different placeholder conventions**

**Quiz components (double braces):**
```typescript
// Uses {{double}} braces
t('quiz.progress', { current: '{{current}}', total: '{{total}}' })
// Code does: text.replace("{{current}}", value)
```

**Navigation/other components (single braces):**
```typescript
// Uses {single} braces
t('navigation.level', { level: '{level}' })
// Code does: text.replace('{level}', value)
```

**Rule:** When creating or fixing translations with placeholders, check the component code to determine which syntax to use.

### 7. Verify Translation Structure Against Component Code

**Task agents can create wrong translation structures.**

**Example:** Agent created `nip05Checker.messages.*`, `nip05Checker.instructions.*`

**But component expected:** `nip05Checker.benefits.*`, `nip05Checker.form.*`, `nip05Checker.results.*`

**Always verify:**
```bash
# Check what keys the component actually uses
grep "t('componentName\." src/components/path/Component.tsx
```

**Rule:** Never trust AI-generated translation structures without verification against component code.

---

## Nostr Implementation Patterns

### Outbox Model for Data Fetching

**Correct Architecture:**
```typescript
// Step 1: Query bootstrap relays for relay list (kind:10002) and profile (kind:0)
const BOOTSTRAP_RELAYS = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.snort.social",
];

// Step 2: Parse relay list from tags
// Tag format: ["r", "wss://url", "write"] or ["r", "wss://url"]
// Only use relays marked "write" or with no marker

// Step 3: Query those specific relays for content
// This follows the user's actual posting behavior
```

**Why this matters:** Querying random relays often misses posts. The outbox model queries only where the user actually publishes.

### Reply Detection

**Filter out replies to show only original posts:**
```typescript
const isReply = (event: any): boolean => {
  // Has 'e' tag (references another event)
  const hasReplyTag = event.tags?.some((tag: string[]) => tag[0] === 'e');
  
  // Content starts with @mention
  const startsWithMention = event.content?.trim().startsWith('@');
  
  return hasReplyTag || startsWithMention;
};
```

### WebSocket Connection Patterns

**Best Practices:**
```typescript
// 1. Set aggressive timeouts to prevent hanging
const timeout = setTimeout(() => resolve(events), 4000);

// 2. Resolve on EOSE, don't wait for all relays
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data[0] === "EVENT") events.push(data[2]);
  if (data[0] === "EOSE") {
    clearTimeout(timeout);
    ws.close();
    resolve(events); // Resolve immediately on EOSE
  }
};

// 3. Use random subscription IDs to avoid collisions
const subId = `req-${Math.random().toString(36).substr(2, 9)}`;
```

### Common Nostr Mistakes

| Mistake | Solution |
|---------|----------|
| `relay.nostr.mom` | Use `nostr.mom` (no relay. prefix) |
| Waiting for all relays | Resolve on first EOSE |
| Querying random relays | Use outbox model (kind:10002) |
| Showing all kind:1 | Filter replies with 'e' tags |
| Including `t` in useEffect deps | Use eslint-disable or stable ref |

---

## Project Structure

```
/src
├── content/guides/{en,pl,es,de,zh,ar}/   # MDX guide content
├── i18n/locales/{en,pl,es,de,zh,ar}.json # Translations
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
| **Content audit & guide planning** | **@CONTENT_AUDIT_AND_KNOWLEDGE_MAP.md** |
| **Adding new languages** | **@LESSONS_ZH_LOCALE.md** (comprehensive lessons from adding Chinese) → **@LESSONS_AR_LOCALE.md** (RTL support, placeholder syntax, interactive components) |
| **Feature differentiation & value props** | **@LESSONS_FEATURES.md** |
| **Content strategy insights** | **@LESSONS_RETRO.md** |
| **Nostr content patterns & influencer research** | **@LESSONS_RETRO.md** (Influencer Content Analysis section) |
| **Refactoring & technical debt** | **@CODEBASE_AUDIT.md** (prioritized roadmap, 5 competing progress systems, 15 duplicated quiz components) |

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
| Hand-building a guide URL | USE `guidePath()` from `@/i18n/paths`. English is un-prefixed; `/en/` only redirects. |
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

# Check translation completeness against English
jq -S 'paths' src/i18n/locales/en.json | sort > /tmp/en.txt && jq -S 'paths' src/i18n/locales/hi.json | sort > /tmp/hi.txt && diff /tmp/en.txt /tmp/hi.txt
```

---

## Success Metrics

✅ Build passes with no errors or warnings
✅ All 7 translation files updated for new content
✅ Guide links include locale prefix
✅ No hardcoded strings (all use `t()`)
✅ Dark mode colors look correct
✅ Changes are small and verifiable
✅ **SEO verification passes** (`npm run verify-seo` shows all green for 7 locales)
✅ **No hreflang errors** (check with `npm run verify-seo`)
✅ **Dynamic HTML lang** set correctly for each locale including Hindi

---

*Last Updated: April 2026*
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

**Fix:** Added quiz translations to all 5 locales (en, pl, es, de, zh)

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

**What happened:** TypeScript error: `Type 'string' is not assignable to type '"en" | "pl" | "es" | "de" | "zh"'`

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

**Context:** Need to verify hreflang, HTML lang, OG locale across all 5 locales.

**What happened:** Created `npm run verify-seo` script that checks 101 pages automatically.

**What it verifies:**
- Sitemap exists with hreflang annotations
- HTML lang attribute per locale (e.g., `lang="de"`)
- OG locale meta tags (e.g., `de_DE`)
- All 5 locales present
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

---

## Lessons Learned from Arabic Translation (RTL Support) - April 2026

### 13. RTL Support Requires Logical CSS Properties

**Context:** Arabic is the first RTL language in theproject.

**What happened:** Standard CSS properties like `ml-4` (margin-left) don't work correctly in RTL mode - they don't flip automatically.

**Fix:** Use logical CSS properties instead:
```css
/* Wrong - doesn't flip in RTL */
<div class="ml-4">

/* Correct - flips automatically */
<div class="ms-4">  /* margin-start: flips based on direction */
```

**Implementation:** Project uses `tailwindcss-rtl` plugin which provides logical utility classes.

**Rule:** For RTL support, always use:
- `ms-*` / `me-*` instead of `ml-*` / `mr-*` (margin-start/end)
- `ps-*` / `pe-*` instead of `pl-*` / `pr-*` (padding-start/end)
- `start-*` / `end-*` instead of `left-*` / `right-*` (positioning)

### 14. Interactive Components Need a Hydration Directive — but NOT client:load

**Superseded July 2026.** The original rule said every interactive component
needs `client:load`. That produced 429 of them, so React, framer-motion and
every quiz mounted while the page was still loading.

**Rule now:** use `client:idle`. It defers hydration past first paint, which
moved 66% of a FAQ page's JavaScript off the critical path.

```astro
<RelayWorldMap client:idle />
```

`client:visible` would be better still — it skips components the reader never
scrolls to — but it could not be verified in the automated browser here
(`document.hidden` stays true, and Chrome suspends IntersectionObserver in a
hidden document, so nothing ever hydrates and it looks broken). Confirm it in a
real browser before switching content widgets over.

**Do not add a directive at all** if the component does not need JavaScript.
`FAQAccordion` was 29 React roots per FAQ page until it became an `.astro`
component wrapping `<details>/<summary>` — zero JS, and it works before
hydration and with JS off.

**Verification:**
```bash
grep -rn "client:load" src/content/guides --include="*.mdx"   # expect none
```

### 15. Outbox Model Quiz Translation Was Missing

**Context:** During Arabic translation, discovered Outbox Model Quiz only had English translations.

**What happened:** Quiz used `t('outboxQuiz.*')` keys but only `en.json` had translations - all other locales were missing them.

**Lesson:** Even with mandatory i18n rules, translation gaps happen.

**Better verification:**
```bash
# Check ALL locales have translation keys for a component
for locale in en pl es de zh ar hi; do
  echo "=== $locale ==="
  grep -c "zapSimulator\." src/i18n/locales/$locale.json || echo "MISSING"
done
```

**Rule:** When completing any component, verify translations exist in ALL 7 locales, not just English.

### 16. SEO Verification Script Must Include All Locales

**Context:** SEO verification script checks for all locale variations.

**Update needed:** When adding a new locale, also update `scripts/verify-seo.js` to include:
- HTML lang attribute check (e.g., `lang="hi"` for Hindi)
- OG locale metadata check (e.g., `hi_IN`)
- hreflang link check
- Test URLs for the new locale
- Sitemap locale entry

**Current status:** Script checks 7 locales (en, pl, es, de, zh, ar, hi)
