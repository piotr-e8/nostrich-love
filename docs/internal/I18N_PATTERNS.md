# I18N Patterns - Translation System Documentation

> **Load this skill when:** Adding or modifying translations, creating new content, debugging missing translations, or working with localization.

## Quick Reference

```bash
# Find translation key usage examples
grep -r "ui\.quiz\." src/components --include="*.tsx" -A2
```

**For complete key reference:** See `I18N_REFERENCE.md`

## Translation System Architecture

### Core Components

**1. Server-Side (Astro Files)**
```typescript
import { getTranslations } from '../../../i18n';

const currentLocale = Astro.params.lang || 'en';
const translations = getTranslations(currentLocale);

// Access nested keys safely
const title = translations.guides.whatIsNostr?.title || 'Fallback';
const description = translations.ui?.buttons?.submit || 'Submit';
```

**2. Client-Side (React Components)**
```typescript
import { useTranslation } from "../../hooks/useTranslation";

const { t, getValue, locale } = useTranslation();

// Basic translation
const title = t('guides.whatIsNostr.title');

// With fallback
const label = t('ui.buttons.submit') || 'Submit';

// Dynamic content with templates
t('ui.quiz.scoreDisplay').replace('{{score}}', score.toString())
                          .replace('{{total}}', total.toString());

// Get object/array values
const questions = getValue('guides.whatIsNostr.quiz.questions');
```

**3. Translation Files Structure**
```
/src/i18n/locales/
├── en.json    (Source of truth - 107KB)
├── pl.json    (Polish - 98KB)
├── es.json    (Spanish - 102KB)
└── de.json    (German - 118KB)
```

## Key Structure

### Guide Translations

```json
{
  "guides": {
    "whatIsNostr": {
      "title": "Nostr Explained Simply",
      "description": "Understand Nostr in 5 minutes...",
      "content": {
        "keyName": "String value for content"
      },
      "quiz": {
        "title": "Quiz Title",
        "questions": [
          {
            "id": "unique-question-id",
            "title": "Question Title",
            "prompt": "Question text here?",
            "options": [
              {"id": "a", "label": "Option A"},
              {"id": "b", "label": "Option B"}
            ],
            "correctId": "a",
            "explanation": "Why this is correct",
            "severity": "critical" // "critical" | "warning" | "info"
          }
        ]
      }
    }
  }
}
```

### UI Translations

```json
{
  "ui": {
    "buttons": {
      "submit": "Submit",
      "next": "Next",
      "previous": "Previous",
      "checkAnswer": "Check Answer",
      "startLearning": "Start Learning",
      "learnMore": "Learn More"
    },
    "search": {
      "placeholder": "Search guides...",
      "noResults": "No results found",
      "searching": "Searching..."
    },
    "common": {
      "loading": "Loading...",
      "error": "Error occurred",
      "success": "Success!",
      "minutes": "min read"
    },
    "navigation": {
      "nextGuide": "Next Guide",
      "previousGuide": "Previous Guide",
      "backToGuides": "Back to Guides"
    },
    "progress": {
      "completed": "Completed",
      "of": "of",
      "guidesCompleted": "guides completed",
      "currentStreak": "Current streak"
    },
    "quiz": {
      "loading": "Loading quiz...",
      "gradeTitle": "Your grade for {{title}}",
      "scoreDisplay": "{{score}}/{{total}}",
      "questionCounter": "Question {{current}} of {{total}}",
      "severity": {
        "critical": "Critical",
        "warning": "Warning",
        "info": "Info"
      }
    }
  }
}
```

## Usage Patterns

### Pattern 1: Basic Text Replacement

**JSON:**
```json
{
  "ui": {
    "buttons": {
      "submit": "Submit Answer"
    }
  }
}
```

**React:**
```tsx
<button>{t('ui.buttons.submit')}</button>
```

### Pattern 2: Dynamic Content with Variables

**JSON:**
```json
{
  "ui": {
    "quiz": {
      "scoreDisplay": "{{score}} out of {{total}}",
      "questionCounter": "Question {{current}} of {{total}}"
    }
  }
}
```

