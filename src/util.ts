// Shared helpers: paths, args, JSON io, lazy dependency loading.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

export const SKILL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const CLI = path.join(SKILL_DIR, 'scripts', 'kothar.js');
export const ASSETS = path.join(SKILL_DIR, 'assets');
export const HOME = process.env.KOTHAR_HOME || path.join(os.homedir(), '.kothar');
export const DEPS: Record<string, string> = { '@resvg/resvg-js': '^2.6.2', 'opentype.js': '^1.3.4' };

export type Args = { _: string[] } & Record<string, string | boolean | string[]>;
export type Level = 'pass' | 'info' | 'warn' | 'fail';
export interface Finding { rule: string; level: Level; msg: string }

export function parseArgs(argv: string[]): Args {
  const out: Args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq > 0) out[a.slice(2, eq)] = a.slice(eq + 1);
      else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) out[a.slice(2)] = argv[++i];
      else out[a.slice(2)] = true;
    } else out._.push(a);
  }
  return out;
}
export const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);

export function readJson<T = any>(p: string, fallback?: T): T {
  try { return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, '')) as T; }
  catch (e) { if (fallback !== undefined) return fallback; throw e; }
}
export function writeJson(p: string, v: unknown): void {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const tmp = p + '.tmp' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify(v, null, 2) + '\n');
  fs.renameSync(tmp, p); // atomic: the server and the agent both write identity.json
}
export function writeFile(p: string, s: string | Uint8Array): void {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
}

export class KotharError extends Error {
  constructor(msg: string, public code = 2) { super(msg); }
}
export function die(msg: string, code = 2): never { throw new KotharError(msg, code); }

export function need<T = any>(name: string): T {
  const req = createRequire(path.join(HOME, 'package.json'));
  try { return req(name) as T; }
  catch { return die(`dependency "${name}" is missing. Run: node "${CLI}" setup --refs`); }
}

export const round = (n: number, d = 3): number => Math.round(n * 10 ** d) / 10 ** d;
const RANK: Record<Level, number> = { pass: 0, info: 0, warn: 1, fail: 2 };
export const worst = (levels: Level[]): Level => levels.reduce<Level>((a, b) => (RANK[b] > RANK[a] ? b : a), 'pass');
export const levelOf = (findings: Finding[]): Level => worst(findings.map((f) => f.level));
export const fold = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function deepMerge(a: any, b: any): any {
  if (b === null || typeof b !== 'object' || Array.isArray(b)) return b;
  const out: any = a && typeof a === 'object' && !Array.isArray(a) ? { ...a } : {};
  for (const [k, v] of Object.entries(b)) out[k] = deepMerge(out[k], v);
  return out;
}
