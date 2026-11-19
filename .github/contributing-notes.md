## Working on kothar

- The source is TypeScript in `src/`. `npm run build` compiles it to `skills/kothar/scripts/` (the CLI) and `skills/kothar/assets/app.js` (the page). The compiled files are committed because a plugin is installed by cloning: commit them together with the source change. CI rebuilds them and fails if they differ.
- Node 20 or later. Run `node skills/kothar/scripts/kothar.js setup` once before `npm test`: the tests render with the SVG renderer it installs into `~/.kothar`. `node skills/kothar/scripts/kothar.js help` lists the commands.
- State for a product lives in `.kothar/` in that product's folder and machine-wide data in `~/.kothar`; neither belongs in a commit.
- The reference sets (brand logos, icon sets, emoji) are downloaded at setup under their own licences. Never commit them or anything derived from them that could be redistributed.
