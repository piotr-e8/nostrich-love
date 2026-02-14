# Skill-Level Learning System - Implementation Documentation

## Project Overview

Transforming the Nostr learning experience from persona-based paths (Beginner/Bitcoiner/Privacy) to progressive skill levels (Beginner → Intermediate → Advanced) with universal guide access and mystery/locked states.

**Status**: Ready for Implementation  
**Estimated Timeline**: 13 days  
**Last Updated**: February 2026

---

## Architecture Decisions

### 1. Skill Level Structure

**Three progressive levels:**
- **Beginner** (6 guides) - Unlocked by default
- **Intermediate** (6 guides) - Locked, unlock at 4/6 Beginner completion (70%)
- **Advanced** (4 guides) - Locked, unlock at 4/6 Intermediate completion (70%)

**Guide Distribution:**
```
Beginner:
  1. what-is-nostr
  2. keys-and-security
  3. quickstart
  4. finding-community
  5. faq
  6. [TBD - nostr-clients-overview?]

Intermediate:
  1. relays-demystified
  2. nip05-identity
  3. zaps-and-lightning
  4. nostr-tools
  5. troubleshooting
  6. [TBD]

Advanced:
  1. protocol-comparison
  2. relay-guide
  3. privacy-security
  4. nip17-private-messages
  5. multi-client
```

### 2. State Management

**Storage Key**: `nostrich-gamification-v1`

**Data Structure:**
```typescript
{
  currentLevel: 'beginner' | 'intermediate' | 'advanced',
  unlockedLevels: ['beginner'],  // Array of unlocked level IDs
  manualUnlock: boolean,         // User manually unlocked all levels
  completedByLevel: {
    beginner: string[],          // Array of completed guide slugs
    intermediate: string[],
    advanced: string[]
  },
  lastInterestFilter: string | null,  // Persisted filter preference
  // ... existing gamification data
}
```

### 3. Unlock Logic

**Automatic Unlock:**
- Check on every guide completion
- Formula: `completedCount >= threshold` (threshold = 4 for 6-guide levels)
- Auto-adds level to `unlockedLevels` array
- Triggers UI update via event dispatch

**Manual Unlock:**
- Available via "Unlock Now" button on locked level section
- Available in Settings page
- Sets `manualUnlock: true` (persisted)
- Immediately unlocks all levels

### 4. Visual Design - Locked/Mystery States

**Locked Level Section:**
- Gray background (bg-gray-100 dark:bg-gray-800)
- Lock icon 🔒 prominently displayed
- Guide cards: Grayed out, titles hidden (show "Locked Guide")
- Progress bar: Empty or minimal fill
- Unlock requirements text visible
- "Unlock Now" button

**Unlocked Level Section:**
- Full color scheme
- Guide cards: Full color, titles visible, completion checkmarks
- Progress bar: Filled based on completion
- No lock icon

### 5. Interest Filters

**Filter Categories:**
- All (default)
- Bitcoin
- Privacy
- Artists
- Developers
- Creators

**Behavior:**
- Reorders guides within visible levels
- Does NOT hide guides
- Persisted in localStorage (`lastInterestFilter`)
- Mobile: Dropdown instead of tabs

### 6. Home Page Structure

**Primary CTA:**
- "Start Learning" - Large purple button
- Links to `/guides` (Beginner level)

**Secondary Section:**
- "Or explore by interest"
- Grid of community links (curated subset):
  - Artists, Musicians, Photographers
  - Parents, Foodies
  - Bitcoiners, Privacy
- Each links to `/nostr-for-[community]`

### 7. Community Pages Integration

**Each community page becomes a hub:**
1. **Hero section** - Community-specific value props
2. **Learn section** - "Learn [Topic] on Nostr" → links to relevant guides
3. **Connect section** - "Find [Topic] Creators" → existing follow-pack feature
4. **CTA** - "Start Learning" → guides page

**New Pages to Create:**
- `/nostr-for-bitcoiners` (new category needed)
- `/nostr-for-privacy` (use existing `sovereign` category)

---

## Implementation Phases

### Phase 1: Data Layer (Days 1-2)
**Files:**
- `src/data/learning-paths.ts` - Replace with SKILL_LEVELS
- `src/data/guides.ts` - Centralize guide metadata

**Tasks:**
- [ ] Create SKILL_LEVELS constant with 6-6-4 guide distribution
- [ ] Update LearningPathId type to SkillLevel
- [ ] Add difficulty and tags to each guide
- [ ] Remove persona-specific logic
- [ ] Test data structure

### Phase 2: Progress Storage (Days 2-3)
**Files:**
- `src/lib/progress.ts` - Update storage format
- `src/utils/gamification.ts` - Update defaults

**Tasks:**
- [ ] Update GamificationData interface
- [ ] Implement unlock logic (auto at 70%)
- [ ] Add manualUnlock support
- [ ] Update all path-related functions
- [ ] Test unlock thresholds

### Phase 3: Guide Listing Page (Days 4-6)
**Files:**
- `src/pages/guides/index.astro` - Redesign page layout
- New components: GuideSection, GuideCard, UnlockButton, InterestFilter

