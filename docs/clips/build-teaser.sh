#!/usr/bin/env bash
# Build the nostrich.love teaser. ffmpeg only — no new deps, no network.
#
#   ./build-teaser.sh                     -> out/nostrich-teaser-vertical.mp4 (1080x1920)
#                                            out/nostrich-loop-languages.mp4 (short loop)
#   SRC=recording.mov ./build-teaser.sh   -> the same, plus the live beats
#
# Two modes on purpose. The stills-only cut is buildable today from
# capture-shots.sh output alone; hand it a screen recording and the interaction
# beats splice in. Timings, crops and captions live in the tables below.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="${SRC:-}"
SHOTS="${SHOTS:-$HERE/shots}"
OUT="$HERE/out"
WORK="${WORK:-$HERE/.work}"
mkdir -p "$OUT" "$WORK"

BOLD="/System/Library/Fonts/Supplemental/Arial Bold.ttf"
REG="/System/Library/Fonts/Supplemental/Arial.ttf"
# Arabic and Devanagari language labels need a font that actually has the
# glyphs; Arial Bold silently draws nothing for them.
UNI="/System/Library/Fonts/Supplemental/Arial Unicode.ttf"

# ---- frame layout (1080x1920) ------------------------------------------------
CANW=1080; CANH=1920
CARDW=860; CARDH=1550; CARDX=110; CARDY=200; CARDR=40
CAPY=84                      # caption baseline band
FOOTY=1782                   # brand lockup row
DISCY=1858                   # standing footer line

# Not a legal disclaimer like sandstr's — this is the actual pitch, and it is
# the thing that separates the site from every other onboarding page.
FOOTER="free · open source · no account · 7 languages"
ACCENT="0x8B5CF6"            # primary-500, the site's own purple
MUTED="0x8A8A96"
BG="0x0F0A1A"                # background-dark

# The article card inside a 1800x3200 capture. The crop is 1440x2596 = exactly
# the card's 860:1550 aspect, so nothing is squashed. SY used to clear the streak
# banner; that banner is gone and this still lands on the card — see README.
SW=1440; SH=2596; SX=176; SY=400

# ---- helpers -----------------------------------------------------------------
mask() { # w h r out — rounded-rect alpha, generated once per size
  local w=$1 h=$2 r=$3 o=$4
  [ -s "$o" ] && return 0
  ffmpeg -v error -y -f lavfi -i "color=c=black:s=${w}x${h}" -frames:v 1 \
    -vf "format=gray,geq=lum='if(lte(pow(max(0\,max(${r}-X\,X-(W-1-${r})))\,2)+pow(max(0\,max(${r}-Y\,Y-(H-1-${r})))\,2)\,${r}*${r})\,255\,0)'" \
    "$o"
}

# At fontsize 58 with a CARDX margin on both sides, a caption longer than this
# runs off the right edge — and ffmpeg draws it clipped without complaining, so
# it ships looking broken. Two captions did exactly that before this check.
CAP_MAX=32

chrome() { # caption -> shared filter fragment: caption, wordmark, footer line
  local cap=$1
  if [ "${#cap}" -gt "$CAP_MAX" ]; then
    echo "caption too long (${#cap} > ${CAP_MAX}): $cap" >&2
    exit 1
  fi
  echo "drawtext=fontfile='${BOLD}':text='${cap}':fontsize=58:fontcolor=white:x=${CARDX}:y=${CAPY}:shadowcolor=black@0.6:shadowx=0:shadowy=3,\
drawtext=fontfile='${BOLD}':text='nostrich.love':fontsize=40:fontcolor=${ACCENT}:x=${CANW}-${CARDX}-tw:y=${FOOTY}+8:shadowcolor=black@0.6:shadowx=0:shadowy=2,\
drawtext=fontfile='${REG}':text='${FOOTER}':fontsize=26:fontcolor=${MUTED}:x=${CARDX}:y=${DISCY}"
}

