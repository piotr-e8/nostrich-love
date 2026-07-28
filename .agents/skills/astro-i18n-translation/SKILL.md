---
name: astro-i18n-translation
description: |
  Systematically add new locales to the Nostrich.love Astro project.
  Handles the 12+ file touch pattern, RTL considerations, placeholder syntax, and verification.
  
  CRITICAL INSIGHT: Config files are only 20% of the work. The other 80% is finding 
  and updating hardcoded locale checks scattered throughout components.
  
  Key learnings codified:
  - 12+ files must be touched, not 7
  - 6 hardcoded-array files are THE #1 source of bugs when adding locales
  - Config files are easy, component hunting is the real work
  - Always search for hardcoded locale arrays with grep
  - Translation placeholder format: {{variable}} for quizzes, {variable} for navigation
  - Content sections need translation, not just quizzes
  - Verify actual content, don't assume based on file size
  - Line count ≠ translation status (concise translations are valid)
  - Use logical CSS properties for RTL (ms-4 not ml-4)
  - client:load directive required for interactive components in MDX
license: MIT
compatibility: opencode
metadata:
  framework: astro
  category: i18n
  difficulty: intermediate
  project: nostrich.love
  current-locales: 7 (en, pl, es, de, zh, ar, hi)
---

# Astro i18n Translation Skill (Nostrich.love)

**IMPORTANT: This skill documents the REAL workflow for adding locales. Config files are 20% of the work. Finding hardcoded locale arrays in components is the other 80%.**

## When to Use

- Adding a new language to Nostrich.love
- Setting up RTL support for Arabic, Hebrew, Persian, etc.
- Creating translation file templates
- Verifying translation completeness
- Debugging locale redirect issues

## Prerequisites

- Astro project with existing i18n setup (@astrojs/sitemap, translation system)
- At least one working locale (English) as reference
- Understanding of locale codes (en, es, de, ar, hi, etc.)
- Grep or ripgrep for finding hardcoded checks

---

## ⚠️ MANDATORY: The 6 Hardcoded Files Checklist

**This is the #1 source of bugs when adding locales. Every previous locale addition (pl, es, de, zh, ar, hi) forgot at least one of these files.**

| # | File | What Broke When Missing |
|---|------|------------------------|
| 1 | `src/components/LanguageSwitcher.tsx` | Language missing from dropdown, locale URLs not detected |
| 2 | `src/i18n/index.ts` | Translation imports missing, getCurrentLocale() doesn't recognize locale |
| 3 | `src/pages/[lang]/guides/[slug].astro` | `/{locale}/guides/*` returns 404 (not in getStaticPaths) |
| 4 | `src/pages/[lang]/guides/index.astro` | `/{locale}/guides/` returns 404 (missing params + locale detection) |
| 5 | `src/pages/guides/index.astro` | Users with saved locale preference see fallback, not their language |
| 6 | `src/pages/progress.astro` | Progress tracking doesn't work for the new locale |

**Verify ALL 6 before considering the locale "done":**

```bash
for file in \
  src/components/LanguageSwitcher.tsx \
  src/i18n/index.ts \
  "src/pages/[lang]/guides/[slug].astro" \
  "src/pages/[lang]/guides/index.astro" \
  src/pages/guides/index.astro \
  src/pages/progress.astro; do
  echo "=== $file ==="
  grep -n "{your-locale-code}" "$file" | head -3 || echo "MISSING! Must update this file"
done
```

---

## The 12+ File Touch Pattern

**WARNING: The commonly cited "7-file pattern" is dangerously incomplete.**

Adding a new locale requires modifying **12+ files** across 4 categories:

### Category 1: Configuration Files (6 files - Easy 20%)

| # | File | Purpose | Key Addition |
|---|------|---------|--------------|
| 1 | `src/config/locales.ts` | Locale metadata | Add locale config with direction, name, htmlLang, ogLocale |
| 2 | `src/i18n/types.ts` | TypeScript types | Add to `Locale` union type |
| 3 | `astro.config.mjs` | Build config | Add to `i18n.locales` and sitemap i18n config |
| 4 | `src/i18n/index.ts` | Import + routing | Import translation file, add to record, update getCurrentLocale() |
| 5 | `src/i18n/locales/{locale}.json` | UI translations | Create full translation file (29+ sections) |
| 6 | `src/content/guides/{locale}/` | Content | Create directory + translate all 16 MDX guides |

