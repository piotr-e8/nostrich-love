# API Reference - Hooks

Complete documentation for custom React hooks in the simulator system.

## Table of Contents

- [useSimulator](#usesimulator) - Main state management hook
- [Selector Hooks](#selector-hooks) - Specialized state selectors
- [Custom Hooks](#custom-hooks) - Additional utility hooks

## useSimulator

The primary hook for accessing simulator state and actions.

### Overview

```typescript
import { useSimulator } from '@/simulators/shared';

function MyComponent() {
  const { state, login, navigateTo, likeNote } = useSimulator();
  // ...
}
```

### Return Value

```typescript
interface SimulatorContextValue {
  // State access
  state: SimulatorState;
  dispatch: Dispatch<SimulatorAction>;
  config: SimulatorConfig;
  
  // Auth actions
  login: (user: SimulatorUser) => void;
  logout: () => void;
  
  // Navigation actions
  navigateTo: (view: SimulatorView) => void;
  goBack: () => void;
  openModal: (modal: SimulatorModal, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  
  // Content actions
  likeNote: (noteId: string) => void;
  unlikeNote: (noteId: string) => void;
  repostNote: (noteId: string) => void;
  unrepostNote: (noteId: string) => void;
  createNote: (content: string, tags?: string[][]) => void;
  createReply: (parentId: string, content: string) => void;
  
  // Social actions
  followUser: (pubkey: string) => void;
  unfollowUser: (pubkey: string) => void;
  muteUser: (pubkey: string) => void;
  unmuteUser: (pubkey: string) => void;
  pinNote: (noteId: string) => void;
  unpinNote: (noteId: string) => void;
  
  // Relay actions
  connectRelay: (url: string) => void;
  disconnectRelay: (url: string) => void;
  
  // Search
  search: (query: string) => void;
  
  // Zap
  zapNote: (noteId: string, amount: number, message?: string) => void;
}
```

### Usage Examples

#### Basic State Access

```typescript
function FeedScreen() {
  const { state } = useSimulator();
  
  return (
    <div>
      <h1>Feed</h1>
      <p>Current view: {state.currentView}</p>
      <p>Logged in: {state.isLoggedIn ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

#### Navigation

```typescript
function Navigation() {
  const { navigateTo, state } = useSimulator();
  
  return (
    <nav>
      <button 
        onClick={() => navigateTo(SimulatorView.HOME)}
        className={state.currentView === SimulatorView.HOME ? 'active' : ''}
      >
        Home
      </button>
      <button onClick={() => navigateTo(SimulatorView.PROFILE)}>
        Profile
      </button>
    </nav>
  );
}
```

#### Note Interactions

```typescript
function NoteActions({ noteId }: { noteId: string }) {
  const { likeNote, repostNote, zapNote } = useSimulator();
  
  return (
    <div className="flex gap-4">
      <button onClick={() => likeNote(noteId)}>
        <HeartIcon />
      </button>
      <button onClick={() => repostNote(noteId)}>
        <RepostIcon />
      </button>
      <button onClick={() => zapNote(noteId, 1000, 'Great post!')}>
        <ZapIcon />
      </button>
    </div>
  );
}
```

#### Social Actions

```typescript
function UserProfile({ user }: { user: SimulatorUser }) {
  const { followUser, unfollowUser, state } = useSimulator();
  const isFollowing = state.following.includes(user.pubkey);
  
  return (
    <div>
      <h2>{user.displayName}</h2>
      <button 
        onClick={() => isFollowing 
          ? unfollowUser(user.pubkey) 
          : followUser(user.pubkey)
        }
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}
```

#### Modal Management

```typescript
function Header() {
  const { openModal, closeModal, state } = useSimulator();
  
  return (
    <header>
      <button onClick={() => openModal(SimulatorModal.COMPOSE)}>
        New Post
      </button>
      
      {state.activeModal === SimulatorModal.COMPOSE && (
        <ComposeModal onClose={closeModal} />
      )}
    </header>
  );
}
```

#### Relay Management

```typescript
function RelaySettings() {
  const { connectRelay, disconnectRelay, state } = useSimulator();
  
  return (
    <div>
      {Object.values(state.relayConfigs).map(relay => (
        <div key={relay.url}>
          <span>{relay.url}</span>
          <button 
            onClick={() => relay.isConnected 
              ? disconnectRelay(relay.url) 
              : connectRelay(relay.url)
            }
          >
            {relay.isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

#### Login/Logout

```typescript
function AuthButton() {
  const { login, logout, state } = useSimulator();
  
  if (state.isLoggedIn) {
    return (
      <button onClick={logout}>
        Logout ({state.currentUser?.displayName})
      </button>
    );
  }
  
  return (
    <button onClick={() => login(mockUser)}>
      Login
    </button>
  );
}
```

### Error Handling

The hook throws an error if used outside of SimulatorProvider:

```typescript
function MyComponent() {
  try {
    const { state } = useSimulator();
    // ...
  } catch (error) {
    console.error('useSimulator must be used within SimulatorProvider');
    return null;
  }
}
```

Always wrap components in SimulatorProvider:

```typescript
<SimulatorProvider config={damusConfig}>
  <DamusSimulator />
</SimulatorProvider>
```

---

## Selector Hooks

Optimized hooks for selecting specific state slices.

### useSimulatorState

Get the complete state object.

```typescript
import { useSimulatorState } from '@/simulators/shared';

function Feed() {
  const state = useSimulatorState();
  return <div>{state.feed.length} items</div>;
}
```

### useCurrentUser

Get the currently logged-in user.

```typescript
import { useCurrentUser } from '@/simulators/shared';

function ProfileLink() {
  const user = useCurrentUser();
  
  if (!user) return <span>Not logged in</span>;
  
  return <span>Hello, {user.displayName}</span>;
}
```

**Returns:** `SimulatorUser | null`

### useIsLoggedIn

Check if user is logged in.

```typescript
import { useIsLoggedIn } from '@/simulators/shared';

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useIsLoggedIn();
  
  if (!isLoggedIn) {
    return <LoginPrompt />;
  }
  
  return <>{children}</>;
}
```

**Returns:** `boolean`

### useCurrentView

Get the current navigation view.

```typescript
import { useCurrentView, SimulatorView } from '@/simulators/shared';

function TabBar() {
  const currentView = useCurrentView();
  
  return (
    <nav>
      <Tab 
        active={currentView === SimulatorView.HOME}
        icon={<HomeIcon />}
      />
      <Tab 
        active={currentView === SimulatorView.PROFILE}
        icon={<ProfileIcon />}
      />
    </nav>
  );
}
```

**Returns:** `SimulatorView`

### useActiveModal

Get the currently active modal.

```typescript
import { useActiveModal, SimulatorModal } from '@/simulators/shared';

function ModalManager() {
  const activeModal = useActiveModal();
  
  switch (activeModal) {
    case SimulatorModal.COMPOSE:
      return <ComposeModal />;
    case SimulatorModal.SETTINGS:
      return <SettingsModal />;
    default:
      return null;
  }
}
```

**Returns:** `SimulatorModal`

### useFeed

Get the current feed items.

```typescript
import { useFeed } from '@/simulators/shared';

function FeedList() {
  const feed = useFeed();
  
  return (
    <div>
      {feed.map(item => (
        <NoteCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

**Returns:** `SimulatorFeedItem[]`

### useNotifications

Get all notifications.

```typescript
import { useNotifications } from '@/simulators/shared';

function NotificationList() {
  const notifications = useNotifications();
  
  return (
    <div>
      {notifications.map(notif => (
        <NotificationCard key={notif.id} notification={notif} />
      ))}
    </div>
  );
}
```

**Returns:** `SimulatorNotification[]`

### useUnreadNotificationsCount

Get count of unread notifications.

```typescript
import { useUnreadNotificationsCount } from '@/simulators/shared';

function NotificationBadge() {
  const count = useUnreadNotificationsCount();
  
  return count > 0 ? (
    <span className="badge">{count}</span>
  ) : null;
}
```

**Returns:** `number`

### useFollowing

Get list of pubkeys the user follows.

```typescript
import { useFollowing } from '@/simulators/shared';

function FollowingCount() {
  const following = useFollowing();
  return <span>Following: {following.length}</span>;
}
```

**Returns:** `string[]` (pubkeys)

### useConnectedRelays

Get list of connected relay URLs.

```typescript
import { useConnectedRelays } from '@/simulators/shared';

function RelayStatus() {
  const relays = useConnectedRelays();
  
  return (
    <div>
      <span>Connected to {relays.length} relays</span>
    </div>
  );
}
```

**Returns:** `string[]` (relay URLs)

### useIsLoading

Check if simulator is in loading state.

```typescript
import { useIsLoading } from '@/simulators/shared';

function Feed() {
  const isLoading = useIsLoading();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return <FeedContent />;
}
```

**Returns:** `boolean`

### useSimulatorError

Get current error message.

```typescript
import { useSimulatorError } from '@/simulators/shared';

function ErrorDisplay() {
  const error = useSimulatorError();
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return null;
}
```

**Returns:** `string | null`

---

## Custom Hooks

Additional utility hooks for common patterns.

### useMockKeys

Generate and manage mock cryptographic keys.

```typescript
import { useMockKeys } from '@/simulators/shared/utils';

function KeyGenerator() {
  const { keys, generateKeys, copyToClipboard } = useMockKeys();
  
  return (
    <div>
      <button onClick={generateKeys}>Generate Keys</button>
      {keys && (
        <div>
          <p>Public: {keys.npub}</p>
          <button onClick={() => copyToClipboard(keys.npub)}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
```

### useMockFeed

Generate realistic mock feed data.

```typescript
import { useMockFeed } from '@/simulators/shared/utils';

function Feed() {
  const { feed, refreshFeed, loadMore } = useMockFeed({
    count: 20,
    includeReposts: true,
    includeReplies: false,
  });
  
  return (
    <div>
      <button onClick={refreshFeed}>Refresh</button>
      {feed.map(item => <NoteCard key={item.id} item={item} />)}
      <button onClick={loadMore}>Load More</button>
    </div>
  );
}
```

**Options:**
- `count`: Number of items to generate
- `includeReposts`: Include reposted content
- `includeReplies`: Include reply notes
- `randomize`: Randomize content selection

### useFormattedTime

Format timestamps for display.

```typescript
import { useFormattedTime } from '@/simulators/shared/utils';

function Timestamp({ time }: { time: number }) {
  const formatted = useFormattedTime(time);
  return <span>{formatted}</span>; // "2 hours ago"
}
```

### useSearch

Search functionality with debouncing.

```typescript
import { useSearch } from '@/simulators/shared/utils';

function SearchBar() {
  const { query, results, setQuery, isSearching } = useSearch({
    debounceMs: 300,
  });
  
  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {isSearching && <Spinner />}
      {results && <SearchResults results={results} />}
    </div>
  );
}
```

### useFeatureFlags

Check feature support for current client.

```typescript
import { useFeatureFlags } from '@/simulators/shared/utils';
import { SimulatorFeature } from '@/simulators/shared';

function FeatureDemo() {
  const { hasFeature } = useFeatureFlags();
  
  return (
    <div>
      {hasFeature(SimulatorFeature.ZAPS) && <ZapButton />}
      {hasFeature(SimulatorFeature.LONG_FORM) && <ArticlesTab />}
    </div>
  );
}
```

---

## Hook Patterns

### Combining Hooks

```typescript
function UserProfile({ pubkey }: { pubkey: string }) {
  const { followUser, unfollowUser } = useSimulator();
  const currentUser = useCurrentUser();
  const following = useFollowing();
  const user = useUserByPubkey(pubkey); // Custom hook
  
  const isFollowing = following.includes(pubkey);
  const isSelf = currentUser?.pubkey === pubkey;
  
  if (!user) return <NotFound />;
  
  return (
    <div>
      <h1>{user.displayName}</h1>
      {!isSelf && (
        <button onClick={() => isFollowing ? unfollowUser(pubkey) : followUser(pubkey)}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  );
}
```

### Conditional Hook Usage

```typescript
function ConditionalComponent({ showFeed }: { showFeed: boolean }) {
  // Only call useFeed when needed
  const feed = showFeed ? useFeed() : [];
  
  return showFeed ? <FeedList feed={feed} /> : null;
}
```

### Performance Optimization

```typescript
import { useMemo } from 'react';

function OptimizedFeed() {
  const feed = useFeed();
  const currentUser = useCurrentUser();
  
  // Memoize expensive computation
  const sortedFeed = useMemo(() => {
    return [...feed].sort((a, b) => b.timestamp - a.timestamp);
  }, [feed]);
  
  return <FeedList feed={sortedFeed} />;
}
```

---

## Testing Hooks

### Mocking useSimulator

```typescript
import { renderHook } from '@testing-library/react';
import { SimulatorProvider } from '@/simulators/shared';
import { damusConfig } from '@/simulators/shared/configs';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SimulatorProvider config={damusConfig}>
    {children}
  </SimulatorProvider>
);

const { result } = renderHook(() => useSimulator(), { wrapper });
```

### Testing State Changes

```typescript
import { act } from '@testing-library/react';

it('should update state on like', () => {
  const { result } = renderHook(() => useSimulator(), { wrapper });
  
  act(() => {
    result.current.likeNote('note-123');
  });
  
  expect(result.current.state.feed[0].note.likes).toBe(1);
});
```

---

## Best Practices

1. **Use selector hooks for specific state**: Better performance than accessing full state
2. **Don't use useSimulator for everything**: Use specialized hooks when available
3. **Wrap in SimulatorProvider**: Always provide context before using hooks
4. **Handle null states**: currentUser can be null when not logged in
5. **Memoize expensive computations**: Use useMemo with feed data
6. **Test with proper wrappers**: Always wrap tests in SimulatorProvider

## TypeScript Tips

### Type Inference

```typescript
// TypeScript infers correct types
const { state, likeNote } = useSimulator();
// state: SimulatorState
// likeNote: (noteId: string) => void
```

### Generic Constraints

```typescript
function useSimulatorWithConfig<T extends SimulatorConfig>(config: T) {
  return useSimulator();
}
```

### Return Type Destructuring

```typescript
const {
  state,
  navigateTo,
  ...actions
}: SimulatorContextValue = useSimulator();
```

## See Also

- [Types API](./types.md) - TypeScript interfaces
- [Components API](./components.md) - Component props
- [Getting Started](../GETTING_STARTED.md) - Usage guide
