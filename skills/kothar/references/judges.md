# Blind judges

You made these logos and you know what each is meant to be, which makes you the worst possible judge of whether a stranger can tell. The judges are agents that know nothing: not the product, not the name, not your rationale. They see anonymised images and say what they see. What they report is the closest thing available to a first-time viewer.

## Running a round

Pack when the only failures left in `kothar audit` are `judge-missing` or `judge-stale` (those two mean exactly "this drawing has not been judged: pack a round"). Any other failure is fixed first: every pack is a round, and a round costs three agents.

1. `kothar judge pack` builds the packet in a temporary folder outside the project (so nothing near it gives the project away) and prints it together with **three ready prompts**. The packet holds PNG renders named by random codes, `INSTRUCTIONS.md` and `answers.template.json`. For each mark: its real pixels at 16 px (enlarged; this is the compact variant when there is one), a large render, and a dark-ground render. For each drawn name, plus the plain font version as a baseline when there are drawn names: its pixels at 22 px tall, and a large render.

2. Start **at least three** judges, in parallel, each a fresh agent with no access to this conversation, each given exactly one of the printed prompts **and nothing else**. Do not add the product name, what the logos depict, what you hope to hear, or a description of the task. Every extra word is context, and context is what a real viewer lacks.

   If the harness lets you choose a model per agent, give the judges different models (for example one small, one medium, one large). Three copies of the same model tend to answer in the same words, which is one opinion sampled three times; different models disagree more usefully, and smaller ones cost less.

3. Each judge saves its own `answer-jN.json` in the packet and replies `done`. You do not retype anything.

4. `kothar judge score` collects the answers, matches them to your concepts and writes the verdicts into `audit.json`. `kothar audit` then shows everything together.

## What the score checks

- **Recognition.** Each concept has `depicts`: words a stranger should use for it. A judge recognised the mark when their description uses those words (whole words; plurals and close stems count; "a T" matches "letter t"). Fewer than half at large size is a warning with the judges' own words; recognised large but not at 16 px is a warning that the small version loses the idea. An abstract mark may legitimately be described by its shapes: list those shapes in `depicts` from the start.
- **Lookalikes.** When most judges are reminded of the same thing, you get their words back. Words that name your intended subject are ignored (judges seeing a spool in a spool logo is success). What remains is a **warning when the judges also rate distinctiveness 3 or lower**, and only a note when they rate it higher.
- **Reading.** For a drawn name, at least two thirds of the judges must type the name (letters only; upper or lower case does not matter) or it fails, with what they typed instead.
- **Scores** for legibility, distinctiveness and memorability are medians. Low distinctiveness across judges means "generic", whatever the similarity index said.

## Acting on it, and when to stop

Fix, in this order, then pack one more round:

1. Any **fail** (a drawn name the judges could not read). Not optional.
2. A mark **not recognised** by most judges at large size: the drawing does not say what you meant. Redraw it.
3. A **lookalike warning** where the judges named a real brand or a stock UI icon. Change the feature that causes it.
4. **Distinctiveness of 2 or lower**: the concept reads as generic. Replace the concept, do not polish it.

Then stop. **Two judged rounds is the limit** unless a fail remains: after the second round, publish with whatever warnings are left. They are shown to the user beside each logo, in plain words, and the user is entitled to choose a logo knowing its weakness. Do not spend a third round chasing a warning, and do not nudge shapes by a unit at a time to move a number.

A drawing changed after the judges saw it counts as not judged (the audit compares file contents), so finish all redraws before packing. Do not edit `depicts` to match what the judges happened to say, unless it was an honest omission of a word for the same thing.

## If you cannot spawn agents

In order of preference:

1. **A separate process with a clean context**, one per judge, for example `claude -p "<prompt>"` or `codex exec "<prompt>"` with a printed prompt.
2. **Ask the user to be a judge**, or to show the packet to someone who has not seen the project. One human stranger is worth several agents. Their answers go in the same JSON shape, saved as `answer-j1.json` in the packet.
3. **None of these is possible**: do not judge your own work and call it blind. Publish the step with `kothar flow ready --step 2 --override "blind judging was not possible in this environment"`. The page then tells the user the logos were not judged, which is the truth they need to choose well.
