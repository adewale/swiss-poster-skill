# Swiss Poster Design System — Full Token Reference

## CSS Custom Properties

Add to your global CSS (works with or without Tailwind):

```css
:root {
  /* Typography */
  --font-sans: 'IBM Plex Sans', 'Hanken Grotesk', 'Barlow', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', 'Fira Code', monospace;

  /* Stone palette — light mode */
  --color-bg:           #fafaf9;  /* stone-50 */
  --color-surface:      #f5f5f4;  /* stone-100 */
  --color-surface-2:    #e7e5e4;  /* stone-200 */
  --color-border:       #e7e5e4;  /* stone-200 */
  --color-border-light: #f5f5f4;  /* stone-100 */
  --color-text:         #1c1917;  /* stone-900 */
  --color-text-2:       rgba(28, 25, 23, 0.70);
  --color-text-3:       rgba(28, 25, 23, 0.40);
  --color-text-4:       rgba(28, 25, 23, 0.20);

  /* Accent — default Swiss red (override per project) */
  --color-accent:       #C8102E;
  --color-accent-80:    rgba(200, 16, 46, 0.80);
  --color-accent-60:    rgba(200, 16, 46, 0.60);
  --color-accent-20:    rgba(200, 16, 46, 0.20);
  --color-accent-10:    rgba(200, 16, 46, 0.10);

  /* Spacing base */
  --space-unit: 8px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:           #0c0a09;  /* stone-950 */
    --color-surface:      #1c1917;  /* stone-900 */
    --color-surface-2:    #292524;  /* stone-800 */
    --color-border:       #292524;  /* stone-800 */
    --color-border-light: #1c1917;  /* stone-900 */
    --color-text:         #fafaf9;  /* stone-50 */
    --color-text-2:       rgba(250, 250, 249, 0.70);
    --color-text-3:       rgba(250, 250, 249, 0.40);
    --color-text-4:       rgba(250, 250, 249, 0.20);
  }
}
```

---

## Stone Palette — Complete Scale

| Scale | Light hex | Dark role | Tailwind class |
| ----- | --------- | --------- | -------------- |
| stone-50 | `#fafaf9` | — | Page bg (light) |
| stone-100 | `#f5f5f4` | — | Surface (light) |
| stone-200 | `#e7e5e4` | — | Border, subtle surface |
| stone-300 | `#d6d3d1` | — | Disabled elements |
| stone-400 | `#a8a29e` | — | Placeholder icons |
| stone-500 | `#78716c` | — | (avoid — use opacity instead) |
| stone-600 | `#57534e` | — | (avoid — use opacity instead) |
| stone-700 | `#44403c` | — | (avoid — use opacity instead) |
| stone-800 | `#292524` | Border (dark) | |
| stone-900 | `#1c1917` | Surface (dark) | Primary text (light) |
| stone-950 | `#0c0a09` | Page bg (dark) | |

**Rule:** Only use stone-50, 100, 200 for backgrounds/borders in light mode. Only use stone-800, 900, 950 for backgrounds/borders in dark mode. For text, use stone-900 with opacity modifiers — never mid-scale stone values.

---

## Accent Color System

### Choosing an accent

Pick one per project. In poster style, accent can cover large surfaces — up to 30–40% of a composition when drama demands it.

| Name | Hex | When to use |
| ---- | --- | ----------- |
| Swiss Red | `#C8102E` | Default. Bold, assertive. Full-width bands, oversized shapes, dramatic backgrounds. |
| Cobalt | `#003B8E` | Corporate, technical, trustworthy. Large fields create institutional gravity. |
| Golden | `#F0B429` | Warm, editorial. Striking against dark backgrounds. |
| Forest | `#2D6A4F` | Natural, calm. Large fields create an immersive, environmental feel. |

### Accent opacity usage — poster scale

```
bg-[#C8102E]      → Large fields: full-width bands, hero backgrounds, oversized shapes
bg-[#C8102E]/80   → Translucent overlays on images or sections
bg-[#C8102E]/60   → Hover states, secondary badges
bg-[#C8102E]/20   → Section background washes, card tints
bg-[#C8102E]/10   → Very subtle tints, hover backgrounds

text-[#C8102E]    → Accent text, links, active nav items, mega display type
text-[#C8102E]/60 → Softer accent labels
```

### Never do this

```
❌  bg-red-500          (wrong hue, Tailwind red ≠ Swiss red)
❌  bg-[#C8102E] text-[#003B8E]  (two accents — pick one)
❌  Accent used only in tiny doses  (poster style demands confident, large accent use)
```

---

## Typography — Full Specification

### Font loading

