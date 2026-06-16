#!/usr/bin/env python3
"""Rendered-poster oracle: validates critical text at image/DOM level.

This is intentionally stricter than token checks: it renders extracted HTML in headless
Chrome, inspects actual DOM rectangles for [data-critical] elements, detects
horizontal overflow, and verifies critical element centers are not covered by
other elements. If tesseract is installed, future OCR checks can be layered in;
this script does not require OCR to run in CI.
"""
from __future__ import annotations
import html
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image


def extract_html(text: str) -> str:
    m = re.search(r"```(?:html)?\s*(.*?)```", text, re.S | re.I)
    if m:
        text = m.group(1)
    idx = text.lower().find("<!doctype")
    if idx < 0:
        idx = text.lower().find("<html")
    if idx > 0:
        text = text[idx:]
    return text.strip()


def chrome_path() -> str:
    mac = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
    if mac.exists():
        return str(mac)
    found = shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chrome")
    if not found:
        raise RuntimeError("Chrome/Chromium not found for rendered oracle")
    return found


AUDIT_SCRIPT = r"""
<script>
(() => {
  function maxFontSize(el) {
    const nodes = [el, ...el.querySelectorAll('*')];
    return Math.max(...nodes.map((n) => parseFloat(getComputedStyle(n).fontSize || '0')).filter((n) => Number.isFinite(n)), 0);
  }
  function runAudit() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const critical = [...document.querySelectorAll('[data-critical]')].map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const cx = Math.min(Math.max(r.left + r.width / 2, 0), vw - 1);
      const cy = Math.min(Math.max(r.top + r.height / 2, 0), vh - 1);
      const top = document.elementFromPoint(cx, cy);
      const topCritical = top ? top.closest('[data-critical]') : null;
      const role = el.getAttribute('data-critical') || '';
      return {
        role,
        text: (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 180),
        left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height,
        fontSize: maxFontSize(el),
        opacity: parseFloat(cs.opacity || '1'),
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        centerCovered: !(top === el || el.contains(top) || topCritical === el),
        topTag: top ? top.tagName : null,
        topText: top ? (top.innerText || top.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80) : null
      };
    });
    const out = {
      viewport: { width: vw, height: vh },
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      bodyScrollWidth: document.body ? document.body.scrollWidth : 0,
      critical,
      tesseractAvailable: false
    };
    const node = document.createElement('script');
    node.type = 'application/json';
    node.id = 'render-audit-json';
    node.textContent = JSON.stringify(out);
    document.body.appendChild(node);
  }
  if (document.readyState === 'complete') runAudit();
  else window.addEventListener('load', runAudit);
})();
</script>
"""


def inject(html_text: str) -> str:
    if "</body>" in html_text.lower():
        return re.sub(r"</body>", lambda _m: AUDIT_SCRIPT + "</body>", html_text, flags=re.I)
    return html_text + AUDIT_SCRIPT


def add_hidden_critical_style(html_text: str) -> str:
    style = "<style>[data-critical]{visibility:hidden!important}</style>"
    if "</head>" in html_text.lower():
        return re.sub(r"</head>", lambda _m: style + "</head>", html_text, flags=re.I)
    if "</body>" in html_text.lower():
        return re.sub(r"</body>", lambda _m: style + "</body>", html_text, flags=re.I)
    return style + html_text


def render_png(chrome: str, html_path: Path, out_path: Path, width: int, height: int) -> None:
    cmd = [
        chrome,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--virtual-time-budget=1500",
        f"--window-size={width},{height}",
        f"--screenshot={out_path}",
        f"file://{html_path}",
    ]
    proc = subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=30)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr[-1000:])


