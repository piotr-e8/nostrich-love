# The play cut — click, feedback, win

The first teaser (`build-teaser.sh`) argues *breadth*: the same guide in seven
scripts. This one argues **fun**: learning here feels like play, not like
reading. Every beat must pass one test — *does this frame make learning look
fun?* Motion from the first frame, a game loop in the middle, confetti at the
end, ~17 seconds, done.

Two disciplines that took five re-cuts to learn:

- **The boring thing never goes on screen.** An earlier cut opened on the
  guide's own prose to argue "not a wall of text" — footage of the thing the
  video is against. The "nuuuda" contrast belongs to the NOTE, which publishes
  as one post with the clip and sits directly above it in every client. Text
  makes the claim; the clip is the evidence.
- **This is not a product tour.** A faithful walkthrough (open page → diagram →
  wizard → quiz → level) is documentation, and documentation is the genre the
  thesis says we are not. Completeness is not a virtue here; pace is.

Everything below is still checked against the code, because the obvious version
of this video depicts a mechanic the site does not have. See "The unlock is
fiction".

## The guide: `/guides/relays-demystified/`

Beginner #6 of 7 (`src/data/learning-paths.ts:37-43` — the frontmatter
`category: "intermediate"` is *not* a level and must not be read as one).

**The simulator was rebuilt before this cut was storyboarded.** It used to animate
a chain — Your Device → Relay 1 → Relay 2 → Followers, with an arrow *between the
two relays* — which taught precisely the misconception the guide exists to
correct: two sections above it, "Why Posts Don't Sync" explains that relays never
hand posts to each other. It now fans out to two relays in parallel, draws no
connector between relays, and ends on a reader whose relay you do not publish to,
captioned "Never sees it". That last beat is the guide's actual lesson, and it is
the strongest three seconds available for the video.

Why it wins:

- **~550 prose words.** The shortest guide on the site that has a quiz
  (`quickstart` is shorter at 449 and has none). The video's whole claim is
  "not a wall of text", and here the scroll bar makes that claim by itself.
  For contrast, the site's median guide is ~1,240 words and the longest,
  `faq`, is 3,462 — do not claim the site has no long pages.
- **Two deterministic local animations.** `PostFlowSimulator` (mdx:106) and
  `TroubleshootingWizard` (mdx:234). Neither touches the network.
- **Three diagram figures** that stack at phone width: `DiagramCompare`
  (mdx:29) and two `DiagramNodes` (mdx:65, mdx:84).
- **A 6-question quiz** (`RelaysDemystifiedQuiz`, mdx:242) — the recorder
  already drives this shape.
- **The "what next" beat stays inside Beginner**, so nothing in frame has to
  imply a level was finished when it was not — unless we deliberately set up
  the state where it genuinely was. See below.

Runner-up: `zaps-and-lightning`. Better subject, one animation, and 1,737
prose words — the wrong footage for this argument.

## The unlock is fiction

**Nothing on this site is gated.** A reader can open the last advanced guide
as their first click. The level-gating layer was deleted; what survives is dead
code (`ContinueLearning.tsx:181` `const nextUnlocked = true`), a stale docstring
(`GuideCard.tsx:131`) and two orphaned locale strings (`en.json:3007-3008`,
"{level} is Locked"). The site's own copy says so out loud:
"Nothing is graded and nothing is locked" (`GamificationExplainer.tsx:362`).

A shot of a quiz pass "unlocking the next guide" would therefore be a lie about
our own product, on a network whose audience checks. Cut it.

**What is real, and is a better beat anyway:** finishing a *level* awards a
badge, and the award fires as a full-screen modal with confetti. Conditions
(`gamification.ts:1084-1107`): every guide in the level read (scroll past 80%,
`ProgressTracker.tsx:26`) **and** every quiz in the level passed at ≥70%
(`QUIZ_PASS_RATIO`, `gamification.ts:90`). Beginner = 7 guides, 5 quizzes.

So the video can end on a genuine level completion — provided the run really is
the last outstanding item. That is what the seeded profile is for. It is not a
mock-up: `recordQuizResult` → `checkLevelCertificates` → `BADGE_EARNED_EVENT` →
`BadgeEarnedModal`, all real, all in one flush.

## The seeded profile

Write `localStorage['nostrich-gamification-v1']` before navigating, with:

- all 7 beginner guides marked read: `what-is-nostr`, `keys-and-security`,
  `quickstart`, `finding-community`, `faq`, `relays-demystified`,
  `outbox-model`;
- `progress.quizResults` holding passes for the level's *other* four quizzes:
  `what-is-nostr`, `keys-and-security`, `finding-community`, `outbox-model`;
- **nothing** for `relays-demystified`.

