# Implementation Plan: Relay Feed Discovery Feature

## Overview
Create a comprehensive relay feed discovery system including an interactive tool, guide expansion, and landing page integration. Enable users to browse Nostr content by relay (like reading a newspaper) and discover topical communities.

---

## Phase 1: Interactive Relay Feed Browser Tool (Priority: HIGH)

### Files to Create/Modify:

1. **New Component**: `src/components/interactive/RelayFeedBrowser.tsx`
   - Extends existing RelayPlayground architecture
   - WebSocket connections to curated relays
   - Topic-based filtering
   - "Newspaper-style" reading view
   - Easy extensibility for new relays/clients

2. **Data File**: `src/data/topical-relays.ts`
   - Curated list of topical relays
   - Easy-to-extend structure for community submissions
   - Categories: General, Bitcoin, Art, Music, Tech, etc.
   - Fields: url, name, description, category, tags, addedBy, verified

3. **New Guide Page**: `src/content/guides/en/relay-feed-browser.mdx`
   - Standalone tool page with embedded component
   - Instructions on how to use
   - How to submit new relays

4. **Update Translations**: `src/i18n/locales/{en,pl,es,de}.json`
   - Add translation keys for new component

### Technical Specs:

```typescript
// relay-feed-browser.ts data structure
interface TopicalRelay {
  id: string;
  url: string;
  name: string;
  description: string;
  category: 'general' | 'bitcoin' | 'art' | 'music' | 'tech' | 'dev' | 'gaming' | 'regional';
  tags: string[];
  location?: string;
  language?: string;
  addedBy?: string; // npub of contributor
  addedDate: string;
  verified: boolean;
  featured?: boolean;
}

interface ClientWithRelaySupport {
  id: string;
  name: string;
  url: string;
  platform: 'web' | 'ios' | 'android' | 'desktop';
  features: ('relay-browsing' | 'feed-filtering' | 'multi-relay' | 'ephemeral-feeds')[];
  notes?: string;
}
```

### Implementation Steps:

1. **Create data file** with Spatia Arcadia and initial structure
2. **Build component** - Start with basic relay browsing, add newspaper view later
3. **Create guide page** - Embed component, add instructions
4. **Add translations** - All 4 languages
5. **Build and verify** - npm run build

---

## Phase 2: Expand Finding Community Guide (Priority: MEDIUM)

### Files to Modify:

1. **Update**: `src/content/guides/en/finding-community.mdx`
   - Add new section: "Exploring Relay Feeds"
   - Position after "Hashtag Strategy" section
   - Include: Why browse by relay, which clients support it, how to get started

### Content Structure:

```markdown
## Exploring Relay Feeds

### Why Browse by Relay?
Think of each relay as a different newspaper - same protocol, different communities.

### Which Clients Support Relay Browsing?
[Table showing clients and their features]

### Getting Started
1. Use our [Relay Feed Browser](/en/guides/relay-feed-browser)
2. Pick a client from the list above
3. Start with Spatia Arcadia for [topic]

### Topical Relays to Explore
[List with links to feed browser filtered by category]
```

---

## Phase 3: Landing Page Integration (Priority: MEDIUM)

### Files to Modify:

1. **Update**: `src/pages/index.astro` or relevant landing page
   - Add highlight: "Read Nostr like a newspaper"
   - Link to relay feed browser
   - Brief explanation of relay-based discovery

2. **Optional**: Add "Featured Relay" widget
   - Rotating display of topical relays
   - "Discover communities by relay" CTA

---

## Phase 4: Community Campaign Design (Priority: MEDIUM)

### Campaign: "Topical Relay Discovery"

**Goal**: Crowdsource the best topical relays from the community

**Mechanism**:
1. Users submit relay URL + description + category via form/Nostr DM
2. Verification: Check relay exists, has content, matches description
3. Rewards: Sats for verified submissions (via Lightning/Zaps)
4. Recognition: Credit contributors in the relay list (npub + optional name)

**Technical Implementation**:
1. **Form Component**: Simple submission form
2. **Verification Script**: Automated NIP-11 check + content sampling
3. **Reward System**: Manual zap to submitter's npub
4. **Integration**: Auto-update data file with verified submissions

**Campaign Content**:
- Twitter/Reddit posts announcing campaign
- Landing page section: "Help us build the relay directory"
- Instructions: How to find/submit topical relays

---

## Success Metrics

1. **Tool Usage**: Page views on relay feed browser
2. **Relay Submissions**: Number of community submissions
3. **Engagement**: Time spent browsing feeds
4. **Content**: Number of new topical relays added
5. **User Feedback**: Nostr posts mentioning the tool

---

## Dependencies

1. Existing RelayPlayground component architecture
2. Translation system (i18n)
3. WebSocket support (already implemented)
4. Lightning wallet for campaign rewards (user provides)

---

## Timeline Estimate

- **Phase 1**: 2-3 hours (component + data + guide page)
- **Phase 2**: 1 hour (guide expansion)
- **Phase 3**: 30 min (landing page)
- **Phase 4**: 1 hour (campaign design)

**Total**: ~5 hours over multiple sessions

---

## Files Scope (Per AGENTS.md Rules)

**Session 1**: Create data file (1 file)
**Session 2**: Build component (1 file) 
**Session 3**: Create guide page (1 file)
**Session 4**: Expand finding-community (1 file)
**Session 5**: Landing page + translations (2 files)
**Session 6**: Campaign design (1 file)

Build verification after each session.

---

## New Knowledge to Document

1. **Skill Tool Issue**: Document that skill tool currently returns "none available" despite skills existing
2. **Relay Feed Discovery Pattern**: New content type for AGENTS.md
3. **Community Campaign Template**: Reusable pattern for future campaigns
4. **Topical Relay Data Structure**: Standard format for relay submissions

---

*Plan created: March 2026*
*Status: Ready for Phase 1*
