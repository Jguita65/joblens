"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  deleteAnalysis,
  loadHistory,
  type StoredAnalysis,
} from "@/lib/history-client";
import { analyze, scoreLabel } from "@/lib/analyzer";
import HighlightedText from "./HighlightedText";
import FindingsPanel from "./FindingsPanel";

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

export default function HistoryClient() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<StoredAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

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

  if (loading) {
    return <p className="text-sm text-slate-400">Cargando historial…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">
        Aún no has guardado ningún análisis. Ve a{" "}
        <span className="font-semibold text-slate-600">Analizar</span> y guarda tu
        primer análisis.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((a) => {
        const isOpen = openId === a.id;
        // Recompute findings/counts for the stored text so the detail view is
        // always consistent, even for records loaded from a bare API payload.
        const recomputed = analyze(a.inputText);
        return (
          <li
            key={a.id}
            className="rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-slate-900">
                    {a.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      a.source === "db"
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {a.source === "db" ? "DB" : "Local"}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{formatDate(a.createdAt)}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">{a.score}</p>
                  <p className="text-[10px] text-slate-400">
                    {scoreLabel(a.score)}
                  </p>
                </div>
                <button
                  onClick={() => setOpenId(isOpen ? null : a.id)}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  {isOpen ? "Ocultar" : "Ver"}
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  Borrar
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="grid gap-4 border-t border-slate-100 p-4 lg:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase text-slate-400">
                    Texto analizado
                  </h4>
                  <HighlightedText
                    text={a.inputText}
                    findings={recomputed.findings}
                  />
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase text-slate-400">
                    Hallazgos ({recomputed.totalFindings})
                  </h4>
                  <FindingsPanel
                    findings={recomputed.findings}
                    counts={recomputed.counts}
                  />
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
