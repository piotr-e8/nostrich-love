# Relay Feed Discovery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create an interactive relay feed browser tool, expand community discovery guide, and add landing page highlight for reading Nostr like a newspaper.

**Architecture:** Extend existing RelayPlayground component with topic-based filtering and "newspaper-style" browsing. Create a curated topical relay registry with community submission workflow. Integrate discovery features across guide and landing page.

**Tech Stack:** React + TypeScript + Tailwind + WebSocket + Framer Motion (existing stack)

---

## Task 1: Create Topical Relay Data Structure

**Files:**
- Create: `src/data/topical-relays.ts`
- Create: `src/data/relay-browsing-clients.ts`

**Step 1: Create relay data types**

```typescript
// src/data/topical-relays.ts
export type RelayCategory = 
  | 'general' 
  | 'bitcoin' 
  | 'art' 
  | 'music' 
  | 'tech' 
  | 'dev' 
  | 'gaming' 
  | 'regional';

export interface TopicalRelay {
  id: string;
  url: string;
  name: string;
  description: string;
  category: RelayCategory;
  tags: string[];
  location?: string;
  language?: string;
  addedBy?: string;
  addedDate: string;
  verified: boolean;
  featured?: boolean;
}

export const TOPICAL_RELAYS: TopicalRelay[] = [
  {
    id: "spatia-arcana",
    url: "wss://spatia-arcana.com",
    name: "Spatia Arcana",
    description: "Community-submitted topical relay",
    category: "general",
    tags: ["community"],
    addedDate: "2026-03-04",
    verified: true,
    featured: true
  }
];

export const getRelaysByCategory = (category: RelayCategory) => 
  TOPICAL_RELAYS.filter(r => r.category === category);

export const getFeaturedRelays = () => 
  TOPICAL_RELAYS.filter(r => r.featured);
```

**Step 2: Create client support data**

```typescript
// src/data/relay-browsing-clients.ts
export interface ClientWithRelaySupport {
  id: string;
  name: string;
  url: string;
  platform: 'web' | 'ios' | 'android' | 'desktop';
  features: ('relay-browsing' | 'feed-filtering' | 'multi-relay' | 'ephemeral-feeds')[];
  notes?: string;
}

export const RELAY_BROWSING_CLIENTS: ClientWithRelaySupport[] = [
  {
    id: "jumble",
    name: "Jumble",
    url: "https://jumble.social",
    platform: "web",
    features: ["relay-browsing", "feed-filtering", "multi-relay"],
    notes: "Built specifically for relay exploration"
  },
  {
    id: "gossip",
    name: "Gossip",
    url: "https://github.com/mikedilger/gossip",
    platform: "desktop",
    features: ["relay-browsing", "ephemeral-feeds"],
    notes: "Desktop client with ephemeral relay feeds"
  },
  {
    id: "coracle",
    name: "Coracle",
    url: "https://coracle.social",
    platform: "web",
    features: ["relay-browsing", "feed-filtering", "multi-relay"]
  },
  {
    id: "wisp",
    name: "Wisp",
    url: "https://wisp.sh",
    platform: "web",
    features: ["relay-browsing"],
    notes: "Details pending verification"
  },
  {
    id: "primal",
    name: "Primal",
    url: "https://primal.net",
    platform: "web",
    features: ["relay-browsing", "feed-filtering"]
  },
  {
    id: "snort",
    name: "Snort",
    url: "https://snort.social",
    platform: "web",
    features: ["relay-browsing", "feed-filtering"]
  }
];
```

**Step 3: Verify TypeScript compilation**

Run: `npm run build`
Expected: No TypeScript errors

**Step 4: Commit**

```bash
git add src/data/topical-relays.ts src/data/relay-browsing-clients.ts
git commit -m "feat(data): add topical relay and client support data structures"
```

---

## Task 2: Create Relay Feed Browser Component

**Files:**
- Create: `src/components/interactive/RelayFeedBrowser.tsx`
- Modify: `src/i18n/locales/en.json` (add translations)

**Step 1: Write component structure**

Create component following existing RelayPlayground patterns with:
- Category filter tabs
- Relay list with metadata
- WebSocket connection to view feeds
- "Newspaper" style layout option
- Client recommendation sidebar

**Step 2: Add translation keys**

Add to `src/i18n/locales/en.json`:
```json
{
  "relayFeedBrowser": {
    "title": "Browse Relay Feeds",
    "subtitle": "Read Nostr like a newspaper - discover communities by relay",
    "categories": {
      "all": "All Relays",
      "bitcoin": "Bitcoin",
      "art": "Art & Creative",
      "music": "Music",
      "tech": "Technology",
      "dev": "Development",
      "gaming": "Gaming",
      "regional": "Regional"
    },
    "actions": {
      "connect": "Connect to View",
      "addToClient": "Add to My Client",
      "viewIn": "View in {{client}}"
    },
    "newspaper": {
      "title": "Newspaper View",
      "description": "Browse content like reading a newspaper"
    }
  }
}
```

**Step 3: Build and verify**

Run: `npm run build`
Expected: No errors, translations loaded

