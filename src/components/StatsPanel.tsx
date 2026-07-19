"use client";

import { useMemo } from "react";
import { analyze, lexicon } from "@/lib/analyzer";
import type { CategoryCounts, CategoryKey } from "@/lib/types";
import type { StoredAnalysis } from "@/lib/history-client";

const CATS = Object.entries(lexicon.categories) as [
  CategoryKey,
  { label: string; color: string }
][];

export default function StatsPanel({ items }: { items: StoredAnalysis[] }) {
  const stats = useMemo(() => {
    const totals: CategoryCounts = {
      gender: 0,
      age: 0,
      ableism: 0,
      jargon: 0,
      discriminatory: 0,
      unrealistic: 0,
    };
    let scoreSum = 0;
    let best = 0;
    let totalFindings = 0;

    for (const a of items) {
      scoreSum += a.score;
      best = Math.max(best, a.score);
      const r = analyze(a.inputText);
      totalFindings += r.totalFindings;
      for (const key of Object.keys(totals) as CategoryKey[]) {
        totals[key] += r.counts[key];
      }
    }

    const avg = items.length ? Math.round(scoreSum / items.length) : 0;
    const maxCat = Math.max(1, ...Object.values(totals));
    const topCat = (Object.entries(totals) as [CategoryKey, number][]).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return { totals, avg, best, totalFindings, maxCat, topCat };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="card mb-4 animate-fade-in p-5">
      <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
        Estadísticas de tu historial
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Análisis" value={items.length} />
        <Stat label="Media de inclusividad" value={`${stats.avg}`} accent />
        <Stat label="Mejor puntuación" value={`${stats.best}`} />
        <Stat label="Hallazgos totales" value={stats.totalFindings} />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Sesgos más frecuentes
          {stats.topCat && stats.topCat[1] > 0 && (
            <span className="ml-1 font-normal normal-case text-slate-500">
              · el más habitual es <b>{lexicon.categories[stats.topCat[0]].label}</b>
            </span>
          )}
        </p>
        <div className="space-y-1.5">
          {CATS.map(([key, meta]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-40 shrink-0 text-xs text-slate-500 dark:text-slate-400">
                {meta.label}
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(stats.totals[key] / stats.maxCat) * 100}%`,
                    backgroundColor: meta.color,
                  }}
                />
              </div>
              <span className="w-6 text-right text-xs font-semibold text-slate-700 dark:text-slate-300">
                {stats.totals[key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
      <p
        className={`text-2xl font-bold ${
          accent ? "text-brand dark:text-brand-400" : "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </p>
      <p className="text-[11px] text-slate-400">{label}</p>
    </div>
  );
}
