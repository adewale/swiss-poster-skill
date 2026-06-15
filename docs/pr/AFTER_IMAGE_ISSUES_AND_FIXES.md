# After-image issues and historically grounded fixes

Scope: current characterization-sheet reruns, especially the right-hand “current skill rerun” images in `docs/pr/characterization-contact-sheet/contact-sheet.png`.

## Issue taxonomy

| Issue | Affected examples | Historical lesson | Fix added |
|---|---|---|---|
| Evidence contamination | Contact-sheet prompt had begun telling outputs to use contrast-channel/data-critical language | PR evidence should show the skill, not a custom prompt crutch | Removed contrast-channel/data-critical instructions from the contact-sheet prompt; kept only generic rendering/content hygiene |
| Template collapse / same portrait recipe | Most after images: white title slab + black/orange field + route/slash + microtype | Müller-Brockmann grid is a method, not a template; grid proportions should follow the artifact | Added “artifact fidelity before style” and “grid as method, not template” guidance |
| Source-content loss / generic slogans | Cloudflare thread variants, Breaking the 35, MoQ | International Style public communication preserves facts, names, dates, sequence, hierarchy | Added private source-ledger rule and `data-source`/`data-beat` audit markers |
| Images used as wallpaper | Cloudflare photo rows, Connect venue/globe, onepage collage | Herbert Matter photomontage makes image fragments carry place/action/evidence/metaphor | Added image-role rule: `data-image-role="place/person/evidence/sequence/metaphor"` |
| Fake diagrams / decorative routes | MoQ quadrant, Credential Broker, Durable Objects, Cloudflare routes | Müller-Brockmann/Ruder systems thinking: marks encode rhythm/order/relation/measured variables | Added `data-encoding`/`data-variable` rule; remove nodes/axes/lines that do not encode facts |
| Shallow historical grounding | Designer-name cues or generic Swiss surface | Hofmann/Matter/Ruder/Weingart/Troxler/Odermatt-Tissi are compositional moves, not visible labels | Added designer-to-move mapping and `data-reference` marker guidance |
| Microtype as texture | Many afters use “fig/index/channel” decorative labels | Ruder: small type remains functional typography | Microtype must be source notes, captions, coordinates, schedule, credits, or indexes |
| Prompt-shaped artifacts | Dimensions, hex values, “single accent”, “current skill”, “source material” style leakage | Posters are public artifacts, not implementation notes | Added visible-copy ban for dimensions, hex values, eval/provenance labels, prompt terms |
| Clipping/content loss | Ten Principles side panel, Durable Objects right column, Cloudflare onepage/lscape, Lean Weirdness | Public poster reading path must preserve mandatory facts; crop support/graphic layers only | Added required ledger-inside-canvas/unobscured rule; existing protected reading-zone still applies |
| Comparison not content-faithful | Baseline artifact type/order often not preserved | Swiss poster history edits information but does not erase the assignment | Added artifact format/aspect/sequence fidelity guidance |

## New eval coverage

Added `evals/oracles/artifact_integrity_oracle.py` and five round-10 cases:

- `pos-source-ledger-thread-recap` — six source beats, real names, source markers, no generic collapse.
- `pos-encoded-diagram-moq` — MoQ quadrant must encode latency/scale/fanout facts.
- `pos-historical-rhythm-public-concert` — Müller-Brockmann/Musica Viva rhythm must be embodied, not visible name-dropping.
- `pos-historical-figure-ground-theatre` — Hofmann figure/ground must be embodied with protected public reading.
- `round10-audit-after-image-defects` — fixture-backed audit of template/card/prompt-leak/fake-diagram/name-dropping failures.

Added ablations:

- `no-artifact-fidelity`
- `no-historical-grounding`

## Ablation evidence

Run: `eval-runs/current-round10-artifact-integrity-20260615/`

Objective means over the five new round-10 cases:

| Variant | Mean objective |
|---|---:|
| `with_skill` | `1.0` |
| `without_skill` | `0.2` |
| `ablation:no-artifact-fidelity` | `0.2` |
| `ablation:no-historical-grounding` | `0.6` |

Materialized copied-skill ablations:

| Case | Materialized ablation | Result |
|---|---|---:|
| `pos-source-ledger-thread-recap` | removed artifact-fidelity/source-ledger section | `0.0` |
| `pos-historical-rhythm-public-concert` | removed historical-grounding/designer-to-move section | `0.0` |

Interpretation: output cases discriminate strongly. The audit fixture is intentionally saturated because its prompt names the defects; it is useful as regression coverage, not lift evidence.
