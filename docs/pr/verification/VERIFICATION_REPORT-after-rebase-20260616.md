# Verification report after rebase — 2026-06-16

Scope: branch `pr-1` rebased onto `origin/main` (`f90c51b`). Deterministic tests plus all available public tune eval artifacts were graded after the rebase. Hidden holdout/holdback prompts are not present locally; full ablation generation is still impractical, so ablation verification uses the targeted sentinel methodology covering every ablation ID.

## Commands run
- `git rebase origin/main`
- `python3 -m py_compile $(find evals docs/pr -name "*.py" -print)`
- `python3 -m json.tool evals/shared-benchmark.json / skills.sh.json / PR JSON manifests`
- `markdown fence balance check across README, skill, references, and PR docs`
- `python3 ../updating_all_of_my_skills/skill-eval-harness/skill_benchmark.py validate evals/shared-benchmark.json`
- `git diff --check`
- `npm --prefix website ci`
- `(cd website && npm exec -- wrangler deploy --dry-run --outdir /tmp/swiss-poster-worker-verify-rebase-20260616)`
- `skill-benchmark prepare evals/shared-benchmark.json --split tune`
- `skill-benchmark prepare evals/shared-benchmark.json --split tune --include-ablations`
- `skill-benchmark benchmark evals/shared-benchmark.json --runs eval-runs/verification-all-available-after-rebase-20260616 --split tune --allow-scripts`
- `python3 docs/pr/ablation-studies/run_targeted_ablation_sentinels.py`
- `python3 docs/pr/ablation-studies/summarize_ablation_studies.py`
- `skill-benchmark profile-skill for origin/main and current after rebase`
- `skill-benchmark token-overhead using eval-runs/verification-all-available-after-rebase-20260616`

## Static/test results
- Rebase: PASS; branch is now 5 commits ahead and 0 behind `origin/main`.
- Python compile: PASS.
- JSON validation: PASS.
- Markdown fences: PASS.
- Manifest validation: PASS with existing leakage/saturation warnings; manifest size is 59 cases, 26 ablations.
- `git diff --check`: PASS before generated after-rebase artifacts; final staged diff also checked before commit.
- Website install/build smoke: `npm ci` PASS; Wrangler dry-run PASS. `npm audit` reports 5 existing dependency vulnerabilities (2 moderate, 3 high).
- Strict hidden-prompt validation: BLOCKED/expected fail locally because private holdout prompt files are absent, first missing `evals/holdout/rendered-tailwind-01.txt`.
- Tune prepare: 102 rows. Tune+ablation prepare: 1,272 rows.

## Eval benchmark summary after rebase
| Variant | Cases | Missing outputs | Mean objective | Median objective | Mean tokens | Median tokens |
|---|---:|---:|---:|---:|---:|---:|
| `with_skill` | 51 | 0 | 0.922 | 1.000 | 28374 | 24698 |
| `without_skill` | 51 | 1 | 0.370 | 0.000 | 5696 | 5733 |

With-skill failures:
- `pos-period-lineage-travel-photomontage` — score 0.000; missing travel/photomontage lineage marker
- `pos-palette-lineage-lake-travel` — score 0.000; missing one accent discipline
- `pos-print-proportion-no-web-grid` — score 0.000; missing print artifact marker
- `pos-flue-framework-poster` — score 0.000; body: font too small (11.0px); title: font too small (11.0px)

Without-skill missing outputs: `round13-audit-flue-readability-cta`.

Artifacts:
- Benchmark JSON: `docs/pr/verification/benchmark-all-available-after-rebase-20260616.json`
- Viewer: `docs/pr/verification/eval-viewer-all-available-after-rebase-20260616.html`
- Combined run directory: `eval-runs/verification-all-available-after-rebase-20260616/`

## Ablation summary after rebase
- Covered ablations: 26/26.
- Effects: saturated/no drop=16, regressed=6, inconclusive (with-skill failed)=4.
- Method: targeted instruction-simulated sentinel per ablation ID plus existing materialized-ablation context; after rebase the sentinel runner found existing outputs and skipped re-generation.
- Report: `docs/pr/ablation-studies/ABLATION_STUDY-20260616.md`.

## Token cost after rebase
| Scope | origin/main | current after rebase | Delta | Change |
|---|---:|---:|---:|---:|
| Always-loaded skill tokens | 2,473 | 6,519 | +4,046 | +163.6% |
| Reference tokens | 7,441 | 11,843 | +4,402 | +59.2% |
| Full skill surface | 9,914 | 18,362 | +8,448 | +85.2% |

- Paired runtime rows: 51 (50 with token deltas).
- Mean total token delta with skill vs without: 22464; median: 18699.
- Mean input token delta: 17590; median: 15418.
- Mean output token delta: 532; median: 435.

## Rebase visual comparison
- Contact sheet: `docs/pr/rebase-before-after-contact-sheet/contact-sheet.png`
- Index with full-size links: `docs/pr/rebase-before-after-contact-sheet/index.html`
- Result: all ten pre-rebase after images are byte-identical to the after-rebase images in this evidence set; the rebase preserved the generated poster outputs.

## Risks / follow-ups
- Current with-skill public tune objective score remains below 1.0 because four known baselines still fail strict oracles (`pos-flue-framework-poster` and three period/genre cases).
- `round13-audit-flue-readability-cta` lacks a without-skill artifact in the combined evidence set.
- Full ablation matrix generation remains impractical locally; materialized ablations should be added for the newer period/genre, rendered-proof, and web-CTA components.
- Hidden holdout/holdback scoring remains blocked until private prompt/answer files are populated.
