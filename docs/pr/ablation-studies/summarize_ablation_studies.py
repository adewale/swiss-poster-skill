#!/usr/bin/env python3
from __future__ import annotations
import json
import subprocess
import tempfile
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[3]
HARNESS = (ROOT.parent / 'updating_all_of_my_skills/skill-eval-harness/skill_benchmark.py').resolve()
MANIFEST = ROOT / 'evals/shared-benchmark.json'
OUT_DIR = ROOT / 'docs/pr/ablation-studies'
RUN_PRIORITY = [
    'current-round13-flue-20260616',
    'current-period-with-skill-retry-20260616',
    'current-all-ablation-sentinels-20260616',
    'current-round12-rendered-proof-20260615',
    'current-round10-artifact-integrity-20260615',
    'current-round9-contrast-channel-20260615',
    'current-round8-readability-20260615',
    'current-round7-motif-20260613',
    'current-full-plus-round7-boundary-20260613',
    'current-full-plus-round7-20260613',
]
SENTINELS = {
    'no-six-principles': 'pos-poster-composition',
    'no-gotchas': 'neg-horizontal-scroll',
    'no-components': 'pos-component-set',
    'no-tokens': 'pos-dark-mode',
    'no-research': 'pos-historical-rhythm-public-concert',
    'no-output-contract': 'pos-poster-composition',
    'no-dramatic-recipe': 'pos-dramatic-event-poster',
    'no-anti-slop': 'neg-multi-accent-gradient',
    'no-communication-before-spectacle': 'pos-semantic-legible-jazz',
    'no-subject-archetype-selection': 'pos-object-poster-archetype',
    'no-protected-reading-zone': 'round8-audit-overlapped-critical-text',
    'no-contrast-channel-discipline': 'pos-contrast-channel-night-closure',
    'no-artifact-fidelity': 'pos-source-ledger-thread-recap',
    'no-historical-grounding': 'pos-historical-rhythm-public-concert',
    'no-period-lineage-selection': 'pos-period-lineage-travel-photomontage',
    'no-palette-lineage-breadth': 'pos-palette-lineage-lake-travel',
    'no-object-poster-restraint': 'pos-object-poster-typographic-restraint',
    'no-print-proportion-audit': 'pos-print-proportion-no-web-grid',
    'no-material-process-surface': 'pos-material-process-lithographic-market',
    'no-diagram-restraint': 'pos-diagram-restraint-theatre-figure-ground',
    'no-embodied-reference-discipline': 'pos-embodied-reference-no-visible-citation',
    'no-photomontage-authorship': 'pos-photomontage-authorship-editorial',
    'no-restraint-as-drama': 'pos-hofmann-restraint-two-contrasts',
    'no-genre-breadth-selection': 'pos-genre-breadth-geigy-scientific',
    'no-rendered-poster-proof': 'pos-rendered-critical-text-civic-notice',
    'no-web-cta-filter': 'pos-flue-framework-poster',
}

manifest = json.loads(MANIFEST.read_text())
case_by_id = {c['id']: c for c in manifest['cases']}
ablation_by_id = {a['id']: a for a in manifest['ablations']}

def find_run(case_id: str, variant: str) -> str | None:
    for run in RUN_PRIORITY:
        if (ROOT / 'eval-runs' / run / case_id / variant / 'output.md').exists():
            return run
    return None

def filtered_manifest(case_id: str) -> dict[str, Any]:
    m = dict(manifest)
    m['cases'] = [case_by_id[case_id]]
    return m

