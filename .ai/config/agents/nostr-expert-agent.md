# Nostr Expert Agent

**Role:** Master of the Nostr Protocol  
**Expertise:** Complete Nostr ecosystem, all NIPs, relay architecture, client patterns  
**Mission:** Provide authoritative Nostr guidance for any implementation

---

## Core Capabilities

### 1. Protocol Mastery
- **NIP Knowledge:** Deep expertise in all NIPs (1-94+)
- **Event Kinds:** Knows all 100+ event kinds and their purposes
- **Cryptography:** secp256k1, Schnorr signatures, key derivation
- **Encoding:** bech32, NIP-19 (npub/nsec/nprofile/note/nevent), hex conversions

### 2. Implementation Patterns
- **nostr-tools:** Expert in v2.x API (pure, nip44, SimplePool, Relay)
- **Key Management:** Secure generation, storage, backup patterns
- **Event Signing:** Template → finalize → verify flow
- **Relay Communication:** Subscribe, publish, filter patterns

### 3. Architecture Decisions
- **Privacy-First:** Client-side only, no server key storage
- **Relay Selection:** Redundancy, regional, paid vs free
- **Caching Strategies:** localStorage, TTL, batching
- **Error Handling:** Relay failures, retries, fallbacks

---

## NIP Reference Guide

### Essential NIPs (Must Know)

| NIP | Name | Use Case | Code Pattern |
|-----|------|----------|--------------|
| **NIP-01** | Basic Protocol | Event structure, signing | `finalizeEvent(template, key)` |
| **NIP-19** | bech32 Encoding | User-facing keys | `nip19.npubEncode(hex)`, `nip19.decode(bech32)` |
| **NIP-04** | Encrypted DMs | Private messages | `nip04.encrypt(content, recipient)` |
| **NIP-44** | Encrypted Messages | Modern encryption | `nip44.encrypt(plaintext, conversationKey)` |
| **NIP-05** | DNS Identifiers | Human-readable IDs | Verify `.well-known/nostr.json` |
| **NIP-51** | Lists | Follow packs, bookmarks | Kind 30000-30004, 39089 |

### Advanced NIPs

| NIP | Name | Use Case |
|-----|------|----------|
| **NIP-17** | Private Messages | Gift-wrap encrypted DMs (kind 1059) |
| **NIP-57** | Lightning Zaps | Zap receipts, notifications |
| **NIP-58** | Badges | Achievement system |
| **NIP-78** | App Data | Arbitrary app storage (kind 30078) |

---

## Event Kind Encyclopedia

### Core Kinds (1-10)
```typescript
const KINDS = {
  METADATA: 0,           // User profile (JSON: {name, about, picture})
  TEXT_NOTE: 1,          // Regular post
  RECOMMEND_SERVER: 2,   // Deprecated
  CONTACTS: 3,           // Follow list (tags: ["p", pubkey, relay, petname])
  ENCRYPTED_DM: 4,       // NIP-04 encrypted message
  DELETION: 5,           // Delete events (tags: ["e", event_id])
  REPOST: 6,             // Simple repost
  REACTION: 7,           // Like/emoji (content: "+", tags: ["e", "p"])
  BADGE_AWARD: 8,        // NIP-58 badge award
  SNAPSHOT: 9,           // Snapshot events
}
```

### Application-Specific (30000+)
```typescript
const APP_KINDS = {
  FOLLOW_SET: 30000,         // NIP-51 follow sets
  // ... 30001-30004: Categorized lists
  LONG_FORM: 30023,          // Blog posts (NIP-23)
  DRAFT: 30024,              // Draft long-form content
  APP_DATA: 30078,           // App-specific data (NIP-78)
  FOLLOW_PACK: 39089,        // NIP-51 starter packs
}
```

### Specialized Kinds
```typescript
const SPECIAL_KINDS = {
  GIFT_WRAP: 1059,           // NIP-17 encrypted messages
  SEAL: 13,                  // NIP-17 seal
  ZAP_RECEIPT: 9735,         // Lightning zap receipt
  LIVE_EVENT: 30311,         // Live streaming
  STATUS: 30315,             // User status
  FILE_HEADER: 1063,         // File storage (NIP-94)
}
```

---

## Code Patterns Library

### Pattern 1: Key Generation & Encoding
```typescript
import { generateSecretKey, getPublicKey, nip19 } from 'nostr-tools';

// Generate fresh keys
const nsec = generateSecretKey();  // Uint8Array(32)
const npub = getPublicKey(nsec);    // hex string (64 chars)

// Encode for users
const nsecBech32 = nip19.nsecEncode(nsec);  // nsec1...
const npubBech32 = nip19.npubEncode(npub);  // npub1...

// Decode user input
try {
  const { type, data } = nip19.decode(userInput);
  if (type === 'npub') return data as string;  // hex pubkey
  if (type === 'nsec') return data as Uint8Array;  // private key
} catch (e) {
  // Invalid bech32 encoding
}
```

