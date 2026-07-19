"use client";

import type { GoodPracticesReport } from "@/lib/goodPractices";

export default function GoodPracticesPanel({
  report,
}: {
  report: GoodPracticesReport;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Completitud de la oferta
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {report.present}/{report.total}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-green-500 transition-all"
              style={{ width: `${report.completeness}%` }}
            />
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        {report.results.map((r) => (
          <li
            key={r.id}
            className={`flex items-start gap-3 rounded-xl border p-3 ${
              r.present
                ? "border-green-200 bg-green-50/60 dark:border-green-900/40 dark:bg-green-950/20"
                : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            }`}
          >
            <span className="text-lg">{r.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold ${
                    r.present
                      ? "text-green-700 dark:text-green-400"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {r.label}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    r.present
                      ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {r.present ? "✓ Presente" : "Falta"}
                </span>
              </div>
              {!r.present && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {r.tip}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
