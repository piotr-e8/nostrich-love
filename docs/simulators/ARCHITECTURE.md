# Simulator System Architecture

## System Overview

The Nostr Client Simulator system is built on a modular, extensible architecture that allows for consistent simulation of multiple Nostr clients while maintaining platform-specific designs.

## Architecture Principles

1. **Shared Foundation**: Common types, hooks, and utilities for all simulators
2. **Client Isolation**: Each simulator is independent with its own state
3. **Platform Fidelity**: Authentic designs matching real clients
4. **Type Safety**: Full TypeScript coverage
5. **No Real Protocol**: Pure simulation, no network connections

## Directory Structure

```
/src/simulators/
├── shared/                    # Foundation layer
│   ├── types/                # TypeScript definitions
│   ├── hooks/                # React hooks
│   ├── components/           # Base components
│   ├── utils/                # Utility functions
│   ├── configs.ts            # Client configurations
│   └── index.ts              # Central exports
├── damus/                    # iOS client simulation
├── amethyst/                 # Android client simulation
├── primal/                   # Web client simulation (planned)
├── snort/                    # Web client simulation (planned)
├── yakihonne/                # iOS client simulation (planned)
├── coracle/                  # Desktop client simulation (planned)
├── gossip/                   # Desktop client simulation (planned)
└── index.ts                  # Public API exports
```

## Layer Architecture

### Layer 1: Foundation (Shared)

**Purpose**: Core types, state management, and utilities

```
Shared Layer
├── types/index.ts           # All TypeScript interfaces
├── hooks/useSimulator.ts    # State management hook
├── components/
│   ├── SimulatorShell.tsx   # Base container
│   ├── MockKeyDisplay.tsx   # Key display component
│   └── NoteCard.tsx         # Standard note card
├── utils/
│   ├── mockKeys.ts          # Mock key generation
│   └── mockEvents.ts        # Event utilities
└── configs.ts               # Client configurations
```

**Key Components**:

1. **useSimulator Hook** (`hooks/useSimulator.ts`)
   - React Context + useReducer pattern
   - Manages all simulator state
   - Provides action dispatchers
   - Session-only, no persistence

2. **Type System** (`types/index.ts`)
   - 335 lines of TypeScript definitions
   - Enums for views, modals, features
   - Interfaces for all data structures
   - Simulator action types

3. **SimulatorShell** (`components/SimulatorShell.tsx`)
   - Base container for all simulators
   - Platform-specific styling
   - Mobile-first responsive design
   - CSS custom properties for theming

### Layer 2: Client Implementation

**Purpose**: Platform-specific UI and interactions

```
Client Layer (e.g., damus/)
├── ClientSimulator.tsx      # Main container
├── client.theme.css         # Platform styles
├── index.ts                 # Exports
├── screens/                 # Screen components
│   ├── HomeScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── ComposeScreen.tsx
│   └── ...
└── components/              # Client-specific components
    ├── TabBar.tsx
    ├── NoteCard.tsx
    └── ...
```

**Pattern**:

```typescript
// Client implementation pattern
import { 
  SimulatorProvider, 
  useSimulator,
  SimulatorShell,
  clientConfig 
} from '../shared';

function ClientSimulator() {
  return (
    <SimulatorProvider config={clientConfig}>
      <SimulatorShell config={clientConfig}>
        <ClientContent />
      </SimulatorShell>
    </SimulatorProvider>
  );
}

function ClientContent() {
  const { state, navigateTo, likeNote } = useSimulator();
  
  return (
    <div>
      {/* Platform-specific UI */}
    </div>
  );
}
```

## State Management

### State Architecture

```
SimulatorState
├── Identity
│   ├── currentUser: SimulatorUser | null
│   └── isLoggedIn: boolean
├── Navigation
│   ├── currentView: SimulatorView
│   ├── previousView: SimulatorView | null
│   ├── activeModal: SimulatorModal
│   └── modalData: Record<string, unknown> | null
├── Content
│   ├── feed: SimulatorFeedItem[]
│   ├── notifications: SimulatorNotification[]
│   ├── messages: SimulatorMessage[]
│   └── currentThread: SimulatorThread | null
├── Social
│   ├── following: string[]
│   ├── followers: string[]
│   ├── mutedUsers: string[]
│   ├── mutedWords: string[]
│   └── pinnedNotes: string[]
├── Relays
│   ├── connectedRelays: string[]
│   └── relayConfigs: Record<string, SimulatorRelayConfig>
└── UI
    ├── isLoading: boolean
    ├── error: string | null
    ├── searchQuery: string
    └── searchResults: SimulatorSearchResult | null
```

