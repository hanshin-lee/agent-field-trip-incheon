# 메뉴 확장·재료 담기 검증

2026-09-12 KST. 리뷰 브랜치: `feat/menu-ingredient-animation-20260912`.
기반: `0a6f63b1f15bc2207b132ee47b01b902e86b6706` (이전 README·홍보 영상 보존); 확인한 최신 main은 `1e90c331d45ac747927a4fa075d4d3d31169b6eb`이며 기반 커밋의 조상입니다.

## 구현

- 기존 16개 ID를 보존하고 계란빵·야채튀김 / 라볶이·잔치국수 / 콩나물국·감자조림 / 홍합탕·새우부추전을 추가: **24개 메뉴, 4개 카테고리별 6개**.
- **18개 가게의 모든 필드 그대로 보존**. 새 메뉴 판매점은 미등록. 기존 등록 품목과 정확히 일치하는 재료 연결만 유지합니다. 215개 개별 분량 행 중 48개는 가게 미등록이며 물·소금 등 집에서 준비할 재료를 포함합니다.
- 기존 레시피의 누락된 밥·물·기름·양념 등 보완, 묶인 재료를 개별 분량으로 분리, 김밥 수율·골뱅이무침 당근·발효 시간·단계 사용량 정리. 잡채의 근거 없는 판매점 및 지원되지 않은 품목 연결 제거. 실제 점포 조리법·재고 검증을 주장하지 않습니다.
- `app/DishComposition.tsx`: 동일한 `menu.ingredients`에서 이름·분량을 렌더링. CSS 그릇 안으로 35ms 간격/620ms 유한 애니메이션. 메뉴 ID와 재생 키로 이전 DOM/애니메이션을 제거하므로 타이머·이전 메뉴 잔상이 없습니다. 전체 진입은 가장 긴 13개 재료에서도 약 1.04초입니다.
- 모션 감소: 재료 애니메이션과 지도 핀 pulse 제거; 지도 fit/pan도 비애니메이션. 동일한 텍스트 목록은 즉시 보입니다. 장식 아이콘은 보조기술에서 숨기고 상태 요약·버튼 선택 상태·키보드 포커스 제공.
- 모바일 메뉴 버튼은 줄바꿈해 6개 모두 찾을 수 있습니다. 기존 크림색 에디토리얼 스타일·지도·가게 상세·레시피·딥링크 유지.
- 지도 비동기 초기화 완료 후 최신 선택으로 marker를 그리도록 readiness 효과를 추가했습니다. 딥링크/초기 빠른 선택과 초기화 시점 경합을 방지합니다.
- `next.config.ts`: Next.js 16에서 제거된 `eslint` 속성만 삭제. 기존 `typescript.ignoreBuildErrors`를 유지하고 타입 검사는 별도 수행.
- 기존 `.gitignore`에 TypeScript 증분 캐시 패턴만 추가.
- 기존 Vercel 프로젝트 구성 파일이 없음을 확인 후, `vercel.json`에 **이 브랜치만** `git.deploymentEnabled: false` 규칙 추가. main/다른 브랜치 설정을 바꾸지 않고 요청하지 않은 자동 preview 배포를 방지합니다. [Vercel 공식 설정 문서](https://vercel.com/docs/project-configuration/git-configuration).

## 기존 솔루션 사전 확인

설치된 React 19·Tailwind/CSS와 Next.js 16의 로컬 CSS 문서를 확인했습니다. [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)의 네이티브 동작으로 충분하여 Framer Motion·Lottie 같은 추가 라이브러리나 유료 자산/서비스를 사용하지 않았습니다. 검증은 이미 설치된 Playwright 1.62.1/Chromium 및 ffmpeg를 사용합니다. package.json/lockfile 변경 없음.

## 검증 결과

- `npm run build`: 통과.
- `npx tsc --noEmit`: 통과. 빌드의 타입 스킵과 별개 검사.
- `node scripts/validate-market.cjs --self-test`: 통과. 24개 고유 메뉴·카테고리별 6개·18개 원본 가게 SHA-256 동일·215개 측정 분량·48개 미등록 재료. 참조·등록 품목 정확 일치·레시피 필드·좌표 범위·조회 함수 확인. 16개 불량 데이터 fixture를 모두 거부.
- `git diff --check`: 통과.
- 로컬 `/api/health` HTTP 200; 빈 prompt POST `/api/agent` HTTP 400 (`prompt is required`). 제공자 호출 없음.
- 실제 녹화 MP4: **12.766초, 600×1000, H.264, yuv420p, 30fps, 무음, fast-start**. ffmpeg 전체 디코드 오류 없음; 4초 진입 중 프레임·8초 콩나물국·11초 홍합탕 프레임을 직접 확인했습니다.
- UI 자동 검증은 [`evidence/menu-ui-verification.json`](../evidence/menu-ui-verification.json)에 실제 실행 결과를 저장합니다. 재현 스크립트: [`scripts/verify-menu-ui.cjs`](../scripts/verify-menu-ui.cjs).

**최종 브라우저 결과: 아래 모든 검사 통과, console error/pageerror 0개.** 화면 전환 시 OSM 타일 요청 19개가 `net::ERR_ABORTED`로 취소되었으며 다른 네트워크 실패는 없었습니다.

브라우저 검증 범위:

1. 데스크톱 Chromium 1440×1100: 쫄면 딥링크·실제 애니메이션 초기 opacity/animation 및 최종 opacity·다시 담기 확인.
2. 24개 모두 선택해 실제 데이터와 재료 이름/분량 DOM을 정확 비교, 레시피·카테고리·선택 버튼 상태·18개 지도 핀 확인.
3. 18회 연속 빠른 선택 후 현재 메뉴만 존재하는지 즉시/애니메이션 정착 후 확인.
4. 판매점 이름과 지도 핀으로 해당 가게 상세 열기, 잘못된 딥링크 안전 처리. 지도 pan 중 강제 클릭은 잘못된 위치를 누를 수 있어 테스트는 pan 정착 뒤 일반 포인터 클릭을 사용합니다.
5. 모바일 390×844에서 24개 모든 딥링크 확인. 320×740에서도 모든 메뉴·재료명/분량 가로 넘침 검사.
6. OS reduced-motion 에뮬레이션: 재료의 animationName=none, opacity=1, transform=none; 핀 pulse 없음; 키보드 Enter로 재생 버튼 활성화.
7. 콘솔 error/pageerror 수집. 화면 이동 시 취소된 OSM 타일 요청은 결과 JSON의 networkFailures로 별도 기록하며 앱 오류로 숨기지 않습니다. 지도 배경은 일반 브라우저 로드로만 사용; 타일 대량 다운로드 없음.

## 실행 방법

```bash
npm ci
node scripts/validate-market.cjs --self-test
npx tsc --noEmit
npm run build
npm run start -- --port 3021
```

별도 터미널 (Playwright를 이미 설치한 위치를 지정하거나 Node에서 resolve 가능하게 준비):

```bash
PLAYWRIGHT_MODULE=/absolute/path/to/playwright node scripts/verify-menu-ui.cjs
PLAYWRIGHT_MODULE=/absolute/path/to/playwright node scripts/record-menu-demo.cjs
```

`TEST_BASE_URL`로 로컬 서버 주소를 변경할 수 있습니다. 녹화 스크립트가 출력하는 WebM을 MP4로 변환:

```bash
ffmpeg -i /tmp/sinpo-menu-demo/OUTPUT.webm \
  -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart -an \
  evidence/recordings/menu-ingredient-demo.mp4
ffmpeg -v error -i evidence/recordings/menu-ingredient-demo.mp4 -f null -
```

## 증거 파일

- `evidence/screenshots/11-ingredient-desktop.png` — 전체 데스크톱 화면.
- `evidence/screenshots/12-ingredient-mobile.png` — 전체 모바일 김치찌개 화면.
- `evidence/screenshots/13-ingredient-bowl.png` — 실제 재료 그릇 확대.
- `evidence/screenshots/14-reduced-motion.png` — 애니메이션 없는 동일한 구성.
- `evidence/recordings/menu-ingredient-demo.mp4` — 실제 로컬 Chromium의 쫄면 재생 → 라볶이 → 콩나물국 재생 → 홍합탕 선택, 무음. 이전 홍보 MP4와 별개입니다.

## 한계

- 구조 검증은 재료-단계 의미의 완전성·음식 맛·조리 안전성·실제 재고/업체/좌표의 현장 검증이 아닙니다. 요리 단계는 검토했지만 실제 조리는 하지 않았습니다.
- Chromium 자동화 검증이며 Safari/Firefox·스크린리더 실사용·전체 WCAG 감사를 대신하지 않습니다.
- AI 유료 요청·키 설정·공개 서비스 변경·배포·main 병합·PR 공개 게시 없음. 리뷰 브랜치와 비교 링크만 제공합니다.
- 이전 `docs/VERIFICATION.md`의 16개 메뉴/타입 오류 기록은 당시 결과로 보존합니다. 이번 결과와 혼동하지 마세요.
