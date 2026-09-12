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
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-5 p-5">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          인천 중구 · 신포국제시장
        </p>
        <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-tight">
          신포 장보기 지도
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
          먹고 싶은 메뉴를 고르면, 미로 같은 시장에서{" "}
          <span className="font-semibold text-[var(--accent)]">파는 집</span>과{" "}
          <span className="font-semibold text-[var(--green)]">재료 파는 가게</span>를
          바로 짚어드립니다.
        </p>
      </header>

      {/* menu chips */}
      <section className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
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
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                active
                  ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] shadow-sm"
                  : "border-[var(--line)] bg-[var(--card)] text-[var(--fg)] active:scale-95"
              }`}
            >
              {m.emoji} {m.name}
            </button>
          );
        })}
      </section>

      {/* map card */}
      <section className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3 shadow-[0_1px_3px_rgba(28,25,23,0.06)]">
        <MarketMap
          highlightSellers={highlightSellers}
          highlightIngredients={highlightIngredients}
          selectedStallId={selectedStallId}
          onSelect={setSelectedStallId}
        />
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[11px] text-[var(--muted)]">
          <Legend color="var(--accent)" label={menu ? `${menu.name} 파는 집` : "먹거리"} strong={!!menu} />
          <Legend color="var(--green)" label={menu ? "재료 가게" : "식재료"} strong={!!menu} />
          <span className="ml-auto">핀을 눌러 가게 정보 보기</span>
        </div>
      </section>

      {/* stall detail */}
      {selectedStall && (
        <section className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-base font-bold">{selectedStall.name}</h2>
            <span className="text-[11px] font-medium text-[var(--muted)]">{selectedStall.zone}</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
            {selectedStall.items.join(" · ")}
          </p>
        </section>
      )}

      {/* menu breakdown */}
      {menu && (
        <section className="flex flex-col gap-3">
          <div className="rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent-soft)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
              바로 사 먹기
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {menu.sellerIds.map((id) => {
                const s = stallById(id)!;
                return (
                  <li key={id}>
                    <button
                      onClick={() => setSelectedStallId(id)}
                      className="text-left text-sm font-semibold underline-offset-2 active:underline"
                    >
                      {s.name} <span className="font-normal text-[var(--muted)]">· {s.zone}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--green-soft)] bg-[var(--green-soft)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--green)]">
              직접 만들기 — 재료 지도
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {menu.ingredients.map((ing) => (
                <li key={ing.name} className="text-sm leading-snug">
                  <span className="font-semibold">{ing.name}</span>
                  <span className="text-[var(--muted)]">
                    {" → "}
                    {ing.stallIds.map((id, i) => {
                      const s = stallById(id)!;
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedStallId(id)}
                          className="underline-offset-2 active:underline"
                        >
                          {i > 0 ? ", " : ""}
                          {s.name}
                        </button>
                      );
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={askRoute}
            disabled={busy}
            className="rounded-2xl bg-[var(--fg)] px-4 py-3.5 text-base font-bold text-[var(--bg)] shadow-sm transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            {busy ? "코스 짜는 중…" : `🧺 Agent에게 ${menu.name} 장보기 코스 부탁하기`}
          </button>

          {route && (
            <section className="whitespace-pre-wrap rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 text-sm leading-relaxed">
              {route}
            </section>
          )}
        </section>
      )}

      {!menu && (
        <p className="rounded-2xl border border-dashed border-[var(--line)] p-4 text-center text-sm text-[var(--muted)]">
          위에서 메뉴를 골라보세요 — 지도에 파는 집과 재료 가게가 켜집니다.
        </p>
      )}

      <footer className="mt-auto pt-4 text-center text-[11px] text-[var(--muted)]">
        Agent Field Trip 2026 · GDG Incheon · 신포국제시장에서
      </footer>
    </main>
  );
}

function Legend({ color, label, strong }: { color: string; label: string; strong: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ background: color, opacity: strong ? 1 : 0.45 }}
      />
      {label}
    </span>
  );
}
