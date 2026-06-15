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
- What is the **one dominant graphic event**? (cropped word, giant date, huge shape, hard split, or masked photo)
- Does that event communicate the actual subject, or is it arbitrary decoration?
- Is the primary title/date/CTA readable at a glance?
- Is critical copy the dominant contrast event inside its local reading zone, rather than competing with a route line/photo/mega-glyph?
- Which edge is under pressure? (a major element should touch, bleed, or be cropped by the frame)
- Where is the microtype/data layer? (2–4 tiny metadata clusters make the large move feel deliberate)
- Is there a hard field/inversion? (stone-900/stone-50 mass, split field, or `mix-blend-difference`)
- Is there a graphic system beyond a thin accent line? (rings, bars, dot/line rhythm, repetition, halftone, or photo treatment)
- What source-ledger items must be preserved exactly? (names, dates, places, sequence beats, quotes, assets)
- Do images have explicit roles: place, person, evidence, sequence, metaphor, product?
- Do diagrams encode real variables, or are arrows/nodes decorative?
- What historical move is embodied in layout logic, not visible name-dropping?
- Which period/genre lineage fits the subject: object poster, travel/lithographic, Zurich public notice, Basel figure-ground, Geigy scientific, Matter photomontage, Weingart type disruption, Troxler rhythm, or contemporary Swiss cultural poster?
- Are color, typography, material surface, grid behavior, and image/diagram logic consistent with that lineage instead of defaulting to late-modern black/red type violence?
- Does the rendered artifact prove the lineage visually, or only through `data-*` metadata?
- Are we using UI/product language (button modules, dashboards, cards, “learn more” blocks) where a print-poster instruction would be stronger?
- Does typography match the period/genre stance, or does everything feel like the same IBM Plex tech artifact?
- Is the palette intentionally one accent, or does the lineage call for a limited flat-ink palette with 2–3 meaningful colors?
- Are images authored through crop/scale/overprint/mask, or merely placed?
- Does the artifact format match the brief/baseline (poster, landscape, one-page recap, thread, matrix, specimen)?

### 1b. Choose the dramatic event

Before writing classes, decide what carries the poster. Do not start with nav/hero/cards; start with one of these:

| Event | Best for | Must include |
| --- | --- | --- |
| Cropped word | Product/concept name | `text-[clamp(...)]`, `whitespace-nowrap`, edge crop, tiny labels |
| Giant date/number | Events, launches, reports | Numeral/date at 40%+ section area, content reduced to metadata grid |
| Split field | High contrast statement | Light/dark halves and display type crossing via `mix-blend-difference` |
| Geometric subject | Abstract or technical story | Oversized circle/ring/bar/triangle, not a small decorative icon |
| Masked photo | People/place/product imagery | Grayscale/duotone crop, overprint field/type, no rounded image cards |
| Rhythm layer | Music/data/motion | Repeating lines/dots/words or concentric/radiating structure |
| Stacked collage | Multi-asset story | Hard-edged overlaps with explicit z-index, no soft shadows |

If the design is centered, evenly spaced, and card-based, it is still too timid. Add a dominant anchor, force an edge crop, and demote secondary content into microtype. If the design is hard to read, it is not dramatic enough — it is just noisy. Move collisions to the anchor/background and keep the primary reading path clear.

### 1c. Allocate contrast channels

Do not translate readability guidance into lower drama. Translate it into signal assignment:

- **Critical signal:** title/date/body/CTA. It wins locally. Mark dense-poster HTML with `data-critical="title"`, `data-critical="body"`, `data-critical="date"`, or `data-critical="cta"`.
- **Dramatic signal:** image, route, slash, giant numeral, cropped word, object, diagram. It may be brutal, high-contrast, and edge-cropped, but not through critical glyphs.
- **Texture signal:** halftone, contour, ghost type, grid, tiny labels. It can sit under text only when visibly demoted.

Use these moves before reducing intensity:

