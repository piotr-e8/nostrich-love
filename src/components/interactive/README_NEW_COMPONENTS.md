# Nostr Beginner Guide - Interactive Components

This directory contains interactive React components for the Nostr beginner guide.

## Components

### Existing Components (P0)

- **KeyGenerator** - Generate secure Nostr key pairs with safety checklists
- **EmptyFeedFixer** - Guide users to fix empty feeds with starter packs
- **ClientRecommender** - Quiz-based client recommendation system
- **BackupChecklist** - Ensure users properly backup their keys

### New Components (P1)

#### 1. RelayExplorer
Browse and connect to Nostr relays with real-time ping tests.

```tsx
import { RelayExplorer } from './interactive';

<RelayExplorer 
  onSelectRelays={(relays) => console.log(relays)}
/>
```

**Features:**
- List of 20+ popular relays with metadata
- Real-time latency testing via WebSocket
- Filter by topic, type (free/paid), and language
- "Starter Pack" quick selection
- Copy/download relay lists

#### 2. NIP05Checker
Validate NIP-05 identifiers (human-readable names).

```tsx
import { NIP05Checker } from './interactive';

<NIP05Checker />
```

**Features:**
- Real-time format validation
- Check nostr.json endpoints
- Display associated npub and metadata
- Link to NIP-05 providers
- Error guidance for common issues

#### 3. NostrSimulator
Interactive visualization of how Nostr protocol works.

```tsx
import { NostrSimulator } from './interactive';

<NostrSimulator 
  onComplete={() => console.log('User completed simulation')}
/>
```

**Features:**
- 11-step interactive simulation
- Visual diagram with users (Alice, Bob, Carol) and relays
- Animations for key generation, posting, and following
- Play/pause/reset controls
- Speed control (0.5x, 1x, 2x)
- Completion celebration

#### 4. ClientComparisonTable
Detailed feature comparison of Nostr clients.

```tsx
import { ClientComparisonTable } from './interactive';

<ClientComparisonTable />
```

**Features:**
- Sortable columns (rating, name, difficulty)
- Platform filters (iOS, Android, Web, Desktop)
- Feature filters (wallet, media, long-form, privacy)
- Expandable rows with pros/cons
- Export to CSV
- Copy comparison text

#### 5. ProgressTracker
Track user's learning journey through the guide.

```tsx
import { ProgressTracker } from './interactive';

<ProgressTracker 
  onSectionClick={(sectionId) => console.log(sectionId)}
/>
```

**Features:**
- 8-section checklist
- Progress bar and statistics
- Time tracking
- Daily streak counter
- Achievement system
- Confetti animation on completion
- Share progress feature

#### 6. TroubleshootingWizard
Decision tree for common Nostr problems.

```tsx
import { TroubleshootingWizard } from './interactive';

<TroubleshootingWizard />
```

**Features:**
- Interactive Q&A flow
- 20+ common problem solutions
- Step-by-step fixes
- Pro tips for each issue
- Diagnostic info export
- Links to helpful resources

## Technical Stack

- **React 18+** with TypeScript
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **localStorage** for state persistence
- Client-side only (no backend required)

## Usage

Import components from the index:

```tsx
import { 
  RelayExplorer, 
  NIP05Checker, 
  NostrSimulator,
  ClientComparisonTable,
  ProgressTracker,
  TroubleshootingWizard 
} from './components/interactive';
```

## Styling

Components use Tailwind CSS with custom color tokens:
- `bg-surface` - Main background
- `border-border-dark` - Borders
- `text-primary-500` - Primary accent
- `text-success-500` - Success states
- `text-error-500` - Error states
- `text-warning-500` - Warning states

## State Management

Components use localStorage for persistence:
- `nostr-relay-selections` - RelayExplorer selections
- `nostr-guide-progress` - ProgressTracker state
- `nostr-backup-checklist` - BackupChecklist state

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Semantic HTML structure
- Reduced motion support (via Framer Motion)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- NIP-05 Checker requires CORS-enabled endpoints for real validation
- Relay Explorer uses WebSocket connections for latency testing
- All components are responsive and mobile-friendly
- Dark mode is the default theme
