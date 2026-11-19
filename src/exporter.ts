// Final assets: the chosen mark and name turned into monochrome files (black, white, greys), plus a baseline animation.
import fs from 'node:fs';
import path from 'node:path';
import { writeFile, writeJson, die } from './util.js';
import { parseSvg, colorize, nest, wrapSvg } from './svg.js';
import { serialize, elements, type XNode } from './xml.js';
import { render, tighten, encodeIco } from './raster.js';
import { INKS } from './color.js';
import { outlineChoice } from './fonts.js';
import type { Identity, Workspace } from './identity.js';

const SKIP = new Set(['defs', 'mask', 'clipPath', 'title', 'desc', 'style', 'metadata']);

/** A reveal that works for any mark: each top-level part settles in turn, accents pop. The agent may hand-craft a better one. */
export function baselineAnimation(src: string): string {
  const parsed = parseSvg(src);
  let parts = elements(parsed.svg).filter((n) => !SKIP.has(n.tag));
  if (parts.length === 1 && parts[0].tag === 'g' && elements(parts[0]).length > 1) parts = elements(parts[0]).filter((n) => !SKIP.has(n.tag));
  parts.forEach((p, i) => {
    p.attrs.class = [p.attrs.class, 'k-part'].filter(Boolean).join(' ');
    p.attrs.style = [p.attrs.style, `--i:${i}`].filter(Boolean).join(';');
  });
  const css = [
    '.k-part{transform-box:fill-box;transform-origin:center;animation:k-in .7s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i)*.14s)}',
    '.k-part[data-ink="accent"],[data-ink="accent"] .k-part{animation-name:k-pop}',
    '@keyframes k-in{from{opacity:0;transform:translateY(14%) scale(.94)}to{opacity:1;transform:none}}',
    '@keyframes k-pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:none}}',
    '@media (prefers-reduced-motion:reduce){.k-part{animation:none}}',
  ].join('');
  const style: XNode = { tag: 'style', attrs: {}, children: [{ tag: '', attrs: {}, children: [], text: css }] };
  parsed.svg.children.unshift(style);
  return serialize(parsed.svg);
}

/** Mark and name side by side in one single-ink SVG, 100 units tall. */
export function composeLockup(mark: string, word: string, opts: { gap: number; wordScale: number }): string {
  const m = tighten(mark), w = tighten(word);
  const H = 100, mw = (H * m.viewBox[2]) / m.viewBox[3];
  const aspect = w.viewBox[2] / w.viewBox[3];
  const wh = H * (aspect < 2.4 ? Math.max(opts.wordScale, 0.82) : opts.wordScale); // a stacked name needs more height to stay readable
  const ww = wh * aspect, gap = H * opts.gap;
  const r = (n: number): number => Math.round(n * 100) / 100;
  return wrapSvg([0, 0, r(mw + gap + ww), H], nest(m.src, 0, 0, r(mw), H, 'm-') + nest(w.src, r(mw + gap), r((H - wh) / 2), r(ww), r(wh), 'w-'));
}

function liveTextLockup(mark: string, name: string, family: string, weight: number, gap: number): string {
  const m = tighten(mark);
  const H = 100, mw = (H * m.viewBox[2]) / m.viewBox[3], size = 62;
  const width = mw + H * gap + name.length * size * 0.6;
  const text = `<text x="${Math.round(mw + H * gap)}" y="${H / 2}" dominant-baseline="central" font-family="'${family}', sans-serif" font-weight="${weight}" font-size="${size}" fill="currentColor">${name.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`;
  return wrapSvg([0, 0, Math.round(width), H], nest(m.src, 0, 0, Math.round(mw * 100) / 100, H, 'm-') + text);
}

export interface Manifest { generated: string; liveText: boolean; files: { file: string; what: string }[]; lockup: string; mark: string; small: string; animated: string | null }

