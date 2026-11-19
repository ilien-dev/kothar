// Names: what the user already uses, remembered preferences, and measured properties of candidates.
import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns/promises';
import { execSync } from 'node:child_process';
import { HOME, readJson, writeJson, fold, round } from './util.js';

const PREFS = path.join(HOME, 'preferences.json');
export interface Prefs { categories?: string[]; noPreference?: boolean; length?: string; pronounce?: string[]; notes?: string; updated?: string }

export const loadPrefs = (): Prefs | null => readJson<Prefs | null>(PREFS, null);
export function savePrefs(p: Prefs): Prefs {
  const next = { ...(loadPrefs() || {}), ...p, updated: new Date().toISOString() };
  writeJson(PREFS, next);
  return next;
}

/** Names the user already has: GitHub repositories (via gh) and, optionally, sibling folders. */
export function takenNames(siblingsOf?: string): { names: string[]; sources: Record<string, number | string> } {
  const names = new Set<string>();
  const sources: Record<string, number | string> = {};
  try {
    const out = execSync('gh repo list --limit 1000 --json name --jq ".[].name"', { stdio: ['ignore', 'pipe', 'ignore'], timeout: 30000 }).toString();
    const list = out.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    list.forEach((n) => names.add(n));
    sources.gh = list.length;
  } catch { sources.gh = 'unavailable (gh missing or not logged in)'; }
  if (siblingsOf) {
    try {
      const dirs = fs.readdirSync(path.dirname(path.resolve(siblingsOf)), { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith('.')).map((d) => d.name);
      dirs.forEach((n) => names.add(n));
      sources.siblingFolders = dirs.length;
    } catch { sources.siblingFolders = 'unreadable'; }
  }
  return { names: [...names].sort(), sources };
}

function editDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

// Heuristics, not phonetics: they flag what usually trips a speaker, so the agent can warn instead of guess.
const ES_ONSETS = new Set(['pr', 'br', 'tr', 'dr', 'cr', 'gr', 'fr', 'pl', 'bl', 'cl', 'gl', 'fl', 'ch', 'll', 'rr', 'qu', 'gu']);
function pronounce(name: string, lang: string): { ease: 'easy' | 'medium' | 'hard'; issues: string[] } {
  const s = fold(name).replace(/[^a-z]/g, '');
  const issues: string[] = [];
  const clusters = s.match(/[^aeiouy]{2,}/g) || [];
  if (lang === 'es') {
    for (const c of clusters) {
      const atStart = s.startsWith(c), atEnd = s.endsWith(c);
      if (atStart && !ES_ONSETS.has(c)) issues.push(`starts with "${c}", not a Spanish onset`);
      else if (atEnd) issues.push(`ends in the cluster "${c}"`);
      else if (c.length >= 3 && !ES_ONSETS.has(c.slice(1))) issues.push(`cluster "${c}"`);
    }
    if (/(th|sh|ph|kh|gh|w|oo|ee)/.test(s)) issues.push('spelling a Spanish speaker reads differently (th, sh, ph, w, oo, ee)');
    if (/[^aeioudlnrsz]$/.test(s)) issues.push(`ends in "${s.slice(-1)}", unusual for Spanish`);
  } else {
    for (const c of clusters) if (c.length >= 4 || (c.length === 3 && !/^(str|spr|scr|spl|thr|sch|nth|rst|nds|ngs|rld|ght|tch|rch|mpl|ntr|ndr|mbr|ngl|rth|lth)$/.test(c))) issues.push(`cluster "${c}"`);
    if (/[ñ]/.test(name.toLowerCase()) || name !== name.normalize('NFD').replace(/[̀-ͯ]/g, '')) issues.push('accents or ñ are dropped or mistyped by English speakers');
    if (/(j|x|ll|gu[ei]|qu|hua|tz|tl|kh|zh|dj)/.test(s)) issues.push('letters English speakers pronounce unpredictably (j, x, ll, gui, tz, tl…)');
    if (/[aeiou]{3,}/.test(s)) issues.push('three vowels in a row');
  }
  return { ease: issues.length === 0 ? 'easy' : issues.length === 1 ? 'medium' : 'hard', issues };
}

export interface NameMetrics {
  name: string; slug: string; letters: number; syllables: number;
  pronounce: Record<string, { ease: string; issues: string[] }>;
  taken: boolean; nearTaken: string[]; typeable: boolean;
  online?: Record<string, string>;
}

export function measureName(name: string, langs: string[], taken: string[]): NameMetrics {
  const slug = fold(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const flat = slug.replace(/-/g, '');
  const takenFlat = taken.map((t) => fold(t).replace(/[^a-z0-9]/g, ''));
  return {
    name, slug,
    letters: [...name.replace(/[^\p{L}\p{N}]/gu, '')].length,
    syllables: (fold(name).match(/[aeiouy]+/g) || []).length,
    pronounce: Object.fromEntries(langs.map((l) => [l, pronounce(name, l)])),
    taken: takenFlat.includes(flat),
    nearTaken: taken.filter((t, i) => takenFlat[i] !== flat && takenFlat[i].length > 2 && (editDistance(takenFlat[i], flat) <= 1 || fold(t).split(/[-_.]/)[0] === flat)),
    typeable: fold(name) === name.toLowerCase(), // no accents needed to type it as a package or domain
  };
}

/** Optional availability lookups. They send the candidate name to public registries, so the agent asks first. */
export async function online(slug: string): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const probe = async (label: string, url: string): Promise<void> => {
    try { const r = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(8000), headers: { 'user-agent': 'name-availability-check' } }); out[label] = r.status === 404 ? 'free' : r.status === 200 ? 'taken' : `unknown (${r.status})`; }
    catch { out[label] = 'unknown (network)'; }
  };
  await Promise.all([
    probe('npm', `https://registry.npmjs.org/${slug}`),
    probe('pypi', `https://pypi.org/pypi/${slug}/json`),
    probe('crates', `https://crates.io/api/v1/crates/${slug}`),
    ...['com', 'dev', 'io'].map(async (tld) => {
      try { await dns.resolveAny(`${slug}.${tld}`); out[`${slug}.${tld}`] = 'registered'; }
      catch (e) { out[`${slug}.${tld}`] = (e as NodeJS.ErrnoException).code === 'ENOTFOUND' ? 'no DNS record (probably free)' : 'unknown'; }
    }),
  ]);
  return out;
}

export function summarise(m: NameMetrics): string {
  const p = Object.entries(m.pronounce).map(([l, v]) => `${l}:${v.ease}`).join(' ');
  return `${m.name.padEnd(14)} ${String(m.letters).padStart(2)} letters  ${m.syllables} syll  ${p}${m.taken ? '  TAKEN' : ''}${m.nearTaken.length ? `  near: ${m.nearTaken.join(',')}` : ''}`;
}
export { round };
