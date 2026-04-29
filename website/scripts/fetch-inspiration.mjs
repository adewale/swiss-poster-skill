#!/usr/bin/env node
// Fetch Swiss design inspiration images via SerpAPI Google Images
// Usage: SERP_API_KEY=xxx node fetch-inspiration.mjs

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { createWriteStream } from 'fs'

const API_KEY = process.env.SERP_API_KEY
if (!API_KEY) { console.error('SERP_API_KEY not set'); process.exit(1) }

const OUT_DIR = path.resolve('/Users/z/Desktop/design-system/website/public/inspiration')
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json')

// Known designer lookup by keyword matching in title/source
const DESIGNER_LOOKUP = [
  { keywords: ['müller-brockmann', 'muller-brockmann', 'brockmann'],
    designer: 'Josef Müller-Brockmann',
    designer_url: 'https://en.wikipedia.org/wiki/Josef_M%C3%BCller-Brockmann' },
  { keywords: ['emil ruder', 'ruder'],
    designer: 'Emil Ruder',
    designer_url: 'https://en.wikipedia.org/wiki/Emil_Ruder' },
  { keywords: ['armin hofmann', 'hofmann'],
    designer: 'Armin Hofmann',
    designer_url: 'https://en.wikipedia.org/wiki/Armin_Hofmann' },
  { keywords: ['adrian frutiger', 'frutiger', 'univers'],
    designer: 'Adrian Frutiger',
    designer_url: 'https://en.wikipedia.org/wiki/Adrian_Frutiger' },
  { keywords: ['max miedinger', 'miedinger', 'helvetica'],
    designer: 'Max Miedinger',
    designer_url: 'https://en.wikipedia.org/wiki/Max_Miedinger' },
  { keywords: ['richard paul lohse', 'lohse'],
    designer: 'Richard Paul Lohse',
    designer_url: 'https://en.wikipedia.org/wiki/Richard_Paul_Lohse' },
  { keywords: ['carlo vivarelli', 'vivarelli'],
    designer: 'Carlo Vivarelli',
    designer_url: 'https://en.wikipedia.org/wiki/Carlo_Vivarelli' },
  { keywords: ['hans neuburg', 'neuburg'],
    designer: 'Hans Neuburg',
    designer_url: 'https://en.wikipedia.org/wiki/Hans_Neuburg' },
  { keywords: ['max bill'],
    designer: 'Max Bill',
    designer_url: 'https://en.wikipedia.org/wiki/Max_Bill' },
  { keywords: ['herbert matter', 'matter'],
    designer: 'Herbert Matter',
    designer_url: 'https://en.wikipedia.org/wiki/Herbert_Matter' },
  { keywords: ['neue grafik'],
    designer: 'Lohse, Müller-Brockmann, Neuburg, Vivarelli',
    designer_url: 'https://en.wikipedia.org/wiki/Neue_Grafik' },
  { keywords: ['akzidenz', 'berthold'],
    designer: 'H. Berthold AG',
    designer_url: 'https://en.wikipedia.org/wiki/Akzidenz-Grotesk' },
]

const QUERIES = [
  { q: 'Josef Müller-Brockmann poster graphic design', category: 'Posters' },
  { q: 'Emil Ruder typography Basel design', category: 'Typography' },
  { q: 'Armin Hofmann graphic design poster', category: 'Posters' },
  { q: 'Swiss International Style 1950s 1960s poster', category: 'Posters' },
  { q: 'Neue Grafik journal Swiss graphic design', category: 'Publications' },
  { q: 'Swiss modernist grid typography layout design', category: 'Grid' },
  { q: 'International Typographic Style poster print', category: 'Posters' },
  { q: 'Akzidenz-Grotesk Helvetica grotesque type specimen', category: 'Typography' },
]

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

function guessDesigner(title, source, query) {
  const haystack = `${title} ${source} ${query}`.toLowerCase()
  for (const entry of DESIGNER_LOOKUP) {
    if (entry.keywords.some(k => haystack.includes(k))) {
      return { designer: entry.designer, designer_url: entry.designer_url }
    }
  }
  return { designer: null, designer_url: null }
}

async function serpSearch(query) {
  const url = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&api_key=${API_KEY}&ijn=0&tbs=itp:photo`
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = ''
      res.on('data', d => data += d)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch(e) { reject(e) }
      })
    }).on('error', reject)
  })
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http
    const file = createWriteStream(dest)
    const req = proto.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        fs.unlinkSync(dest)
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      res.pipe(file)
      file.on('finish', () => file.close(resolve))
    })
    req.on('error', e => { file.close(); try { fs.unlinkSync(dest) } catch(_){} reject(e) })
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')) })
  })
}

async function main() {
  const manifest = []
  let total = 0
  const PER_QUERY = 8

  for (const { q, category } of QUERIES) {
    console.log(`\nSearching: "${q}"`)
    let results
    try {
      const data = await serpSearch(q)
      results = (data.images_results || []).filter(r =>
        r.original &&
        !r.is_product &&
        (r.original_width || 0) >= 400 &&
        (r.original_height || 0) >= 400
      ).slice(0, PER_QUERY)
    } catch(e) {
      console.error(`  Search failed: ${e.message}`)
      continue
    }

    console.log(`  Found ${results.length} usable results`)

    for (const r of results) {
      const { designer, designer_url } = guessDesigner(r.title || '', r.source || '', q)
      const slug = slugify(`${designer || category} ${r.title || ''}`.slice(0, 50))
      const id = `${slug}-${total + 1}`
      const ext = r.original.includes('.png') ? 'png' : 'jpg'
      const filename = `${id}.${ext}`
      const dest = path.join(OUT_DIR, filename)

      process.stdout.write(`  [${total + 1}] Downloading: ${filename.slice(0, 50)}... `)
      try {
        await downloadImage(r.original, dest)
        const stat = fs.statSync(dest)
        if (stat.size < 5000) {
          fs.unlinkSync(dest)
          console.log('too small, skipped')
          continue
        }
        console.log(`ok (${Math.round(stat.size / 1024)}kb)`)
        manifest.push({
          id,
          filename,
          title: r.title || '',
          designer: designer,
          designer_url: designer_url,
          year: null,
          category,
          source: r.source || '',
          source_url: r.link || '',
          query: q,
          original_url: r.original,
          width: r.original_width,
          height: r.original_height,
        })
        total++
      } catch(e) {
        console.log(`failed: ${e.message}`)
      }
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
  console.log(`\n✓ Downloaded ${total} images`)
  console.log(`✓ Manifest written to ${MANIFEST_PATH}`)
}

main().catch(console.error)