```html
<!-- Critical signal: the reading zone is also a hard graphic block -->
<div class="relative z-40 col-span-12 md:col-span-5 bg-stone-950 p-6 md:p-8 text-stone-50">
  <h1 data-critical="title" class="text-[clamp(3.5rem,11vw,9rem)] font-bold leading-[0.82] tracking-[-0.06em]">
    Night Closure
  </h1>
  <p data-critical="body" class="mt-5 max-w-[34ch] text-lg leading-snug text-stone-50/85">
    Last trains reroute at 23:40. Use the marked transfer corridor.
  </p>
  <a data-critical="cta" class="mt-7 inline-flex min-h-11 items-center bg-[#C8102E] px-5 text-[11px] font-bold uppercase tracking-widest text-stone-50">
    Check route
  </a>
</div>

<!-- Dramatic signal: maximum contrast, but routed outside the reading zone -->
<div data-channel="dramatic" aria-hidden="true" class="pointer-events-none absolute left-[50%] top-0 z-10 h-full w-4 -rotate-12 bg-[#C8102E]"></div>

<!-- Texture signal: can pass behind because it is demoted -->
<p data-channel="texture" aria-hidden="true" class="pointer-events-none absolute -bottom-[0.1em] right-[-0.08em] z-0 text-[clamp(8rem,28vw,24rem)] font-bold leading-none text-stone-900/[0.06]">
  23:40
</p>
```

Test the local channel: inside the title/body/CTA rectangle, is critical text the strongest readable signal? If yes, keep the surrounding poster violent. If no, route/cut/demote the competing graphic.

### 1d. Select period/genre lineage, then preserve artifact fidelity

Before styling, choose a lineage and keep it auditable without visible name-dropping:

```html
<section data-lineage="geigy-scientific" data-period="1950s-1970s" data-genre="scientific-plate" data-print-process="flat-ink-overprint">
  ...
</section>
```

Use the lineage to avoid default collapse:

- object poster: object/silhouette is the anchor; type is restrained;
- travel/photomontage: image/place and lithographic color lead;
- Zurich public notice: facts, hierarchy, and proportions lead;
- Basel/Hofmann: 2–3 contrast axes and figure-ground lead;
- Geigy/scientific: specimen/matrix/plate and measured labels lead;
- Weingart/Troxler: use only for subjects that need type disruption or performance rhythm.

Before styling a source-heavy poster, write a private ledger:

```text
title:
date/place/time:
required names/entities:
sequence beats:
assets and roles:
diagram variables:
CTA/source note:
artifact format/aspect:
historical move:
```

Then make the HTML auditable without showing process labels:

```html
<!-- historical move: matter-photomontage; source ledger: six thread beats -->
<article class="grid grid-cols-12 overflow-hidden">
  <figure data-image-role="place" class="col-span-7 overflow-hidden">
    <img src="assets/venue.jpg" alt="County Hall view" class="h-full w-full object-cover grayscale contrast-125" />
  </figure>
  <ol class="col-span-5">
    <li data-beat="01" data-source="tweet-01">Venue opens at Waterloo.</li>
    <li data-beat="02" data-source="tweet-02">Prada marks the entrance.</li>
  </ol>
  <svg data-encoding="tweet order → vertical position; topic group → x-position" aria-hidden="true"></svg>
</article>
```

Visible poster copy must not include `source material`, `brief`, `current skill`, hex colors, screenshot dimensions, or other prompt/eval metadata. Microtype must be real credits, source notes, captions, coordinates, index numbers, or schedule — never fake filler.

### 1e. Prove the poster in the rendered image

Markup attributes are only audit hooks. The final screenshot must make the claim visible:

- claimed lineage visible at thumbnail scale;
- critical text readable in the raster image, not just present in DOM;
- source facts visible without opening HTML;
- image roles visible through crop/scale/overprint, not merely `data-image-role`;
- print-material choices visible but not interfering with the reading path;
- no UI-card/dashboard scaffolding unless the subject is explicitly UI.

