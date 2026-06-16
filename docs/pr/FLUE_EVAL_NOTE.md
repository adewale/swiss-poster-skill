# Flue Framework eval note

The generated Flue poster was removed from PR evidence and converted into eval coverage.

## What the failure showed

- **Rendered readability gap:** the deploy/support line `Run locally via CLI...` was not marked as critical text, so the generic rendered oracle ignored it. At poster scale the word immediately before `via CLI` (`locally`) became hard to read. Source-bearing support copy still needs local contrast/quiet-field protection.
- **Web CTA leakage:** `View Documentation` came from web-input/navigation language and was promoted into a poster CTA. For print/poster artifacts, web buttons such as `View documentation`, `Get started`, and `Read the docs` should be treated as site chrome unless the user explicitly asks for UI.

## Compare/contrast with PR #13 reference

Reference: <https://github.com/adewale/swiss-poster-skill/pull/13/changes#diff-84c88a00338db59b1e308d447205cde61e21b861146988a7967a1201d821f8ff>

The PR #13 `posters/flue.html` reference handles the same source differently:

- It turns source facts into poster material: `The Agent Harness Framework`, `not another SDK`, `Agent = Model + Harness`, architecture layers, package names, and agent-loop primitives.
- It presents source/navigation information as structured technical-poster metadata, not as a web button module.
- It does **not** use `View Documentation` as the poster CTA.

The new eval therefore checks both dimensions: source-support text readability beyond `[data-critical]`, and filtering of inappropriate web CTAs.

## New eval assets

- `pos-flue-framework-poster` — positive generation case from the Flue prompt plus reproducible source excerpts.
- `round13-audit-flue-readability-cta` — fixture-backed audit of the bad generated poster compared with the PR #13 reference notes.
- `evals/oracles/flue_framework_oracle.py` — rejects web CTA leakage and pixel-audits any rendered text run containing `via CLI`.
- `evals/fixtures/round13-flue-framework/` — bad fixture, source excerpts, and PR #13 reference notes.

Current targeted run: `eval-runs/current-round13-flue-20260616/`.

- `with_skill` mean over the two new cases: `0.5`.
- `pos-flue-framework-poster` currently fails with-skill (`0.0`) because the model put `data-critical` on 11px microcopy. This is a useful additional signal: critical/readability annotations are still too easy to misuse.
- `round13-audit-flue-readability-cta` passes with-skill (`1.0`).
- `pos-flue-framework-poster` also fails `without_skill` (`0.0`) and `ablation:no-web-cta-filter` (`0.0`); the ablation is inconclusive until the positive baseline passes.
