# Relay Feed Discovery - Knowledge Base

## Overview
Pattern for implementing relay-based content discovery features in Nostrich.love.

---

## What is Relay Feed Discovery?

Browsing Nostr content organized by relay rather than by follow list. Think of it as:
- **Traditional**: Your feed = people you follow (regardless of relay)
- **Relay Feeds**: Your view = all content on a specific relay (regardless of who posted)

This reveals communities organized around specific relays (topical, regional, interest-based).

---

## Why It Matters

1. **Discover Communities**: Find niche communities you didn't know existed
2. **Preview Before Joining**: See what a relay contains before adding it
3. **Read Like a Newspaper**: Each relay has its own "personality" and content mix
4. **No Algorithm**: Pure chronological feed from a specific source

---

## Clients Supporting Relay Feed Browsing

### Confirmed Support

| Client | Platform | Relay Browsing | Notes |
|--------|----------|----------------|-------|
| **Jumble** | Web | ✅ Excellent | Built specifically for relay exploration |
| **Gossip** | Desktop | ✅ Yes | Ephemeral relay feeds feature |
| **Coracle** | Web | ✅ Yes | Advanced relay management |
| **Wisp** | Web | ✅ Yes | (Details pending research) |
| **Primal** | Web/Mobile | ✅ Yes | "Explore" tab with relay filtering |
| **Snort** | Web | ✅ Yes | Relay-specific feeds |
| **Iris** | Web | ✅ Limited | Basic relay filtering |

### No Support / Limited

| Client | Platform | Notes |
|--------|----------|-------|
| Damus | iOS | Aggregated view only |
| Amethyst | Android | Aggregated view only |

---

## Topical Relay Examples

### Example: Spatia Arcadia
- **URL**: `wss://spatia-arcana.com`
- **Category**: [To be determined by community]
- **Community**: [Submitted by user]

### Categories to Track

1. **General** - Open, broad interest
2. **Bitcoin** - BTC-focused discussions
3. **Art** - Visual arts, creative content
4. **Music** - Music sharing, discussions
5. **Tech** - Technology, development
6. **Dev** - Software development
7. **Gaming** - Gaming community
8. **Regional** - Location-based (e.g., Japan, Germany)

---

## Data Structure

### TopicalRelay Interface

```typescript
interface TopicalRelay {
  id: string;                    // Unique identifier
  url: string;                   // wss:// relay URL
  name: string;                  // Display name
  description: string;           // What is this relay about?
  category: RelayCategory;       // Primary category
  tags: string[];               // Additional tags (bitcoin, art, music, etc.)
  location?: string;            // Physical location if relevant
  language?: string;            // Primary language (ISO code)
  addedBy?: string;             // npub of contributor (for campaign)
  addedDate: string;            // ISO date
  verified: boolean;            // Has been checked and confirmed
  featured?: boolean;           // Highlight on main page
}

type RelayCategory = 
  | 'general' 
  | 'bitcoin' 
  | 'art' 
  | 'music' 
  | 'tech' 
  | 'dev' 
  | 'gaming' 
  | 'regional';
```

### ClientWithRelaySupport Interface

```typescript
interface ClientWithRelaySupport {
  id: string;
  name: string;
  url: string;
  platform: 'web' | 'ios' | 'android' | 'desktop';
  features: RelayFeature[];
  notes?: string;
}

type RelayFeature = 
  | 'relay-browsing'      // Can view relay-specific feeds
  | 'feed-filtering'      // Can filter by relay
  | 'multi-relay'         // Can view multiple relays at once
  | 'ephemeral-feeds';    // Temporary relay browsing (no save)
```

---

## User Flow: Discovery

1. **Entry Point**: Landing page or Finding Community guide
2. **Explore**: Use Relay Feed Browser tool
3. **Browse**: Click through different relays like reading newspapers
4. **Filter**: By category (Bitcoin, Art, etc.)
5. **Connect**: "Add this relay to my client" instructions
6. **Submit**: Community campaign to add more relays

