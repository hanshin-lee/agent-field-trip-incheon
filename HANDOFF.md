# HANDOFF — live relay state

**This file is the baton.** When your agent runs out of tokens, the next person
reads this file and keeps going without re-deriving anything.

---

## Now

- **Holder:** hanshin (driving via Hermes/Claude from Telegram)
- **Last updated:** 2026-09-12 14:20 KST — **제출본. 모든 브랜치 `main` 병합 완료.**
- **Provider in use:** `google`

## The mission

> 인천의 현장에서 발견한 장소 경험 하나를 Agent와 함께 작동하는 서비스로 만들어주세요.

## What we discovered in the field

**현장 사진(완주 요건 1):** `evidence/field-notes/1150-건어물전-파리퇴치기.jpg`
(11:50 KST, 동인천 건어물 노점) + 메모 `1150-건어물전-관찰메모.md`.
냉장 없는 야외 진열에서 회전식 자동 파리퇴치기로 신선도를 지키는 운영 노하우를 봤다.
→ "로컬 시장의 신선한 재료를 원하지만 무엇을 어디서 파는지 몰라 압도되는 방문객".

신포국제시장은 초행자에게 미로다 — 메뉴 기준의 길안내가 전혀 없다.
"쫄면 먹고 싶다/만들고 싶다"에 대해 파는 집과 재료 가게를 지도에 동시에
짚어주는 서비스를 만들었다. 메모: `evidence/field-notes/sinpo-observation.md`

## What the Agent was delegated

현장 관찰과 "무엇을 만들지"는 사람이 정하고, 아래 실행을 Agent에 위임했다.

**데이터 모델링**
- 시장 구조를 스키마틱 좌표(0–100×0–60)로 모델링 → 위·경도로 선형 환산
- 메뉴 → 판매점 + 재료→가게 매핑 데이터 구축 (`lib/market.ts`, 18개 가게)
- 메뉴 24개 / 4개 카테고리 × 6개 레시피 작성 (인분·시간·난이도·분량·순서)
- **근거 없는 매핑은 만들어내지 않고** "집에서 준비 · 연결된 가게 미등록"으로 분류

**UI 구현**
- SVG 약도 → **Leaflet + OSM 타일** 실지도로 전환, 핀/선택 강조/가게 상세
- 크림색 에디토리얼 디자인 방향으로 화면 구현
- 레시피 재료가 그릇에 담기는 CSS 애니메이션 (`app/DishComposition.tsx`),
  모션 감소 설정 대응, 빠른 메뉴 전환 처리 — 새 런타임 의존성 없이

**연동**
- `/api/agent` 상인 말투 장보기 코스 생성 (동선 x좌표 순 최적화 프롬프트)
- `AGENT_PROVIDER` 한 개로 google/openai/anthropic/runyour 전환

**검증·문서**
- 데이터 무결성 스크립트(`scripts/validate-market.cjs`) + 16개 네거티브 픽스처
- Chromium 데스크톱/모바일/협소 폭에서 24개 메뉴 전수 조작 검증, 콘솔 에러 0
- 조작 데모·홍보 MP4 렌더링, 스크린샷, README/HANDOFF 정리, 빌드·배포

**사람이 유지한 판단:** 무엇을 현장에서 볼지, 어떤 문제를 풀지, 무엇을
"검증되지 않음"으로 남길지. Agent가 가게·재고·GPS를 지어내지 않도록
한계를 문서에 명시하게 했다.

## Done

- [x] Repo scaffolded, deploys to Vercel, `/api/health` reports provider keys
- [x] `lib/market.ts` — 18 unchanged stalls, 24 menus in 4 categories (6 each), measured ingredient amounts and recipes
- [x] `app/MarketMap.tsx` — Leaflet + OpenStreetMap tiles, animated pins, dim/highlight; approximate schematic-to-lat/lng stall coordinates
- [x] `app/page.tsx` — menu chips, seller/ingredient cards, stall detail,
      Agent 장보기 코스 button, `?menu=<id>` deep link
- [x] `npm run build` green; screenshots in `evidence/screenshots/`

## In flight

- (none — 제출 완료 상태)

## Shipped to `main` (2026-09-12 14:20 KST)

- `0a6f63b` README 정리 + 한국어 홍보 영상 → `main` 병합
- `36589f4` 메뉴 8개 추가 + 재료 담기 애니메이션 → `main` 병합
- `8b76889` 건어물전 현장 사진·메모 (완주 요건 1) → `main` 병합
- 병합 후 검증: `npm ci` 0 vulnerabilities · `npm run build` green · `npx tsc --noEmit` clean ·
  `node scripts/validate-market.cjs` PASS (24 menus / 4×6 / 18 stalls) · 공개 홈 HTTP 200
- `vercel.json`은 `feat/menu-ingredient-animation-20260912` 브랜치만 Git 배포에서 제외한다.
  `main` 배포에는 영향이 없다.

## Next

- [x] ~~Drop a real field photo into `evidence/field-notes/`~~ — 완료 (건어물전 사진·메모)
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
