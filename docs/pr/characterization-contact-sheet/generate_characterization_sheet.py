#!/usr/bin/env python3
"""Golden-baseline characterization sheet for swiss-poster committed posters.

This is deliberately NOT an old-skill rerun baseline. Characterization tests need
real observed behavior. The left side is copied from git at origin/main:posters/*.
The right side is a current-skill rerun from a documented brief.

The script fails if any baseline row is not an actual PNG in origin/main:posters/.
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
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / "docs/pr/characterization-contact-sheet"
BASELINE = OUT / "baseline"
CURRENT = OUT / "current"
SKILL = ROOT / "swiss-poster"

POSTERS = [
    {
        "poster": "posters/cloudflare-london-user-group.png",
        "id": "cloudflare-london-user-group",
        "title": "Cloudflare London User Group",
        "prompt_provenance": "Exact local Pi prompt exists for the source tweet-thread task; this one-page event poster brief is reconstructed from PR #1/body and committed poster content.",
        "brief": "Swiss Poster composition for the inaugural Cloudflare London User Group meetup: 29 Apr 2026, Waterloo, Cloudflare orange as the single accent, IBM Plex Sans, mega-scale Cloudflare/London wordmark, event details, three talks, venue, RSVP.",
        "assets": [
            {
                "path": "posters/tweet-photo.jpg",
                "alt": "Sunset view from Cloudflare County Hall across the Thames to Westminster / Big Ben.",
            }
        ],
        "source_material": [
            "Tweet text: “This evening is the inaugural meeting of the Cloudflare London User Group. It's at our offices in Waterloo. See you there.”",
        ],
    },
    {
        "poster": "posters/cloudflare-london-tweets.png",
        "id": "cloudflare-london-tweets",
        "title": "Cloudflare London Tweets",
        "prompt_provenance": "Exact local Pi prompt exists: create a new poster from six x.com URLs and fully use/pass the skill criteria.",
        "brief": "Poster based on six @ade_oshineye Cloudflare London User Group tweets: the County Hall view, Prada the pigeon, arriving at the venue, Security/Agents/Sandboxes talks, a live demo, and closing group photo. Make the thread feel like one public recap artifact.",
        "source_material": [
            "Tweet 01: This evening is the inaugural meeting of the Cloudflare London User Group. It's at our offices in Waterloo. See you there.",
            "Tweet 02: If you're attending, say hi to Prada the pigeon.",
            "Tweet 03: I'll also be doing demos of two links.",
            "Tweet 04: Now Alpesh Doshi talking about agent orchestration.",
            "Tweet 05: And now Yigit Erol is talking about safer agent workflows with sandboxes and zero-trust egress.",
            "Tweet 06: Thanks to our organizers; looking for fun community demos; sessions roughly every month from now on.",
        ],
    },
    {
        "poster": "posters/cloudflare-london-recap.png",
        "id": "cloudflare-london-recap",
        "title": "Cloudflare London Recap",
        "prompt_provenance": "Reconstructed from committed recap poster content and Cloudflare tweet-thread PR history.",
        "brief": "Create a full-thread recap poster for the inaugural Cloudflare London User Group: venue view, Prada the pigeon, talk sequence, arrivals, live demo, closing group photo, and a single clear public recap narrative.",
        "source_material": [
            "Source thread: x.com/@ade_oshineye, six tweets, 29 Apr 2026.",
            "Core quote: “This evening is the inaugural meeting of the Cloudflare London User Group. It's at our offices in Waterloo.”",
            "Thread beats: County Hall view, Prada the pigeon, demos, Alpesh on agents, Yigit on sandboxes/zero-trust egress, monthly community demos.",
        ],
    },
    {
        "poster": "posters/cloudflare-london-onepage.png",
        "id": "cloudflare-london-onepage",
        "title": "Cloudflare London Onepage",
        "prompt_provenance": "Reconstructed from commit message 'Add one-page poster — entire recap in a single A2 frame' and committed poster content.",
        "brief": "Create a one-page A2 Swiss-poster recap of the Cloudflare London User Group thread: one frame containing the meetup invitation, venue, talks, demo, community moment, and closing image/story.",
        "assets": [
            {"path": "posters/thread-media-2049452285139276131-1.jpg", "alt": "Sunset over Big Ben from Cloudflare County Hall."},
            {"path": "posters/thread-media-2049531960716914824-2.jpg", "alt": "Prada the pigeon on the Cloudflare letters."},
            {"path": "posters/thread-media-2049559654208856175-3.jpg", "alt": "Alpesh Doshi presenting an Agentic System slide."},
            {"path": "posters/thread-media-2049562905536795033-4.jpg", "alt": "Yigit Erol presenting Sandboxes / Zero-Trust material."},
            {"path": "posters/thread-media-2049575911872160076-5.jpg", "alt": "Organizers chatting at post-talk drinks."},
        ],
        "source_material": [
            "Thread recap line: SWARMS HALLUCINATE IN CHORUS.",
            "Source sequence: first → last tweet; 6 tweets; 8h 11m.",
        ],
    },
    {
        "poster": "posters/cloudflare-london-landscape.png",
        "id": "cloudflare-london-landscape",
        "title": "Cloudflare London Landscape",
        "prompt_provenance": "Reconstructed from committed landscape poster variant and Cloudflare tweet-thread PR history.",
        "brief": "Create a landscape Swiss-poster variant for the Cloudflare London User Group recap, using the same thread content but optimized for a wide frame with strong typographic hierarchy and Cloudflare orange.",
        "assets": [
            {"path": "posters/tweet-image-orange.jpg", "alt": "Orange-duotone view from County Hall across the Thames to Westminster."},
        ],
        "source_material": [
            "Same thread content as the Cloudflare London User Group recap; use the venue view as the wide-image anchor.",
        ],
    },
    {
        "poster": "posters/cloudflare-london-poster.png",
        "id": "cloudflare-london-poster",
        "title": "Cloudflare London Poster",
        "prompt_provenance": "Reconstructed from committed single portrait poster variant and Cloudflare tweet-thread PR history.",
        "brief": "Create a single portrait Swiss poster for the Cloudflare London User Group recap: Cloudflare London, Waterloo, 29 Apr 2026, three talks, venue photo/view, community detail, and RSVP/recap metadata.",
        "source_material": [
            "Quote: “Thanks to our organizers and we are looking for people from the community with fun and interesting demos. We will be having sessions roughly every month from now on.”",
            "Talks: Edge platform lessons from production; MoQ and realtime media; Credential Broker pattern.",
        ],
    },
    {
        "poster": "posters/cloudflare-connect-london.png",
        "id": "cloudflare-connect-london",
        "title": "Cloudflare Connect London",
        "prompt_provenance": "Reconstructed from commit messages and committed poster content for the Connect London branch.",
        "brief": "Cloudflare Connect London Developer Track poster: London event, UK-centred globe or map motif, real talk sequence, speaker/talk metadata, Cloudflare orange accent, strict Swiss poster checklist discipline.",
        "assets": [
            {"path": "posters/connect-venue-orange.jpg", "alt": "Cloudflare Connect London venue treated in orange duotone."},
            {"path": "posters/globe-uk.svg", "alt": "UK-centred globe/map line drawing."},
        ],
        "source_material": [
            "Developer Track: opening keynote; realtime media over MoQ; credential broker patterns; workers/demos/deployment.",
        ],
    },
    {
        "poster": "posters/breaking-the-35.png",
        "id": "breaking-the-35",
        "title": "Breaking the 35",
        "prompt_provenance": "Reconstructed from PR #2 body; exact Claude prompt was not stored locally.",
        "brief": "Poster telling the rebellion against the Adobe LaserWriter font menu from 1985–1995: the PostScript 35, ransom-note typography, Neville Brody and FontShop, Emigre, CalArts, Cranbrook, and the postmodern break from the default menu.",
    },
    {
        "poster": "posters/fork-the-planet.png",
        "id": "fork-the-planet",
        "title": "Fork the Planet",
        "prompt_provenance": "Reconstructed from committed poster filename/content and PR #2 branch history; exact prompt was not stored locally.",
        "brief": "Typographic/software-culture poster titled Fork the Planet: branching, forking, remixing, crash override, cereal killer energy, and planetary-scale code culture. Treat the fork/branch as the subject, not as a decorative arrow.",
    },
    {
        "poster": "posters/slop-to-hillclimbing.png",
        "id": "slop-to-hillclimbing",
        "title": "Slop → Hillclimbing",
        "prompt_provenance": "Reconstructed from PR #4 body; exact Claude prompt was not stored locally.",
        "brief": "Weltformat technical poster around the function definition refine(slop: Slop) -> Hillclimbing. Include function properties, preconditions, postconditions, iterative improvement, gradient/loss landscape notation, and the idea that slop is improved by deliberate hillclimbing.",
    },
    {
        "poster": "posters/durable-objects.png",
        "id": "durable-objects",
        "title": "Durable Objects",
        "prompt_provenance": "Reconstructed from PR #3 body; exact Claude prompt was not stored locally.",
        "brief": "Explainer poster for Cloudflare Durable Objects. Teach what a Durable Object is: a tiny long-lived server guaranteed unique for a specific ID. Arc: what it is, how it differs from stateless Workers, what it contains, how to think about it, and what follows for coordination.",
    },
    {
        "poster": "posters/lean-into-your-weirdness.png",
        "id": "lean-into-your-weirdness",
        "title": "Lean Into Your Weirdness",
        "prompt_provenance": "Reconstructed from PR #3 body; exact Claude prompt was not stored locally.",
        "brief": "Manifesto poster titled Lean Into Your Weirdness. The word WEIRDNESS should physically demonstrate the claim through mixed weights/styles, with tradeoffs, diagnosis, patron saints, practices, and standing order. The form should feel intentionally strange but still readable.",
    },
    {
        "poster": "posters/ten-principles-for-bad-design.png",
        "id": "ten-principles-for-bad-design",
        "title": "Ten Principles for Bad Design",
        "prompt_provenance": "Reconstructed from PR #3 body; exact Claude prompt was not stored locally.",
        "brief": "Rams-style poster for eleven principles of bad design. The poster about bad design should demonstrate good design: quiet grid, disciplined title, two-column principle matrix, restraint, no decorative chrome, and a final eleventh principle given special placement.",
    },
    {
        "poster": "posters/credential-broker.png",
        "id": "credential-broker",
        "title": "Credential Broker",
        "prompt_provenance": "Reconstructed from PR #5 body; exact Claude prompt was not stored locally.",
        "brief": "Poster explaining the Outbound Worker / Credential Broker / Intercepting Proxy pattern. Secrets, credentials, and capabilities stay outside the untrusted agent sandbox. A trusted broker holds them and spends them on the agent's behalf, on your terms. Avoid code snippets and API headers; make the trust boundary visual.",
    },
    {
        "poster": "posters/moq.png",
        "id": "moq",
        "title": "Media over QUIC",
        "prompt_provenance": "Reconstructed from PR #7 body; exact Claude prompt was not stored locally.",
        "brief": "Slop-free Swiss poster explaining Media over QUIC: flat fields, single Cloudflare orange accent, light ground, meaningful latency-vs-scale quadrant, sub-second target, CDN-style relay, broadcast delivery, and interoperability rather than vague hype.",
    },
]

BASE_PROMPT = """Use the loaded swiss-poster skill to create one standalone poster.

