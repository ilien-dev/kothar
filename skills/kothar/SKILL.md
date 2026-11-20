---
name: kothar
description: Use when the user wants a name, a logo or a brand identity for a product, repository, app, library, company or side project - naming it, logo or icon ideas, a logotype or wordmark, a favicon or app icon, brand colours or fonts, a brand book or style guide, profile images and banners for GitHub, X, LinkedIn, Instagram, TikTok, YouTube, Discord or other networks, letterhead, a contract template, business cards or an email signature - even if they only ask for one of those pieces and never say "brand".
---

# kothar

Kothar-wa-Khasis forged the weapons of the gods and gave each one its name. This skill does the same for a product: it names it, forges its logo, and builds the brand around it. A studio would deliver that as a brand book. Here the brand book is a single HTML file that the user opens in their browser.

Everything happens through questions in the conversation. There is no server and nothing to install. You draw in SVG, render what you draw with a browser already on the machine, look at the pictures, and write the files into the user's project.

## Three things that decide the quality

1. **References before ideas.** What the user shows you outweighs anything they could describe. Ask for images first, and read every one.
2. **Ideas before drawings.** Write many one-sentence ideas, keep the few that are different and particular to this product, and only then draw. `references/craft.md` is the method. Read it before the first drawing, every time.
3. **Look at what you draw.** You cannot judge a mark from its path data. Render it large and at 16 px (`references/rendering.md`), open the PNGs, and fix what you see. If no browser can render on this machine, tell the user and keep the geometry extra simple.

## Ask with options

Use the harness's question tool with selectable options when it has one, a few questions per call. Without one, ask in a short numbered list. Speak the user's language throughout. Keep the terminal quiet while you work: one line on what you are doing, not a narration.

## The flow

```
1  What it is for                   (questions)
2  References                       (questions; images preferred)
3  Name                             (questions; candidates in the chat)
4  How many logos, which colours, which pieces   (questions)
5  Draw the proposals               (work: craft, render, refine)
6  Report language                  (question)
7  Proposals report                 (HTML opened in the browser) → the user chooses in the chat
8  Build the identity and the pieces (work)
9  Brand book                       (HTML opened in the browser) → changes in the chat
```

Work in progress lives in `.kothar/` in the product's folder (the brief, the ideas, the concepts, render pages and the proposals report); every `.kothar/` path below is relative to it. What the user keeps goes to `assets/brand/` (or `brand/` when the project has no `assets/` folder). If `.kothar/brief.md` already exists, ask whether to continue from it or start over. Starting over moves the old `.kothar/` aside under a dated name; never delete it.

### 1 · What it is for

Ask what the brand is for:
- **This repository** (the default inside one): read what it does (README, manifest, main source folders) and write two sentences on what it is and who uses it.
- **Another or a new product:** ask what it is and who it is for. If you are inside a repository that belongs to something else, use `.kothar-<short-name>/` instead of `.kothar/` so the two do not mix.
- **No repository:** everything comes from what the user tells you. Ask until you can write those two sentences.

### 2 · References

This is the question that steers everything after it, so ask it early and say why. Ask for **several** references, images preferred: logos they like, websites, app icons, posters, photographs, anything that shows the look, mood or message they want. Paths, pasted images or links all work. If they have no images, ask for the most precise description they can give: brands they admire and what they like about each, how it should feel, what it must not look like.

Open and read every image. For each reference, note in one line what to take from it (a colour, a weight, a contour, a mood) and what to leave. Then write `.kothar/brief.md`:

```
Product: <two sentences>          Audience: <who, what is at stake for them>
Adjectives: <3-5, from the user's words and references>
References: <one line each: what to take, what to leave>
Likes / dislikes: <in their words>
Clichés of the field: <the signs every competitor uses; off-limits without a fresh twist>
Stage: new | known       Stakes: low | high       Category: neutral | negative
Name note: <a known product with the same name, if any>
Choices: <logo count> · <colour answer> · <pieces> · <report language>   (filled in at steps 4 and 6)
```

Stage, stakes and category are read from the evidence. They tilt several drawing decisions (see `references/logo-rules.md`).

### 3 · Name

