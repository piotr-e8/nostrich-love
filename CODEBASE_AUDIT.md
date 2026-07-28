# Comprehensive Codebase Audit - April 2026

**Date**: 2026-04-07  
**Scope**: Full codebase analysis for technical debt and refactoring opportunities  
**Status**: Audit complete, refactoring roadmap defined

---

## Quick Stats

- **Codebase**: 76,768 lines across 250 files in 87 directories
- **Translation keys**: 14,917 per locale (5 locales = 74,585 total)
- **Build output**: 119 pages (16 guides × 5 locales + index pages)
- **Quiz components**: 15 (with 90%+ code duplication)

---

## 🚨 Priority 1: Immediate Fixes (Do These First)

### 1. Dark Mode Color Bug
**Issue**: Multiple components use `dark:bg-gray-900/50` which creates muddy brown  
**AGENTS.md Rule**: "AVOID: dark:bg-gray-900/50, USE: dark:bg-gray-900"  
**Files Affected**:
- `src/components/interactive/PostFlowSimulator.tsx`
- `src/components/interactive/RelayWorldMap.tsx`
- `src/components/interactive/TwitterBridge.tsx`
- `src/components/navigation/PrerequisiteModal.tsx`
- `src/components/ui/KeyCard.tsx`

**Fix**: Replace all instances with solid `dark:bg-gray-900`

### 2. useTranslation Hook Polling
**Issue**: Hook polls every 100ms (10 times/second) instead of using event-driven updates  
**File**: `src/hooks/useTranslation.ts` (lines 8-31)  
**Impact**: Unnecessary CPU usage, potential memory leaks

**Fix**: Replace polling with:
```typescript
// Event-driven approach
const [translations, setTranslations] = useState(() => loadTranslations(locale));

useEffect(() => {
  const handleUpdate = () => setTranslations(loadTranslations(locale));
  window.addEventListener('translations-updated', handleUpdate);
  return () => window.removeEventListener('translations-updated', handleUpdate);
}, [locale]);
```

### 3. Missing Loading States
**Issue**: Components fetch data without loading indicators  
**Files Affected**:
- `RelayFeedBrowser.tsx` - no skeleton while fetching
- `ZapSimulator.tsx` - no error state on failed zaps
- `QuickstartSimulator.tsx` - jumps between steps abruptly

---

## 🔧 Priority 2: High-Impact Refactors

### 1. Consolidate 5 Competing Progress Systems
**Problem**: 5 systems tracking the same data:
1. `src/lib/progress.ts` - 451 lines, deprecated wrapper
2. `src/lib/progressService.ts` - 351 lines, duplicate of gamification.ts
3. `src/lib/useProgressTracking.ts` - 86 lines, hook wrapper
4. `src/utils/gamification.ts` - 1,414 lines, main system
5. `src/utils/gamificationEngine.ts` - 383 lines, another wrapper

**Solution**: 
- Keep only `gamification.ts` (most complete)
- Update all imports to use it directly
- Delete the other 4 files
- Update `phase-1-3-audit.md` when done (it references these files)

**Estimated Time**: 8 hours
**Risk**: Medium - requires thorough testing

### 2. Create Generic Quiz Component
**Problem**: 15 quiz components share 90%+ identical code (~7,500 duplicate lines)

**Pattern Identified**:
```typescript
// All 15 components have this structure:
1. State: currentQuestion, selectedAnswer, showExplanation, isCorrect
2. Effect: load/save progress to localStorage
3. Render: question card, options, feedback, navigation
4. Handlers: selectAnswer, nextQuestion, resetQuiz
```

**Solution**: Create `QuizContainer.tsx` that accepts:
```typescript
interface QuizProps {
  questions: Question[];
  storageKey: string;
  onComplete?: (score: number) => void;
  theme?: 'default' | 'outbox' | 'privacy';
}
```

**Estimated Time**: 6 hours  
**Impact**: Eliminates 7,500 lines, consistent UX, easier maintenance

**Quiz Components to Replace**:
- WhatIsNostrQuiz.tsx
- OutboxModelQuiz.tsx
- PrivacySecurityQuiz.tsx
- NIP17Quiz.tsx
- TroubleshootingQuiz.tsx
- RelayQuiz.tsx
- ProtocolComparisonQuiz.tsx
- MultiClientQuiz.tsx
- KeyManagementQuiz.tsx
- ZapQuiz.tsx
- ClientQuiz.tsx
- NostrToolsQuiz.tsx
- (and 3 more)

### 3. Standardize localStorage Access
**Problem**: 98 direct localStorage accesses without hooks or consistent key naming

**Issues Found**:
- Keys scattered: `completedGuides`, `guide-progress`, `gamification`, `nostr-progress`
- No SSR checks (will crash in Astro SSR)
- No validation of stored data
- No migration strategy when data shape changes

**Solution**: Create `useLocalStorage.ts` hook:
```typescript
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  validate?: (data: unknown) => data is T
): [T, (value: T) => void] {
  // SSR-safe, validated, typed
}
```

**Estimated Time**: 4 hours

---

## 📐 Priority 3: Component Architecture

