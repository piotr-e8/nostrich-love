# Guide Translation Process

## Overview

This document outlines the complete process for translating guide MDX files in the Nostr Beginner Guide. Unlike UI translations (which use JSON files), guide content is stored as MDX files in language-specific directories.

**Current Status:**
- **English (en):** 16 guides ✅ Complete
- **Polish (pl):** 16 guides ✅ Complete  
- **Spanish (es):** 16 guides ✅ Complete
- **Total Content:** ~6,659 lines across all English guides

---

## Directory Structure

```
src/content/guides/
├── en/               # English guides (source of truth)
│   ├── index.mdx
│   ├── what-is-nostr.mdx
│   ├── keys-and-security.mdx
│   ├── quickstart.mdx
│   ├── finding-community.mdx
│   ├── relays-demystified.mdx
│   ├── nip05-identity.mdx
│   ├── nip17-private-messages.mdx
│   ├── zaps-and-lightning.mdx
│   ├── nostr-tools.mdx
│   ├── multi-client.mdx
│   ├── privacy-security.mdx
│   ├── protocol-comparison.mdx
│   ├── relay-guide.mdx
│   ├── troubleshooting.mdx
│   └── faq.mdx
├── pl/               # Polish translations
│   └── [same files]
└── es/               # Spanish translations
    └── [same files]
```

---

## Complete Translation Workflow

### Step 1: Preparation

1. **Ensure prerequisites are complete:**
   - ✅ UI translations updated (`/src/i18n/locales/{locale}.json`)
   - ✅ Locale registered in `/src/i18n/types.ts`
   - ✅ Locale imported in `/src/i18n/index.ts`
   - ✅ Routes configured in `/src/pages/[lang]/guides/[slug].astro`

2. **Create language directory:**
   ```bash
   mkdir -p src/content/guides/{locale}
   ```

3. **List all guide files to translate:**
   ```bash
   ls src/content/guides/en/
   ```

### Step 2: Translate Each Guide File

For each guide in `/src/content/guides/en/`, create a translated version in `/src/content/guides/{locale}/`.

#### File Naming Convention

**Rule:** Keep the exact same filename as the English version.

```
✅ CORRECT:
en/what-is-nostr.mdx → pl/what-is-nostr.mdx → es/what-is-nostr.mdx

❌ WRONG:
en/what-is-nostr.mdx → pl/co-to-jest-nostr.mdx (filename changed)
```

**Why?** The routing system uses slugs to match content across languages. Changing filenames breaks navigation.

#### Frontmatter Translation

**Format:**
```yaml
---
title: "Translated Title"
description: "Translated description"
estimatedTime: "5 minut"  # Translate time unit
priority: 2               # DO NOT CHANGE
category: "getting-started"  # DO NOT CHANGE
prerequisites: ["what-is-nostr"]  # DO NOT CHANGE
---
```

**Rules:**
- ✅ Translate: `title`, `description`, `estimatedTime`
- ❌ DO NOT change: `priority`, `category`, `prerequisites` array

**Example:**

```yaml
# English (en/what-is-nostr.mdx)
---
title: "Nostr Explained Simply"
description: "Understand Nostr in 5 minutes. Learn how decentralized social media works."
estimatedTime: "5 minutes"
priority: 2
category: "getting-started"
---

# Polish (pl/what-is-nostr.mdx)
---
title: "Nostr Wyjaśniony Prosto"
description: "Zrozum Nostr w 5 minut. Dowiedz się, jak działa zdecentralizowane social media."
estimatedTime: "5 minut"
priority: 2
category: "getting-started"
---

# Spanish (es/what-is-nostr.mdx)
---
title: "Nostr Explicado Simplemente"
description: "Entiende Nostr en 5 minutos. Aprende cómo funcionan las redes sociales descentralizadas."
estimatedTime: "5 minutos"
priority: 2
category: "getting-started"
---
```

#### Import Statements

**Rule:** Keep ALL import statements EXACTLY as they appear in English.

```jsx
// ✅ CORRECT - Keep identical across all languages
import { HoverCard } from "@components/HoverCard";
import { ProtocolComparison } from "@components/ProtocolComparison";
import { WhatIsNostrQuiz } from "@components/interactive/WhatIsNostrQuiz";

// ❌ WRONG - Do NOT translate import paths
import { HoverCard } from "@components/KartaPojawiajacaSie";
```

