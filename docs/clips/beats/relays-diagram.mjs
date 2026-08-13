// Beat 4: the diagram that answers "why can't my friend see my post?"
//
// Static HTML, no island — the clearest single picture of a real Nostr mechanic
// on the site, and the thing the rebuilt simulator was made to agree with. One
// frame, held; the assembly gives it a slow push so it does not read as a freeze.

export default {
  guide: 'relays-demystified',
  viewport: { w: 620, h: 1600 },

  card: 'find:figure|No shared relay',
  padding: 10,

  seed: {
    completedGuides: ['what-is-nostr', 'keys-and-security', 'quickstart'],
    passedQuizzes: [],
    earnAllBadgesExcept: [],
  },

  steps: [
    { shoot: 'no-shared-relay', hold: 3.2 },
  ],

  assert: {
    expr: `document.body.textContent.includes("Your posts stay here")`,
    equals: true,
  },
};