# The blurred backdrop. The site's pages are LIGHT, so unlike a dark-UI teaser
# the blur has to be pushed down hard — otherwise a white card sits on a white
# haze and the card edge disappears. Brightness is cut and the result is floored
# onto the site's own near-black so the frame reads as one surface.
AMBIENT="scale=180:320,gblur=sigma=16,scale=${CANW}:${CANH}:flags=bilinear,\
eq=brightness=-0.62:saturation=1.6,colorlevels=romin=0.06:gomin=0.055:bomin=0.085,vignette=PI/4"

# public/logo.png is a 500x500 RGBA with transparent corners — the canonical
# mark. A crop of the header screenshot brought the page background with it.
MARK="${MARK:-$HERE/../../public/logo.png}"
LOCKUP="scale=52:52:flags=lanczos"

MASK_CARD="$WORK/mask_${CARDW}x${CARDH}r${CARDR}.png"; mask "$CARDW" "$CARDH" "$CARDR" "$MASK_CARD"

# One still -> one beat. Zoompan gives it a slow push so a static shot does not
# read as a frozen video.
still() { # name shot caption frames crop-y [label-code]
  local name=$1 shot=$2 cap=$3 frames=$4 cy=$5 label=${6:-}
  # `last` names the final labelled output so the caption chain can attach to it
  # whether or not a language label was composited in.
  local lin="" lfc="" lov="" last="v2"
  if [ -n "$label" ]; then
    lin="-i $SHOTS/label-${label}.png"
    lfc="[3:v]scale=-1:70:flags=lanczos[lb];"
    lov="[v2][lb]overlay=${CARDX}-6:${CAPY}+54:format=auto[v3];"
    last="v3"
  fi
  ffmpeg -v error -y -loop 1 -i "$SHOTS/${shot}.png" -i "$MASK_CARD" -i "$MARK" $lin \
    -filter_complex "\
[0:v]crop=${SW}:${SH}:${SX}:${cy},scale=${CARDW}:${CARDH}:flags=lanczos,format=gbrp,\
zoompan=z='1+0.045*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${CARDW}x${CARDH}:fps=30[card];\
[card]split[k1][k2];\
[k1]${AMBIENT}[bg];\
[k2]format=yuva444p[fgs];[1:v]format=gray[mk];[fgs][mk]alphamerge[fg];\
[2:v]${LOCKUP}[lk];\
${lfc}\
[bg][fg]overlay=${CARDX}:${CARDY}:format=auto[v1];\
[v1][lk]overlay=${CARDX}:${FOOTY}-3:format=auto[v2];\
${lov}\
[${last}]$(chrome "$cap"),format=yuv420p[v]" \
    -map "[v]" -frames:v "$frames" -c:v libx264 -crf 17 -preset medium -r 30 "$WORK/${name}.mp4"
}

# A beat built from a captured frame SEQUENCE rather than one still or a screen
# recording — see record-quiz.mjs. The frames are already cropped to the card and
# captured at the slot's aspect (0.553 against the slot's 0.555), so unlike
# still() this neither crops nor zooms: the content changing IS the motion.
sequence() { # name caption hold-seconds frame...
  local name=$1 cap=$2 hold=$3; shift 3
  local list="$WORK/${name}_frames.txt" f last
  local files=("$@")
  for f in "${files[@]}"; do [ -s "$f" ] || return 1; done
  last="${files[${#files[@]}-1]}"

  : >"$list"
  for f in "${files[@]}"; do
    printf "file '%s'\nduration %s\n" "$f" "$([ "$f" = "$last" ] && echo "$hold" || echo 0.42)" >>"$list"
  done
  printf "file '%s'\n" "$last" >>"$list"   # concat needs the tail repeated

  ffmpeg -v error -y -f concat -safe 0 -i "$list" -i "$MASK_CARD" -i "$MARK" \
    -filter_complex "\
[0:v]scale=${CARDW}:${CARDH}:flags=lanczos,fps=30,format=gbrp[card];\
[card]split[k1][k2];\
[k1]${AMBIENT}[bg];\
[k2]format=yuva444p[fgs];[1:v]format=gray[mk];[fgs][mk]alphamerge[fg];\
[2:v]${LOCKUP}[lk];\
[bg][fg]overlay=${CARDX}:${CARDY}:format=auto[v1];\
[v1][lk]overlay=${CARDX}:${FOOTY}-3:format=auto[v2];\
[v2]$(chrome "$cap"),format=yuv420p[v]" \
    -map "[v]" -c:v libx264 -crf 17 -preset medium -r 30 "$WORK/${name}.mp4"
}

