# Guide Component Design Specifications

## Overview
Design specifications for Phase 3 UI transformation - implementing locked/mystery states, progress bars, and interest filters for the skill-level based guide system.

---

## 1. GuideSection Component

### Interface
```typescript
interface GuideSectionProps {
  level: 'beginner' | 'intermediate' | 'advanced';
  isLocked: boolean;
  completedCount: number;
  totalCount: number;
  unlockThreshold: number;
  onUnlock: () => void;
  guides: Guide[];
  onFilterChange?: (filter: string | null) => void;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  href: string;
  tags?: string[];
}
```

### Visual Design

#### Header Section
- **Height**: 72px
- **Layout**: Flexbox row with items-center
- **Left**: Icon (40x40px) + Title + Description
- **Right**: Progress info or Unlock button

#### Level Icons
- **Beginner**: `🌱` (Sprout) - Green theme
- **Intermediate**: `🚀` (Rocket) - Yellow/Orange theme  
- **Advanced**: `⚡` (Lightning) - Red/Purple theme

#### Background Colors
- **Unlocked**: `bg-white dark:bg-gray-800`
- **Locked**: `bg-gray-100 dark:bg-gray-800/50`

#### Spacing
- **Section padding**: `p-6 lg:p-8`
- **Gap between cards**: `gap-6`
- **Margin bottom**: `mb-12` between sections

#### States

**Unlocked State:**
- Full opacity
- Interactive cards
- Progress bar visible
- Normal cursor

**Locked State:**
- Reduced opacity (0.7)
- Lock overlay on header
- Cards render in locked variant
- `cursor-not-allowed` on section

### Layout Grid
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

---

## 2. GuideCard Component (Locked Variant)

### Interface
```typescript
interface GuideCardLockedProps {
  level: 'beginner' | 'intermediate' | 'advanced';
  unlockRequirement: string;
  index: number; // For stagger animation
}
```

### Visual Design

#### Dimensions
- **Height**: 200px (fixed for consistency)
- **Padding**: `p-6`
- **Border radius**: `rounded-2xl`

#### Colors (Light Mode)
- **Background**: `bg-gray-100`
- **Border**: `border-2 border-gray-200`
- **Hover border**: `border-gray-300`
- **Lock icon**: `text-gray-400`

#### Colors (Dark Mode)
- **Background**: `bg-gray-800`
- **Border**: `border-2 border-gray-700`
- **Hover border**: `border-gray-600`
- **Lock icon**: `text-gray-500`

#### Lock Icon
- **Size**: 48px
- **Position**: Centered
- **Lucide icon**: `Lock`
- **Animation**: Subtle pulse on hover

#### Text Overlay (Hover State)
When hovered:
- Show semi-transparent overlay
- Display: "Complete X more [Level] guides to unlock"
- Text: `text-sm text-gray-500`
- Background: `bg-gray-100/90`

#### Mystery State
- **Title**: Hidden (show placeholder or lock only)
- **Description**: Hidden
- **Icon**: Lock only, no guide-specific icon
- **Time estimate**: Hidden

### Interactions

**Hover:**
- Border color lightens slightly
- Lock icon scales to 1.1
- Show unlock requirements tooltip
- Cursor: `cursor-not-allowed`

**Focus:**
- Visible focus ring for accessibility
- `ring-2 ring-gray-300`

---

## 3. GuideCard Component (Unlocked Variant)

### Interface
```typescript
interface GuideCardUnlockedProps {
  guide: {
    id: string;
    title: string;
    description: string;
    estimatedTime: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    href: string;
    tags?: string[];
  };
  isCompleted: boolean;
  isInProgress?: boolean;
}
```

### Visual Design

#### Dimensions
- **Min height**: 240px
- **Padding**: `p-6`
- **Border radius**: `rounded-2xl`

#### Colors (Light Mode)
- **Background**: `bg-white`
- **Border**: `border border-gray-200`
- **Hover border**: `border-friendly-purple-400`
- **Shadow**: `shadow-sm hover:shadow-lg`

#### Colors (Dark Mode)
- **Background**: `bg-gray-800`
- **Border**: `border border-gray-700`
- **Hover border**: `border-friendly-purple-500`
- **Shadow**: `shadow-sm hover:shadow-lg`

#### Header (Top Row)
```
<Flex justify-between items-start>
  <DifficultyBadge />
  <StatusIndicators />
</Flex>
```

