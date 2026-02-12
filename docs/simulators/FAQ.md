# Frequently Asked Questions

Common questions about the Nostr Client Simulators.

## General Questions

### Q: What are Nostr Client Simulators?

**A:** Nostr Client Simulators are interactive, educational demonstrations of popular Nostr clients. They let you explore how different Nostr apps work without needing real keys or making actual protocol connections.

Think of them like flight simulators for pilots - you can learn the interface and experience without any risk.

### Q: Are these real Nostr clients?

**A:** No. These are **visual simulations only**. They:
- Show realistic user interfaces
- Use mock data (fake posts, users, etc.)
- Simulate button clicks and interactions
- Do NOT connect to real Nostr relays
- Do NOT use real cryptographic keys
- Do NOT publish real events

### Q: Why would I use a simulator instead of the real app?

**A:** Simulators are useful for:
- **Learning**: Understand Nostr before using real apps
- **Comparison**: See different clients side-by-side
- **Safety**: Explore without risking real keys
- **Education**: Teach others how Nostr works
- **Testing**: UI/UX demonstrations

### Q: Which clients are available?

**A:** Currently available:
- **Damus** (iOS) - Complete
- **Amethyst** (Android) - Complete

Planned:
- **Primal** (Web)
- **Snort** (Web)
- **YakiHonne** (iOS)
- **Coracle** (Desktop)
- **Gossip** (Desktop)

### Q: Are the simulators free to use?

**A:** Yes, all simulators are free and open source. They're part of the Nostr Beginner Guide educational project.

---

## Technical Questions

### Q: What technology powers the simulators?

**A:** The simulators are built with:
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Astro** - Static site generation
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Q: Can I run simulators locally?

**A:** Yes! Clone the repository and run:

```bash
npm install
npm run dev
```

Then visit `http://localhost:4321/simulators`

### Q: How do I add a new simulator?

**A:** See [GETTING_STARTED.md](./GETTING_STARTED.md) for a complete guide. The basic steps are:

1. Create directory: `/src/simulators/newclient/`
2. Define configuration in `configs.ts`
3. Implement screens and components
4. Create theme CSS
5. Add page: `/src/pages/simulators/newclient.astro`

### Q: Can I modify existing simulators?

**A:** Yes! The code is open source. You can:
- Fork the repository
- Modify simulator code
- Submit pull requests
- Create your own variants

Just follow the [contributing guidelines](./CONTRIBUTING.md).

### Q: Do simulators work offline?

**A:** Once loaded, simulators work without an internet connection because:
- All code is client-side
- Mock data is bundled
- No external API calls

However, the initial page load requires internet.

---

## Usage Questions

### Q: How do I navigate the simulators?

**A:** Each simulator has its own navigation:

**Mobile Simulators (Damus, Amethyst):**
- Bottom tab bar for main sections
- Tap icons to switch views
- Swipe gestures (if implemented)
- Back buttons to return

**Keyboard Shortcuts (Desktop):**
- **H**: Home
- **P**: Profile
- **C**: Compose
- **Esc**: Close/Back
- Check each simulator's README for full list

### Q: Can I create real posts?

**A:** No. The "Create Post" feature is simulated:
- You can type and submit
- It appears in your feed temporarily
- It disappears on page refresh
- Nothing is published to Nostr

This is intentional for safety.

### Q: Can I use my real Nostr keys?

**A:** **No! Never enter real keys in simulators.**

Simulators generate mock keys that are clearly marked as "DEMO". Using real keys in any simulator is:
- Not supported
- Potentially unsafe
- Unnecessary for the simulation

### Q: Why do posts disappear when I refresh?

**A:** Simulators use session-only state:
- No data persistence
- No local storage
- No cookies
- Everything resets on refresh

This is by design to ensure:
- Fresh start each time
- No data accumulation
- True simulation environment

### Q: Can I save my progress?

**A:** No, simulators don't save progress. Each session starts fresh.

If you need persistence for a specific use case, you could:
- Fork and modify the code
- Add localStorage persistence
- Or use the real Nostr client

---

## Feature Questions

### Q: What features are implemented?