### Category 2: Hardcoded Locale Arrays (6 files - THE CRITICAL 80%)

| # | File | Purpose | Critical Updates |
|---|------|---------|------------------|
| 7 | `src/components/LanguageSwitcher.tsx` | Language dropdown | Add to `languages` array, update URL detection regexes, update redirect patterns, update localStorage validation |
| 8 | `src/pages/[lang]/guides/[slug].astro` | Guide pages | Add to `getStaticPaths()` locales array |
| 9 | `src/pages/[lang]/guides/index.astro` | Guide index | Add params entry + locale detection if/else chain |
| 10 | `src/pages/guides/index.astro` | Guides redirect | Add to localStorage saved language check array |
| 11 | `src/pages/progress.astro` | Progress tracking | Add to saved language preference check array |
| 12 | `src/i18n/index.ts` *(also in Category 1)* | Also has `getCurrentLocale()` | Add locale detection via `if (path.startsWith('/{locale}/'))` |

### Category 3: SEO/Verification (1 file)

| # | File | Purpose |
|---|------|---------|
| 13 | `scripts/verify-seo.js` | Add locale to sitemap check, HTML lang check, OG locale check, test URLs, guide index check |

### Category 4: Optional RTL (1 file)

| # | File | Purpose |
|---|------|---------|
| + | `tailwind.config.js` + component CSS | Verify tailwindcss-rtl plugin is installed (only for RTL locales) |

---

## Step-by-Step Workflow

### Phase 1: Infrastructure (Config Files)

**1. Add locale configuration**

```typescript
// src/config/locales.ts
export interface LocaleConfig {
  name: string;
  direction: 'ltr' | 'rtl';
  htmlLang: string;
  ogLocale: string;
}

export const localeConfig = {
  // ... existing locales
  hi: {
    name: 'हिन्दी',
    direction: 'ltr',
    htmlLang: 'hi',
    ogLocale: 'hi_IN',
  },
};
```

**2. Update TypeScript types**

```typescript
// src/i18n/types.ts
export type Locale = 'en' | 'pl' | 'es' | 'de' | 'zh' | 'ar' | 'hi';
```

**3. Add to Astro config**

```javascript
// astro.config.mjs
export default defineConfig({
  i18n: {
    locales: ['en', 'pl', 'es', 'de', 'zh', 'ar', 'hi'],
    // ...
  },
  sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: {
        en: 'en-US',
        pl: 'pl-PL',
        es: 'es-ES',
        de: 'de-DE',
        zh: 'zh-CN',
        ar: 'ar-SA',
        hi: 'hi-IN',
      },
    },
  }),
});
```

**4. Update i18n index (CRITICAL - often missed!)**

```typescript
// src/i18n/index.ts
import hi from './locales/hi.json';

const translations: Record<Locale, Translations> = { en, pl, es, de, zh, ar, hi };

// CRITICAL: Add to getCurrentLocale detection
export function getCurrentLocale(path: string): Locale {
  if (path.startsWith('/pl/')) return 'pl';
  if (path.startsWith('/es/')) return 'es';
  if (path.startsWith('/de/')) return 'de';
  if (path.startsWith('/zh/')) return 'zh';
  if (path.startsWith('/ar/')) return 'ar';
  if (path.startsWith('/hi/')) return 'hi';
  return 'en';
}
```

**5. Create translation file**

Copy reference locale and translate all sections:

```bash
cp src/i18n/locales/en.json src/i18n/locales/hi.json
# Then translate ALL keys in hi.json
```

**6. Create content directory and translate guides**

```bash
mkdir -p src/content/guides/hi
cp src/content/guides/en/*.mdx src/content/guides/hi/
# Then translate ALL guide content
```

### Phase 2: Hardcoded Locale Arrays (THE CRITICAL WORK)

**7. Search for ALL hardcoded locale arrays**

