import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Optional local-AI proxy to an Ollama server. It only works when the app runs
// on a machine that can reach Ollama (typically localhost during development);
// on a remote deploy it returns 503 and the UI falls back to deterministic mode.

// Server-controlled (never from user input) so there is no SSRF surface: the
// route can only ever talk to the configured Ollama host.
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3.5:4b";

function stripThinking(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

/** Health check: is a local Ollama reachable? Requires an authenticated user. */
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ available: false });

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return NextResponse.json({ available: false });
    const data = await res.json();
    const models: string[] = (data.models ?? []).map((m: { name: string }) => m.name);
    // Only report availability and the configured model, not the full list.
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

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90_000);
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
        options: { temperature: 0.3 },
      }),
    });
    clearTimeout(timer);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Ollama respondió ${res.status}.` },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json({ text: stripThinking(data.response ?? "") });
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudo contactar con la IA local (Ollama). Esta función solo está disponible al ejecutar la app en un equipo con Ollama en marcha.",
      },
      { status: 503 }
    );
  }
}
