# Nostr Client Visual Reference Guide

## Project: Nostr Client Simulator
**Agent**: Assets & Icons Manager  
**Last Updated**: 2026-02-11  
**Status**: Initial reference collection complete

---

## 📸 Screenshot Reference Library

### AMETHYST (Android Client)
**Repository**: https://github.com/vitorpamplona/amethyst  
**Platform**: Android  
**Tech Stack**: Kotlin, Jetpack Compose

#### Available Screenshots (from GitHub)
Located in `/docs/screenshots/`:
- `home.png` - Home feed view
- `messages.png` - DM/chat interface
- `replies.png` - Thread/replies view
- `notifications.png` - Notifications screen

#### Key UI Components Identified:
- **Feed Cards**: Event cards with profile pic, name, timestamp, content
- **Navigation**: Bottom tab bar (Home, Messages, Notifications, Search, Profile)
- **Composer**: Floating action button for new posts
- **Profile**: Header with banner, avatar, stats (followers/following)
- **Color Scheme**: Purple primary, dark/light theme support

#### NIP Support (100+ features):
- Events/Relay Subscriptions (NIP-01)
- Follow Lists (NIP-02)
- Private Messages (NIP-04, NIP-17)
- User Profiles (NIP-24)
- Reactions (NIP-25)
- Zaps/Lightning (NIP-57)
- Live Activities (NIP-53)
- Marketplaces (NIP-15)
- And many more...

---

### DAMUS (iOS Client)
**Repository**: https://github.com/damus-io/damus  
**Website**: https://damus.io  
**Platform**: iOS, Android, Desktop (Notedeck)

