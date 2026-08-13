// The quiz beat on /guides/relays-demystified/ — a game loop, not an exam.
//
// The cut this feeds argues one thing: learning here feels like play. So the
// quiz is filmed as click -> feedback -> click -> feedback, at game pace:
//
//   Q1 answered RIGHT  -> green "Nice!" slides in        (the hit)
//   Q2 answered WRONG  -> red flash, green lights beside  (missing is fine too)
//   Next question      -> progress advances, Q3 lands     (and so on...)
//
// Nobody on camera stops to read. The "it explains what you got wrong" claim
// lives in the note text above the video, not in a four-second hold — three
// earlier versions of this beat died on exactly that: shot state-by-state it
// jump-cut, filmed straight through it was unreadable, and paced for reading
// it was the slowest beat of a video about fun.
//
// The remaining questions are cleared with the camera off, so the take still
// ends on a real 5/6 = 83% — consistent with the result screen the win beat
// (beats/beginner-level.mjs) shows behind its confetti modal.

export default {
  guide: 'relays-demystified',
  viewport: { w: 620, h: 1600 },

  card: '[data-quiz]',
  padding: 8,

  seed: {
    completedGuides: [
      'what-is-nostr', 'keys-and-security', 'quickstart', 'finding-community',
      'faq', 'relays-demystified', 'outbox-model',
    ],
    passedQuizzes: [],
    earnAllBadgesExcept: [],
  },

  steps: [
    { record: 'start' },
    { wait: 900 },
    { answer: true, after: 1400 },
    { click: 'text:Next question', after: 500 },
    { wait: 700 },
    { answer: 'wrong', after: 1400 },
    { click: 'text:Next question', after: 700 },
    { record: 'stop', name: 'game-loop', hold: 0.4 },

    // Off camera: finish the run so the score is real.
    { answer: true, after: 300 },
    { click: 'text:Next question', after: 300 },
    { answer: true, after: 300 },
    { click: 'text:Next question', after: 300 },
    { answer: true, after: 300 },
    { click: 'text:Next question', after: 300 },
    { answer: true, after: 300 },
    { click: 'text:See results', after: 800 },
  ],

  // One miss on camera, five right — 83%, and still a pass.
  assert: {
    expr: `document.querySelector('[data-quiz]').textContent.includes('5 / 6')`,
    equals: true,
  },
};
