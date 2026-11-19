#!/usr/bin/env node
// kothar: measured product naming and logo identity. One entry point, many small commands.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { parseArgs, str, die, readJson, writeJson, deepMerge, HOME, DEPS, ASSETS, KotharError, type Args } from './util.js';
import { workspace, blank, split, gate, type Identity, type Task } from './identity.js';
import { loadPrefs, savePrefs, takenNames, measureName, online, summarise } from './names.js';
import { checkFont, freeList, outlineChoice, WARNING } from './fonts.js';
import { buildIndex, loadIndex } from './similarity.js';
import { runAudit, printable, overall } from './audit.js';
import { pack, score } from './judge.js';
import { exportFinal, baselineAnimation } from './exporter.js';
import { parseSvg, lint, colorize } from './svg.js';
import { measure, type Role } from './measure.js';
import { query } from './similarity.js';
import { render, tighten, pixelPreview } from './raster.js';
import { serve, open, stop, running, writeStatic, restart } from './server.js';
import { deliver } from './deliver.js';
import { data as traitData } from './traits.js';
import { nextFonts, pick as pickFonts, rankClasses } from './typography.js';
import { fold } from './util.js';

const print = (v: unknown): void => { console.log(typeof v === 'string' ? v : JSON.stringify(v, null, 2)); };
const jsonArg = (args: Args): any => {
  if (args.file) return readJson(str(args.file));
  if (args.json) { try { return JSON.parse(str(args.json)); } catch (e) { die(`--json is not valid JSON (${(e as Error).message}); on Windows shells prefer --file`); } }
  return die('pass --file <patch.json> or --json \'{...}\'');
};

function depsOk(): boolean {
  const req = createRequire(path.join(HOME, 'package.json'));
  return Object.keys(DEPS).every((d) => { try { req.resolve(d); return true; } catch { return false; } });
}
const has = (bin: string): boolean => { try { execSync(`${bin} --version`, { stdio: 'ignore' }); return true; } catch { return false; } };

