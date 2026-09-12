/**
 * 신포국제시장 탐색용 예시 데이터 — 현장 검증된 상점/재고 자료가 아닙니다.
 * 상점명·취급 품목·메뉴 판매·좌표는 미검증이며 현재 영업/재고를 보장하지 않습니다.
 * 레시피는 가정 조리용 예시이며 특정 상점의 실제 조리법이 아닙니다.
 * '시장 명물'은 데모 분류로, 추가 메뉴의 지역 명물 지위를 주장하지 않습니다.
 * stallIds: []는 집에 있는 재료 또는 취급점 미등록을 뜻합니다.
 * 좌표는 0–100 × 0–60 도식을 대략 투영한 값이며 실측 GPS가 아닙니다.
 * 계량 기준: 1큰술=15ml, 1작은술=5ml. 시간은 준비·대기 포함 추정치이며
 * 별도 세척/불림물은 음용 가능한 물을 사용합니다. 익힘 상태를 직접 확인하세요.
 */

export const MARKET_DATA_DISCLAIMER = "탐색용 예시·미검증 데이터입니다. 상점·판매 메뉴·취급 품목·영업·재고·좌표는 확인되지 않았습니다. 방문 전 직접 확인하세요. 레시피는 가정용 예시이며 실제 상점 조리법이 아닙니다. 취급점이 없는 재료는 집에 있는 재료 또는 미등록 재료입니다. 지도 좌표는 대략적인 도식 투영입니다.";

export type StallKind = "food" | "ingredient";

export interface Stall {
  id: string;
  name: string;
  kind: StallKind;
  items: string[];
  x: number;
  y: number;
  zone: "본길-북" | "본길-남" | "사잇길" | "동문쪽" | "서문쪽";
}

export interface RecipeStep {
  text: string;
}

export interface Recipe {
  servings: number;
  timeMin: number;
  difficulty: "쉬움" | "보통" | "어려움";
  steps: string[];
  tip?: string;
}

export interface MenuIngredient {
  name: string;
  amount: string;
  stallIds: string[];
}

export interface Menu {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  category: string;
  sellerIds: string[];
  ingredients: MenuIngredient[];
  recipe: Recipe;
}

export const CATEGORIES = ["시장 명물", "분식", "집밥·국물", "해물·안주"] as const;

export const STALLS: Stall[] = [
  // ── 서문쪽 (west entrance) ──
  { id: "s-mandu", name: "신포우리만두 본점", kind: "food", items: ["만두", "쫄면", "김밥"], x: 8, y: 18, zone: "서문쪽" },
  { id: "s-hodduk", name: "씨앗호떡집", kind: "food", items: ["호떡", "씨앗호떡"], x: 8, y: 38, zone: "서문쪽" },

  // ── 본길 북측 ──
  { id: "s-dakgangjeong", name: "신포닭강정 본점", kind: "food", items: ["닭강정"], x: 22, y: 14, zone: "본길-북" },
  { id: "s-jjolmyeon", name: "청실홍실", kind: "food", items: ["쫄면", "만두", "콩국수"], x: 34, y: 14, zone: "본길-북" },
  { id: "s-veg1", name: "신포야채", kind: "ingredient", items: ["양배추", "당근", "오이", "콩나물", "대파", "마늘", "양파", "부추", "애호박", "감자", "청양고추", "깻잎"], x: 46, y: 14, zone: "본길-북" },
  { id: "s-butcher", name: "중앙정육점", kind: "ingredient", items: ["닭고기", "돼지고기", "소고기", "닭날개", "차돌박이", "돼지목살"], x: 58, y: 14, zone: "본길-북" },
  { id: "s-gonggal", name: "원조공갈빵", kind: "food", items: ["공갈빵", "중국빵"], x: 70, y: 14, zone: "본길-북" },
  { id: "s-grain", name: "신포방앗간", kind: "ingredient", items: ["고춧가루", "참기름", "들기름", "미숫가루", "떡국떡", "들깨가루"], x: 82, y: 14, zone: "본길-북" },

  // ── 본길 남측 ──
  { id: "s-fish", name: "신포수산", kind: "ingredient", items: ["고등어", "갈치", "오징어", "새우", "조개", "홍합", "미역"], x: 22, y: 42, zone: "본길-남" },
  { id: "s-dried", name: "건어물상회", kind: "ingredient", items: ["멸치", "다시마", "김", "건새우", "황태"], x: 34, y: 42, zone: "본길-남" },
  { id: "s-tteok", name: "신포떡집", kind: "ingredient", items: ["떡볶이떡", "가래떡", "인절미", "송편"], x: 46, y: 42, zone: "본길-남" },
  { id: "s-banchan", name: "신포반찬", kind: "food", items: ["반찬", "김치", "젓갈", "장아찌", "두부"], x: 58, y: 42, zone: "본길-남" },
  { id: "s-tteokbokki", name: "할머니떡볶이", kind: "food", items: ["떡볶이", "순대", "튀김", "어묵"], x: 70, y: 42, zone: "본길-남" },
  { id: "s-sauce", name: "신포상회(양념·잡화)", kind: "ingredient", items: ["고추장", "간장", "된장", "물엿", "식용유", "밀가루", "설탕", "튀김가루", "어묵", "부침가루", "당면", "식초", "고추기름"], x: 82, y: 42, zone: "본길-남" },

  // ── 사잇길 ──
  { id: "s-egg", name: "계란도매", kind: "ingredient", items: ["계란", "메추리알"], x: 52, y: 28, zone: "사잇길" },
  { id: "s-noodle", name: "국수공장", kind: "ingredient", items: ["쫄면사리", "국수면", "칼국수면", "만두피", "라면사리"], x: 64, y: 28, zone: "사잇길" },

  // ── 동문쪽 ──
  { id: "s-juice", name: "신포과일주스", kind: "food", items: ["과일주스", "과일"], x: 93, y: 18, zone: "동문쪽" },
  { id: "s-chicken2", name: "원조신포닭강정", kind: "food", items: ["닭강정", "치킨"], x: 93, y: 38, zone: "동문쪽" },
];

