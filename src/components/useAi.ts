"use client";

import { useCallback, useEffect, useState } from "react";
import { aiGenerate, checkAi } from "@/lib/ai";

/** Reusable hook for the optional AI features (Ollama local o Groq hospedado). */
export function useAi() {
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAi().then((s) => setAvailable(s.available));
  }, []);

  const run = useCallback(
    async (prompt: string, system?: string): Promise<string | null> => {
      setLoading(true);
      setError(null);
      const res = await aiGenerate(prompt, system);
      setLoading(false);
      if (!res.ok) {
        setError(res.error || "No se pudo generar con IA.");
        return null;
      }
      return res.text ?? "";
    },
    []
  );

  return { available, loading, error, run };
}
