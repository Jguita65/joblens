"use client";

import { lexicon } from "@/lib/analyzer";
import type { CategoryCounts, Finding } from "@/lib/types";

const SEVERITY_LABEL: Record<number, string> = {
  1: "Leve",
  2: "Medio",
  3: "Grave",
};

function CategoryLegend({ counts }: { counts: CategoryCounts }) {
  const entries = Object.entries(lexicon.categories) as [
    keyof typeof lexicon.categories,
    { label: string; color: string }
  ][];

  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([key, meta]) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600"
        >
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: meta.color }}
          />
          {meta.label}
          <span className="font-semibold text-slate-900">{counts[key]}</span>
        </span>
      ))}
    </div>
  );
}

export default function FindingsPanel({
  findings,
  counts,
}: {
  findings: Finding[];
  counts: CategoryCounts;
}) {
  return (
    <div className="space-y-4">
      <CategoryLegend counts={counts} />

      {findings.length === 0 ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-6 text-center text-sm text-green-700">
          ✅ No se han detectado términos problemáticos. ¡Buen trabajo!
        </div>
      ) : (
        <ul className="space-y-3">
          {findings.map((f, idx) => {
            const meta = lexicon.categories[f.category];
            return (
              <li
                key={`${f.entryId}-${f.start}-${idx}`}
                className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                style={{ borderLeft: `4px solid ${meta.color}` }}
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-semibold text-slate-900">
                    “{f.match}”
                  </span>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
                    style={{ backgroundColor: meta.color }}
                  >
                    {meta.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Severidad: {SEVERITY_LABEL[f.severity]}
                </p>
                <p className="mt-1.5 text-sm text-slate-600">{f.explanation}</p>
                <p className="mt-1.5 rounded-md bg-slate-50 px-2.5 py-1.5 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Sugerencia: </span>
                  {f.suggestion}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
