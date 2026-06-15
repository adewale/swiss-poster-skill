#!/usr/bin/env python3
"""Protected-reading-zone oracle for Swiss poster outputs.

This checks the failure exposed by the characterization contact sheet: dramatic
anchors, route lines, slashes, and diagrams crossing the actual title/body/CTA.
It is intentionally text/code based; it catches whether the output contains the
implementation carriers and audit language that prevent illegible drama.
"""
from __future__ import annotations
import re
import sys
from pathlib import Path


def read_output(output_dir: Path) -> str:
    p = output_dir / "output.md"
    if not p.exists():
        raise FileNotFoundError(f"missing output: {p}")
    return p.read_text(encoding="utf-8", errors="replace")


def has(pattern: str, text: str) -> bool:
    return re.search(pattern, text, re.I | re.M | re.S) is not None


def check_groups(text: str, groups: dict[str, list[str]]) -> list[str]:
    failures: list[str] = []
    for label, patterns in groups.items():
        if not any(has(p, text) for p in patterns):
            failures.append(f"missing {label}")
    return failures


def check_pos_protected_reading_zone(text: str) -> list[str]:
    failures = check_groups(text, {
        "12-column poster structure": [r"grid-cols-12"],
        "protected/quiet reading zone concept": [r"protected reading", r"reading zone", r"quiet field", r"uninterrupted", r"data-critical"],
        "critical copy above graphic layer": [r"z-(?:30|40|50)", r"relative z-(?:30|40|50)", r"data-critical"],
        "decorative graphic separated from reading layer": [r"aria-hidden", r"pointer-events-none", r"z-(?:0|10|20)", r"opacity-(?:5|10|15|20)", r"/[[]?0\.0[5-9][]]?", r"text-stone-900/\[0\.0[5-9]\]"],
        "solid backing or explicit contrast protection": [r"bg-stone-(?:50|900|950)", r"contrast", r"AA", r"solid (?:field|panel|backing)", r"bg-\[#(?:fafaf9|1c1917|0c0a09)\]"],
        "legible title/body/CTA intent": [r"readable", r"legible", r"unobstructed", r"at a glance", r"clear title", r"primary reading path", r"data-critical=\"(?:title|body|date|cta)"],
        "mobile/overflow safety": [r"overflow-hidden", r"overflow-x-hidden", r"overflow-clip", r"no horizontal scroll", r"320px"],
    })
    if has(r"body copy[^\n]{0,80}(?:over|on top of|across)[^\n]{0,80}(?:mega|route|diagram|photo|anchor)", text) and not has(r"never|avoid|do not|must not", text):
        failures.append("appears to allow body copy directly over noisy graphic anchors")
    return failures


def check_contrast_channel_discipline(text: str) -> list[str]:
    failures = check_groups(text, {
        "12-column poster structure": [r"grid-cols-12"],
        "critical text annotations": [r"data-critical=\"(?:title|body|date|cta)[^\"]*\""],
        "separated dramatic channel": [r"data-channel=\"dramatic\"", r"aria-hidden=\"true\"[^>]{0,160}pointer-events-none", r"pointer-events-none[^>]{0,160}aria-hidden=\"true\""],
        "hard contrast field remains dramatic": [r"bg-stone-(?:900|950)", r"bg-\[#C8102E\]", r"text-stone-50", r"mix-blend-difference"],
        "critical signal sits above graphics": [r"z-(?:30|40|50)", r"relative z-(?:30|40|50)"],
        "demoted texture/behind layer exists": [r"data-channel=\"texture\"", r"opacity-(?:5|10|15)", r"text-stone-(?:50|900)/\[0\.0[5-9]\]", r"z-0"],
        "edge pressure or brutal geometry retained": [r"rotate-", r"-rotate-", r"clip-path", r"overflow-hidden", r"-left-", r"-right-", r"skew", r"text-\[clamp"],
        "mobile/overflow safety": [r"overflow-hidden", r"overflow-x-hidden", r"overflow-clip", r"min-h-\[?100", r"min-h-screen", r"min-h-svh"],
    })
    lowered_drama = has(r"soft shadow|rounded-(?:xl|2xl|3xl)|card grid|pastel|gentle|calm minimalist|accessibility handout", text)
    if lowered_drama and not has(r"avoid|no |not |remove|reject", text):
        failures.append("appears to solve readability by lowering poster drama")
    return failures


def check_audit_overlapped_critical_text(text: str) -> list[str]:
    failures = check_groups(text, {
        "calls out critical text overlap/collision": [r"overlap", r"collision", r"cross(?:es|ing)", r"obscur", r"covered", r"text-on-text"],
        "names the readability failure": [r"hard to read", r"illegible", r"unreadable", r"readability", r"legibility", r"primary reading path", r"reading (?:area|path)", r"critical copy", r"same rectangle", r"same corridor"],
        "requires protected/quiet reading zone": [r"protected reading", r"reading zone", r"quiet field", r"uninterrupted", r"calm field"],
        "separates critical and graphic layers": [r"critical", r"graphic layer", r"z-index", r"z-(?:30|40|50)", r"aria-hidden", r"pointer-events-none", r"behind"],
        "mentions contrast or solid backing": [r"contrast", r"AA", r"solid field", r"solid panel", r"backing", r"bg-stone-(?:50|900|950)"],
        "preserves drama while moving/softening anchor": [r"keep poster energy", r"preserve", r"move", r"behind", r"low opacity", r"crop", r"secondary layer"],
        "keeps implementation constraints": [r"grid-cols-12", r"overflow-hidden", r"overflow-x-hidden", r"320px", r"44px"],
    })
    if has(r"keep the overlap|leave the collision|body copy can cross", text) and not has(r"do not|avoid|never|fix", text):
        failures.append("endorses the illegible overlap instead of fixing it")
    return failures


CHECKS = {
    "pos-protected-reading-zone-credential": check_pos_protected_reading_zone,
    "pos-contrast-channel-night-closure": check_contrast_channel_discipline,
    "round8-audit-overlapped-critical-text": check_audit_overlapped_critical_text,
}


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: readability_oracle.py OUTPUT_DIR CASE_ID", file=sys.stderr)
        return 2
    output_dir = Path(sys.argv[1])
    case_id = sys.argv[2]
    check = CHECKS.get(case_id)
    if check is None:
        print(f"unknown readability case id: {case_id}", file=sys.stderr)
        return 2
    failures = check(read_output(output_dir))
    if failures:
        print(f"FAIL readability oracle: {case_id}")
        for failure in failures:
            print("- " + failure)
        return 1
    print(f"OK readability oracle: {case_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
