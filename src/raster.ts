// Rasterising (resvg) and the pixel operations the audits are built on.
import zlib from 'node:zlib';
import { need } from './util.js';
import { colorize, parseSvg, type Box } from './svg.js';
import { serialize } from './xml.js';

export interface Raster { w: number; h: number; pixels: Uint8Array; png: () => Uint8Array }
export interface Alpha { a: Float32Array; w: number; h: number }
export type Mask = Uint8Array;

let Resvg: any;
export function render(src: string, opts: { width?: number; background?: string } = {}): Raster {
  Resvg ||= need('@resvg/resvg-js').Resvg;
  const o: any = { font: { loadSystemFonts: false } };
  if (opts.width) o.fitTo = { mode: 'width', value: Math.max(1, Math.round(opts.width)) };
  if (opts.background) o.background = opts.background;
  const img = new Resvg(src, o).render();
  return { w: img.width, h: img.height, pixels: img.pixels, png: () => img.asPng() };
}

/** Coverage (0..1) of everything the SVG paints. `size` is the longest side, or the height. */
export function renderAlpha(src: string, size: number, basis: 'longest' | 'height' = 'longest'): Alpha {
  let black = src;
  let vb: Box | null = null;
  try { vb = parseSvg(src).viewBox; black = colorize(src, { ink: '#000000' }); } catch { /* third-party icon: render as is */ }
  const aspect = vb ? vb[2] / vb[3] : 1;
  const width = basis === 'height' ? size * aspect : aspect >= 1 ? size : size * aspect;
  const img = render(black, { width });
  const a = new Float32Array(img.w * img.h);
  for (let i = 0; i < a.length; i++) a[i] = img.pixels[i * 4 + 3] / 255;
  return { a, w: img.w, h: img.h };
}

export interface Tight { src: string; viewBox: Box; touches: boolean; offCentre: number; fill: number }
/** Same SVG with its viewBox shrunk to the painted area, so "16 px" means 16 px of logo. */
export function tighten(src: string, padRatio = 0): Tight {
  const parsed = parseSvg(src);
  const vb = parsed.viewBox;
  if (!vb) throw new Error('no viewBox');
  const { a, w, h } = renderAlpha(src, 512);
  const bb = bbox(threshold(a, 0.04), w, h);
  if (!bb) throw new Error('nothing is painted');
  const k = vb[2] / w;
  const touches = bb.x0 === 0 || bb.y0 === 0 || bb.x1 === w - 1 || bb.y1 === h - 1;
  const box = [vb[0] + bb.x0 * k, vb[1] + bb.y0 * k, (bb.x1 - bb.x0 + 1) * k, (bb.y1 - bb.y0 + 1) * k];
  const p = Math.max(box[2], box[3]) * padRatio;
  const tight = [box[0] - p, box[1] - p, box[2] + 2 * p, box[3] + 2 * p].map((n) => Math.round(n * 1000) / 1000) as Box;
  const offCentre = Math.max(
    Math.abs(box[0] + box[2] / 2 - (vb[0] + vb[2] / 2)) / vb[2],
    Math.abs(box[1] + box[3] / 2 - (vb[1] + vb[3] / 2)) / vb[3]);
  delete parsed.svg.attrs.width; delete parsed.svg.attrs.height;
  parsed.svg.attrs.viewBox = tight.join(' ');
  return { src: serialize(parsed.svg), viewBox: tight, touches, offCentre, fill: Math.max(box[2] / vb[2], box[3] / vb[3]) };
}

export const threshold = (a: Float32Array, t = 0.5): Mask => { const m = new Uint8Array(a.length); for (let i = 0; i < a.length; i++) m[i] = a[i] >= t ? 1 : 0; return m; };
export const count = (m: Mask): number => { let n = 0; for (let i = 0; i < m.length; i++) n += m[i]; return n; };
export const invert = (m: Mask): Mask => { const o = new Uint8Array(m.length); for (let i = 0; i < m.length; i++) o[i] = m[i] ? 0 : 1; return o; };

export interface BBox { x0: number; y0: number; x1: number; y1: number }
export function bbox(m: Mask, w: number, h: number): BBox | null {
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (m[y * w + x]) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
}

export function pad(m: Mask, w: number, h: number, p: number): { m: Mask; w: number; h: number } {
  const W = w + 2 * p, H = h + 2 * p, o = new Uint8Array(W * H);
  for (let y = 0; y < h; y++) o.set(m.subarray(y * w, y * w + w), (y + p) * W + p);
  return { m: o, w: W, h: H };
}

/** Exact Euclidean distance from every pixel to the nearest pixel where feature=1 (Felzenszwalb). */
export function edt(feature: Mask, w: number, h: number): Float32Array {
  const INF = 1e20, n = Math.max(w, h);
  const g = new Float64Array(w * h), f = new Float64Array(n), d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
  const pass = (len: number): void => {
    let k = 0; v[0] = 0; z[0] = -INF; z[1] = INF;
    for (let q = 1; q < len; q++) {
      let s: number;
      for (;;) {
        const p = v[k];
        s = ((f[q] + q * q) - (f[p] + p * p)) / (2 * q - 2 * p);
        if (s <= z[k] && k > 0) k--; else break;
      }
      k++; v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < len; q++) { while (z[k + 1] < q) k++; const p = v[k]; d[q] = (q - p) * (q - p) + f[p]; }
  };
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = feature[y * w + x] ? 0 : INF;
    pass(h);
    for (let y = 0; y < h; y++) g[y * w + x] = d[y];
  }
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = g[y * w + x];
    pass(w);
    for (let x = 0; x < w; x++) out[y * w + x] = Math.sqrt(d[x]);
  }
  return out;
}

