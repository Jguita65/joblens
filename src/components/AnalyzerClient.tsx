"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { analyze } from "@/lib/analyzer";
import type { AnalysisResult } from "@/lib/types";
import { saveAnalysis } from "@/lib/history-client";
import HighlightedText from "./HighlightedText";
import FindingsPanel from "./FindingsPanel";
import ScoreGauge from "./ScoreGauge";

const SAMPLE = `Se busca hombre joven y dinámico, un auténtico crack y ninja de las ventas, con máxima disponibilidad y capacidad de sacrificio.

Requisitos:
- Solo hombres, menores de 30 años, con buena presencia.
- Recién graduado, nativo digital y con energía juvenil.
- Nacionalidad española y sin cargas familiares.
- Resistencia al estrés extrema y pasión por el trabajo.
- Imprescindible adjuntar una fotografía reciente e indicar estado civil.
- Se valora perfil workaholic, able-bodied, dispuesto a work hard, play hard.`;

export default function AnalyzerClient() {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzedText, setAnalyzedText] = useState("");
  const [title, setTitle] = useState("");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "db" | "local" | "error"
  >("idle");

  const canAnalyze = useMemo(() => text.trim().length > 0, [text]);

  function handleAnalyze() {
    const res = analyze(text);
    setResult(res);
    setAnalyzedText(text);
    setSaveState("idle");
    if (!title) {
      const firstLine = text.trim().split("\n")[0].slice(0, 60);
      setTitle(firstLine || "Análisis sin título");
    }
  }

  async function handleSave() {
    if (!result || !session?.user?.id) return;
    setSaveState("saving");
    try {
      const stored = await saveAnalysis(session.user.id, {
        title: title.trim() || "Análisis sin título",
        inputText: analyzedText,
        score: result.score,
        findings: result.findings,
      });
      setSaveState(stored.source === "db" ? "db" : "local");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: input + highlighted output */}
      <section className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Texto de la oferta de empleo
            </label>
            <button
              type="button"
              onClick={() => setText(SAMPLE)}
              className="text-xs font-medium text-brand hover:underline"
            >
              Cargar ejemplo
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            placeholder="Pega aquí la descripción del puesto…"
            className="w-full resize-y rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="rounded-lg bg-brand px-5 py-2 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              Analizar
            </button>
            {text && (
              <button
                onClick={() => {
                  setText("");
                  setResult(null);
                  setAnalyzedText("");
                }}
                className="text-sm text-slate-500 hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {result && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-slate-700">
              Texto analizado
            </h3>
            <HighlightedText text={analyzedText} findings={result.findings} />
          </div>
        )}
      </section>

      {/* Right: score + findings */}
      <section className="space-y-4">
        {!result ? (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
            Pega una oferta y pulsa <span className="mx-1 font-semibold">Analizar</span>{" "}
            para ver los resultados aquí.
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:justify-between">
              <ScoreGauge score={result.score} />
              <div className="flex-1 text-center sm:text-left">
                <p className="text-2xl font-bold text-slate-900">
                  {result.totalFindings}{" "}
                  <span className="text-base font-normal text-slate-500">
                    {result.totalFindings === 1 ? "hallazgo" : "hallazgos"}
                  </span>
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Revisa cada término y aplica las sugerencias para mejorar la
                  inclusividad de tu oferta.
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título para guardar"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-brand"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saveState === "saving"}
                      className="rounded-lg border border-brand px-4 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white disabled:opacity-50"
                    >
                      {saveState === "saving" ? "Guardando…" : "Guardar análisis"}
                    </button>
                    {saveState === "db" && (
                      <span className="text-xs text-green-600">
                        ✓ Guardado en base de datos
                      </span>
                    )}
                    {saveState === "local" && (
                      <span className="text-xs text-green-600">
                        ✓ Guardado en este navegador (localStorage)
                      </span>
                    )}
                    {saveState === "error" && (
                      <span className="text-xs text-red-600">
                        No se pudo guardar
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">
                Hallazgos ({result.totalFindings})
              </h3>
              <FindingsPanel findings={result.findings} counts={result.counts} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