**A:** Check each simulator's FEATURES.md:
- **Damus**: 9 features (DMs, Zaps, Threads, Search, Relays, Badges, NIP-05, Mute Lists, Pinned Notes)
- **Amethyst**: 10 features (above + Long-form, Live Streaming)

Features vary by client as they do in real life.

### Q: Are DMs really encrypted?

**A:** No. Simulated DMs are:
- Not encrypted
- Not private
- Just visual representations

Real Nostr DMs use NIP-04 encryption. Simulators show what DMs look like without actual encryption.

### Q: Do zaps use real Bitcoin?

**A:** No. Simulated zaps are:
- Not real transactions
- No Lightning Network involved
- Just visual indicators

Real zaps use Lightning Network (NIP-57). Simulators show the UI without actual payments.

### Q: Can I search real Nostr content?

**A:** No. Search searches:
- Mock data only (55 users, 200+ posts)
- Generated content
- No real relay data

Results are filtered from the mock dataset.

### Q: Do relays actually connect?

**A:** No. Relay connections are simulated:
- Status indicators are visual only
- No WebSocket connections
- No real relay communication

This shows relay management UI without network activity.

---

## Design Questions

### Q: How accurate are the designs?

**A:** Simulators aim for high visual fidelity:
- Match real client colors
- Use platform design systems (iOS HIG, Material Design)
- Replicate layouts and typography
- Simulate interactions

However:
- Some simplifications for web
- Not pixel-perfect replicas
- May lag behind real app updates

### Q: Can I change themes?

**A:** Theme support depends on the simulator:
- **Damus**: Light/Dark (if implemented)
- **Amethyst**: Light/Dark/Auto with Material You

Check Settings in each simulator.

### Q: Why does the iOS simulator look different on Android?

**A:** Simulators are web-based and should look consistent across devices. However:
- Font rendering varies by OS
- Touch behavior differs
- Some platform-specific quirks

The design is the same, but system differences may affect appearance.

### Q: Are the simulators responsive?

**A:** Yes! Simulators adapt to screen size:
- **Mobile**: Full-screen phone simulation
- **Tablet**: Centered phone frame
- **Desktop**: Centered with desktop framing
- All interactive elements work at all sizes

---

## Troubleshooting

### Q: The simulator won't load. What should I do?

**A:** Try these steps:

1. **Refresh the page** (F5 or Cmd+R)
2. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Check console** (F12 → Console tab) for errors
4. **Try different browser**
5. **Disable browser extensions** (especially ad blockers)

If still broken, check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Q: Buttons don't work when I click them

**A:** Possible causes:

1. **JavaScript disabled** - Enable JavaScript in browser
2. **Browser too old** - Use modern browser (Chrome, Firefox, Safari, Edge)
3. **Console errors** - Check DevTools for errors
4. **CSS issues** - Try hard refresh (Ctrl+F5)

### Q: The page looks broken/styled incorrectly

**A:** Common fixes:

1. **Hard refresh**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. **Check console**: Look for 404 errors on CSS files
3. **Disable extensions**: Ad blockers may block styles
4. **Try incognito**: Rule out cache/extension issues

### Q: Simulator is slow or laggy

**A:** Performance tips:

1. **Close other tabs** - Free up memory
2. **Use Chrome/Edge** - Best performance
3. **Disable DevTools** - Console logging slows things
4. **Lower resolution** - Zoom out slightly
5. **Check for updates** - Newer versions may be optimized

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more.

---

## Development Questions

### Q: How can I contribute?

**A:** See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Code style guidelines
- Pull request process
- Development setup
- Testing requirements

### Q: Can I use simulators in my project?

**A:** Yes, but check the license:
- Simulators are open source
- May have specific licensing terms
- Attribution may be required
- Read LICENSE file in repository

### Q: How do I report bugs?

**A:** 

1. Check if bug is already reported
2. Create minimal reproduction case
3. Include:
   - Browser and version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if UI-related
4. Submit to issue tracker

### Q: Can I suggest new features?

**A:** Yes! Feature requests welcome:

1. Check if feature exists in real client
2. Explain the use case
3. Provide mockups if possible
4. Submit detailed request

### Q: Are there coding standards?

