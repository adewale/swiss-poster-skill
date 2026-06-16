#!/usr/bin/env python3
"""Generate a broad old-skill vs current-skill Swiss poster contact sheet.

This is intentionally separate from the committed-baseline characterization sheet.
It uses generated prompts across non-Cloudflare domains to inspect whether the new
skill generalizes beyond tech/event/explainer posters.
"""
from __future__ import annotations

import concurrent.futures as cf
import html
import io
import json
import os
import re
import shutil
import subprocess
import tempfile
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / "docs/pr/diverse-before-after"
ASSETS = OUT / "assets"
OLD_SKILL_TMP = OUT / ".old-skill-runtime"
NEW_SKILL = ROOT / "swiss-poster"

CASES = [
    {
        "id": "01-tourism-lake-ferry",
        "title": "Lake Sound Ferry",
        "domain": "tourism / travel placard",
        "canvas": [840, 1200],
        "assets": ["lake-ferry.jpg"],
        "brief": "Swiss travel poster for Lake Sound Ferry, Lausanne → Vevey, summer route, 18:30 departure, public pier notice, CTA: See departures. Use a lake/alpine travel mood; avoid tech-event diagram language.",
    },
    {
        "id": "02-theatre-figure-ground",
        "title": "The Empty Chair",
        "domain": "theatre / Basel figure-ground",
        "canvas": [840, 1200],
        "assets": [],
        "brief": "Swiss theatre poster for The Empty Chair, Fri 21:00, Schauspielhaus Basel, CTA: Book seats. The subject is absence, stage space, and a single chair; avoid route maps, product panels, and web CTAs. Keep the entire title wholly on one quiet light or dark field with no chair, void, split field, stripe, or graphic shape touching or crossing any title letters.",
    },
    {
        "id": "03-object-stopwatch",
        "title": "Minerva 55",
        "domain": "object poster / product",
        "canvas": [840, 1200],
        "assets": ["stopwatch.png"],
        "brief": "Swiss object poster for Minerva 55 mechanical stopwatch. Required facts: 55 minute register, split-second hand, service date 1962, CTA: Wind once. The object should carry the argument; type should be direct and restrained.",
    },
    {
        "id": "04-civic-clean-water",
        "title": "Clean Water Vote",
        "domain": "civic/public notice",
        "canvas": [840, 1200],
        "assets": [],
        "brief": "Swiss civic notice poster for Clean Water Vote, Sunday 09:00–18:00, voting places: School Hall, Market Square, North Pier, CTA: Vote Sunday. It should read like public infrastructure communication, not a landing page.",
    },
    {
        "id": "05-geigy-enzyme",
        "title": "Enzyme K-17",
        "domain": "scientific / Geigy-style plate",
        "canvas": [840, 1200],
        "assets": [],
        "brief": "Swiss scientific poster plate for Enzyme K-17 inhibition study. Include method note, four measured facts: pH 7.2, 18°C, IC50 4.8µM, sample n=42. Use specimen/matrix logic and analytical labels; avoid meetup/event graphics.",
    },
    {
        "id": "06-political-referendum",
        "title": "Housing Yes / Speculation No",
        "domain": "political/civic poster",
        "canvas": [840, 1200],
        "assets": [],
        "brief": "Swiss political referendum poster: Housing Yes / Speculation No, municipal vote 3 March, protect rent, build cooperatives, CTA: Vote yes. Use public persuasion and symbolic form, not a product landing page.",
    },
    {
        "id": "07-market-lithograph",
        "title": "Basel Market",
        "domain": "market / lithographic placard",
        "canvas": [840, 1200],
        "assets": ["market-produce.jpg"],
        "brief": "Swiss market poster for Basel Market / Saturday, 06:00–13:00, Marktplatz, apples, bread, flowers, cheese, CTA: Bring a basket. It should feel like flat ink/lithographic public placard, not a tech diagram.",
    },
    {
        "id": "08-archive-photomontage",
        "title": "Archive Room 4",
        "domain": "editorial photomontage",
        "canvas": [840, 1200],
        "assets": ["archive-document.jpg", "archive-portrait.jpg"],
        "brief": "Swiss editorial photomontage poster for Archive Room 4, public viewing 17 May, materials: one archival document crop and one portrait crop, CTA: Read the record. Make image fragments argue through crop, scale, and overprint.",
    },
    {
        "id": "09-type-specimen",
        "title": "Neue Haas / Narrow Study",
        "domain": "typographic specimen",
        "canvas": [840, 1200],
        "assets": [],
        "brief": "Swiss typographic specimen poster for Neue Haas / Narrow Study. Include baseline, x-height, cap height, tracking note, specimen letters HnRg, and CTA: Study the spacing. Type itself is the subject; avoid generic SaaS panels.",
    },
    {
        "id": "10-landscape-ski-rail",
        "title": "Snow Line Express",
        "domain": "landscape travel poster",
        "canvas": [1200, 840],
        "assets": ["snow-rail.jpg"],
        "brief": "Landscape Swiss travel poster for Snow Line Express, Chur → Arosa, first train 07:12, winter rail, CTA: Take the first ascent. Preserve landscape format and travel-poster sense of place.",
    },
]

