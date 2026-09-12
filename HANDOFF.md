# HANDOFF — live relay state

**This file is the baton.** When your agent runs out of tokens, the next person
reads this file and keeps going without re-deriving anything.

---

## Now

- **Holder:** hanshin (driving via Hermes/Claude from Telegram)
- **Last updated:** 2026-09-12 — menu expansion/ingredient animation review (see `docs/MENU-ANIMATION-VERIFICATION.md`)
- **Provider in use:** `google`

## The mission

> 인천의 현장에서 발견한 장소 경험 하나를 Agent와 함께 작동하는 서비스로 만들어주세요.

## What we discovered in the field

신포국제시장은 초행자에게 미로다 — 메뉴 기준의 길안내가 전혀 없다.
"쫄면 먹고 싶다/만들고 싶다"에 대해 파는 집과 재료 가게를 지도에 동시에
짚어주는 서비스를 만들었다. 메모: `evidence/field-notes/sinpo-observation.md`

## What the Agent was delegated

- 시장 구조를 스키마틱 좌표(0–100×0–60)로 모델링하고 SVG 지도 컴포넌트 제작
- 메뉴 → 판매점 + 재료→가게 매핑 데이터 구축 (`lib/market.ts`)
- refero.design 스타일 방향(밝은 종이 배경, 카드, 단일 액센트)으로 UI 구현
- `/api/agent`로 상인 말투 장보기 코스 생성 (동선 x좌표 순 최적화 프롬프트)
- 빌드/스크린샷 검증, 배포

## Done

- [x] Repo scaffolded, deploys to Vercel, `/api/health` reports provider keys
- [x] `lib/market.ts` — 18 unchanged stalls, 24 menus in 4 categories (6 each), measured ingredient amounts and recipes
- [x] `app/MarketMap.tsx` — Leaflet + OpenStreetMap tiles, animated pins, dim/highlight; approximate schematic-to-lat/lng stall coordinates
- [x] `app/page.tsx` — menu chips, seller/ingredient cards, stall detail,
      Agent 장보기 코스 button, `?menu=<id>` deep link
- [x] `npm run build` green; screenshots in `evidence/screenshots/`

## In flight

- Follow-up implementation and verification complete; review-only branch `feat/menu-ingredient-animation-20260912`, based on `0a6f63b` (retains prior README/promo; latest fetched main is `1e90c33`). No merge, deployment or publication requested.
- Agent delegated: eight additional Korean recipes; recipe-driven ingredient-in-a-bowl CSS animation; reduced-motion and rapid-switch checks; README counts and browser evidence. No new runtime dependencies.
- `next.config.ts`: removed only obsolete Next.js 16 `eslint` option; separate type verification required. Prior field-day `ignoreBuildErrors` preserved.

- README/promo complete and verified on `docs/mock-readme-promo-20260912`, based on `1e90c33`; pending human review, no main merge.
- Video: `evidence/recordings/sinpo-market-promo.mp4` — 40s, 1280×720, 30fps, H.264/yuv420p, silent, fast-start; full decode and six sampled frames checked.
- Agent delegated: reconcile design captures with implementation, document limits, render Korean promotional MP4 from project screenshots, verify output. No main merge or release publication.
- Existing local `package.json` / `package-lock.json` edits remain untouched in the original worktree; this task uses a separate worktree.

## Next

- [ ] Drop a real field photo into `evidence/field-notes/`
- [ ] Optional: paste one real API key into Vercel env
      (`vercel env rm GOOGLE_GENERATIVE_AI_API_KEY production` → `vercel env add …` → redeploy)
      to activate the 장보기 코스 button. UI/map fully work without it.

## Decisions already made — do not re-litigate

- Next.js on Vercel; provider is a single env switch (`AGENT_PROVIDER`).
- Current map uses Leaflet + real OSM basemap tiles (supersedes the earlier SVG design); network is required for tiles. No offline map or user GPS navigation.
- Stall data is curated in `lib/market.ts`; positions are x=0(서문)→100(동문), linearly projected onto a market footprint, NOT surveyed GPS points. Verify stores, coordinates and inventory before relying on them.
- Visual reference: `07-cream-editorial.png` (style) and `08-recipe-kimchijjigae.png` (latest category/recipe UI). No separate mock source found in current tracked files, remote branch list, PRs or issues; do not invent one.

## Blockers

- Live check 2026-09-12: public home HTTP 200; `/api/health` reports `active: google`, `available: []`. This proves key presence is empty, not a provider connectivity test. No paid AI request performed. Demo: https://agent-field-trip-incheon.vercel.app
- Previous README-only branch had TS2353 at `next.config.ts:7`. Resolved on the menu-animation branch by removing the obsolete `eslint` property; separate `npx tsc --noEmit` now passes. Build still skips types under the preserved field-day setting.
- Real-time stock/prices/hours, exact routing, checkout and verified store coordinates are not implemented.

## Menu expansion verification (2026-09-12)

- Added 계란빵, 야채튀김, 라볶이, 잔치국수, 콩나물국, 감자조림, 홍합탕, 새우부추전. Existing menu IDs and all 18 stall records preserved; unsupported mappings removed rather than inventing inventory.
- Data validation: 24 dishes / 4 × 6 categories / 215 measured ingredient rows / 48 unmapped; 16 negative fixture tests. Build and separate types pass.
- Real browser demo: `evidence/recordings/menu-ingredient-demo.mp4`, 12.766s, 600×1000, H.264/yuv420p, 30fps; full decode and three frames checked.
- Chromium desktop 1440×1100, mobile 390×844 and narrow 320×740: all 24 menu selections/deep links, exact ingredient amounts, 18 rapid switches, reduced motion, replay, map pins and stall details passed; zero console/page errors. OSM navigation-aborted tile requests recorded separately.
- Current UI test report: `evidence/menu-ui-verification.json`; details/reproduction in `docs/MENU-ANIMATION-VERIFICATION.md`. Screenshots `11`–`14` supersede earlier captures for this review branch.
- Branch-specific `vercel.json` excludes only `feat/menu-ingredient-animation-20260912` from Git-triggered deployments. No main merge or deployment command.

## Previous README/video verification (2026-09-12, 16-menu baseline)

- `npm ci`: 0 reported vulnerabilities.
- Dataset check: 4 categories / 16 unique menu IDs / 18 unique stall IDs; all seller/ingredient references resolve, all recipes have steps and ingredient amounts, projected coordinates are finite. This is structural validation, not factual validation.
- Local API: health HTTP 200; empty prompt HTTP 400 with `prompt is required` (no provider call).
- Detailed evidence and video reproduction are recorded in `docs/VERIFICATION.md` and `docs/PROMO.md`.