**Why?** Import paths reference actual component files. Changing them causes build errors.

#### Component Usage with `client:load`

**Rule:** ALWAYS preserve the `client:load` directive for interactive components.

```jsx
// ✅ CORRECT - Preserve client:load directive
<ProtocolComparison client:load />
<WhatIsNostrQuiz client:load />
<KeyGenerator client:load />

// ❌ WRONG - Missing directive causes English-only rendering
<ProtocolComparison />
<WhatIsNostrQuiz />
```

**Why?** The `client:load` directive ensures the component renders on the client-side and can access the current locale. Without it, components render server-side with the default English locale.

**Critical:** This is documented in `TRANSLATION_MAINTENANCE.md` as Issue #6.

#### Content Translation

Translate all content while preserving:

1. **Technical Terms (Keep in English):**
   - `npub` (public key format)
   - `nsec` (private key format)
   - `NIP-05`, `NIP-17` (protocol identifiers)
   - `Nostr` (protocol name)
   - `Zap` (Lightning payment term)
   - `Relay` (server type)
   - `Client` (application)

2. **Code Blocks:**
   ```bash
   # ✅ CORRECT - Keep code examples in English
   npub1qqqqqqqqqqqqqqqqqqqqqqqqqq...
   ```

3. **URLs and Anchors:**
   ```markdown
   <!-- ✅ English -->
   [Learn more →](/guides/what-is-nostr)
   
   <!-- ✅ Polish - Add locale prefix -->
   [Dowiedz się więcej →](/pl/guides/what-is-nostr)
   
   <!-- ✅ Spanish - Add locale prefix -->
   [Más información →](/es/guides/what-is-nostr)
   ```

4. **JSX/HTML Structure:**
   ```jsx
   // Keep className and structure identical
   <div className="key-display bg-green-50 dark:bg-green-900/20">
     <span className="font-bold text-green-700">
       BEZPIECZNE DO UDOSTĘPNIANIA {/* Translate text content only */}
     </span>
   </div>
   ```

5. **MDX Comments:**
   ```jsx
   {/* ✅ CORRECT - Can translate comments */}
   {/* ProgressIndicator temporarily disabled */}
   {/* ProgressIndicator tymczasowo wyłączony */}
   {/* ProgressIndicator temporalmente deshabilitado */}
   ```

### Step 3: Update Routing (if adding new language)

If adding a **new language** (not pl/es), update these files:

#### 3.1: Add locale to guide page routes

**File:** `/src/pages/[lang]/guides/[slug].astro`

```typescript
// Line 82-84
export async function getStaticPaths(): Promise<StaticPath[]> {
  const locales = ['en', 'pl', 'es', 'de']; // Add new locale
  // ...
}
```

#### 3.2: Add locale to guides index page

**File:** `/src/pages/[lang]/guides/index.astro`

```typescript
// Line 11-16
export async function getStaticPaths() {
  return [
    { params: { lang: 'en' } },
    { params: { lang: 'pl' } },
    { params: { lang: 'es' } },
    { params: { lang: 'de' } }, // Add new locale
  ];
}
```

### Step 4: Testing Translated Guides

Before marking translation as complete, test each guide:

#### 4.1: Visual Testing

- [ ] Navigate to `/{locale}/guides/{slug}` (e.g., `/pl/guides/what-is-nostr`)
- [ ] Verify title and description appear in target language
- [ ] Check that all body content is translated
- [ ] Confirm technical terms remain in English
- [ ] Verify links work with locale prefix

#### 4.2: Component Testing

- [ ] All interactive components render correctly
- [ ] Components display in target language (not English)
- [ ] `client:load` directives are present on all interactive components
- [ ] Quizzes work and show translated text

#### 4.3: Navigation Testing

- [ ] "Previous Guide" and "Next Guide" buttons work
- [ ] Internal links navigate to correct locale paths
- [ ] Breadcrumb navigation shows translated labels

#### 4.4: Build Testing

```bash
# Test that guides build without errors
npm run build

# Check for missing imports or broken components
# Build will fail if imports are incorrect
```

---

## Translation Checklist for New Languages

When adding a new language, ensure ALL 16 guides are translated:

