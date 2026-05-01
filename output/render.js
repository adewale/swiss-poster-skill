const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

// Weltformat F4 — 89.5 × 128 cm (1 : 1.4302). 1260 × 1800 px @ 2x DPR.
const POSTERS = [
  { html: 'poster.html',          png: 'breaking-the-35.png' },
  { html: 'fork-the-planet.html', png: 'fork-the-planet.png' },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1260, height: 1800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  for (const p of POSTERS) {
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
