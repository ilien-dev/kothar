// Pixel-measured rules for a logo: does it survive small sizes, are its parts perceivable, is it balanced.
import { renderAlpha, tighten, threshold, count, invert, pad, open, topology, bbox } from './raster.js';
import { round } from './util.js';
const REF = 512;
// What each role has to survive. `basis` says what the size number refers to.
export const ROLES = {
    // The file used for favicons and small UI: the compact variant, or the only mark when there is no compact one.
    small: { basis: 'longest', sizes: [16, 24, 32, 48, 64, 128], target: 16, tolerate: 32, label: 'px wide' },
    // The full mark when a compact variant covers the small sizes.
    full: { basis: 'longest', sizes: [32, 48, 64, 96, 128, 256], target: 48, tolerate: 64, label: 'px wide' },
    // A wordmark: measured by its height, because that is what a navbar constrains.
    wordmark: { basis: 'height', sizes: [12, 16, 20, 24, 32, 48], target: 20, tolerate: 32, label: 'px tall' },
};
export const LIMITS = {
    lostWarn: 0.06, lostFail: 0.2, // share of ink (or of gaps) thinner than one device pixel
    iouWarn: 0.72, iouFail: 0.55, // how much of the shape survives the pixel grid
    densityLow: 0.12, densityHigh: 0.95,
    piecesWarn: 12, piecesFail: 24,
    aspectWarn: 2, aspectFail: 3,
    balanceInfo: 0.1, offCentreWarn: 0.04,
    // House values, not from the literature: no study gives a cut-off for "almost symmetric".
    nearSymmetryLow: 0.85, symmetryExact: 0.97,
};
/** How much of a shape coincides with its mirror image (intersection over union). The axis is tried a pixel or two
 *  either side of the centre, so a symmetric drawing is not marked down for how it fell on the pixel grid. */
