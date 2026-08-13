// Closing the Beginner level, for real.
//
// A level completes when every guide in it has been read AND every quiz in it
// passed at >=70% (gamification.ts:1084-1107). Beginner is 7 guides, 5 of which
// have quizzes. This seeds all 7 read and 4 of the 5 quizzes passed — leaving
// exactly the quiz we are about to answer — so `recordQuizResult` ->
// `checkLevelCertificates` -> BADGE_EARNED_EVENT -> BadgeEarnedModal fires on
// its own, in one flush, off a genuine pass.
//
// Nothing is unlocked by this and the video must not say otherwise: every guide
// on the site was already reachable. What the reader earns is the badge.
//
// The frame is the whole viewport because the modal is `fixed inset-0` with 50
// confetti particles falling across the page — crop to any element inside it and
// you lose the thing that makes the beat. 620x1120 is close to the 0.55 aspect
// of the teaser's card slot.

export default {
  guide: 'relays-demystified',
  viewport: { w: 620, h: 1120 },

  card: 'viewport',
  gpu: true,

  seed: {
    completedGuides: [
      'what-is-nostr', 'keys-and-security', 'quickstart', 'finding-community',
      'faq', 'relays-demystified', 'outbox-model',
    ],
    // The level's other four quizzes. The fifth — relays-demystified — is the
    // one on camera.
    passedQuizzes: ['what-is-nostr', 'keys-and-security', 'finding-community', 'outbox-model'],
    completedByLevel: {
      beginner: [
        'what-is-nostr', 'keys-and-security', 'quickstart', 'finding-community',
        'faq', 'relays-demystified', 'outbox-model',
      ],
      intermediate: [],
      advanced: [],
    },
    // Every other badge is pre-earned so nothing unrelated pops mid-take. The
    // two later level certificates are left unearned rather than faked: their
    // levels genuinely are not finished, so they cannot fire anyway.
    earnAllBadgesExcept: ['level-beginner', 'level-intermediate', 'level-advanced'],
  },

  steps: [
    { scrollTo: '[data-quiz]', after: 900 },
    // One deliberate miss, matching the quiz beat — otherwise the result screen
    // blurred behind this modal reads 100% while the beat before it showed 83%.
    // It also makes the better point: 5/6 is 83%, the pass mark is 70%, so the
    // level closes without a perfect score.
    { answer: 'wrong', after: 400 },
    { click: 'text:Next question', after: 350 },
    { answer: true },
    { click: 'text:Next question', after: 350 },
    { answer: true },
    { click: 'text:Next question', after: 350 },
    { answer: true },
    { click: 'text:Next question', after: 350 },
    { answer: true },
    { click: 'text:Next question', after: 350 },
    { answer: true },
    // Results screen, then the modal on top of it: confetti falls for ~2-3s and
    // the card scales in over 300ms. Once the last particle lands the page is
    // static and screencast stops sending, so hold the final frame — the card is
    // the beat, the confetti is only how it arrives.
    { film: { name: 'level-complete', click: 'text:See results', ms: 5000, hold: 1.8 } },
  ],

  assert: {
    expr: `document.body.textContent.includes('Beginner Level Complete')`,
    equals: true,
  },
};
