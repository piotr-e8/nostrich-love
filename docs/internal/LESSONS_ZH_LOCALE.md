# Lessons Learned: Adding Chinese (zh) Locale

## Summary
Successfully added Chinese (Simplified) as the 5th locale to Nostrich.love. This document captures what was done, what was missed initially, and lessons for future locale additions.

---

## What Was Done

### 1. Configuration Files (Easy)
- ✅ `/src/config/locales.ts` - Added `zh` to locales array with proper config
- ✅ `/src/i18n/types.ts` - Added `'zh'` to Locale type union
- ✅ `/astro.config.mjs` - Added 'zh' to i18n.locales and sitemap config
- ✅ `/src/i18n/index.ts` - Imported zh translations and fixed `getAvailableLocales()` to use centralized config

### 2. Content Files (Medium)
- ✅ Created 16 MDX guide files in `/src/content/guides/zh/`
- ✅ Fully translated `/src/i18n/locales/zh.json` with all keys (14,917 keys)

### 3. UI Components (The Hidden Work)
Several components had **hardcoded locale checks** that needed updating:

#### LanguageSwitcher.tsx
- Added `{ code: "zh", label: "中文", flag: "🇨🇳" }` to languages array
- Added `/zh/` path detection in useEffect
- Updated localStorage validation to include 'zh'
- Updated regex patterns for path manipulation

#### GuideNavigation.tsx  
- Fixed translation placeholders to use single braces `{level}` instead of double `{{level}}`
- Updated to use translated level labels via `t(\`skillLevels.${level}.label\`)`

#### GuidesLink.tsx
- Added `/zh/` path detection
- Added 'zh' localStorage preference check

#### progress.astro
- Updated hardcoded locale array: `['en', 'pl', 'es', 'de', 'zh']`

#### guides/index.astro (redirect page)
- Added 'zh' and 'de' to the locale array (was missing both!)

#### scripts/verify-seo.js
- Added 'zh' locale to verification checks
- Fixed zh locale config to use `zh_CN` format

---

## Critical Issues Found & Fixed

### Issue 1: getAvailableLocales() Was Hardcoded
**Problem:** The function returned `['en', 'pl', 'es', 'de']` - missing 'zh'
**Impact:** Users accessing `/zh/` were redirected to default locale
**Fix:** Changed to use centralized config: `return [...locales] as Locale[]`

### Issue 2: Translation Placeholder Format
**Problem:** Chinese translations used `{{level}}` but code expected `{level}`
**Impact:** Bottom navigation showed literal `{Beginner}` instead of `新手`
**Fix:** Updated zh.json to use single braces and modified GuideNavigation.tsx to use translated labels

### Issue 3: Missing Content Sections
**Problem:** `outboxModel` guide had empty `content: {}` 
**Impact:** Missing section headers in guide navigation
**Fix:** Added 7 content section translations

### Issue 4: Hardcoded Locale Arrays Everywhere
**Problem:** Multiple components had hardcoded `['en', 'pl', 'es', 'de']` arrays
**Impact:** Chinese users got redirected or saw wrong content
**Fix:** Systematically found and updated all 4+ locations

---

## Files That Need Updating for New Locales

When adding a new locale, these files MUST be checked:

### Configuration (Always)
1. `/src/config/locales.ts` - Add locale config
2. `/src/i18n/types.ts` - Add to type union
3. `/astro.config.mjs` - Add to i18n.locales
4. `/src/i18n/index.ts` - Import translation file (if using imports)

### Content (Always)
5. `/src/content/guides/[locale]/` - Create guide MDX files
6. `/src/i18n/locales/[locale].json` - Full translation file

### Components (Often Forgotten!)
7. `/src/components/LanguageSwitcher.tsx` - Add to languages array + path detection
8. `/src/components/navigation/GuidesLink.tsx` - Add path detection
9. `/src/components/navigation/GuideNavigation.tsx` - Verify translation patterns
10. `/src/pages/progress.astro` - Update locale array
11. `/src/pages/guides/index.astro` - Update redirect logic

### SEO/Verification
12. `/scripts/verify-seo.js` - Add locale to checks

---

## Build Verification Checklist

After adding a new locale, ALWAYS:

```bash
# 1. Build the project
npm run build

# 2. Verify SEO
npm run verify-seo

# 3. Check for translation warnings
grep -i "translation key not found" build_output.log

# 4. Verify page count (should increase)
# Before: ~95 pages for 4 locales
# After: ~119 pages for 5 locales

# 5. Check zh pages exist
ls dist/zh/guides/ | wc -l  # Should be 16 + index

# 6. Verify HTML lang attributes
grep 'lang="zh"' dist/zh/guides/what-is-nostr/index.html

# 7. Check OG locale
grep 'og:locale.*content="zh_CN"' dist/zh/guides/what-is-nostr/index.html
```

---

## Lessons for Future

### 1. Use Centralized Config
Instead of hardcoded arrays like `['en', 'pl', 'es', 'de']`, always import from config:
```typescript
import { locales } from '../config/locales';
const validLocales = [...locales];
```

### 2. Verify Translation Key Formats
Check that translation files use the same placeholder format as the code:
- Code: `.replace('{level}', ...)` 
- JSON: Should be `{level}` not `{{level}}`

### 3. Check Content Sections
Don't just copy quiz translations - also copy the `content` section headers:
```json
"content": {
  "problemHook": "...",
  "solutionIntro": "...",
  "howItWorks": "...",
  // etc
}
```

### 4. Search for Hardcoded Locales
Use this command to find forgotten locale checks:
```bash
grep -r "'en'|'pl'|'es'|'de'" src/ --include="*.{ts,tsx,astro}"
```

### 5. Test the Full User Journey
- Visit `/zh/guides/` directly
- Use language switcher to switch to Chinese
- Check bottom navigation displays correctly
- Verify redirects work from `/guides/` to `/zh/guides/`

---

## Quick Reference: Adding a New Locale

```typescript
// 1. Add to /src/config/locales.ts
export const locales = ['en', 'pl', 'es', 'de', 'zh', 'fr'] as const;

export const localeConfig = {
  // ... existing configs
  fr: {
    htmlLang: 'fr',
    ogLocale: 'fr_FR',
    name: 'Français',
  },
};

// 2. Add to /src/i18n/types.ts
export type Locale = 'en' | 'pl' | 'es' | 'de' | 'zh' | 'fr';

// 3. Update LanguageSwitcher.tsx
const languages = [
  // ... existing
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

// 4. Update all hardcoded locale arrays (search for them!)
```

---

## What Was Actually Missing (Timeline)

1. **Initial work** (thought complete): Config + content files
2. **Bug reported**: zh locale redirected to default
3. **Root cause**: `getAvailableLocales()` was hardcoded
4. **Bug reported**: Chinese not in language list
5. **Root cause**: LanguageSwitcher.tsx had hardcoded array
6. **Bug reported**: Bottom navigation showed `{Beginner}`
7. **Root cause**: Wrong placeholder format + missing translations
8. **Final audit**: Found 2 more hardcoded locale arrays

**Pattern**: The config files were easy; the scattered hardcoded checks in components were the real work.

---

## Final Stats

- **Total files modified**: 8
- **Total lines changed**: ~150
- **Translation keys**: 14,917
- **Chinese guide pages**: 16
- **Build time**: ~45 seconds
- **Bugs found after "completion"**: 4

---

## Conclusion

Adding a new locale is 20% config, 80% finding hardcoded locale checks scattered throughout the codebase. The centralized config in `locales.ts` helped, but many components still had hardcoded arrays. Future locale additions should use a systematic search-and-update approach rather than assuming config changes are sufficient.
