// Beats 1-2: the guide opens, then scrolls to the first diagram.
//
// The claim this beat makes is about LENGTH — ~550 words of prose — so the
// motion is the page itself moving, and what arrives is a card rather than more
// paragraphs. Framed to the viewport because a scroll has no single element.
//
// Seeded only to keep the amber "you're skipping ahead" banner off the top: this
// guide lists keys-and-security and quickstart as prerequisites, and the banner
// is 697px of interstitial directly under the H1.

export default {
  guide: 'relays-demystified',
  viewport: { w: 620, h: 1120 },

  card: 'viewport',

  // Longer than the default 6.5s: RelayExplorer finishes probing relays a few
  // seconds in and slides a green "Relay status check complete!" toast up from
  // the bottom for 3s. It has no role="alert", so the end-of-run assertion does
  // not catch it — it just sits in the corner of the opening shot. Wait it out.
  settleMs: 12000,

  seed: {
    completedGuides: ['what-is-nostr', 'keys-and-security', 'quickstart'],
    passedQuizzes: [],
    earnAllBadgesExcept: [],
  },

  steps: [
    { scrollTo: 'top', after: 800 },
    { shoot: 'top', hold: 1.6 },
    // 4s of eased scroll down to the first diagram, ending with it just under
    // the top edge.
    { film: { name: 'scroll-to-diagram', scrollTo: 'find:figure|One big server', stopAt: 60, ms: 4000, hold: 1.4 } },
  ],

  assert: {
    expr: `document.querySelectorAll('[role="alert"]').length === 0`,
    equals: true,
  },
};
