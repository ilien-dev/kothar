# Colour

The user decides the colours. Your job is a good first proposal, read from what they showed you, which they can change later.

## Where the colours come from

1. **What the user said** in step 4: existing colours (keep them exactly), likes, dislikes.
2. **The references:** the colours that recur across the images they liked, and the overall temperature, saturation and contrast. Estimate HEX values from what you see and say they are estimates.
3. **The field:** note the colour every competitor uses (blue in developer tools and finance, green in ecology) and move away from it unless the user wants to belong there.

## The palette

Keep it small. A brand is recognised by one colour, not by five.

| Role | What it is | Example (Eco) |
|---|---|---|
| **Brand** | The signature colour, used on the mark, a tile or large surfaces | Lime `#C4F03A` |
| **Ink** | Near-black for text and the one-ink mark, often tinted slightly toward the brand | `#151515` |
| **Paper** | Near-white for grounds | `#F4F4F2` |
| **Brand, dark** | Only when the brand colour fails as text on paper: a darker shade for small text and lines | `#4A6600` |
| **Accent** (optional) | Only when the references call for a second colour. Same role as `data-ink="accent"` | none |

Give each colour HEX and RGB. Give CMYK only as a labelled approximation, and never claim a Pantone match: printing needs a proof.

## Contrast

Check every pairing the brand book and the pieces use. The WCAG ratio is `(L1 + 0.05) / (L2 + 0.05)`, where L is the relative luminance of the lighter (L1) and darker (L2) colour: for each sRGB channel `c = v/255`, `c ≤ 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4`, then `L = 0.2126 R + 0.7152 G + 0.0722 B`. Compute it with any interpreter the machine has (node, python, PowerShell), or by hand.

- Text: at least 4.5:1, or 3:1 at 24 px and above.
- The mark against its ground: at least 3:1. Below that, place the mark on a tile (Eco: ink on a lime tile, because lime on white is 1.1:1).

Write the ratios in the brand book's colour page. They tell whoever uses the identity later which pairings are allowed.

## In the proposals report

Show each concept in the palette you propose for it, and add **two alternative palettes**. The concept page's row of three tiles holds them: the proposed palette first, then the two alternatives, each with the mark on it. That is how the user sees which colours they like before anything is final. The colours are confirmed in the final round.
