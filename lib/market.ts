/**
 * 신포국제시장 (Sinpo International Market, 인천 중구) — curated field data.
 *
 * Schematic coords (0–100 x west→east, 0–60 y north→south) are georeferenced
 * onto the real market footprint via stallLatLng() below.
 */

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
    desc: "신포시장의 시그니처. 달콤매콤 소스의 원조.",
    category: "시장 명물",
    sellerIds: ["s-dakgangjeong", "s-chicken2"],
    ingredients: [
      { name: "닭고기(절단육)", amount: "1kg", stallIds: ["s-butcher"] },
      { name: "튀김가루", amount: "2컵", stallIds: ["s-sauce"] },
      { name: "물엿", amount: "4큰술", stallIds: ["s-sauce"] },
      { name: "고추장·간장", amount: "각 2큰술", stallIds: ["s-sauce"] },
      { name: "고춧가루", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "마늘·대파", amount: "다진마늘 1큰술, 대파 1대", stallIds: ["s-veg1"] },
    ],
    recipe: {
      servings: 3,
      timeMin: 50,
      difficulty: "보통",
      steps: [
        "닭고기를 우유(생략 가능)에 20분 재워 잡내를 뺀 뒤 물기를 닦는다.",
        "튀김가루를 골고루 묻히고 170℃ 기름에 8분, 꺼냈다가 180℃에 3분 두 번 튀긴다.",
        "팬에 간장·고추장·물엿·고춧가루·다진마늘·물 3큰술을 넣고 약불로 끓여 소스를 만든다.",
        "튀긴 닭을 소스에 넣고 재빨리 버무린 뒤 송송 썬 대파(또는 땅콩)를 뿌린다.",
      ],
      tip: "신포 스타일은 물엿을 넉넉히 — 식어도 바삭하게 코팅되는 게 포인트.",
    },
  },
  {
    id: "mandu",
    name: "만두",
    emoji: "🥟",
    desc: "김이 오르는 찜기 앞 줄서기. 60년 전통.",
    category: "시장 명물",
    sellerIds: ["s-mandu", "s-jjolmyeon"],
    ingredients: [
      { name: "만두피", amount: "30장", stallIds: ["s-noodle"] },
      { name: "돼지고기(다짐육)", amount: "300g", stallIds: ["s-butcher"] },
      { name: "부추·양파", amount: "부추 한 줌, 양파 ½개", stallIds: ["s-veg1"] },
      { name: "두부", amount: "½모", stallIds: ["s-banchan"] },
      { name: "간장·참기름", amount: "각 1큰술", stallIds: ["s-sauce", "s-grain"] },
    ],
    recipe: {
      servings: 4,
      timeMin: 60,
      difficulty: "보통",
      steps: [
        "두부는 면보로 물기를 꼭 짜고, 부추·양파는 잘게 썬다.",
        "다짐육에 두부·야채·간장·참기름·후추를 넣고 치대어 소를 만든다.",
        "만두피 가장자리에 물을 바르고 소를 한 숟갈씩 넣어 오므린다.",
        "김 오른 찜기에 10분 찌거나, 팬에 구워 군만두로 즐긴다.",
      ],
      tip: "소를 치댈수록 육즙이 안 빠집니다. 최소 3분은 치대세요.",
    },
  },
  {
    id: "gonggalppang",
    name: "공갈빵",
    emoji: "🥯",
    desc: "속이 빈 바삭한 중국식 호떡. 차이나타운의 유산.",
    category: "시장 명물",
    sellerIds: ["s-gonggal"],
    ingredients: [
      { name: "밀가루(중력분)", amount: "2컵", stallIds: ["s-sauce"] },
      { name: "설탕(흑설탕)", amount: "½컵", stallIds: ["s-sauce"] },
      { name: "계란", amount: "1개", stallIds: ["s-egg"] },
      { name: "식용유", amount: "약간", stallIds: ["s-sauce"] },
    ],
    recipe: {
      servings: 4,
      timeMin: 90,
      difficulty: "어려움",
      steps: [
        "밀가루에 이스트·미지근한 물을 넣고 반죽해 40분 발효한다.",
        "반죽을 나눠 흑설탕 소를 넣고 얇게 민다 — 얇을수록 잘 부푼다.",
        "겉면에 계란물을 바르고 오븐(또는 화덕) 220℃에서 부풀 때까지 굽는다.",
        "속이 빵빵하게 부풀면 완성. 깨뜨려 먹는 재미!",
      ],
      tip: "집 오븐으로는 화덕 맛이 어려워요 — 원조공갈빵에서 사 먹는 걸 추천.",
    },
  },
  {
    id: "hodduk",
    name: "씨앗호떡",
    emoji: "🫓",
    desc: "겨울 신포의 손난로. 씨앗 가득 달콤한 속.",
    category: "시장 명물",
    sellerIds: ["s-hodduk"],
    ingredients: [
      { name: "밀가루", amount: "2컵", stallIds: ["s-sauce"] },
      { name: "흑설탕", amount: "½컵", stallIds: ["s-sauce"] },
      { name: "견과·씨앗(해바라기씨 등)", amount: "½컵", stallIds: ["s-dried"] },
      { name: "식용유", amount: "넉넉히", stallIds: ["s-sauce"] },
    ],
    recipe: {
      servings: 4,
      timeMin: 70,
      difficulty: "보통",
      steps: [
        "밀가루·이스트·소금·미지근한 물로 반죽해 1시간 발효한다.",
        "흑설탕+계피+씨앗을 섞어 소를 만든다.",
        "반죽에 소를 넣고 오므린 뒤 기름 두른 팬에 눌러 굽는다.",
        "양면이 노릇해지면 종이컵에 접어 담아 뜨거울 때 먹는다.",
      ],
    },
  },

  /* ═══ 분식 ═══ */
  {
    id: "jjolmyeon",
    name: "쫄면",
    emoji: "🍜",
    desc: "쫄면의 발상지가 바로 인천. 새콤달콤 비빔의 정석.",
    category: "분식",
    sellerIds: ["s-jjolmyeon", "s-mandu"],
    ingredients: [
      { name: "쫄면사리", amount: "2인분", stallIds: ["s-noodle"] },
      { name: "콩나물", amount: "두 줌", stallIds: ["s-veg1"] },
      { name: "양배추·당근·오이", amount: "채썰기 한 줌씩", stallIds: ["s-veg1"] },
      { name: "고추장", amount: "3큰술", stallIds: ["s-sauce"] },
      { name: "설탕·식초", amount: "각 2큰술", stallIds: ["s-sauce"] },
      { name: "참기름", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "계란", amount: "2개", stallIds: ["s-egg"] },
    ],
    recipe: {
      servings: 2,
      timeMin: 25,
      difficulty: "쉬움",
      steps: [
        "고추장·설탕·식초·간장·다진마늘·참기름을 섞어 비빔장을 만들고 냉장고에 재운다.",
        "콩나물은 데치고, 계란은 삶고, 야채는 가늘게 채썬다.",
        "쫄면은 끓는 물에 3~4분 삶아 찬물에 빡빡 헹궈 탱탱하게 만든다.",
        "면 위에 야채·콩나물·반숙계란을 얹고 비빔장을 넣어 비빈다.",
      ],
      tip: "면을 얼음물에 헹구는 게 쫄깃함의 전부입니다.",
    },
  },
  {
    id: "tteokbokki",
    name: "떡볶이",
    emoji: "🌶️",
    desc: "가래떡 뽑는 떡집 옆 즉석 떡볶이.",
    category: "분식",
    sellerIds: ["s-tteokbokki"],
    ingredients: [
      { name: "떡볶이떡", amount: "400g", stallIds: ["s-tteok"] },
      { name: "어묵", amount: "3장", stallIds: ["s-sauce"] },
      { name: "고추장", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "고춧가루·설탕", amount: "각 1큰술", stallIds: ["s-grain", "s-sauce"] },
      { name: "대파", amount: "1대", stallIds: ["s-veg1"] },
      { name: "삶은계란", amount: "2개", stallIds: ["s-egg"] },
      { name: "멸치·다시마(육수)", amount: "한 줌·2장", stallIds: ["s-dried"] },
    ],
    recipe: {
      servings: 2,
      timeMin: 30,
      difficulty: "쉬움",
      steps: [
        "멸치·다시마로 육수 500ml를 10분 우려낸다.",
        "육수에 고추장·고춧가루·설탕·간장을 풀고 끓인다.",
        "떡과 어묵을 넣고 중불에서 국물이 걸쭉해질 때까지 졸인다.",
        "대파·삶은계란을 넣고 한소끔 더 끓이면 완성.",
      ],
      tip: "떡은 미리 물에 담가두면 양념이 잘 뱁니다.",
    },
  },
  {
    id: "gimbap",
    name: "김밥",
    emoji: "🍙",
    desc: "장날 소풍의 맛. 속재료는 시장에서 전부 해결.",
    category: "분식",
    sellerIds: ["s-mandu"],
    ingredients: [
      { name: "김(김밥용)", amount: "10장", stallIds: ["s-dried"] },
      { name: "계란", amount: "4개", stallIds: ["s-egg"] },
      { name: "당근·오이", amount: "각 1개", stallIds: ["s-veg1"] },
      { name: "햄 또는 소고기", amount: "200g", stallIds: ["s-butcher"] },
      { name: "단무지·우엉(반찬)", amount: "1팩", stallIds: ["s-banchan"] },
      { name: "참기름", amount: "2큰술", stallIds: ["s-grain"] },
    ],
    recipe: {
      servings: 4,
      timeMin: 40,
      difficulty: "쉬움",
      steps: [
        "밥에 참기름·소금을 넣고 고슬고슬하게 비벼둔다.",
        "계란지단·당근볶음·오이채·고기볶음 등 속재료를 준비한다.",
        "김 위에 밥을 얇게 펴고 속재료를 가지런히 올린다.",
        "김발로 단단히 말아 참기름을 바르고 한입 크기로 썬다.",
      ],
    },
  },
  {
    id: "japchae",
    name: "잡채",
    emoji: "🥘",
    desc: "잔칫날 단골. 당면은 신포상회, 야채는 신포야채.",
    category: "분식",
    sellerIds: ["s-banchan"],
    ingredients: [
      { name: "당면", amount: "200g", stallIds: ["s-sauce"] },
      { name: "돼지고기(잡채용)", amount: "150g", stallIds: ["s-butcher"] },
      { name: "양파·당근·부추", amount: "양파 1개, 당근 ½개, 부추 한 줌", stallIds: ["s-veg1"] },
      { name: "간장·설탕", amount: "간장 4큰술, 설탕 2큰술", stallIds: ["s-sauce"] },
      { name: "참기름", amount: "2큰술", stallIds: ["s-grain"] },
    ],
    recipe: {
      servings: 4,
      timeMin: 40,
      difficulty: "보통",
      steps: [
        "당면은 미지근한 물에 30분 불린 뒤 끓는 물에 5분 삶는다.",
        "고기와 야채는 각각 간장·설탕으로 밑간해 따로 볶는다.",
        "삶은 당면을 간장·설탕·참기름에 버무리며 팬에서 볶는다.",
        "볶은 재료를 모두 합쳐 참기름·통깨로 마무리한다.",
      ],
      tip: "재료를 '따로 볶아 마지막에 합치기'가 잡채의 정석입니다.",
    },
  },

  /* ═══ 집밥·국물 ═══ */
  {
    id: "kimchijjigae",
    name: "김치찌개",
    emoji: "🍲",
    desc: "신포반찬 묵은지로 끓이는 진짜 집밥.",
    category: "집밥·국물",
    sellerIds: [],
    ingredients: [
      { name: "묵은지(김치)", amount: "½포기", stallIds: ["s-banchan"] },
      { name: "돼지목살", amount: "300g", stallIds: ["s-butcher"] },
      { name: "두부", amount: "1모", stallIds: ["s-banchan"] },
      { name: "대파·양파·청양고추", amount: "각 1개", stallIds: ["s-veg1"] },
      { name: "고춧가루", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "멸치·다시마(육수)", amount: "한 줌·2장", stallIds: ["s-dried"] },
    ],
    recipe: {
      servings: 3,
      timeMin: 40,
      difficulty: "쉬움",
      steps: [
        "냄비에 돼지고기를 먼저 볶아 기름을 낸다.",
        "김치를 넣고 3분 더 볶은 뒤 멸치다시마 육수를 붓는다.",
        "고춧가루·다진마늘을 넣고 중불에서 20분 끓인다.",
        "두부·대파·청양고추를 넣고 5분 더 끓이면 완성.",
      ],
      tip: "김치가 신맛이 강하면 설탕 ½큰술로 균형을 잡으세요.",
    },
  },
  {
    id: "doenjangjjigae",
    name: "된장찌개",
    emoji: "🥣",
    desc: "장 보고 돌아온 저녁, 뚝배기 하나면 충분.",
    category: "집밥·국물",
    sellerIds: [],
    ingredients: [
      { name: "된장", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "두부", amount: "½모", stallIds: ["s-banchan"] },
      { name: "애호박·감자·양파", amount: "각 ½개", stallIds: ["s-veg1"] },
      { name: "조개(바지락)", amount: "한 줌", stallIds: ["s-fish"] },
      { name: "멸치·다시마(육수)", amount: "한 줌·2장", stallIds: ["s-dried"] },
      { name: "청양고추·대파", amount: "각 1개", stallIds: ["s-veg1"] },
    ],
    recipe: {
      servings: 2,
      timeMin: 30,
      difficulty: "쉬움",
      steps: [
        "멸치·다시마 육수 600ml를 우려 된장을 체에 걸러 푼다.",
        "감자·양파를 먼저 넣고 5분 끓인다.",
        "애호박·두부·해감한 바지락을 넣고 7분 더 끓인다.",
        "청양고추·대파로 마무리하고 뚝배기째 낸다.",
      ],
    },
  },
  {
    id: "miyeokguk",
    name: "미역국",
    emoji: "🥬",
    desc: "생일날 아침, 신포수산 미역과 소고기 한 근.",
    category: "집밥·국물",
    sellerIds: [],
    ingredients: [
      { name: "미역(건미역)", amount: "한 줌", stallIds: ["s-fish", "s-dried"] },
      { name: "소고기(국거리)", amount: "200g", stallIds: ["s-butcher"] },
      { name: "참기름", amount: "1큰술", stallIds: ["s-grain"] },
      { name: "간장(국간장)", amount: "2큰술", stallIds: ["s-sauce"] },
      { name: "마늘", amount: "1큰술", stallIds: ["s-veg1"] },
    ],
    recipe: {
      servings: 4,
      timeMin: 40,
      difficulty: "쉬움",
      steps: [
        "미역은 물에 15분 불려 짧게 자른다.",
        "냄비에 참기름을 두르고 소고기를 볶다가 미역을 넣고 2분 더 볶는다.",
        "물 1.2L를 붓고 센불에서 끓어오르면 중불로 20분 끓인다.",
        "국간장·다진마늘로 간을 맞춘다.",
      ],
      tip: "미역을 참기름에 충분히 볶아야 국물이 뽀얗고 고소해요.",
    },
  },
  {
    id: "tteokguk",
    name: "떡국",
    emoji: "🍥",
    desc: "신포방앗간 떡국떡으로 끓이는 설날의 맛.",
    category: "집밥·국물",
    sellerIds: [],
    ingredients: [
      { name: "떡국떡", amount: "400g", stallIds: ["s-grain", "s-tteok"] },
      { name: "소고기(양지)", amount: "200g", stallIds: ["s-butcher"] },
      { name: "계란", amount: "2개", stallIds: ["s-egg"] },
      { name: "대파·마늘", amount: "대파 1대, 마늘 1큰술", stallIds: ["s-veg1"] },
      { name: "김(고명)", amount: "1장", stallIds: ["s-dried"] },
      { name: "간장(국간장)", amount: "2큰술", stallIds: ["s-sauce"] },
    ],
    recipe: {
      servings: 3,
      timeMin: 35,
      difficulty: "쉬움",
      steps: [
        "떡은 찬물에 20분 불린다.",
        "양지를 참기름에 볶다 물 1L를 붓고 15분 끓여 육수를 낸다.",
        "떡을 넣고 떠오를 때까지 끓인 뒤 국간장으로 간한다.",
        "계란지단·김가루·대파를 고명으로 올린다.",
      ],
    },
  },

  /* ═══ 해물·안주 ═══ */
  {
    id: "haemulpajeon",
    name: "해물파전",
    emoji: "🥞",
    desc: "비 오는 날 신포수산 해물 듬뿍. 막걸리는 옵션.",
    category: "해물·안주",
    sellerIds: [],
    ingredients: [
      { name: "부침가루", amount: "2컵", stallIds: ["s-sauce"] },
      { name: "오징어·새우·조개살", amount: "300g", stallIds: ["s-fish"] },
      { name: "쪽파(대파)", amount: "한 단", stallIds: ["s-veg1"] },
      { name: "계란", amount: "2개", stallIds: ["s-egg"] },
      { name: "식용유", amount: "넉넉히", stallIds: ["s-sauce"] },
    ],
    recipe: {
      servings: 2,
      timeMin: 30,
      difficulty: "보통",
      steps: [
        "부침가루와 차가운 물을 1:1로 섞어 반죽을 만든다.",
        "팬에 기름을 넉넉히 두르고 파를 가지런히 깐다.",
        "반죽을 붓고 해물을 골고루 올린 뒤 계란물을 두른다.",
        "센불에서 앞뒤로 바삭하게 부친다 — 뒤집기는 한 번만.",
      ],
      tip: "반죽물이 차가울수록 바삭해집니다. 얼음물 추천.",
    },
  },
  {
    id: "godeungeo",
    name: "고등어구이",
    emoji: "🐟",
    desc: "신포수산 아침 경매 고등어, 소금만 있으면 끝.",
    category: "해물·안주",
    sellerIds: [],
    ingredients: [
      { name: "고등어(손질)", amount: "1마리", stallIds: ["s-fish"] },
      { name: "굵은소금", amount: "약간", stallIds: ["s-sauce"] },
      { name: "식용유", amount: "1큰술", stallIds: ["s-sauce"] },
    ],
    recipe: {
      servings: 2,
      timeMin: 20,
      difficulty: "쉬움",
      steps: [
        "고등어는 물기를 닦고 칼집을 낸 뒤 소금을 뿌려 10분 둔다.",
        "팬에 기름을 두르고 껍질면부터 중불에 굽는다.",
        "6분 뒤 뒤집어 속까지 익힌다 — 뚜껑을 덮으면 촉촉.",
        "레몬이나 무즙을 곁들여 낸다.",
      ],
      tip: "수산상회에서 '구이용 손질'을 부탁하면 집에서 씻을 필요도 없어요.",
    },
  },
  {
    id: "ojingeobokkeum",
    name: "오징어볶음",
    emoji: "🦑",
    desc: "매콤한 밥도둑. 신포수산 생물 오징어로.",
    category: "해물·안주",
    sellerIds: [],
    ingredients: [
      { name: "오징어", amount: "2마리", stallIds: ["s-fish"] },
      { name: "양파·당근·대파", amount: "양파 1개, 당근 ⅓개, 대파 1대", stallIds: ["s-veg1"] },
      { name: "고추장·고춧가루", amount: "고추장 2큰술, 고춧가루 1큰술", stallIds: ["s-sauce", "s-grain"] },
      { name: "설탕·간장", amount: "각 1큰술", stallIds: ["s-sauce"] },
      { name: "참기름", amount: "1큰술", stallIds: ["s-grain"] },
    ],
    recipe: {
      servings: 2,
      timeMin: 25,
      difficulty: "쉬움",
      steps: [
        "오징어는 내장을 빼고 몸통에 칼집을 내어 한입 크기로 썬다.",
        "고추장·고춧가루·설탕·간장·마늘로 양념장을 만든다.",
        "센불에 야채를 먼저 볶다가 오징어와 양념장을 넣는다.",
        "물기 없이 빠르게 2~3분만 볶고 참기름으로 마무리.",
      ],
      tip: "오징어는 오래 볶으면 질겨져요. 센불 단시간이 답.",
    },
  },
  {
    id: "golbaengi",
    name: "골뱅이무침",
    emoji: "🐚",
    desc: "새콤달콤 무침에 소면 곁들여 시장 안주 완성.",
    category: "해물·안주",
    sellerIds: [],
    ingredients: [
      { name: "골뱅이(통조림 가능)", amount: "1캔", stallIds: ["s-dried"] },
      { name: "국수면(소면)", amount: "2인분", stallIds: ["s-noodle"] },
      { name: "오이·양파·당근", amount: "오이 1개, 양파 ½개", stallIds: ["s-veg1"] },
      { name: "고추장·식초·설탕", amount: "고추장 3큰술, 식초·설탕 각 2큰술", stallIds: ["s-sauce"] },
      { name: "참기름", amount: "1큰술", stallIds: ["s-grain"] },
    ],
    recipe: {
      servings: 2,
      timeMin: 20,
      difficulty: "쉬움",
      steps: [
        "고추장·식초·설탕·고춧가루·다진마늘로 새콤달콤 양념장을 만든다.",
        "골뱅이는 반 갈라 씻고, 야채는 어슷하게 썬다.",
        "골뱅이·야채를 양념장에 조물조물 무친다.",
        "소면을 삶아 찬물에 헹궈 곁들이고 참기름·통깨로 마무리.",
      ],
    },
  },
];

export function stallById(id: string): Stall | undefined {
  return STALLS.find((s) => s.id === id);
}

export function menusByCategory(cat: string): Menu[] {
  return MENUS.filter((m) => m.category === cat);
}

/* ── Real-world georeferencing ──────────────────────────────────────────
 *   x: 0(서문) → 100(동문)  ≈ lng 126.62520 → 126.62800
 *   y: 0(북)  → 60(남)     ≈ lat 37.47185 → 37.47085
 */
export const MARKET_CENTER: [number, number] = [37.47135, 126.6266];

export function stallLatLng(s: Stall): [number, number] {
  const lat = 37.47185 - (s.y / 60) * (37.47185 - 37.47085);
  const lng = 126.6252 + (s.x / 100) * (126.628 - 126.6252);
  return [lat, lng];
}
