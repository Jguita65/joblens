"use client";

import { useMemo, useState } from "react";
import { analyze } from "@/lib/analyzer";
import { detectGoodPractices } from "@/lib/goodPractices";
import { buildOffer, EMPTY_OFFER, type OfferFields } from "@/lib/offerTemplate";
import ScoreGauge from "./ScoreGauge";
import HighlightedText from "./HighlightedText";
import { useAi } from "./useAi";

const AI_SYSTEM =
  "Eres un experto en redacción de ofertas de empleo inclusivas en español. A partir de los datos, escribe una oferta completa, atractiva y bien estructurada, con lenguaje neutro e inclusivo (sin sesgos de género, edad, capacitismo ni jerga). Organízala en secciones (introducción, responsabilidades, requisitos, qué ofrecemos) e incluye una breve declaración de igualdad de oportunidades. Devuelve ÚNICAMENTE la oferta, sin comentarios.";

function buildAiPrompt(f: OfferFields): string {
  const lines = [`Puesto: ${f.puesto}`];
  if (f.empresa) lines.push(`Empresa: ${f.empresa}`);
  if (f.modalidad) lines.push(`Modalidad: ${f.modalidad}`);
  if (f.ubicacion) lines.push(`Ubicación: ${f.ubicacion}`);
  if (f.salarioMin || f.salarioMax)
    lines.push(`Salario: ${[f.salarioMin, f.salarioMax].filter(Boolean).join("–")} € brutos/año`);
  if (f.responsabilidades) lines.push(`Responsabilidades:\n${f.responsabilidades}`);
  if (f.requisitos) lines.push(`Requisitos:\n${f.requisitos}`);
  if (f.beneficios) lines.push(`Beneficios:\n${f.beneficios}`);
  return `Redacta la oferta a partir de estos datos:\n${lines.join("\n")}`;
}

const SAMPLE: OfferFields = {
  puesto: "Desarrollador/a Frontend",
  empresa: "Nimbus",
  modalidad: "Híbrido",
  ubicacion: "Madrid",
  salarioMin: "32.000",
  salarioMax: "40.000",
  responsabilidades:
    "Desarrollar interfaces con React y TypeScript\nColaborar con diseño y backend\nParticipar en revisiones de código",
  requisitos:
    "2 años de experiencia con React\nConocimientos de accesibilidad web\nTrabajo en equipo",
  beneficios:
    "Teletrabajo 3 días\nFormación anual\nSeguro médico",
  igualdad: true,
};

