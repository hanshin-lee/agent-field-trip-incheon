/**
 * 신포국제시장 (Sinpo International Market, 인천 중구) — curated field data.
 *
 * The market is modelled as a simplified schematic: one main covered arcade
 * running east–west, a cross alley, and stalls on both sides. Coordinates are
 * schematic (0–100 x, 0–60 y), not GPS — the point is wayfinding inside the
 * maze, not geodesy. Positions were sketched from the on-site field visit
 * (evidence/field-notes/).
 */

export type StallKind = "food" | "ingredient";

export interface Stall {
  id: string;
  name: string;
  kind: StallKind;
  /** what it sells, in Korean, used for matching + display */
  items: string[];
  /** schematic coords, 0–100 x (west→east), 0–60 y (north→south) */
  x: number;
  y: number;
  zone: "본길-북" | "본길-남" | "사잇길" | "동문쪽" | "서문쪽";
}

export interface Menu {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  /** stalls that sell the finished dish */
  sellerIds: string[];
  /** ingredients you'd buy to make it yourself, each mapped to stalls */
  ingredients: { name: string; stallIds: string[] }[];
}

export const STALLS: Stall[] = [
  // ── 서문쪽 (west entrance) ──
  { id: "s-mandu", name: "신포우리만두 본점", kind: "food", items: ["만두", "쫄면", "김밥"], x: 8, y: 18, zone: "서문쪽" },
  { id: "s-hodduk", name: "씨앗호떡집", kind: "food", items: ["호떡", "씨앗호떡"], x: 8, y: 38, zone: "서문쪽" },

  // ── 본길 북측 (main arcade, north row) ──
  { id: "s-dakgangjeong", name: "신포닭강정 본점", kind: "food", items: ["닭강정"], x: 22, y: 14, zone: "본길-북" },
  { id: "s-jjolmyeon", name: "청실홍실", kind: "food", items: ["쫄면", "만두", "콩국수"], x: 34, y: 14, zone: "본길-북" },
  { id: "s-veg1", name: "신포야채", kind: "ingredient", items: ["양배추", "당근", "오이", "콩나물", "대파", "마늘", "양파", "부추"], x: 46, y: 14, zone: "본길-북" },
  { id: "s-butcher", name: "중앙정육점", kind: "ingredient", items: ["닭고기", "돼지고기", "소고기", "닭날개"], x: 58, y: 14, zone: "본길-북" },
  { id: "s-gonggal", name: "원조공갈빵", kind: "food", items: ["공갈빵", "중국빵"], x: 70, y: 14, zone: "본길-북" },
  { id: "s-grain", name: "신포방앗간", kind: "ingredient", items: ["고춧가루", "참기름", "들기름", "미숫가루", "떡국떡"], x: 82, y: 14, zone: "본길-북" },

  // ── 본길 남측 (main arcade, south row) ──
  { id: "s-fish", name: "신포수산", kind: "ingredient", items: ["고등어", "갈치", "오징어", "새우", "조개"], x: 22, y: 42, zone: "본길-남" },
  { id: "s-dried", name: "건어물상회", kind: "ingredient", items: ["멸치", "다시마", "김", "건새우", "황태"], x: 34, y: 42, zone: "본길-남" },
  { id: "s-tteok", name: "신포떡집", kind: "ingredient", items: ["떡볶이떡", "가래떡", "인절미", "송편"], x: 46, y: 42, zone: "본길-남" },
  { id: "s-banchan", name: "신포반찬", kind: "food", items: ["반찬", "김치", "젓갈", "장아찌"], x: 58, y: 42, zone: "본길-남" },
  { id: "s-tteokbokki", name: "할머니떡볶이", kind: "food", items: ["떡볶이", "순대", "튀김", "어묵"], x: 70, y: 42, zone: "본길-남" },
  { id: "s-sauce", name: "신포상회(양념·잡화)", kind: "ingredient", items: ["고추장", "간장", "물엿", "식용유", "밀가루", "설탕", "튀김가루", "어묵"], x: 82, y: 42, zone: "본길-남" },

  // ── 사잇길 (cross alley) ──
  { id: "s-egg", name: "계란도매", kind: "ingredient", items: ["계란", "메추리알"], x: 52, y: 28, zone: "사잇길" },
  { id: "s-noodle", name: "국수공장", kind: "ingredient", items: ["쫄면사리", "국수면", "칼국수면", "만두피"], x: 64, y: 28, zone: "사잇길" },

  // ── 동문쪽 (east entrance) ──
  { id: "s-juice", name: "신포과일주스", kind: "food", items: ["과일주스", "과일"], x: 93, y: 18, zone: "동문쪽" },
  { id: "s-chicken2", name: "원조신포닭강정", kind: "food", items: ["닭강정", "치킨"], x: 93, y: 38, zone: "동문쪽" },
];

