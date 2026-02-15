# Nostr Expert Agent - COMPLETE KNOWLEDGE BASE

**Role:** Master of the Nostr Protocol  
**Expertise:** Complete Nostr ecosystem - 94 NIPs, 150+ event kinds, all patterns  
**Mission:** Provide authoritative Nostr guidance for any implementation

---

## Quick Reference

### Essential One-Liners

```typescript
// Generate keys
const sk = generateSecretKey()  // Uint8Array
const pk = getPublicKey(sk)     // hex string

// Sign event  
const event = finalizeEvent(template, sk)

// Verify
const isValid = verifyEvent(event)

// Encode for display
const nsec = nip19.nsecEncode(sk)  // nsec1...
const npub = nip19.npubEncode(pk)  // npub1...

// Pool
const pool = new SimplePool()
await pool.publish(relays, event)
```

---

## COMPLETE EVENT KIND REFERENCE

### Core Protocol (0-9999)

| Kind | Name | Purpose | NIP | Common Tags |
|------|------|---------|-----|-------------|
| **0** | Metadata | User profile JSON | 01 | — |
| **1** | Text Note | Regular posts | 10 | e, p, t |
| **2** | Recommend Relay | Deprecated | 01 | — |
| **3** | Contacts | Follow list | 02 | p |
| **4** | Encrypted DM | NIP-04 messages | 04 | p |
| **5** | Deletion | Delete events | 09 | e, a |
| **6** | Repost | Simple repost | 18 | e, p |
| **7** | Reaction | Like/emoji | 25 | e, p, emoji |
| **8** | Badge Award | Award badges | 58 | a, p |
| **9** | Chat Message | Chat | C7 | p |
| **10** | Group Chat Reply | Deprecated | 29 | — |
| **11** | Thread | Threading | 7D | e, p |
| **13** | Seal | NIP-59 seal | 59 | p |
| **14** | Direct Message | NIP-17 DM | 17 | p, subject |
| **15** | File Message | NIP-17 file | 17 | url, m |
| **16** | Generic Repost | Repost any kind | 18 | k, e |
| **17** | Website Reaction | React to URLs | 25 | r |
| **20** | Picture | Picture-first | 68 | imeta |
| **21** | Video Event | Video content | 71 | imeta |
| **22** | Short Video | Portrait video | 71 | imeta |
| **24** | Public Message | Public chat | A4 | p |
| **40-44** | Channel Events | Public chat | 28 | — |
| **62** | Vanish Request | Delete all | 62 | — |
| **64** | Chess | PGN games | 64 | — |

### Replaceable Events (10000-19999)

**Replaceable:** Only newest per pubkey kept

| Kind | Name | Purpose | NIP |
|------|------|---------|-----|
| **10000** | Mute List | Blocked users | 51 |
| **10001** | Pin List | Pinned events | 51 |
| **10002** | Relay List | User's relays | 65 |
| **10003** | Bookmarks | Saved events | 51 |
| **10004** | Communities | Joined communities | 51 |
| **10005** | Public Chats | Chat channels | 51 |
| **10006** | Blocked Relays | Bad relays | 51 |
| **10007** | Search Relays | Search endpoints | 51 |
| **10009** | User Groups | Group memberships | 51,29 |
| **10012** | Favorite Relays | Preferred relays | 51 |
| **10013** | Private Relays | DM-only relays | 37 |
| **10015** | Interests | Topic interests | 51 |
| **10019** | Nutzap Mints | Recommended mints | 61 |
| **10020** | Media Follows | Media accounts | 51 |
| **10030** | Emoji List | Custom emojis | 51 |
| **10050** | DM Relays | Receive DMs | 51,17 |
| **10051** | KeyPackage Relays | Marmot MLS | Marmot |
| **10063** | User Servers | Blossom | Blossom |
| **10096** | File Servers | Deprecated | 96 |
| **10166** | Relay Monitor | Monitor announces | 66 |
| **13194** | Wallet Info | NWC info | 47 |
| **13534** | Membership Lists | Group members | 43 |
| **17375** | Cashu Wallet | Wallet state | 60 |
| **22242** | Client Auth | Authenticate | 42 |
| **23194-95** | Wallet Req/Resp | NWC comms | 47 |
| **24133** | Nostr Connect | Remote signer | 46 |
| **24242** | Blossom Blobs | File refs | Blossom |
| **27235** | HTTP Auth | API auth | 98 |
| **31989-90** | Handler Info | App handlers | 89 |

### Parameterized Replaceable (30000-39999)

**Parameterized:** Newest per (pubkey + d-tag) kept

