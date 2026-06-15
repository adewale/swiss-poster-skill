#!/usr/bin/env python3
"""Artifact fidelity and historical-grounding oracles for swiss-poster outputs."""
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


def count(pattern: str, text: str) -> int:
    return len(re.findall(pattern, text, re.I | re.M | re.S))


def group_failures(text: str, groups: dict[str, list[str]]) -> list[str]:
    failures: list[str] = []
    for label, patterns in groups.items():
        if not any(has(p, text) for p in patterns):
            failures.append(f"missing {label}")
    return failures


PROMPT_LEAKS = [
    r"840\s*[×x]\s*1200",
    r"#(?:C8102E|F38020)",
    r"single accent",
    r"source material",
    r"source brief",
    r"current skill",
    r"old skill",
    r"generated",
    r"create (?:a|one) poster",
    r"use the loaded",
    r"eval(?:uation)?|oracle|fixture",
]


def visible_text(text: str) -> str:
    text = re.sub(r"<!--.*?-->", " ", text, flags=re.S)
    text = re.sub(r"<style.*?</style>|<script.*?</script>", " ", text, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text)


def prompt_leak_failures(text: str) -> list[str]:
    visibleish = visible_text(text)
    return [f"visible/prompt-shaped leakage: {p}" for p in PROMPT_LEAKS if has(p, visibleish)]


def check_thread_source_ledger(text: str) -> list[str]:
    failures = group_failures(text, {
        "12-column structure": [r"grid-cols-12"],
        "source ledger markers": [r"data-source=", r"data-beat=", r"source ledger"],
        "six source beats": [r"data-beat=\"0?6\"", r">\s*0?6\b", r"six (?:tweet|source|public)"],
        "real entities preserved": [r"County Hall|Waterloo", r"Prada", r"Alpesh", r"Yigit", r"monthly|roughly every month"],
        "critical text annotations": [r"data-critical=\"(?:title|body|date|cta)"],
        "image role or explicit no-asset handling": [r"data-image-role=", r"image role", r"photo", r"venue view"],
        "no horizontal overflow safety": [r"overflow-hidden", r"overflow-x-hidden", r"overflow-clip"],
    })
    if count(r"data-beat=", text) and count(r"data-beat=", text) < 6:
        failures.append("fewer than six data-beat items")
    failures.extend(prompt_leak_failures(text))
    return failures


def check_encoded_diagram_moq(text: str) -> list[str]:
    failures = group_failures(text, {
        "12-column structure": [r"grid-cols-12"],
        "diagram encoding marker": [r"data-encoding=", r"source variable", r"visual variable"],
        "latency axis/fact": [r"latency", r"sub-second", r"<\s*1s|&lt;\s*1s"],
        "scale/fanout axis/fact": [r"scale", r"fan-?out", r"audience", r"many viewers", r"broadcast"],
        "relay/CDN/interoperability facts": [r"relay", r"CDN", r"interoperab", r"QUIC"],
        "target not generic center decoration": [r"target", r"goal", r"low latency", r"large audience", r"data-target"],
        "critical text annotations": [r"data-critical=\"(?:title|body|date|cta)"],
        "separated dramatic/texture channel": [r"data-channel=", r"aria-hidden=\"true\"", r"pointer-events-none"],
    })
    failures.extend(prompt_leak_failures(text))
    return failures


def check_historical_rhythm(text: str) -> list[str]:
    failures = group_failures(text, {
        "historical move marker": [r"data-reference=\"(?:muller|mueller|müller|brockmann|troxler|rhythm)[^\"]*\"", r"historical move:\s*(?:muller|mueller|müller|brockmann|rhythm|musica viva)"],
        "embodied rhythm carriers": [r"arc|pulse|score|rhythm|concentric|radial|rounded-full|repeating-(?:linear|radial)|border-\[", r"data-encoding=.*(?:rhythm|interval|pulse|score)"],
        "public concert facts": [r"Signal Quartet", r"Tonhalle", r"12 Oct", r"20:00", r"Reserve seats"],
        "12-column structure": [r"grid-cols-12"],
        "critical reading annotations": [r"data-critical=\"(?:title|body|date|cta)"],
        "separated graphic channels": [r"data-channel=", r"aria-hidden=\"true\"", r"pointer-events-none"],
        "mobile/overflow safety": [r"overflow-hidden", r"overflow-x-hidden", r"overflow-clip", r"min-h-\[?100", r"min-h-screen", r"min-h-svh"],
    })
    visibleish = visible_text(text)
    if has(r"M[üu]ller|Brockmann|Musica Viva|historical move", visibleish) and not has(r"data-reference=|<!--", text):
        failures.append("historical reference appears as visible name-dropping rather than non-visible/embodied marker")
    failures.extend(prompt_leak_failures(text))
    return failures


