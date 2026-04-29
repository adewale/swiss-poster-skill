# Swiss Poster Design System — Applying the System

## Applying to an existing page

When asked to apply this design system to an existing design, follow this sequence:

### 1. Audit first

Read the existing code and identify:
- How many distinct colors are in use? (target: 2 — stone + one accent)
- Is there any dramatic scale contrast? (there should be — 10× between largest and smallest type)
- Are any elements breaking the grid? (they should be — overlaps, bleeds, negative margins)
- Are backgrounds pure white or black? (should be stone-50 / stone-950)
- Is there any compositional tension? (asymmetric whitespace, overlapping elements, cropped type)
- Is body text wider than 60ch? (it should not be)
- Are there decorative colors being used for hierarchy? (should be opacity instead)

### 2. Collapse the palette

The most common fix: too many colors.

```
Before:  bg-white, bg-gray-100, bg-gray-200, text-gray-500, text-gray-700
After:   bg-stone-50, bg-stone-100, text-stone-900/70, text-stone-900/40
```

Remove mid-scale stone values (stone-400–700) that are used for text hierarchy. Replace with opacity modifiers on stone-900 (light) or stone-50 (dark).

### 3. Introduce scale contrast

The most important poster transformation: make the type scale dramatic.

```
Before:  text-2xl font-bold      (timid heading)
After:   text-7xl font-bold      (commanding poster heading)

Before:  text-lg for headings, text-base for body  (only 1.125× contrast)
After:   text-[clamp(4rem,10vw,10rem)] for hero, text-base for body  (10×+ contrast)

Before:  Every heading roughly the same size
After:   One dominant element per section, everything else small
```

### 4. Break the grid

Add breakout elements that create compositional tension:

```html
<!-- Before: Everything neatly inside its column -->
<div class="grid grid-cols-12 gap-8">
  <div class="col-span-8"><h2 class="text-3xl">Title</h2></div>
  <div class="col-span-4"><p>Sidebar</p></div>
</div>

<!-- After: Heading escapes its column -->
<div class="grid grid-cols-12 gap-8">
  <div class="col-span-8 relative">
    <h2 class="text-7xl font-bold -mr-24 relative z-10">Title</h2>
  </div>
  <div class="col-span-4">
    <p class="text-sm leading-relaxed text-stone-900/70">Sidebar</p>
  </div>
</div>
```

### 5. Add overlap and layering

Create depth through overlapping elements:

```html
<!-- Before: Flat, single-plane layout -->
<div>
  <div class="bg-red-500 p-8 mb-4">Block 1</div>
  <div class="bg-gray-100 p-8">Block 2</div>
</div>

<!-- After: Layered composition -->
<div class="relative">
  <div class="w-3/4 h-64 bg-[#C8102E]"></div>
  <div class="absolute -bottom-8 right-0 bg-stone-100 dark:bg-stone-900 p-8 border border-stone-200 dark:border-stone-800 w-2/3 z-10">
    Content overlapping the accent block.
  </div>
</div>
```

### 6. Add whitespace asymmetrically

Poster style uses asymmetric whitespace to create tension — not uniform padding.

```
Before:  py-8 (tight, uniform)
After:   pt-32 pb-16 (asymmetric, top-heavy)

Before:  px-8 on everything
After:   Large left margin, tight right margin — or vice versa
```

### 7. Add geometric decoration at poster scale

```html
<!-- Before: No visual anchors -->

<!-- After: Oversized background numeral (8–12% opacity, not invisible 3%) -->
<div class="absolute top-0 right-0 text-[20rem] font-bold leading-none text-stone-900/[0.10] select-none pointer-events-none">01</div>

<!-- After: Bold accent rule -->
<div class="w-16 h-1.5 bg-[#C8102E] mb-8"></div>

<!-- After: Diagonal slash -->
<div class="absolute top-0 left-1/3 w-px h-full bg-stone-900/10 -rotate-6 origin-top"></div>

<!-- After: Halftone dot texture (lithographic reference) -->
<div class="absolute bottom-0 right-0 w-1/3 h-1/4 pointer-events-none"
  style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 8px 8px; color: rgb(28 25 23 / 0.04)"></div>

<!-- After: Rhythmic line field (Troxler-style repetition) -->
<div class="absolute inset-0 pointer-events-none"
  style="background-image: repeating-linear-gradient(0deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 8px); color: rgb(250 250 249 / 0.06)"></div>
```

