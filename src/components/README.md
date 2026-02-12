# Nostr Beginner Guide - Design System Components

A comprehensive React component library for the Nostr beginner guide, built with TypeScript, Tailwind CSS, and Astro.

## 🎨 Design System Overview

### Color Palette
- **Primary**: Purple (#8B5CF6) - Nostr brand color
- **Secondary**: Indigo (#6366F1) - Technical trust
- **Success**: Green (#22C55E) - Safe/public keys
- **Danger**: Red (#EF4444) - Danger/private keys
- **Warning**: Amber (#F59E0B) - Caution states
- **Info**: Blue (#3B82F6) - Information

### Typography
- **Font Family**: Inter (Google Fonts)
- **Scale**: 10px to 72px with responsive scaling
- **Weights**: 400 (normal) to 800 (extrabold)

## 📦 Components

### 1. KeyCard
Visual distinction between npub (public) and nsec (private) keys with copy functionality and security warnings.

```tsx
import { KeyCard } from './components/ui';

<KeyCard 
  npub="npub1abc123..."
  nsec="nsec1xyz789..."
  onCopy={(type) => console.log(`Copied ${type}`)}
/>
```

**Features:**
- Visual distinction (green for public, red for private)
- Copy to clipboard with feedback
- Toggle visibility for nsec
- Security warnings and confirmation checkbox
- Download backup functionality

### 2. RelayVisualizer
Interactive diagram showing relay connections with animated data flow.

```tsx
import { RelayVisualizer } from './components/ui';

const relays = [
  { id: '1', url: 'wss://relay.damus.io', name: 'Damus', status: 'connected', latency: 120 },
  { id: '2', url: 'wss://relay.nostr.band', name: 'Nostr.band', status: 'disconnected' },
];

<RelayVisualizer 
  relays={relays}
  userNpub="npub1..."
  onRelayToggle={(relayId) => console.log(`Toggle ${relayId}`)}
/>
```

**Features:**
- Visual network diagram
- Pulsing connection indicators
- Animated data flow packets
- Connection latency display
- One-click connect/disconnect

### 3. ClientCard / ClientGrid
Recommendation cards for Nostr clients with platform badges.

```tsx
import { ClientCard, ClientGrid } from './components/ui';

const client = {
  id: '1',
  name: 'Damus',
  description: 'The best iOS client...',
  platforms: ['ios', 'macos'],
  rating: 4.8,
  beginnerFriendly: true,
  features: ['Easy setup', 'Great UI'],
  websiteUrl: 'https://damus.io',
};

<ClientCard client={client} onClick={(c) => console.log(c)} />

// Or use the grid
<ClientGrid 
  clients={[client1, client2, client3]}
  onClientClick={(c) => console.log(c)}
/>
```

**Features:**
- "Beginner Friendly" badges
- Platform icons (iOS, Android, Web, Desktop)
- Star ratings
- Feature tags
- Hover effects with elevation

### 4. Progress Indicators
Stepper, circular progress, and checklists.

```tsx
import { Stepper, CircularProgress, Checklist } from './components/ui';

// Stepper
const steps = [
  { id: '1', label: 'Create Keys', status: 'complete' },
  { id: '2', label: 'Choose Client', status: 'current' },
  { id: '3', label: 'Connect', status: 'pending' },
];

<Stepper steps={steps} onStepClick={(id) => console.log(id)} />

// Circular Progress
<CircularProgress progress={65} size={80} strokeWidth={6} />

// Checklist
const items = [
  { id: '1', label: 'Downloaded client', checked: true },
  { id: '2', label: 'Created keys', checked: false },
];

<Checklist items={items} onToggle={(id) => console.log(id)} />
```

**Features:**
- Animated progress transitions
- Interactive stepper
- Checkbox checklist with progress tracking
- Accessible with ARIA labels

### 5. Callouts
Info, warning, success, danger, and specialized callouts.

```tsx
import { 
  Callout, 
  InfoCallout, 
  WarningCallout, 
  SuccessCallout, 
  DangerCallout,
  SecurityWarning,
  Tip 
} from './components/ui';

<InfoCallout title="Did you know?">
  Nostr stands for "Notes and Other Stuff Transmitted by Relays"
</InfoCallout>

<WarningCallout title="Be careful!" dismissible>
  Never share your private key.
</WarningCallout>

<SecurityWarning>
  Your private key is like your password. Store it safely.
</SecurityWarning>

<Tip pro>
  Use a password manager to store your nsec safely.
</Tip>
```

**Features:**
- 4 variants (info, warning, success, danger)
- Dismissible option
- Security warning with special styling
- Pro tip badges

### 6. Buttons
Primary, secondary, ghost, danger variants with loading states.

```tsx
import { Button, IconButton } from './components/ui';

<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

<Button isLoading>Loading</Button>
<Button leftIcon={<Icon />}>With Icon</Button>

<IconButton icon={<Icon />} />
```

**Features:**
- 4 color variants
- 3 size options
- Loading spinner state
- Icon support (left/right)
- Hover animations
- Focus ring for accessibility

### 7. DarkModeToggle
Smooth theme switching with system preference detection.

```tsx
import { DarkModeToggle, DarkModeToggleSimple } from './components/ui';

// Full toggle with all options
<DarkModeToggle showLabel />

// Simple icon toggle
<DarkModeToggleSimple />
```

**Features:**
- System preference detection
- localStorage persistence
- Smooth transitions
- Three options: light, dark, system

### 8. Navigation
Sidebar, breadcrumbs, table of contents, and mobile nav.

```tsx
import { 
  Sidebar, 
  Breadcrumbs, 
  TableOfContents, 
  TopNav,
  MobileNav 
} from './components/ui';

<Sidebar 
  items={navItems}
  activeItem="guide"
  showProgress
  progress={65}
/>

<Breadcrumbs 
  items={[
    { label: 'Home', href: '/' },
    { label: 'Guide' },
  ]} 
/>

<TableOfContents 
  items={tocItems}
  activeId="buttons"
/>

<TopNav 
  logo={<Logo />}
  navItems={navItems}
  rightContent={<DarkModeToggleSimple />}
/>
```

**Features:**
- Collapsible sidebar sections
- Progress indicator integration
- Mobile hamburger menu
- Sticky table of contents
- Accessible focus states

### 9. Animations
Fade in, stagger, confetti, skeletons, and spinners.

```tsx
import { 
  FadeIn, 
  StaggerContainer, 
  Confetti, 
  SkeletonCard,
  Spinner,
  PageLoader 
} from './components/ui';

// Fade in on scroll
<FadeIn delay={200} direction="up">
  <Content />
</FadeIn>

// Staggered reveal
<StaggerContainer staggerDelay={100}>
  <Item1 />
  <Item2 />
  <Item3 />
</StaggerContainer>

// Confetti celebration
<Confetti 
  isActive={showConfetti}
  duration={2000}
  particleCount={50}
/>

// Loading states
<SkeletonCard lines={3} />
<Spinner size="md" />
<PageLoader isLoading={loading} message="Loading..." />
```

**Features:**
- Scroll-triggered fade in
- Staggered children animations
- Confetti celebration effect
- Skeleton loading cards
- Reduced motion support

## 🎯 Accessibility Features

All components include:
- WCAG AA compliant color contrast
- Keyboard navigation support
- Focus indicators
- ARIA labels and roles
- Reduced motion media query support
- Screen reader announcements

## 🌙 Dark Mode

Built-in dark mode support via Tailwind's `dark:` modifier:
- System preference detection
- localStorage persistence
- Smooth transitions
- Consistent color palette in both modes

## 📱 Responsive Design

Mobile-first approach with breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🚀 Usage in Astro

```astro
---
import { Button, KeyCard, FadeIn } from '../components/ui';
---

<Layout>
  <FadeIn client:load>
    <Button client:load>Click me</Button>
  </FadeIn>
  
  <KeyCard 
    client:load
    npub="npub1..."
    nsec="nsec1..."
  />
</Layout>
```

**Note:** React components need `client:*` directives for interactivity in Astro.

## 📁 File Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── KeyCard.tsx
│   │   ├── RelayVisualizer.tsx
│   │   ├── ClientCard.tsx
│   │   ├── ProgressIndicator.tsx
│   │   ├── Callout.tsx
│   │   ├── DarkModeToggle.tsx
│   │   ├── Animations.tsx
│   │   └── index.ts
│   └── layout/       # Layout components
│       └── Navigation.tsx
├── lib/
│   └── utils.ts      # Utility functions
└── styles/
    └── globals.css   # Global styles & animations
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#8B5CF6',
    600: '#7C3AED',
    // ...
  },
}
```

### Animations
Edit `src/styles/globals.css`:
```css
@keyframes customAnimation {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## 📄 License

MIT - Open source and free to use.
