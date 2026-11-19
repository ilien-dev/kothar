# Development

How to build and test Kothar from its source.

Source is TypeScript in `src/`. `npm run build` compiles it to `skills/kothar/scripts/` (the command-line tool) and `skills/kothar/assets/app.js` (the page). The compiled files are committed, because a plugin is installed by cloning.

```bash
npm install
npm test        # builds, then runs tests/core.test.js
node skills/kothar/scripts/kothar.js help
```

State for a product lives in `.kothar/` inside that product's folder. Machine-wide data (dependencies, the reference index, fonts, naming preferences) lives in `~/.kothar`. On first use the skill runs `kothar setup --refs`, which installs the SVG renderer and builds the reference index (a couple of minutes, once).

Before opening a branch or a pull request, read [CONTRIBUTING.md](../CONTRIBUTING.md).
