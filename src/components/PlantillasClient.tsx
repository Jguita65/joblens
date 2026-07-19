"use client";

import { useMemo, useState } from "react";
import {
  EMAIL_FIELDS,
  EMAIL_TEMPLATES,
  fillTemplate,
} from "@/lib/emailTemplates";

export default function PlantillasClient() {
  const [templateId, setTemplateId] = useState(EMAIL_TEMPLATES[0].id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const template = EMAIL_TEMPLATES.find((t) => t.id === templateId)!;
  const subject = useMemo(
    () => fillTemplate(template.subject, values),
    [template, values]
  );
  const body = useMemo(() => fillTemplate(template.body, values), [template, values]);

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

  async function copy() {
    try {
      await navigator.clipboard.writeText(`Asunto: ${subject}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card space-y-3 p-4">
        <label className="block text-xs font-medium text-slate-500">
          Plantilla
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className={inputClass}
          >
            {EMAIL_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-2">
          {EMAIL_FIELDS.map((f) => (
            <label key={f.key} className="text-xs font-medium text-slate-500">
              {f.label}
              <input
                className={inputClass}
                value={values[f.key] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
                placeholder={f.placeholder}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Vista previa
          </h3>
          <button
            onClick={copy}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            {copied ? "✓ Copiado" : "Copiar email"}
          </button>
        </div>
        <p className="mb-2 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/60">
          <span className="font-semibold text-slate-500">Asunto: </span>
          <span className="text-slate-800 dark:text-slate-100">{subject}</span>
        </p>
        <div className="thin-scroll max-h-[24rem] overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-200 p-3 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:text-slate-200">
          {body}
        </div>
      </section>
    </div>
  );
}
