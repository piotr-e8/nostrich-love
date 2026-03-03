# Translation Maintenance & Troubleshooting Guide

**Companion to:** 
- [TRANSLATION_REFERENCE.md](./TRANSLATION_REFERENCE.md) - UI translations (JSON)
- [GUIDE_TRANSLATION_PROCESS.md](./GUIDE_TRANSLATION_PROCESS.md) - Guide content translations (MDX)

This document captures lessons learned from the translation process, common issues encountered, and maintenance procedures for keeping translations healthy.

---

## 🎯 Purpose

After completing translations for Polish and Spanish, we discovered several patterns, bugs, and best practices. This guide helps prevent these issues when adding new languages or maintaining existing ones.

---

## 🐛 Common Issues & Solutions

### Issue 1: Maximum Update Depth Exceeded

**Symptom:** React error "Maximum update depth exceeded" in components using translations

**Cause:** Using the `t` function from `useTranslation` as a `useEffect` dependency creates an infinite loop because `t` is recreated on every render.

**Example (BAD):**
```typescript
useEffect(() => {
  setSecurityChecks(getSecurityChecks(t));
}, [t]); // ❌ This causes infinite loop
```

**Solution:**
```typescript
const { t, locale } = useTranslation();

useEffect(() => {
  setSecurityChecks(getSecurityChecks(t));
}, [locale]); // ✅ Only depend on locale, not t
```

**Affected Files:**
- `/src/components/interactive/KeyGenerator.tsx`

---

### Issue 2: Missing Dark Mode Styles

**Symptom:** Elements appear white in dark mode or text is invisible (same color as background)

**Cause:** Tailwind CSS classes missing `dark:` prefix or using `dark:` without the full class name (e.g., `dark:yellow-900/20` instead of `dark:bg-yellow-900/20`)

**Example (BAD):**
```tsx
<div className="bg-yellow-50 dark:yellow-900/20"> // ❌ Missing 'bg-' prefix
```

**Solution:**
```tsx
<div className="bg-yellow-50 dark:bg-yellow-900/20"> // ✅ Complete class name
```

**Common Mistakes:**
- `text-white` without `dark:text-white` pair → invisible in light mode
- `dark:yellow-900/20` without `bg-` prefix → doesn't work
- `dark:red-900/30` without `bg-` prefix in badges

**Affected Files:**
- `/src/components/interactive/KeyGenerator.tsx` (multiple instances)
- Any component with conditional dark mode styling

---

### Issue 3: Translation Keys Missing from TypeScript Types

**Symptom:** TypeScript errors: "Property 'guidesPage' does not exist on type 'Translations'"

**Cause:** Added new translation keys to JSON files but didn't update TypeScript interface in `/src/i18n/types.ts`

**Solution:**
Always update the `Translations` interface when adding new key categories:

```typescript
export interface Translations {
  // ... existing keys
  guidesPage?: {
    hero: { title: string; description: string; /* ... */ };
    // ...
  };
  // Add other new categories here
}
```

**Best Practice:**
- Make all new translation properties optional (`?`) to maintain backward compatibility
- This allows gradual rollout of translations across languages

---

### Issue 4: Hardcoded Strings in Data Files

**Symptom:** Some UI elements remain in English even after translation

**Cause:** Static data files (like `/src/data/learning-paths.ts`) contain hardcoded labels and descriptions that aren't hooked up to the translation system

**Example:**
```typescript
export const SKILL_LEVELS = {
  beginner: {
    label: 'Beginner', // ❌ Hardcoded English
    description: 'Start your journey...', // ❌ Hardcoded English
  }
};
```

**Solution Options:**

**Option A - Transform to Functions:**
```typescript
export const getSkillLevels = (t: (key: string) => string) => ({
  beginner: {
    label: t('skillLevels.beginner.label'),
    description: t('skillLevels.beginner.description'),
  }
});
```

**Option B - Keep in Components:**
Move labels to components that use translations and pass them as props