BASE_PROMPT = """Use the loaded swiss-poster skill to create a standalone poster.

Return ONLY a complete self-contained HTML document beginning with <!doctype html>. Do not use Markdown fences. Do not explain.

Canvas:
- Render target is {width}px wide by {height}px tall.
- Use internal CSS only; do not fetch remote fonts, scripts, Tailwind CDN, or remote images.
- Use local assets only if listed; reference them by relative path exactly.

Artwork constraints:
- Do not print or paraphrase: prompt, brief, old skill, new skill, current skill, generated, source material, eval, oracle, or dimensions.
- Preserve the exact public-facing content from the brief: title, date/time/place/facts, and CTA.
- Make a real poster artifact, not a landing page, dashboard, feature card grid, or UI module.
- Critical title/date/body/CTA text must be readable in the rendered image and not clipped, covered, or lost across a light/dark split. Do not let black text cross into a black field or white text cross into a white field; use solid backing or deliberate split-color treatment.
- Choose historically plausible Swiss poster grammar for this subject; do not default every design to black-white-red typographic disruption.
{asset_note}

Poster title: {title}
Domain: {domain}
Brief: {brief}
"""


def font(size: int, bold: bool = False):
    paths = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in paths:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    return ImageFont.load_default()


def make_assets() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    # Lake ferry: duotone-like generated landscape.
    im = Image.new("RGB", (1200, 900), "#d8e6df")
    d = ImageDraw.Draw(im)
    d.rectangle([0, 540, 1200, 900], fill="#0f4c6a")
    d.polygon([(0, 540), (1200, 450), (1200, 610), (0, 700)], fill="#79a7b8")
    d.polygon([(0, 430), (260, 260), (480, 430)], fill="#496b4f")
    d.polygon([(420, 450), (720, 220), (980, 450)], fill="#314b3b")
    d.rectangle([560, 520, 760, 565], fill="#f2efe5")
    d.polygon([(640, 470), (710, 520), (570, 520)], fill="#f2efe5")
    im.save(ASSETS / "lake-ferry.jpg", quality=92)

    # Stopwatch object with transparency.
    im = Image.new("RGBA", (900, 900), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse([150, 190, 750, 790], fill=(245, 244, 240, 255), outline=(28, 25, 23, 255), width=36)
    d.ellipse([390, 80, 510, 210], fill=(28, 25, 23, 255))
    d.rectangle([420, 30, 480, 120], fill=(28, 25, 23, 255))
    for a in range(0, 360, 15):
        import math
        x1 = 450 + 250 * math.cos(math.radians(a))
        y1 = 490 + 250 * math.sin(math.radians(a))
        x2 = 450 + 280 * math.cos(math.radians(a))
        y2 = 490 + 280 * math.sin(math.radians(a))
        d.line([x1, y1, x2, y2], fill=(28, 25, 23, 255), width=4)
    d.line([450, 490, 450, 280], fill=(200, 16, 46, 255), width=10)
    d.line([450, 490, 620, 550], fill=(28, 25, 23, 255), width=12)
    im.save(ASSETS / "stopwatch.png")

    # Market produce.
    im = Image.new("RGB", (1000, 760), "#f3e4bd")
    d = ImageDraw.Draw(im)
    colors = ["#b21f2d", "#d7a022", "#2f6b3f", "#6f3d1f"]
    for i in range(48):
        x = 60 + (i % 12) * 74
        y = 70 + (i // 12) * 145
        d.ellipse([x, y, x + 52, y + 52], fill=colors[i % len(colors)])
        d.line([x + 25, y, x + 40, y - 18], fill="#2f3b25", width=4)
    d.rectangle([0, 600, 1000, 760], fill="#1c1917")
    d.rectangle([60, 630, 940, 700], fill="#f3e4bd")
    im.save(ASSETS / "market-produce.jpg", quality=92)

    # Archive assets.
    im = Image.new("RGB", (900, 1200), "#eee8d9")
    d = ImageDraw.Draw(im)
    f = font(28, False)
    for y in range(110, 1080, 72):
        d.line([90, y, 810, y], fill="#77736a", width=2)
    for i, txt in enumerate(["ARCHIV 04", "PROTOKOLL", "17 MAI", "ROOM / STACK / INDEX"]):
        d.text((120, 90 + i * 130), txt, fill="#1c1917", font=f)
    d.rectangle([100, 760, 820, 900], outline="#1c1917", width=6)
    im.save(ASSETS / "archive-document.jpg", quality=92)

    im = Image.new("RGB", (900, 1200), "#c8c4bd")
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 900, 1200], fill="#2a2926")
    d.ellipse([260, 170, 640, 550], fill="#d8d3c7")
    d.rectangle([190, 540, 710, 1100], fill="#b8b1a4")
    d.rectangle([320, 285, 390, 335], fill="#1c1917")
    d.rectangle([510, 285, 580, 335], fill="#1c1917")
    d.line([350, 430, 550, 430], fill="#1c1917", width=14)
    im.save(ASSETS / "archive-portrait.jpg", quality=92)

    # Snow rail.
    im = Image.new("RGB", (1400, 900), "#dfe8eb")
    d = ImageDraw.Draw(im)
    d.polygon([(0, 570), (360, 180), (720, 570)], fill="#6f8a96")
    d.polygon([(420, 590), (840, 130), (1260, 590)], fill="#3b5964")
    d.polygon([(760, 610), (1150, 260), (1400, 610)], fill="#5e737b")
    d.line([0, 760, 1400, 620], fill="#1c1917", width=18)
    d.rectangle([520, 650, 860, 730], fill="#c8102e")
    d.rectangle([570, 600, 790, 650], fill="#1c1917")
    for x in range(595, 780, 55):
        d.rectangle([x, 615, x + 32, 642], fill="#fafaf9")
    im.save(ASSETS / "snow-rail.jpg", quality=92)