| Kind | Name | Purpose | NIP |
|------|------|---------|-----|
| **30000** | Follow Sets | Categorized follows | 51 |
| **30001** | Generic Lists | Deprecated | 51 |
| **30002** | Relay Sets | Grouped relays | 51 |
| **30003** | Bookmark Sets | Organized bookmarks | 51 |
| **30004** | Curation Sets | Curated lists | 51 |
| **30005** | Video Sets | Video playlists | 51 |
| **30006** | Picture Sets | Photo albums | 51 |
| **30007** | Kind Mute Sets | Block kinds | 51 |
| **30008** | Profile Badges | Display badges | 58 |
| **30009** | Badge Definition | Create badges | 58 |
| **30015** | Interest Sets | Topic groups | 51 |
| **30017** | Stall | Marketplace stall | 15 |
| **30018** | Product | Sell products | 15 |
| **30019** | Marketplace UI | Shop UI | 15 |
| **30020** | Auction | Auction items | 15 |
| **30023** | Long-form | Blog posts | 23 |
| **30024** | Draft Long-form | Draft blogs | 23 |
| **30030** | Emoji Sets | Emoji packs | 51 |
| **30040** | Publication Index | Curated pubs | NKBIP-01 |
| **30041** | Publication | Curated content | NKBIP-01 |
| **30063** | Release Sets | Software releases | 51 |
| **30078** | App Data | App-specific | 78 |
| **30166** | Relay Discovery | Find relays | 66 |
| **30267** | App Curation | Curated apps | 51 |
| **30311** | Live Event | Streaming | 53 |
| **30312** | Room | Interactive room | 53 |
| **30313** | Conference | Conference | 53 |
| **30315** | User Status | Status updates | 38 |
| **30382-84** | Assertions | Trusted claims | 85 |
| **30388** | Slide Set | Presentations | Corny |
| **30402** | Classified | Marketplace | 99 |
| **30403** | Draft Classified | Draft listings | 99 |
| **30617-18** | Repository | Git repos | 34 |
| **30818-19** | Wiki | Wiki articles | 54 |
| **31234** | Draft | Generic drafts | 37 |
| **31890** | Feed | Custom feeds | NUD |
| **31922-25** | Calendar | Events/RSVP | 52 |
| **32267** | Application | Software apps | — |
| **34235-36** | Addressable Video | Video refs | 71 |
| **34550** | Community | Community def | 72 |
| **37516** | Geocache | Caching | Geocache |
| **38383** | P2P Order | Trading | 69 |
| **39089** | Starter Pack | Follow packs | 51 |
| **39092** | Media Pack | Media packs | 51 |
| **39701** | Bookmarks | Web bookmarks | B0 |

### Specialized Kinds

| Kind | Name | Purpose | NIP |
|------|------|---------|-----|
| **443-445** | Marmot | MLS messaging | Marmot |
| **818** | Merge Request | Wiki changes | 54 |
| **1018** | Poll Response | Vote | 88 |
| **1021-22** | Bid | Marketplace | 15 |
| **1040** | OpenTimestamps | Timestamp | 03 |
| **1059** | Gift Wrap | Encrypted wrap | 59 |
| **1063** | File Metadata | File info | 94 |
| **1068** | Poll | Create poll | 88 |
| **1111** | Comment | Comments | 22 |
| **1222** | Voice | Voice messages | A0 |
| **1244** | Voice Comment | Voice replies | A0 |
| **1311** | Live Chat | Stream chat | 53 |
| **1337** | Code Snippet | Share code | C0 |
| **1617-22** | Git | Git operations | 34 |
| **1630-33** | Git Status | Repo status | 34 |
| **1971** | Problems | Problem tracking | Nostrocket |
| **1984-87** | Reporting | Reports/labels | 56,32 |
| **2003-04** | Torrent | Torrents | 35 |
| **2022** | Coinjoin | Joinstr | Joinstr |
| **4550** | Approval | Community mod | 72 |
| **7374-76** | Cashu | Wallet tokens | 60 |
| **9041** | Zap Goal | Fundraising | 75 |
| **9321** | Nutzap | Ecash zaps | 61 |
| **9734-35** | Zap | Lightning | 57 |
| **9802** | Highlights | Text highlights | 84 |
| **5000-6999** | Jobs | DVM requests | 90 |
| **7000** | Job Feedback | DVM feedback | 90 |
| **7516-17** | Geocache | Cache logging | Geocache |
| **8000-9000** | Groups | Group control | 29,43 |
| **38172-73** | Mints | Cashu mints | 87 |

---

## COMPLETE NIP REFERENCE

### Essential NIPs (Must Know)

**NIP-01: Basic Protocol**
- Event structure: id, pubkey, created_at, kind, tags, content, sig
- ID = SHA256 of serialized event (except sig)
- Sig = schnorr signature of ID
- Relay messages: EVENT, REQ, CLOSE, EOSE, NOTICE, OK
- Tags: e (event), p (pubkey), d (identifier), t (hashtag)

**NIP-19: bech32 Encoding**
```typescript
// Encoding
nsec1... = nip19.nsecEncode(sk)        // Private key
npub1... = nip19.npubEncode(pk)        // Public key
note1... = nip19.noteEncode(id)        // Event ID
nevent1... = nip19.neventEncode({id, relays})  // Event with relays
nprofile1... = nip19.nprofileEncode({pubkey, relays})  // Profile
naddr1... = nip19.naddrEncode({kind, pubkey, identifier, relays})  // Addressable

// Decoding
const {type, data} = nip19.decode(bech32)
```

**NIP-44: Encrypted Payloads (MODERN)**
- Replaces NIP-04 (which is deprecated)
- Uses 44-byte conversation keys via HKDF
- Authenticated encryption
- Much more secure than NIP-04

