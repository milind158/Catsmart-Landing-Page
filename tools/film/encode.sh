#!/bin/zsh
# Encodes rendered PNGs into public/film/<scene>/<variant>/NNNN.webp and picks the posters.
# usage: tools/film/encode.sh <png-root> [desktop-quality] [mobile-quality] [force]
# Pass force after changing quality: otherwise only frames newer than their WebP are encoded.
# <png-root> holds desktop/ and mobile/ from film.py. Frame ranges match film.py and src/film/scenes.ts.
set -e
root=$1; q_desktop=${2:-68}; q_mobile=${3:-68}; force=${4:-}
out=public/film
scene_of() {
  local f=$1
  if   (( f <= 71 ));  then echo reveal
  elif (( f <= 231 )); then echo teardown
  elif (( f <= 391 )); then echo light
  elif (( f <= 691 )); then echo technologies
  elif (( f <= 831 )); then echo screen
  elif (( f <= 991 )); then echo close
  else echo turn; fi
}
for variant in desktop mobile; do
  [[ -d $root/$variant ]] || continue
  q=$q_desktop; [[ $variant == mobile ]] && q=$q_mobile
  list=$(mktemp)
  for png in $root/$variant/*.png; do
    name=${png:t:r}; f=$((10#$name)); scene=$(scene_of $f)
    mkdir -p $out/$scene/$variant
    print -r -- "$png $out/$scene/$variant/$name.webp" >> $list
  done
  # Skip frames already encoded, so re-rendering a range only re-encodes that range.
  xargs -P 8 -L 1 zsh -c '[[ -z "'$force'" && -f $2 && $2 -nt $1 ]] || cwebp -quiet -q '$q' -m 6 -af -sharp_yuv "$1" -o "$2"' _ < $list
  rm -f $list
  mkdir -p $out/posters/$variant
  for pair in reveal:71 teardown:223 light:343 big-data-analytics:417 optoelectronics:467 image-processing:515 sound-processing:565 command-control:615 research-customisation:671 screen:791 close:939; do
    name=${pair%%:*}; f=${pair##*:}
    cwebp -quiet -q $((q + 8)) -m 6 "$root/$variant/$(printf %04d $f).png" -o "$out/posters/$variant/$name.webp"
  done
  print "$variant: $(find $out -path "*/$variant/*" -name '*.webp' -not -path '*/posters/*' | wc -l | tr -d ' ') frames, $(find $out -path "*/$variant/*" -name '*.webp' -not -path '*/posters/*' -print0 | xargs -0 du -ch | tail -1 | cut -f1)"
done
