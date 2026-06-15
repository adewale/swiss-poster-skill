#!/usr/bin/env python3
"""Generate 12 before/after comparison pairs with identical content per pair.

Before = tidy, low-drama web layout.
After = same content, transformed into Swiss-poster treatment.
"""
from __future__ import annotations
from pathlib import Path

PAIRS = [
    {
        "id": "01-jazz-night",
        "prompt": "Event poster for an experimental jazz night at a Basel arts venue.",
        "title": "Signal Night",
        "subtitle": "Three improvising ensembles perform one evening of brass, bass, and pulse.",
        "meta": ["Kulturhaus Basel", "20:00", "Room B"],
        "cta": "Reserve ticket",
        "items": ["Lineup", "Venue", "Tickets"],
        "anchor": "JAZZ",
        "motif": "rings",
    },
    {
        "id": "02-museum-forms",
        "prompt": "Museum landing page for a constructive-geometry exhibition.",
        "title": "New Forms",
        "subtitle": "A Kunsthalle exhibition on constructed shape, poster systems, and visual order.",
        "meta": ["Kunsthalle", "Gallery 2", "Offset study"],
        "cta": "View program",
        "items": ["Artists", "Program", "Visit"],
        "anchor": "FORM",
        "motif": "block",
    },
    {
        "id": "03-editorial-photo",
        "prompt": "Editorial feature page driven by a single documentary photograph.",
        "title": "Field Work",
        "subtitle": "A portfolio story built from one photograph, one hard crop, and one claim.",
        "meta": ["Portfolio", "Case 03", "Image crop"],
        "cta": "Open case",
        "items": ["Portrait", "Process", "Contact"],
        "anchor": "CUT",
        "motif": "photo",
    },
    {
        "id": "04-api-runtime",
        "prompt": "Developer-product hero for an edge runtime launch.",
        "title": "Edge Runtime",
        "subtitle": "Deploy server code close to users without losing operational clarity.",
        "meta": ["Product", "Node 20", "Global edge"],
        "cta": "Start build",
        "items": ["Fast", "Secure", "Observable"],
        "anchor": "EDGE",
        "motif": "split",
    },
    {
        "id": "05-climate-report",
        "prompt": "Climate-risk report introduction that should feel analytical, not decorative.",
        "title": "Heat Signals",
        "subtitle": "Quarterly operating signals for temperature, water stress, and delivery risk.",
        "meta": ["Q4", "2026", "Risk packet"],
        "cta": "Read report",
        "items": ["Heat", "Water", "Risk"],
        "anchor": "04",
        "motif": "data",
    },
    {
        "id": "06-bike-safety",
        "prompt": "Civic safety campaign for protected crossings near schools.",
        "title": "Slow Crossing",
        "subtitle": "A public notice asking drivers to give children space at the morning crossing.",
        "meta": ["School zone", "07:30", "City notice"],
        "cta": "See route",
        "items": ["Signal", "Crosswalk", "Care"],
        "anchor": "30",
        "motif": "date",
    },
    {
        "id": "07-portfolio-studio",
        "prompt": "Independent designer portfolio landing page.",
        "title": "Mira Cole",
        "subtitle": "Selected identity, editorial, and interface projects from 2024–2026.",
        "meta": ["Selected work", "01–12", "Available"],
        "cta": "Contact",
        "items": ["Work", "About", "Email"],
        "anchor": "MIRA",
        "motif": "name",
    },
    {
        "id": "08-night-tram",
        "prompt": "Transit information hero for a late-night tram route and station changes.",
        "title": "Night Line",
        "subtitle": "Visitor information for the last tram, transfer stop, route, and platform.",
        "meta": ["47.5596 N", "7.5886 E", "Line 8"],
        "cta": "Get route",
        "items": ["Station", "Map", "Hours"],
        "anchor": "BASEL",
        "motif": "map",
    },
    {
        "id": "09-coffee-product",
        "prompt": "Object-poster style launch panel for a single-origin coffee subscription.",
        "title": "One Clear Roast",
        "subtitle": "The Pro roast includes tasting notes, brew guidance, and priority delivery.",
        "meta": ["Origin", "12 bags", "Monthly"],
        "cta": "Choose roast",
        "items": ["Included", "Support", "Billing"],
        "anchor": "PRO",
        "motif": "price",
    },
    {
        "id": "10-type-newsletter",
        "prompt": "Newsletter signup for weekly typography criticism.",
        "title": "Letterform",
        "subtitle": "A weekly note about typography, systems, and the craft of layout.",
        "meta": ["Issue 08", "Every Friday", "Email"],
        "cta": "Subscribe",
        "items": ["Weekly", "Curated", "Free"],
        "anchor": "TYPE",
        "motif": "type",
    },
    {
        "id": "11-ops-dashboard",
        "prompt": "SRE dashboard introduction for latency and incident state.",
        "title": "Live Ops",
        "subtitle": "A dashboard introduction for latency, event volume, and incident state.",
        "meta": ["Latency", "Events", "99.9"],
        "cta": "Open dashboard",
        "items": ["Chart", "Alert", "Log"],
        "anchor": "SIGNAL",
        "motif": "signal",
    },
    {
        "id": "12-mobile-bank",
        "prompt": "Mobile banking onboarding screen that must stay thumb-safe and readable.",
        "title": "Launch Kit",
        "subtitle": "A compact mobile-first hero that keeps the action readable and safe.",
        "meta": ["320px safe", "No scroll", "Tap 44"],
        "cta": "Launch",
        "items": ["Menu", "Copy", "CTA"],
        "anchor": "GO",
        "motif": "mobile",
    },
]