- **They have a name:** use it as given. If you know of an established product with that name in the same field, say so once, then carry on.
- **They want one:** follow `references/naming.md`. Ask where names should come from (free answer, or "I don't know", and then you choose from the product), the length, and whose tongue it has to be easy for. Ask whether you may check availability online. Present at least ten candidates in the chat, each with what it refers to and why that represents the product, and let them pick or ask for more.

### 4 · How many logos, colours, pieces

In one round of questions:
- **How many logo proposals:** 3 (recommended), 4, 6, or a number of their own.
- **Colour:** do they already have colours, preferences, or should the references decide? See `references/color.md`.
- **Which pieces to deliver,** multi-select. Group them the way `references/deliverables.md` does: social networks (GitHub, X, LinkedIn, Facebook, Instagram, TikTok, YouTube, Discord, Bluesky, Mastodon, Threads, Reddit, Product Hunt), stationery (letterhead, contract template, business card, email signature, invoice, presentation slide), and the animated logo. The core identity (the symbol, a small-size version, lockups, colour and one-ink versions, palette, type, favicon and app icons) always comes.

### 5 · Draw the proposals

Read `references/craft.md` and `references/logo-rules.md`. In short:

1. In `.kothar/concepts/ideas.md`, write the word map and 12 to 20 one-sentence ideas from the brief, the name and the references. Choose freely what kind of mark each one is: a pictorial sign, an abstract form, a letter, a scene, an emblem. No categories are imposed, and the ideas should not repeat one formula.
2. Keep the strongest, most different ones, as many as the user asked for. For each one, write down the construction (shapes, radii, angles, grid) before drawing.
3. Draw each one in `.kothar/concepts/<id>/` as `mark-v1.svg`, `mark-v2.svg`…, and copy the version you keep to `mark.svg`. Add `mark-small.svg` when detail will not survive 24 px.
4. Render a contact sheet, look at it, and refine at least twice. Then propose a palette (`references/color.md`) and a name font (`references/typography.md`) for each concept.

### 6 · Report language

Just before generating the first report, ask: *"Should the report be in <the conversation's language> or in English?"* Use that answer for both reports. Skip it when the conversation is in English.

### 7 · Proposals report

Build `.kothar/proposals.html` from `assets/report.html` as `references/report.md` describes: a cover, the brief and references, one page per concept (the idea, why it fits, the mark large and at 16-64 px, the palette, and three small mockups), a comparison page and your recommendation. Open it in the browser (`references/rendering.md`, "Opening a page"). In the chat, give one line per concept and your recommendation, then ask which one to take forward. The user may also ask for changes or for new ideas: redraw (new ideas, not retouches of the rejected ones), rebuild the report, and ask again.

### 8 · Build the identity and the pieces

For the chosen concept:
1. Final geometry, optical corrections and the small-size cut. Final palette and fonts.
2. The core files and every piece the user selected, as `references/deliverables.md` lists them. The name in each lockup is converted to outlines, and PNGs and the `.ico` come from the browser (`references/rendering.md`).
3. The animated logo if selected (`references/animation.md`).
4. `tokens.json` and a `README.md` for the brand folder, credit included (`references/report.md`, "Credits").

### 9 · Brand book

Build `assets/brand/brand-book.html` with every page of `references/report.md` that applies to what was selected, open it in the browser, and tell the user in two lines where it is and where the files are. Changes are asked for in the chat: edit the file or the piece, render again, rebuild the affected pages, reopen.

The job ends there. Using the identity in the README, the site or the app is a separate task.

## When things are not ideal

- **No Chromium-based browser** (Chrome, Edge, Brave, Chromium): deliver SVG only and say plainly that the PNGs, the `.ico` and the name outlines need one. The lockups keep the name as live text naming its font.
- **Offline:** the outline step and the fonts in the report need the network. Lockups keep live text and the report falls back to system fonts. Say so.
- **The user gives a paid font:** use it only if they confirm that they hold a licence that covers logo use. It cannot be outlined from a public URL, so ask for the font file.
- **A mark resembles a known logo:** when you or the user notice it, change the feature that causes it. Always recommend a professional trademark search before public use; you cannot clear a mark.
