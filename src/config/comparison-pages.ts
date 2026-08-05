// The /nostr-vs-* pages, in one place.
//
// These are top-level English routes (src/pages/nostr-vs-*.astro) with no
// [...lang] variants — see the gate in [...lang]/guides/index.astro. They are
// linked from the homepage and the English guides hub; before that they had
// three in-content inbound links each, all from /guides/protocol-comparison and
// from one another, which left the site's most comparison-intent pages three
// clicks deep behind a single advanced guide.
//
// When they gain locale variants, add them to localizedLocales() in
// src/i18n/paths.ts and drop the English-only gate.
export const COMPARISON_PAGES = [
  {
    href: '/nostr-vs-twitter',
    label: 'Nostr vs Twitter/X',
    blurb: 'Ownership, reach and moderation, side by side',
  },
  {
    href: '/nostr-vs-mastodon',
    label: 'Nostr vs Mastodon',
    blurb: 'Relays and instances are not the same thing',
  },
  {
    href: '/nostr-vs-bluesky',
    label: 'Nostr vs Bluesky',
    blurb: 'Two takes on decentralized identity, compared',
  },
] as const;