```typescript
import * as nip44 from 'nostr-tools/nip44'

const convKey = nip44.getConversationKey(senderSk, recipientPk)
const encrypted = nip44.encrypt(plaintext, convKey)
const decrypted = nip44.decrypt(encrypted, convKey)
```

**NIP-05: DNS Identifiers**
- Maps npub to human-readable name@domain
- DNS TXT record or `.well-known/nostr.json`
- Format: `{"names": {"alice": "<hex_pubkey>"}}`

```typescript
async function verifyNIP05(nip05: string, expectedPk: string): Promise<boolean> {
  const [name, domain] = nip05.split('@')
  const res = await fetch(`https://${domain}/.well-known/nostr.json?name=${name}`)
  const data = await res.json()
  return data.names?.[name] === expectedPk
}
```

**NIP-51: Lists**
- Standardized list formats
- Kind ranges: 10000-19999 (replaceable), 30000-39999 (parameterized)
- Common lists: Mute (10000), Pin (10001), Relay (10002), Bookmark (10003)

**NIP-65: Relay List Metadata**
- Kind 10002: User's preferred relays
- Tags: `r` with relay URL and optional marker (read/write)

### Important NIPs

**NIP-10: Text Notes and Threads**
- Threading markers: root, reply, mention
- Tag format: `["e", <event_id>, <relay>, <marker>]`

**NIP-17: Private Messages**
- Gift-wrap (kind 1059) + Seal (kind 13)
- Anonymous encrypted messaging
- Uses ephemeral keys

**NIP-18: Reposts**
- Kind 6: Simple repost of kind 1
- Kind 16: Generic repost of any kind
- Content: empty or JSON string of original event

**NIP-23: Long-form Content**
- Kind 30023: Published articles
- Kind 30024: Drafts
- Markdown content
- Tags: title, summary, published_at, image

**NIP-25: Reactions**
- Kind 7: Reactions to events
- Content: "+" (like), "-" (dislike), or emoji
- Tags: e (event), p (author)

**NIP-27: Text Note References**
- Parse nostr: URIs in content
- npub1, nprofile1, note1, nevent1, naddr1 schemes
- Library: `nip27.parse(content)`

**NIP-42: Client Authentication**
- AUTH message for relay authentication
- Challenge-response with kind 22242

**NIP-46: Nostr Connect (Bunkers)**
- Remote signing via relays
- Two flows: bunker:// (bunker-initiated) or nostrconnect:// (client-initiated)

```typescript
// Bunker flow
import { BunkerSigner } from '@nostr/tools/nip46'
const bunker = BunkerSigner.fromBunker(localSk, bunkerPointer, {pool})
await bunker.connect()
const event = await bunker.signEvent(template)
```

**NIP-47: Nostr Wallet Connect**
- Control lightning wallets via Nostr
- Kind 13194: Wallet info
- Kind 23194: Request, 23195: Response

**NIP-57: Lightning Zaps**
- Kind 9734: Zap request (from sender)
- Kind 9735: Zap receipt (from recipient)
- Bolt11 invoice in tags

**NIP-58: Badges**
- Kind 30009: Badge definition
- Kind 30008: Badge award display
- Kind 8: Badge award event

**NIP-59: Gift Wrap**
- Anonymous encrypted messaging
- Kind 1059: Gift wrap (outer)
- Kind 13: Seal (middle)
- Kind 14: Rumor (inner, unsigned)

**NIP-78: Application-Specific Data**
- Kind 30078: App data storage
- Uses d-tag for namespacing
- Replaceable per (pubkey, d-tag)

### Specialized NIPs

**NIP-03: OpenTimestamps**
- Kind 1040: Timestamp attestations
- Prove event existed at time

**NIP-06: Key Derivation**
- BIP-39 mnemonic seeds
- BIP-32 hierarchical derivation

**NIP-07: Browser Extension**
- `window.nostr` API
- Methods: getPublicKey, signEvent, nip04.encrypt/decrypt

**NIP-09: Event Deletion**
- Kind 5: Deletion request
- Tags: e (event), a (addressable), k (kind)

**NIP-11: Relay Info**
- HTTP GET / endpoint returns relay info
- Supported NIPs, software, version

**NIP-13: Proof of Work**
- Mining events with nonce
- Difficulty target in bits

**NIP-15: Marketplace**
- E-commerce on Nostr
- Kinds: 30017 (stall), 30018 (product), 1021 (bid)

**NIP-21: nostr: URI**
- Scheme: `nostr:<bech32_or_hex>`
- Deep linking to Nostr content

**NIP-26: Delegation** (deprecated)
- Delegate signing rights
- Not recommended for new implementations

**NIP-28: Public Chat**
- Channels: kind 40-44
- Discord-like public chats

**NIP-29: Relay Groups**
- Managed groups on relays
- Permission-based access

**NIP-30: Custom Emoji**
- Tags: emoji with shortcode and URL
- :shortcode: format in text

**NIP-31: Unknown Events**
- Handle unrecognized event kinds gracefully
- Display using alt tag

**NIP-32: Labeling**
- Kind 1985: Label events
- Namespace:value format

**NIP-34: Git**
- Git operations over Nostr
- Patches, PRs, issues as events

**NIP-35: Torrents**
- Share torrents (kind 2003)
- Magnet links

**NIP-36: Sensitive Content**
- content-warning tag
- Blur/nsfw marking

**NIP-37: Drafts**
- Kind 31234: Draft events
- Ephemeral until published

**NIP-38: User Statuses**
- Kind 30315: Status updates
- General, music (now playing)

**NIP-39: External Identities**
- Link Nostr to other platforms
- i tag with proof

**NIP-40: Expiration**
- expiration tag (unix timestamp)
- Events auto-delete after expiry

**NIP-43: Relay Access**
- Metadata and requests for access
- Kinds 8000-9000 for groups

**NIP-45: Counting**
- COUNT message for relay queries
- Get event counts without full data

**NIP-48: Proxy Tags**
- Proxy events from other protocols
- External ID reference

**NIP-49: Private Key Encryption**
- Encrypt nsec with password
- ncryptsec format

**NIP-50: Search**
- Search queries on relays
- Supports fulltext and filters

**NIP-52: Calendar**
- Events (31922), calendar (31924), RSVP (31925)
- Date-based and time-based events

**NIP-53: Live Activities**
- Live streaming (30311)
- Interactive rooms (30312)

**NIP-54: Wiki**
- Collaborative wiki articles
- Kind 30818: Articles, 30819: Redirects

**NIP-55: Android Signer**
- Native Android app for signing
- Intent-based communication

**NIP-56: Reporting**
- Kind 1984: Reports
- Report other events/users

**NIP-60: Cashu Wallet**
- Ecash wallet integration
- Token kinds 7374-7376

**NIP-61: Nutzaps**
- Ecash-based zaps
- Anonymous lightning payments

**NIP-62: Vanish**
- Request deletion of all data
- Kind 62

**NIP-66: Relay Discovery**
- Find and monitor relays
- Kinds 10166, 30166

**NIP-68: Picture-first**
- Kind 20: Image-first feeds
- Instagram-like

**NIP-69: P2P Orders**
- Peer-to-peer trading
- Kind 38383: Orders

**NIP-70: Protected Events**
- Events only for followers
- - tag marks protected

**NIP-71: Video Events**
- Video-first content
- Kinds 21, 22, 34235-34236

**NIP-72: Moderated Communities**
- Community moderation
- Kind 34550: Definition, 4550: Approval

**NIP-73: External Content**
- Reference external IDs
- i tag

**NIP-75: Zap Goals**
- Fundraising goals
- Kind 9041

**NIP-77: Negentropy Syncing**
- Efficient relay sync
- Minimize bandwidth

**NIP-84: Highlights**
- Text highlights
- Kind 9802

**NIP-85: Trusted Assertions**
- Verifiable claims
- Kinds 30382-30384

**NIP-86: Relay Management**
- API for relay management

**NIP-87: Ecash Mints**
- Discover Cashu mints
- Kind 38172-38173

**NIP-88: Polls**
- Create polls and vote
- Kinds 1068, 1018

**NIP-89: App Handlers**
- Recommend apps for content
- Kinds 31989-31990

**NIP-90: DVMs**
- Data Vending Machines
- Job requests (5000-5999) and results (6000-6999)

**NIP-92: Media Attachments**
- imeta tag for inline media
- Dimensions, blurhash, etc

**NIP-94: File Metadata**
- Kind 1063: File info
- Magnet, torrent support

**NIP-96: HTTP File Storage**
- File upload/download via HTTP
- Deprecated in favor of Blossom

**NIP-98: HTTP Auth**
- Authenticate to HTTP APIs
- Kind 27235

**NIP-99: Classifieds**
- Marketplace listings
- Kinds 30402-30403

### Experimental NIPs

**NIP-A0: Voice Messages**
- Kind 1222: Voice
- Audio uploads

**NIP-A4: Public Messages**
- Kind 24: Broadcast messages

**NIP-B0: Web Bookmarks**
- Kind 39701: Bookmarks
- Save web links

**NIP-B7: Blossom**
- Decentralized file storage
- Blob storage and retrieval

**NIP-BE: BLE Protocol**
- Bluetooth Low Energy comms
- Offline messaging

**NIP-C0: Code Snippets**
- Kind 1337: Share code
- Syntax highlighting tags

**NIP-C7: Chats**
- Kind 9: Chat messages
- Kind 10: Thread replies

**NIP-EE: MLS Messaging**
- End-to-end encrypted groups
- Superseded by Marmot

---

## COMPLETE TAG REFERENCE

### Event Tags

| Tag | Value | Other Params | NIP |
|-----|-------|--------------|-----|
| **e** | event id (hex) | relay URL, marker, pubkey | 01, 10 |
| **p** | pubkey (hex) | relay URL, petname | 01, 02 |
| **a** | addressable ref | relay URL | 01 |
| **d** | identifier | — | 01 |
| **t** | hashtag | — | 24 |
| **r** | reference URL | — | 24, 25 |
| **g** | geohash | — | 52 |
| **k** | kind number | — | 18, 25 |

### Thread Tags

| Tag | Value | Use |
|-----|-------|-----|
| **E** | root event id | Root of thread |
| **P** | root author | Root event author |
| **K** | root kind | Root event kind |
| **A** | root address | Root addressable |
| **I** | root identity | Root external ID |

### Content Tags

| Tag | Value | Purpose | NIP |
|-----|-------|---------|-----|
| **subject** | text | Thread subject | 14, 17 |
| **summary** | text | Content summary | 23 |
| **title** | text | Content title | 23 |
| **published_at** | timestamp | Publication time | 23 |
| **image** | URL | Cover image | 23 |
| **alt** | text | Alt text | 31 |
| **content-warning** | reason | NSFW marker | 36 |
| **expiration** | timestamp | Auto-delete | 40 |
| **emoji** | shortcode, URL | Custom emoji | 30 |
| **proxy** | ID, protocol | External ref | 48 |

### Metadata Tags

| Tag | Value | Purpose | NIP |
|-----|-------|---------|-----|
| **imeta** | inline metadata | Media info | 92 |
| **name** | string | Name | 34, 58 |
| **description** | text | Description | 34 |
| **license** | license | Content license | C0 |
| **client** | name, address | Client info | 89 |

### Relays

| Tag | Value | Purpose | NIP |
|-----|-------|---------|-----|
| **r** | relay URL | Relay reference | 24, 65 |
| **relay** | relay URL | Auth relay | 42 |
| **relays** | relay list | Zap relays | 57 |

### Lightning

| Tag | Value | Purpose | NIP |
|-----|-------|---------|-----|
| **amount** | millisats | Zap amount | 57 |
| **bolt11** | invoice | Lightning invoice | 57 |
| **lnurl** | bech32 | LNURL | 57 |
| **preimage** | hash | Payment proof | 57 |
| **zap** | pubkey, relay, weight | Zap split | 57 |
| **goal** | event id | Fundraising goal | 75 |

### Git

| Tag | Value | Purpose | NIP |
|-----|-------|---------|-----|
| **clone** | URL | Git clone URL | 34 |
| **web** | URL | Web interface | 34 |
| **c** | commit id | Commit reference | 34 |
| **HEAD** | ref | Default branch | 34 |
| **branch-name** | name | Suggest branch | 34 |
| **merge-base** | commit | Merge base | 34 |

### Marketplace

| Tag | Value | Purpose | NIP |
|-----|-------|---------|-----|
| **price** | amount, currency, freq | Pricing | 99 |
| **location** | string | Physical location | 52, 99 |
| **f** | currency | Fiat currency | 69 |
| **s** | status | Order status | 69 |
| **y** | platform | Platform | 69 |
| **z** | order number | Order ID | 69 |

### Files

| Tag | Value | Purpose | NIP |
|-----|-------|---------|-----|
| **m** | MIME type | File type | 94 |
| **x** | hash | File hash | 35, 56 |
| **size** | bytes | File size | 94 |
| **dim** | dimensions | Image dimensions | 92 |
| **blurhash** | string | Blur hash | 92 |
| **thumb** | URL | Thumbnail | 58 |
| **server** | URL | Storage server | 96 |

### Group/Community

| Tag | Value | Purpose | NIP |
|-----|-------|---------|-----|
| **h** | group id | Group reference | 29 |
| **D** | day | Calendar day | 52 |

### Cryptography

| Tag | Value | Purpose | NIP |
|-----|-------|---------|-----|
| **encrypted** | — | Encrypted flag | 90 |
| **nonce** | random, difficulty | PoW | 13 |
| **challenge** | string | Auth challenge | 42 |
| **delegation** | pubkey, conds, sig | Delegation | 26 |

### External

| Tag | Value | Purpose | NIP |
|-----|-------|---------|-----|
| **i** | identity, proof, hint | External ID | 35, 39, 73 |
| **I** | root identity | Root external | 22 |

### Addressing

| Tag | Value | Purpose | NIP |
|-----|-------|---------|-----|
| **l** | label, namespace, lang | Labeling | 32 |
| **L** | namespace | Label namespace | 32 |

### Misc

| Tag | Value | Purpose | NIP |
|-----|-------|---------|-----|
| **dep** | dependency | Code dependency | C0 |
| **extension** | extension | File extension | C0 |
| **repo** | origin | Code repo | C0 |
| **runtime** | env | Runtime | C0 |
| **sound** | shortcode, url, img | Sound effects | 51 |
| **tracker** | URL | Torrent tracker | 35 |
| **u** | URL | Generic URL | 61, 98 |
| **-** | — | Protected marker | 70 |

---

## CODE PATTERNS LIBRARY

### Pattern 1: Event Creation Pipeline

```typescript
import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from '@nostr/tools/pure'
import * as nip19 from '@nostr/tools/nip19'

