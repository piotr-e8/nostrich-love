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

# The article card inside a 1800x3200 capture, below the streak banner. The crop
# is 1440x2596 = exactly the card's 860:1550 aspect, so nothing is squashed.
SW=1440; SH=2596; SX=176; SY=400

# ---- helpers -----------------------------------------------------------------
mask() { # w h r out — rounded-rect alpha, generated once per size
  local w=$1 h=$2 r=$3 o=$4
  [ -s "$o" ] && return 0
  ffmpeg -v error -y -f lavfi -i "color=c=black:s=${w}x${h}" -frames:v 1 \
    -vf "format=gray,geq=lum='if(lte(pow(max(0\,max(${r}-X\,X-(W-1-${r})))\,2)+pow(max(0\,max(${r}-Y\,Y-(H-1-${r})))\,2)\,${r}*${r})\,255\,0)'" \
    "$o"
}

chrome() { # caption -> shared filter fragment: caption, wordmark, footer line
  local cap=$1
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
still() { # name shot caption frames [label-code]
  local name=$1 shot=$2 cap=$3 frames=$4 label=${5:-}
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
[0:v]crop=${SW}:${SH}:${SX}:${SY},scale=${CARDW}:${CARDH}:flags=lanczos,format=gbrp,\
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
  still "mont_${mi}" "lang-${code}" "Seven languages. One guide." "$frames" "$code"
  echo "file 'mont_${mi}.mp4'" >>"$WORK/montage.txt"
done
ffmpeg -v error -y -f concat -safe 0 -i "$WORK/montage.txt" -c copy "$WORK/01montage.mp4"

# ---- beats 02-05: what is actually on the site -------------------------------
# name | shot | frames | caption
STILLS=(
  "02guides|guides|75|Sixteen guides, in order."
  "03keygen|keygen|75|Make a key. It never leaves the browser."
  "04followpack|followpack|75|Then fill the feed."
  "05glossary|glossary|66|Every term, explained."
)
for s in "${STILLS[@]}"; do
  IFS='|' read -r name shot frames cap <<<"$s"
  echo "· $name"
  still "$name" "$shot" "$cap" "$frames"
done

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
