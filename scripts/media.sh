#!/bin/sh
# Downloads every photograph and film the homepage uses from cerogeneration.com (WordPress uploads) and prepares
# local copies in public/media. Sources: the live homepage (/), plus /what-we-do (the four expertise photos and the
# partner logos) and the five /project/* pages (hero collage). Requires curl + ffmpeg.
#
# Grade: the company's own photos and films stay in natural colour (house rule), with a light shared trim,
# saturation 0.94, so the greens of the meadows sit with the palette. No tint, no duotone.
set -e
cd "$(dirname "$0")/.."
RAW=_scrape/raw; OUT=public/media; mkdir -p "$RAW" "$OUT"
U=https://cerogeneration.com/wp-content/uploads
get() { [ -s "$RAW/$(basename "$1")" ] || curl -sL "$U/$1" -o "$RAW/$(basename "$1")"; }

# Films: homepage hero background, and the homepage "About us" reel (with its own sound)
get 2025/07/Home-Page-Update.mp4
get 2025/07/About-Us-Reel-3.mp4
# Homepage: case-study slider (5) and latest news (4)
for f in 2025/09/Pontinia-Slider.jpg 2025/09/Delfini-Slider.jpg 2025/09/Castrum-Slider.jpg 2025/09/Bolotana-Slider.jpg 2025/09/Larks-Green-Slider.jpg \
  2026/02/26.jpg 2025/09/financing-package-for-a-portfolio-of-UK-solar-and-BESS-co-located-assets.jpg 2025/06/Castrum-1.png 2025/05/Larks-Green-BESS.jpg; do get $f; done
# /what-we-do: Identify, Develop, Construct, Operate; partner logos (Centrica, Heineken, Philips)
for f in 2025/07/Image-1_1.jpg 2025/07/Image-1_2.jpg 2025/07/Image-1_3.jpg 2025/07/Image-1_4.jpg 2025/07/Logo-01.png 2025/07/Logo-02.png 2025/07/Logo-03.png 2025/09/2.jpg; do get $f; done
# Brand vectors (scripts/logo.py reads page 1)
get 2026/04/Cero-Code-of-Conduct-A5-web.pdf
# Project pages: hero collage
for f in 2024/04/Pontinia-Solar-Project.jpg 2024/04/Delfini-Solar-Project.jpg 2024/04/Larks-Green-Solar-Project.jpg 2023/02/Bolo-B-1-2-scaled.jpg 2025/07/ALEXPARKYNSMITHLARKSFINALSELECTION-63-1.jpg 2025/09/Cero-Generation.jpg; do get $f; done

GRADE="eq=saturation=0.94"
photo() { ffmpeg -v error -y -i "$RAW/$1" -vf "scale='min($3,iw)':-2,$GRADE" -q:v 3 "$OUT/$2"; }

# Hero collage (cropped by the page with object-fit)
photo 2.jpg collage-team.jpg 900
photo ALEXPARKYNSMITHLARKSFINALSELECTION-63-1.jpg collage-tracker.jpg 900
photo Delfini-Solar-Project.jpg collage-delfini.jpg 900
photo Larks-Green-BESS.jpg collage-bess.jpg 900
photo Pontinia-Solar-Project.jpg collage-pontinia.jpg 900
# Expertise
photo Image-1_1.jpg identify.jpg 1280
photo Image-1_2.jpg develop.jpg 1280
photo Image-1_3.jpg construct.jpg 1280
photo Image-1_4.jpg operate.jpg 1280
# Case studies (the live homepage slider images)
for p in Pontinia Delfini Castrum Bolotana Larks-Green; do photo $p-Slider.jpg case-$(echo $p | tr A-Z a-z).jpg 1600; done
# News
photo 26.jpg news-bumble-bee.jpg 1000
photo financing-package-for-a-portfolio-of-UK-solar-and-BESS-co-located-assets.jpg news-financing.jpg 1000
photo Castrum-1.png news-castrum.jpg 1000
photo Larks-Green-BESS.jpg news-larks-green.jpg 1000
# Contact band
photo Cero-Generation.jpg contact.jpg 2000
# Partner logos: kept as alpha PNGs; the page recolours them with a CSS mask
for i in 1 2 3; do ffmpeg -v error -y -i "$RAW/Logo-0$i.png" -vf "scale=640:-2" "$OUT/partner-$i.png"; done

# Films. Hero: muted, 30fps, no audio track, faststart. Reel: keeps its sound (the visitor starts it).
ffmpeg -v error -y -i "$RAW/Home-Page-Update.mp4" -an -vf "fps=30,scale=1600:-2,$GRADE" -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/hero.mp4"
ffmpeg -v error -y -ss 0.5 -i "$RAW/Home-Page-Update.mp4" -frames:v 1 -vf "scale=1920:-2,$GRADE" -q:v 3 "$OUT/hero-poster.jpg"
ffmpeg -v error -y -i "$RAW/About-Us-Reel-3.mp4" -vf "scale=1280:-2,$GRADE" -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart "$OUT/reel.mp4"
ffmpeg -v error -y -ss 2 -i "$RAW/About-Us-Reel-3.mp4" -frames:v 1 -vf "scale=1280:-2,$GRADE" -q:v 3 "$OUT/reel-poster.jpg"
ls -la "$OUT"
