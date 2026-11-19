// The report: one page, served on localhost while the session works, and exported as a static file at the end.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { ASSETS, CLI, HOME, readJson, writeJson } from './util.js';
import { inline } from './svg.js';
import { tighten } from './raster.js';
import { WARNING, freeList } from './fonts.js';
import { exportFinal } from './exporter.js';
import { deliver } from './deliver.js';
const mtime = (f) => { try {
    return fs.statSync(f).mtimeMs;
}
catch {
    return 0;
} };
export const revOf = (ws) => Math.round(Math.max(mtime(ws.file), mtime(path.join(ws.dir, 'audit.json')), mtime(path.join(ws.dir, 'final', 'manifest.json'))));
const svgFor = (ws, rel, prefix) => {
    try {
        return inline(tighten(fs.readFileSync(ws.rel(rel), 'utf8'), 0.02).src, prefix);
    }
    catch {
        return null;
    }
};
const brief = (r) => ({ level: r?.level || 'info', findings: (r?.findings || []).filter((f) => f.level !== 'pass') });
/** Everything the page needs, in one object. Also embedded in the static report. */
export function buildState(ws, opts = {}) {
    const id = ws.load();
    const audit = readJson(path.join(ws.dir, 'audit.json'), null);
    const judges = (audit?.judges?.items || {});
    const manifest = readJson(path.join(ws.dir, 'final', 'manifest.json'), null);
    const concepts = id.concepts.map((c) => {
        const a = audit?.concepts[c.id];
        const m = (a?.metrics || {});
        const near = a?.nearest?.[0];
        return {
            id: c.id, category: c.category, title: c.title, rationale: c.rationale,
            svg: svgFor(ws, c.mark, c.id + '-'), small: svgFor(ws, c.compact || c.mark, c.id + 's-'), hasCompact: !!c.compact,
            audit: { ...brief(a), minClean: (c.compact ? m.compact?.minCleanSize : m.minCleanSize) ?? null, smallest: (c.compact ? m.compact?.smallestElementPx : m.smallestElementPx) ?? null, nearest: near ? { what: `${near.label} «${near.name}»`, score: near.score } : null },
            judges: judges[c.id] || null,
        };
    });
    const wordmarks = id.wordmarks.map((w) => {
        const a = audit?.wordmarks[w.id];
        const m = (a?.metrics || {});
        return { id: w.id, title: w.title, rationale: w.rationale, svg: svgFor(ws, w.file, w.id + '-'), audit: { ...brief(a), minClean: m.minCleanSize ?? null, plainFont: m.plainFont ?? null }, judges: judges[w.id] || null };
    });
    const final = manifest && id.flow.status === 'final'
        ? { lockup: inline(manifest.lockup, 'fl-'), mark: inline(manifest.mark, 'fm-'), small: inline(manifest.small, 'fs-'), animated: inline(manifest.animated || manifest.mark, 'fa-'), files: manifest.files, liveText: manifest.liveText, generated: manifest.generated, fontJudges: judges['@font'] || null, animation: brief(audit?.animation) }
        : null;
    return {
        rev: revOf(ws), static: !!opts.static, locale: id.locale, strings: stringsFor(id.locale), product: id.product, flow: id.flow, selection: id.selection,
        markOnly: !!id.markOnly, names: id.naming.candidates, nameGiven: !!id.naming.given, categories: id.naming.categories, takenCount: id.naming.taken.length,
        fonts: id.fonts.options, fontWarning: WARNING, freeFonts: freeList().map((f) => f.family),
        concepts, wordmarks, final, delivered: id.delivered || null, keptFonts: id.keptFonts || [], keptConcepts: id.keptConcepts || [], keptWordmarks: id.keptWordmarks || [],
        similarityChecked: audit ? audit.similarityChecked : null, judgeCount: audit?.judges?.judges ?? 0,
    };
}
// Kothar's own mark as the tab icon, so the page reads as this tool's report (same file as assets/logo-color/favicon.svg).
const K_FAVICON = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="6.031 6.031 51.937 51.937" fill="#0B1622"><path d="M8 8h48v14H22v34H8z"/><circle cx="43" cy="43" r="12" fill="#0B7FD0"/></svg>');
/** The whole page as one self-contained HTML document. `state` null = live mode (the page polls the server). */
export function page(state, title) {
    const css = fs.readFileSync(path.join(ASSETS, 'app.css'), 'utf8');
    const js = fs.readFileSync(path.join(ASSETS, 'app.js'), 'utf8');
    const data = JSON.stringify(state).replace(/</g, '\\u003c');
    const safe = title.replace(/[<&]/g, '');
    return `<!doctype html>
<html lang="${state?.locale || 'en'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safe}</title>
<link rel="icon" type="image/svg+xml" href="${K_FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">
<style>${css}</style>
</head>
<body>
<div id="app"></div>
<script>window.__KOTHAR__=${data};</script>
<script type="module">${js}</script>
</body>
</html>
`;
}
/** Wording for a locale: English, overlaid by the built-in language or by a translation saved on this machine. */
export function stringsFor(locale) {
    const all = readJson(path.join(ASSETS, 'strings.json'));
    const base = (locale || 'en').toLowerCase().split(/[-_]/)[0];
    if (all[base])
        return { ...all.en, ...all[base] };
    return { ...all.en, ...(readJson(path.join(HOME, 'strings', `${base}.json`), null) || {}) };
}
const fill = (s, n) => s.replace('{n}', String(n ?? ''));
function working(T, key, n, only) {
    const ids = only || Object.keys(T).filter((k) => k.startsWith(`flow.${key}.t`)).sort();
    return { label: T[`flow.${key}.label`], tasks: ids.map((k, i) => ({ text: fill(T[k], n), state: i === 0 ? 'doing' : 'todo' })) };
}
/** Apply a confirmed selection from the page: store it, hand it to the waiting session, lock the page. */
export async function confirm(ws, step, data) {
    const id = ws.load();
    if (step === 3 && data.deliver) {
        // The user is done: write the assets into the project and let the session stop listening.
        if (id.flow.status !== 'final')
            return { ok: false, error: 'the assets are generated from the final report' };
        const r = deliver(ws, id);
        id.delivered = { at: new Date().toISOString(), dir: r.relative, files: r.files.length };
        delete id.inbox;
        ws.save(id);
        return { ok: true, close: true };
    }
    if (step === 3 && data.restart) {
        // Finished, but the user wants another go: reopen step 01 with everything that already exists still on the table.
        if (id.flow.status !== 'final')
            return { ok: false, error: 'the process can only be restarted from the final report' };
        restart(id);
        delete id.delivered;
        ws.save(id);
        return { ok: true };
    }
    if (id.flow.status !== 'choose' || id.flow.step !== step)
        return { ok: false, error: 'this step is not open for selection' };
    const pick = {};
    if (step === 1 && data.regenerate === 'fonts') {
        // The offered fonts did not convince: ask the session for others, keeping the ones marked.
        const keep = (Array.isArray(data.keep) ? data.keep : []).filter((k) => id.fonts.options.some((o) => o.family === k));
        const hint = String(data.hint || '').slice(0, 300).trim();
        id.keptFonts = keep;
        id.inbox = { step, data: { regenerate: 'fonts', hint, keep }, at: new Date().toISOString() };
        const w = working(stringsFor(id.locale), 'regenF', undefined, ['flow.regenF.t1']);
        id.flow = { ...id.flow, step: 0, status: 'working', label: w.label, tasks: w.tasks };
        ws.save(id);
        return { ok: true };
    }
    if (step === 1) {
        if (!id.naming.candidates.some((c) => c.name === data.name))
            return { ok: false, error: 'unknown name' };
        const f = data.font;
        if (id.markOnly) { /* no lettering to choose */ }
        else if (!f?.family)
            return { ok: false, error: 'no font chosen' };
        const offered = id.fonts.options.find((o) => o.family === f?.family);
        if (id.markOnly) { /* nothing */ }
        else if (offered)
            pick.font = { ...offered };
        else if (f && f.licenseConfirmedByUser === true)
            pick.font = { family: String(f.family).slice(0, 80), weight: Number(f.weight) || 700, custom: true, free: false, licenseConfirmedByUser: true, license: 'licence declared by the user' };
        else
            return { ok: false, error: 'a font that is not in the free list needs the licence confirmation' };
        const count = Math.floor(Number(data.count));
        if (!(count >= 3 && count <= 24))
            return { ok: false, error: 'the number of logos must be between 3 and 24' };
        Object.assign(pick, { name: data.name, svgWordmark: !id.markOnly && !!data.svgWordmark, count });
        id.logo.count = count;
    }
    else if (step === 2 && (data.regenerate === 'logos' || data.regenerate === 'names')) {
        // The user wants other logos (or other drawn names) and marked the ones to keep.
        const logos = data.regenerate === 'logos';
        const pool = logos ? id.concepts : id.wordmarks;
        const keep = (Array.isArray(data.keep) ? data.keep : []).filter((k) => pool.some((x) => x.id === k));
        const hint = String(data.hint || '').slice(0, 300).trim();
        if (logos)
            id.keptConcepts = keep;
        else
            id.keptWordmarks = keep;
        id.inbox = { step, data: { regenerate: data.regenerate, hint, keep }, at: new Date().toISOString() };
        const T = stringsFor(id.locale), n = pool.length - keep.length;
        const w = working(T, logos ? 'regenL' : 'regenN', n, [logos ? 'flow.regenL.t1' : 'flow.regenN.t1', 'flow.1.t3', 'flow.1.t4']);
        id.flow = { ...id.flow, step: 1, status: 'working', label: w.label, tasks: w.tasks };
        ws.save(id);
        return { ok: true };
    }
    else if (step === 2) {
        if (!id.concepts.some((c) => c.id === data.concept))
            return { ok: false, error: 'unknown logo' };
        if (data.wordmark && !id.wordmarks.some((w) => w.id === data.wordmark))
            return { ok: false, error: 'unknown drawn name' };
        Object.assign(pick, { concept: data.concept, wordmark: data.wordmark || null });
    }
    else
        return { ok: false, error: 'nothing to confirm at this step' };
    const before = { ...id.selection };
    id.selection = { ...id.selection, ...pick };
    if (id.replay) {
        // A second pass: while the user keeps choosing among what already exists, nothing has to be made, so the page moves on by itself.
        const reuse1 = step === 1 && before.name === pick.name && id.concepts.length === pick.count && (!pick.svgWordmark || id.wordmarks.length >= id.concepts.length);
        if (reuse1) {
            id.flow = { step: 2, status: 'choose', overrides: id.flow.overrides };
            delete id.inbox;
            ws.save(id);
            return { ok: true };
        }
        // Nothing left to make: the identity is rebuilt without the session (another logo gets the generated animation).
        if (step === 2) {
            await exportFinal(ws, id);
            id.flow = { step: 3, status: 'final', overrides: id.flow.overrides };
            delete id.inbox;
            ws.save(id);
            writeStatic(ws, id);
            return { ok: true };
        }
    }
    id.inbox = { step, data: pick, at: new Date().toISOString() };
    const T = stringsFor(id.locale);
    // Step 2 confirmed: what is left is the identity itself. (Its wording keeps the key it had when colour was step 3, so saved translations still fit.)
    const w = working(T, step === 2 ? '3' : String(step), id.selection.count, step === 1 && !id.selection.svgWordmark ? ['flow.1.t1', 'flow.1.t3', 'flow.1.t4'] : undefined);
    id.flow = { ...id.flow, step, status: 'working', label: w.label, tasks: w.tasks };
    ws.save(id);
    return { ok: true };
}
/** Back to step 01 with every earlier option and choice kept. */
export function restart(id) {
    id.replay = true;
    id.animationFor ??= id.selection.concept;
    id.flow = { step: 1, status: 'choose', overrides: id.flow.overrides };
    delete id.inbox;
}
const TYPES = { '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json', '.html': 'text/html; charset=utf-8' };
export function serve(ws, port) {
    let cache = null;
    const server = http.createServer((req, res) => {
        const url = new URL(req.url || '/', 'http://localhost');
        const send = (code, body, type = 'application/json') => { res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' }); res.end(body); };
        try {
            if (req.method === 'GET' && url.pathname === '/')
                return send(200, page(null, 'kothar'), TYPES['.html']);
            if (req.method === 'GET' && url.pathname === '/api/state') {
                const rev = revOf(ws);
                if (Number(url.searchParams.get('rev')) === rev)
                    return send(200, '{"unchanged":true}');
                if (!cache || cache.rev !== rev)
                    cache = { rev, body: JSON.stringify(buildState(ws)) };
                return send(200, cache.body);
            }
            if (req.method === 'POST' && url.pathname === '/api/select') {
                // Only the page itself may confirm: a cross-site form post cannot set this content type without a preflight.
                if (!/^application\/json/.test(req.headers['content-type'] || ''))
                    return send(415, '{"ok":false,"error":"json only"}');
                let body = '';
                req.on('data', (c) => { body += c; if (body.length > 20000)
                    req.destroy(); });
                req.on('end', () => {
                    const fail = (e) => { send(400, JSON.stringify({ ok: false, error: e.message })); };
                    try {
                        const j = JSON.parse(body);
                        confirm(ws, Number(j.step), j.data || {}).then((r) => {
                            send(r.ok ? 200 : 400, JSON.stringify(r));
                            // Handed over: give the page a moment to read the final state, then stop serving.
                            if (r.close)
                                setTimeout(() => { fs.rmSync(path.join(ws.dir, 'server.json'), { force: true }); process.exit(0); }, 6000);
                        }, fail);
                    }
                    catch (e) {
                        fail(e);
                    }
                });
                return;
            }
            if (req.method === 'GET' && url.pathname.startsWith('/final/')) {
                const root = path.join(ws.dir, 'final');
                const file = path.resolve(root, decodeURIComponent(url.pathname.slice(7)));
                if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile())
                    return send(404, 'not found', 'text/plain');
                return send(200, fs.readFileSync(file), TYPES[path.extname(file)] || 'application/octet-stream');
            }
            send(404, 'not found', 'text/plain');
        }
        catch (e) {
            send(500, JSON.stringify({ error: e.message }));
        }
    });
    return new Promise((done, fail) => {
        let tries = 0;
        server.on('error', (e) => { if (e.code === 'EADDRINUSE' && tries++ < 20)
            server.listen(++port, '127.0.0.1');
        else
            fail(e); });
        server.on('listening', () => { writeJson(path.join(ws.dir, 'server.json'), { port, pid: process.pid, url: `http://localhost:${port}` }); done(port); });
        server.listen(port, '127.0.0.1');
    });
}
const alive = (pid) => { try {
    process.kill(pid, 0);
    return true;
}
catch {
    return false;
} };
export function running(ws) {
    const s = readJson(path.join(ws.dir, 'server.json'), null);
    return s && alive(s.pid) ? s : null;
}
/** Start the server as its own process so the session can keep working, and open the browser. */
export async function open(ws, opts) {
    let s = running(ws), started = false;
    if (!s) {
        fs.rmSync(path.join(ws.dir, 'server.json'), { force: true });
        spawn(process.execPath, [CLI, 'serve', '--dir', ws.dir, '--port', String(opts.port)], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
        for (let i = 0; i < 50 && !(s = running(ws)); i++)
            await new Promise((r) => setTimeout(r, 100));
        if (!s)
            throw new Error('the report server did not start; run "kothar serve" in the foreground to see why');
        started = true;
    }
    if (opts.browser) {
        try {
            execSync(process.platform === 'win32' ? `start "" "${s.url}"` : process.platform === 'darwin' ? `open "${s.url}"` : `xdg-open "${s.url}"`, { stdio: 'ignore' });
        }
        catch { /* no browser on this machine: the URL is printed for the user */ }
    }
    return { url: s.url, started };
}
export function stop(ws) {
    const s = running(ws);
    if (s) {
        try {
            process.kill(s.pid);
        }
        catch { /* already gone */ }
    }
    fs.rmSync(path.join(ws.dir, 'server.json'), { force: true });
    return !!s;
}
export function writeStatic(ws, id) {
    const file = path.join(ws.dir, 'report.html');
    fs.writeFileSync(file, page(buildState(ws, { static: true }), `${id.selection.name || 'kothar'} · logo identity`));
    return file;
}