### 8. Add rotated readable type

Poster style places text on non-horizontal axes. Use sparingly — one or two per section maximum.

```html
<!-- Rotated label along left edge -->
<div class="absolute top-[30%] left-6 pointer-events-none hidden md:block">
  <span class="text-sm font-bold tracking-[0.3em] uppercase text-[#C8102E] -rotate-90 origin-top-left block whitespace-nowrap">Section Label</span>
</div>

<!-- Rotated label along right edge -->
<div class="absolute top-[20%] right-6 pointer-events-none hidden md:block">
  <span class="text-sm font-bold tracking-[0.2em] uppercase text-[#C8102E]/70 rotate-90 origin-top-right block whitespace-nowrap">Category</span>
</div>
```

### 9. Add accent-colored display type

Unlike the International Style (where headings are always stone), poster style uses the accent color on display-scale type as a primary compositional element.

```html
<!-- Key word in accent -->
<h1 class="text-7xl font-bold text-stone-900 dark:text-stone-50">
  Elements <span class="text-[#C8102E]">escape</span> the grid.
</h1>

<!-- Full heading in accent -->
<p class="text-[clamp(4rem,12vw,14rem)] font-bold text-[#C8102E]">ZÜRICH</p>
```

### 10. Fix responsiveness

Poster drama scales down — it doesn't disappear on mobile.

```
Mobile (default):   Single column. px-4. py-16. text-4xl hero type. Overlaps simplified.
Tablet (md:):       2-col layouts. px-8. py-24. text-6xl hero. Overlaps appear.
Desktop (lg:):      Full grid. max-w-6xl. py-32. text-[10rem] hero. Full compositions.
```

Common fixes:
```
Before:  text-[10rem] (fixed — breaks mobile)
After:   text-[clamp(3rem,12vw,10rem)] (fluid — scales with viewport)

Before:  -mr-32 (negative margin — too aggressive on mobile)
After:   -mr-0 md:-mr-32 (breakout only on desktop)

Before:  absolute top-0 left-1/4 (position may break on mobile)
After:   static md:absolute md:top-0 md:left-1/4 (stack on mobile, position on desktop)
```

### 11. Fix dark mode

Ensure every color has a `dark:` variant. Quick audit pattern:
- Every `bg-stone-*` should have a `dark:bg-stone-*` counterpart
- Every `text-stone-*` should have a `dark:text-stone-*` counterpart
- Every `border-stone-*` should have a `dark:border-stone-*` counterpart
- Inverted sections (`bg-stone-900 text-stone-50`) need reversed dark variants

---

## Picking an accent color

Ask: what is the emotional register of this project?

| If the project is... | Use |
| -------------------- | --- |
| Bold, assertive, commercial | Swiss Red `#C8102E` |
| Technical, corporate, trustworthy | Cobalt `#003B8E` |
| Warm, editorial, cultural | Golden `#F0B429` |
| Natural, calm, sustainable | Forest `#2D6A4F` |

**Commit to one.** If a second color feels necessary, use opacity of the first instead.

---

## When to use accent vs. stone

| Element | Use accent | Use stone |
| ------- | ---------- | --------- |
| Primary CTA button | accent | |
| Secondary button | | stone |
| Active nav item | accent | |
| Full-width band (poster) | accent | |
| Oversized decorative shape | accent at /20 | |
| Decorative rule above heading | accent | |
| Display-scale type (key word) | accent | |
| Card top border (featured) | accent | |
| Rotated edge labels | accent at /50–70 | |
| Inverted section background | | stone-900 |
| Body text | | stone |
| Borders, dividers | | stone |
| Tags / badges (featured) | accent at /10 | |

---

## Opacity decision guide

Before reaching for a different color, ask: can opacity solve this?

