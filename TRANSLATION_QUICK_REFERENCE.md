# Translation Quick Reference Card

**Quick reference for translators working on the Nostr Beginner Guide.**

---

## 📋 Checklist: Adding a New Language

### Phase 1: UI Translations (20-30 hours)
- [ ] Create `/src/i18n/locales/{locale}.json`
- [ ] Copy structure from `en.json`
- [ ] Translate all 690 keys (keep keys, translate values)
- [ ] Add locale to `/src/i18n/types.ts`
- [ ] Import in `/src/i18n/index.ts`
- [ ] Test: `npm run build`

### Phase 2: Guide Content (40-60 hours)
- [ ] Create `/src/content/guides/{locale}/` directory
- [ ] Translate all 16 MDX files from `en/` to `{locale}/`
- [ ] Update routing in `/src/pages/[lang]/guides/[slug].astro`
- [ ] Update routing in `/src/pages/[lang]/guides/index.astro`
- [ ] Test: Visual check + build

### Phase 3: QA (10-15 hours)
- [ ] Run full testing checklist
- [ ] Native speaker review
- [ ] Fix issues
- [ ] Final build test

---

## ⚠️ Critical Rules

### File Names
```
✅ KEEP IDENTICAL: en/what-is-nostr.mdx → pl/what-is-nostr.mdx
❌ NEVER CHANGE: en/what-is-nostr.mdx → pl/co-to-jest-nostr.mdx
```

### Frontmatter
```yaml
✅ TRANSLATE:
title: "Translated"
description: "Translated"
estimatedTime: "5 minut"

❌ DO NOT CHANGE:
priority: 2
category: "getting-started"
prerequisites: []
```

### Imports
```jsx
✅ KEEP EXACT: import { KeyGenerator } from "@components/KeyGenerator";
❌ NEVER CHANGE: import { GeneratorKluczy } from "@components/GeneratorKluczy";
```

### Components
```jsx
✅ ALWAYS INCLUDE: <KeyGenerator client:load />
❌ BREAKS TRANSLATION: <KeyGenerator />
```

### URLs
```markdown
✅ ADD LOCALE: [Learn more →](/pl/guides/quickstart)
❌ MISSING LOCALE: [Learn more →](/guides/quickstart)
```

### Technical Terms (Keep in English)
- `npub`, `nsec`
- `NIP-05`, `NIP-17`
- `Nostr`, `Zap`, `Relay`, `Client`

---

## 📖 Documentation Guide

| Task | Documentation |
|------|---------------|
| **Overview** | `TRANSLATION_README.md` |
| **UI (JSON)** | `TRANSLATION_REFERENCE.md` |
| **Guides (MDX)** | `GUIDE_TRANSLATION_PROCESS.md` |
| **Issues** | `TRANSLATION_MAINTENANCE.md` |
| **This card** | `TRANSLATION_QUICK_REFERENCE.md` |

---

## 🎯 16 Guides to Translate

### Getting Started (5)
1. `index.mdx`
2. `what-is-nostr.mdx`
3. `keys-and-security.mdx`
4. `quickstart.mdx`
5. `finding-community.mdx`

### Intermediate (5)
6. `relays-demystified.mdx`
7. `nip05-identity.mdx`
8. `zaps-and-lightning.mdx`
9. `nostr-tools.mdx`
10. `troubleshooting.mdx`

### Advanced (5)
11. `relay-guide.mdx`
12. `nip17-private-messages.mdx`
13. `privacy-security.mdx`
14. `protocol-comparison.mdx`
15. `multi-client.mdx`

### Reference (1)
16. `faq.mdx` (largest - 933 lines)

---

## 🔍 Common Patterns

### Heading
```markdown
# EN: ### The Problem (1 minute read)
# PL: ### Problem (1 minuta czytania)
# ES: ### El Problema (lectura de 1 minuto)
```

### List
```markdown
# EN: - **Bans happen.** A mistake can lock you out
# PL: - **Bany się zdarzają.** Pomyłka może Cię zablokować
# ES: - **Los baneos suceden.** Un error puede bloquearte
```

### Code + Description
```markdown
# EN: Your key looks like: `npub1qqq...`
# PL: Twój klucz wygląda tak: `npub1qqq...`
# ES: Tu clave se ve así: `npub1qqq...`
```

### Component Props
```jsx
// ✅ Translate content, keep structure
<HoverCard
  term="Public Key"
  definition="A long string..."
>
  Translated text
</HoverCard>
```

---

## ⚡ Quick Commands

```bash
# List English guides
ls src/content/guides/en/

# Create new language directory
mkdir -p src/content/guides/de/

# Test build
npm run build

# Count translation progress
wc -l src/content/guides/de/*.mdx
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Components in English | Add `client:load` directive |
| 404 on links | Add locale prefix: `/de/guides/...` |
| Build fails | Check imports are exact |
| Guide not showing | Check frontmatter syntax |

---

## ✅ Pre-Submit Checklist

- [ ] All 16 guides translated
- [ ] All imports unchanged
- [ ] All `client:load` present
- [ ] All internal links have locale prefix
- [ ] Technical terms kept in English
- [ ] Build passes: `npm run build`
- [ ] Visual check in browser
- [ ] Interactive components work
- [ ] Native speaker reviewed

---

## 📊 Progress Tracking

```
Language: ____
Started: ____
Completed: ____

UI Translation:        [ ] Complete (___/690 keys)
Guide Translation:     [ ] Complete (___/16 files)
  - Getting Started:   [ ] (___/5)
  - Intermediate:      [ ] (___/5)
  - Advanced:          [ ] (___/5)
  - Reference:         [ ] (___/1)
Routing Updated:       [ ] Complete
Testing:               [ ] Complete
```

---

## 💡 Tips

1. **Start with UI translations** - Components need them
2. **Translate guides in order** - Follow learning path
3. **Copy-paste imports** - Don't type them manually
4. **Test frequently** - `npm run build` after each guide
5. **Use existing translations** - Compare en/pl/es for patterns
6. **Keep notes** - Document your translation choices

---

## 🆘 Need Help?

1. Check full docs (linked above)
2. Look at existing translations (en/, pl/, es/)
3. Search for similar issues in GitHub
4. Ask in project discussions

---

**Print this page for quick reference while translating!**

---

Last Updated: 2025-02-23
