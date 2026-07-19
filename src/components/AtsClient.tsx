"use client";

import { useEffect, useMemo, useState } from "react";
import { atsReport } from "@/lib/ats";
import ScoreGauge from "./ScoreGauge";

const SAMPLE_OFFER = `Buscamos desarrollador/a backend con experiencia en Node.js, TypeScript y PostgreSQL.
Responsabilidades: diseñar APIs REST, trabajar con Docker y AWS, y colaborar en un equipo ágil (Scrum).
Requisitos: 3 años de experiencia, Git, testing automatizado y buen nivel de inglés.`;

const SAMPLE_CV = `Juan Pérez — juan.perez@email.com — +34 600 123 456

Experiencia
- Desarrollador backend en Acme (2021-2024). APIs REST con Node.js y Express, base de datos PostgreSQL, despliegues con Docker.
- Prácticas en TechCorp: integración de tests automatizados con Jest.

Formación
- Grado en Ingeniería Informática.

Habilidades
- JavaScript, TypeScript, Node.js, Git, SQL, metodologías ágiles.`;

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

export default function AtsClient() {
  const [offer, setOffer] = useState("");
  const [cv, setCv] = useState("");
  const dOffer = useDebounced(offer, 350);
  const dCv = useDebounced(cv, 350);

  const report = useMemo(() => atsReport(dOffer, dCv), [dOffer, dCv]);
  const ready = dOffer.trim() && dCv.trim();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => {
            setOffer(SAMPLE_OFFER);
            setCv(SAMPLE_CV);
          }}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cargar ejemplo
        </button>
        {(offer || cv) && (
          <button
            onClick={() => {
              setOffer("");
              setCv("");
            }}
            className="text-sm text-slate-500 hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Oferta de empleo
          </h3>
          <textarea
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            rows={9}
            placeholder="Pega aquí la descripción del puesto…"
            className="w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
        <div className="card p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Tu currículum (CV)
          </h3>
          <textarea
            value={cv}
            onChange={(e) => setCv(e.target.value)}
            rows={9}
            placeholder="Pega aquí el texto de tu CV…"
            className="w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
      </div>

      {!ready ? (
        <div className="card p-8 text-center text-sm text-slate-400">
          Pega una oferta y tu CV para calcular la compatibilidad ATS y las
          palabras clave que te faltan.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Score */}
          <div className="card flex flex-col items-center justify-center gap-2 p-5">
            <ScoreGauge score={report.atsScore} label="Compatibilidad ATS" />
            <p className="text-center text-xs text-slate-400">
              {report.keywordScore}% palabras clave · {report.structureScore}%
              estructura
            </p>
          </div>

          {/* Keywords */}
          <div className="card p-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Palabras clave ({report.matched}/{report.total})
            </h3>
            <div className="thin-scroll max-h-64 space-y-3 overflow-y-auto pr-1">
              <div>
                <p className="mb-1 text-xs font-medium text-green-600">En tu CV</p>
                <div className="flex flex-wrap gap-1.5">
                  {report.keywords
                    .filter((k) => k.present)
                    .map((k) => (
                      <span
                        key={k.term}
                        className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-950/40 dark:text-green-400"
                      >
                        {k.term}
                      </span>
                    ))}
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-red-600">
                  Faltan (añádelas si encajan)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {report.keywords
                    .filter((k) => !k.present)
                    .map((k) => (
                      <span
                        key={k.term}
                        className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-400"
                      >
                        {k.term}
                      </span>
                    ))}
                  {report.keywords.every((k) => k.present) && (
                    <span className="text-xs text-slate-400">
                      ¡Ninguna! Tu CV cubre las palabras clave.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Structure checks */}
          <div className="card p-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Compatibilidad del CV
            </h3>
            <ul className="space-y-1.5">
              {report.checks.map((c) => (
                <li key={c.id} className="flex items-start gap-2 text-sm">
                  <span className={c.ok ? "text-green-600" : "text-red-500"}>
                    {c.ok ? "✓" : "✗"}
                  </span>
                  <div>
                    <span
                      className={
                        c.ok
                          ? "text-slate-700 dark:text-slate-200"
                          : "text-slate-700 dark:text-slate-200"
                      }
                    >
                      {c.label}
                    </span>
                    {!c.ok && (
                      <p className="text-xs text-slate-400">{c.tip}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
