#!/usr/bin/env node
'use strict';

// No new dependencies: Node built-ins plus the project's installed TypeScript compiler.
// Run from any directory: node scripts/validate-market.cjs [--self-test]
// Checks structure, declared-item equality, preserved stalls and coordinate bounds.
// Does NOT verify vendor existence/inventory, geographic accuracy, recipe authenticity,
// culinary balance, cooking safety, or complete ingredient/step semantic coverage.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const filename = path.resolve(__dirname, '../lib/market.ts');
const compilerOptions = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.CommonJS,
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  types: [],
};
const program = ts.createProgram([filename], compilerOptions);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (name) => name,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => '\n',
  }));
  process.exit(1);
}
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { ...compilerOptions, noEmit: false },
  fileName: filename,
}).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context, { filename, timeout: 1000 });
const data = context.exports;

const expectedCategories = ['시장 명물', '분식', '집밥·국물', '해물·안주'];
// Each category retains its first four original menus and gains two new menus.
const expectedGroups = [
  ['dakgangjeong', 'mandu', 'gonggalppang', 'hodduk', 'gyeranppang', 'yachaetwigim'],
  ['jjolmyeon', 'tteokbokki', 'gimbap', 'japchae', 'rabokki', 'janchiguksu'],
  ['kimchijjigae', 'doenjangjjigae', 'miyeokguk', 'tteokguk', 'kongnamulguk', 'gamjajorim'],
  ['haemulpajeon', 'godeungeo', 'ojingeobokkeum', 'golbaengi', 'honghaptang', 'saeubuchujeon'],
];
const originalStallsHash = '4752ce6944c9f3022d3deb0470a6edd33e5b2b189feeba083df474660d495c12';
const validZones = new Set(['본길-북', '본길-남', '사잇길', '동문쪽', '서문쪽']);
const isText = (value) => typeof value === 'string' && value.trim().length > 0;
const unique = (values, label) => assert.equal(new Set(values).size, values.length, `${label}: duplicates`);
const text = (value, label) => assert.ok(isText(value), `${label}: required text`);