**React:**
```tsx
const scoreText = t('ui.quiz.scoreDisplay')
  .replace('{{score}}', score.toString())
  .replace('{{total}}', total.toString());

const counter = t('ui.quiz.questionCounter')
  .replace('{{current}}', (currentIndex + 1).toString())
  .replace('{{total}}', total.toString());
```

### Pattern 3: Accessing Arrays

**JSON:**
```json
{
  "guides": {
    "whatIsNostr": {
      "quiz": {
        "questions": [
          {"id": "q1", "title": "Question 1"},
          {"id": "q2", "title": "Question 2"}
        ]
      }
    }
  }
}
```

**React:**
```tsx
const { getValue } = useTranslation();
const questions = getValue('guides.whatIsNostr.quiz.questions') || [];

questions.map(q => <div key={q.id}>{q.title}</div>);
```

### Pattern 4: Conditional Severity Labels

**JSON:**
```json
{
  "ui": {
    "quiz": {
      "severity": {
        "critical": "Critical Concept",
        "warning": "Important",
        "info": "Good to Know"
      }
    }
  }
}
```

**React:**
```tsx
{question.severity === "critical" && t("ui.quiz.severity.critical")}
{question.severity === "warning" && t("ui.quiz.severity.warning")}
{question.severity === "info" && t("ui.quiz.severity.info")}
```

### Pattern 5: Server-Side Guide Access

**Astro (.astro file):**
```astro
---
import { getTranslations } from '../../../i18n';
import type { Locale } from '../../../i18n/types';

const { lang } = Astro.params;
const currentLocale = (lang as Locale) || 'en';
const translations = getTranslations(currentLocale);

const guideData = translations.guides[guideId];
const title = guideData?.title || 'Untitled';
const questions = guideData?.quiz?.questions || [];
---

<h1>{title}</h1>
```

## Critical Patterns to Follow

### 1. Always Update All 4 Locales

**When adding a new guide:**
1. Add to `/src/i18n/locales/en.json`
2. Copy SAME structure to `pl.json`, `es.json`, `de.json`
3. Translate content (keys stay the same, values translated)

**Example:**
```json
// en.json
{
  "guides": {
    "myNewGuide": {
      "title": "My New Guide",
      "description": "A description"
    }
  }
}

// pl.json (same keys, translated values)
{
  "guides": {
    "myNewGuide": {
      "title": "Mój Nowy Przewodnik",
      "description": "Opis tutaj"
    }
  }
}
```

### 2. Fallback Behavior

The system automatically falls back to English:

```typescript
// If 'pl.json' is missing 'guides.newGuide.title':
t('guides.newGuide.title', 'pl'); // Returns English value
// Console: "Translation key not found: guides.newGuide.title"
```

**Watch console for warnings** - indicates missing translations.

### 3. Guide Links Must Include Locale

**❌ WRONG:**
```tsx
<a href="/guides/what-is-nostr">Link</a>
```

**✅ CORRECT:**
```tsx
// In React (dynamic locale)
const { locale } = useTranslation();
<a href={`/${locale}/guides/what-is-nostr`}>Link</a>

// In Astro (hardcoded)
<a href="/en/guides/what-is-nostr">Link</a>
```

### 4. Never Hardcode Display Text

**❌ WRONG:**
```tsx
<button>Submit</button>
<h1>Quiz Results</h1>
```

**✅ CORRECT:**
```tsx
<button>{t('ui.buttons.submit')}</button>
<h1>{t('ui.quiz.results')}</h1>
```

**Exception:** Technical terms like "npub", "nsec", "Nostr" can remain as-is.

## Workflow: Adding a New Guide

### Step 1: Create English Translation

Edit `/src/i18n/locales/en.json`:

```json
{
  "guides": {
    "newGuideId": {
      "title": "New Guide Title",
      "description": "Brief description for cards",
      "content": {},
      "quiz": {
        "title": "New Guide Quiz",
        "questions": [
          {
            "id": "unique-id-1",
            "title": "Question Category",
            "prompt": "What is the answer?",
            "options": [
              {"id": "a", "label": "Option A"},
              {"id": "b", "label": "Option B"}
            ],
            "correctId": "a",
            "explanation": "This is why A is correct",
            "severity": "critical"
          }
        ]
      }
    }
  }
}
```

