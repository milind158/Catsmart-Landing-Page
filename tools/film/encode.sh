#!/bin/zsh
# Encodes one rendered PNG into public/film/<scene>/<tier>/NNNN.webp, then removes it: 4K PNGs do not fit on disk.
# usage: tools/film/encode.sh <frame.png> <desktop|mobile> [done-marker]
# A desktop frame is rendered at 4K and gives both desktop tiers, so they always match.
# FILM_OUT moves the output, so a new render can finish before it replaces the old one.
# Frame ranges and poster frames match film.py and src/film/scenes.ts.
set -e
png=$1; variant=$2; marker=${3:-}
out=${FILM_OUT:-public/film}
name=${png:t:r}; f=$((10#$name))
if   (( f <= 141 ));  then scene=reveal
elif (( f <= 461 ));  then scene=teardown
elif (( f <= 781 ));  then scene=light
elif (( f <= 1381 )); then scene=technologies
elif (( f <= 1661 )); then scene=screen
elif (( f <= 1981 )); then scene=close
else scene=turn; fi

webp() { mkdir -p ${@[-1]:h}; cwebp -quiet -mt -m 4 -af -sharp_yuv "$@"; }

if [[ $variant == desktop ]]; then
  webp -q ${FILM_Q_UHD:-58} "$png" -o $out/$scene/uhd/$name.webp
  webp -q ${FILM_Q_DESKTOP:-60} -resize 1920 1080 "$png" -o $out/$scene/desktop/$name.webp
else
  webp -q ${FILM_Q_MOBILE:-66} "$png" -o $out/$scene/mobile/$name.webp
fi

case $f in
  141)  poster=reveal ;;
  445)  poster=teardown ;;
  685)  poster=light ;;
  833)  poster=big-data-analytics ;;
  933)  poster=optoelectronics ;;
  1029) poster=image-processing ;;
  1129) poster=sound-processing ;;
  1229) poster=command-control ;;
  1341) poster=research-customisation ;;
  1581) poster=screen ;;
  1877) poster=close ;;
  *)    poster= ;;
esac
if [[ -n $poster ]]; then
  if [[ $variant == desktop ]]; then
    webp -q 68 -resize 1920 1080 "$png" -o $out/posters/desktop/$poster.webp
  else
    webp -q 74 "$png" -o $out/posters/mobile/$poster.webp
  fi
fi

rm -f "$png"
[[ -z $marker ]] || : > "$marker"