# ---- beat 01: the language montage ------------------------------------------
# The site's one genuine differentiator. Same guide, same framing, seven scripts
# — Arabic included precisely because it mirrors, which no still of an English
# page can show. English is held longer so the eye locks on before it starts.
echo "· language montage"
LANGS=(
  en pl es de zh ar hi
)
: >"$WORK/montage.txt"
mi=0
for code in "${LANGS[@]}"; do
  mi=$((mi+1))
  frames=13; [ $mi -eq 1 ] && frames=24
  still "mont_${mi}" "lang-${code}" "Seven languages. One guide." "$frames" "$SY" "$code"
  echo "file 'mont_${mi}.mp4'" >>"$WORK/montage.txt"
done
ffmpeg -v error -y -f concat -safe 0 -i "$WORK/montage.txt" -c copy "$WORK/01montage.mp4"

# ---- beats 02-06: the material that is actually worth showing ----------------
# Each of these is cropped to a window chosen by eye, not to the top of the page
# — the substance (the protocol table, the diagram components, the follow-pack
# grid) all sits below the fold, and the tops carry prerequisite banners.
#
# name | shot | frames | crop-y | caption
STILLS=(
  "02proto|proto|84|1400|Three protocols, compared."
  "03compare|compare|84|2200|Including what you give up."
  "04relays|relays|78|1950|Diagrams, not walls of text."
  "05follow|followpack|78|6200|527 accounts to start with."
  "06glossary|glossary|66|4200|Every term, linked to its guide."
)
for s in "${STILLS[@]}"; do
  IFS='|' read -r name shot frames cy cap <<<"$s"
  echo "· $name"
  still "$name" "$shot" "$cap" "$frames" "$cy"
done

# ---- the quiz, answered ------------------------------------------------------
# The one thing no competing onboarding page has at all. Needs frames from
# `node docs/clips/record-quiz.mjs`; skipped with a warning if they are absent,
# because the rest of the teaser is still worth building without it.
# Three frames, not all eight. The beat has to say "it asks you questions and
# tells you whether you were right" — showing every question says it six times
# and made this run 4.6s against 2.2-2.8s for every other beat. The rest of the
# frames stay on disk for anyone who wants a longer cut.
QUIZ_BEAT=""
if sequence "02quiz" "Check you actually got it." 1.5 \
     "$SHOTS/quiz-00-start.png" "$SHOTS/quiz-01-answered.png" "$SHOTS/quiz-99-results.png"; then
  QUIZ_BEAT="02quiz"
  echo "· 02quiz (frame sequence)"
else
  echo "  ! no shots/quiz-*.png — run record-quiz.mjs for the quiz beat" >&2
fi