/** Morphological opening: what remains of the mask once everything thinner than `t` px is erased. */
export function open(m: Mask, w: number, h: number, t: number): Mask {
  if (t <= 1) return m;
  const din = edt(invert(m), w, h);
  const core = new Uint8Array(m.length);
  let any = 0;
  for (let i = 0; i < m.length; i++) if (m[i] && din[i] >= t / 2) { core[i] = 1; any = 1; }
  if (!any) return core;
  const dc = edt(core, w, h);
  const out = new Uint8Array(m.length);
  for (let i = 0; i < m.length; i++) out[i] = m[i] && dc[i] <= t / 2 ? 1 : 0;
  return out;
}

/** Connected components with their areas and whether each touches the image border. */
export function components(m: Mask, w: number, h: number, conn8 = true): { areas: number[]; border: boolean[]; labels: Int32Array } {
  const lab = new Int32Array(w * h), areas: number[] = [], border: boolean[] = [], stack: number[] = [];
  for (let s = 0; s < m.length; s++) {
    if (!m[s] || lab[s]) continue;
    const id = areas.length + 1;
    let area = 0, edge = false;
    lab[s] = id; stack.push(s);
    while (stack.length) {
      const i = stack.pop() as number, x = i % w, y = (i - x) / w;
      area++;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) edge = true;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if ((!dx && !dy) || (!conn8 && dx && dy)) continue;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const j = ny * w + nx;
        if (m[j] && !lab[j]) { lab[j] = id; stack.push(j); }
      }
    }
    areas.push(area); border.push(edge);
  }
  return { areas, border, labels: lab };
}

function background(m: Mask, w: number, h: number): { m: Mask; w: number; h: number } {
  const p = pad(invert(m), w, h, 1);
  for (let i = 0; i < p.m.length; i++) { const x = i % p.w, y = (i - x) / p.w; if (x === 0 || y === 0 || x === p.w - 1 || y === p.h - 1) p.m[i] = 1; }
  return p;
}

/** Pieces of ink and enclosed holes: the topology a viewer perceives. */
export function topology(m: Mask, w: number, h: number): { pieces: number; holes: number; areas: number[] } {
  const ink = components(m, w, h, true);
  const p = background(m, w, h);
  const bg = components(p.m, p.w, p.h, false);
  return { pieces: ink.areas.length, holes: bg.areas.filter((_, i) => !bg.border[i]).length, areas: ink.areas };
}

/** Silhouette: the mask with every enclosed hole filled. */
export function silhouette(m: Mask, w: number, h: number): Mask {
  const p = background(m, w, h);
  const bg = components(p.m, p.w, p.h, false);
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const l = bg.labels[(y + 1) * p.w + x + 1];
    out[y * w + x] = l && bg.border[l - 1] ? 0 : 1;
  }
  return out;
}

/** Area-average resample of a float image into dw x dh. */
export function resample(a: ArrayLike<number>, w: number, h: number, dw: number, dh: number): Float32Array {
  const out = new Float32Array(dw * dh);
  const sx = w / dw, sy = h / dh;
  for (let y = 0; y < dh; y++) for (let x = 0; x < dw; x++) {
    const x0 = x * sx, x1 = (x + 1) * sx, y0 = y * sy, y1 = (y + 1) * sy;
    let sum = 0, area = 0;
    for (let yy = Math.floor(y0); yy < Math.min(h, Math.ceil(y1)); yy++) {
      const hy = Math.min(yy + 1, y1) - Math.max(yy, y0);
      for (let xx = Math.floor(x0); xx < Math.min(w, Math.ceil(x1)); xx++) {
        const wx = Math.min(xx + 1, x1) - Math.max(xx, x0);
        sum += a[yy * w + xx] * wx * hy; area += wx * hy;
      }
    }
    out[y * dw + x] = area ? sum / area : 0;
  }
  return out;
}

// ---- PNG / ICO writing (for enlarged pixel previews and favicons) ----
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf: Uint8Array): number { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type: string, data: Uint8Array): Buffer {
  const head = Buffer.alloc(8); head.writeUInt32BE(data.length, 0); head.write(type, 4, 'latin1');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
}
export function encodePng(w: number, h: number, rgba: Uint8Array): Buffer {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', new Uint8Array(0))]);
}

/** Render at `size` px on an opaque ground, then enlarge every pixel `scale` times: shows exactly what a small size keeps. */
export function pixelPreview(src: string, size: number, scale: number, background = '#ffffff', basis: 'longest' | 'height' = 'longest'): Buffer {
  const vb = parseSvg(src).viewBox as Box;
  const aspect = vb[2] / vb[3];
  const width = basis === 'height' ? size * aspect : aspect >= 1 ? size : size * aspect;
  const img = render(src, { width, background });
  const W = img.w * scale, H = img.h * scale, out = new Uint8Array(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const s = (Math.floor(y / scale) * img.w + Math.floor(x / scale)) * 4, d = (y * W + x) * 4;
    out[d] = img.pixels[s]; out[d + 1] = img.pixels[s + 1]; out[d + 2] = img.pixels[s + 2]; out[d + 3] = 255;
  }
  return encodePng(W, H, out);
}

/** Multi-size .ico built from PNG entries. */
export function encodeIco(pngs: { size: number; data: Uint8Array }[]): Buffer {
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
  let off = head.length;
  pngs.forEach((p, i) => {
    const e = 6 + 16 * i;
    head[e] = p.size >= 256 ? 0 : p.size; head[e + 1] = p.size >= 256 ? 0 : p.size;
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(p.data.length, e + 8); head.writeUInt32LE(off, e + 12);
    off += p.data.length;
  });
  return Buffer.concat([head, ...pngs.map((p) => Buffer.from(p.data))]);
}
