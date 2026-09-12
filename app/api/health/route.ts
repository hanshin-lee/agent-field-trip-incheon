import { availableProviders, currentProvider } from "@/lib/providers";

/** Hit this first on site. If `available` is empty, your .env.local is wrong. */
export async function GET() {
  return Response.json({
    ok: true,
    active: currentProvider(),
    available: availableProviders(),
    time: new Date().toISOString(),
  });
}
