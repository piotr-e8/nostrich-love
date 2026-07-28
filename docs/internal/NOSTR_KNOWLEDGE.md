# Nostr Knowledge Base

## Overview

This skill provides deep understanding of the Nostr protocol for creating accurate, beginner-friendly educational content. Nostr (Notes and Other Stuff Transmitted by Relays) is a decentralized social media protocol that uses cryptographic keys for identity and distributed relays for message storage.

**Knowledge Strategy:**
- **Internal knowledge:** Technical implementation details, NIP specifications
- **User-facing content:** Analogies, practical benefits, simplified explanations
- **Hybrid approach:** Deep understanding enables better beginner translations

---

## Core Concepts

### Protocol Architecture

**What Nostr Is (Beginner Version):**
"Nostr is like email for social media. Just like you can use Gmail, Outlook, or Apple Mail to send emails, you can use different Nostr apps to post, follow, and message. Your identity (keys) works everywhere, but you choose which apps to use."

**Technical Understanding:**
- **Events:** The only object type in Nostr. All content (posts, likes, follows) are events
- **Keypairs:** secp256k1 elliptic curve cryptography (same as Bitcoin)
- **Signatures:** Schnorr signatures per BIP-340
- **Decentralization:** No blockchain, no central authority, anyone can run a relay
- **Censorship Resistance:** Content stored across many independent relays

**Event Structure (NIP-01):**
```json
{
  "id": "<32-bytes sha256 hash of serialized event>",
  "pubkey": "<32-bytes hex public key>",
  "created_at": <unix timestamp>,
  "kind": <integer 0-65535>,
  "tags": [["e", "event_id"], ["p", "pubkey"]],
  "content": "<arbitrary string>",
  "sig": "<64-bytes schnorr signature>"
}
```