export default function GeneradorClient() {
  const [f, setF] = useState<OfferFields>(EMPTY_OFFER);
  const [copied, setCopied] = useState(false);
  const [aiOffer, setAiOffer] = useState<string | null>(null);
  const [aiCopied, setAiCopied] = useState(false);
  const ai = useAi();

  const offer = useMemo(() => buildOffer(f), [f]);
  const filled = f.puesto.trim().length > 0;

  async function generateWithAi() {
    const text = await ai.run(buildAiPrompt(f), AI_SYSTEM);
    if (text) setAiOffer(text);
  }
  const result = useMemo(() => analyze(offer), [offer]);
  const practices = useMemo(() => detectGoodPractices(offer), [offer]);

  function set<K extends keyof OfferFields>(key: K, value: OfferFields[K]) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

  async function copy() {
    try {
      await navigator.clipboard.writeText(offer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form */}
      <section className="card space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Datos del puesto
          </h2>
          <button
            onClick={() => setF(SAMPLE)}
            className="text-xs font-medium text-brand hover:underline"
          >
            Cargar ejemplo
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="col-span-2 text-xs font-medium text-slate-500">
            Puesto *
            <input
              className={inputClass}
              value={f.puesto}
              onChange={(e) => set("puesto", e.target.value)}
              placeholder="Ej. Desarrollador/a Frontend"
            />
          </label>
          <label className="text-xs font-medium text-slate-500">
            Empresa
            <input
              className={inputClass}
              value={f.empresa}
              onChange={(e) => set("empresa", e.target.value)}
            />
          </label>
          <label className="text-xs font-medium text-slate-500">
            Ubicación
            <input
              className={inputClass}
              value={f.ubicacion}
              onChange={(e) => set("ubicacion", e.target.value)}
            />
          </label>
          <label className="text-xs font-medium text-slate-500">
            Modalidad
            <select
              className={inputClass}
              value={f.modalidad}
              onChange={(e) => set("modalidad", e.target.value as OfferFields["modalidad"])}
            >
              <option value="">—</option>
              <option>Presencial</option>
              <option>Híbrido</option>
              <option>Remoto</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-medium text-slate-500">
              Salario mín. (€)
              <input
                className={inputClass}
                value={f.salarioMin}
                onChange={(e) => set("salarioMin", e.target.value)}
                inputMode="numeric"
              />
            </label>
            <label className="text-xs font-medium text-slate-500">
              Salario máx. (€)
              <input
                className={inputClass}
                value={f.salarioMax}
                onChange={(e) => set("salarioMax", e.target.value)}
                inputMode="numeric"
              />
            </label>
          </div>
        </div>

        {(["responsabilidades", "requisitos", "beneficios"] as const).map((k) => (
          <label key={k} className="block text-xs font-medium capitalize text-slate-500">
            {k} (una por línea)
            <textarea
              className={inputClass}
              rows={3}
              value={f[k]}
              onChange={(e) => set(k, e.target.value)}
            />
          </label>
        ))}

        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={f.igualdad}
            onChange={(e) => set("igualdad", e.target.checked)}
          />
          Incluir declaración de igualdad de oportunidades
        </label>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        {!filled ? (
          <div className="card flex h-full min-h-[300px] items-center justify-center p-8 text-center text-sm text-slate-400">
            Rellena al menos el puesto para generar la oferta.
          </div>
        ) : (
          <>
            <div className="card flex items-center gap-4 p-4">
              <ScoreGauge score={result.score} size={104} />
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <p className="text-slate-700 dark:text-slate-200">
                  Oferta generada con{" "}
                  <b className="text-slate-900 dark:text-white">
                    {result.totalFindings}
                  </b>{" "}
                  posibles sesgos y{" "}
                  <b className="text-slate-900 dark:text-white">
                    {practices.present}/{practices.total}
                  </b>{" "}
                  buenas prácticas.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={copy}
                    className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
                  >
                    {copied ? "✓ Copiado" : "Copiar oferta"}
                  </button>
                  <button
                    onClick={generateWithAi}
                    disabled={!ai.available || ai.loading}
                    title={
                      ai.available
                        ? "Redacta una versión más completa con IA"
                        : "IA no disponible en este entorno"
                    }
                    className="rounded-lg border border-brand px-4 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white disabled:opacity-40 dark:border-brand-400 dark:text-brand-400 dark:hover:text-white"
                  >
                    {ai.loading ? "Redactando…" : "✨ Redactar con IA"}
                  </button>
                </div>
                {ai.error && (
                  <p className="mt-1.5 text-xs text-red-600">{ai.error}</p>
                )}
              </div>
            </div>

            {aiOffer && (
              <div className="card animate-fade-in p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    ✨ Versión redactada con IA
                    <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-[11px] font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                      Índice {analyze(aiOffer).score}/100
                    </span>
                  </h3>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(aiOffer);
                      setAiCopied(true);
                      setTimeout(() => setAiCopied(false), 1500);
                    }}
                    className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    {aiCopied ? "✓ Copiado" : "Copiar"}
                  </button>
                </div>
                <div className="thin-scroll max-h-72 overflow-y-auto whitespace-pre-wrap rounded-lg border border-green-200 bg-green-50/40 p-3 text-sm leading-relaxed text-slate-800 dark:border-green-900/40 dark:bg-green-950/20 dark:text-slate-100">
                  {aiOffer}
                </div>
              </div>
            )}

            <div className="card p-4">
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Vista previa (plantilla)
              </h3>
              <div className="thin-scroll max-h-[28rem] overflow-y-auto">
                <HighlightedText text={offer} findings={result.findings} />
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
