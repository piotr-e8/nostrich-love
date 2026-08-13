#!/usr/bin/env bash
# Assemble the walkthrough cut: one guide, opened and finished.
#
#   node docs/clips/record-beat.mjs   (once per BEAT, see README)
#   ./docs/clips/build-walkthrough.sh -> out/nostrich-walkthrough.mp4 (1080x1920)
#
# build-teaser.sh builds the OTHER cut — seven languages, one guide — from stills
# and an optional screen recording. It has no path for an externally produced mp4
# beat: its only video input is the SRC screen-recording branch, whose
# crop=1440:2596:176:400 assumes an 1800x3200 capture and errors on anything
# smaller. This file is that missing path, kept separate rather than bolted on,
# because the two cuts take different inputs and argue different things.
#
# Frame layout, colours and lockup are deliberately identical to build-teaser.sh
# so the two read as one account's output.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/out"
WORK="${WORK:-$HERE/.work-walkthrough}"
mkdir -p "$OUT" "$WORK"

BOLD="/System/Library/Fonts/Supplemental/Arial Bold.ttf"
REG="/System/Library/Fonts/Supplemental/Arial.ttf"

CANW=1080; CANH=1920
CARDW=860; CARDH=1550; CARDX=110; CARDY=200; CARDR=40
CAPY=84
FOOTY=1782
DISCY=1858

FOOTER="free · open source · no account · 7 languages"
ACCENT="0x8B5CF6"
MUTED="0x8A8A96"
BG="0x0F0A1A"

MARK="${MARK:-$HERE/../../public/logo.png}"
LOCKUP="scale=52:52:flags=lanczos"

AMBIENT="scale=180:320,gblur=sigma=16,scale=${CANW}:${CANH}:flags=bilinear,\
eq=brightness=-0.62:saturation=1.6,colorlevels=romin=0.06:gomin=0.055:bomin=0.085,vignette=PI/4"

mask() { # w h r out
  local w=$1 h=$2 r=$3 o=$4
  [ -s "$o" ] && return 0
  ffmpeg -v error -y -f lavfi -i "color=c=black:s=${w}x${h}" -frames:v 1 \
    -vf "format=gray,geq=lum='if(lte(pow(max(0\,max(${r}-X\,X-(W-1-${r})))\,2)+pow(max(0\,max(${r}-Y\,Y-(H-1-${r})))\,2)\,${r}*${r})\,255\,0)'" \
    "$o"
}

# No captions on this cut, deliberately.
#
# The teaser needs them: it is a montage of stills with no through-line, so each
# frame has to be told what it is. This one is a single continuous walkthrough of
# one guide — the screen already says what is happening, and a line of ad copy
# over the top only argues with it. What stays is the mark and the standing
# footer, so a frame lifted out of context still names the site.
chrome() {
  echo "drawtext=fontfile='${BOLD}':text='nostrich.love':fontsize=40:fontcolor=${ACCENT}:x=${CANW}-${CARDX}-tw:y=${FOOTY}+8:shadowcolor=black@0.6:shadowx=0:shadowy=2,\
drawtext=fontfile='${REG}':text='${FOOTER}':fontsize=26:fontcolor=${MUTED}:x=${CARDX}:y=${DISCY}"
}

# ---- one recorded beat -> one card on the canvas ------------------------------
#
# The beats come out of record-beat.mjs at 1080 wide and whatever height their
# card happened to be — 1658 to 2340 px here — so each one is fitted to the
# slot's width and then centred vertically rather than stretched. A beat taller
# than the slot is cropped from the top (the card's own header is what matters);
# a shorter one sits centred on the blurred backdrop, which is why the pad is not
# a flat colour: the modal beat is dark and every other beat is white, and one
# fill colour cannot serve both.
clipbeat() { # name file in dur [zoom]
  local name=$1 file=$2 in=$3 dur=$4 zoom=${5:-}
  [ -s "$file" ] || { echo "missing beat: $file — run record-beat.mjs first" >&2; exit 1; }

  local sw sh fitH cardH offY
  # `-of csv=p=0` appends a trailing comma for a single field, which then reaches
  # the arithmetic below as "1950," and kills the script. nokey/noprint_wrappers
  # returns the bare number.
  sw=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=nw=1:nk=1 "$file")
  sh=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=nw=1:nk=1 "$file")
  fitH=$(( (CARDW * sh / sw + 1) / 2 * 2 ))          # width-fitted height, even
  cardH=$fitH
  [ "$cardH" -gt "$CARDH" ] && cardH=$CARDH
  offY=$(( CARDY + (CARDH - cardH) / 2 ))

  local m="$WORK/mask_${CARDW}x${cardH}r${CARDR}.png"
  mask "$CARDW" "$cardH" "$CARDR" "$m"

  # A still beat would read as a freeze, so it gets a slow push; motion beats are
  # left alone because the content changing IS the motion.
  #
  # The push runs as its OWN ffmpeg pass, and both halves of that are forced:
  #   - zoompan feeding a `split` hangs the graph. The same beat encodes in 9s
  #     without it and was still running after twenty minutes with it, even
  #     capped at 90 output frames. build-teaser.sh gets away with zoompan
  #     because it feeds a `-loop 1` still and splits afterwards.
  #   - the obvious replacement, an animated crop, is not possible: crop takes
  #     `t` in x/y but not in w/h, so the crop SIZE cannot change over time.
  # Rendering the push to an intermediate file sidesteps both.
  local motion="scale=${CARDW}:${fitH}:flags=lanczos,crop=${CARDW}:${cardH}:0:0"
  local src="$file" ss="$in" tt="$dur"
  if [ -n "$zoom" ]; then
    local frames=$(( ${dur%.*} * 30 ))
    ffmpeg -v error -y -ss "$in" -t "$dur" -i "$file" \
      -vf "${motion},zoompan=z='1+0.05*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${CARDW}x${cardH}:fps=30" \
      -c:v libx264 -crf 15 -preset veryfast -r 30 "$WORK/${name}_push.mp4"
    src="$WORK/${name}_push.mp4"; ss=0; motion="null"
  fi

  ffmpeg -v error -y -ss "$ss" -t "$tt" -i "$src" -i "$m" -i "$MARK" \
    -filter_complex "\
[0:v]${motion},fps=30,format=gbrp[card];\
[card]split[k1][k2];\
[k1]${AMBIENT}[bg];\
[k2]format=yuva444p[fgs];[1:v]format=gray[mk];[fgs][mk]alphamerge[fg];\
[2:v]${LOCKUP}[lk];\
[bg][fg]overlay=${CARDX}:${offY}:format=auto[v1];\
[v1][lk]overlay=${CARDX}:${FOOTY}-3:format=auto[v2];\
[v2]$(chrome),format=yuv420p[v]" \
    -map "[v]" -c:v libx264 -crf 17 -preset medium -r 30 "$WORK/${name}.mp4"
  echo "· ${name}  ${sw}x${sh} -> card ${CARDW}x${cardH} @ y=${offY}  ${dur}s"
}

