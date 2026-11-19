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
export const DEPS = { '@resvg/resvg-js': '^2.6.2', 'opentype.js': '^1.3.4' };
export function parseArgs(argv) {
    const out = { _: [] };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a.startsWith('--')) {
            const eq = a.indexOf('=');
            if (eq > 0)
                out[a.slice(2, eq)] = a.slice(eq + 1);
            else if (i + 1 < argv.length && !argv[i + 1].startsWith('--'))
                out[a.slice(2)] = argv[++i];
            else
                out[a.slice(2)] = true;
        }
        else
            out._.push(a);
    }
    return out;
}
export const str = (v, fallback = '') => (typeof v === 'string' ? v : fallback);
export function readJson(p, fallback) {
    try {
        return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));
    }
    catch (e) {
        if (fallback !== undefined)
            return fallback;
        throw e;
    }
}
export function writeJson(p, v) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    const tmp = p + '.tmp' + process.pid;
    fs.writeFileSync(tmp, JSON.stringify(v, null, 2) + '\n');
    fs.renameSync(tmp, p); // atomic: the server and the agent both write identity.json
}
export function writeFile(p, s) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, s);
}
export class KotharError extends Error {
    code;
    constructor(msg, code = 2) {
        super(msg);
        this.code = code;
    }
}
export function die(msg, code = 2) { throw new KotharError(msg, code); }
export function need(name) {
    const req = createRequire(path.join(HOME, 'package.json'));
    try {
        return req(name);
    }
    catch {
        return die(`dependency "${name}" is missing. Run: node "${CLI}" setup --refs`);
    }
}
export const round = (n, d = 3) => Math.round(n * 10 ** d) / 10 ** d;
const RANK = { pass: 0, info: 0, warn: 1, fail: 2 };
export const worst = (levels) => levels.reduce((a, b) => (RANK[b] > RANK[a] ? b : a), 'pass');
export const levelOf = (findings) => worst(findings.map((f) => f.level));
export const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export function deepMerge(a, b) {
    if (b === null || typeof b !== 'object' || Array.isArray(b))
        return b;
    const out = a && typeof a === 'object' && !Array.isArray(a) ? { ...a } : {};
    for (const [k, v] of Object.entries(b))
        out[k] = deepMerge(out[k], v);
    return out;
}