**Serialization Rules:**
- Must use canonical JSON (no extra whitespace)
- Specific character escaping required (\n, \", \\, \r, \t, \b, \f)
- UTF-8 encoding only

### Keys & Identity

**Beginner Explanation:**
"Your Nostr identity is like a username and password combined. Your npub (public key) is your username - share it freely. Your nsec (private key) is your password - never share it. Lose your nsec = lose your account forever."

**Technical Details (NIP-19):**
- **npub1...** - bech32-encoded public key (user identity)
- **nsec1...** - bech32-encoded private key (proof of ownership)
- **note1...** - bech32-encoded event ID
- Hex format also supported for protocol use

**bech32 Encoding:**
- Human-readable prefixes prevent confusion
- Error detection built-in
- Case-insensitive
- Example: `npub10elfcs4fr0l0r8af98jlmgdh9c8tcxjvz9qkw038js35mp4dma8qzvjptg`

**Key Security:**
- NO password reset (no central authority)
- NO account recovery (unless you have backups)
- Multi-backup strategy essential (physical + digital)
- NEVER share nsec (private key)

### Relays

**Beginner Explanation:**
"Relays are like post offices. When you post on Nostr, your message goes to multiple post offices (relays). Anyone can run a post office, and they store and forward messages. If one post office blocks you, others still have your messages."

**Technical Understanding:**
- **WebSocket connections:** ws:// or wss:// protocols
- **Message types:**
  - Client → Relay: `EVENT` (publish), `REQ` (subscribe), `CLOSE` (unsubscribe)
  - Relay → Client: `EVENT` (deliver), `OK` (confirm), `EOSE` (end of stored events), `NOTICE` (errors)

**Event Kinds (NIP-01):**
- **Regular events:** 1, 2, 4-44, 1000-9999 (stored permanently)
- **Replaceable events:** 0, 3, 10000-19999 (latest version kept only)
  - `kind 0`: User metadata (profile info)
  - `kind 3`: Follow list
- **Ephemeral events:** 20000-29999 (not stored)
- **Addressable events:** 30000-39999 (identified by kind+pubkey+d-tag)

**Filter System:**
```json
{
  "ids": ["event_id_1", "event_id_2"],
  "authors": ["pubkey_1"],
  "kinds": [1, 6],
  "#e": ["referenced_event_id"],
  "#p": ["mentioned_pubkey"],
  "since": 1672531200,
  "until": 1675209600,
  "limit": 50
}
```

**Relay Lists (NIP-65):**
- `kind:10002` - User's preferred relays
- `read` marker - Where to fetch events FROM this user
- `write` marker - Where to publish events TO reach this user
- Best practice: 2-4 relays total

---

## Client Ecosystem

### Major Clients

**iOS:**
- **Damus** - Clean, fast, beginner-friendly, iOS-optimized
  - Strengths: Simple UI, quick performance, good for new users
  - Best for: First-time Nostr users, casual posting

**Android:**
- **Amethyst** - Feature-rich, power-user friendly
  - Strengths: Advanced features, customization, Android-native
  - Best for: Power users, heavy Nostr users

**Cross-Platform:**
- **Primal** - Consistent experience across devices
  - Strengths: Works everywhere, cross-device sync, modern design
  - Best for: Users who switch between phone and desktop

**Web:**
- **Iris** - Browser-based, no install needed
  - Strengths: Works on any device, easy to try Nostr
  - Best for: Quick access, testing Nostr

### Multi-Client Strategy

**Beginner Explanation:**
"You can use multiple Nostr apps at the same time - like checking email on your phone and computer. Your identity stays the same, but each app has different strengths."

**Common Patterns:**
- **Mobile + Desktop:** Quick checks on mobile, long-form writing on desktop
- **Feature separation:** One app for notifications, another for content creation
- **Backup access:** Web client when app stores are unavailable

---

## Essential NIPs for Beginners

### NIP-01: Basic Protocol (Foundation)
**Purpose:** Core protocol that all Nostr implementations must support

**Key Points:**
- Defines event structure and serialization
- Defines relay communication (WebSocket messages)
- Establishes event kind conventions
- Standard tags: `e` (event reference), `p` (pubkey reference), `a` (addressable reference)

**For Beginners:**
"This is the foundation - like HTTP is for websites. Every Nostr app understands these rules."

**Full Spec:** https://github.com/nostr-protocol/nips/blob/master/01.md

---

### NIP-02: Follow Lists (Social Graph)
**Purpose:** Who you follow

**Key Points:**
- `kind:3` - Follow list event
- Contains `p` tags with pubkeys of followed users
- Can include relay hints for each followed user
- Overwrites previous lists (replaceable)

**For Beginners:**
"Your follow list works like Twitter's following list. Unlike Twitter, you control this data - it can move between apps with you."

**Full Spec:** https://github.com/nostr-protocol/nips/blob/master/02.md

---

### NIP-05: DNS Identifiers (Human-Readable Names)
**Purpose:** Easy-to-remember names like `alice@example.com`

**Key Points:**
- Maps Nostr keys to DNS-based identifiers
- Verification via `/.well-known/nostr.json` endpoint
- Format: `local-part@domain` (only a-z, 0-9, -, _, . allowed)
- `relays` field can suggest where to find user

**For Beginners:**
"Instead of sharing `npub1qqqq...` (impossible to remember), you can share `alice@example.com`. It's like having a custom email address for your Nostr identity."

**How it Works:**
1. Client sees `alice@example.com` in profile
2. Fetches `https://example.com/.well-known/nostr.json?name=alice`
3. Verifies pubkey matches profile
4. Shows verified identifier

**Full Spec:** https://github.com/nostr-protocol/nips/blob/master/05.md

---

### NIP-10: Text Notes & Threads
**Purpose:** How posts and replies work

**Key Points:**
- `kind:1` - Text note (standard post)
- `e` tags with markers: `root` (thread start), `reply` (direct response)
- `p` tags notify mentioned users
- Thread structure built from reply chains

**For Beginners:**
"This is how regular posts and comment threads work. When you reply to someone, Nostr keeps track of the conversation thread."

**Full Spec:** https://github.com/nostr-protocol/nips/blob/master/10.md

---

### NIP-17: Private Direct Messages
**Purpose:** Encrypted private messaging

**Key Points:**
- Uses NIP-44 encryption
- Gift-wrap pattern (NIP-59) for privacy
- `kind:14` - Chat message
- `kind:15` - File message
- Deniable authentication (unsigned events)
- Metadata hidden from public

**For Beginners:**
"Private messages use special encryption so only you and the recipient can read them. Unlike regular posts, DMs are hidden from public view and even relays can't see who is talking to whom."

**Privacy Features:**
- Participant identities hidden
- Message timestamps obscured
- No public group identifiers
- Works through public relays without revealing metadata

**Full Spec:** https://github.com/nostr-protocol/nips/blob/master/17.md

---

### NIP-18: Reposts
**Purpose:** Sharing others' content

**Key Points:**
- `kind:6` - Repost (for kind:1 text notes)
- `kind:16` - Generic repost (for any kind)
- Content field contains stringified JSON of original event
- Must include `e` tag and `p` tag referencing original

**For Beginners:**
"Reposts work like retweets - you're sharing someone else's post with your followers. Nostr keeps track of the original author."

**Quote Reposts:**
- Use `q` tag for quoting events
- `nevent`, `note`, `naddr` entities converted to `q` tags
- Distinguishes quotes from replies

**Full Spec:** https://github.com/nostr-protocol/nips/blob/master/18.md

---

### NIP-25: Reactions
**Purpose:** Likes, dislikes, emoji reactions

**Key Points:**
- `kind:7` - Reaction event
- `content` field: `+` (like), `-` (dislike), or emoji
- Must include `e` tag (event being reacted to)
- Should include `p` tag (author of event)

**For Beginners:**
"Reactions are likes, hearts, or emojis on posts. They help show appreciation or sentiment without needing to write a full reply."

**Custom Emoji:**
- Use `:shortcode:` syntax
- Include `emoji` tag with URL to image
- Example: `:soapbox:` → displays custom emoji

**Full Spec:** https://github.com/nostr-protocol/nips/blob/master/25.md

---

### NIP-28: Public Chat
**Purpose:** Channel-based group messaging

**Key Points:**
- `kind:40` - Create channel
- `kind:41` - Set channel metadata
- `kind:42` - Channel message
- `kind:43` - Hide message (client-side moderation)
- `kind:44` - Mute user (client-side moderation)

**For Beginners:**
"Public chat channels work like Telegram groups or Discord servers. Anyone can create a channel about any topic, and users choose which messages to show or hide."

**Client-Side Moderation:**
- No central admins
- Each user controls what they see
- Can hide messages or mute users locally
- Community norms emerge organically

**Full Spec:** https://github.com/nostr-protocol/nips/blob/master/28.md

---

### NIP-42: Relay Authentication
**Purpose:** Authenticating users to relays

**Key Points:**
- `kind:22242` - Ephemeral authentication event
- Relay sends challenge, client signs it
- Enables rate limiting, paid relays, private content
- Session-based (per connection)

**For Beginners:**
"Some relays require you to prove who you are before posting. This prevents spam and allows paid or private relays."

**Full Spec:** https://github.com/nostr-protocol/nips/blob/master/42.md

---

### NIP-57: Lightning Zaps
**Purpose:** Bitcoin micropayments

**Key Points:**
- `kind:9734` - Zap request (not published)
- `kind:9735` - Zap receipt (published to relays)
- Uses Lightning Network for instant payments
- Can include messages with zaps
- Split zaps between multiple recipients

**For Beginners:**
"Zaps are Bitcoin tips you can send to support content you love. They're instant, have tiny fees, and work directly from your wallet to theirs - no platform taking a cut."

**How Zaps Work:**
1. User clicks zap button
2. Client creates zap request event
3. Sends to recipient's Lightning address
4. Recipient's server returns invoice
5. User pays invoice
6. Recipient's server publishes zap receipt
7. Client displays zap with amount

**Zap Splits:**
- Multiple `zap` tags on events
- Each recipient gets percentage of total
- Example: 25% to author, 75% to platform

**Full Spec:** https://github.com/nostr-protocol/nips/blob/master/57.md

---

### NIP-58: Badges
**Purpose:** Gamification and recognition

**Key Points:**
- `kind:30009` - Badge Definition (addressable)
- `kind:8` - Badge Award
- `kind:30008` - Profile Badges (which to display)
- Users choose which badges to show
- Immutable awards, updatable definitions

**For Beginners:**
"Badges are achievements or awards you can earn and display on your profile. They recognize contributions, participation, or special status in communities."

**Use Cases:**
- Participation awards
- Community recognition
- Achievement tracking
- Verified credentials

**Full Spec:** https://github.com/nostr-protocol/nips/blob/master/58.md

---

### NIP-65: Relay List Metadata
**Purpose:** User's preferred relays

**Key Points:**
- `kind:10002` - Relay list event
- `r` tags with relay URLs
- Optional markers: `read`, `write`
- Helps clients find user's content

**For Beginners:**
"Your relay list tells apps where to find your posts and where to send messages meant for you. It helps ensure your content is discoverable even if some relays go offline."

**Best Practices:**
- Keep list small (2-4 relays)
- Mix of read and write relays
- Spread list to many relays for discoverability

**Full Spec:** https://github.com/nostr-protocol/nips/blob/master/65.md

---

## Content Translation Strategy

### Technical → Beginner

**Example 1: Key Cryptography**
- **Technical:** "Nostr uses secp256k1 elliptic curve cryptography with Schnorr signatures per BIP-340 for event authentication"
- **Beginner:** "Nostr uses the same secure key system as Bitcoin. Your keys prove you wrote your posts."

**Example 2: Event Kinds**
- **Technical:** "Regular events (kinds 1, 4-44, 1000-9999) are stored permanently while replaceable events overwrite previous versions"
- **Beginner:** "Some things like posts are kept forever. Others like your profile info get updated - only the latest version is kept."

**Example 3: Decentralization**
- **Technical:** "Nostr achieves censorship resistance through distributed relay architecture where content is propagated across independently-operated servers"
- **Beginner:** "Your posts exist on many different servers. If one blocks you, others still have your content. No single company controls Nostr."

### Common Analogies

- **Keys:** Username/password combined
- **Relays:** Post offices or email servers
- **Clients:** Email apps (Gmail, Outlook, Apple Mail)
- **Nostr Protocol:** Email protocol (SMTP/IMAP)
- **Zaps:** Tips or donations
- **NIP-05:** Custom email address
- **Following:** Subscribing to a newsletter

---

## Key Terminology

**Protocol Terms:**
- **Event:** Any piece of content (post, like, follow)
- **Kind:** Type of event (1=text note, 6=repost, etc.)
- **Tag:** Reference to other events or users
- **Relay:** Server storing and forwarding events
- **Client:** App used to access Nostr
- **NIP:** Nostr Implementation Possibility (specification)

**Key Terms:**
- **npub:** Public key (identity)
- **nsec:** Private key (proof of ownership)
- **Hex:** Raw key format (for protocol)
- **bech32:** Human-readable key format (npub1..., nsec1...)

**Event Terms:**
- **Kind 0:** Profile metadata
- **Kind 1:** Text note (standard post)
- **Kind 3:** Follow list
- **Kind 6:** Repost
- **Kind 7:** Reaction (like)
- **Kind 9734:** Zap request
- **Kind 9735:** Zap receipt

**Social Terms:**
- **Zap:** Bitcoin tip/payment
- **Relay List:** User's preferred servers
- **NIP-05:** Human-readable identifier
- **Badge:** Achievement/award
- **Public Chat:** Channel-based group messaging
- **DM:** Direct message (private)

---

## Common Beginner Misconceptions

**These assumptions often confuse new users. Address them early in content.**

### Misconception 1: "Nostr uses blockchain"

**The Confusion:**
- Bitcoin uses blockchain
- Nostr uses cryptography
- Therefore: Nostr uses blockchain

**The Reality:**
Nostr uses cryptographic keys (same type as Bitcoin) but has no blockchain. There's no ledger, no mining, no consensus mechanism. Messages flow directly between clients and relays.

**How to Explain:**
"Nostr uses the same type of secure keys as Bitcoin, but unlike Bitcoin, there's no blockchain. Think of it like how you can use the same password manager for different websites - the security technology is similar, but how it works is different."

### Misconception 2: "I need Nostr coins/tokens"

**The Confusion:**
- Other social platforms have tokens
- "Crypto" usually means tokens
- Therefore: Must need tokens

**The Reality:**
Nostr is free to use. No tokens, no staking, no gas fees. Only optional cost is Bitcoin for zaps (tips).

**How to Explain:**
"Nostr itself is completely free. You don't need to buy anything or hold any tokens. The only time money is involved is if you want to send tips (called 'zaps') to people, and that's optional."

### Misconception 3: "I can recover my account if I lose my keys"

**The Confusion:**
- Normal apps have "forgot password"
- Surely there's a way to recover

**The Reality:**
NO recovery. Lose your nsec = lose your account forever. No "contact support", no appeals process. This is by design for censorship resistance.

**How to Explain:**
"This is the trade-off for true ownership. Just like if you lose the only key to a physical safe - no one can help you open it. That's why backups are critical."

**Critical warning:** Always emphasize backup importance after explaining this.

### Misconception 4: "Nostr accounts can be deleted"

**The Confusion:**
- Regular platforms: delete account = data gone
- Therefore: Can delete Nostr account

**The Reality:**
Once content is on relays, it can't be "deleted" in the traditional sense. You can ask relays to remove it, but copies may exist. This is permanent storage.

**How to Explain:**
"Think of posting on Nostr like sending an email - once sent, you can't unsend it. Even if you delete it from your outbox, the recipient already has it. Be thoughtful about what you post."

### Misconception 5: "Nostr is just another Twitter clone"

**The Confusion:**
- Looks like Twitter
- Therefore: Just Twitter without the brand

**The Reality:**
Nostr is a protocol, not a platform. The paradigm is completely different: no accounts, no algorithmic feeds, no central control, user-owned data.

**How to Explain:**
"Twitter is a company that owns a platform. Nostr is like email - a standard that anyone can build on. Just like Gmail, Outlook, and Apple Mail all use the email standard but work differently, Nostr clients can feel very different but work together."

### Misconception 6: "Private messages are private from everyone"

**The Confusion:**
- It's called "private"
- Therefore: No one can see

**The Reality:**
Even "private" DMs are encrypted but still travel through relays. The relay operator can see metadata (who sent to whom, when). For truly private communication, additional encryption is needed.

**How to Explain:**
"Private DMs on Nostr are like sealed envelopes - the post office (relay) knows who sent to whom, but can't read the contents. For extra security, you can use additional encryption apps."

### Misconception 7: "I have to choose the right relay"

**The Confusion:**
- Mastodon: pick your server
- Therefore: Must pick a good relay

**The Reality:**
You can use ANY relay at any time. There's no "your relay" - you can connect to many simultaneously. No commitment, no migration needed.

**How to Explain:**
"Unlike Mastodon where you pick one server, Nostr lets you connect to as many relays as you want. It's like having multiple email accounts that all receive the same mail - use one, use ten, switch anytime."

### Misconception 8: "Nostr is too technical for normal people"

**The Confusion:**
- Cryptography sounds complex
- Therefore: Only for techies

**The Reality:**
Many Nostr clients are as simple as any other social app. The technology is invisible to users. Key management is the only technical part, and that's learnable.

**How to Explain:**
"Using Nostr is as easy as using any app - the technical stuff happens behind the scenes. The main thing to learn is keeping your keys safe, which is simpler than it sounds."

---

## Common Beginner Questions

**Q: Can I recover my account if I lose my keys?**
A: No. There is no "forgot password" option. You must back up your nsec (private key) in multiple secure locations. Lose your nsec = lose your account forever.

**Q: Can someone steal my account?**
A: Only if they get your nsec (private key). Never share it with anyone. Keep it as secure as your life savings.

**Q: Can my posts be deleted?**
A: You can request deletion (NIP-09), but relays aren't required to honor it. Think of Nostr as permanent - post accordingly.

**Q: Is Nostr anonymous?**
A: Pseudonymous. Your npub is your identity. You can be anonymous if you don't link your npub to your real identity.

**Q: Can I use multiple apps?**
A: Yes! Your identity works across all Nostr apps. Try different ones to find your favorite.

**Q: Why would I use Nostr instead of Twitter?**
A: You own your identity, can't be banned, your content can't be deleted, no algorithm manipulation, no data selling, built-in payments (zaps).

**Q: Is my content encrypted?**
A: Public posts are not encrypted (anyone can read). Private DMs (NIP-17) are encrypted.

**Q: Can someone censor me?**
A: Individual relays can block you, but they can't stop you from using other relays. Your content persists across the network.

**Q: Do I need Bitcoin to use Nostr?**
A: No. You only need Bitcoin if you want to send/receive zaps (tips).

**Q: Is Nostr free?**
A: Yes, mostly. Some relays may charge or require authentication, but many are free. Sending zaps requires Bitcoin.

---

## Resources

**Official Documentation:**
- NIPs Repository: https://github.com/nostr-protocol/nips
- Protocol Overview: https://nostr.com

**Client Lists:**
- https://nostr.com/clients
- https://nostr.net

**Nostr Guides:**
- nostrich.love (this project!)
- https://usenostr.org

**Developer Resources:**
- https://github.com/nostr-protocol/nips (specifications)
- Various client GitHub repositories

---

## Last Updated

March 2026

**Note:** NIPs evolve. Verify current specifications at https://github.com/nostr-protocol/nips for the latest changes.

**Scope:** This document covers the 15 most critical NIPs for beginners. Advanced NIPs (47, 46, 44, etc.) available in full repository.