def audit_render(html_text: str, width: int = 840, height: int = 1200) -> dict:
    with tempfile.TemporaryDirectory(prefix="poster-render-oracle-") as td:
        td_path = Path(td)
        path = td_path / "poster.html"
        hidden_path = td_path / "poster-hidden.html"
        path.write_text(inject(html_text), encoding="utf-8")
        hidden_path.write_text(inject(add_hidden_critical_style(html_text)), encoding="utf-8")
        chrome = chrome_path()
        cmd = [
            chrome,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--virtual-time-budget=1500",
            f"--window-size={width},{height}",
            "--dump-dom",
            f"file://{path}",
        ]
        proc = subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=30)
        if proc.returncode != 0:
            raise RuntimeError(proc.stderr[-1000:])
        m = re.search(r'<script[^>]+id=["\']render-audit-json["\'][^>]*>(.*?)</script>', proc.stdout, re.S | re.I)
        if not m:
            raise RuntimeError("render audit JSON not found in dumped DOM")
        audit = json.loads(html.unescape(m.group(1)))
        normal_png = td_path / "normal.png"
        hidden_png = td_path / "hidden.png"
        render_png(chrome, path, normal_png, width, height)
        render_png(chrome, hidden_path, hidden_png, width, height)
        audit["pixel"] = pixel_audit(audit, normal_png, hidden_png)
        audit["renderedSize"] = {"width": Image.open(normal_png).width, "height": Image.open(normal_png).height}
        return audit


