# The animated logo

An optional piece: an animated version of the mark for a loading screen, a splash or a hover. Draw a motion that comes from the concept: a mountain rises and the echo answers, a hammer strikes and the dot rings, a ruler extends. One idea, about a second, then stillness. Each part settling in turn is a fair default when nothing better suggests itself.

## Rules

- **CSS only:** a `<style>` block with `@keyframes`. No SMIL, no scripts.
- **Respect reduced motion:** include `@media (prefers-reduced-motion: reduce)` setting `animation: none`.
- **Rest on the finished logo.** Write the final state in the attributes and animate *from* the hidden state with `animation-fill-mode: both`. A renderer that ignores CSS must show the complete logo.
- **Same `viewBox`, the same shapes and the same colours** as the static mark it animates.
- **Short and finite:** under about 3 seconds, no `infinite` unless it is deliberately a loader.
- Animate `transform` and `opacity`. Set `transform-box: fill-box; transform-origin: center` on parts that scale or rotate.

**Check it:** render the file with a long `--virtual-time-budget` (`rendering.md`) and compare the PNG with the static mark. They must look identical. Also render it with a short budget to see a middle frame.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
  <style>
    .base{transform-box:fill-box;transform-origin:50% 100%;animation:rise .5s cubic-bezier(.2,.8,.2,1) both}
    .echo{transform-box:fill-box;transform-origin:50% 100%;animation:ring .45s .45s cubic-bezier(.3,1.5,.5,1) both}
    @keyframes rise{from{transform:scaleY(0)}to{transform:none}}
    @keyframes ring{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:none}}
    @media (prefers-reduced-motion:reduce){.base,.echo{animation:none}}
  </style>
  <path class="base" fill-rule="evenodd" d="M8.24 214L89 74.12Q96 62 103 74.12L128.51 118.31L158.1 54.69Q164 42 169.9 54.69L244 214ZM84 214V196A44 44 0 0 1 172 196V214Z"/>
  <path class="echo" d="M108 214V196A20 20 0 0 1 148 196V214Z"/>
</svg>
```