#### Difficulty Badge
- **Padding**: `px-3 py-1`
- **Border radius**: `rounded-full`
- **Font**: `text-xs font-medium`
- **Colors**:
  - Beginner: `bg-green-100 text-green-700`
  - Intermediate: `bg-yellow-100 text-yellow-700`  
  - Advanced: `bg-red-100 text-red-700`

#### Completion Checkmark
- **Position**: Top right, next to time estimate
- **Size**: 20px
- **Color**: `text-green-500`
- **Icon**: Lucide `CheckCircle2`
- **Animation**: Scale pop on completion

#### Content Area
- **Title**: `text-lg font-semibold text-gray-900 dark:text-white`
- **Description**: `text-sm text-gray-600 dark:text-gray-400`
- **Margin**: `mt-4 mb-4`

#### Footer (Bottom Row)
```
<Flex justify-between items-center mt-auto>
  <span>"Start Learning" / "Continue" / "Completed"</span>
  <ArrowRightIcon />
</Flex>
```

### Interactions

**Hover:**
- Border color changes to purple
- Card lifts: `-translate-y-1`
- Shadow increases
- Title color changes to purple
- Arrow icon translates right

**Active/Pressed:**
- Slight scale down: `scale-[0.98]`

**Completed State:**
- Left border: `border-l-4 border-green-500`
- Optional: Green tint on background

---

## 4. InterestFilter Component

### Interface
```typescript
interface InterestFilterProps {
  options: { value: string; label: string; icon?: string }[];
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

const defaultOptions = [
  { value: null, label: 'All Guides', icon: '✨' },
  { value: 'bitcoin', label: 'Bitcoin', icon: '₿' },
  { value: 'privacy', label: 'Privacy', icon: '🔒' },
  { value: 'artists', label: 'Artists', icon: '🎨' },
  { value: 'developers', label: 'Developers', icon: '💻' },
  { value: 'creators', label: 'Creators', icon: '🎬' },
];
```

### Visual Design

#### Desktop (Tabs)
- **Layout**: Horizontal flex row with `gap-2`
- **Container**: Centered, max-width container
- **Margin**: `mb-8`

**Active Tab:**
- Background: `bg-purple-600`
- Text: `text-white`
- Padding: `px-4 py-2`
- Border radius: `rounded-lg`
- Font: `text-sm font-medium`

**Inactive Tab:**
- Background: `bg-gray-200 dark:bg-gray-700`
- Text: `text-gray-700 dark:text-gray-300`
- Hover: `bg-gray-300 dark:bg-gray-600`

#### Mobile (Dropdown)
- **Trigger**: Full-width button
- **Background**: `bg-white dark:bg-gray-800`
- **Border**: `border border-gray-200 dark:border-gray-700`
- **Padding**: `px-4 py-3`
- **Icon**: Chevron down on right

**Dropdown Menu:**
- Background: `bg-white dark:bg-gray-800`
- Border: `border border-gray-200 dark:border-gray-700`
- Shadow: `shadow-lg`
- Border radius: `rounded-lg`
- Items: Same styling as tabs

### Interactions

**Tab Switch:**
- Background color transition: `transition-colors duration-200`
- Slight scale on active: `scale-[1.02]`

**Dropdown:**
- Chevron rotates 180° when open
- Items have hover background
- Selected item has checkmark on right

### Persistence
- Save to localStorage via `setLastInterestFilter()`
- Load on mount via `getLastInterestFilter()`

---

## 5. UnlockButton Component

### Interface
```typescript
interface UnlockButtonProps {
  level: 'beginner' | 'intermediate' | 'advanced';
  onUnlock: () => void;
  disabled?: boolean;
  loading?: boolean;
}
```

### Visual Design

#### Default State
- **Style**: Outline/Secondary button
- **Background**: `bg-transparent`
- **Border**: `border-2 border-friendly-purple-500`
- **Text**: `text-friendly-purple-600 font-medium`
- **Padding**: `px-4 py-2`
- **Border radius**: `rounded-lg`

#### Hover State
- Background: `bg-friendly-purple-50 dark:bg-friendly-purple-900/30`
- Border: `border-friendly-purple-600`

#### Disabled State
- Opacity: `opacity-50`
- Cursor: `cursor-not-allowed`

#### Loading State
- Show spinner icon (animate-spin)
- Text changes to "Unlocking..."

### Confirmation Modal

**Trigger:** Click on unlock button