**Naming conventions:**
- Guide ID: `camelCase` (e.g., `whatIsNostr`, `keysAndSecurity`)
- Question ID: `kebab-case` (e.g., `sharing-keys`, `relay-function`)
- Severity levels: `"critical"` | `"warning"` | `"info"`

### Step 2: Copy to All Locales

Copy the **entire guide structure** to `pl.json`, `es.json`, `de.json`:

```bash
# Copy structure (values in English temporarily)
jq '.guides.newGuideId' src/i18n/locales/en.json > /tmp/new_guide.txt

# Then paste into pl.json, es.json, de.json under .guides
```

### Step 3: Translate Content

Update each locale file with proper translations:

- **pl.json** - Polish translation
- **es.json** - Spanish translation  
- **de.json** - German translation

Keep the same structure - only change string values.

### Step 4: Create Guide MDX Files

Create in all 4 directories:

```
/src/content/guides/
├── en/new-guide-id.mdx
├── pl/new-guide-id.mdx
├── es/new-guide-id.mdx
└── de/new-guide-id.mdx
```

### Step 5: Update Links

Any links to this guide must use locale prefix:

```tsx
// In React components
const { locale } = useTranslation();
<a href={`/${locale}/guides/new-guide-id`}>Link</a>

// In MDX files
<a href="/en/guides/new-guide-id">Link</a>
```

### Step 6: Verify Build

```bash
npm run build
```

Watch for:
- "Translation key not found" warnings
- TypeScript errors
- Link validation errors

## Validation Checklist

### Pre-Merge Checklist

Before submitting translation work:

- [ ] **All 4 locales updated:** en.json, pl.json, es.json, de.json
- [ ] **Key structure identical:** Same keys in all files (check with `jq`)
- [ ] **No hardcoded strings:** All UI text uses `t()` function
- [ ] **Locale prefixes:** All guide links use `/${locale}/guides/...`
- [ ] **client:load present:** Interactive components have `client:load` directive
- [ ] **Frontmatter correct:** Only `title`, `description`, `estimatedTime` translated
- [ ] **TypeScript types:** Updated `/src/i18n/types.ts` if adding new categories
- [ ] **Technical terms:** npub, nsec, NIP-XX, Relay, Zap remain in English
- [ ] **No infinite loops:** useEffect depends on `locale`, not `t` function
- [ ] **Dark mode styles:** All `dark:` prefixes complete with `bg-`/`text-`
- [ ] **Build passes:** `npm run build` with no errors or warnings
- [ ] **Console clean:** No "Translation key not found" warnings
- [ ] **Visual check:** Tested in browser for each locale
- [ ] **Components work:** Interactive components render in target language

### Quick Verification Commands

```bash
# Check translation completeness across all locales
jq -S 'paths' src/i18n/locales/en.json | sort > /tmp/en_paths.txt && \
jq -S 'paths' src/i18n/locales/pl.json | sort > /tmp/pl_paths.txt && \
diff /tmp/en_paths.txt /tmp/pl_paths.txt

# Find hardcoded strings in components (should return nothing)
grep -r "Submit\|Next\|Previous" src/components --include="*.tsx" | grep -v "t('"

# Find missing client:load directives
grep -r "<KeyGenerator\|<WhatIsNostrQuiz\|<ProtocolComparison" src/content/guides --include="*.mdx" | grep -v "client:load"

# Build verification
npm run build 2>&1 | grep -i "warning\|error\|Translation key not found"
```

## Common Mistakes & Fixes

### Mistake 1: Missing Translation in One Locale

**Symptom:** Console warning "Translation key not found: guides.x.y"

**Fix:**
```bash
# Find missing key
grep -r "your.key.here" src/i18n/locales/*.json

# Add to all 4 files with same structure
```

### Mistake 2: Hardcoded Strings

**Symptom:** Text appears in English on non-English pages

**Fix:**
```tsx
// Change this:
<button>Submit</button>

// To this:
<button>{t('ui.buttons.submit')}</button>
```

### Mistake 3: Missing Locale in Links

**Symptom:** Links work in English but 404 in other languages

**Fix:**
```tsx
// Change this:
<a href="/guides/what-is-nostr">

// To this:
<a href={`/${locale}/guides/what-is-nostr`}>
```

