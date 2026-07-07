#!/usr/bin/env python3
"""Motif diversity and semantic-archetype oracle for Swiss poster evals.

Per-output mode (used by shared-benchmark script assertions):
  motif_diversity_oracle.py OUTPUT_DIR CASE_ID
  motif_diversity_oracle.py OUTPUT_DIR GENERIC_CASE_ID PRIVATE_ANSWER_JSON

Suite mode (manual/reporting):
  motif_diversity_oracle.py --suite RUNS_DIR --variant with_skill [--out report.json]

The goal is to catch template collapse: every output looking like the same
right-dark-field + red bar + cropped word + ring/line-field composition.
"""
from __future__ import annotations
import argparse
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


def count(pattern: str, text: str) -> int:
    return len(re.findall(pattern, text, re.I | re.M | re.S))


def visible_large_number(text: str) -> bool:
    return has(
        r'class=["\'][^"\']*(?:text-\[clamp\(|text-\[(?:[7-9]|1\d|2\d|3\d)rem\]|text-(?:7xl|8xl|9xl))[^"\']*["\'][^>]*>\s*(?:0?[1-9]|[12]\d|19\d\d|20\d\d|q[1-4])\s*(?:<|$)',
        text,
    )


def right_dark_split(text: str) -> bool:
    return has(r'(?:absolute[^\n<>]*(?:inset-y-0|right-0)[^\n<>]*bg-stone-9)|(?:right-0[^\n<>]*w-\[(?:3[5-9]|4\d|1/2)[^\n<>]*bg-stone-9)', text)


def default_rhythm_rings(text: str) -> bool:
    return has(r'concentric|pulse ring|rhythm ring|rounded-full[^\n<>]{0,120}border-\[(?:1[0-9]|[2-9][0-9])px\][^\n<>]{0,120}#C8102E|#C8102E[^\n<>]{0,120}rounded-full', text)


def line_field(text: str) -> bool:
    return has(r'repeating-linear-gradient|line field|moire|halftone', text)


def common_structure_failures(text: str, *, allow_line_field: bool = False, allow_giant_number: bool = False, allow_circle: bool = False) -> list[str]:
    failures: list[str] = []
    if right_dark_split(text):
        failures.append("uses the default right-side dark split")
    if not allow_circle and default_rhythm_rings(text):
        failures.append("uses default concentric/red ring motif")
    if not allow_line_field and line_field(text):
        failures.append("uses default line/halftone field motif")
    if not allow_giant_number and visible_large_number(text):
        failures.append("uses giant visible numeral/date where this archetype did not ask for one")
    return failures


def core_checks(text: str) -> list[str]:
    groups = {
        "12-column foundation": [r"grid-cols-12"],
        "one Swiss red accent/token": [r"#C8102E", r"Swiss red", r"one red accent"],
        "microtype/data labels": [r"text-\[11px\]", r"tracking-widest[^\n]*(?:uppercase|text-xs)", r"uppercase[^\n]*tracking-widest"],
        "overflow/mobile safety": [r"overflow-hidden", r"overflow-x-hidden", r"overflow-clip", r"no horizontal scroll", r"No X-scroll"],
        "readable primary path": [r"readable", r"legible", r"at a glance", r"primary reading path", r"clear title", r"unobstructed", r"z-(?:20|30|40)"],
    }
    failures: list[str] = []
    for label, patterns in groups.items():
        if not any(has(p, text) for p in patterns):
            failures.append(f"missing {label}")
    return failures


