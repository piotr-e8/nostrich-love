# docs/clips — promo cuts

Two cuts, two arguments, one visual language.

**The teaser** argues *breadth*: the same guide in seven scripts, Arabic
included. It builds without a screen recording, because that claim is strongest
as a still.

**The walkthrough** argues *method*: one guide, opened and finished — you do not
read this site, you work through it. It is built from beats recorded by driving
headless Chrome.

```
capture-shots.sh     # preview server -> shots/*.png (headless Chrome, 2x)
build-teaser.sh      # shots (+ optional recording) -> out/nostrich-teaser-vertical.mp4
record-beat.mjs      # a storyboard in beats/ -> out/<beat>.mp4
build-walkthrough.sh # those beats -> out/nostrich-walkthrough.mp4
beats/               # storyboards: what to click, what to film, what to seed
shots/               # captured frames, per beat (gitignored)
out/                 # what you actually post
```

## Build it

```bash
npm run build && npm run preview      # serves on :4321
PORT=4321 ./docs/clips/capture-shots.sh
./docs/clips/build-teaser.sh
```

About four minutes end to end.

`shots/` and `out/` are gitignored. The captures are not committed on purpose:
they record how the site looks right now, so a versioned copy would go stale on
the next design change and quietly build a teaser of the old pages. Re-run
`capture-shots.sh` instead — it is deterministic.

## Output

| file | what it is |
|---|---|
| `out/nostrich-teaser-vertical.mp4` | 1080×1920, 16.7s, ~4.9 MB — the main post |
| `out/nostrich-loop-languages.mp4` | 1080×1920, 3.4s, ~1.7 MB — the language montage alone, for replies |

Both silent (with a silent AAC track for players that insist on one), H.264
high / yuv420p / `+faststart`, so they inline in every Nostr client.

## The cut

| beat | source | caption |
|---|---|---|
| 1 | 7 language stills, ~0.43s each | Seven languages. One guide. |
| 2 | /guides/protocol-comparison | Three protocols, compared. |
| 3 | /nostr-vs-twitter | Including what you give up. |
| 4 | /guides/relays-demystified | Diagrams, not walls of text. |
| 5 | /follow-pack | 527 accounts to start with. |
| 6 | /glossary | Every term, linked to its guide. |
| 7 | end card | learn Nostr — in your language / nostrich.love |

Every content beat is cropped to a window picked by eye, not to the top of the
page: the protocol table, the diagram components and the follow-pack grid all
sit well below the fold, and several guide tops carry a prerequisite banner that
is interstitial rather than content. The `crop-y` column in `STILLS` is where
that lives.

The montage leads because it is the one claim no competitor page can make in a
still. English is held roughly twice as long as the rest so the eye locks onto
the layout before the script starts changing underneath it.

## The quiz beat, recorded without filming anything

```bash
node docs/clips/record-quiz.mjs            # GUIDE=relays-demystified to pick another
```

Drives headless Chrome over the DevTools protocol, dispatches real mouse events
through the quiz, and captures one frame per state — `shots/quiz-*.png` plus
`out/quiz-beat.mp4` (1080 wide, ~5s, ends held on the results screen). No
dependencies: Node 24 ships a global `WebSocket`, which is all CDP needs.

It reads the correct answers out of `src/i18n/locales/en.json`, the same file the
quiz renders from, so the beat ends on 6/6 rather than on whichever option
happened to come first. The score on the final frame is genuinely what the
component computed — the run is real, it just knows the answers.

Two things this ran into:

- **`clip` is in page coordinates, `getBoundingClientRect()` is not.** The quiz
  sits ~7000px down the document, so passing the rect straight through aimed the
  camera at blank space and wrote eight identical white PNGs — while the run
  logged a real "6 / 6" read from the DOM. The logs looked perfect. Add
  `window.scrollY` and set `captureBeyondViewport: true`. Check the images, not
  the console.
- **Frames of equal byte size mean identical frames.** That is the cheapest smoke
  test there is, and it is what caught the above.

Preferred over a screen recording for this beat: deterministic, so it can be
rebuilt after a design change instead of re-filmed; 2x and clipped to the card,
so no cursor or OS chrome; and re-runnable per locale. What it cannot give you is
the feel of a hand moving.

## Any beat, from a storyboard — `record-beat.mjs`

`record-quiz.mjs` can only drive a `[data-quiz]` card and only produces discrete
post-click stills. `record-beat.mjs` is the general form: the interaction is data
in `beats/<name>.mjs`, and there are two capture modes.

```bash
BEAT=relays-simulator node docs/clips/record-beat.mjs   # -> out/relays-simulator.mp4
BEAT=relays-quiz      node docs/clips/record-beat.mjs
BEAT=beginner-level   node docs/clips/record-beat.mjs
BEAT=zaps-simulator   node docs/clips/record-beat.mjs
```

