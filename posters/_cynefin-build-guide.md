# Cynefin poster build guide (shared)

Build target: Swiss-poster print artifacts about the **Cynefin framework**, iterating on two kept
directions — **The Fold** (Basel figure-ground; order/disorder + the cliff) and **Four Protocols**
(Müller-Brockmann rhythm; the sense→respond decision score).

Every poster is a self-contained HTML file rendered headless to a 1260×1800 PNG.

---

## 1. Hard technical invariants (do not break)

- Canvas is exactly `1260 × 1800` px. `html, body { width:1260px; height:1800px; overflow:hidden }`. Poster
  wrapper `position:relative; overflow:hidden; padding: ~44–60px`.
- **No horizontal or vertical overflow.** Anything that bleeds must sit inside an `overflow:hidden` parent.
  Verify the render shows nothing clipped that matters and no scrollbars.
- **Boilerplate:** copy the CSS reset, stone CSS variables, `.corner` marks (tl/tr/bl/br), `.topbar`, and
  `.colophon` patterns verbatim from `posters/cynefin-fold.html`. Keep the four corner ticks and a colophon.
- **Fonts:** IBM Plex Sans + IBM Plex Mono via the Google Fonts `<link>` already used in the kept posters.
  Barlow Condensed is allowed for condensed labels if the concept wants it.
- **One accent only**, plus stone + opacity. The accent hex is given per poster. No second hue, no gradients,
  no gradient text, no glow, no soft drop-shadows, no `border-radius` beyond `2px` on structural elements.
- **Never** pure `#000`/`#fff`. Use stone: `--stone-50:#fafaf9 … --stone-950:#0f0d0c`.
- **Extreme scale contrast:** pair a viewport-scale dominant form with 11px labels. Smallest readable type is
  11px. Display type uses tight leading (`0.8–0.92`).
- **Reading contract:** put `data-critical="title|body|date|cta"` on copy that must stay readable; keep
  decorative anchors `aria-hidden="true"` + `pointer-events-none` at a lower z-index. Critical copy never sits
  on top of high-contrast mega-type, route lines, or the dark/light seam unless it has its own solid backing.
- **Audit attributes (non-visible, never shown as poster text):** `data-lineage`, `data-reference`,
  `data-source`, `data-encoding`. Use them to record real decisions.
- Render with: `cd posters && node render.js <file>.html` → produces `<file>.png`. Read the PNG, fix overflow /
  overlap / illegible text / dead space, re-render until clean.

---

## 2. Cynefin facts (accurate — do not invent beyond these)