**Tasks:**
- [ ] Remove path selector buttons
- [ ] Create 3 sections (Beginner/Intermediate/Advanced)
- [ ] Implement locked/mystery states
- [ ] Add progress bars per section
- [ ] Add unlock buttons
- [ ] Create interest filter (desktop tabs, mobile dropdown)
- [ ] Test filtering and unlocking

### Phase 4: Navigation (Day 7)
**Files:**
- `src/components/navigation/GuideNavigation.tsx`
- `src/components/navigation/ResumeBanner.tsx`
- `src/components/navigation/ContinueReadingCard.tsx`

**Tasks:**
- [ ] Handle level boundaries (end of Beginner → unlock prompt)
- [ ] Update ResumeBanner (remove path text)
- [ ] Update ContinueReadingCard
- [ ] Add level indicators
- [ ] Test navigation flow

### Phase 5: Home Page (Days 8-9)
**Files:**
- `src/pages/index.astro`

**Tasks:**
- [ ] Remove persona selector cards
- [ ] Add large "Start Learning" CTA
- [ ] Add "Browse by Interest" section
- [ ] Curate community links (subset)
- [ ] Test CTAs

### Phase 6: Progress Page (Day 10)
**Files:**
- `src/pages/progress.astro`

**Tasks:**
- [ ] Update to 3-level visualization
- [ ] Add per-level progress bars
- [ ] Show locked/unlocked states
- [ ] Test progress calculations

### Phase 7: Settings (Day 11)
**Files:**
- `src/pages/settings.astro` or create component

**Tasks:**
- [ ] Add "Unlock all levels" toggle
- [ ] Add confirmation dialog
- [ ] Persist manualUnlock setting
- [ ] Test manual unlock

### Phase 8: Community Pages (Phase 2 - Separate)
**Files:**
- `/nostr-for-bitcoiners` (new)
- `/nostr-for-privacy` (new)
- Update existing community pages

**Tasks:**
- [ ] Add "Learn" section to existing community pages
- [ ] Create Bitcoiners page
- [ ] Create Privacy page
- [ ] Update Header/Footer navigation
- [ ] Test integration

### Phase 9: Testing & Cleanup (Days 12-13)
**Tasks:**
- [ ] Full user flow testing
- [ ] Test all unlock scenarios
- [ ] Test interest filters
- [ ] Remove old persona code
- [ ] Update documentation
- [ ] Fix bugs

---

## Component Specifications

### GuideSection Component
```typescript
interface GuideSectionProps {
  level: 'beginner' | 'intermediate' | 'advanced';
  guides: Guide[];
  completedCount: number;
  isLocked: boolean;
  onUnlock: () => void;
}
```

### GuideCard Component (Locked State)
- Background: bg-gray-100 dark:bg-gray-800
- Icon: Lock (lucide-react)
- Title: Hidden (show "Locked Guide" or just icon)
- Description: Hidden
- Hover: Show unlock requirements
- Cursor: not-allowed

### GuideCard Component (Unlocked State)
- Background: White / dark:bg-gray-800
- Icon: BookOpen or guide-specific
- Title: Visible
- Description: Visible
- Progress: Checkmark if completed
- Cursor: pointer

### InterestFilter Component
**Desktop:**
- Horizontal tabs
- Active tab: bg-purple-600 text-white
- Inactive: bg-gray-200 text-gray-700

**Mobile:**
- Dropdown select
- Same styling as desktop tabs when open

### UnlockButton Component
- Text: "Unlock [Level] Now" or "Unlock All Levels"
- Style: Secondary button (outline)
- Position: Bottom of locked section
- Confirmation: Optional modal for "Unlock All"

---

## Testing Scenarios

### 1. New User Flow
1. Land on home page
2. Click "Start Learning"
3. See Beginner level (unlocked) + locked Intermediate/Advanced
4. Complete 4 Beginner guides
5. Intermediate auto-unlocks
6. Complete 4 Intermediate guides
7. Advanced auto-unlocks

### 2. Manual Unlock Flow
1. Go to Settings
2. Toggle "Unlock all levels"
3. Confirm
4. Return to guides page
5. All levels unlocked

### 3. Interest Filter Flow
1. Select "Bitcoin" filter
2. Guides reorder to show Bitcoin-tagged first
3. Refresh page
4. Filter persists
5. Clear filter
6. Back to default order

### 4. Resume Flow
1. Complete 2 Beginner guides
2. Close browser
3. Return tomorrow
4. See ResumeBanner: "Continue learning - 2/6 Beginner guides completed"
5. Click resume
6. Return to last viewed guide

---

## Migration Notes

**Old Data:** Will be ignored (user will manually wipe)

**New Data Structure:**
- Completely different from old persona-based system
- No migration function needed
- Clean slate for all users

---

## Open Questions / Future Considerations

1. **Guide 6 for Beginner/Intermediate**: Need to finalize which guides fill these slots
2. **Community page priorities**: Which 5-6 communities show on home page?
3. **Badge thresholds**: Confirm global counting across levels works for all badges
4. **Analytics**: Should we track unlock events, filter usage?

---

## Success Metrics

- Users can complete all guides regardless of initial path choice
- Beginner users aren't overwhelmed by advanced content
- Advanced users can unlock quickly if desired
- Interest filters help users find relevant content
- Community pages drive both learning and social connections

---

**Implementation Start Date**: [To be filled]  
**Target Completion**: [To be filled]  
**Assigned Developer**: AI Pair Programming