def bench_one(run: str, case_id: str, variant: str) -> dict[str, Any]:
    # Put temporary manifests beside evals/shared-benchmark.json so relative
    # fixture/oracle paths keep the same base directory.
    with tempfile.TemporaryDirectory(prefix='ablation-bench-') as td:
        mf = ROOT / 'evals' / f'.tmp-ablation-{case_id}-{variant.replace(":", "-")}.json'
        out = Path(td) / 'benchmark.json'
        mf.write_text(json.dumps(filtered_manifest(case_id)), encoding='utf-8')
        try:
            cmd = ['python3', str(HARNESS), 'benchmark', str(mf), '--runs', str(ROOT/'eval-runs'/run), '--split', 'tune', '--allow-scripts', '--variant', variant, '--out', str(out)]
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
            b = json.loads(out.read_text())
        finally:
            mf.unlink(missing_ok=True)
    summary = b.get('summary', {}).get(variant, {})
    results = b.get('results', [])
    failures=[]
    for r in results:
        if r.get('variant') != variant:
            continue
        for a in r.get('assertions', []):
            if not a.get('passed'):
                failures.append({'assertion': a.get('name'), 'type': a.get('type'), 'evidence': (a.get('evidence') or '')[:800]})
    return {
        'run': run,
        'score': summary.get('mean_objective_pass_rate'),
        'n': summary.get('runs'),
        'failures': failures,
    }

rows=[]
for aid, case_id in SENTINELS.items():
    variants = {'with_skill': 'with_skill', 'without_skill': 'without_skill', 'ablation': f'ablation:{aid}'}
    scores={}
    missing=[]
    for label, variant in variants.items():
        run = find_run(case_id, variant)
        if not run:
            missing.append({'label': label, 'variant': variant, 'case_id': case_id})
            continue
        scores[label] = bench_one(run, case_id, variant)
    rows.append({
        'ablation_id': aid,
        'case_id': case_id,
        'removed_component': ablation_by_id[aid].get('removed_component'),
        'expected_regressions': ablation_by_id[aid].get('expected_regressions', []),
        'scores': scores,
        'missing': missing,
    })

# Existing multi-case/materialized runs for context.
existing_context=[]
for run, variants in {
    'current-round7-motif-20260613': ['with_skill','without_skill','ablation:no-subject-archetype-selection'],
    'current-round8-readability-20260615': ['with_skill','without_skill','ablation:no-protected-reading-zone'],
    'current-round9-contrast-channel-20260615': ['with_skill','without_skill','ablation:no-contrast-channel-discipline','materialized-no-contrast-channel-discipline'],
    'current-round10-artifact-integrity-20260615': ['with_skill','without_skill','ablation:no-artifact-fidelity','ablation:no-historical-grounding','materialized-no-artifact-fidelity','materialized-no-historical-grounding'],
    'current-round12-rendered-proof-20260615': ['with_skill','without_skill','ablation:no-rendered-poster-proof'],
}.items():
    present_cases = sorted([p.name for p in (ROOT/'eval-runs'/run).iterdir() if p.is_dir()])
    with tempfile.TemporaryDirectory(prefix='ablation-context-') as td:
        mf=ROOT/'evals'/f'.tmp-ablation-context-{run}.json'; out=Path(td)/'benchmark.json'
        m=dict(manifest); m['cases']=[case_by_id[c] for c in present_cases if c in case_by_id]
        mf.write_text(json.dumps(m), encoding='utf-8')
        try:
            cmd=['python3',str(HARNESS),'benchmark',str(mf),'--runs',str(ROOT/'eval-runs'/run),'--split','tune','--allow-scripts','--out',str(out)]
            for v in variants: cmd += ['--variant', v]
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
            b=json.loads(out.read_text())
        finally:
            mf.unlink(missing_ok=True)
        existing_context.append({'run': run, 'cases': present_cases, 'summary': {k:v.get('mean_objective_pass_rate') for k,v in b.get('summary',{}).items()}})

summary = {
    'covered_ablations': len(rows),
    'total_ablations': len(manifest['ablations']),
    'sentinel_run': 'current-all-ablation-sentinels-20260616',
    'rows': rows,
    'existing_context': existing_context,
}
OUT_DIR.mkdir(parents=True, exist_ok=True)
(OUT_DIR/'ablation-summary.json').write_text(json.dumps(summary, indent=2) + '\n', encoding='utf-8')