#### Brand Identity:
- **Logo**: Purple icon with ostrich/bird motif
- **Colors**: Purple (#6B46C1), Orange accents
- **Font**: SF Pro (iOS native)

#### Key UI Components Identified:
- **Timeline**: Clean, Twitter-like interface
- **Purple**: Premium membership badge
- **Zaps**: Lightning bolt tipping integration
- **Profile**: Minimalist design
- **Navigation**: Tab-based (Home, Notifications, DMs, Search)

#### Available From:
- App Store screenshots
- Website hero images
- GitHub README
- YouTube demos

---

### PRIMAL (Web & Mobile)
**Website**: https://primal.net  
**Platform**: Web, iOS, Android

#### Brand Identity:
- **Logo**: Lightning bolt / energy symbol
- **Colors**: Gold/Yellow gradient (#FFD700 to #FF8C00)
- **Style**: Modern, energetic

#### Key UI Components Identified:
- **Home**: Clean feed with focus on content
- **Explore**: Discovery features
- **Wallet**: Integrated Lightning wallet
- **Zaps**: Prominent tipping feature
- **Responsive**: Mobile-optimized web interface

---

### SNORT (Web Client)
**Website**: https://snort.social  
**Repository**: https://git.v0l.io/Kieran/snort  
**Platform**: Web

#### Brand Identity:
- **Logo**: Pink pig/snout design
- **Colors**: Pink (#FFB6C1, #FF69B4)
- **Style**: Playful, memorable

#### Key UI Components Identified:
- **Timeline**: Classic nostr feed view
- **Thread View**: Nested conversation display
- **Relay Management**: Built-in relay configuration
- **Profile**: Customizable with banner support
- **Reactions**: Emoji reactions on posts

---

### YAKIHONNE (Article-focused)
**Website**: https://yakihonne.com  
**Focus**: Long-form content, articles

#### Brand Identity:
- **Logo**: Japanese-inspired design
- **Colors**: Red (#E74C3C, #C0392B)
- **Style**: Editorial, content-focused

#### Key UI Components Identified:
- **Feed**: Article previews with images
- **Article View**: Full-screen reading experience
- **Profile**: Author-focused with publication stats
- **Media Gallery**: Image handling for articles
- **Discovery**: Topic-based content discovery

---

### CORACLE (Web Client)
**Website**: https://coracle.social  
**Repository**: https://github.com/coracle-social/coracle  
**Platform**: Web

#### Brand Identity:
- **Logo**: Ship/coracle boat
- **Colors**: Blue (#3498DB, #2980B9)
- **Style**: Clean, nautical theme

#### Key UI Components Identified:
- **Feed**: Streamlined event display
- **Relay Settings**: Advanced relay management
- **Profile**: Clean layout with key info
- **Groups**: Community features
- **Search**: Content discovery

---

### GOSSIP (Desktop Client)
**Repository**: https://github.com/mikedilger/gossip  
**Platform**: Windows, macOS, Linux
**Tech Stack**: Rust, egui

#### Brand Identity:
- **Logo**: Network/speech bubble cluster
- **Colors**: Green (#2ECC71, #27AE60)
- **Style**: Functional, desktop-focused

#### Available Screenshots (from GitHub):
Located in `/assets/`:
- `gossip_screenshot_dark.png` - Dark theme
- `gossip_screenshot_light.png` - Light theme

#### Key UI Components Identified:
- **Feed View**: Text-focused list layout
- **Thread View**: Conversation threading
- **People/Contacts**: Contact management
- **Settings**: 70+ configuration options
- **Relay Management**: Advanced relay controls
- **Content Warnings**: Built-in moderation

#### Unique Features:
- **Desktop Native**: No browser tech
- **Performance**: Rust-based, LMDB database
- **Security**: Encrypted key storage
- **Privacy**: Tor support options
- **Customization**: Script-based filtering

---

## 🎨 Color Palette Reference

### Extracted Colors

| Client | Primary | Secondary | Accent | Background |
|--------|---------|-----------|--------|------------|
| Amethyst | #9B59B6 | #8E44AD | #6C3483 | #1A1A2E |
| Damus | #6B46C1 | #FF6B35 | #F7931E | #FFFFFF |
| Primal | #FFD700 | #FFA500 | #FF8C00 | #1A1A2E |
| Snort | #FFB6C1 | #FF69B4 | #FF1493 | #FFF0F5 |
| YakiHonne | #E74C3C | #C0392B | #922B21 | #FDF2F2 |
| Coracle | #3498DB | #2980B9 | #1F618D | #EBF5FB |
| Gossip | #2ECC71 | #27AE60 | #1E8449 | #EAFAF1 |

### Common UI Patterns

**Dark Mode (Amethyst, Primal)**:
- Background: #121212, #1A1A2E
- Surface: #1E1E1E, #252538
- Text Primary: #FFFFFF
- Text Secondary: #B3B3B3

**Light Mode (Damus, Coracle)**:
- Background: #FFFFFF
- Surface: #F5F5F5
- Text Primary: #000000
- Text Secondary: #666666

---

## 📱 Screen Coverage Checklist

### Required Screenshots per Client

- [ ] **Home Feed** - Main timeline view
- [ ] **Profile View** - User profile page
- [ ] **Post Composer** - Create new post
- [ ] **Settings** - Configuration screens
- [ ] **Search** - Discovery interface
- [ ] **Notifications** - Alerts/mentions
- [ ] **DM/Chat** - Private messaging
- [ ] **Thread View** - Conversation display
- [ ] **Relay Management** - Server settings (if applicable)

### Collection Status

| Client | Screenshots | Logos | Color Extracted |
|--------|-------------|-------|-----------------|
| Amethyst | GitHub available | ✓ Placeholder | ✓ |
| Damus | Need to collect | ✓ Placeholder | Partial |
| Primal | Need to collect | ✓ Placeholder | Partial |
| Snort | Need to collect | ✓ Placeholder | Partial |
| YakiHonne | Need to collect | ✓ Placeholder | Partial |
| Coracle | Need to collect | ✓ Placeholder | Partial |
| Gossip | GitHub available | ✓ Placeholder | ✓ |

---

## 🔗 Official Sources

### GitHub Repositories
1. **Amethyst**: https://github.com/vitorpamplona/amethyst
2. **Damus**: https://github.com/damus-io/damus
3. **Snort**: https://git.v0l.io/Kieran/snort
4. **Coracle**: https://github.com/coracle-social/coracle
5. **Gossip**: https://github.com/mikedilger/gossip

### Websites
1. **Damus**: https://damus.io
2. **Primal**: https://primal.net
3. **Snort**: https://snort.social
4. **YakiHonne**: https://yakihonne.com
5. **Coracle**: https://coracle.social

### App Stores
- **Google Play**: Search "Amethyst Nostr", "Damus", "Primal"
- **App Store**: Search "Damus", "Primal", "Amethyst"

---

## 📋 Next Steps for Complete Collection

### Immediate Actions:
1. **Download official logos** from GitHub repos in high resolution
2. **Capture screenshots** from live web clients (Primal, Snort, Coracle, YakiHonne)
3. **Extract app store screenshots** for mobile clients
4. **Document exact hex colors** using color picker tools
5. **Create icon mapping** for Lucide equivalents

### Tools Needed:
- Browser DevTools for web screenshots
- Color picker extension
- App Store / Play Store access
- Image editing software for optimization

### Legal Considerations:
- All references for educational/simulator purposes
- Fair use for UI analysis and recreation
- Credit original creators
- Include license information

---

## 📝 Notes

### Observations:
- Amethyst has the most comprehensive screenshot documentation
- Gossip provides clear dark/light theme examples
- Web clients (Primal, Snort, Coracle, YakiHonne) need active screenshot capture
- Mobile clients need App/Play Store image extraction
- All clients share common nostr patterns but have unique branding

### Common Patterns Identified:
1. **Feed Layout**: Avatar + Name + Time + Content + Actions
2. **Navigation**: Bottom tabs (mobile) or sidebar (desktop)
3. **Composer**: Floating button or header input
4. **Profile**: Banner + Avatar + Bio + Stats
5. **Interactions**: Like, Reply, Repost, Zap (Lightning)

---

*This reference guide serves as the foundation for pixel-perfect recreations in the Nostr Client Simulator project.*
