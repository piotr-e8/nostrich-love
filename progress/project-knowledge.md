# Nostrich.love Project Knowledge

**Last Updated**: 2026-02-13  
**Project Type**: Educational Nostr beginner guide  
**Tech Stack**: Astro + React + TypeScript + Tailwind CSS

---

## Architecture Overview

```
Astro (SSG/SSR)
├── React Components (client:load / client:only)
├── TypeScript for type safety
├── Tailwind CSS for styling
└── LocalStorage for persistence
```

**Key Patterns**:
- Astro pages handle routing and layout
- React islands for interactivity (`client:load`, `client:only="react"`)
- Custom hooks in `src/hooks/`
- Utility functions in `src/lib/`
- Data files in `src/data/`

---

## Core Systems

### 1. Gamification System
**Location**: `src/components/gamification/`

**Components**:
- `StreakBanner` - Shows learning streak (framer-motion animations)
- `StreakBannerWrapper` - Loads streak data from localStorage
- `BadgeEarnedModal` - Celebration modal when earning badges
- `BadgeEarnedModalListener` - Listens for badge-earned events

**State**: `localStorage.getItem('nostrich-gamification-v1')`

**Key Pattern**: Custom events for cross-component communication
```typescript
window.dispatchEvent(new CustomEvent('badge-earned', { detail: badge }));
window.dispatchEvent(new CustomEvent('streak-updated'));
```

### 2. Follow-Pack System
**Location**: `src/components/follow-pack/`

**Components**:
- `FollowPackFinder` - Main container with filters and pagination
- `AccountBrowser` - Grid/list view of accounts
- `AccountCard` - Individual account card
- `PackSidebar` - Selected accounts summary
- `ExportModal` - QR code and export functionality

**State Management**:
- `useLocalStorage` hook for persistence
- `Set<string>` for selected npubs (performance optimized)
- `useMemo` for filtered/sorted accounts

**Data Source**: `src/data/follow-pack.ts`

### 3. Simulator System
**Location**: `src/simulators/`

**Pattern**: Each simulator is a self-contained app
- `damus/` - Damus client simulator
- `amethyst/` - Amethyst client simulator
- `keychat/` - Keychat client simulator

**Structure**:
```
simulators/[client]/
├── index.tsx (entry point)
├── screens/ (different app screens)
├── components/ (reusable simulator components)
└── data/ (mock data)
```

### 4. Tour System
**Location**: `src/components/tour/`

**Components**:
- `TourProvider` - Context provider for tour state
- `TourOverlay` - Dark overlay with spotlight
- `TourTooltip` - Step instructions
- `useTourElement` - Hook for positioning

**Features**:
- Step-by-step guided tours
- Spotlight highlighting
- Action-triggered progression
- Keyboard navigation

### 5. UI Component Library
**Location**: `src/components/ui/`

**Pattern**: Atomic design
- Primitives: Button, Card, Input, Modal
- Composites: Tabs, Accordion, Select
- Domain-specific: DarkModeToggle, LanguageSwitcher

**Styling**: Tailwind + `cn()` utility for conditional classes

---

## Critical Patterns

### Custom Hooks

**useLocalStorage** (`src/hooks/useLocalStorage.ts`)
```typescript
// Usage
const [value, setValue] = useLocalStorage<T>('key', initialValue);

// Important: setValue is memoized with useCallback
// Safe to use in useEffect dependencies
```

**useTourElement** (`src/components/tour/useTourElement.ts`)
- Calculates element position for tooltips
- Handles window resize

### State Management

**Preferred Pattern**:
```typescript
// useState for local state
const [count, setCount] = useState(0);

// useMemo for derived state
const doubled = useMemo(() => count * 2, [count]);

// useCallback for event handlers
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []);

// Custom hooks for complex state
const [saved, setSaved] = useLocalStorage('key', []);
```

**Avoid**:
- Creating new objects/functions in render (causes re-renders)
- Putting non-memoized functions in useEffect deps
- Using useState for derived values

### Memory Management

**Timeout/Interval Pattern**:
```typescript
const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

useEffect(() => {
  return () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };
}, []);
```

**WebSocket Pattern**:
```typescript
const wsRef = useRef<WebSocket | null>(null);

useEffect(() => {
  return () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };
}, []);
```

### Animation Performance

