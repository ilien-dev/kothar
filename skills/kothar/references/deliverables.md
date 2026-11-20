# Deliverables

Everything goes into `assets/brand/` (or `brand/`), named `<name>-<piece>-<variant>`, where `<name>` is the brand name in lowercase ASCII with hyphens. Every file is made from the chosen mark, palette and fonts. The name in lockups and pieces is outlined (`rendering.md`).

## The core, always

```
assets/brand/
├─ logo/
│  ├─ <name>-symbol.svg                 master, one ink (currentColor)
│  ├─ <name>-symbol-small.svg           small-size cut, if drawn
│  ├─ <name>-symbol-color.svg           for light grounds (on a tile if the brand colour fails on light)
│  ├─ <name>-symbol-on-dark.svg
│  ├─ <name>-symbol-black.svg  -white.svg
│  ├─ <name>-horizontal.svg  -horizontal-on-dark.svg  -horizontal-black.svg  -horizontal-white.svg
│  ├─ <name>-stacked.svg  -stacked-on-dark.svg  -stacked-black.svg  -stacked-white.svg
│  ├─ <name>-wordmark.svg               the name alone, outlined
│  └─ png/  symbol 64, 128, 256, 512, 1024 · horizontal 800, 1600 (transparent)
├─ web/
│  ├─ favicon.svg  favicon.ico (16, 32, 48)  favicon-32.png
│  ├─ apple-touch-icon.png (180)  icon-192.png  icon-512.png  maskable-512.png
│  ├─ og-image.png (1200×630)
│  ├─ site.webmanifest
│  └─ head-snippet.html                 the <link> and <meta> tags to paste
├─ tokens.json
├─ README.md
└─ brand-book.html
```

- **Lockups:** horizontal (symbol, then the name; the gap and the height of the name are set from a unit of the mark, such as half the cave in Eco) and stacked. Fix the proportions once and reuse them everywhere.
- **Icons:** app icons and the favicon use the small cut on a tile of the brand colour or of ink, with a 10-12% safe margin. `maskable-512.png` keeps the mark inside the central 80% circle.
- **`tokens.json`:**
  ```json
  { "name": "eco",
    "colors": { "brand": "#C4F03A", "onBrand": "#151515", "ink": "#151515", "paper": "#F4F4F2" },
    "fonts": { "name": { "family": "Space Grotesk", "weight": 700, "tracking": "-0.045em" },
               "text": { "family": "Inter" }, "mono": { "family": "JetBrains Mono" } },
    "generator": "kothar · https://github.com/ilien-dev/kothar" }
  ```
- **`README.md`:** what each file is for, the colours with their contrast, the minimum sizes, the clear space, which version goes on which ground, what not to do, and on its last line the credit (`report.md`, "Credits").

## Social networks, as selected

Sizes checked against each platform's documentation in November 2026. Rows marked *guide* come from a reputable guide, because the platform publishes no size. Platforms change these, so if a size looks off, check the platform's help page.

| Network | File | Pixels | Notes |
|---|---|---|---|
| GitHub | `social/github-social-preview.png` | 1280×640 | Repository social preview. Under 1 MB, solid background |
| GitHub | `social/github-avatar.png` | 500×500 | Organisation or profile avatar, square |
| X | `social/x-avatar.png` | 400×400 | Circle crop |
| X | `social/x-header.png` | 1500×500 | Top and bottom 60 px may be cropped |
| LinkedIn | `social/linkedin-logo.png` | 400×400 | Shown on light and dark; transparency becomes white |
| LinkedIn | `social/linkedin-cover.png` | 1512×256 | Keep content central, away from the lower right |
| Facebook | `social/facebook-profile.png` | 320×320 | Circle crop |
| Facebook | `social/facebook-cover.png` | 851×315 | The profile picture covers the lower left on phones |
| Instagram | `social/instagram-profile.png` | 320×320 *guide* | Circle crop |
| Instagram | `social/instagram-post.png` | 1080×1350 | 4:5, plus `instagram-post-square.png` 1080×1080 |
| TikTok | `social/tiktok-avatar.png` | 720×720 *guide* | Circle crop; TikTok states only a minimum |
| YouTube | `social/youtube-avatar.png` | 800×800 *guide* | Circle crop, shown at 98 px |
| YouTube | `social/youtube-banner.png` | 2560×1440 | Text and the mark inside the central 1235×338 safe area |
| Discord | `social/discord-icon.png` | 512×512 *guide* | Circle crop |
| Discord | `social/discord-banner.png` | 960×540 | Avoid text; needs a boosted server |
| Bluesky | `social/bluesky-avatar.png` | 1000×1000 *guide* | Under 1 MB |
| Bluesky | `social/bluesky-banner.png` | 3000×1000 *guide* | Under 1 MB, content central |
| Mastodon | `social/mastodon-avatar.png` | 400×400 | |
| Mastodon | `social/mastodon-header.png` | 1500×500 | |
| Threads | `social/threads-profile.png` | 320×320 *guide* | Often imported from Instagram |
| Reddit | `social/reddit-icon.png` | 300×300 | |
| Reddit | `social/reddit-banner.png` | 1080×128 | |
| Product Hunt | `social/producthunt-thumbnail.png` | 240×240 | The first frame must work alone |
| Product Hunt | `social/producthunt-gallery.png` | 1270×760 | |

Avatars are the symbol (or its small cut) on the brand colour or ink, centred with generous margin so a circle crop does not cut it. Banners and covers carry the lockup or the symbol and the tagline, never more. Leave the networks' crop zones empty.

## Stationery, as selected

Each piece is an HTML page that prints to PDF from the browser (`@page` with the paper size and `margin: 0`), plus a PDF made with headless printing when a browser is available: add `--print-to-pdf="<abs>/file.pdf" --no-pdf-header-footer` instead of `--screenshot`.

| Piece | Files | Notes |
|---|---|---|
| Letterhead | `stationery/letterhead-a4.html` `-letter.html` (+ `.pdf`) | The lockup at the top, the contact line at the foot, a wide text area |
| Contract template | `stationery/contract.html` (+ `.pdf`) | **Layout only:** title, parties, numbered clause headings, signature block, page numbers. Placeholder text such as `[Clause]`, never legal wording |
| Business card | `stationery/business-card.html` (+ `.pdf`), front and back | 85×55 mm (or 3.5×2 in), 3 mm bleed |
| Email signature | `stationery/email-signature.html` | Table layout, inline styles, the symbol as a hosted PNG (say where to host it), under 600 px wide |
| Invoice | `stationery/invoice.html` (+ `.pdf`) | Header, a line-items table, totals, payment details as placeholders |
| Presentation slide | `stationery/slide.html` (+ `.png` 1920×1080) | A title slide and a content slide |

Placeholders are always in brackets (`[Name]`, `[Address]`), so nothing invented passes for real data.

## The animated logo, if selected

`motion/<name>-animated.svg` (`animation.md`).
