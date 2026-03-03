# Content Translation

> **Load this skill when:** Translating guide content (MDX files) to Polish, Spanish, or German. Works with I18N_PATTERNS.md for JSON translations.

---

## 1. Quick Reference

**Translation Scope:**
- **Guide content** (MDX files) - This skill
- **UI elements** (buttons, labels) - See I18N_PATTERNS.md

**Key Principle:** Keep same filenames across all locales. Only translate content inside files.

**Essential Commands:**
```bash
# List all English guides to translate
ls src/content/guides/en/

# Check translation completeness
for locale in pl es de; do echo "=== $locale ==="; ls src/content/guides/$locale/ | wc -l; done

# Compare file sizes (should be similar)
wc -l src/content/guides/en/*.mdx
cd src/content/guides/pl && wc -l *.mdx
```

---

## 2. Architecture Overview

### Two Translation Systems

**1. JSON Translations (I18N_PATTERNS.md)**
- UI elements: buttons, labels, messages
- Quiz questions and answers
- Guide titles and descriptions (for cards)
- Location: `/src/i18n/locales/{locale}.json`

**2. MDX Translations (This Skill)**
- Full guide content
- Interactive component text
- Analogy explanations
- Code examples (keep in English)
- Location: `/src/content/guides/{locale}/`

### Directory Structure

```
src/content/guides/
├── en/               # English (source of truth)
│   ├── what-is-nostr.mdx
│   ├── keys-and-security.mdx
│   └── ... (16 guides)
├── pl/               # Polish translations
│   ├── what-is-nostr.mdx
│   ├── keys-and-security.mdx
│   └── ... (16 guides)
├── es/               # Spanish translations
│   └── ... (16 guides)
└── de/               # German translations
    └── ... (16 guides)
```

### Translation Workflow

```
English MDX ──► Translation ──► Polish/Spanish/German MDX
     │                             │
     │                             ▼
     └──────► JSON translations ◄──┘
     (titles, descriptions)
```

---

## 3. Translation Patterns

### Pattern 1: Frontmatter Translation

**English (source):**
```yaml
---
title: "Understanding the Outbox Model"
description: "Learn how Nostr ensures your posts reach everyone"
estimatedTime: "15 min"
priority: 2
category: "beginner"
prerequisites: ["relays-demystified"]
---
```

**Polish:**
```yaml
---
title: "Rozumienie Modelu Skrzynki Nadawczej"
description: "Dowiedz się, jak Nostr zapewnia, że Twoje posty docierają do wszystkich"
estimatedTime: "15 min"  # Keep time format
priority: 2             # DO NOT translate
category: "beginner"    # DO NOT translate
prerequisites: ["relays-demystified"]  # DO NOT translate slugs
---
```

**Rules:**
- ✅ Translate: `title`, `description`, `estimatedTime` (time unit only)
- ❌ Keep as-is: `priority`, `category`, `prerequisites` (slugs must match)

### Pattern 2: Content Translation

**English:**
```markdown
## The Problem: Missing Posts 📬

Have you ever posted something on Nostr, but your friends couldn't see it?

### The Old Way

```
You Post → Relay A → ❌ Your friend only uses Relay B
```
```

**Polish:**
```markdown
## Problem: Brakujące Posty 📬

Czy kiedykolwiek publikowałeś coś na Nostrze, ale Twoi znajomi tego nie widzieli?

### Stary Sposób

```
Ty publikujesz → Relay A → ❌ Twój znajomy używa tylko Relay B
```
```

