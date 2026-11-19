`CONTRIBUTING.md` - branches, PR format and limits; load the `uncontributing` skill before a branch, commit, issue or PR.

Edit `src/*.ts`, never `skills/kothar/scripts/*.js` or `skills/kothar/assets/app.js`: they are compiled by `npm run build` and committed, and CI fails if they differ from `src/`.
