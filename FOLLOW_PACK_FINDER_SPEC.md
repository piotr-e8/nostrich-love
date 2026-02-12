# Nostr Follow Pack Finder - Project Specification

## Problem Statement

**The Empty Feed Problem:**
When newcomers first join Nostr, they face an empty feed because they don't know who to follow. Some Nostr clients address this by auto-adding follows when generating keys, but this is:
- Not user-controlled
- Often random/generic
- Doesn't match user's interests
- Hard to undo

**Our Solution:**
Create a tool at nostrich.love where newcomers can research, browse, and select accounts to follow BEFORE creating their real key pair. Users can explore curated accounts by category, preview content, and generate a "follow pack" that can be easily imported into any Nostr client.

---

## Core Features

### 1. Curated Account Database

**Account Categories:**
- **Influencers** - High-follower count, active posters (Jack, fiatjaf, Will, etc.)
- **Developers** - Protocol developers, client creators, tool builders
- **Creators** - Artists, musicians, writers, photographers
- **Bitcoiners** - Bitcoin maximalists, LN enthusiasts, node runners
- **Plebs** - Regular users, community members
- **News/Media** - Journalists, news aggregators, commentators
- **Privacy/Security** - Privacy advocates, security researchers
- **Regional** - Language/region-specific communities
- **Humor/Memes** - Comedy accounts, meme creators
- **Education** - Teachers, tutorial creators, explainers

**Account Data Structure:**
```typescript
interface CuratedAccount {
  npub: string;           // npub1... format
  name: string;           // Display name
  username?: string;      // NIP-05 or handle
  bio: string;            // Short description (max 160 chars)
  categories: Category[]; // One or more categories
  tags: string[];         // Hashtags they use (#bitcoin, #nostr, etc.)
  followers?: number;     // Approx follower count (for sorting)
  verified?: boolean;     // Verified identity (NIP-05, etc.)
  activity: 'high' | 'medium' | 'low';
  contentTypes: ('text' | 'image' | 'video' | 'article')[];
  sampleNote?: string;    // Example of their content
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}
```

**Target Size:** 300-500 curated accounts minimum

---

### 2. Discovery Interface

**Browse View:**
- Grid/list toggle
- Category filter chips (multi-select)
- Search by name/username/bio/tags
- Sort options: Popular, Recently Active, A-Z
- Activity level indicators
- Verified badges
- Quick preview on hover/tap

**Account Card Design:**
```
┌─────────────────────────────────────┐
│  [Avatar]  @username ✓              │
│            Display Name             │
│            "Bio text..."            │
│                                     │
│  🏷️ #bitcoin #nostr #privacy        │
│  📊 12K followers · High activity   │
│                                     │
│  [+ Follow] [Preview →]             │
└─────────────────────────────────────┘
```

**Preview Modal:**
- Full profile info
- Sample recent posts (if available)
- Similar accounts recommendations
- Category badges
- Tags cloud

---

### 3. Selection & Pack Building

**Selection Flow:**
1. User browses and clicks "+" on accounts they want
2. Selected accounts appear in a "pack" sidebar
3. Pack shows count and categories breakdown
4. User can remove items, clear all, or proceed

**Pack Sidebar:**
```
┌──────────────────┐
│ Your Follow Pack │
│ 23 accounts      │
├──────────────────┤
│ ● 8 Bitcoiners   │
│ ● 5 Developers   │
│ ● 4 Creators     │
│ ● 3 News         │
│ ● 3 Others       │
├──────────────────┤
│ [Clear All]      │
│ [Generate Pack →]│
└──────────────────┘
```

**Smart Suggestions:**
- "People who follow X also follow Y"
- "Complete your pack with these 3 accounts"
- Category diversity warnings ("You only selected Bitcoiners - add some creators?")

---

### 4. Pack Export/Import System

**Goal:** Allow users to transfer their selected follows from nostrich.love to a real Nostr client (Amethyst, Damus, etc.)

