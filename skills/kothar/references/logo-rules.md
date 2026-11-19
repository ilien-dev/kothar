# Drawing a logo that passes

## Contents
1. The authoring contract (what the file must be)
2. Designing for the measurements
3. Each audit rule and how to fix it
4. Originality
5. A worked example

## 1. The authoring contract

Every mark is a master file in **one ink**. It is delivered in black, white and greys, and brand colour is applied later by whoever designs the site or the app, so the drawing itself must work as a single flat colour on any background. That is the oldest test in logo design, and it is also what makes the file usable as a favicon, an engraving or a one-colour print.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
  <path d="M8 8h48v14H22v34H8z"/>
  <circle data-ink="accent" cx="44" cy="44" r="12"/>
</svg>
```

- `viewBox` is required. Use a small integer grid (24, 32, 48, 64, 100). Whole numbers or one decimal: the grid keeps shapes aligned, and nobody can see the third decimal.
- **Only `currentColor` or `none`** as fill and stroke. Put `fill="currentColor"` on the root. No hex colours, no black-by-default shapes.
- **One optional second tone.** Mark the element or group with `data-ink="accent"`. In the single-ink version it is the same ink as everything else; in the delivered black-and-grey and white-and-grey versions it is grey, and later it can take a brand colour. So the logo must still read when that part is the same ink as the rest: a part that only works because it is a different tone is not a design, it is a dependency.
- **Real holes, never white paint.** A white shape on top looks right on white and wrong everywhere else. Cut the hole into the path (`fill-rule="evenodd"`), or use a `<mask>`.
- No `<text>` (outline nothing by hand either: draw letterforms as shapes), no `<image>`, no gradients, filters, patterns, `<style>`, scripts or external references. No partial opacity.
- Centre the artwork in its viewBox with even margins, and keep ink off the viewBox edge.
- Strokes are allowed but risky: a stroke that is thin in the viewBox is thin forever. Prefer filled shapes; if you use strokes, make them at least 1/12 of the artwork's width.

A **compact variant** (`mark-compact.svg`) is the same sign with less in it, for 16–32 px: drop the secondary element, merge thin parts, enlarge the core. It must still look like the full mark (the audit compares them). Draw one whenever the full mark has detail that cannot survive 16 px, instead of crushing the full mark to fit.

## 2. Designing for the measurements

Think about the person who meets this logo at 16 px in a browser tab, having never seen it large. Whatever they cannot perceive there does not exist for them. So:

- **One idea, few shapes.** Two to five bold shapes. If you need to explain it, it has too much in it.
- **Thick everywhere.** At 16 px the artwork is 16 device pixels across, so any stroke or gap narrower than 1/16 of the artwork's width is under one pixel and will vanish or blur. Aim for strokes and gaps of at least 1/10.
- **No tiny separate pieces.** A dot, a star, a tick mark smaller than about 1/10 of the width is noise at small size.
- **Roughly square.** It has to sit in a favicon and an app icon. Keep the proportion under 2:1.
- **Silhouette first.** Squint: if the outline alone does not say what it is, interior detail will not save it.

### Look at it

You cannot judge a drawing from its path data. After writing a file, run `kothar check <file.svg>` and open the two PNGs it writes: the drawing large, and its real pixels at 16 px, enlarged. If you cannot tell what the small one is, neither can anyone else. The same command prints the measurements and the four nearest known shapes for that one file, so you can try a variant without running the whole audit.

## 3. Each audit rule and how to fix it

`kothar audit` prints findings as `level: [rule] message`. `fail` blocks the step; `warn` is shown to the user beside the logo.

| Rule | What was measured | Fix |
|---|---|---|
| `ink-fill`, `ink-stroke` | A colour other than `currentColor`/`none`, or a shape with no fill (renders black) | Put `fill="currentColor"` on the root; replace colours; cut holes instead of painting white |
| `forbidden-*`, `style-block`, `external-ref` | Text, raster, gradients, filters, CSS, links | Redraw as plain shapes |
| `viewbox`, `precision`, `filesize`, `complexity-nodes` | Missing viewBox, noisy decimals, too heavy, too many path nodes | Simplify; a logo is rarely more than 1–2 kB |
| `size` | Rendered at each size: share of ink thinner than one pixel, share of gaps that close, and how much of the shape survives the pixel grid. Reports the smallest size from which it stays clean (needs 16 px, or 48 px for a full mark that has a compact variant) | Thicken thin parts, widen gaps, remove detail; or add a compact variant |
| `topology` | At the target size the number of separate pieces or holes changes: a gap closed or a thin join broke | Widen that gap or thicken that join |
| `elements` | The smallest separate piece, in pixels at the target size. Under 1 px fails | Enlarge it, merge it into a larger shape, or remove it |
| `density` | Ink under 12% of its box (hairline) or over 95% (a block) | Add weight, or add a cut that gives the block a drawing |
| `pieces` | More than 12 separate pieces | Merge or remove |
| `aspect` | Longer than 2:1 | Recompose towards a square |
| `off-centre`, `clipped` | Artwork not centred in its viewBox, or touching its edge | Recentre; leave margin |
| `balance` (info) | Visual weight far from the centre of the shape | Fine if intended |
| `similarity` | Shape correlation against ~21,000 brand logos, UI icons and emoji. From 0.76 it warns, from 0.88 it fails, and names the nearest | See Originality |
| `siblings` | Two of your options are nearly the same drawing | Make them different ideas, not variations |
| `compact-kinship` | The compact variant no longer resembles the full mark | Simplify the same drawing |
| `judge-*` | What the blind judges saw (see `judges.md`) | Redraw what they misread |

Do not chase a number with tricks (padding the viewBox, adding a border to change the silhouette). The measurements exist to predict what a person sees; a drawing that games them still looks the way it looks.

## 4. Originality

A logo that is a stock icon is not a logo: it cannot be owned, and people will read it as "settings" or "send". The same goes for a mark that sits close to a famous brand, most of all a brand in the user's own industry, where the resemblance is a legal problem and not just a weak design.

- Do not start from the obvious pictogram of the subject (a gear for tools, a bolt for speed, a shield for security, a rocket for launch, a brain or sparkle for AI, a hexagon for anything technical). Start from what is particular to this name and this product.
- A plain initial in a heavy sans is the most common logo there is. If a letter is the idea, it needs a cut, a join or a second reading that makes it this product's letter.
- The comparison works on a coarse picture of the shape (its mass and outline on a 24-pixel grid, plain or mirrored), so it reacts to overall silhouette and where the weight sits, not to fine detail. Plain primitives (a filled square, a disc, a bar and a dot) always have dozens of neighbours.
- When `similarity` names a neighbour, look at what the two share (usually the silhouette) and change *that*: a different proportion, a cut through the mass, a counter-shape, an asymmetry. Rotating or mirroring does not count; the comparison already checks mirrored versions.
- A warning (0.76–0.88) is a prompt to look, not a wall. If the neighbour is something unrelated that merely shares a rectangle, and the judges do not name it, leave it; the user sees the note. Do not move a shape by a unit at a time to slip under the number: that changes the score, not what people see.
- A failure (0.88 and above) means the same shape. Change the idea, not the coordinates.
- When the judges say what it reminds them of, believe them over your own intent.

## 5. A worked example

A product that measures logos, named Kothar (a smith who names what he forges). Fusion concept: a try-square (the measuring tool) whose corner holds a dot (the thing measured, and the head of a hammer seen from above).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
  <path d="M8 8h48v14H22v34H8z"/>
  <circle data-ink="accent" cx="43" cy="43" r="12"/>
</svg>
```

Two shapes. The thinnest part (14 of 48 units) is 4.6 px at 16 px. The dot is 8 px at 16 px. In single ink both are one ink and still read as "corner + dot"; in the delivered versions the dot is grey. `depicts`: `["square", "try square", "escuadra", "corner", "bracket", "angle", "dot", "punto"]`.