CSS = r'''
*{box-sizing:border-box} html{width:640px;height:230px;overflow:hidden} body{margin:0;background:#e7e5e4;color:#1c1917;font-family:'IBM Plex Sans',Arial,sans-serif;overflow:hidden}.pair{width:1000px;height:360px;display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px;background:#e7e5e4;transform:scale(.64);transform-origin:0 0}.panel{position:relative;overflow:hidden;background:#fafaf9;height:340px}.tag{position:absolute;left:16px;top:14px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:800;color:#78716c}.after>.tag{left:auto;right:16px;color:rgba(250,250,249,.68);z-index:8;text-align:right}.before .center{position:absolute;inset:48px 36px 104px;display:flex;align-items:center;justify-content:center;text-align:center;flex-direction:column}.before h1{font-size:34px;line-height:1.05;letter-spacing:-.04em;margin:0;font-weight:800}.before p{font-size:13px;line-height:1.4;color:#78716c;max-width:300px}.rule{width:40px;height:3px;background:#C8102E;margin:12px auto}.before .meta-before{position:absolute;left:22px;right:22px;top:42px;display:flex;justify-content:space-between;font-size:9px;text-transform:uppercase;letter-spacing:.13em;color:#a8a29e;font-weight:700}.cards{position:absolute;left:22px;right:22px;bottom:22px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.card{border:1px solid #e7e5e4;background:white;padding:10px;font-size:11px;font-weight:800;min-height:50px}.card span{display:block;margin-top:4px;font-size:9px;font-weight:500;color:#78716c}.after{background:#fafaf9}.after:after{content:'';position:absolute;right:0;top:0;width:42%;height:100%;background:#1c1917}.meta{position:absolute;left:18px;top:18px;z-index:5;font-size:10px;line-height:1.25;letter-spacing:.16em;text-transform:uppercase;color:#57534e;font-weight:800}.word{position:absolute;left:-9px;bottom:-32px;z-index:3;font-size:132px;line-height:.76;letter-spacing:-.11em;font-weight:900;text-transform:uppercase;white-space:nowrap}.title{position:absolute;right:24px;top:108px;z-index:6;width:178px;color:#fafaf9}.title h2{font-size:27px;line-height:.94;letter-spacing:-.055em;margin:0 0 10px;text-transform:uppercase}.title p{font-size:11px;line-height:1.34;color:rgba(250,250,249,.82);margin:0}.cta{display:inline-flex;align-items:center;justify-content:center;margin-top:12px;min-height:32px;padding:0 11px;background:#fafaf9;color:#1c1917;font-size:8.5px;text-transform:uppercase;letter-spacing:.13em;font-weight:900}.support{position:absolute;left:18px;bottom:15px;z-index:5;display:flex;gap:8px}.support span{font-size:9px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;color:#57534e;border-top:2px solid #C8102E;padding-top:5px;min-width:54px}.ring{position:absolute;border-radius:50%;border-style:solid;z-index:2}.r1{right:-105px;top:36px;width:245px;height:245px;border-width:18px;border-color:#C8102E}.r2{right:-62px;top:82px;width:158px;height:158px;border-width:7px;border-color:rgba(200,16,46,.38)}.lines,.thin-lines,.signal-lines{position:absolute;inset:0;z-index:1;color:rgba(28,25,23,.07);background-image:repeating-linear-gradient(90deg,currentColor 0 1px,transparent 1px 8px);clip-path:polygon(0 0,60% 0,48% 100%,0 100%)}.slab{position:absolute;left:150px;top:132px;width:210px;height:54px;background:#C8102E;z-index:2}.slab.small{left:210px;width:110px}.photo{position:absolute;left:0;top:0;width:58%;height:100%;background:#1c1917;z-index:1}.photo div{position:absolute;inset:24px;background:linear-gradient(135deg,#fafaf9 0 18%,#57534e 18% 42%,#d6d3d1 42% 65%,#292524 65%);filter:grayscale(1);opacity:.8}.red-strip{position:absolute;left:44px;bottom:58px;width:260px;height:36px;background:#C8102E;z-index:2}.splitdark{position:absolute;inset:0 42% 0 0;background:#1c1917;z-index:1}.diag{position:absolute;left:100px;top:30px;width:300px;height:16px;background:#C8102E;transform:rotate(-18deg);z-index:2}.bars{position:absolute;left:140px;bottom:54px;width:190px;height:120px;z-index:2;background:repeating-linear-gradient(0deg,#C8102E 0 11px,transparent 11px 22px)}.gridmark,.pricegrid{position:absolute;inset:0;color:rgba(28,25,23,.08);background-image:linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px);background-size:24px 24px;z-index:1}.datebar{position:absolute;left:0;top:112px;width:330px;height:60px;background:#C8102E;z-index:1}.circle-small{position:absolute;right:150px;top:38px;width:74px;height:74px;border-radius:50%;background:#C8102E;z-index:2}.nameblocks{position:absolute;left:120px;bottom:58px;width:210px;height:110px;background:linear-gradient(90deg,#C8102E 0 38%,transparent 38% 45%,#1c1917 45% 75%,transparent 75%);z-index:2}.maplines{position:absolute;left:40px;top:42px;width:310px;height:220px;background:linear-gradient(130deg,transparent 48%,rgba(28,25,23,.16) 48% 50%,transparent 50%),linear-gradient(35deg,transparent 48%,rgba(28,25,23,.12) 48% 50%,transparent 50%);z-index:1}.pin{position:absolute;left:210px;top:120px;width:56px;height:56px;border-radius:50%;background:#C8102E;z-index:2}.priceblock{position:absolute;left:118px;top:72px;width:230px;height:170px;background:#C8102E;z-index:1}.letterrows{position:absolute;left:18px;top:54px;font-size:72px;line-height:.75;letter-spacing:-.1em;font-weight:900;color:rgba(28,25,23,.08);z-index:1}.pulse{position:absolute;left:120px;top:100px;width:230px;height:100px;border-top:16px solid #C8102E;border-bottom:16px solid #C8102E;z-index:2}.mobileframe{position:absolute;left:128px;top:48px;width:150px;height:240px;border:15px solid #1c1917;z-index:1}.tap{position:absolute;left:236px;top:178px;width:72px;height:72px;border-radius:50%;background:#C8102E;z-index:2}.after-block:after,.after-data:after,.after-photo:after,.after-map:after,.after-price:after,.after-type:after,.after-signal:after,.after-mobile:after{display:none}.after-split:after{left:0;right:auto;width:48%;background:#1c1917}.after-date:after{left:0;right:auto;top:auto;bottom:0;width:100%;height:29%;background:#1c1917}.after-name:after{left:48%;right:auto;width:11%;background:#1c1917}.after-block .title,.after-data .title,.after-photo .title,.after-map .title,.after-type .title,.after-signal .title,.after-mobile .title{right:22px;top:54px;color:#1c1917}.after-block .title p,.after-data .title p,.after-photo .title p,.after-map .title p,.after-type .title p,.after-signal .title p,.after-mobile .title p{color:#57534e}.after-block .cta,.after-data .cta,.after-photo .cta,.after-map .cta,.after-type .cta,.after-signal .cta,.after-mobile .cta{background:#1c1917;color:#fafaf9}.after-block>.tag,.after-data>.tag,.after-photo>.tag,.after-map>.tag,.after-type>.tag,.after-signal>.tag,.after-mobile>.tag{color:#78716c}.after-data .title{top:78px}.after-photo .title{top:84px}.after-map .title{top:92px;right:18px}.after-price .title{left:162px;right:auto;top:82px;width:154px;color:#fafaf9}.after-price .title p{color:rgba(250,250,249,.82)}.after-price .cta{background:#fafaf9;color:#1c1917}.after-price>.tag{color:#78716c}.after-name .title,.after-date .title{right:22px;color:#1c1917}.after-name .title p,.after-date .title p{color:#57534e}.after-name .cta,.after-date .cta{background:#1c1917;color:#fafaf9}.after-name .word{left:-18px}.after-date .title{top:42px}.after-date .word{bottom:42px;color:#1c1917}.after-split .title{top:102px;right:22px;color:#1c1917}.after-split .title p{color:#57534e}.after-split .cta{background:#1c1917;color:#fafaf9}.after-split>.tag{color:#78716c}
'''


