"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setAnswer("");
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAnswer(data.error ? `⚠ ${data.error}` : data.text);
    } catch (err) {
      setAnswer(`⚠ ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-6">
      <header className="border-b border-[var(--line)] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          GDG Incheon · 2026.09.12
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Agent Field Trip: Incheon</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          개발자는 현장으로, Agent는 서버에.
        </p>
      </header>

      {/* Replace this block once the 11:10 mission lands. The plumbing below
          (provider switch, error surface, mobile layout) is what you keep. */}
      <section className="flex flex-col gap-3">
        <label htmlFor="prompt" className="text-sm text-[var(--muted)]">
          현장에서 발견한 것을 Agent에게 맡겨보세요
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="예) 동인천 개항장 거리에서 찍은 간판 사진 속 가게를 정리해줘"
          className="w-full rounded-lg border border-[var(--line)] bg-black/30 p-3 text-base outline-none focus:border-[var(--accent)]"
        />
        <button
          onClick={run}
          disabled={busy || !prompt.trim()}
          className="rounded-lg bg-[var(--accent)] px-4 py-3 text-base font-medium text-white disabled:opacity-40"
        >
          {busy ? "실행 중…" : "Agent 실행"}
        </button>
      </section>

      {answer && (
        <section className="whitespace-pre-wrap rounded-lg border border-[var(--line)] bg-black/20 p-4 text-sm leading-relaxed">
          {answer}
        </section>
      )}

      <footer className="mt-auto pt-6 text-xs text-[var(--muted)]">
        Powered by Runyour Agent · 제출 마감 13:45
      </footer>
    </main>
  );
}
