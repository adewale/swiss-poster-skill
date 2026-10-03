#!/usr/bin/env python3
"""Outcome checks of rendered_poster_oracle.py against a real headless Chrome.

One known-good poster, and variants that each plant exactly one rendered defect in it.
The good poster must pass with all three critical elements inspected; each defective
variant must fail for its stated reason, on the role that carries the defect, and on no
other role. Expected verdicts come from the poster as drawn (e.g. #fff on #fff is
invisible), not from running the oracle.

Run: python3 evals/tests/test_rendered_poster_oracle.py
Needs Pillow and Chrome/Chromium (google-chrome or chromium on PATH). A missing browser
is an error here, not a skip.
"""
from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path

ORACLE = Path(__file__).resolve().parents[1] / "oracles" / "rendered_poster_oracle.py"
spec = importlib.util.spec_from_file_location("rendered_poster_oracle", ORACLE)
oracle = importlib.util.module_from_spec(spec)
spec.loader.exec_module(oracle)

BASE_CSS = {
    "page": "background:#fff",
    "title": "left:40px;top:80px;font-size:96px;color:#111",
    "body": "left:40px;top:420px;width:600px;font-size:24px;color:#111",
    "date": "left:40px;top:620px;font-size:32px;color:#111",
}


def poster(roles: tuple[str, ...] = ("title", "body", "date"), extra_css: str = "", **css: str) -> str:
    rules = {**BASE_CSS, **css}
    text = {"title": "JAZZ NIGHT", "body": "Doors open at seven. Bring a friend and stay late.", "date": "12 MARCH 2026"}
    tag = {"title": "h1", "body": "p", "date": "p"}
    elements = "\n".join(
        f'<{tag[r]} class="{r}" data-critical="{r}">{text[r]}</{tag[r]}>' for r in ("title", "body", "date") if r in roles
    )
    return f"""<!doctype html><html><head><style>
html,body{{margin:0;width:840px;height:1200px;overflow:hidden;font-family:sans-serif;{rules['page']}}}
h1,p{{position:absolute;margin:0;font-weight:700}}
.title{{{rules['title']}}} .body{{{rules['body']}}} .date{{{rules['date']}}}
{extra_css}
</style></head><body>
{elements}
</body></html>"""


def verdict(html_text: str) -> tuple[dict, list[str]]:
    audit = oracle.audit_render(html_text, 840, 1200)
    return audit, oracle.failures_for(audit)


class RenderedPosterOracleOutcomes(unittest.TestCase):
    def assert_fails_only_on(self, html_text: str, role: str, reason: str) -> None:
        _, failures = verdict(html_text)
        self.assertTrue(any(f.startswith(f"{role}:") and reason in f for f in failures), failures)
        self.assertEqual([f for f in failures if not f.startswith(f"{role}:")], [], "a defect on one role failed another")

    def test_good_poster_passes_with_every_critical_element_inspected(self):
        audit, failures = verdict(poster())
        self.assertEqual(failures, [])
        self.assertEqual(sorted(c["role"] for c in audit["critical"]), ["body", "date", "title"])
        self.assertEqual(len(audit["pixel"]["critical"]), 3)

    def test_light_text_on_a_dark_quiet_field_passes(self):
        # Near miss for the invisible-text check: white text is fine on a dark backing.
        _, failures = verdict(poster(title=BASE_CSS["title"] + ";color:#fff;background:#111"))
        self.assertEqual(failures, [])

    def test_text_the_same_colour_as_its_background_fails(self):
        self.assert_fails_only_on(poster(title=BASE_CSS["title"] + ";color:#fff"), "title", "too few visible text pixels")

    def test_visible_text_in_a_child_that_sets_its_own_visibility_passes(self):
        # The hidden render must hide descendants too; otherwise this child shows in both
        # renders, the diff is empty, and legible text reads as zero ink.
        html_text = poster(extra_css=".title span{visibility:visible}").replace(">JAZZ NIGHT<", "><span>JAZZ NIGHT</span><")
        _, failures = verdict(html_text)
        self.assertEqual(failures, [])

    def test_low_contrast_text_fails(self):
        self.assert_fails_only_on(poster(title=BASE_CSS["title"] + ";color:#e6e6e6"), "title", "low median pixel contrast")

    def test_small_body_text_fails(self):
        self.assert_fails_only_on(poster(body=BASE_CSS["body"] + ";font-size:10px"), "body", "font too small")

    def test_faded_date_fails(self):
        self.assert_fails_only_on(poster(date=BASE_CSS["date"] + ";opacity:0.4"), "date", "opacity too low")

    def test_title_pushed_past_the_right_edge_fails(self):
        # position:fixed keeps it out of the scroll width, so only the bbox check applies.
        title = BASE_CSS["title"] + ";position:fixed;left:500px;white-space:nowrap"
        self.assert_fails_only_on(poster(title=title), "title", "critical bbox outside viewport")

    def test_transparent_text_over_a_busy_background_fails(self):
        stripes = "repeating-linear-gradient(90deg,#000 0 6px,#fff 6px 12px)"
        busy = f"position:absolute;left:0;top:400px;width:840px;height:80px;background:{stripes}"
        html_text = poster(extra_css=f"body::before{{content:'';{busy}}}", body=BASE_CSS["body"] + ";color:#c8102e")
        self.assert_fails_only_on(html_text, "body", "crosses a high-variance background")

    def test_poster_without_a_supporting_role_fails(self):
        _, failures = verdict(poster(roles=("title", "body")).replace('data-critical="body"', 'data-critical="caption"'))
        self.assertIn("missing body/date/cta critical role", failures)


if __name__ == "__main__":
    unittest.main(verbosity=2)
