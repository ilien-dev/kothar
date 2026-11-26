// Checks that the skill is internally consistent: what SKILL.md and the references point at exists,
// the frontmatter is valid, the report template keeps its credit, and nothing still refers to the
// command-line tool and local server that kothar used to ship.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skill = join(root, 'skills', 'kothar');
const read = (p) => readFileSync(p, 'utf8');
const markdown = [join(skill, 'SKILL.md'), ...readdirSync(join(skill, 'references')).map((f) => join(skill, 'references', f))];

test('SKILL.md frontmatter has a valid name and description', () => {
  const m = read(join(skill, 'SKILL.md')).match(/^---\nname: (.+)\ndescription: (.+)\n---\n/);
  assert.ok(m, 'frontmatter with name and description');
  assert.equal(m[1], 'kothar');
  assert.ok(m[2].startsWith('Use when'), 'description starts with "Use when"');
  assert.ok(m[2].length <= 1024, `description is ${m[2].length} characters, limit 1024`);
});

test('every references/ and assets/ path mentioned exists', () => {
  for (const file of markdown) {
    for (const [, path] of read(file).matchAll(/`((?:references|assets)\/[\w.-]+\.(?:md|html))`/g)) {
      assert.ok(existsSync(join(skill, path)), `${file.slice(root.length + 1)} mentions ${path}, which does not exist`);
    }
    for (const [, name] of read(file).matchAll(/`([\w-]+\.md)`/g)) {
      if (['SKILL.md', 'README.md', 'brief.md'].includes(name)) continue;
      assert.ok(existsSync(join(skill, 'references', name)), `${file.slice(root.length + 1)} mentions ${name}, which is not in references/`);
    }
  }
});

test('every reference is reachable from SKILL.md', () => {
  const text = read(join(skill, 'SKILL.md'));
  for (const f of readdirSync(join(skill, 'references'))) {
    assert.ok(text.includes(`references/${f}`), `SKILL.md never points at references/${f}`);
  }
});

test('nothing refers to the removed command-line tool or local server', () => {
  const stale = /\bkothar (?:init|set|open|wait|flow|audit|judge|check|report|deliver|doctor|setup|names|font|split|traits|prefs|status|restart|stop|animate|strings)\b|localhost|scripts\/kothar\.js/;
  for (const file of markdown) {
    const hit = read(file).match(stale);
    assert.equal(hit, null, `${file.slice(root.length + 1)} still mentions "${hit && hit[0]}"`);
  }
});

test('the report template keeps its credit and its structure', () => {
  const html = read(join(skill, 'assets', 'report.html'));
  assert.match(html, /<meta name="generator" content="kothar/);
  assert.match(html, /<footer class="colo">[\s\S]*https:\/\/github\.com\/ilien-dev\/kothar/);
  assert.match(html, /@media print\{[\s\S]*@page/);
  for (const page of ['cover', 'brief', 'concept', 'comparison', 'recommendation', 'idea', 'symbol', 'colour and type', 'lockups', 'in the product', 'social', 'stationery', 'motion and delivery']) {
    assert.ok(html.includes(`<!-- page: ${page} `), `report.html has no "${page}" page`);
  }
  const opened = (html.match(/<section\b/g) || []).length;
  const closed = (html.match(/<\/section>/g) || []).length;
  assert.equal(opened, closed, 'every <section> is closed');
});

test('the render helper reads a job and writes its result', () => {
  const html = read(join(skill, 'assets', 'render.html'));
  assert.match(html, /KOTHAR_JOB/);
  assert.match(html, /<pre id="out">/);
  assert.match(html, /opentype\.js\/\d+\.\d+\.\d+\//, 'opentype.js is pinned to an exact version');
});

test('plugin manifests agree with package.json', () => {
  const pkg = JSON.parse(read(join(root, 'package.json')));
  for (const p of ['.claude-plugin/plugin.json', '.codex-plugin/plugin.json']) {
    const m = JSON.parse(read(join(root, p)));
    assert.equal(m.name, 'kothar', p);
    assert.equal(m.version, pkg.version, `${p} version`);
  }
});

test('no description offers to name the product', () => {
  const texts = [read(join(skill, 'SKILL.md')).match(/^description: (.+)$/m)[1]];
  for (const p of ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', '.codex-plugin/plugin.json', 'package.json']) {
    texts.push(JSON.stringify(JSON.parse(read(join(root, p))), (k, v) => (k === 'name' ? undefined : v)));
  }
  for (const t of texts) assert.doesNotMatch(t, /\bnam(?:e|es|ing)\b/i);
});
