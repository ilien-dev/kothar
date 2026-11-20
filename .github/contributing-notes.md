## Working on kothar

- The skill is Markdown and two HTML files, with no build step and nothing to install: `SKILL.md` and `references/` are the instructions, `assets/report.html` the report template, `assets/render.html` the helper a headless browser runs. `npm test` checks that they stay consistent.
- Node 20 or later, only for `npm test`. Testing a change to the skill means running it in an agent; testing the template or the render helper needs a Chromium-based browser (`references/rendering.md`).
- Work in progress for a product lives in `.kothar/` in that product's folder and never belongs in a commit.