class EventBuilder {
  private sk: Uint8Array
  private pk: string
  
  constructor() {
    this.sk = generateSecretKey()
    this.pk = getPublicKey(this.sk)
  }
  
  // Load existing key
  static fromNsec(nsec: string): EventBuilder {
    const { data } = nip19.decode(nsec)
    const builder = new EventBuilder()
    builder.sk = data as Uint8Array
    builder.pk = getPublicKey(builder.sk)
    return builder
  }
  
  // Build text note
  textNote(content: string, options?: { replyTo?: string, mentions?: string[] }): Event {
    const tags: string[][] = []
    
    if (options?.replyTo) {
      tags.push(['e', options.replyTo, '', 'reply'])
    }
    
    options?.mentions?.forEach(pubkey => {
      tags.push(['p', pubkey])
    })
    
    return finalizeEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags,
      content
    }, this.sk)
  }
  
  // Build metadata
  setMetadata(profile: { name?: string, about?: string, picture?: string }): Event {
    return finalizeEvent({
      kind: 0,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: JSON.stringify(profile)
    }, this.sk)
  }
  
  // Verify any event
  verify(event: Event): boolean {
    return verifyEvent(event)
  }
}

// Usage
const builder = new EventBuilder()
const event = builder.textNote('Hello Nostr!')
console.log('Valid:', builder.verify(event))
```

### Pattern 2: Relay Pool Manager

```typescript
import { SimplePool, type Filter } from '@nostr/tools/pool'

