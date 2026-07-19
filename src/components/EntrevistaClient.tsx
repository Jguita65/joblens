"use client";

import { useMemo, useState } from "react";
import { AVOID, COMPETENCIES } from "@/lib/interviewQuestions";

export default function EntrevistaClient() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const active = useMemo(
    () => COMPETENCIES.filter((c) => selected.size === 0 || selected.has(c.id)),
    [selected]
  );

  async function copyAll() {
    const text = active
      .map((c) => `# ${c.label}\n${c.questions.map((q) => `- ${q}`).join("\n")}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-5">
      <div className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Elige competencias
          </h2>
          <button onClick={copyAll} className="text-xs font-medium text-brand hover:underline">
            {copied ? "✓ Copiado" : "Copiar preguntas"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMPETENCIES.map((c) => {
            const on = selected.has(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  on
                    ? "border-transparent bg-brand text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-brand dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {c.icon} {c.label}
              </button>
            );
          })}
        </div>
        {selected.size === 0 && (
          <p className="mt-2 text-xs text-slate-400">
            Mostrando todas las competencias. Selecciona algunas para filtrar.
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {active.map((c) => (
          <div key={c.id} className="card p-4">
            <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-100">
              {c.icon} {c.label}
            </h3>
            <ul className="space-y-2">
              {c.questions.map((q, i) => (
                <li
                  key={i}
                  className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
                >
                  {q}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card border-red-200 p-4 dark:border-red-900/40">
        <h3 className="mb-1 font-semibold text-red-600 dark:text-red-400">
          ⚠️ Preguntas a evitar
        </h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          Estas preguntas son discriminatorias o legalmente arriesgadas. Evítalas
          en tus entrevistas.
        </p>
        <ul className="space-y-2">
          {AVOID.map((a, i) => (
            <li key={i} className="rounded-lg border border-red-100 p-3 dark:border-red-900/30">
              <p className="text-sm font-medium text-slate-800 line-through decoration-red-400/60 dark:text-slate-200">
                {a.question}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {a.reason}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
