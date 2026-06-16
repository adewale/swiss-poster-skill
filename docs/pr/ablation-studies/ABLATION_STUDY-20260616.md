# Ablation study — Swiss poster skill changes since last merge

Method: one instruction-simulated ablation sentinel was run for each of the 26 ablation IDs in `evals/shared-benchmark.json`; fresh with/without baselines were added for the ten period/genre cases and the Flue CTA/readability case. Existing targeted multi-case/materialized runs are included as supporting context. Objective scores are deterministic harness/oracle pass rates; judge assertions were not rerun here.

## Sentinel results

| Ablation | Sentinel case | With | Without | Ablated | Effect |
|---|---|---:|---:|---:|---|
| `no-six-principles` | `pos-poster-composition` | 1.000 | 0.750 | 1.000 | saturated/no drop |
| `no-gotchas` | `neg-horizontal-scroll` | 1.000 | 0.000 | 0.500 | regressed |
| `no-components` | `pos-component-set` | 1.000 | 1.000 | 1.000 | saturated/no drop |
| `no-tokens` | `pos-dark-mode` | 1.000 | 1.000 | 1.000 | saturated/no drop |
| `no-research` | `pos-historical-rhythm-public-concert` | 1.000 | 0.000 | 0.000 | regressed |
| `no-output-contract` | `pos-poster-composition` | 1.000 | 0.750 | 1.000 | saturated/no drop |
| `no-dramatic-recipe` | `pos-dramatic-event-poster` | 1.000 | 0.750 | 1.000 | saturated/no drop |
| `no-anti-slop` | `neg-multi-accent-gradient` | 1.000 | 0.000 | 1.000 | saturated/no drop |
| `no-communication-before-spectacle` | `pos-semantic-legible-jazz` | 1.000 | 0.333 | 1.000 | saturated/no drop |
| `no-subject-archetype-selection` | `pos-object-poster-archetype` | 1.000 | 0.000 | 1.000 | saturated/no drop |
| `no-protected-reading-zone` | `round8-audit-overlapped-critical-text` | 1.000 | 1.000 | 1.000 | saturated/no drop |
| `no-contrast-channel-discipline` | `pos-contrast-channel-night-closure` | 1.000 | 0.000 | 1.000 | saturated/no drop |
| `no-artifact-fidelity` | `pos-source-ledger-thread-recap` | 1.000 | 0.000 | 0.000 | regressed |
| `no-historical-grounding` | `pos-historical-rhythm-public-concert` | 1.000 | 0.000 | 0.000 | regressed |
| `no-period-lineage-selection` | `pos-period-lineage-travel-photomontage` | 0.000 | 0.000 | 0.000 | inconclusive (with-skill failed) |
| `no-palette-lineage-breadth` | `pos-palette-lineage-lake-travel` | 0.000 | 0.000 | 0.000 | inconclusive (with-skill failed) |
| `no-object-poster-restraint` | `pos-object-poster-typographic-restraint` | 1.000 | 0.000 | 1.000 | saturated/no drop |
| `no-print-proportion-audit` | `pos-print-proportion-no-web-grid` | 0.000 | 0.000 | 0.000 | inconclusive (with-skill failed) |
| `no-material-process-surface` | `pos-material-process-lithographic-market` | 1.000 | 0.000 | 1.000 | saturated/no drop |
| `no-diagram-restraint` | `pos-diagram-restraint-theatre-figure-ground` | 1.000 | 0.000 | 1.000 | saturated/no drop |
| `no-embodied-reference-discipline` | `pos-embodied-reference-no-visible-citation` | 1.000 | 0.000 | 1.000 | saturated/no drop |
| `no-photomontage-authorship` | `pos-photomontage-authorship-editorial` | 1.000 | 0.000 | 1.000 | saturated/no drop |
| `no-restraint-as-drama` | `pos-hofmann-restraint-two-contrasts` | 1.000 | 0.000 | 0.000 | regressed |
| `no-genre-breadth-selection` | `pos-genre-breadth-geigy-scientific` | 1.000 | 0.000 | 1.000 | saturated/no drop |
| `no-rendered-poster-proof` | `pos-rendered-critical-text-civic-notice` | 1.000 | 0.000 | 0.000 | regressed |
| `no-web-cta-filter` | `pos-flue-framework-poster` | 0.000 | 0.000 | 0.000 | inconclusive (with-skill failed) |


Summary: regressed=6, saturated/no drop=16, inconclusive (with-skill failed)=4

## Existing targeted context

- `current-round7-motif-20260613` (6 cases): `with_skill`=1.000, `without_skill`=0.167, `ablation:no-subject-archetype-selection`=0.667
- `current-round8-readability-20260615` (2 cases): `with_skill`=1.000, `without_skill`=0.500, `ablation:no-protected-reading-zone`=1.000
- `current-round9-contrast-channel-20260615` (2 cases): `with_skill`=1.000, `without_skill`=0.000, `ablation:no-contrast-channel-discipline`=1.000, `materialized-no-contrast-channel-discipline`=0.000
- `current-round10-artifact-integrity-20260615` (5 cases): `with_skill`=1.000, `without_skill`=0.200, `ablation:no-artifact-fidelity`=0.200, `ablation:no-historical-grounding`=0.600, `materialized-no-artifact-fidelity`=0.000, `materialized-no-historical-grounding`=0.000
- `current-round12-rendered-proof-20260615` (1 cases): `with_skill`=1.000, `without_skill`=0.000, `ablation:no-rendered-poster-proof`=0.000

## Notes

- `ablation:<id>` is instruction-simulated by the harness runner; it is useful smoke evidence but can saturate when prompts themselves restate the desired behavior.
- Materialized ablations exist only for selected prior runs (`no-contrast-channel-discipline`, `no-artifact-fidelity`, `no-historical-grounding`).
- Five failed period/genre `with_skill` baselines were retried in `current-period-with-skill-retry-20260616`; two recovered (`object-poster-restraint`, `hofmann-restraint`), while `travel-photomontage`, `lake-travel-palette`, and `print-proportion` still failed their strict marker oracles. Those ablations are inconclusive until the baseline/oracle is repaired.
- The new `no-web-cta-filter` sentinel is also inconclusive because `pos-flue-framework-poster` currently fails with-skill on critical-text annotation/readability misuse before the CTA ablation can be interpreted.
- OCR remains unavailable; rendered critical-text evidence uses browser geometry plus screenshot-differential pixel checks.
- Full 51 tune cases × 26 ablations would be 1,326 generations, so this run uses one targeted sentinel per component plus prior multi-case runs.