Two problems solved at once: the amber prerequisite banner never mounts
(`PrerequisiteWarning.tsx:81-83` hides itself when prerequisites are complete —
no dismissal hack needed), and the quiz we film is genuinely the last thing the
level was waiting on.

Take the exact shape from `tests/gamification.test.ts:302-314`, which builds
this state already, rather than hand-writing the JSON.

## The cut

~17s at 1080×1920. Three beats and an end card; 0.3s dissolves.

| # | beat | source | ~s | what is on screen |
|---|---|---|---|---|
| 1 | **where we are** | `BEAT=relays-open`, in-point 0 | 2.0 | The guide's front door: title, `Beginner` badge, a slow push. Context, not prose — without it the video started from nowhere |
| 2 | **it moves** | `BEAT=relays-simulator`, in-point 2.0 | 5.0 | `PostFlowSimulator` already MID-cycle. Runs to its payoff: the reader on Relay C, "Never sees it" |
| 3 | **it's a game** | `BEAT=relays-quiz` | 6.2 | Click → green "Nice!" slides in → next → click wrong → **shake + red**, green lights beside it → next question, progress advancing. Game pace; nobody stops to read |
| 4 | **you win** | `BEAT=beginner-level`, in-point 1.2 | 4.2 | The 83% result screen, then the confetti modal: gold `BADGE EARNED!`, 🌱, "Beginner Level Complete" |
| 5 | end card | lockup | 2.6 | learn Nostr / by doing it / nostrich.love |

The wrong answer being visibly wrong required a PRODUCT fix, found while cutting
this: the Tailwind palette never defined `error`, so all 153 `error-*` usages —
every quiz's wrong pick, the error toasts, NIP05Checker's failure card — compiled
to nothing and rendered white. Filming the quiz is what surfaced it. The fix
(palette entry + a shake animation on the wrong pick) lives in the site, not in
the video.

The quiz take answers all six questions (four with the camera off) so the 83%
behind the modal is real and matches the one miss shown on camera.

An earlier nine-beat version of this table walked the whole guide — open, scroll,
diagram, wizard, quiz, level. It was accurate and it was a product tour; see the
top of this file for why that was the wrong genre. The recorded beats it used
still exist under `beats/` and `out/` — `relays-open`, `relays-diagram`,
`relays-wizard` — and are standalone-post material per `series.md`.

## Not in frame

- **`RelayExplorer`** (mdx:128) — opens real WebSockets on mount; measured 5-6
  of 19 relays online, `relay.damus.io` among the red ones. A wall of "Offline ·
  Unknown" is the opposite of the point.
- **`RelayWorldMap`** (mdx:55) — a graph-paper rectangle called a world map,
  with a subtitle that renders as broken copy.
- **`/tools/key-generator`** — same standing reason as the first teaser
  (`README.md`): advertising it contradicts our own security guide.
- **The words "unlock", "locked", "certificate".** The first two describe
  nothing; the third is internal vocabulary that never reaches a reader — the
  UI says "Badge Earned!".
- **`/progress`** (renders 107% and a raw slug) and **`/badges`** (no inbound
  link anywhere on the site).
- **The prerequisite banner** — the seeded profile removes it; if it ever shows,
  it reads as a gate.

## What the tooling can and cannot do today

`record-quiz.mjs` does beats 6-7 as they stand: `GUIDE=relays-demystified node
docs/clips/record-quiz.mjs` (English only — the control labels at :259/:270 are
English literals). Beats 3 and 5 are motion and need a second recorder.

**Measured, 2026-08-12** (probe scripts kept out of the repo; numbers from a
running `astro preview` and headless Chrome at 620×1600, deviceScale 2):

| capture path | rate |
|---|---|
| `Page.captureScreenshot`, png, clipped to the card | **2.8 fps** (353ms/frame, ~97KB) |
| same, jpeg q80 | 5.0 fps |
| same, png, full 620×1600 viewport | 1.2 fps |
| same, png, clip, deviceScale 1 | 7.5 fps |
| `Page.startScreencast`, jpeg | emits **on change only** |

So a screenshot loop cannot record motion at any quality worth shipping. But
the fix is not "capture faster" — it is `Page.startScreencast`, which pushes a
frame whenever Chrome composites one. Over a 6s simulator cycle that is 23-39
frames, ~90% of them distinct, arriving in **bursts around each state change**
(11 frames inside one 460ms transition, 20-30ms apart) with near-silence in
between. That is exactly the shape of the animation: 4 steps, 1500ms apart,
150ms CSS transitions.

