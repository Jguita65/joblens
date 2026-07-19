// Positive-signal detection: rewards inclusive/attractive practices instead of
// only flagging problems. Turns JobLens into a full inclusive-writing assistant.
//
// Deterministic and local, like the rest of the engine.

export interface PracticeGroup {
  id: string;
  label: string;
  icon: string;
  /** Regex bodies (matched case-insensitively, Unicode). */
  patterns: string[];
  /** Advice shown when the practice is missing. */
  tip: string;
}

export interface PracticeResult {
  id: string;
  label: string;
  icon: string;
  present: boolean;
  tip: string;
}

export interface GoodPracticesReport {
  results: PracticeResult[];
  present: number;
  total: number;
  /** 0–100 completeness score. */
  completeness: number;
}

export const PRACTICE_GROUPS: PracticeGroup[] = [
  {
    id: "salary",
    label: "Transparencia salarial",
    icon: "💶",
    patterns: [
      "salari",
      "sueldo",
      "retribuci[oó]n",
      "remuneraci[oó]n",
      "banda\\s+salarial",
      "rango\\s+salarial",
      "\\d+\\s?[.,]?\\d*\\s?€",
      "€\\s?\\d",
      "\\d+\\s?k\\b",
      "salary|compensation",
    ],
    tip: "Indica el rango salarial: aumenta la confianza y el número de candidaturas.",
  },
  {
    id: "flexibility",
    label: "Flexibilidad y teletrabajo",
    icon: "🏡",
    patterns: [
      "teletrabajo",
      "trabajo\\s+remoto",
      "\\bremoto\\b",
      "h[ií]brido",
      "flexib",
      "conciliaci[oó]n",
      "home\\s?office",
      "remote|flexible\\s+hours",
    ],
    tip: "Menciona si hay teletrabajo, horario flexible o medidas de conciliación.",
  },
  {
    id: "equal",
    label: "Igualdad y diversidad",
    icon: "⚖️",
    patterns: [
      "igualdad\\s+de\\s+oportunidades",
      "diversidad",
      "inclusi[oó]n",
      "inclusiv",
      "no\\s+discrimina",
      "con\\s+independencia\\s+de",
      "todas\\s+las\\s+personas",
      "equal\\s+opportunit",
    ],
    tip: "Añade una declaración de igualdad de oportunidades y compromiso con la diversidad.",
  },
  {
    id: "growth",
    label: "Desarrollo y formación",
    icon: "📈",
    patterns: [
      "formaci[oó]n",
      "desarrollo\\s+profesional",
      "plan\\s+de\\s+carrera",
      "crecimiento",
      "mentor",
      "aprendizaje",
      "training|career\\s+growth",
    ],
    tip: "Describe oportunidades de formación, mentoría o crecimiento profesional.",
  },
  {
    id: "benefits",
    label: "Beneficios claros",
    icon: "🎁",
    patterns: [
      "seguro\\s+m[eé]dico",
      "d[ií]as\\s+de\\s+vacaciones",
      "beneficios",
      "ticket\\s+restaurante",
      "guarder[ií]a",
      "plan\\s+de\\s+pensiones",
      "benefits|health\\s+insurance",
    ],
    tip: "Enumera los beneficios concretos (seguro, vacaciones, ayudas, etc.).",
  },
  {
    id: "inclusive_form",
    label: "Lenguaje inclusivo",
    icon: "💬",
    patterns: [
      "\\bpersona(?:s)?\\b",
      "\\w+os/as\\b",
      "\\w+/a\\b",
      "quien(?:es)?\\b",
      "profesionales",
    ],
    tip: "Usa formas neutras ('persona', desdoblamiento) en lugar del masculino genérico.",
  },
];

const compiled = PRACTICE_GROUPS.map((g) => ({
  group: g,
  regex: new RegExp(`(?:${g.patterns.join("|")})`, "iu"),
}));

export function detectGoodPractices(text: string): GoodPracticesReport {
  const results: PracticeResult[] = compiled.map(({ group, regex }) => ({
    id: group.id,
    label: group.label,
    icon: group.icon,
    tip: group.tip,
    present: text.trim().length > 0 ? regex.test(text) : false,
  }));

  const present = results.filter((r) => r.present).length;
  const total = results.length;
  return {
    results,
    present,
    total,
    completeness: Math.round((present / total) * 100),
  };
}
