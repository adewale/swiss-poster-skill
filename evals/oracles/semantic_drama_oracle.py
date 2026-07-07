#!/usr/bin/env python3
"""Semantic + legibility oracle for dramatic Swiss poster outputs.

The drama oracle checks visual carriers. This one checks the next failure mode:
large/cropped elements must communicate the subject and must not make the
primary reading path hard to understand.
"""
from __future__ import annotations
import json
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


def visible_large_number(text: str) -> bool:
    """Catch arbitrary date/numeral-as-anchor in generated HTML/Tailwind.

    Avoid matching z-index, widths, colors, etc. by looking for large text classes
    followed by visible numeric text content.
    """
    return has(
        r'class=["\'][^"\']*(?:text-\[clamp\(|text-\[(?:[7-9]|1\d|2\d|3\d)rem\]|text-(?:7xl|8xl|9xl))[^"\']*["\'][^>]*>\s*(?:0?[1-9]|[12]\d|19\d\d|20\d\d)\s*(?:<|$)',
        text,
    )


def check_pos_semantic_legible_jazz(text: str) -> list[str]:
    failures: list[str] = []
    required_any = {
        "music/rhythm semantic anchor": [
            r"jazz", r"rhythm", r"beat", r"tempo", r"syncop", r"sound", r"audio", r"frequency", r"wave", r"vibration", r"concentric", r"line field",
        ],
        "readable primary path": [
            r"readable", r"legible", r"at a glance", r"primary reading path", r"clear title", r"unobstructed", r"z-(?:20|30|40)",
        ],
        "implemented poster structure": [r"grid-cols-12"],
        "edge/crop with clipping": [r"overflow-hidden", r"overflow-x-hidden", r"overflow-clip"],
        "accessible action": [r"44px", r"min-h-11", r"min-h-\[44px\]"],
    }
    for label, patterns in required_any.items():
        if not any(has(p, text) for p in patterns):
            failures.append(f"missing {label}")
    if visible_large_number(text):
        failures.append("uses a giant visible numeral/date even though the prompt withheld a meaningful date")
    if has(r"hard to read|difficult to read|illegible|unreadable", text) and not has(r"avoid|fix|prevent|not", text):
        failures.append("acknowledges illegibility without fixing it")
    return failures


def check_audit_unreadable_fixture(text: str) -> list[str]:
    failures: list[str] = []
    required_any = {
        "calls out legibility failure": [r"hard to read", r"illegible", r"unreadable", r"legibility", r"readability", r"primary reading path"],
        "calls out arbitrary/non-semantic date": [r"arbitrary", r"non-semantic", r"invented date", r"meaningless date", r"date.*doesn['’]?t", r"62.*doesn['’]?t"],
        "proposes semantic music/rhythm replacement": [r"rhythm", r"beat", r"tempo", r"sound", r"audio", r"wave", r"frequency", r"concentric", r"line field", r"jazz"],
        "keeps implementation constraints": [r"grid-cols-12"],
        "keeps mobile/overflow safety": [r"overflow-hidden", r"overflow-x-hidden", r"no horizontal scroll", r"320px"],
    }
    for label, patterns in required_any.items():
        if not any(has(p, text) for p in patterns):
            failures.append(f"missing {label}")
    if has(r"keep the giant date|keep 1962|keep 62", text):
        failures.append("endorses the arbitrary giant date instead of replacing it")
    return failures


CHECKS = {
    "pos-semantic-legible-jazz": check_pos_semantic_legible_jazz,
    "round6-audit-unreadable-drama": check_audit_unreadable_fixture,
}


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: semantic_drama_oracle.py OUTPUT_DIR CASE_ID", file=sys.stderr)
        return 2
    output_dir = Path(sys.argv[1])
    case_id = sys.argv[2]
    check = CHECKS.get(case_id)
    if check is None:
        print(f"unknown case id: {case_id}", file=sys.stderr)
        return 2
    text = read_output(output_dir)
    failures = check(text)
    print(json.dumps({"score": 0 if failures else 1, "max_score": 1, "case_id": case_id}))
    if failures:
        print(f"FAIL semantic drama oracle: {case_id}")
        for failure in failures:
            print("- " + failure)
        return 1
    print(f"OK semantic drama oracle: {case_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
