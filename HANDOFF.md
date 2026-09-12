# HANDOFF — live relay state

**This file is the baton.** When your agent runs out of tokens, the next person
reads this file and keeps going without re-deriving anything.

---

## Now

- **Holder:** hanshin (driving via Hermes/Claude from Telegram)
- **Last updated:** 2026-09-12 12:40 KST
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
- [x] `lib/market.ts` — 18 stalls, 5 menus (닭강정·쫄면·만두·떡볶이·공갈빵)
- [x] `app/MarketMap.tsx` — SVG schematic map, animated pins, dim/highlight
- [x] `app/page.tsx` — menu chips, seller/ingredient cards, stall detail,
      Agent 장보기 코스 button, `?menu=<id>` deep link
- [x] `npm run build` green; screenshots in `evidence/screenshots/`

## In flight

- [ ] Vercel deploy + env keys (AGENT_PROVIDER + one API key needed in Vercel
      for the 코스 button to answer; UI works without it, error surfaces cleanly)

## Next

- [ ] Drop a real field photo into `evidence/field-notes/`
- [ ] Screen recording of the flow for submission backup

## Decisions already made — do not re-litigate

- Next.js on Vercel; provider is a single env switch (`AGENT_PROVIDER`).
- Map is a schematic SVG, NOT GPS/real map tiles — wayfinding inside the maze
  is relative, and this works offline on flaky market wifi.
- Stall data is curated in `lib/market.ts`; edit there, positions are x=0(서문)→100(동문).

## Blockers

- No API key in local `.env.local` (expected — event tokens go in Vercel env).
