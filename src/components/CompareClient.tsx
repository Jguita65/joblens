"use client";

import { useMemo, useState } from "react";
import { analyze, rewrite as rewriteText } from "@/lib/analyzer";
import { EXAMPLES } from "@/lib/examples";
import ScoreGauge from "./ScoreGauge";
import CategoryBreakdown from "./CategoryBreakdown";

function Side({
  title,
  value,
  onChange,
  placeholder,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const result = useMemo(() => analyze(value), [value]);
  return (
    <div className="card animate-fade-in p-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {title}
      </h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      />
      {value.trim() && (
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:items-center">
          <ScoreGauge score={result.score} size={104} />
          <div className="w-full flex-1">
            <p className="mb-2 text-center text-sm text-slate-500 sm:text-left">
              {result.totalFindings} hallazgos
            </p>
            <CategoryBreakdown
              counts={result.counts}
              total={result.totalFindings}
              active={null}
              onToggle={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CompareClient() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const scoreA = useMemo(() => analyze(a).score, [a]);
  const scoreB = useMemo(() => analyze(b).score, [b]);
  const bothFilled = a.trim() && b.trim();
  const delta = scoreB - scoreA;

  function loadExamplePair() {
    const ex = EXAMPLES[0].text;
    setA(ex);
    setB(rewriteText(ex).text);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={loadExamplePair}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cargar ejemplo (original vs. reescrito)
        </button>
        {(a || b) && (
          <button
            onClick={() => {
              setA("");
              setB("");
            }}
            className="text-sm text-slate-500 hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>

      {bothFilled && (
        <div className="card animate-scale-in flex items-center justify-center gap-4 p-4 text-center">
          <div>
            <p className="text-xs text-slate-400">Versión A</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{scoreA}</p>
          </div>
          <div className="text-2xl text-slate-300">→</div>
          <div>
            <p className="text-xs text-slate-400">Versión B</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{scoreB}</p>
          </div>
          <div
            className={`ml-4 rounded-lg px-3 py-1.5 text-sm font-semibold ${
              delta > 0
                ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                : delta < 0
                ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                : "bg-slate-100 text-slate-500 dark:bg-slate-800"
            }`}
          >
            {delta > 0 ? `▲ +${delta}` : delta < 0 ? `▼ ${delta}` : "= igual"}
            {delta !== 0 && (
              <span className="ml-1 font-normal">
                {delta > 0 ? "· B es más inclusiva" : "· A es más inclusiva"}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Side
          title="Versión A"
          value={a}
          onChange={setA}
          placeholder="Pega aquí la primera versión de la oferta…"
        />
        <Side
          title="Versión B"
          value={b}
          onChange={setB}
          placeholder="Pega aquí la segunda versión…"
        />
      </div>
    </div>
  );
}
