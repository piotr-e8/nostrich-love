#!/usr/bin/env bash
# Capture the stills build-teaser.sh needs, straight from the preview server.
#
#   npm run build && npm run preview     # note the port it prints (4321)
#   PORT=4321 ./capture-shots.sh
#
# Headless Chrome at 2x gives a crisp frame a screen recording cannot — the
# language montage in particular has to survive being scaled to a 1080-wide
# card, and CJK/Arabic glyphs go to mush if the source is a 1x capture.
#
# Chrome does not exit after --screenshot in headless=new, so each shot is
# launched detached and killed once the file lands. One at a time on purpose:
# parallel instances against one dev server reliably produced empty files.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-4321}"
BASE="${BASE:-http://localhost:${PORT}}"
SHOTS="$HERE/shots"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
mkdir -p "$SHOTS"

[ -x "$CHROME" ] || { echo "Chrome not found at $CHROME — set CHROME=..." >&2; exit 1; }
curl -sf -o /dev/null "$BASE/" || { echo "Nothing serving at $BASE — run 'npm run preview' first." >&2; exit 1; }

grab() { # name url width height [dpr]
  local name=$1 url=$2 w=$3 h=$4 dpr=${5:-2}
  local attempt
  # Retried because it is genuinely flaky: a tall capture failed once mid-run
  # against a page that served a perfectly good 200, then succeeded in 9s on a
  # retry. Chrome instances from the previous shot are still being reaped, and
  # with `set -e` one such miss killed the whole run and left half the shots
  # stale from a previous build — which is worse than slow.
  for attempt in 1 2 3; do
    local prof; prof="$(mktemp -d)"
    rm -f "$SHOTS/$name.png"
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars --no-first-run \
      --no-default-browser-check --user-data-dir="$prof" \
      --force-device-scale-factor="$dpr" --window-size="$w,$h" \
      --virtual-time-budget=8000 --screenshot="$SHOTS/$name.png" "$url" >/dev/null 2>&1 &
    local pid=$! i
    for i in $(seq 1 60); do [ -s "$SHOTS/$name.png" ] && break; sleep 1; done
    sleep 1; kill -9 "$pid" 2>/dev/null || true
    pkill -9 -f "$prof" 2>/dev/null || true
    rm -rf "$prof"
    if [ -s "$SHOTS/$name.png" ]; then
      echo "  · $name (${i}s${attempt:+$([ "$attempt" -gt 1 ] && echo ", attempt $attempt")})"
      return 0
    fi
    [ "$attempt" -lt 3 ] && { echo "  ~ $name retrying" >&2; sleep 3; }
  done
  echo "  ! $name FAILED after 3 attempts" >&2
  return 1
}

echo "Language montage — the same guide, seven times:"
# Portrait, phone-ish aspect: this is the beat that has to read as "the same
# page, a different script" at a glance, so the framing is identical for all
# seven and only the text changes. Arabic is included precisely because it
# mirrors — that is the point of the shot.
grab lang-en "$BASE/guides/what-is-nostr/"    900 1600
grab lang-pl "$BASE/pl/guides/what-is-nostr/" 900 1600
grab lang-es "$BASE/es/guides/what-is-nostr/" 900 1600
grab lang-de "$BASE/de/guides/what-is-nostr/" 900 1600
grab lang-zh "$BASE/zh/guides/what-is-nostr/" 900 1600
grab lang-ar "$BASE/ar/guides/what-is-nostr/" 900 1600
grab lang-hi "$BASE/hi/guides/what-is-nostr/" 900 1600

# Content pages, captured tall. The material worth showing (the protocol table,
# the diagram components, the follow-pack grid) sits well below the fold, and a
# viewport-height shot cannot reach it — build-teaser.sh crops a window out of
# these by y offset.
#
# NOT captured: /tools/key-generator. The page invites you to "generate a Nostr
# identity right here in your browser", which is the exact thing
# /guides/keys-and-security and the Nostr articles tell people not to do. It is
# a demo, and putting it in a teaser would advertise the site contradicting
# itself. See docs/clips/README.md.
echo "Content pages (tall — the good material is below the fold):"
grab proto      "$BASE/guides/protocol-comparison/"  900 5200
grab compare    "$BASE/nostr-vs-twitter/"            900 5200
grab relays     "$BASE/guides/relays-demystified/"   900 5200
grab followpack "$BASE/follow-pack/"                 900 5200
grab glossary   "$BASE/glossary/"                    900 5200

# Language labels, rendered by Chrome rather than drawn by ffmpeg.
#
# ffmpeg's drawtext does no bidirectional or complex-script shaping: it lays
# glyphs out in codepoint order, so "العربية" came out as "ةيبرعلا" and
# Devanagari conjuncts broke apart. Chrome shapes them correctly, and a
# transparent screenshot composites into the video exactly like a drawtext layer.
label() { # code text
  local code=$1 text=$2
  local prof; prof="$(mktemp -d)"
  local html="$prof/label.html"
  cat >"$html" <<HTML
<!doctype html><meta charset="utf-8">
<body style="margin:0;background:transparent;height:90px;display:flex;align-items:center">
<div style="font:700 44px/1 -apple-system,'Helvetica Neue',sans-serif;
            color:#8B5CF6;white-space:nowrap">${text}</div>
HTML
  rm -f "$SHOTS/label-$code.png"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --no-first-run \
    --no-default-browser-check --user-data-dir="$prof" \
    --default-background-color=00000000 --force-device-scale-factor=3 \
    --window-size=700,90 --virtual-time-budget=4000 \
    --screenshot="$SHOTS/label-$code.png" "file://$html" >/dev/null 2>&1 &
  local pid=$! i
  for i in $(seq 1 30); do [ -s "$SHOTS/label-$code.png" ] && break; sleep 1; done
  sleep 1; kill -9 "$pid" 2>/dev/null || true
  rm -rf "$prof"
  echo "  · label-$code"
}

echo "Language labels (Chrome shapes them; ffmpeg cannot):"
label en English
label pl Polski
label es "Español"
label de Deutsch
label zh "中文"
label ar "العربية"
label hi "हिन्दी"

ls -la "$SHOTS"
