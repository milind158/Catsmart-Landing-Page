#!/bin/zsh
# Encodes rendered PNGs into public/film/<scene>/<variant>/NNNN.webp and picks the posters.
# usage: tools/film/encode.sh <png-root> [desktop-quality] [mobile-quality]
# <png-root> holds desktop/ and mobile/ from film.py. Frame ranges match film.py and src/film/scenes.ts.
set -e
root=$1; q_desktop=${2:-62}; q_mobile=${3:-56}
out=public/film
scene_of() {
  local f=$1
  if   (( f <= 36 ));  then echo reveal
  elif (( f <= 116 )); then echo teardown
  elif (( f <= 196 )); then echo light
  elif (( f <= 346 )); then echo technologies
  elif (( f <= 416 )); then echo screen
  elif (( f <= 496 )); then echo close
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
  xargs -P 8 -L 1 zsh -c '[[ -f $2 && $2 -nt $1 ]] || cwebp -quiet -q '$q' -m 6 -af -sharp_yuv "$1" -o "$2"' _ < $list
  rm -f $list
  mkdir -p $out/posters/$variant
  for pair in reveal:36 teardown:112 light:172 big-data-analytics:209 optoelectronics:234 image-processing:258 sound-processing:283 command-control:308 research-customisation:336 screen:396 close:470; do
    name=${pair%%:*}; f=${pair##*:}
    # Mobile renders every second frame from 1, so even frames round down.
    [[ $variant == mobile ]] && (( f % 2 == 0 )) && f=$((f - 1))
    cwebp -quiet -q $((q + 8)) -m 6 "$root/$variant/$(printf %04d $f).png" -o "$out/posters/$variant/$name.webp"
  done
  print "$variant: $(find $out -path "*/$variant/*" -name '*.webp' -not -path '*/posters/*' | wc -l | tr -d ' ') frames, $(find $out -path "*/$variant/*" -name '*.webp' -not -path '*/posters/*' -print0 | xargs -0 du -ch | tail -1 | cut -f1)"
done