# ---- optional live beats from a screen recording ----------------------------
# Only spliced in when SRC points at a .mov. Adjust the table to match whatever
# was recorded — in/out are seconds, cy is the crop offset inside the frame.
LIVE=()
if [ -n "$SRC" ]; then
  [ -f "$SRC" ] || { echo "SRC set but not found: $SRC" >&2; exit 1; }
  # name | in | out | speed | crop-x | crop-y | caption
  RECORDED=(
    "06switch|4.0|9.0|1.7|176|400|Switch language mid-guide."
    "07quiz|12.0|17.0|1.7|176|400|Check you actually got it."
  )
  for s in "${RECORDED[@]}"; do
    IFS='|' read -r name tin tout speed cx cy cap <<<"$s"
    echo "· $name (recorded)"
    ffmpeg -v error -y -ss "$tin" -to "$tout" -i "$SRC" -i "$MASK_CARD" -i "$MARK" \
      -filter_complex "\
[0:v]crop=${SW}:${SH}:${cx}:${cy},setpts=(PTS-STARTPTS)/${speed},fps=30,format=gbrp[c];\
[c]split[c1][c2];\
[c1]${AMBIENT}[bg];\
[c2]scale=${CARDW}:${CARDH}:flags=lanczos,unsharp=5:5:0.4,format=yuva444p[fgs];\
[1:v]format=gray[mk];[fgs][mk]alphamerge[fg];\
[2:v]${LOCKUP}[lk];\
[bg][fg]overlay=${CARDX}:${CARDY}:format=auto[v1];\
[v1][lk]overlay=${CARDX}:${FOOTY}-3:format=auto[v2];\
[v2]$(chrome "$cap"),format=yuv420p[v]" \
      -map "[v]" -c:v libx264 -crf 17 -preset medium -r 30 "$WORK/${name}.mp4"
    LIVE+=("$name")
  done
fi

# ---- end card ----------------------------------------------------------------
echo "· end card"
ffmpeg -v error -y -f lavfi -i "color=c=${BG}:s=${CANW}x${CANH}:d=3.6:r=30" \
  -i "$MARK" \
  -filter_complex "\
[1:v]scale=200:200:flags=lanczos[lk];\
[0:v]drawtext=fontfile='${BOLD}':text='learn Nostr':fontsize=96:fontcolor=white:x=(w-tw)/2:y=940,\
drawtext=fontfile='${BOLD}':text='in your language':fontsize=96:fontcolor=${ACCENT}:x=(w-tw)/2:y=1056,\
drawtext=fontfile='${BOLD}':text='nostrich.love':fontsize=76:fontcolor=white:x=(w-tw)/2:y=1300,\
drawtext=fontfile='${REG}':text='${FOOTER}':fontsize=26:fontcolor=${MUTED}:x=(w-tw)/2:y=${DISCY}[base];\
[base][lk]overlay=(W-w)/2:660:format=auto,format=yuv420p[v]" \
  -map "[v]" -c:v libx264 -crf 17 -preset medium -r 30 "$WORK/99end.mp4"

# ---- assemble ----------------------------------------------------------------
{
  echo "file '01montage.mp4'"
  # Straight after the montage on purpose: language coverage and assessment are
  # the two claims no competitor can answer, so they lead together.
  [ -n "$QUIZ_BEAT" ] && echo "file '${QUIZ_BEAT}.mp4'"
  for s in "${STILLS[@]}"; do echo "file '${s%%|*}.mp4'"; done
  for n in "${LIVE[@]:-}"; do [ -n "$n" ] && echo "file '${n}.mp4'"; done
  echo "file '99end.mp4'"
} >"$WORK/all.txt"

ffmpeg -v error -y -f concat -safe 0 -i "$WORK/all.txt" \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
  -map 0:v -map 1:a -shortest \
  -c:v libx264 -crf 21 -preset slow -profile:v high -level 4.0 -pix_fmt yuv420p \
  -g 60 -movflags +faststart -c:a aac -b:a 48k \
  "$OUT/nostrich-teaser-vertical.mp4"

# The montage on its own — the single most legible beat, for replies and quotes.
ffmpeg -v error -y -i "$WORK/01montage.mp4" \
  -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -g 60 -movflags +faststart \
  "$OUT/nostrich-loop-languages.mp4"

ls -lh "$OUT"