```bash
# This is the MOST IMPORTANT step
grep -rn "'en'\|'pl'\|'es'\|'de'\|'zh'\|'ar'" src/ --include="*.{ts,tsx,astro}"
```

This reveals all the places developers forgot to use centralized config. You MUST update every match.

**8. Update LanguageSwitcher.tsx**

```typescript
// Add to languages array
const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  // ... existing
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
];

// Update path detection regexes
const pathLocale = pathname.split('/')[1];
if (['en', 'pl', 'es', 'de', 'zh', 'ar', 'hi'].includes(pathLocale)) {
  setCurrentLocale(pathLocale);
}

// Update redirect patterns
const redirectPatterns = [
  { pattern: /^\/pl\//, locale: 'pl' },
  // ... existing
  { pattern: /^\/hi\//, locale: 'hi' },
];

// Update localStorage validation
const saved = localStorage.getItem('nostrich-locale');
if (['en', 'pl', 'es', 'de', 'zh', 'ar', 'hi'].includes(saved)) {
  setCurrentLocale(saved);
}
```

**9. Update `[slug].astro` getStaticPaths**

```typescript
// src/pages/[lang]/guides/[slug].astro
export async function getStaticPaths() {
  const locales = ['en', 'pl', 'es', 'de', 'zh', 'ar', 'hi'];
  // ...
}
```

**10. Update guides index.astro**

```typescript
// src/pages/[lang]/guides/index.astro
// Add params entry + locale detection
const localeParams = [
  { params: { lang: 'en' } },
  { params: { lang: 'pl' } },
  { params: { lang: 'es' } },
  { params: { lang: 'de' } },
  { params: { lang: 'zh' } },
  { params: { lang: 'ar' } },
  { params: { lang: 'hi' } },
];

// Also update locale detection if/else chain
```

**11. Update guides/index.astro redirect**

```typescript
// src/pages/guides/index.astro
// Update sessionStorage/localStorage locale check array
const savedLocale = localStorage.getItem('nostrich-locale');
if (['en', 'pl', 'es', 'de', 'zh', 'ar', 'hi'].includes(savedLocale)) {
  // redirect to saved locale
}
```

**12. Update progress.astro**

```typescript
// src/pages/progress.astro
// Update saved language preference check array
const savedLang = localStorage.getItem('nostrich-locale');
if (['en', 'pl', 'es', 'de', 'zh', 'ar', 'hi'].includes(savedLang)) {
  // use saved language
}
```

### Phase 3: Content Translation

**CRITICAL: Placeholder syntax varies by component type!**

| Component Type | Placeholder Format | Example |
|----------------|-------------------|---------|
| Quiz components (all) | `{{double}}` braces | `{{current}}`, `{{total}}`, `{{score}}` |
| Navigation components | `{single}` braces | `{level}`, `{count}`, `{currentLevel}` |
| Other components | `{single}` braces | `{minutes}` |

**Why this matters:** Using wrong format shows raw placeholder text instead of values.

**Verification:**
```bash
# Check which format a component uses:
grep "\.replace" src/components/interactive/WhatIsNostrQuiz.tsx
# Shows: .replace("{{current}}", ...)  → Use double braces

grep "\.replace" src/components/navigation/GuideNavigation.tsx  
# Shows: .replace('{level}', ...)  → Use single braces
```

**CRITICAL: Verify translation structure matches component code, not just that translations exist.**

```bash
# Check what keys a component ACTUALLY uses:
grep "t('nip05Checker\." src/components/interactive/NIP05Checker.tsx
# Then compare against your translation JSON structure
```

**CRITICAL: Interactive components need `client:load` in MDX files:**

```jsx
<!-- ❌ WRONG - will fail hydration -->
<RelayWorldMap />

<!-- ✅ CORRECT - works with translations -->
<RelayWorldMap client:load />
```

**Content sections to translate (not just quizzes!):**

```json
"content": {
  "problemHook": "Why traditional social media is broken",
  "solutionIntro": "How Nostr solves these problems",
  "howItWorks": "The technical foundation in plain terms",
  "keyTakeaway": "What you'll remember from this guide",
  "nextSteps": "Where to go next"
}
```

