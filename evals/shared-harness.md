# Shared benchmark evals

This repo participates in the shared Skill Eval Harness:

- Repo: https://github.com/adewale/skill-eval-harness
- Version: `==0.6.0` (pinned; the same pin is in the manifest's `harness.version` and in CI)
- Manifest: `evals/shared-benchmark.json`

Install the pinned harness from PyPI with [uv](https://docs.astral.sh/uv/):

```sh
uv tool install skill-eval-harness==0.6.0
```

CI (the `install-boundary` job in `.github/workflows/install-boundary.yml`) runs the model-free gate and the text-oracle self-tests on every push and PR; no model, API key or browser is involved, and the steps add a few seconds:

```sh
uvx --from skill-eval-harness==0.6.0 skill-benchmark validate --strict-leakage --check-ablations evals/shared-benchmark.json
uvx --from skill-eval-harness==0.6.0 skill-benchmark audit-manifest evals/shared-benchmark.json --fail-on-blockers
python3 evals/oracles/selftest/run_selftests.py --skip-chrome
```

The Chrome-rendered checks are manual. Run them before merging a change to `evals/oracles/`, with Pillow installed and Chrome/Chromium on `PATH` (or `SWISS_POSTER_CHROME` set); each takes under a minute:

```sh
python3 evals/oracles/selftest/run_selftests.py          # all self-tests, including the 5 Chrome cases
python3 evals/tests/test_rendered_poster_oracle.py       # rendered oracle vs known-good and single-defect posters
(cd website && npm ci --no-audit --no-fund && WRANGLER_SEND_METRICS=false npx wrangler deploy --dry-run --outdir /tmp/website-dry-run)   # site bundles; uploads nothing, needs no credentials
```

## Oracle self-tests

`evals/oracles/selftest/cases.json` gives every script oracle at least one known-good output that must pass and one defective output that must fail *for the stated reason* (the runner checks the failure message, not just the exit code). The runner calls each oracle exactly as the harness does. It also fails if an oracle has no passing or no failing self-test, or if a case with a script assertion has no `oracle-class:` tag. Chrome-dependent cases that cannot find a browser are reported as `UNAVAILABLE` (exit 3), never as a pass. Point `SWISS_POSTER_CHROME` at a Chrome/Chromium binary if none is on `PATH`.

Exit codes of the oracles: `0` pass, `1` the output failed, `2` usage/configuration error, `3` the oracle could not run (no browser or Pillow, or the browser crashed or timed out) and printed `UNAVAILABLE ...`. The harness counts any non-zero exit as not passed, but the assertion evidence records `exit=3` and the `UNAVAILABLE` line, so an infrastructure failure can be told apart from a bad poster. When run as root, or with `SWISS_POSTER_CHROME_NO_SANDBOX=1`, the rendered oracles start Chrome with `--no-sandbox`. They only load local HTML files they wrote themselves.

## Oracle classes

Every case with a script assertion carries a tag `oracle-class:<outcome|compliance|mixed>` (a case tag, because the harness rejects unknown fields on assertions), and each oracle prints the same class as `oracle_class` in its JSON score line:

- `outcome`: measures the rendered artifact whatever words or classes it uses. This is `rendered_poster_oracle.py`: occlusion, overflow, contrast, size.
- `compliance`: requires the skill's own vocabulary, such as `#C8102E` / `--poster-accent`, `grid-cols-12`, `bg-stone-900`, `data-critical` / `data-beat` markers, or the literal `320px`. A without-skill model cannot know these tokens, so part of any with/without lift on these oracles is vocabulary echo, not a better poster. The self-tests pin this: the known-good drama poster fails `drama_oracle.py` when its accent is a non-house blue, or when it is mobile-safe (`overflow-hidden`, a 48px target) without the oracle's words. This applies to `drama`, `fixture`, `readability`, `semantic_drama`, `artifact_integrity` and `motif_diversity`.
- `mixed`: both. `flue_framework_oracle.py` on `pos-flue-framework-poster` checks source-fact fidelity and rendered readability, but also requires `data-source` / `data-critical` markers.

Report skill lift on `oracle-class:outcome` cases separately from `compliance`/`mixed` ones. Only the `outcome` number says the posters got better rather than more on-vocabulary.

Splits:
- `tune` — visible iteration cases.
- `holdout` — hidden end-of-round / merge scoring cases.
- `holdback` — examples withheld from `SKILL.md`, references, docs, and public eval descriptions until after scoring.

Validate from this repo root:

```sh
skill-benchmark validate evals/shared-benchmark.json
```

Prepare paired run tasks:

```sh
skill-benchmark prepare evals/shared-benchmark.json --split tune --out /tmp/swiss-poster-skill-tasks.jsonl
```

Include ablation variants when running a focused regression check:

```sh
skill-benchmark prepare evals/shared-benchmark.json --split tune --include-ablations --out /tmp/swiss-poster-skill-ablation-tasks.jsonl
```

Run autonomous Pi trigger checks for trigger/no-trigger cases:

```sh
skill-pi-trigger-eval evals/shared-benchmark.json --split tune --out /tmp/swiss-poster-skill-trigger-report.json
```

`old_skill` is optional and intentionally not emitted unless `old_skill_paths` is populated and `--include-old-skill` is passed. Hidden `holdout` / `holdback` prompt refs must be supplied privately before scoring; use `--allow-missing-prompts` only for dry-run planning.

Grade saved outputs:

```sh
skill-benchmark benchmark evals/shared-benchmark.json --runs eval-runs/latest --allow-scripts --out /tmp/swiss-poster-skill-benchmark.json
```

Run optional qualitative judges through the shared `judge` backend:

```sh
skill-benchmark judge evals/shared-benchmark.json --runs eval-runs/latest --judge-cmd 'claude -p' --transcripts eval-runs/judge-transcripts --out /tmp/swiss-poster-skill-judge-results.jsonl
skill-benchmark benchmark evals/shared-benchmark.json --runs eval-runs/latest --allow-scripts --judge-results /tmp/swiss-poster-skill-judge-results.jsonl --out /tmp/swiss-poster-skill-benchmark.json
```

Script assertions are deterministic repo-owned oracles and require `--allow-scripts` during grading.
