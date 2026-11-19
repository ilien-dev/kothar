# identity.json and the patches you send

`.kothar/identity.json` is shared by you, the scripts and the page. Change it with `kothar set --file <patch.json>`: the patch is deep-merged, **objects merge, arrays are replaced whole**. So to add a concept, send the full `concepts` array. Paths are relative to `.kothar/`.

Do not write `selection`, `flow` or `inbox` yourself: the page and the `flow` command own them.

## Preferences file (`kothar prefs save --file prefs.json`)

```json
{ "categories": ["mythology of any culture"], "length": "short", "pronounce": ["es", "en"], "notes": "avoid Greek gods, already used a lot" }
```

Use `"noPreference": true` instead of `categories` when the user answered "I don't know". Saved in `~/.kothar`, shared by all their projects.

## Step 1 patch: names and fonts

```json
{
  "naming": {
    "categories": ["mythology"],
    "preferences": { "length": "short", "pronounce": ["es", "en"] },
    "candidates": [
      { "name": "Kothar",
        "represents": "Ugaritic craftsman god who forges Baal's weapons and gives them their names.",
        "why": "The plugin does both: it names the product and forges its logo." }
    ]
  },
  "fonts": {
    "options": [
      { "family": "Inter Tight", "weight": 800, "free": true, "license": "OFL-1.1" },
      { "family": "Fraunces", "weight": 700, "free": true, "license": "OFL-1.1", "uppercase": false, "tracking": 0 }
    ]
  }
}
```

- At least 10 candidates, each with all three fields, none equal to a name in `naming.taken`.
- When the user arrived with a name: `"given": true` inside `naming` and exactly one candidate, theirs.
- `represents` and `why` are shown to the user as a table row: one sentence each, in the user's language.
- With `--mark-only`, omit `fonts` altogether.
- Font options are written by `kothar font plan`; you normally do not send `fonts` yourself. If you must add one by hand, verify it with `kothar font check` and copy `free` and `license` from its output. `weight` is the weight the name is set in. Optional `uppercase` (set the name in capitals) and `tracking` (letter spacing in em, e.g. `0.08`).

## Step 2 patch: concepts and drawn names

```json
{
  "concepts": [
    { "id": "c1", "category": "name",
      "title": "Kothar's hammer",
      "rationale": "A K struck in one blow: the smith's tool is also the initial.",
      "depicts": ["hammer", "martillo", "k", "letter"],
      "mark": "concepts/c1/mark.svg",
      "compact": "concepts/c1/mark-compact.svg" }
  ],
  "wordmarks": [
    { "id": "w1", "title": "Measured dot",
      "rationale": "The A loses its bar and the dot from the mark sits inside the O.",
      "file": "wordmarks/w1.svg" }
  ]
}
```

- `category` is `name`, `product` or `fusion`; the set must match `kothar split <count>`.
- `depicts`: the words a stranger should use when they see the mark, in English **and** the user's language, generous with synonyms ("letter t", "t", "letra t", "cross", "cruz"). The blind judges' descriptions are matched against these, by whole words with plurals tolerated; the same words are also what stops "it reminds me of a hammer" from counting against a hammer logo. So an honest list matters: do not pad it with vague words like "shape" to game the score.
- `compact` only when you drew a compact variant.
- `title` and `rationale` are shown under the logo. The rationale says what it depicts and why that belongs to this product; one or two sentences.
- `wordmarks` only when `selection.svgWordmark` is true; one per concept.

## Optional: lockup proportions

```json
{ "lockup": { "gap": 0.3, "wordScale": 0.46 } }
```

`gap` is the space between mark and name, `wordScale` the height of the name, both as a fraction of the mark's height. Adjust before `kothar report` if the lockup looks unbalanced (a heavy mark wants a larger name).

## What you read back

- `kothar wait --step N` prints `{ confirmed, selection, all }`. `all` is the full selection so far: `name`, `font`, `svgWordmark`, `count`, `concept`, `wordmark` (null = keep the font).
- `.kothar/audit.json`: per concept and wordmark (and the animation), a `level` and `findings` (`rule`, `level`, `msg`) plus `metrics`. `kothar audit` prints the same in plain text.
- `kothar flow` prints the current step and status.
