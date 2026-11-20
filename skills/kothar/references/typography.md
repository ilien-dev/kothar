# Typography

The brand needs at most three families: a **display** face for the name in the lockups and for headings, a **text** face for documents and interfaces, and, for developer tools, a **mono** face. One family can play two roles.

## Choosing

Choose from the brief, not from habit. The adjectives, the references and the audience decide. A typeface is read as stable, friendly, technical, loud or classic before a single word is read. Look at the lettering in the user's references: weight, width, contrast, terminals, serif or not. Then pick a face with the same character. The name font must also suit the mark: similar stroke weight, and similar geometry or a deliberate contrast.

Use free families from Google Fonts (SIL Open Font License or Apache 2.0). They are free for commercial logos and can be loaded by the report and outlined by the render helper. A paid font only comes from the user, with their confirmation that their licence covers logo use.

Set the name with care: adjust the tracking (display faces at large sizes usually want -0.02 to -0.05 em), choose the case (lowercase reads friendlier, capitals more formal), and check the spacing optically between letter pairs. Name the weight you used.

## A starting list

Free families by character, with the weight that usually suits a name. Not exhaustive.

| Character | Families |
|---|---|
| Neutral sans | Inter 800, Inter Tight 800, Archivo 800, Onest 800, Schibsted Grotesk 800, Hanken Grotesk 800, Work Sans 800, Public Sans 800, IBM Plex Sans 700 |
| Geometric sans | Manrope 800, DM Sans 700, Outfit 800, Sora 800, Geologica 800, Red Hat Display 800, Lexend 800, Montserrat 800, Poppins 800 |
| Friendly or rounded | Plus Jakarta Sans 800, Figtree 700, Rubik 800, Nunito 800, Quicksand 700, Fredoka 700, Baloo 2 800, Comfortaa 700 |
| Technical | Space Grotesk 700, Chakra Petch 700, Rajdhani 700, Exo 2 800 |
| Heavy or condensed display | Archivo Black 400, Barlow Condensed 800, Oswald 700, Bebas Neue 400, Anton 400, Big Shoulders Display 800 |
| Expressive | Unbounded 800, Syne 800, Bricolage Grotesque 800 |
| Serif, classic | IBM Plex Serif 700, EB Garamond 800, Libre Baskerville 700, Lora 700, Newsreader 800 |
| Serif, elegant or soft | Playfair Display 800, DM Serif Display 400, Cormorant Garamond 700, Instrument Serif 400, Fraunces 700, Young Serif 400 |
| Slab | Bitter 800, Zilla Slab 700, Roboto Slab 800 |
| Inscriptional | Cinzel 800, Marcellus 400 |
| Mono | JetBrains Mono, IBM Plex Mono, Space Mono, DM Mono, Fira Code, Red Hat Mono, Roboto Mono |

## Files the other steps need

- **In the report:** a Google Fonts CSS link, `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap` (spaces become `+`, one `family=` per family).
- **For outlining the name** (`rendering.md`): a static TTF of the exact weight, from Fontsource on jsDelivr: `https://cdn.jsdelivr.net/fontsource/fonts/<id>@latest/latin-<weight>-normal.ttf`, where `<id>` is the family in lowercase with hyphens (`space-grotesk`, `inter-tight`). For names with accented or non-Latin letters, use `latin-ext-`, `cyrillic-` and so on as needed.
