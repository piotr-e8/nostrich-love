# Nostr Client Simulator Project - Agent Team Recruitment

## Project Overview
**Goal:** Build 7 popular Nostr client simulators (Amethyst, Damus, Primal Web/Mobile, Snort, YakiHonne, Coracle, Gossip) using Astro + React + TypeScript + Tailwind + Framer Motion

**Stack:** Astro 5.x, React 19.x, TypeScript, Tailwind CSS 3.4, Framer Motion, nostr-tools (for event structure reference)

**Data Model:** No persistence, pure frontend state, isolated experiences per simulator

**Core Features per Simulator:**
- Key generation/entry (mock keys - visual only)
- Profile creation/editing
- Relay browser/manager
- Post notes
- Follow/unfollow users
- Reply to notes
- Like/react to notes
- Repost notes
- Zap notes (visual animation only)
- Opt-out guided tour overlay

**Visual Requirements:**
- Pixel-perfect recreation of each client's UI
- Responsive design that mimics mobile apps on desktop
- Use real screenshots from live apps for reference
- Build shared design system/components where possible

---

## AGENT ROLES & RESPONSIBILITIES

### FOUNDATION AGENTS

#### 1. ARCHITECT AGENT
**Primary Responsibilities:**
- Design simulator engine architecture
- Implement global state management for each simulator
- Create routing structure (/simulators/[client-name])
- Build base simulator container/component framework
- Define interfaces/types for all simulator features
- Implement mock key generation service (npub/nsec format, no real crypto)
- Create shared utilities (date formatting, event structure mocking)

**Deliverables:**
- `/src/simulators/` directory structure
- Base SimulatorShell component
- useSimulator hook for state management
- Mock data generators (profiles, notes, users, relays)
- Type definitions file

**Research Required:**
- None - focus on technical architecture

---

#### 2. DESIGN SYSTEM AGENT
**Primary Responsibilities:**
- Create comprehensive design system
- Build shared component library (buttons, inputs, cards, modals, etc.)
- Define color palettes, typography, spacing for all 7 clients
- Create icon system (Lucide-based + custom where needed)
- Build animation patterns (Framer Motion presets)
- Create theme switching system (each client can override base styles)
- Document design tokens

**Deliverables:**
- `/src/components/ui/simulator/` component library
- `/src/styles/simulator-themes/` theme files
- Color palette documentation
- Component usage examples
- Animation utility hooks

**Research Required:**
- Review all 7 clients for common UI patterns
- Identify reusable components across clients

---

### CLIENT-SPECIFIC TEAMS (7 Parallel Teams)

Each team creates one simulator. All teams work concurrently using shared foundation.

#### 3. AMETHYST TEAM LEAD
**Client:** Amethyst (Android) - Material Design 3
**Team Size:** 3 agents (UI Agent, Interaction Agent, Feature Agent)

**UI Agent Responsibilities:**
- Recreate Amethyst's Material Design 3 UI exactly
- Screens: Home feed, Search, Notifications, Messages, Profile, Settings
- Components: Bottom nav bar, floating action button (FAB), cards
- Dark/light theme support
- Mobile-first responsive design

**Interaction Agent Responsibilities:**
- All touch/click interactions
- Swipe gestures (if applicable)
- Bottom sheet behaviors
- FAB menu animations
- Page transitions

**Feature Agent Responsibilities:**
- Implement all 9 core features in Amethyst style
- Key generation screen
- Profile editor with Amethyst layout
- Relay management UI
- Post composer with Amethyst formatting
- Follow/unfollow flow
- Reply/like/repost/zap interactions
- Guided tour overlay system

**Research Sources:**
- Amethyst GitHub: https://github.com/vitorpamplona/amethyst
- Google Play Store screenshots
- YouTube demos of Amethyst UI
- NostrApps listing

---

#### 4. DAMUS TEAM LEAD
**Client:** Damus (iOS) - Minimal, clean, Twitter-like
**Team Size:** 3 agents (UI Agent, Interaction Agent, Feature Agent)