class RelayManager {
  private pool: SimplePool
  private defaultRelays: string[]
  
  constructor(relays: string[]) {
    this.pool = new SimplePool({ enablePing: true, enableReconnect: true })
    this.defaultRelays = relays
  }
  
  // Subscribe with auto-resubscribe
  subscribe(filters: Filter[], callbacks: {
    onevent: (event: Event) => void
    oneose?: () => void
    onclose?: () => void
  }) {
    const sub = this.pool.subscribeMany(this.defaultRelays, filters, {
      onevent: callbacks.onevent,
      oneose: callbacks.oneose,
      onclose: callbacks.onclose
    })
    
    return {
      close: () => sub.close()
    }
  }
  
  // Query with timeout
  async query(filters: Filter[], timeoutMs = 5000): Promise<Event[]> {
    return Promise.race([
      this.pool.querySync(this.defaultRelays, filters),
      new Promise<Event[]>((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
      )
    ])
  }
  
  // Publish to N relays
  async publish(event: Event, minRelays = 2): Promise<string[]> {
    const pubs = this.pool.publish(this.defaultRelays, event)
    const results = await Promise.allSettled(pubs)
    
    const successful: string[] = []
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        successful.push(this.defaultRelays[i])
      }
    })
    
    if (successful.length < minRelays) {
      throw new Error(`Published to only ${successful.length} relays, needed ${minRelays}`)
    }
    
    return successful
  }
  
  // Close all connections
  close() {
    this.pool.close(this.defaultRelays)
  }
}

