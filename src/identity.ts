// The workspace: identity.json is the single state shared by the agent, the scripts and the report page.
import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJson, die, str, fold, type Args, type Finding } from './util.js';
import type { FontChoice } from './fonts.js';
import type { FontPlan } from './typography.js';

export type Category = 'name' | 'product' | 'fusion';
export const CATEGORIES: Category[] = ['name', 'product', 'fusion'];
export interface Candidate { name: string; represents: string; why: string; metrics?: unknown }
export interface Concept { id: string; category: Category; title: string; rationale: string; depicts: string[]; mark: string; compact?: string }
export interface Wordmark { id: string; title: string; rationale: string; file: string }
export interface Task { text: string; state: 'done' | 'doing' | 'todo' }
export interface Flow { step: number; status: 'choose' | 'working' | 'final'; label?: string; tasks?: Task[]; overrides?: string[] }
export interface Selection {
  name?: string; font?: FontChoice; svgWordmark?: boolean; count?: number;
  concept?: string; wordmark?: string | null;
  /** The user asked for other options instead of choosing. */
  regenerate?: 'logos' | 'names' | 'fonts'; hint?: string; keep?: string[]; restart?: boolean; deliver?: boolean;
}
export interface Identity {
  version: 1;
  /** The user wants only the symbol: no font, no drawn name, no lockups. */
  markOnly?: boolean;
  /** Language of the page: 'en' and 'es' are built in, any other code needs a saved translation. */
  locale: string;
  /** kind and traits choose the fonts offered for the name: see `kothar traits`. */
  product: {
    summary: string; industry?: string; kind?: string; traits?: Record<string, number>;
    /** Facts that decide which way a drawing rule points (see references/logo-rules.md, "What the evidence supports"). */
    stage?: 'new' | 'known'; stakes?: 'high' | 'low'; category?: 'neutral' | 'negative';
  };
  naming: { categories: string[]; preferences: Record<string, unknown>; taken: string[]; candidates: Candidate[]; given?: boolean };
  fonts: { options: FontChoice[] };
  fontPlan?: FontPlan;
  keptFonts?: string[];
  logo: { count: number; split: Record<Category, number> };
  concepts: Concept[];
  wordmarks: Wordmark[];
  keptConcepts?: string[];
  keptWordmarks?: string[];
  selection: Selection;
  lockup: { gap: number; wordScale: number };
  animation?: string;
  /** The concept the hand-made animation was drawn for; another concept gets the generated one. */
  animationFor?: string;
  /** Set when the user restarted from the final report: existing options are offered again before anything is redrawn. */
  replay?: boolean;
  /** Set once the assets were written into the project: the work is handed over and the session can stop listening. */
  delivered?: { at: string; dir: string; files: number };
  flow: Flow;
  inbox?: { step: number; data: Selection; at: string };
}

export interface Workspace { dir: string; file: string; load: () => Identity; save: (v: Identity) => void; rel: (p: string) => string; exists: () => boolean }
export function workspace(args: Args): Workspace {
  const dir = path.resolve(str(args.dir, '.kothar'));
  const file = path.join(dir, 'identity.json');
  return {
    dir, file,
    exists: () => fs.existsSync(file),
    load: () => (fs.existsSync(file) ? upgrade(readJson<any>(file)) : die(`no identity.json in ${dir}. Run "kothar init" first.`)),
    save: (v) => writeJson(file, v),
    rel: (p) => path.resolve(dir, p),
  };
}

/** Workspaces made before the logo became monochrome had a colour step (03) and palettes: fold them into the three-step flow. */
function upgrade(id: any): Identity {
  if (!id || typeof id !== 'object') return id;
  const hadColour = 'palettes' in id || 'colour' in id || 'keptPalettes' in id;
  delete id.palettes; delete id.colour; delete id.keptPalettes;
  if (id.selection) { delete id.selection.palette; delete id.selection.colors; if (id.selection.regenerate === true) delete id.selection.regenerate; }
  if (hadColour && id.flow) {
    if (id.flow.step >= 4) id.flow.step = 3;
    else if (id.flow.step === 3 && id.flow.status !== 'final') id.flow = { ...id.flow, step: 3, status: 'working' };
  }
  if (hadColour && id.inbox?.step >= 3) delete id.inbox;
  return id as Identity;
}

export function blank(summary: string, industry: string, locale: string): Identity {
  return {
    version: 1, locale, product: { summary, industry },
    naming: { categories: [], preferences: {}, taken: [], candidates: [] },
    fonts: { options: [] },
    logo: { count: 3, split: { name: 1, product: 1, fusion: 1 } },
    concepts: [], wordmarks: [], selection: {},
    lockup: { gap: 0.3, wordScale: 0.46 },
    flow: { step: 0, status: 'working', label: '' },
  };
}

