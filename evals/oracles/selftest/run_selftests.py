#!/usr/bin/env python3
"""Run the oracle self-tests in cases.json the way the harness runs script assertions.

Each case writes its input to <tmp>/output.md and runs
`python3 oracles/<oracle> <tmp> <args...>` from evals/ (the harness's cwd), then checks:
  - the exit code (0 pass, 1 fail, 2/3 unavailable) matches `expect_exit`;
  - a failing or unavailable case prints its stated `reason`;
  - a verdict (exit 0/1) prints a JSON score line carrying `oracle_class`, and that class
    equals the one the manifest declares for this oracle and case.
It also checks coverage: every oracle in evals/oracles/ has at least one passing and one
failing self-test, and every case in evals/shared-benchmark.json with a script assertion
carries an `oracle-class:<outcome|compliance|mixed>` tag. (A tag, because the harness
rejects unknown fields on assertions.)

Exit 0 = all green; 1 = a self-test or coverage check failed; 3 = a Chrome-dependent case
could not run (no browser): that is reported as UNAVAILABLE, never as a pass.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
EVALS = HERE.parents[1]
ORACLES = EVALS / "oracles"
UNAVAILABLE_EXITS = {2, 3}
CLASSES = {"outcome", "compliance", "mixed"}


def manifest_classes() -> tuple[dict[tuple[str, str], str], list[str]]:
    """(oracle file, first argument after {output_dir}) -> class from the case's tags."""
    manifest = json.loads((EVALS / "shared-benchmark.json").read_text(encoding="utf-8"))
    classes: dict[tuple[str, str], str] = {}
    problems: list[str] = []
    for case in manifest["cases"]:
        scripts = [a for a in case.get("assertions", []) if a.get("type") == "script"]
        if not scripts:
            continue
        tagged = [t.split(":", 1)[1] for t in case.get("tags", []) if t.startswith("oracle-class:")]
        if len(tagged) != 1 or tagged[0] not in CLASSES:
            problems.append(f"{case['id']}: needs exactly one oracle-class:<{'|'.join(sorted(CLASSES))}> tag, has {tagged}")
            continue
        for a in scripts:
            cmd = a.get("command", [])
            oracle = next((p for p in cmd if p.startswith("oracles/")), None)
            if oracle is None:
                continue
            i = cmd.index(oracle) + 2
            classes[(Path(oracle).name, cmd[i] if i < len(cmd) else "")] = tagged[0]
    return classes, problems


def score_line(stdout: str) -> dict | None:
    for line in reversed(stdout.splitlines()):
        line = line.strip()
        if line.startswith("{") and line.endswith("}"):
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            if isinstance(obj, dict) and "score" in obj:
                return obj
    return None


def run_case(case: dict) -> tuple[str, str]:
    """Return (status, detail); status is ok, fail or unavailable."""
    text = (HERE / "inputs" / case["input"]).read_text(encoding="utf-8")
    env = {**os.environ, **case.get("env", {})}
    with tempfile.TemporaryDirectory(prefix="oracle-selftest-") as td:
        (Path(td) / "output.md").write_text(text, encoding="utf-8")
        cmd = [sys.executable, f"oracles/{case['oracle']}", td, *case.get("args", [])]
        try:
            proc = subprocess.run(cmd, cwd=EVALS, env=env, text=True, capture_output=True, timeout=180)
        except subprocess.TimeoutExpired:
            return "unavailable", "oracle timed out after 180s"
    out = proc.stdout + proc.stderr
    want = case["expect_exit"]
    if proc.returncode != want:
        if case.get("needs_chrome") and proc.returncode in UNAVAILABLE_EXITS:
            return "unavailable", f"exit {proc.returncode}: {out.strip().splitlines()[-1] if out.strip() else ''}"
        return "fail", f"exit {proc.returncode}, expected {want}\n{out.strip()[-1500:]}"
    if want != 0 and case.get("reason") and case["reason"] not in out:
        return "fail", f"exit {want} as expected, but not for the stated reason {case['reason']!r}\n{out.strip()[-1500:]}"
    if want in (0, 1):
        line = score_line(proc.stdout)
        if not line or line.get("oracle_class") not in CLASSES:
            return "fail", f"no JSON score line with an oracle_class in {sorted(CLASSES)}: {line}"
        case["_class"] = line["oracle_class"]
    return "ok", ""


def main() -> int:
    spec = json.loads((HERE / "cases.json").read_text(encoding="utf-8"))
    cases = spec["cases"]
    classes, problems = manifest_classes()
    results = {"ok": 0, "fail": 0, "unavailable": 0}
    for case in cases:
        label = f"{case['oracle']} {' '.join(case.get('args', []))} <- {case['input']} (expect exit {case['expect_exit']})"
        status, detail = run_case(case)
        if status == "ok" and "_class" in case:
            # The manifest key is the first argument after {output_dir}: the case id, or
            # the width for the rendered oracle.
            key = (case["oracle"], case["args"][0])
            declared = classes.get(key)
            if declared and declared != case["_class"]:
                status, detail = "fail", f"oracle printed oracle_class={case['_class']!r}; manifest declares {declared!r} for {key}"
        results[status] += 1
        tag = {"ok": "ok  ", "fail": "FAIL", "unavailable": "UNAVAILABLE"}[status]
        note = f"  [{case['characterization']}]" if case.get("characterization") and status == "ok" else ""
        print(f"{tag} {label}{note}")
        if detail:
            print("     " + detail.replace("\n", "\n     "))

    for oracle in sorted(p.name for p in ORACLES.glob("*_oracle.py")):
        exits = {c["expect_exit"] for c in cases if c["oracle"] == oracle}
        if not {0, 1} <= exits:
            problems.append(f"{oracle}: needs at least one passing (exit 0) and one failing (exit 1) self-test")
    for problem in problems:
        print(f"FAIL {problem}")

    print(f"\n{results['ok']} ok, {results['fail']} failed, {results['unavailable']} unavailable; {len(problems)} coverage problem(s)")
    if results["fail"] or problems:
        return 1
    if results["unavailable"]:
        print("Chrome-dependent self-tests could not run; install Chrome/Chromium or set SWISS_POSTER_CHROME.")
        return 3
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
