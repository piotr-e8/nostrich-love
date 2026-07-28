# Lessons Learned: Adding Arabic (ar) Locale

## Summary
Successfully added Arabic (ar) as the 6th locale to Nostrich.love with full RTL support. This document captures critical lessons about interactive component translations and placeholder syntax patterns.

---

## Critical Lessons for RTL Languages

### 1. Placeholder Syntax Pattern (MOST IMPORTANT)

**Problem:** The codebase uses TWO different placeholder conventions, and mixing them breaks translations.

```javascript
// Quiz components (double braces) ✅
// Code does: .replace("{{current}}", ...)
// JSON must use: "{{current}}", "{{total}}", "{{score}}"

// Navigation/other components (single braces) ✅
// Code does: .replace('{level}', ...)
// JSON must use: "{level}", "{count}", "{currentLevel}"
```

**Impact:** When Arabictranslations used wrong format:
- Quiz scores showed literally `{{current}}` instead of Arabic numbers
- Navigation showed `{level}` instead of "متوسط"

**Fix:** Check each component's replacement code to determine correct format:

```bash
# Find which format acomponent uses:
grep -n "\.replace" src/components/interactive/WhatIsNostrQuiz.tsx
# Shows: .replace("{{current}}", ...)  → Use double braces

grep -n "\.replace" src/components/navigation/GuideNavigation.tsx
# Shows: .replace('{level}', ...)  → Use single braces
```

### 2. Task Agents Can Create Wrong Structures

**Problem:** AI task agents sometimes create translation structures that don't match component expectations.

**What happened:**
- Task agent created `nip05Checker.messages.*` and `nip05Checker.instructions.*`
- Component actually expected `nip05Checker.benefits.*`, `nip05Checker.form.*`, `nip05Checker.results.*`

**Detection:**
```bash
# Check component's translation keys:
grep -n "t('nip05Checker\." src/components/interactive/NIP05Checker.tsx

# Shows what keys the component ACTUALLY uses:
# nip05Checker.title
# nip05Checker.whatIsNip05
# nip05Checker.benefits.*
# nip05Checker.form.*
# nip05Checker.results.*
# nip05Checker.errors.*
```

**Fix:** Always verify translation structure matches component code BEFORE accepting the work.

### 3. Interactive Components Need client:load

**Problem:** Interactive components using `useTranslation()` fail hydration without `client:load`.

**Symptom:**
- Component renders but throws hydration error
- Translations don't appear

**Fix:** Always add `client:load` directive:

```jsx
// ❌ WRONG - will fail hydration
<RelayWorldMap />

// ✅ CORRECT - works with translations
<RelayWorldMap client:load />
```

**Detection:** Search for components missing the directive:
```bash
grep -r "import.*RelayWorldMap\|import.*ZapSimulator\|import.*NIP05Checker" src/content/guides --include="*.mdx" | grep -v "client:load"
```

---

## Arabic-Specific Considerations

### RTL Layout

Arabicis Right-to-Left (RTL) and requires:

1. **HTML lang attribute:** `lang="ar"`
2. **OG locale:** `ar_SA` (Saudi Arabia)
3. **CSS logical properties:** Use `ms-4` instead of `ml-4`
4. **Text direction:** Set `dir="rtl"` on layout

### Translation Quality Guidelines

For Arabic translations, ensure:
- Use clear, modern Arabic (avoid overly formal classical Arabic)
- Technical terms may stay in English (Bitcoin, Nostr, Relay, Zap)
- Verify cultural appropriateness of examples
- Test with actual RTL rendering

---

## Files Modified for Arabic

### Configuration Files
1. `/src/config/locales.ts` - Added `ar` with RTL config
2. `/src/i18n/types.ts` - Added `'ar'` to Locale type
3. `/astro.config.mjs` - Added 'ar' to i18n.locales

### Content Files
4. Created 16 MDX guide files in `/src/content/guides/ar/`
5. Created complete `/src/i18n/locales/ar.json`

### Fixed Interactive Components
6. Updated `/src/content/guides/ar/relays-demystified.mdx` - Added `client:load`
7. Fixed ZapSimulator translations (labels.invoice, buttons.pay, buttons.copy)
8. Replaced entire NIP05Checker translation structure

---

## Translation Verification Commands

