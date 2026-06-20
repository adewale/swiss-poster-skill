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
  { html: 'flue-agent-components.html',           png: 'flue-agent-components.png' },
  { html: 'flue-abstractions-split.html',         png: 'flue-abstractions-split.png' },
  { html: 'flue-abstractions-callgraph.html',     png: 'flue-abstractions-callgraph.png' },
  { html: 'flue-loop-ring.html',                  png: 'flue-loop-ring.png' },
  { html: 'flue-duct.html',                       png: 'flue-duct.png' },
  { html: 'flue-glyph.html',                      png: 'flue-glyph.png' },
  { html: 'flue-sandbox-box.html',                png: 'flue-sandbox-box.png' },
  { html: 'flue-equation.html',                   png: 'flue-equation.png' },
  { html: 'flue-orb.html',                        png: 'flue-orb.png' },
  { html: 'flue-photo.html',                      png: 'flue-photo.png' },
  { html: 'flue-terminal.html',                   png: 'flue-terminal.png' },
  { html: 'flue-blueprint.html',                  png: 'flue-blueprint.png' },
  { html: 'flue-code.html',                       png: 'flue-code.png' },
  { html: 'flue-constructivist.html',             png: 'flue-constructivist.png' },
  { html: 'flue-specimen.html',                   png: 'flue-specimen.png' },
  { html: 'flue-object.html',                     png: 'flue-object.png' },
  { html: 'flue-travel.html',                     png: 'flue-travel.png' },
  { html: 'flue-basel.html',                      png: 'flue-basel.png' },
  { html: 'flue-newwave.html',                    png: 'flue-newwave.png' },
  { html: 'flue-editorial.html',                  png: 'flue-editorial.png' },
  { html: 'flue-ledger.html',                     png: 'flue-ledger.png' },
  { html: 'flue-deco.html',                       png: 'flue-deco.png' },
  { html: 'flue-riso.html',                       png: 'flue-riso.png' },
  { html: 'flue-manifesto.html',                  png: 'flue-manifesto.png' },
  { html: 'flue-orbit.html',                      png: 'flue-orbit.png' },
  { html: 'flue-hollick.html',                    png: 'flue-hollick.png' },
  { html: 'flue-spiral.html',                     png: 'flue-spiral.png' },
  { html: 'flue-hex.html',                        png: 'flue-hex.png' },
  { html: 'flue-rings.html',                      png: 'flue-rings.png' },
  { html: 'flue-tree.html',                       png: 'flue-tree.png' },
  { html: 'flue-constellation.html',              png: 'flue-constellation.png' },
  { html: 'flue-letter.html',                     png: 'flue-letter.png' },
  { html: 'flue-circuit.html',                    png: 'flue-circuit.png' },
  { html: 'flue-infinity.html',                   png: 'flue-infinity.png' },
  { html: 'flue-vs-sdk.html',                     png: 'flue-vs-sdk.png' },
  { html: 'flue-anywhere.html',                   png: 'flue-anywhere.png' },
  { html: 'flue-tiers.html',                      png: 'flue-tiers.png' },
  { html: 'flue-durable.html',                    png: 'flue-durable.png' },
  { html: 'flue-socket.html',                     png: 'flue-socket.png' },
  { html: 'flue-task.html',                       png: 'flue-task.png' },
  { html: 'flue-skills.html',                     png: 'flue-skills.png' },
  { html: 'flue-exploded.html',                   png: 'flue-exploded.png' },
  { html: 'flue-venn.html',                       png: 'flue-venn.png' },
  { html: 'flue-flow.html',                       png: 'flue-flow.png' },
  { html: 'flue-vs-think.html',                    png: 'flue-vs-think.png' },
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
