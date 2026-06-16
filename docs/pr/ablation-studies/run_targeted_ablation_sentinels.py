#!/usr/bin/env python3
from __future__ import annotations
import importlib.util
import json
import os
from pathlib import Path
import sys
import time
import traceback

REPO_ROOT = Path(__file__).resolve().parents[3]
WORKSPACE_ROOT = REPO_ROOT.parent
os.environ['SKILL_EVAL_WORKSPACE_ROOT'] = str(WORKSPACE_ROOT)
RUNNER = (WORKSPACE_ROOT / 'updating_all_of_my_skills/skill-eval-harness/examples/adewale-workspace/run_pi_smoke.py').resolve()
spec = importlib.util.spec_from_file_location('run_pi_smoke', RUNNER)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)  # type: ignore[union-attr]
mod.ROOT = WORKSPACE_ROOT

RUN_NAME = 'current-all-ablation-sentinels-20260616'
TIMEOUT = 300

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
}

PERIOD_ABLATIONS = {
    'no-period-lineage-selection','no-palette-lineage-breadth','no-object-poster-restraint',
    'no-print-proportion-audit','no-material-process-surface','no-diagram-restraint',
    'no-embodied-reference-discipline','no-photomontage-authorship','no-restraint-as-drama',
    'no-genre-breadth-selection'
}

manifest = mod.load_manifest('swiss-poster-skill')
cases = {c['id']: c for c in manifest['cases']}

tasks = []
for aid, cid in SENTINELS.items():
    tasks.append((cid, f'ablation:{aid}'))
period_cases = sorted({cid for aid, cid in SENTINELS.items() if aid in PERIOD_ABLATIONS})
for cid in period_cases:
    tasks.extend([(cid, 'with_skill'), (cid, 'without_skill')])
seen=set(); tasks=[t for t in tasks if not (t in seen or seen.add(t))]

out_dir = REPO_ROOT / 'eval-runs' / RUN_NAME
out_summary = out_dir / '_run-summary.json'
out_dir.mkdir(parents=True, exist_ok=True)
completed=[]
if out_summary.exists():
    try:
        completed = json.loads(out_summary.read_text()).get('completed', [])
    except Exception:
        completed = []

def already_done(cid, variant):
    return (out_dir / cid / variant / 'output.md').exists()

def write_summary():
    out_summary.write_text(json.dumps({'run_name': RUN_NAME, 'tasks': tasks, 'completed': completed}, indent=2) + '\n', encoding='utf-8')

print(json.dumps({'run_name': RUN_NAME, 'task_count': len(tasks), 'timeout': TIMEOUT, 'runner': str(RUNNER)}, indent=2), flush=True)
write_summary()
for i, (cid, variant) in enumerate(tasks, 1):
    if already_done(cid, variant):
        row = {'case_id': cid, 'variant': variant, 'skipped': True, 'returncode': 0, 'timed_out': False}
        print(f'[{i}/{len(tasks)}] SKIP {cid} {variant}', flush=True)
        if row not in completed:
            completed.append(row); write_summary()
        continue
    print(f'[{i}/{len(tasks)}] RUN {cid} {variant}', flush=True)
    start = time.time()
    try:
        row = mod.run_case('swiss-poster-skill', manifest, cases[cid], variant, RUN_NAME, TIMEOUT)
    except Exception as e:
        row = {'case_id': cid, 'variant': variant, 'error': repr(e), 'traceback': traceback.format_exc()}
        completed.append(row); write_summary()
        print(f'[{i}/{len(tasks)}] ERROR {cid} {variant}: {e!r}', flush=True)
        raise
    row['elapsed_wall_s'] = round(time.time() - start, 2)
    completed.append(row); write_summary()
    print(f'[{i}/{len(tasks)}] DONE {json.dumps(row)}', flush=True)
    if row.get('returncode') not in (0, None):
        print('nonzero return; continuing to collect evidence', file=sys.stderr, flush=True)

print(f'wrote {out_summary}', flush=True)
