// Runs every measurement over the workspace and writes audit.json.
import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJson, levelOf, round } from './util.js';
import { parseSvg, lint, lintAnimation } from './svg.js';
import { measure } from './measure.js';
import { query, siblings, describe, correlate, plainFontScore, LIMITS as SIM } from './similarity.js';
import { outlineChoice } from './fonts.js';
import { renderAlpha, threshold } from './raster.js';
import crypto from 'node:crypto';
import { CATEGORIES } from './identity.js';
const finish = (findings, metrics, nearest) => ({ level: levelOf(findings), findings, metrics, nearest });
function auditFile(file, kind, role) {
    if (!fs.existsSync(file))
        return { findings: [{ rule: 'file', level: 'fail', msg: `missing file ${path.basename(file)}` }], metrics: {}, src: null };
    const src = fs.readFileSync(file, 'utf8');
    let parsed;
    try {
        parsed = parseSvg(src);
    }
    catch (e) {
        return { findings: [{ rule: 'xml', level: 'fail', msg: `not valid SVG: ${e.message}` }], metrics: {}, src: null };
    }
    const l = lint(parsed, kind);
    if (l.findings.some((f) => f.rule === 'viewbox' || f.rule === 'empty'))
        return { findings: l.findings, metrics: l.stats, src: null };
    const m = measure(src, role);
    return { findings: [...l.findings, ...m.findings], metrics: { ...l.stats, ...m.metrics }, src };
}
export async function runAudit(ws, id) {
    const prev = readJson(path.join(ws.dir, 'audit.json'), null);
    const audit = { generated: new Date().toISOString(), concepts: {}, wordmarks: {}, set: [], similarityChecked: true };
    const forSiblings = [];
    for (const c of id.concepts) {
        const full = auditFile(ws.rel(c.mark), 'mark', c.compact ? 'full' : 'small');
        const findings = [...full.findings];
        const metrics = { ...full.metrics };
        let nearest;
        if (full.src) {
            const q = query(full.src);
            if (!q.checked)
                audit.similarityChecked = false;
            findings.push(...q.findings);
            nearest = q.matches;
            forSiblings.push({ id: c.id, src: full.src });
        }
        if (c.compact) {
            const small = auditFile(ws.rel(c.compact), 'mark', 'small');
            const sq = small.src ? query(small.src) : null;
            findings.push(...[...small.findings, ...(sq ? sq.findings.filter((f) => f.level !== 'pass') : [])].map((f) => ({ ...f, rule: 'compact-' + f.rule, msg: 'compact variant: ' + f.msg })));
            metrics.compact = small.metrics;
            if (small.src && full.src) {
                const a = describe(full.src), b = describe(small.src);
                if (a && b) {
                    const kin = round(Math.max(correlate(a.ink, b.ink), correlate(a.sil, b.sil)));
                    metrics.compactKinship = kin;
                    if (kin < 0.4)
                        findings.push({ rule: 'compact-kinship', level: 'warn', msg: `the compact variant no longer looks like the full mark (${kin}); simplify the same drawing instead of making a new one` });
                }
            }
        }
        if (!c.depicts?.length)
            findings.push({ rule: 'depicts', level: 'fail', msg: 'concept needs "depicts": the words a stranger should say when they see it (the judges are scored against them)' });
        audit.concepts[c.id] = finish(findings, metrics, nearest);
    }
    audit.set.push(...siblings(forSiblings));
    const tally = {};
    for (const c of id.concepts)
        tally[c.category] = (tally[c.category] || 0) + 1;
    const min = Math.floor((id.selection.count || id.logo.count) / 3);
    for (const k of CATEGORIES)
        if ((tally[k] || 0) < min && id.concepts.length)
            audit.set.push({ rule: 'split', level: 'fail', msg: `category "${k}" has ${tally[k] || 0} concept(s), needs at least ${min}` });
    // The plain font render of the name: reference for "is the drawn name more than a font?" and legibility of the font choice itself.
    const name = id.selection.name || '';
    const plain = name && id.selection.font && !id.markOnly ? await outlineChoice(name, id.selection.font) : null;
    if (plain) {
        const m = measure(plain, 'wordmark');
        audit.fontWordmark = finish(m.findings, m.metrics);
    }
    // Drawn names are usually capitals or all lower case, so the font is tried in each casing.
    const plains = [];
    if (plain && id.selection.font && id.wordmarks.length) {
        for (const v of new Set([name, name.toUpperCase(), name.toLowerCase()])) {
            const o = await outlineChoice(v, { ...id.selection.font, uppercase: false });
            if (o)
                plains.push(o);
        }
    }
    for (const w of id.wordmarks) {
        const r = auditFile(ws.rel(w.file), 'wordmark', 'wordmark');
        const findings = [...r.findings];
        const metrics = { ...r.metrics };
        if (r.src && plains.length) {
            const s = Math.max(...plains.map((x) => plainFontScore(r.src, x) ?? -1));
            metrics.plainFont = s;
            if (s !== null && s >= SIM.plainFont)
                findings.push({ rule: 'identity', level: 'warn', msg: `this is almost the name typed in ${id.selection.font?.family} (${s}); a drawn name must add something a font cannot: rearrange, stack, cut, flip or join letters, bring in a piece of the mark` });
            else if (s !== null)
                findings.push({ rule: 'identity', level: 'pass', msg: `distinct from the plain font render (${s}, flagged from ${SIM.plainFont})` });
        }
        else if (r.src)
            findings.push({ rule: 'identity', level: 'info', msg: 'not compared with the plain font (font file unavailable)' });
        audit.wordmarks[w.id] = finish(findings, metrics);
    }
    if (id.animation && fs.existsSync(ws.rel(id.animation))) {
        const src = fs.readFileSync(ws.rel(id.animation), 'utf8');
        const findings = [];
        try {
            const parsed = parseSvg(src);
            findings.push(...lint(parsed, 'animated').findings, ...lintAnimation(parsed));
            const chosen = id.concepts.find((c) => c.id === id.selection.concept);
            if (chosen && fs.existsSync(ws.rel(chosen.mark))) {
                // A renderer without CSS animation shows the resting state: it has to be the logo itself.
                const a = renderAlpha(src, 256), b = renderAlpha(fs.readFileSync(ws.rel(chosen.mark), 'utf8'), 256);
                if (a.w !== b.w || a.h !== b.h)
                    findings.push({ rule: 'anim-rest', level: 'fail', msg: 'the animated file has a different viewBox than the logo' });
                else {
                    const ma = threshold(a.a), mb = threshold(b.a);
                    let inter = 0, union = 0;
                    for (let i = 0; i < ma.length; i++) {
                        if (ma[i] && mb[i])
                            inter++;
                        if (ma[i] || mb[i])
                            union++;
                    }
                    const iou = union ? inter / union : 0;
                    if (iou < 0.98)
                        findings.push({ rule: 'anim-rest', level: 'fail', msg: `without animation the file must show the finished logo, but it matches only ${round(iou * 100)}%: put the final state in the attributes and animate *from* the hidden state` });
                }
            }
        }
        catch (e) {
            findings.push({ rule: 'xml', level: 'fail', msg: `not valid SVG: ${e.message}` });
        }
        if (!findings.length)
            findings.push({ rule: 'animation', level: 'pass', msg: 'CSS animation, honours reduced motion, rests on the finished logo' });
        audit.animation = finish(findings, {});
    }
    if (prev?.judges) {
        audit.judges = prev.judges;
        applyJudges(audit, id, ws);
    }
    writeJson(path.join(ws.dir, 'audit.json'), audit);
    return audit;
}
export function overall(a) {
    return levelOf([
        ...Object.values(a.concepts), ...Object.values(a.wordmarks), ...(a.animation ? [a.animation] : []),
    ].flatMap((r) => r.findings).concat(a.set));
}
export function printable(a) {
    const lines = [];
    const facts = (r) => {
        const m = r.metrics, n = r.nearest?.[0];
        return [
            m.minCleanSize !== undefined && `clean from ${m.compact?.minCleanSize ?? m.minCleanSize ?? '—'} px`,
            n && `nearest ${n.score} ${n.label} "${n.name}"`,
            m.plainFont !== undefined && m.plainFont !== null && `font-likeness ${m.plainFont}`,
        ].filter(Boolean).join(' · ');
    };
    const section = (title, items) => {
        if (!Object.keys(items).length)
            return;
        lines.push(`${title}: ${levelOf(Object.values(items).flatMap((r) => r.findings)).toUpperCase()}`);
        for (const [id, r] of Object.entries(items)) {
            const warns = r.findings.filter((f) => f.level === 'warn').length, fails = r.findings.filter((f) => f.level === 'fail').length;
            lines.push(`  ${r.level.toUpperCase().padEnd(5)} ${id}  (${fails} fail, ${warns} warn)  ${facts(r)}`);
            for (const f of r.findings)
                if (f.level !== 'pass')
                    lines.push(`        ${f.level}: [${f.rule}] ${f.msg}`);
        }
    };
    section('CONCEPTS', a.concepts);
    section('WORDMARKS', a.wordmarks);
    if (a.animation)
        section('ANIMATION', { animation: a.animation });
    for (const f of a.set)
        lines.push(`  ${f.level.toUpperCase().padEnd(5)} set: [${f.rule}] ${f.msg}`);
    if (!a.similarityChecked)
        lines.push('  WARN  similarity to known logos/icons was NOT checked (run "kothar setup --refs")');
    lines.push(`OVERALL: ${overall(a).toUpperCase()}`);
    return lines.join('\n');
}
/** Fold the latest judge round into the findings. A drawing changed after the judges saw it has not been judged. */
export function applyJudges(audit, id, ws) {
    const J = audit.judges;
    if (!J)
        return;
    const seenAt = Date.parse(J.at);
    // Compared by content, so rewriting a file with the same drawing does not cost a new round.
    const newer = (files) => files.some((f) => {
        if (!f)
            return false;
        try {
            if (J.hashes)
                return J.hashes[f] !== crypto.createHash('sha1').update(fs.readFileSync(ws.rel(f))).digest('hex');
            return fs.statSync(ws.rel(f)).mtimeMs > seenAt;
        }
        catch {
            return true;
        }
    });
    const fold = (results, key, files) => {
        const r = results[key];
        if (!r)
            return;
        r.findings = r.findings.filter((f) => !f.rule.startsWith('judge-'));
        const it = J.items[key];
        if (!it)
            r.findings.push({ rule: 'judge-missing', level: 'fail', msg: 'the blind judges have not seen this one: run a new judge round' });
        else if (newer(files))
            r.findings.push({ rule: 'judge-stale', level: 'fail', msg: 'redrawn after the judges saw it: run a new judge round ("kothar judge pack")' });
        else
            r.findings.push(...(it.findings || []));
        r.level = levelOf(r.findings);
    };
    for (const c of id.concepts)
        fold(audit.concepts, c.id, [c.mark, c.compact]);
    for (const w of id.wordmarks)
        fold(audit.wordmarks, w.id, [w.file]);
    audit.set = [...audit.set.filter((f) => f.rule !== 'judge-count'), ...(J.set || [])];
}
