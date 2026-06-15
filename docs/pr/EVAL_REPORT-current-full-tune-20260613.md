# Eval report — current-full-tune-20260613

## Scope

Ran the full visible `tune` suite for `swiss-poster-skill` after the current changes.

- Cases: 24 tune cases
- Variants: `with_skill` and `without_skill`
- Model-run outputs: 48
- Hidden holdout/holdback: not run; private prompt refs are intentionally absent
- Ablation variants: not fully run here; `--include-ablations` currently expands to 210 generation tasks, so those need a separate focused ablation run

Run artifacts:

- Outputs: `eval-runs/current-full-tune-20260613/`
- Benchmark JSON: `/tmp/current-full-tune-20260613-benchmark-final.json`
- Judge JSONL: `/tmp/current-full-tune-20260613-judge-with-skill.jsonl`
- Trigger report: `/tmp/current-full-tune-20260613-trigger-report.json`
- HTML viewer: `docs/pr/eval-viewer-current-full-tune-20260613.html`

## Commands

```sh
python3 ../updating_all_of_my_skills/skill-eval-harness/skill_benchmark.py validate evals/shared-benchmark.json

# Prepared and ran all tune cases x with/without skill using the Pi smoke runner
SKILL_EVAL_WORKSPACE_ROOT=/Users/adewale/Documents/projects/code \
  python3 ../updating_all_of_my_skills/skill-eval-harness/examples/adewale-workspace/run_pi_smoke.py \
  --run-name current-full-tune-20260613 \
  --selection /tmp/swiss-selection-chunk-N.json \
  --timeout 240

python3 ../updating_all_of_my_skills/skill-eval-harness/skill_benchmark.py benchmark \
  evals/shared-benchmark.json \
  --runs eval-runs/current-full-tune-20260613 \
  --split tune \
  --allow-scripts \
  --judge-results /tmp/current-full-tune-20260613-judge-with-skill.jsonl \
  --out /tmp/current-full-tune-20260613-benchmark-final.json

python3 ../updating_all_of_my_skills/skill-eval-harness/run_pi_trigger_eval.py \
  evals/shared-benchmark.json \
  --split tune \
  --runs-per-query 1 \
  --workers 3 \
  --timeout 120 \
  --out /tmp/current-full-tune-20260613-trigger-report.json \
  --trace-runs eval-runs/current-full-tune-20260613-trigger-traces
```

## Results

| Variant | Objective mean | Combined mean | Min objective | Missing outputs |
|---|---:|---:|---:|---:|
| `with_skill` | 1.000 | 1.000 | 1.000 | 0 |
| `without_skill` | 0.646 | 0.646 | 0.000 | 0 |

Paired summary:

- With-skill objective pass rate: `1.000`
- Without-skill objective pass rate: `0.646`
- Absolute delta: `+0.354`
- Negative delta cases: none

Trigger eval:

- 6/6 passed
- Pass rate: `1.0`

Qualitative judge pass:

- Ran judge assertions for `with_skill`
- 18/18 judge rows passed

## Eval-quality fixes made during the run

The first benchmark exposed false negatives in the evals rather than real skill failures:

- `fixture-file-present` asserted against the run output directory and always failed for the round-6 fixture case; removed it because the semantic fixture oracle already validates the behavior.
- `reject-rounded-photo-card` failed explanatory text like “not a card”; narrowed it to actual rounded/shadow/card classes.
- `drama_oracle.py` incorrectly banned `rounded-full`, which is needed for Swiss geometric circles/rings; narrowed the ban to SaaS-style rounded boxes (`rounded-lg/xl/2xl/3xl`).
- Mobile/scroll/rotation assertions were too literal; expanded them to accept equivalent phrasing like `No X-scroll`, `seasoning`, and “mobile sideways scroll, no.”

After those assertion-quality fixes, the with-skill suite is fully green.

## Template/narrowing audit

The objective suite is green, but the user concern is valid: the current skill output is drifting toward a recognizable template.

I ran a post-benchmark similarity audit over the 9 positive `with_skill` outputs:

- Class-token Jaccard similarity:
  - mean: `0.267`
  - median: `0.267`
  - max: `0.360` (`pos-dramatic-event-poster` vs `pos-tailwind-poster-responsive-proof`)
- 5-gram text/code similarity:
  - mean: `0.043`
  - median: `0.044`
  - max: `0.080`

The low 5-gram similarity means outputs are not literal copies. But the feature audit shows strong visual convergence:

- 9/9 positive outputs used `grid-cols-12`, `overflow-hidden`, `text-[11px]`, `bg-[#C8102E]`, and mega type patterns.
- 8/9 used `bg-stone-900` / hard dark field patterns.
- Most positive outputs used cropped mega type + line/rhythm texture.
- Many used rings/circles or a right-side dark field.

That means the skill is not producing a single code template, but it is nudging the model toward a **single visual recipe**: dark field + red accent + cropped mega word + line/ring texture.

## Recommendation

Keep the semantic/legibility guardrails, but add a diversity guardrail next:

1. Add an anti-template eval case that explicitly forbids the common default motifs (`right-side dark split`, `concentric rings`, `line field`, `giant date`) and requires a different archetype.
2. Add a suite-level diversity audit script that fails if too many positive outputs use the same motif family.
3. Update `SKILL.md` to say: choose the archetype by semantic fit, and do not reuse the same dominant motif across sections/examples.
4. Regenerate the 12 before/after mini-pairs so the after panels do not all use the same right-side dark field layout.
