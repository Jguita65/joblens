"use client";

import { useLang } from "./LanguageProvider";

interface Section {
  icon: string;
  title: { es: string; en: string };
  steps: { es: string; en: string }[];
}

const INTRO = {
  es: "RecruitKit reúne varias herramientas para ayudarte en la selección de personal. Inicia sesión con la cuenta de prueba y prueba cualquiera desde el panel de inicio o el menú Herramientas.",
  en: "RecruitKit brings together several tools to help you with recruiting. Sign in with the test account and try any of them from the home panel or the Tools menu.",
};

const SECTIONS: Section[] = [
  {
    icon: "🎯",
    title: { es: "Analizador de sesgos", en: "Bias analyzer" },
    steps: [
      { es: "Pega el texto de una oferta o pulsa «Cargar ejemplo».", en: "Paste a job post or click “Load example”." },
      { es: "El análisis aparece en vivo: fragmentos resaltados e índice de inclusividad.", en: "Analysis appears live: highlighted fragments and an inclusivity score." },
      { es: "En «Reescritura» aplica las sugerencias o usa «Reescribir con IA».", en: "In “Rewrite”, apply the suggestions or use “Rewrite with AI”." },
      { es: "Revisa «Prácticas» y exporta el informe en Word o PDF.", en: "Check “Practices” and export the report in Word or PDF." },
    ],
  },
  {
    icon: "📝",
    title: { es: "Generador de ofertas", en: "Offer generator" },
    steps: [
      { es: "Rellena los datos del puesto (puesto, salario, modalidad…).", en: "Fill in the role details (title, salary, work mode…)." },
      { es: "Obtienes una oferta inclusiva analizada al momento.", en: "You get an inclusive offer analyzed instantly." },
      { es: "Pulsa «Redactar con IA» para una versión más completa.", en: "Click “Draft with AI” for a fuller version." },
    ],
  },
  {
    icon: "📄",
    title: { es: "Compatibilidad ATS", en: "ATS compatibility" },
    steps: [
      { es: "Pega una oferta y un CV.", en: "Paste a job post and a CV." },
      { es: "Ves el encaje de palabras clave y si el CV pasaría un ATS.", en: "See the keyword match and whether the CV would pass an ATS." },
      { es: "Usa «Analizar con IA» para fortalezas, carencias y recomendación.", en: "Use “Analyze with AI” for strengths, gaps and a recommendation." },
    ],
  },
  {
    icon: "🏆",
    title: { es: "Ranking de candidatos", en: "Candidate ranking" },
    steps: [
      { es: "Pega una oferta y añade varios candidatos con su CV.", en: "Paste a job post and add several candidates with their CV." },
      { es: "Se ordenan automáticamente por su encaje con el puesto.", en: "They are automatically ranked by their fit with the role." },
    ],
  },
  {
    icon: "🔎",
    title: { es: "Buscador booleano", en: "Boolean search" },
    steps: [
      { es: "Indica puestos, imprescindibles, deseables y exclusiones.", en: "Enter titles, must-haves, nice-to-haves and exclusions." },
      { es: "Copia la cadena para LinkedIn o Google X-ray.", en: "Copy the string for LinkedIn or Google X-ray." },
    ],
  },
  {
    icon: "💬",
    title: { es: "Preguntas de entrevista", en: "Interview questions" },
    steps: [
      { es: "Elige las competencias que quieres evaluar.", en: "Choose the competencies you want to assess." },
      { es: "Copia las preguntas y revisa las «preguntas a evitar».", en: "Copy the questions and review the “questions to avoid”." },
    ],
  },
  {
    icon: "✉️",
    title: { es: "Plantillas de email", en: "Email templates" },
    steps: [
      { es: "Elige la plantilla (invitación, oferta, rechazo…).", en: "Pick a template (invitation, offer, rejection…)." },
      { es: "Rellena los datos y copia el email listo para enviar.", en: "Fill in the details and copy the ready-to-send email." },
    ],
  },
];

const AI_NOTE = {
  es: "La IA es opcional. En la web funciona con un proveedor hospedado; en local puedes usar tu propio Ollama. Si no está disponible, las herramientas siguen funcionando sin ella.",
  en: "AI is optional. On the web it runs via a hosted provider; locally you can use your own Ollama. If it is unavailable, the tools still work without it.",
};

export default function GuiaClient() {
  const { lang } = useLang();

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <p className="text-slate-600 dark:text-slate-300">{INTRO[lang]}</p>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          {lang === "es" ? "Cuenta de prueba: " : "Test account: "}
          <span className="font-mono font-semibold">test@test.com</span> /{" "}
          <span className="font-mono font-semibold">test1234</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SECTIONS.map((s) => (
          <div key={s.title.en} className="card p-4">
            <h2 className="mb-2 font-semibold text-slate-900 dark:text-white">
              {s.icon} {s.title[lang]}
            </h2>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {s.steps.map((step, i) => (
                <li key={i}>{step[lang]}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="card border-brand/30 p-4 dark:border-brand-400/30">
        <h2 className="mb-1 font-semibold text-brand dark:text-brand-400">
          ✨ {lang === "es" ? "Sobre la IA" : "About the AI"}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">{AI_NOTE[lang]}</p>
      </div>
    </div>
  );
}