def materialize_old_skill() -> Path:
    if OLD_SKILL_TMP.exists():
        shutil.rmtree(OLD_SKILL_TMP)
    OLD_SKILL_TMP.mkdir(parents=True)
    files = subprocess.check_output(["git", "ls-tree", "-r", "--name-only", "origin/main", "swiss-poster"], cwd=ROOT, text=True).splitlines()
    for rel in files:
        if not rel.strip():
            continue
        dest = OLD_SKILL_TMP / Path(rel).relative_to("swiss-poster")
        dest.parent.mkdir(parents=True, exist_ok=True)
        data = subprocess.check_output(["git", "show", f"origin/main:{rel}"], cwd=ROOT)
        dest.write_bytes(data)
    return OLD_SKILL_TMP


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


def run_pi(case: dict, variant: str, skill_path: Path, force: bool = False) -> dict:
    run_dir = OUT / "cases" / case["id"] / variant
    run_dir.mkdir(parents=True, exist_ok=True)
    for asset in case["assets"]:
        shutil.copy2(ASSETS / asset, run_dir / asset)
    html_path = run_dir / "poster.html"
    raw_path = run_dir / "raw.txt"
    if html_path.exists() and not force:
        return {"id": case["id"], "variant": variant, "cached": True}
    width, height = case["canvas"]
    asset_note = ""
    if case["assets"]:
        asset_note = "Local assets available: " + ", ".join(case["assets"]) + ". Use them if they help the poster argument."
    prompt = BASE_PROMPT.format(width=width, height=height, title=case["title"], domain=case["domain"], brief=case["brief"], asset_note=asset_note)
    cmd = [
        "pi",
        "--thinking", "minimal",
        "--no-session",
        "--no-context-files",
        "--no-extensions",
        "--no-prompt-templates",
        "--tools", "read",
        "--skill", str(skill_path),
        "-p", prompt,
    ]
    proc = subprocess.run(cmd, cwd=run_dir, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=480)
    raw_path.write_text(proc.stdout + ("\n\nSTDERR:\n" + proc.stderr if proc.stderr else ""), encoding="utf-8")
    if proc.returncode != 0:
        raise RuntimeError(f"pi failed for {case['id']} {variant}: {proc.stderr[-1200:]}")
    html_text = extract_html(proc.stdout)
    if "<html" not in html_text.lower() and "<!doctype" not in html_text.lower():
        raise RuntimeError(f"no HTML found for {case['id']} {variant}")
    html_path.write_text(html_text, encoding="utf-8")
    return {"id": case["id"], "variant": variant, "cached": False}


