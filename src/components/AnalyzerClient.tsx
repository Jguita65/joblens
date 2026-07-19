"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { analyze, rewrite as rewriteText, textMetrics } from "@/lib/analyzer";
import type { CategoryKey } from "@/lib/types";
import { saveAnalysis } from "@/lib/history-client";
import { buildMarkdownReport, downloadTextFile } from "@/lib/report";
import { EXAMPLES } from "@/lib/examples";
import HighlightedText from "./HighlightedText";
import FindingsPanel from "./FindingsPanel";
import ScoreGauge from "./ScoreGauge";
import CategoryBreakdown from "./CategoryBreakdown";
import RewritePanel from "./RewritePanel";

type Tab = "analysis" | "rewrite";

export default function AnalyzerClient() {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [debounced, setDebounced] = useState("");
  const [title, setTitle] = useState("");
  const [tab, setTab] = useState<Tab>("analysis");
  const [activeCat, setActiveCat] = useState<CategoryKey | null>(null);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "db" | "local" | "error"
  >("idle");

  // Live analysis: debounce the analysed text so typing stays smooth.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(text), 350);
    return () => clearTimeout(id);
  }, [text]);

  const result = useMemo(() => analyze(debounced), [debounced]);
  const rewrite = useMemo(
    () => rewriteText(debounced, result.findings),
    [debounced, result]
  );
  const metrics = useMemo(
    () => textMetrics(debounced, result.totalFindings),
    [debounced, result.totalFindings]
  );

  const hasText = debounced.trim().length > 0;
  const filteredFindings = activeCat
    ? result.findings.filter((f) => f.category === activeCat)
    : result.findings;

  useEffect(() => {
    setSaveState("idle");
  }, [debounced]);

  function loadExample(exampleText: string, label: string) {
    setText(exampleText);
    setActiveCat(null);
    if (!title) setTitle(label);
  }

  async function handleSave() {
    if (!hasText || !session?.user?.id) return;
    setSaveState("saving");
    try {
      const stored = await saveAnalysis(session.user.id, {
        title: title.trim() || debounced.trim().split("\n")[0].slice(0, 60),
        inputText: debounced,
        score: result.score,
        findings: result.findings,
      });
      setSaveState(stored.source === "db" ? "db" : "local");
    } catch {
      setSaveState("error");
    }
  }

  function handleExport() {
    const report = buildMarkdownReport(
      title || "Oferta de empleo",
      debounced,
      result,
      rewrite
    );
    downloadTextFile("informe-joblens.md", report);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: input + highlighted output */}
      <section className="space-y-4">
        <div className="card animate-fade-in p-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Texto de la oferta de empleo
            </label>
            {hasText && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Análisis en vivo
              </span>
            )}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={11}
            placeholder="Pega aquí la descripción del puesto…"
            className="w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Ejemplos:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => loadExample(ex.text, ex.label)}
                title={ex.hint}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {ex.label}
              </button>
            ))}
            {text && (
              <button
                onClick={() => {
                  setText("");
                  setActiveCat(null);
                }}
                className="ml-auto text-xs text-slate-500 hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Text metrics */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Metric label="Palabras" value={metrics.words} />
            <Metric label="Hallazgos" value={result.totalFindings} />
            <Metric label="Densidad" value={`${metrics.biasDensity}`} suffix="/100 pal." />
          </div>
        </div>

        {hasText && (
          <div className="card animate-fade-in p-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Texto analizado
            </h3>
            <div className="thin-scroll max-h-[26rem] overflow-y-auto">
              <HighlightedText
                text={debounced}
                findings={result.findings}
                activeCategory={activeCat}
              />
            </div>
          </div>
        )}
      </section>

      {/* Right: score + findings/rewrite */}
      <section className="space-y-4">
        {!hasText ? (
          <div className="card flex h-full min-h-[320px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-3 text-4xl">📝</div>
            <p className="text-sm text-slate-400">
              Pega una oferta o carga un ejemplo. El análisis aparece aquí en
              tiempo real, sin pulsar nada.
            </p>
          </div>
        ) : (
          <>
            <div className="card animate-scale-in flex flex-col items-center gap-4 p-5 sm:flex-row sm:justify-between">
              <ScoreGauge score={result.score} />
              <div className="flex-1 text-center sm:text-left">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {result.totalFindings}{" "}
                  <span className="text-base font-normal text-slate-500">
                    {result.totalFindings === 1 ? "hallazgo" : "hallazgos"}
                  </span>
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Revisa los términos, aplica las sugerencias o usa la reescritura
                  automática.
                </p>

                <div className="mt-3 flex flex-col gap-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título para guardar"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saveState === "saving"}
                      className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
                    >
                      {saveState === "saving" ? "Guardando…" : "Guardar"}
                    </button>
                    <button
                      onClick={handleExport}
                      className="rounded-lg border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Exportar informe
                    </button>
                    {saveState === "db" && (
                      <span className="text-xs text-green-600">✓ En base de datos</span>
                    )}
                    {saveState === "local" && (
                      <span className="text-xs text-green-600">✓ En este navegador</span>
                    )}
                    {saveState === "error" && (
                      <span className="text-xs text-red-600">No se pudo guardar</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card animate-fade-in p-4">
              <CategoryBreakdown
                counts={result.counts}
                total={result.totalFindings}
                active={activeCat}
                onToggle={setActiveCat}
              />

              {/* Tabs */}
              <div className="mt-4 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <TabButton active={tab === "analysis"} onClick={() => setTab("analysis")}>
                  Hallazgos
                </TabButton>
                <TabButton active={tab === "rewrite"} onClick={() => setTab("rewrite")}>
                  ✨ Reescritura
                </TabButton>
              </div>

              <div className="mt-4">
                {tab === "analysis" ? (
                  <FindingsPanel findings={filteredFindings} />
                ) : (
                  <RewritePanel
                    original={debounced}
                    rewrite={rewrite}
                    originalScore={result.score}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-800 dark:bg-slate-800/50">
      <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-[10px] text-slate-400">
        {label}
        {suffix ? ` ${suffix}` : ""}
      </p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
          : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
      }`}
    >
      {children}
    </button>
  );
}