---

## Content Strategy

### Guide Integration

**Finding Community Guide Expansion:**
- Position: After "Hashtag Strategy", before "Following the Right People"
- Angle: "Another way to discover - browse by relay"
- CTA: Link to interactive tool

**Standalone Guide Page:**
- Embed the interactive component
- Step-by-step usage instructions
- How to submit new relays

### Landing Page

**Highlight Section:**
- Headline: "Read Nostr Like a Newspaper"
- Subhead: "Browse content by relay and discover new communities"
- Visual: Newspaper/magazine metaphor
- CTA: "Explore Relay Feeds"

---

## Community Campaign: Topical Relay Discovery

> **Status: NOT LAUNCHED — this section is a proposal, not a description of anything that exists.**
>
> Nothing below is built. There is no submission form, no Nostr DM intake, no
> verification script, and no zap/reward mechanism. The reward amount is still
> `[TBD]`. The `addedBy` field on `TopicalRelay` exists for future campaign
> attribution but is unused on every current entry.
>
> This marker is load bearing. The FAQ on `/relay-feed-browser/` was written
> from this section as though it had shipped, and told readers they could
> "earn sats for verified submissions" for two weeks after the copy was fixed
> on a branch that never landed. Do not write user-facing copy from anything
> under this heading until the status line says otherwise.

### Goal
Crowdsource the best topical relays with community verification.

### Mechanism

1. **Submission**: Users submit via form or Nostr DM
   - Required: URL, name, description, category
   - Optional: npub (for rewards), tags, location

2. **Verification**: Automated checks
   - Relay responds to WebSocket
   - NIP-11 info available
   - Has actual content (not empty)
   - Description matches actual content

3. **Rewards**: Lightning/Zap to submitter
   - Amount: [TBD - e.g., 1000-5000 sats]
   - Trigger: After verification
   - Public: Acknowledge contributors

4. **Integration**: Auto-add verified relays to data file
   - Maintain list in git repo
   - Update website automatically
   - Credit contributors

### Promotion

**Twitter/Reddit:**
- "Help us map the Nostr relay universe"
- "Submit your favorite topical relay, earn sats"
- "What's the most interesting relay you're on?"

**Nostr:**
- Post from official account with submission instructions
- Pin note with relay directory link
- Zap interesting submissions publicly

### Technical

**Submission Form:**
- Simple HTML form or Nostr-based
- Store in database or Nostr event
- Webhook to notify admin

**Verification Script:**
- Connect to submitted relay
- Fetch NIP-11 info
- Sample recent events
- Check category match
- Auto-approve or flag for review

---

## Implementation Notes

### Extensibility

**Adding New Relays:**
1. Edit `src/data/topical-relays.ts`
2. Add entry with all required fields
3. Build and deploy
4. Appears immediately in tool

**Adding New Clients:**
1. Edit `src/data/relay-browsing-clients.ts`
2. Add client entry
3. Update component to show new client

### Maintenance

**Quarterly Review:**
- Check relay uptime
- Remove dead relays
- Update descriptions
- Verify categories still accurate

**Community Updates:**
- Monitor #relay submissions on Nostr
- Review campaign submissions weekly
- Process rewards batch-style

---

## Implementation Notes

### Skills Used

This feature was planned using:
- **writing-plans** skill - Created bite-sized implementation plan
- **content-strategy** skill - Structured content for discoverability

*Note: Used workaround (reading SKILL.md directly) due to skill tool bug. See AGENTS.md "Skill Tool Bug" section.*

## Related Documentation

- Implementation Plan: `/docs/plans/relay-feed-discovery-implementation.md`
- Original Research: See conversation history
- AGENTS.md: Content classification rules and skill usage guidelines

---

*Created: March 2026*
*Last Updated: March 2026*
