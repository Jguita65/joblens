"use client";

import { scoreLabel } from "@/lib/analyzer";

/** Circular gauge for the inclusivity index (0–100). */
export default function ScoreGauge({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const color =
    clamped >= 75 ? "#16a34a" : clamped >= 50 ? "#f59e0b" : "#dc2626";

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">{clamped}</span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-semibold" style={{ color }}>
        {scoreLabel(clamped)}
      </p>
      <p className="text-xs text-slate-400">Índice de inclusividad</p>
    </div>
  );
}
