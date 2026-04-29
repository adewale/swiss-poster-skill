---
name: swiss-poster
description: Apply a Swiss Poster design system using Tailwind CSS. Use when asked to style a webpage with poster-style layouts where elements break the grid, overlap, bleed off edges, and use extreme typographic scale. Implements IBM Plex Sans, stone color palette, opacity hierarchy, and compositional techniques from Weingart, Troxler, Hofmann, and Odermatt & Tissi.
license: MIT
metadata:
  author: adewale
  version: "2.0"
---

# Swiss Poster Design System

A design system based on Swiss poster design from the 1950s through 1980s: grotesque type at extreme scales, layouts that break the grid, overlapping layers, diagonal energy, and cropped forms. Draws on Weingart, Troxler, Odermatt & Tissi, Hofmann, and Ruder.

## Six Principles

1. **Grid as launchpad.** Start with a 12-column grid, then let key elements escape it. Oversized type, images, and color blocks should break column boundaries, overlap neighbors, or bleed off the viewport edge. The grid exists so the breakout has meaning.
2. **Extreme scale contrast.** Place 20rem display type next to 11px labels. A single word can fill the viewport width. The tension between massive and tiny *is* the hierarchy. Never settle for moderate size differences.
3. **Overlap and layer.** Elements should collide — text over images, type over type, color blocks overlapping content. Use `relative`/`absolute` positioning, negative margins, and z-index stacking to create depth.
4. **Bleed and crop.** Let elements escape their containers. Type cropped by the viewport edge, images that extend past the layout, color blocks that run off-screen. A composition that's cut off implies it continues beyond the frame.
5. **One accent, used boldly.** Each project gets exactly one accent color, but where the International Style uses it sparingly, poster style uses it in large, confident fields — full-width bands, oversized shapes, dramatic backgrounds.
6. **Tension over comfort.** Asymmetric whitespace, unexpected element placement, rotated text, diagonal compositions. The layout should feel dynamic and slightly unresolved, not settled and safe.

---

## Typography

**Primary font:** IBM Plex Sans (Google Fonts)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap" rel="stylesheet">
```

**Fallback chain** (in order of preference):

| Font | Source | Character |
| ---- | ------ | --------- |
| IBM Plex Sans | Google Fonts | Primary. Rational, slightly condensed, 1960s systems rationalism |
| Hanken Grotesk | Google Fonts | Closest to Neue Haas Grotesk lineage |
| Barlow | Google Fonts | Condensed Swiss-grid proportions, strong vertical rhythm |
| Host Grotesk | Google Fonts | Warm grotesque, good at all sizes |
| DM Sans | Google Fonts | Clean neo-grotesque fallback |
| system-ui | Built-in | Last resort |

```css
font-family: 'IBM Plex Sans', 'Hanken Grotesk', 'Barlow', 'Host Grotesk', 'DM Sans', system-ui, sans-serif;
```

**Type scale — poster range:**

The poster style uses a wider range of sizes than the International Style, and the gaps between levels are deliberately extreme.

| Role | Tailwind | Weight | Line height | Notes |
| ---- | -------- | ------ | ----------- | ----- |
| Mega | `text-[clamp(6rem,15vw,20rem)]` | `font-bold` or `font-thin` | `leading-[0.85]` | Viewport-scale type. One word or short phrase. |
| Display | `text-7xl md:text-8xl lg:text-9xl` | `font-light` or `font-bold` | `leading-none` | Section anchors |
| H1 | `text-5xl md:text-6xl` | `font-light` | `leading-tight` | Page titles |
| H2 | `text-4xl` | `font-light tracking-tight` | `leading-snug` | Section headings |
| H3 | `text-2xl` | `font-normal` | `leading-snug` | Subsections |
| Body | `text-base font-normal` | `font-normal` | `leading-relaxed` | `max-w-[60ch]` |
| Small | `text-sm font-normal` | `font-normal` | `leading-relaxed` | `max-w-[60ch]` |
| Caption | `text-xs tracking-widest uppercase` | `font-normal` | `leading-normal` | Labels, metadata |
| Mono | `font-mono text-sm` | `font-normal` | `leading-relaxed` | Code, data |
| Label | `text-[11px] tracking-widest uppercase` | `font-medium` | `leading-none` | Smallest text |

**Key differences from International Style:**
- **Bold is allowed — encouraged — at display sizes.** `font-bold` and even `font-thin` (100) create dramatic weight contrast. Use bold for mega/display type that dominates the composition.
- **Extreme size jumps.** A 20rem heading next to 11px labels is correct. Moderate size differences feel timid.
- **Tight leading at large sizes.** Display type uses `leading-[0.85]` or `leading-none` — letters should nearly collide vertically.
- **Type as image.** At poster scale, letterforms become graphic elements. A single word at 20rem is a shape, a texture, a compositional anchor.

---

## Color System

### Stone palette (light mode → dark mode)

| Role | Light | Dark | Tailwind |
| ---- | ----- | ---- | -------- |
| Page background | `stone-50` | `stone-950` | `bg-stone-50 dark:bg-stone-950` |
| Surface / card | `stone-100` | `stone-900` | `bg-stone-100 dark:bg-stone-900` |
| Subtle surface | `stone-200` | `stone-800` | `bg-stone-200 dark:bg-stone-800` |
| Border | `stone-200` | `stone-800` | `border-stone-200 dark:border-stone-800` |
| Primary text | `stone-900` | `stone-50` | `text-stone-900 dark:text-stone-50` |
| Secondary text | `stone-900/70` | `stone-50/70` | `text-stone-900/70 dark:text-stone-50/70` |
| Tertiary text | `stone-900/40` | `stone-50/40` | `text-stone-900/40 dark:text-stone-50/40` |

### Opacity hierarchy

To de-emphasize text, reduce opacity — never change the hue.

```
Full presence:   text-stone-900          (primary)
Softer:          text-stone-900/70       (secondary, labels)
Quiet:           text-stone-900/40       (tertiary, captions)
Ghosted:         text-stone-900/20       (disabled, placeholder)
```

Dark mode: replace `stone-900` with `stone-50`. The opacity values stay identical.

### Accent color

Each project uses **one** accent color. Default is Swiss poster red.

| Name | Hex | Tailwind arbitrary |
| ---- | --- | ------------------ |
| Swiss Red (default) | `#C8102E` | `[#C8102E]` |
| Cobalt | `#003B8E` | `[#003B8E]` |
| Golden | `#F0B429` | `[#F0B429]` |
| Forest | `#2D6A4F` | `[#2D6A4F]` |

