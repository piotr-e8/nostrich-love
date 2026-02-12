# API Reference - Components

Complete documentation for React components in the simulator system.

## Table of Contents

- [SimulatorShell](#simulatorshell) - Base container
- [MockKeyDisplay](#mockkeydisplay) - Key display
- [NoteCard](#notecard) - Post display
- [UserAvatar](#useravatar) - Avatar component
- [ComposeModal](#composemodal) - Post composer
- [Provider Components](#provider-components)

## SimulatorShell

Base container component for all simulators.

### Import

```typescript
import { SimulatorShell } from '@/simulators/shared';
```

### Props

```typescript
interface SimulatorShellProps {
  children: React.ReactNode;
  config: SimulatorConfig;
  className?: string;
}
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | Yes | Child components |
| `config` | `SimulatorConfig` | Yes | Client configuration |
| `className` | `string` | No | Additional CSS classes |

### Usage

```typescript
import { SimulatorShell, SimulatorProvider } from '@/simulators/shared';
import { damusConfig } from '@/simulators/shared/configs';

function DamusSimulator() {
  return (
    <SimulatorProvider config={damusConfig}>
      <SimulatorShell config={damusConfig}>
        <DamusContent />
      </SimulatorShell>
    </SimulatorProvider>
  );
}
```

### Features

- **Platform Detection**: Applies platform-specific classes (`ios-simulator`, `android-simulator`, etc.)
- **Status Bar**: Simulated mobile status bar for iOS/Android
- **Theming**: CSS custom properties for primary/secondary colors
- **Safe Areas**: Handles mobile safe area insets
- **Responsive**: Centers content on desktop with mobile frame

### CSS Classes Applied

```css
.simulator-shell        /* Base container */
.ios-simulator         /* iOS platform */
.android-simulator     /* Android platform */
.web-simulator         /* Web platform */
.desktop-simulator     /* Desktop platform */
.simulator-status-bar  /* Mobile status bar */
.simulator-content     /* Content area */
```

### CSS Custom Properties

```css
:root {
  --simulator-primary: #8B5CF6;    /* From config.primaryColor */
  --simulator-secondary: #A78BFA;  /* From config.secondaryColor */
}
```

---

## MockKeyDisplay

Display mock cryptographic keys with copy functionality.

### Import

```typescript
import { MockKeyDisplay } from '@/simulators/shared';
```

### Props

```typescript
interface MockKeyDisplayProps {
  npub: string;
  nsec?: string;
  showCopy?: boolean;
  showQr?: boolean;
  compact?: boolean;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `npub` | `string` | required | Public key (npub format) |
| `nsec` | `string` | - | Private key (nsec format) |
| `showCopy` | `boolean` | `true` | Show copy buttons |
| `showQr` | `boolean` | `false` | Show QR code |
| `compact` | `boolean` | `false` | Compact display mode |

### Usage

#### Basic Usage

```typescript
function LoginScreen() {
  return (
    <MockKeyDisplay 
      npub="npub1DEMO...abc123"
      showCopy={true}
    />
  );
}
```

#### With Private Key

```typescript
function KeyBackup() {
  return (
    <MockKeyDisplay 
      npub="npub1DEMO...abc123"
      nsec="nsec1DEMO...xyz789"
      showCopy={true}
      showQr={true}
    />
  );
}
```

#### Compact Mode

```typescript
function ProfileHeader() {
  return (
    <MockKeyDisplay 
      npub="npub1DEMO...abc123"
      compact={true}
      showCopy={false}
    />
  );
}
```

### Visual Variants

**Full Display:**
- Shows full npub (truncated with expand)
- Shows full nsec (if provided, masked)
- Copy buttons for each key
- Optional QR code

**Compact Display:**
- Shows truncated keys
- Single copy button
- No QR code
- Smaller font size

### Security Notes

- Keys are clearly marked as "DEMO"
- nsec is visually masked by default
- Copy functionality shows confirmation
- All keys are mock/generated, never real

---

## NoteCard

Display a Nostr note/post with engagement actions.

### Import

```typescript
import { NoteCard } from '@/simulators/shared';
```

### Props

```typescript
interface NoteCardProps {
  item: SimulatorFeedItem;
  compact?: boolean;
  showActions?: boolean;
  onLike?: () => void;
  onRepost?: () => void;
  onReply?: () => void;
  onZap?: () => void;
  onShare?: () => void;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `item` | `SimulatorFeedItem` | required | Feed item data |
| `compact` | `boolean` | `false` | Compact mode (no actions) |
| `showActions` | `boolean` | `true` | Show action buttons |
| `onLike` | `() => void` | - | Like callback |
| `onRepost` | `() => void` | - | Repost callback |
| `onReply` | `() => void` | - | Reply callback |
| `onZap` | `() => void` | - | Zap callback |
| `onShare` | `() => void` | - | Share callback |

### Usage

#### Basic Usage

```typescript
function Feed() {
  const { state, likeNote, repostNote } = useSimulator();
  
  return (
    <div>
      {state.feed.map(item => (
        <NoteCard 
          key={item.id}
          item={item}
          onLike={() => likeNote(item.note.id)}
          onRepost={() => repostNote(item.note.id)}
        />
      ))}
    </div>
  );
}
```

#### Compact Mode

```typescript
function ThreadView() {
  return (
    <NoteCard 
      item={thread.root}
      compact={true}
      showActions={false}
    />
  );
}
```

#### With All Actions

```typescript
function InteractiveCard({ item }: { item: SimulatorFeedItem }) {
  const { likeNote, repostNote, zapNote } = useSimulator();
  
  return (
    <NoteCard 
      item={item}
      showActions={true}
      onLike={() => likeNote(item.note.id)}
      onRepost={() => repostNote(item.note.id)}
      onReply={() => openReplyModal(item.note)}
      onZap={() => zapNote(item.note.id, 1000)}
      onShare={() => copyNoteLink(item.note.id)}
    />
  );
}
```

### Structure

```
NoteCard
├── Header
│   ├── Avatar
│   ├── User Info (name, handle, timestamp)
│   └── Menu (optional)
├── Content
│   ├── Text
│   ├── Media (if any)
│   └── Mentions/Hashtags
└── Actions (if not compact)
    ├── Reply (count)
    ├── Repost (count)
    ├── Like (count)
    ├── Zap (count, amount)
    └── Share
```

### Styling

The component uses Tailwind CSS classes:

```css
.note-card           /* Base container */
.note-card-compact   /* Compact variant */
.note-card-header    /* Header section */
.note-card-avatar    /* Avatar image */
.note-card-content   /* Content section */
.note-card-actions   /* Actions bar */
.note-card-action    /* Individual action */
```

### Accessibility

- Proper heading hierarchy
- ARIA labels on action buttons
- Keyboard navigation support
- Focus indicators

---

## UserAvatar

Display user avatar with optional status indicator.

### Import

```typescript
import { UserAvatar } from '@/simulators/shared';
```

### Props

```typescript
interface UserAvatarProps {
  user: SimulatorUser;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  onClick?: () => void;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `user` | `SimulatorUser` | required | User data |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |
| `showStatus` | `boolean` | `false` | Show online status |
| `onClick` | `() => void` | - | Click handler |

### Size Mapping

| Size | Dimensions | Use Case |
|------|------------|----------|
| `xs` | 24x24px | Inline mentions |
| `sm` | 32x32px | Comment lists |
| `md` | 48x48px | Standard posts |
| `lg` | 64x64px | Profile headers |
| `xl` | 96x96px | Profile pages |

### Usage

#### Basic Usage

```typescript
function PostHeader({ author }: { author: SimulatorUser }) {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar user={author} size="md" />
      <span>{author.displayName}</span>
    </div>
  );
}
```

#### With Status

```typescript
function MessageItem({ user }: { user: SimulatorUser }) {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar 
        user={user} 
        size="lg" 
        showStatus={true}
        onClick={() => navigateToProfile(user.pubkey)}
      />
      <div>
        <p>{user.displayName}</p>
        <p className="text-sm text-gray-500">{user.nip05}</p>
      </div>
    </div>
  );
}
```

#### Clickable

```typescript
function Mention({ user }: { user: SimulatorUser }) {
  const { navigateTo } = useSimulator();
  
  return (
    <UserAvatar 
      user={user}
      size="xs"
      onClick={() => navigateTo(SimulatorView.PROFILE)}
    />
  );
}
```

### Visual Features

- **Rounded corners**: Circular avatars
- **Fallback**: Initials if no image
- **Status indicator**: Green dot for online
- **Border**: Optional border ring
- **Hover effect**: Scale on hover

---

## ComposeModal

Modal dialog for composing new posts.

### Import

```typescript
import { ComposeModal } from '@/simulators/shared';
```

### Props

```typescript
interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  replyTo?: MockNote;
  onSubmit: (content: string) => void;
}
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Modal visibility |
| `onClose` | `() => void` | Yes | Close callback |
| `replyTo` | `MockNote` | No | Parent note for replies |
| `onSubmit` | `(content: string) => void` | Yes | Submit callback |

### Usage

#### New Post

```typescript
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { createNote } = useSimulator();
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        New Post
      </button>
      
      <ComposeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(content) => {
          createNote(content);
          setIsOpen(false);
        }}
      />
    </>
  );
}
```

#### Reply to Note

```typescript
function NoteActions({ note }: { note: MockNote }) {
  const [isOpen, setIsOpen] = useState(false);
  const { createReply } = useSimulator();
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Reply
      </button>
      
      <ComposeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        replyTo={note}
        onSubmit={(content) => {
          createReply(note.id, content);
          setIsOpen(false);
        }}
      />
    </>
  );
}
```

### Features

- **Character Counter**: Shows remaining characters
- **Reply Context**: Displays parent note when replying
- **Mentions**: @username support
- **Hashtags**: #topic support
- **Media**: Attachment buttons (simulated)
- **Privacy**: Visibility selector (if supported)
- **Cancel/Save**: Action buttons

### Accessibility

- Focus trap within modal
- ESC key closes modal
- ARIA dialog attributes
- Screen reader announcements

---

## Provider Components

### SimulatorProvider

Context provider for simulator state.

```typescript
import { SimulatorProvider } from '@/simulators/shared';

function App() {
  return (
    <SimulatorProvider config={damusConfig}>
      <DamusSimulator />
    </SimulatorProvider>
  );
}
```

**Props:**
- `children`: React.ReactNode
- `config`: SimulatorConfig
- `initialState?`: Partial<SimulatorState>

### SimulatorContext

Direct access to context (advanced use cases).

```typescript
import { SimulatorContext } from '@/simulators/shared';

function CustomComponent() {
  const context = useContext(SimulatorContext);
  // Access state, dispatch, config directly
}
```

---

## Client-Specific Components

### Damus Components

Located in `/src/simulators/damus/components/`:

```typescript
// TabBar - iOS-style bottom navigation
import { TabBar } from '@/simulators/damus/components/TabBar';

// NoteCard - iOS-styled note card
import { NoteCard } from '@/simulators/damus/components/NoteCard';

// ProfileHeader - iOS profile header
import { ProfileHeader } from '@/simulators/damus/components/ProfileHeader';
```

### Amethyst Components

Located in `/src/simulators/amethyst/components/`:

```typescript
// BottomNav - Material Design navigation
import { BottomNav } from '@/simulators/amethyst/components/BottomNav';

// MaterialCard - Elevated Material card
import { MaterialCard } from '@/simulators/amethyst/components/MaterialCard';

// FloatingActionButton - Material FAB
import { FloatingActionButton } from '@/simulators/amethyst/components/FloatingActionButton';
```

---

## Component Composition

### Building Screens

```typescript
function HomeScreen() {
  const { state, navigateTo, likeNote } = useSimulator();
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold">Home</h1>
      </header>
      
      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {state.feed.map(item => (
          <NoteCard
            key={item.id}
            item={item}
            onLike={() => likeNote(item.note.id)}
            onReply={() => navigateTo(SimulatorView.THREAD)}
          />
        ))}
      </div>
      
      {/* Navigation */}
      <TabBar />
    </div>
  );
}
```

### Custom Card Layout

```typescript
function CustomNoteCard({ item }: { item: SimulatorFeedItem }) {
  return (
    <MaterialCard elevation={2}>
      <div className="flex gap-3">
        <UserAvatar user={item.author} size="md" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold">{item.author.displayName}</span>
            <span className="text-gray-500">@{item.author.username}</span>
          </div>
          <p>{item.note.content}</p>
        </div>
      </div>
    </MaterialCard>
  );
}
```

---

## Styling Guide

### Tailwind Classes

Components use Tailwind CSS utility classes:

```typescript
// Common patterns
className="flex items-center gap-2 p-4 border-b"
className="flex-1 overflow-y-auto"
className="text-sm font-medium text-gray-600"
className="hover:bg-gray-100 transition-colors"
```

### Custom CSS

Platform-specific styles in theme files:

```css
/* damus.theme.css */
.damus-simulator .note-card {
  border-bottom: 1px solid var(--ios-border);
  padding: 12px 16px;
}

/* amethyst.theme.css */
.amethyst-simulator .note-card {
  margin: 8px 16px;
  border-radius: 12px;
  box-shadow: var(--md-sys-elevation-level1);
}
```

### CSS Variables

Access theme variables in components:

```typescript
<div style={{ color: 'var(--simulator-primary)' }}>
  Primary Color Content
</div>
```

---

## Testing Components

### Render with Provider

```typescript
import { render, screen } from '@testing-library/react';
import { SimulatorProvider } from '@/simulators/shared';
import { damusConfig } from '@/simulators/shared/configs';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <SimulatorProvider config={damusConfig}>
      {component}
    </SimulatorProvider>
  );
};

test('NoteCard renders correctly', () => {
  renderWithProvider(
    <NoteCard item={mockFeedItem} />
  );
  
  expect(screen.getByText(mockFeedItem.note.content)).toBeInTheDocument();
});
```

### Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event';

test('NoteCard calls onLike when clicked', async () => {
  const onLike = jest.fn();
  
  renderWithProvider(
    <NoteCard item={mockFeedItem} onLike={onLike} />
  );
  
  const likeButton = screen.getByLabelText('Like');
  await userEvent.click(likeButton);
  
  expect(onLike).toHaveBeenCalled();
});
```

---

## Best Practices

1. **Use shared components**: Leverage NoteCard, UserAvatar, etc.
2. **Pass callbacks**: Always provide action handlers
3. **Handle null states**: User may be null
4. **Use appropriate sizes**: Match size to context
5. **Consider accessibility**: ARIA labels, keyboard nav
6. **Test interactions**: Verify callbacks are called
7. **Follow platform patterns**: Use platform-specific components
8. **Keep components focused**: Single responsibility

## See Also

- [Types API](./types.md) - TypeScript interfaces
- [Hooks API](./hooks.md) - Custom hooks
- [Getting Started](../GETTING_STARTED.md) - Usage guide
- [Architecture](../ARCHITECTURE.md) - System design
