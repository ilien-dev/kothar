# Development

How Kothar is built and how to test a change.

There is no build step. The skill in `skills/kothar/` is:

- `SKILL.md`, the flow the agent follows, and `references/`, the detail it reads at each step.
- `assets/report.html`, the template for the proposals report and the brand book, filled with a complete example (Eco).
- `assets/render.html`, a helper page that a headless Chromium browser opens to turn the name into outlines and to build the `.ico`.

```bash
npm test        # checks that the skill is consistent: links, frontmatter, template, manifests
```

To see the template, open `skills/kothar/assets/report.html` in a browser. To try the render helper, follow `skills/kothar/references/rendering.md` with a job file of your own.

A product's work in progress lives in `.kothar/` inside that product's folder, and what the user keeps goes to its `assets/brand/`.

## The website

`site/` is a submodule: [ilien-dev/kothar-site](https://github.com/ilien-dev/kothar-site), the page at https://kothar.ilien.dev. It has its own pull requests, and a push to its `main` deploys it. Here, `git submodule update --init` fetches it; after a site release, `git submodule update --remote site` moves the pointer, committed in a `chore:` pull request.

Before opening a branch or a pull request, read [CONTRIBUTING.md](../CONTRIBUTING.md).