const COMMANDS: Record<string, { help: string; run: (a: Args) => Promise<void> | void }> = {
  setup: {
    help: 'install dependencies into ~/.kothar; --refs also builds the brand/icon/emoji similarity index',
    run: (a) => {
      fs.mkdirSync(HOME, { recursive: true });
      if (!depsOk() || a.force) {
        writeJson(path.join(HOME, 'package.json'), { name: 'kothar-home', private: true, dependencies: DEPS });
        process.stderr.write(`installing ${Object.keys(DEPS).join(', ')} into ${HOME} ...\n`);
        execSync('npm install --no-audit --no-fund --loglevel=error', { cwd: HOME, stdio: ['ignore', 'ignore', 'inherit'] });
      }
      if (a.refs && (!loadIndex() || a.force)) buildIndex({ keep: !!a.keep });
      return COMMANDS.doctor.run(a);
    },
  },
  doctor: {
    help: 'report what is installed and what is missing',
    run: () => {
      const idx = loadIndex(), deps = depsOk();
      print({
        home: HOME, node: process.version, dependencies: deps,
        referenceIndex: idx ? { shapes: idx.entries.length, built: idx.built } : null,
        gh: has('gh'),
        next: !deps ? 'run: kothar setup --refs' : !idx ? 'run: kothar setup --refs (similarity to known logos is not checked until then)' : 'ready',
      });
    },
  },
  prefs: {
    help: 'prefs | prefs save --file prefs.json: naming preferences remembered across projects',
    run: (a) => { print(a._[0] === 'save' ? savePrefs(jsonArg(a)) : loadPrefs() || { saved: false, note: 'no preferences saved yet: ask the user, then "prefs save"' }); },
  },
  repos: {
    help: 'names the user already uses: their GitHub repositories (gh) and the folders next to this project (--no-siblings to skip those)',
    run: (a) => { print(takenNames(a['no-siblings'] ? undefined : process.cwd())); },
  },
  names: {
    help: 'names <a> <b> ... [--lang es,en] [--online]: measure candidates against the names already taken',
    run: async (a) => {
      const ws = workspace(a);
      const taken = ws.exists() ? ws.load().naming.taken : takenNames().names;
      const langs = str(a.lang, 'es,en').split(',');
      const out = [];
      for (const n of a._) {
        const m = measureName(n, langs, taken);
        if (a.online) m.online = await online(m.slug);
        out.push(m);
      }
      if (a.table) print(out.map(summarise).join('\n')); else print(out);
    },
  },
  init: {
    help: 'init --summary "what the product does" [--industry ..] [--locale en|es|<code>] [--mark-only]: create .kothar/identity.json',
    run: (a) => {
      const ws = workspace(a);
      if (ws.exists() && !a.force) die(`${ws.file} already exists: run "kothar status" and ask the user whether to continue from it ("kothar restart") or start over ("kothar init --force", which keeps the old work in a dated folder)`);
      if (ws.exists()) {
        // Starting over never destroys the earlier identity: it is set aside.
        stop(ws);
        const old = `${ws.dir}.old-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}`;
        fs.renameSync(ws.dir, old);
        process.stderr.write(`earlier work kept in ${old}\n`);
      }
      const id = blank(str(a.summary) || die('--summary is required: one or two sentences on what the product does'), str(a.industry), str(a.locale, 'en').toLowerCase());
      if (a['mark-only']) id.markOnly = true;
      const t = takenNames(a['no-siblings'] ? undefined : process.cwd());
      id.naming.taken = t.names;
      const p = loadPrefs();
      if (p?.categories) id.naming.categories = p.categories;
      ws.save(id);
      print({ workspace: ws.dir, takenNames: t.sources, savedPreferences: p });
    },
  },
  status: {
    help: 'is there earlier work here, how far did it get, and is the page waiting for something?',
    run: (a) => {
      const ws = workspace(a);
      if (!ws.exists()) return print({ exists: false, next: 'no earlier work in this folder: start with "kothar init"' });
      const id = ws.load(), s = id.selection;
      print({
        exists: true, workspace: ws.dir, product: id.product.summary, locale: id.locale,
        name: s.name || null, logo: s.concept || null,
        step: id.flow.step, state: id.flow.status, finished: id.flow.status === 'final',
        report: fs.existsSync(ws.rel('report.html')) ? ws.rel('report.html') : null,
        options: { names: id.naming.candidates.length, logos: id.concepts.length, drawnNames: id.wordmarks.length },
        waitingForYou: id.flow.status === 'working' && id.inbox ? { step: id.inbox.step, request: id.inbox.data, note: `the user asked for this in the page and it is still pending: handle it as if "kothar wait --step ${id.inbox.step}" had just returned it` } : null,
        server: running(ws)?.url || null,
      });
    },
  },
  deliver: {
    help: 'deliver [--out assets/logo]: write the finished logo into the project (SVG, PNG, favicon, animated mark and a README) - same as the button in the final report',
    run: (a) => {
      const ws = workspace(a), id = ws.load();
      const r = deliver(ws, id, a.out ? str(a.out) : undefined);
      id.delivered = { at: new Date().toISOString(), dir: r.relative, files: r.files.length };
      ws.save(id);
      stop(ws);
      print({ delivered: true, assets: r.dir, files: r.files });
    },
  },
  restart: {
    help: 'go through the steps again from 01, keeping every option and choice that already exists (same as the button in the final report)',
    run: (a) => {
      const ws = workspace(a), id = ws.load();
      if (id.flow.status !== 'final') die('only a finished identity can be restarted; this one is at step ' + id.flow.step);
      restart(id); delete id.delivered; ws.save(id);
      print({ step: 1, state: 'choose', note: 'The page offers the existing options again. While the user only re-chooses among them the page advances on its own (no wait needed); "kothar wait --step N" returns only if they ask for something new. Run "kothar open" and "kothar wait --step 1".' });
    },
  },
  set: {
    help: 'set --file patch.json: deep-merge a patch into identity.json (arrays are replaced)',
    run: (a) => { const ws = workspace(a); ws.save(deepMerge(ws.load(), jsonArg(a))); print('ok'); },
  },
  strings: {
    help: 'strings --locale <code>: is the page translated for this language? | strings save --locale <code> --file t.json: store a translation',
    run: (a) => {
      const locale = str(a.locale).toLowerCase().split(/[-_]/)[0] || die('--locale is required, e.g. --locale fr');
      const all = readJson<Record<string, Record<string, string>>>(path.join(ASSETS, 'strings.json'));
      const file = path.join(HOME, 'strings', `${locale}.json`);
      if (all[locale]) return print({ locale, ready: true, note: 'built in: nothing to translate' });
      if (a._[0] === 'save') {
        const t = jsonArg(a) as Record<string, string>;
        const missing = Object.keys(all.en).filter((k) => typeof t[k] !== 'string' || !t[k].trim());
        const broken = Object.keys(all.en).filter((k) => typeof t[k] === 'string' && all.en[k].includes('{n}') !== t[k].includes('{n}'));
        if (missing.length || broken.length) die(`translation not saved. Missing keys: ${missing.join(', ') || 'none'}. Keys that must keep the {n} placeholder: ${broken.join(', ') || 'none'}`, 1);
        writeJson(file, Object.fromEntries(Object.keys(all.en).map((k) => [k, t[k]])));
        return print({ locale, ready: true, saved: file });
      }
      if (fs.existsSync(file)) return print({ locale, ready: true, note: `translated earlier on this machine (${file})` });
      print({ locale, ready: false, how: `Translate every VALUE below from English into this language (keep the keys, the {n} placeholders and symbols like ■ □ → ▶ exactly), write the result as one JSON object to a file, then run: kothar strings save --locale ${locale} --file <file>`, english: all.en });
    },
  },
  traits: {
    help: 'the words for what a product is (traits and kinds); the fonts offered for the name are chosen from them',
    run: () => {
      const D = traitData();
      print({
        how: 'Weigh what this product is, from the repository and from what the user said: give each trait that applies a weight 1 (a little) to 3 (defining), leave out the rest (three to five traits is typical), and choose one kind. Also record three facts that decide which way the drawing rules point: stage ("new" or "known" to its audience), stakes ("high" when using or buying it puts money, safety, health or data at risk, otherwise "low") and category ("negative" when the field itself has bad associations, otherwise "neutral"). Save as {"product":{"kind":"...","traits":{"competence":3,...},"stage":"new","stakes":"low","category":"neutral"}} with "kothar set".',
        kinds: Object.fromEntries(Object.entries(D.kinds).map(([k, v]) => [k, v.means])),
        traits: Object.fromEntries(Object.entries(D.traits).map(([k, v]) => [k, v.means])),
        note: D.note,
      });
    },
  },
  split: {
    help: 'split <n>: how many logos per category (name / product / fusion)',
    run: (a) => { print(split(Number(a._[0]))); },
  },
  font: {
    help: 'font plan [--next --keep "A|B" --count n | --pick "A|B"]: fonts chosen from the product traits | font check "<family>" | font list | font outline',
    run: async (a) => {
      const [sub, ...rest] = a._;
      if (sub === 'list') return print(freeList());
      if (sub === 'plan') {
        // Fonts chosen from what the product is: first what its traits call for, then judgement, then chance.
        const ws = workspace(a), id = ws.load();
        const traits = id.product.traits, kind = id.product.kind;
        if (!traits || !Object.keys(traits).length || !kind) die('set product.kind and product.traits first (see "kothar traits")');
        const list = (v: unknown): string[] => str(v).split('|').map((x) => x.trim()).filter(Boolean);
        const keptOf = (names: string[]) => id.fonts.options.filter((o) => names.some((k) => fold(k) === fold(o.family)));
        if (a.pick) {
          const plan = id.fontPlan || die('run "kothar font plan --next" first');
          const picks = pickFonts(plan, list(a.pick));
          id.fonts.options = [...keptOf(plan.keep), ...picks]; id.fontPlan = plan; ws.save(id);
          return print({ mode: 'judgement', options: id.fonts.options.map((o) => `${o.family} ${o.weight}`), next: 'kothar flow ready --step 1' });
        }
        if (id.fontPlan && !a.next) return print({ mode: id.fontPlan.mode, options: id.fonts.options.map((o) => `${o.family} ${o.weight} (${o.class || 'custom'})`), note: 'current offer; add --next for others' });
        const keep = a.keep ? list(a.keep) : [];
        const kept = keptOf(keep);
        // Whatever is on the page now has been seen, however it got there: it must not come back.
        const seen = [...new Set([...(id.fontPlan?.served || []), ...id.fonts.options.map((o) => o.family)])];
        const before = id.fontPlan ? { ...id.fontPlan, served: seen } : (seen.length ? { traits: traits as Record<string, number>, kind: kind as string, served: seen, mode: 'psychology' as const, judged: 0, keep: [], count: 4 } : undefined);
        const step = nextFonts(before, traits as Record<string, number>, kind as string, Math.max(1, Math.min(6, Number(a.count ?? 4 - kept.length))), keep);
        id.fontPlan = step.plan;
        if (step.options) id.fonts.options = [...kept, ...step.options];
        ws.save(id);
        return print({
          mode: step.plan.mode, ranking: rankClasses(step.plan.traits, step.plan.kind).slice(0, 5).map((c) => `${c.name} ${c.score}${c.from.length ? ' (' + c.from.join(', ') + ')' : ''}`),
          kept: kept.map((o) => o.family), options: step.options?.map((o) => ({ family: o.family, weight: o.weight, class: o.class, why: o.why })), candidates: step.candidates, note: step.note,
        });
      }
      if (sub === 'check') {
        const out = [];
        for (const f of rest) out.push(await checkFont(f, { online: !a.offline }));
        return print({ fonts: out, warning: WARNING });
      }
      if (sub === 'outline') {
        const ws = workspace(a), id = ws.load();
        if (!id.selection.name || !id.selection.font) die('no name or font selected yet');
        const svg = await outlineChoice(id.selection.name, id.selection.font);
        if (!svg) die('font file unavailable (custom font without "file", or offline)');
        const out = ws.rel(str(a.out, 'wordmarks/font.svg'));
        fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, svg as string);
        return print({ written: out });
      }
      die('usage: font list | font check "<family>" | font outline');
    },
  },
  check: {
    help: 'check <file.svg> [--role small|full|wordmark]: lint, measure and compare ONE drawing, and write preview PNGs you can open to see it',
    run: (a) => {
      const file = path.resolve(str(a._[0]) || die('usage: check <file.svg> [--role small|full|wordmark]'));
      const src = fs.readFileSync(file, 'utf8');
      const role = (['small', 'full', 'wordmark'].includes(str(a.role)) ? str(a.role) : 'small') as Role;
      const l = lint(parseSvg(src), role === 'wordmark' ? 'wordmark' : 'mark');
      const m = measure(src, role);
      const q = role === 'wordmark' ? null : query(src);
      const base = path.join(path.dirname(file), 'preview', path.basename(file, '.svg'));
      fs.mkdirSync(path.dirname(base), { recursive: true });
      const ink = (x: string): string => colorize(x, { ink: '#000000' });
      fs.writeFileSync(base + '-large.png', render(ink(tighten(src, 0.12).src), { width: role === 'wordmark' ? 900 : 512, background: '#ffffff' }).png());
      fs.writeFileSync(base + '-small.png', role === 'wordmark' ? pixelPreview(ink(tighten(src, 0.08).src), 22, 6, '#ffffff', 'height') : pixelPreview(ink(tighten(src, 0.06).src), 16, 12));
      const findings = [...l.findings, ...m.findings, ...(q?.findings || [])].filter((f) => f.level !== 'pass');
      print([
        ...findings.map((f) => `${f.level}: [${f.rule}] ${f.msg}`),
        findings.length ? '' : 'no findings',
        `clean from: ${m.metrics.minCleanSize ?? '—'} px · smallest element: ${m.metrics.smallestElementPx ?? '—'} px at target size · ${l.stats.nodes} path nodes`,
        `thin parts: ${m.metrics.thinStrokePx ?? '—'} px · narrow gaps: ${m.metrics.narrowGapPx ?? '—'} px at target size (each needs 1)${m.metrics.symmetry ? ` · mirror symmetry: ${m.metrics.symmetry.leftRight} left-right, ${m.metrics.symmetry.topBottom} top-bottom (a description, not a score)` : ''}`,
        q ? `nearest shapes: ${q.matches.slice(0, 4).map((x) => `${x.score} ${x.label} "${x.name}"`).join(' · ')}` : '',
        `look at it: ${base}-large.png (large) and ${base}-small.png (real pixels at ${role === 'wordmark' ? '22 px tall' : '16 px'}, enlarged)`,
      ].filter((x) => x !== '').join(String.fromCharCode(10)));
    },
  },
  audit: {
    help: 'measure every concept, wordmark and animation; writes audit.json; exit 1 on any failure',
    run: async (a) => {
      const ws = workspace(a);
      const audit = await runAudit(ws, ws.load());
      print(a.json ? audit : printable(audit));
      if (overall(audit) === 'fail') process.exitCode = 1;
    },
  },
  judge: {
    help: 'judge pack | judge score [--round n]: blind review by agents with no context',
    run: async (a) => {
      const ws = workspace(a), id = ws.load();
      if (a._[0] === 'pack') return print(await pack(ws, id));
      if (a._[0] === 'score') return print(score(ws, id, a.round ? Number(a.round) : undefined));
      die('usage: judge pack | judge score');
    },
  },
  animate: {
    help: 'write a baseline animated SVG for the selected mark to animation/mark-animated.svg (then refine it by hand)',
    run: (a) => {
      const ws = workspace(a), id = ws.load();
      const c = id.concepts.find((x) => x.id === id.selection.concept) || die('no logo selected yet');
      const out = 'animation/mark-animated.svg';
      fs.mkdirSync(path.dirname(ws.rel(out)), { recursive: true });
      fs.writeFileSync(ws.rel(out), baselineAnimation(fs.readFileSync(ws.rel(c.mark), 'utf8')));
      id.animation = out; id.animationFor = c.id; ws.save(id);
      print({ written: ws.rel(out), next: 'edit it if a better reveal fits the concept, then "kothar report"' });
    },
  },
  flow: {
    help: 'flow ready --step N [--override "why"] | flow working --doing k (0-based index of the task in progress) [--label ".." --tasks "a|b|c"] | flow',
    run: (a) => {
      const ws = workspace(a), id = ws.load();
      const sub = a._[0];
      if (sub === 'ready') {
        const step = Number(a.step);
        if (![1, 2].includes(step)) die('--step must be 1 or 2 (step 3, the identity, is published by "kothar report")');
        const fails = gate(step, id, ws).filter((f) => f.level === 'fail');
        if (fails.length && !a.override) {
          print(fails.map((f) => `FAIL [${f.rule}] ${f.msg}`).join('\n'));
          die(`step ${step} is not ready: fix the failures above. (--override "reason" publishes anyway and shows the reason to the user)`, 1);
        }
        const overrides = fails.length ? [...(id.flow.overrides || []), `step ${step}: ${str(a.override)} (${fails.length} failing check(s))`] : id.flow.overrides;
        id.flow = { step, status: 'choose', overrides };
        delete id.inbox;
        ws.save(id);
        return print({ step, status: 'choose', next: `kothar wait --step ${step}` });
      }
      if (sub === 'working') {
        const doing = Number(a.doing ?? 0);
        const texts = a.tasks ? str(a.tasks).split('|').map((s) => s.trim()).filter(Boolean) : (id.flow.tasks || []).map((t) => t.text);
        const tasks: Task[] = texts.map((text, i) => ({ text, state: i < doing ? 'done' : i === doing ? 'doing' : 'todo' }));
        id.flow = { ...id.flow, status: 'working', label: str(a.label, id.flow.label || ''), tasks };
        ws.save(id);
        return print({ label: id.flow.label, tasks: tasks.map((t, i) => `${i}: ${t.text} [${t.state}]`) });
      }
      print(id.flow);
    },
  },
  wait: {
    help: 'wait --step N [--timeout 540]: block until the user confirms step N in the page; prints the selection',
    run: async (a) => {
      const ws = workspace(a), step = Number(a.step), until = Date.now() + Number(a.timeout ?? 540) * 1000;
      if (!running(ws) && !readJson<Identity | null>(ws.file, null)?.delivered) die('the report server is not running: "kothar open" first');
      for (;;) {
        const id = readJson<Identity | null>(ws.file, null);
        // Handed over from the page: nothing more to listen for.
        if (id?.delivered) return print({ delivered: true, assets: id.delivered.dir, files: id.delivered.files, note: 'The user generated the assets: the work is finished. Stop listening, tell them where the files are, and end.' });
        // Anything the user asked for counts, whatever step it came from: after a restart the page can move on by itself and the request may belong to a later step.
        if (id?.inbox && (id.inbox.step === step || id.flow.status === 'working')) return print({ confirmed: true, step: id.inbox.step, selection: id.inbox.data, all: id.selection });
        if (Date.now() > until) { print({ confirmed: false, step, note: 'the user has not confirmed yet; run the same command again to keep waiting' }); process.exitCode = 3; return; }
        await new Promise((r) => setTimeout(r, 600));
      }
    },
  },
  report: {
    help: 'export the final files, publish step 3 (the identity) and write report.html (shareable, self-contained)',
    run: async (a) => {
      const ws = workspace(a), id = ws.load();
      const audit = await runAudit(ws, id);
      const bad = (audit.animation?.findings || []).filter((f) => f.level === 'fail');
      if (bad.length && !a.override) { print(bad.map((f) => `FAIL [${f.rule}] ${f.msg}`).join('\n')); die('the animated logo fails its checks: fix animation/mark-animated.svg, or delete it to use the generated one', 1); }
      const m = await exportFinal(ws, id);
      id.flow = { step: 3, status: 'final', overrides: id.flow.overrides };
      ws.save(id);
      const file = writeStatic(ws, id);
      print({ report: file, files: m.files.length, liveText: m.liveText, url: running(ws)?.url || null });
    },
  },
  open: {
    help: 'start the report server in the background (if needed) and open the browser; prints the URL',
    run: async (a) => { print(await open(workspace(a), { port: Number(a.port ?? 4173), browser: !a['no-browser'] })); },
  },
  serve: {
    help: 'run the report server in the foreground (normally started by "open")',
    run: async (a) => { const ws = workspace(a); ws.load(); const port = await serve(ws, Number(a.port ?? 4173)); process.stderr.write(`kothar report on http://localhost:${port}\n`); },
  },
  stop: {
    help: 'stop the report server',
    run: (a) => { print({ stopped: stop(workspace(a)) }); },
  },
};

const [cmd, ...rest] = process.argv.slice(2);
if (!cmd || cmd === 'help' || cmd === '--help') {
  console.log('usage: node kothar.js <command> [--dir .kothar] [options]\n');
  for (const [k, c] of Object.entries(COMMANDS)) console.log(`  ${k.padEnd(8)} ${c.help}`);
} else if (!COMMANDS[cmd]) {
  console.error(`kothar: unknown command "${cmd}". Run "kothar help".`); process.exitCode = 2;
} else {
  try { await COMMANDS[cmd].run(parseArgs(rest)); }
  catch (e) {
    console.error('kothar: ' + (process.env.KOTHAR_DEBUG ? (e as Error).stack : (e as Error).message));
    process.exitCode = e instanceof KotharError ? e.code : 1;
  }
}