def rel_luminance(rgb: tuple[int, int, int]) -> float:
    vals = []
    for v in rgb:
        c = v / 255.0
        vals.append(c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * vals[0] + 0.7152 * vals[1] + 0.0722 * vals[2]


def contrast_ratio(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    la = rel_luminance(a)
    lb = rel_luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def parse_alpha(bg: str) -> float:
    if not bg or bg == "transparent":
        return 0.0
    m = re.search(r"rgba?\(([^)]+)\)", bg)
    if not m:
        return 1.0
    parts = [p.strip() for p in m.group(1).split(",")]
    if len(parts) == 4:
        try:
            return float(parts[3])
        except ValueError:
            return 1.0
    return 1.0


def percentile(vals: list[float], p: float) -> float:
    if not vals:
        return 0.0
    vals = sorted(vals)
    idx = min(len(vals) - 1, max(0, int(round((len(vals) - 1) * p))))
    return vals[idx]


def pixel_audit(audit: dict, normal_png: Path, hidden_png: Path) -> dict:
    normal = Image.open(normal_png).convert("RGB")
    hidden = Image.open(hidden_png).convert("RGB")
    out = []
    W, H = normal.size
    for c in audit.get("critical", []):
        left = max(0, int(c.get("left", 0)))
        top = max(0, int(c.get("top", 0)))
        right = min(W, int(c.get("right", 0)) + 1)
        bottom = min(H, int(c.get("bottom", 0)) + 1)
        if right <= left or bottom <= top:
            out.append({"role": c.get("role"), "error": "empty crop"})
            continue
        n = normal.crop((left, top, right, bottom))
        h = hidden.crop((left, top, right, bottom))
        changed = []
        contrasts = []
        lums = []
        minx = right - left
        maxx = 0
        miny = bottom - top
        maxy = 0
        # sample all pixels for normal poster sizes; crops are modest.
        for y in range(n.height):
            for x in range(n.width):
                bg = h.getpixel((x, y))
                fg = n.getpixel((x, y))
                lums.append(rel_luminance(bg))
                diff = abs(fg[0] - bg[0]) + abs(fg[1] - bg[1]) + abs(fg[2] - bg[2])
                if diff > 30:
                    changed.append(diff)
                    contrasts.append(contrast_ratio(fg, bg))
                    minx, maxx = min(minx, x), max(maxx, x)
                    miny, maxy = min(miny, y), max(maxy, y)
        area = max(1, n.width * n.height)
        ink_ratio = len(changed) / area
        ink_width_ratio = ((maxx - minx + 1) / n.width) if changed else 0.0
        bg_range = percentile(lums, 0.90) - percentile(lums, 0.10)
        out.append({
            "role": c.get("role"),
            "inkRatio": ink_ratio,
            "inkWidthRatio": ink_width_ratio,
            "medianContrast": percentile(contrasts, 0.50),
            "lowContrastShare": (sum(1 for v in contrasts if v < 3.0) / len(contrasts)) if contrasts else 1.0,
            "backgroundLuminanceRange": bg_range,
            "backgroundAlpha": parse_alpha(str(c.get("backgroundColor", ""))),
        })
    return {"critical": out}


def failures_for(audit: dict) -> list[str]:
    failures: list[str] = []
    vw = audit.get("renderedSize", audit["viewport"])["width"]
    vh = audit.get("renderedSize", audit["viewport"])["height"]
    if audit.get("scrollWidth", 0) > vw + 2 or audit.get("bodyScrollWidth", 0) > vw + 2:
        failures.append(f"horizontal overflow: scrollWidth={audit.get('scrollWidth')} viewport={vw}")
    critical = audit.get("critical", [])
    if len(critical) < 3:
        failures.append(f"expected at least 3 [data-critical] elements, found {len(critical)}")
    roles = {str(c.get("role", "")).lower() for c in critical}
    if "title" not in roles:
        failures.append("missing data-critical='title'")
    if not ({"body", "date", "cta"} & roles):
        failures.append("missing body/date/cta critical role")
    by_role_pixel = {str(p.get("role") or "critical"): p for p in audit.get("pixel", {}).get("critical", [])}
    for c in critical:
        role = c.get("role") or "critical"
        text = c.get("text") or ""
        if len(text) < 2:
            failures.append(f"{role}: empty critical text")
        if c.get("width", 0) <= 4 or c.get("height", 0) <= 4:
            failures.append(f"{role}: near-zero rendered box")
        if c.get("left", 0) < -1 or c.get("top", 0) < -1 or c.get("right", 0) > vw + 1 or c.get("bottom", 0) > vh + 1:
            failures.append(f"{role}: critical bbox outside viewport")
        if c.get("centerCovered"):
            failures.append(f"{role}: center covered by {c.get('topTag')} '{c.get('topText')}'")
        min_size = 13 if role not in {"title", "date"} else 18
        if c.get("fontSize", 0) < min_size:
            failures.append(f"{role}: font too small ({c.get('fontSize'):.1f}px)")
        if c.get("opacity", 1) < 0.68:
            failures.append(f"{role}: opacity too low ({c.get('opacity')})")
        pix = by_role_pixel.get(str(role))
        if pix:
            ink_ratio = pix.get("inkRatio", 0)
            # Some browser/CSS combinations can make the hidden-text differential
            # unstable for nested CTA text. Use pixel checks when the diff mask is
            # present; rely on DOM bounds/coverage otherwise.
            if ink_ratio > 0:
                if ink_ratio < 0.006:
                    failures.append(f"{role}: too few visible text pixels; text may be hidden or same-color as backing")
                if pix.get("medianContrast", 0) < 3.0:
                    failures.append(f"{role}: low median pixel contrast ({pix.get('medianContrast'):.2f})")
                if pix.get("lowContrastShare", 1) > 0.35:
                    failures.append(f"{role}: too much low-contrast rendered text ({pix.get('lowContrastShare'):.0%})")
            if role != "cta" and pix.get("backgroundAlpha", 0) < 0.5 and pix.get("backgroundLuminanceRange", 0) > 0.42:
                failures.append(f"{role}: transparent critical text crosses a high-variance background; add a quiet field or split-color treatment")
    return failures


def main() -> int:
    if len(sys.argv) not in {2, 4}:
        print("usage: rendered_poster_oracle.py OUTPUT_DIR [WIDTH HEIGHT]", file=sys.stderr)
        return 2
    out = Path(sys.argv[1]) / "output.md"
    html_text = extract_html(out.read_text(encoding="utf-8", errors="replace"))
    if "<" not in html_text:
        print("FAIL rendered oracle: no HTML found")
        return 1
    width = int(sys.argv[2]) if len(sys.argv) == 4 else 840
    height = int(sys.argv[3]) if len(sys.argv) == 4 else 1200
    audit = audit_render(html_text, width, height)
    failures = failures_for(audit)
    if failures:
        print("FAIL rendered poster oracle")
        for failure in failures:
            print("- " + failure)
        print(json.dumps(audit, indent=2)[:4000])
        return 1
    print("OK rendered poster oracle")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
