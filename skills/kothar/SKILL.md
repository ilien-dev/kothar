---
name: kothar
description: Chooses a product's name and builds its logo identity end to end - name candidates with their meaning, SVG logo options measured by scripts and judged blind, optional hand-drawn name lettering, free fonts, an animated logo and a shareable identity report, all in black, white and greys - through a step-by-step page on localhost where the user picks everything. Use it whenever the user wants to name a product, repo, app, library, company or side project, wants a logo, logotype, wordmark, icon, favicon or "brand" for one, asks for logo ideas or options, wants a font to go with a logo, or says the project needs an identity - even if they only ask for one of those pieces, and even if they never say the word "logo".
---

# kothar

Kothar-wa-Khasis forged the weapons of the gods and gave each one its name. This skill does both jobs for a product: it names it, then forges its logo.

Two ideas shape everything below.

**The user chooses in a page, not in the terminal.** After a couple of opening questions, the session opens a report on `localhost`. The user picks a name there, presses *Confirm*, and the page shows a loading screen while you work; when you publish the next step the page moves on by itself. The terminal stays quiet. This matters because choosing a logo is visual, and because the user should not have to babysit a terminal while you draw.

**Scripts decide what is good enough, not your impression.** You cannot see your own SVG the way a person does, and you are biased towards work you just made. So every logo is rendered and measured (does it survive 16 px, is anything too small to perceive, does it copy a famous brand or a stock icon) and then shown to judges who know nothing about it. A step cannot be published while a check fails. When a check fails, fix the drawing; do not argue with the number.

## The tool

Everything goes through one CLI, in `scripts/` next to this file:

```
node "<this skill's folder>/scripts/kothar.js" <command>
```

Below it is written `kothar <command>`. Run `kothar help` for the full list. State lives in `.kothar/` inside the user's project (`identity.json` is the single source of truth; you patch it with `kothar set --file patch.json`, never by hand-editing while the server runs, because the page writes to it too). The exact shape of every patch is in `references/identity.md`: read it before your first `set`.

First run on a machine: `kothar doctor`. If it does not say `ready`, run `kothar setup --refs` (installs the SVG renderer and builds the index of ~21,000 brand logos, icons and emoji that logos are compared against; a couple of minutes, once). Needs Node 20+ and npm.

**Language.** Speak to the user in their language, write everything you put on the page (names, reasons, rationales) in it, and pass its code to `init --locale <code>` so the page's own wording matches. English is the default; English and Spanish are built in. For any other language run `kothar strings --locale <code>` once before opening the page: if it answers `ready: false` it prints the English wording, which you translate (values only; keys, `{n}` placeholders and symbols stay) and store with `kothar strings save --locale <code> --file <file>`. The translation is kept on the machine, so each language is translated once. Without it the page falls back to English.

## The flow

```
terminal: understand the product, ask where names come from
   └─ page step 01  name + how it is written + how many logos      → Confirm
        (page shows "Creating logos" while you draw, measure, judge)
   └─ page step 02  logo (+ drawn name)                             → Confirm
        ("Building the identity")
   └─ page step 03  the identity report (read-only; steps 01–02 stay consultable)
terminal: changes are requested here; the report updates
```

**No colour.** The logo is chosen and delivered in black, white and greys: the main shape in the darkest ink, the optional second part (`data-ink="accent"`) in grey. A palette changes often and a logo rarely, and choosing colours from the logo alone is a poor basis, so colour is left to whoever designs the site, the README or the app later. If the user asks for colours, say so in one line and carry on; the delivered guide explains how to apply brand colours to the single-ink file.

### Before anything: is there earlier work, and what is this for?

Run `kothar status` first. Two questions decide everything that follows; ask them with selectable options, and only the ones that apply.

**What is the logo for?**
- *This repository* (the default inside a repository): read it, as step 0 says.
- *A different or new product*: do not read this repository for meaning. Ask the user what the product is and who it is for, and keep its work apart with `--dir .kothar-<short-name>` on every command.
- *No repository at all*: everything comes from what the user tells you; ask until you can write the two-sentence summary.

