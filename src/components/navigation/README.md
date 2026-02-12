# Prerequisite Warning System

This system provides UI components for handling prerequisite violations when users jump to guides without completing prerequisites.

## Core Principles

1. **NOT blocking access** - Users can still read the guide (knowledge should be free)
2. **Show a warning** - Clear indication they're skipping prerequisites
3. **Offer navigation** - Easy way to go back and complete prerequisites
4. **Track progress** - Know which prerequisites are incomplete

## Components

### 1. PrerequisiteWarning

A dismissible banner that appears at the top of guide pages when prerequisites are incomplete.

```tsx
import { PrerequisiteWarning } from '../components/navigation/PrerequisiteWarning';

<PrerequisiteWarning
  currentGuideId="nip05-identity"
  currentGuideTitle="Get Your Human-Readable Identity"
  prerequisites={[
    { slug: 'keys-and-security', title: 'Your Keys, Your Identity', estimatedTime: '8 min' },
    { slug: 'quickstart', title: 'Your First 5 Minutes on Nostr', estimatedTime: '5 min' },
  ]}
  dismissible={true}
/>
```

**Features:**
- Shows list of incomplete prerequisites
- Links to each incomplete guide
- Clear messaging: "You can continue, but we recommend completing these first"
- Dismissible (stored in localStorage)
- Calculates total time to complete
- "Continue anyway" and "Start with first" actions

### 2. PrerequisiteModal

Optional blocking modal for critical guides (like "Keys and Security").

```tsx
import { PrerequisiteModal } from '../components/navigation/PrerequisiteModal';

<PrerequisiteModal
  currentGuideId="advanced-security"
  currentGuideTitle="Advanced Security Practices"
  prerequisites={[...]}
  isCritical={true}
  criticalMessage="This guide covers foundational security concepts that are essential for your safety."
  onContinueAnyway={() => console.log('User continued without prerequisites')}
/>
```

**Features:**
- Full-screen modal overlay
- Visual distinction for critical guides (red vs amber)
- Estimated time calculation
- "Go to first prerequisite" primary action
- "Continue anyway" secondary action always available
- Click outside to close (unless critical)

### 3. EnhancedGuideCompletionIndicator

Enhanced version of the guide completion timeline showing prerequisite relationships.

```tsx
import { EnhancedGuideCompletionIndicator } from '../components/navigation/EnhancedGuideCompletionIndicator';

<EnhancedGuideCompletionIndicator
  guides={guideList}
  currentGuideSlug="nip05-identity"
  currentGuidePrerequisites={['keys-and-security', 'quickstart']}
  showPrerequisites={true}
/>
```

**Features:**
- Visual indicator (dot) on guides that are prerequisites
- "Prerequisites to complete" section in expanded view
- Amber highlighting for incomplete prerequisites
- Shows prerequisite status (incomplete/complete)
- Jump back links to incomplete prerequisites

## Integration Example

### Astro Guide Page

```astro
---
import { PrerequisiteWarning } from '../../components/navigation/PrerequisiteWarning';
import { PrerequisiteModal } from '../../components/navigation/PrerequisiteModal';
import { EnhancedGuideCompletionIndicator } from '../../components/navigation/EnhancedGuideCompletionIndicator';
import { getGuidePrerequisites } from '../../lib/guideLoader';

const { guide } = Astro.props;
const guideSlug = guide.slug.replace('en/', '');
const prerequisites = await getGuidePrerequisites(guideSlug);
const hasPrereqs = prerequisites.length > 0;
const isCritical = guide.data.isCritical || false;

// Build guide list for completion indicator
const guideList = GUIDE_ORDER.map(slug => ({
  slug,
  title: guidesMap.get(slug)?.data.title || slug
}));
---

<Layout title={title} description={description}>
  <Header />
  
  {/* Optional: Show modal for critical guides with prerequisites */}
  {hasPrereqs && isCritical && (
    <PrerequisiteModal
      client:load
      currentGuideId={guideSlug}
      currentGuideTitle={guide.data.title}
      prerequisites={prerequisites}
      isCritical={true}
    />
  )}
  
  <main id="main-content" class="py-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6">
      
      {/* Show warning banner for incomplete prerequisites */}
      {hasPrereqs && (
        <PrerequisiteWarning
          client:load
          currentGuideId={guideSlug}
          currentGuideTitle={guide.data.title}
          prerequisites={prerequisites}
          className="mb-8"
        />
      )}
      
      {/* Enhanced completion indicator with prerequisites */}
      <EnhancedGuideCompletionIndicator
        client:load
        guides={guideList}
        currentGuideSlug={guideSlug}
        currentGuidePrerequisites={prerequisites.map(p => p.slug)}
        className="mb-8"
      />
      
      {/* Guide content */}
      <article>
        <h1>{guide.data.title}</h1>
        <Content components={components} />
      </article>
    </div>
  </main>
</Layout>
```

## Design Principles

### Friendly, Not Punitive

- Use warm colors (amber) rather than harsh reds for warnings
- Message emphasizes "recommendation" rather than "requirement"
- "Continue anyway" is always available

### Educational, Not Blocking

- Explain WHY prerequisites are recommended
- Show estimated time (so it doesn't feel overwhelming)
- Progress is tracked automatically

### Easy to Dismiss

- One-click dismiss on banner
- Dismissal state persisted in localStorage
- Can always access guide content

### Clear Path to "Fill Gaps"

- Direct links to each incomplete prerequisite
- "Jump back" functionality in completion indicator
- Visual hierarchy showing what's missing

## Styling

All components use Tailwind CSS with:
- Dark mode support (`dark:` variants)
- Responsive design (mobile-first)
- Consistent color scheme (amber for warnings, primary for actions)
- Accessible contrast ratios
- Smooth transitions and animations

## Accessibility

- ARIA labels on all interactive elements
- `role="alert"` on warning banner
- `role="dialog"` and `aria-modal` on modal
- Keyboard navigation support
- Screen reader friendly content structure
