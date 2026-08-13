// The PostFlowSimulator beat on /guides/relays-demystified/.
//
// Kept as a storyboard even though the component is under review: see
// walkthrough-cut.md. It is the reference example of a `film` beat — press one
// button, let the thing animate itself, capture what Chrome composites.

export default {
  guide: 'relays-demystified',
  viewport: { w: 620, h: 1600 },

  // Crop to the card that holds the Play button.
  card: 'text:Play',
  cardFrom: 'div.rounded-2xl',
  padding: 8,

  steps: [
    // One full cycle is 4 steps x 1800ms = 7.2s; 7.6s catches the loop back to step 0.
    { film: { name: 'post-flow', click: 'text:Play', ms: 7600 } },
  ],

  // The run is only good if the simulator actually advanced.
  assert: {
    expr: `[...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Pause')`,
    equals: true,
  },
};