**Key Points:**
- Translate all prose content
- Keep code blocks in English (they're technical)
- Keep Nostr terminology (npub, nsec, relay) in original
- Translate analogies ("post office" → "poczta")

### Pattern 3: Interactive Component Text

**English:**
```markdown
<OutboxModelQuiz client:load />

Take Action:

1. Check your current relays
2. Optimize to 2-4 relays
3. Update your preferences
```

**Polish:**
```markdown
<OutboxModelQuiz client:load />

Działaj:

1. Sprawdź swoje obecne relay
2. Zoptymalizuj do 2-4 relay
3. Zaktualizuj swoje preferencje
```

**Rules:**
- Component tags stay the same (OutboxModelQuiz)
- Translate call-to-actions
- Keep commands/technical terms in English

### Pattern 4: Technical Terms

**Nostr terminology - Keep in English:**
- npub, nsec (key formats)
- relay (technical term)
- kind:10002 (event kind)
- NIP-65 (protocol number)
- zap, lightning (Bitcoin terms)

**Translate analogies:**
- "post office" → "poczta" (PL), "correo" (ES), "Post" (DE)
- "mailbox" → "skrzynka pocztowa", "buzón", "Briefkasten"
- "outbox" → "skrzynka nadawcza", "bandeja de salida", "Postausgang"

---

## 4. Language-Specific Guidelines

### Polish (pl)

**Characteristics:**
- More formal than English (use "Pan/Pani" sparingly, prefer neutral)
- Diacritics matter (ł, ń, ś, ć, ż)
- Longer sentences (expansion factor: +15-20%)

**Common Challenges:**
- Technical terms: Keep English or use established translations
  - "key" → "klucz" (not "klawisz")
  - "relay" → "relay" (don't translate, it's a proper noun here)
- Verb forms: Polish has more conjugations
  - "You can" → "Możesz" (singular) / "Możecie" (plural)
  - Use singular "you" ("ty") for friendlier tone

**Nostr Glossary:**
| English | Polish | Notes |
|---------|--------|-------|
| public key | klucz publiczny | General term |
| private key | klucz prywatny | General term |
| relay | relay | Keep English - understood in Polish tech |
| outbox model | model skrzynki nadawczej | Technical translation |
| censorship resistance | odporność na cenzurę | Natural phrase |

### Spanish (es)

**Characteristics:**
- Tu vs Usted (prefer "tú" for friendly/beginner content)
- Vosotros vs Ustedes (use "ustedes" for universal appeal)
- Gender agreement (el/la, los/las)

**Common Challenges:**
- Technical terms vary by region
  - "computer" → "computadora" (LatAm) / "ordenador" (Spain)
  - Use neutral LatAm Spanish when possible
- Longer than English (+10-15%)

**Nostr Glossary:**
| English | Spanish | Notes |
|---------|---------|-------|
| public key | clave pública | Standard |
| private key | clave privada | Standard |
| relay | relay | Keep English |
| censorship resistant | resistente a la censura | Common phrase |

### German (de)

**Characteristics:**
- Formal "Sie" vs informal "du" (use "du" for beginner-friendly)
- Compound words (don't be afraid of long words!)
- Capitalize all nouns

**Common Challenges:**
- Compound word creation
  - "relay list" → "Relay-Liste" (not "Relaisliste")
  - "public key" → "öffentlicher Schlüssel"
- Much longer than English (+20-30%)
- Sentence structure (verb often at end)

**Nostr Glossary:**
| English | German | Notes |
|---------|--------|-------|
| public key | öffentlicher Schlüssel | Standard |
| private key | privater Schlüssel | Standard |
| relay | Relay | Keep English |
| decentralized | dezentralisiert | Or "dezentral" |

---

## 5. Translation Workflow

### Step 1: Preparation

**Before translating:**
1. Read the English guide completely
2. Note technical terms that should stay in English
3. Identify analogies that need cultural adaptation
4. Check if guide references other guides (keep slugs consistent)

**Check existing translations:**
```bash
# See how similar guides were translated
grep -r "relay" src/content/guides/pl/what-is-nostr.mdx | head -5
```

### Step 2: Initial Translation

**Method options:**

**Option A: LLM-assisted (recommended)**
```
Prompt: "Translate this Nostr guide from English to Polish.
Keep technical terms (npub, nsec, relay, NIP-65) in English.
Translate analogies (post office → poczta).
Use friendly, beginner-friendly tone (ty, not Pan/Pani).
Maintain Markdown formatting."
```

**Option B: Manual translation**
- Use translation memory (check similar phrases)
- Work section by section
- Reference existing guides for consistency

**Option C: Hybrid**
- LLM for first draft
- Manual review for technical accuracy
- Cross-reference existing guides

### Step 3: Technical Validation

**Must check:**
1. **Frontmatter integrity**
   - YAML syntax valid?
   - All required fields present?
   - Prerequisites slugs unchanged?

2. **Link consistency**
   - Internal links use correct format?
   - Component imports correct?

3. **Code blocks**
   - Untranslated (should be English)
   - Syntax highlighting preserved?

4. **Interactive components**
   - Component names unchanged (OutboxModelQuiz)
   - Props unchanged?

### Step 4: Quality Review

**Check against original:**
- [ ] All sections translated?
- [ ] Tone matches (friendly, beginner-friendly)?
- [ ] Technical terms consistent?
- [ ] Analogies culturally appropriate?
- [ ] No mixed languages (English phrases left in)?
- [ ] Grammar/spelling checked?

**Native speaker review (if available):**
- Does it sound natural?
- Are technical terms clear?
- Is the tone appropriate?

### Step 5: Update JSON Translations

**Add guide to locale files:**
```json
// src/i18n/locales/pl.json
"outboxModel": {
  "title": "Rozumienie Modelu Skrzynki Nadawczej",
  "description": "Dowiedz się, jak Nostr zapewnia...",
  "content": {},
  "quiz": {
    "title": "Quiz o Modelu Skrzynki Nadawczej",
    "questions": [...]
  }
}
```

**Important:** JSON translations are for UI elements and quiz. MDX contains guide content.

### Step 6: Build Verification

```bash
npm run build
```

**Watch for:**
- YAML parsing errors in frontmatter
- "Translation key not found" warnings
- Component import errors

---

## 6. Common Mistakes & Fixes

### Mistake 1: Translating Technical Terms

**❌ Wrong:**
```markdown
Your klucz prywatny (nsec) should never be shared.
```

**✅ Correct:**
```markdown
Your private key (nsec) should never be shared.
```

**Keep in English:**
- npub, nsec, note1 (key formats)
- kind:10002 (event types)
- NIP-65 (protocol specifications)
- relay (when referring to the concept)
- WebSocket, JSON (technical standards)

### Mistake 2: Breaking YAML Frontmatter

**❌ Wrong:**
```yaml
---
title: "Title with "quotes" inside"  # Breaks YAML
---
```

**✅ Correct:**
```yaml
---
title: 'Title with "quotes" inside'  # Use single quotes
---
```

**Or:**
```yaml
---
title: "Title with \"quotes\" inside"  # Escape with backslash
---
```

### Mistake 3: Changing Slugs in Prerequisites

**❌ Wrong:**
```yaml
prerequisites: ["co-to-jest-nostr"]  # Changed slug!
```

**✅ Correct:**
```yaml
prerequisites: ["what-is-nostr"]  # Keep English slug
```

**Slugs must match across all locales!** Navigation depends on this.

### Mistake 4: Translating Component Names

**❌ Wrong:**
```markdown
<ModelSkrzynkiNadawczej client:load />
```

**✅ Correct:**
```markdown
<OutboxModelQuiz client:load />
```

Component names are code, not content.

### Mistake 5: Ignoring Text Expansion

**Issue:** German/Polish is 20-30% longer than English

**Fix:**
- Check layout doesn't break
- Shorten if needed for UI constraints
- Use abbreviations where appropriate ("np." for "na przykład" in Polish)

### Mistake 6: Mixed Languages

**❌ Wrong:**
```markdown
You can use any relay. Możesz użyć dowolnego relay.
```

**✅ Correct:**
```markdown
Możesz użyć dowolnego relay.
```

---

## 7. Translation Quality Checklist

Before marking translation complete:

**Content:**
- [ ] All sections translated
- [ ] Frontmatter valid YAML
- [ ] Technical terms consistent
- [ ] Analogies culturally appropriate
- [ ] Code blocks unchanged
- [ ] Component names unchanged
- [ ] Links working

**JSON:**
- [ ] Title translated
- [ ] Description translated
- [ ] Quiz questions translated
- [ ] Same key structure as en.json

**Validation:**
- [ ] Build passes
- [ ] No console warnings
- [ ] Guide loads correctly
- [ ] Navigation works (prev/next)

---

## 8. Integration with Other Skills

**Related skills:**
- **[I18N_PATTERNS.md]** - JSON translations, quiz structure
- **[TEACHING_METHODS.md]** - Content structure, analogies
- **[NOSTR_KNOWLEDGE.md]** - Technical terminology

**Skill combinations:**
- **Full guide translation:** CONTENT_TRANSLATION + I18N_PATTERNS
- **Quiz translation:** I18N_PATTERNS (JSON only)
- **New guide creation:** TEACHING_METHODS + CONTENT_TRANSLATION + NOSTR_KNOWLEDGE

---

## Resources

**Translation Tools:**
- DeepL (high quality for European languages)
- Google Translate (fallback)
- LanguageTool (grammar checking)

**Reference Materials:**
- Existing guide translations (check patterns)
- NIPs repository (technical terms)
- Nostr community glossaries

**For Questions:**
- When in doubt, keep technical terms in English
- Check existing translations for consistency
- Ask native speakers for cultural nuances

---

*Last Updated: March 2026*
*Purpose: Guide for translating Nostr educational content*
*Status: evolving (will improve with each translation)*
*Next Review: After translating 3+ guides per language*