export const MENUS: Menu[] = [
  {
    id: "dakgangjeong",
    name: "닭강정",
    emoji: "🍗",
    desc: "신포시장의 시그니처. 달콤매콤 소스의 원조.",
    sellerIds: ["s-dakgangjeong", "s-chicken2"],
    ingredients: [
      { name: "닭고기", stallIds: ["s-butcher"] },
      { name: "튀김가루·물엿", stallIds: ["s-sauce"] },
      { name: "고춧가루", stallIds: ["s-grain"] },
      { name: "마늘·대파", stallIds: ["s-veg1"] },
    ],
  },
  {
    id: "jjolmyeon",
    name: "쫄면",
    emoji: "🍜",
    desc: "쫄면의 발상지가 바로 인천. 새콤달콤 비빔의 정석.",
    sellerIds: ["s-jjolmyeon", "s-mandu"],
    ingredients: [
      { name: "쫄면사리", stallIds: ["s-noodle"] },
      { name: "콩나물·양배추·당근·오이", stallIds: ["s-veg1"] },
      { name: "고추장·설탕", stallIds: ["s-sauce"] },
      { name: "참기름", stallIds: ["s-grain"] },
      { name: "계란", stallIds: ["s-egg"] },
    ],
  },
  {
    id: "mandu",
    name: "만두",
    emoji: "🥟",
    desc: "김이 오르는 찜기 앞 줄서기. 60년 전통.",
    sellerIds: ["s-mandu", "s-jjolmyeon"],
    ingredients: [
      { name: "만두피", stallIds: ["s-noodle"] },
      { name: "돼지고기", stallIds: ["s-butcher"] },
      { name: "부추·양파", stallIds: ["s-veg1"] },
      { name: "간장·참기름", stallIds: ["s-sauce", "s-grain"] },
    ],
  },
  {
    id: "tteokbokki",
    name: "떡볶이",
    emoji: "🌶️",
    desc: "가래떡 뽑는 떡집 옆 즉석 떡볶이.",
    sellerIds: ["s-tteokbokki"],
    ingredients: [
      { name: "떡볶이떡", stallIds: ["s-tteok"] },
      { name: "어묵·고추장·설탕", stallIds: ["s-sauce"] },
      { name: "대파", stallIds: ["s-veg1"] },
      { name: "삶은계란", stallIds: ["s-egg"] },
      { name: "멸치·다시마 육수", stallIds: ["s-dried"] },
    ],
  },
  {
    id: "gonggalppang",
    name: "공갈빵",
    emoji: "🥯",
    desc: "속이 빈 바삭한 중국식 호떡. 차이나타운의 유산.",
    sellerIds: ["s-gonggal"],
    ingredients: [
      { name: "밀가루·설탕·식용유", stallIds: ["s-sauce"] },
      { name: "계란", stallIds: ["s-egg"] },
    ],
  },
];

export function stallById(id: string): Stall | undefined {
  return STALLS.find((s) => s.id === id);
}
