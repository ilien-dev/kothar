// The report page. Live: polls the local server and posts confirmed selections. Static: renders the embedded final state.
// All wording comes from the server (assets/strings.json, or a saved translation), already resolved for the user's language.
function explain(f, it) {
    const d = (k) => S.strings['rule.' + k];
    const compact = String(f.rule).startsWith('compact-');
    const r = String(f.rule).replace(/^compact-/, '');
    if (d(r) === undefined)
        return f.msg;
    const j = it.judges || {};
    const extra = r === 'similarity' && it.audit?.nearest ? `${it.audit.nearest.what} (${it.audit.nearest.score})`
        : r === 'judge-lookalike' ? (j.remindsOf || []).join(' | ')
            : r === 'judge-recognition' ? (j.sawLarge || []).join(' | ')
                : r === 'judge-recognition-small' ? (j.sawSmall || []).join(' | ')
                    : r === 'judge-read' ? (j.theyRead || []).join(' | ')
                        : r === 'judge-read-small' ? (j.theyReadSmall || []).join(' | ') : '';
    return `${compact ? d('compact') + ' ' : ''}${d(r)}${extra ? ' ' + extra : ''}`;
}
const w = window;
let S = w.__KOTHAR__;
const live = !S;
const ui = { keepFonts: [], hintFonts: '', keepLogos: [], keepWords: [], hintLogos: '', hintWords: '', viewConcept: null, name: null, font: 0, custom: '', licence: false, svg: false, count: 6, concept: null, wordmark: null, sending: false, error: '', view: null, lost: false };
const root = document.getElementById('app');
const t = (k) => S?.strings?.[k] ?? k;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
const pad2 = (n) => String(n).padStart(2, '0');
const sized = (svg, px) => (svg || '').replace('<svg ', `<svg style="width:${px}px" `);
// The logo is chosen and delivered in black, white and greys: the main ink and the second tone ([data-ink="accent"]) on each ground.
const INK = { light: { ground: '#FFFFFF', ink: '#111111', accent: '#767676' }, dark: { ground: '#000000', ink: '#F5F5F5', accent: '#8C8C8C' } };
// Kothar's own logo, which marks the page as made by this tool (README palette, see app.css --k-*). Not the product's logo.
const K_LOGO = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"k-logo\" role=\"img\" aria-label=\"kothar\" viewBox=\"0 0 333.03 100\"><svg viewBox=\"7.958 7.958 48.082 48.082\" fill=\"currentColor\" x=\"0\" y=\"0\" width=\"100\" height=\"100\"><path d=\"M8 8h48v14H22v34H8z\"/><circle cx=\"43\" cy=\"43\" r=\"12\" class=\"k-dot\"/></svg><svg viewBox=\"14 -144 646.4 146.45\" fill=\"currentColor\" x=\"130\" y=\"27\" width=\"203.03\" height=\"46\"><path d=\"M41.20 0L14 0L14-144L41.20-144L41.20-77.60L96-144L129.20-144L69-73L133 0L98.60 0L41.20-65.60L41.20 0ZM187.60 3L187.60 3Q171.30 3 159-4.30Q146.70-11.60 139.85-24.45Q133-37.30 133-54L133-54Q133-70.90 140-83.75Q147-96.60 159.30-103.80Q171.60-111 187.60-111L187.60-111Q203.90-111 216.25-103.70Q228.60-96.40 235.50-83.55Q242.40-70.70 242.40-54L242.40-54Q242.40-37.20 235.45-24.35Q228.50-11.50 216.15-4.25Q203.80 3 187.60 3ZM187.60-22.40L187.60-22.40Q200.70-22.40 207.15-31.25Q213.60-40.10 213.60-54L213.60-54Q213.60-68.40 207.05-77Q200.50-85.60 187.60-85.60L187.60-85.60Q178.70-85.60 173-81.60Q167.30-77.60 164.55-70.50Q161.80-63.40 161.80-54L161.80-54Q161.80-39.50 168.35-30.95Q174.90-22.40 187.60-22.40ZM329.20-22.60L329.20 0Q318 2.10 307.25 1.85Q296.50 1.60 288.05-1.95Q279.60-5.50 275.20-13.40L275.20-13.40Q271.20-20.80 271-28.45Q270.80-36.10 270.80-45.80L270.80-45.80L270.80-138L298-138L298-47.40Q298-41.10 298.15-36.05Q298.30-31 300.20-28L300.20-28Q303.80-22.30 311.70-21.80Q319.60-21.30 329.20-22.60L329.20-22.60ZM329.20-87L252.40-87L252.40-108L329.20-108L329.20-87ZM454.40 0L426.80 0L426.80-51Q426.80-54.70 426.40-60.45Q426.00-66.20 423.90-72Q421.80-77.80 417.05-81.70Q412.30-85.60 403.60-85.60L403.60-85.60Q400.10-85.60 396.10-84.50Q392.10-83.40 388.60-80.25Q385.10-77.10 382.85-71Q380.60-64.90 380.60-54.80L380.60-54.80L365.00-62.20Q365.00-75 370.20-86.20Q375.40-97.40 385.85-104.30Q396.30-111.20 412.20-111.20L412.20-111.20Q424.90-111.20 432.90-106.90Q440.90-102.60 445.35-96Q449.80-89.40 451.70-82.25Q453.60-75.10 454.00-69.20Q454.40-63.30 454.40-60.60L454.40-60.60L454.40 0ZM380.60 0L353.00 0L353.00-144L377.20-144L377.20-70L380.60-70L380.60 0ZM510.40 3L510.40 3Q498.80 3 490.75-1.45Q482.70-5.90 478.55-13.35Q474.40-20.80 474.40-29.80L474.40-29.80Q474.40-37.30 476.70-43.50Q479.00-49.70 484.15-54.45Q489.30-59.20 498.00-62.40L498.00-62.40Q504.00-64.60 512.30-66.30Q520.60-68 531.10-69.55Q541.60-71.10 554.20-73L554.20-73L544.40-67.60Q544.40-77.20 539.80-81.70Q535.20-86.20 524.40-86.20L524.40-86.20Q518.40-86.20 511.90-83.30Q505.40-80.40 502.80-73L502.80-73L478.20-80.80Q482.30-94.20 493.60-102.60Q504.90-111 524.40-111L524.40-111Q538.70-111 549.80-106.60Q560.90-102.20 566.60-91.40L566.60-91.40Q569.80-85.40 570.40-79.40Q571-73.40 571-66L571-66L571 0L547.20 0L547.20-22.20L550.60-17.60Q542.70-6.70 533.55-1.85Q524.40 3 510.40 3ZM516.20-18.40L516.20-18.40Q523.70-18.40 528.85-21.05Q534-23.70 537.05-27.10Q540.10-30.50 541.20-32.80L541.20-32.80Q543.30-37.20 543.65-43.05Q544-48.90 544-52.80L544-52.80L552-50.80Q539.90-48.80 532.40-47.45Q524.90-46.10 520.30-45Q515.70-43.90 512.20-42.60L512.20-42.60Q508.20-41 505.75-39.15Q503.30-37.30 502.15-35.10Q501.00-32.90 501.00-30.20L501.00-30.20Q501.00-26.50 502.85-23.85Q504.70-21.20 508.10-19.80Q511.50-18.40 516.20-18.40ZM624.40 0L597 0L597-108L621-108L621-81.60L618.40-85Q620.50-90.60 624-95.20Q627.50-99.80 632.60-102.80L632.60-102.80Q636.50-105.20 641.10-106.55Q645.70-107.90 650.60-108.25Q655.50-108.60 660.40-108L660.40-108L660.40-82.60Q655.90-84 649.95-83.55Q644-83.10 639.20-80.80L639.20-80.80Q634.40-78.60 631.10-74.95Q627.80-71.30 626.10-66.35Q624.40-61.40 624.40-55.20L624.40-55.20L624.40 0Z\"/></svg></svg>";
const K_MARK = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"k-mark\" viewBox=\"6 6 52 52\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M8 8h48v14H22v34H8z\"/><circle class=\"k-dot\" cx=\"43\" cy=\"43\" r=\"12\"/></svg>";
function fontCss(f) { return f ? `font-family:'${String(f.family).replace(/['"<>]/g, '')}',var(--sans);font-weight:${Number(f.weight) || 700};${f.uppercase ? 'text-transform:uppercase;' : ''}` : ''; }
function loadFonts() {
    const fams = [...(S.fonts || []), S.selection?.font].filter((f) => f && f.free !== false && !f.custom);
    if (!fams.length)
        return;
    const href = 'https://fonts.googleapis.com/css2?' + fams.map((f) => `family=${encodeURIComponent(f.family).replace(/%20/g, '+')}:wght@${Number(f.weight) || 700}`).join('&') + '&display=swap';
    if (document.querySelector(`link[data-k="${href}"]`))
        return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.dataset.k = href;
    document.head.appendChild(l);
}
function chosenFont() { return ui.custom.trim() && ui.font === -1 ? { family: ui.custom.trim(), weight: 700, custom: true } : S.fonts[ui.font] || null; }
function stepState(n) {
    const f = S.flow;
    if (f.status === 'final')
        return n === 3 ? 'now' : 'done';
    if (f.status === 'choose')
        return n < f.step ? 'done' : n === f.step ? 'now' : 'pending';
    return n <= f.step ? 'done' : n === f.step + 1 ? 'now' : 'pending';
}
function summary(n) {
    const s = S.selection || {};
    if (n === 1)
        return [s.name, s.font?.family].filter(Boolean).join(' · ');
    if (n === 2)
        return [s.concept, s.wordmark].filter(Boolean).join(' + ');
    return '';
}
function top() {
    const f = S.flow;
    const status = S.static ? t('shared') : S.delivered ? t('finished') : ui.lost ? t('lost') : f.status === 'final' ? t('finished') : f.status === 'working' ? t('working') : t('connected');
    const dot = S.static || f.status === 'final' ? '' : `<span class="dot${ui.lost ? ' off' : ''}"></span>`;
    return `<header class="top pad"><a class="k-brand" href="https://github.com/ilien-dev/kothar" target="_blank" rel="noopener">${K_LOGO}</a><span class="mono k-id">${esc((S.selection?.name || 'kothar').toUpperCase())} — ID</span><span class="mono k-status">${S.static ? esc((S.final?.generated || '').slice(0, 10)) : esc(location.host)}</span><span class="mono k-status">${dot}${esc(status)}</span></header>`;
}
function steps() {
    const final = S.flow.status === 'final';
    const cells = [1, 2, 3].map((n) => {
        const st = stepState(n);
        const line = st === 'pending' ? t('pending') : st === 'done' ? `✓ ${esc(summary(n))}${final ? ' · ' + t('consult') : ''}` : final ? t('finalTag') : S.flow.status === 'choose' ? t('choose') : t('creating');
        const inner = `<span class="n">${pad2(n)}</span><strong>${t(n === 3 ? 's4' : 's' + n)}</strong><span class="mono">${line}</span>`;
        const viewing = final && (ui.view ?? 3) === n ? ' viewing' : '';
        return final ? `<button type="button" class="step ${st}${viewing}" data-act="view" data-v="${n}">${inner}</button>` : `<div class="step ${st}">${inner}</div>`;
    });
    return `<nav class="steps pad" aria-label="steps">${cells.join('')}</nav>`;
}
function notices() {
    const out = [];
    if (S.flow.overrides?.length)
        out.push(`<div class="notice"><strong>${t('overrides')}:</strong> ${S.flow.overrides.map(esc).join(' · ')}</div>`);
    if (S.similarityChecked === false)
        out.push(`<div class="notice">${t('simOff')}</div>`);
    return out.join('');
}
function loading() {
    const f = S.flow;
    const tasks = (f.tasks || []).map((x) => `<div class="${x.state}"><span>${esc(x.text)}</span><span>${x.state === 'done' ? '✓' : x.state === 'doing' ? '■' : '—'}</span></div>`).join('');
    const label = esc(f.label || t('preparing')).replace(' ', '<br>');
    return `<main class="loading pad"><div class="big"><span class="mono mute"><span class="forge" aria-hidden="true"><i></i><i></i><i></i></span>${t('received')}</span><h1>${label}</h1><div class="track" role="progressbar" aria-label="${esc(f.label || '')}"><div></div></div><p>${t('wait')}</p><p style="font-size:13px">${t('needSession')}</p></div><div class="tasks">${tasks}</div></main>`;
}
function step1(ro) {
    const sel = ro ? S.selection.name : ui.name;
    const cards = S.names.map((n, i) => {
        const on = n.name === sel;
        return `<button type="button" class="card${on ? ' on' : ''}" data-act="name" data-v="${esc(n.name)}" aria-pressed="${on}"${ro ? ' disabled' : ''}><span class="row"><span>N—${pad2(i + 1)}</span><span>${on ? t('chosen') : ''}</span></span><span class="name">${esc(n.name)}</span><p><strong>${t('represents')}</strong> ${esc(n.represents)}</p><p><strong>${t('fits')}</strong> ${esc(n.why)}</p></button>`;
    }).join('');
    const sample = esc(sel || S.names[0]?.name || '');
    const roFont = S.selection.font;
    const tiles = S.fonts.map((f, i) => {
        const on = ro ? roFont?.family === f.family : ui.font === i;
        return `<div class="tilewrap"><button type="button" class="tile${on ? ' on' : ''}" data-act="font" data-v="${i}" aria-pressed="${on}"${ro ? ' disabled' : ''}><span class="sample" style="${fontCss(f)}">${f.uppercase ? sample.toUpperCase() : sample}</span><span class="mono">${esc(f.family)} ${Number(f.weight) || ''}<br>${esc(f.license || 'OFL')} · ${t('free')}${f.basis ? ' · ' + t('font_' + f.basis) : ''}${on ? ' · ■' : ''}</span></button>${ro ? '' : `<button type="button" class="keep${ui.keepFonts.includes(f.family) ? ' on' : ''}" data-act="keepf" data-v="${esc(f.family)}" aria-pressed="${ui.keepFonts.includes(f.family)}">${ui.keepFonts.includes(f.family) ? '■ ' + t('kept') : '□ ' + t('keep')}</button>`}</div>`;
    }).join('');
    const customOn = ro ? !!roFont?.custom : ui.font === -1;
    const custom = `<div class="box dashed"><label class="mono" for="k-font"><strong>${t('ownFont')}</strong></label><input id="k-font" class="field" type="text" placeholder="${t('fontName')}" value="${esc(ro ? (roFont?.custom ? roFont.family : '') : ui.custom)}" data-in="custom"${ro ? ' disabled' : ''}><label class="check"><input type="checkbox" data-in="licence"${(ro ? customOn : ui.licence) ? ' checked' : ''}${ro ? ' disabled' : ''}>${t('ownLicence')}</label><span class="legal">${t('legal')}</span></div>`;
    const count = ro ? S.selection.count : ui.count;
    const counts = [3, 6, 9].map((n) => `<button type="button" class="pick${count === n ? ' on' : ''}" data-act="count" data-v="${n}" aria-pressed="${count === n}"${ro ? ' disabled' : ''}>${n}</button>`).join('');
    const rem = count % 3, each = Math.floor(count / 3);
    const svgOn = ro ? !!S.selection.svgWordmark : ui.svg;
    return `<main><section class="section pad"><div class="head"><h1>${S.nameGiven ? t('yourName') : t('pickName')}</h1><span class="mono mute">${S.nameGiven ? '' : S.names.length + ' ' + t('candidates')}${S.categories?.length ? ' · ' + esc(S.categories.join(', ')) : ''}${S.takenCount ? ' · ' + t('noClash') : ''}</span></div>${notices()}<div class="cards">${cards}</div></section>
<section class="pad">${S.markOnly ? '' : `<div class="head sub"><h2>${t('howWritten')}</h2><span class="mono mute">${t('freeFonts')}</span></div><div class="grid" style="margin-top:20px">${tiles}${custom}${ro ? '' : `<div class="box dashed rg"><label for="k-hf"><strong>${t('regenTitle')}</strong> <span class="mute">${t('regenWhy2')}</span></label><input id="k-hf" class="field" type="text" placeholder="${t('regenFEg')}" value="${esc(ui.hintFonts)}" data-in="hintFonts"><button type="button" class="btn" data-act="regenf"${ui.sending ? ' disabled' : ''}>${t('regenf')}</button></div>`}</div>`}
<div class="grid" style="margin-top:12px">${S.markOnly ? '' : `<div class="box" style="flex:2 1 420px"><label class="check"><input type="checkbox" data-in="svg"${svgOn ? ' checked' : ''}${ro ? ' disabled' : ''}><span><strong style="font-size:17px">${t('drawToo')}</strong><br><span class="mute">${t('drawTooWhy')}</span></span></label></div>`}
<div class="box"><strong style="font-size:17px">${t('howMany')}</strong><div class="counts">${counts}<input class="field" style="flex:1 1 72px;width:auto;min-height:44px" type="number" min="3" max="24" aria-label="${t('other')}" placeholder="${t('other')}" value="${[3, 6, 9].includes(count) ? '' : count}" data-in="count"${ro ? ' disabled' : ''}></div><span class="mono mute">${each} ${t('ofName')} · ${each} ${t('ofProduct')} · ${each} ${t('ofFusion')}${rem ? ` · +${rem} ${t('extra')}` : ''}</span></div></div></section></main>`;
}
function fact(label, value, level) { return `<div><span>${label}</span><span class="v${level === 'warn' || level === 'fail' ? ' red' : ''}">${value}</span></div>`; }
function wordView(id, cls) {
    if (S.markOnly)
        return '';
    const d = id ? (S.wordmarks || []).find((x) => x.id === id) : null;
    const f = S.selection.font;
    const nm = S.selection.name || '';
    return d?.svg ? `<span class="w ${cls}">${d.svg}</span>` : `<span class="w txt ${cls}" style="${fontCss(f)}">${esc(f?.uppercase ? nm.toUpperCase() : nm)}</span>`;
}
function step2(ro) {
    const sel = ro ? S.selection.concept : ui.concept;
    const word = (l) => t(l === 'fail' ? 'fail' : l === 'warn' ? 'warn' : 'pass');
    // Master and detail: the list on the right, everything about the logo being looked at on the left.
    const cur = S.concepts.find((c) => c.id === ui.viewConcept) || S.concepts.find((c) => c.id === sel) || S.concepts[0];
    const rows = S.concepts.map((c) => {
        const on = c.id === sel, view = c.id === cur.id;
        const n = c.audit.findings.filter((x) => x.level === 'warn' || x.level === 'fail').length;
        const x = c;
        return `<div class="palrow"><button type="button" class="lrow${on ? ' on' : ''}${view ? ' view' : ''}" data-act="concept" data-v="${esc(c.id)}" aria-pressed="${on}"><span class="lt on-white">${c.svg || ''}</span><span class="lt on-black">${c.svg || ''}</span><span class="li"><strong>${esc(c.id)} · ${esc(c.title)}</strong><span class="mono">${t('cat' + c.category)}</span></span><span class="mono ls">${on ? t('chosen') : n ? `${n} ${t(n === 1 ? 'warn' : 'warns')}` : t('clean')}</span></button>${ro ? '' : `<button type="button" class="keep${ui.keepLogos.includes(x.id) ? ' on' : ''}" data-act="keepl" data-v="${esc(x.id)}" aria-pressed="${ui.keepLogos.includes(x.id)}">${ui.keepLogos.includes(x.id) ? '■ ' + t('kept') : '□ ' + t('keep')}</button>`}</div>`;
    }).join('');
    const a = cur.audit, j = cur.judges;
    const lv = (rule) => a.findings.find((x) => x.rule === rule || x.rule === 'compact-' + rule)?.level;
    const sim = S.similarityChecked === false ? t('notChecked') : a.nearest ? `${a.nearest.score} — ${word(lv('similarity'))}` : '—';
    const facts = fact(t('cleanFrom'), a.minClean ? `${a.minClean} px — ${word(lv('size'))}` : `— ${word(lv('size') || 'fail')}`, lv('size')) + fact(t('smallest'), a.smallest != null ? `${a.smallest} ${t('at16')}` : '—', lv('elements')) + fact(t('nearest'), sim, lv('similarity')) + fact(t('judges'), j ? `${j.recognisedLarge} / ${j.judges} ${t('recognise')}` : t('noJudges'), lv('judge-recognition')) + (j ? fact(t('judgeScores'), `${j.legibility} · ${j.distinctiveness} · ${j.memorability} / 5`) : '');
    const warns = a.findings.filter((x) => x.level !== 'info').map((x) => `<li>${esc(explain(x, cur))}</li>`).join('');
    const detail = `<div class="detail"><div class="pair big"><div class="on-white">${cur.svg || ''}</div><div class="on-black">${cur.svg || ''}</div></div><div class="sizes"><span>${sized(cur.small, 16)}16${cur.hasCompact ? ' · ' + t('compact') : ''}</span><span>${sized(cur.small, 32)}32</span><span>${sized(cur.svg, 64)}64</span></div><div class="dhead"><h2>${esc(cur.id)} · ${esc(cur.title)}</h2><span class="mono mute">${t('cat' + cur.category)}</span></div><p class="why">${esc(cur.rationale)}</p><div class="facts">${facts}</div>${warns ? `<ul class="warns">${warns}</ul>` : ''}</div>`;
    const f = S.selection.font, nm = S.selection.name || '';
    let words = '';
    if (S.wordmarks?.length) {
        const cur = ro ? S.selection.wordmark : ui.wordmark;
        // what is being looked at can differ from what was chosen (after the choice is final, rows only preview)
        const vw = ui.viewWord !== undefined ? (ui.viewWord || null) : (cur || null);
        const rows = [`<button type="button" class="word${!cur ? ' on' : ''}${!vw ? ' view' : ''}" data-act="wordmark" data-v="" aria-pressed="${!cur}"><span class="txt" style="${fontCss(f)}">${esc(nm)}</span><span class="mono">${t('yourFont')} · ${esc(f?.family || '')} ${!cur ? '■' : ''}<br>${t('unchanged')}</span></button>`]
            .concat(S.wordmarks.map((x) => { const on = cur === x.id; return `<div class="palrow"><button type="button" class="word${on ? ' on' : ''}${vw === x.id ? ' view' : ''}" data-act="wordmark" data-v="${esc(x.id)}" aria-pressed="${on}">${x.svg || ''}<span class="mono">${esc(x.id)} ${esc(x.title)} ${on ? '■' : ''}<br>${x.judges ? `${t('read')} ${x.judges.readLarge} / ${x.judges.judges}` : t('noJudges')}${x.audit.level === 'warn' ? ' · ' + t('warn') : ''}</span></button>${ro ? '' : `<button type="button" class="keep${ui.keepWords.includes(x.id) ? ' on' : ''}" data-act="keepw" data-v="${esc(x.id)}" aria-pressed="${ui.keepWords.includes(x.id)}">${ui.keepWords.includes(x.id) ? '■ ' + t('kept') : '□ ' + t('keep')}</button>`}</div>`; })).join('');
        const mark = S.concepts.find((c) => c.id === ui.viewConcept) || S.concepts.find((c) => c.id === sel) || S.concepts[0];
        words = `<section class="pad"><div class="head sub" style="margin-top:56px"><h2>${t('writing')}</h2><span class="mono mute">${t('writingSub')}</span></div><div class="duo"><div class="words">${rows}${ro ? '' : `<div class="box dashed"><label for="k-hw"><strong>${t('regenTitle')}</strong> <span class="mute">${t('regenWhy2')}</span></label><input id="k-hw" class="field" type="text" placeholder="${t('regenNEg')}" value="${esc(ui.hintWords)}" data-in="hintWords"><button type="button" class="btn" data-act="regenw"${ui.sending ? ' disabled' : ''}>${t('regenw')}</button></div>`}<span class="mono mute" style="text-transform:none;letter-spacing:0">${t('keepFont')}</span></div><div class="combo"><div class="stage"><span class="m">${mark?.svg || ''}</span>${wordView(vw, '')}</div><div class="cap mono">${t('combo')} — ${esc(mark?.id || '')} + ${esc(vw || t('yourFont'))}</div></div></div></section>`;
    }
    const title = S.wordmarks?.length || S.markOnly ? '' : `<div class="specimen" style="${fontCss(f)};margin:0 0 24px">${esc(f?.uppercase ? nm.toUpperCase() : nm)}</div>`;
    return `<main><section class="section pad">${title}<div class="head"><h1>${t('pickLogo')}</h1><span class="mono mute">${t('oneInk')}</span></div>${notices()}<div class="duo">${detail}<div class="logolist">${rows}${ro ? '' : `<div class="box dashed"><label for="k-hl"><strong>${t('regenTitle')}</strong> <span class="mute">${t('regenWhy2')}</span></label><input id="k-hl" class="field" type="text" placeholder="${t('regenLEg')}" value="${esc(ui.hintLogos)}" data-in="hintLogos"><button type="button" class="btn" data-act="regenl"${ui.sending ? ' disabled' : ''}>${t('regenl')}</button></div>`}</div></div></section>${words}</main>`;
}
function report() {
    const F = S.final, s = S.selection;
    const L = INK.light, D = INK.dark;
    const concept = S.concepts.find((x) => x.id === s.concept) || {};
    const cand = S.names.find((x) => x.name === s.name) || {};
    const word = s.wordmark ? S.wordmarks.find((x) => x.id === s.wordmark) : null;
    const a = concept.audit || {}, j = concept.judges, wj = word ? word.judges : F.fontJudges;
    const facts = fact(t('minSize'), a.minClean ? `${a.minClean} px${concept.hasCompact ? ' (' + t('compact') + ')' : ''}` : '—') + fact(t('nearest'), S.similarityChecked === false ? t('notChecked') : a.nearest ? `${a.nearest.score} · ${esc(a.nearest.what)}` : '—') + fact(t('judges'), j ? `${j.recognisedLarge} / ${j.judges} ${t('recognise')}` : t('noJudges')) + (wj ? fact(t('writingShort'), `${t('read')} ${wj.readLarge} / ${wj.judges}`) : '');
    const ver = (style, body, tag, tagColor) => `<div class="ver" style="${style}">${body}<span class="tag mono" style="color:${tagColor}">${tag}</span></div>`;
    const sw = (bg, fg, label) => `<div style="background:${bg};color:${fg}${bg === '#FFFFFF' ? ';box-shadow:inset 0 0 0 1px var(--line)' : ''}">${label}<br>${bg}</div>`;
    const f = s.font || {};
    const sizes = [16, 24, 32, 48, 64, 128].map((n) => `<span>${sized(n <= 32 ? F.small : F.mark, n)}${n}</span>`).join('');
    const files = F.files.map((x) => `<a href="final/${esc(x.file)}" title="${esc(x.what)}"${/\.(svg|png|ico)$/.test(x.file) ? ' download' : ''}>${esc(x.file)}</a>`).join('');
    return `<main>${S.static ? '' : `${S.delivered ? `<div class="readonly pad done"><strong>✓ ${t('delivered')} <code>${esc(S.delivered.dir)}/</code></strong> · ${S.delivered.files} · ${t('deliveredNote')}</div>` : `<div class="readonly pad handover"><span>${t('deliverWhy')}</span><button type="button" class="btn on" data-act="deliver"${ui.sending ? ' disabled' : ''}>${t('deliver')}</button><button type="button" class="btn" data-act="restart">${t('restart')}</button></div>`}`}
<section class="hero pad" style="--c-ink:${L.ink};--accent:${L.accent};background:${L.ground}"><div class="lock" role="img" aria-label="${esc(s.name)}"${S.markOnly ? ' style="width:min(60%,300px)"' : ''}>${F.lockup}</div></section>
<div class="pad">${notices()}<div class="cols"><div><span class="mono mute">${t('idea')}</span><p class="lead">${esc(s.name)}: ${esc(cand.represents || '')} ${esc(cap(cand.why || ''))}</p><p class="why" style="margin-top:14px"><strong>${esc(concept.title || '')}.</strong> ${esc(concept.rationale || '')}${word ? ` <strong>${esc(word.title)}.</strong> ${esc(word.rationale)}` : ''}</p></div><div><span class="mono mute">${t('measures')}</span><div class="facts" style="margin-top:10px">${facts}</div></div></div>
<div style="margin-top:56px"><span class="mono mute">${t('versions')}</span><div class="vers">${ver('background:#fff;border:1px solid var(--line);color:#0B0B0C', F.mark, t('mono'), '#3C3C40')}${ver(`background:${L.ground};border:1px solid var(--line);color:${L.ink};--accent:${L.accent}`, F.mark, t('onWhite'), '#3C3C40')}${ver(`background:${D.ground};color:${D.ink};--accent:${D.accent}`, F.mark, t('onBlack'), '#D5D5D9')}<div class="ver" style="background:${L.ground};border:1px solid var(--ink);color:${L.ink};--accent:${L.accent}"><div id="k-anim">${F.animated}</div><button type="button" class="play" data-act="replay" style="color:${L.ink}">${t('animated')}</button></div></div></div>
<div class="cols"><div><span class="mono mute">${t('tones')}</span><div class="swatches">${sw(L.ink, '#FFFFFF', t('toneInk'))}${sw(L.accent, '#FFFFFF', t('toneSecond'))}${sw(L.ground, '#111111', t('onWhite'))}${sw(D.ground, '#F5F5F5', t('onBlack'))}</div><p class="why" style="margin-top:10px">${t('tonesWhy')}</p></div>${S.markOnly ? '' : `<div><span class="mono mute">${t('type')} · ${esc(f.family || '')} ${Number(f.weight) || ''} · ${esc(f.license || '')}</span><div class="specimen" style="${fontCss(f)}">Aa ${esc(String(s.name || '').slice(0, 2))} 0123</div>${f.custom ? `<p class="legal">${t('declared')} ${t('legal')}</p>` : ''}${F.liveText ? `<p class="legal">${t('liveText')}</p>` : ''}</div>`}</div>
<div class="cols"><div><span class="mono mute">${t('sizesT')}</span><div class="scale" style="--c-ink:${L.ink};--accent:${L.accent}">${sizes}</div></div><div><span class="mono mute">${t('clear')}</span><div class="clear" style="color:${L.ink};--accent:${L.accent}"><div>${F.lockup}</div></div><p class="why" style="margin-top:10px">${t('clearRule')}</p></div></div>
<div class="files"><span class="mute" style="text-transform:uppercase;letter-spacing:.08em">${t('files')}</span>${files}<span class="k-sign">${K_MARK}<span>${t('measuredBy')} · ${esc((F.generated || '').slice(0, 10))}</span></span></div></div></main>`;
}
function bar() {
    const f = S.flow;
    if (f.status !== 'choose')
        return '';
    let sum = '', ok = false;
    if (f.step === 1) {
        const font = chosenFont();
        ok = !!ui.name && (S.markOnly || (!!font && (ui.font !== -1 || ui.licence))) && ui.count >= 3;
        sum = `<span>${t('name')} — ${esc(ui.name || '—')}</span>${S.markOnly ? '' : `<span>${t('font')} — ${esc(font?.family || '—')}</span><span>${t('drawn')} — ${ui.svg ? t('yes') : t('no')}</span>`}<span>${t('logos')} — ${ui.count}</span>`;
    }
    else if (f.step === 2) {
        ok = !!ui.concept;
        sum = `<span>${t('name')} — ${esc(S.selection.name)}</span><span>${t('logo')} — ${esc(ui.concept || '—')}</span>${S.markOnly ? '' : `<span>${t('writingShort')} — ${esc(ui.wordmark || t('yourFont'))}</span>`}`;
    }
    return `<footer class="bar pad"><div class="sum">${sum}</div><button type="button" class="go" data-act="confirm"${ok && !ui.sending ? '' : ' disabled'}>${ui.sending ? t('sending') : t('confirm')}</button>${ui.error ? `<div class="err">${esc(ui.error)}</div>` : ''}</footer>`;
}
function render() {
    if (!S) {
        root.innerHTML = '<p class="pad" style="padding-top:40px">…</p>';
        return;
    }
    loadFonts();
    document.documentElement.lang = S.locale || 'en';
    document.title = S.selection?.name ? `${S.selection.name} · kothar` : 'kothar';
    const f = S.flow;
    let body;
    if (f.status === 'final') {
        const v = ui.view ?? 3;
        const back = `<div class="readonly pad">${t('roStep')} <button type="button" class="btn" style="margin-left:12px" data-act="view" data-v="3">${t('backReport')}</button></div>`;
        body = v === 1 ? back + step1(true) : v === 2 ? back + step2(true) : report();
    }
    else if (f.status === 'working')
        body = loading();
    else
        body = f.step === 1 ? step1(false) : step2(false);
    const y = window.scrollY;
    root.innerHTML = `<div class="chrome">${top()}${steps()}</div>${body}${bar()}`;
    window.scrollTo(0, y);
    const key = `${f.status}-${f.step}-${f.status === 'final' ? ui.view ?? 3 : ''}`;
    if (key !== lastKey) {
        lastKey = key;
        flash('enter', 1500);
    }
    reveal();
}
// Motion helpers. Every click re-renders the page, so animations are triggered by short-lived classes on the root
// instead of running on every element each time.
let lastKey = '';
const timers = {};
function flash(cls, ms) {
    root.classList.remove(cls);
    void root.offsetWidth;
    root.classList.add(cls);
    window.clearTimeout(timers[cls]);
    timers[cls] = window.setTimeout(() => root.classList.remove(cls), ms);
}
let watcher = null;
function reveal() {
    watcher?.disconnect();
    if (S.flow.status !== 'final' || (ui.view ?? 3) !== 3 || !('IntersectionObserver' in window))
        return;
    watcher = new IntersectionObserver((entries) => { for (const e of entries)
        if (e.isIntersecting) {
            e.target.classList.add('seen');
            watcher?.unobserve(e.target);
        } }, { threshold: 0.12 });
    root.querySelectorAll('main .cols > div, main .vers, main .files').forEach((el) => { el.classList.add('reveal'); watcher?.observe(el); });
}
function adopt(next) {
    const changed = !S || S.flow.step !== next.flow.step || S.flow.status !== next.flow.status;
    S = next;
    if (changed) {
        ui.sending = false;
        ui.error = '';
        if (S.flow.status === 'choose' && S.flow.step === 2) {
            ui.concept = null;
            ui.wordmark = null;
            ui.viewConcept = null;
            ui.viewWord = undefined;
            ui.hintLogos = '';
            ui.hintWords = '';
            ui.keepLogos = (S.keptConcepts || []).filter((k) => S.concepts.some((c) => c.id === k));
            ui.keepWords = (S.keptWordmarks || []).filter((k) => S.wordmarks.some((c) => c.id === k));
        }
        if (S.flow.status === 'choose' && S.flow.step === 1 && S.names.length === 1)
            ui.name = S.names[0].name;
        // Whatever was chosen before comes back selected, so a second pass starts from the earlier choices.
        const sel = S.selection || {};
        if (S.flow.status === 'choose' && S.flow.step === 1) {
            ui.hintFonts = '';
            ui.font = 0;
            ui.keepFonts = (S.keptFonts || []).filter((k) => S.fonts.some((f) => f.family === k));
            if (sel.name && S.names.some((n) => n.name === sel.name))
                ui.name = sel.name;
            const fi = S.fonts.findIndex((f) => f.family === sel.font?.family);
            if (fi >= 0)
                ui.font = fi;
            else if (sel.font?.custom) {
                ui.font = -1;
                ui.custom = sel.font.family;
                ui.licence = true;
            }
            if (sel.count)
                ui.count = sel.count;
            if (sel.svgWordmark !== undefined)
                ui.svg = !!sel.svgWordmark;
        }
        if (S.flow.status === 'choose' && S.flow.step === 2) {
            if (S.concepts.some((c) => c.id === sel.concept))
                ui.concept = sel.concept;
            if (S.wordmarks.some((x) => x.id === sel.wordmark))
                ui.wordmark = sel.wordmark;
        }
        if (S.flow.status !== 'final')
            ui.view = null;
        window.scrollTo(0, 0);
    }
    render();
}
async function poll() {
    try {
        const r = await fetch(`/api/state?rev=${S ? S.rev : 0}`, { cache: 'no-store' });
        const j = await r.json();
        const was = ui.lost;
        ui.lost = false;
        if (!j.unchanged)
            adopt(j);
        else if (was)
            render();
    }
    catch {
        if (!ui.lost) {
            ui.lost = true;
            if (S)
                render();
        }
    }
}
async function confirmSelection() {
    const step = S.flow.step;
    const font = chosenFont();
    const data = step === 1 ? { name: ui.name, font: ui.font === -1 ? { ...font, licenseConfirmedByUser: ui.licence } : font, svgWordmark: ui.svg, count: ui.count }
        : { concept: ui.concept, wordmark: ui.wordmark };
    await send(data);
}
async function send(data) {
    const step = S.flow.step;
    ui.sending = true;
    ui.error = '';
    render();
    try {
        const r = await fetch('/api/select', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ step, data }) });
        const j = await r.json();
        if (!j.ok) {
            ui.sending = false;
            ui.error = j.error || 'error';
            render();
            return;
        }
        await poll();
    }
    catch (e) {
        ui.sending = false;
        ui.error = String(e.message);
        render();
    }
}
root.addEventListener('click', (ev) => {
    const el = ev.target.closest('[data-act]');
    if (!el || el.disabled)
        return;
    const act = el.dataset.act, v = el.dataset.v ?? '';
    if (act === 'view') {
        ui.view = Number(v);
        window.scrollTo(0, 0);
    }
    else if (act === 'replay') {
        const box = document.getElementById('k-anim');
        if (box) {
            const html = box.innerHTML;
            box.innerHTML = '';
            void box.offsetWidth;
            box.innerHTML = html;
        }
        return;
    }
    else if (act === 'confirm') {
        void confirmSelection();
        return;
    }
    else if (act === 'deliver') {
        void send({ deliver: true });
        return;
    }
    else if (act === 'restart') {
        if (window.confirm(t('restartAsk')))
            void send({ restart: true });
        return;
    }
    else if (act === 'regenf') {
        void send({ regenerate: 'fonts', hint: ui.hintFonts, keep: ui.keepFonts });
        return;
    }
    else if (act === 'keepf')
        ui.keepFonts = ui.keepFonts.includes(v) ? ui.keepFonts.filter((k) => k !== v) : [...ui.keepFonts, v];
    else if (act === 'regenl') {
        void send({ regenerate: 'logos', hint: ui.hintLogos, keep: ui.keepLogos });
        return;
    }
    else if (act === 'regenw') {
        void send({ regenerate: 'names', hint: ui.hintWords, keep: ui.keepWords });
        return;
    }
    else if (act === 'keepl')
        ui.keepLogos = ui.keepLogos.includes(v) ? ui.keepLogos.filter((k) => k !== v) : [...ui.keepLogos, v];
    else if (act === 'keepw')
        ui.keepWords = ui.keepWords.includes(v) ? ui.keepWords.filter((k) => k !== v) : [...ui.keepWords, v];
    else if (act === 'name')
        ui.name = v;
    else if (act === 'font')
        ui.font = Number(v);
    else if (act === 'count')
        ui.count = Number(v);
    else if (act === 'concept') {
        if (S.flow.status !== 'final')
            ui.concept = v;
        ui.viewConcept = v;
    }
    else if (act === 'wordmark') {
        if (S.flow.status !== 'final')
            ui.wordmark = v || null;
        ui.viewWord = v;
    }
    render();
    // the element just chosen answers the click
    root.querySelector(`[data-act="${act}"][data-v="${CSS.escape(v)}"]`)?.classList.add('pop');
    if (act === 'concept')
        flash('swap', 800);
    if (act === 'wordmark')
        flash('swapw', 700);
});
root.addEventListener('input', (ev) => {
    const el = ev.target;
    const k = el.dataset.in;
    if (!k)
        return;
    if (k === 'custom') {
        ui.custom = el.value;
        ui.font = el.value.trim() ? -1 : 0;
    }
    else if (k === 'hintLogos')
        ui.hintLogos = el.value;
    else if (k === 'hintFonts')
        ui.hintFonts = el.value;
    else if (k === 'hintWords')
        ui.hintWords = el.value;
    else if (k === 'count') {
        const n = Math.floor(Number(el.value));
        if (n >= 3 && n <= 24)
            ui.count = n;
    }
});
root.addEventListener('change', (ev) => {
    const el = ev.target;
    const k = el.dataset.in;
    if (k === 'licence')
        ui.licence = el.checked;
    else if (k === 'svg')
        ui.svg = el.checked;
    else if (k !== 'custom' && k !== 'count')
        return;
    render();
});
let timer = 0;
if (live) {
    void poll();
    timer = window.setInterval(() => { if (S?.delivered) {
        window.clearInterval(timer);
        return;
    } void poll(); }, 1200);
}
else
    render();
export {};