**UI Agent Responsibilities:**
- Recreate Damus's minimal iOS aesthetic
- Screens: Home, Notifications, DMs, Profile, Settings
- Components: Tab bar, note cards, profile headers
- iOS-style navigation patterns
- Mobile-first responsive design

**Interaction Agent Responsibilities:**
- Tab switching animations
- Pull-to-refresh simulation
- Note card interactions
- Profile navigation
- Settings transitions

**Feature Agent Responsibilities:**
- Implement all 9 core features in Damus style
- Key/login screen (Damus style)
- Profile setup flow
- Relay preferences UI
- Note composer (simple)
- Social interactions (follow/like/zap etc.)
- Guided tour overlay

**Research Sources:**
- Damus website: https://damus.io/
- App Store screenshots
- YouTube reviews/tutorials
- GitHub: https://github.com/damus-io/damus

---

#### 5. PRIMAL TEAM LEAD (Web & Mobile variants)
**Client:** Primal - Modern, discovery-focused, clean UI
**Team Size:** 4 agents (UI Agent Web, UI Agent Mobile, Interaction Agent, Feature Agent)

**UI Agent (Web) Responsibilities:**
- Recreate Primal web interface
- Screens: Home, Explore, Notifications, Profile
- Components: Sidebar navigation, feed cards, trending topics
- Desktop-optimized layout
- Responsive down to tablet

**UI Agent (Mobile) Responsibilities:**
- Recreate Primal mobile app interface
- Mobile-optimized navigation
- Touch-friendly components
- iOS/Android hybrid aesthetic

**Interaction Agent Responsibilities:**
- Smooth feed scrolling
- Tab navigation
- Card hover/active states
- Modal behaviors
- Discovery features animations

**Feature Agent Responsibilities:**
- All 9 core features
- Discovery/explore features (trending, topics)
- Wallet integration UI mock
- Content filtering UI
- Guided tour for both web & mobile

**Research Sources:**
- Primal.net
- App Store / Play Store screenshots
- NostrApps listing
- YouTube demos

---

#### 6. SNORT TEAM LEAD
**Client:** Snort - Web-based, developer-friendly, feature-rich
**Team Size:** 3 agents (UI Agent, Interaction Agent, Feature Agent)

**UI Agent Responsibilities:**
- Recreate Snort's web interface
- Screens: Timeline, Thread view, Profile, Relays, Settings
- Components: Thread tree visualization, code blocks, media embeds
- Desktop-first with mobile adaptation

**Interaction Agent Responsibilities:**
- Thread expansion/collapse
- Inline media viewing
- Relay status indicators
- Keyboard shortcuts (visual indicators)
- Navigation patterns

**Feature Agent Responsibilities:**
- All 9 core features with Snort's extended capabilities
- Thread/reply visualization
- Advanced relay management
- Rich text formatting
- Guided tour

**Research Sources:**
- Snort.social
- GitHub: https://github.com/v0l/snort
- Screenshots from nostrapps.com

---

#### 7. YAKIHONNE TEAM LEAD
**Client:** YakiHonne - Full-featured, modern, Bitcoin-integrated
**Team Size:** 3 agents (UI Agent, Interaction Agent, Feature Agent)

**UI Agent Responsibilities:**
- Recreate YakiHonne's comprehensive UI
- Screens: Feed, Articles, Media, Profile, Wallet
- Components: Article cards, media grid, wallet UI
- Multi-content-type support
- Modern aesthetic

**Interaction Agent Responsibilities:**
- Content type switching
- Article reading mode
- Media gallery behaviors
- Wallet interactions
- Complex navigation flows

**Feature Agent Responsibilities:**
- All 9 core features
- Article publishing (long-form)
- Media upload UI
- Wallet/balance display
- Zap integration (visual)
- Guided tour

**Research Sources:**
- yakihonne.com
- NostrApps listing
- YouTube tutorials

---

#### 8. CORACLE TEAM LEAD
**Client:** Coracle - Simple, accessible, web-first
**Team Size:** 3 agents (UI Agent, Interaction Agent, Feature Agent)

