# 신포 장보기 지도 — 40초 홍보 영상

**완료:** [MP4](../evidence/recordings/sinpo-market-promo.mp4) · [실제 디코드 프레임 모음](../evidence/screenshots/promo-decoded-contact-sheet.jpg) · [스토리보드](../evidence/screenshots/promo-storyboard.jpg)

한국어 자막 중심의 **40초 / 1280×720 / 30fps / H.264 / yuv420p / 무음** 영상입니다. 실제 프로젝트 캡처를 크롭·확대·이동하고 장면 사이를 0.45초 디졸브로 연결했습니다. 1,200프레임, 오디오 스트림 없음, 파일 크기 4,300,993 bytes. MP4의 `moov`가 `mdat` 앞에 있어 fast-start 재생이 가능합니다.

영상에서 사용하는 “신포시장 한 끼”는 편집용 카피이며 별도 출시 제품을 의미하지 않습니다. 연속 화면 조작 녹화나 현장 촬영이 아니라 기존 구현 화면을 편집한 프로토타입 소개 영상입니다.

## 스토리보드 / 실제 자막 대본

| 구간 | 화면 | 주요 한국어 자막 |
| --- | --- | --- |
| 0–6초 | `07` 캡처와 크림색 도입 | 오늘 뭐 먹지? / 신포시장에서 답을 찾다. / 먹고 싶은 메뉴에서 시작하는 시장 한 끼, 그리고 장보기. |
| 6–12초 | `08`의 카테고리·메뉴 영역 | 취향은 다양하게. 선택은 간단하게. / 4 카테고리 · 16 메뉴 · 18 큐레이션 가게 |
| 12–20초 | `07`의 실제 쫄면 지도 크롭 | 사 먹을까, 만들어 먹을까? / 파랑: 메뉴를 파는 집 / 주황: 필요한 재료 가게 |
| 20–27초 | `08` 김치찌개 재료 목록 | 오늘의 집밥, 김치찌개. / 3인분 · 약 40분 · 난이도 쉬움 / 묵은지 ½포기 · 돼지목살 300g / 두부 1모, 그리고 연결된 재료 가게. |
| 27–34초 | `08` 만드는 법 크롭 | 장보기 다음은 따뜻한 한 끼. / 재료의 양부터 조리 단계까지, 레시피를 따라 차근차근. |
| 34–40초 | 크림색 엔드 카드 | 오늘의 한 끼로, 시장을 새롭게 만나다. / 먹고 싶은 메뉴를 골라보세요. |

전 장면에서 다음 고지를 화면 하단에 유지하며 전환 중에도 불투명하게 표시합니다.

> 프로토타입 · 가게 위치·판매 품목 현장 확인 필요
>
> 지도 © OpenStreetMap contributors · openstreetmap.org/copyright

지도 강조 장면에는 “위치는 도식 좌표를 위경도로 환산한 근사치”, “검증된 GPS · 실시간 재고 · 내비게이션 아님”을 추가했습니다. AI 응답 성공·실시간 재고·정확한 GPS·최단 경로는 연출하거나 주장하지 않습니다.

## 실제 구현과의 대조

- `lib/market.ts`: 4개 카테고리, 16개 메뉴, 18개 가게 항목. **18은 시장 전체 점포 수나 현장 검증 완료 점포 수가 아닙니다.**
- 김치찌개: 3인분 / 40분 / 쉬움, 묵은지 ½포기 / 돼지목살 300g / 두부 1모. `sellerIds: []`이므로 김치찌개 완제품 판매점을 확인했다고 표현하지 않습니다. 파란 판매점 장면은 쫄면 화면입니다.
- 김치찌개 조리 단계는 원본 캡처 그대로입니다. 재료·조리 데이터의 완전성이나 조리 결과를 보증하지 않습니다.
- `stallLatLng()`는 약도 좌표를 위·경도로 선형 환산하므로 핀은 근사 위치입니다.
- `app/MarketMap.tsx`와 `07` 캡처에서 파랑 판매점·주황 재료 가게를 확인했습니다.
- 최신 레시피 화면은 `08`이며 별도 Figma/목업 원본은 발견되지 않았습니다. 별도 원본과의 일치 검증은 하지 않았습니다.

## 기존 무료 도구 사전 확인

새 서비스나 무거운 영상 앱을 도입하기 전에 설치된 도구를 확인했습니다. 이 작업에는 기존 **FFmpeg + Pillow**가 충분하므로 로컬 렌더링을 선택했습니다. Remotion 등 별도 웹 영상 프레임워크나 유료 API는 필요하지 않았습니다.

- `/opt/homebrew/bin/ffmpeg`, `/opt/homebrew/bin/ffprobe`: 9.0.1
- `python3` + Pillow 12.3.0
- 로컬 한글 글꼴: `/System/Library/Fonts/AppleSDGothicNeo.ttc`
- 새 유료 서비스, 음악, 스톡 사진·영상, 외부 생성 서비스를 사용하지 않았습니다.