```bash
# 1. Verify JSON is valid
node -e "JSON.parse(require('fs').readFileSync('src/i18n/locales/ar.json', 'utf8')); console.log('Valid')"

# 2. Check placeholder format
grep "{{" src/i18n/locales/ar.json | head -5
grep '{level}\|{count}\|{currentLevel}' src/i18n/locales/ar.json | head -5

# 3. Verify structure matches component
grep "t('nip05Checker\." src/components/interactive/NIP05Checker.tsx > /tmp/component_keys.txt
grep '"nip05Checker"' src/i18n/locales/ar.json > /tmp/translation_keys.txt
# Compare manually

# 4. Check for client:load directive
grep -r "ZapSimulator\|NIP05Checker\|RelayWorldMap" src/content/guides/ar/*.mdx | grep -v "client:load"

# 5. Run SEO verification
npm run verify-seo | grep "ar:"
```

---

## Step-by-Step: Adding a New RTL Locale

When adding a new RTL language (Arabic, Hebrew, Farsi, Urdu):

### 1. Configuration
```typescript
// /src/config/locales.ts
export const locales = ['en', 'pl', 'es', 'de', 'zh', 'ar', 'he'] as const;

export const localeConfig = {
  // ... existing
  ar: {
    htmlLang: 'ar',
    ogLocale: 'ar_SA',
    name: 'العربية',
    direction: 'rtl', // IMPORTANT for RTL
  },
};
```

### 2. Language Switcher
```tsx
// /src/components/LanguageSwitcher.tsx
const languages = [
  // ... existing
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];
```

### 3. Create Translation File
- Copy `en.json` as template
- Translate ALL keys
- Verify placeholder format for each component
- Check structure matches component expectations

### 4. Create Guide Content
- Create `/src/content/guides/ar/` directory
- Create MDX files for each guide
- Add `client:load` to all interactive components

### 5. Verification
```bash
npm run build
npm run verify-seo
# Check for RTL specific issues in browser
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Copying Translation Structure Blindly
```json
// DON'T assume structure from other locales
"nip05Checker": {
  "messages": { ... }  // Wrong if component expects different structure
}

// DO verify against component code
// Check: grep "t('nip05Checker\." Component.tsx
```

### ❌ Mistake 2: Wrong Placeholder Syntax
```json
// DON'T mix formats
"questionCounter": "{current} من {total}"  // Wrong for quiz

// DO match component's replacement code
"questionCounter": "{{current}} من {{total}}"  // Correct for quiz
```

### ❌ Mistake 3: Missing client:load
```jsx
// DON'T assume hydration works
<ZapSimulator />

// DO always add directive
<ZapSimulator client:load />
```

### ❌ Mistake 4: Incomplete Translation Keys
```json
// DON'T just translate titles
"zapSimulator": {
  "title": "محاكي Zap"
}

// DO include all keys the component uses
"zapSimulator": {
  "title": "محاكي Zap",
  "labels": {
    "invoice": "فاتورة Lightning"
  },
  "buttons": {
    "pay": "ادفع Zap",
    "copy": "نسخ"
  }
}
```

---

## Placeholder Format Reference Table

| Component | Placeholder Format | Example |
|-----------|-------------------|---------|
| Quiz components (all) | `{{braces}}` | `{{current}}`, `{{total}}`, `{{score}}` |
| GuideNavigation | `{braces}` | `{level}`, `{count}` |
| RelayVisualizer | `{braces}` | `{count}` |
| ProtocolComparison | `{braces}` | `{count}` |
| GuideCard | `{braces}` | `{minutes}` |

---

## Interactive Components Translation Checklist

For each interactive component, verify:

- [ ] Component uses `useTranslation()` hook
- [ ] All translation keys exist in `ar.json`
- [ ] Placeholder format matches component code
- [ ] JSON structure matches component expectations
- [ ] `client:load` directive added in MDX file
- [ ] Component tested in browser with RTL layout

---

## Results

- **Translation keys added/fixed:** ~40
- **Components verified:** 15+
- **Client:load directives added:** 1
- **Placeholder syntax errors fixed:** 3
- **Structure mismatches fixed:** 1 (NIP05Checker)
- **Build time:** ~60 seconds
- **SEO verification:** ✅ All checks pass

---

## Conclusion

Adding Arabic (RTL) locale revealed that **interactive component translations are the hidden complexity**. The main lessons:

1. **Placeholder format varies by component** - always check the replacement code
2. **Task agents can create wrong structures** - verify against component code
3. **client:load is mandatory for hydration** - check all MDX files
4. **RTL needs special handling** - direction, logical CSS properties
5. **Verify structure matches code** - not just that translations exist

The pattern from Chinese applies here too: **configuration is easy, scattered component details are hard**.