A storyboard names the guide, the element to crop to, an optional localStorage
seed, and a list of steps — `shoot` for one frame per state, `film` for
`Page.startScreencast` around a single action, `record: 'start'` / `record:
'stop'` to film across a whole sequence of them, plus `click`, `answer`,
`scrollTo` and `wait`.

Reach for `record` over `shoot` whenever the states belong to one flow — and note
that `record` can be started and stopped more than once in a storyboard, which is
how the quiz shows two questions properly and then skips the other four off
camera.

`answer: true` picks the correct option; **`answer: 'wrong'` picks a wrong one on
purpose**, which the quiz beat needs. A flawless run hides what the quiz is for:
it does not just mark you, it tells you what you got wrong and why. The wrong pick
lights red with an `XCircle`, the right one goes green beside it, and a "Not
quite" panel slides down with the explanation. Selectors
are written as `text:Play` or `contains:Pay Zap`, against what is on screen
rather than against class names. An `assert` at the end fails the run if the take
did not do what it claimed: `relays-quiz` asserts the card really says `6 / 6`,
`beginner-level` that the modal really says `Beginner Level Complete`.

`card: 'viewport'` frames the whole window instead of one element — what a
`fixed inset-0` overlay needs, since cropping to anything inside the badge modal
would cut the confetti falling across the page.

`answer` clicks the correct option, read from the same locale file the quiz
renders from. The run is real; it just knows the answers.

### Assembling them

```bash
./docs/clips/build-walkthrough.sh    # -> out/nostrich-walkthrough.mp4
```

`clipbeat()` is the path `build-teaser.sh` never had: it takes a finished mp4
rather than stills or a screen recording. Each beat arrives 1080 wide at whatever
height its card happened to be — 1658 to 2340px here — so it is fitted to the
slot's width and centred, not stretched. Taller than the slot is cropped from the
top; shorter sits on the blurred backdrop, which is why the fill is not a flat
colour: the badge-modal beat is dark and every other beat is white.

The beat table at the bottom of the file holds in-points and durations, so
re-timing the cut does not mean re-recording it.

**No captions on this one, deliberately.** The teaser needs them — it is a
montage of stills with no through-line, so each frame has to be told what it is.
This cut is one continuous walk through one guide; the screen already says what
is happening and a line of ad copy over it only argues with the picture. The mark
and the standing footer stay, so a lifted frame still names the site.

**Cross-faded, not butt-joined.** Seven hard cuts between takes of the same white
card read as a slideshow of screenshots. A 0.3s dissolve makes it one walk. That
rules out the concat demuxer — it cannot overlap — so assembly is a chain of
`xfade`, each offset by everything before it minus one fade per join.

Three traps this file carries:

- **`zoompan` feeding a `split` hangs the graph.** The diagram beat encodes in 9s
  without it and was still running after twenty minutes with it, even capped at
  90 output frames. build-teaser.sh gets away with zoompan because it feeds a
  `-loop 1` still and splits afterwards. The obvious fix does not exist either:
  `crop` takes `t` in x/y but not in w/h, so an animated crop cannot change size
  over time. The push therefore renders as its own pass to an intermediate file.
- **A straight apostrophe killed the build** while captions still existed: it
  closes `drawtext`'s own quoting and ffmpeg parses the rest of the graph as an
  option value. Worth knowing before adding any text back.
- **`ffprobe -of csv=p=0` appends a trailing comma** for a single field, so
  `stream=height` came back as `1950,` and reached shell arithmetic as a syntax
  error. Use `-of default=nw=1:nk=1`.

**Why `film` exists.** `Page.captureScreenshot` tops out at 2.8fps for a clipped
card (353ms/frame, measured; 1.2fps for a full viewport), so a screenshot loop
cannot record motion. `startScreencast` pushes a frame whenever Chrome
composites one — bursts 20-30ms apart through each transition, silence in
between — and every frame carries `metadata.timestamp`. Encoding from those
timestamps gave 7.3s for a beat that the flat 0.42s-per-frame stitcher stretched
to 10.1s.

**Seeding is not faking.** Everything the site knows about a reader is
localStorage, so the storyboard writes the gamification blob before the first
navigation and the run proceeds for real. It is what suppresses the amber
prerequisite banner (it hides itself when its prerequisites are read) and stops
an unrelated badge modal from firing mid-take. `earnAllBadgesExcept` leaves
exactly one award outstanding, which is how the level-completion beat gets shot
honestly: the quiz in frame really is the last thing the level was waiting on.

### What this cost to get right

Each of these silently ruined a take before it was found:

