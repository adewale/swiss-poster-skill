# Anti-Slop — avoiding the AI tells

Adapted from **Impeccable** by Paul Bakaus — <https://impeccable.style/slop/>. Impeccable
catalogs 37 patterns that mark an interface as AI-generated. This file maps every one of them
onto the Swiss Poster system: what the tell is, the fix, and where this system already stands.

## The one idea

**Slop is the reflexive default, chosen because it was easy — not because it was right.**

A purple gradient, a glassy card, a centered column, a glowing accent: none of these are
forbidden shapes. They are slop *when no one decided on them*. The cure is not a banned-list,
it is intent. Every gradient, glow, blur, rotation, and font on the page must be a choice you
could defend. If you cannot say why it is there, it is slop — delete it.

The Swiss Poster system is naturally slop-resistant: extreme hierarchy, one accent, flat fills,
no border-radius, asymmetry, real line lengths, no pure black or white. The notes below mark
each rule as **enforced** (the system already prevents it), **watch** (still easy to do wrong
here), or **deliberate** (a tell the poster style may invoke *on purpose* — which is allowed
only when it is the point, never by reflex).

---

## Visual details

| Tell | Fix | In this system |
| ---- | --- | -------------- |
| **Side-tab accent border** — a thick colored border on one side of a card. *The* most recognizable AI-UI tell. | Remove it, or use a subtler accent. | **Watch.** Use accent as a *field* (band, shape, display type), not as a stripe taped to a box. |
| **Border accent on a rounded element** — accent border fighting rounded corners. | Drop the border or the radius. | **Enforced.** No border-radius on structural elements; accent lives in shapes, not card trim. |
| **Rounded rectangles with generic drop shadows** — the safest, most forgettable shape on the web. | Commit to a stronger treatment. | **Enforced.** `rounded-none`, flat fills, no decorative shadow. Forms are hard-edged and structural. |
| **Glassmorphism everywhere** — blur/glass used to decorate, not to solve layering. | Only blur when it solves a real layering problem. | **Watch.** Layering here is done with opacity, overlap, and z-order — not frosted glass. |
| **Modals by reflex** — interrupting the user as the default. | Use only when no better location exists. | N/A for posters; **watch** when the system styles an app. |
| **Sparklines as decoration** — tiny charts that look smart and say nothing. | Give data real room, or cut it. | **Watch.** If a poster shows a chart, it must carry real information (see the MoQ quadrant), not garnish. |

## Typography

| Tell | Fix | In this system |
| ---- | --- | -------------- |
| **Flat type hierarchy** — sizes too close together. | Fewer sizes, ≥1.25 ratio between steps. | **Enforced, hard.** The system demands ≥10:1 between largest and smallest. Flat hierarchy is the opposite of poster style. |
| **Overused font** — Inter, Roboto, Geist, Plus Jakarta Sans, Space Grotesk, Fraunces. So common they read as "an AI made this." | Pick a face with personality. | **Enforced.** Primary is IBM Plex Sans; fallbacks are Hanken Grotesk, Barlow, Host Grotesk, DM Sans. **Never reach for Inter / Roboto / Geist / Space Grotesk / Plus Jakarta Sans.** |
| **Single font for everything** — one family doing every job. | Pair a display face with a body face. | **Watch.** One grotesque is intentional here, but separate the roles with *weight and scale*, and use a mono only for genuine data. |
| **Monospace as "technical" shorthand** — mono sprinkled to signal "developer." | Make a real type choice. | **Watch — important.** This system loves IBM Plex Mono. Earn it: mono is for code, tabular data, IDs, and metadata — never as decoration to look technical. |
| **All-caps body text** — long uppercase passages, hard to read. | Reserve caps for short labels/headings. | **Enforced.** Uppercase is for labels, captions, and display type only. Body is sentence case. |
| **Icon tile stacked above a heading** — small rounded-square icon container over a title: the universal AI feature-card template. | Side-by-side, or icon inline without a container. | **Enforced** by absence — no icon-tile feature cards. **Watch** if styling an app. |

## Color & contrast

| Tell | Fix | In this system |
| ---- | --- | -------------- |
| **AI color palette** — purple/violet gradients, cyan-on-dark. The single biggest visual tell. | Choose a distinctive, intentional palette. | **Enforced.** Palette is stone + **one** accent (Swiss Red default, or Cobalt/Golden/Forest). **No purple/violet, no default cyan-on-black.** |
| **Gradient text** — gradients on headings and metrics. | Solid colors for text. | **Enforced.** Flat color application; type is solid stone or solid accent. |
| **Dark mode with glowing accents** — colored `box-shadow` glows on dark. The default "cool" look. | Subtle, purposeful light, or skip the dark theme. | **Deliberate-only.** Glow is not a default. A neon/CRT poster may use it *as its subject* (e.g. an explicit cyberpunk homage) — never as reflexive polish. |
| **Pure black background** — `#000000`, harsh and unnatural. | Tint toward the brand hue. | **Enforced.** Never `bg-black`/`bg-white`; use `stone-950` (already warm-tinted) / `stone-50`. |
| **Defaulting to dark mode for "safety"** — dark chosen to dodge a decision. | Decide; light is a valid, often braver choice. | **Watch.** Don't reach for dark by reflex. A light Swiss ground is frequently the stronger, less-sloppy call. |
| **Gray text on a colored background** — washes out. | Darker background shade, or near-white text. | **Enforced** via the opacity model: on an accent band use near-black (`stone-900`) or `stone-50`, not gray. |

