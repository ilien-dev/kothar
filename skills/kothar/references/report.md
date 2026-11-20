# The reports

The user sees the work in two HTML reports built from `assets/report.html`: the **proposals report** (`.kothar/proposals.html`) and the **brand book** (`assets/brand/brand-book.html`). Both are single files that open from disk in any browser, print to PDF one page per slide, and can be sent to anyone.

The template is a complete example (Eco). It shows the quality expected: the layout, the density and the tone of the text. Copy it, then replace every text, colour and drawing.

## Language

Write the report in the language the user chose in step 6 of `SKILL.md`, and set `<html lang>` to match. That covers every heading, caption and label in the template, not only your own text. Names of files, colours in HEX and font names stay as they are.

## Which pages go in each report

Each `<section>` in the template starts with a comment naming the page.

| Page | Proposals | Brand book | Holds |
|---|---|---|---|
| cover | ✓ | ✓ | The name, the tagline (the user's, or one line from the brief; label it as a proposal), the date, `[client]` if unknown |
| brief | ✓ | ✓ | The product in two sentences, adjectives, what to avoid, the user's references as images |
| concept | one per concept | | Idea, rationale, honest resemblance note, the mark large, on the brand colour, at 64/32/16 px, three mockups (tab, app icon, README header), the proposed palette and two alternatives |
| comparison | ✓ | | Every concept at the same sizes, on paper and on ink |
| recommendation | ✓ | | Your pick, why, one honest risk, what the user should answer |
| idea | | ✓ | The chosen concept's story and its construction lines |
| symbol | | ✓ | The size ladder, the small cut and from which size it is used, tab, app icons, dark ground |
| colour and type | | ✓ | Every colour with HEX, RGB and use, the contrast ratios, each family with its role |
| lockups | | ✓ | Horizontal, on dark, stacked, clear space with its unit, four misuses |
| in the product | | ✓ | Terminal (developer tools), README, the website as a **skeleton mock-up**, stickers |
| social | | if selected | Only the selected networks, each in its real proportions |
| stationery | | if selected | Only the selected pieces |
| motion and delivery | | ✓ | The animation frames (if selected), the file tree, next steps (always a trademark search) |

Drop a page or a mockup the brand does not need: no terminal for a bakery, for example. Replace mockups with ones that fit the product: a cup or a bag for a café, signage for a shop.

## Filling it

- **Tokens:** set the `:root` block at the top: brand colours, the font of the name, its weight and tracking. Replace the Google Fonts link with the brand's families. Most of the page follows from those.
- **Marks:** put each mark in the hidden `<defs>` as a `<symbol>` and reuse it with `<use href="#id"/>`, so each drawing appears once. In the proposals report give each concept its own ids (`mark-a`, `mark-a-small`, `mark-b`…), and prefix the ids inside each mark too (masks, clip paths). Colour comes from `color:` on the `<svg>`, because the masters use `currentColor`. For a `data-ink="accent"` part, write `style="fill:var(--accent,currentColor)"` on it inside the symbol and set `--accent` where the mark is shown.
- **One palette per concept:** in the proposals report each concept has its own palette and name font. Override the tokens on its pages with a class, as `.concept-a` does in the template (`--brand`, `--on-brand`, `--accent`, `--font-name`, `--font-name-weight`, `--font-name-tracking`), and load every font the concepts use in the one Google Fonts link (keep `display=block`).
- **When the brand colour fails on paper** (under 3:1, like Eco's lime or a warm red), show the large mark on ink or on a tile of the brand colour, never as brand colour on a light ground.
- **References:** each tile on the brief page becomes `<img src="data:…">` (inline the user's images as base64 so the file stays self-contained) with `object-fit: cover`, and a caption saying what was taken from it. If an image is too heavy to inline (over about 2 MB), resize it with the browser first or link to it relatively. If the user gave no images, make text tiles: the brand they named and, in a few words, what they like about it. Never redraw another brand's logo.
- **Fixed pages:** every page is 630 px tall and clips what does not fit. Keep headlines to three lines and rationale to a few short lines. If a page overflows, shorten the text; do not shrink the type.
- **Lockups in the brand book:** use the outlined files (`<img src="logo/<name>-horizontal.svg">`, relative to `assets/brand/`) where the exact drawing matters. Live text in the brand font is fine in mockups.
- **Text:** plain, specific sentences in the user's words. Facts only: no invented statistics, clients or commands. Write unknown details as `[placeholders]`.
- **Page numbers and footers:** renumber in order. The footer and cover say "Proposals" in the proposals report and "Brand book" in the brand book (translated).
- **The recommendation page** always ends with a trademark search among the next steps, as the brand book's delivery page does.

Before opening it, search the file for what must be gone, matching whole words and ignoring case: `eco`, `echo`, `mountain`, `cave`, `nymph`, `lime`, `get found`, `C4F03A`, `4A6600`, `FF5F0F`, `1D2B53`, `[name of the concept]`. Then screenshot every page (`rendering.md`, "To look at a report") and look at each one: overflowing text, lettering that collides at the cover's large size (loosen the tracking there if it does), marks that disappear on their ground.

## Credits

Every report, and the brand folder, credits kothar quietly, so that anyone who finds a published identity can find the tool:

- **The report:** keep the `<meta name="generator">` tag and the colophon `<footer class="colo">` at the end: kothar's logo in one ink, "Identity made with kothar" (translated), and the link `https://github.com/ilien-dev/kothar`. The colophon is hidden when printing and the `<span class="credit">` in the last page's footer takes its place, so the PDF keeps the credit without an extra page. The template has that span on the recommendation page (the last page of the proposals report) and on the delivery page (the last page of the brand book); keep it on whichever page comes last.
- **`assets/brand/README.md`:** last line, `Identity made with [kothar](https://github.com/ilien-dev/kothar).`
- **`tokens.json`:** the `generator` field.
- **The delivered SVG masters** in `assets/brand/logo/` (not the concepts in `.kothar/`): a first-line comment, `<!-- made with kothar · https://github.com/ilien-dev/kothar -->`.

Never put the credit inside the user's pieces: not on social images, stationery, icons or the logo itself. Their brand is theirs. If the user asks to remove the credit, remove it.

## Opening and changing

Open the file with the system browser (`rendering.md`, "Opening a page") and give the path. When the user asks for a change, edit the source (the mark, the palette, a piece), render the affected files again, update the pages that show them, and reopen.