export const MENUS: Menu[] = [
  /* ═══ 시장 명물 ═══ */
  {
    id: "dakgangjeong",
    name: "닭강정",
    emoji: "🍗",
    desc: "달콤매콤한 소스를 입힌 가정용 닭강정 예시.",
    category: "시장 명물",
    sellerIds: ["s-dakgangjeong","s-chicken2"],
    ingredients: [
      { name: "닭고기", amount: "1kg (뼈 없는 한입 크기)", stallIds: ["s-butcher"] },
      { name: "튀김가루", amount: "200g", stallIds: ["s-sauce"] },
      { name: "물엿", amount: "4큰술", stallIds: ["s-sauce"] },
      { name: "고추장", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "간장", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "고춧가루", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "마늘", amount: "다진 것 1큰술", stallIds: ["s-veg1"] },
      { name: "대파", amount: "1대", stallIds: ["s-veg1"] },
      { name: "식용유", amount: "1L (튀김용)", stallIds: ["s-sauce"] },
      { name: "물", amount: "45ml (소스용)", stallIds: [] },
    ],
    recipe: {
      servings: 3,
      timeMin: 50,
      difficulty: "보통",
      steps: [
        "닭고기는 뼈 없는 살을 3cm 크기로 잘라 키친타월로 물기를 닦고, 대파는 송송 썬다.",
        "닭에 튀김가루를 묻혀 170℃ 식용유에 나누어 6~8분씩 튀긴다. 꺼냈다가 180℃에서 2~3분 더 튀기고 중심 75℃에서 1분 이상 익었는지 확인한다.",
        "별도 팬에 간장·고추장·물엿·고춧가루·마늘·물 45ml를 넣고 약불에서 2분 끓인다.",
        "튀긴 닭을 소스에 버무리고 대파를 넣어 1분 더 볶는다.",
      ],
      tip: "냄비의 절반 이상 기름을 채우지 말고 물기 있는 도구를 넣지 마세요. 튀김 시간보다 중심 익힘 확인이 우선입니다.",
    },
  },
  {
    id: "mandu",
    name: "만두",
    emoji: "🥟",
    desc: "돼지고기와 두부, 부추로 빚는 찐만두.",
    category: "시장 명물",
    sellerIds: ["s-mandu","s-jjolmyeon"],
    ingredients: [
      { name: "만두피", amount: "30장", stallIds: ["s-noodle"] },
      { name: "돼지고기", amount: "300g (다짐육)", stallIds: ["s-butcher"] },
      { name: "부추", amount: "80g", stallIds: ["s-veg1"] },
      { name: "양파", amount: "½개 (100g)", stallIds: ["s-veg1"] },
      { name: "두부", amount: "150g", stallIds: ["s-banchan"] },
      { name: "간장", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "참기름", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "후추", amount: "⅛작은술", stallIds: [] },
      { name: "물", amount: "1L (찜기용) + 30ml (접착용)", stallIds: [] },
    ],
    recipe: {
      servings: 4,
      timeMin: 60,
      difficulty: "보통",
      steps: [
        "두부는 물기를 꼭 짜고 부추·양파는 잘게 썬다.",
        "돼지고기·두부·부추·양파·간장·참기름·후추를 3분 치대어 소를 만든다.",
        "만두피 30장에 소를 고르게 나누고 가장자리에 물 30ml를 조금씩 발라 단단히 봉한다.",
        "찜기에 물 1L를 끓여 만두가 물에 닿지 않게 올리고 12~15분 찐다. 소의 중심이 75℃에서 1분 이상 익었는지 확인한다.",
      ],
      tip: "소를 너무 많이 넣으면 터지기 쉬워요. 만두 크기에 따라 찌는 시간을 조절하세요.",
    },
  },
  {
    id: "gonggalppang",
    name: "공갈빵",
    emoji: "🥯",
    desc: "속을 비워 바삭하게 굽는 가정용 오븐 공갈빵.",
    category: "시장 명물",
    sellerIds: ["s-gonggal"],
    ingredients: [
      { name: "밀가루", amount: "250g", stallIds: ["s-sauce"] },
      { name: "흑설탕", amount: "80g", stallIds: [] },
      { name: "계란", amount: "1개", stallIds: ["s-egg"] },
      { name: "식용유", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "인스턴트 드라이이스트", amount: "3g", stallIds: [] },
      { name: "물", amount: "140ml (미지근한 물)", stallIds: [] },
    ],
    recipe: {
      servings: 4,
      timeMin: 90,
      difficulty: "어려움",
      steps: [
        "밀가루·이스트·물 140ml·식용유를 10분 반죽하고 덮어 따뜻한 곳에서 약 40분, 부피가 늘 때까지 발효한다.",
        "반죽을 8등분하고 흑설탕을 각 10g씩 넣어 봉한다. 터지지 않게 얇고 둥글게 민다.",
        "계란을 풀어 겉면에 얇게 바른다. 220℃로 예열한 오븐에서 10~15분, 부풀고 표면이 노릇해질 때까지 굽는다.",
        "꺼내 망 위에서 5분 식힌 뒤 뜨거운 설탕에 주의하며 나눈다.",
      ],
      tip: "반죽에 구멍이 나면 부풀기 어려워요. 오븐별 차이가 있어 색을 보며 굽고, 남은 생계란물은 보관하지 마세요.",
    },
  },
  {
    id: "hodduk",
    name: "씨앗호떡",
    emoji: "🫓",
    desc: "씨앗과 흑설탕을 넣어 팬에 굽는 달콤한 호떡.",
    category: "시장 명물",
    sellerIds: ["s-hodduk"],
    ingredients: [
      { name: "밀가루", amount: "250g", stallIds: ["s-sauce"] },
      { name: "흑설탕", amount: "80g", stallIds: [] },
      { name: "해바라기씨", amount: "40g (껍질 없는 것)", stallIds: [] },
      { name: "호박씨", amount: "20g (껍질 없는 것)", stallIds: [] },
      { name: "식용유", amount: "4큰술", stallIds: ["s-sauce"] },
      { name: "인스턴트 드라이이스트", amount: "4g", stallIds: [] },
      { name: "소금", amount: "½작은술", stallIds: [] },
      { name: "계피가루", amount: "½작은술", stallIds: [] },
      { name: "물", amount: "180ml (미지근한 물)", stallIds: [] },
    ],
    recipe: {
      servings: 4,
      timeMin: 90,
      difficulty: "보통",
      steps: [
        "밀가루·이스트·소금·물 180ml를 섞어 덮고 따뜻한 곳에서 약 60분 발효한다.",
        "흑설탕·계피가루·해바라기씨·호박씨를 섞어 소를 만든다.",
        "반죽과 소를 각각 8등분하고 반죽에 소를 넣어 봉한다. 식용유 1큰술을 손과 누르개에 나눠 바른다.",
        "팬에 남은 식용유 3큰술을 나눠 두르고 중약불에서 호떡을 눌러 한 면당 2~3분씩, 속까지 익힌다.",
        "2~3분 식혀 뜨거운 설탕물이 흐르지 않게 먹는다.",
      ],
      tip: "발효 시간까지 포함한 예상 시간입니다. 너무 센 불에서는 겉만 타고 반죽 속은 덜 익어요.",
    },
  },
  {
    id: "gyeranppang",
    name: "계란빵",
    emoji: "🥚",
    desc: "시장 간식을 집 오븐으로 만드는 예시. 판매점은 미등록.",
    category: "시장 명물",
    sellerIds: [],
    ingredients: [
      { name: "밀가루", amount: "100g", stallIds: ["s-sauce"] },
      { name: "계란", amount: "4개 (반죽 1개·토핑 3개)", stallIds: ["s-egg"] },
      { name: "우유", amount: "80ml", stallIds: [] },
      { name: "설탕", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "베이킹파우더", amount: "1작은술", stallIds: [] },
      { name: "소금", amount: "⅛작은술", stallIds: [] },
      { name: "식용유", amount: "1큰술", stallIds: ["s-sauce"] },
    ],
    recipe: {
      servings: 3,
      timeMin: 35,
      difficulty: "쉬움",
      steps: [
        "오븐을 180℃로 예열하고 깊은 머핀 틀 3칸에 식용유 1작은술을 나눠 바른다.",
        "계란 1개·우유·설탕·소금·남은 식용유 2작은술을 섞고 밀가루·베이킹파우더를 넣어 반죽한다.",
        "틀의 절반 이하까지 반죽을 나눠 담고 계란을 각각 1개씩 올린다. 넘치지 않도록 깊고 큰 틀을 쓴다.",
        "180℃에서 20~25분 구워 반죽이 꼬치에 묻지 않고 흰자·노른자가 단단히 익었는지 확인한 뒤 3분 식힌다.",
      ],
      tip: "작은 틀밖에 없다면 더 많은 칸에 나눠 담고, 계란도 풀어서 고르게 나누세요.",
    },
  },
  {
    id: "yachaetwigim",
    name: "야채튀김",
    emoji: "🥕",
    desc: "양파·당근·감자로 만드는 바삭한 시장식 간식 예시.",
    category: "시장 명물",
    sellerIds: [],
    ingredients: [
      { name: "양파", amount: "½개 (100g)", stallIds: ["s-veg1"] },
      { name: "당근", amount: "½개 (80g)", stallIds: ["s-veg1"] },
      { name: "감자", amount: "1개 (150g)", stallIds: ["s-veg1"] },
      { name: "튀김가루", amount: "150g (덧가루 30g·반죽 120g)", stallIds: ["s-sauce"] },
      { name: "물", amount: "180ml (차가운 물)", stallIds: [] },
      { name: "식용유", amount: "700ml (튀김용)", stallIds: ["s-sauce"] },
    ],
    recipe: {
      servings: 2,
      timeMin: 30,
      difficulty: "보통",
      steps: [
        "양파·당근·감자를 3mm 두께로 채 썰고 물기를 닦는다.",
        "야채에 튀김가루 30g을 묻힌다. 나머지 튀김가루 120g은 차가운 물 180ml와 가볍게 섞는다.",
        "야채를 반죽에 섞어 작은 국자로 얇게 떠서 170℃ 기름에 나눠 넣고 3~4분씩 튀긴다.",
        "감자 속이 부드럽게 익고 겉이 노릇해지면 건져 망에서 기름을 뺀다.",
      ],
      tip: "기름은 냄비 절반 이하로 담고 야채를 한꺼번에 많이 넣지 마세요.",
    },
  },
  /* ═══ 분식 ═══ */
  {
    id: "jjolmyeon",
    name: "쫄면",
    emoji: "🍜",
    desc: "쫄깃한 면에 아삭한 채소를 얹은 새콤달콤 비빔면.",
    category: "분식",
    sellerIds: ["s-jjolmyeon","s-mandu"],
    ingredients: [
      { name: "쫄면사리", amount: "400g", stallIds: ["s-noodle"] },
      { name: "콩나물", amount: "150g", stallIds: ["s-veg1"] },
      { name: "양배추", amount: "100g", stallIds: ["s-veg1"] },
      { name: "당근", amount: "50g", stallIds: ["s-veg1"] },
      { name: "오이", amount: "½개 (100g)", stallIds: ["s-veg1"] },
      { name: "고추장", amount: "3큰술", stallIds: ["s-sauce"] },
      { name: "설탕", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "식초", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "간장", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "마늘", amount: "다진 것 1작은술", stallIds: ["s-veg1"] },
      { name: "참기름", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "계란", amount: "2개", stallIds: ["s-egg"] },
      { name: "물", amount: "3L (계란·콩나물·면 삶기 각 1L, 헹굼물 별도)", stallIds: [] },
    ],
    recipe: {
      servings: 2,
      timeMin: 25,
      difficulty: "쉬움",
      steps: [
        "고추장·설탕·식초·간장·마늘·참기름을 섞고 양배추·당근·오이는 가늘게 채 썬다.",
        "물 1L에 계란을 넣고 끓기 시작하면 10~12분 삶아 식혀 껍질을 벗긴다. 별도 물 1L에 콩나물을 4~5분 삶아 건진다.",
        "남은 물 1L를 끓여 쫄면을 포장지 안내 시간에 맞춰 3~4분 삶고 찬물에 헹궈 물기를 뺀다.",
        "면 위에 채소·콩나물·반으로 자른 계란을 얹고 양념장을 비빈다.",
      ],
      tip: "면을 헹군 뒤 물기를 충분히 빼야 양념장이 묽어지지 않아요.",
    },
  },
  {
    id: "tteokbokki",
    name: "떡볶이",
    emoji: "🌶️",
    desc: "떡과 어묵을 매콤달콤한 멸치 육수에 졸인 분식.",
    category: "분식",
    sellerIds: ["s-tteokbokki"],
    ingredients: [
      { name: "떡볶이떡", amount: "400g", stallIds: ["s-tteok"] },
      { name: "어묵", amount: "3장 (150g)", stallIds: ["s-sauce"] },
      { name: "고추장", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "고춧가루", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "설탕", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "간장", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "대파", amount: "1대", stallIds: ["s-veg1"] },
      { name: "계란", amount: "2개", stallIds: ["s-egg"] },
      { name: "멸치", amount: "10g (내장 제거)", stallIds: ["s-dried"] },
      { name: "다시마", amount: "5g", stallIds: ["s-dried"] },
      { name: "물", amount: "1.6L (육수 600ml·계란 삶기 1L, 떡 불림물 별도)", stallIds: [] },
    ],
    recipe: {
      servings: 2,
      timeMin: 30,
      difficulty: "쉬움",
      steps: [
        "떡이 단단하면 찬물에 10분 불린다. 계란은 물 1L에서 끓기 시작한 뒤 10~12분 삶아 껍질을 벗긴다.",
        "물 600ml에 멸치·다시마를 넣어 10분 끓인다. 다시마는 끓기 시작하면 건지고 멸치는 마지막에 건져 육수 약 500ml를 준비한다.",
        "육수에 고추장·고춧가루·설탕·간장을 풀고 떡·썬 어묵을 넣어 중불에서 8~10분 졸인다.",
        "썬 대파·삶은 계란을 넣고 2분 더 끓인다.",
      ],
      tip: "육수와 계란을 동시에 준비하면 시간을 줄일 수 있어요.",
    },
  },
  {
    id: "gimbap",
    name: "김밥",
    emoji: "🍙",
    desc: "소고기와 채소를 넣은 4줄 분량의 집김밥.",
    category: "분식",
    sellerIds: ["s-mandu"],
    ingredients: [
      { name: "김", amount: "4장 (김밥용)", stallIds: ["s-dried"] },
      { name: "밥", amount: "800g (지은 밥)", stallIds: [] },
      { name: "계란", amount: "4개", stallIds: ["s-egg"] },
      { name: "당근", amount: "1개 (150g)", stallIds: ["s-veg1"] },
      { name: "오이", amount: "1개 (200g)", stallIds: ["s-veg1"] },
      { name: "소고기", amount: "200g (채 썬 것)", stallIds: ["s-butcher"] },
      { name: "단무지", amount: "4줄 (80g)", stallIds: [] },
      { name: "우엉조림", amount: "80g", stallIds: [] },
      { name: "참기름", amount: "2큰술", stallIds: ["s-grain"] },
      { name: "식용유", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "소금", amount: "½작은술", stallIds: [] },
      { name: "간장", amount: "1큰술", stallIds: ["s-sauce"] },
    ],
    recipe: {
      servings: 4,
      timeMin: 40,
      difficulty: "쉬움",
      steps: [
        "지은 밥에 참기름 1큰술과 소금 ¼작은술을 섞어 한 김 식힌다. 오이는 길게 썬다.",
        "계란을 풀어 식용유 1작은술로 지단을 부쳐 길게 썬다. 당근채는 식용유 1작은술과 남은 소금으로 볶는다.",
        "소고기를 남은 식용유 1작은술과 간장으로 볶아 속까지 익힌다. 단무지·우엉조림은 물기를 뺀다.",
        "김 4장에 밥과 속재료를 고르게 나눠 올리고 단단히 만다. 남은 참기름 1큰술을 겉에 바르고 썬다.",
      ],
      tip: "시간은 지은 밥 기준입니다. 따뜻한 곳에 오래 두지 말고 바로 먹거나 식힌 뒤 냉장하세요.",
    },
  },
  {
    id: "japchae",
    name: "잡채",
    emoji: "🥘",
    desc: "당면과 돼지고기, 채소를 따로 볶아 합치는 잡채.",
    category: "분식",
    sellerIds: [],
    ingredients: [
      { name: "당면", amount: "200g", stallIds: ["s-sauce"] },
      { name: "돼지고기", amount: "150g (잡채용)", stallIds: ["s-butcher"] },
      { name: "양파", amount: "1개 (200g)", stallIds: ["s-veg1"] },
      { name: "당근", amount: "½개 (80g)", stallIds: ["s-veg1"] },
      { name: "부추", amount: "80g", stallIds: ["s-veg1"] },
      { name: "간장", amount: "4큰술", stallIds: ["s-sauce"] },
      { name: "설탕", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "참기름", amount: "2큰술", stallIds: ["s-grain"] },
      { name: "식용유", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "통깨", amount: "1작은술", stallIds: [] },
      { name: "물", amount: "2L (삶기용, 불림물 별도)", stallIds: [] },
    ],
    recipe: {
      servings: 4,
      timeMin: 50,
      difficulty: "보통",
      steps: [
        "당면은 미지근한 물에 30분 불린 뒤 물 2L를 끓여 포장지 안내에 따라 약 5분 삶아 건진다. 불리는 동안 채소와 고기를 썬다.",
        "식용유를 나눠 두르고 돼지고기에 간장 1큰술·설탕 ½큰술을 넣어 속까지 익힌다. 양파·당근은 따로 볶고 부추는 마지막 30초에 넣는다.",
        "당면에 남은 간장 3큰술·설탕 1½큰술·참기름 1큰술을 넣어 팬에서 2분 볶는다.",
        "고기와 채소를 합쳐 섞고 남은 참기름 1큰술·통깨로 마무리한다.",
      ],
      tip: "불리는 시간에 속재료를 볶으세요. 당면은 제품별 불림·삶기 안내를 우선합니다.",
    },
  },
  {
    id: "rabokki",
    name: "라볶이",
    emoji: "🍜",
    desc: "라면사리와 떡을 함께 끓여 푸짐하게 먹는 분식.",
    category: "분식",
    sellerIds: [],
    ingredients: [
      { name: "라면사리", amount: "1개 (110g, 스프 제외)", stallIds: ["s-noodle"] },
      { name: "떡볶이떡", amount: "200g", stallIds: ["s-tteok"] },
      { name: "어묵", amount: "2장 (100g)", stallIds: ["s-sauce"] },
      { name: "대파", amount: "½대", stallIds: ["s-veg1"] },
      { name: "고추장", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "고춧가루", amount: "1작은술", stallIds: ["s-grain"] },
      { name: "간장", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "설탕", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "물", amount: "700ml (조리용, 떡 불림물 별도)", stallIds: [] },
    ],
    recipe: {
      servings: 2,
      timeMin: 25,
      difficulty: "쉬움",
      steps: [
        "단단한 떡은 찬물에 10분 불리고 어묵과 대파를 먹기 좋게 썬다.",
        "냄비에 물 700ml·고추장·고춧가루·간장·설탕을 넣고 끓인다.",
        "떡과 어묵을 넣어 중불에서 5분 끓인 뒤 라면사리와 대파를 넣는다.",
        "면 포장지 안내에 맞춰 3~4분 더 끓여 면과 떡이 익으면 바로 낸다.",
      ],
      tip: "라면이 국물을 빨리 흡수하므로 완성 즉시 먹으세요. 스프는 넣지 않는 레시피입니다.",
    },
  },
  {
    id: "janchiguksu",
    name: "잔치국수",
    emoji: "🍜",
    desc: "멸치다시마 국물에 지단과 채소를 올린 따뜻한 국수.",
    category: "분식",
    sellerIds: [],
    ingredients: [
      { name: "국수면", amount: "200g (소면)", stallIds: ["s-noodle"] },
      { name: "멸치", amount: "15g (내장 제거)", stallIds: ["s-dried"] },
      { name: "다시마", amount: "5g", stallIds: ["s-dried"] },
      { name: "애호박", amount: "½개 (150g)", stallIds: ["s-veg1"] },
      { name: "당근", amount: "50g", stallIds: ["s-veg1"] },
      { name: "계란", amount: "1개", stallIds: ["s-egg"] },
      { name: "대파", amount: "½대", stallIds: ["s-veg1"] },
      { name: "간장", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "소금", amount: "¼작은술", stallIds: [] },
      { name: "식용유", amount: "2작은술", stallIds: ["s-sauce"] },
      { name: "물", amount: "3.2L (육수 1.2L·면 삶기 2L, 헹굼물 별도)", stallIds: [] },
    ],
    recipe: {
      servings: 2,
      timeMin: 30,
      difficulty: "쉬움",
      steps: [
        "물 1.2L에 멸치·다시마를 넣고 10분 끓인다. 다시마는 끓기 시작할 때 건지고 멸치는 마지막에 건진다.",
        "애호박·당근을 채 썰어 식용유 1작은술로 볶는다. 남은 기름으로 계란지단을 부쳐 채 썬다.",
        "육수에 간장·소금·썬 대파를 넣어 2분 끓인다. 별도 물 2L에 국수면을 포장지 안내대로 3~4분 삶아 찬물에 헹궈 물기를 뺀다.",
        "그릇에 면과 따뜻한 육수를 담고 애호박·당근·지단을 올린다.",
      ],
      tip: "면을 따로 삶아 헹구면 국물이 덜 탁해져요.",
    },
  },
  /* ═══ 집밥·국물 ═══ */
  {
    id: "kimchijjigae",
    name: "김치찌개",
    emoji: "🍲",
    desc: "김치와 돼지목살, 두부를 넣고 푹 끓이는 찌개.",
    category: "집밥·국물",
    sellerIds: [],
    ingredients: [
      { name: "김치", amount: "400g (잘 익은 것)", stallIds: ["s-banchan"] },
      { name: "돼지목살", amount: "300g", stallIds: ["s-butcher"] },
      { name: "두부", amount: "300g", stallIds: ["s-banchan"] },
      { name: "대파", amount: "1대", stallIds: ["s-veg1"] },
      { name: "양파", amount: "1개 (200g)", stallIds: ["s-veg1"] },
      { name: "청양고추", amount: "1개", stallIds: ["s-veg1"] },
      { name: "고춧가루", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "마늘", amount: "다진 것 1큰술", stallIds: ["s-veg1"] },
      { name: "멸치", amount: "10g (내장 제거)", stallIds: ["s-dried"] },
      { name: "다시마", amount: "5g", stallIds: ["s-dried"] },
      { name: "물", amount: "900ml", stallIds: [] },
      { name: "설탕", amount: "½큰술 (선택)", stallIds: ["s-sauce"] },
    ],
    recipe: {
      servings: 3,
      timeMin: 45,
      difficulty: "쉬움",
      steps: [
        "물 900ml에 멸치·다시마를 넣고 10분 끓인다. 다시마는 끓기 시작하면, 멸치는 마지막에 건진다. 그동안 김치·목살·두부·채소를 썬다.",
        "다른 냄비에 목살을 중약불에서 3분 볶아 기름을 낸 뒤 김치·양파를 넣고 3분 더 볶는다.",
        "육수·고춧가루·마늘을 넣어 중불에서 20분 끓여 고기 속까지 익힌다.",
        "두부·대파·청양고추를 넣어 5분 더 끓인다. 김치가 너무 시면 선택 재료인 설탕 ½큰술을 넣는다.",
      ],
      tip: "김치 염도에 따라 맛이 달라집니다. 졸아들지 않도록 중불을 유지하세요.",
    },
  },
  {
    id: "doenjangjjigae",
    name: "된장찌개",
    emoji: "🥣",
    desc: "감자와 애호박, 조개를 넣은 구수한 된장찌개.",
    category: "집밥·국물",
    sellerIds: [],
    ingredients: [
      { name: "된장", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "두부", amount: "150g", stallIds: ["s-banchan"] },
      { name: "애호박", amount: "½개 (150g)", stallIds: ["s-veg1"] },
      { name: "감자", amount: "½개 (80g)", stallIds: ["s-veg1"] },
      { name: "양파", amount: "½개 (100g)", stallIds: ["s-veg1"] },
      { name: "조개", amount: "200g (해감 완료, 껍데기 포함)", stallIds: ["s-fish"] },
      { name: "멸치", amount: "10g (내장 제거)", stallIds: ["s-dried"] },
      { name: "다시마", amount: "5g", stallIds: ["s-dried"] },
      { name: "청양고추", amount: "1개", stallIds: ["s-veg1"] },
      { name: "대파", amount: "½대", stallIds: ["s-veg1"] },
      { name: "물", amount: "700ml", stallIds: [] },
    ],
    recipe: {
      servings: 2,
      timeMin: 30,
      difficulty: "쉬움",
      steps: [
        "물 700ml에 멸치·다시마를 넣고 10분 끓여 육수 약 600ml를 만든다. 다시마는 끓기 시작하면 건지고 멸치도 마지막에 건진다.",
        "된장을 육수에 풀고 깍둑 썬 감자·양파를 넣어 5분 끓인다.",
        "썬 애호박·두부와 씻은 해감 완료 조개를 넣어 7분 이상 충분히 끓인다. 입을 벌린 뒤에도 속살까지 익히고 끝까지 닫힌 조개는 버린다.",
        "썬 청양고추·대파를 넣어 2분 더 끓인다.",
      ],
      tip: "30분은 해감 완료 조개 기준입니다. 해감이 필요한 조개는 구입처의 손질 안내에 따라 별도 준비하세요.",
    },
  },
  {
    id: "miyeokguk",
    name: "미역국",
    emoji: "🥬",
    desc: "건미역과 소고기를 참기름에 볶아 끓이는 국.",
    category: "집밥·국물",
    sellerIds: [],
    ingredients: [
      { name: "건미역", amount: "20g", stallIds: [] },
      { name: "소고기", amount: "200g (국거리)", stallIds: ["s-butcher"] },
      { name: "참기름", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "국간장", amount: "2큰술", stallIds: [] },
      { name: "마늘", amount: "다진 것 1큰술", stallIds: ["s-veg1"] },
      { name: "물", amount: "1.2L (국물용, 불림물 별도)", stallIds: [] },
    ],
    recipe: {
      servings: 4,
      timeMin: 45,
      difficulty: "쉬움",
      steps: [
        "건미역은 찬물에 15분 불려 씻고 물기를 짜서 짧게 자른다. 소고기는 작게 썬다.",
        "냄비에 참기름을 두르고 소고기를 3분 볶다가 미역을 넣고 2분 더 볶는다.",
        "물 1.2L를 붓고 끓어오르면 중불로 낮춰 20분 끓여 소고기를 속까지 익힌다.",
        "국간장·마늘을 넣고 2분 더 끓인다.",
      ],
      tip: "건미역은 불리면 크게 늘어나므로 마른 무게 20g을 기준으로 준비하세요.",
    },
  },
  {
    id: "tteokguk",
    name: "떡국",
    emoji: "🍥",
    desc: "소고기 국물에 떡과 계란지단을 얹은 떡국.",
    category: "집밥·국물",
    sellerIds: [],
    ingredients: [
      { name: "떡국떡", amount: "400g", stallIds: ["s-grain"] },
      { name: "소고기", amount: "200g (국거리, 얇게 썬 것)", stallIds: ["s-butcher"] },
      { name: "계란", amount: "2개", stallIds: ["s-egg"] },
      { name: "대파", amount: "1대", stallIds: ["s-veg1"] },
      { name: "마늘", amount: "다진 것 1큰술", stallIds: ["s-veg1"] },
      { name: "김", amount: "1장", stallIds: ["s-dried"] },
      { name: "국간장", amount: "2큰술", stallIds: [] },
      { name: "참기름", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "식용유", amount: "1작은술", stallIds: ["s-sauce"] },
      { name: "물", amount: "1L (육수용, 불림물 별도)", stallIds: [] },
    ],
    recipe: {
      servings: 3,
      timeMin: 40,
      difficulty: "쉬움",
      steps: [
        "떡국떡을 찬물에 20분 불린다. 그동안 냄비에 참기름으로 소고기를 3분 볶는다.",
        "소고기에 물 1L를 붓고 끓어오르면 중불에서 15분 끓인다. 별도 팬에 식용유를 두르고 계란지단을 부쳐 채 썬다.",
        "물기를 뺀 떡과 국간장·마늘을 육수에 넣고 5~7분, 떡이 속까지 부드러워질 때까지 끓인다.",
        "송송 썬 대파를 넣어 1분 더 끓인 뒤 그릇에 담고 계란지단·잘게 부순 김을 올린다.",
      ],
      tip: "떡이 떠오르는 것만 보지 말고 하나 잘라 속까지 부드러운지 확인하세요.",
    },
  },
  {
    id: "kongnamulguk",
    name: "콩나물국",
    emoji: "🥣",
    desc: "콩나물과 대파로 가볍게 끓이는 맑은 국.",
    category: "집밥·국물",
    sellerIds: [],
    ingredients: [
      { name: "콩나물", amount: "200g", stallIds: ["s-veg1"] },
      { name: "대파", amount: "½대", stallIds: ["s-veg1"] },
      { name: "마늘", amount: "다진 것 1작은술", stallIds: ["s-veg1"] },
      { name: "국간장", amount: "1큰술", stallIds: [] },
      { name: "소금", amount: "¼작은술", stallIds: [] },
      { name: "물", amount: "800ml", stallIds: [] },
    ],
    recipe: {
      servings: 2,
      timeMin: 20,
      difficulty: "쉬움",
      steps: [
        "콩나물을 씻어 상한 부분을 골라내고 대파는 송송 썬다.",
        "냄비에 물 800ml와 콩나물을 넣어 뚜껑을 열고 끓인다.",
        "끓기 시작하면 중불에서 7~8분 끓여 콩나물을 충분히 익힌다.",
        "국간장·소금·마늘·대파를 넣고 2분 더 끓인다.",
      ],
      tip: "처음부터 끝까지 뚜껑을 열어 끓이면 중간에 여닫을 필요가 없어요.",
    },
  },
  {
    id: "gamjajorim",
    name: "감자조림",
    emoji: "🥔",
    desc: "간장 양념을 입혀 밥반찬으로 먹는 감자조림.",
    category: "집밥·국물",
    sellerIds: [],
    ingredients: [
      { name: "감자", amount: "2개 (300g)", stallIds: ["s-veg1"] },
      { name: "양파", amount: "½개 (100g)", stallIds: ["s-veg1"] },
      { name: "간장", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "설탕", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "마늘", amount: "다진 것 1작은술", stallIds: ["s-veg1"] },
      { name: "식용유", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "참기름", amount: "1작은술", stallIds: ["s-grain"] },
      { name: "통깨", amount: "1작은술", stallIds: [] },
      { name: "물", amount: "200ml (조림용, 헹굼물 별도)", stallIds: [] },
    ],
    recipe: {
      servings: 2,
      timeMin: 30,
      difficulty: "쉬움",
      steps: [
        "감자는 껍질을 벗겨 2cm 크기로 썰어 헹군 뒤 물기를 뺀다. 양파도 비슷한 크기로 썬다.",
        "팬에 식용유를 두르고 감자를 중불에서 3분 볶는다.",
        "물 200ml·간장·설탕·마늘·양파를 넣고 뚜껑을 덮어 중약불에서 10분 끓인다.",
        "뚜껑을 열고 5~7분 졸여 감자에 젓가락이 부드럽게 들어가면 불을 끄고 참기름·통깨를 넣는다.",
      ],
      tip: "감자를 자주 휘젓지 말고 팬을 살짝 흔들어야 모양이 덜 부서져요.",
    },
  },
  /* ═══ 해물·안주 ═══ */
  {
    id: "haemulpajeon",
    name: "해물파전",
    emoji: "🥞",
    desc: "대파를 얇게 갈라 해물과 함께 부치는 가정식 파전.",
    category: "해물·안주",
    sellerIds: [],
    ingredients: [
      { name: "부침가루", amount: "200g", stallIds: ["s-sauce"] },
      { name: "오징어", amount: "150g (손질 후)", stallIds: ["s-fish"] },
      { name: "새우", amount: "150g (껍질 제거 후)", stallIds: ["s-fish"] },
      { name: "대파", amount: "2대 (150g)", stallIds: ["s-veg1"] },
      { name: "계란", amount: "2개", stallIds: ["s-egg"] },
      { name: "식용유", amount: "4큰술", stallIds: ["s-sauce"] },
      { name: "물", amount: "300ml (차가운 물)", stallIds: [] },
    ],
    recipe: {
      servings: 2,
      timeMin: 30,
      difficulty: "보통",
      steps: [
        "대파는 10cm 길이로 잘라 세로로 얇게 가른다. 손질한 오징어와 새우는 작게 썰어 물기를 닦는다.",
        "부침가루와 차가운 물 300ml를 가볍게 섞고 계란은 따로 푼다.",
        "전 2장 기준으로 재료를 반씩 나눈다. 팬에 식용유 2큰술을 두르고 대파·반죽·해물·계란물 순으로 얇게 편다.",
        "중불에서 한 면당 4~5분 부쳐 해물이 불투명해지고 속까지 익었는지 확인한다. 남은 재료도 같은 방법으로 부친다.",
      ],
      tip: "쪽파 대신 등록된 재료인 대파를 사용하는 예시입니다. 두꺼운 줄기는 얇게 갈라야 빨리 익어요.",
    },
  },
  {
    id: "godeungeo",
    name: "고등어구이",
    emoji: "🐟",
    desc: "손질한 고등어에 소금으로 간해 노릇하게 굽기.",
    category: "해물·안주",
    sellerIds: [],
    ingredients: [
      { name: "고등어", amount: "1마리 (손질 후 약 300g, 반으로 가른 것)", stallIds: ["s-fish"] },
      { name: "굵은소금", amount: "½작은술", stallIds: [] },
      { name: "식용유", amount: "1큰술", stallIds: ["s-sauce"] },
    ],
    recipe: {
      servings: 2,
      timeMin: 25,
      difficulty: "쉬움",
      steps: [
        "손질한 고등어의 물기를 닦고 굵은소금을 고르게 뿌려 10분 둔다.",
        "팬에 식용유를 두르고 중불에서 껍질면부터 약 6분 굽는다.",
        "뒤집어 중약불에서 5~7분 더 굽고 두꺼운 부분까지 불투명하게 익어 살이 쉽게 갈라지는지 확인한다.",
        "덜 익었으면 약불로 더 익힌 뒤 잔가시를 주의하며 낸다.",
      ],
      tip: "이미 간이 된 고등어라면 소금을 생략하세요. 손질·염장 여부는 포장 표시로 확인하세요.",
    },
  },
  {
    id: "ojingeobokkeum",
    name: "오징어볶음",
    emoji: "🦑",
    desc: "채소와 오징어를 매콤한 양념에 빠르게 볶기.",
    category: "해물·안주",
    sellerIds: [],
    ingredients: [
      { name: "오징어", amount: "2마리 (손질 후 400g)", stallIds: ["s-fish"] },
      { name: "양파", amount: "1개 (200g)", stallIds: ["s-veg1"] },
      { name: "당근", amount: "⅓개 (50g)", stallIds: ["s-veg1"] },
      { name: "대파", amount: "1대", stallIds: ["s-veg1"] },
      { name: "고추장", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "고춧가루", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "설탕", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "간장", amount: "1큰술", stallIds: ["s-sauce"] },
      { name: "마늘", amount: "다진 것 1큰술", stallIds: ["s-veg1"] },
      { name: "참기름", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "식용유", amount: "1큰술", stallIds: ["s-sauce"] },
    ],
    recipe: {
      servings: 2,
      timeMin: 25,
      difficulty: "쉬움",
      steps: [
        "오징어는 내장과 뼈를 제거해 씻고 한입 크기로 썬다. 양파·당근·대파를 썬다.",
        "고추장·고춧가루·설탕·간장·마늘을 섞어 양념장을 만든다.",
        "팬에 식용유를 두르고 센불에서 채소를 2분 볶다가 오징어와 양념장을 넣는다.",
        "3~4분 볶아 오징어 속까지 불투명하게 익으면 불을 끄고 참기름으로 마무리한다.",
      ],
      tip: "한꺼번에 너무 많이 넣으면 물이 생겨요. 팬이 작으면 두 번에 나눠 볶으세요.",
    },
  },
  {
    id: "golbaengi",
    name: "골뱅이무침",
    emoji: "🐚",
    desc: "통조림 골뱅이와 아삭한 채소에 소면을 곁들이는 무침.",
    category: "해물·안주",
    sellerIds: [],
    ingredients: [
      { name: "골뱅이 통조림", amount: "1캔 (총 400g, 고형량 약 200g)", stallIds: [] },
      { name: "국수면", amount: "200g (소면)", stallIds: ["s-noodle"] },
      { name: "오이", amount: "1개 (200g)", stallIds: ["s-veg1"] },
      { name: "양파", amount: "½개 (100g)", stallIds: ["s-veg1"] },
      { name: "당근", amount: "⅓개 (50g)", stallIds: ["s-veg1"] },
      { name: "고추장", amount: "3큰술", stallIds: ["s-sauce"] },
      { name: "식초", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "설탕", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "고춧가루", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "마늘", amount: "다진 것 1작은술", stallIds: ["s-veg1"] },
      { name: "참기름", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "통깨", amount: "1작은술", stallIds: [] },
      { name: "물", amount: "2L (면 삶기용, 헹굼물 별도)", stallIds: [] },
    ],
    recipe: {
      servings: 2,
      timeMin: 20,
      difficulty: "쉬움",
      steps: [
        "고추장·식초·설탕·고춧가루·마늘을 섞어 양념장을 만든다.",
        "골뱅이 통조림은 국물을 빼고 큰 살을 반 가른다. 오이·양파·당근은 얇게 썬다.",
        "물 2L를 끓여 국수면을 포장지 안내에 따라 3~4분 삶고 찬물에 헹궈 물기를 뺀다.",
        "골뱅이와 채소를 양념장에 무치고 참기름·통깨를 넣는다. 소면을 곁들인다.",
      ],
      tip: "바로 먹기 전에 무쳐야 채소에서 물이 덜 나옵니다. 생골뱅이가 아닌 가열된 통조림 기준입니다.",
    },
  },
  {
    id: "honghaptang",
    name: "홍합탕",
    emoji: "🦪",
    desc: "홍합과 대파, 마늘로 끓이는 담백한 맑은 탕.",
    category: "해물·안주",
    sellerIds: [],
    ingredients: [
      { name: "홍합", amount: "700g (껍데기 포함)", stallIds: ["s-fish"] },
      { name: "대파", amount: "1대", stallIds: ["s-veg1"] },
      { name: "마늘", amount: "4쪽", stallIds: ["s-veg1"] },
      { name: "청양고추", amount: "1개", stallIds: ["s-veg1"] },
      { name: "소금", amount: "¼작은술 (선택)", stallIds: [] },
      { name: "물", amount: "800ml (국물용, 세척물 별도)", stallIds: [] },
    ],
    recipe: {
      servings: 2,
      timeMin: 25,
      difficulty: "쉬움",
      steps: [
        "홍합의 수염을 제거하고 껍데기를 문질러 씻는다. 깨진 것과 두드려도 입을 닫지 않는 것은 버린다.",
        "냄비에 물 800ml·홍합·편 썬 마늘을 넣고 끓이며 거품을 걷는다.",
        "입이 벌어진 뒤에도 중불에서 5분 이상 끓여 살까지 충분히 익힌다. 끝까지 닫힌 홍합은 버린다.",
        "썬 대파·청양고추를 넣어 2분 더 끓이고 싱거울 때만 소금 ¼작은술을 넣는다.",
      ],
      tip: "홍합에서 짠맛이 나오므로 소금은 마지막에 맛본 뒤 선택하세요. 검증된 유통 경로의 식재료를 사용하세요.",
    },
  },
  {
    id: "saeubuchujeon",
    name: "새우부추전",
    emoji: "🦐",
    desc: "새우와 부추를 작게 부쳐 나눠 먹는 전.",
    category: "해물·안주",
    sellerIds: [],
    ingredients: [
      { name: "새우", amount: "200g (껍질·내장 제거 후)", stallIds: ["s-fish"] },
      { name: "부추", amount: "100g", stallIds: ["s-veg1"] },
      { name: "양파", amount: "½개 (100g)", stallIds: ["s-veg1"] },
      { name: "부침가루", amount: "150g", stallIds: ["s-sauce"] },
      { name: "계란", amount: "1개", stallIds: ["s-egg"] },
      { name: "물", amount: "180ml (차가운 물)", stallIds: [] },
      { name: "식용유", amount: "3큰술", stallIds: ["s-sauce"] },
    ],
    recipe: {
      servings: 2,
      timeMin: 25,
      difficulty: "쉬움",
      steps: [
        "손질한 새우는 1cm 크기로 자르고 부추는 3cm 길이, 양파는 얇은 채로 썬다.",
        "부침가루·물 180ml·계란을 섞은 뒤 새우·부추·양파를 넣어 가볍게 섞는다.",
        "팬에 식용유를 나눠 두르고 반죽을 지름 10cm 정도로 얇게 떠서 중불에서 한 면당 3~4분 부친다.",
        "새우가 속까지 불투명하게 익고 반죽에 젖은 가루가 남지 않으면 건져 낸다. 남은 반죽도 나눠 부친다.",
      ],
      tip: "새우를 작게 잘라야 반죽과 비슷한 속도로 익어요. 팬을 꽉 채우지 말고 나눠 부치세요.",
    },
  },
];

export function stallById(id: string): Stall | undefined {
  return STALLS.find((s) => s.id === id);
}

export function menusByCategory(cat: string): Menu[] {
  return MENUS.filter((m) => m.category === cat);
}

/* ── Approximate schematic projection ──────────────────────────────────────────
 *   x: 0(서문) → 100(동문)  ≈ lng 126.62520 → 126.62800
 *   y: 0(북)  → 60(남)     ≈ lat 37.47185 → 37.47085
 */
export const MARKET_CENTER: [number, number] = [37.47135, 126.6266];

export function stallLatLng(s: Stall): [number, number] {
  const lat = 37.47185 - (s.y / 60) * (37.47185 - 37.47085);
  const lng = 126.6252 + (s.x / 100) * (126.628 - 126.6252);
  return [lat, lng];
}
