# Kothar · logotipo

![Kothar](kothar-logo.svg)

Todo lo necesario para usar el logotipo, generado con kothar el 2026-11-19.

## La idea

**Kothar**: Kothar-wa-Khasis, el dios artesano de Ugarit: forjó las dos mazas de Baal y, antes de entregarlas, le puso nombre a cada una. El plugin hace los dos oficios del dios: le pone nombre a un producto y forja su logotipo, y no entrega la pieza hasta haberla medido.

**Escuadra y punto.** Lo que hace el plugin: poner una forma contra la escuadra y medirla antes de darla por buena.

## Archivos

| Archivo | Úsalo para |
|---|---|
| `kothar-mark.svg` | el logotipo en negro y gris, sobre fondos claros |
| `kothar-mark-on-dark.svg` | el logotipo en blanco y gris, sobre fondos oscuros |
| `kothar-mark-mono.svg` | el logotipo en una sola tinta |
| `kothar-logo.svg` | logotipo + nombre, sobre fondos claros |
| `kothar-logo-on-dark.svg` | logotipo + nombre, sobre fondos oscuros |
| `kothar-logo-mono.svg` | logotipo + nombre en una tinta |
| `kothar-wordmark-mono.svg` | el nombre solo, en una tinta |
| `kothar-mark-animated.svg` | el logotipo animado |
| `favicon.ico` | icono de pestaña del navegador |
| `favicon.svg` | icono de pestaña del navegador |
| `apple-touch-icon.png` | icono de pantalla de inicio, 180 px |
| `png/kothar-mark-16…512.png` | copias en píxeles del logotipo |
| `png/kothar-logo-800.png`, `-1600.png`, `-on-dark-1600.png` | copias en píxeles de logotipo + nombre |
| `og-image.png` | imagen de vista previa de enlaces, 1200 × 630 |

El nombre, la tipografía y el logotipo también están como datos en `tokens.json`.

## Qué versión usar

- Sobre fondos claros: los archivos en negro y gris.
- Sobre fondos oscuros o fotos: los archivos «on-dark», en blanco y gris.
- Cuando solo hay una tinta (grabado, sello, interfaz monocroma): los archivos de una tinta, que toman el color del texto que los rodea (`currentColor`).

## Negro, blanco y grises

El logotipo se entrega sin colores de marca, para que encaje con la paleta que elijas después para la web, el README o la app: una paleta cambia a menudo, un logotipo casi nunca. La forma principal va en la tinta más oscura; la segunda parte, si el logotipo la tiene, en gris.

| Parte | sobre fondos claros | sobre fondos oscuros |
|---|---|---|
| Fondo | `#FFFFFF` | `#000000` |
| Forma principal | `#111111` | `#F5F5F5` |
| Segunda parte | `#767676` | `#8C8C8C` |

Para aplicar colores de marca más adelante, parte del archivo de una tinta: da un color a la forma principal y otro a la segunda parte (`data-ink="accent"`), cada uno con al menos 3:1 de contraste con su fondo.

## Tipografía

**Manrope** 800 · licencia: OFL-1.1

## Tamaños

- Tamaño mínimo en que el logotipo se mantiene limpio: **16 px**.

## Zona de respeto

Deja libre al menos el 12 % del ancho del logotipo en cada lado. Nada más entra en esa zona.

## Logotipo animado

`kothar-mark-animated.svg`. Opcional. Úsalo una vez, al cargar o en una pantalla de inicio; respeta el ajuste de reducir movimiento y termina en el logotipo completo.

## No se debe

- colorear sus dos partes tan parecidas que ya no se distingan
- estirarlo, girarlo, contornearlo ni añadirle sombras o degradados
- ponerlo sobre un fondo donde baje de 3:1 de contraste
- redibujarlo ni reconstruirlo con una fuente

## Medido

- Logotipo o icono conocido más parecido: brand logo “Grid.ai” (0.682).
- Jueces ciegos que lo reconocieron: 3 / 3 (16 px: 3 / 3).
- Jueces ciegos que leyeron el nombre: 3 / 3.

El reporte completo de identidad está en `identity-report.html`.
