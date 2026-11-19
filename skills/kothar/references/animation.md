# The animated logo


The report includes an animated version of the mark, which the user may or may not use (a loading screen, a splash, a hover). `kothar animate` writes a serviceable baseline to `.kothar/animation/mark-animated.svg`: each top-level part settles in turn and the second tone pops. `kothar report` uses that file if it exists and passes the checks. Its output includes `liveText`: `true` only when the name is set in a font whose file could not be had (a custom paid font), in which case `lockup.svg` keeps live text and the report says so.

Improve it by hand when the concept suggests a motion: a hammer strikes and the dot rings, a ruler extends, a wing unfolds, a letter is drawn. One idea, about a second, then stillness.

## Rules (checked by `kothar report`)

- **CSS only**: a `<style>` block with `@keyframes`. No SMIL, no scripts.
- **Respect reduced motion**: include `@media (prefers-reduced-motion: reduce)` that sets `animation: none`.
- **Rest on the finished logo.** Write the final state in the attributes and animate *from* the hidden state, with `animation-fill-mode: both`. A renderer that ignores CSS animation must show the complete logo; the audit renders the file without animation and compares it with the static mark (it must match 98%).
- **Same `viewBox`** as the mark, same shapes, same `currentColor` and `data-ink="accent"` (it is inked in black, white and grey like the static one).
- **Short and finite**: longest timing under about 3 seconds; no `infinite` unless it is deliberately a loader (the audit warns either way).
- Animate `transform` and `opacity`. Set `transform-box: fill-box; transform-origin: center` on parts that scale or rotate, so they move around their own centre.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
  <style>
    .sq{transform-box:fill-box;transform-origin:0 0;animation:draw .5s cubic-bezier(.2,.8,.2,1) both}
    .dot{transform-box:fill-box;transform-origin:center;animation:ring .45s .4s cubic-bezier(.3,1.6,.5,1) both}
    @keyframes draw{from{transform:scale(0)}to{transform:none}}
    @keyframes ring{from{opacity:0;transform:scale(0)}to{opacity:1;transform:none}}
    @media (prefers-reduced-motion:reduce){.sq,.dot{animation:none}}
  </style>
  <path class="sq" d="M8 8h48v14H22v34H8z"/>
  <circle class="dot" data-ink="accent" cx="43" cy="43" r="12"/>
</svg>
```
