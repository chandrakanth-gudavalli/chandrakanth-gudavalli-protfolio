#!/usr/bin/env bash
# Builds public/media from the raw (git-ignored) videos in assets/.
# Usage: npm run media   (tweak HERO_START / HERO_DUR / CRF_* via env)
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=assets
OUT=public/media
JHU="$SRC/dense_reconstruction_of_whole_JHU_campus.webm"
MX="$SRC/mxreg_video (1).mp4"
HERO_START=${HERO_START:-2}
HERO_DUR=${HERO_DUR:-14}
CRF_VP9=${CRF_VP9:-52}
CRF_H264=${CRF_H264:-32}
mkdir -p "$OUT"

# encode <input> <start> <duration> <filter> <name>
encode() {
  local in=$1 ss=$2 t=$3 vf=$4 name=$5
  ffmpeg -v error -y -ss "$ss" -t "$t" -i "$in" -vf "$vf,fps=24" -an \
    -c:v libvpx-vp9 -b:v 0 -crf "$CRF_VP9" -row-mt 1 "$OUT/$name.webm"
  ffmpeg -v error -y -ss "$ss" -t "$t" -i "$in" -vf "$vf,fps=24" -an \
    -c:v libx264 -preset slow -crf "$CRF_H264" -pix_fmt yuv420p -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -v error -y -ss "$ss" -i "$in" -vf "$vf" -frames:v 1 -q:v 4 "$OUT/$name.jpg"
}

# Note: public/media/geoloc.jpg is a hand-cropped Figure 1 from arXiv 2602.14929; this script does not regenerate it.

# Hero: the JHU video stacks the dense model (top half) over the camera poses (bottom half).
encode "$JHU" "$HERO_START" "$HERO_DUR" "crop=iw:ih/2:0:0,scale=960:-2" hero-dense
encode "$JHU" "$HERO_START" "$HERO_DUR" "crop=iw:ih/2:0:ih/2,scale=960:-2" hero-poses

# MetaReg card video.
encode "$MX" 0 8 "scale=720:-2" metareg

# WRIVA card still: aerial view from the dense half.
ffmpeg -v error -y -ss 38 -i "$JHU" -vf "crop=iw:ih/2:0:0,scale=800:-2" -frames:v 1 -q:v 4 "$OUT/wriva.jpg"

# Campus card still: YouTube thumbnail of the UCSB drone reconstruction.
curl -fsSL "https://img.youtube.com/vi/2GJS7BRKg1s/maxresdefault.jpg" -o "$OUT/campus.jpg" ||
  curl -fsSL "https://img.youtube.com/vi/2GJS7BRKg1s/hqdefault.jpg" -o "$OUT/campus.jpg"

# IARPA WRIVA CVGL 2026 #1 certificate (1200x900 JPEG, ~120 KB) — copied as-is.
cp assets/1790977736926.jpeg "$OUT/wriva-cvgl-certificate.jpg"

# Social preview (1200x630) from the dense model.
ffmpeg -v error -y -ss "$HERO_START" -i "$JHU" \
  -vf "crop=iw:ih/2:0:0,scale=-2:630,crop=1200:630" -frames:v 1 -q:v 3 public/og-image.jpg

ls -lh "$OUT" public/og-image.jpg