**Step 4: Commit**

```bash
git add src/components/interactive/RelayFeedBrowser.tsx src/i18n/locales/en.json
git commit -m "feat(components): add relay feed browser with category filtering"
```

---

## Task 3: Create Standalone Guide Page

**Files:**
- Create: `src/content/guides/en/relay-feed-browser.mdx`
- Create: Translation files for pl, es, de (structure only)

**Step 1: Create English guide**

```mdx
---
title: "Browse Relay Feeds"
description: "Discover Nostr communities by browsing relay feeds. Read Nostr like a newspaper and find topical content."
estimatedTime: "5 minutes"
priority: 15
category: "intermediate"
prerequisites: ["finding-community"]
---

import { RelayFeedBrowser } from "@components/interactive/RelayFeedBrowser";

## Why Browse by Relay?

Think of each relay as a different newspaper:
- Same protocol, different communities
- Discover niche topics you didn't know existed
- Preview content before adding a relay
- Pure chronological feed (no algorithm)

## Interactive Relay Browser

<RelayFeedBrowser client:load />

## How to Use This Tool

1. **Filter by Category** - Pick a topic that interests you
2. **Select a Relay** - Click to connect and view its feed
3. **Browse Content** - See what the community posts
4. **Add to Client** - Follow instructions to add interesting relays

## Which Clients Support This?

See the sidebar in the tool above for recommended clients.

---

**Want to add a relay?** See our [community campaign](#) to submit topical relays.
```

**Step 2: Create placeholder translations**

Create empty files with same structure for pl, es, de.

**Step 3: Build and verify**

Run: `npm run build`
Expected: Guide page renders, component loads

**Step 4: Commit**

```bash
git add src/content/guides/en/relay-feed-browser.mdx
git add src/content/guides/pl/relay-feed-browser.mdx
git add src/content/guides/es/relay-feed-browser.mdx
git add src/content/guides/de/relay-feed-browser.mdx
git commit -m "feat(content): add relay feed browser guide page"
```

---

## Task 4: Expand Finding Community Guide

**Files:**
- Modify: `src/content/guides/en/finding-community.mdx`

**Step 1: Add new section after "Hashtag Strategy"**

Insert at appropriate location (after line ~90):

```mdx
## Exploring Relay Feeds

Hashtags connect you to topics across all of Nostr. But what if you want to discover entire communities organized around specific relays?

### Why Browse by Relay?

Think of relays as different newspapers:
- **Your current feed**: People you follow (mixed relays)
- **Relay feed**: Everyone posting to that specific relay

Each relay develops its own personality:
- Bitcoin-focused relays discuss ₿ topics
- Art relays showcase creative work  
- Regional relays connect local communities

### Getting Started

1. **Use our tool**: Try the [Relay Feed Browser](/en/guides/relay-feed-browser)
2. **Pick a category**: Bitcoin, Art, Music, Tech, etc.
3. **Browse like a newspaper**: See what's happening on each relay
4. **Connect**: Add interesting relays to your client

### Recommended First Relays

**Spatia Arcana** - Community-curated topical relay
- URL: `wss://spatia-arcana.com`
- Start here for a taste of relay-based discovery

### Which Clients Work Best?

**Best for relay browsing:**
- **Jumble** (Web) - Built for relay exploration
- **Gossip** (Desktop) - Ephemeral relay feeds
- **Coracle** (Web) - Advanced relay management

See the full list in our [Relay Feed Browser guide](/en/guides/relay-feed-browser).