**The real defect in the current pipeline is timing, not frame rate.** Both
stitchers give every frame a fixed `duration 0.42` (`record-quiz.mjs:341`,
`build-teaser.sh:126`), which ignores when the frame was actually produced. Same
capture, encoded both ways: **7.3s with the frames' own
`metadata.timestamp`, 10.1s flat** — a third longer, with the pauses and the
transitions given equal weight. Encode from timestamps and the beat plays at the
speed the reader sees.

Work needed, in order:

1. **A motion recorder.** `Page.startScreencast({format:'jpeg', quality:90})`,
   a `Page.screencastFrame` handler that buffers `{data, metadata.timestamp}`
   and acks each frame, then a concat list whose durations are the deltas
   between consecutive timestamps. Prototyped and working.
2. **Two capture gotchas it has to carry** — both cost a take if missed:
   - Screencast frames come back at **CSS-pixel size** (620×1600) unless Chrome
     is launched with `--force-device-scale-factor=2`; the emulation override's
     `deviceScaleFactor` alone does not affect them. `record-quiz.mjs` already
     passes the flag (:197). Derive the crop scale from a real frame rather than
     assuming it.
   - Screencast captures the **viewport**, not a clip, so the crop happens in
     ffmpeg afterwards — which means the card must not move during the take.
     It does: the page grows from 11,697px to 21,101px as the below-fold islands
     hydrate, settling ~4.7s after navigation, and scrolling triggers more of it.
     A take started too early framed the card 154px off, losing its title off the
     top and dragging the next section's heading in at the bottom. Wait ~6.5s,
     scroll, then hold until two rect readings 700ms apart agree — and re-measure
     after the take, failing the run if it moved.
3. **A non-quiz driver.** The recorder addresses `[data-quiz]` only
   (`record-quiz.mjs:125`) and its interaction model is "click the option whose
   label matches the answer key" (:50-57). Generalise to a storyboard file:
   `[{selector|text, action, waitMs, shoot}]`, root as an env var.
4. **A profile seed step.** Chrome starts on a fresh profile; add
   `Page.addScriptToEvaluateOnNewDocument` writing the gamification blob before
   the first navigation.
5. **Splicing an mp4 beat.** `build-teaser.sh` has no path for one: its only mp4
   input is the `SRC` screen-recording branch, whose `crop=1440:2596:176:400`
   (:213) needs a ≥1616×2996 source and errors on our 1080×1950 output. Needs a
   `clipbeat()` helper that skips the crop and only scales, masks and captions.

A scroll beat (beat 2) is the same machinery as (1) with `window.scrollTo` in
small steps — the screencast emits on every composite, so scrolling produces
frames without any extra work.

## Building it

```bash
npm run build && npm run preview
for b in relays-simulator relays-quiz beginner-level; do
  BEAT=$b node docs/clips/record-beat.mjs
done
./docs/clips/build-walkthrough.sh    # -> out/nostrich-walkthrough.mp4
```

**The quiz shows one wrong answer, at game pace.** Its history is the history of
this whole video, compressed: shot state-by-state it jump-cut over four
questions; filmed straight through, six questions passed faster than anyone can
read; paced for reading the correction, it was a four-second hold in a video
about fun. Now it is a loop — one right (green "Nice!"), one wrong (red flash,
green lights beside it), next — and "it explains what you missed" is a sentence
for the note, not a beat. The take still finishes all six off camera, so the
score is a real **83% — 5 of 6**, above the 70% pass mark (`QUIZ_PASS_RATIO`,
`gamification.ts:90`).

**The win is genuine.** The level beat's seed leaves the relays quiz as the only
outstanding item in Beginner and misses the same one question, so
`recordQuizResult → checkLevelCertificates → BADGE_EARNED_EVENT` fires off a real
pass, and the result screen blurred behind the modal says 83% rather than
contradicting the beat before it.

Beats are recorded longer than they are cut. The in-points and durations live in
the `BEATS` table in `build-walkthrough.sh`, so re-timing the video does not mean
re-recording it.

The result is 1080×1920, **18.8s, ~2.3MB** — no captions (the note above the
video is the caption), 0.3s dissolves between beats.

## Known rough edges

- **The crop is one size for the whole beat**, so a card that is short in some
  states shows the page behind it in those frames — visible under the quiz card
  before an answer expands it. Fixing it means padding per frame, which is what
  `record-quiz.mjs` does between its stills.

## What is left over

Four storyboards record cleanly and are in no cut: `relays-open`,
`relays-diagram`, `relays-wizard`, `zaps-simulator`. Each is a usable standalone
post on the two-a-week cadence in `series.md` — one interaction or one figure,
one screen, no assembly needed.

Frames of equal byte size mean identical frames — the same cheap smoke test that
caught the blank-PNG bug in `record-quiz.mjs`. Check the images, not the console.
