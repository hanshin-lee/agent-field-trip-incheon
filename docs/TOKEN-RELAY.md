# Token relay — how three people share one build

The constraint: each of us has a finite token budget. When one runs dry, the
work must continue from exactly where it stopped, not from a re-explanation.

Git carries the code. **`HANDOFF.md` carries the context.** Code without context
means the next agent burns half its budget rediscovering what you already knew.

## Passing the baton

Do this when you're at roughly **20% of your budget** — not at zero. Writing a
good handoff costs tokens too, and running out mid-sentence wastes the relay.

```bash
# 1. Update HANDOFF.md by hand: Now / In flight / Next / Blockers
# 2. Then:
npm run handoff "Your Name"
```

That stamps the timestamp, commits everything including work-in-progress, and
pushes.

## Taking the baton

```bash
npm run pickup
```

Pulls, installs if needed, and prints the full handoff state plus recent commits.
**Read it before spending a token.** Then put your name in `Now → Holder`.

## Rules that keep this from falling apart

1. **One holder at a time.** Two people driving agents against the same branch
   produces conflicts you cannot afford at 13:00. Say "I have the baton" in the
   team chat.
2. **Commit broken code.** A WIP commit that pushes is worth more than clean code
   stuck on a dead laptop. The build ignores type errors on purpose.
3. **Write decisions down, not just code.** The "Decisions already made" section
   exists so nobody re-argues the stack at 12:30.
4. **Push evidence as you go.** Photos and recordings into `evidence/` on every
   handoff. Completion does not depend on deploy succeeding.
5. **Switch provider, not code.** If your Gemini quota dies, set
   `AGENT_PROVIDER=openai` in Vercel env and redeploy. One variable.

## If you are an AI agent picking this up

Read `CLAUDE.md` first, then `HANDOFF.md`. Do not re-scaffold, do not re-choose
the stack, do not refactor what already works. Your job is the next unchecked box
under **Next**.
