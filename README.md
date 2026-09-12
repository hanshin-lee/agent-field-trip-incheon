# Agent Field Trip 2026: Incheon

Team repo for the GDG Incheon on-site Agent hackathon, **2026.09.12**.

> 인천의 현장에서 발견한 장소 경험 하나를 Agent와 함께 작동하는 서비스로.

**Submission deadline: 13:45 KST.** Full brief in [`docs/EVENT.md`](docs/EVENT.md).

## Start in 60 seconds

```bash
git clone <this-repo> && cd agent-field-trip-incheon
npm install
cp .env.example .env.local   # paste the token you were handed at 10:45
npm run dev                  # → http://localhost:3000
```

Check `http://localhost:3000/api/health` first. If `available` is empty, your
`.env.local` is wrong — fix that before debugging anything else.

## Taking over from a teammate

Each of us has a finite token budget. When one runs out, the next picks up:

```bash
npm run pickup            # pull + print the current state, then read it
# ...do the next thing...
npm run handoff "Name"    # stamp, commit WIP, push
```

The protocol and its rules are in [`docs/TOKEN-RELAY.md`](docs/TOKEN-RELAY.md).
[`HANDOFF.md`](HANDOFF.md) is the baton — keep it current.

## Switching AI provider

One env var, no code change:

```bash
AGENT_PROVIDER=google   # google | openai | anthropic | runyour
```

Quota died mid-build? Change it in Vercel env and redeploy.

## Completion evidence

Deploy failure is forgiven; missing evidence is not. Drop field photos, captures,
and recordings into [`evidence/`](evidence/) **as you collect them**.

## Stack

Next.js 15 · TypeScript · Tailwind v4 · Vercel AI SDK · deployed on Vercel.
Powered by Runyour Agent (몬드리안에이아이).
