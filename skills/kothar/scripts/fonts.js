// Fonts: is a family free to use, fetch its file, and outline a name into paths.
import fs from 'node:fs';
import path from 'node:path';
import { ASSETS, HOME, need, readJson, fold } from './util.js';
export const WARNING = 'Using a font without holding its licence can lead to legal claims. Only choose a paid font if you own a licence that covers logo use.';
export const freeList = () => readJson(path.join(ASSETS, 'fonts.json')).families;
const css2 = (family, weight) => `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}${weight ? `:wght@${weight}` : ''}`;
/** Free if it is in the bundled list or served by Google Fonts; otherwise unknown and the user must vouch for a licence. */
export async function checkFont(family, opts = {}) {
    const hit = freeList().find((f) => fold(f.family) === fold(family));
    if (hit)
        return { family: hit.family, free: true, license: hit.license || 'OFL-1.1', source: 'bundled list of Google Fonts families' };
    // Google's endpoint answers for some commercial names too, so a known paid family is paid whatever the endpoint says.
    const paid = readJson(path.join(ASSETS, 'fonts.json')).paid.find((f) => fold(f) === fold(family));
    if (paid)
        return { family: paid, free: false, source: 'bundled list of commercial families', license: 'commercial: the user must hold a licence that covers logo use' };
    if (opts.online !== false) {
        try {
            const r = await fetch(css2(family), { signal: AbortSignal.timeout(8000) });
            if (r.ok)
                return { family, free: true, license: 'open licence (OFL / Apache / UFL, see fonts.google.com)', source: 'served by Google Fonts' };
            if (r.status === 400)
                return { family, free: null, source: 'not on Google Fonts', license: 'unknown: treat as paid unless the user confirms a licence' };
        }
        catch { /* offline: fall through */ }
    }
    return { family, free: null, source: 'could not verify', license: 'unknown: treat as paid unless the user confirms a licence' };
}
/** Download the TTF of a Google Fonts family (cached in ~/.kothar/fonts). Null when unavailable. */
export async function fetchTtf(family, weight = 400) {
    const file = path.join(HOME, 'fonts', `${fold(family).replace(/[^a-z0-9]+/g, '-')}-${weight}.ttf`);
    if (fs.existsSync(file))
        return file;
    for (const w of [weight, undefined]) {
        try {
            // Without a browser user-agent Google Fonts answers with TrueType sources, which opentype.js reads.
            const r = await fetch(css2(family, w), { signal: AbortSignal.timeout(10000), headers: { 'user-agent': 'curl/8' } });
            if (!r.ok)
                continue;
            const url = /url\((https:[^)]+\.ttf)\)/.exec(await r.text())?.[1];
            if (!url)
                continue;
            const bin = await fetch(url, { signal: AbortSignal.timeout(20000) });
            if (!bin.ok)
                continue;
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, Buffer.from(await bin.arrayBuffer()));
            return file;
        }
        catch { /* try the next form */ }
    }
    return null;
}
/** Outline `text` in a font file to a single-ink SVG whose viewBox hugs the letters. */
export function outline(fontFile, text, opts = {}) {
    const opentype = need('opentype.js');
    const buf = fs.readFileSync(fontFile);
    const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
    const p = font.getPath(text, 0, 0, 200, { kerning: true, letterSpacing: opts.tracking || 0 });
    const b = p.getBoundingBox();
    const r = (n) => Math.round(n * 100) / 100;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(b.x1)} ${r(b.y1)} ${r(b.x2 - b.x1)} ${r(b.y2 - b.y1)}" fill="currentColor"><path d="${p.toPathData(2)}"/></svg>`;
}
/** The chosen name set in the chosen font, as paths. Null when the font file cannot be had (custom font without a file, offline). */
export async function outlineChoice(name, font) {
    const file = font.file && fs.existsSync(font.file) ? font.file : font.custom ? null : await fetchTtf(font.family, font.weight || 700);
    if (!file)
        return null;
    try {
        return outline(file, font.uppercase ? name.toUpperCase() : name, { tracking: font.tracking });
    }
    catch {
        return null;
    }
}
