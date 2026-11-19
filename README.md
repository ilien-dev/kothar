# kothar

A plugin for Claude Code (and other coding agents) that names a product and builds its logo identity. Kothar-wa-Khasis was the Ugaritic craftsman god who forged the weapons of Baal and gave each one its name; the plugin does the same two jobs.

The user chooses everything in a page on `localhost`, step by step. The agent draws; scripts measure every drawing; agents with no context judge it blind. A step is not shown while a check fails.

## The flow

| Where | What happens |
|---|---|
| Terminal | The agent reads the repository, asks where names should come from (remembered for next time) and opens the page. |
| Page · 01 Name | At least ten candidates, each with who it is and why it fits this product. The user also picks a free font (or their own, with a licence confirmation), whether the name should also be drawn in SVG, and how many logos (3 / 6 / 9 / other). |
| Page · loading | "Creating logos" while the agent draws, audits and runs the judges. |
| Page · 02 Logo | Each logo in one ink on white and black, at 16 / 32 / 64 px, with its measurements and the judges' verdict. Drawn names sit next to the logos and can be combined freely; the font stays available. |
| Page · 03 Report | The identity sheet: lockup, versions in black, white and grey, measurements, type, sizes, clear space, an animated mark, and the files. Also written as a single shareable `report.html`. |
| Terminal | Changes are requested here; the report updates. |

## What is measured

- **Size**: rendered from 16 px up; share of ink under one pixel, gaps that close, how much of the shape survives the pixel grid, and whether pieces merge or break.
- **Elements**: no separate piece smaller than a pixel at favicon size. A compact variant is allowed for small sizes.
- **Originality**: shape correlation against about 21,000 brand logos (Simple Icons), UI icons (Lucide, Tabler, Bootstrap, Phosphor) and emoji (Twemoji), plus likeness between the options themselves.
- **File hygiene**: one ink through `currentColor`, no text, raster, gradients, filters or external references.
- **Blind judges**: fresh agents see anonymised renders and say what they see at 16 px and large, what it reminds them of, and, for a drawn name, which letters they read.
- **Drawn names**: must be read correctly by the judges, and must differ from the name typed in the chosen font.
- **Fonts**: only families verified as free are offered; a paid font needs the user's licence confirmation and shows a legal warning.
- **Animation**: CSS only, honours reduced motion, and rests on the finished logo.

## Install

```
/plugin marketplace add ilien-dev/kothar
/plugin install kothar@kothar
```

Then ask for a name or a logo, or run `/kothar:kothar`. On first use the skill runs `kothar setup --refs`, which installs the SVG renderer into `~/.kothar` and builds the reference index (a couple of minutes, once). Requires Node 20+ and npm; `gh` is optional (used to avoid names you already use).

## Development

Source is TypeScript in `src/`; `npm run build` compiles it to `skills/kothar/scripts/` (the CLI) and `skills/kothar/assets/app.js` (the page). The compiled files are committed because a plugin is installed by cloning.

```
npm install
npm test        # builds, then runs tests/core.test.js
node skills/kothar/scripts/kothar.js help
```

State for a product lives in `.kothar/` inside that product's folder; machine-wide data (dependencies, reference index, fonts, naming preferences) lives in `~/.kothar`.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or a pull request. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## Licence

MIT. The reference sets are downloaded at setup time under their own licences and are not redistributed; brand logos are trademarks of their owners and are used only to measure likeness.