#### Option A: QR Code Export (Recommended)

**How it works:**
1. User generates their follow pack on nostrich.love
2. System creates a QR code containing:
   - List of npubs (follow pack)
   - Optional: Suggested relay list
   - Pack metadata (name, description)
3. User opens their Nostr client
4. Client scans QR code and offers to import follows
5. User confirms import

**QR Code Format:**
```
nostr:followpack?<base64-encoded-json>
```

**JSON Structure:**
```json
{
  "version": "1.0",
  "type": "followpack",
  "name": "My Bitcoin Starter Pack",
  "description": "Essential Bitcoin accounts for Nostr newcomers",
  "created": "2026-02-12T10:00:00Z",
  "accounts": [
    {
      "npub": "npub1...",
      "name": "Jack",
      "categories": ["influencers", "bitcoiners"]
    }
  ],
  "suggestedRelays": ["wss://relay.damus.io", "wss://nos.lol"]
}
```

**Client Support Required:**
- Clients need to implement `nostr:followpack` URL scheme
- Can fall back to copy-paste for unsupported clients

#### Option B: Copy-Paste List

**Simple fallback:**
- Export as newline-separated npubs
- Or as comma-separated list
- User copies and pastes into client's "import follows" feature

#### Option C: NIP-02 Export (Advanced)

**For advanced users:**
- Generate a follow list event (kind: 3) structure
- User can paste into client or use with a tool
- Format matches Nostr protocol exactly

---

### 5. Follow Pack Format Standard

**NIP Proposal: Follow Pack Events**

We should propose a standard NIP for follow pack events:

```
Kind: 30078 (parameterized replaceable event)
Tags:
  - ["d", "<pack-id>"] - unique identifier
  - ["title", "Bitcoin Starter Pack"]
  - ["description", "Essential Bitcoin accounts..."]
  - ["p", "<npub1>", "<relay-hint>", "<petname>"]
  - ["p", "<npub2>", "<relay-hint>", "<petname>"]
  ...
  - ["category", "bitcoin"]
  - ["category", "starter-pack"]
```

**Benefits:**
- Follow packs become discoverable on Nostr itself
- Users can share packs via Nostr posts
- Clients can subscribe to popular packs
- Decentralized curation

---

## Technical Architecture

### Frontend (Astro + React)

**Components:**
```
/src/components/follow-pack/
├── FollowPackFinder.tsx       # Main container
├── AccountBrowser.tsx         # Browse/filter accounts
├── AccountCard.tsx            # Individual account display
├── PackSidebar.tsx            # Selected accounts panel
├── CategoryFilter.tsx         # Category chips
├── SearchBar.tsx              # Search input
├── PackExporter.tsx           # Export options (QR, copy, etc.)
├── QRCodeGenerator.tsx        # QR code display
└── AccountPreview.tsx         # Preview modal
```

**State Management:**
- React Context for selected pack state
- LocalStorage persistence (user can return later)
- No server-side state (privacy-first)

### Data Layer

**Account Database:**
- Static JSON file with curated accounts
- Version controlled (GitHub PRs for additions)
- Categorized and tagged
- ~300-500 accounts to start

**Data Source Strategy:**
1. **Initial Research** (Phase 1): Manual curation
2. **Community Contributions** (Phase 2): GitHub PRs
3. **Crowdsourced Data** (Phase 3): Pull from Nostr follows of trusted curators

### Export Mechanisms

**QR Code Generation:**
- Use `qrcode` npm package
- Encode follow pack data
- Display with download/share options

**Nostr URL Scheme:**
- Register `nostr:followpack` handler
- Provide fallback instructions

---

## Research & Account Curation Plan

### Phase 1: Core Accounts (100 accounts)

**High-Priority Targets:**