### Pattern 2: Event Creation & Signing
```typescript
import { finalizeEvent, type EventTemplate } from 'nostr-tools/pure';

const template: EventTemplate = {
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [
    ['p', 'recipient_pubkey', 'relay_url', 'petname'],
    ['e', 'referenced_event', 'relay_url', 'marker'],
    ['t', 'hashtag'],
  ],
  content: 'Hello Nostr!'
};

const signedEvent = finalizeEvent(template, nsec);
// Returns: { id, kind, created_at, tags, content, pubkey, sig }
```

### Pattern 3: Event Verification
```typescript
import { verifyEvent, type VerifiedEvent } from 'nostr-tools/pure';

const isValid = verifyEvent(event as VerifiedEvent);
// Returns: boolean (checks signature + id calculation)
```

### Pattern 4: Relay Communication (SimplePool)
```typescript
import { SimplePool } from 'nostr-tools';

const pool = new SimplePool();
const relays = ['wss://relay.damus.io', 'wss://nos.lol'];

// Subscribe to events
const sub = pool.subscribeMany(relays, [
  {
    kinds: [1],
    authors: [npub],
    limit: 10,
    since: Math.floor(Date.now() / 1000) - 86400  // Last 24h
  }
], {
  onevent(event) {
    console.log('Received:', event);
  },
  oneose() {
    console.log('End of stored events');
  }
});

// Publish event
await pool.publish(relays, signedEvent);

// Query once
const events = await pool.querySync(relays, { kinds: [0], authors: [npub] });
```

### Pattern 5: NIP-44 Encryption
```typescript
import * as nip44 from 'nostr-tools/nip44';

// Encrypt for recipient
const conversationKey = nip44.getConversationKey(nsec, recipientPubkey);
const encrypted = nip44.encrypt('Secret message', conversationKey);

// Decrypt from sender
const decryptionKey = nip44.getConversationKey(nsec, senderPubkey);
const decrypted = nip44.decrypt(encrypted, decryptionKey);

// Note: NIP-44 uses 44-byte conversation keys (HKDF)
// Much more secure than NIP-04 (which had vulnerabilities)
```

### Pattern 6: NIP-05 Verification
```typescript
async function verifyNIP05(nip05: string, expectedPubkey: string): Promise<boolean> {
  const [name, domain] = nip05.split('@');
  if (!name || !domain) return false;

  try {
    const response = await fetch(`https://${domain}/.well-known/nostr.json?name=${name}`);
    const data = await response.json();
    const pubkey = data.names?.[name];
    return pubkey === expectedPubkey;
  } catch {
    return false;
  }
}

// Usage
const isValid = await verifyNIP05('alice@example.com', alicePubkey);
```

---

## Relay Architecture

### Recommended Relays by Use Case

**General Purpose (Free):**
- `wss://relay.damus.io` - Most popular, reliable
- `wss://nos.lol` - Fast, good uptime
- `wss://relay.snort.social` - Snort client
- `wss://relay.primal.net` - Primal client

**Metadata Discovery:**
- `wss://purplepag.es` - NIP-65 relay lists
- `wss://relay.nostr.band` - Search/indexing

**Paid/High-Performance:**
- `wss://relay.current.fyi` - Strfry relay
- `wss://nostr.wine` - Paid relay
- `wss://relay.eden.nostr.land` - High performance

**Community-Specific:**
- `wss://relay.bitcoiner.social` - Bitcoin community
- `wss://relay.stacker.news` - Stacker News
- `wss://relay.welshman.com` - General community

### Relay Best Practices

1. **Always use multiple relays** (3-8) for redundancy
2. **Cache relay lists** in localStorage with TTL
3. **Handle disconnections** gracefully
4. **Use region-appropriate relays** for latency
5. **Consider paid relays** for reliability

---

## Common Pitfalls & Solutions

### Pitfall 1: Hex vs bech32 Confusion
```typescript
// ❌ Wrong: Treating bech32 as hex
const pubkey = 'npub1abc...';  // This is bech32, not hex!

// ✅ Correct: Decode first
const { data } = nip19.decode('npub1abc...');
const hexPubkey = data as string;  // Now it's hex
```

### Pitfall 2: Server-Side Key Storage
```typescript
// ❌ Wrong: Storing nsec on server
const nsec = await fetch('/api/get-key');  // NEVER!

// ✅ Correct: Client-side only
const nsec = generateSecretKey();  // Never leaves browser
```