def check_historical_figure_ground(text: str) -> list[str]:
    failures = group_failures(text, {
        "historical move marker": [r"data-reference=\"(?:hofmann|figure-ground)[^\"]*\"", r"historical move:\s*(?:hofmann|figure-ground)"],
        "figure/ground carriers": [r"figure-ground|bg-stone-(?:900|950)|text-stone-50|clip-path|polygon|mix-blend-difference|data-channel=\"dramatic\""],
        "theatre facts": [r"Black Square", r"White Room", r"Fri\s*21:00", r"Book seats"],
        "12-column structure": [r"grid-cols-12"],
        "critical reading annotations": [r"data-critical=\"(?:title|body|date|cta)"],
        "contrast-channel discipline": [r"data-channel=", r"z-(?:30|40|50)", r"quiet field|reading zone|protected"],
        "mobile/overflow safety": [r"overflow-hidden", r"overflow-x-hidden", r"overflow-clip", r"min-h-\[?100", r"min-h-screen", r"min-h-svh"],
    })
    failures.extend(prompt_leak_failures(text))
    return failures


def check_audit_after_image_defects(text: str) -> list[str]:
    failures = group_failures(text, {
        "rejects template collapse": [r"template collapse|same portrait|repeated recipe|layout fingerprint|one-size|generic template|card slop|card layout|centered.*card|equal tiles"],
        "requires source ledger fidelity": [r"source ledger|required entities|names,? dates|beats|fidelity|do not invent"],
        "requires semantic image roles": [r"image role|photomontage|Matter|place|evidence|sequence|not wallpaper"],
        "requires encoded diagrams": [r"data-encoding|diagram.*encode|source variable|fake diagram|decorative nodes|axes"],
        "requires functional microtype": [r"microtype.*(?:function|real|source|caption|credit|schedule)|Ruder|not fake"],
        "requires embodied historical move": [r"embodied|name-dropping|designer-name|historical move|Hofmann|M[üu]ller|Matter|Ruder|Weingart|Troxler"],
        "requires clipping/safe content checks": [r"clip|off-canvas|inside canvas|unobscured|safe margin|must remain inside|not obscure|protected reading"],
        "requires prompt-leak prevention": [r"prompt-shaped|dimension|hex|source material|brief|generated|provenance"],
        "keeps implementation constraints": [r"grid-cols-12", r"data-critical", r"overflow-hidden|320px|no horizontal scroll"],
    })
    return failures


CHECKS = {
    "pos-source-ledger-thread-recap": check_thread_source_ledger,
    "pos-encoded-diagram-moq": check_encoded_diagram_moq,
    "pos-historical-rhythm-public-concert": check_historical_rhythm,
    "pos-historical-figure-ground-theatre": check_historical_figure_ground,
    "round10-audit-after-image-defects": check_audit_after_image_defects,
}


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: artifact_integrity_oracle.py OUTPUT_DIR CASE_ID", file=sys.stderr)
        return 2
    output_dir = Path(sys.argv[1])
    case_id = sys.argv[2]
    check = CHECKS.get(case_id)
    if not check:
        print(f"unknown artifact-integrity case id: {case_id}", file=sys.stderr)
        return 2
    failures = check(read_output(output_dir))
    if failures:
        print(f"FAIL artifact integrity oracle: {case_id}")
        for failure in failures:
            print("- " + failure)
        return 1
    print(f"OK artifact integrity oracle: {case_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