CASE_SPECS = {
    "pos-object-poster-archetype": {
        "required": {
            "object-poster semantics": [r"object poster", r"isolated object", r"single object", r"silhouette", r"cutout", r"packshot", r"product photograph", r"product image", r"artifact"],
            "object/image implementation": [r"<img", r"object-cover", r"grayscale", r"clip-path", r"mask", r"silhouette", r"product-photo"],
        },
        "allow_circle": False,
    },
    "pos-route-map-archetype": {
        "required": {
            "route/map semantics": [r"route", r"station", r"transfer", r"node", r"map", r"coordinates", r"line segment", r"path"],
            "network implementation": [r"absolute[^\n]*(?:h-px|w-px|border|rotate)", r"rounded-full[^\n]*(?:station|node)", r"aria-label=.*(?:station|route)", r"data-station", r"path"],
        },
        "allow_line_field": False,
    },
    "pos-data-diagram-archetype": {
        "required": {
            "data/diagram semantics": [r"diagram", r"axis", r"matrix", r"table", r"bar", r"scale", r"tick", r"metric", r"data"],
            "data implementation": [r"grid-cols-\[", r"role=\"table\"", r"<table", r"aria-label=.*(?:chart|diagram|data)", r"h-\[.*%\]", r"tabular-nums", r"data-"],
        },
        "allow_line_field": False,
        "allow_giant_number": True,
    },
    "pos-typographic-specimen-archetype": {
        "required": {
            "specimen semantics": [r"specimen", r"glyph", r"baseline", r"x-height", r"letterform", r"type scale", r"font", r"tracking"],
            "type implementation": [r"font-", r"tracking-", r"leading-", r"text-\[clamp\(", r"baseline", r"uppercase"],
        },
        "allow_line_field": False,
    },
    "pos-photomontage-archetype": {
        "required": {
            "photomontage semantics": [r"photomontage", r"montage", r"collage", r"photo fragment", r"image fragment", r"overprint", r"cutout"],
            "multiple image fragments": [r"<img[\s\S]*<img", r"photo-?fragment", r"image-?fragment", r"clip-path", r"object-cover[\s\S]*object-cover"],
        },
        "allow_line_field": False,
    },
    "pos-civic-safety-archetype": {
        "required": {
            "civic/safety semantics": [r"safety", r"civic", r"warning", r"hazard", r"child", r"pedestrian", r"cyclist", r"vulnerable", r"protect"],
            "scale juxtaposition": [r"scale juxtaposition", r"small figure", r"vulnerable figure", r"oversized hazard", r"giant wheel", r"hazard.*small", r"small.*hazard"],
            "clear warning text": [r"warning", r"protect", r"slow", r"watch", r"yield", r"safety"],
        },
        "allow_circle": True,
    },
}


def check_case(text: str, case_id: str) -> list[str]:
    spec = CASE_SPECS.get(case_id)
    if not spec:
        return [f"unknown motif-diversity case id: {case_id}"]
    failures = core_checks(text)
    for label, patterns in spec["required"].items():
        if not any(has(p, text) for p in patterns):
            failures.append(f"missing {label}")
    failures.extend(common_structure_failures(
        text,
        allow_line_field=bool(spec.get("allow_line_field")),
        allow_giant_number=bool(spec.get("allow_giant_number")),
        allow_circle=bool(spec.get("allow_circle")),
    ))
    if has(r"dark right field \+ red bar|same recipe|default recipe", text) and not has(r"avoid|not|forbid|reject", text):
        failures.append("endorses the known default recipe")
    return failures


MOTIF_PATTERNS = {
    "right_dark_split": right_dark_split,
    "rings": default_rhythm_rings,
    "line_field": line_field,
    "giant_date_number": visible_large_number,
    "object_poster": lambda t: has(r"object poster|isolated object|single object|silhouette|cutout|packshot|artifact", t),
    "route_map": lambda t: has(r"route|station|transfer|\bnode\b|\bmap\b|coordinates|line segment", t),
    "data_diagram": lambda t: has(r"diagram|axis|matrix|<table|role=\"table\"|bar chart|metric|tick mark|tabular-nums|\bkpi\b", t),
    "typographic_specimen": lambda t: has(r"specimen|glyph|baseline|x-height|letterform|type scale", t),
    "photomontage": lambda t: has(r"photomontage|montage|collage|photo fragment|image fragment", t) or count(r"<img", t) >= 2,
    "civic_safety": lambda t: has(r"safety|civic|warning|hazard|child|pedestrian|cyclist|vulnerable|protect", t),
}


