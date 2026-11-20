# Naming

## What makes a candidate worth showing

A name earns its place through a **real parallel** between what it refers to and what the product does. "Muninn, Odin's raven of memory" for a memory store is a parallel. "Zephyr, because it sounds fast" is not. For each candidate you must be able to complete, truthfully and specifically:

- **Represents:** who or what this is, in one sentence that someone unfamiliar with the source can follow.
- **Why it represents the product:** the trait, deed or function that matches what the product actually does. Point at a real behaviour of the product, not at a mood.

If you cannot write the second sentence without stretching, drop the candidate.

## Where names come from

Use the user's answer: figures, creatures, objects and places from the mythology of any culture; astronomy; botany; tools and crafts; a language they love; anything else. Spread candidates across cultures and kinds (a god, a creature, an object, a place) so the ten are genuinely different options. Prefer the less worn figure over the one every startup already used: Zeus, Thor, Apollo, Atlas, Phoenix, Titan, Odin, Loki, Hermes and Athena are crowded, and many are well-known products already.

When the user has no preference, start from the product: its verb (what it does), its material (what it works on), its user. Coin, borrow or combine, and say which you did.

Check facts. Do not attribute to a mythological figure something it is not known for. A wrong justification is worse than none, because the user will repeat it to others.

## The user's preferences

Ask, with options and room for a free answer:

- **Length:** short (up to 6 letters), medium, no preference.
- **Easy to say for:** speakers of the user's language, English speakers, both.
- Anything to avoid: letters, sounds, a culture they already use a lot.

## Checks before showing

- **Names the user already uses:** list their repositories (`gh repo list <owner> --limit 200` with their own login, when `gh` is available) and the folders next to the project. Never propose one of those, or one a letter away.
- **Pronunciation:** say each name in each target language. Flag consonant clusters, endings foreign to the language and letters read differently. Keep a hard name only if it is strong on meaning, and say plainly that it is harder to say.
- **Availability** (only with the user's permission, since each lookup sends the name to that service): a 404 means free.
  - npm: `https://registry.npmjs.org/<name>`
  - PyPI: `https://pypi.org/pypi/<name>/json`
  - crates.io: `https://crates.io/api/v1/crates/<name>`
  - GitHub: `gh search repos <name> --limit 5`
  - Domains: `https://rdap.org/domain/<name>.dev` (and `.com`, `.io`, `.app`)

## Presenting

Show at least ten in the chat as a table, strongest first: name, represents, why it fits, length and syllables, pronunciation notes, availability. Do not pre-select one. Then ask which to keep, offering "more like number N", "none of these" and a free answer.
