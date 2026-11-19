// Core measurements, run against the compiled scripts. Needs `kothar setup` (the SVG renderer) to have run once.
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSvg, lint, lintAnimation, colorize } from '../skills/kothar/scripts/svg.js';
import { measure } from '../skills/kothar/scripts/measure.js';
import { INKS } from '../skills/kothar/scripts/color.js';
import { split, workspace } from '../skills/kothar/scripts/identity.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { measureName } from '../skills/kothar/scripts/names.js';
import { baselineAnimation } from '../skills/kothar/scripts/exporter.js';

const svg = (body, attrs = 'viewBox="0 0 64 64" fill="currentColor"') => `<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${body}</svg>`;
const BOLD = svg('<path d="M8 8h48v14H22v34H8z"/><circle data-ink="accent" cx="43" cy="43" r="12"/>');
const HAIR = svg('<circle cx="32" cy="32" r="28"/><path d="M10 32h44M32 10v44"/>', 'viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1"');
const rules = (findings, level) => findings.filter((f) => f.level === level).map((f) => f.rule);

test('lint accepts a single-ink mark and rejects colour, text and implicit black', () => {
  assert.deepEqual(rules(lint(parseSvg(BOLD)).findings, 'fail'), []);
  assert.ok(rules(lint(parseSvg(svg('<path d="M0 0h9v9z"/>', 'viewBox="0 0 9 9"'))).findings, 'fail').includes('ink-fill'));
  assert.ok(rules(lint(parseSvg(svg('<path fill="#f00" d="M0 0h9v9z"/>'))).findings, 'fail').includes('ink-fill'));
  assert.ok(rules(lint(parseSvg(svg('<text>k</text>'))).findings, 'fail').includes('forbidden-text'));
  assert.ok(rules(lint(parseSvg('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M0 0h9v9z"/></svg>')).findings, 'fail').includes('viewbox'));
});

test('a bold mark is clean at 16 px, a hairline mark fails', () => {
  const bold = measure(BOLD, 'small');
  assert.equal(bold.metrics.minCleanSize, 16);
  assert.deepEqual(rules(bold.findings, 'fail'), []);
  assert.ok(rules(measure(HAIR, 'small').findings, 'fail').includes('size'));
});

test('thin parts and gaps are reported in pixels, and the fix says by how much', () => {
  const bold = measure(BOLD, 'small').metrics, hair = measure(HAIR, 'small');
  assert.ok(bold.thinStrokePx >= 1 && bold.narrowGapPx >= 1);
  assert.ok(hair.metrics.thinStrokePx < 1);
  assert.match(hair.findings.find((f) => f.rule === 'size').msg, /thin parts are ≈ [\d.]+ px .* [\d.]+× thicker/);
});

test('symmetry is described; only a near miss gets a note, and never more than a note', () => {
  const disc = measure(svg('<circle cx="32" cy="32" r="24"/>'), 'small');
  assert.ok(disc.metrics.symmetry.leftRight >= 0.97 && disc.metrics.symmetry.topBottom >= 0.97);
  assert.ok(!disc.findings.some((f) => f.rule === 'symmetry'));
  assert.ok(measure(BOLD, 'small').metrics.symmetry.leftRight < 0.85);
  const near = measure(svg('<path d="M8 8h36l12 12v36H8z"/>'), 'small');
  assert.equal(near.findings.find((f) => f.rule === 'symmetry')?.level, 'info');
});

test('a speck smaller than a pixel fails the elements rule', () => {
  const speck = svg('<path d="M8 8h48v48H8z"/><circle cx="2" cy="2" r="0.8"/>');
  assert.ok(rules(measure(speck, 'small').findings, 'fail').includes('elements'));
});

test('colorize paints ink and accent separately', () => {
  const out = colorize(BOLD, { ink: '#111111', accent: '#ff0000' });
  assert.match(out, /<svg[^>]*fill="#111111"/);
  assert.match(out, /<circle[^>]*fill="#ff0000"/);
  assert.doesNotMatch(out, /currentColor/i);
});

