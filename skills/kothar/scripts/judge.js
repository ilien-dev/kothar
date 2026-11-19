// Blind judges: anonymised packets for agents with no context, and scoring of what they answer.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { ASSETS, readJson, writeJson, writeFile, fold, round, die } from './util.js';
import { colorize } from './svg.js';
import { render, tighten, pixelPreview } from './raster.js';
import { outlineChoice } from './fonts.js';
import { applyJudges } from './audit.js';
// Words that carry no information about *what* something looks like.
const STOP = new Set('also with like style styled similar generic vaguely nothing specific exact match brand logo icon icons none from that this plain kind sort very maybe could reads read looks letter letra shape symbol sans serif bold heavy thick simple common app apps the and una uno con como algo'.split(' '));
const NONE = /^(|-|—|none|nothing|no|n\/a|na|nada|ninguno|ninguna)$/i;
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? (s[(s.length - 1) >> 1] + s[s.length >> 1]) / 2 : 0; };
const letters = (s) => fold(s).replace(/[^a-z0-9]/g, '');
const tokens = (s) => fold(String(s || '')).split(/[^a-z0-9]+/).filter(Boolean);
const sha = (file) => crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex');
const roundsDir = (ws) => path.join(ws.dir, 'judges');
function rounds(ws) {
    try {
        return fs.readdirSync(roundsDir(ws)).map((d) => Number(/^round-(\d+)$/.exec(d)?.[1] || 0)).filter(Boolean).sort((a, b) => a - b);
    }
    catch {
        return [];
    }
}
/** Does a judge's description name the thing? Matched by whole words, so "a T" matches "letter t" and "mast" does not match "master". */
export function names(description, depicts) {
    const said = tokens(description);
    return depicts.some((d) => {
        const all = tokens(d);
        const core = all.filter((w) => !STOP.has(w) && !['a', 'la', 'el', 'of', 'de'].includes(w));
        const need = core.length ? core : all;
        // Longer words also match by stem ("knots" for "knot", "nudos" for "nudo").
        return need.length > 0 && need.every((w) => said.some((s) => s === w || (w.length > 3 && s.length > 3 && (s.startsWith(w) || w.startsWith(s)))));
    });
}
/** Build a packet a stranger can judge: random codes, no names, no rationale, in a folder that says nothing about the project. */
export async function pack(ws, id) {
    const n = (rounds(ws).pop() || 0) + 1;
    const dir = path.join(roundsDir(ws), `round-${n}`);
    // Outside the project on purpose: a judge that wanders up from the packet finds nothing related to it.
    const packet = fs.mkdtempSync(path.join(os.tmpdir(), 'review-'));
    fs.mkdirSync(path.join(dir, 'answers'), { recursive: true });
    const key = {};
    const hashes = {};
    const code = () => { let c; do {
        c = crypto.randomBytes(2).toString('hex').toUpperCase();
    } while (key[c]); return c; };
    const items = [];
    const track = (rel) => { if (rel)
        hashes[rel] = sha(ws.rel(rel)); };
    for (const c of id.concepts) {
        const k = code();
        key[k] = { kind: 'mark', id: c.id };
        items.push({ code: k, kind: 'mark' });
        track(c.mark);
        track(c.compact);
        const full = fs.readFileSync(ws.rel(c.mark), 'utf8');
        const small = c.compact ? fs.readFileSync(ws.rel(c.compact), 'utf8') : full;
        writeFile(path.join(packet, `${k}-small.png`), pixelPreview(colorize(tighten(small, 0.06).src, { ink: '#000000' }), 16, 12));
        writeFile(path.join(packet, `${k}-large.png`), render(colorize(tighten(full, 0.12).src, { ink: '#000000' }), { width: 512, background: '#ffffff' }).png());
        writeFile(path.join(packet, `${k}-dark.png`), render(colorize(tighten(full, 0.12).src, { ink: '#ffffff' }), { width: 256, background: '#000000' }).png());
    }
    const words = id.wordmarks.map((w) => { track(w.file); return { id: w.id, src: fs.readFileSync(ws.rel(w.file), 'utf8') }; });
    // The plain font goes in as a baseline only when there are drawn names to compare it with.
    if (words.length && id.selection.name && id.selection.font) {
        const plain = await outlineChoice(id.selection.name, id.selection.font);
        if (plain)
            words.push({ id: '@font', src: plain });
    }
    for (const w of words) {
        const k = code();
        key[k] = { kind: 'wordmark', id: w.id };
        items.push({ code: k, kind: 'wordmark' });
        const t = tighten(w.src, 0.08).src;
        writeFile(path.join(packet, `${k}-small.png`), pixelPreview(colorize(t, { ink: '#000000' }), 22, 6, '#ffffff', 'height'));
        writeFile(path.join(packet, `${k}-large.png`), render(colorize(t, { ink: '#000000' }), { width: 900, background: '#ffffff' }).png());
    }
    items.sort((a, b) => (a.code < b.code ? -1 : 1)); // codes are random, so this is a shuffle that hides the authoring order
    const list = items.map((i) => `- \`${i.code}\` (${i.kind}): ${i.code}-small.png, ${i.code}-large.png${i.kind === 'mark' ? `, ${i.code}-dark.png` : ''}`).join('\n');
    const template = { judge: 'j1', items: Object.fromEntries(items.map((i) => [i.code, i.kind === 'mark'
                ? { small_sees: '', large_sees: '', reminds_of: '', legibility: 0, distinctiveness: 0, memorability: 0 }
                : { small_reads: '', large_reads: '', legibility: 0, distinctiveness: 0 }])) };
    writeFile(path.join(packet, 'INSTRUCTIONS.md'), fs.readFileSync(path.join(ASSETS, 'judge-instructions.md'), 'utf8').replace('{{ITEMS}}', list));
    writeJson(path.join(packet, 'answers.template.json'), template);
    const info = { packet, key, hashes };
    writeJson(path.join(dir, 'round.json'), info);
    const prompt = (j) => `Read the file INSTRUCTIONS.md inside this folder and do exactly what it says, using only the files in that folder: ${packet}\nDo not read any file outside that folder, and do not open any answer-*.json file. Save your filled JSON as answer-j${j}.json inside that folder, with "judge": "j${j}". Your final reply is just the word: done`;
    return {
        round: n, packet, items: items.length,
        prompts: [1, 2, 3].map(prompt),
        next: 'Start at least 3 fresh agents with no context, in parallel, each with exactly one of the prompts above and nothing else. When they finish, run "kothar judge score" (it collects answer-j*.json from the packet).',
    };
}
function collect(ws, n) {
    const dir = path.join(roundsDir(ws), `round-${n}`);
    const info = readJson(path.join(dir, 'round.json'));
    // Judges write into the packet; keep a copy with the project so the round can be re-scored later.
    try {
        for (const f of fs.readdirSync(info.packet)) {
            const m = /^answer-(.+\.json)$/.exec(f);
            if (m)
                fs.copyFileSync(path.join(info.packet, f), path.join(dir, 'answers', m[1]));
        }
    }
    catch { /* packet folder already cleaned up */ }
    const answers = [];
    for (const f of fs.readdirSync(path.join(dir, 'answers')).filter((x) => x.endsWith('.json'))) {
        try {
            answers.push(JSON.parse(fs.readFileSync(path.join(dir, 'answers', f), 'utf8').replace(/^﻿/, '').replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, '')));
        }
        catch (e) {
            die(`${f} is not valid JSON (${e.message}); fix the file and score again`);
        }
    }
    return { info, answers };
}
/** Score the judges' answers against the key and fold the verdicts into audit.json. */
export function score(ws, id, roundArg) {
    const all = rounds(ws);
    if (!all.length)
        die('no judge round found: run "kothar judge pack" first');
    // Latest round that has answers: a pack made too early and never judged is skipped.
    const n = roundArg || [...all].reverse().find((r) => collect(ws, r).answers.length) || all[all.length - 1];
    const { info, answers } = collect(ws, n);
    if (!answers.length)
        die(`no answers for round ${n}: the judges save answer-j<N>.json in ${info.packet}`);
    const name = letters(id.selection.name || '');
    const auditFile = path.join(ws.dir, 'audit.json');
    const audit = readJson(auditFile, null) || die('no audit.json: run "kothar audit" first');
    const items = {};
    for (const [code, k] of Object.entries(info.key)) {
        const got = answers.map((a) => a.items?.[code]).filter(Boolean);
        const findings = [];
        if (k.kind === 'mark') {
            const concept = id.concepts.find((c) => c.id === k.id);
            const depicts = concept?.depicts || [];
            const small = got.filter((g) => names(g.small_sees, depicts)).length, large = got.filter((g) => names(g.large_sees, depicts)).length;
            const reminds = got.map((g) => String(g.reminds_of || '').trim()).filter((r) => !NONE.test(r));
            // Judges word the same lookalike differently, so agreement is counted on shared words. Words that
            // name the intended subject do not count: recognising a hammer in a hammer logo is success, not a clash.
            const subject = depicts.flatMap(tokens);
            const isSubject = (w) => subject.some((s) => s === w || (s.length > 3 && (s.startsWith(w) || w.startsWith(s))));
            const tally = {};
            for (const r of reminds)
                for (const w of new Set(tokens(r).filter((x) => x.length > 3 && !STOP.has(x) && !isSubject(x))))
                    tally[w] = (tally[w] || 0) + 1;
            const repeated = got.length >= 2 ? Object.entries(tally).filter(([, c]) => c >= 2 && c * 2 > got.length).map(([r]) => r) : [];
            const res = {
                judges: got.length, recognisedSmall: small, recognisedLarge: large,
                legibility: median(got.map((g) => Number(g.legibility) || 0)), distinctiveness: median(got.map((g) => Number(g.distinctiveness) || 0)), memorability: median(got.map((g) => Number(g.memorability) || 0)),
                sawSmall: got.map((g) => g.small_sees), sawLarge: got.map((g) => g.large_sees), remindsOf: reminds,
            };
            if (large * 2 < got.length)
                findings.push({ rule: 'judge-recognition', level: 'warn', msg: `only ${large}/${got.length} judges saw what it is meant to depict (${depicts.join(', ')}); they saw: ${res.sawLarge.join(' | ')}` });
            else if (small * 2 < got.length)
                findings.push({ rule: 'judge-recognition-small', level: 'warn', msg: `recognised large (${large}/${got.length}) but at 16 px only ${small}/${got.length}; at small size they saw: ${res.sawSmall.join(' | ')}` });
            else
                findings.push({ rule: 'judge-recognition', level: 'pass', msg: `${large}/${got.length} judges recognised it large, ${small}/${got.length} at 16 px` });
            // A shared association is a problem when the judges also find the mark generic; otherwise it is a note.
            if (repeated.length)
                findings.push({
                    rule: 'judge-lookalike', level: res.distinctiveness <= 3 ? 'warn' : 'info',
                    msg: `judges were reminded of the same thing (${repeated.join(', ')}) and rate distinctiveness ${res.distinctiveness}/5. They said: ${reminds.join(' | ')}.` + (res.distinctiveness <= 3 ? ' If that is an existing brand or a stock icon, change what makes it look like that.' : ' Rated distinctive anyway: no redraw needed.'),
                });
            if (res.legibility && res.legibility < 3)
                findings.push({ rule: 'judge-legibility', level: 'warn', msg: `judges rate legibility ${res.legibility}/5 (the small image is the compact variant when there is one)` });
            items[k.id] = { ...res, findings };
        }
        else {
            const reads = (field) => got.filter((g) => letters(String(g[field] || '')) === name).length;
            const large = reads('large_reads'), small = reads('small_reads');
            const res = {
                judges: got.length, readLarge: large, readSmall: small,
                readRate: got.length ? round(large / got.length, 2) : 0,
                legibility: median(got.map((g) => Number(g.legibility) || 0)), distinctiveness: median(got.map((g) => Number(g.distinctiveness) || 0)),
                theyRead: got.map((g) => g.large_reads), theyReadSmall: got.map((g) => g.small_reads),
            };
            if (large * 3 < got.length * 2)
                findings.push({ rule: 'judge-read', level: 'fail', msg: `only ${large}/${got.length} judges read the name; they read: ${res.theyRead.join(' | ')}. Fix the letters they got wrong and keep the idea` });
            else if (large < got.length)
                findings.push({ rule: 'judge-read', level: 'warn', msg: `${large}/${got.length} judges read the name; the others read: ${res.theyRead.join(' | ')}` });
            else if (small * 3 < got.length * 2)
                findings.push({ rule: 'judge-read-small', level: 'warn', msg: `everyone reads it large, but at 22 px tall only ${small}/${got.length}: ${res.theyReadSmall.join(' | ')}` });
            else
                findings.push({ rule: 'judge-read', level: 'pass', msg: `${large}/${got.length} judges read the name (${small}/${got.length} at 22 px tall); upper/lower case is not counted` });
            items[k.id] = { ...res, findings };
        }
    }
    const set = answers.length < 3 ? [{ rule: 'judge-count', level: 'warn', msg: `${answers.length} judge(s) answered; three or more make the verdict trustworthy` }] : [];
    audit.judges = { round: n, judges: answers.length, at: new Date().toISOString(), items, set, hashes: info.hashes };
    applyJudges(audit, id, ws);
    writeJson(auditFile, audit);
    return audit.judges;
}
