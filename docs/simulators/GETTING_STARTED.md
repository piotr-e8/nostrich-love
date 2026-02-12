# Getting Started with Simulators

This guide walks you through creating a new Nostr client simulator from scratch.

## Prerequisites

- Familiarity with React and TypeScript
- Understanding of the target Nostr client's UI
- Access to the target client for reference screenshots

## Overview

Creating a new simulator involves:

1. **Setup**: Create directory structure
2. **Configuration**: Define client config
3. **Screens**: Implement main screens
4. **Components**: Build reusable components
5. **Theme**: Create platform-specific styles
6. **Integration**: Connect to the system
7. **Testing**: Verify functionality

## Step-by-Step Guide

### Step 1: Create Directory Structure

Create a new directory for your client:

```bash
mkdir -p /src/simulators/{clientname}/{screens,components}
touch /src/simulators/{clientname}/index.ts
touch /src/simulators/{clientname}/{clientname}.theme.css
```

Replace `{clientname}` with your client's name (lowercase, no spaces).

### Step 2: Define Configuration

Add your client configuration to `/src/simulators/shared/configs.ts`:

```typescript
export const clientnameConfig: SimulatorConfig = {
  id: SimulatorClient.CLIENTNAME,
  name: 'ClientName',
  description: 'Description of the client',
  platform: 'ios' | 'android' | 'web' | 'desktop',
  primaryColor: '#HEXCODE',
  secondaryColor: '#HEXCODE',
  icon: '/icons/clientname.png',
  supportedFeatures: [
    SimulatorFeature.DM,
    SimulatorFeature.ZAPS,
    // Add other supported features
  ],
  defaultView: SimulatorView.FEED,
};
```

Add to `allSimulatorConfigs`:

```typescript
export const allSimulatorConfigs: Record<SimulatorClient, SimulatorConfig> = {
  [SimulatorClient.DAMUS]: damusConfig,
  [SimulatorClient.AMETHYST]: amethystConfig,
  // ... other configs
  [SimulatorClient.CLIENTNAME]: clientnameConfig,
};
```

Add to `SimulatorClient` enum in `/src/simulators/shared/types/index.ts`:

```typescript
export enum SimulatorClient {
  DAMUS = 'damus',
  AMETHYST = 'amethyst',
  // ... other clients
  CLIENTNAME = 'clientname',
}
```

### Step 3: Create Main Simulator Component

Create `/src/simulators/{clientname}/{ClientName}Simulator.tsx`:

```typescript
import React from 'react';
import { 
  SimulatorProvider, 
  useSimulator,
  SimulatorShell,
  clientnameConfig,
  SimulatorView 
} from '../shared';
import { HomeScreen } from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ComposeScreen } from './screens/ComposeScreen';
// Import other screens

function ClientSimulatorContent() {
  const { state } = useSimulator();
  
  // Render appropriate screen based on current view
  switch (state.currentView) {
    case SimulatorView.HOME:
    case SimulatorView.FEED:
      return <HomeScreen />;
    case SimulatorView.PROFILE:
      return <ProfileScreen />;
    case SimulatorView.COMPOSE:
      return <ComposeScreen />;
    // Add other views
    default:
      return <HomeScreen />;
  }
}

export function ClientNameSimulator() {
  return (
    <SimulatorProvider config={clientnameConfig}>
      <SimulatorShell config={clientnameConfig}>
        <ClientSimulatorContent />
      </SimulatorShell>
    </SimulatorProvider>
  );
}

export default ClientNameSimulator;
```

### Step 4: Implement Screens

Create screen components in `/src/simulators/{clientname}/screens/`.

**HomeScreen.tsx**:

```typescript
import React from 'react';
import { useSimulator, useFeed } from '../../shared';
import { mockNotes, mockUsers } from '../../../data/mock';

export function HomeScreen() {
  const { navigateTo, likeNote } = useSimulator();
  const feed = useFeed();
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold">Home</h1>
      </header>
      
      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {feed.map(item => (
          <div key={item.id} className="p-4 border-b">
            {/* Note content */}
            <p>{item.note.content}</p>
            
            {/* Actions */}
            <div className="flex gap-4 mt-2">
              <button onClick={() => likeNote(item.note.id)}>
                Like
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 5: Create Platform-Specific Components

Create reusable components in `/src/simulators/{clientname}/components/`.

**Example - CustomNavigation.tsx**:

```typescript
import React from 'react';
import { useSimulator, SimulatorView } from '../../shared';

