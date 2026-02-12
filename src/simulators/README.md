# Nostr Client Simulators

Foundation architecture for 7 Nostr client simulators.

## Architecture Overview

```
/src/simulators/
├── shared/                 # Shared foundation
│   ├── types/             # TypeScript interfaces
│   ├── hooks/             # React hooks
│   ├── components/        # Base components
│   ├── utils/             # Utility functions
│   ├── configs.ts         # Client configurations
│   └── index.ts           # Central exports
├── damus/                 # iOS client
├── amethyst/              # Android client
├── primal/                # Web client
├── snort/                 # Web client
├── yakihonne/             # iOS client
├── coracle/               # Desktop client
└── gossip/                # Desktop client
```

## Quick Start

### For Client Teams

Each simulator extends the base architecture:

```typescript
import { 
  SimulatorProvider, 
  useSimulator,
  SimulatorShell,
  damusConfig 
} from '../shared';

function DamusSimulator() {
  return (
    <SimulatorProvider config={damusConfig}>
      <SimulatorShell config={damusConfig}>
        {/* Client-specific UI */}
      </SimulatorShell>
    </SimulatorProvider>
  );
}
```

### State Management

```typescript
const { 
  state, 
  login, 
  navigateTo, 
  likeNote,
  followUser 
} = useSimulator();
```

## Core Features

### 1. Mock Key System (`utils/mockKeys.ts`)
- Generates realistic npub/nsec strings
- Visual-only, no cryptography
- Copy/paste functionality
- Predefined test keys

### 2. Event Utilities (`utils/mockEvents.ts`)
- Event ID generation
- Timestamp formatting
- Tag parsing
- Content extraction

### 3. State Hook (`hooks/useSimulator.ts`)
- React Context + useReducer
- Isolated per-simulator state
- Session-only (no persistence)
- Type-safe actions

### 4. Base Components
- `SimulatorShell`: Platform-specific container
- `MockKeyDisplay`: Key display with copy
- `NoteCard`: Standard note component

## Client Configurations

| Client | Platform | Primary Color | Features |
|--------|----------|---------------|----------|
| Damus | iOS | Purple | DMs, Zaps, Threads, Search |
| Amethyst | Android | Deep Purple | All features + Live Streaming |
| Primal | Web | Orange | All features + Marketplace |
| Snort | Web | Teal | Core features |
| YakiHonne | iOS | Pink | All features |
| Coracle | Desktop | Indigo | All features |
| Gossip | Desktop | Green | Core + Advanced Relays |

## Routing

All simulators accessible at:
- `/simulators` - Index page
- `/simulators/damus` - Damus
- `/simulators/amethyst` - Amethyst
- `/simulators/primal` - Primal
- `/simulators/snort` - Snort
- `/simulators/yakihonne` - YakiHonne
- `/simulators/coracle` - Coracle
- `/simulators/gossip` - Gossip

## Integration Points

### With Mock Data
```typescript
import { mockUsers, mockNotes } from '../../data/mock';
```

### With Existing Simulators
The existing `DamusInteractiveSimulator` can be refactored to use this foundation:
```typescript
// Old
import { DamusInteractiveSimulator } from './DamusInteractiveSimulator';

// New
import { DamusSimulator } from '../../simulators/damus';
```

## Development Guidelines

1. **NO Real Protocol**: Pure simulation only
2. **NO Persistence**: Session state only
3. **TypeScript Strict**: Full type safety
4. **Mobile-First**: Responsive design
5. **Isolated State**: Each simulator independent

## Next Steps

1. Client teams implement platform-specific UI
2. Design System Agent provides theme tokens
3. Integration with mock data for realistic content
4. Add interactive flows (login, posting, etc.)

## API Reference

See inline JSDoc comments in source files for detailed API documentation.
