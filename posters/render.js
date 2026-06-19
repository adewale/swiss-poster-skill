const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

// Weltformat F4 — 89.5 × 128 cm (1 : 1.4302). 1260 × 1800 px @ 2x DPR.
const POSTERS = [
  { html: 'breaking-the-35.html',                 png: 'breaking-the-35.png' },
  { html: 'fork-the-planet.html',                 png: 'fork-the-planet.png' },
  { html: 'slop-to-hillclimbing.html',            png: 'slop-to-hillclimbing.png' },
  { html: 'credential-broker.html',               png: 'credential-broker.png' },
  { html: 'moq.html',                             png: 'moq.png' },
  { html: 'durable-objects.html',                 png: 'durable-objects.png' },
  { html: 'lean-into-your-weirdness.html',        png: 'lean-into-your-weirdness.png' },
  { html: 'ten-principles-for-bad-design.html',   png: 'ten-principles-for-bad-design.png' },
  { html: 'flue.html',                            png: 'flue.png' },
  { html: 'cynefin-map.html',                     png: 'cynefin-map.png' },
  { html: 'cynefin-word.html',                    png: 'cynefin-word.png' },
  { html: 'cynefin-fold.html',                    png: 'cynefin-fold.png' },
  { html: 'cynefin-rhythm.html',                  png: 'cynefin-rhythm.png' },
];

const ONLY = process.argv[2]; // optional: render a single html file by name

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1260, height: 1800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  for (const p of POSTERS) {
    if (ONLY && p.html !== ONLY) continue;
    const url = 'file://' + path.resolve(__dirname, p.html);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.resolve(__dirname, p.png),
      fullPage: false,
      omitBackground: false,
    });
    console.log('rendered:', p.png);
  }

  await browser.close();
})();
