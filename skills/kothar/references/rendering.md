# Rendering with the browser already on the machine

A Chromium-based browser (Chrome, Edge, Brave, Chromium) can run without a window. That one program gives you everything the skill needs, with nothing to install:

- **PNGs:** a screenshot of a small HTML page that has the exact pixel size of the piece and loads the brand fonts.
- **The name as outlines** and the **`.ico`:** `assets/render.html`, a helper page next to this skill, does both and writes the result into the page, which the browser prints with `--dump-dom`.

## Find the browser

Try in order and keep the first that exists:

- **Windows:** `C:\Program Files\Google\Chrome\Application\chrome.exe`, `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`, `C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe`, the same paths under `%LOCALAPPDATA%`, then `where chrome msedge brave`.
- **macOS:** `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, `/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge`, `/Applications/Brave Browser.app/Contents/MacOS/Brave Browser`, `/Applications/Chromium.app/Contents/MacOS/Chromium`.
- **Linux:** `google-chrome`, `chromium`, `chromium-browser`, `microsoft-edge`, `brave-browser` on the `PATH`.

None found: see "When things are not ideal" in `SKILL.md`.

Paths in the commands below are absolute. `<skill>` is the folder this skill was loaded from, the one holding `SKILL.md` (in Claude Code, `${CLAUDE_SKILL_DIR}`). `<abs>` is the product's folder. A file URL on Windows is `file:///C:/Users/me/project/.kothar/render/og.html`, with forward slashes.

## A PNG

Write one page per piece in `.kothar/render/<piece>.html`, sized exactly:

```html
<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=block" rel="stylesheet">
<style>html,body{margin:0;width:1280px;height:640px;overflow:hidden}
body{background:#151515;color:#F4F4F2;display:flex;align-items:center;gap:48px;padding:0 120px;box-sizing:border-box;font-family:'Space Grotesk'}</style>
</head><body><!-- the mark as inline SVG, the name, the tagline --></body></html>
```

```
"<browser>" --headless=new --disable-gpu --hide-scrollbars --window-size=1280,640 --virtual-time-budget=8000 --screenshot="<abs>/assets/brand/social/github-social-preview.png" "file:///<abs>/.kothar/render/og.html"
```

- `--window-size` is the PNG's size in pixels. The page must fill it exactly.
- `--virtual-time-budget` gives the fonts time to load. Use `display=block` in the font URL so text never renders in a fallback face.
- For a **transparent** PNG (logo files, icons without a tile), add `--default-background-color=00000000` and leave the page background unset.
- A plain SVG file can be screenshotted directly, without a wrapper page, when it carries no live text.

**To look at your own work,** write `.kothar/render/sheet.html`: every concept at 512 px and at 64, 32 and 16 px, on paper and on ink, with `image-rendering: pixelated` on an enlarged copy of the 16 px version. Screenshot it to `.kothar/render/sheet-v<n>.png` (one per round, so rounds can be compared) and open the PNG with your file-reading tool.

**To look at a report,** screenshot it with `--window-size=1200,<height>`, where the height is 80 plus 654 per page (each page is 630 px plus a 24 px gap). Split a long screenshot into parts to read it. Or print it with `--print-to-pdf` (one page per slide) and check the page count.

## The name as outlines, and the .ico

Write a job file `.kothar/render/job.js`:

```js
window.KOTHAR_JOB = {
  outline: [
    { font: "https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-700-normal.ttf",
      text: "eco", size: 200, tracking: -0.045 }
  ],
  ico: { svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>…the favicon artwork, colours explicit…</svg>",
         sizes: [16, 32, 48] }
};
```

Run the helper and keep what it prints:

```
"<browser>" --headless=new --disable-gpu --virtual-time-budget=15000 --dump-dom "file:///<skill>/assets/render.html?job=file:///<abs>/.kothar/render/job.js" > "<abs>/.kothar/render/result.html"
```

The element `<pre id="out">` in `result.html` holds one JSON object:

- `status`: `ok`, or `error` with a `message` (offline, a wrong font URL, a bad SVG).
- `outline[i]`: `d` is the name as one path with its baseline at y = 0 and its first letter starting at x = 0. `bbox` is `[x1, y1, x2, y2]` (y is negative above the baseline), and `advance` is the width including tracking. Place it in the lockup with `<path transform="translate(x y)" d="…"/>`. Outlined text needs no font on any machine.
- `ico.base64`: the `.ico` file, PNG entries at the listed sizes. Decode it into `assets/brand/web/favicon.ico`:
  - bash: `base64 -d > favicon.ico`
  - PowerShell: `[IO.File]::WriteAllBytes("<abs>\favicon.ico", [Convert]::FromBase64String($b64))`

If the status is `error` because the machine is offline, keep live `<text>` in the lockups with `font-family` set to the brand face, and tell the user.

## Opening a page for the user

Open the report with the system's default browser, not headless:

- Windows: `start "" "<abs>\.kothar\proposals.html"` (PowerShell: `Start-Process "<abs>\.kothar\proposals.html"`)
- macOS: `open "<abs>/.kothar/proposals.html"`
- Linux: `xdg-open "<abs>/.kothar/proposals.html"`

Also print the path, in case nothing opens (a remote machine, no desktop).
