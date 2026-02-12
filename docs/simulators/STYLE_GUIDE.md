# Style Guide

Coding standards and best practices for the Nostr Client Simulators.

## Table of Contents

- [TypeScript](#typescript)
- [React](#react)
- [CSS and Styling](#css-and-styling)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Comments and Documentation](#comments-and-documentation)
- [Testing](#testing)
- [Performance](#performance)
- [Accessibility](#accessibility)

## TypeScript

### Type Safety

Enable strict mode and use it:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Types vs Interfaces

Use **interfaces** for object shapes, **types** for unions:

```typescript
// Interface for objects
interface User {
  id: string;
  name: string;
  email: string;
}

// Type for unions
type Status = 'active' | 'inactive' | 'pending';

// Type for complex types
type Response<T> = {
  data: T;
  error: string | null;
};
```

### Explicit Types

Always add explicit return types for public functions:

```typescript
// Good
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Bad - inferred, harder to read
function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Null Checks

Handle nullable values explicitly:

```typescript
// Good
function greetUser(user: User | null): string {
  if (!user) {
    return 'Hello, Guest';
  }
  return `Hello, ${user.name}`;
}

// Good - with optional chaining
const displayName = user?.name ?? 'Anonymous';

// Bad - potential runtime error
const displayName = user.name; // Error if user is null
```

### Enums

Use enums for fixed sets of values:

```typescript
// Good
export enum SimulatorView {
  HOME = 'home',
  PROFILE = 'profile',
  SETTINGS = 'settings',
}

// Usage
navigateTo(SimulatorView.HOME);

// Bad - magic strings
navigateTo('home');
```

### Type Exports

Export types that are part of public API:

```typescript
// In shared/index.ts
export type {
  SimulatorConfig,
  SimulatorState,
  SimulatorUser,
  SimulatorAction,
} from './types';
```

## React

### Component Structure

Use functional components with named exports:

```typescript
// Component file: UserCard.tsx
import React from 'react';

interface UserCardProps {
  user: User;
  onClick?: (user: User) => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <div onClick={() => onClick?.(user)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

### Props Destructuring

Destructure props in function parameters:

```typescript
// Good
export function Button({ title, onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{title}</button>;
}

// Avoid
export function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.title}</button>;
}
```

### Hooks Rules

Follow React hooks rules strictly:

```typescript
// Good - hooks at top level
export function Counter() {
  const [count, setCount] = useState(0);
  const { user } = useSimulator();
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return <div>{count}</div>;
}

// Bad - hooks inside conditionals
export function Counter() {
  if (condition) {
    const [count, setCount] = useState(0); // Error!
  }
}
```

### useEffect Dependencies

Always include all dependencies:

```typescript
// Good
useEffect(() => {
  fetchData(userId);
}, [userId]); // Dependency included

// Bad - missing dependency
useEffect(() => {
  fetchData(userId);
}, []); // ESLint will warn
```

### Event Handlers

Use descriptive handler names:

```typescript
// Good
function handleSubmit(event: FormEvent) {
  event.preventDefault();
  // ...
}

function handleUserClick(user: User) {
  navigateToProfile(user.id);
}

// Bad - vague names
function click() { }
function onClick() { }
```

### Conditional Rendering

Use early returns for cleaner code:

```typescript
// Good
export function UserProfile({ user }: { user: User | null }) {
  if (!user) {
    return <LoginPrompt />;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  );
}

// Avoid deep nesting
```

### Children Prop

Type children explicitly:

```typescript
interface ContainerProps {
  children: React.ReactNode; // Most flexible
  // or
  children: React.ReactElement; // Single element
  // or
  children: React.ReactElement[]; // Array of elements
}
```

## CSS and Styling

### Tailwind CSS First

Prefer Tailwind utilities over custom CSS:

```typescript
// Good - Tailwind
<div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-md">

// Avoid - custom CSS
<div className="custom-card">
```

### Custom CSS When Needed

Use CSS files only for:
- Platform-specific themes
- Complex animations
- CSS variables
- Pseudo-elements

```css
/* damus.theme.css */
.damus-simulator {
  --ios-primary: #8B5CF6;
  --ios-background: #000000;
}

.damus-simulator .note-card {
  border-bottom: 1px solid var(--ios-border);
}
```

### CSS Class Naming

Use kebab-case for CSS classes:

```css
/* Good */
.note-card { }
.user-avatar { }
.tab-bar { }

/* Bad */
.noteCard { }
.UserAvatar { }
```

### Responsive Design

Use Tailwind responsive prefixes:

```typescript
// Mobile-first approach
<div className="w-full md:max-w-md lg:max-w-lg mx-auto">
  {/* Mobile: full width */}
  {/* Tablet: max-w-md */}
  {/* Desktop: max-w-lg */}
</div>
```

### CSS Variables

Use CSS custom properties for theming:

```css
:root {
  --simulator-primary: #8B5CF6;
  --simulator-secondary: #A78BFA;
}

.button-primary {
  background-color: var(--simulator-primary);
}
```

## File Organization

### Directory Structure

```
ComponentName/
├── ComponentName.tsx      # Main component
├── ComponentName.test.tsx # Tests
├── index.ts               # Public exports
└── types.ts               # Component-specific types (if needed)
```

### Index Files

Export all public APIs from index.ts:

```typescript
// index.ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
export { useComponentHook } from './useComponentHook';
```

### Import Order

Organize imports in this order:

```typescript
// 1. React and third-party libraries
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 2. Absolute imports (project root)
import { useSimulator } from '@/simulators/shared';
import { mockUsers } from '@/data/mock';

// 3. Relative imports
import { NoteCard } from './NoteCard';
import { useNoteActions } from './useNoteActions';

// 4. CSS imports
import './styles.css';
```

## Naming Conventions

### Files

- **Components**: PascalCase (e.g., `UserCard.tsx`)
- **Hooks**: camelCase with use prefix (e.g., `useSimulator.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Styles**: camelCase or kebab-case (e.g., `damus.theme.css`)
- **Tests**: Same as file + `.test.tsx`

### Variables

```typescript
// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// Variables: camelCase
const userName = 'Alice';
const isLoading = true;

// Types/Interfaces: PascalCase
interface UserProfile { }
type ApiResponse<T> = { }

// Enums: PascalCase for name, UPPER_SNAKE for values
enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Boolean variables: prefix with is/has/should
const isVisible = true;
const hasPermission = false;
const shouldUpdate = true;
```

### Components

```typescript
// Component names: PascalCase
export function UserCard() { }
export function TabBar() { }

// Props interfaces: ComponentName + Props
interface UserCardProps { }
interface TabBarProps { }

// Event handlers: handle + Event + Subject
function handleUserClick() { }
function handleSubmitForm() { }
function handleNoteLike() { }
```

## Comments and Documentation

### JSDoc Comments

Document all public APIs:

```typescript
/**
 * Display a user's profile card with avatar and info
 * 
 * @param user - The user to display
 * @param onClick - Optional click handler
 * @param showActions - Whether to show action buttons (default: true)
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * <UserCard 
 *   user={currentUser} 
 *   onClick={handleUserClick}
 *   showActions={true}
 * />
 * ```
 */
export function UserCard({ user, onClick, showActions = true }: UserCardProps) {
  // ...
}
```

### Inline Comments

Use sparingly, explain "why" not "what":

```typescript
// Good - explains reasoning
// Using setTimeout to debounce rapid inputs
const debouncedSearch = useDebounce(searchQuery, 300);

// Bad - restates the obvious
// Increment count by 1
setCount(count + 1);
```

### TODO Comments

Mark incomplete work:

```typescript
// TODO: Add error handling for network failures
// FIXME: This causes layout shift on mobile
// NOTE: This is temporary until API v2 is ready
// HACK: Workaround for Safari bug
```

## Testing

### Test File Structure

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  describe('rendering', () => {
    it('renders correctly with default props', () => {
      // Test implementation
    });
    
    it('renders nothing when condition is false', () => {
      // Test implementation
    });
  });
  
  describe('interactions', () => {
    it('calls onClick when clicked', () => {
      // Test implementation
    });
  });
  
  describe('edge cases', () => {
    it('handles empty data gracefully', () => {
      // Test implementation
    });
  });
});
```

### Test Naming

Describe behavior, not implementation:

```typescript
// Good - describes behavior
it('displays user name when provided', () => {
  // ...
});

// Bad - describes implementation
it('sets text content to user.name', () => {
  // ...
});
```

### Testing Utilities

```typescript
// Helper for rendering with providers
const renderWithSimulator = (
  component: React.ReactElement,
  config: SimulatorConfig = damusConfig
) => {
  return render(
    <SimulatorProvider config={config}>
      {component}
    </SimulatorProvider>
  );
};
```

## Performance

### Memoization

Use useMemo and useCallback appropriately:

```typescript
// Good - expensive computation
const sortedFeed = useMemo(() => {
  return [...feed].sort((a, b) => b.timestamp - a.timestamp);
}, [feed]);

// Good - callback passed to child
const handleLike = useCallback((noteId: string) => {
  likeNote(noteId);
}, [likeNote]);

// Bad - premature optimization
const simpleValue = useMemo(() => count + 1, [count]);
```

### Virtualization

For long lists, use virtualization:

```typescript
import { FixedSizeList } from 'react-window';

function Feed({ items }: { items: FeedItem[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={100}
    >
      {({ index, style }) => (
        <NoteCard item={items[index]} style={style} />
      )}
    </FixedSizeList>
  );
}
```

### Lazy Loading

Code split large components:

```typescript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## Accessibility

### Semantic HTML

Use proper HTML elements:

```typescript
// Good
<button onClick={handleClick}>Submit</button>
<nav>...</nav>
<main>...</main>
<article>...</article>

// Bad
<div onClick={handleClick}>Submit</div>
```

### ARIA Labels

Add labels for screen readers:

```typescript
// Good
<button 
  onClick={handleLike}
  aria-label={`Like note by ${authorName}`}
>
  <HeartIcon />
</button>

// Good - visible label
<label htmlFor="search">Search</label>
<input id="search" type="text" />
```

### Keyboard Navigation

Ensure keyboard accessibility:

```typescript
// Good - button is focusable and clickable
<button onClick={handleClick}>Action</button>

// Ensure interactive elements are focusable
<div 
  role="button" 
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Clickable Div
</div>
```

### Color Contrast

Ensure sufficient contrast:

```typescript
// Good - high contrast
<div className="text-black bg-white">Content</div>
<div className="text-white bg-purple-600">Content</div>

// Bad - low contrast (avoid)
<div className="text-gray-400 bg-gray-300">Content</div>
```

## Linting

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
```

### Prettier Configuration

```javascript
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Running Linters

```bash
# Check code
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run typecheck
```

## Git

### Commit Messages

Use conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat(damus): add DM screen
fix(amethyst): correct theme colors
docs: update API reference
test(shared): add useSimulator tests
```

### Branch Naming

```
feature/description
fix/description
docs/description
refactor/description
```

Examples:
```
feature/damus-dm-screen
fix/amethyst-theme-colors
docs/api-reference-update
```

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Astro Documentation](https://docs.astro.build)

## Questions?

- Check [CONTRIBUTING.md](./CONTRIBUTING.md)
- Review existing code for examples
- Ask in GitHub Discussions
