# Eval report — current-full-plus-round7-boundary-20260613

## Scope

This report evaluates the Swiss-poster skill after adding subject-based archetype selection, motif diversity oracles, and six anti-template archetype cases.

Visible tune coverage is assembled from two model-run batches:

1. `current-full-tune-20260613` — original 24 tune cases x with/without skill.
2. `current-round7-motif-20260613` — six new motif-diversity cases x with/without skill x `ablation:no-subject-archetype-selection`.
3. `current-boundary-retune-20260613` — rerun of `neg-swiss-tax` after strengthening the non-design boundary wording.

Combined run directory:

- `eval-runs/current-full-plus-round7-boundary-20260613/`

HTML viewer:

- `docs/pr/eval-viewer-current-full-plus-round7-boundary-20260613.html`

## Manifest shape

- Total manifest cases: 38
- Visible tune cases: 30
- Hidden holdout/holdback cases: 8
  - Holdout: 7
  - Holdback: 1
- Ablations: 10
- New round-7 visible cases: 6
- New private subject-inference holdouts: 6

New round-7 cases:

- `pos-object-poster-archetype`
- `pos-route-map-archetype`
- `pos-data-diagram-archetype`
- `pos-typographic-specimen-archetype`
- `pos-photomontage-archetype`
- `pos-civic-safety-archetype`

New ablation:

- `no-subject-archetype-selection` — removes “Choose by subject, not by default.”

## Commands

```sh
python3 ../updating_all_of_my_skills/skill-eval-harness/skill_benchmark.py validate evals/shared-benchmark.json

# Round-7 targeted generation: six new cases with with/without/ablation variants
SKILL_EVAL_WORKSPACE_ROOT=/Users/adewale/Documents/projects/code \
python3 ../updating_all_of_my_skills/skill-eval-harness/examples/adewale-workspace/run_pi_smoke.py \
  --run-name current-round7-motif-20260613 \
  --selection /tmp/swiss-round7-selection.json \
  --timeout 240 \
  --variant with_skill \
  --variant without_skill \
  --variant ablation:no-subject-archetype-selection

# Benchmark objective/script assertions
python3 ../updating_all_of_my_skills/skill-eval-harness/skill_benchmark.py benchmark \
  evals/shared-benchmark.json \
  --runs eval-runs/current-full-plus-round7-boundary-20260613 \
  --split tune \
  --allow-scripts \
  --judge-results /tmp/current-full-plus-round7-boundary-20260613-judge-with-skill.jsonl \
  --out /tmp/current-full-plus-round7-boundary-20260613-benchmark-with-judge.json

# Suite-level motif diversity report
python3 evals/oracles/motif_diversity_oracle.py \
  --suite eval-runs/current-full-plus-round7-boundary-20260613 \
  --variant with_skill \
  --out /tmp/current-full-plus-round7-boundary-20260613-motif-report.json
```

## Full visible tune results

| Variant | Cases | Objective mean | Combined mean | Min objective | Missing outputs |
|---|---:|---:|---:|---:|---:|
| `with_skill` | 30 | 1.000 | 1.000 | 1.000 | 0 |
| `without_skill` | 30 | 0.550 | 0.550 | 0.000 | 0 |

Paired summary:

- With-skill objective pass rate: `1.000`
- Without-skill objective pass rate: `0.550`
- Absolute delta: `+0.450`
- Negative delta cases: none

Trigger eval from prior full run:

- 6/6 passed
- Pass rate: `1.0`

With-skill qualitative judge:

- 24/24 judge rows passed
- The previous `neg-swiss-tax` boundary weakness was fixed by making non-design boundary behavior explicit in `SKILL.md`.

## Round-7 motif-diversity impact

Targeted six-case motif suite:

| Variant | Cases | Objective mean |
|---|---:|---:|
| `with_skill` | 6 | 1.000 |
| `without_skill` | 6 | 0.167 |
| `ablation:no-subject-archetype-selection` | 6 | 0.667 |

Interpretation:

- The new guidance creates a strong lift over no-skill outputs on archetype-specific prompts.
- The instruction-simulated ablation regresses from 6/6 to 4/6. This is a measurable but incomplete ablation effect because the prompts themselves still name the desired archetype. Stronger materialized ablations or less-leaky prompts would likely show a larger gap.

Ablation failures:

- `pos-typographic-specimen-archetype` — ablated run fell back to the default right-side dark split.
- `pos-civic-safety-archetype` — ablated run fell back to the default line/halftone field motif.

## Suite-level motif diversity score

`motif_diversity_oracle.py --suite` on the combined with-skill run:

```json
{
  "positive_outputs": 15,
  "semantic_coverage": 6,
  "max_share": 0.533,
  "passed": true,
  "warnings": []
}
```

Motif counts:

```json
{
  "right_dark_split": 3,
  "rings": 2,
  "route_map": 3,
  "civic_safety": 3,
  "line_field": 8,
  "giant_date_number": 2,
  "typographic_specimen": 2,
  "data_diagram": 2,
  "object_poster": 1,
  "photomontage": 1
}
```

Before adding the round-7 cases, the suite-level motif oracle failed on the earlier full run:

- Semantic coverage: `3/6`
- Max motif share: `0.889`
- Warnings:
  - semantic motif coverage too low
  - one motif dominates suite

After adding subject-archetype cases and guidance:

- Semantic coverage: `6/6`
- Max motif share: `0.533`
- No diversity warnings

## Hidden subject-inference holdouts

Added six private holdout placeholders after this run:

- `holdout-subject-inference-01`
- `holdout-subject-inference-02`
- `holdout-subject-inference-03`
- `holdout-subject-inference-04`
- `holdout-subject-inference-05`
- `holdout-subject-inference-06`

These public case names and scenarios intentionally do not disclose the expected archetype. The private prompt refs live under `evals/holdout/subject-inference-*.txt`, and private answer keys live under `evals/holdout/answers/subject-inference-*.json`. Those paths are gitignored. Scored holdout runs should provide prompts where the subject implies an archetype without naming it.

Dry-run task preparation confirms the hidden prompts stay hidden:

```sh
python3 ../updating_all_of_my_skills/skill-eval-harness/skill_benchmark.py prepare \
  evals/shared-benchmark.json \
  --split holdout \
  --allow-missing-prompts \
  --out /tmp/swiss-holdout-tasks.jsonl
# 14 task rows: 7 holdout cases x with/without skill
```

## Caveats

- `line_field` still appears in 8/15 positive outputs. The new cases improve semantic coverage, but the older positive cases still lean heavily on line/rhythm fields.
- The ablation is instruction-simulated, not a materialized alternate skill file. It is useful smoke evidence, not a perfect causal test.
- Several visible round-7 prompts explicitly name the desired archetype, so objective pass rates may be easier than production usage. The new private holdout placeholders are designed to close that gap once private prompts/answer keys are supplied.

## Recommended follow-up

- Populate the private holdout prompt/answer files outside git.
- Add a materialized ablation that removes the “Choose by subject” section from a copied skill file.
- Tighten the suite diversity oracle so legacy line-field overuse becomes a warning threshold after the new cases stabilize.
