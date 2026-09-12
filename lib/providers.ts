import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export type ProviderName = "google" | "openai" | "anthropic" | "runyour";

/**
 * One switch for every token the event hands out. Set AGENT_PROVIDER in
 * .env.local and the whole app follows — no code change when you swap
 * providers mid-day because one team member's quota ran dry.
 */
export function resolveModel(provider: ProviderName = currentProvider()) {
  switch (provider) {
    case "google":
      return google("gemini-2.5-flash");
    case "openai":
      return openai("gpt-4.1-mini");
    case "anthropic":
      return anthropic("claude-sonnet-5");
    default:
      throw new Error(
        `Provider "${provider}" has no AI SDK model. Use callRunyour() instead.`,
      );
  }
}

export function currentProvider(): ProviderName {
  return (process.env.AGENT_PROVIDER as ProviderName) || "google";
}

/**
 * Runyour Agent (몬드리안AI) is the event's sponsor platform. It is not an AI
 * SDK provider, so it gets a plain fetch. Shape the request to whatever the
 * setup session at 10:45 tells you — this is the seam, not the contract.
 */
export async function callRunyour(prompt: string): Promise<string> {
  const baseUrl = process.env.RUNYOUR_BASE_URL;
  const apiKey = process.env.RUNYOUR_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error("RUNYOUR_BASE_URL and RUNYOUR_API_KEY must both be set.");
  }

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error(`Runyour Agent returned ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.text ?? data.output ?? JSON.stringify(data);
}

/** Which providers actually have a key present. Drives /api/health. */
export function availableProviders(): ProviderName[] {
  const keys: Record<ProviderName, string | undefined> = {
    google: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    runyour: process.env.RUNYOUR_API_KEY,
  };
  return (Object.keys(keys) as ProviderName[]).filter((k) => Boolean(keys[k]));
}
