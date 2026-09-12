# HANDOFF — live relay state

**This file is the baton.** When your agent runs out of tokens, the next person
reads this file and keeps going without re-deriving anything. Keep it honest and
keep it current; a stale handoff costs more than no handoff.

Update it **before** you run `npm run handoff`.

---

## Now

- **Holder:** _(your name — who is actively driving right now)_
- **Last updated:** _(run `npm run handoff`, it stamps this)_
- **Provider in use:** `google` _(google | openai | anthropic | runyour)_

## The mission (fill in at 11:10)

> _Paste the mission exactly as announced. Do not paraphrase — the next agent
> anchors on this._

## What we discovered in the field

> _The observation the service is built on. One or two lines. This is a
> completion requirement, so write it down the moment you find it._
>
> Photo/memo lives at: `evidence/field-notes/`

## Done

- [x] Repo scaffolded, deploys to Vercel, `/api/health` reports provider keys

## In flight

- [ ] _(what the current holder is mid-way through — be specific about the file)_

## Next

- [ ] _(the next concrete step, so a fresh agent starts without asking)_

## Decisions already made — do not re-litigate

- Next.js on Vercel, because a push from a phone becomes a live URL.
- Provider is a single env switch (`AGENT_PROVIDER`); swap it, don't rewrite code.
- Build never blocks on type/lint errors (see `next.config.ts`).

## Blockers

- _(anything stuck, with what you already tried)_