// Usage
const manager = new RelayManager([
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.primal.net'
])

const sub = manager.subscribe(
  [{ kinds: [1], limit: 10 }],
  {
    onevent: (e) => console.log('New event:', e),
    oneose: () => console.log('Sync complete')
  }
)
```

### Pattern 3: Thread Parser

```typescript
import * as nip10 from '@nostr/tools/nip10'

interface ThreadContext {
  root?: { id: string, relays?: string[], author?: string }
  replyTo?: { id: string, relays?: string[], author?: string }
  mentions: Array<{ id: string, relays?: string[], author?: string }>
  quotes: Array<{ id: string, relays?: string[], author?: string }>
  profiles: Array<{ pubkey: string, relays?: string[] }>
}

function parseThread(event: Event): ThreadContext {
  const refs = nip10.parse(event)
  
  return {
    root: refs.root || undefined,
    replyTo: refs.reply || undefined,
    mentions: refs.mentions,
    quotes: refs.quotes,
    profiles: refs.profiles
  }
}

// Usage
const thread = parseThread(event)
if (thread.root) {
  console.log('Thread root:', thread.root.id)
}
if (thread.replyTo) {
  console.log('Replying to:', thread.replyTo.id)
}
```

### Pattern 4: Content Parser (NIP-27)

```typescript
import * as nip27 from '@nostr/tools/nip27'

interface ContentBlock {
  type: 'text' | 'reference' | 'url' | 'image' | 'video' | 'audio' | 'relay'
  content: string
  data?: any
}

function parseContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = []
  
  for (const block of nip27.parse(content)) {
    switch (block.type) {
      case 'text':
        blocks.push({ type: 'text', content: block.text })
        break
      case 'reference':
        blocks.push({
          type: 'reference',
          content: block.text,
          data: block.pointer
        })
        break
      case 'url':
        blocks.push({ type: 'url', content: block.url })
        break
      case 'image':
        blocks.push({ type: 'image', content: block.url })
        break
      case 'video':
        blocks.push({ type: 'video', content: block.url })
        break
      case 'audio':
        blocks.push({ type: 'audio', content: block.url })
        break
      case 'relay':
        blocks.push({ type: 'relay', content: block.url })
        break
    }
  }
  
  return blocks
}

// Render parsed content
function renderContent(blocks: ContentBlock[]): string {
  return blocks.map(block => {
    switch (block.type) {
      case 'reference':
        if ('id' in block.data) {
          return `<a href="/e/${block.data.id}">note...</a>`
        } else if ('pubkey' in block.data) {
          return `<a href="/p/${block.data.pubkey}">@user</a>`
        }
        return block.content
      case 'url':
        return `<a href="${block.content}">${block.content}</a>`
      case 'image':
        return `<img src="${block.content}" />`
      default:
        return block.content
    }
  }).join('')
}
```

### Pattern 5: Encrypted Messaging

```typescript
import * as nip44 from '@nostr/tools/nip44'
import * as nip04 from '@nostr/tools/nip04'  // Legacy

