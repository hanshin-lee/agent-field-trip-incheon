import { generateText } from "ai";
import {
  resolveModel,
  callRunyour,
  currentProvider,
  type ProviderName,
} from "@/lib/providers";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt, provider } = (await req.json()) as {
      prompt?: string;
      provider?: ProviderName;
    };

    if (!prompt?.trim()) {
      return Response.json({ error: "prompt is required" }, { status: 400 });
    }

    const chosen = provider ?? currentProvider();

    if (chosen === "runyour") {
      return Response.json({ provider: chosen, text: await callRunyour(prompt) });
    }

    const { text } = await generateText({ model: resolveModel(chosen), prompt });
    return Response.json({ provider: chosen, text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