/** n logos over three categories: even base, remainder left for the agent to place where it helps most. */
export function split(n: number): { base: Record<Category, number>; remainder: number; note: string } {
  if (!Number.isInteger(n) || n < 3) die('at least 3 logos are needed: one per category (name, product, fusion)');
  const each = Math.floor(n / 3), remainder = n - each * 3;
  return {
    base: { name: each, product: each, fusion: each }, remainder,
    note: remainder
      ? `${remainder} extra logo(s) to place: give them to the category with the richest material for this product, and say why in each concept's rationale.`
      : 'even split',
  };
}

// What must be true before a step is shown to the user. Scripts decide, not the prompt.
export function gate(step: number, id: Identity, ws: Workspace): Finding[] {
  const f: Finding[] = [];
  const fail = (rule: string, msg: string): void => { f.push({ rule, level: 'fail', msg }); };
  if (step === 1) {
    const c = id.naming.candidates;
    // `given`: the user arrived with a name, so there is nothing to choose between.
    if (id.naming.given ? c.length !== 1 : c.length < 10) fail('names-count', id.naming.given ? 'naming.given is set: candidates must hold exactly the name the user gave' : `${c.length} name candidates; propose at least 10`);
    for (const x of c) if (!x.name || !x.represents || !x.why) fail('names-shape', `candidate "${x.name || '?'}" needs name, represents and why`);
    const taken = new Set(id.naming.taken.map((t) => fold(t)));
    for (const x of c) if (!id.naming.given && taken.has(fold(x.name))) fail('names-taken', `"${x.name}" is already one of the user's names`);
    const seen = new Set<string>();
    for (const x of c) { if (seen.has(fold(x.name))) fail('names-duplicate', `"${x.name}" appears twice`); seen.add(fold(x.name)); }
    for (const x of c) {
      const root = id.naming.taken.find((t) => fold(t) !== fold(x.name) && fold(t).split(/[-_.]/)[0] === fold(x.name));
      if (root && !id.naming.given) fail('names-taken', `"${x.name}" is the root of the user's existing "${root}"`);
    }
    if (!id.markOnly && id.fonts.options.length < 3) fail('fonts-count', 'offer at least 3 font options');
    for (const o of id.markOnly ? [] : id.fonts.options) if (o.free !== true) fail('fonts-free', `font "${o.family}" is not verified as free; run "kothar font check" and offer only free families (a paid font can only come from the user, with their licence)`);
  }
  if (step === 2) {
    const want = id.selection.count || id.logo.count;
    if (id.concepts.length !== want) fail('logo-count', `${id.concepts.length} concepts, the user asked for ${want}`);
    const tally: Record<string, number> = { name: 0, product: 0, fusion: 0 };
    for (const c of id.concepts) tally[c.category] = (tally[c.category] || 0) + 1;
    const min = Math.floor(want / 3);
    for (const k of CATEGORIES) if (tally[k] < min) fail('logo-split', `${tally[k]} concept(s) in category "${k}", need at least ${min}`);
    for (const c of id.concepts) {
      if (!fs.existsSync(ws.rel(c.mark))) fail('logo-file', `missing ${c.mark}`);
      if (!c.depicts?.length) fail('logo-depicts', `concept ${c.id} needs "depicts": the words a stranger should say when they see it`);
    }
    if (id.selection.svgWordmark && !id.markOnly && id.wordmarks.length < id.concepts.length) fail('wordmark-count', `the user asked for drawn names: ${id.wordmarks.length} drawn, need ${id.concepts.length} (one per logo)`);
    f.push(...auditGate(ws, (a) => [...Object.entries<any>(a.concepts || {}), ...Object.entries<any>(a.wordmarks || {})], 'concepts and wordmarks'));
    const a = readJson<any>(path.join(ws.dir, 'audit.json'), null);
    if (a && !a.judges) f.push({ rule: 'judges', level: 'fail', msg: 'no blind-judge results yet: run "kothar judge pack", have the judges answer, then "kothar judge score"' });
  }
  return f;
}

function auditGate(ws: Workspace, pick: (a: any) => [string, any][], what: string): Finding[] {
  const file = path.join(ws.dir, 'audit.json');
  const a = readJson<any>(file, null);
  if (!a) return [{ rule: 'audit-missing', level: 'fail', msg: `no audit.json: run "kothar audit" before showing ${what}` }];
  const out: Finding[] = [];
  const auditTime = fs.statSync(file).mtimeMs;
  const newer = (dir: string): boolean => {
    try { return fs.readdirSync(ws.rel(dir), { recursive: true }).some((x) => String(x).endsWith('.svg') && fs.statSync(path.join(ws.rel(dir), String(x))).mtimeMs > auditTime); }
    catch { return false; }
  };
  if (newer('concepts') || newer('wordmarks')) out.push({ rule: 'audit-stale', level: 'fail', msg: 'SVG files changed after the last audit: run "kothar audit" again' });
  for (const [id, r] of pick(a)) for (const x of (r.findings || []) as Finding[]) if (x.level === 'fail') out.push({ rule: x.rule, level: 'fail', msg: `${id}: ${x.msg}` });
  return out;
}
