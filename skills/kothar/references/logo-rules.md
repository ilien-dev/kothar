# The logo file, and what the evidence supports

## Contents
1. The file contract
2. The small-size cut
3. Colour versions
4. What the evidence supports, and what it does not
5. Originality

## 1. The file contract

Every mark has a **master in one ink**. Colour versions are derived from it (section 3), so the drawing must work as a single flat colour on any ground. That is the oldest test in logo design, and it is also what makes the file usable as a favicon, an engraving or a one-colour print.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
  <path fill-rule="evenodd" d="..."/>
  <circle data-ink="accent" cx="..." cy="..." r="..."/>
</svg>
```

- `viewBox="0 0 256 256"` for the symbol. Whole numbers or one decimal, because nobody can see the third.
- Fill and stroke are only `currentColor` or `none`, with `fill="currentColor"` on the root.
- **An optional second tone:** mark the element or group with `data-ink="accent"`. It takes the accent colour in colour versions and the main ink in one-ink versions. The mark must still read when that part is the same ink as the rest. A part that only works because it is a different colour is a dependency, not a design.
- **Real holes, never white paint.** Cut the hole into the path (`fill-rule="evenodd"`) or use a `<mask>`. A white shape on top looks right on white and wrong everywhere else. Inside a `<mask>`, `#fff` and `#000` are allowed because they are the mask's own values, not colours. Give the mask `maskUnits="userSpaceOnUse"` with the full viewBox, or it clips stroked shapes. Prefix every `id` with the concept's id (`a-cut`), because several marks will share one page.
- No `<text>` in the symbol, no `<image>`, gradients, filters, patterns, `<style>`, scripts, external references or partial opacity.
- Centre the artwork optically with even margins, about 4-8% of the canvas, and keep ink off the edge.
- Strokes are allowed but are converted to filled shapes in the master before delivery, because a stroke scales differently from everything else.

## 2. The small-size cut

Someone may meet this logo at 16 px in a browser tab without ever having seen it large. Whatever they cannot perceive there does not exist for them. At 16 px a part narrower than 1/16 of the artwork is under one pixel and vanishes or blurs. Render the mark at 16, 24 and 32 px and look (`rendering.md`).

When detail is lost, draw `mark-small.svg`: the same sign with less in it. Drop the secondary element, merge thin parts and enlarge the counters. It must still look like the full mark. A simpler version is better than a crushed master. State in the brand book from which size each version is used.

## 3. Colour versions

From the master, derive (names in `deliverables.md`):

- **Colour on light:** the mark in the brand colour on paper, or in ink on a tile of the brand colour when the brand colour fails contrast on light (as Eco's lime does).
- **Colour on dark:** the brand colour or paper on ink.
- **One ink:** black, white, and the brand colour alone.

Every version is checked for contrast against its ground (`color.md`). Each version is a copy of the master with `currentColor` replaced by explicit colours and `data-ink="accent"` filled with the accent.

## 4. What the evidence supports, and what it does not

Research on how logos are perceived is thin. Most findings come from a single paper that showed invented brands once to a few hundred people, and the two that were retested at scale did not hold. The findings sort into three kinds, and each kind is used differently.

**Holds up across studies. Design for it.**

- People recognise a logo they know almost without error and still cannot reproduce its details (Blake et al. 2015; Iancu & Iancu 2017; Mayas et al. 2024). The sign lives in its overall silhouette, which is why the silhouette comes first.
- Design explains much of whether an unknown symbol is liked and very little of whether it is recognised later: 3-10% in a ten-country study (van der Lans et al. 2009). Memory comes from seeing the logo many times, which is the owner's work. Never promise "memorable".
- Liking rises with repeated exposure and then falls (Montoya et al. 2017, 268 curves). A first look predicts the long run poorly, whether it is yours, the user's or anyone else's.
- Curved contours are liked a little more than angular ones, mostly at a glance (Chuquichambi et al. 2022, 61 studies). It is a mild preference and says nothing about the product.

**Depends on the product. A reason to choose one way, never a rule.** The brief's stage, stakes and category say which way each one points.

- *Showing what the product does* helps a brand nobody knows yet, fades once the brand is known, and backfires when the category itself has bad associations (Luffarelli, Mukesh & Mahmood 2019).
- *A symbol alone does not bring a new brand's name to mind*, while the name does bring back the symbol (Dommer & Parker 2023; Morgan et al. 2021). For a new brand, the mark travels with the name.
- *Mirror symmetry* reads as familiar and easy. *Asymmetry* reads as livelier (Luffarelli et al. 2019; Bajaj & Bond 2018). Neither is better. An almost-symmetric shape is the one to avoid, because it reads as a broken symmetric one (Gartus & Leder 2017).
- *An enclosing frame* reads as protection when the stakes are high and as confinement when they are low (Fajardo et al. 2016).
- *Shapes with parts cut away* read as inventive and as less trustworthy (Hagtvedt 2011, on lettering).
- *Clear space between the parts* of a pictorial mark improves how it is rated (Sharma & Varki 2018), and small sizes need it anyway.
- *Recognisable, organic shapes* are liked more than abstract ones at first sight (van der Lans et al. 2009; Machado et al. 2015). That does not make them better recognised later.

**Never use as a reason**, in a rationale or to the user. These claims are common in design writing and are not supported:

- "Round is warm, angular is tough" and "a logo that suggests movement is liked more": both failed a preregistered retest with 823 people (Motoki & Iseki 2022).
- The golden ratio and construction on circle grids as merits: no preference for either has been found (Höge 1997; McManus et al. 2010; Stieger & Swami 2015). A construction grid is a drawing tool, not an argument.
- "Simpler is always better", "symmetry is quality".
- "A good logo raises sales": the evidence is correlational.

A rationale says what the mark shows and why that belongs to this product. It may cite one conditional reason above when it applies, and never one from the last list.

## 5. Originality

No index of known logos ships with this skill, so originality rests on your knowledge and your honesty.

- Do not start from the obvious pictogram of the subject or a cliché of the field (`craft.md`, step 1).
- A plain initial in a heavy sans is the most common logo there is. If a letter is the idea, it needs a cut, a join or a second reading that makes it this product's letter.
- For each concept, ask yourself which famous logos or stock icons it could be mistaken for, most of all in the user's own field. If one comes to mind, change the feature they share (usually the silhouette). Rotating or mirroring does not count.
- Name any resemblance you are unsure about next to the concept in the proposals report, so the user chooses knowing it.
- Always recommend a trademark search before public use.