export async function exportFinal(ws: Workspace, id: Identity): Promise<Manifest> {
  const sel = id.selection;
  const concept = id.concepts.find((c) => c.id === sel.concept) || die('no logo selected yet (selection.concept)');
  const name = sel.name || die('no name selected yet (selection.name)');
  const L = INKS.light, D = INKS.dark;
  const out = (f: string): string => path.join(ws.dir, 'final', f);
  // Start from an empty folder: files from an earlier export (or an earlier version of kothar) must not linger next to the new ones.
  fs.rmSync(path.join(ws.dir, 'final'), { recursive: true, force: true });
  const files: { file: string; what: string }[] = [];
  const put = (f: string, data: string | Uint8Array, what: string): void => { writeFile(out(f), data); files.push({ file: f, what }); };

  const mark = tighten(fs.readFileSync(ws.rel(concept.mark), 'utf8'), 0.04).src;
  const small = concept.compact ? tighten(fs.readFileSync(ws.rel(concept.compact), 'utf8'), 0.04).src : mark;
  put('mark.svg', mark, 'Mark, single ink (currentColor): the master');
  if (concept.compact) put('mark-compact.svg', small, 'Compact mark for 16–32 px');
  put('mark-on-light.svg', colorize(mark, { ink: L.ink, accent: L.accent }), 'Mark in black and grey, for light grounds');
  put('mark-on-dark.svg', colorize(mark, { ink: D.ink, accent: D.accent }), 'Mark in white and grey, for dark grounds');

  let word: string | null = null;
  const drawn = sel.wordmark ? id.wordmarks.find((w) => w.id === sel.wordmark) : null;
  if (id.markOnly) word = null;
  else if (drawn) word = fs.readFileSync(ws.rel(drawn.file), 'utf8');
  else if (sel.font) word = await outlineChoice(name, sel.font);
  let lockup: string, liveText = false;
  if (id.markOnly) lockup = mark; // the user asked for the symbol alone
  else if (word) {
    put('wordmark.svg', tighten(word, 0.02).src, drawn ? 'Drawn name, single ink' : `Name outlined from ${sel.font?.family}, single ink`);
    lockup = composeLockup(mark, word, id.lockup);
  } else {
    liveText = true; // no font file: the lockup keeps live text and depends on the font being installed
    lockup = liveTextLockup(mark, name, sel.font?.family || 'sans-serif', sel.font?.weight || 700, id.lockup.gap);
  }
  if (!id.markOnly) put('lockup.svg', lockup, 'Mark + name, single ink' + (liveText ? ' (LIVE TEXT: needs the font installed; outline it before sending to print)' : ''));
  if (!id.markOnly) put('lockup-on-light.svg', colorize(lockup, { ink: L.ink, accent: L.accent }), 'Mark + name in black and grey, for light grounds');
  if (!id.markOnly) put('lockup-on-dark.svg', colorize(lockup, { ink: D.ink, accent: D.accent }), 'Mark + name in white and grey, for dark grounds');

  const made = id.animation && (!id.animationFor || id.animationFor === concept.id);
  const animFile = made && id.animation && fs.existsSync(ws.rel(id.animation)) ? ws.rel(id.animation) : null;
  const animated = animFile ? fs.readFileSync(animFile, 'utf8') : baselineAnimation(fs.readFileSync(ws.rel(concept.mark), 'utf8'));
  put('mark-animated.svg', animated, 'Animated mark (CSS, respects reduced motion); optional');

  const colour = (s: string): string => colorize(s, { ink: L.ink, accent: L.accent });
  const icoParts: { size: number; data: Uint8Array }[] = [];
  for (const size of [16, 32, 48]) icoParts.push({ size, data: render(squared(colour(small)), { width: size }).png() });
  put('favicon.ico', encodeIco(icoParts), 'Favicon, 16/32/48 px');
  put('favicon.svg', squared(colour(small)), 'Favicon, vector');
  for (const size of [16, 32, 64, 128, 256, 512]) put(`png/mark-${size}.png`, render(squared(colour(size <= 32 ? small : mark), size <= 32 ? 0.03 : 0.1), { width: size }).png(), `Mark, ${size} px, transparent`);
  put('apple-touch-icon.png', render(squared(colour(mark), 0.2), { width: 180, background: L.ground }).png(), 'App icon, 180 px on white');

  const manifest: Manifest = { generated: new Date().toISOString(), liveText, files, lockup, mark, small, animated };
  writeJson(out('manifest.json'), manifest);
  return manifest;
}

/** Centre the artwork in a square viewBox with padding. */
function squared(src: string, pad = 0): string {
  const p = parseSvg(src);
  const [x, y, w, h] = p.viewBox as number[];
  const side = Math.max(w, h) * (1 + 2 * pad);
  p.svg.attrs.viewBox = [x - (side - w) / 2, y - (side - h) / 2, side, side].map((n) => Math.round(n * 1000) / 1000).join(' ');
  return serialize(p.svg);
}
