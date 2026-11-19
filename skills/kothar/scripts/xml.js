const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => {
    if (e[0] === '#')
        return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENT[e] ?? m;
});
const encAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const encText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const textNode = (text) => ({ tag: '', attrs: {}, children: [], text });
export const isText = (n) => n.text !== undefined;
export function parseXml(src) {
    src = src.replace(/^﻿/, '');
    const root = { tag: '#root', attrs: {}, children: [] };
    const stack = [root];
    const re = /<!--[\s\S]*?-->|<!\[CDATA\[([\s\S]*?)\]\]>|<\?[\s\S]*?\?>|<![^>]*>|<\/([^\s>]+)\s*>|<([^\s/>]+)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g;
    let m;
    let last = 0;
    while ((m = re.exec(src))) {
        if (m.index !== last)
            throw new Error(`malformed XML near offset ${last}`);
        last = re.lastIndex;
        const top = stack[stack.length - 1];
        if (m[1] !== undefined)
            top.children.push(textNode(m[1]));
        else if (m[2]) {
            if (top.tag !== m[2])
                throw new Error(`unexpected </${m[2]}>, open element is <${top.tag}>`);
            stack.pop();
        }
        else if (m[3]) {
            const node = { tag: m[3], attrs: {}, children: [] };
            const ar = /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
            let a;
            while ((a = ar.exec(m[4] || '')))
                node.attrs[a[1]] = decode(a[2] ?? a[3]);
            top.children.push(node);
            if (!m[5])
                stack.push(node);
        }
        else if (m[6] !== undefined && m[6].trim())
            top.children.push(textNode(decode(m[6])));
    }
    if (last !== src.length)
        throw new Error(`malformed XML near offset ${last}`);
    if (stack.length > 1)
        throw new Error(`unclosed <${stack[stack.length - 1].tag}>`);
    return root;
}
export function serialize(node) {
    if (node.text !== undefined)
        return encText(node.text);
    if (node.tag === '#root')
        return node.children.map(serialize).join('');
    const attrs = Object.entries(node.attrs).map(([k, v]) => ` ${k}="${encAttr(v)}"`).join('');
    if (!node.children.length)
        return `<${node.tag}${attrs}/>`;
    return `<${node.tag}${attrs}>${node.children.map(serialize).join('')}</${node.tag}>`;
}
export function walk(node, fn) {
    if (node.text !== undefined)
        return;
    if (node.tag !== '#root' && fn(node) === false)
        return;
    for (const c of node.children)
        walk(c, fn);
}
export const elements = (node) => node.children.filter((c) => c.text === undefined);
