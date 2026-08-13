// The quiz beat on /guides/relays-demystified/.
//
// Two rewrites got this here, both worth knowing before changing it again.
//
// First it was shot state by state: two questions appeared, four were silently
// skipped, and it cut hard to the result. The jump read as a bug.
//
// Then it was filmed straight through all six. No jump, but nobody can read six
// questions in six seconds, and a flawless run hides the only thing that makes
// this quiz worth showing — it does not just mark you, it tells you what you got
// wrong and why.
//
// So: ONE question, answered WRONG, held long enough to read the correction.
// Then one answered right, briefly. Then the rest are cleared off camera and the
// result comes back on. Final score 5/6 = 83%, which still passes (the mark is
// 70%, gamification.ts:90) — that is the honest picture of using this thing, and
// a better one than a perfect score.

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
    // Q1 "What is a Nostr relay?" — long enough to read the question and the
    // three options before anything is clicked.
    { wait: 1600 },
    // The wrong pick lights red with an XCircle, the right one goes green beside
    // it, and a red "Not quite" panel slides down with the explanation. That
    // panel is the beat; it gets the longest hold in the whole video.
    { answer: 'wrong', after: 2800 },
    { click: 'text:Next question', after: 400 },
    // Q2, answered correctly — the green "Nice!" for contrast, shorter.
    { wait: 1000 },
    { answer: true, after: 1500 },
    { record: 'stop', name: 'two-questions', hold: 0.3 },

    // The remaining four are cleared with the camera off. Nobody needs to watch
    // them and filming them was what made the last cut unreadable.
    { click: 'text:Next question', after: 300 },
    { answer: true, after: 300 },
    { click: 'text:Next question', after: 300 },
    { answer: true, after: 300 },
    { click: 'text:Next question', after: 300 },
    { answer: true, after: 300 },
    { click: 'text:Next question', after: 300 },
    { answer: true, after: 300 },

    { record: 'start' },
    { click: 'text:See results', after: 1400 },
    { record: 'stop', name: 'score', hold: 1.5 },
  ],

  // 5 of 6 — one deliberate miss, and still a pass.
  assert: {
    expr: `document.querySelector('[data-quiz]').textContent.includes('5 / 6')`,
    equals: true,
  },
};
