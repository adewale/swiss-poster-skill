const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 2880, height: 1800 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const url = 'file://' + path.resolve(__dirname, 'wallpaper.html');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.resolve(__dirname, 'wallpaper.png'),
    fullPage: false,
    omitBackground: false,
  });
  console.log('rendered wallpaper.png');
  await browser.close();
})();