### Mistake 4: Wrong Key Access Pattern

**❌ WRONG (t() for objects):**
```tsx
const questions = t('guides.whatIsNostr.quiz.questions'); // Returns "[object Object]"
```

**✅ CORRECT (getValue for objects):**
```tsx
const { getValue } = useTranslation();
const questions = getValue('guides.whatIsNostr.quiz.questions'); // Returns array
```

### Mistake 5: Maximum Update Depth Exceeded (React Error)

**Symptom:** React error "Maximum update depth exceeded" in components using translations

**Cause:** Using the `t` function from `useTranslation` as a `useEffect` dependency creates an infinite loop because `t` is recreated on every render.

**❌ WRONG:**
```tsx
useEffect(() => {
  setSecurityChecks(getSecurityChecks(t));
}, [t]); // ❌ This causes infinite loop
```

**✅ CORRECT:**
```tsx
const { t, locale } = useTranslation();

useEffect(() => {
  setSecurityChecks(getSecurityChecks(t));
}, [locale]); // ✅ Only depend on locale, not t
```

**Affected Files:** `/src/components/interactive/KeyGenerator.tsx`

### Mistake 6: Missing TypeScript Types for New Keys

**Symptom:** TypeScript errors: "Property 'guidesPage' does not exist on type 'Translations'"

**Cause:** Added new translation keys to JSON files but didn't update TypeScript interface in `/src/i18n/types.ts`

**Fix:**
```typescript
// In /src/i18n/types.ts
export interface Translations {
  // ... existing keys
  guidesPage?: {
    hero: { title: string; description: string; };
    // ...
  };
  // Add other new categories here - make them optional
}
```

**Best Practice:** Make all new translation properties optional (`?`) to maintain backward compatibility.

### Mistake 7: Hardcoded Strings in Data Files

**Symptom:** Components show English text even when translations exist

**Cause:** Data arrays defined outside components don't use translation function

**❌ WRONG:**
```typescript
// In data file (e.g., /src/data/learning-paths.ts)
export const learningPaths = [
  { 
    title: "Getting Started", // Hardcoded English
    description: "Learn the basics" 
  }
];
```

**✅ CORRECT:**
```typescript
// Use translation keys, resolve in component
export const learningPaths = [
  { 
    titleKey: "learningPaths.gettingStarted.title",
    descriptionKey: "learningPaths.gettingStarted.description"
  }
];

// In component:
const title = t(learningPath.titleKey);
```

### Mistake 8: Dark Mode Style Errors

**Symptom:** Elements appear white in dark mode or text is invisible

**Cause:** Tailwind CSS classes missing `dark:` prefix or missing `bg-`/`text-` prefix

**❌ WRONG:**
```tsx
<div className="bg-yellow-50 dark:yellow-900/20"> // Missing 'bg-' prefix
<span className="text-white"> // No dark: variant
```

**✅ CORRECT:**
```tsx
<div className="bg-yellow-50 dark:bg-yellow-900/20">
<span className="text-gray-900 dark:text-white">
```

**Common mistakes:**
- `dark:yellow-900/20` without `bg-` prefix
- `dark:red-900/30` without `bg-` prefix in badges
- `text-white` without `dark:text-white` pair

## Integration with Other Rule Files

- **AGENTS.md** - Critical rules including i18n requirements (loaded automatically)
- **RULES.md** - Detailed workflows and patterns
- **NOSTR_KNOWLEDGE.md** - Technical content that needs translation
- **TEACHING_METHODS.md** - Educational content structure

**For complete key reference:** See `I18N_REFERENCE.md`

---

*Last Updated: March 2026*
*Purpose: Core i18n patterns for nostrich.love*
*Status: stable*
*Next Review: When adding new locales*

## Changelog

**March 2026 - Translation Docs Consolidation:**
- Added 4 new technical issues (Mistakes #5-8):
  - Maximum update depth exceeded
  - Missing TypeScript types
  - Hardcoded strings in data files
  - Dark mode style errors
- Enhanced Validation Checklist with pre-merge items
- Added quick verification commands
- Consolidated content from GUIDE_TRANSLATION_PROCESS.md and TRANSLATION_MAINTENANCE.md

