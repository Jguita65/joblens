"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  deleteAnalysis,
  loadHistory,
  type StoredAnalysis,
} from "@/lib/history-client";
import { analyze, scoreLabel } from "@/lib/analyzer";
import HighlightedText from "./HighlightedText";
import FindingsPanel from "./FindingsPanel";
import StatsPanel from "./StatsPanel";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Sort = "recent" | "worst" | "best";

export default function HistoryClient() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<StoredAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("recent");

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    loadHistory(session.user.id)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [status, session?.user?.id]);

  async function handleDelete(id: string) {
    if (!session?.user?.id) return;
    await deleteAnalysis(session.user.id, id);
    setItems((prev) => prev.filter((a) => a.id !== id));
  }

  const visible = useMemo(() => {
    let list = items;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.inputText.toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sort === "recent")
      sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (sort === "worst") sorted.sort((a, b) => a.score - b.score);
    if (sort === "best") sorted.sort((a, b) => b.score - a.score);
    return sorted;
  }, [items, query, sort]);

  if (loading) {
    return <p className="text-sm text-slate-400">Cargando historial…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="card p-10 text-center text-slate-400">
        Aún no has guardado ningún análisis. Ve a{" "}
        <span className="font-semibold text-slate-600 dark:text-slate-300">
          Analizar
        </span>{" "}
        y guarda tu primer análisis.
      </div>
    );
  }

  return (
    <div>
      <StatsPanel items={items} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en el historial…"
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600 outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
        >
          <option value="recent">Más recientes</option>
          <option value="worst">Menor puntuación</option>
          <option value="best">Mayor puntuación</option>
        </select>
      </div>

      <ul className="space-y-3">
        {visible.map((a) => {
          const isOpen = openId === a.id;
          const recomputed = analyze(a.inputText);
          const scoreColor =
            a.score >= 75 ? "#16a34a" : a.score >= 50 ? "#f59e0b" : "#dc2626";
          return (
            <li key={a.id} className="card animate-fade-in overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                      {a.title}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        a.source === "db"
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                          : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                      }`}
                    >
                      {a.source === "db" ? "DB" : "Local"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {formatDate(a.createdAt)} · {recomputed.totalFindings} hallazgos
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: scoreColor }}>
                      {a.score}
                    </p>
                    <p className="text-[10px] text-slate-400">{scoreLabel(a.score)}</p>
                  </div>
                  <button
                    onClick={() => setOpenId(isOpen ? null : a.id)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {isOpen ? "Ocultar" : "Ver"}
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                  >
                    Borrar
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="grid gap-4 border-t border-slate-100 p-4 dark:border-slate-800 lg:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase text-slate-400">
                      Texto analizado
                    </h4>
                    <div className="thin-scroll max-h-80 overflow-y-auto">
                      <HighlightedText
                        text={a.inputText}
                        findings={recomputed.findings}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase text-slate-400">
                      Hallazgos ({recomputed.totalFindings})
                    </h4>
                    <div className="thin-scroll max-h-80 overflow-y-auto pr-1">
                      <FindingsPanel findings={recomputed.findings} />
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