```
Need to de-emphasize text?        → /70 or /40 opacity
Need a subtle background?         → bg-[#C8102E]/10
Need a hover state?               → bg-stone-900/5 dark:bg-stone-50/5
Need a disabled state?            → opacity-40 on the element
Need a secondary badge?           → bg-[#C8102E]/10 text-[#C8102E]/60
Need a background texture?        → text-stone-900/[0.08] at massive scale (not 3% — too invisible)
Need a decorative bg numeral?     → text-stone-900/[0.10] minimum to register visually
```

---

## Grid discipline — then escape

When laying out a new section:

1. Start with a 12-column grid (`grid grid-cols-12 gap-8`)
2. Place content in columns (8/4, 6/6, 4/4/4, etc.)
3. Identify the dominant element — the one that earns the right to escape
4. Let that element break out: negative margins, absolute positioning, or overflow
5. Ensure `overflow-hidden` on the section wrapper to prevent horizontal scroll
6. On mobile, breakouts simplify: reduce or remove negative margins, stack layers vertically

---

## Pre-ship checklist

Before declaring a design done, assess against every criterion below. Each is a concrete yes/no check.

### Typography (12 criteria)

- [ ] **Sans-serif grotesque typeface** — IBM Plex Sans or equivalent loaded and applied
- [ ] **Extreme weight contrast** — `font-bold` or `font-thin` used at display sizes (not just `font-light` everywhere)
- [ ] **Type at architectural scale** — at least one element sized so letterforms function as graphic shapes (`clamp(6rem, 15vw, 20rem)` or similar)
- [ ] **Size ratio >= 10:1** — largest type is at least 10× the smallest (e.g., 14rem display vs 11px label)
- [ ] **Tight leading at display sizes** — `leading-[0.85]` or `leading-none` on mega/display type
- [ ] **Letterspacing manipulated expressively** — at least one instance of extreme `tracking-[0.3em]` expansion or collision-tight spacing
- [ ] **Type on non-horizontal axes** — at least one readable text element rotated (`-rotate-90`, `rotate-90`, or diagonal)
- [ ] **Type used as texture** — background letterforms at 8–12% opacity (not 3% — must be visible), cropped by viewport
- [ ] **Flush left / ragged right** — all body text left-aligned, no centered or justified blocks
- [ ] **All-caps display type** — uppercase used for mega/display elements for geometric uniformity
- [ ] **Type cropped by viewport edge** — at least one visible text element extends past the frame boundary
- [ ] **Accent-colored display type** — at least one display-scale word or phrase set in the accent color, not just stone

### Geometric Forms (9 criteria)

- [ ] **Primary geometric shapes present** — circles, rectangles, triangles, or bars as compositional elements
- [ ] **Shapes at large scale** — geometric forms occupy >= 25% of at least one composition's area
- [ ] **Shapes overlap other elements** — forms layer over text or other shapes with deliberate z-order
- [ ] **Hard edges, no border-radius** — all structural elements rectilinear (`rounded-none` or `rounded-sm`)
- [ ] **Shapes serve structural roles** — geometric elements function as dividers, anchors, or directional cues
- [ ] **Concentric or radiating forms** — arcs, concentric circles, or spiral arrangements present
- [ ] **Shapes interact with typography** — forms intersect, frame, or collide with letterforms
- [ ] **Flat, unshaded geometry** — solid fills or outlines only, no gradients or shadows
- [ ] **Bars/rules as compositional elements** — thick bars that function as visual weight, not just dividers

### Composition (10 criteria)

- [ ] **Asymmetric layout** — visual weight distributed unevenly, not centered or balanced
- [ ] **Elements overlap deliberately** — at least two elements share spatial zone with intentional z-index
- [ ] **Elements bleed off at least one edge** — type, shapes, or blocks extend beyond composition boundary
- [ ] **Dramatic cropping** — a key element (letterform, shape) cropped so only a portion is visible
- [ ] **Visual tension between elements** — near-miss proximity, compression, or magnetic pull between elements
- [ ] **Foreground/background ambiguity** — at least one moment of figure-ground reversal (`mix-blend-difference` or similar)
- [ ] **Negative space as active shape** — empty space deliberately shaped by surrounding elements
- [ ] **Multiple focal points** — eye pulled to 2–3 competing areas rather than single centered focus
- [ ] **Edge-to-edge composition** — at least one element spans full width, not floating in centered container
- [ ] **Layered depth through positioning** — elements at different z-levels create spatial depth