## 자산 출처 / 권리

사용자가 이번 작업에서 프로젝트 자산 사용을 승인했습니다. 외부 입력 이미지는 아래 두 개뿐입니다. 크림 배경·자막·추상 도형은 렌더러에서 작성합니다.

| 자산 | 용도 | SHA-256 |
| --- | --- | --- |
| `evidence/screenshots/07-cream-editorial.png` | 도입과 쫄면 지도 | `86368baa6d75493b9e92234a0031db7ab8ccaefa9503c41270ac873ffc7be5b0` |
| `evidence/screenshots/08-recipe-kimchijjigae.png` | 카테고리, 재료, 만드는 법 | `d8e6910c80910d81b5a95f3867f283bd9c9cc6016fcaa5d433c1320e047f1f55` |

캡처 속 지도는 © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)이며 영상에서도 읽을 수 있는 출처를 별도 표시합니다. 저장소에 LICENSE 파일이 없으므로 저장소 전체나 제3자 콘텐츠에 포괄적인 자유 재배포 라이선스를 주장하지 않습니다. Apple 글꼴은 설치된 시스템에서 렌더에만 사용하며 **글꼴 파일 자체를 재배포하지 않습니다.**

## 재현

저장소 루트에서 실행합니다. 아래 스크립트는 실제 실행됐습니다.

```bash
# 장면 PNG와 스토리보드만 생성 (영상 생성 아님)
python3 scripts/promo-render.py --preview

# 40초 MP4와 렌더 manifest 생성
python3 scripts/promo-render.py
```

필수 조건: Python 3, Pillow, libx264를 포함한 FFmpeg, 적법하게 사용할 수 있는 한글 글꼴. 스크립트의 `FFMPEG`와 `FONT` 상수는 위 macOS 설치 경로이며 다른 OS에서는 로컬 경로와 글꼴의 face index를 맞춰야 합니다. `--preview`로 한글과 줄바꿈을 먼저 확인하세요. 글꼴·인코더 버전이 바뀌면 출력 해시는 달라질 수 있습니다.

생성 경로:

```text
scripts/promo-render.py
evidence/recordings/sinpo-market-promo.mp4
evidence/recordings/promo-render-manifest.json
evidence/screenshots/promo-scene-01.png … promo-scene-06.png
evidence/screenshots/promo-storyboard.jpg
```

스크립트는 네트워크에 접근하지 않으며 재실행 시 위 출력 파일을 덮어씁니다. 렌더에는 기존 PNG만 필요하고 실행 중인 앱이나 API 키는 필요하지 않습니다.

## 검증 결과 — 2026-09-12

- **ffprobe 통과:** H.264 / yuv420p / 1280×720 / 30fps / 40.000000초 / 1,200프레임 / 오디오 0개.
- **전체 디코딩 통과:** FFmpeg 오류 없이 exit 0. 부모 작업에서도 독립적으로 전 구간 디코딩을 다시 확인했습니다.
- **실제 브라우저 재생 통과:** Chrome의 로컬 MP4 재생에서 duration 40, videoWidth 1280, videoHeight 720, currentTime 1.22초로 진행, paused false, error null을 확인했습니다.
- **fast-start 확인:** `ftyp` offset 0, `moov` offset 32, `mdat` offset 10562.
- **디코드 샘플 확인:** 프레임 84, 264, 474, 705, 909, 1125 (2.8, 8.8, 15.8, 23.5, 30.3, 37.5초). 실제 디코드 프레임 모음에서 한글·지도·재료·레시피·고지·출처를 확인했습니다.
- 저장된 구조화 증거: [ffprobe](../evidence/recordings/promo-ffprobe.json), [렌더 manifest](../evidence/recordings/promo-render-manifest.json), [검증 결과](../evidence/recordings/promo-verification.json).

검증 명령:

```bash
ffprobe -v error -show_streams -show_format \
  evidence/recordings/sinpo-market-promo.mp4
ffmpeg -v error -i evidence/recordings/sinpo-market-promo.mp4 -f null -
ffmpeg -i evidence/recordings/sinpo-market-promo.mp4 \
  -vf "select='eq(n,84)+eq(n,264)+eq(n,474)+eq(n,705)+eq(n,909)+eq(n,1125)'" \
  -fps_mode vfr evidence/screenshots/promo-decoded-%02d.png
```

최종 MP4 SHA-256:

```text
d80ee0224b14a186a5be1b5c8ec47236a15813a841f5116e4f0fc413a0718e2e
```

앱 기능·빌드·타입 검사 결과와 한계는 [VERIFICATION.md](VERIFICATION.md)를 참고하세요.
