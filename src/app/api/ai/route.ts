import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Optional AI backend for the assisted rewrite. Two modes, chosen by env:
//
//  1. Hosted (works for everyone on a public deploy): set AI_API_URL + AI_API_KEY
//     to any OpenAI-compatible endpoint (Groq, OpenRouter, Together, Ollama
//     Cloud…). The key lives only on the server, never in the browser.
//  2. Local Ollama (works only where the server can reach it, e.g. your own
//     machine in development): OLLAMA_URL defaults to http://localhost:11434.
//
// If neither is reachable the route returns "unavailable" and the UI falls back
// to the deterministic rewrite. The endpoint/model/key are server-controlled,
// so user input can never redirect the request (no SSRF).

const AI_API_URL = process.env.AI_API_URL; // e.g. https://api.groq.com/openai/v1
const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || "llama-3.1-8b-instant";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:3b";
const OLLAMA_KEEP_ALIVE = process.env.OLLAMA_KEEP_ALIVE || "5m";

const hostedMode = Boolean(AI_API_URL && AI_API_KEY);

function stripThinking(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

/** Health check. Requires an authenticated user. */
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ available: false });

  if (hostedMode) {
    return NextResponse.json({ available: true, model: AI_MODEL, hosted: true });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return NextResponse.json({ available: false });
    const data = await res.json();
    const models: string[] = (data.models ?? []).map((m: { name: string }) => m.name);
    return NextResponse.json({
      available: true,
      model: OLLAMA_MODEL,
      hasModel: models.includes(OLLAMA_MODEL),
    });
  } catch {
    return NextResponse.json({ available: false });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  let body: { prompt?: string; system?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }
  if (!body.prompt) {
    return NextResponse.json({ error: "Falta el prompt." }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90_000);

  try {
    if (hostedMode) {
      const res = await fetch(`${AI_API_URL}/chat/completions`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: AI_MODEL,
          temperature: 0.3,
          max_tokens: 900,
          messages: [
            ...(body.system ? [{ role: "system", content: body.system }] : []),
            { role: "user", content: body.prompt },
          ],
        }),
      });
      clearTimeout(timer);
      if (!res.ok) {
        return NextResponse.json({ error: `IA respondió ${res.status}.` }, { status: 502 });
      }
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content ?? "";
      return NextResponse.json({ text: stripThinking(text) });
    }

    // Local Ollama
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: body.prompt,
        system: body.system,
        stream: false,
        think: false,
        keep_alive: OLLAMA_KEEP_ALIVE,
        options: { temperature: 0.3, num_predict: 900, num_ctx: 4096 },
      }),
    });
    clearTimeout(timer);
    if (!res.ok) {
      return NextResponse.json({ error: `Ollama respondió ${res.status}.` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json({ text: stripThinking(data.response ?? "") });
  } catch {
    clearTimeout(timer);
    return NextResponse.json(
      {
        error: hostedMode
          ? "No se pudo contactar con el proveedor de IA."
          : "No se pudo contactar con la IA local (Ollama). Esta función solo está disponible al ejecutar la app en un equipo con Ollama en marcha.",
      },
      { status: 503 }
    );
  }
}