**Affected Files:**
- `/src/data/learning-paths.ts`
- `/src/data/tours/*.ts` (likely - not yet translated)

---

### Issue 5: Placeholder Mismatches

**Symptom:** Dynamic values don't appear in translated text (shows `{count}` literally instead of the number)

**Cause:** Translator changed placeholder names or code uses wrong placeholder name

**Example (BAD):**
```json
// English
"guideCard.moreLocked": "+{count} more locked"

// Polish (WRONG)
"guideCard.moreLocked": "+{liczba} więcej zablokowanych" // ❌ Changed {count} to {liczba}
```

**Solution:**
Always preserve exact placeholder names across all languages:
```json
// Polish (CORRECT)
"guideCard.moreLocked": "+{count} więcej zablokowanych" // ✅ Same placeholder name
```

**Testing:**
```typescript
const text = t('guideCard.moreLocked').replace('{count}', '5');
expect(text).toBe('+5 more locked'); // or translated equivalent
```

---

### Issue 6: Missing client:load on Interactive Components

**Symptom:** Interactive components render in English only, ignoring locale

**Cause:** MDX files missing `client:load` directive, causing server-side rendering with default (English) locale

**Example (BAD):**
```mdx
<KeyGenerator /> // ❌ Renders server-side in English
```

**Solution:**
```mdx
<KeyGenerator client:load /> // ✅ Client-side rendering with current locale
```

**Affected Files:**
- `/src/content/guides/*/what-is-nostr.mdx` (ProtocolComparison component)

**See also:** [GUIDE_TRANSLATION_PROCESS.md](./GUIDE_TRANSLATION_PROCESS.md) for complete guide translation workflow.

---

### Issue 7: Locale Not Detecting URL Changes

**Symptom:** Language doesn't switch when navigating between `/en/guides` and `/pl/guides`

**Cause:** `useTranslation` hook only checks locale on mount, not on URL changes

**Solution:**
Add URL change detection in the hook:

```typescript
useEffect(() => {
  // Check on mount
  setLocale(getCurrentLocale());
  
  // Listen for URL changes
  const handleUrlChange = () => {
    setLocale(getCurrentLocale());
  };
  
  window.addEventListener('popstate', handleUrlChange);
  
  // Also poll periodically (for programmatic navigation)
  const interval = setInterval(() => {
    const currentLocale = getCurrentLocale();
    if (currentLocale !== locale) {
      setLocale(currentLocale);
    }
  }, 100);
  
  return () => {
    window.removeEventListener('popstate', handleUrlChange);
    clearInterval(interval);
  };
}, [locale]);
```

---

### Issue 8: Duplicate Translation Keys

**Symptom:** Translations appearing in wrong places or being overridden

**Cause:** Same key name used in different contexts (e.g., `protocolComparison` in both guide content and UI component)

**Solution:**
Use distinct prefixes for different contexts:

```json
{
  "guides": {
    "protocolComparison": { /* guide content */ }  // ❌ Potential conflict
  },
  "protocolComparisonUI": { /* UI component */ }   // ✅ Distinct key
}
```

---

## 🧪 Testing Checklist

Before marking a language as "complete":

### Visual Testing
- [ ] Switch to new language and refresh page
- [ ] Check all navigation elements (header, footer, breadcrumbs)
- [ ] Verify all buttons display correctly
- [ ] Check that no text overflows containers (especially German)
- [ ] Test dark mode in all major components
- [ ] Test light mode in all major components

### Interactive Components
- [ ] KeyGenerator - generate keys, copy buttons, security checklist
- [ ] TroubleshootingWizard - go through question flow
- [ ] NIP05Checker - test verification flow, error messages
- [ ] EmptyFeedFixer - all 3 steps, starter packs
- [ ] BackupChecklist - all checklist items, modals
- [ ] ClientComparisonTable - filters, search, client cards
- [ ] ClientRecommender - complete quiz flow

