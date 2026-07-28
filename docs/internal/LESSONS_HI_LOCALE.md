# Lessons Learned: Adding Hindi (hi) Locale

## Summary
Successfully added Hindi (hi) as the 7th locale to Nostrich.love. The most critical lesson: **6 separate files have hardcoded locale arrays that must be updated when adding any new locale.** Missing any one causes 404s or missing language switcher entries.

---

## Critical Lesson: The 6 Hardcoded Files That Break Everything

### The Problem

When adding Hindi, I updated the standard config files (`locales.ts`, `types.ts`, `astro.config.mjs`) and created translations + content files. But **6 other files** have hardcoded arrays of locale strings that also needed updating.

**Missing any one of these caused real breakage:**

| # | File | What Broke When Missing |
|---|------|------------------------|
| 1 | `src/components/LanguageSwitcher.tsx` | Hindi missing from dropdown, URLs like `/hi/` not detected as locale routes |
| 2 | `src/i18n/index.ts` | Translation imports missing, `getCurrentLocale()` doesn't recognize `hi` |
| 3 | `src/pages/[lang]/guides/[slug].astro` | `/hi/guides/*` returns 404 (not in getStaticPaths) |
| 4 | `src/pages/[lang]/guides/index.astro` | `/hi/guides/` returns 404 (missing params and locale detection) |
| 5 | `src/pages/guides/index.astro` | Users with saved Hindi preference see fallback, not Hindi |
| 6 | `src/pages/progress.astro` | Progress tracking doesn't work for Hindi users |

### Why This Is a Recurring Pattern

**Every previous locale addition (pl, es, de, zh, ar) forgot at least one of these files.** The pattern:

1. Dev adds config files → builds pass → **assumes it works**
2. Language switcher, routing, or preferences silently fail
3. Only discovered when manually testing the new locale

### The Fix: Mandatory Checklist

**This checklist must be followed for EVERY new locale addition:**

```markdown
## New Locale Checklist

### Standard Config (always remembered)
- [ ] `src/config/locales.ts` — Add locale entry with direction
- [ ] `src/i18n/types.ts` — Add locale string to Locale type union
- [ ] `astro.config.mjs` — Add locale to `i18n.locales` and sitemap `i18n.locales`
- [ ] `src/i18n/locales/{locale}.json` — Complete translation file
- [ ] `src/content/guides/{locale}/` — All 16 guide MDX files

### 6 Hardcoded Files (frequently forgotten)
- [ ] `src/components/LanguageSwitcher.tsx` — Add to `languages` array, URL detection, redirect, localStorage
- [ ] `src/i18n/index.ts` — Add import, translations record, getCurrentLocale
- [ ] `src/pages/[lang]/guides/[slug].astro` — Add to getStaticPaths locales
- [ ] `src/pages/[lang]/guides/index.astro` — Add params + locale detection
- [ ] `src/pages/guides/index.astro` — Add to localStorage saved language array
- [ ] `src/pages/progress.astro` — Add to saved language preference array

### Verification
- [ ] `scripts/verify-seo.js` — Add locale to check arrays
- [ ] `npm run build` — Must pass
- [ ] Manual test: visit `/{locale}/guides/` in browser
- [ ] Manual test: language switcher shows new locale
- [ ] Manual test: switching to new locale persists across navigation
```

---

## Hindi-Specific Notes

### Direction: LTR (No RTL Handling Needed)

Hindi is left-to-right, so no RTL-specific CSS changes were needed (unlike Arabic).

### Technical Terms Stay in English

- Nostr, Relay, Zap, npub, nsec, Lightning, Bitcoin, NIP-05, NIP-04, NIP-17, DM
- These are protocol terms, not UI labels

### JavaScript String Sequence

The `hi` locale code must appear in the same position across all hardcoded arrays to maintain consistency. Alphabetical order (after `de`, before `pl` per some arrays, or at end) doesn't matter as much as **being present in all of them**.

---

## Files Created/Modified for Hindi

### Standard Config Files
1. `/src/config/locales.ts` — Added `hi` with `direction: 'ltr'`
2. `/src/i18n/types.ts` — Added `'hi'` to Locale type union
3. `/astro.config.mjs` — Added `hi` to i18n.locales and sitemap (`hi-IN`)

### Hardcoded Files (THE ONES THAT MATTER)
4. `src/components/LanguageSwitcher.tsx` — Language list, URL regex, redirect, localStorage
5. `src/i18n/index.ts` — Import, record, getCurrentLocale
6. `src/pages/[lang]/guides/[slug].astro` — getStaticPaths locales
7. `src/pages/[lang]/guides/index.astro` — params + locale detection
8. `src/pages/guides/index.astro` — localStorage check
9. `src/pages/progress.astro` — saved language check

### Content Files
10. `/src/i18n/locales/hi.json` — Complete Hindi translations (1387 lines)
11. `/src/content/guides/hi/` — 16 MDX guide files with locale-prefixed links

### Verification
12. `/scripts/verify-seo.js` — Added Hindi to all check arrays

---

## Build Verification

```bash
npm run build
# Result: 153 pages built (was 136 before Hindi)
# All 16 Hindi guide directories present in dist/hi/guides/

npm run verify-seo
# Expected: All 7 locales passing
```

---

## Verification Commands for Future Locales

```bash
# 1. Verify build passes
npm run build

# 2. Check that all hardcoded files include new locale
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

# 3. Verify translation completeness
for locale in en pl es de zh ar hi; do
  echo "=== $locale ==="
  grep -c "zapSimulator\." src/i18n/locales/$locale.json || echo "MISSING"
done

# 4. Run SEO verification
npm run verify-seo
```

---

## Conclusion

The #1 lesson from adding Hindi: **Config files are only 20% of the work. The other 80% is finding and updating hardcoded locale checks scattered throughout components.** This is the same pattern observed when adding Arabic (lesson #14-16 in AGENTS.md). The 6-file checklist in AGENTS.md is the solution — it must be followed verbatim for every new locale.