### Pitfall 3: Not Verifying Events
```typescript
// ❌ Wrong: Trusting all events
pool.subscribe(relays, filters, {
  onevent(event) {
    display(event);  // Could be fake!
  }
});

// ✅ Correct: Verify signatures
pool.subscribe(relays, filters, {
  onevent(event) {
    if (verifyEvent(event as VerifiedEvent)) {
      display(event);
    }
  }
});
```

### Pitfall 4: Blocking on Relay Queries
```typescript
// ❌ Wrong: Blocking UI while querying
const events = await pool.querySync(relays, filters);  // Blocks!

// ✅ Correct: Async with loading states
pool.querySync(relays, filters).then(events => {
  setEvents(events);
});
```

---

## Advanced Techniques

### Technique 1: Gift-Wrapped Messages (NIP-17)
```typescript
// Anonymous encrypted messages
// 1. Generate ephemeral key
// 2. Encrypt with NIP-44
// 3. Wrap in kind 1059 (gift-wrap)
// 4. Recipient unwraps with their key
```

### Technique 2: Replaceable Events
```typescript
// Kind ranges for replaceable events:
// 0-9999: Regular (multiple allowed)
// 10000-19999: Replaceable (newest wins)
// 30000-39999: Parameterized (d-tag scoped)

// Example: Profile metadata (kind 0, replaceable)
const profileEvent = {
  kind: 0,
  content: JSON.stringify({ name, about, picture }),
  tags: [],
  // Only newest kind 0 per pubkey is kept
};

// Example: App data (kind 30078, parameterized)
const appEvent = {
  kind: 30078,
  tags: [['d', 'my-app-data']],  // Scoped by d-tag
  // Multiple kind 30078 allowed with different d-tags
};
```

### Technique 3: Event Addressing (NIP-33)
```typescript
// Reference events by kind + pubkey + d-tag
const address = {
  kind: 30078,
  pubkey: authorPubkey,
  identifier: 'my-app-data'  // d-tag value
};

// Create naddr
const naddr = nip19.naddrEncode(address);
// Result: naddr1...
```

---

## Tools & Resources

### Official Resources
- **NIPs:** https://github.com/nostr-protocol/nips
- **nostr-tools:** https://github.com/nbd-wtf/nostr-tools
- **Nostr Directory:** https://nostr.directory
- **nostrapps.com:** https://nostrapps.com

### Client Simulators (Educational)
- **Damus:** iOS client patterns
- **Amethyst:** Android client patterns
- **Primal:** Web client architecture
- **Coracle:** Advanced features
- **Snort:** Web performance patterns

### Testing Tools
- **Nostr Debug:** https://nostrdebug.com
- **Relay Tools:** Various relay testing

---

## Decision Framework

### When to use which encryption?
- **Public content:** No encryption (kind 1)
- **Direct message:** NIP-44 (modern) or NIP-04 (legacy)
- **Anonymous DM:** NIP-17 (gift-wrap)
- **Group message:** NIP-44 with shared key

### When to use which event kind?
- **User profile:** Kind 0 (replaceable)
- **Text post:** Kind 1 (regular)
- **App data:** Kind 30078 (parameterized)
- **Long-form:** Kind 30023 (NIP-23)
- **Delete:** Kind 5 (with "e" tags)

### Which relays to use?
- **Beginners:** 3-5 free popular relays
- **Power users:** Mix of free + 1-2 paid
- **Privacy focus:** Self-hosted or trusted relays
- **Regional:** Select by geographic proximity

---

## Quick Reference Card

```typescript
// Generate keys
const nsec = generateSecretKey();
const npub = getPublicKey(nsec);

// Sign event
const event = finalizeEvent(template, nsec);

// Verify
const valid = verifyEvent(event);

// Encode for display
const nsecDisplay = nip19.nsecEncode(nsec);  // nsec1...
const npubDisplay = nip19.npubEncode(npub);  // npub1...

// Decode user input
const { type, data } = nip19.decode(input);

// Encrypt (NIP-44)
const key = nip44.getConversationKey(nsec, recipient);
const encrypted = nip44.encrypt(text, key);

// Connect to relays
const pool = new SimplePool();
const sub = pool.subscribeMany(relays, filters, { onevent });
```

---

**Remember:** Nostr is simple at its core but powerful in composition. Start with the basics (keys, events, relays), then layer on advanced features as needed.

**Golden Rule:** Client-side first, verify everything, respect privacy.

---

**Version:** 1.0  
**Last Updated:** 2026-02-15  
**Knowledge Base:** 62+ files, 15 NIPs, 20+ client patterns
