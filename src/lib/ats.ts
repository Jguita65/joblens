// ATS matching engine: compares a job offer against a CV and checks how well
// the CV would pass an Applicant Tracking System. Local and deterministic.

export interface Keyword {
  term: string;
  count: number;
  present: boolean;
}

export interface AtsCheck {
  id: string;
  label: string;
  ok: boolean;
  tip: string;
}

export interface AtsReport {
  keywords: Keyword[];
  matched: number;
  total: number;
  keywordScore: number;
  checks: AtsCheck[];
  structureScore: number;
  atsScore: number;
  cvWords: number;
}

const STOPWORDS = new Set([
  // Spanish
  "para", "con", "las", "los", "una", "unos", "unas", "del", "que", "por", "como",
  "más", "muy", "sus", "este", "esta", "estos", "estas", "ser", "está", "están",
  "nuestro", "nuestra", "nuestros", "nuestras", "sobre", "entre", "también",
  "todo", "toda", "todos", "todas", "cada", "sin", "año", "años", "puesto",
  "empresa", "trabajo", "equipo", "buscamos", "requisitos", "funciones", "perfil",
  "candidato", "candidata", "persona", "personas", "ofrecemos", "valoramos",
  "experiencia", "conocimientos", "capacidad", "gestión", "desarrollo",
  // English
  "the", "and", "for", "with", "you", "your", "our", "are", "will", "have",
  "this", "that", "from", "role", "team", "work", "must", "should", "job",
  "skills", "experience", "requirements", "responsibilities", "about",
]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

const STOPWORDS_NORM = new Set([...STOPWORDS].map((w) => normalize(w)));

/** Split into tokens, keeping the accented form for display and a normalized key. */
function tokenize(text: string): { raw: string; norm: string }[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}0-9+#.]+/u)
    .map((t) => t.replace(/^[.]+|[.]+$/g, ""))
    .map((raw) => ({ raw, norm: normalize(raw) }))
    .filter(
      (t) =>
        t.norm.length >= 3 &&
        !STOPWORDS_NORM.has(t.norm) &&
        !/^\d+$/.test(t.norm)
    );
}

/** Top keywords of a text, ranked by frequency then length. */
export function extractKeywords(text: string, limit = 25): { term: string; count: number }[] {
  const counts = new Map<string, number>();
  const display = new Map<string, string>();
  for (const { raw, norm } of tokenize(text)) {
    counts.set(norm, (counts.get(norm) ?? 0) + 1);
    if (!display.has(norm)) display.set(norm, raw);
  }
  return [...counts.entries()]
    .map(([norm, count]) => ({ term: display.get(norm) ?? norm, count }))
    .sort((a, b) => b.count - a.count || b.term.length - a.term.length)
    .slice(0, limit);
}

function runChecks(cvText: string, words: number): AtsCheck[] {
  const norm = normalize(cvText);
  const has = (re: RegExp) => re.test(norm);

  return [
    {
      id: "email",
      label: "Email de contacto",
      ok: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(cvText),
      tip: "Incluye un email visible; muchos ATS lo extraen automáticamente.",
    },
    {
      id: "phone",
      label: "Teléfono de contacto",
      ok: /(\+?\d[\d\s().-]{7,}\d)/.test(cvText),
      tip: "Añade un teléfono en formato claro (con prefijo si aplica).",
    },
    {
      id: "experience",
      label: "Sección de experiencia",
      ok: has(/experiencia|experience|trayectoria|historial laboral/),
      tip: "Incluye un apartado claro de experiencia laboral con fechas.",
    },
    {
      id: "education",
      label: "Sección de formación",
      ok: has(/formacion|educacion|estudios|education|titulaci/),
      tip: "Añade tu formación académica en una sección propia.",
    },
    {
      id: "skills",
      label: "Sección de habilidades",
      ok: has(/habilidades|competencias|aptitudes|skills|tecnolog/),
      tip: "Lista tus habilidades y tecnologías: mejora el emparejamiento ATS.",
    },
    {
      id: "length",
      label: "Extensión adecuada",
      ok: words >= 150 && words <= 1200,
      tip:
        words < 150
          ? "El CV es muy corto; añade más detalle de tu experiencia."
          : "El CV es muy largo; sintetiza a 1–2 páginas.",
    },
  ];
}

/** Compare a job offer against a CV and produce an ATS report. */
export function atsReport(jobText: string, cvText: string): AtsReport {
  const cvNorm = normalize(cvText);
  const jobKeywords = extractKeywords(jobText, 25);

  const keywords: Keyword[] = jobKeywords.map(({ term, count }) => ({
    term,
    count,
    // Match the normalized keyword against the normalized CV text.
    present: new RegExp(`(?<![a-z0-9])${escapeRegex(normalize(term))}`, "i").test(
      cvNorm
    ),
  }));

  const matched = keywords.filter((k) => k.present).length;
  const total = keywords.length;
  const keywordScore = total > 0 ? Math.round((matched / total) * 100) : 0;

  const cvWords = cvText.trim() ? cvText.trim().split(/\s+/).length : 0;
  const checks = runChecks(cvText, cvWords);
  const okChecks = checks.filter((c) => c.ok).length;
  const structureScore = Math.round((okChecks / checks.length) * 100);

  const hasInput = jobText.trim().length > 0 && cvText.trim().length > 0;
  const atsScore = hasInput
    ? Math.round(keywordScore * 0.6 + structureScore * 0.4)
    : 0;

  return {
    keywords,
    matched,
    total,
    keywordScore,
    checks,
    structureScore,
    atsScore,
    cvWords,
  };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
