# Contributing to kothar

Thanks for wanting to help. A contribution does not have to be a pull request: a clear issue
that reports a bug or proposes an improvement is a contribution too.

kothar builds a product's brand identity through questions in the conversation: logo proposals drawn from the user's references, colour, free fonts, the pieces the user selects (social profiles, stationery, an animated logo) and a brand book in HTML. **A contribution that drifts away from that purpose will be rejected**,
however well it is made.

<!-- This file is generated from .github/repo-rules.json by Nabu (https://github.com/ilien-dev/nabu).
     Project-specific notes go in .github/contributing-notes.md, which is copied below. -->

## Nothing is guaranteed

Opening an issue or a pull request does not guarantee that it will be accepted or merged.
Every change is reviewed before it goes in, the maintainer's own included. A change can be
declined for its scope, its approach or the cost of maintaining it.

## Before you start

- **Search first.** Look through the [pull requests](https://github.com/ilien-dev/kothar/pulls?q=is%3Apr)
  and the [issues](https://github.com/ilien-dev/kothar/issues?q=is%3Aissue), open and closed. If someone
  already works on it, or it was declined, add to that conversation instead.
- **For anything bigger than a small fix, open an issue first** and wait for an answer. It is the
  cheapest way to find out whether the change fits before you write it.

## Issues

Use the forms: **Bug report** or **Feature request**. One issue per problem or idea. A bug report
says what you did, what you expected and what happened; a feature request says the problem
first and the solution after. Never paste tokens, keys or private data.

## One change per pull request

Each pull request does **one thing**. A new feature comes alone: no settings change, no visual
tweak elsewhere, no unrelated cleanup. Those go in their own pull requests. The smaller and more
focused a PR is, the faster it can be reviewed and merged; a PR that mixes changes will be asked
to split, or closed.

## Branch name

```
<type>/<1 to 5 words>
```

`<type>` is the Conventional Commit type of the change, the same one the title starts with:
`feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `style` or `revert`. Then 1 to 5 words of lowercase letters and digits joined by single
hyphens.

- `feat/export-cover-image` ✓
- `fix/progress-bar-width` ✓
- `feat/Export-Cover` ✗ (uppercase)
- `feature/export-cover-image` ✗ (the type is `feat`)
- `fix/add-a-new-progress-bar-width` ✗ (more than 5 words)

## Title and versions

The title is a [Conventional Commit](https://www.conventionalcommits.org/) of at most
72 characters, with the same type as the branch: `feat: export the cover image`. Pull
requests are squash-merged, so the title becomes the commit on `main`, and it decides
the next version:

| Title | Version |
|---|---|
| `feat: ...` | new minor version (1.4.0 → 1.5.0) |
| `fix: ...`, `perf: ...`, `revert: ...` | new patch version (1.4.0 → 1.4.1) |
| `feat!: ...` or any type with `!` | new major version (1.4.0 → 2.0.0) |
| `docs`, `test`, `ci`, `chore`, `refactor`, `build`, `style` | no new version |

**Nobody writes a version number.** A workflow publishes the version, the changelog and the
release after every merge. Do not edit version numbers or `CHANGELOG.md`.
A change to what users install (`skills/**`, `.claude-plugin/**` and `.codex-plugin/**`) has to publish a version, or they never get it:
its title must be `feat`, `fix`, `perf` or `revert`. The check rejects any other type for those files.

## Every change to what users get is measured

A new feature, a fix or a change to how something works goes in only when it is measured and the
numbers show it adds value, or at least that nothing gets worse. A change that cannot be measured
is declined, however good it looks. Put the result on `main` and on your branch in the
**Measurement** section of the PR. How to measure here:

- A change to what the skill does: the cases in `evals/evals.json` run on main and on your branch, with the pass count of each.
- A fix: the test in `tests/` that fails on main and passes on your branch.
- A change to the report template or the render helper: the same example rendered on main and on your branch with a headless browser, both screenshots compared.

For `feat`, `fix` or `perf` changes to what users get, Measurement cannot say "not applicable". For any
other change it can, with the reason (`Not applicable: docs only`).

## Description

Start from the template GitHub fills in
([`.github/pull_request_template.md`](.github/pull_request_template.md)). It is short on purpose:
it holds what a reviewer needs to decide quickly, and nothing else.

| Section | Limit | What goes in it |
|---|---|---|
| **What** | 280 characters | The one change this PR makes. |
| **Why** | 280 characters | The problem it solves. Link the issue (`Closes #12`). |
| **How** | 500 characters | The approach, and the main files it touches. |
| **Risk** | 200 characters | What could break, and how to undo it. |
| **Measurement** | 500 characters | The numbers before and after (see above). |
| **Evidence** | 300 characters of text | How you checked it, how a reviewer can check it; screenshots. |
| **Checklist** | — | Every box ticked. |

**Screenshots** are optional and always welcome, one or as many as it takes to make the change
easy to understand; for a visual change, before and after. Take them yourself
or ask your agent to; capture only that window or page, never the whole screen. Drag the files
into the description box on GitHub. Images, GIFs and links do not count toward the limit.

A check verifies the branch, the title and the description. Run it before opening the PR:

```
node .github/scripts/check-pr.cjs --branch feat/export-cover-image \
  --title "feat: export the cover image" --body-file pr.md --files-from-git main
```

## Before you push

```
npm test
```

Every command must pass; CI runs them again on the pull request.

## Review

A pull request is merged after an approval from someone with write access to the repository and
with every check green. A new push dismisses an earlier approval. Answer review comments in the
PR; keep extra changes for another PR.

## Working with an AI agent

The rules are the same. Agents that read `.claude/skills` or `.agents/skills` have an
`uncontributing` skill that walks through them step by step and checks the result.

## Project notes

## Working on kothar

- The skill is Markdown and two HTML files, with no build step and nothing to install: `SKILL.md` and `references/` are the instructions, `assets/report.html` the report template, `assets/render.html` the helper a headless browser runs. `npm test` checks that they stay consistent.
- Node 20 or later, only for `npm test`. Testing a change to the skill means running it in an agent; testing the template or the render helper needs a Chromium-based browser (`references/rendering.md`).
- Work in progress for a product lives in `.kothar/` in that product's folder and never belongs in a commit.