**Modal Design:**
- **Title**: "Unlock [Level] Guides?"
- **Body**: 
  - "You've completed X of Y [Previous Level] guides."
  - "You can unlock [Level] guides now or keep them locked until you reach the recommended threshold (Z guides)."
  - "Note: Unlocking early won't affect your progress."
- **Buttons**:
  - Primary: "Unlock Now" (purple)
  - Secondary: "Keep Locked" (gray)

---

## 6. LevelProgressBar Component

### Interface
```typescript
interface LevelProgressBarProps {
  completed: number;
  total: number;
  threshold: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  showThreshold?: boolean;
}
```

### Visual Design

#### Container
- **Width**: Full width of parent
- **Margin**: `mt-2 mb-4`

#### Progress Bar Track
- **Height**: `h-3`
- **Background**: `bg-gray-200 dark:bg-gray-700`
- **Border radius**: `rounded-full`
- **Overflow**: `overflow-hidden`

#### Progress Bar Fill
- **Height**: Full
- **Border radius**: `rounded-full`
- **Transition**: `transition-all duration-500`
- **Colors by level**:
  - Beginner: `bg-green-500`
  - Intermediate: `bg-yellow-500`
  - Advanced: `bg-red-500`

#### Threshold Marker
- **Position**: Absolute at threshold percentage
- **Width**: `w-0.5`
- **Height**: `h-full`
- **Color**: `bg-gray-400`
- **Dashed line**: Use `border-r-2 border-dashed border-gray-400`

#### Text Display
```
<Flex justify-between text-sm>
  <span>X of Y completed</span>
  <span>Z% (Threshold: W)</span>
</Flex>
```

#### Unlock Threshold Text
When close to threshold (< 2 guides away):
- Show: "Complete X more to unlock [Next Level]"
- Color: Level color (green/yellow/red)
- Animation: Subtle pulse

### Level Color Mapping
```typescript
const levelColors = {
  beginner: {
    bg: 'bg-green-500',
    text: 'text-green-600',
    light: 'bg-green-100',
  },
  intermediate: {
    bg: 'bg-yellow-500', 
    text: 'text-yellow-600',
    light: 'bg-yellow-100',
  },
  advanced: {
    bg: 'bg-red-500',
    text: 'text-red-600', 
    light: 'bg-red-100',
  },
};
```

---

## Responsive Breakpoints

### Mobile (< 640px)
- Single column guide cards
- Interest filter as dropdown
- Stacked section headers
- Full-width buttons

### Tablet (640px - 1024px)
- 2-column guide grid
- Interest filter as tabs (wrapped if needed)
- Side-by-side section headers

### Desktop (> 1024px)
- 3-column guide grid
- Horizontal interest tabs
- Rich section headers with progress

---

## Animation Specifications

### Card Hover
```css
transition: all 200ms ease-in-out;
transform: translateY(-4px);
box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
```

### Progress Bar
```css
transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Lock Icon (Hover)
```css
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

### Section Fade In
```css
animation: fadeIn 500ms ease-out;
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## Accessibility Requirements

### ARIA Labels
- Lock icon: `aria-label="Locked guide"`
- Unlock button: `aria-label="Unlock intermediate guides"`
- Progress bar: `role="progressbar" aria-valuenow="{completed}" aria-valuemax="{total}"`
- Filter tabs: `role="tablist"` with `role="tab"` on each

### Keyboard Navigation
- Tab through filter options
- Enter/Space to activate
- Escape to close modals
- Focus visible on all interactive elements

### Color Contrast
- All text meets WCAG AA (4.5:1 ratio)
- Interactive elements have visible focus states
- Don't rely solely on color for state indication

---

## Dark Mode Considerations

### Color Mappings
- Gray 100 ↔ Gray 800
- Gray 200 ↔ Gray 700  
- Gray 600 ↔ Gray 400
- White ↔ Gray 800
- Black ↔ White

### Special Cases
- Progress bar colors stay the same (green/yellow/red)
- Purple accent colors adjust opacity
- Borders become slightly lighter in dark mode

---

## Implementation Notes

### State Management
- Use localStorage for persistence
- Sync across tabs with storage event
- Debounce rapid filter changes

### Performance
- Lazy load locked card images (if any)
- Use CSS transforms for animations (GPU accelerated)
- Memoize filtered guide lists

### Error Handling
- Graceful fallbacks if localStorage unavailable
- Show skeleton states while loading
- Clear error messages for unlock failures
