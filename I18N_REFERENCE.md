# I18N Reference - Translation System Details

> **Load this skill when:** Looking up specific translation keys, debugging issues, or need complete reference.

**See also:** `I18N_PATTERNS.md` for core patterns and workflows.

---

## Quick Navigation

- [Core Files](#core-files)
- [UI Keys Reference](#ui-keys-reference)
- [Guide Keys Reference](#guide-keys-reference)
- [Troubleshooting](#troubleshooting)

---

## Core Files

### Translation Infrastructure

**`/src/i18n/index.ts`** - Core utilities
- `getCurrentLocale(path?)` - Get locale from URL
- `t(key, locale?)` - Get translation string
- `getValue(key, locale?)` - Get any value (objects, arrays)
- `getTranslations(locale)` - Get all translations for locale
- `hasTranslation(key, locale)` - Check if exists
- `getAvailableLocales()` - Returns ['en', 'pl', 'es', 'de']

**`/src/i18n/types.ts`** - TypeScript definitions
- `Locale = 'en' | 'pl' | 'es' | 'de'`
- `QuizQuestion`, `GuideTranslation`, `Translations` interfaces

**`/src/hooks/useTranslation.ts`** - React hook
- Returns `{ t, getValue, locale }`

### Translation Files

**`/src/i18n/locales/*.json`**
- `en.json` (107KB) - Source of truth
- `pl.json` (98KB) - Polish
- `es.json` (102KB) - Spanish
- `de.json` (118KB) - German

All files must have identical key structure.

---

## UI Keys Reference

### Buttons
- `ui.buttons.submit`
- `ui.buttons.next`
- `ui.buttons.previous`
- `ui.buttons.checkAnswer`
- `ui.buttons.startLearning`
- `ui.buttons.learnMore`

### Search
- `ui.search.placeholder`
- `ui.search.noResults`
- `ui.search.searching`

### Common
- `ui.common.loading`
- `ui.common.error`
- `ui.common.success`
- `ui.common.minutes`

### Navigation
- `ui.navigation.nextGuide`
- `ui.navigation.previousGuide`
- `ui.navigation.backToGuides`

### Badges
- `ui.badges.earned`
- `ui.badges.locked`
- `ui.badges.viewAll`

### Progress
- `ui.progress.completed`
- `ui.progress.of`
- `ui.progress.guidesCompleted`
- `ui.progress.currentStreak`

### Quiz
- `ui.quiz.loading`
- `ui.quiz.gradeTitle` (Template: {{title}}, {{rate}})
- `ui.quiz.scoreDisplay` (Template: {{score}}, {{total}})
- `ui.quiz.conceptsMastered`
- `ui.quiz.nextSteps`
- `ui.quiz.perfectScore`
- `ui.quiz.reviewSections`
- `ui.quiz.retakeQuiz`
- `ui.quiz.questionCounter` (Template: {{current}}, {{total}})
- `ui.quiz.backButton`
- `ui.quiz.nextButton`
- `ui.quiz.seeResults`
- `ui.quiz.answered`
- `ui.quiz.severity.critical`
- `ui.quiz.severity.warning`
- `ui.quiz.severity.info`
- `ui.quiz.feedback.correct`
- `ui.quiz.feedback.incorrect`

### Page Sections
- `guidesPage.hero.title`
- `guidesPage.hero.description`
- `guidesPage.hero.yourProgress`
- `guidesPage.hero.startFirstGuide`
- `guidesPage.cta.notSure`
- `guidesPage.cta.beginnerDescription`
- `guidesPage.cta.startLearning`
- `guidesPage.filter.filterByInterest`

### Skill Levels
- `skillLevels.beginner.label`
- `skillLevels.beginner.title`
- `skillLevels.beginner.subtitle`
- `skillLevels.beginner.description`
- `skillLevels.intermediate.label`
- `skillLevels.intermediate.title`
- `skillLevels.intermediate.subtitle`
- `skillLevels.intermediate.description`
- `skillLevels.advanced.label`
- `skillLevels.advanced.title`
- `skillLevels.advanced.subtitle`
- `skillLevels.advanced.description`

### Interest Filter
- `interestFilter.allGuides`
- `interestFilter.bitcoin`
- `interestFilter.privacy`
- `interestFilter.security`
- `interestFilter.relays`
- `interestFilter.tools`
- `interestFilter.community`

### Guide Card
- `guideCard.difficulty.beginner`
- `guideCard.difficulty.intermediate`
- `guideCard.difficulty.advanced`
- `guideCard.status.locked`
- `guideCard.status.completed`
- `guideCard.status.continueReading`
- `guideCard.status.startLearning`
- `guideCard.moreLocked`

### Guide Section
- `guideSection.startHere`
- `guideSection.complete`
- `guideSection.locked`
- `guideSection.unlockRequirement`

---

## Guide Keys Reference

### Guide Structure

```
guides.{guideId}.title
guides.{guideId}.description
guides.{guideId}.content.{key}
```

### Quiz Structure

```
guides.{guideId}.quiz.title
guides.{guideId}.quiz.questions[].id
guides.{guideId}.quiz.questions[].title
guides.{guideId}.quiz.questions[].prompt
guides.{guideId}.quiz.questions[].options[].id
guides.{guideId}.quiz.questions[].options[].label
guides.{guideId}.quiz.questions[].correctId
guides.{guideId}.quiz.questions[].explanation
guides.{guideId}.quiz.questions[].severity
```

### Severity Values
- `"critical"` - Safety/security issues
- `"warning"` - Best practices  
- `"info"` - Nice to know

---

## Troubleshooting

### Issue: "Translation key not found"

**Cause:** Key missing in one or more locale files

**Fix:**
```bash
# Find which file is missing the key
grep -r "your.key" src/i18n/locales/*.json

# Compare structures
diff <(jq 'paths' src/i18n/locales/en.json | sort) \
     <(jq 'paths' src/i18n/locales/pl.json | sort)
```

### Issue: Translation returns "[object Object]"

**Cause:** Using `t()` on object instead of `getValue()`

**Fix:**
```typescript
// Wrong
const questions = t('guides.x.quiz.questions');

// Right
const { getValue } = useTranslation();
const questions = getValue('guides.x.quiz.questions');
```

### Issue: Text not translating

**Cause:** Hardcoded string or missing key

**Fix:**
```bash
# Find hardcoded strings
grep -r '"Some text"' src/components --include="*.tsx"

# Replace with t('key')
```

---

*Last Updated: March 2026*
*Purpose: Complete translation key reference*
*Status: stable*
*Next Review: When adding new UI sections*