def motif_css(m: str) -> str:
    return {
        "rings": '<div class="ring r1"></div><div class="ring r2"></div><div class="lines"></div>',
        "block": '<div class="slab"></div><div class="thin-lines"></div>',
        "photo": '<div class="photo"><div></div></div><div class="red-strip"></div>',
        "split": '<div class="splitdark"></div><div class="diag"></div>',
        "data": '<div class="bars"></div><div class="gridmark"></div>',
        "date": '<div class="datebar"></div><div class="circle-small"></div>',
        "name": '<div class="nameblocks"></div><div class="slab small"></div>',
        "map": '<div class="maplines"></div><div class="pin"></div>',
        "price": '<div class="priceblock"></div><div class="pricegrid"></div>',
        "type": '<div class="letterrows">A A A<br>B B B<br>C C C</div>',
        "signal": '<div class="signal-lines"></div><div class="pulse"></div>',
        "mobile": '<div class="mobileframe"></div><div class="tap"></div>',
    }.get(m, "")


def write() -> None:
    base = Path(__file__).parent
    for p in PAIRS:
        meta_joined = " / ".join(p["meta"])
        meta_lines = "<br>".join(p["meta"])
        before_items = "".join(f'<div class="card">{item}<span>{p["title"]}</span></div>' for item in p["items"])
        after_items = "".join(f"<span>{item}</span>" for item in p["items"])
        html = f'''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{p['id']}</title><style>{CSS}</style></head><body><main class="pair">
<section class="panel before"><div class="tag">Before / same content</div><div class="meta-before"><span>{p['meta'][0]}</span><span>{p['meta'][1]}</span><span>{p['meta'][2]}</span></div><div class="center"><h1>{p['title']}</h1><div class="rule"></div><p>{p['subtitle']}</p><span class="cta" style="background:#1c1917;color:#fafaf9">{p['cta']}</span></div><div class="cards">{before_items}</div></section>
<section class="panel after after-{p['motif']}"><div class="tag">After / same content</div>{motif_css(p['motif'])}<div class="meta">{meta_lines}</div><div class="word">{p['anchor']}</div><div class="title"><h2>{p['title']}</h2><p>{p['subtitle']}</p><span class="cta">{p['cta']}</span></div><div class="support">{after_items}</div></section>
</main></body></html>'''
        (base / f"{p['id']}.html").write_text(html)

    index = [
        '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Swiss poster before/after pairs</title><style>body{margin:0;background:#e7e5e4;font-family:Arial,sans-serif;color:#1c1917}h1{font-size:28px;margin:24px 24px 4px}p{margin:0 24px 20px;color:#78716c}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;padding:0 24px 24px}figure{margin:0;background:#fafaf9;border:1px solid #d6d3d1}img{display:block;width:100%;height:auto}figcaption{font-size:12px;color:#78716c;padding:10px 12px;font-weight:700}.capid{text-transform:uppercase;letter-spacing:.12em;color:#1c1917;display:block}.prompt{display:block;margin-top:4px;font-weight:500;line-height:1.35}@media(max-width:900px){.grid{grid-template-columns:1fr}}</style></head><body><h1>Swiss poster skill — 12 same-content before/after pairs</h1><p>Wide variety of prompts; each pair preserves the same title, subtitle, metadata, CTA, and supporting items. Only the design treatment changes.</p><div class="grid">'
    ]
    for p in PAIRS:
        index.append(f'<figure><a href="{p["id"]}.png"><img src="{p["id"]}.png" alt="{p["id"]}"></a><figcaption><span class="capid">{p["id"]}</span><span class="prompt">{p["prompt"]}</span></figcaption></figure>')
    index.append('</div></body></html>')
    (base / 'index.html').write_text('\n'.join(index))


if __name__ == "__main__":
    write()
