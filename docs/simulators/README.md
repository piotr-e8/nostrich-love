# Nostr Client Simulators Documentation

## Overview

The Nostr Client Simulators are interactive, educational demonstrations of popular Nostr clients. These simulators provide a risk-free environment for users to learn how different Nostr clients work without requiring real keys or protocol connections.

## What Are Simulators?

Simulators are **visual demonstrations only** - they simulate the user interface and experience of real Nostr clients using mock data. No real Nostr protocol connections are made, and no cryptographic operations are performed.

### Key Characteristics

- **Educational**: Learn Nostr client interfaces before using real apps
- **Safe**: No real keys, no real connections, no risk
- **Interactive**: Clickable buttons, navigable screens, realistic flows
- **Realistic**: Uses authentic client designs and mock data
- **Session-only**: No data persistence between sessions

## Supported Clients

| Client | Platform | Status | Features |
|--------|----------|--------|----------|
| **Damus** | iOS | Complete | 9/9 features |
| **Amethyst** | Android | Complete | 10/10 features |
| **Primal** | Web | Planned | 10/10 features |
| **Snort** | Web | Planned | 8/8 features |
| **YakiHonne** | iOS | Planned | 9/9 features |
| **Coracle** | Desktop | Planned | 10/10 features |
| **Gossip** | Desktop | Planned | 8/8 features |

## Quick Start

### For Users

1. Navigate to `/simulators` to see all available simulators
2. Click on any client to launch its simulator
3. Explore the interface - all buttons are interactive
4. Try common actions: like posts, view profiles, compose notes

### For Developers

```typescript
import { DamusSimulator } from '@/simulators/damus';

function MyComponent() {
  return <DamusSimulator />;
}
```

## Documentation Structure

```
/docs/simulators/
├── README.md                    # This file
├── ARCHITECTURE.md              # Technical architecture
├── GETTING_STARTED.md           # How to add new simulators
├── TROUBLESHOOTING.md           # Common issues
├── FAQ.md                       # Frequently asked questions
├── CONTRIBUTING.md              # How to contribute
├── STYLE_GUIDE.md               # Coding standards
├── /damus                       # Damus client documentation
├── /amethyst                    # Amethyst client documentation
├── /primal                      # Primal client documentation
├── /snort                       # Snort client documentation
├── /yakihonne                   # YakiHonne client documentation
├── /coracle                     # Coracle client documentation
├── /gossip                      # Gossip client documentation
└── /api                         # API reference
    ├── types.md                 # TypeScript interfaces
    ├── hooks.md                 # Custom hooks
    └── components.md            # Component props
```

## Features by Client

### Universal Features (All Clients)

1. **Feed View** - Browse posts from followed users
2. **Profile View** - View user profiles with stats
3. **Compose** - Create new posts (simulated)
4. **Like/Repost** - Engagement actions
5. **Navigation** - Tab-based or sidebar navigation

### Feature Matrix

| Feature | Damus | Amethyst | Primal | Snort | YakiHonne | Coracle | Gossip |
|---------|-------|----------|--------|-------|-----------|---------|--------|
| Direct Messages | | | | | | | |
| Zaps | | | | | | | |
| Threads/Replies | | | | | | | |
| Search | | | | | | | |
| Relay Management | | | | | | | |
| Badges | | | | | | | |
| NIP-05 Identity | | | | | | | |
| Long-form Content | | | | | | | |
| Live Streaming | | | | | | | |
| Marketplace | | | | | | | |
| Mute Lists | | | | | | | |
| Pinned Notes | | | | | | | |

**Legend:** - Complete  - Planned

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- 1024x768 minimum resolution
- Touch support for mobile simulators (optional)

## Browser Compatibility

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | Full | Full |
| Firefox | Full | Full |
| Safari | Full | Full |
| Edge | Full | Full |

## Performance

- First load: ~200KB (compressed)
- Subsequent loads: Cached
- Simulator initialization: <100ms
- Memory usage: ~50MB per active simulator

## Limitations

1. **No Real Data**: All content is mock/generated
2. **No Persistence**: Session-only, data lost on refresh
3. **No Network**: No actual Nostr protocol connections
4. **Simplified Logic**: Some complex features are simplified
5. **Visual Only**: Some actions just log to console

## Use Cases

- **Onboarding**: Teach new users before they install real clients
- **Comparison**: Compare different client interfaces side-by-side
- **Documentation**: Screenshots and demonstrations for guides
- **Testing**: UI/UX testing without real Nostr accounts
- **Education**: Workshops and tutorials

## Getting Help

- **Issues**: Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Questions**: See [FAQ.md](./FAQ.md)
- **Contributing**: Read [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

These simulators are part of the Nostr Beginner Guide project. See the main project LICENSE file for details.

## Acknowledgments

Simulator designs are based on the actual Nostr clients:
- [Damus](https://damus.io) by William Casarin
- [Amethyst](https://github.com/vitorpamplona/amethyst) by Vitor Pamplona
- [Primal](https://primal.net) by Primal Team
- [Snort](https://snort.social) by Kieran
- [YakiHonne](https://yakihonne.com) by YakiHonne Team
- [Coracle](https://coracle.social) by Coracle Team
- [Gossip](https://github.com/mikedilger/gossip) by Mike Dilger

Thank you to all the client developers for creating these amazing tools for the Nostr ecosystem!