**UI Agent Responsibilities:**
- Recreate Coracle's clean web interface
- Screens: Feed, Profile, Relays, Settings
- Components: Simple cards, accessible navigation
- Minimal, approachable design
- Responsive across devices

**Interaction Agent Responsibilities:**
- Simplified interactions
- Accessible focus states
- Keyboard navigation
- Clear feedback animations
- Smooth transitions

**Feature Agent Responsibilities:**
- All 9 core features with simplified UX
- Easy onboarding flow
- Clear relay management
- Accessibility-focused features
- Guided tour (beginner-friendly)

**Research Sources:**
- coracle.social
- GitHub: https://github.com/coracle-social/coracle
- Screenshots and demos

---

#### 9. GOSSIP TEAM LEAD
**Client:** Gossip - Desktop-efficient, power-user focused
**Team Size:** 3 agents (UI Agent, Interaction Agent, Feature Agent)

**UI Agent Responsibilities:**
- Recreate Gossip's desktop interface
- Screens: Main feed, Thread view, People, Relays, Settings
- Components: Split-pane layout, dense information display
- Desktop-optimized
- Keyboard shortcut indicators

**Interaction Agent Responsibilities:**
- Split-pane resizing
- Keyboard navigation
- Efficient workflows
- Thread navigation
- Relay status management

**Feature Agent Responsibilities:**
- All 9 core features with power-user optimizations
- Advanced relay management
- Thread depth navigation
- Settings/preferences
- Guided tour (power-user focused)

**Research Sources:**
- Gossip desktop app screenshots
- GitHub: https://github.com/mikedilger/gossip
- NostrApps listing
- YouTube reviews

---

### SHARED SYSTEM AGENTS

#### 10. GUIDED TOUR SYSTEM AGENT
**Primary Responsibilities:**
- Build reusable guided tour overlay system
- Create tour step definitions for all 7 clients
- Implement tour progress tracking
- Build tour UI components (tooltips, highlights, modals)
- Support for skipping/completing tours
- Accessibility support for tours

**Deliverables:**
- `/src/components/tour/` component library
- Tour configuration files per client
- useTour hook
- Tour progress storage (localStorage)

**Research Required:**
- Review each client's UI to identify key features to highlight
- Define optimal tour paths for beginners

---

#### 11. MOCK DATA GENERATOR AGENT
**Primary Responsibilities:**
- Create realistic mock content for all simulators
- Generate mock user profiles (names, bios, avatars)
- Create sample posts with variety (text, images, links)
- Build mock relay list with realistic data
- Create sample conversations/threads
- Ensure content is appropriate and realistic

**Deliverables:**
- `/src/data/mock/` directory
- Mock users database
- Mock posts database
- Mock relays database
- Content generation utilities

**Research Required:**
- Review real Nostr content for realism
- Create diverse, representative content

---

#### 12. ASSETS & ICONS AGENT
**Primary Responsibilities:**
- Gather reference screenshots from all 7 clients
- Create/download client logos/icons
- Build icon library for all simulators
- Optimize images for web
- Create mock avatars/placeholders
- Document asset usage

**Deliverables:**
- `/public/simulators/` asset directory
- Client logos
- UI screenshot references
- Icon component library
- Style guide for assets

**Research Required:**
- Screenshot all client UIs
- Download official logos
- Find existing asset libraries

---

#### 13. QUALITY ASSURANCE AGENT
**Primary Responsibilities:**
- Cross-browser testing strategy
- Mobile responsiveness verification
- Accessibility audit (WCAG compliance)
- Performance optimization review
- Consistency checks across all 7 simulators
- User flow validation
- Bug tracking and reporting

**Deliverables:**
- QA checklist per client
- Test scenarios document
- Accessibility audit report
- Performance benchmarks

---

#### 14. DOCUMENTATION AGENT
**Primary Responsibilities:**
- Write comprehensive README for simulator system
- Document component APIs
- Create usage guides for each simulator
- Write contribution guidelines
- Build style guide documentation
- Create troubleshooting guide