### Action Flow

```
User Action
    |
    v
Action Creator (useSimulator hook)
    |
    v
Dispatch Action
    |
    v
Reducer (simulatorReducer)
    |
    v
Update State
    |
    v
Re-render Components
```

### State Isolation

Each simulator instance has its own isolated state:

```typescript
// State is per-instance via React Context
<SimulatorProvider config={damusConfig}>
  <DamusSimulator />  // Has own state
</SimulatorProvider>

<SimulatorProvider config={amethystConfig}>
  <AmethystSimulator />  // Completely separate state
</SimulatorProvider>
```

## Component Hierarchy

### Shared Components

```
SimulatorShell (root container)
├── StatusBar (mobile only)
└── ContentArea
    └── Client-specific content
```

### Client-Specific Components

**Damus (iOS)**:
```
DamusSimulator
├── LoginScreen / HomeScreen / ProfileScreen / etc.
│   ├── ProfileHeader
│   ├── NoteCard (iOS style)
│   └── TabBar (iOS style)
└── TabBar
    └── Navigation items
```

**Amethyst (Android)**:
```
AmethystSimulator
├── HomeScreen / SearchScreen / NotificationsScreen / etc.
│   ├── MaterialCard (Android style)
│   └── BottomNav (Material Design)
└── FloatingActionButton
```

## Data Flow

### Mock Data Integration

```
/src/data/mock/
├── types.ts                 # Mock data types
├── index.ts                 # Data exports
├── users.ts                 # 55 mock users
├── notes.ts                 # 200+ mock notes
├── relays.ts                # 15 mock relays
├── threads.ts               # Thread relationships
├── generator.ts             # Data generation
└── utils.ts                 # Helper functions
```

**Usage Pattern**:

```typescript
import { mockUsers, mockNotes, mockRelays } from '@/data/mock';

function HomeScreen() {
  const feed = mockNotes.slice(0, 20).map(note => ({
    id: note.id,
    type: 'note',
    note,
    author: mockUsers.find(u => u.pubkey === note.pubkey),
    timestamp: note.createdAt,
  }));
  
  return <Feed items={feed} />;
}
```

## Configuration System

### Client Configurations

Each client has a predefined configuration:

```typescript
// configs.ts
export const damusConfig: SimulatorConfig = {
  id: SimulatorClient.DAMUS,
  name: 'Damus',
  description: 'The Nostr client for iOS',
  platform: 'ios',
  primaryColor: '#8B5CF6',
  secondaryColor: '#A78BFA',
  supportedFeatures: [
    SimulatorFeature.DM,
    SimulatorFeature.ZAPS,
    // ...
  ],
  defaultView: SimulatorView.FEED,
};
```

### Platform Styling

Platform-specific CSS variables and classes:

```css
/* damus.theme.css */
.ios-simulator {
  --ios-background: #000000;
  --ios-text: #ffffff;
  --ios-accent: #8B5CF6;
  --ios-card-bg: #1c1c1e;
  --ios-border: #38383a;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif;
}

/* amethyst.theme.css */
.android-simulator {
  --md-sys-color-primary: #6B21A8;
  --md-sys-color-secondary: #A855F7;
  font-family: 'Roboto', sans-serif;
}
```

## Routing

### Page Structure

```
/src/pages/simulators/
├── index.astro              # Simulator gallery
├── damus.astro             # Damus simulator page
├── amethyst.astro          # Amethyst simulator page
├── primal.astro            # Primal simulator page (planned)
├── snort.astro             # Snort simulator page (planned)
├── yakihonne.astro         # YakiHonne simulator page (planned)
├── coracle.astro           # Coracle simulator page (planned)
└── gossip.astro            # Gossip simulator page (planned)
```

### URL Structure

- `/simulators` - Gallery view
- `/simulators/damus` - Damus simulator
- `/simulators/amethyst` - Amethyst simulator
- etc.

## Feature System

### Feature Flags

Features are defined as enum values:

