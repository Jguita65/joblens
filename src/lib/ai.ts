// Client helpers for the optional local-AI (Ollama) features.

export interface AiStatus {
  available: boolean;
  model?: string;
  hasModel?: boolean;
}

export async function checkAi(): Promise<AiStatus> {
  try {
    const res = await fetch("/api/ai");
    if (!res.ok) return { available: false };
    return await res.json();
  } catch {
    return { available: false };
  }
}

export interface AiResult {
  ok: boolean;
  text?: string;
  error?: string;
}

export async function aiGenerate(prompt: string, system?: string): Promise<AiResult> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, system }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || "Error de la IA." };
    return { ok: true, text: (data.text || "").trim() };
  } catch {
    return { ok: false, error: "No se pudo contactar con la IA local." };
  }
}