**Deliverables:**
- `/docs/simulators/` documentation
- README.md updates
- API documentation
- User guides

---

## DIRECTORY STRUCTURE

```
/src/
  /simulators/
    /amethyst/
    /damus/
    /primal-web/
    /primal-mobile/
    /snort/
    /yakihonne/
    /coracle/
    /gossip/
    /shared/
      /components/
      /hooks/
      /utils/
      /types/
  /components/
    /ui/
      /simulator/
      /tour/
  /data/
    /mock/
  /styles/
    /simulator-themes/
  /lib/
    /simulators/
/pages/
  /simulators/
    /amethyst.astro
    /damus.astro
    /primal-web.astro
    /primal-mobile.astro
    /snort.astro
    /yakihonne.astro
    /coracle.astro
    /gossip.astro
/public/
  /simulators/
    /assets/
```

---

## DEVELOPMENT WORKFLOW

**Phase 1: Foundation (Parallel)**
- Architect Agent builds base framework
- Design System Agent creates component library
- Mock Data Generator prepares content
- Assets Agent gathers references

**Phase 2: Client Development (Parallel)**
- All 7 teams build simultaneously
- Daily sync on shared components
- Weekly integration checks

**Phase 3: Integration (Parallel)**
- Guided Tour Agent integrates with all clients
- QA Agent validates all simulators
- Documentation Agent writes guides

**Phase 4: Polish & Launch**
- Final QA pass
- Performance optimization
- Documentation finalization

---

## SUCCESS CRITERIA

**Per Simulator:**
- Visual fidelity: 90%+ match to reference screenshots
- All 9 core features functional in simulation
- Guided tour covers all key features
- Mobile-responsive (looks like native app)
- No console errors
- Smooth 60fps animations

**Overall:**
- Consistent UX patterns across simulators where appropriate
- Shared components properly abstracted
- Documentation complete
- All 7 simulators launch simultaneously

---

## COMMUNICATION PROTOCOLS

- Daily standups via progress updates
- Shared component changes must be communicated immediately
- Blockers reported within 2 hours
- Code reviews required for all PRs
- Documentation updates with every feature

---

## QUESTIONS FOR AGENTS

Each agent should answer before starting:
1. Have you reviewed the reference screenshots/client?
2. Do you understand the Astro + React + Tailwind stack?
3. Are you clear on the "no persistence" requirement?
4. Do you have access to all necessary research materials?
5. What is your estimated timeline for deliverables?

---

## RECRUITING STATUS

- [ ] Architect Agent - PENDING
- [ ] Design System Agent - PENDING
- [ ] Amethyst Team (3 agents) - PENDING
- [ ] Damus Team (3 agents) - PENDING
- [ ] Primal Team (4 agents) - PENDING
- [ ] Snort Team (3 agents) - PENDING
- [ ] YakiHonne Team (3 agents) - PENDING
- [ ] Coracle Team (3 agents) - PENDING
- [ ] Gossip Team (3 agents) - PENDING
- [ ] Guided Tour Agent - PENDING
- [ ] Mock Data Generator - PENDING
- [ ] Assets & Icons Agent - PENDING
- [ ] QA Agent - PENDING
- [ ] Documentation Agent - PENDING

**Total: 28-30 specialized agents needed**

---

## NOTES FOR RECRUITERS

1. Prioritize agents with experience in:
   - React + TypeScript
   - UI/UX design implementation
   - Animation libraries (Framer Motion)
   - Component library development
   - Mobile-first responsive design

2. Each client team should have at least one agent familiar with that specific client's UI

3. All agents must understand this is a SIMULATION - no real Nostr protocol implementation needed

4. Agents should be detail-oriented and focused on visual accuracy

5. Communication and collaboration skills are critical - agents will work in parallel

---

## READY TO RECRUIT

This specification is complete and ready for agent recruitment.

Project Lead: HR Head AI Agent
Technical Lead: (to be assigned)
Project Start Date: (to be scheduled)
