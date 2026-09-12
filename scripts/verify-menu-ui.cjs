/* Run against `npm run start -- --port 3021`.
   Uses an existing Playwright installation, no application dependency changes.
   PLAYWRIGHT_MODULE=/absolute/path/to/playwright node scripts/verify-menu-ui.cjs
*/
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.TEST_BASE_URL || 'http://localhost:3021';
const root = path.resolve(__dirname, '..');
const dataModule = { exports: {} };
new Function('module', 'exports', ts.transpileModule(fs.readFileSync(path.join(root, 'lib/market.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText)(dataModule, dataModule.exports);
const { MENUS, CATEGORIES, STALLS } = dataModule.exports;
const evidence = path.join(root, 'evidence');
fs.mkdirSync(path.join(evidence, 'screenshots'), { recursive: true });
const errors = [];
const networkFailures = [];
const checks = [];
function watch(page) {
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('requestfailed', req => networkFailures.push({ url: req.url(), error: req.failure()?.errorText }));
}
async function assertDish(page, menu) {
  await page.waitForSelector(`[data-menu-id="${menu.id}"]`);
  const actual = await page.locator('.dish-ingredient').evaluateAll(nodes => nodes.map(n => ({
    name: n.querySelector('.dish-ingredient-name').textContent,
    amount: n.querySelector('.dish-ingredient-amount').textContent,
  })));
  assert.deepEqual(actual, menu.ingredients.map(i => ({ name: i.name, amount: i.amount })));
  assert.equal(await page.getByRole('button', { name: menu.category, exact: true }).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.getByRole('button', { name: `${menu.emoji} ${menu.name}`, exact: true }).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('.leaflet-marker-icon').count(), STALLS.length);
  assert.equal(await page.getByText('만드는 법', { exact: true }).count(), 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'horizontal overflow');
}
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 1100 }, locale: 'ko-KR' });
    const page = await desktop.newPage(); watch(page);
    await page.goto(`${baseURL}/?menu=jjolmyeon`);
    await page.waitForSelector('.leaflet-marker-icon');
    await assertDish(page, MENUS.find(m => m.id === 'jjolmyeon'));
    // Verify entrance frames, not merely a declared CSS animation.
    await page.getByRole('button', { name: '쫄면 재료 다시 담기' }).click();
    const entering = await page.locator('.dish-ingredient').first().evaluate(el => ({
      opacity: Number(getComputedStyle(el).opacity), transform: getComputedStyle(el).transform,
      animations: el.getAnimations().length,
    }));
    assert(entering.animations > 0 && entering.opacity < 1, 'ingredient should be entering');
    await page.waitForFunction(() => [...document.querySelectorAll('.dish-ingredient')].every(el => getComputedStyle(el).opacity === '1'));
    const settled = await page.locator('.dish-ingredient').first().evaluate(el => Number(getComputedStyle(el).opacity));
    assert.equal(settled, 1);
    await page.screenshot({ path: path.join(evidence, 'screenshots/11-ingredient-desktop.png'), fullPage: true });
    checks.push('desktop deep link, entrance/replay animation frames, quantities, map, recipe');
    for (const category of CATEGORIES) {
      await page.getByRole('button', { name: category, exact: true }).click();
      assert.equal(await page.locator('.dish-composition').count(), 0);
      for (const menu of MENUS.filter(m => m.category === category)) {
        await page.getByRole('button', { name: `${menu.emoji} ${menu.name}`, exact: true }).click();
        await assertDish(page, menu);
      }
    }
    checks.push(`all ${MENUS.length} dishes render exact ingredient names/quantities and preserve recipe/map`);
    // Rapid switching through native buttons while entrances are still in flight.
    await page.getByRole('button', { name: CATEGORIES[1], exact: true }).click();
    const fastMenus = MENUS.filter(m => m.category === CATEGORIES[1]);
    for (let i = 0; i < 18; i++) {
      const menu = fastMenus[i % fastMenus.length];
      await page.getByRole('button', { name: `${menu.emoji} ${menu.name}`, exact: true }).click();
    }
    await assertDish(page, fastMenus[17 % fastMenus.length]);
    assert.equal(await page.locator('.dish-composition').count(), 1);
    await page.waitForTimeout(1100);
    await assertDish(page, fastMenus[17 % fastMenus.length]);
    checks.push('18 rapid selections, no stale ingredients after settling');
    await page.getByRole('button', { name: '🍜 쫄면', exact: true }).click();
    await page.getByRole('button', { name: /청실홍실/ }).click();
    await page.getByRole('heading', { name: '청실홍실', exact: true }).waitFor();
    // Allow Leaflet's seller-selection pan to settle before a pointer target
    // is measured; never force a click through a moving map/tooltip overlay.
    await page.waitForTimeout(700);
    await page.locator('.leaflet-marker-icon').first().click();
    await page.getByRole('heading', { name: STALLS[0].name, exact: true }).waitFor();
    checks.push('seller buttons and map pin open matching stall details');
    await page.goto(`${baseURL}/?menu=not-a-menu`);
    await page.waitForSelector('.leaflet-marker-icon');
    assert.equal(await page.locator('.dish-composition').count(), 0);
    checks.push('unknown deep link safely shows unselected menu state');
    await desktop.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'ko-KR' });
    const mp = await mobile.newPage(); watch(mp);
    // Every menu deep link must initialize both the category and actual ingredients.
    for (const menu of MENUS) {
      await mp.goto(`${baseURL}/?menu=${menu.id}`);
      await mp.waitForSelector('.leaflet-marker-icon');
      await assertDish(mp, menu);
    }
    checks.push(`mobile: all ${MENUS.length} deep links, no page overflow`);
    const featured = MENUS.find(m => m.id === 'kimchijjigae');
    await mp.goto(`${baseURL}/?menu=${featured.id}`);
    await mp.waitForSelector('.dish-ingredient');
    await mp.waitForTimeout(1300);
    await mp.screenshot({ path: path.join(evidence, 'screenshots/12-ingredient-mobile.png'), fullPage: true });
    await mp.locator('.dish-composition').screenshot({ path: path.join(evidence, 'screenshots/13-ingredient-bowl.png') });
    await mp.setViewportSize({ width: 320, height: 740 });
    for (const category of CATEGORIES) {
      await mp.getByRole('button', { name: category, exact: true }).click();
      for (const menu of MENUS.filter(m => m.category === category)) {
        await mp.getByRole('button', { name: `${menu.emoji} ${menu.name}`, exact: true }).click();
        await assertDish(mp, menu);
        assert.equal(await mp.locator('.dish-ingredient-copy').evaluateAll(nodes => nodes.some(n => n.scrollWidth > n.clientWidth)), false, 'ingredient labels overflow at 320px');
      }
    }
    checks.push('320px narrow mobile: all ingredient labels/amounts fit');
    await mobile.close();

    const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', locale: 'ko-KR' });
    const rp = await reduced.newPage(); watch(rp);
    await rp.goto(`${baseURL}/?menu=jjolmyeon`);
    await rp.waitForSelector('.leaflet-marker-icon');
    await assertDish(rp, MENUS.find(m => m.id === 'jjolmyeon'));
    await rp.getByRole('button', { name: '쫄면 재료 다시 담기' }).click();
    const reducedStyles = await rp.locator('.dish-ingredient').evaluateAll(nodes => nodes.map(el => ({
      animation: getComputedStyle(el).animationName, opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform,
    })));
    assert(reducedStyles.every(s => s.animation === 'none' && s.opacity === '1' && s.transform === 'none'));
    assert.equal(await rp.locator('.dala-pin > div').first().evaluate(el => getComputedStyle(el).animationName), 'none');
    await rp.locator('.dish-composition').screenshot({ path: path.join(evidence, 'screenshots/14-reduced-motion.png') });
    // Keyboard focus and activation of replay remain available in static mode.
    await rp.getByRole('button', { name: '쫄면 재료 다시 담기' }).focus();
    await rp.keyboard.press('Enter');
    await assertDish(rp, MENUS.find(m => m.id === 'jjolmyeon'));
    checks.push('reduced motion: fully visible static ingredients, no pin pulse, keyboard replay');
    await reduced.close();
    assert.deepEqual(errors, [], 'browser console/page errors');
    const result = { date: new Date().toISOString(), menus: MENUS.length, stalls: STALLS.length, checks, errors, networkFailures };
    fs.writeFileSync(path.join(evidence, 'menu-ui-verification.json'), JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result, null, 2));
  } finally { await browser.close(); }
})().catch(err => { console.error(err); process.exitCode = 1; });