**Poster-style accent usage — bolder than International Style:**

```
Full field:  bg-[#C8102E]                Full-width bands, large shapes, hero backgrounds
Overlay:     bg-[#C8102E]/80            Translucent overlay on images or sections
Muted:       bg-[#C8102E]/60            Hover states, secondary elements
Tint:        bg-[#C8102E]/20            Background washes, card tints
Ghost:       bg-[#C8102E]/10            Very subtle tints
```

The poster style permits large accent surfaces. A full-width red band, a half-page accent block, or accent type at mega scale are all correct. The International Style limited accent to 10–15% of visual surface; poster style can push to 30–40% when the composition demands it.

---

## Grid & Breakout

**Base unit:** 8px. Spacing is multiples of 8, but elements are free to escape the grid.

### The grid is a starting point

```html
<!-- Standard 12-column grid — the foundation -->
<div class="grid grid-cols-12 gap-4 md:gap-8">
  <div class="col-span-12 md:col-span-8">...</div>
  <div class="col-span-12 md:col-span-4">...</div>
</div>
```

### Breaking the grid (the goal)

Elements escape their grid cells using negative margins, absolute positioning, and overflow:

```html
<!-- Type that bleeds left out of its container -->
<div class="max-w-6xl mx-auto px-8 relative">
  <h1 class="text-[clamp(6rem,15vw,20rem)] font-bold leading-[0.85] -ml-[0.04em] text-stone-900 dark:text-stone-50">
    PLAKAT
  </h1>
</div>

<!-- Element that escapes its column into the neighbor -->
<div class="grid grid-cols-12 gap-8">
  <div class="col-span-5 relative">
    <div class="absolute -right-24 top-0 w-64 h-64 bg-[#C8102E]"></div>
  </div>
  <div class="col-span-7">...</div>
</div>

<!-- Full-bleed accent band that ignores the container -->
<div class="bg-[#C8102E] -mx-[100vw] px-[100vw] py-16">
  <div class="max-w-6xl mx-auto">...</div>
</div>
```

### Overlap patterns

```html
<!-- Text overlapping a color block -->
<div class="relative">
  <div class="w-2/3 h-64 bg-[#C8102E]"></div>
  <h2 class="absolute -bottom-8 right-0 text-7xl font-bold text-stone-900 dark:text-stone-50">
    Gestaltung
  </h2>
</div>

<!-- Stacked layers with offset -->
<div class="relative">
  <div class="bg-stone-200 dark:bg-stone-800 p-12 ml-16 mt-16">Content</div>
  <div class="absolute top-0 left-0 w-32 h-32 bg-[#C8102E]"></div>
</div>
```

