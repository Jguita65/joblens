"use client";

import { useEffect, useState } from "react";
import { analyze, lexicon } from "@/lib/analyzer";
import { aiGenerate, checkAi } from "@/lib/ai";
import type { RewriteResult } from "@/lib/types";

const AI_SYSTEM =
  "Eres un experto en redacción inclusiva de ofertas de empleo en español. Reescribe la oferta eliminando TODOS estos sesgos: 1) masculino genérico (usa 'persona' o desdoblamiento, p. ej. 'desarrollador/a'); 2) referencias a la edad ('joven', 'recién graduado', 'nativo digital'); 3) capacitismo ('buena presencia', 'sin discapacidad'); 4) jerga vacía ('crack', 'ninja', 'rockstar'); 5) exigencia irreal ('máxima disponibilidad'); y sustituye 'salario competitivo' por 'salario acorde a la experiencia (se detalla en el proceso)'. Mantén el sentido, el idioma y la estructura del texto. Devuelve ÚNICAMENTE la oferta reescrita, sin comentarios ni explicaciones.";

export default function RewritePanel({
  original,
  rewrite,
  originalScore,
  onApplyAll,
}: {
  original: string;
  rewrite: RewriteResult;
  originalScore: number;
  onApplyAll?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    checkAi().then((s) => setAiAvailable(s.available));
  }, []);

  // Reset the AI result if the source text changes.
  useEffect(() => {
    setAiText(null);
    setAiError(null);
  }, [original]);

  async function runAi() {
    setAiLoading(true);
    setAiError(null);
    const res = await aiGenerate(original, AI_SYSTEM);
    setAiLoading(false);
    if (!res.ok) {
      setAiError(res.error || "No se pudo generar la reescritura con IA.");
      return;
    }
    setAiText(res.text || "");
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(rewrite.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  const delta = rewrite.score - originalScore;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {originalScore}
          </span>
          <span className="text-slate-400">→</span>
          <span className="rounded-lg bg-green-100 px-2.5 py-1 font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
            {rewrite.score}
          </span>
          {delta > 0 && (
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              +{delta} puntos de inclusividad
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onApplyAll && rewrite.changes.length > 0 && (
            <button
              onClick={onApplyAll}
              className="rounded-lg border border-brand px-4 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white dark:border-brand-400 dark:text-brand-400 dark:hover:text-white"
            >
              Aplicar al texto
            </button>
          )}
          <button
            onClick={copyText}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
        </div>
      </div>

      {/* AI-assisted rewrite (local Ollama) */}
      <div className="rounded-xl border border-brand/30 bg-brand/5 p-3 dark:border-brand-400/30">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm">
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              ✨ Reescritura con IA local
            </span>
            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
              {aiAvailable
                ? "Redacta una versión más natural con tu modelo de Ollama."
                : "No disponible (requiere Ollama en marcha en este equipo)."}
            </span>
          </div>
          <button
            onClick={runAi}
            disabled={!aiAvailable || aiLoading}
            className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-40"
          >
            {aiLoading ? "Generando…" : "Reescribir con IA"}
          </button>
        </div>
        {aiError && (
          <p className="mt-2 rounded-md bg-red-50 px-2.5 py-1.5 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {aiError}
          </p>
        )}
        {aiText && (
          <div className="mt-3">
            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
              <span className="rounded bg-green-100 px-1.5 py-0.5 font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                Índice {analyze(aiText).score}/100
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(aiText)}
                className="text-brand hover:underline"
              >
                Copiar
              </button>
            </div>
            <div className="thin-scroll max-h-72 overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              {aiText}
            </div>
          </div>
        )}
      </div>

      {rewrite.changes.length === 0 ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-6 text-center text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
          ✅ No hay sustituciones automáticas: el texto ya es inclusivo o los
          hallazgos requieren revisión manual (usa la reescritura con IA).
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Original
              </h4>
              <div className="thin-scroll max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-500 line-through decoration-red-300/60 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                {original}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
                Versión inclusiva
              </h4>
              <div className="thin-scroll max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl border border-green-200 bg-green-50/50 p-3 text-sm leading-relaxed text-slate-800 dark:border-green-900/40 dark:bg-green-950/20 dark:text-slate-100">
                {rewrite.text}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Cambios aplicados ({rewrite.changes.length})
            </h4>
            <ul className="space-y-1.5">
              {rewrite.changes.map((c, i) => {
                const meta = lexicon.categories[c.category];
                return (
                  <li
                    key={i}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    <span className="font-mono text-slate-500 line-through dark:text-slate-500">
                      {c.original}
                    </span>
                    <span className="text-slate-400">→</span>
                    {c.removed ? (
                      <span className="italic text-slate-400">(eliminado)</span>
                    ) : (
                      <span className="font-mono font-medium text-green-700 dark:text-green-400">
                        {c.replacement}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
