"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MENUS, stallById } from "@/lib/market";

// Leaflet touches `window` — client-only
const MarketMap = dynamic(() => import("./MarketMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-[20px] border border-[var(--color-stone)] bg-[var(--color-warm-taupe)]">
      <span className="body-copy text-[14px] text-[var(--color-ash)]">지도를 펼치는 중…</span>
    </div>
  ),
});

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
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-5 pb-14 pt-9">
      {/* hero — whisper-weight editorial headline on paper */}
      <header>
        <p className="label-quiet">인천 중구 · 신포국제시장</p>
        <h1 className="display-whisper mt-3 text-[40px] leading-[1.08] sm:text-[48px]">
          오늘 뭐 먹지?
          <br />
          시장이 답해요.
        </h1>
        <p className="body-copy mt-5 max-w-[480px] text-[16px] leading-relaxed text-[var(--color-smoke)]">
          미로 같은 신포시장, 헤매지 마세요. 먹고 싶은 메뉴를 고르면 파는 집과
          재료 가게를 지도에 바로 짚어드립니다 — 단골처럼 장 보세요.
        </p>
      </header>

      {/* menu pills — outline pills, active = ink fill */}
      <section className="-mx-1 mt-8 flex gap-2 overflow-x-auto px-1 pb-1">
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
              className={`body-copy shrink-0 rounded-full border px-4 py-2.5 text-[14px] font-medium transition-all ${
                active
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-eggshell)]"
                  : "border-[var(--color-stone)] bg-[var(--color-eggshell)] text-[var(--color-ink)] active:scale-95"
              }`}
              style={!active ? { boxShadow: "var(--shadow-subtle)" } : undefined}
            >
              {m.emoji} {m.name}
            </button>
          );
        })}
      </section>

      {/* the map — the one place violet & orange sparks live */}
      <section className="mt-7">
        <MarketMap
          highlightSellers={highlightSellers}
          highlightIngredients={highlightIngredients}
          selectedStallId={selectedStallId}
          onSelect={setSelectedStallId}
        />
        <div className="body-copy mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[12px] text-[var(--color-smoke)]">
          <Legend color="var(--color-violet-spark)" label={menu ? `${menu.name} 파는 집` : "먹거리"} strong={!!menu} />
          <Legend color="var(--color-ember-orange)" label={menu ? "재료 가게" : "식재료"} strong={!!menu} />
          <span className="ml-auto text-[var(--color-ash)]">핀을 눌러 가게 구경하기</span>
        </div>
      </section>

      {/* stall detail — white card, whisper shadow */}
      {selectedStall && (
        <section
          className="mt-6 rounded-[20px] bg-[var(--color-eggshell)] p-5"
          style={{ boxShadow: "var(--shadow-subtle)" }}
        >
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="display-whisper text-[24px]">{selectedStall.name}</h2>
            <span className="label-quiet">{selectedStall.zone}</span>
          </div>
          <p className="body-copy mt-2 text-[14px] leading-relaxed text-[var(--color-smoke)]">
            {selectedStall.items.join(" · ")}
          </p>
        </section>
      )}

      {/* menu breakdown — taupe feature cards, flat, 20px radius */}
      {menu && (
        <>
          <section className="mt-8 rounded-[20px] bg-[var(--color-warm-taupe)] p-7">
            <p className="label-quiet">바로 사 먹기</p>
            <ul className="mt-4 flex flex-col gap-3">
              {menu.sellerIds.map((id) => {
                const s = stallById(id)!;
                return (
                  <li key={id}>
                    <button
                      onClick={() => setSelectedStallId(id)}
                      className="display-whisper text-left text-[22px] leading-tight text-[var(--color-ink)] underline-offset-4 active:underline"
                    >
                      {s.name}
                      <span className="body-copy ml-2.5 text-[13px] font-normal tracking-normal text-[var(--color-ash)]">
                        {s.zone}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mt-4 rounded-[20px] bg-[var(--color-warm-taupe)] p-7">
            <p className="label-quiet">직접 만들어 먹기 — 장바구니</p>
            <ul className="mt-4 flex flex-col gap-0">
              {menu.ingredients.map((ing, idx) => (
                <li
                  key={ing.name}
                  className={`py-3 ${idx > 0 ? "border-t border-[var(--color-stone)]" : ""}`}
                >
                  <span className="body-copy text-[15px] font-medium text-[var(--color-graphite)]">
                    {ing.name}
                  </span>
                  <div className="body-copy mt-0.5 text-[14px] text-[var(--color-smoke)]">
                    {ing.stallIds.map((id, i) => {
                      const s = stallById(id)!;
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedStallId(id)}
                          className="underline decoration-[var(--color-stone)] underline-offset-2 active:decoration-[var(--color-ink)]"
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

          {/* single ink pill — primary action */}
          <button
            onClick={askRoute}
            disabled={busy}
            className="body-copy mt-6 rounded-full border border-[#e5e5e5] bg-[var(--color-ink)] px-6 py-3.5 text-[15px] font-medium text-[var(--color-eggshell)] transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            {busy ? "단골 아주머니께 여쭤보는 중…" : `🧺 ${menu.name} 장보기 코스 추천받기`}
          </button>

          {route && (
            <section
              className="body-copy mt-5 whitespace-pre-wrap rounded-[20px] bg-[var(--color-eggshell)] p-5 text-[14px] leading-relaxed text-[var(--color-graphite)]"
              style={{ boxShadow: "var(--shadow-subtle)" }}
            >
              {route}
            </section>
          )}
        </>
      )}

      {!menu && (
        <p className="body-copy mt-10 rounded-[20px] border border-dashed border-[var(--color-stone)] p-6 text-center text-[14px] text-[var(--color-ash)]">
          위에서 오늘의 메뉴를 골라보세요 — 시장 골목이 환해집니다.
        </p>
      )}

      <footer className="mt-auto border-t border-[var(--color-stone)] pt-6 text-center">
        <p className="label-quiet">Agent Field Trip 2026 · GDG Incheon</p>
        <p className="body-copy mt-1 text-[12px] text-[var(--color-ash)]">
          신포국제시장에서, 사람 냄새 나는 장보기
        </p>
      </footer>
    </main>
  );
}

function Legend({ color, label, strong }: { color: string; label: string; strong: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full border border-[var(--color-eggshell)]"
        style={{ background: color, opacity: strong ? 1 : 0.4, boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
      />
      {label}
    </span>
  );
}