const lum = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

test('the monochrome inks: both tones read on their ground and stay apart', () => {
  for (const g of [INKS.light, INKS.dark]) {
    assert.ok(ratio(g.ink, g.ground) >= 7, `main ink on ${g.ground}`);
    assert.ok(ratio(g.accent, g.ground) >= 4.5, `second tone on ${g.ground}`);
    assert.ok(ratio(g.ink, g.accent) >= 2, `the two tones on ${g.ground} must be told apart`);
  }
});

test('a workspace from before the monochrome change loads into the three-step flow', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kothar-'));
  fs.writeFileSync(path.join(dir, 'identity.json'), JSON.stringify({ version: 1, locale: 'es', product: { summary: 'x' }, naming: { categories: [], preferences: {}, taken: [], candidates: [] }, fonts: { options: [] }, logo: { count: 3, split: { name: 1, product: 1, fusion: 1 } }, concepts: [], wordmarks: [], palettes: [{ id: 'p1' }], keptPalettes: [], colour: {}, selection: { concept: 'c1', palette: 'p1', colors: 'rojo' }, lockup: { gap: 0.3, wordScale: 0.46 }, flow: { step: 4, status: 'final' } }));
  const id = workspace({ dir }).load();
  assert.equal(id.flow.step, 3);
  assert.equal(id.flow.status, 'final');
  assert.equal('palettes' in id, false);
  assert.equal('palette' in id.selection, false);
  assert.equal('colors' in id.selection, false);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('split keeps the three categories balanced', () => {
  assert.deepEqual(split(3).base, { name: 1, product: 1, fusion: 1 });
  assert.deepEqual(split(9).base, { name: 3, product: 3, fusion: 3 });
  assert.equal(split(7).remainder, 1);
  assert.throws(() => split(2));
});

test('names: taken and near-taken are flagged', () => {
  assert.equal(measureName('Muninn', ['es', 'en'], ['muninn', 'themis']).taken, true);
  assert.deepEqual(measureName('Themia', ['es'], ['themis']).nearTaken, ['themis']);
  assert.equal(measureName('Dédalo', ['es'], []).typeable, false);
});

test('the generated animation passes its own lint', () => {
  const anim = baselineAnimation(BOLD);
  assert.deepEqual(lintAnimation(parseSvg(anim)).filter((f) => f.level === 'fail'), []);
  assert.deepEqual(rules(lint(parseSvg(anim), 'animated').findings, 'fail'), []);
});

import { rankClasses, aligned, nextFonts, pick as pickFonts } from '../skills/kothar/scripts/typography.js';

test('type psychology: traits rank classes; fonts go from fit, to judgement, to chance, never twice', () => {
  assert.equal(rankClasses({ joy: 3, warmth: 2 }, 'sensory-social')[0].name, 'rounded');
  assert.equal(rankClasses({ sophistication: 3 }, 'both')[0].name, 'serif-elegant');
  assert.equal(rankClasses({ technical: 3 }, 'functional')[0].name, 'mono');
  const first = aligned({ competence: 3, heritage: 2 }, 'functional').slice(0, 4);
  assert.equal(new Set(first.map((f) => f.class)).size, first.length);
  const traits = { competence: 3 };
  let step = nextFonts(undefined, traits, 'functional', 4, []);
  assert.equal(step.plan.mode, 'psychology');
  const modes = new Set();
  for (let i = 0; i < 40 && step.plan.mode !== 'exhausted'; i++) {
    modes.add(step.plan.mode);
    if (step.candidates) pickFonts(step.plan, step.candidates.slice(0, 4).map((c) => c.family));
    step = nextFonts(step.plan, traits, 'functional', 4, []);
  }
  assert.deepEqual([...modes], ['psychology', 'judgement', 'random']);
  assert.equal(new Set(step.plan.served).size, step.plan.served.length);
  assert.throws(() => pickFonts(step.plan, ['Helvetica Neue']));
});
