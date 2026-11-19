// Shape similarity against famous brand marks, generic icon libraries and emoji.
// Each shape becomes two 24x24 descriptors (ink and silhouette); similarity is Pearson correlation.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { HOME, readJson, writeJson, round } from './util.js';
import { renderAlpha, threshold, bbox, silhouette, resample } from './raster.js';
export const N = 24, D = N * N;
const REFS_DIR = path.join(HOME, 'refs');
const INDEX_BIN = path.join(HOME, 'refs-index.bin');
const INDEX_META = path.join(HOME, 'refs-index.json');
// Where each reference set lives inside its npm package. kind drives how a match is worded.
export const SOURCES = [
    { pkg: 'simple-icons', kind: 'brand', label: 'brand logo', dirs: ['icons'] },
    { pkg: 'lucide-static', kind: 'icon', label: 'Lucide icon', dirs: ['icons'] },
    { pkg: '@tabler/icons', kind: 'icon', label: 'Tabler icon', dirs: ['icons/outline', 'icons/filled'] },
    { pkg: 'bootstrap-icons', kind: 'icon', label: 'Bootstrap icon', dirs: ['icons'] },
    { pkg: '@phosphor-icons/core', kind: 'icon', label: 'Phosphor icon', dirs: ['assets/regular', 'assets/fill'] },
    { pkg: '@twemoji/svg', kind: 'emoji', label: 'emoji', dirs: ['.'] },
];
export const LIMITS = { inkFail: 0.88, inkWarn: 0.76, silWarn: 0.95, silInkFloor: 0.45, sibling: 0.8, plainFont: 0.75 };
const blur = (a, w, h) => {
    const o = new Float32Array(w * h);
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            let s = 0, n = 0;
            for (let dy = -1; dy <= 1; dy++)
                for (let dx = -1; dx <= 1; dx++) {
                    const xx = x + dx, yy = y + dy;
                    if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
                        s += a[yy * w + xx];
                        n++;
                    }
                }
            o[y * w + x] = s / n;
        }
    return o;
};
const quantize = (a) => { let mx = 0; for (const v of a)
    if (v > mx)
        mx = v; return Uint8Array.from(a, (v) => (mx ? Math.round((v / mx) * 255) : 0)); };
function cropInk(src, size) {
    const r = renderAlpha(src, size);
    const m = threshold(r.a, 0.5);
    const bb = bbox(m, r.w, r.h);
    if (!bb)
        return null;
    const w = bb.x1 - bb.x0 + 1, h = bb.y1 - bb.y0 + 1;
    const a = new Float32Array(w * h), cm = new Uint8Array(w * h);
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            const i = (y + bb.y0) * r.w + x + bb.x0;
            a[y * w + x] = r.a[i];
            cm[y * w + x] = m[i];
        }
    return { a, m: cm, w, h };
}
/** Centre the painted area in a 24x24 frame (aspect kept); ink + silhouette descriptors as bytes. */
export function describe(src) {
    const c = cropInk(src, 160);
    if (!c)
        return null;
    const sil = Float32Array.from(silhouette(c.m, c.w, c.h));
    const inner = N - 2, k = inner / Math.max(c.w, c.h);
    const dw = Math.max(1, Math.round(c.w * k)), dh = Math.max(1, Math.round(c.h * k));
    const place = (img) => {
        const r = resample(img, c.w, c.h, dw, dh), o = new Float32Array(D);
        const ox = Math.floor((N - dw) / 2), oy = Math.floor((N - dh) / 2);
        for (let y = 0; y < dh; y++)
            for (let x = 0; x < dw; x++)
                o[(y + oy) * N + x + ox] = r[y * dw + x];
        return quantize(blur(o, N, N));
    };
    return { ink: place(c.a), sil: place(sil) };
}
/** Descriptor for wide artwork such as wordmarks: stretched to 96x24 so every letter keeps resolution. */
export function describeWide(src) {
    const c = cropInk(src, 640);
    return c ? quantize(blur(resample(c.a, c.w, c.h, 96, 24), 96, 24)) : null;
}
const flipH = (d) => { const o = new Uint8Array(D); for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++)
        o[y * N + x] = d[y * N + N - 1 - x]; return o; };