---

## Rotation & Diagonal Energy

Rotated elements create movement and break the horizontal/vertical monotony:

```html
<!-- Rotated section label -->
<span class="text-xs tracking-widest uppercase text-stone-900/40 -rotate-90 origin-left">
  Section 01
</span>

<!-- Diagonal accent bar -->
<div class="w-full h-2 bg-[#C8102E] -rotate-3 scale-110 origin-center"></div>

<!-- Rotated display type as background texture (8–12% opacity minimum) -->
<div class="absolute -rotate-12 text-[12rem] font-bold text-stone-900/[0.10] dark:text-stone-50/[0.10] select-none pointer-events-none">
  POSTER
</div>
```

---

## Responsive Design

Every layout must work at 320px and 1440px. The poster drama scales — it doesn't disappear on mobile.

**Breakpoint strategy:**

| Prefix | Width | Use for |
| ------ | ----- | ------- |
| (none) | 0px+ | Mobile — single column, but still dramatic scale |
| `sm:` | 640px+ | Large phones — overlaps begin to appear |
| `md:` | 768px+ | Tablets — 2-col layouts, full overlap compositions |
| `lg:` | 1024px+ | Desktop — full poster compositions, maximum scale contrast |

**Mobile poster rules:**
- Mega type scales down but stays dominant: `text-5xl sm:text-7xl md:text-8xl lg:text-[12rem]`
- Overlaps simplify: stack vertically, reduce offsets
- Bleeds still work: full-width accent bands remain full-width
- Rotation reduces: `rotate-0 md:-rotate-3`
- Grid breaks simplify: negative margins reduce on small screens

**Fluid type pattern:**

```html
<!-- Poster-scale fluid type -->
<h1 class="text-[clamp(3rem,12vw,16rem)] font-bold leading-[0.85] tracking-tight">
  ZÜRICH
</h1>
```

---

## Dark Mode

Use Tailwind's `media` strategy (respects system preference automatically):

```js
// tailwind.config.js
darkMode: 'media'
```

Every color token has a `dark:` variant. See the stone palette table above. Never use `bg-black` or `bg-white` — always use stone scale.

**Poster sections with inverted backgrounds** are common: a `bg-stone-900 dark:bg-stone-50` section inside a light page creates dramatic contrast without relying on dark mode.

---

## Gotchas

- **The grid must exist before you break it.** Every layout starts with `grid grid-cols-12`. Breakout elements use negative margins, absolute positioning, or overflow to escape — they don't ignore the grid entirely.
- **Scale contrast must be extreme.** If your largest and smallest text are within 3× size difference, you're still in International Style territory. Aim for 10×+ (e.g., 12rem heading / 11px label).
- **Overlap needs a clear layer order.** Every overlapping composition must have a deliberate `z-10`, `z-20`, `z-30` stacking. Random overlap looks like a bug.
- **Bleed needs `overflow-hidden` on the parent.** Escaped elements must not cause horizontal scroll. Apply `overflow-hidden` to the section or page wrapper.
- **Bold at display sizes, light at body.** `font-bold` / `font-thin` are for mega/display type only. Body text stays `font-normal`. This is the opposite of the International Style's "never bold" rule.
- **Rotation is seasoning, not the meal.** One or two rotated elements per section maximum. Over-rotation feels gimmicky, not Swiss.
- **Accent fields can be large.** Full-width bands, half-page blocks, oversized shapes — poster style embraces large accent surfaces that the International Style would forbid.
- **No border-radius on structural elements.** The poster style is still rectilinear. No `rounded-lg`, no pills. `rounded-none` or at most `rounded-sm`.
- **Never `bg-white` or `bg-black`.** Use `bg-stone-50` / `bg-stone-950`.
- **One accent per project.** Even with bolder usage, the discipline of a single accent remains.
- **Touch targets minimum 44px.** All interactive elements must remain usable despite the dramatic compositions.
- **Every layout must work on mobile.** Poster drama scales down gracefully. Overlaps simplify, mega type shrinks (but stays dominant), bleeds remain.

---

## When to read reference files

| Task | File |
| ---- | ---- |
| Full color token table, CSS custom properties, dark mode details | `references/design-system.md` |
| Tailwind component patterns: buttons, cards, nav, forms, poster compositions | `references/components.md` |
| Paste-ready `tailwind.config.js` and CSS `@theme` block | `references/tailwind-config.md` |
| Designer research, key works, source URLs | `references/research.md` |
| Applying this system to an existing page, audit checklist | `references/prompting.md` |