**Influencers (20):**
- Jack (npub1...)
- fiatjaf (npub1...)
- Will Casarin (npub1...)
- Pablof7z (npub1...)
- Derek Ross (npub1...)
- NVK (npub1...)
- Jeff Booth (npub1...)
- Lyn Alden (npub1...)
- Preston Pysh (npub1...)
- Marty Bent (npub1...)
- Plus 10 more...

**Developers (20):**
- Will Casarin (Damus)
- Vitor Pamplona (Amethyst)
- fiatjaf (Nostr creator)
- Pablof7z (ndk)
- Daniele (Coracle)
- Mike Dilger (Gossip)
- Kieran (Primal)
- Plus 13 more...

**Creators (20):**
- Artists from #art hashtag
- Musicians from #music
- Writers from long-form clients
- Photographers from #photography

**Bitcoiners (20):**
- Maximalists
- LN developers
- Node runners
- Bitcoin educators

**Plebs/Community (20):**
- Active community members
- Regional representatives
- Regular posters with good vibes

### Phase 2: Expansion (300 accounts)

**Categories to expand:**
- Regional (per language/continent)
- Specific interests (privacy, AI, gaming, etc.)
- Niche communities

### Phase 3: Maintenance

**Ongoing:**
- Monthly reviews of inactive accounts
- Quarterly additions of rising stars
- Community nominations via GitHub issues

---

## User Flow

```
1. User visits nostrich.love
   ↓
2. Completes learning guides
   ↓
3. Arrives at "Find People to Follow" tool
   ↓
4. Browses categories (Bitcoin, Art, Tech, etc.)
   ↓
5. Selects accounts of interest (+ button)
   ↓
6. Builds pack of 20-100 accounts
   ↓
7. Clicks "Generate Follow Pack"
   ↓
8. Chooses export method:
      a) QR Code (scan with client)
      b) Copy list (paste into client)
      c) Download NIP-02 format
   ↓
9. Opens real Nostr client
   ↓
10. Imports follows from pack
   ↓
11. Has a populated feed on first open!
```

---

## Team Requirements

### Required Roles

**1. NOSTR RESEARCHER LEAD** (1 agent)
- **Responsibility:** Lead the account curation effort
- **Tasks:**
  - Research and categorize 300-500 Nostr accounts
  - Verify npubs and identities
  - Organize into categories
  - Maintain data quality
- **Skills Needed:** Knowledge of Nostr ecosystem, active Nostr user
- **Deliverable:** `src/data/curated-accounts.json`

**2. RESEARCH ASSISTANTS** (2-3 agents)
- **Responsibility:** Assist with account discovery
- **Tasks:**
  - Browse Nostr for active accounts in specific categories
  - Verify account activity and content quality
  - Tag accounts with appropriate categories
  - Cross-reference with existing lists
- **Skills Needed:** Nostr familiarity, attention to detail
- **Deliverable:** Curated account batches

**3. UI/UX DESIGNER** (1 agent)
- **Responsibility:** Design the discovery interface
- **Tasks:**
  - Design account cards and browsing experience
  - Create pack sidebar UI
  - Design export flows (QR, copy, etc.)
  - Ensure mobile-friendly design
- **Skills Needed:** UI/UX design, Figma or similar
- **Deliverable:** Design mockups and component specs

**4. FRONTEND DEVELOPER** (1-2 agents)
- **Responsibility:** Build the React components
- **Tasks:**
  - Implement AccountBrowser with filtering
  - Build PackSidebar with selection management
  - Create QR code generation
  - Implement export options
- **Skills Needed:** React, TypeScript, Tailwind CSS
- **Deliverable:** `/src/components/follow-pack/*`

**5. INTEGRATION DEVELOPER** (1 agent)
- **Responsibility:** Connect to existing nostrich.love codebase
- **Tasks:**
  - Add tool to tools.astro page
  - Integrate with existing routing
  - Ensure consistent styling
  - Add analytics/tracking (privacy-friendly)
- **Skills Needed:** Astro, React, familiarity with codebase
- **Deliverable:** Integrated tool on nostrich.love/tools