### 2. Collapse or discipline the palette

The most common fix: too many colors. The second most common over-correction: forcing every poster into red/orange plus black/white even when travel, lithographic, scientific, civic, or cultural history calls for a different limited print palette.

```
Before:  bg-white, bg-gray-100, bg-gray-200, text-gray-500, text-gray-700
After:   bg-stone-50, bg-stone-100, text-stone-900/70, text-stone-900/40
```

Remove mid-scale stone values (stone-400–700) that are used for text hierarchy. Replace with opacity modifiers on stone-900 (light) or stone-50 (dark).

If the lineage calls for richer color, keep it disciplined: 2–3 flat inks plus paper tone, each mapped to a semantic role. No gradients unless the subject is optical/color study.

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

### 7. Add a graphic system at poster scale

```html
<!-- Before: No visual anchors -->

<!-- After: Oversized background numeral (8–12% opacity, not invisible 3%) -->
<div class="absolute top-0 right-0 text-[20rem] font-bold leading-none text-stone-900/[0.10] select-none pointer-events-none">01</div>

<!-- After: Bold accent rule (minimum; not enough by itself for a dramatic poster) -->
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
- [ ] **Tight leading at display sizes** — `leading-[0.85]`, tighter custom leading, or `leading-none` on mega/display type
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

### Dramatic Poster Outcome (14 criteria)

- [ ] **One dominant graphic event** — first viewport/hero is organized around one anchor, not a generic hero stack
- [ ] **Anchor occupies 35–70% of the hero** — cropped word, giant date/number, shape, field, or image fragment has real mass
- [ ] **Anchor is meaningful** — the big element translates the subject/message, not arbitrary decoration
- [ ] **Primary reading path is clear** — title, essential date/info, and CTA remain readable at a glance
- [ ] **Period/genre lineage is selected** — the poster does not default to late-1960s/1980s black-white-red typographic disruption unless the subject calls for it
- [ ] **Palette fits lineage** — one accent is still disciplined, but not every non-Cloudflare poster defaults to red/orange
- [ ] **Typographic violence is earned** — cropped mega-type appears only when type/image-as-form is the chosen lineage; object/travel/scientific posters may be quieter
- [ ] **Font category fits lineage** — neo-grotesk, condensed, serif/display, mono/technical, or custom lettering is chosen for the era/subject, not reflexively IBM Plex Sans everywhere
- [ ] **Grid reads as proportion, not web UI** — no visible dashboard/card/module scaffolding unless the subject is explicitly UI
- [ ] **Material process is chosen where relevant** — overprint, halftone, duotone, lithographic grain, screenprint slab, or paper tone supports the subject
- [ ] **Diagram restraint** — diagrams/routes/nodes appear only when marks encode real systems/data
- [ ] **Restraint can be drama** — 2–3 contrast axes are chosen and unrelated effects are suppressed
- [ ] **Genre breadth is respected** — travel placard, object poster, scientific plate, public notice, concert, theatre, typographic specimen, photomontage, and cultural poster are distinct solutions
- [ ] **Source ledger is preserved** — required names, dates, places, sequence beats, and factual claims are visible without invented specifics
- [ ] **Source-support copy is readable** — small factual lines remain legible at rendered image scale; no word disappears at a split-field or low-contrast boundary
- [ ] **Website CTAs are filtered** — web navigation/buttons like “View documentation,” “Get started,” or “Read the docs” are not copied into poster CTA copy unless the task is explicitly UI
- [ ] **Images have semantic roles** — assets are subject/place/evidence/sequence/metaphor, not wallpaper texture
- [ ] **Diagrams encode real variables** — routes, nodes, axes, and targets map to source facts via visible labels or non-visible `data-encoding`
- [ ] **Historical move is embodied** — the layout carries Müller-Brockmann/Hofmann/Matter/Ruder/Weingart/Troxler/Odermatt-Tissi logic rather than visible designer-name garnish
- [ ] **Artifact format is respected** — landscape, one-page recap, thread, matrix, specimen, or poster requirements are not collapsed into the same portrait template
- [ ] **No prompt-shaped visible copy** — no screenshot dimensions, hex values, “single accent,” “brief,” “source material,” “generated,” or eval/provenance labels inside artwork
- [ ] **Protected reading zone exists** — title/body/CTA sit on an uninterrupted quiet field, not directly over high-contrast mega-type, route lines, diagrams, or photos
- [ ] **Contrast is allocated, not reduced** — the poster keeps brutal fields/anchors, but critical copy is the dominant contrast signal inside its local zone
- [ ] **Critical copy is marked for dense HTML** — use `data-critical="title/body/date/cta"` on essential reading blocks when layers are complex
- [ ] **Graphic and reading layers are separated** — decorative anchors use `aria-hidden`, `pointer-events-none`, low opacity, clipping, or lower z-index; critical copy uses `relative z-30`/`z-40`
- [ ] **Edge pressure is visible** — the dominant element touches, bleeds past, or is cropped by at least one edge
- [ ] **Microtype/data layer present** — 2–4 tiny tracked labels/dates/index clusters counterbalance the anchor
- [ ] **Hard figure/ground relationship** — large stone light/dark field, split background, or `mix-blend-difference` moment
- [ ] **Graphic system beyond accent line** — rings, bars, line/dot rhythm, repeated type, halftone, or image treatment
- [ ] **Tonal mass ratio is deliberate** — e.g. 60/30/10 or 45/45/10 across light/dark/accent surfaces
- [ ] **Secondary content is demoted** — body copy/cards do not compete with the anchor; they sit in grid cells as support
- [ ] **UI chrome disappears** — no rounded card grid, soft shadow stack, pill-heavy SaaS layer, or centered marketing template
- [ ] **Mobile preserves drama** — anchor remains dominant at 320px while offsets/overlaps simplify safely

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

### Anti-Slop — no AI tells (11 criteria)

The presence of any single tell below is disqualifying, no matter how well the rest scores. These check for reflexive AI-generated defaults catalogued by Paul Bakaus at <https://impeccable.style/slop/>. Run `npx impeccable detect <file-or-url>` to verify automatically.

- [ ] **No AI palette** — no purple/violet gradients, no default cyan-on-black
- [ ] **No gradient text** — every text fill is a solid color
- [ ] **No reflexive glow** — colored `box-shadow`/text-glow only if it is the poster's deliberate subject
- [ ] **No pure `#000`/`#fff`** — stone-950 / stone-50 (warm-tinted), never raw black/white
- [ ] **Dark mode is a decision** — not defaulted to for "safety"; light is allowed and often stronger
- [ ] **Distinctive typeface** — IBM Plex or an approved fallback; avoid Inter/Roboto/Geist/Space Grotesk/Plus Jakarta Sans
- [ ] **Monospace earns its place** — used for code/data/IDs/metadata, not as "technical" decoration
- [ ] **No card slop** — no identical icon-tile feature-card grid, nested cards, side-tab accent stripes, or rounded SaaS cards
- [ ] **No template metrics** — charts carry real information; no sparkline garnish or big-number-plus-three-stats block
- [ ] **Not everything centered** — asymmetric composition, flush-left body copy
- [ ] **No quality bugs** — passes WCAG AA contrast, no cramped padding, no justified text

---

**Total: 117 criteria across 10 categories.**

A strong Swiss Poster implementation should pass >= 100 criteria **and all 11 Anti-Slop checks**. The remaining gaps are acceptable only if they involve techniques not applicable to the medium (e.g., photomontage in a CSS-only site) — the Dramatic Poster Outcome, protected reading zone, and Anti-Slop checks are never optional.