function validate(dataset) {
  const { CATEGORIES, STALLS, MENUS, MARKET_CENTER, MARKET_DATA_DISCLAIMER, stallLatLng, stallById, menusByCategory } = dataset;
  assert.equal(JSON.stringify(CATEGORIES), JSON.stringify(expectedCategories), 'category definitions changed');
  text(MARKET_DATA_DISCLAIMER, 'disclaimer');
  assert.match(MARKET_DATA_DISCLAIMER, /예시.*미검증/, 'explicit illustrative/unverified disclaimer');
  assert.equal(STALLS.length, 18, '18 preserved stalls');
  unique(STALLS.map((s) => s.id), 'stall IDs');
  const stallMap = new Map(STALLS.map((s) => [s.id, s]));
  for (const stall of STALLS) {
    text(stall.id, 'stall ID');
    text(stall.name, `${stall.id} name`);
    assert.ok(['food', 'ingredient'].includes(stall.kind), `${stall.id} kind`);
    assert.ok(validZones.has(stall.zone), `${stall.id} zone`);
    assert.ok(Array.isArray(stall.items) && stall.items.length > 0, `${stall.id} items`);
    unique(stall.items, `${stall.id} items`);
    stall.items.forEach((item) => text(item, `${stall.id} item`));
    assert.ok(Number.isFinite(stall.x) && stall.x >= 0 && stall.x <= 100, `${stall.id} x bounds`);
    assert.ok(Number.isFinite(stall.y) && stall.y >= 0 && stall.y <= 60, `${stall.id} y bounds`);
    const point = stallLatLng(stall);
    assert.ok(Array.isArray(point) && point.length === 2, `${stall.id} coordinate tuple`);
    const [lat, lng] = point;
    assert.ok(Number.isFinite(lat) && lat >= 37.47085 && lat <= 37.47185, `${stall.id} projected latitude`);
    assert.ok(Number.isFinite(lng) && lng >= 126.6252 && lng <= 126.628, `${stall.id} projected longitude`);
  }
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(STALLS)).digest('hex'), originalStallsHash,
    'stall records must remain identical to the original 18');
  assert.ok(Array.isArray(MARKET_CENTER) && MARKET_CENTER.length === 2, 'market center tuple');
  assert.ok(Number.isFinite(MARKET_CENTER[0]) && MARKET_CENTER[0] >= 37.47085 && MARKET_CENTER[0] <= 37.47185, 'center latitude');
  assert.ok(Number.isFinite(MARKET_CENTER[1]) && MARKET_CENTER[1] >= 126.6252 && MARKET_CENTER[1] <= 126.628, 'center longitude');
  for (const [x, y, lat, lng] of [[0, 0, 37.47185, 126.6252], [100, 60, 37.47085, 126.628]]) {
    const projected = stallLatLng({ x, y });
    assert.ok(Math.abs(projected[0] - lat) < 1e-10 && Math.abs(projected[1] - lng) < 1e-10, 'projection endpoints');
  }

  assert.equal(MENUS.length, 24, '24 menus');
  unique(MENUS.map((m) => m.id), 'menu IDs');
  unique(MENUS.map((m) => m.name), 'menu names');
  const expectedIds = expectedGroups.flat();
  assert.equal(JSON.stringify(MENUS.map((m) => m.id).sort()), JSON.stringify([...expectedIds].sort()), 'exact retained + added IDs');
  for (let i = 0; i < expectedCategories.length; i++) {
    const actual = MENUS.filter((m) => m.category === expectedCategories[i]);
    assert.equal(actual.length, 6, `${expectedCategories[i]}: six menus`);
    assert.equal(JSON.stringify(actual.map((m) => m.id).sort()), JSON.stringify([...expectedGroups[i]].sort()), 'ID/category membership');
  }

  let ingredientCount = 0;
  let unmappedCount = 0;
  for (const menu of MENUS) {
    for (const key of ['id', 'name', 'emoji', 'desc', 'category']) text(menu[key], `${menu.id} ${key}`);
    assert.match(menu.id, /^[a-z][a-z0-9-]*$/, `${menu.id} ID syntax`);
    assert.ok(CATEGORIES.includes(menu.category), `${menu.id} category`);
    assert.ok(Array.isArray(menu.sellerIds), `${menu.id} sellerIds array`);
    unique(menu.sellerIds, `${menu.id} sellerIds`);
    for (const id of menu.sellerIds) {
      const seller = stallMap.get(id);
      assert.ok(seller && seller.kind === 'food', `${menu.id}: valid food seller ${id}`);
      assert.ok(seller.items.includes(menu.name), `${menu.id}: seller ${id} must explicitly list exact menu name`);
    }
    assert.ok(Array.isArray(menu.ingredients) && menu.ingredients.length > 0, `${menu.id} ingredients`);
    unique(menu.ingredients.map((i) => i.name), `${menu.id} ingredient names`);
    for (const ingredient of menu.ingredients) {
      ingredientCount++;
      text(ingredient.name, `${menu.id} ingredient name`);
      text(ingredient.amount, `${menu.id}/${ingredient.name} amount`);
      // Require a positive numeral/fraction and a declared unit, not vague '약간'.
      // This is a format check, not a unit conversion or amount/step equivalence proof.
      assert.match(ingredient.amount, /(?:[1-9][0-9]*(?:\.[0-9]+)?|0\.[0-9]*[1-9][0-9]*|[¼½¾⅓⅔⅛])\s*(?:kg|g|ml|L|큰술|작은술|개|대|장|쪽|줄|캔)/u,
        `${menu.id}/${ingredient.name}: positive measured quantity`);
      assert.ok(Array.isArray(ingredient.stallIds), `${menu.id}/${ingredient.name} stallIds array`);
      unique(ingredient.stallIds, `${menu.id}/${ingredient.name} stallIds`);
      if (!ingredient.stallIds.length) unmappedCount++;
      for (const id of ingredient.stallIds) {
        const stall = stallMap.get(id);
        assert.ok(stall, `${menu.id}/${ingredient.name}: missing stall ${id}`);
        assert.ok(stall.items.includes(ingredient.name), `${menu.id}/${ingredient.name}: unsupported declared item at ${id}`);
      }
    }
    const recipe = menu.recipe;
    assert.ok(recipe && typeof recipe === 'object', `${menu.id} recipe`);
    assert.ok(Number.isInteger(recipe.servings) && recipe.servings > 0, `${menu.id} servings`);
    assert.ok(Number.isInteger(recipe.timeMin) && recipe.timeMin > 0, `${menu.id} timeMin`);
    assert.ok(['쉬움', '보통', '어려움'].includes(recipe.difficulty), `${menu.id} difficulty`);
    assert.ok(Array.isArray(recipe.steps) && recipe.steps.length >= 3, `${menu.id} steps`);
    recipe.steps.forEach((step) => text(step, `${menu.id} step`));
    text(recipe.tip, `${menu.id} tip`);
  }
  // Test exported lookup helpers on the loaded source dataset (not cloned fixtures).
  if (dataset === data) {
    for (const stall of STALLS) assert.equal(stallById(stall.id), stall, 'stall lookup');
    assert.equal(stallById('__unknown__'), undefined, 'unknown stall lookup');
    for (const category of CATEGORIES) assert.equal(menusByCategory(category).length, 6, 'category lookup');
    assert.equal(menusByCategory('__unknown__').length, 0, 'unknown category lookup');
  }
  return { ingredientCount, unmappedCount };
}