### Simulators
- [ ] NostrSimulator - controls, messages
- [ ] QuickstartSimulator - step through all steps
- [ ] ProtocolComparison - all comparison items
- [ ] PostFlowSimulator - step descriptions
- [ ] ZapSimulator - all labels and buttons
- [ ] RelayVisualizer - control labels
- [ ] RelayWorldMap - region labels

### Guides & Navigation
- [ ] Guides page - hero, CTA, filter section
- [ ] Guide sections - level titles, status badges
- [ ] Guide cards - difficulty labels, status text
- [ ] Individual guide pages - navigation, continue learning
- [ ] Quiz components - questions, options, results

### Relay Tools
- [ ] RelayExplorer - all filters, cards, toasts
- [ ] RelayPlayground - all tabs, buttons, forms

### Dynamic Content
- [ ] Test all placeholder replacements work
- [ ] Verify pluralization (if applicable)
- [ ] Check that numbers/dates format correctly
- [ ] Test error messages with dynamic content

---

## 🔄 Maintenance Workflow

### When Adding a New Feature

1. **Design Phase**
   - Identify all user-facing strings
   - Plan translation key structure
   - Check for existing similar keys (reuse if possible)

2. **Development**
   - Add keys to English JSON first
   - Use `t()` function from the start (no hardcoded strings)
   - Add keys to TypeScript types

3. **Translation**
   - Add keys to all other language files
   - Use English as placeholder if translation not ready
   - Document new keys in TRANSLATION_REFERENCE.md

4. **Testing**
   - Test in all supported languages
   - Verify placeholders work correctly
   - Check responsive design with longer text

5. **Documentation**
   - Update TRANSLATION_REFERENCE.md
   - Update this guide if new issues discovered

---

### When Adding a New Language

1. **Setup**
   - Copy `en.json` to new locale file
   - Register locale in `types.ts`
   - Import in `index.ts`
   - Update LanguageSwitcher if exists

2. **Translation**
   - Use translation service or native speakers
   - Keep technical terms in English
   - Maintain placeholder names exactly
   - Use informal "you" form

3. **Review**
   - Check for consistency (same word for same concept)
   - Verify all placeholders preserved
   - Review for cultural appropriateness

4. **Testing**
   - Run through full Testing Checklist above
   - Fix any visual issues (overflow, contrast)
   - Test on mobile devices

5. **Launch**
   - Deploy to staging first
   - Have native speakers review
   - Fix any issues
   - Deploy to production

---

## 🚨 Known Limitations

### Not Yet Translated (as of current version)

1. **Tour Files** (`/src/data/tours/*.ts`)
   - 8 files for different Nostr clients
   - Contain hardcoded English onboarding text
   - Impact: Users viewing client tours see English text

2. **Social Media Content**
   - Kept in English intentionally
   - Could be translated if needed for specific markets

3. **Error Boundaries**
   - Not checked for hardcoded text
   - Should be verified

4. **Browser Default Messages**
   - Form validation messages from browser
   - Cannot be translated (browser-controlled)

5. **Learning Path Data**
   - `/src/data/learning-paths.ts` has hardcoded descriptions
   - Needs refactoring to support translations

---

## 💡 Best Practices

### Code Patterns

**✅ DO:**
```typescript
// Use useTranslation hook
const { t, locale } = useTranslation();

// Provide fallback
const text = t('key') || 'Default Text';

// Handle placeholders safely
t('key').replace('{count}', String(count));

// Use locale for effects, not t
useEffect(() => {
  // ...
}, [locale]);
```

**❌ DON'T:**
```typescript
// Don't use t in dependencies
useEffect(() => { ... }, [t]);

// Don't assume translation exists
const text = t('key'); // No fallback

// Don't change placeholder names
// "{count}" → "{liczba}" ❌
```

---

### Naming Conventions

**Key Structure:**
```
componentName.section.subsection.item
```

**Examples:**
- `keyGenerator.securityChecklist.title`
- `troubleshootingWizard.questions.start.text`
- `ui.buttons.submit`

**Arrays:**
Use numeric indices for ordered lists:
- `securityTips.items.0`
- `stepDescriptions.0`

---

### Translation Content Guidelines