export function mirror(M, w, h, axis) {
    let best = 0;
    for (let d = -2; d <= 2; d++) {
        let inter = 0, union = 0;
        for (let y = 0; y < h; y++)
            for (let x = 0; x < w; x++) {
                const mx = axis === 'leftRight' ? w - 1 - x + d : x, my = axis === 'topBottom' ? h - 1 - y + d : y;
                const a = M[y * w + x], b = mx >= 0 && mx < w && my >= 0 && my < h ? M[my * w + mx] : 0;
                if (a && b)
                    inter++;
                if (a || b)
                    union++;
            }
        if (union)
            best = Math.max(best, inter / union);
    }
    return best;
}
/** The widest erasing width (reference pixels, up to `max`) at which no more than the tolerated share is lost. */
function holds(lost, max) {
    if (lost(max) <= LIMITS.lostWarn)
        return max;
    let lo = 1, hi = max;
    for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        if (lost(mid) <= LIMITS.lostWarn)
            lo = mid;
        else
            hi = mid;
    }
    return lo;
}
export function measure(src, role = 'small') {
    const base = ROLES[role];
    const findings = [];
    const add = (rule, level, msg) => { findings.push({ rule, level, msg }); };
    let tight;
    try {
        tight = tighten(src);
    }
    catch (e) {
        return { findings: [{ rule: 'render', level: 'fail', msg: e.message }], metrics: {} };
    }
    if (tight.touches && role !== 'wordmark')
        add('clipped', 'warn', 'ink reaches the viewBox edge: something may be clipped, and the raw file has no breathing room');
    if (tight.offCentre > LIMITS.offCentreWarn && role !== 'wordmark')
        add('off-centre', 'warn', `artwork sits ${round(tight.offCentre * 100, 1)}% off the centre of its viewBox; recentre it so the raw file aligns in layouts`);
    // A stacked or very compact name is two lines tall: the same letters need twice the height.
    const k = role === 'wordmark' && tight.viewBox[2] / tight.viewBox[3] < 2.4 ? 2 : 1;
    const R = { ...base, sizes: base.sizes.map((n) => n * k), target: base.target * k, tolerate: base.tolerate * k };
    const ref = renderAlpha(tight.src, REF, R.basis);
    const M = threshold(ref.a);
    const ink = count(M);
    if (!ink)
        return { findings: [{ rule: 'render', level: 'fail', msg: 'nothing is painted' }], metrics: {} };
    const basisPx = R.basis === 'height' ? ref.h : Math.max(ref.w, ref.h);
    const P = 40;
    const pm = pad(M, ref.w, ref.h, P);
    const G = invert(pm.m), gapArea = count(G);
    const refTopo = topology(M, ref.w, ref.h);
    const sizes = R.sizes.map((size) => {
        const t = basisPx / size; // how many reference pixels one device pixel covers at this size
        const inkLost = 1 - count(open(M, ref.w, ref.h, t)) / ink;
        const gapLost = (gapArea - count(open(G, pm.w, pm.h, Math.min(t, 2 * P - 2)))) / ink;
        const small = renderAlpha(tight.src, size, R.basis);
        const sm = threshold(small.a);
        let inter = 0, union = 0;
        for (let y = 0; y < ref.h; y++) {
            const sy = Math.min(small.h - 1, Math.floor((y * small.h) / ref.h));
            for (let x = 0; x < ref.w; x++) {
                const s = sm[sy * small.w + Math.min(small.w - 1, Math.floor((x * small.w) / ref.w))], r = M[y * ref.w + x];
                if (s && r)
                    inter++;
                if (s || r)
                    union++;
            }
        }
        const iou = union ? inter / union : 0;
        const topo = topology(sm, small.w, small.h);
        const same = topo.pieces === refTopo.pieces && topo.holes === refTopo.holes;
        const level = inkLost > LIMITS.lostFail || gapLost > LIMITS.lostFail || iou < LIMITS.iouFail ? 'fail'
            : inkLost > LIMITS.lostWarn || gapLost > LIMITS.lostWarn || iou < LIMITS.iouWarn ? 'warn' : 'pass';
        return { size, level, inkLost: round(inkLost), gapLost: round(gapLost), iou: round(iou), pieces: topo.pieces, holes: topo.holes, topologyKept: same };
    });
    // Smallest size from which every larger size is clean.
    let minClean = null;
    for (let i = sizes.length - 1; i >= 0 && sizes[i].level === 'pass'; i--)
        minClean = sizes[i].size;
    const why = (s) => [
        s.inkLost > LIMITS.lostWarn && `${round(s.inkLost * 100, 1)}% of the ink is thinner than one pixel`,
        s.gapLost > LIMITS.lostWarn && `gaps worth ${round(s.gapLost * 100, 1)}% of the ink close up`,
        s.iou < LIMITS.iouWarn && `only ${Math.round(s.iou * 100)}% of the shape survives the pixel grid`,
    ].filter(Boolean).join('; ');
    const atTarget = sizes.find((s) => s.size === R.target);
    // The same test as a number: how wide the thin parts and the narrow gaps are at the target size.
    const tT = basisPx / R.target, gapMax = 2 * P - 2;
    const strokeRef = holds((t) => 1 - count(open(M, ref.w, ref.h, t)) / ink, basisPx / 4);
    const gapRef = holds((t) => (gapArea - count(open(G, pm.w, pm.h, t))) / ink, gapMax);
    const thinStrokePx = round(strokeRef / tT, 2), narrowGapPx = round(gapRef / tT, 2);
    const needs = [
        thinStrokePx < 1 && `thin parts are ≈ ${thinStrokePx} px wide at ${R.target} ${R.label} and need 1: make them ${round(1 / thinStrokePx, 1)}× thicker`,
        narrowGapPx < 1 && `narrow gaps are ≈ ${narrowGapPx} px and need 1: make them ${round(1 / narrowGapPx, 1)}× wider`,
    ].filter(Boolean).join('; ');
    if (minClean !== null && minClean <= R.target)
        add('size', 'pass', `holds from ${R.target} ${R.label} up`);
    else {
        const level = minClean !== null && minClean <= R.tolerate ? 'warn' : 'fail';
        const from = minClean === null ? `not even at ${R.sizes[R.sizes.length - 1]} ${R.label}` : `only from ${minClean} ${R.label}`;
        const fix = role === 'small' ? 'thicken or remove the thin parts, or add a compact variant for small sizes'
            : role === 'full' ? 'thicken strokes and widen gaps' : 'heavier strokes, wider gaps between letters, simpler letterforms';
        add('size', level, `clean ${from} (needs ${R.target}). At ${R.target}: ${why(atTarget) || 'ok'}. Fix: ${fix}${needs ? ` (${needs})` : ''}`);
    }
    // Topology on its own does not fail a size, but the viewer does see a different drawing: say so.
    if (!atTarget.topologyKept)
        add('topology', 'warn', `at ${R.target} ${R.label} it reads as ${atTarget.pieces} piece(s) with ${atTarget.holes} hole(s) instead of ${refTopo.pieces} with ${refTopo.holes}: a gap closes or a thin join breaks; widen that gap or thicken that join`);
    // Elements: separate pieces must each be at least a pixel at the target size.
    const sides = refTopo.areas.map((a) => Math.sqrt(a) / tT).sort((a, b) => a - b);
    const smallest = sides[0];
    if (smallest < 1)
        add('elements', 'fail', `${sides.filter((s) => s < 1).length} separate element(s) are smaller than one pixel at ${R.target} ${R.label} (smallest ≈ ${round(smallest, 2)} px): the viewer cannot perceive them; enlarge, merge or drop them`);
    else if (smallest < 1.5)
        add('elements', 'warn', `smallest separate element is ≈ ${round(smallest, 2)} px at ${R.target} ${R.label}; it will blur`);
    else
        add('elements', 'pass', `smallest separate element ≈ ${round(smallest, 1)} px at ${R.target} ${R.label}`);
    const metrics = {
        role, sizes, minCleanSize: minClean, pieces: refTopo.pieces, holes: refTopo.holes,
        aspect: round(ref.w / ref.h, 2), viewBoxFill: round(tight.fill, 2), smallestElementPx: round(smallest, 2),
        thinStrokePx, narrowGapPx,
    };
    if (role !== 'wordmark') {
        const density = ink / (ref.w * ref.h);
        metrics.density = round(density);
        if (density < LIMITS.densityLow)
            add('density', 'warn', `ink covers ${Math.round(density * 100)}% of its box: hairline artwork that fades on screens and photos`);
        else if (density > LIMITS.densityHigh)
            add('density', 'warn', `ink covers ${Math.round(density * 100)}% of its box: a plain block with no drawing in it`);
        if (refTopo.pieces > LIMITS.piecesFail)
            add('pieces', 'fail', `${refTopo.pieces} separate pieces: too fragmented to read as one sign`);
        else if (refTopo.pieces > LIMITS.piecesWarn)
            add('pieces', 'warn', `${refTopo.pieces} separate pieces; fewer, bolder shapes hold together as one sign`);
        const ar = Math.max(ref.w / ref.h, ref.h / ref.w);
        if (ar > LIMITS.aspectFail)
            add('aspect', 'fail', `proportion ${round(ar, 1)}:1 cannot sit in a square favicon or app icon`);
        else if (ar > LIMITS.aspectWarn)
            add('aspect', 'warn', `proportion ${round(ar, 1)}:1 wastes most of a square favicon`);
        let cx = 0, cy = 0;
        for (let y = 0; y < ref.h; y++)
            for (let x = 0; x < ref.w; x++)
                if (M[y * ref.w + x]) {
                    cx += x;
                    cy += y;
                }
        const bb = bbox(M, ref.w, ref.h);
        if (bb) {
            const off = Math.max(Math.abs(cx / ink - (bb.x0 + bb.x1) / 2) / ref.w, Math.abs(cy / ink - (bb.y0 + bb.y1) / 2) / ref.h);
            metrics.balanceOffset = round(off);
            // Symmetry is described, never scored: which one suits depends on the product. Only a near miss is worth a note.
            const sym = { leftRight: round(mirror(M, ref.w, ref.h, 'leftRight'), 2), topBottom: round(mirror(M, ref.w, ref.h, 'topBottom'), 2) };
            metrics.symmetry = sym;
            const [axis, s] = sym.leftRight >= sym.topBottom ? ['left-right', sym.leftRight] : ['top-bottom', sym.topBottom];
            if (s >= LIMITS.nearSymmetryLow && s < LIMITS.symmetryExact)
                add('symmetry', 'info', `almost mirror-symmetric ${axis} (${Math.round(s * 100)}% of the shape matches its reflection): a near miss tends to read as a mistake; make it exact, or break the symmetry clearly enough to look meant`);
            if (off > LIMITS.balanceInfo)
                add('balance', 'info', `visual weight sits ${Math.round(off * 100)}% away from the centre of the shape; fine if intended, otherwise it looks misaligned inside a circle or square`);
        }
    }
    return { findings, metrics, tight };
}