**If `status` shows earlier work for that same product** (`exists: true`):
- If `waitingForYou` is not null, the user asked for something in the page and nobody answered: that request is your task. Treat it exactly as if `kothar wait` had just returned it.
- Otherwise ask: *continue from the last report, or start from scratch?*
  - **From the last report**: `kothar restart`, `kothar open`, `kothar wait --step 1`. The page shows the same names and logos with the earlier choices selected. As long as the user only chooses again among what exists, the page moves through the steps and rebuilds the report **by itself**: you draw nothing. `wait` returns only when they ask for something new (a regenerate button, another number of logos, a drawn name that does not exist yet); then you do that part and carry on as usual.
  - **From scratch**: `kothar init --force …` sets the old work aside in a dated folder and begins again at step 0.

The user can also press *Start over* in the final report, which is the same as `kothar restart`. If your session is still open when that happens you will not be told; it does not matter, because the page needs you only when it shows a loading screen, and `kothar status` will then say what is pending.

### 0 · Before the page (terminal)

1. **Understand the product.** In a repository, read what it does: README, manifest, the main source folders. Names and logos must come from what this product actually does, so write down in one or two sentences what it is and who uses it. With no repository, ask the user.
2. `kothar init --summary "<those sentences>" --industry "<its field>" --locale <es|en>`. This also records the names the user already uses (their GitHub repositories, read with the user's own `gh` login when available, and the folders next to the project) so you never propose one of them. If the user wants **only the symbol** ("just the mark", "solo el logotipo"), add `--mark-only`: no fonts are offered, no name is drawn, no lockups are exported, and the page skips those parts.
3. **What kind of product is it, as a person would feel it?** Run `kothar traits`: it lists a dozen traits (competence, excitement, calm, trust, warmth…) and three kinds of product. From the repository and from what the user told you, give the traits that genuinely apply a weight from 1 to 3 and choose the kind, then save them (`"product": {"kind": …, "traits": {…}}` with `kothar set`). This is what the fonts for the name are chosen from, so judge it from evidence (who uses the product, what for, what is at stake for them), not from what would give fonts you like. If you cannot tell, ask the user one question about how they want the product to feel. In the same patch record three facts: `stage` (is the brand new to its audience, or already known), `stakes` (does using it put money, safety, health or data at risk) and `category` (does the field itself have bad associations). They decide which way several drawing rules point in step 2.
4. **Where should names come from?** Run `kothar prefs`.
   - If preferences are saved, ask one confirmation question and nothing else: *"Last time the names came from <categories>. Keep those, or use others?"* People who always name things after mythology should not be re-interviewed every time.
   - If nothing is saved, ask for a category or source of inspiration, offering a few options plus **"I don't know"** (then you choose, from the product itself). Then ask what they prefer in a name: length, and whose tongue it has to be easy for (speakers of their language, English speakers, both). Offer options and accept free text.
   - Save the answer with `kothar prefs save --file prefs.json` so it is not asked again (shape in `references/identity.md`).
5. Ask whether you may check availability online (`--online` sends each candidate to npm, PyPI, crates.io and DNS). Skip the lookups if they decline.

Use the harness's question tool with selectable options when it has one.

### 1 · Names → page step 01

Read `references/naming.md`. In short: brainstorm about twenty, measure them (`kothar names <a> <b> … --table`, which flags names already taken, hard to pronounce in each language, or one letter away from an existing one), keep **at least ten**. Each candidate carries *who or what it is* and *why that represents this product*. The second is the point: a name is justified by a real parallel with what the repository does, not by sounding good.

**The user already has a name.** Do not propose others. Send that single name as the only candidate (you still write what it refers to and why it fits, for the report) together with `"given": true` inside `naming`, and skip step 0.3 entirely (no questions, nothing saved to preferences). If you know of an established product with that same name in the same field, tell the user once, in the terminal, and carry on with their name: it is their decision, but they should make it knowing. The page then shows their name and goes straight to how it is written and how many logos.

The fonts offered for the name are not your taste either: `kothar font plan` chooses them from those product traits (a typeface is read as stable, friendly, technical, loud… before a word is read), one from each class that fits, all free. Before running it, look at the traits again with the name and the audience in mind: a name from myth or history adds `heritage`, a developer tool adds `technical`. A paid font can only come from the user, in the page, with a licence confirmation and a legal warning that the page shows.

If the user presses *Regenerate fonts*, `wait` returns `"regenerate": "fonts"` with `keep` and maybe a `hint`: run `kothar font plan --next --keep "A|B"`. It answers in one of three ways, in this order as the options run out: fonts that still fit the traits (`psychology`, nothing more to do); a list of `candidates` for you to choose from by judgement (`kothar font plan --pick "A|B"`, thinking of the product, the name and who will read it); or fonts drawn at random from those not shown yet. A hint from the user ("more serious", "with serifs") is a reason to use `--pick` yourself from `kothar font list`, whatever the mode. No font is ever offered twice. Then `kothar flow ready --step 1` and `wait` again.

Then: `kothar set --file patch.json` → `kothar flow ready --step 1` → `kothar open` (starts the server, opens the browser, prints the URL; tell the user the URL) → `kothar wait --step 1`.

`wait` blocks until the user confirms and prints their selection: name, font, whether they also want the name drawn in SVG, and how many logos. It exits with code 3 after nine minutes if they are still deciding: just run it again. While the user is choosing, say nothing more than where the page is.

### 2 · Logos → page step 02

The user asked for `count` logos. `kothar split <count>` gives the split across the three kinds of concept, which must all be present:

- **name**: depicts what the chosen name refers to (the figure, object, creature).
- **product**: depicts what the product does.
- **fusion**: one sign that carries both.

Three logos is one of each, six is two of each, nine is three of each. Any other number is split evenly, and the remainder goes to the kind with the richest material for *this* product (say why in that concept's rationale).

Read `references/logo-rules.md` before drawing: it is the authoring contract (single ink through `currentColor`, an optional accent, no text, no gradients, real holes) and it explains each measurement and how to fix a drawing that fails it. Its section "What the evidence supports" says what research on logos backs, how the product's traits, stage, stakes and category bear on a drawing (whether to depict the product, enclose the sign, keep it symmetric, cut a shape open), and which popular claims must never appear in a rationale. Write each concept to `.kothar/concepts/<id>/mark.svg`, plus `mark-compact.svg` when the full drawing cannot survive 16 px: a simpler version of the same sign is better than detail nobody can see.

If the user asked for the **name drawn in SVG**, read `references/wordmarks.md` and draw one per logo into `.kothar/wordmarks/`. This is where you are expected to be inventive: rearrange, stack, cut, flip or join letters, bring a piece of the mark into a letter, set one part in the second tone. Lettering that merely looks like a font is flagged by the audit, and lettering nobody can read is failed by the judges. Stay between the two.

**Look at what you draw.** `kothar check <file.svg>` measures one drawing in a second (add `--role wordmark` for a drawn name) and writes two PNGs you can open: the drawing large, and its real pixels at 16 px. Use it after every drawing, before the full audit: reading the picture tells you more than the numbers, and it is how you find out what a similarity score is about.

Keep the loading screen honest as you go: `kothar flow working --doing <n>`, where `<n>` is the 0-based position of the task in progress in the list the page shows (the list is filled in automatically when the user confirms).

Then measure and judge, and loop until clean:

1. `kothar audit` until there is no `fail`. Fix a `warn` when the fix is obvious; do not grind on one. A similarity warning whose neighbour is plainly unrelated (you looked at both) can stay.
2. `kothar judge pack`, then follow `references/judges.md`: it prints three prompts; start three fresh agents with exactly those; they save their own answers; `kothar judge score`.
3. Redraw what the judges failed or did not recognise, audit again, and run **one** more round. A drawing that changed needs that new round; the gate checks it.

Stop after the second judged round unless a `fail` remains. Leftover warnings are shown to the user beside each logo in plain words, which is fine: they are entitled to pick a logo that only works from 24 px, or that reminds people of something, as long as they know. `references/judges.md` says exactly what is worth another round and what is not.

`kothar flow ready --step 2` → `kothar wait --step 2`. The selection has the chosen logo, the chosen lettering (`wordmark` is null when they keep their font).

Instead of choosing, the user may ask for other options from the page. Then `wait` returns `"regenerate": "logos"` or `"regenerate": "names"`, with `keep` (the ids they marked to keep) and sometimes a `hint`. Leave the kept ones exactly as they are (same id, same file) and replace only the others: a new logo takes the category of the one it replaces, so the split holds, and gets a new id; new drawings must be different ideas, not retouches of what was turned down. Then the same loop as before for the new drawings (check, audit, a judge round, at most two) and `flow ready --step 2` again. Repeat as often as they ask.

### 3 · Identity → page step 03

The user confirmed a logo: the page shows "Building the identity" while you do this.

1. `kothar animate` writes a baseline animated SVG for the chosen mark. If a reveal that fits the concept is obvious (a hammer strikes, a ruler extends), improve it by hand following the rules in `references/animation.md`.
2. `kothar report` audits the animation, exports the files to `.kothar/final/`, publishes step 03 in the page and writes `.kothar/report.html`, a single self-contained file the user can send to anyone.

Tell the user, briefly, that the report is open in the page, and keep listening with `kothar wait --step 3`. The report has three ways forward and the page handles two of them alone:

- **Generate assets**: the user is satisfied. The page writes everything into the project's `assets/logo/` folder (the mark and the mark + name as SVG in black and grey for light grounds, white and grey for dark grounds, and single ink; PNGs; favicon and home-screen icon; a link-preview image; the animated mark; `tokens.json` with the name, font and inks; the identity report; and a `README.md` that tells whoever uses the logo how: files, tones, sizes, clear space, how to apply brand colours later, what not to do). Then the server stops and `wait` returns `"delivered": true`. **That ends the job**: stop listening, tell the user where the files are in one or two lines, and finish. Using the logo in the repository (README, site, app) is work for another session.
- **Start over**: the page reopens step 01 with everything kept; see "Before anything" above. `wait` returns only if they then ask for something new.
- Nothing, and the user comes back to the terminal to ask for a change: see below.

`kothar deliver` does the same as the button, if the user asks in the terminal. Steps 01 and 02 stay open in the page to review what was chosen, not to change it.

### After the report

Changes are asked for in the terminal.

- **A tweak to the chosen identity** ("make the dot bigger", "a thicker corner"): edit the file, `kothar audit`, then `kothar report` again. The page updates in place. A changed mark needs a fresh judge round only if its shape changed materially.
- **A different name or logo**: go back to that step (`kothar flow ready --step <n>` after preparing its content) and continue forward from there.

`kothar stop` shuts the server down when the user is finished.

## When things are not ideal

- **No browser, or a remote machine.** `kothar open --no-browser` still prints the URL; give it to the user (they may need to forward the port).
- **No way to spawn agents.** See the fallbacks in `references/judges.md`. Never skip judging silently; if it truly cannot be done, publish with `--override "<reason>"`, which the page shows to the user.
- **The similarity index is missing** (`setup --refs` failed, offline). The audit says so and the page tells the user that likeness to known logos was not checked. Do not present such logos as original.
- **A check you believe is wrong.** Fix the drawing anyway if you can. Only if the check is plainly inapplicable, `kothar flow ready --step <n> --override "<reason>"`; the reason is displayed in the page. Never use it to save time.
- **Shell quoting.** Always pass JSON through `--file`, never inline: quoting differs between shells and breaks on Windows.
