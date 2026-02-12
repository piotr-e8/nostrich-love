# Damus Simulator

A visual simulation of the Damus iOS Nostr client for educational purposes.

## Overview

This simulator provides an interactive UI demonstration of how the Damus iOS app looks and feels. It uses mock data to simulate the Nostr experience without requiring real protocol connections.

## Features

### Screens
- **LoginScreen** - Welcome screen with key entry and generation
- **HomeScreen** - Main feed with pull-to-refresh and filter tabs
- **ProfileScreen** - User profiles with stats, bio, and posts
- **ComposeScreen** - Post creation with character counter
- **SettingsScreen** - Relay management and app preferences

### Components
- **TabBar** - iOS-style bottom navigation with FAB
- **NoteCard** - Individual post display with engagement actions
- **ProfileHeader** - Profile banner, avatar, and stats

## Visual Style

- **Color**: Purple accent (#8B5CF6)
- **Design**: iOS minimal, Twitter-like
- **Typography**: System fonts (San Francisco style)
- **Layout**: Mobile-first, responsive to desktop

## Usage

```tsx
import { DamusSimulator } from './simulators/damus';

function App() {
  return <DamusSimulator />;
}
```

## Data

Uses mock data from `/src/data/mock/`:
- 55 mock users
- 200+ mock posts
- Realistic Nostr content

## Interactions

All buttons are clickable and log actions to console:
- Like, Repost, Zap posts
- Follow/Unfollow users
- Navigate between screens
- Toggle settings

## Development

### File Structure
```
/src/simulators/damus/
├── DamusSimulator.tsx    # Main container with state
├── damus.theme.css       # iOS-style theme variables
├── index.ts              # Exports
├── screens/
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── ComposeScreen.tsx
│   └── SettingsScreen.tsx
└── components/
    ├── TabBar.tsx
    ├── NoteCard.tsx
    └── ProfileHeader.tsx
```

### State Management
The simulator uses React useState for simple state management:
- Current user
- Active screen
- UI preferences

### Future Enhancements
- [ ] Animation transitions
- [ ] Image gallery viewer
- [ ] Thread/reply view
- [ ] Dark mode support
- [ ] Search functionality
- [ ] DM simulation

## Notes

- This is a **visual simulation only** - no real Nostr protocol
- Mock data refreshes on page reload
- All keys shown are generated for demo purposes
- Perfect for educational demos and UI testing