- **`--lang=en-US` does not reach the renderer** — it still reports `--lang=pl`,
  and components call `toLocaleString()` with no locale, so the zap presets
  rendered "10 000" on an English page. `Emulation.setLocaleOverride` over CDP
  does work.
- **Screencast frames come back at CSS-pixel size** unless Chrome is launched
  with `--force-device-scale-factor`; the emulation override's
  `deviceScaleFactor` does not affect them. Derive the crop scale from a real
  frame instead of assuming it.
- **The page keeps growing after load** — 11,697px to 21,101px on
  relays-demystified, settling ~4.7s in as the below-fold islands hydrate. Record
  before that and the card slides out from under the crop.
- **The site scrolls smoothly**, so a rect read straight after `scrollBy` catches
  the page mid-glide — 117px short. The recorder forces `scroll-behavior: auto`.
- **`scrollIntoView` on click moves the page.** Centring the *button* shoved the
  card 104px up, because Play sits low in the simulator. Clicks never scroll now;
  a target outside the viewport is a storyboard bug and fails the run.
- **Cards grow mid-take.** The zap confirmation slides in on click and dismisses
  itself 3s later, so measuring before and after both return the small card and
  the confirmation gets cropped off. The crop is the union of every size the card
  takes, watched with a `ResizeObserver` — reset once the layout settles, since
  it is measured in viewport coordinates and the settling loop scrolls.
- **`SIGKILL` on the launcher leaves the renderer helpers running.** They pile up
  across takes. `Browser.close` first, then `pkill` on the run's own profile dir.
- **On screen is not the same as clickable.** RelayExplorer slides a "Relay
  status check complete!" toast over the bottom of the viewport, and a click
  aimed at the quiz's "Next question" landed on the toast instead — the quiz
  stayed on question 1 with every option disabled, and the run only failed three
  steps later with a misleading message. Every click now asks
  `document.elementFromPoint` what is actually under the cursor, waits up to 6s
  for a transient overlay to clear, and fails on one that does not.
- **Relay sockets cost more than they look.** `Network.setBlockedURLs` on
  `wss://*` is on by default (`network: true` to allow them). It is not only
  determinism — how many of the 19 relays answer differs every run — it is
  throughput: with the sockets open the badge-modal beat captured 10 frames in
  5s, and with them blocked, **75**. The main thread was busy, so Chrome was
  compositing at 2fps.
- **`--disable-gpu` starves expensive scenes.** The badge modal stacks 50
  animated confetti particles over a `backdrop-blur-sm` backdrop; software
  rasterising that halved the frame rate again. `gpu: true` per beat.

## Adding live beats

Record a walkthrough, drop it in here, and point `SRC` at it:

```bash
SRC="docs/clips/Nagranie.mov" ./docs/clips/build-teaser.sh
```

The `RECORDED` table in `build-teaser.sh` is where in/out times, crops, speeds
and captions live — it is empty of real timings on purpose, since they depend on
what got recorded. Worth capturing: switching language mid-guide (the switcher
keeps your place), a quiz being answered, the key generator running.

## Things that will bite you

**ffmpeg cannot shape Arabic or Devanagari.** `drawtext` lays glyphs out in
codepoint order, so `العربية` came out as `ةيبرعلا` and Hindi conjuncts broke
apart. The seven language labels are therefore rendered by headless Chrome into
transparent PNGs (`shots/label-*.png`) and composited as images. If you add a
locale, add it to the `label` calls in `capture-shots.sh` — do not put it in a
`drawtext`.

**The brand mark comes from `public/logo.png`, not a screenshot.** Cropping the
header out of a page capture drags the page's white background in with it, which
shows as a box behind the logo on a dark frame. The repo asset is transparent.

**The lockup capture needs a window ≥640px.** `LogoText` is `hidden sm:block`,
so a narrower shot silently captures the bird without the wordmark.

**Captions longer than 32 characters run off the frame** and ffmpeg clips them
without complaining, so a broken caption ships looking deliberate. `CAP_MAX`
fails the build instead — verified by feeding it a 49-character caption.

**/tools/key-generator is deliberately not in the cut.** The page invites you to
"generate a Nostr identity right here in your browser", which is precisely what
/guides/keys-and-security and the Nostr articles tell people not to do. It is a
demo. Advertising it would show the site contradicting its own security advice.

**`SY=400` is not guarding anything any more.** It was chosen to clear the daily
streak banner, which mounted site-wide and overlapped the top of every page. That
banner is gone. Because it was `position: fixed` it never pushed content down, so
removing it did not move anything and the crop still lands 6 CSS px below the top
of the article card — verified, not assumed. There is now nothing stopping you
raising the window if you want the card's top edge in frame.
