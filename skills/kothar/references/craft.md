# Finding the idea, then building it

Logos drawn by an agent fail in two predictable ways: **too plain** (a primitive and a dot, a heavy initial, the obvious pictogram) or **too strange** (a pile of shapes nobody can read, drawn to look different rather than to say something). Both have the same cause: drawing the first idea. This page is the method that avoids it. Follow it in order.

## 1. Mine the brief

From `.kothar/brief.md`, the name and the references, write a **word map**: four short lists side by side.

| The name | What the product does | How it should feel | The references |
|---|---|---|---|
| who or what it refers to, its story, its places, objects, gestures | its verb, its material, its result, its user's moment | the adjectives, and their opposites | the contours, weights and devices the user showed you |

The ideas worth drawing sit where two lists touch. For Eco, a nymph who could only repeat what she heard (*name*) met a tool that returns the words people search for (*product*) in **the place where an echo lives**: a mountain with a cave.

List the **clichés of the field** (for SEO: magnifiers, arrows, charts, blue; for AI: sparkles, brains, nodes; for security: shields, locks). They are off-limits unless an idea gives one a genuinely fresh form.

## 2. Write many ideas, in one sentence each

Write **12 to 20** ideas before drawing anything. Each one is a sentence that describes a drawable sign *and* its twist:

- "Two peaks with a cave whose inner arch repeats the outer one: the echo made visible." (an idea)
- "A mountain." (a subject, not an idea)
- "A modern abstract shape that conveys trust." (could describe a competitor's logo: drop it)

Spread the ideas across kinds of mark. Do not settle on one formula: a pictorial sign, a scene reduced to its silhouette, an abstract form with a story, a letter with a second reading, an emblem, a negative-space trick, a gesture. You choose what kind suits each idea. Nothing is imposed.

The devices that make a mark more than a picture:

- **A second reading:** one shape that is two things at once (the arch is a cave *and* a returning sound wave).
- **A place, a moment or a gesture** instead of an object: the cave rather than the nymph, the strike rather than the hammer.
- **Repetition that means something:** an echo, a rhythm, a step that recurs.
- **Negative space that carries the idea:** the hole is the meaning.
- **A borrowed geometry:** the angle or curve of the subject reused everywhere, including in the lettering.

## 3. Choose

Score each idea quickly, out loud for yourself: is it clear in one glance, particular to *this* product, different from the field, drawable in a few forms, alive at 16 px? Keep the **strongest and most different** ones, as many as the user asked for. Two variations of one idea count as one.

Watch for the plain failure in disguise: a primitive with a dot (a square and a circle, a bar and a dot, a tile with a notch), a heavy initial, or a stock shape. Keep one only if it has a second reading that belongs to this product, and say what that reading is.

For each kept idea, look at three or four excellent marks you know that use the same technique (a negative-space mark, a monoline mark, a geometric emblem) and see how their geometry is built: the number of radii, how strokes end, how the counter-shapes are sized. Learn the construction. Never borrow the shape.

## 4. Describe the construction, then draw

Before writing any SVG, write the construction in words, for example: "256 grid. Two triangles with 60° flanks, apexes rounded at r=12. A cave as a 44-radius arch on the baseline, centred at x=128, with a 20-radius arch inside. The flanks share the slope used later in the letter cuts."

Then draw it in a `viewBox="0 0 256 256"`:

- Few anchors, arcs for circular geometry (`A`), exact angles (0/15/30/45/60/90°), one or two radii repeated, consistent stroke weights.
- Real holes through `fill-rule="evenodd"`. The contract is in `logo-rules.md`.
- Save each meaningful iteration as `mark-v1.svg`, `mark-v2.svg`… and do not overwrite; copy the one you keep to `mark.svg`. Comparing versions is how you see progress.
- Write the word map, the ideas, your choice and the constructions in `.kothar/concepts/ideas.md`, so the reasoning survives the session and feeds the report.

## 5. Look, refine, twice at least

Render a contact sheet (`rendering.md`): every concept large, at 64, 32 and 16 px, and on a light and a dark ground. Open the PNG. Then check:

- **The silhouette:** squint. Does the outline alone say what it is?
- **16 px:** the idea survives, or a `mark-small.svg` (less detail, bigger counters) does.
- **Junctions:** no slivers, notches or lumps where shapes meet.
- **Optical corrections:** round and pointed forms overshoot the baseline slightly (1-3%), the mark sits a touch above the geometric centre, and horizontals are a little thinner than verticals.
- **Unwanted readings:** flip it, rotate it 180°, view it tiny. Look for letters, body parts or famous logos.
- **The peer test:** imagine it in a row of excellent logos at the same size. Does it look equally resolved?
- **Literalness:** if it is just the product drawn (a cup for coffee), push it further or replace it.

Refine and render again. Two rounds is the minimum, and the third is often where it becomes good.

## 6. Then colour and letters

Only now give each concept a palette (`color.md`) and a font for the name (`typography.md`). A form that only works in colour is not finished: the one-ink version must read on its own.

## The worked example: Eco

Eco is a pair of skills that research keywords and place them in a project's README and site. Its name comes from Echo, the mountain nymph who could only repeat the last words she heard.

- **Word map, where the lists touch:** *returns what it hears* + *gives back the words people search for* → **the place where an echo lives**.
- **Idea:** "Two peaks with a cave; inside, an arch that repeats the outer arch: the voice coming back from the mountain."
- **Construction:** two triangles with rounded apexes on a shared base, a cave of radius 44 and an inner arch of radius 20, both centred on the baseline. The cuts in the custom letters reuse the slope of the flanks.
- **Small size:** below 32 px the inner arch is dropped and the cave grows, so at 16 px what remains is two peaks and a cave.
- **Colour:** an acid lime used as a surface (a tile) and ink. Lime never touches a light ground as a line or text, because it fails contrast there.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
  <path fill-rule="evenodd" transform="translate(0 -6)" d="M8.24 220L89 80.12Q96 68 103 80.12L128.51 124.31L158.1 60.69Q164 48 169.9 60.69L244 220ZM84 220V202A44 44 0 0 1 172 202V220ZM108 220V202A20 20 0 0 1 148 202V220Z"/>
</svg>
```

What made it work: a place instead of a character, a second reading (the arch is a cave and a sound coming back), one geometry repeated everywhere, and a small-size cut instead of a crushed master.