**Keep Technical Terms in English:**
- ✅ npub, nsec, NIP-05, Zap, Relay, Client, Nostr
- Don't translate these - they're protocol-specific

**Use Consistent Terminology:**
- Choose ONE word for "guide" and use everywhere
- Don't mix: "tutorial", "guide", "lesson", "course"

**Consider Text Expansion:**
- German: +30% longer than English
- Plan for longer text in buttons, labels
- Use responsive design

**Test with Worst-Case:**
- Use longest translations for testing
- Ensure text doesn't overflow or break layout

---

## 📊 Quality Metrics

Track these to ensure translation quality:

### Coverage
- Percentage of keys translated per language
- Goal: 100% for all user-facing content

### Consistency
- Number of different translations for same concept
- Goal: 1 term per concept per language

### Technical Terms
- List of technical terms kept in English
- Document for translators

### Bug Reports
- Track translation-related bugs
- Categorize by type (missing, wrong, overflow, etc.)

---

## 🔧 Debugging Translations

### Translation Not Appearing

1. Check JSON file has the key
2. Verify TypeScript types include the key
3. Ensure component imports `useTranslation`
4. Check for typos in key name
5. Verify `client:load` directive for interactive components

### Placeholder Not Working

1. Check placeholder name matches exactly (`{count}` vs `{count}`)
2. Verify replace() is being called
3. Ensure value is converted to string
4. Check for spaces: `{ count }` vs `{count}`

### Styling Issues

1. Check dark mode classes have full names (`dark:bg-` not `dark:`)
2. Verify text colors contrast with backgrounds
3. Test with longest translation
4. Check responsive behavior

---

## 📝 Change Log

**2025-01-XX - Translation Phase 1 Complete**
- Fixed KeyGenerator infinite loop bug
- Fixed dark mode styling issues
- Translated all Priority 1 interactive components
- Translated Guides page elements
- Created comprehensive translation reference
- Added TypeScript types for new translation categories

**Known Issues:**
- Tour files still in English
- Learning paths data hardcoded
- Some error boundaries not checked

---

## 🤝 Contributing Translations

Want to help translate? Here's how:

### UI Translations (JSON)
1. Check TRANSLATION_REFERENCE.md for key structure
2. Pick a language or component to translate
3. Copy en.json and translate values (keep keys)
4. Test thoroughly using Testing Checklist

### Guide Content Translations (MDX)
1. See [GUIDE_TRANSLATION_PROCESS.md](./GUIDE_TRANSLATION_PROCESS.md) for complete workflow
2. Translate all 16 guide files from `/src/content/guides/en/` to `/{locale}/`
3. Preserve imports, `client:load` directives, and technical terms
4. Update internal links with locale prefix

### Submit PR with:
- Translation files (JSON and/or MDX)
- TypeScript type updates (if new categories)
- Screenshots of key UI elements
- Notes on any challenges or decisions

---

## 📞 Getting Help

If you encounter translation issues:

1. Check this guide for similar issues
2. **For guide content:** Review [GUIDE_TRANSLATION_PROCESS.md](./GUIDE_TRANSLATION_PROCESS.md)
3. **For UI elements:** Review TRANSLATION_REFERENCE.md for key documentation
4. Look at existing translations (en.json, pl.json, es.json) as examples
5. Check guide files (en/, pl/, es/) for MDX translation patterns
6. Open an issue with:
   - Language and component affected
   - Screenshot if visual issue
   - Steps to reproduce

---

## 📚 Related Documentation

- **[TRANSLATION_REFERENCE.md](./TRANSLATION_REFERENCE.md)** - UI translation keys reference (JSON files)
- **[GUIDE_TRANSLATION_PROCESS.md](./GUIDE_TRANSLATION_PROCESS.md)** - Guide content translation workflow (MDX files)

---

**Version:** 1.1  
**Last Updated:** 2025-02-23  
**Maintained by:** Project maintainers

---

*This document evolves as we discover new issues and patterns. Please update it when you encounter and fix translation-related bugs.*