class SecureMessenger {
  private sk: Uint8Array
  
  constructor(secretKey: Uint8Array) {
    this.sk = secretKey
  }
  
  // Modern: NIP-44 (recommended)
  encryptNIP44(plaintext: string, recipientPk: string): string {
    const convKey = nip44.getConversationKey(this.sk, recipientPk)
    return nip44.encrypt(plaintext, convKey)
  }
  
  decryptNIP44(ciphertext: string, senderPk: string): string {
    const convKey = nip44.getConversationKey(this.sk, senderPk)
    return nip44.decrypt(ciphertext, convKey)
  }
  
  // Legacy: NIP-04 (deprecated)
  async encryptNIP04(plaintext: string, recipientPk: string): Promise<string> {
    return nip04.encrypt(this.sk, recipientPk, plaintext)
  }
  
  async decryptNIP04(ciphertext: string, senderPk: string): Promise<string> {
    return nip04.decrypt(this.sk, senderPk, ciphertext)
  }
  
  // Create DM event
  createDM(content: string, recipientPk: string, useModern = true): Event {
    const encrypted = useModern 
      ? this.encryptNIP44(content, recipientPk)
      : await this.encryptNIP04(content, recipientPk)
    
    return finalizeEvent({
      kind: useModern ? 14 : 4,  // 14 for NIP-17, 4 for legacy
      created_at: Math.floor(Date.now() / 1000),
      tags: [['p', recipientPk]],
      content: encrypted
    }, this.sk)
  }
}
```

### Pattern 6: NIP-05 Resolver

```typescript
interface NIP05Profile {
  pubkey: string
  relays?: string[]
}

async function queryNIP05(nip05: string): Promise<NIP05Profile | null> {
  try {
    const [name, domain] = nip05.toLowerCase().split('@')
    if (!name || !domain) return null
    
    // Try .well-known/nostr.json
    const response = await fetch(
      `https://${domain}/.well-known/nostr.json?name=${name}`
    )
    
    if (!response.ok) return null
    
    const data = await response.json()
    const pubkey = data.names?.[name]
    
    if (!pubkey) return null
    
    return {
      pubkey,
      relays: data.relays?.[pubkey]
    }
  } catch {
    return null
  }
}

// Verify NIP-05 matches pubkey
async function verifyNIP05(nip05: string, expectedPubkey: string): Promise<boolean> {
  const profile = await queryNIP05(nip05)
  return profile?.pubkey === expectedPubkey
}
```

### Pattern 7: Relay Discovery

```typescript
async function discoverRelays(): Promise<string[]> {
  const knownRelays = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.primal.net',
    'wss://relay.snort.social',
    'wss://relay.nostr.bg',
    'wss://nostr.wine',
    'wss://relay.bitcoiner.social',
    'wss://relay.stacker.news',
    'wss://purplepag.es'
  ]
  
  // Test each relay
  const results = await Promise.all(
    knownRelays.map(async (url) => {
      try {
        const ws = new WebSocket(url)
        
        return await new Promise<{url: string, ok: boolean}>((resolve) => {
          ws.onopen = () => {
            ws.close()
            resolve({ url, ok: true })
          }
          ws.onerror = () => resolve({ url, ok: false })
          setTimeout(() => resolve({ url, ok: false }), 5000)
        })
      } catch {
        return { url, ok: false }
      }
    })
  )
  
  return results.filter(r => r.ok).map(r => r.url)
}
```

### Pattern 8: Event Store

```typescript
interface StoredEvent extends Event {
  receivedAt: number
  relays: string[]
}

class EventStore {
  private events: Map<string, StoredEvent> = new Map()
  
  add(event: Event, relay?: string): boolean {
    const existing = this.events.get(event.id)
    
    if (existing) {
      // Track additional relay
      if (relay && !existing.relays.includes(relay)) {
        existing.relays.push(relay)
      }
      return false  // Already had this event
    }
    
    this.events.set(event.id, {
      ...event,
      receivedAt: Date.now(),
      relays: relay ? [relay] : []
    })
    
    return true  // New event
  }
  
  get(id: string): StoredEvent | undefined {
    return this.events.get(id)
  }
  
  query(filters: Filter[]): StoredEvent[] {
    return Array.from(this.events.values()).filter(event =>
      filters.some(filter => this.matchesFilter(event, filter))
    )
  }
  
  private matchesFilter(event: Event, filter: Filter): boolean {
    if (filter.ids && !filter.ids.includes(event.id)) return false
    if (filter.kinds && !filter.kinds.includes(event.kind)) return false
    if (filter.authors && !filter.authors.includes(event.pubkey)) return false
    if (filter.since && event.created_at < filter.since) return false
    if (filter.until && event.created_at > filter.until) return false
    
    // Tag filters
    for (const [key, values] of Object.entries(filter)) {
      if (key.startsWith('#')) {
        const tagName = key.slice(1)
        const hasTag = event.tags.some(
          t => t[0] === tagName && values.includes(t[1])
        )
        if (!hasTag) return false
      }
    }
    
    return true
  }
}
```

---

## BEST PRACTICES

### 1. Always Verify Events
```typescript
// ❌ Bad: Trust incoming events
pool.subscribe(relays, filters, {
  onevent(event) {
    display(event)  // Could be fake!
  }
})