try {
  assert.ok(process.argv.slice(2).every((arg) => arg === '--self-test'), 'Usage: validate-market.cjs [--self-test]');
  const stats = validate(data);
  console.log(`PASS: 24 unique menus / 4 categories × 6 / 18 unchanged stalls / ${stats.ingredientCount} measured ingredient rows (${stats.unmappedCount} unmapped).`);
  console.log('PASS: market.ts isolated TypeScript check, required recipe fields, exact declared-item mappings, references, lookups, schematic/projected coordinate bounds.');
  if (process.argv.includes('--self-test')) {
    const mutations = [
      ['duplicate ID', (d) => { d.MENUS[1].id = d.MENUS[0].id; }],
      ['wrong category', (d) => { d.MENUS[0].category = '분식'; }],
      ['missing amount', (d) => { d.MENUS[0].ingredients[0].amount = ''; }],
      ['vague amount', (d) => { d.MENUS[0].ingredients[0].amount = '약간'; }],
      ['empty steps', (d) => { d.MENUS[0].recipe.steps = []; }],
      ['missing tip', (d) => { delete d.MENUS[0].recipe.tip; }],
      ['bad servings', (d) => { d.MENUS[0].recipe.servings = 0; }],
      ['bad time', (d) => { d.MENUS[0].recipe.timeMin = -1; }],
      ['bad difficulty', (d) => { d.MENUS[0].recipe.difficulty = 'unknown'; }],
      ['dangling reference', (d) => { d.MENUS[0].ingredients[0].stallIds = ['missing']; }],
      ['unsupported item', (d) => { d.MENUS[0].ingredients[0].stallIds = ['s-dried']; }],
      ['unsupported seller', (d) => { d.MENUS[4].sellerIds = ['s-hodduk']; }],
      ['bad coordinates', (d) => { d.STALLS[0].x = 101; }],
      ['non-finite projection', (d) => { d.stallLatLng = () => [NaN, 126.626]; }],
      ['changed inventory', (d) => { d.STALLS[0].items.push('추가 품목'); }],
      ['missing disclaimer', (d) => { d.MARKET_DATA_DISCLAIMER = ''; }],
    ];
    for (const [label, mutate] of mutations) {
      const fixture = { ...data, ...JSON.parse(JSON.stringify(data)) };
      mutate(fixture);
      assert.throws(() => validate(fixture), undefined, `self-test should reject ${label}`);
    }
    console.log(`PASS: ${mutations.length} negative-fixture self-tests rejected invalid data.`);
  }
  console.log('LIMIT: structural/internal consistency only; no vendor, inventory, GPS, recipe authenticity, safety or full ingredient/step semantic verification.');
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
}