**Internal links must include locale prefix:**

```markdown
<!-- ❌ WRONG -->
[Learn more](/guides/what-is-nostr)

<!-- ✅ CORRECT -->
[Learn more](/hi/guides/what-is-nostr)
```

### Phase 4: RTL Considerations (if applicable)

**For RTL locales (ar, he, fa, ur):**

1. **Set `direction: 'rtl'`** in `src/config/locales.ts`
2. **HTML direction attribute** - Set via `dir={direction}` in Layout
3. **Use logical CSS properties:**

```css
/* WRONG for RTL */
.ml-4 { margin-left: 1rem; }
.text-left { text-align: left; }
.border-r { border-right-width: 1px; }

/* CORRECT - works for both LTR and RTL */
.ms-4 { margin-inline-start: 1rem; }
.text-start { text-align: start; }
.border-e { border-inline-end-width: 1px; }
```

**For LTR locales (en, pl, es, de, zh, hi):** No special CSS handling needed.

### Phase 5: SEO Verification

**13. Update verify-seo.js**

```javascript
// Add to locales array
const locales = ['de-DE', 'en-US', 'es-ES', 'pl-PL', 'zh-CN', 'ar-SA', 'hi-IN'];

// Add to testUrls
const testUrls = [
  // ... existing
  '/hi/guides/what-is-nostr',
];

// Add to localeConfigs
const localeConfigs = {
  // ... existing
  hi: { htmlLang: 'hi', ogLocale: 'hi_IN' },
};

// Add to indexLocales
const indexLocales = ['en', 'de', 'pl', 'es', 'zh', 'ar', 'hi'];

// Update summary line
console.log('• All 7 locales (en, pl, es, de, zh, ar, hi) are properly configured');
```

---

## Verification Checklist

After completing ALL 12+ files, verify:

```bash
# 1. Build passes
npm run build

# 2. Check for translation warnings
npm run build 2>&1 | grep -i "translation key not found"

# 3. Verify SEO/hreflang
npm run verify-seo

# 4. Verify page count increased
# Before: 136 pages for 6 locales
# After: 153 pages for 7 locales
ls dist/hi/guides/ | wc -l

# 5. Verify HTML lang attribute
grep 'lang="hi"' dist/hi/guides/what-is-nostr/index.html

# 6. Verify OG locale
grep 'og:locale.*content="hi_IN"' dist/hi/guides/what-is-nostr/index.html

# 7. Check ALL hardcoded files include new locale
for file in \
  src/components/LanguageSwitcher.tsx \
  src/i18n/index.ts \
  "src/pages/[lang]/guides/[slug].astro" \
  "src/pages/[lang]/guides/index.astro" \
  src/pages/guides/index.astro \
  src/pages/progress.astro; do
  echo "=== $file ==="
  grep -n "hi" "$file" | head -3 || echo "MISSING!"
done

# 8. Test user journey (CRITICAL!)
# - Visit /{locale}/guides/ directly
# - Use language switcher to switch locales
# - Check navigation displays correctly
# - Verify redirects work from /guides/ to /{locale}/guides/
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Stopping After Config Files
**Don't:** Stop after modifying the 6 config files
**Do:** Run the grep command and fix ALL 6 hardcoded-array component files

The pattern that ALWAYS happens:
1. Dev adds locale to config files ✓
2. Dev tests `/{locale}/guides/` - it works! ✓
3. Dev commits, considers done ✓
4. Bug: Language switcher doesn't show new locale ✗
5. Bug: `/{locale}/guides/` returns 404 for some routes ✗
6. Bug: Progress tracking doesn't work for new locale ✗

### ❌ Mistake 2: Translation Placeholder Format Mismatch

Quiz components use `{{double}}` braces, navigation uses `{single}` braces.

```json
// WRONG for quiz (will show literal "{{current}}")
"questionCounter": "{current} सवाल {total} में से"

// CORRECT for quiz
"questionCounter": "{{current}} सवाल {{total}} में से"

// WRONG for navigation (will not replace)
"unlockMessage": "Complete {{count}} guides from {{level}}"