---
```

**Step 2: Update translations**

Add corresponding sections to pl, es, de versions.

**Step 3: Build and verify**

Run: `npm run build`
Expected: No errors, new section appears in guide

**Step 4: Commit**

```bash
git add src/content/guides/*/finding-community.mdx
git commit -m "feat(content): add relay feeds section to finding community guide"
```

---

## Task 5: Add Landing Page Highlight

**Files:**
- Modify: `src/pages/index.astro` (or relevant landing page)

**Step 1: Add highlight section**

Add new section to landing page:

```astro
<!-- Relay Feed Discovery Highlight -->
<section class="py-16 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
  <div class="max-w-6xl mx-auto px-4">
    <div class="flex flex-col md:flex-row items-center gap-8">
      <div class="flex-1">
        <h2 class="text-3xl font-bold mb-4">Read Nostr Like a Newspaper</h2>
        <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Discover communities by browsing relay feeds. Each relay is like a different 
          newspaper—same protocol, unique communities. Find your niche without algorithms.
        </p>
        <div class="flex gap-4">
          <a 
            href={`/${lang}/guides/relay-feed-browser`}
            class="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            Explore Relay Feeds
            <ArrowRight class="w-5 h-5" />
          </a>
        </div>
      </div>
      <div class="flex-1">
        <!-- Visual: Newspaper/magazine metaphor illustration or component preview -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transform rotate-1">
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div class="flex gap-2 mt-4">
              <span class="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm">Bitcoin</span>
              <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm">Art</span>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">Tech</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Step 2: Build and verify**

Run: `npm run build`
Expected: Landing page shows new highlight section

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(landing): add relay feed discovery highlight section"
```

---

## Task 6: Create Campaign Design Document

**Files:**
- Create: `docs/campaigns/topical-relay-discovery.md`

**Step 1: Create campaign document**

```markdown
# Topical Relay Discovery Campaign

## Goal
Crowdsource the best topical relays from the Nostr community with verification and rewards.

## Campaign Mechanics

### Submission Process
1. Users submit relay via:
   - Web form on nostrich.love
   - Nostr DM to official account
   - Reply to campaign post with relay URL + description

2. Required info:
   - Relay URL (wss://...)
   - Name
   - Description (what's it about?)
   - Category (Bitcoin, Art, Music, etc.)
   - User's npub (for rewards)

### Verification Process
1. Automated checks:
   - WebSocket connection test
   - NIP-11 info retrieval
   - Content sampling (10 recent events)
   - Category/tag matching

2. Manual review:
   - Spot-check content quality
   - Verify description accuracy
   - Check for spam/malicious content

### Reward Structure
- **Verified submission**: 1,000-5,000 sats
- **Featured relay** (high quality): 5,000-10,000 sats
- **Payment method**: Lightning zap to submitter's npub

### Recognition
- Contributor npub listed with relay
- Optional: NIP-05 identifier displayed
- "Top Contributors" leaderboard

## Promotion Strategy

### Week 1: Launch
- Twitter thread announcing campaign
- Reddit post on r/Bitcoin, r/Nostr
- Nostr post with submission instructions
- Email to newsletter subscribers

### Week 2-4: Engagement
- Highlight interesting submissions daily
- Share relay "spotlights"
- Community votes on favorite relays
- Zap public thank-yous to contributors

### Ongoing: Maintenance
- Monthly "new relays" roundups
- Quarterly "best of" lists
- Continuous submission acceptance

## Technical Implementation

### Submission Form
Simple HTML form or Nostr-based:
- Fields: URL, name, description, category, npub
- Validation: URL format, required fields
- Storage: Database or Nostr event (kind:30078)

### Verification Script
```python
# Automated verification
1. Connect to relay via WebSocket
2. Request NIP-11 info
3. Query recent events (limit: 10)
4. Analyze content tags/categories
5. Generate verification report
6. Auto-approve if criteria met
```

### Integration
- Verified relays auto-added to data file
- Git commit with contributor credit
- Website redeploy with new relays
- Zap notification to contributor

## Success Metrics

- Submissions received: Target 50 in first month
- Verification rate: Target 70%+
- Community engagement: Shares, comments, zaps
- New relay additions: Target 30+ verified relays
- Tool usage: Page views on relay feed browser

## Budget

- Rewards: 50,000-100,000 sats initial pool
- Additional: Replenish based on submission volume
- Marketing: Time-based (Twitter/Reddit engagement)

## Timeline

**Week 1**: Campaign launch, initial submissions
**Week 2-4**: Verification and rewards processing
**Month 2+**: Continuous submissions, monthly roundups
```

**Step 2: Commit**

```bash
git add docs/campaigns/topical-relay-discovery.md
git commit -m "docs: add topical relay discovery campaign design"
```

---

## Task 7: Final Verification

**Step 1: Full build test**

Run: `npm run build`
Expected: 
- No TypeScript errors
- No translation warnings
- All pages render correctly

**Step 2: Translation check**

Verify all 4 language files have necessary keys:
- en.json ✓
- pl.json ✓
- es.json ✓
- de.json ✓

**Step 3: Manual testing**

1. Visit `/en/guides/relay-feed-browser` - Component loads
2. Check landing page - Highlight section visible
3. Verify finding-community guide - New section present
4. Test translations - Switch languages, verify content

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete relay feed discovery feature

- Add topical relay and client data structures
- Create interactive RelayFeedBrowser component
- Add standalone guide page with embedded tool
- Expand finding-community guide with relay feeds section
- Add landing page 'Read Nostr Like a Newspaper' highlight
- Create community campaign design document
- Add translations for all 4 languages"
```

---

## Summary of Files Created/Modified

### New Files (6):
1. `src/data/topical-relays.ts`
2. `src/data/relay-browsing-clients.ts`
3. `src/components/interactive/RelayFeedBrowser.tsx`
4. `src/content/guides/en/relay-feed-browser.mdx`
5. `src/content/guides/{pl,es,de}/relay-feed-browser.mdx` (3 files)
6. `docs/campaigns/topical-relay-discovery.md`

### Modified Files (5):
1. `src/i18n/locales/en.json`
2. `src/i18n/locales/{pl,es,de}.json` (3 files)
3. `src/content/guides/en/finding-community.mdx`
4. `src/content/guides/{pl,es,de}/finding-community.mdx` (3 files)
5. `src/pages/index.astro`

**Total: 11 new files, 8 modified files**

---

## Next Steps After Implementation

1. **Deploy** - Push changes, verify on production
2. **Campaign Launch** - Start topical relay submission campaign
3. **Monitor** - Track usage metrics, gather feedback
4. **Iterate** - Add features based on user feedback

---

*Plan created using writing-plans skill*
*Date: March 2026*