def suite_report(runs_dir: Path, variant: str) -> tuple[dict, int]:
    rows = []
    for out in sorted(runs_dir.glob(f"*/{variant}/output.md")):
        case_id = out.parents[1].name
        if not case_id.startswith("pos-"):
            continue
        text = out.read_text(encoding="utf-8", errors="replace")
        motifs = [name for name, fn in MOTIF_PATTERNS.items() if fn(text)]
        rows.append({"case_id": case_id, "motifs": motifs})
    counts: dict[str, int] = {}
    for row in rows:
        for m in row["motifs"]:
            counts[m] = counts.get(m, 0) + 1
    n = len(rows)
    max_share = max((v / n for v in counts.values()), default=0)
    semantic_families = ["object_poster", "route_map", "data_diagram", "typographic_specimen", "photomontage", "civic_safety"]
    semantic_coverage = sum(1 for m in semantic_families if counts.get(m, 0) > 0)
    warnings = []
    if n >= 8 and semantic_coverage < 4:
        warnings.append(f"semantic motif coverage too low: {semantic_coverage}/6")
    if n >= 8 and max_share > 0.70:
        warnings.append(f"one motif dominates suite: max_share={max_share:.2f}")
    report = {
        "runs_dir": str(runs_dir),
        "variant": variant,
        "positive_outputs": n,
        "motif_counts": counts,
        "semantic_coverage": semantic_coverage,
        "max_share": max_share,
        "rows": rows,
        "warnings": warnings,
        "passed": not warnings,
    }
    return report, (0 if not warnings else 1)


def resolve_case_id(public_case_id: str, answer_ref: str | None) -> str:
    if not answer_ref:
        return public_case_id
    p = Path(answer_ref)
    if not p.exists():
        raise FileNotFoundError(f"missing private motif answer spec: {p}")
    data = json.loads(p.read_text(encoding="utf-8"))
    mapped = data.get("oracle_case_id") or data.get("case_id")
    if not mapped:
        expected = data.get("expected_archetype")
        mapping = {
            "object_poster": "pos-object-poster-archetype",
            "route_map": "pos-route-map-archetype",
            "data_diagram": "pos-data-diagram-archetype",
            "typographic_specimen": "pos-typographic-specimen-archetype",
            "photomontage": "pos-photomontage-archetype",
            "civic_safety": "pos-civic-safety-archetype",
        }
        mapped = mapping.get(str(expected))
    if not mapped:
        raise ValueError(f"private motif answer spec must provide oracle_case_id/case_id/expected_archetype: {p}")
    return str(mapped)


def main() -> int:
    if len(sys.argv) in {3, 4} and not sys.argv[1].startswith("--"):
        output_dir = Path(sys.argv[1])
        public_case_id = sys.argv[2]
        answer_ref = sys.argv[3] if len(sys.argv) == 4 else None
        try:
            oracle_case_id = resolve_case_id(public_case_id, answer_ref)
            failures = check_case(read_output(output_dir), oracle_case_id)
        except Exception as exc:
            print(f"FAIL motif diversity oracle: {public_case_id}")
            print(f"- {exc}")
            return 2
        print(json.dumps({"score": 0 if failures else 1, "max_score": 1, "case_id": public_case_id}))
        if failures:
            print(f"FAIL motif diversity oracle: {public_case_id}")
            for f in failures:
                print("- " + f)
            return 1
        print(f"OK motif diversity oracle: {public_case_id}")
        return 0

    ap = argparse.ArgumentParser()
    ap.add_argument("--suite", type=Path, required=True)
    ap.add_argument("--variant", default="with_skill")
    ap.add_argument("--out", type=Path)
    args = ap.parse_args()
    report, code = suite_report(args.suite, args.variant)
    text = json.dumps(report, indent=2)
    if args.out:
        args.out.write_text(text + "\n", encoding="utf-8")
    print(text)
    return code


if __name__ == "__main__":
    raise SystemExit(main())