### Color (9 criteria)

- [ ] **Limited palette <= 4 colors** — stone + one accent, used at multiple opacities
- [ ] **Accent in large fields** — bold hue applied to surfaces >= 20% area (full-width bands, large shapes)
- [ ] **High-contrast value relationships** — strong light/dark contrast between adjacent elements
- [ ] **Flat color application** — solid fills, no gradients
- [ ] **Black as dominant color** — stone-900/950 occupies large areas as a positive compositional element
- [ ] **Color creates spatial layers** — overlapping colored shapes at different opacities suggest depth
- [ ] **Accent color on typography** — display-scale type set in accent color
- [ ] **Inverted sections** — at least one area where background/foreground relationship reverses
- [ ] **Overprinting / transparency effects** — colors that appear to overlap and mix

### Grid Relationship (7 criteria)

- [ ] **Underlying grid detectable** — 12-column grid organizes the base layout
- [ ] **At least one element breaks the grid** — escapes via negative margins, absolute positioning, or overflow
- [ ] **Grid-breaking is intentional** — departure from grid is the focal point, not an accident
- [ ] **Full-bleed elements** — at least one element ignores side margins entirely
- [ ] **Vertical rhythm in body content** — body text and secondary content align to consistent spacing
- [ ] **Grid used for tension** — elements at grid boundaries create visual friction
- [ ] **Varying column widths** — asymmetric splits (7/5, 8/4, 9/3) not just equal halves

### Imagery / Visual Elements (7 criteria)

- [ ] **Abstract forms preferred** — geometric shapes or typographic forms over literal illustrations
- [ ] **Halftone / print-texture references** — CSS dot patterns, line screens, or moiré effects referencing lithographic heritage
- [ ] **Letterforms as primary imagery** — typography serves as main visual content
- [ ] **Texture from repetition** — repeated elements (lines, dots, shapes) creating visual rhythm at regular intervals
- [ ] **Extreme scale juxtaposition** — very large image element next to very small one
- [ ] **Photography as graphic element** — if photos used, high-contrast/cropped/silhouetted (not documentary)
- [ ] **Photomontage / collage technique** — if applicable, multiple elements combined at different scales

### Scale (7 criteria)

- [ ] **Single element dominates** — one element occupies >= 50% of at least one section's area
- [ ] **Extreme scale contrast >= 10:1** — between largest and smallest visible elements
- [ ] **Viewport-scale typography** — at least one word sized relative to viewport width (vw units)
- [ ] **Scale creates hierarchy without color** — size alone communicates importance
- [ ] **Small elements gain power from contrast** — tiny labels significant because of enormous neighbors
- [ ] **Scale creates depth** — larger reads as closer, smaller as distant
- [ ] **Single letter fills composition** — one typographic element dominates entire visual

### Energy / Movement (10 criteria)

- [ ] **Diagonal elements present** — at least one major element on a diagonal axis
- [ ] **Rotated text or shapes** — elements between 2° and 45° from horizontal
- [ ] **Implied motion** — elements arranged to suggest movement across composition
- [ ] **Visual rhythm through repetition** — repeated elements at regular or accelerating intervals
- [ ] **Tension at element boundaries** — gap or overlap at element edges creates visual energy
- [ ] **Composition feels unresolved** — deliberate asymmetry keeps eye moving
- [ ] **Radiating / centrifugal arrangement** — elements exploding outward or spiraling around center
- [ ] **Contrasting directions** — horizontal vs vertical vs diagonal in same composition
- [ ] **Optical vibration** — closely spaced lines or patterns creating shimmering effect
- [ ] **Entry point not top-left** — primary focal point placed off conventional reading-start position

---

**Total: 71 criteria across 8 categories.**

A strong Swiss Poster implementation should pass >= 60 criteria. The remaining gaps are acceptable if they involve techniques not applicable to the medium (e.g., photomontage in a CSS-only site).
