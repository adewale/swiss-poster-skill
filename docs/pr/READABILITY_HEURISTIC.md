# Protected reading zone heuristic

## Problem from characterization sheet

Current-skill reruns often preserve poster drama but damage public communication:

- giant type crosses title/subtitle;
- route lines and trust-boundary bars cut body copy;
- dark fields receive dark text without inversion;
- diagrams sit above explanatory copy;
- absolute layers ignore the grid after the first few elements.

The failure is not “too much drama.” It is **unassigned collision**: critical reading text and graphic image layers occupy the same spatial channel.

## Historical grounding

Swiss poster drama was public communication. Muller-Brockmann's concert arcs, Hofmann's figure/ground forms, Matter's photomontage, and Weingart's typographic disruption are severe, but they still preserve an event name, date/place, instruction, or dominant reading path. The big form carries the message; it does not make the message disappear.

The supporting perceptual idea is signal separation: readers first parse grouping, contrast, figure/ground, and hierarchy. Two high-contrast signals in the same rectangle mask each other unless one is deliberately demoted.

## Heuristic

Extract WCAG/similar work as measurement physics, not as design taste:

1. contrast is local to the exact backing behind the text;
2. two high-contrast signals in the same rectangle mask each other;
3. critical information needs first claim on the reader's attention.

Do **not** import the baggage: no bland compliance look, no ban on tiny microtype, no ban on crops/overlap/inversion, and no assumption that every layer must be equally readable.

Classify layers before composing:

| Layer | Purpose | May be cropped/obscured? | Rule |
|---|---|---|---|
| Critical reading | title, date/time, CTA, safety warning, core claim | No | Quiet field, high z-index, readable size, strong local contrast against the actual backing |
| Support reading | metadata, labels, coordinates, captions | Slightly | Tiny but crisp; avoid noisy texture |
| Graphic image | cropped word, giant number, route line, object, photo, ring, hazard shape | Yes | `aria-hidden`, `pointer-events-none`, lower z-index, opacity/clip/crop allowed |

Quiet-field test:

> Every critical text block needs an uninterrupted rectangle of calm tone behind it.

If a route, slash, ring, photo edge, ghost word, or giant letter crosses that rectangle:

1. move/crop the graphic so it misses the rectangle;
2. send the graphic behind the text at low opacity;
3. put the text on a solid light/dark/accent field with padding and higher z-index;
4. use `mix-blend-difference` only if the full word remains readable.

Hard rule:

> Body copy and CTAs never sit directly on high-contrast mega-type, route lines, diagrams, or photos.

Contrast-channel rule:

> Do not lower the poster's contrast. Allocate it. Critical copy gets one uncontested high-contrast channel; drama gets the rest of the field.

For dense HTML, critical copy is marked with `data-critical="title/body/date/cta"`; dramatic and texture layers can be marked with `data-channel="dramatic"` or `data-channel="texture"`.

## Eval additions

Added:

- `evals/oracles/readability_oracle.py`
- `evals/fixtures/round8-overlapped-critical-text/current.html`
- `pos-protected-reading-zone-credential`
- `round8-audit-overlapped-critical-text`
- `pos-contrast-channel-night-closure`
- ablations: `no-protected-reading-zone`, `no-contrast-channel-discipline`

Targeted run: `eval-runs/current-round8-readability-20260615/`

| Variant | `pos-protected-reading-zone-credential` | `round8-audit-overlapped-critical-text` |
|---|---:|---:|
| `with_skill` | pass | pass |
| `without_skill` | fail | pass |
| `ablation:no-protected-reading-zone` | pass | pass |

Interpretation:

- The implementation-generation case discriminates: with-skill passes and no-skill misses the protected-zone carriers.
- The audit case is saturated because the prompt itself describes the overlap failure; it is still useful as a fixture-backed regression, but not as strong evidence of lift.
- The instruction-simulated ablation is weak/leaky here: the ablation wrapper includes the expected regression and the user prompt still asks for readability. I also ran a materialized ablation for `pos-contrast-channel-night-closure` by copying the skill and removing the contrast-channel/data-critical guidance.

Round 9 contrast-channel run: `eval-runs/current-round9-contrast-channel-20260615/`

| Variant | `pos-contrast-channel-night-closure` objective |
|---|---:|
| `with_skill` | 1.0 |
| `without_skill` | 0.0 |
| `materialized-no-contrast-channel-discipline` | 0.0 |
| `ablation:no-contrast-channel-discipline` | 1.0 |

Interpretation: the real copied-skill ablation catches the intended regression; the instruction-simulated ablation remains saturated because it tells the model what regression to avoid.
