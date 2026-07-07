#!/usr/bin/env python3
"""Deterministic drama-carrier oracle for Swiss poster skill outputs.

This does not judge beauty. It catches outputs that claim Swiss poster style but
lack the code/text carriers that usually produce actually dramatic posters:
12-column grid, cropped dominant anchor, microtype, hard fields, graphic systems,
no SaaS/card slop, and mobile/overflow safety.
"""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path

REQUIRED_GROUPS: dict[str, list[str]] = {
    "12-column grid": [r"grid-cols-12"],
    "fluid/mega anchor": [r"text-\[clamp\(", r"clamp\([^)]*(?:1[2-9]|2\d|3\d)vw", r"text-\[(?:1[0-9]|2[0-9]|3[0-9])rem\]"],
    "microtype/data layer": [r"text-\[11px\]", r"text-xs[^\n]*(?:tracking-widest|uppercase)", r"tracking-widest[^\n]*(?:uppercase|text-xs)"],
    "edge crop/bleed": [r"overflow-(?:hidden|clip|x-hidden)", r"whitespace-nowrap", r"-[a-z]+-\[", r"-translate-[xy]", r"-right-", r"-left-", r"clip-path"],
    "single accent token": [r"#C8102E", r"--poster-accent", r"--accent"],
    "hard field/inversion": [r"bg-stone-900", r"bg-stone-950", r"mix-blend-difference", r"grid-cols-1 md:grid-cols-2", r"split"],
    "graphic system": [r"rounded-full", r"repeating-linear-gradient", r"radial-gradient", r"halftone", r"moire", r"concentric", r"border-\[[0-9]+px\]", r"grayscale", r"contrast-1", r"mix-blend"],
    "mobile safety": [r"320px", r"no horizontal scroll", r"overflow-x-hidden", r"min-h-11", r"44px", r"min-h-\[44px\]"],
}

FORBIDDEN: dict[str, str] = {
    "SVG-only answer": r"(?is)(```\s*svg|save as [^\n]*\.svg)",
    "gradient text": r"bg-clip-text|text-transparent",
    "purple/cyan AI palette": r"(?:from|via|to|bg|text|border)-(?:purple|violet|fuchsia|cyan)-\d+|from-\w+-\d+\s+via-|to-\w+-\d+",
    "soft SaaS chrome": r"rounded-(?:lg|xl|2xl|3xl)|shadow-(?:lg|xl|2xl)|backdrop-blur|blur-3xl",
    "generic card grid emphasis": r"grid-cols-1 md:grid-cols-3[^\n]{0,120}(?:card|feature|rounded|shadow)",
}


def read_output(output_dir: Path) -> str:
    p = output_dir / "output.md"
    if not p.exists():
        raise FileNotFoundError(f"missing output: {p}")
    return p.read_text(encoding="utf-8", errors="replace")


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: drama_oracle.py OUTPUT_DIR CASE_ID", file=sys.stderr)
        return 2
    output_dir = Path(sys.argv[1])
    case_id = sys.argv[2]
    text = read_output(output_dir)
    failures: list[str] = []

    for label, patterns in REQUIRED_GROUPS.items():
        if not any(re.search(p, text, re.I | re.M | re.S) for p in patterns):
            failures.append(f"missing drama carrier: {label}")

    for label, pattern in FORBIDDEN.items():
        if re.search(pattern, text, re.I | re.M | re.S):
            failures.append(f"forbidden {label}")

    print(json.dumps({"score": 0 if failures else 1, "max_score": 1, "case_id": case_id}))
    if failures:
        print(f"FAIL drama oracle: {case_id}")
        for f in failures:
            print("- " + f)
        return 1
    print(f"OK drama oracle: {case_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