# ---- the cut -----------------------------------------------------------------
#
# name|file|in|dur|zoom
#
# Five beats, not six. TroubleshootingWizard came out: the cut was showing five
# separate components in half a minute and none of them got long enough to land.
# The wizard was the one to drop — it answers a support question rather than
# teaching the guide's idea, and its solution card is the one shot that had to be
# cropped to fit. beats/relays-wizard.mjs stays; it records fine on its own and
# is a good standalone post.
#
# The simulator keeps its full 7s. Its four steps run 1.8s apart and the last one
# — the reader on a relay you never publish to — is the whole point, so trimming
# it would cut the argument, not the padding.
BEATS=(
  "10open|relays-open|0.8|3.4|"
  "20diagram|relays-diagram|0|2.2|zoom"
  "30sim|relays-simulator|0.6|7.0|"
  "50quiz|relays-quiz|0|10.4|"
  "60level|beginner-level|1.4|3.6|"
)

for row in "${BEATS[@]}"; do
  IFS='|' read -r name file in dur zoom <<<"$row"
  clipbeat "$name" "$OUT/${file}.mp4" "$in" "$dur" "$zoom"
done

# ---- end card ----------------------------------------------------------------
# One number, used both to render it and to place its dissolve — they were two
# literals and would have drifted apart the first time either changed.
ENDCARD=2.6
echo "· end card"
ffmpeg -v error -y -f lavfi -i "color=c=${BG}:s=${CANW}x${CANH}:d=${ENDCARD}:r=30" \
  -i "$MARK" \
  -filter_complex "\
[1:v]scale=200:200:flags=lanczos[lk];\
[0:v]drawtext=fontfile='${BOLD}':text='learn Nostr':fontsize=96:fontcolor=white:x=(w-tw)/2:y=940,\
drawtext=fontfile='${BOLD}':text='by doing it':fontsize=96:fontcolor=${ACCENT}:x=(w-tw)/2:y=1056,\
drawtext=fontfile='${BOLD}':text='nostrich.love':fontsize=76:fontcolor=white:x=(w-tw)/2:y=1300,\
drawtext=fontfile='${REG}':text='${FOOTER}':fontsize=26:fontcolor=${MUTED}:x=(w-tw)/2:y=${DISCY}[base];\
[base][lk]overlay=(W-w)/2:660:format=auto,format=yuv420p[v]" \
  -map "[v]" -c:v libx264 -crf 17 -preset medium -r 30 "$WORK/99end.mp4"

# ---- assemble ----------------------------------------------------------------
#
# Cross-faded rather than hard-cut. Seven butt-joined takes of the same white
# card read as a slideshow of screenshots; a short dissolve makes it one
# continuous walk through one page. Chained xfade, not the concat demuxer, since
# concat cannot overlap.
FADE=0.3

inputs=(); durs=()
for row in "${BEATS[@]}"; do
  IFS='|' read -r name file in dur zoom <<<"$row"
  inputs+=(-i "$WORK/${name}.mp4"); durs+=("$dur")
done
inputs+=(-i "$WORK/99end.mp4"); durs+=("$ENDCARD")

# Each xfade's offset is where the outgoing clip should start dissolving:
# everything before it, minus one fade per join already spent.
graph=""; prev="0:v"; acc=0
for ((i = 1; i < ${#durs[@]}; i++)); do
  acc=$(echo "$acc + ${durs[i-1]} - $FADE" | bc)
  out="x$i"
  graph+="[${prev}][${i}:v]xfade=transition=fade:duration=${FADE}:offset=${acc}[${out}];"
  prev="$out"
done
graph="${graph%;}"

# A silent AAC track: some Nostr clients refuse to inline a video with no audio
# stream at all.
ffmpeg -v error -y "${inputs[@]}" \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
  -filter_complex "$graph" \
  -map "[${prev}]" -map "${#durs[@]}:a" -shortest \
  -c:v libx264 -crf 21 -preset slow -profile:v high -level 4.0 -pix_fmt yuv420p \
  -g 60 -movflags +faststart -c:a aac -b:a 48k \
  "$OUT/nostrich-walkthrough.mp4"

echo
ffprobe -v error -show_entries format=duration,size:stream=width,height -of default=nw=1 \
  "$OUT/nostrich-walkthrough.mp4"