- **Cynefin** — Welsh, pronounced **/kəˈnɛvɪn/** (kuh-NEV-in). Glosses: *habitat*, *the place of your multiple
  belongings*. Created by **Dave Snowden, 1999**, at IBM. It is a **sense-making** framework (the situation
  shapes the model), not a categorization grid (the model shapes the situation).
- **Four domains + a center.** Ordered domains sit right; unordered sit left.

| Domain | Side | Cause & effect | Protocol | Practice | Tag |
|---|---|---|---|---|---|
| **Clear** (was Obvious / Simple) | ordered | obvious, repeatable | **Sense → Categorize → Respond** | best practice | known knowns |
| **Complicated** | ordered | knowable by analysis/expertise | **Sense → Analyze → Respond** | good practice | known unknowns |
| **Complex** | unordered | clear only in hindsight | **Probe → Sense → Respond** | emergent practice | unknown unknowns |
| **Chaotic** | unordered | none you can act on in time | **Act → Sense → Respond** | novel practice | no knowns |
| **Disorder** | center | you don't know which domain you're in | break it apart, assign the pieces | — | the unknown middle |

- **Ordered:** cause and effect hold, so analysis works first. **Unordered:** the link appears after the fact
  or never, so you must move (probe/act) before you can sense.
- **The fold / cliff:** the Clear–Chaotic boundary is the one you cross without noticing. Complacency in Clear
  (running the rule while the world quietly changes) drops you straight off the edge into Chaos — a fall, not a
  drift. Snowden draws it as a catastrophic fold.
- Renames: **Simple → Obvious (2014) → Clear (~2015)**.

---

## 3. Anti-slop writing rules (apply to every visible word)

Source: `adewale/anti-slop-writing`. Core: **sharp detail beats inflated significance; every claim names a
mechanism.**

- **Banned phrases:** "in the realm of", "when it comes to", "at its core", "it's worth noting", "a testament
  to", "not just X but Y", "not only X but also Y", "this is where X comes in", "whether you're X or Y", "in
  conclusion / overall / ultimately", "looking ahead".
- **High-risk words (cut or earn):** delve, realm, tapestry, pivotal, crucial, underscore, intricate,
  meticulous, multifaceted, transformative, groundbreaking, seamless, robust, leverage, unlock, empower,
  foster, bolster, garner, showcase, highlight, utilize, facilitate, navigate.
- **Hedges/fillers to delete:** simply, just, very, really, actually, in order to.
- **Displaced copulas** ("serves as", "stands as", "represents", "marks", "features") → replace with **is** or a
  specific verb, unless defining/locating/enumerating.
- **One earned em-dash per sentence** at most. No decorative contrast: if a line sounds sharp but names no
  mechanism, rewrite it to name the mechanism. Commit to one claim; drop hedged symmetry.
- Poster copy is public display text. No prompt/provenance leakage (no hex codes, dimensions, "single accent",
  "lineage", eval labels). CTAs, if any, read like instructions ("Name the domain first"), not web buttons.

Quality bar: a viewer reads the title, the one key idea, and the takeaway in three seconds, then the detail
rewards a second look. The big form must carry the meaning, not decorate it.

---

## 4. Extended facts (for the divergent set — keep exact, don't invent past these)

**History / timeline.**
- 1999 — Dave Snowden develops Cynefin at IBM (knowledge management).
- 2002 — the Cynefin Centre for Organisational Complexity (IBM). Snowden later founds Cognitive Edge (2005); today the Cynefin Co.
- 2003 — Kurtz & Snowden, "The new dynamics of strategy: sense-making in a complex and complicated world," IBM Systems Journal.
- 2007 — Snowden & Boone, "A Leader's Framework for Decision Making," Harvard Business Review (Nov 2007). This popularised the four domains.
- ~2014 — "Simple" renamed "Obvious," then "Clear."
- 2020 — the "St David's Day" model adds liminal (threshold) zones.

**Dynamics (movement between domains).** Situations move; the domains are transient.
- Collapse: Clear → Chaotic (the cliff) — complacency, the rule outlives its world, catastrophic fall.
- Disorder → out: from the center, break the problem apart and assign each piece to a domain.
- Exploit: Complex → Complicated — a pattern stabilises, constraints harden, hand it to experts.
- Disrupt: Complicated → Complex — constraints break, the expert answer stops working, probe again.
- Impose/recover: Chaotic → Clear (or Complex) — act to make order, then govern it.
- Deliberate dive: push a stuck ordered system briefly into chaos to force novelty, then stabilise.

**Liminal model (2020).** Boundaries are not walls. Liminal = threshold: a situation between two domains where the old method no longer fits and the new one isn't earned. Don't invent named liminal sub-domains; speak of "the liminal zone between X and Y."

**A Leader's Framework (HBR 2007) — the move and the trap per domain.**
- Clear: set the rule, delegate, communicate plainly. Trap: complacency / oversimplification (the cliff).
- Complicated: convene experts, weigh conflicting advice, decide. Trap: analysis paralysis, or experts dismissing novel answers.
- Complex: run safe-to-fail probes, raise interaction, let patterns emerge. Trap: demanding fact-up-front certainty; command-and-control.
- Chaotic: act to make order, give direction, then move toward complex. Trap: staying commander after the crisis passes.

**Cynefin for software (a common applied mapping).**
- Clear: CRUD, config, known migrations — apply the standard; estimates reliable.
- Complicated: performance, schema/architecture, integrations — expertise, more than one good answer; estimate a range.
- Complex: new products, user behaviour, unproven design — ship small probes, iterate; size the bet, not the outcome.
- Chaotic: outage, incident, breach — stop the bleeding first; estimate later.

**Sense-making vs categorization.** Categorization: pre-made boxes, file the data into them — fast, repeatable, blind to what has no slot. Sense-making: attention first, the pattern shows itself, the category comes after and stays provisional. Cynefin is meant as sense-making; used as a fill-in 2×2 it degrades into a sorting box.