```typescript
export enum SimulatorFeature {
  DM = 'dm',
  ZAPS = 'zaps',
  THREADS = 'threads',
  SEARCH = 'search',
  RELAYS = 'relays',
  BADGES = 'badges',
  NIP05 = 'nip05',
  LONG_FORM = 'long_form',
  LIVE_STREAMING = 'live_streaming',
  MARKETPLACE = 'marketplace',
  MUTE_LIST = 'mute_list',
  PINNED_NOTES = 'pinned_notes',
}
```

### Feature Support Matrix

Each client declares which features it supports:

```typescript
// Damus supports 9 features
supportedFeatures: [
  SimulatorFeature.DM,
  SimulatorFeature.ZAPS,
  SimulatorFeature.THREADS,
  SimulatorFeature.SEARCH,
  SimulatorFeature.RELAYS,
  SimulatorFeature.BADGES,
  SimulatorFeature.NIP05,
  SimulatorFeature.MUTE_LIST,
  SimulatorFeature.PINNED_NOTES,
]

// Amethyst supports all 10 features (includes LIVE_STREAMING)
supportedFeatures: [
  // ... Damus features ...
  SimulatorFeature.LONG_FORM,
  SimulatorFeature.LIVE_STREAMING,
]
```

## Testing Architecture

### Test Strategy

1. **Unit Tests**: Individual components and utilities
2. **Integration Tests**: Screen navigation and interactions
3. **Visual Tests**: Screenshots for regression testing

### Test Utilities

```typescript
// Mock context for testing
export function renderWithSimulator(
  component: React.ReactElement,
  config: SimulatorConfig = damusConfig
) {
  return render(
    <SimulatorProvider config={config}>
      {component}
    </SimulatorProvider>
  );
}
```

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**: Each simulator loads independently
2. **Lazy Loading**: Screens loaded on demand
3. **Memoization**: React.memo for expensive components
4. **Virtualization**: Long lists use windowing (planned)

### Memory Management

- State resets on unmount
- No persistent storage
- Session-only data

## Security Considerations

### Key Principles

1. **NO Real Cryptography**: Visual-only key display
2. **NO Network Connections**: Pure client-side simulation
3. **NO Data Persistence**: Session-only state
4. **NO Real Keys**: Mock keys are clearly marked

### Mock Key System

```typescript
// Mock keys are clearly marked as "DEMO"
export function generateMockKeys(): MockKeyPair {
  return {
    pubkey: 'demo_' + randomHex(64),
    npub: 'npub1DEMO' + randomString(58),
    nsec: 'nsec1DEMO' + randomString(58),
    displayName: 'Demo User',
  };
}
```

## Extension Points

### Adding New Clients

1. Create directory: `/src/simulators/newclient/`
2. Define configuration in `configs.ts`
3. Implement screens and components
4. Export from `index.ts`
5. Create page: `/src/pages/simulators/newclient.astro`

### Adding New Features

1. Add to `SimulatorFeature` enum
2. Add action types
3. Update reducer
4. Add UI components
5. Update client configs

## Build System

### Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.x",
    "lucide-react": "^0.x",
    "tailwindcss": "^4.x"
  }
}
```

### Build Process

1. TypeScript compilation
2. Tailwind CSS processing
3. Asset bundling
4. Static generation (Astro)

## Future Enhancements

1. **Gesture Support**: Swipe actions, pull-to-refresh
2. **Animations**: Page transitions, micro-interactions
3. **Accessibility**: Full a11y compliance
4. **Mobile Optimization**: Touch gestures, viewport handling
5. **Offline Support**: Service workers for cached assets
6. **Theming**: User-customizable themes

## Diagrams

### High-Level Architecture

```
+---------------------+
|     User Interface  |
|  (Client-Specific)  |
+---------------------+
          |
          v
+---------------------+
|   Shared Components |
|   (SimulatorShell,  |
|    NoteCard, etc.)  |
+---------------------+
          |
          v
+---------------------+
|   useSimulator Hook |
|  (State Management) |
+---------------------+
          |
          v
+---------------------+
|   Mock Data System  |
|  (Users, Notes, etc)|
+---------------------+
```

### State Flow

```
Action -> Dispatch -> Reducer -> State Update -> Re-render
   |                                           |
   |                                           v
   +-------------------------------------+  UI Update
```

## References

- [React Context API](https://react.dev/reference/react/useContext)
- [React useReducer](https://react.dev/reference/react/useReducer)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Nostr Protocol](https://github.com/nostr-protocol/nostr)
