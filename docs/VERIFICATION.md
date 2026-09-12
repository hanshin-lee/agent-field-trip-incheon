# README / 홍보 영상 검증 기록

검증일: 2026-09-12 (KST). 기준 구현 커밋: `1e90c331d45ac747927a4fa075d4d3d31169b6eb`.
작업 브랜치: `docs/mock-readme-promo-20260912`. README·인수인계·검증·영상 자산만 변경하며 앱 동작이나 배포 설정을 수정하지 않습니다.

## 디자인 탐색

- 현재 추적 파일, 전체 원격 head 목록 (`git ls-remote --heads origin`), 최근 커밋, 전체 상태의 PR/이슈 목록을 확인했습니다.
- 확인 당시 원격 head는 `main` 하나, PR/이슈 결과는 비어 있었습니다.
- `HANDOFF.md`에는 refero.design 스타일 방향이 언급돼 있지만 특정 디자인 파일/노드 링크는 없습니다.
- 저장소 캡처 `07-cream-editorial.png`와 `08-recipe-kimchijjigae.png`, 최신 `app/page.tsx` / `app/globals.css`를 시각·구현 기준으로 사용했습니다.
- **별도 목업 원본은 발견되지 않았습니다.** 확인 질문: “별도 Figma/목업 파일을 의미했다면 접근 가능한 URL, 저장소 파일 경로 또는 브랜치를 알려주세요.” 응답 없이도 확인 가능한 최신 화면 기준 문서와 영상을 제공합니다. 별도 목업과의 일치 검증은 주장하지 않습니다.

## 완료한 검사

| 검사 | 결과 |
| --- | --- |
| `npm ci` | 성공; npm 감사 결과 0 vulnerabilities |
| `npm run build` | 성공; `/`, `/api/agent`, `/api/health` 출력 확인 |
| `npx tsc --noEmit` | **실패**: 기존 `next.config.ts:7` TS2353, `eslint` 속성이 NextConfig에 없음 |
| 데이터 구조 | 4개 카테고리, 16개 고유 메뉴 ID, 18개 고유 가게 ID; 모든 판매점/재료 참조가 존재; 모든 레시피에 단계·재료 분량 존재; 환산 좌표 유한값 |
| 로컬 `GET /api/health` | HTTP 200 |
| 로컬 빈 프롬프트 `POST /api/agent` | HTTP 400, `prompt is required`; 제공자 호출 없음 |
| 공개 홈 | HTTP 200 |
| 공개 `/api/health` | `ok: true`, `active: google`, `available: []` |
| 모바일 브라우저 | Chrome headless / Playwright, 430×932 viewport. 김치찌개 딥링크 → 레시피·3인분·18개 지도 핀 확인 |
| 메뉴 전환 / 가게 상세 | 분식 → 쫄면 선택 → 2인분 표시 → 청실홍실 버튼 → 가게 상세 제목 확인 |
| 화면 안정성 | 위 흐름에서 pageerror 없음; 가로 페이지 overflow 없음 |
| 공개 딥링크 | 공개 `/?menu=kimchijjigae`에서 “만드는 법” 표시 확인 |
| 외부 README 링크 | 공개 쫄면 링크, OSM 저작권, OSM 타일 정책 HTTP 200 확인 |

브라우저 캡처:

- [현재 김치찌개 화면](../evidence/screenshots/09-readme-verified-kimchi.png)
- [쫄면·가게 상세](../evidence/screenshots/10-readme-verified-stall.png)

지도 타일은 브라우저의 일반 화면 로드로만 사용했고 대량 다운로드하지 않았습니다. 영상은 이미 저장된 프로젝트 캡처를 재사용합니다.

## 재현

```bash
npm ci
npm run build
npx tsc --noEmit  # 현재는 위 TS2353 오류가 재현됨
npm run start -- --port 3017
```

다른 터미널 또는 브라우저에서:

```bash
curl -i http://localhost:3017/api/health
curl -i -X POST -H 'Content-Type: application/json' \
  -d '{"prompt":""}' http://localhost:3017/api/agent
```

1. `http://localhost:3017/?menu=kimchijjigae`에서 집밥·국물 카테고리, 김치찌개 레시피를 확인합니다.
2. 분식 → 쫄면을 누르고 지도 핀, 판매점·재료 카드, 레시피를 확인합니다.
3. 청실홍실 가게 이름을 누르고 상세가 표시되는지 확인합니다.
4. 개발자 도구에서 콘솔 오류와 가로 스크롤을 확인합니다.

## 한계 / 수행하지 않은 검사

- 타입 오류를 숨기거나 설정을 바꿔 통과시키지 않았습니다. `next lint` 스크립트도 Next.js 16에서 유효하지 않습니다.
- 실제 AI 응답, API 키 유효성, 모델 이용 가능성, 사용료·쿼터는 검사하지 않았습니다. 이 작업에서 유료 API 요청·서비스 구매·새 배포를 수행하지 않았습니다.
- 데이터 구조 검사와 지도 배경 표시는 점포 위치/실재/영업/재고의 현장 검증이 아닙니다. 레시피 식재료 완전성이나 요리 결과를 보증하지 않습니다.
- 단일 모바일 viewport smoke test이며 전체 브라우저·접근성 회귀 검사를 대신하지 않습니다.
- 영상 스펙·전체 디코드·프레임 검사와 재현 방법은 [PROMO.md](PROMO.md)에 기록합니다.
