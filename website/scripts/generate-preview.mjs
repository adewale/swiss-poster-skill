#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const MANIFEST_PATH = '/Users/z/Desktop/design-system/website/public/inspiration/manifest.json'
const OUT_PATH = '/Users/z/Desktop/design-system/website/public/inspiration/preview.html'
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))

// Check which files actually exist on disk
const existingManifest = manifest.filter(item => {
  const fp = path.join('/Users/z/Desktop/design-system/website/public/inspiration', item.filename)
  return fs.existsSync(fp)
})

const items = existingManifest.map((item, i) => `
  <div class="card" id="card-${i + 1}">
    <div class="num">${i + 1}</div>
    <img src="${item.filename}" alt="${item.title}" loading="lazy" onerror="this.parentElement.classList.add('broken')">
    <div class="caption">
      <div class="title">${item.title || '—'}</div>
      <div class="designer">${item.designer || 'Designer unknown'}</div>
      <div class="meta">${item.category} · ${item.source || ''}</div>
    </div>
  </div>`).join('\n')

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Swiss Inspiration Preview — ${existingManifest.length} images</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'IBM Plex Sans', system-ui, sans-serif; background: #fafaf9; color: #1c1917; padding: 24px; }
  h1 { font-size: 2rem; font-weight: 400; margin-bottom: 8px; }
  p { font-size: 0.875rem; color: #78716c; margin-bottom: 24px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .card { background: white; border: 1px solid #e7e5e4; position: relative; cursor: pointer; transition: outline 0.1s; }
  .card.selected { outline: 3px solid #C8102E; }
  .card.broken { opacity: 0.3; }
  .card img { width: 100%; display: block; max-height: 420px; object-fit: cover; }
  .num { position: absolute; top: 8px; left: 8px; background: #C8102E; color: white; font-size: 11px; font-family: monospace; font-weight: bold; padding: 2px 6px; line-height: 1.4; z-index: 1; }
  .caption { padding: 10px 12px 12px; border-top: 1px solid #e7e5e4; }
  .title { font-size: 0.8rem; font-weight: 500; line-height: 1.3; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .designer { font-size: 0.75rem; color: #C8102E; margin-bottom: 2px; }
  .meta { font-size: 0.7rem; color: #a8a29e; font-family: monospace; }
  .section-break { grid-column: 1/-1; border-top: 2px solid #C8102E; padding-top: 8px; font-size: 0.7rem; font-family: monospace; color: #C8102E; text-transform: uppercase; letter-spacing: 0.1em; }
  .toolbar { position: fixed; bottom: 0; left: 0; right: 0; background: #1c1917; color: #fafaf9; padding: 12px 24px; display: flex; align-items: center; gap: 16px; font-family: monospace; font-size: 0.8rem; z-index: 100; }
  .toolbar span { color: #a8a29e; }
  #selected-list { color: #C8102E; font-weight: bold; flex: 1; }
  button { background: #C8102E; color: white; border: none; padding: 6px 14px; cursor: pointer; font-family: monospace; font-size: 0.8rem; }
</style>
</head>
<body>
<h1>Swiss Inspiration — ${existingManifest.length} specimens</h1>
<p>Numbers 1–17 are your previous picks. New batch starts at 18. Click to select, then tell me which to keep.</p>
<div class="grid">
  <div class="section-break">Previously selected (1–17)</div>
  ${existingManifest.slice(0, 17).map((item, i) => `
  <div class="card selected" id="card-${i + 1}">
    <div class="num">${i + 1}</div>
    <img src="${item.filename}" alt="${item.title}" loading="lazy" onerror="this.parentElement.classList.add('broken')">
    <div class="caption">
      <div class="title">${item.title || '—'}</div>
      <div class="designer">${item.designer || 'Designer unknown'}</div>
      <div class="meta">${item.category} · ${item.source || ''}</div>
    </div>
  </div>`).join('\n')}
  <div class="section-break">New batch (18–${existingManifest.length})</div>
  ${existingManifest.slice(17).map((item, i) => `
  <div class="card" id="card-${i + 18}">
    <div class="num">${i + 18}</div>
    <img src="${item.filename}" alt="${item.title}" loading="lazy" onerror="this.parentElement.classList.add('broken')">
    <div class="caption">
      <div class="title">${item.title || '—'}</div>
      <div class="designer">${item.designer || 'Designer unknown'}</div>
      <div class="meta">${item.category} · ${item.source || ''}</div>
    </div>
  </div>`).join('\n')}
</div>
<div style="height:60px"></div>
<div class="toolbar">
  <span>Selected:</span>
  <div id="selected-list">1–17 + ...</div>
  <button onclick="copySelected()">Copy list</button>
</div>
<script>
  // Pre-select 1-17
  const selected = new Set([${Array.from({length:17},(_,i)=>i+1).join(',')}])
  document.querySelectorAll('.card').forEach((card, i) => {
    const n = i + 1
    card.addEventListener('click', () => {
      if (selected.has(n)) { selected.delete(n); card.classList.remove('selected') }
      else { selected.add(n); card.classList.add('selected') }
      updateList()
    })
  })
  function updateList() {
    const sorted = [...selected].sort((a,b) => a-b)
    document.getElementById('selected-list').textContent = sorted.length ? sorted.join(', ') : 'none'
  }
  function copySelected() {
    const sorted = [...selected].sort((a,b) => a-b).join(', ')
    navigator.clipboard.writeText(sorted).then(() => alert('Copied: ' + sorted))
  }
  updateList()
</script>
</body>
</html>`

fs.writeFileSync(OUT_PATH, html)
console.log(`Preview written: ${OUT_PATH} — ${existingManifest.length} images`)
