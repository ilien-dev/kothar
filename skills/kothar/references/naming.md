# Naming

## What makes a candidate worth showing

A name earns its place through a **real parallel** between what it refers to and what the product does. "Muninn, Odin's raven of memory" for a memory store is a parallel. "Zephyr, because it sounds fast" is not. For each candidate you must be able to complete, truthfully and specifically:

- **Represents**: who or what this is, in one sentence a person unfamiliar with the source can follow.
- **Why it represents the product**: the trait, deed or function that matches what the repository actually does. Point at a real behaviour of the product, not at a mood.

If you cannot write the second sentence without stretching, drop the candidate.

## Where names come from

Use the user's categories (saved in preferences, or just asked). Typical ones: figures, creatures, objects and places from mythology of any culture; astronomy; botany; tools and crafts; a language the user loves. Spread candidates across cultures and kinds (a god, a creature, an object, a place) so the ten are genuinely different options, and prefer the less worn figure over the one every startup already used: Zeus, Thor, Apollo, Atlas, Phoenix, Titan, Odin, Loki, Hermes and Athena are crowded, and many of them are well-known products already.

When the user has no preference ("I don't know"), start from the product: its verb (what it does), its material (what it works on), its user. Coin, borrow or combine; say which you did.

Check facts. Do not attribute to a mythological figure something it is not known for: a wrong justification is worse than none, because the user will repeat it to others.

## The user's preferences

Ask, with options and room for a free answer:

- **Length**: short (up to 6 letters) / medium / no preference.
- **Easy to say for**: speakers of the user's language / English speakers / both.
- Anything to avoid (letters, sounds, a culture already used a lot in their projects).

## Measuring

`kothar names <a> <b> … --table` prints, per name: letters, syllables, a pronunciation estimate per language, and whether it is already one of the user's names or one letter away from one. Add `--online` (only with the user's permission) for npm, PyPI, crates.io and domain lookups.

The pronunciation estimate is a heuristic that flags what usually trips a speaker (consonant clusters, endings foreign to the language, letters read differently). Treat `hard` as a reason to look again, not as a verdict: keep a `hard` name only if it is strong on meaning, and say plainly in its row that it is harder to pronounce.

Rules the gate enforces: at least ten candidates; none equal to a name already used by the user; no duplicates.

## Order

Put the candidates you find strongest first, but do not pre-select one: the page starts with nothing chosen, on purpose.