def chrome_path() -> str:
    mac = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
    if mac.exists():
        return str(mac)
    found = shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chrome")
    if not found:
        raise RuntimeError("Chrome/Chromium not found")
    return found


def render_all() -> None:
    chrome = chrome_path()
    for case in CASES:
        width, height = case["canvas"]
        for variant in ["old", "new"]:
            run_dir = OUT / "cases" / case["id"] / variant
            subprocess.run([
                chrome,
                "--headless=new",
                "--disable-gpu",
                "--hide-scrollbars",
                f"--window-size={width},{height}",
                f"--screenshot={run_dir / 'poster.png'}",
                f"file://{run_dir / 'poster.html'}",
            ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, timeout=60)


def fit(im: Image.Image, box: tuple[int, int]) -> Image.Image:
    im = im.convert("RGB")
    im.thumbnail(box, Image.Resampling.LANCZOS)
    out = Image.new("RGB", box, (250, 250, 249))
    out.paste(im, ((box[0] - im.width) // 2, (box[1] - im.height) // 2))
    return out


def make_sheet() -> None:
    thumb = (520, 740)
    text_w = 330
    gap = 18
    pad = 34
    row_h = thumb[1] + 110
    W = pad * 2 + text_w + gap + thumb[0] * 2 + gap
    H = pad * 2 + 90 + len(CASES) * row_h + (len(CASES) - 1) * gap
    out = Image.new("RGB", (W, H), (231, 229, 228))
    d = ImageDraw.Draw(out)
    f_title = font(30, True)
    f_head = font(17, True)
    f_body = font(13)
    f_tiny = font(10, True)
    d.text((pad, 22), "Diverse Swiss poster prompts: old skill vs current skill", fill=(28, 25, 23), font=f_title)
    d.text((pad, 58), "Same generated prompt per pair. Domains avoid Cloudflare/tech monoculture; full-size PNG/HTML linked in index.html.", fill=(87, 83, 78), font=f_body)
    y0 = pad + 90
    for i, case in enumerate(CASES):
        y = y0 + i * (row_h + gap)
        x = pad
        d.rectangle([x, y, x + W - pad * 2, y + row_h], fill=(250, 250, 249), outline=(214, 211, 209))
        d.text((x + 12, y + 16), f"{i+1:02d}. {case['title']}", fill=(28, 25, 23), font=f_head)
        d.text((x + 12, y + 40), case["domain"], fill=(120, 113, 108), font=f_tiny)
        for k, line in enumerate(textwrap.wrap(case["brief"], 42)[:12]):
            d.text((x + 12, y + 62 + k * 15), line, fill=(87, 83, 78), font=f_body)
        d.text((x + 12, y + row_h - 28), f"canvas {case['canvas'][0]}×{case['canvas'][1]}", fill=(120, 113, 108), font=f_tiny)
        for j, variant in enumerate(["old", "new"]):
            ix = x + text_w + gap + j * (thumb[0] + gap)
            im = Image.open(OUT / "cases" / case["id"] / variant / "poster.png")
            out.paste(fit(im, thumb), (ix, y + 38))
            bar = (28, 25, 23) if variant == "old" else (200, 16, 46)
            d.rectangle([ix, y, ix + thumb[0], y + 26], fill=bar)
            d.text((ix + 8, y + 7), "OLD SKILL" if variant == "old" else "CURRENT SKILL", fill=(250, 250, 249), font=f_tiny)
    out.save(OUT / "contact-sheet.png")

    manifest = []
    for case in CASES:
        entry = {k: case[k] for k in ["id", "title", "domain", "canvas", "brief", "assets"]}
        entry["old"] = str(OUT / "cases" / case["id"] / "old" / "poster.png")
        entry["new"] = str(OUT / "cases" / case["id"] / "new" / "poster.png")
        manifest.append(entry)
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    rows = []
    for case in CASES:
        rows.append(f"<h2>{html.escape(case['title'])}</h2><p>{html.escape(case['domain'])}</p><p>{html.escape(case['brief'])}</p><div class='pair'><a href='cases/{case['id']}/old/poster.png'><img src='cases/{case['id']}/old/poster.png'></a><a href='cases/{case['id']}/new/poster.png'><img src='cases/{case['id']}/new/poster.png'></a></div>")
    index = """<!doctype html><html><head><meta charset='utf-8'><title>Diverse old vs new Swiss poster contact sheet</title><style>body{margin:0;background:#e7e5e4;color:#1c1917;font-family:Arial,sans-serif}main{padding:24px;max-width:1600px}.sheet{width:100%;height:auto;border:1px solid #d6d3d1}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:12px 0 40px}.pair img{width:100%;height:auto;border:1px solid #d6d3d1;background:#fafaf9}a{color:#1c1917}</style></head><body><main><h1>Diverse Swiss poster prompts: old skill vs current skill</h1><p>Large contact sheet plus full-size linked outputs. Left = old skill from origin/main. Right = current skill.</p><p><a href='manifest.json'>manifest</a></p><img class='sheet' src='contact-sheet.png' alt='old versus current skill diverse poster contact sheet'>""" + "\n".join(rows) + "</main></body></html>"
    (OUT / "index.html").write_text(index, encoding="utf-8")
    print(OUT / "contact-sheet.png")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    make_assets()
    old_skill = materialize_old_skill()
    force = os.environ.get("DIVERSE_FORCE") == "1"
    tasks = []
    with cf.ThreadPoolExecutor(max_workers=int(os.environ.get("DIVERSE_CONCURRENCY", "2"))) as ex:
        for case in CASES:
            tasks.append(ex.submit(run_pi, case, "old", old_skill, force))
            tasks.append(ex.submit(run_pi, case, "new", NEW_SKILL, force))
        for fut in cf.as_completed(tasks):
            print(fut.result())
    render_all()
    make_sheet()


if __name__ == "__main__":
    main()
