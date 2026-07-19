"use client";

import { useMemo, useState } from "react";
import { atsReport } from "@/lib/ats";

interface Candidate {
  id: number;
  name: string;
  cv: string;
}

let nextId = 3;

const SAMPLE_OFFER =
  "Buscamos desarrollador/a backend con Node.js, TypeScript, PostgreSQL, Docker y experiencia en APIs REST y metodologías ágiles.";

export default function RankingClient() {
  const [offer, setOffer] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: 1, name: "Candidato 1", cv: "" },
    { id: 2, name: "Candidato 2", cv: "" },
  ]);

  const ranked = useMemo(() => {
    if (!offer.trim()) return [];
    return candidates
      .filter((c) => c.cv.trim())
      .map((c) => ({ ...c, report: atsReport(offer, c.cv) }))
      .sort((a, b) => b.report.atsScore - a.report.atsScore);
  }, [offer, candidates]);

  function update(id: number, patch: Partial<Candidate>) {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function add() {
    setCandidates((prev) => [
      ...prev,
      { id: nextId++, name: `Candidato ${prev.length + 1}`, cv: "" },
    ]);
  }
  function remove(id: number) {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  }
  function loadSample() {
    setOffer(SAMPLE_OFFER);
    setCandidates([
      {
        id: 1,
        name: "Marta",
        cv: "Desarrolladora backend con Node.js, TypeScript, PostgreSQL, Docker, APIs REST y metodologías ágiles. Inglés fluido. Contacto: marta@mail.com, +34 600 000 000. Experiencia: 4 años. Formación: Ingeniería. Habilidades: Git.",
      },
      {
        id: 2,
        name: "Ana",
        cv: "Desarrolladora con Node.js, TypeScript y PostgreSQL. Algo de Docker. Contacto: ana@mail.com.",
      },
      {
        id: 3,
        name: "Luis",
        cv: "Programador con JavaScript y bases de datos MySQL. Interesado en aprender backend.",
      },
    ]);
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={loadSample}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cargar ejemplo
        </button>
      </div>

      <div className="card p-4">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Oferta de empleo
        </label>
        <textarea
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
          rows={4}
          placeholder="Pega aquí la descripción del puesto…"
          className={`mt-2 ${inputClass}`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {candidates.map((c) => (
          <div key={c.id} className="card p-4">
            <div className="mb-2 flex items-center gap-2">
              <input
                value={c.name}
                onChange={(e) => update(c.id, { name: e.target.value })}
                className="flex-1 rounded-md border border-transparent bg-transparent px-1 text-sm font-semibold text-slate-800 outline-none focus:border-slate-300 dark:text-slate-100"
              />
              {candidates.length > 1 && (
                <button
                  onClick={() => remove(c.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Quitar
                </button>
              )}
            </div>
            <textarea
              value={c.cv}
              onChange={(e) => update(c.id, { cv: e.target.value })}
              rows={5}
              placeholder="Pega el CV de esta persona…"
              className={inputClass}
            />
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-500 hover:border-brand hover:text-brand dark:border-slate-700"
      >
        + Añadir candidato
      </button>

      {ranked.length > 0 && (
        <div className="card p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Ranking por encaje con la oferta
          </h2>
          <ul className="space-y-2">
            {ranked.map((c, i) => (
              <li
                key={c.id}
                className="flex items-center gap-4 rounded-xl border border-slate-200 p-3 dark:border-slate-800"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
                    {c.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {c.report.matched}/{c.report.total} palabras clave ·{" "}
                    {c.report.structureScore}% estructura
                  </p>
                  <div className="mt-1.5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${c.report.atsScore}%`,
                        backgroundColor:
                          c.report.atsScore >= 75
                            ? "#16a34a"
                            : c.report.atsScore >= 50
                            ? "#f59e0b"
                            : "#dc2626",
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className="text-2xl font-bold"
                    style={{
                      color:
                        c.report.atsScore >= 75
                          ? "#16a34a"
                          : c.report.atsScore >= 50
                          ? "#f59e0b"
                          : "#dc2626",
                    }}
                  >
                    {c.report.atsScore}
                  </p>
                  <p className="text-[10px] text-slate-400">ATS</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