### 1. Split Oversized Components
**Files violating single responsibility**:

| File | Lines | Problem | Solution |
|------|-------|---------|----------|
| `RelayPlayground.tsx` | 1,550 | 4 features in one | Split: RelayConnection, FeedViewer, PostComposer, EventInspector |
| `TroubleshootingWizard.tsx` | 923 | 8-step state machine | Extract: Step components, decision tree logic |
| `QuickstartSimulator.tsx` | 824 | 5 simulators in one | Split: KeyGenSimulator, PostSimulator, FollowSimulator, ZapSimulator, RelaySimulator |
| `PostFlowSimulator.tsx` | 612 | Too many animations | Extract: Animation components |

### 2. Fix Accessibility Violations
**Issues Found**:
- Quiz components lack ARIA live regions for screen readers
- `KeyGenerator.tsx` - no focus indicators on copy buttons
- `FAQAccordion.tsx` - missing reduced motion checks
- Color contrast issues in dark mode (several components)

**Required Fixes**:
```typescript
// Add to all interactive components:
- aria-live="polite" for dynamic content
- aria-expanded for accordions
- role="button" with keyboard handlers
- prefers-reduced-motion media query
```

---

## 🎨 Priority 4: Design System & Polish

### 1. Replace Magic Numbers with Tokens
**Issue**: Hardcoded colors, spacing, and sizes throughout

**Example from audit**:
```typescript
// Found in 47 places:
className="bg-purple-500 hover:bg-purple-600"
// Should be:
className="bg-primary hover:bg-primary-hover"
```

**Solution**: Extend Tailwind config with design tokens:
```javascript
// tailwind.config.mjs
theme: {
  extend: {
    colors: {
      primary: { DEFAULT: '#8b5cf6', hover: '#7c3aed' },
      // ... other tokens
    }
  }
}
```

### 2. Add Error Monitoring
**Issue**: No error tracking in production

**Solution**: Add Sentry or similar:
```typescript
// src/utils/errorTracking.ts
export function trackError(error: Error, context?: Record<string, unknown>) {
  // Log to monitoring service
}
```

### 3. Code Splitting
**Issue**: All interactive components bundled together

**Solution**: Use dynamic imports for heavy components:
```typescript
// Instead of:
import RelayPlayground from './RelayPlayground';

// Use:
const RelayPlayground = lazy(() => import('./RelayPlayground'));
```

---

## 📋 Implementation Roadmap

### Week 1: Quick Wins
- [ ] Fix dark mode colors (Priority 1.1)
- [ ] Replace useTranslation polling (Priority 1.2)
- [ ] Add loading skeletons (Priority 1.3)

### Week 2: Progress Consolidation
- [ ] Audit all progress-related imports
- [ ] Migrate to gamification.ts only
- [ ] Delete deprecated files
- [ ] Test thoroughly

### Week 3: Quiz Refactor
- [ ] Create generic QuizContainer
- [ ] Migrate 3 quiz components as pilot
- [ ] Test and refine API
- [ ] Migrate remaining 12 quizzes

### Week 4: localStorage & Accessibility
- [ ] Create useLocalStorage hook
- [ ] Replace 98 direct accesses
- [ ] Add ARIA attributes
- [ ] Test with screen reader

### Month 2: Architecture
- [ ] Split oversized components
- [ ] Add design tokens
- [ ] Implement error tracking
- [ ] Add code splitting

---

## ⚠️ Critical Dependencies

**Before touching progress systems**:
1. Read `progress/phase-1-3-audit.md` - documents existing data bug
2. Understand the CRITICAL BUG section - data overwriting issue
3. Ensure merge-first strategy for all save operations

**Before touching quiz components**:
1. All quiz components use translations - verify i18n keys exist
2. Each quiz has unique storage keys - don't collide during refactor
3. Quiz state affects progress tracking - coordinate with gamification.ts

---

## 🧪 Testing Strategy

**For each refactor**:
1. Run `npm run build` - verify no TypeScript errors
2. Run `npm run verify-seo` - ensure SEO intact
3. Test all 5 locales - translations still work
4. Test guide completion flow end-to-end
5. Verify localStorage data survives refresh

**Critical paths to test**:
- Complete a guide → Progress updates → Badge unlocks
- Switch language → Content updates → Progress preserved
- Refresh page → localStorage loads → State restored

---

## 📚 Related Documentation

- `AGENTS.md` - Critical rules (i18n, dark mode, build verification)
- `progress/phase-1-3-audit.md` - Previous audit with data bug details
- `LESSONS_ZH_LOCALE.md` - How to add new locales
- `docs/qa/accessibility-audit.md` - Existing a11y findings

---

## Summary

**Total estimated work**: ~80 hours  
**Quick wins**: 4 hours (Priority 1)  
**High impact**: 18 hours (Priority 2)  
**Architecture**: 32 hours (Priority 3)  
**Polish**: 26 hours (Priority 4)

**Recommendation**: Start with Priority 1 (quick wins), then tackle Priority 2.1 (progress consolidation) as it blocks other work.

---

*Last Updated: 2026-04-07*  
*Next Review: After Priority 1 & 2 complete*