// ✅ Good: Verify before processing
import { verifyEvent } from '@nostr/tools/pure'

pool.subscribe(relays, filters, {
  onevent(event) {
    if (verifyEvent(event)) {
      display(event)
    } else {
      console.warn('Invalid signature:', event.id)
    }
  }
})
```

### 2. Use Modern Encryption (NIP-44)
```typescript
// ❌ Bad: NIP-04 (vulnerable)
import * as nip04 from '@nostr/tools/nip04'

// ✅ Good: NIP-44 (secure)
import * as nip44 from '@nostr/tools/nip44'
```

### 3. Handle Relay Failures
```typescript
// ❌ Bad: Single relay, no fallback
const event = await pool.get(['wss://relay.example.com'], filters)

// ✅ Good: Multiple relays, timeout
const event = await Promise.any([
  pool.get(['wss://relay.a.com'], filters),
  pool.get(['wss://relay.b.com'], filters),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 5000)
  )
])
```

### 4. Encode Keys for Display
```typescript
// ❌ Bad: Show hex to users
console.log('Your key:', hexPubkey)

// ✅ Good: Use bech32
import * as nip19 from '@nostr/tools/nip19'
console.log('Your key:', nip19.npubEncode(hexPubkey))
// npub1abc...
```

### 5. Tag Appropriately
```typescript
// ❌ Bad: Missing context tags
const event = finalizeEvent({
  kind: 1,
  content: 'Reply',
  tags: []
}, sk)

// ✅ Good: Proper threading
const event = finalizeEvent({
  kind: 1,
  content: 'Reply',
  tags: [
    ['e', rootId, '', 'root'],
    ['e', parentId, '', 'reply'],
    ['p', authorPk]
  ]
}, sk)
```

### 6. Use Replaceable Events When Appropriate
```typescript
// ❌ Bad: New event every time (clutters relay)
const profile = finalizeEvent({ kind: 1, content: 'My profile...' }, sk)

// ✅ Good: Replaceable, only newest kept
const profile = finalizeEvent({
  kind: 0,  // Replaceable
  content: JSON.stringify({ name, about, picture })
}, sk)
```

---

## COMMON PITFALLS

### Pitfall 1: Hex vs bech32 Confusion
```typescript
// ❌ Wrong
const pubkey = 'npub1abc...'  // This is bech32, not hex!

// ✅ Correct
const { data } = nip19.decode('npub1abc...')
const hexPubkey = data as string  // Now it's hex
```

### Pitfall 2: Blocking on Relay Queries
```typescript
// ❌ Wrong: Blocks UI
const events = await pool.querySync(relays, filters)
setEvents(events)

// ✅ Correct: Async with loading state
pool.querySync(relays, filters).then(events => {
  setEvents(events)
})
```

### Pitfall 3: Not Handling Rate Limits
```typescript
// ❌ Wrong: Firehose of requests
for (const pk of pubkeys) {
  await pool.querySync(relays, { authors: [pk] })
}

// ✅ Correct: Batch and throttle
const batchSize = 10
for (let i = 0; i < pubkeys.length; i += batchSize) {
  const batch = pubkeys.slice(i, i + batchSize)
  await pool.querySync(relays, { authors: batch })
  await sleep(100)  // Throttle
}
```

### Pitfall 4: Trusting Relay Counts
```typescript
// ❌ Wrong: Assuming relay has all events
const count = await pool.count(relays, filters)
// count might be 0 due to filter mismatch

// ✅ Correct: Query and verify
const events = await pool.querySync(relays, filters)
const count = events.length
```

---

## TOOLS & RESOURCES

### Official
- **Nostr Protocol:** https://github.com/nostr-protocol/nostr
- **NIPs:** https://github.com/nostr-protocol/nips
- **nostr-tools:** https://github.com/nbd-wtf/nostr-tools
- **Documentation:** https://jsr.io/@nostr/tools/doc

### Useful
- **Nostr Debug:** https://nostrdebug.com
- **Nostr Directory:** https://nostr.directory
- **nostrapps.com:** https://nostrapps.com
- **Relay Tools:** Various relay testing tools

### Testing
- **Test Relays:** relayable.org, nos.lol
- **Local Testing:** strfry, nostr-rs-relay

---

## QUICK DECISION MATRIX

| I want to... | Use Kind | NIP |
|--------------|----------|-----|
| Post text | 1 | 10 |
| Update profile | 0 | 1 |
| Follow someone | 3 | 2 |
| Send DM | 14 | 17 |
| Like post | 7 | 25 |
| Repost | 6 | 18 |
| Write blog | 30023 | 23 |
| Join chat | 42 | 28 |
| Receive zaps | 9735 | 57 |
| Store app data | 30078 | 78 |
| Delete event | 5 | 9 |
| Mute user | 10000 | 51 |

---

**Version:** 2.0 - COMPLETE KNOWLEDGE BASE  
**Coverage:** 94 NIPs, 150+ event kinds, 50+ tags  
**Last Updated:** 2026-02-15  
**Status:** ULTIMATE NOSTR REFERENCE

---

**This agent contains complete knowledge of the Nostr protocol. Reference it for any Nostr implementation, architecture decision, or debugging need.**