```html
<!-- In <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type scale

| Level | Size | Weight | Leading | Tracking | Max width |
| ----- | ---- | ------ | ------- | -------- | --------- |
| Mega | `clamp(6rem,15vw,20rem)` | 100 thin or 700 bold | `leading-[0.85]` | `tracking-tighter` | none — fills viewport |
| Display | 72–128px / `text-7xl`–`text-9xl` | 300 light or 700 bold | `leading-none` | `tracking-tight` | none |
| H1 | 48–64px / `text-5xl`–`text-6xl` | 300 light | `leading-tight` | `tracking-tight` | none |
| H2 | 36px / `text-4xl` | 300 light | `leading-snug` | `tracking-tight` | none |
| H3 | 24px / `text-2xl` | 400 normal | `leading-snug` | normal | none |
| H4 | 18px / `text-lg` | 500 medium | `leading-snug` | normal | none |
| Body | 16px / `text-base` | 400 normal | `leading-relaxed` | normal | `max-w-[60ch]` |
| Small | 14px / `text-sm` | 400 normal | `leading-relaxed` | normal | `max-w-[60ch]` |
| Caption | 12px / `text-xs` | 400 normal | `leading-normal` | `tracking-widest` | none |
| Mono | 14px / `text-sm font-mono` | 400 normal | `leading-relaxed` | normal | `max-w-[60ch]` |
| Label | 11px / `text-[11px]` | 500 medium | `leading-none` | `tracking-widest` | none |

### Weight contrast (poster-specific)

Unlike the International Style (which avoids bold), poster style uses extreme weight contrast:

```html
<!-- Thin mega type — delicate at massive scale -->
<h1 class="text-[clamp(6rem,15vw,20rem)] font-thin leading-[0.85]">FORM</h1>

<!-- Bold mega type — commanding presence -->
<h1 class="text-[clamp(6rem,15vw,20rem)] font-bold leading-[0.85]">PLAKAT</h1>

<!-- Weight contrast in a single composition -->
<div>
  <span class="text-8xl font-thin">Neue</span>
  <span class="text-8xl font-bold">Grafik</span>
</div>
```

### Hierarchy with opacity

```html
<!-- Primary: full opacity -->
<p class="text-stone-900 dark:text-stone-50">Main content</p>

<!-- Secondary: 70% -->
<p class="text-stone-900/70 dark:text-stone-50/70">Supporting text</p>

<!-- Tertiary: 40% -->
<span class="text-stone-900/40 dark:text-stone-50/40">Caption or metadata</span>

<!-- Disabled / placeholder: 20% -->
<span class="text-stone-900/20 dark:text-stone-50/20">Placeholder</span>
```

---

## Grid & Layout

### 12-column grid (the foundation)

```html
<div class="max-w-6xl mx-auto px-8">
  <div class="grid grid-cols-12 gap-8">
    <!-- Full width -->
    <div class="col-span-12">...</div>

    <!-- Two-thirds + one-third -->
    <div class="col-span-12 md:col-span-8">...</div>
    <div class="col-span-12 md:col-span-4">...</div>

    <!-- Half + half -->
    <div class="col-span-12 md:col-span-6">...</div>
    <div class="col-span-12 md:col-span-6">...</div>

    <!-- Thirds -->
    <div class="col-span-12 md:col-span-4">...</div>
    <div class="col-span-12 md:col-span-4">...</div>
    <div class="col-span-12 md:col-span-4">...</div>
  </div>
</div>
```

### Grid breakout patterns

The grid exists so the breakout has meaning. These patterns let elements escape:

```html
<!-- 1. Negative margin breakout — element escapes its column -->
<div class="grid grid-cols-12 gap-8">
  <div class="col-span-8 relative">
    <h2 class="text-7xl font-bold -mr-32 relative z-10">Gestaltung</h2>
  </div>
  <div class="col-span-4">
    <p class="text-base leading-relaxed text-stone-900/70">Body text in its column</p>
  </div>
</div>

<!-- 2. Absolute position breakout — element floats above grid -->
<div class="relative">
  <div class="grid grid-cols-12 gap-8">
    <div class="col-span-6">
      <p class="text-base leading-relaxed">Content stays in grid</p>
    </div>
  </div>
  <div class="absolute top-0 right-0 w-1/3 h-full bg-[#C8102E] z-0"></div>
</div>

<!-- 3. Full-bleed band — ignores container entirely -->
<div class="bg-[#C8102E] -mx-[100vw] px-[100vw] py-16 relative">
  <div class="max-w-6xl mx-auto px-8">
    <h2 class="text-5xl font-light text-white">Full bleed</h2>
  </div>
</div>

