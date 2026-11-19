// SVG loading, hygiene lint, colourising and id scoping.
import fs from 'node:fs';
import { parseXml, serialize, walk, elements, type XNode } from './xml.js';
import type { Finding, Level } from './util.js';

export type Box = [number, number, number, number];
export interface Parsed { src: string; doc: XNode; svg: XNode; viewBox: Box | null }
export type Kind = 'mark' | 'wordmark' | 'animated';

const SHAPES = new Set(['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'use']);
const TEXT_WHY = 'live text depends on an installed font; outline it to paths';
const FLAT_WHY = 'a logo must first work in one flat ink; gradients cannot be the structure';
const FORBIDDEN: Record<string, string> = {
  image: 'raster images do not scale and cannot be recoloured',
  text: TEXT_WHY, tspan: TEXT_WHY, textPath: TEXT_WHY,
  foreignObject: 'foreignObject does not render outside browsers',
  script: 'scripts are stripped by most hosts and are a security risk',
  filter: 'filters do not reproduce in print, favicons or one-colour use',
  linearGradient: FLAT_WHY, radialGradient: FLAT_WHY,
  pattern: 'patterns do not survive small sizes',
  a: 'links do not belong in a logo file',
};
const ANIM_TAGS = new Set(['animate', 'animateTransform', 'animateMotion', 'set']);

export const loadSvg = (file: string): Parsed => parseSvg(fs.readFileSync(file, 'utf8'));

export function parseSvg(src: string): Parsed {
  const doc = parseXml(src);
  const svg = elements(doc).find((n) => n.tag === 'svg');
  if (!svg) throw new Error('no <svg> root element');
  const vb = (svg.attrs.viewBox || '').trim().split(/[\s,]+/).map(Number);
  const viewBox = vb.length === 4 && !vb.some(Number.isNaN) ? (vb as Box) : null;
  return { src, doc, svg, viewBox };
}

const styleProp = (node: XNode, prop: string): string | undefined => {
  const m = new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`, 'i').exec(node.attrs.style || '');
  return m ? m[1].trim() : undefined;
};
const paint = (node: XNode, prop: string): string | undefined => styleProp(node, prop) ?? node.attrs[prop];
const isInk = (v: string): boolean => /^currentcolor$/i.test(v);
const pathNodes = (d: string): number => (d.match(/[a-df-z]/gi) || []).filter((c) => !/z/i.test(c)).length;

/** Hygiene lint: is this file a clean, single-ink, self-contained logo master? */
export function lint(parsed: Parsed, kind: Kind = 'mark'): { findings: Finding[]; stats: { bytes: number; nodes: number; shapes: number; accents: number } } {
  const f: Finding[] = [];
  const add = (rule: string, level: Level, msg: string): void => { if (!f.some((x) => x.rule === rule && x.msg === msg)) f.push({ rule, level, msg }); };
  const { svg, viewBox, src } = parsed;
  if (!viewBox) add('viewbox', 'fail', 'root <svg> needs a numeric viewBox so the logo scales');
  else if (viewBox[2] <= 0 || viewBox[3] <= 0) add('viewbox', 'fail', 'viewBox has zero or negative size');
  const bytes = Buffer.byteLength(src);
  if (bytes > 24000) add('filesize', 'fail', `${bytes} bytes; a logo this heavy is too complex (limit 24 kB)`);
  else if (bytes > 8000) add('filesize', 'warn', `${bytes} bytes; aim for under 8 kB`);
  if (/\d\.\d{4,}/.test(src)) add('precision', 'warn', 'coordinates carry more than 3 decimals; round them, the noise is invisible');

  const ids = new Set<string>();
  let nodes = 0, shapes = 0, accents = 0;
  const visit = (node: XNode, inh: { fill: string; stroke: string }, mask: boolean): void => {
    if (node.text !== undefined) return;
    const t = node.tag;
    if (FORBIDDEN[t]) add('forbidden-' + t, 'fail', `<${t}>: ${FORBIDDEN[t]}`);
    if (t.startsWith('fe')) add('forbidden-filter', 'fail', `<${t}>: filter primitives are not allowed`);
    if (ANIM_TAGS.has(t)) add('smil', kind === 'animated' ? 'warn' : 'fail', `<${t}>: ` + (kind === 'animated' ? 'prefer CSS keyframes; SMIL ignores prefers-reduced-motion' : 'the static logo must not move'));
    if (t === 'style' && kind !== 'animated') add('style-block', 'fail', '<style> in a static logo: use presentation attributes so every renderer agrees');
    for (const [k, v] of Object.entries(node.attrs)) {
      if (/^on/i.test(k)) add('event-attr', 'fail', `${k} attribute: no scripting in a logo`);
      if ((k === 'href' || k === 'xlink:href') && !v.startsWith('#')) add('external-ref', 'fail', `external reference "${v.slice(0, 40)}"; the file must be self-contained`);
      if (/url\(\s*['"]?(?!#)/.test(v)) add('external-ref', 'fail', `external url() in ${k}`);
    }
    if (node.attrs.id) { if (ids.has(node.attrs.id)) add('duplicate-id', 'fail', `duplicate id "${node.attrs.id}"`); ids.add(node.attrs.id); }
    if (node.attrs['data-ink'] === 'accent') accents++;
    const inMask = mask || t === 'mask' || t === 'clipPath';
    const fill = paint(node, 'fill') ?? inh.fill;
    const stroke = paint(node, 'stroke') ?? inh.stroke;
    for (const p of ['opacity', 'fill-opacity', 'stroke-opacity']) {
      const v = paint(node, p);
      if (v !== undefined && Number(v) < 1 && !inMask && kind !== 'animated') add('opacity', 'warn', `${p}="${v}": partial transparency does not reproduce in one flat ink`);
    }
    if (SHAPES.has(t)) {
      shapes++;
      nodes += t === 'path' ? pathNodes(node.attrs.d || '') : t === 'polyline' || t === 'polygon' ? (node.attrs.points || '').trim().split(/[\s,]+/).length / 2 : 4;
      if (!inMask) {
        const ok = (v: string): boolean => v === 'none' || isInk(v);
        if (!ok(fill)) add('ink-fill', 'fail', fill === 'black#default'
          ? `<${t}> has no fill, so it renders black on every background; set fill="currentColor" (on <svg> or the shape)`
          : `<${t}> fill="${fill}": the master file uses only currentColor or none (the logo is delivered in black, white and greys; cut real holes instead of painting white on top)`);
        if (!ok(stroke)) add('ink-stroke', 'fail', `<${t}> stroke="${stroke}": use currentColor or none`);
        if (fill === 'none' && stroke === 'none') add('invisible', 'warn', `<${t}> has neither fill nor stroke`);
      }
    }
    for (const c of node.children) visit(c, { fill, stroke }, inMask);
  };
  visit(svg, { fill: 'black#default', stroke: 'none' }, false);
  if (!shapes) add('empty', 'fail', 'no shapes found');
  const limit = kind === 'wordmark' ? [600, 600] : [160, 400];
  if (nodes > limit[1]) add('complexity-nodes', 'fail', `${Math.round(nodes)} path nodes; nobody redraws this from memory (limit ${limit[1]})`);
  else if (nodes > limit[0]) add('complexity-nodes', 'warn', `${Math.round(nodes)} path nodes; simpler shapes are remembered better (aim under ${limit[0]})`);
  return { findings: f, stats: { bytes, nodes: Math.round(nodes), shapes, accents } };
}

/** Lint for the animated variant: CSS only, honours reduced motion, bounded duration. */
export function lintAnimation(parsed: Parsed): Finding[] {
  const f: Finding[] = [];
  const css: string[] = [];
  walk(parsed.svg, (n) => { if (n.tag === 'style') css.push(n.children.map((c) => c.text || '').join('')); });
  const all = css.join('\n');
  if (!/@keyframes/.test(all)) f.push({ rule: 'anim-keyframes', level: 'fail', msg: 'no CSS @keyframes found; the animated file does not animate' });
  if (!/prefers-reduced-motion/.test(all)) f.push({ rule: 'anim-reduced-motion', level: 'fail', msg: 'missing @media (prefers-reduced-motion: reduce) block that disables the animation' });
  const durs = [...all.matchAll(/(\d*\.?\d+)(ms|s)\b/g)].map((m) => Number(m[1]) * (m[2] === 'ms' ? 0.001 : 1));
  const longest = durs.length ? Math.max(...durs) : 0;
  if (longest > 4) f.push({ rule: 'anim-duration', level: 'warn', msg: `longest timing is ${longest}s; a logo reveal over ~3s feels slow` });
  const loops = /infinite/.test(all);
  if (loops) f.push({ rule: 'anim-loop', level: 'warn', msg: 'infinite loop: fine for a loader, distracting beside content; make sure that is intended' });
  if (!loops && /@keyframes/.test(all) && !/\b(both|forwards)\b/.test(all))
    f.push({ rule: 'anim-fill-mode', level: 'warn', msg: 'no animation-fill-mode both/forwards; the logo may flash its final state before the reveal starts' });
  return f;
}

/** Replace currentColor with concrete inks; the second tone (accent) applies inside [data-ink="accent"]. */
export function colorize(src: string, { ink = '#000000', accent }: { ink?: string; accent?: string } = {}): string {
  const parsed = parseSvg(src);
  const acc = accent || ink;
  const visit = (node: XNode, cur: string, inh: { fill: boolean; stroke: boolean }, mask: boolean): void => {
    if (node.text !== undefined) return;
    const isAccent = node.attrs['data-ink'] === 'accent';
    if (isAccent) cur = acc;
    const inMask = mask || node.tag === 'mask' || node.tag === 'clipPath';
    const next = { ...inh };
    for (const p of ['fill', 'stroke'] as const) {
      const own = paint(node, p);
      if (own !== undefined) next[p] = isInk(own);
      else if (inh[p] && isAccent && !inMask) node.attrs[p] = acc; // inherited ink must switch colour here
    }
    for (const k of Object.keys(node.attrs)) node.attrs[k] = node.attrs[k].replace(/currentcolor/gi, cur);
    for (const c of node.children) visit(c, cur, next, inMask);
  };
  visit(parsed.svg, ink, { fill: false, stroke: false }, false);
  return serialize(parsed.svg);
}

/** Prefix every id so several SVGs can be inlined in one HTML page. */
export function scopeIds(src: string, prefix: string): string {
  if (!prefix) return src;
  return src
    .replace(/\bid="([^"]+)"/g, `id="${prefix}$1"`)
    .replace(/url\(\s*#([^)\s]+)\s*\)/g, `url(#${prefix}$1)`)
    .replace(/\b(xlink:href|href)="#([^"]+)"/g, `$1="#${prefix}$2"`);
}

/** Inline-ready markup: strip size attributes, scope ids. */
export function inline(src: string, prefix = ''): string {
  const parsed = parseSvg(src);
  const a = parsed.svg.attrs;
  delete a.width; delete a.height;
  a.xmlns = 'http://www.w3.org/2000/svg';
  return scopeIds(serialize(parsed.svg), prefix);
}

/** Markup for nesting this SVG inside another at a given box (used to compose lockups). */
export function nest(src: string, x: number, y: number, w: number, h: number, prefix: string): string {
  const parsed = parseSvg(src);
  const a = parsed.svg.attrs;
  delete a.xmlns; delete a['xmlns:xlink'];
  Object.assign(a, { x: String(x), y: String(y), width: String(w), height: String(h) });
  return scopeIds(serialize(parsed.svg), prefix);
}

export const wrapSvg = (viewBox: number[], body: string, attrs: Record<string, string> = {}): string => {
  const a = Object.entries(attrs).map(([k, v]) => ` ${k}="${v}"`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.join(' ')}"${a}>${body}</svg>`;
};
