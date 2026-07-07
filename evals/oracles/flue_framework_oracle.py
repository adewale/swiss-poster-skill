#!/usr/bin/env python3
"""Flue Framework poster oracle.

Targets two regressions from a real generated poster:
1. source-bearing support text around "via CLI" was visually unreadable but not
   marked data-critical, so the generic rendered oracle ignored it;
2. website CTAs such as "View Documentation" leaked into a print-poster CTA.
"""
from __future__ import annotations

import html
import importlib.util
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ORACLE_DIR = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("rendered_poster_oracle", ORACLE_DIR / "rendered_poster_oracle.py")
rendered = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rendered)  # type: ignore[union-attr]


def read_output(output_dir: Path) -> str:
    p = output_dir / "output.md"
    if not p.exists():
        raise FileNotFoundError(f"missing output: {p}")
    return p.read_text(encoding="utf-8", errors="replace")


def visible_text(html_text: str) -> str:
    text = re.sub(r"<!--.*?-->", " ", html_text, flags=re.S)
    text = re.sub(r"<style.*?</style>|<script.*?</script>", " ", text, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", html.unescape(text)).strip()


def has(pattern: str, text: str) -> bool:
    return re.search(pattern, text, re.I | re.M | re.S) is not None


def group_failures(text: str, groups: dict[str, list[str]]) -> list[str]:
    failures: list[str] = []
    for label, patterns in groups.items():
        if not any(has(p, text) for p in patterns):
            failures.append(f"missing {label}")
    return failures


TEXT_TARGET_AUDIT = r"""
<script>
(() => {
  const targetRe = /via\s+CLI/i;
  function txt(el) { return (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim(); }
  function visible(el) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity || '1') > 0.05 && r.width > 2 && r.height > 2;
  }
  function isLeafTarget(el) {
    if (!targetRe.test(txt(el)) || !visible(el)) return false;
    return ![...el.children].some((ch) => targetRe.test(txt(ch)) && visible(ch));
  }
  function maxFontSize(el) {
    const nodes = [el, ...el.querySelectorAll('*')];
    return Math.max(...nodes.map((n) => parseFloat(getComputedStyle(n).fontSize || '0')).filter((n) => Number.isFinite(n)), 0);
  }
  function runAudit() {
    const targets = [...document.querySelectorAll('body *')].filter(isLeafTarget).map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        role: 'via-cli',
        text: txt(el).slice(0, 220),
        left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height,
        fontSize: maxFontSize(el), opacity: parseFloat(cs.opacity || '1'),
        color: cs.color, backgroundColor: cs.backgroundColor,
        centerCovered: false, topTag: null, topText: null
      };
    });
    const node = document.createElement('script');
    node.type = 'application/json';
    node.id = 'flue-text-target-audit-json';
    node.textContent = JSON.stringify({critical: targets});
    document.body.appendChild(node);
  }
  if (document.readyState === 'complete') runAudit();
  else window.addEventListener('load', runAudit);
})();
</script>
"""

HIDE_TEXT_TARGETS = r"""
<script>
(() => {
  const targetRe = /via\s+CLI/i;
  function txt(el) { return (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim(); }
  function visible(el) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity || '1') > 0.05 && r.width > 2 && r.height > 2;
  }
  function isLeafTarget(el) {
    if (!targetRe.test(txt(el)) || !visible(el)) return false;
    return ![...el.children].some((ch) => targetRe.test(txt(ch)) && visible(ch));
  }
  function hideTargets() {
    [...document.querySelectorAll('body *')].filter(isLeafTarget).forEach((el) => { el.style.visibility = 'hidden'; });
  }
  if (document.readyState === 'complete') hideTargets();
  else window.addEventListener('load', hideTargets);
})();
</script>
"""


def inject_script(html_text: str, script: str) -> str:
    if "</body>" in html_text.lower():
        return re.sub(r"</body>", lambda _m: script + "</body>", html_text, flags=re.I)
    return html_text + script


def via_cli_pixel_failures(html_text: str, width: int = 840, height: int = 1200) -> list[str]:
    failures: list[str] = []
    with tempfile.TemporaryDirectory(prefix="flue-via-cli-oracle-") as td:
        td_path = Path(td)
        normal_html = td_path / "normal.html"
        hidden_html = td_path / "hidden.html"
        normal_png = td_path / "normal.png"
        hidden_png = td_path / "hidden.png"
        normal_html.write_text(inject_script(html_text, TEXT_TARGET_AUDIT), encoding="utf-8")
        hidden_html.write_text(inject_script(html_text, HIDE_TEXT_TARGETS), encoding="utf-8")
        chrome = rendered.chrome_path()
        cmd = [
            chrome,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--virtual-time-budget=1500",
            f"--window-size={width},{height}",
            "--dump-dom",
            f"file://{normal_html}",
        ]
        proc = subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=30)
        if proc.returncode != 0:
            raise RuntimeError(proc.stderr[-1000:])
        m = re.search(r'<script[^>]+id=["\']flue-text-target-audit-json["\'][^>]*>(.*?)</script>', proc.stdout, re.S | re.I)
        if not m:
            raise RuntimeError("Flue text-target audit JSON not found")
        audit = json.loads(html.unescape(m.group(1)))
        if not audit.get("critical"):
            return failures
        rendered.render_png(chrome, normal_html, normal_png, width, height)
        rendered.render_png(chrome, hidden_html, hidden_png, width, height)
        pixel = rendered.pixel_audit(audit, normal_png, hidden_png)
        for target, pix in zip(audit.get("critical", []), pixel.get("critical", []), strict=False):
            text = target.get("text") or ""
            if not has(r"\b\S+\s+via\s+CLI\b", text):
                failures.append("via CLI phrase lacks a readable preceding word in the same text run")
            if pix.get("inkRatio", 0) <= 0:
                failures.append("via CLI text target produced no visible text differential")
                continue
            if pix.get("medianContrast", 0) < 3.0:
                failures.append(f"via CLI support text has low median pixel contrast ({pix.get('medianContrast'):.2f})")
            if pix.get("lowContrastShare", 0) > 0.35:
                failures.append(f"via CLI support text has too much low-contrast rendered text ({pix.get('lowContrastShare'):.0%})")
            if pix.get("backgroundAlpha", 0) < 0.5 and pix.get("backgroundLuminanceRange", 0) > 0.42:
                failures.append("via CLI support text crosses a high-variance/split background without a quiet field")
    return failures


