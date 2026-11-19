# How Kothar measures a logo

Every logo option is rendered and measured by scripts before it is shown, then looked at by reviewers who know nothing about it. A step of the page cannot open while a check fails. This page lists what is measured and why.

## The drawing

- **Size**: each logo is rendered from 16 px up. The scripts measure the share of ink under one pixel, gaps that close, how much of the shape survives the pixel grid, and whether pieces merge or break.
- **Elements**: no separate piece may be smaller than a pixel at favicon size. A simpler compact variant is allowed for the smallest sizes.
- **Originality**: the shape is compared with about 21,000 brand logos (Simple Icons), interface icons (Lucide, Tabler, Bootstrap, Phosphor) and emoji (Twemoji), and with the other options of the same set. A close likeness is shown next to the option, in plain words.
- **File hygiene**: one ink through `currentColor`, an optional second tone, no text, raster images, gradients, filters or external references.

## Black, white and grey

The logo is chosen and delivered without brand colours: the main shape in the darkest ink, the optional second part in grey (`#111111` and `#767676` on white, `#F5F5F5` and `#8C8C8C` on black). A palette changes often and a logo rarely, so colour is decided later, when the site, the README or the app is designed. The delivered guide explains how to apply brand colours to the single-ink file.

## The reviewers

- **Blind judges**: fresh agents see anonymised renders and say what they see at 16 px and large, and what it reminds them of. A logo they do not recognise is redrawn.
- **Drawn names**: when the name is drawn rather than typed, the judges must read it correctly, and it must differ from the name set in the chosen font.

## The rest of the identity

- **Fonts**: only families verified as free are offered, chosen from what the product is. A paid font needs the user's licence confirmation and shows a legal warning.
- **Animation**: CSS only, honours the reduced-motion setting, and rests on the finished logo.
