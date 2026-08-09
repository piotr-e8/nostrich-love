# docs/clips — promo cuts

Two scripts that turn the site into something postable. Same shape as the
sandstr teaser, with one difference: this one builds **without a screen
recording**, because the strongest thing the site has to show is a still —
the same guide in seven scripts, Arabic included.

```
capture-shots.sh    # preview server -> shots/*.png (headless Chrome, 2x)
build-teaser.sh     # shots (+ optional recording) -> out/*.mp4 (ffmpeg only)
shots/              # 7 language frames, 5 page frames, 7 label PNGs (gitignored)
out/                # what you actually post
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
