// Typeface psychology: product traits in, fonts out. First the classes the traits call for, then the agent's
// judgement over what is left, then chance; a font shown once is never offered again.
import path from 'node:path';
import { ASSETS, readJson, round, die, fold } from './util.js';
import { data as traitData } from './traits.js';
export const fontData = () => readJson(path.join(ASSETS, 'fonts.json'));
const option = (f, basis, why) => ({ family: f.family, weight: f.weight, free: true, license: f.license || 'OFL-1.1', basis, class: f.class, why });
/** Score every typeface class against the product's traits. */
export function rankClasses(traits, kind) {
    const D = fontData().psychology, vocab = traitData().traits;
    const unknown = Object.keys(traits).filter((t) => !vocab[t]);
    if (unknown.length)
        die(`unknown trait(s): ${unknown.join(', ')}. Valid: ${Object.keys(vocab).join(', ')}`);
    if (!D.kinds[kind])
        die(`product.kind must be one of: ${Object.keys(D.kinds).join(', ')}`);
    return Object.entries(D.classes).map(([name, c]) => {
        let score = D.kinds[kind][name] || 0;
        const from = [];
        for (const [t, w] of Object.entries(traits)) {
            const a = c.traits[t];
            if (!a || w <= 0)
                continue;
            score += Math.min(3, w) * a * (c.source === 'convention' ? 0.7 : 1);
            if (a > 0)
                from.push(`${t} ${w}`);
        }
        return { name, score: round(score, 2), from };
    }).sort((a, b) => b.score - a.score);
}
/** Fonts the traits call for, best class first, taking one from each class in turn so a batch is never five of a kind. */
export function aligned(traits, kind) {
    const classes = rankClasses(traits, kind);
    const top = classes[0]?.score || 0;
    if (top <= 0)
        return [];
    const good = classes.filter((c) => c.score >= top * 0.45).slice(0, 4);
    const byClass = good.map((c) => fontData().families.filter((f) => f.class === c.name).map((f) => option(f, 'psychology', `${c.name}: ${c.from.join(', ') || kind}`)));
    const out = [];
    for (let i = 0; byClass.some((l) => l[i]); i++)
        for (const l of byClass)
            if (l[i])
                out.push(l[i]);
    return out;
}
/** The next fonts to offer, given what has already been shown and what the user asked to keep. */
export function nextFonts(prev, traits, kind, count, keep) {
    const same = prev && JSON.stringify(prev.traits) === JSON.stringify(traits) && prev.kind === kind;
    const served = new Set([...(same ? prev.served : prev?.served || []), ...keep].map(fold));
    const plan = { traits, kind, served: [...(prev?.served || [])], mode: 'psychology', judged: prev?.judged || 0, keep, count };
    const fresh = (list) => list.filter((f) => !served.has(fold(f.family)));
    const all = fontData().families;
    const fits = fresh(aligned(traits, kind));
    if (fits.length >= count) {
        const options = fits.slice(0, count);
        plan.served.push(...options.map((o) => o.family));
        return { plan, options, note: 'Chosen from the typeface classes this product\'s traits call for. Offer them as they are.' };
    }
    const left = fresh(all);
    if (!left.length) {
        plan.mode = 'exhausted';
        return { plan, note: 'Every free font in the list has been shown. If the user still wants others, propose families from outside the list, each verified with "kothar font check", none of them shown before.' };
    }
    if (plan.judged < 3 && left.length > count) {
        plan.mode = 'judgement';
        const rank = new Map(rankClasses(traits, kind).map((c, i) => [c.name, i]));
        const candidates = left.sort((a, b) => (rank.get(a.class) ?? 99) - (rank.get(b.class) ?? 99)).map((f) => ({ family: f.family, class: f.class, style: f.style }));
        return { plan, candidates, note: `The fonts the traits call for are used up. From the candidates (best-matching classes first) choose the ${count} you judge would suit this product, its name and its audience, then run: kothar font plan --pick "Family A|Family B"` };
    }
    plan.mode = 'random';
    const pool = [...left];
    const options = [];
    while (options.length < count && pool.length)
        options.push(option(pool.splice(Math.floor(Math.random() * pool.length), 1)[0], 'random'));
    plan.served.push(...options.map((o) => o.family));
    return { plan, options, note: 'Psychology and judgement are used up: these are drawn at random from the fonts not shown yet.' };
}
/** Record the fonts the agent picked in judgement mode. */
export function pick(plan, families) {
    const all = fontData().families, shown = new Set(plan.served.map(fold));
    const out = families.map((name) => {
        const f = all.find((x) => fold(x.family) === fold(name)) || die(`"${name}" is not in the list of free fonts; pick from the candidates`);
        if (shown.has(fold(f.family)))
            die(`"${f.family}" was already shown to the user; pick another`);
        return option(f, 'judgement');
    });
    plan.served.push(...out.map((o) => o.family));
    plan.judged += 1;
    return out;
}
