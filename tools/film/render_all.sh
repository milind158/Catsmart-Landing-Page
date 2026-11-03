#!/bin/zsh
# Renders the whole film, desktop at 4K then phones, and picks up where it stopped if run again.
# usage: tools/film/render_all.sh <work-dir>    (run from the repo root)
# Set BLENDER if blender is not on the path. Needs Blender 5.2.1, a GPU, zsh and cwebp.
# Finished frames land in <work-dir>/film: move that to public/film once this prints FINISHED.
set -u
work=${1:a}
blender=${BLENDER:-blender}
export FILM_OUT=$work/film
mkdir -p $work

for variant in desktop mobile; do
  expected=1998; [[ $variant == mobile ]] && expected=1008
  for attempt in 1 2 3 4 5; do
    "$blender" -b --factory-startup -P tools/film/film.py -- render --variant $variant --out $work/png/$variant --sink tools/film/encode.sh 2>&1 | grep --line-buffered -E "^FRAME|Traceback|Error" | tee -a $work/render.log
    total=$(ls $work/png/$variant | grep -c '\.done$')
    echo "$variant attempt $attempt: $total of $expected at $(date)" | tee -a $work/render.log
    (( total >= expected )) && break
  done
  (( total >= expected )) || { echo "STOPPED: $variant has $total of $expected frames" | tee -a $work/render.log; exit 1; }
done
echo FINISHED | tee -a $work/render.log