export function CustomNavigation() {
  const { state, navigateTo } = useSimulator();
  
  const tabs = [
    { view: SimulatorView.HOME, label: 'Home', icon: 'home' },
    { view: SimulatorView.SEARCH, label: 'Search', icon: 'search' },
    { view: SimulatorView.PROFILE, label: 'Profile', icon: 'user' },
  ];
  
  return (
    <nav className="flex justify-around p-4 border-t">
      {tabs.map(tab => (
        <button
          key={tab.view}
          onClick={() => navigateTo(tab.view)}
          className={state.currentView === tab.view ? 'active' : ''}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
```

### Step 6: Create Theme Styles

Create `/src/simulators/{clientname}/{clientname}.theme.css`:

```css
/* Platform-specific styles */
.clientname-simulator {
  /* Primary colors */
  --client-primary: #HEXCODE;
  --client-secondary: #HEXCODE;
  
  /* Background colors */
  --client-bg: #ffffff;
  --client-card-bg: #f5f5f5;
  --client-border: #e0e0e0;
  
  /* Text colors */
  --client-text: #000000;
  --client-text-muted: #666666;
  
  /* Font */
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Platform-specific overrides */
.clientname-simulator.ios {
  /* iOS-specific styles */
}

.clientname-simulator.android {
  /* Android-specific styles */
}

.clientname-simulator.dark {
  /* Dark mode styles */
  --client-bg: #000000;
  --client-card-bg: #1c1c1e;
  --client-text: #ffffff;
}
```

Import the theme in your main component:

```typescript
import './clientname.theme.css';
```

### Step 7: Create Index Export

Create `/src/simulators/{clientname}/index.ts`:

```typescript
export { ClientNameSimulator } from './ClientNameSimulator';
export { HomeScreen } from './screens/HomeScreen';
export { ProfileScreen } from './screens/ProfileScreen';
// Export other screens and components
```

### Step 8: Add to Main Simulator Index

Update `/src/simulators/index.ts`:

```typescript
export { DamusSimulator } from './damus';
export { AmethystSimulator } from './amethyst';
export { ClientNameSimulator } from './clientname';
// Export other simulators
```

### Step 9: Create Page

Create `/src/pages/simulators/{clientname}.astro`:

```astro
---
import Layout from '../../layouts/Layout.astro';
import { ClientNameSimulator } from '../../simulators/clientname';
---

<Layout title="ClientName Simulator">
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">ClientName Simulator</h1>
    
    <div class="simulator-container">
      <ClientNameSimulator client:only="react" />
    </div>
    
    <div class="mt-8 prose dark:prose-invert max-w-none">
      <h2>About ClientName</h2>
      <p>Description of the client...</p>
      
      <h2>Features</h2>
      <ul>
        <li>Feature 1</li>
        <li>Feature 2</li>
      </ul>
    </div>
  </div>
</Layout>

<style>
  .simulator-container {
    height: 800px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }
</style>
```

### Step 10: Test Your Simulator

1. Start the development server: `npm run dev`
2. Navigate to `/simulators/{clientname}`
3. Test all screens and interactions
4. Verify styling matches the real client
5. Check console for errors

## Best Practices

### Do's

- Use the shared `useSimulator` hook for state management
- Follow the platform's design system (iOS HIG, Material Design, etc.)
- Use mock data from `/src/data/mock/`
- Keep components focused and reusable
- Use TypeScript for type safety
- Test all interactive elements

### Don'ts

- Don't make real network requests
- Don't use real cryptographic operations
- Don't persist data between sessions
- Don't copy proprietary assets from real clients
- Don't implement features not in the real client

## Common Patterns

### Screen with Navigation

```typescript
function ScreenWithNav({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <header>{/* Header content */}</header>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <CustomNavigation />
    </div>
  );
}
```

### Modal Handling

```typescript
function HomeScreen() {
  const { state, openModal, closeModal } = useSimulator();
  
  return (
    <div>
      <button onClick={() => openModal(SimulatorModal.COMPOSE)}>
        New Post
      </button>
      
      {state.activeModal === SimulatorModal.COMPOSE && (
        <ComposeModal onClose={closeModal} />
      )}
    </div>
  );
}
```

### Using Mock Data

```typescript
import { mockUsers, mockNotes } from '../../../data/mock';

function ProfileScreen() {
  const { state } = useSimulator();
  const user = mockUsers[0]; // Or find by pubkey
  const userNotes = mockNotes.filter(n => n.pubkey === user.pubkey);
  
  return (
    <div>
      <h1>{user.displayName}</h1>
      {userNotes.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
```

## Troubleshooting

### State Not Updating

- Ensure component is wrapped in `SimulatorProvider`
- Check that you're using the `useSimulator` hook correctly
- Verify action types match the reducer

### Styles Not Applying

- Check CSS file is imported in the main component
- Verify class names match the theme file
- Check for CSS specificity issues

### Navigation Not Working

- Ensure `navigateTo` is called with valid `SimulatorView` value
- Check that screen is rendering based on `state.currentView`
- Verify navigation component is included in the layout

## Example: Minimal Simulator

Here's a minimal complete simulator:

```typescript
// /src/simulators/minimal/MinimalSimulator.tsx
import React from 'react';
import { 
  SimulatorProvider, 
  useSimulator,
  SimulatorShell,
  SimulatorView 
} from '../shared';

const minimalConfig = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Minimal example',
  platform: 'web',
  primaryColor: '#3B82F6',
  secondaryColor: '#60A5FA',
  supportedFeatures: [],
  defaultView: SimulatorView.FEED,
} as const;

function MinimalContent() {
  const { state, navigateTo } = useSimulator();
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Minimal Simulator</h1>
      <p>Current view: {state.currentView}</p>
      <button 
        onClick={() => navigateTo(SimulatorView.PROFILE)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go to Profile
      </button>
    </div>
  );
}

export function MinimalSimulator() {
  return (
    <SimulatorProvider config={minimalConfig}>
      <SimulatorShell config={minimalConfig}>
        <MinimalContent />
      </SimulatorShell>
    </SimulatorProvider>
  );
}
```

## Next Steps

- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for deep technical details
- Check existing simulators (Damus, Amethyst) for reference
- Add your simulator to the gallery page
- Write tests for your simulator
- Document client-specific features

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- Target client's official documentation