Return ONLY a complete self-contained HTML document beginning with <!doctype html>. Do not use Markdown fences. Do not explain.

Canvas and rendering:
- Design for an 840px wide by 1200px tall browser screenshot.
- Use internal CSS only; do not fetch scripts, fonts, Tailwind CDN, or remote assets.
- Use system sans-serif/monospace fallbacks if needed.

Content and safety rules:
- Do NOT print or paraphrase these instruction labels: prompt, brief, source brief, old skill, current skill, same prompt, new skill, audit, generated, create a poster.
- Do NOT print implementation metadata such as screenshot dimensions, color hex values, skill/eval/oracle labels, or “single accent”.
- Do NOT paste the raw brief into the artwork. Convert it into real poster copy: title, short subtitle, 3-8 concise content labels/facts, metadata, and one small CTA/closing label if appropriate.
- Keep the primary title, key date/metadata, and CTA/body labels readable at a glance.
- Overlap/crop may affect decorative anchor layers, background type, or secondary shapes; it must not obscure the main title or core explanatory text.
- No accidental text-on-text collisions. Put readable text on quiet fields with contrast.
- Use one accent hue only: Cloudflare orange (#F38020) for Cloudflare/MoQ/Credential Broker prompts, Swiss red (#C8102E) otherwise.
- Make the visual grammar come from the subject, not from a reusable template.
{resources}
Poster title: {title}
Source material to transform into poster content:
{brief}
"""

RESOURCE_PROMPT = """

Available committed source resources:
- The following files are copied next to the HTML under ./assets/ and may be used with relative paths like <img src=\"assets/name.jpg\">.
{asset_lines}
- Use every provided asset at least once when multiple assets are listed; small Swiss-grid thumbnails, masked fragments, or duotone strips are fine. Do not let images obscure the critical reading zone.
- Do not inline base64 and do not fetch remote resources; use only these local committed files.
{source_lines}
"""


def git_main_files() -> set[str]:
    out = subprocess.check_output(["git", "ls-tree", "-r", "--name-only", "origin/main", "posters"], cwd=ROOT, text=True)
    return {line.strip() for line in out.splitlines() if line.strip()}


def git_main_pngs() -> set[str]:
    return {path for path in git_main_files() if path.endswith(".png")}


def validate_manifest() -> None:
    main_files = git_main_files()
    main_pngs = {path for path in main_files if path.endswith(".png")}
    seen: set[str] = set()
    failures: list[str] = []
    for row in POSTERS:
        poster = row["poster"]
        if poster not in main_pngs:
            failures.append(f"not in origin/main posters: {poster}")
        for asset in row.get("assets", []):
            if asset["path"] not in main_files:
                failures.append(f"asset not in origin/main: {asset['path']} for {row['id']}")
        if poster in seen:
            failures.append(f"duplicate poster row: {poster}")
        seen.add(poster)
    if failures:
        raise SystemExit("\n".join(failures))


def extract_html(text: str) -> str:
    m = re.search(r"```(?:html)?\s*(.*?)```", text, re.S | re.I)
    if m:
        text = m.group(1)
    idx = text.lower().find("<!doctype")
    if idx == -1:
        idx = text.lower().find("<html")
    if idx > 0:
        text = text[idx:]
    return text.strip()


def asset_name(path: str) -> str:
    return Path(path).name


def copy_row_assets(row: dict) -> list[dict]:
    copied: list[dict] = []
    assets = row.get("assets", [])
    if not assets:
        return copied
    asset_dir = CURRENT / row["id"] / "assets"
    asset_dir.mkdir(parents=True, exist_ok=True)
    for asset in assets:
        name = asset_name(asset["path"])
        data = subprocess.check_output(["git", "show", f"origin/main:{asset['path']}"], cwd=ROOT)
        (asset_dir / name).write_bytes(data)
        copied.append({**asset, "name": name, "relative": f"assets/{name}"})
    return copied


def resources_prompt(row: dict, copied_assets: list[dict]) -> str:
    source_material = row.get("source_material", [])
    if not copied_assets and not source_material:
        return ""
    asset_lines = "\n".join(
        f"  - assets/{asset['name']} — {asset.get('alt', 'committed source resource')}"
        for asset in copied_assets
    ) or "  - No local image assets for this row; use the committed source text below."
    source_lines = "\n".join(f"- {line}" for line in source_material)
    if source_lines:
        source_lines = "Committed source text/tweet material to transform, not paste wholesale:\n" + source_lines
    return RESOURCE_PROMPT.format(asset_lines=asset_lines, source_lines=source_lines)


def run_pi(row: dict, force: bool = False) -> dict:
    run_dir = CURRENT / row["id"]
    run_dir.mkdir(parents=True, exist_ok=True)
    copied_assets = copy_row_assets(row)
    html_path = run_dir / "poster.html"
    raw_path = run_dir / "raw.txt"
    if html_path.exists() and not force:
        return {"id": row["id"], "cached": True, "assets": len(copied_assets)}
    prompt = BASE_PROMPT.format(title=row["title"], brief=row["brief"], resources=resources_prompt(row, copied_assets))
    cmd = [
        "pi",
        "--thinking", "minimal",
        "--no-session",
        "--no-context-files",
        "--no-extensions",
        "--no-prompt-templates",
        "--tools", "read",
        "--skill", str(SKILL),
        "-p",
        prompt,
    ]
    proc = subprocess.run(cmd, cwd=run_dir, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=420)
    raw_path.write_text(proc.stdout + ("\n\nSTDERR:\n" + proc.stderr if proc.stderr else ""), encoding="utf-8")
    if proc.returncode != 0:
        raise RuntimeError(f"pi failed for {row['id']}: {proc.stderr[-1200:]}")
    html_text = extract_html(proc.stdout)
    if "<html" not in html_text.lower():
        raise RuntimeError(f"no html found for {row['id']}")
    html_path.write_text(html_text, encoding="utf-8")
    return {"id": row["id"], "cached": False}


def chrome_path() -> str:
    mac = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
    if mac.exists():
        return str(mac)
    found = shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chrome")
    if not found:
        raise RuntimeError("Chrome/Chromium not found")
    return found


def copy_baselines() -> None:
    BASELINE.mkdir(parents=True, exist_ok=True)
    for row in POSTERS:
        data = subprocess.check_output(["git", "show", f"origin/main:{row['poster']}"], cwd=ROOT)
        (BASELINE / f"{row['id']}.png").write_bytes(data)


def render_current() -> None:
    chrome = chrome_path()
    for row in POSTERS:
        html_path = CURRENT / row["id"] / "poster.html"
        png_path = CURRENT / row["id"] / "poster.png"
        subprocess.run([
            chrome,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--window-size=840,1200",
            f"--screenshot={png_path}",
            f"file://{html_path}",
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, timeout=60)


def fit(im: Image.Image, size: tuple[int, int], bg=(250, 250, 249)) -> Image.Image:
    im = im.convert("RGB")
    im.thumbnail(size, Image.Resampling.LANCZOS)
    out = Image.new("RGB", size, bg)
    out.paste(im, ((size[0] - im.width) // 2, (size[1] - im.height) // 2))
    return out


def font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    paths = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            pass
    return ImageFont.load_default()


def audit_html(text: str) -> list[str]:
    lower = text.lower()
    findings = []
    for bad in ["source material", "source brief", "same prompt", "new skill", "old skill", "current skill", "create a poster", "create one standalone", "use the loaded"]:
        if bad in lower:
            findings.append(f"leaks '{bad}'")
    return findings


def make_sheet() -> None:
    manifest = []
    audit_rows = []
    for row in POSTERS:
        html_text = (CURRENT / row["id"] / "poster.html").read_text(encoding="utf-8", errors="replace")
        findings = audit_html(html_text)
        entry = {
            "id": row["id"],
            "title": row["title"],
            "baseline_ref": f"origin/main:{row['poster']}",
            "baseline_png": str(BASELINE / f"{row['id']}.png"),
            "current_html": str(CURRENT / row["id"] / "poster.html"),
            "current_png": str(CURRENT / row["id"] / "poster.png"),
            "prompt_provenance": row["prompt_provenance"],
            "brief": row["brief"],
            "assets": [
                {"source": asset["path"], "local": str(CURRENT / row["id"] / "assets" / asset_name(asset["path"])), "alt": asset.get("alt", "")}
                for asset in row.get("assets", [])
            ],
            "source_material": row.get("source_material", []),
            "audit_findings": findings,
        }
        manifest.append(entry)
        if findings:
            audit_rows.append({"id": row["id"], "findings": findings})
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (OUT / "audit.json").write_text(json.dumps(audit_rows, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    cols = 3
    img_w, img_h = 250, 358
    pair_gap = 10
    cell_w = img_w * 2 + pair_gap
    label_h = 118
    cell_h = img_h + label_h
    gap = 18
    pad = 28
    header_h = 82
    rows = (len(POSTERS) + cols - 1) // cols
    W = pad * 2 + cols * cell_w + (cols - 1) * gap
    H = pad * 2 + header_h + rows * cell_h + (rows - 1) * gap
    out = Image.new("RGB", (W, H), (231, 229, 228))
    d = ImageDraw.Draw(out)
    f_title = font(27, True)
    f_head = font(15, True)
    f_body = font(12)
    f_tiny = font(10, True)
    d.text((pad, 20), "Characterization sheet: committed baseline vs asset-aware current rerun", fill=(28, 25, 23), font=f_title)
    d.text((pad, 52), "Left = real PNG from origin/main:posters/*.png. Right = current skill rerun from documented brief plus committed source assets when available.", fill=(87, 83, 78), font=f_body)

    for i, row in enumerate(POSTERS):
        x = pad + (i % cols) * (cell_w + gap)
        y = pad + header_h + (i // cols) * (cell_h + gap)
        d.rectangle([x, y, x + cell_w, y + cell_h], fill=(250, 250, 249), outline=(214, 211, 209), width=1)
        images = [("COMMITTED BASELINE", BASELINE / f"{row['id']}.png", (28, 25, 23)), ("CURRENT SKILL RERUN", CURRENT / row["id"] / "poster.png", (200, 16, 46))]
        for j, (label, path, bar) in enumerate(images):
            thumb = fit(Image.open(path), (img_w, img_h))
            ix = x + j * (img_w + pair_gap)
            out.paste(thumb, (ix, y))
            d.rectangle([ix, y, ix + img_w, y + 20], fill=bar)
            d.text((ix + 7, y + 5), label, fill=(250, 250, 249), font=f_tiny)
        ty = y + img_h + 10
        d.text((x + 10, ty), f"{i+1:02d}. {row['title']}", fill=(28, 25, 23), font=f_head)
        d.text((x + 10, ty + 19), row["poster"], fill=(120, 113, 108), font=f_tiny)
        resource_count = len(row.get("assets", [])) + len(row.get("source_material", []))
        resource_note = f"Resources: {len(row.get('assets', []))} asset(s), {len(row.get('source_material', []))} source note(s). " if resource_count else ""
        for k, line in enumerate(textwrap.wrap(resource_note + row["brief"], 74)[:4]):
            d.text((x + 10, ty + 34 + k * 14), line, fill=(87, 83, 78), font=f_body)

    out.save(OUT / "contact-sheet.png")
    index = '''<!doctype html><html><head><meta charset="utf-8"><title>Characterization poster contact sheet</title><style>body{margin:0;background:#e7e5e4;font-family:Arial,sans-serif;color:#1c1917}main{padding:24px}img{max-width:100%;height:auto;display:block;border:1px solid #d6d3d1}a{color:#1c1917}</style></head><body><main><h1>Characterization sheet: committed baseline vs asset-aware current rerun</h1><p>Left = real PNG from <code>origin/main:posters/*.png</code>. Right = current skill rerun from a documented brief plus committed source assets/tweet text when available. This sheet intentionally rejects any baseline that is not present on main.</p><p><a href="manifest.json">manifest</a> · <a href="audit.json">audit</a></p><img src="contact-sheet.png" alt="committed baseline versus asset-aware current skill rerun contact sheet"></main></body></html>'''
    (OUT / "index.html").write_text(index, encoding="utf-8")
    print(OUT / "contact-sheet.png")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    CURRENT.mkdir(parents=True, exist_ok=True)
    validate_manifest()
    copy_baselines()
    force_ids = {item.strip() for item in os.environ.get("CHARACTERIZATION_FORCE_IDS", "").split(",") if item.strip()}
    force_all = os.environ.get("CHARACTERIZATION_FORCE_ALL") == "1"
    force_assets = os.environ.get("CHARACTERIZATION_FORCE_ASSET_ROWS") == "1"
    with cf.ThreadPoolExecutor(max_workers=3) as ex:
        futs = [
            ex.submit(run_pi, row, force=(force_all or row["id"] in force_ids or (force_assets and bool(row.get("assets") or row.get("source_material")))))
            for row in POSTERS
        ]
        for fut in cf.as_completed(futs):
            print(fut.result())
    render_current()
    make_sheet()


if __name__ == "__main__":
    main()