function centre(d) {
    const n = d.length;
    let mean = 0;
    for (let i = 0; i < n; i++)
        mean += d[i];
    mean /= n;
    const o = new Float32Array(n);
    let norm = 0;
    for (let i = 0; i < n; i++) {
        o[i] = d[i] - mean;
        norm += o[i] * o[i];
    }
    norm = Math.sqrt(norm) || 1;
    for (let i = 0; i < n; i++)
        o[i] /= norm;
    return o;
}
function corr(q, buf, off) {
    const n = q.length;
    let mean = 0;
    for (let i = 0; i < n; i++)
        mean += buf[off + i];
    mean /= n;
    let dot = 0, norm = 0;
    for (let i = 0; i < n; i++) {
        const v = buf[off + i] - mean;
        dot += q[i] * v;
        norm += v * v;
    }
    return norm ? dot / Math.sqrt(norm) : 0;
}
export const correlate = (a, b) => corr(centre(a), b, 0);
function listSvgs(dir) { try {
    return fs.readdirSync(dir).filter((f) => f.endsWith('.svg')).sort().map((f) => path.join(dir, f));
}
catch {
    return [];
} }
// Emoji files are named by code point ("1f9f5"); show the character itself so the neighbour can be recognised.
function emojiName(file) {
    try {
        return `${String.fromCodePoint(...file.split('-').map((h) => parseInt(h, 16)))} (U+${file.toUpperCase()})`;
    }
    catch {
        return file;
    }
}
let cache;
/** Download the reference sets and build the descriptor index in ~/.kothar. */
export function buildIndex(opts = {}) {
    const log = (s) => { process.stderr.write(s + '\n'); };
    fs.mkdirSync(REFS_DIR, { recursive: true });
    if (!fs.existsSync(path.join(REFS_DIR, 'package.json')))
        writeJson(path.join(REFS_DIR, 'package.json'), { name: 'kothar-refs', private: true });
    log('downloading reference sets (brand logos, icon libraries, emoji)...');
    execSync(`npm install --no-audit --no-fund --loglevel=error ${SOURCES.map((s) => s.pkg).join(' ')}`, { cwd: REFS_DIR, stdio: ['ignore', 'ignore', 'inherit'] });
    const entries = [], chunks = [], versions = {};
    for (const s of SOURCES) {
        const root = path.join(REFS_DIR, 'node_modules', s.pkg);
        versions[s.pkg] = readJson(path.join(root, 'package.json'), {}).version;
        const titles = {};
        if (s.pkg === 'simple-icons')
            for (const f of ['data/simple-icons.json', '_data/simple-icons.json']) {
                const d = readJson(path.join(root, f), null);
                const arr = Array.isArray(d) ? d : d?.icons;
                if (arr) {
                    for (const i of arr)
                        if (i.slug)
                            titles[i.slug] = i.title;
                    break;
                }
            }
        let n = 0;
        for (const dir of s.dirs)
            for (const file of listSvgs(path.join(root, dir))) {
                let d = null;
                try {
                    d = describe(fs.readFileSync(file, 'utf8'));
                }
                catch { /* unrenderable reference: skip */ }
                if (!d)
                    continue;
                const slug = path.basename(file, '.svg');
                entries.push({ kind: s.kind, label: s.label, name: titles[slug] || slug });
                chunks.push(d.ink, d.sil);
                n++;
            }
        log(`  ${s.pkg}@${versions[s.pkg]}: ${n} shapes`);
    }
    fs.writeFileSync(INDEX_BIN, Buffer.concat(chunks));
    writeJson(INDEX_META, { built: new Date().toISOString(), n: N, versions, entries });
    if (!opts.keep)
        fs.rmSync(path.join(REFS_DIR, 'node_modules'), { recursive: true, force: true });
    cache = undefined;
    return { count: entries.length, versions };
}
export function loadIndex() {
    if (cache !== undefined)
        return cache;
    if (!fs.existsSync(INDEX_BIN) || !fs.existsSync(INDEX_META))
        return (cache = null);
    return (cache = { ...readJson(INDEX_META), buf: fs.readFileSync(INDEX_BIN) });
}
// A silhouette that is just a disc or a square says nothing: half the icons in the world share it.
function trivialSilhouette(sil) {
    let on = 0;
    for (const v of sil)
        if (v > 127)
            on++;
    return on / D > (0.72 * (N - 2) * (N - 2)) / D;
}
/** Nearest reference shapes for one SVG, plus a verdict. */
export function query(src, top = 5) {
    const idx = loadIndex();
    if (!idx)
        return { checked: false, matches: [], findings: [{ rule: 'similarity', level: 'warn', msg: 'reference index not built: similarity to known logos, icons and emoji was NOT checked. Run: kothar setup --refs' }] };
    const d = describe(src);
    if (!d)
        return { checked: true, findings: [], matches: [] };
    const trivial = trivialSilhouette(d.sil);
    const variants = [[centre(d.ink), centre(d.sil)], [centre(flipH(d.ink)), centre(flipH(d.sil))]];
    const scored = idx.entries.map((e, i) => {
        let ink = -1, sil = -1;
        for (const [qi, qs] of variants) {
            ink = Math.max(ink, corr(qi, idx.buf, i * 2 * D));
            sil = Math.max(sil, corr(qs, idx.buf, (i * 2 + 1) * D));
        }
        const outline = !trivial && sil >= LIMITS.silWarn && ink >= LIMITS.silInkFloor;
        return { ...e, name: e.kind === 'emoji' ? emojiName(e.name) : e.name, ink: round(ink), silhouette: round(sil), score: round(Math.max(ink, outline ? LIMITS.inkWarn + (sil - LIMITS.silWarn) : 0)) };
    }).sort((a, b) => b.score - a.score);
    const matches = [];
    for (const kind of ['brand', 'icon', 'emoji'])
        matches.push(...scored.filter((s) => s.kind === kind).slice(0, top));
    matches.sort((a, b) => b.score - a.score);
    const findings = [];
    const best = matches[0];
    if (best && best.score >= LIMITS.inkFail)
        findings.push({ rule: 'similarity', level: 'fail', msg: `practically the same shape as the ${best.label} "${best.name}" (${best.score}); redraw with an idea that is yours` });
    else if (best && best.score >= LIMITS.inkWarn) {
        const close = matches.filter((m) => m.score >= LIMITS.inkWarn).slice(0, 3).map((m) => `${m.label} "${m.name}" (${m.score})`).join(', ');
        findings.push({ rule: 'similarity', level: 'warn', msg: `close to ${close}; add identity (a cut, a counter-shape, a proportion) until it stops reading as that` });
    }
    else
        findings.push({ rule: 'similarity', level: 'pass', msg: best ? `nearest known shape: ${best.label} "${best.name}" at ${best.score} (flagged from ${LIMITS.inkWarn})` : 'no reference shapes' });
    return { checked: true, findings, matches: matches.slice(0, 9) };
}
/** Options that look alike waste the user's choice. */
export function siblings(items) {
    const findings = [];
    const ds = items.map((it) => ({ id: it.id, d: describe(it.src) })).filter((x) => !!x.d);
    for (let i = 0; i < ds.length; i++)
        for (let j = i + 1; j < ds.length; j++) {
            const s = Math.max(correlate(ds[i].d.ink, ds[j].d.ink), correlate(flipH(ds[i].d.ink), ds[j].d.ink));
            if (s >= LIMITS.sibling)
                findings.push({ rule: 'siblings', level: 'warn', msg: `options "${ds[i].id}" and "${ds[j].id}" are nearly the same drawing (${round(s)}); make them genuinely different directions` });
        }
    return findings;
}
/** A drawn wordmark that matches the plain font render is not a drawing, it is a font. */
export function plainFontScore(drawn, plain) {
    const a = describeWide(drawn), b = describeWide(plain);
    return a && b ? round(correlate(a, b)) : null;
}
