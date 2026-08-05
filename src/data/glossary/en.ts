// English glossary — the reference set. Definitions moved verbatim from the
// former inline array in src/pages/glossary.astro; do not edit here without
// porting the change to pl/es/de (tests/glossary-parity.test.ts keeps ids in
// sync, humans keep meaning in sync).
import type { GlossaryData, GlossaryMeta } from './index';

export const meta: GlossaryMeta = {
  seoTitle: 'Nostr Glossary: npub, nsec, Relays & More Explained',
  description:
    'Complete glossary of Nostr terms and concepts. Understand key terminology like npub, nsec, relays, NIPs, zaps, and more.',
};

const en: GlossaryData = {
  nostr: {
    term: 'Nostr',
    definition:
      'Notes and Other Stuff Transmitted by Relays. A decentralized protocol for social media and other applications.',
  },
  npub: {
    term: 'npub',
    definition:
      'Your public key (public identifier) in Nostr. Safe to share with anyone. Looks like npub1...',
  },
  nsec: {
    term: 'nsec',
    definition:
      'Your private key (secret key) in Nostr. Never share this with anyone! Looks like nsec1...',
  },
  relay: {
    term: 'Relay',
    definition:
      'A server that stores and forwards Nostr events. Users connect to relays to publish and receive content.',
  },
  client: {
    term: 'Client',
    definition:
      'An application that connects to Nostr relays, allowing users to read and publish notes. Examples: Damus, Iris, Amethyst.',
  },
  nip: {
    term: 'NIP',
    definition:
      'Nostr Implementation Possibility. A document describing how to implement specific Nostr features. NIP-01 is the basic protocol.',
  },
  zap: {
    term: 'Zap',
    definition:
      'A Bitcoin Lightning Network payment sent over Nostr. Used to tip or support other users.',
  },
  nip05: {
    term: 'NIP-05',
    definition:
      'A standard for human-readable identifiers (like username@domain.com) mapped to Nostr public keys.',
  },
  event: {
    term: 'Event',
    definition:
      'The basic unit of data in Nostr. Can be a note (post), metadata, contact list, reaction, or other types.',
  },
  kind: {
    term: 'Kind',
    definition:
      'A number indicating the type of an event. Kind 1 is a text note (regular post), Kind 0 is metadata, etc.',
  },
  pubkey: {
    term: 'Pubkey',
    definition:
      'Short for public key. Your identifier on the Nostr network, derived from your private key.',
  },
  'nsec-format': {
    term: '_nsec',
    definition:
      'Bech32-encoded private key format. Starts with "nsec1" and should be kept secret.',
  },
  'npub-format': {
    term: '_npub',
    definition:
      'Bech32-encoded public key format. Starts with "npub1" and is safe to share publicly.',
  },
  feed: {
    term: 'Feed',
    definition:
      'A chronological stream of posts from accounts you follow, displayed in your Nostr client.',
  },
  'follow-list': {
    term: 'Follow List',
    definition:
      'A list of public keys you follow, stored as a special event (Kind 3) on relays.',
  },
  'relay-list': {
    term: 'Relay List',
    definition:
      'A list of relays you use, stored as a special event (Kind 10002 with NIP-65).',
  },
  dm: {
    term: 'DM',
    definition:
      'Direct Message. Encrypted private messages between Nostr users (NIP-04 or NIP-17).',
  },
  mention: {
    term: 'Mention',
    definition:
      'Referencing another user in a note using their npub or NIP-05 identifier.',
  },
  hashtag: {
    term: 'Hashtag',
    definition:
      'Topics or keywords prefixed with # to categorize content and make it discoverable.',
  },
  thread: {
    term: 'Thread',
    definition: 'A series of connected notes (replies) forming a conversation.',
  },
  repost: {
    term: 'Boost / Repost',
    definition: "Sharing someone else's note to your followers (Kind 6 event).",
  },
  reaction: {
    term: 'Reaction',
    definition:
      'A simple emoji response to a note (Kind 7 event). Usually a like (❤️).',
  },
  lnurl: {
    term: 'LNURL',
    definition:
      'Lightning Network URL. A standard for Lightning Network payment interactions.',
  },
  'lightning-address': {
    term: 'Lightning Address',
    definition:
      'A human-readable identifier for receiving Lightning payments (like name@domain.com).',
  },
  'nostr-address': {
    term: 'Nostr Address',
    definition:
      'A NIP-05 identifier that looks like an email address (username@domain.com) mapped to your npub.',
  },
  'censorship-resistance': {
    term: 'Censorship Resistance',
    definition:
      'The ability to publish content without being blocked by a central authority. A core Nostr feature.',
  },
};

export default en;