<!-- 4. Viewport-width type — text is wider than content area -->
<div class="overflow-hidden">
  <h1 class="text-[clamp(6rem,18vw,24rem)] font-bold leading-[0.85] -ml-[2%] whitespace-nowrap text-stone-900/10 dark:text-stone-50/10 select-none">
    TYPOGRAPHIE
  </h1>
</div>
```

### Overlap compositions

```html
<!-- Image with overlapping text -->
<div class="relative">
  <div class="w-3/4 aspect-[4/3] bg-stone-200 dark:bg-stone-800"></div>
  <h2 class="absolute -bottom-6 -right-4 text-6xl font-bold text-stone-900 dark:text-stone-50 z-10">
    Ausstellung
  </h2>
</div>

<!-- Stacked cards with offset -->
<div class="relative h-96">
  <div class="absolute top-0 left-0 w-72 h-64 bg-stone-900 dark:bg-stone-50 z-10 p-8">
    <span class="text-xs tracking-widest uppercase text-stone-50/40 dark:text-stone-900/40">01</span>
  </div>
  <div class="absolute top-12 left-12 w-72 h-64 bg-[#C8102E] z-20 p-8">
    <span class="text-xs tracking-widest uppercase text-white/40">02</span>
  </div>
  <div class="absolute top-24 left-24 w-72 h-64 bg-stone-200 dark:bg-stone-800 z-30 p-8">
    <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">03</span>
  </div>
</div>

<!-- Text crossing a dividing line -->
<div class="grid grid-cols-2 min-h-[400px]">
  <div class="bg-stone-900 dark:bg-stone-50 relative"></div>
  <div class="bg-stone-50 dark:bg-stone-950 relative"></div>
  <h2 class="absolute left-1/4 top-1/2 -translate-y-1/2 text-8xl font-bold z-10 mix-blend-difference text-white">
    KONTRAST
  </h2>
</div>
```

### Section spacing

```html
<!-- Standard section — generous but conventional -->
<section class="py-24 border-t border-stone-200 dark:border-stone-800">
  <div class="max-w-6xl mx-auto px-8">...</div>
</section>

<!-- Poster section — dramatic with overflow -->
<section class="py-32 relative overflow-hidden">
  <div class="absolute inset-0 bg-[#C8102E]"></div>
  <div class="max-w-6xl mx-auto px-8 relative z-10">...</div>
</section>
```

---

## Geometric Decoration — Poster Scale

The poster style uses geometric forms at dramatic scale. These are compositional anchors — large enough to organize the layout around.

```html
<!-- Oversized background numeral (poster scale — 8–12% opacity minimum to register) -->
<div class="absolute top-0 right-0 text-[clamp(15rem,40vw,40rem)] font-bold leading-none text-stone-900/[0.10] dark:text-stone-50/[0.10] select-none pointer-events-none">
  01
</div>

<!-- Thick accent rule (not hairline — bold) -->
<div class="w-16 h-1.5 bg-[#C8102E] mb-8"></div>

<!-- Oversized circle (decorative anchor) -->
<div class="absolute -top-32 -right-32 w-96 h-96 rounded-full border-2 border-stone-900/10 dark:border-stone-50/10"></div>

<!-- Diagonal slash -->
<div class="absolute inset-0 overflow-hidden pointer-events-none">
  <div class="absolute top-0 left-1/4 w-px h-[140%] bg-stone-900/10 dark:bg-stone-50/10 -rotate-12 origin-top"></div>
</div>

<!-- Large accent block — compositional element -->
<div class="absolute bottom-0 left-0 w-1/3 h-2/3 bg-[#C8102E]/20"></div>
```

---

## Dark Mode Implementation

Tailwind `media` strategy — no class toggling needed, respects system preference:

```js
// tailwind.config.js
module.exports = {
  darkMode: 'media',
  // ...
}
```

For manual toggle (class strategy):

```js
darkMode: 'class',
// Toggle: document.documentElement.classList.toggle('dark')
// Persist: localStorage.setItem('theme', 'dark')
```

### Inverted sections (poster technique)

A common poster technique: sections with inverted colors inside a light page, creating stark contrast without relying on system dark mode:

```html
<!-- Dark section in a light page -->
<section class="bg-stone-900 text-stone-50 py-32 relative overflow-hidden">
  <div class="max-w-6xl mx-auto px-8">
    <h2 class="text-7xl font-bold">Nacht</h2>
    <p class="text-stone-50/60 mt-4 max-w-[60ch]">Inverted section text.</p>
  </div>
</section>

<!-- Accent section -->
<section class="bg-[#C8102E] text-white py-32">
  <div class="max-w-6xl mx-auto px-8">
    <h2 class="text-7xl font-bold">Farbe</h2>
  </div>
</section>
```

All component examples in this system use paired `dark:` classes. Never omit the dark variant.