def check_flue_positive(output_dir: Path) -> list[str]:
    raw = read_output(output_dir)
    html_text = rendered.extract_html(raw)
    vis = visible_text(html_text)
    failures = group_failures(raw + "\n" + vis, {
        "Flue title": [r"\bFlue\b"],
        "agent harness positioning": [r"Agent Harness Framework", r"agent harness", r"\bharness\b"],
        "TypeScript/source technical fact": [r"TypeScript", r"@flue/runtime", r"@flue/cli"],
        "architecture or primitive facts": [r"Model[^\n]{0,80}Harness[^\n]{0,80}Sandbox[^\n]{0,80}Filesystem", r"sessions|tools|skills|sandbox|filesystem"],
        "source/audit carriers": [r"data-source=", r"data-encoding=", r"data-reference=", r"source ledger"],
        "critical text annotations": [r"data-critical=[\"']title", r"data-critical=[\"'](?:body|date|cta)"],
    })
    if has(r"\b(?:View|Read|Open|Browse)\s+(?:the\s+)?(?:Documentation|Docs)\b", vis):
        failures.append("website documentation CTA leaked into visible poster copy")
    if has(r"\bGet\s+Started\b", vis):
        failures.append("generic website CTA 'Get Started' leaked into visible poster copy")
    # Reuse generic critical-text rendered checks, then add a source-support text check.
    try:
        audit = rendered.audit_render(html_text, 840, 1200)
        failures.extend(rendered.failures_for(audit))
        failures.extend(via_cli_pixel_failures(html_text, 840, 1200))
    except Exception as exc:  # fail closed; rendering is the point of this eval.
        failures.append(f"rendering/readability audit failed: {exc}")
    return failures


def check_flue_audit(output_dir: Path) -> list[str]:
    text = read_output(output_dir)
    failures = group_failures(text, {
        "names the via CLI/local word readability defect": [r"locally[^\n]{0,80}via CLI", r"word before[^\n]{0,80}via CLI", r"via CLI[^\n]{0,120}(?:unreadable|illegible|low contrast|hard to read)"],
        "calls it a readability/contrast failure": [r"unreadable|illegible|hard to read|low contrast|readability|legibility"],
        "flags View Documentation as inappropriate web CTA leakage": [r"View Documentation[^\n]{0,120}(?:CTA|web|website|nav|leak|inappropriate|button)", r"(?:CTA|web|website|nav|leak|inappropriate|button)[^\n]{0,120}View Documentation"],
        "compares against PR 13 reference": [r"PR\s*#?13|pull/13|reference poster|diff-84c88a|posters/flue\.html"],
        "contrasts poster-source fact treatment with web CTA copying": [r"source facts|poster copy|public artifact|not (?:a )?web(?:site)? CTA|not a button|navigation"],
        "recommends concrete repair": [r"quiet field|solid backing|data-critical|contrast channel|mark .*source|remove .*View Documentation|replace .*CTA|poster instruction"],
    })
    return failures


CHECKS = {
    "pos-flue-framework-poster": check_flue_positive,
    "round13-audit-flue-readability-cta": check_flue_audit,
}


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: flue_framework_oracle.py OUTPUT_DIR CASE_ID", file=sys.stderr)
        return 2
    output_dir = Path(sys.argv[1])
    case_id = sys.argv[2]
    check = CHECKS.get(case_id)
    if check is None:
        print(f"unknown Flue oracle case id: {case_id}", file=sys.stderr)
        return 2
    failures = check(output_dir)
    print(json.dumps({"score": 0 if failures else 1, "max_score": 1, "case_id": case_id}))
    if failures:
        print(f"FAIL Flue Framework oracle: {case_id}")
        for failure in failures:
            print("- " + failure)
        return 1
    print(f"OK Flue Framework oracle: {case_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