## Layout & space

| Tell | Fix | In this system |
| ---- | --- | -------------- |
| **Everything centered** — every block center-aligned. | Left-aligned, asymmetric layouts. Center only a hero or CTA. | **Enforced.** Asymmetry is Principle 6; body is flush-left / ragged-right. |
| **Identical card grids** — same-size icon+heading+text cards repeated endlessly. The default AI homepage. | Vary size, weight, and rhythm. | **Watch.** When the poster lists items, vary them — different spans, scales, emphasis. Three identical tiles is slop. |
| **Hero metric layout** — big number, small label, three supporting stats, gradient accent. Used everywhere, trusted nowhere. | Break the template; let real data drive the form. | **Watch.** Use facts as composition (a real chart, an annotated diagram), not the canned stat-trio. |
| **Nested cards** — cards inside cards. | Use spacing, type, and dividers instead. | **Enforced.** Depth comes from overlap and z-order, not boxes-in-boxes. |
| **Wrapping everything in cards** — every item in a bordered container. | Group with spacing and alignment. | **Enforced.** The grid and whitespace group content; bordered containers are rare. |
| **Monotonous spacing** — the same gap everywhere, no rhythm. | Tight within groups, generous between sections. | **Watch.** 8px base, but *vary the multiples* — asymmetric, deliberate whitespace. |
| **Line length too long** — lines wider than ~80 characters. | `max-width` 65–75ch. | **Enforced.** Body capped at `max-w-[60ch]`. |

## Motion

| Tell | Fix | In this system |
| ---- | --- | -------------- |
| **Bounce / elastic easing** — dated and tacky. | Exponential easing (ease-out-quart/quint/expo). | **Watch.** Posters are static; if the system animates, no bounce. |
| **Animating layout properties** — width/height/padding/margin → jank. | Animate `transform`/`opacity` (or `grid-template-rows`). | **Watch** for the app case. |

## Interaction

| Tell | Fix | In this system |
| ---- | --- | -------------- |
| **Every button a primary button** — nothing reads as *the* action. | Ghost / text / secondary styles for hierarchy. | **Enforced** in spirit: one accent, one focal action. See `components.md`. |
| **Redundant information** — intros restating headings, labels repeating titles. | Make every word earn its place. | **Watch.** On a dense poster, cut anything that repeats. No sentence should restate the title. |

## Responsive

| Tell | Fix | In this system |
| ---- | --- | -------------- |
| **Amputating features on mobile** — hiding real functionality on small screens. | Adapt the interface, don't strip it. | **Enforced.** Poster drama *scales*; overlaps simplify and type shrinks but nothing essential disappears. |

## General quality (these are bugs, not style)

| Tell | Fix | In this system |
| ---- | --- | -------------- |
| **Cramped padding** — text touching the edge of its container. | ≥8px, ideally 12–16px inside bordered/colored areas. | **Watch.** Give text on accent bands real breathing room. |
| **Justified text** — uneven rivers without hyphenation. | `text-align: left`, or `hyphens: auto`. | **Enforced.** Flush-left only. |
| **Low-contrast text** — fails WCAG AA (4.5:1 body, 3:1 large). | Raise contrast. | **Watch.** The opacity model can dip too low — keep tertiary text legible; check accent-on-stone pairings. |
| **Tiny body text** — below ~12px. | ≥14px, ideally 16px. | **Watch.** Poster *labels* may be 11px (they are short metadata, like print fine-print), but body copy stays ≥14px. |
| **Tight line height** — below 1.3× on multi-line text. | 1.5–1.7 for body. | **Enforced** for body (`leading-relaxed`); tight leading is reserved for *display* type only. |
| **Wide letter-spacing on body** — above 0.05em slows reading. | Reserve wide tracking for short uppercase labels. | **Enforced.** Wide `tracking` is for labels/captions; body tracking is normal. |
| **Skipped heading level** — h1 → h3 with no h2. | Keep the heading order intact. | **Watch.** Visual scale is dramatic, but the *semantic* order (h1→h2→h3) must not skip. |

---

## Quick pre-flight (paste into review)

Eleven fast yes/no checks. A clean Swiss Poster passes all eleven.

- [ ] **No purple/violet gradient, no cyan-on-black** default palette
- [ ] **No gradient text** — every text fill is solid
- [ ] **No reflexive glow** — colored box-shadow only if it is the poster's subject
- [ ] **No pure `#000`/`#fff`** — stone-950 / stone-50
- [ ] **Dark mode is a decision**, not a reflex (light is allowed and often better)
- [ ] **Distinctive typeface** — IBM Plex / approved fallbacks, never Inter/Roboto/Geist/Space Grotesk
- [ ] **Monospace earns its place** — code/data/metadata only, not "techie" decoration
- [ ] **No identical card grid / icon-tile feature cards / nested cards**
- [ ] **Not everything centered** — asymmetric, flush-left body
- [ ] **Charts carry information** — no sparkline/stat-trio garnish
- [ ] **No AA contrast failures, no cramped padding, no justified text**