**A:** Yes, see [STYLE_GUIDE.md](./STYLE_GUIDE.md) for:
- TypeScript conventions
- React patterns
- CSS/Tailwind guidelines
- File organization
- Documentation requirements

---

## Comparison Questions

### Q: What's the difference between Damus and Amethyst simulators?

**A:**

| Aspect | Damus | Amethyst |
|--------|-------|----------|
| **Platform** | iOS | Android |
| **Design** | Minimalist, Twitter-like | Material Design 3 |
| **Features** | 9 core features | 10 features (+ Long-form, Live) |
| **Navigation** | Bottom tab bar | Bottom nav + FAB |
| **Colors** | Purple accent | Deep Purple theme |
| **Typography** | San Francisco | Roboto |

Both are excellent but designed for different platforms.

### Q: Which simulator should I start with?

**A:** Depends on your use case:

- **New to Nostr?** Start with Damus (simpler, cleaner)
- **Android user?** Try Amethyst (matches your platform)
- **Want all features?** Amethyst has the most
- **Teaching others?** Damus is easier to explain

Try both and see which resonates!

### Q: How do simulators compare to real clients?

**A:**

**Same:**
- Visual design and layout
- Button placements and icons
- Basic interactions
- Navigation flows

**Different:**
- No real data or connections
- Simplified features
- Performance (real apps are faster)
- Some platform-native behaviors

**Not Present:**
- Push notifications
- Camera access
- File uploads
- Deep linking

---

## Nostr Questions

### Q: What is Nostr?

**A:** Nostr is a decentralized social media protocol:
- **N**otes and **O**ther **S**tuff **T**ransmitted by **R**elays
- No central server
- Users own their identity (keys)
- Anyone can build clients
- Censorship-resistant

Learn more: [nostr.com](https://nostr.com)

### Q: How do I start using real Nostr?

**A:**

1. **Get a client**: Install Damus (iOS), Amethyst (Android), or Primal (Web)
2. **Create keys**: Generate in app (save your nsec!)
3. **Add relays**: Connect to public relays
4. **Start posting**: Share your thoughts!
5. **Follow people**: Find interesting accounts

See the [Nostr Beginner Guide](/guides/quickstart) for full walkthrough.

### Q: What's the difference between Nostr and other social media?

**A:**

**Nostr:**
- You own your identity (keys)
- No central company
- Anyone can build clients
- Your data is portable
- Censorship-resistant

**Traditional (Twitter, Facebook):**
- Company owns your account
- Centralized control
- Platform lock-in
- Can be censored/banned
- Data harvesting

### Q: Are simulators good for learning Nostr?

**A:** Yes! Simulators help you:
- Understand the interface
- Learn terminology
- Practice interactions
- Compare clients
- Teach others

But to truly learn Nostr, you should eventually use the real apps.

---

## Miscellaneous

### Q: Can I use simulators on mobile?

**A:** Yes! Simulators work on mobile browsers:
- Open browser on phone/tablet
- Navigate to simulator page
- Works just like desktop
- Touch-optimized interactions

However, since simulators are phone apps simulated on web, it can feel like "phone-ception"!

### Q: Are simulators accessible?

**A:** We strive for accessibility:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast compliance

But not all simulators are fully a11y compliant yet. Contributions welcome!

### Q: Can I embed simulators on my site?

**A:** Technically yes via iframe, but:
- Check license terms first
- May not work perfectly
- Consider linking instead
- Or fork and customize

### Q: How often are simulators updated?

**A:** Updates depend on:
- Changes to real clients
- New features added
- Bug fixes
- Community contributions

There's no set schedule. Check the repository for recent activity.

### Q: Who maintains the simulators?

**A:** The simulators are:
- Created by the Nostr Beginner Guide team
- Open to community contributions
- Inspired by real client developers
- Part of an educational project

### Q: Can I donate to support development?

**A:** Check the main project page for:
- Lightning address
- Bitcoin address
- GitHub Sponsors
- Other support methods

Every sat helps!

---

## Still Have Questions?

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for technical issues
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- Browse existing GitHub issues
- Ask in Nostr community channels
- Create a new issue for unanswered questions