**6. QA & TESTING** (1 agent)
- **Responsibility:** Test the complete flow
- **Tasks:**
  - Test on multiple devices/browsers
  - Verify QR codes scan correctly
  - Test import into real clients
  - Accessibility audit
- **Skills Needed:** Testing, attention to detail
- **Deliverable:** Test report and bug fixes

**7. DOCUMENTATION WRITER** (1 agent)
- **Responsibility:** Document the tool and standard
- **Tasks:**
  - Write user guide for the tool
  - Document the follow pack format
  - Create contribution guide for adding accounts
  - Write NIP proposal draft
- **Skills Needed:** Technical writing, clear communication
- **Deliverable:** Documentation files

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Assemble research team
- [ ] Create account data structure
- [ ] Curate first 100 core accounts
- [ ] Set up data file and validation

### Phase 2: UI Development (Week 2-3)
- [ ] Design mockups approved
- [ ] Build AccountBrowser component
- [ ] Build PackSidebar component
- [ ] Implement filtering and search

### Phase 3: Export System (Week 3-4)
- [ ] Implement QR code generation
- [ ] Build export options UI
- [ ] Test with real Nostr clients
- [ ] Handle edge cases

### Phase 4: Integration (Week 4)
- [ ] Integrate into nostrich.love
- [ ] Add to tools page
- [ ] Cross-browser testing
- [ ] Performance optimization

### Phase 5: Content Expansion (Week 5-6)
- [ ] Expand to 300 accounts
- [ ] Add more categories
- [ ] Community contribution workflow
- [ ] Launch and gather feedback

---

## Success Metrics

**Quantitative:**
- 300+ curated accounts in database
- Tool usage: 1000+ unique users in first month
- Average pack size: 20-50 accounts
- Export completion rate: >70%

**Qualitative:**
- User feedback: "My feed wasn't empty!"
- Community adoption: Other sites link to our tool
- Client support: Major clients implement followpack import

---

## Future Enhancements

**Post-MVP Features:**
1. **Nostr Login** - Users can sign in with npub to see who they already follow
2. **Social Features** - Share packs, rate packs, see popular packs
3. **Algorithmic Suggestions** - ML-based recommendations based on selections
4. **Real-time Sync** - Pull latest account info from Nostr
5. **Mobile App** - Native app for account discovery
6. **Pack Marketplace** - Community-created packs on Nostr

---

## Open Questions

1. **Client Adoption:** Which clients will support `nostr:followpack` QR codes?
2. **Data Freshness:** How often should we update account info (followers, activity)?
3. **Verification:** Should we verify accounts beyond NIP-05? How?
4. **Bias:** How do we ensure diverse representation in curated lists?
5. **Privacy:** Should we track which packs are most popular? (Privacy implications)

---

## Resources & References

**Nostr Protocol:**
- NIP-01: Basic protocol
- NIP-02: Contact list / Follow list
- NIP-51: Lists
- NIP-65: Relay list metadata

**Existing Lists:**
- nostr.info directory
- GitHub awesome-nostr lists
- Community-curated Twitter threads
- Telegram/Discord community lists

**Similar Tools:**
- Twitter list exporters
- Mastodon follow imports
- Bluesky starter packs

---

## Recruitment Status

- [ ] Nostr Researcher Lead - NEEDED
- [ ] Research Assistants (2-3) - NEEDED
- [ ] UI/UX Designer - NEEDED
- [ ] Frontend Developers (1-2) - NEEDED
- [ ] Integration Developer - NEEDED
- [ ] QA & Testing - NEEDED
- [ ] Documentation Writer - NEEDED

**Total: 8-10 agents needed**

---

## Ready to Begin

This specification is ready for agent recruitment and project kickoff.

**Project Lead:** HR Head AI Agent
**Technical Lead:** (to be assigned)
**Start Date:** (to be scheduled)

**Priority:** HIGH - This solves the #1 onboarding issue for Nostr
