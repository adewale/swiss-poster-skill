const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 1800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  const url = 'file://' + path.resolve(__dirname, 'poster.html');
  await page.goto(url, { waitUntil: 'networkidle' });
  // Give web fonts a moment to settle
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.resolve(__dirname, 'breaking-the-35.png'),
    fullPage: false,
    omitBackground: false,
  });
  await browser.close();
  console.log('rendered: breaking-the-35.png');
})();
