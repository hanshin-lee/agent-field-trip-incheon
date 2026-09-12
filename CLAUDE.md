# Agent Field Trip 2026: Incheon

You are helping a 3-person team build **one working service** during a one-day
on-site hackathon. Read this file, then `HANDOFF.md`, before doing anything else.

## Situation

- **Submission deadline: 13:45 KST today (2026-09-12).** Everything is judged
  against that clock.
- The team is **in the field in 동인천**, driving you from **mobile**. Assume
  small screens, flaky network, and no patience for long explanations.
- Three people share this repo and relay the work as each runs out of tokens.
  See `docs/TOKEN-RELAY.md`.

## What "done" means

Three things, all required (`docs/EVENT.md`):

1. A photo or memo from the field → `evidence/field-notes/`
2. One **working** core service reflecting that discovery
3. A record of what was delegated to the Agent → `HANDOFF.md`

Deploy failure is forgiven. Repo + screen recording + captures count as
completion. **So when the clock gets tight, capture evidence before you chase a
green deploy.**

## How to work here

- **Ship over polish.** A rough thing that runs beats an elegant thing that does
  not. The judging criteria weight discovery and delegation over technical
  difficulty.
- **Do not re-scaffold.** The stack is settled: Next.js + TypeScript on Vercel.
  Do not migrate, do not restructure, do not swap the styling approach.
- **Small commits, pushed often.** A teammate may take over at any moment. Commit
  work-in-progress; `next.config.ts` deliberately ignores type and lint errors so
  a build never dies on a technicality.
- **Update `HANDOFF.md` as you go**, not at the end. It is the only thing that
  survives a token wipe.
- **Ask before rewriting anything that already works.** Tokens are the scarcest
  resource in the building today.

## Provider switching

Every participant gets Gemini, ChatGPT, and Claude tokens. `lib/providers.ts`
puts all of them behind one env var:

```bash
AGENT_PROVIDER=google   # google | openai | anthropic | runyour
```

If a quota dies, change that variable and redeploy. Do not write per-provider
branches in feature code. `GET /api/health` reports which keys are actually
present — check it first when something fails.

**Runyour Agent** (몬드리안AI) is the event sponsor platform. It is not an AI SDK
provider, so it has a plain `fetch` seam in `callRunyour()`. Shape that request
to whatever the 10:45 setup session specifies.

## Layout

```
app/page.tsx            UI — replace the placeholder once the mission lands
app/api/agent/route.ts  POST { prompt, provider? } → { text }
app/api/health/route.ts GET → which provider keys are live
lib/providers.ts        the one provider switch
HANDOFF.md              live relay state — the baton
docs/EVENT.md           mission, timetable, completion criteria
docs/TOKEN-RELAY.md     how the three-way handoff works
evidence/               completion proof
```

## Secrets

Keys go in `.env.local` (git-ignored) and Vercel env vars. **Never commit a key.**
The repo is public.
