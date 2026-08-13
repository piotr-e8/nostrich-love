// Beat 5: the troubleshooting wizard, applied to the problem everyone hits.
//
// "Empty feed / No posts" is the exact button label — "I can't see any posts" is
// prose in the guide above, not a control. Two clicks land on a solution card
// with a severity chip and numbered fix steps, which is the guide answering a
// question rather than explaining a concept.
//
// This is the only page where the wizard is hydrated; on troubleshooting.mdx it
// is dead HTML.

export default {
  guide: 'relays-demystified',
  viewport: { w: 620, h: 1600 },

  card: 'text:Empty feed / No posts',
  cardFrom: 'div.rounded-2xl',
  padding: 8,
  // The solution card runs to 1676px — taller than the window, and a ribbon once
  // scaled into the teaser slot. Keep the top: title, severity chip and the first
  // fix steps, which is what reads at phone size anyway.
  maxHeight: 1080,

  seed: {
    completedGuides: ['what-is-nostr', 'keys-and-security', 'quickstart'],
    passedQuizzes: [],
    earnAllBadgesExcept: [],
  },

  steps: [
    { shoot: 'question', hold: 1.4 },
    { click: 'text:Empty feed / No posts', after: 700 },
    { shoot: 'narrowed', hold: 1.4 },
    { click: 'text:Just started using Nostr', after: 900 },
    { shoot: 'solution', hold: 2.6 },
  ],

  assert: {
    expr: `document.body.textContent.includes('Steps to Fix')`,
    equals: true,
  },
};
