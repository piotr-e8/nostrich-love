# Translation Documentation Index

This project has comprehensive documentation for translating all content into new languages.

## Documentation Files

### 1. [TRANSLATION_REFERENCE.md](./TRANSLATION_REFERENCE.md)
**Scope:** UI translations (JSON files)

- ~690 translation keys catalog
- Component-by-component reference
- Usage patterns and examples
- Key naming conventions

**Use this for:** Buttons, labels, messages, interactive component text

---

### 2. [GUIDE_TRANSLATION_PROCESS.md](./GUIDE_TRANSLATION_PROCESS.md)
**Scope:** Guide content translations (MDX files)

- Complete translation workflow (7 steps)
- 16 guides per language checklist
- Frontmatter rules
- Component usage with `client:load`
- Internal linking with locale prefixes
- Common translation patterns

**Use this for:** Translating guide content files

---

### 3. [TRANSLATION_MAINTENANCE.md](./TRANSLATION_MAINTENANCE.md)
**Scope:** Troubleshooting and best practices

- 8 common issues with solutions
- Testing checklist
- Known limitations
- Code patterns (do's and don'ts)
- Maintenance procedures

**Use this for:** Fixing translation bugs, understanding known issues

---

## Quick Start: Adding a New Language

### Step 1: UI Translations
1. Create `/src/i18n/locales/{locale}.json`
2. Copy structure from `en.json`
3. Translate all values (keep keys)
4. Register in `/src/i18n/types.ts` and `index.ts`

**See:** [TRANSLATION_REFERENCE.md](./TRANSLATION_REFERENCE.md)

### Step 2: Guide Content
1. Create `/src/content/guides/{locale}/` directory
2. Translate all 16 guide files from `en/`
3. Keep filenames identical
4. Preserve imports and `client:load` directives
5. Update internal links with locale prefix

**See:** [GUIDE_TRANSLATION_PROCESS.md](./GUIDE_TRANSLATION_PROCESS.md)

### Step 3: Routing
1. Add locale to `/src/pages/[lang]/guides/[slug].astro` (line 82)
2. Add locale to `/src/pages/[lang]/guides/index.astro` (line 11)

### Step 4: Testing
1. Build: `npm run build`
2. Visual check in browser
3. Test interactive components
4. Verify navigation

**See:** [TRANSLATION_MAINTENANCE.md](./TRANSLATION_MAINTENANCE.md) - Testing Checklist

---

## Translation Scope

| Content Type | Files | Location | Documentation |
|-------------|-------|----------|---------------|
| UI Elements | JSON | `/src/i18n/locales/` | TRANSLATION_REFERENCE.md |
| Guide Content | MDX | `/src/content/guides/` | GUIDE_TRANSLATION_PROCESS.md |
| Routes | Astro | `/src/pages/[lang]/` | GUIDE_TRANSLATION_PROCESS.md |

---

## Current Status

| Language | Code | UI (JSON) | Guides (MDX) | Status |
|----------|------|-----------|--------------|--------|
| English | `en` | ✅ 690 keys | ✅ 16 files | Complete |
| Polish | `pl` | ✅ 690 keys | ✅ 16 files | Complete |
| Spanish | `es` | ✅ 690 keys | ✅ 16 files | Complete |

---

## Estimated Time for New Language

- **UI Translations:** 20-30 hours
- **Guide Content:** 40-60 hours
- **Testing & QA:** 10-15 hours
- **Total:** 70-105 hours

*Assumes experienced translator familiar with Nostr terminology*

---

## Key Principles

1. **Keep technical terms in English:** `npub`, `nsec`, `NIP-05`, `Zap`, `Relay`
2. **Preserve component structure:** Imports, `client:load`, classNames
3. **Use informal tone:** "you" / "ty" / "tú" (not formal)
4. **Consistent terminology:** One translation per term, used everywhere
5. **Locale prefixes:** All internal links need `/{locale}/` prefix

---

## Getting Help

1. Check the three documentation files above
2. Review existing translations (en.json, pl/, es/)
3. Open an issue with specifics
4. Ask in project discussions

---

**Last Updated:** 2025-02-23  
**Languages Supported:** 3 (en, pl, es)  
**Total Translation Files:** 3 documentation + 3 languages × (1 JSON + 16 MDX) = 54 files