### Getting Started Guides
- [ ] `index.mdx` - Landing page
- [ ] `what-is-nostr.mdx` - Introduction
- [ ] `keys-and-security.mdx` - Key management
- [ ] `quickstart.mdx` - Quick start guide
- [ ] `finding-community.mdx` - Community discovery

### Intermediate Guides
- [ ] `relays-demystified.mdx` - Relay basics
- [ ] `nip05-identity.mdx` - NIP-05 verification
- [ ] `zaps-and-lightning.mdx` - Bitcoin payments
- [ ] `nostr-tools.mdx` - Tool directory
- [ ] `troubleshooting.mdx` - Common issues

### Advanced Guides
- [ ] `relay-guide.mdx` - Advanced relay management
- [ ] `nip17-private-messages.mdx` - Private messaging
- [ ] `privacy-security.mdx` - Security deep dive
- [ ] `protocol-comparison.mdx` - Protocol comparison
- [ ] `multi-client.mdx` - Using multiple clients

### Reference
- [ ] `faq.mdx` - Frequently asked questions (933 lines)

---

## Common Translation Patterns

### Pattern 1: Heading Translation

```markdown
# English
### The Problem (1 minute read)

# Polish
### Problem (1 minuta czytania)

# Spanish
### El Problema (lectura de 1 minuto)
```

### Pattern 2: List Items

```markdown
# English
- **Bans happen.** A mistake can lock you out
- **Algorithms change.** Your reach varies daily

# Polish
- **Bany się zdarzają.** Pomyłka może Cię zablokować
- **Algorytmy się zmieniają.** Twój zasięg zmienia się codziennie

# Spanish
- **Los baneos suceden.** Un error puede bloquearte
- **Los algoritmos cambian.** Tu alcance varía diariamente
```

### Pattern 3: Code Examples with Descriptions

```markdown
# English
Your public key looks like:
`npub1qqqqqqqqqqqqqqqqqqqqqqqqqq`

# Polish
Twój klucz publiczny wygląda tak:
`npub1qqqqqqqqqqqqqqqqqqqqqqqqqq`

# Spanish
Tu clave pública se ve así:
`npub1qqqqqqqqqqqqqqqqqqqqqqqqqq`
```

### Pattern 4: Component Props

```jsx
// ✅ CORRECT - Translate content, keep component structure
<HoverCard
  term="Public Key"           // Translate term
  definition="A long string..." // Translate definition
>
  Translated content here
</HoverCard>

// ❌ WRONG - Do NOT translate prop names
<HoverCard
  termin="Klucz Publiczny"    // Wrong prop name
  definicja="Długi ciąg..."   // Wrong prop name
>
```

### Pattern 5: Anchor Links

```markdown
# English
[Learn more: Keys & Security →](/guides/keys-and-security)

# Polish
[Dowiedz się więcej: Klucze i Bezpieczeństwo →](/pl/guides/keys-and-security)

# Spanish
[Más información: Claves y Seguridad →](/es/guides/keys-and-security)
```

**Critical:** Always add locale prefix to internal links!

---

## Translation Guidelines

### Style and Tone

1. **Use informal "you" form:**
   - English: "You" (not "Thou")
   - Polish: "ty" (not "Pan/Pani")
   - Spanish: "tú" (not "usted")

2. **Keep tone conversational and friendly:**
   ```markdown
   # ✅ Good
   "Don't worry about memorizing everything."
   
   # ❌ Too formal
   "It is not necessary to commit all information to memory."
   ```

3. **Maintain original emphasis:**
   ```markdown
   # English
   **RED ALERT: Never share this with anyone**
   
   # Polish
   **CZERWONY ALARM: Nigdy tego nie udostępniaj nikomu**
   
   # Spanish
   **ALERTA ROJA: Nunca compartas esto con nadie**
   ```

### Consistency

1. **Use consistent terminology:**
   - Choose ONE translation for each term and stick to it
   - Example: "guide" → always "przewodnik" (not mixed with "poradnik")

2. **Match existing UI translations:**
   - Check `/src/i18n/locales/{locale}.json` for established terms
   - Use the same translations in guide content

3. **Preserve formatting:**
   - Keep bullet points as bullet points
   - Maintain numbered lists
   - Preserve callout boxes and alerts

---

## Known Issues and Solutions

### Issue 1: Components Rendering in English

**Symptom:** Interactive components show English text even though guide is translated.

**Cause:** Missing `client:load` directive on component.

