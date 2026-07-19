"use client";

import { useState } from "react";
import { lexicon } from "@/lib/analyzer";
import type { Finding } from "@/lib/types";

const SEVERITY_LABEL: Record<number, string> = {
  1: "Leve",
  2: "Medio",
  3: "Grave",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* ignore */
        }
      }}
      className="shrink-0 rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      {copied ? "✓ Copiado" : "Copiar"}
    </button>
  );
}

export default function FindingsPanel({
  findings,
  onApply,
}: {
  findings: Finding[];
  onApply?: (finding: Finding) => void;
}) {
  if (findings.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-6 text-center text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
        ✅ No hay hallazgos en esta vista.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {findings.map((f, idx) => {
        const meta = lexicon.categories[f.category];
        return (
          <li
            key={`${f.entryId}-${f.start}-${idx}`}
            className="animate-fade-in rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            style={{ borderLeft: `4px solid ${meta.color}` }}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                “{f.match}”
              </span>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
                style={{ backgroundColor: meta.color }}
              >
                {meta.label}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Severidad: {SEVERITY_LABEL[f.severity]}
            </p>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
              {f.explanation}
            </p>
            <div className="mt-1.5 flex items-start justify-between gap-2 rounded-md bg-slate-50 px-2.5 py-1.5 dark:bg-slate-800/60">
              <p className="text-sm text-slate-700 dark:text-slate-200">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Sugerencia:{" "}
                </span>
                {f.suggestion}
              </p>
              <CopyButton text={f.suggestion} />
            </div>
            {onApply && (
              <button
                onClick={() => onApply(f)}
                className="mt-2 w-full rounded-md border border-brand/40 bg-brand/5 px-2.5 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white dark:border-brand-400/40 dark:text-brand-400 dark:hover:text-white"
              >
                Aplicar corrección al texto
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
