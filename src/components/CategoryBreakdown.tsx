"use client";

import { lexicon } from "@/lib/analyzer";
import type { CategoryCounts, CategoryKey } from "@/lib/types";

const CATS = Object.entries(lexicon.categories) as [
  CategoryKey,
  { label: string; color: string }
][];

/**
 * Stacked distribution bar + clickable category chips. Clicking a chip toggles
 * a filter (null = show all).
 */
export default function CategoryBreakdown({
  counts,
  total,
  active,
  onToggle,
}: {
  counts: CategoryCounts;
  total: number;
  active: CategoryKey | null;
  onToggle: (c: CategoryKey | null) => void;
}) {
  return (
    <div className="space-y-3">
      {total > 0 && (
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {CATS.map(([key, meta]) =>
            counts[key] > 0 ? (
              <div
                key={key}
                style={{
                  width: `${(counts[key] / total) * 100}%`,
                  backgroundColor: meta.color,
                  opacity: !active || active === key ? 1 : 0.25,
                }}
                title={`${meta.label}: ${counts[key]}`}
              />
            ) : null
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {CATS.map(([key, meta]) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onToggle(isActive ? null : key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all ${
                isActive
                  ? "border-transparent text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
              style={isActive ? { backgroundColor: meta.color } : undefined}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: isActive ? "rgba(255,255,255,0.9)" : meta.color }}
              />
              {meta.label}
              <span
                className={`font-semibold ${
                  isActive ? "text-white" : "text-slate-900 dark:text-white"
                }`}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
