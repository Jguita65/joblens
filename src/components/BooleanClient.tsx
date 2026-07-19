"use client";

import { useMemo, useState } from "react";
import {
  buildLinkedIn,
  buildXray,
  type BooleanInput,
} from "@/lib/boolean";

const EMPTY: BooleanInput = {
  titles: "",
  must: "",
  optional: "",
  exclude: "",
  location: "",
};

const SAMPLE: BooleanInput = {
  titles: "Desarrollador backend, Backend developer, Ingeniero de software",
  must: "Node.js, TypeScript",
  optional: "PostgreSQL, Docker, AWS",
  exclude: "becario, prácticas",
  location: "Madrid",
};

function QueryBox({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </h3>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-md border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {copied ? "✓" : "Copiar"}
        </button>
      </div>
      <code className="block whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-800 dark:bg-slate-900 dark:text-slate-200">
        {value || "—"}
      </code>
    </div>
  );
}

export default function BooleanClient() {
  const [f, setF] = useState<BooleanInput>(EMPTY);

  const linkedin = useMemo(() => buildLinkedIn(f), [f]);
  const xray = useMemo(() => buildXray(f), [f]);

  function set<K extends keyof BooleanInput>(k: K, v: string) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

  const fields: [keyof BooleanInput, string, string][] = [
    ["titles", "Puestos / sinónimos", "Separados por comas. Se combinan con OR."],
    ["must", "Imprescindibles", "Todos deben aparecer (AND)."],
    ["optional", "Deseables", "Suman relevancia (OR)."],
    ["exclude", "Excluir", "Se descartan (NOT)."],
    ["location", "Ubicación", "Solo para Google X-ray."],
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Criterios de búsqueda
          </h2>
          <button
            onClick={() => setF(SAMPLE)}
            className="text-xs font-medium text-brand hover:underline"
          >
            Cargar ejemplo
          </button>
        </div>
        {fields.map(([key, label, hint]) => (
          <label key={key} className="block text-xs font-medium text-slate-500">
            {label} <span className="text-slate-400">· {hint}</span>
            {key === "location" ? (
              <input
                className={inputClass}
                value={f[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            ) : (
              <textarea
                className={inputClass}
                rows={2}
                value={f[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            )}
          </label>
        ))}
      </section>

      <section className="space-y-4">
        <QueryBox label="LinkedIn Recruiter / búsqueda" value={linkedin} />
        <QueryBox label="Google X-ray (perfiles públicos)" value={xray} />
        <p className="text-xs text-slate-400">
          Pega la cadena en el buscador de LinkedIn o de Google. Ajusta los
          términos según los resultados.
        </p>
      </section>
    </div>
  );
}