# Markdown report.
lines=[]
lines.append('# Ablation study — Swiss poster skill changes since last merge')
lines.append('')
lines.append(f'Method: one instruction-simulated ablation sentinel was run for each of the {len(manifest["ablations"])} ablation IDs in `evals/shared-benchmark.json`; fresh with/without baselines were added for the ten period/genre cases and the Flue CTA/readability case. Existing targeted multi-case/materialized runs are included as supporting context. Objective scores are deterministic harness/oracle pass rates; judge assertions were not rerun here.')
lines.append('')
lines.append('## Sentinel results')
lines.append('')
lines.append('| Ablation | Sentinel case | With | Without | Ablated | Effect |')
lines.append('|---|---|---:|---:|---:|---|')
for r in rows:
    sc=r['scores']
    w=sc.get('with_skill',{}).get('score')
    wo=sc.get('without_skill',{}).get('score')
    ab=sc.get('ablation',{}).get('score')
    def fmt(x): return '—' if x is None else f'{x:.3f}'
    if ab is None or w is None:
        effect='missing'
    elif w < 1:
        effect='inconclusive (with-skill failed)'
    elif ab < w:
        effect='regressed'
    elif ab == w:
        effect='saturated/no drop'
    else:
        effect='improved/noisy'
    lines.append(f"| `{r['ablation_id']}` | `{r['case_id']}` | {fmt(w)} | {fmt(wo)} | {fmt(ab)} | {effect} |")
lines.append('')
effect_counts = {'regressed': 0, 'saturated/no drop': 0, 'inconclusive (with-skill failed)': 0, 'improved/noisy': 0, 'missing': 0}
for line in lines:
    if line.startswith('| `'):
        effect = line.split('|')[-2].strip()
        effect_counts[effect] = effect_counts.get(effect, 0) + 1
lines.append('')
lines.append('Summary: ' + ', '.join(f"{k}={v}" for k, v in effect_counts.items() if v))
lines.append('')
lines.append('## Existing targeted context')
lines.append('')
for ctx in existing_context:
    lines.append(f"- `{ctx['run']}` ({len(ctx['cases'])} cases): " + ', '.join(f"`{k}`={v:.3f}" for k,v in ctx['summary'].items()))
lines.append('')
lines.append('## Notes')
lines.append('')
lines.append('- `ablation:<id>` is instruction-simulated by the harness runner; it is useful smoke evidence but can saturate when prompts themselves restate the desired behavior.')
lines.append('- Materialized ablations exist only for selected prior runs (`no-contrast-channel-discipline`, `no-artifact-fidelity`, `no-historical-grounding`).')
lines.append('- Five failed period/genre `with_skill` baselines were retried in `current-period-with-skill-retry-20260616`; two recovered (`object-poster-restraint`, `hofmann-restraint`), while `travel-photomontage`, `lake-travel-palette`, and `print-proportion` still failed their strict marker oracles. Those ablations are inconclusive until the baseline/oracle is repaired.')
lines.append('- The new `no-web-cta-filter` sentinel is also inconclusive because `pos-flue-framework-poster` currently fails with-skill on critical-text annotation/readability misuse before the CTA ablation can be interpreted.')
lines.append('- OCR remains unavailable; rendered critical-text evidence uses browser geometry plus screenshot-differential pixel checks.')
lines.append(f'- Full {sum(1 for c in manifest["cases"] if c.get("split") == "tune")} tune cases × {len(manifest["ablations"])} ablations would be {sum(1 for c in manifest["cases"] if c.get("split") == "tune") * len(manifest["ablations"]):,} generations, so this run uses one targeted sentinel per component plus prior multi-case runs.')
(OUT_DIR/'ABLATION_STUDY-20260616.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(OUT_DIR/'ablation-summary.json')
print(OUT_DIR/'ABLATION_STUDY-20260616.md')
