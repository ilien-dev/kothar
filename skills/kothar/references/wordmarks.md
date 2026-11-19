# The name, drawn

The user asked for the name drawn in SVG because they want something a font cannot give them. If the result looks like a word typed in a nice typeface, the option was wasted: they already have that, for free, in the font they picked in step 01 (which stays on offer next to your drawings).

So this is the part of the job where invention is expected. The limit is legibility, and it is enforced: judges who have never seen the name must be able to type it from your drawing.

## What "more than a font" means

Use what SVG allows and a font does not. A drawn name usually has **one** strong move, sometimes two:

- **Rearrange.** Stack the name in two rows. Let one letter drop below the line or rise above it. Share a stroke between neighbours (the bar of a T running on to become the top of the next letters).
- **Cut and join.** Remove a crossbar (an A without its bar, an H reduced to posts and a tick). Slice every letter along one line. Join two letters into a ligature that exists only for this name.
- **Bring the mark in.** Replace a counter, a dot or a bowl with a piece of the logo (the mark's circle as the O's centre, its angle as the leg of a K). This ties name and mark into one thing.
- **Flip or rotate one letter**, when the letter survives it (an N, an S, a symmetric A/V pair). Never the first letter.
- **Set one part in the second tone.** Give a single letter or a single element `data-ink="accent"` (grey in the delivered files). Like the mark, the drawing must still read when that part is the same ink as the rest.
- **Build from a system.** Draw every letter from the same two or three parts (one stroke width, one arc, one angle) so the name looks manufactured as a set, the way the mark was.

Take the move from the same idea as the logo it will sit beside (each drawn name is paired with a concept): a smith's name can look struck or riveted, a measuring tool's name can sit on a ruled line.

## What keeps it readable

Readers recognise words by a few stable features. Keep them and you can bend the rest:

- **The first letter stays conventional.** It anchors the word.
- **Keep the letter order and the reading direction.** Stacking is fine (people read rows); scattering is not.
- **Distort at most one or two letters heavily.** If every letter is strange, there is nothing to decode the strange ones from.
- **Keep each letter's distinguishing feature**: the ascender of h/k/t/d/b, the descender of p/g/y, the open side of c/e, the crossing of t/f. Watch the classic confusions: a barless A reads as an inverted V or a lambda (fine in the middle of a known word, risky when the word is unfamiliar); O and D; I, l and 1; U and V; rn and m; cl and d.
- **Leave real gaps between letters**, at least half a stroke width, and keep stroke weight consistent. At small size, gaps close before strokes disappear.
- **A new or foreign name needs more help than a common word.** Nobody can guess "Kothar" from context the way they would guess "Coffee".

## What the evidence says about lettering

Same caution as for marks (`logo-rules.md`, "What the evidence supports"): these are reasons to choose one way for this product, drawn from its traits, kind and stakes.

- **Case.** Capitals read as stronger, more authoritative, more competent and more premium; lowercase reads as friendlier and warmer (Xu et al. 2017; Wen & Lurie 2018; Teng et al. 2021; Yu et al. 2022). Neither is liked more: choose by fit. Capitals when `competence`, `trust`, `sophistication` or `ruggedness` weigh; lowercase when `warmth`, `joy` or `sincerity` do. At the smallest sizes capitals stay legible slightly longer (Arditi & Cho 2007).
- **A handwritten look** suggests a person behind the product. It helps a `sensory-social` product and works against a `functional` one (Schroll et al. 2018).
- **Letters with parts removed** read as inventive and as less trustworthy (Hagtvedt 2011). When `trust` weighs or `stakes` is high, make your move something other than cutting letters open: a join, a shared stroke, a piece of the mark.
- **Spacing.** Letters set close read as safer than letters spread wide (Gupta & Hagtvedt 2021), and letters that touch stop being legible. Compact without touching; a little more open for the small sizes.
- **At small size** medium weights survive and both extremes fail, low stroke contrast beats high, and wide letters with open apertures beat condensed, closed ones (Beier & Oderkerk 2019, 2021; Oderkerk & Beier 2022). Serifs change nothing for legibility (Arditi & Cho 2005): have them or not for fit.
- **Not reasons:** "serifs give trust, sans is modern", "thin is luxury", "slanted is fast" have no study behind them, and "harder to read is remembered better" failed when retested (Meyer et al. 2015; Taylor et al. 2020).

## The file

Same contract as a mark (`references/logo-rules.md`): one ink through `currentColor`, optional `data-ink="accent"` (the second tone), no `<text>`, no hex colours, a `viewBox` that fits the artwork. Every letter is drawn as shapes or strokes by you. Do not paste font outlines.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 40" fill="none" stroke="currentColor" stroke-width="6">
  <path d="M5 6v28M23 6 9 20l14 14"/>                      <!-- K -->
  <path d="M33 20a11 11 0 1 0 22 0 11 11 0 1 0-22 0"/>      <!-- O -->
  <circle data-ink="accent" cx="44" cy="20" r="3.5" fill="currentColor" stroke="none"/>
  <!-- … -->
</svg>
```

Building letters from thick strokes on a grid is the most reliable way to get even weight and spacing. Keep comments out of the final file if size matters; they are harmless otherwise.

## How it is measured

- `size`, `topology`, `elements`: like a mark, but by **height**: it has to read at 20 px tall in a navbar. A name whose artwork is less than 2.4 times as wide as it is tall (stacked in two rows, or with very long ascenders and descenders) is measured at 40 px instead, because its letters are half the height of the artwork.
- `identity`: your drawing is compared with the name set in the user's chosen font. From 0.75 it warns that this is "almost the font". Being under the threshold does not make it good, it only means it is not a copy.
- `judge-read`: at least two thirds of the judges must type the name from the large image (letters only; upper or lower case does not matter), or it **fails**. The audit tells you what they typed instead: if they wrote "KOTHVR", the A is the problem, so fix the A and keep the idea.
- `judge-read-small`: a warning when they read it large but not at 22 px tall.

The plain font version goes to the judges too, as a baseline: if judges cannot read even that at small size, the name itself is hard, and your drawings should be judged with that in mind.

## Pairing

Draw one name per logo, in that logo's spirit, and say in `rationale` which move you made and why. The page shows each drawn name on its own and combined with whichever logo the user is looking at, so they can pick "logo 2 with name 5". A drawn name therefore has to stand next to any of the marks, not only its partner: keep its weight in the same family as the marks' weight.
