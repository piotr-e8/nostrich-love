# Troubleshooting Guide

Common issues and solutions for the Nostr Client Simulators.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Build Issues](#build-issues)
- [Runtime Issues](#runtime-issues)
- [State Management Issues](#state-management-issues)
- [Styling Issues](#styling-issues)
- [Performance Issues](#performance-issues)
- [Browser Compatibility](#browser-compatibility)

## Installation Issues

### Issue: npm install fails

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: TypeScript compilation errors

**Error:**
```
Cannot find module '@/simulators/shared' or its corresponding type declarations
```

**Solution:**
1. Check `tsconfig.json` paths configuration:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. Restart TypeScript server in IDE
3. Run `npm run typecheck`

### Issue: Missing dependencies

**Error:**
```
Module not found: Error: Can't resolve 'framer-motion'
```

**Solution:**
```bash
# Install missing dependency
npm install framer-motion

# Or install all dependencies
npm install
```

## Build Issues

### Issue: Vite/Astro build fails

**Error:**
```
[vite]: Rollup failed to resolve import
```

**Solution:**
1. Check import paths are correct:
```typescript
// Correct
import { useSimulator } from '@/simulators/shared';

// Incorrect
import { useSimulator } from '../shared'; // relative path
```

2. Clear Vite cache:
```bash
rm -rf node_modules/.vite
npm run dev
```

### Issue: CSS not loading

**Error:**
Styles not applied, components unstyled

**Solution:**
1. Verify CSS imports in component:
```typescript
import './damus.theme.css';
```

2. Check Tailwind CSS is configured:
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
}
```

3. Verify PostCSS config:
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Issue: TypeScript strict mode errors

**Error:**
```
TS2322: Type 'string | undefined' is not assignable to type 'string'
```

**Solution:**
1. Add proper null checks:
```typescript
// Before
const name = user.displayName;

// After
const name = user?.displayName ?? 'Anonymous';
```

2. Or use non-null assertion (carefully):
```typescript
const name = user!.displayName;
```

## Runtime Issues

### Issue: "useSimulator must be used within SimulatorProvider"

**Error:**
```
Error: useSimulator must be used within a SimulatorProvider
```

**Solution:**
Wrap your component in SimulatorProvider:

```typescript
// Before (incorrect)
function MyComponent() {
  const { state } = useSimulator(); // Error!
  return <div>...</div>;
}

// After (correct)
function App() {
  return (
    <SimulatorProvider config={damusConfig}>
      <MyComponent />
    </SimulatorProvider>
  );
}

function MyComponent() {
  const { state } = useSimulator(); // Works!
  return <div>...</div>;
}
```

### Issue: Simulator state not updating

**Symptom:**
Actions don't update the UI

**Solution:**
1. Verify action is being dispatched:
```typescript
// Check console for action logs
const likeNote = (noteId: string) => {
  console.log('Liking note:', noteId);
  dispatch({ type: 'LIKE_NOTE', payload: { noteId } });
};
```

2. Check reducer handles the action:
```typescript
// In useSimulator.ts reducer
case 'LIKE_NOTE': {
  return updateActivity({
    ...state,
    feed: state.feed.map(item => 
      item.note.id === action.payload.noteId
        ? { ...item, note: { ...item.note, likes: item.note.likes + 1 } }
        : item
    ),
  });
}
```

3. Ensure component re-renders:
```typescript
// Use selector hooks for better performance
const feed = useFeed(); // Component re-renders when feed changes
```

### Issue: Navigation not working

**Symptom:**
Clicking navigation items doesn't change screen

**Solution:**
1. Verify `navigateTo` is called:
```typescript
<button onClick={() => {
  console.log('Navigating to profile');
  navigateTo(SimulatorView.PROFILE);
}}>
  Profile
</button>
```

2. Check screen rendering logic:
```typescript
function SimulatorContent() {
  const { state } = useSimulator();
  
  console.log('Current view:', state.currentView); // Debug
  
  switch (state.currentView) {
    case SimulatorView.PROFILE:
      return <ProfileScreen />;
    // ... other cases
  }
}
```

3. Ensure no errors in component:
```typescript
// Wrap in error boundary
<ErrorBoundary>
  <SimulatorContent />
</ErrorBoundary>
```

### Issue: Modal doesn't open

**Symptom:**
Clicking button doesn't show modal

**Solution:**
1. Check modal state:
```typescript
const { state, openModal } = useSimulator();

console.log('Active modal:', state.activeModal);
```

2. Verify modal rendering:
```typescript
{state.activeModal === SimulatorModal.COMPOSE && (
  <ComposeModal isOpen={true} onClose={closeModal} />
)}
```

3. Check for CSS issues (z-index, display):
```css
.modal-overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;
}
```

## State Management Issues

### Issue: State shared between simulators

**Symptom:**
Actions in one simulator affect another

**Solution:**
Each simulator must have its own provider:

```typescript
// Each with separate provider
<SimulatorProvider config={damusConfig}>
  <DamusSimulator />
</SimulatorProvider>

<SimulatorProvider config={amethystConfig}>
  <AmethystSimulator />
</SimulatorProvider>
```

**Not:**
```typescript
// Don't share provider
<SimulatorProvider config={damusConfig}>
  <DamusSimulator />
  <AmethystSimulator /> {/* Shares state - wrong! */}
</SimulatorProvider>
```

### Issue: State persists after logout

**Symptom:**
Logging out doesn't clear feed/notifications

**Solution:**
The LOGOUT action should reset to initial state:

```typescript
case 'LOGOUT': {
  return createInitialState();
}
```

Or clear specific state:
```typescript
case 'LOGOUT': {
  return {
    ...createInitialState(),
    currentView: SimulatorView.HOME,
  };
}
```

### Issue: Action type not found

**Error:**
```
Type '"UNKNOWN_ACTION"' is not assignable to type 'SimulatorAction'
```

**Solution:**
Add the action to the SimulatorAction union type:

```typescript
// In types/index.ts
export type SimulatorAction =
  | { type: 'LOGIN'; payload: { user: SimulatorUser } }
  | { type: 'LOGOUT' }
  | { type: 'UNKNOWN_ACTION' } // Add this
  // ... other actions
```

## Styling Issues

### Issue: Platform styles not applying

**Symptom:**
iOS simulator looks like Android

**Solution:**
1. Check platform class is applied:
```typescript
<SimulatorShell config={config}>
  {/* config.platform should be 'ios' for Damus */}
</SimulatorShell>
```

2. Verify CSS file is imported:
```typescript
import './damus.theme.css'; // Must be imported!
```

3. Check CSS selectors:
```css
/* Should match */
.ios-simulator .note-card {
  /* iOS styles */
}
```

### Issue: CSS variables not working

**Symptom:**
Colors from config not applied

**Solution:**
1. Check SimulatorShell sets variables:
```typescript
<div style={{
  '--simulator-primary': config.primaryColor,
  '--simulator-secondary': config.secondaryColor,
} as React.CSSProperties}>
```

2. Use correct CSS syntax:
```css
.button {
  background-color: var(--simulator-primary);
}
```

### Issue: Dark mode not working

**Symptom:**
Theme doesn't switch to dark

**Solution:**
1. Check dark mode class is applied:
```typescript
<div className={isDark ? 'dark' : ''}>
```

2. Use Tailwind dark mode classes:
```html
<div className="bg-white dark:bg-black text-black dark:text-white">
```

3. Configure Tailwind:
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```

### Issue: Responsive design breaking

**Symptom:**
Mobile layout on desktop, or vice versa

**Solution:**
1. Use responsive utilities:
```html
<div className="w-full md:max-w-md mx-auto">
```

2. Check viewport meta tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

3. Test at different breakpoints:
```bash
# Chrome DevTools device emulation
# Test: iPhone SE, iPhone 12 Pro, iPad, Desktop
```

## Performance Issues

### Issue: Simulator slow/laggy

**Symptom:**
Scrolling is jerky, interactions delayed

**Solutions:**

1. **Memoize expensive computations:**
```typescript
const sortedFeed = useMemo(() => {
  return [...feed].sort((a, b) => b.timestamp - a.timestamp);
}, [feed]);
```

2. **Virtualize long lists:**
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={feed.length}
  itemSize={100}
>
  {({ index, style }) => (
    <NoteCard item={feed[index]} style={style} />
  )}
</FixedSizeList>
```

3. **Use selector hooks:**
```typescript
// Instead of accessing full state
const { state } = useSimulator();
const feed = state.feed; // Re-renders on any state change

// Use selector hook
const feed = useFeed(); // Only re-renders when feed changes
```

4. **Debounce search input:**
```typescript
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 300);
```

### Issue: Memory leak

**Symptom:**
Browser tab uses increasing memory

**Solutions:**

1. **Clean up event listeners:**
```typescript
useEffect(() => {
  const handler = () => { /* ... */ };
  window.addEventListener('resize', handler);
  
  return () => {
    window.removeEventListener('resize', handler);
  };
}, []);
```

2. **Cancel pending requests:**
```typescript
useEffect(() => {
  const controller = new AbortController();
  
  fetchData({ signal: controller.signal });
  
  return () => {
    controller.abort();
  };
}, []);
```

3. **Clear intervals/timeouts:**
```typescript
useEffect(() => {
  const id = setInterval(() => {
    // Update timestamp
  }, 1000);
  
  return () => clearInterval(id);
}, []);
```

### Issue: Bundle size too large

**Symptom:**
Slow initial load

**Solutions:**

1. **Code split simulators:**
```typescript
const DamusSimulator = lazy(() => import('./damus/DamusSimulator'));

<Suspense fallback={<Loading />}>
  <DamusSimulator />
</Suspense>
```

2. **Tree-shake imports:**
```typescript
// Instead of importing all
import * as Icons from 'lucide-react';

// Import only needed icons
import { Heart, Share, Zap } from 'lucide-react';
```

3. **Analyze bundle:**
```bash
npm run build -- --analyze
```

## Browser Compatibility

### Issue: Simulator doesn't work in Safari

**Symptom:**
Blank screen or errors in Safari

**Solutions:**

1. **Check for modern JS features:**
```typescript
// May need polyfill for older Safari
const array = [...set]; // Spread syntax
```

2. **Add vendor prefixes:**
```css
.backdrop {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
```

3. **Check WebSocket support:**
Safari has stricter WebSocket policies (if adding real connections later)

### Issue: Touch events not working

**Symptom:**
Buttons unresponsive on mobile

**Solutions:**

1. **Use proper touch targets:**
```css
.button {
  min-height: 44px; /* iOS recommendation */
  min-width: 44px;
}
```

2. **Handle touch events:**
```typescript
<button 
  onClick={handleClick}
  onTouchStart={handleTouch}
>
```

3. **Prevent zoom on double tap:**
```css
button {
  touch-action: manipulation;
}
```

### Issue: CSS Grid/Flexbox issues

**Symptom:**
Layout broken in older browsers

**Solution:**
Add fallbacks and use autoprefixer:

```css
.layout {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
```

## Debugging Tips

### Enable Debug Mode

Add to component for debugging:

```typescript
useEffect(() => {
  console.log('Simulator mounted');
  return () => console.log('Simulator unmounted');
}, []);

useEffect(() => {
  console.log('State changed:', state);
}, [state]);
```

### React DevTools

1. Install React DevTools browser extension
2. Open DevTools → Components tab
3. Inspect component hierarchy
4. View props and state

### Redux DevTools (Simulator State)

Simulator state can be inspected with Redux DevTools:

```typescript
// In useSimulator.ts
const [state, dispatch] = useReducer(
  simulatorReducer,
  createInitialState(),
  undefined,
  // Enable Redux DevTools
  (window as any).__REDUX_DEVTOOLS_EXTENSION__?.()
);
```

### Console Logging Actions

Add middleware to log all actions:

```typescript
const dispatch = useCallback((action: SimulatorAction) => {
  console.log('[Action]', action.type, action.payload);
  baseDispatch(action);
}, [baseDispatch]);
```

## Getting Help

If your issue isn't covered here:

1. Check [FAQ.md](./FAQ.md) for common questions
2. Review existing simulator implementations (Damus, Amethyst)
3. Search GitHub issues
4. Ask in Nostr community channels
5. Create a minimal reproduction case

## Report a Bug

When reporting bugs, include:

1. **Environment:**
   - Browser and version
   - OS and version
   - Node.js version
   - Package versions

2. **Steps to reproduce:**
   - Clear step-by-step instructions
   - Expected vs actual behavior

3. **Error messages:**
   - Full error text
   - Stack trace
   - Console logs

4. **Code sample:**
   - Minimal reproduction
   - Relevant component code

5. **Screenshots:**
   - If UI-related issue
