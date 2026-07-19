"use client";

import { useState } from "react";
import { lexicon } from "@/lib/analyzer";
import type { RewriteResult } from "@/lib/types";

export default function RewritePanel({
  original,
  rewrite,
  originalScore,
}: {
  original: string;
  rewrite: RewriteResult;
  originalScore: number;
}) {
  const [copied, setCopied] = useState(false);

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
        <button
          onClick={copyText}
          className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          {copied ? "✓ Copiado" : "Copiar versión mejorada"}
        </button>
      </div>

      {rewrite.changes.length === 0 ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-6 text-center text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
          ✅ El texto ya es inclusivo: no ha sido necesario reescribir nada.
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