// CORRECT for navigation
"unlockMessage": "Complete {count} guides from {level}"
```

### ❌ Mistake 3: Task Agents Creating Wrong Translation Structures

AI agents sometimes create translation structures that don't match component expectations.

**Example:** Agent created `nip05Checker.messages.*` but component expected `nip05Checker.benefits.*`, `nip05Checker.form.*`, `nip05Checker.results.*`

**Always verify:**
```bash
grep "t('nip05Checker\." src/components/interactive/NIP05Checker.tsx
```

### ❌ Mistake 4: Missing `client:load` Directive

```jsx
<!-- ❌ WRONG - will fail hydration -->
<ZapSimulator />

<!-- ✅ CORRECT - works with translations -->
<ZapSimulator client:load />
```

### ❌ Mistake 5: Hardcoded Internal Links

```markdown
<!-- ❌ WRONG - no locale prefix -->
[Learn more](/guides/what-is-nostr)

<!-- ✅ CORRECT - includes locale -->
[Learn more](/hi/guides/what-is-nostr)
```

### ❌ Mistake 6: JSX Comments with Embedded Expressions in MDX

```jsx
<!-- ❌ WRONG - breaks MDX parsing -->
{/* const { locale } = Astro.props; {locale} */}

<!-- ✅ CORRECT - remove entirely or simplify -->
<!-- No JSX comments with {expressions} in MDX frontmatter area -->
```

### ❌ Mistake 7: Assuming Content is Incomplete

A guide with 119 lines vs 400 in English might be a complete concise translation. Don't judge by line count alone.

### ❌ Mistake 8: Physical CSS Properties for RTL

```css
/* WRONG for RTL */
.ml-4 { margin-left: 1rem; }
.text-left { text-align: left; }

/* CORRECT - works for both LTR and RTL */
.ms-4 { margin-inline-start: 1rem; }
.text-start { text-align: start; }
```

---

## Quick Reference: Adding a New Locale

```bash
# 0. Read this skill FIRST

# 1. Config files (the easy part)
# Edit: src/config/locales.ts, src/i18n/types.ts, astro.config.mjs

# 2. CRITICAL: Run grep BEFORE anything else
grep -rn "'en'\|'pl'\|'es'\|'de'\|'zh'\|'ar'" src/ --include="*.{ts,tsx,astro}"

# 3. Update ALL 6 hardcoded-array files found by grep
# - LanguageSwitcher.tsx
# - i18n/index.ts
# - [slug].astro
# - [lang]/guides/index.astro
# - guides/index.astro
# - progress.astro

# 4. Create translation file
cp src/i18n/locales/en.json src/i18n/locales/{locale}.json
# Translate ALL 29+ sections

# 5. Create content directory
mkdir -p src/content/guides/{locale}
cp src/content/guides/en/*.mdx src/content/guides/{locale}/
# Translate all 16 guides, fix internal links to include locale prefix
# Add client:load to all interactive components

# 6. Update SEO verification
# Edit: scripts/verify-seo.js

# 7. Build and verify
npm run build
npm run verify-seo

# 8. Manual testing
# - Visit /{locale}/guides/
# - Test language switcher
# - Test navigation
# - Test redirects
```

---

## Current Locale Status

| Locale | Code | Direction | Status |
|--------|------|----------|--------|
| English | en | ltr | ✅ Complete |
| Polish | pl | ltr | ✅ Complete |
| Spanish | es | ltr | ✅ Complete |
| German | de | ltr | ✅ Complete |
| Chinese | zh | ltr | ✅ Complete |
| Arabic | ar | rtl | ✅ Complete |
| Hindi | hi | ltr | ✅ Complete |

---

## References

- docs/internal/LESSONS_HI_LOCALE.md — Hindi locale addition (6 hardcoded-array discovery)
- docs/internal/LESSONS_AR_LOCALE.md — Arabic locale addition (RTL, placeholder syntax, client:load)
- docs/internal/LESSONS_ZH_LOCALE.md — Chinese locale addition
- Astro i18n docs: https://docs.astro.build/en/recipes/i18n/
- tailwindcss-rtl: https://github.com/stevecochrane/tailwindcss-rtl