**Framer Motion**:
- Use `repeat: Infinity` sparingly (check for cleanup)
- Consider pausing animations when not visible
- 22 instances found - monitor if performance issues

---

## Data Flow

### Static Data
- **Accounts**: `src/data/follow-pack.ts`
- **Categories**: `src/data/follow-pack.ts`
- **Guides**: `src/content/guides/` (Markdown)

### Dynamic Data
- **User Progress**: localStorage (`nostrich-gamification-v1`)
- **Follow Selections**: localStorage (`nostrich-follow-pack-selections`)
- **Theme**: localStorage (`theme`)

### External Data
- **Relay Status**: WebSocket connections (created/destroyed per check)
- **Analytics**: Cloudflare (privacy-friendly)

---

## Common Issues & Solutions

### Infinite Loops
**Cause**: Unstable function references in useEffect deps  
**Fix**: Use `useCallback` for returned hook functions

### Memory Leaks
**Causes**:
1. Un-cleared timeouts/intervals
2. WebSocket connections not closed
3. Event listeners not removed
4. Framer Motion animations (check unmount cleanup)

**Fix Pattern**: Always cleanup in useEffect return

### Performance
**Optimization Patterns**:
- `useMemo` for expensive calculations
- `useCallback` for stable callbacks
- `React.memo` for pure components
- Virtualization for long lists (if needed)

---

## File Organization

```
src/
├── components/
│   ├── follow-pack/     # Follow pack feature
│   ├── gamification/    # Badges, streaks, progress
│   ├── interactive/     # Simulators, explorers
│   ├── layout/          # Header, Footer, Layout
│   ├── tour/            # Guided tour system
│   └── ui/              # Reusable UI components
├── content/
│   └── guides/          # Markdown guide content
├── data/                # Static data files
├── hooks/               # Custom React hooks
├── layouts/             # Astro layouts
├── lib/                 # Utility functions
├── pages/               # Astro pages (routes)
├── simulators/          # Client simulators
├── styles/              # Global styles
└── types/               # TypeScript types
```

---

## Key Dependencies

**Core**:
- `astro` - Static site generation
- `react`, `react-dom` - UI library
- `typescript` - Type safety

**Styling**:
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icons
- `framer-motion` - Animations

**Utilities**:
- `clsx`, `tailwind-merge` - Conditional classes (`cn()` function)
- `qrcode` - QR generation

---

## Testing Strategy

**Manual Testing Checklist**:
- [ ] Memory usage stable (DevTools Memory tab)
- [ ] No console errors
- [ ] Theme toggle works
- [ ] Language switcher works
- [ ] Mobile responsive
- [ ] localStorage persistence works
- [ ] Tour system functional
- [ ] Simulators load correctly

**Performance Testing**:
```javascript
// Memory monitoring
setInterval(() => {
  console.log('Memory:', (performance.memory.usedJSHeapSize / 1048576).toFixed(2), 'MB');
}, 5000);
```

---

## Development Workflow

**Adding Features**:
1. Create workflow YAML in `/workflows/`
2. Create specialized agent docs in `/agents/`
3. Implement following existing patterns
4. Test manually
5. Update this knowledge doc

**Bug Fixes**:
1. Reproduce issue
2. Find root cause (check for: infinite loops, memory leaks, missing cleanup)
3. Apply minimal fix
4. Test fix works
5. Document in `/progress/`

---

## Areas to Watch

**Potential Issues**:
1. **Framer Motion** - 22 infinite animations, monitor performance
2. **useLocalStorage** - Now fixed, but watch for similar patterns
3. **WebSocket connections** - Ensure proper cleanup in all components
4. **localStorage size** - Could grow large with many selections

**Technical Debt**:
- Some components are large (ExportModal.tsx)
- Mixed patterns for state management
- Type definitions could be stricter

---

## Quick Reference

**Most Modified Files**:
- `src/components/follow-pack/FollowPackFinder.tsx`
- `src/components/interactive/RelayExplorer.tsx`
- `src/pages/follow-pack.astro`

**Important Hooks**:
- `useLocalStorage` - Persistence
- `useTour` - Tour system
- `useTourElement` - Positioning

**Key Utilities**:
- `cn()` - Conditional class names
- `getCategoryById()` - Category lookups
- `formatFollowers()` - Number formatting

---

*This document is living - update as project evolves*
