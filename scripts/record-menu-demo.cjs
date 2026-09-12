/* Record a real local browser interaction, then encode the returned WebM with ffmpeg.
   PLAYWRIGHT_MODULE=/path/to/playwright node scripts/record-menu-demo.cjs
*/
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 600, height: 1000 }, deviceScaleFactor: 1, locale: 'ko-KR',
    recordVideo: { dir: '/tmp/sinpo-menu-demo', size: { width: 600, height: 1000 } },
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3021'}/?menu=jjolmyeon`);
  await page.waitForSelector('.leaflet-marker-icon');
  await page.evaluate(() => window.scrollTo(0, 220));
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: '쫄면 재료 다시 담기' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: '🍜 라볶이', exact: true }).click();
  await page.waitForTimeout(2200);
  await page.getByRole('button', { name: '집밥·국물', exact: true }).click();
  await page.getByRole('button', { name: '🥣 콩나물국', exact: true }).click();
  await page.waitForTimeout(2200);
  await page.getByRole('button', { name: '콩나물국 재료 다시 담기' }).click();
  await page.waitForTimeout(2200);
  await page.getByRole('button', { name: '해물·안주', exact: true }).click();
  await page.getByRole('button', { name: '🦪 홍합탕', exact: true }).click();
  await page.waitForTimeout(2200);
  const video = page.video();
  await context.close();
  console.log(JSON.stringify({ video: await video.path(), errors }, null, 2));
  await browser.close();
  if (errors.length) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
