// The ZapSimulator beat on /guides/zaps-and-lightning/.
//
// Two taps and a card slides up. Unlike the relay simulator this one is driven
// by the reader rather than by a timer, so it is a `film` beat wrapped around
// clicks: the amber pill and the button label change on the first tap, the
// green confirmation slides in on the second and auto-dismisses after 3s.
//
// Everything here is local: no fetch, no WebSocket, no wallet.

export default {
  guide: 'zaps-and-lightning',
  viewport: { w: 620, h: 1600 },

  card: 'contains:Pay Zap',
  cardFrom: 'div.rounded-2xl',
  padding: 8,

  // Seeded so the take is clean, not so it lies:
  //  - the amber "You're skipping ahead — 2 prerequisites" banner (697px, right
  //    under the H1) never mounts once its prerequisites are read;
  //  - every badge is pre-earned, because scrolling this guide otherwise fires a
  //    full-screen "BADGE EARNED! Zap Receiver" modal that dims the page and
  //    swallows clicks.
  seed: {
    completedGuides: [
      'what-is-nostr', 'keys-and-security', 'quickstart', 'finding-community',
      'faq', 'relays-demystified', 'outbox-model', 'nip05-identity',
    ],
    passedQuizzes: [
      'what-is-nostr', 'keys-and-security', 'finding-community',
      'relays-demystified', 'outbox-model', 'nip05-identity',
    ],
    currentLevel: 'intermediate',
    earnAllBadgesExcept: [],
  },

  steps: [
    { shoot: 'default-100', hold: 0.8 },
    // Chrome runs with --lang=en-US so toLocaleString() gives "5,000"; without
    // the flag a Polish host renders "5 000" on this English page.
    { click: 'text:5,000', after: 600 },
    { shoot: 'amount-picked', hold: 1.0 },
    // slide-up is 0.35s and the card auto-dismisses at 3s. Stop before that:
    // filming to 4.2s caught the confirmation vanishing, and since the crop is
    // the union of every state, the last second was a tall empty frame with the
    // next section's heading showing through.
    { film: { name: 'zap-sent', click: 'contains:Pay Zap', ms: 2400 } },
  ],

  assert: {
    expr: `document.body.textContent.includes('Pay Zap 5,000 sats')`,
    equals: true,
  },
};
