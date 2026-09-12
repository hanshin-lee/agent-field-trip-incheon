"use client";

import { useEffect, useMemo, useState } from "react";
import MarketMap from "./MarketMap";
import { MENUS, stallById } from "@/lib/market";

export default function Home() {
  const [menuId, setMenuId] = useState<string | null>(null);

  // shareable deep link: /?menu=jjolmyeon
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("menu");
    if (q && MENUS.some((m) => m.id === q)) setMenuId(q);
  }, []);
  const [selectedStallId, setSelectedStallId] = useState<string | null>(null);
  const [route, setRoute] = useState("");
  const [busy, setBusy] = useState(false);

  const menu = MENUS.find((m) => m.id === menuId) ?? null;

  const highlightSellers = useMemo(
    () => new Set(menu?.sellerIds ?? []),
    [menu],
  );
  const highlightIngredients = useMemo(() => {
    const ids = new Set<string>();
    menu?.ingredients.forEach((i) => i.stallIds.forEach((id) => ids.add(id)));
    return ids;
  }, [menu]);

  const selectedStall = selectedStallId ? stallById(selectedStallId) : null;

  async function askRoute() {
    if (!menu) return;
    setBusy(true);
    setRoute("");
    try {
      const stops = [
        ...menu.ingredients.flatMap((i) =>
          i.stallIds.map((id) => {
            const s = stallById(id)!;
            return `${s.name}(${s.zone}, x=${s.x}) — ${i.name}`;
          }),
        ),
      ];
      const sellers = menu.sellerIds.map((id) => stallById(id)!.name).join(", ");
      const prompt = [
        `너는 인천 신포국제시장 단골 상인이다. 처음 온 손님에게 "${menu.name}" 재료 장보기 코스를 짜준다.`,
        `시장 구조: 서문(x=0)에서 동문(x=100)으로 이어지는 중앙 아케이드 하나, 중간(x=53~63)에 사잇길.`,
        `들를 가게 (위치 x값 순서로 동선 최적화할 것):`,
        ...stops.map((s) => `- ${s}`),
        `완제품을 파는 집: ${sellers}`,
        `출력: ①걷는 순서대로 번호 매긴 코스(각 가게에서 살 것 + 한 줄 팁) ②마지막에 "직접 만들기 귀찮다면" 완제품 집 추천 한 줄. 전체 8줄 이내, 반말 금지, 이모지 소량.`,
      ].join("\n");

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setRoute(data.error ? `⚠ ${data.error}` : data.text);
    } catch (err) {
      setRoute(`⚠ ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-6 pb-16 pt-10">
      {/* hero — sculptural headline on the void */}
      <header>
        <p className="nav-label text-[var(--color-saffron-spark)]">
          인천 중구 · 신포국제시장
        </p>
        <h1 className="display-tight mt-4 text-[44px] leading-[1.05] sm:text-[56px]">
          신포
          <br />
          장보기 지도
        </h1>
        <p className="body-light mt-6 max-w-[480px] text-[17px] leading-relaxed text-[var(--color-silver-mist)]">
          먹고 싶은 메뉴를 고르면, 미로 같은 시장에서{" "}
          <span className="font-normal text-[var(--color-electric-iris)]">파는 집</span>과{" "}
          <span className="font-normal text-[var(--color-saffron-spark)]">재료 파는 가게</span>가
          별자리처럼 켜집니다.
        </p>
      </header>

      {/* menu chips — ghost pills, active = white on void */}
      <section className="-mx-1 mt-10 flex gap-2 overflow-x-auto px-1 pb-1">
        {MENUS.map((m) => {
          const active = m.id === menuId;
          return (
            <button
              key={m.id}
              onClick={() => {
                setMenuId(active ? null : m.id);
                setSelectedStallId(null);
                setRoute("");
              }}
              className={`nav-label shrink-0 rounded-full px-5 py-3 transition-all ${
                active
                  ? "bg-[var(--color-bone-white)] text-[var(--color-void)]"
                  : "text-[var(--color-ash-gray)] active:scale-95"
              }`}
            >
              {m.emoji} {m.name}
            </button>
          );
        })}
      </section>

      {/* the constellation map — floats directly on the void, no card */}
      <section className="mt-8">
        <MarketMap
          highlightSellers={highlightSellers}
          highlightIngredients={highlightIngredients}
          selectedStallId={selectedStallId}
          onSelect={setSelectedStallId}
        />
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-[var(--color-ash-gray)]">
          <Legend color="var(--color-electric-iris)" label={menu ? `${menu.name} 파는 집` : "먹거리"} strong={!!menu} />
          <Legend color="var(--color-saffron-spark)" label={menu ? "재료 가게" : "식재료"} strong={!!menu} />
          <span className="body-light ml-auto">핀을 눌러 가게 정보 보기</span>
        </div>
      </section>

      {/* stall detail — floats with whitespace only */}
      {selectedStall && (
        <section className="mt-10">
          <p className="nav-label text-[var(--color-electric-iris)]">{selectedStall.zone}</p>
          <h2 className="display-tight mt-2 text-[27px] leading-none">{selectedStall.name}</h2>
          <p className="body-light mt-3 text-[17px] leading-relaxed text-[var(--color-silver-mist)]">
            {selectedStall.items.join(" · ")}
          </p>
        </section>
      )}

      {/* menu breakdown — typographic blocks, zero containers */}
      {menu && (
        <>
          <section className="mt-14">
            <p className="nav-label text-[var(--color-electric-iris)]">바로 사 먹기</p>
            <ul className="mt-4 flex flex-col gap-3">
              {menu.sellerIds.map((id) => {
                const s = stallById(id)!;
                return (
                  <li key={id}>
                    <button
                      onClick={() => setSelectedStallId(id)}
                      className="display-tight text-left text-[24px] leading-tight text-[var(--color-bone-white)] underline-offset-4 active:underline"
                    >
                      {s.name}
                      <span className="body-light ml-3 text-[14px] tracking-normal text-[var(--color-ash-gray)]">
                        {s.zone}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mt-14">
            <p className="nav-label text-[var(--color-saffron-spark)]">직접 만들기 — 재료 지도</p>
            <ul className="mt-4 flex flex-col gap-4">
              {menu.ingredients.map((ing) => (
                <li key={ing.name} className="leading-snug">
                  <span className="text-[17px] font-normal">{ing.name}</span>
                  <div className="body-light mt-0.5 text-[15px] text-[var(--color-silver-mist)]">
                    {ing.stallIds.map((id, i) => {
                      const s = stallById(id)!;
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedStallId(id)}
                          className="text-[var(--color-saffron-spark)] underline-offset-2 active:underline"
                        >
                          {i > 0 ? ", " : ""}
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* the single violet pill — sole primary action */}
          <button
            onClick={askRoute}
            disabled={busy}
            className="nav-label mt-14 rounded-full bg-[var(--color-electric-iris)] px-6 py-4 text-[var(--color-bone-white)] transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            {busy ? "코스 짜는 중…" : `${menu.name} 장보기 코스 요청`}
          </button>

          {route && (
            <section className="body-light mt-8 whitespace-pre-wrap text-[16px] leading-relaxed text-[var(--color-silver-mist)]">
              {route}
            </section>
          )}
        </>
      )}

      {!menu && (
        <p className="body-light mt-14 text-center text-[15px] text-[var(--color-ash-gray)]">
          위에서 메뉴를 골라보세요 — 지도의 별들이 켜집니다.
        </p>
      )}

      <footer className="nav-label mt-auto pt-16 text-center text-[10px] leading-relaxed text-[var(--color-ash-gray)]">
        Agent Field Trip 2026
        <br />
        GDG Incheon · 신포국제시장
      </footer>
    </main>
  );
}

function Legend({ color, label, strong }: { color: string; label: string; strong: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: color, opacity: strong ? 1 : 0.45 }}
      />
      {label}
    </span>
  );
}