**Solution:**
```jsx
// ❌ Wrong
<KeyGenerator />

// ✅ Correct
<KeyGenerator client:load />
```

**Reference:** See `TRANSLATION_MAINTENANCE.md` Issue #6

### Issue 2: Internal Links Not Working

**Symptom:** Clicking guide links returns 404 or wrong language.

**Cause:** Missing locale prefix in URL.

**Solution:**
```markdown
<!-- ❌ Wrong -->
[Next Guide](/guides/quickstart)

<!-- ✅ Correct -->
[Next Guide](/pl/guides/quickstart)
```

### Issue 3: Frontmatter Errors

**Symptom:** Guide doesn't appear in navigation or causes build error.

**Cause:** Changed `priority`, `category`, or `prerequisites` values.

**Solution:** Only translate `title`, `description`, `estimatedTime`. Keep all other frontmatter fields identical to English version.

### Issue 4: Build Fails with Import Error

**Symptom:** `npm run build` fails with "Cannot find module" error.

**Cause:** Translated import path or typo in component name.

**Solution:** Copy import statements exactly from English guide. Do not modify import paths.

---

## Maintenance

### When Adding New Guides

1. Create guide in English first (`/src/content/guides/en/`)
2. Add to UI translations (`/src/i18n/locales/en.json`)
3. Translate guide content for each language
4. Update translations in all locale JSON files
5. Test in all languages before merging

### When Updating Existing Guides

1. Update English version first
2. Document changes in git commit
3. Update corresponding translations
4. Mark outdated translations with comment:
   ```jsx
   {/* TODO: Update translation - English version changed on YYYY-MM-DD */}
   ```

### Version Tracking

Consider adding to frontmatter (optional):
```yaml
---
title: "Guide Title"
translatedDate: "2025-02-23"
translatedBy: "Translator Name"
---
```

---

## Quality Assurance

### Pre-merge Checklist

Before submitting translated guides:

- [ ] All 16 guides translated
- [ ] Frontmatter correct in all files
- [ ] All imports preserved exactly
- [ ] All `client:load` directives present
- [ ] Internal links include locale prefix
- [ ] Technical terms kept in English
- [ ] Build passes (`npm run build`)
- [ ] Tested in browser (visual check)
- [ ] Interactive components work
- [ ] No console errors

### Translation Review

Have a native speaker review for:

- [ ] Natural language flow
- [ ] Cultural appropriateness
- [ ] Technical accuracy
- [ ] Consistent terminology
- [ ] Grammar and spelling

---

## Resources

### Related Documentation

- **UI Translations:** See `TRANSLATION_REFERENCE.md`
- **Common Issues:** See `TRANSLATION_MAINTENANCE.md`
- **Component Usage:** See component documentation in `/src/components/`

### File Locations

- **Guide Content:** `/src/content/guides/{locale}/`
- **UI Translations:** `/src/i18n/locales/{locale}.json`
- **Routing:** `/src/pages/[lang]/guides/`
- **Types:** `/src/i18n/types.ts`

### Useful Commands

```bash
# List all English guides
ls src/content/guides/en/

# Compare English and translated guides
diff -r src/content/guides/en/ src/content/guides/pl/

# Count lines in guides
wc -l src/content/guides/en/*.mdx

# Test build
npm run build

# Start dev server
npm run dev
```

---

## Quick Reference: Translation Workflow Summary

1. **Setup:** Create `/src/content/guides/{locale}/` directory
2. **For each guide:** Copy file from `en/` to `{locale}/`
3. **Translate:** Frontmatter (title, description, time) + content
4. **Preserve:** Imports, `client:load`, technical terms, component structure
5. **Update URLs:** Add `/{locale}/` prefix to all internal links
6. **Test:** Build, visual check, component functionality
7. **Review:** Native speaker validation

---

## Questions?

If you encounter issues not covered here:

1. Check `TRANSLATION_MAINTENANCE.md` for known issues
2. Review existing translated guides (pl/, es/) for examples
3. Ask in project discussions or issues
4. Update this document with solutions found

---

**Last Updated:** 2025-02-23  
**Status:** Active - All 3 languages (en, pl, es) complete  
**Total Guides:** 16 per language  
**Estimated Translation Time:** 40-60 hours per language (for experienced translator)

---

_This document is part of the Nostr Beginner Guide project and follows the same license terms._
