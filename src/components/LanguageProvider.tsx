"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Lang = "es" | "en";

type Dict = Record<string, { es: string; en: string }>;

// Shell/UI strings. Tool-specific content (lexicon, question bank, email
// templates) stays in Spanish for now.
const DICT: Dict = {
  "nav.inicio": { es: "Inicio", en: "Home" },
  "nav.herramientas": { es: "Herramientas", en: "Tools" },
  "nav.salir": { es: "Salir", en: "Sign out" },

  "hub.greeting": { es: "Hola, {name} 👋", en: "Hi, {name} 👋" },
  "hub.intro": {
    es: "Tu kit de herramientas para una selección más justa y eficaz. Elige una herramienta para empezar.",
    en: "Your toolkit for fairer, more effective hiring. Pick a tool to get started.",
  },
  "hub.open": { es: "Abrir →", en: "Open →" },

  "login.tagline1": { es: "El kit de herramientas para una", en: "The toolkit for" },
  "login.tagline2": {
    es: "selección más justa y eficaz",
    en: "fairer, more effective hiring",
  },
  "login.subtitle": {
    es: "Analiza ofertas, evalúa candidatos y comunica mejor: varias herramientas para reclutadores en un solo sitio.",
    en: "Analyze job posts, assess candidates and communicate better: several recruiter tools in one place.",
  },
  "login.slogan": { es: "Herramientas para reclutadores", en: "Tools for recruiters" },
  "login.email": { es: "Email", en: "Email" },
  "login.password": { es: "Contraseña", en: "Password" },
  "login.signIn": { es: "Iniciar sesión", en: "Sign in" },
  "login.entering": { es: "Entrando…", en: "Signing in…" },
  "login.wrong": { es: "Email o contraseña incorrectos.", en: "Wrong email or password." },
  "login.testAccount": { es: "Cuenta de prueba precargada:", en: "Prefilled test account:" },
  "login.noAccount": { es: "¿No tienes cuenta?", en: "No account?" },
  "login.register": { es: "Regístrate", en: "Sign up" },

  "page.dashboard.title": { es: "Analizador de sesgos", en: "Bias analyzer" },
  "page.dashboard.sub": {
    es: "Pega una oferta de empleo y detecta lenguaje sesgado o excluyente mientras escribes.",
    en: "Paste a job post and detect biased or exclusionary language as you type.",
  },
  "page.generador.title": { es: "Generador de ofertas", en: "Offer generator" },
  "page.generador.sub": {
    es: "Rellena los datos del puesto y obtén una oferta inclusiva y bien estructurada, analizada al momento.",
    en: "Fill in the role details and get an inclusive, well-structured offer, analyzed instantly.",
  },
  "page.ats.title": { es: "Compatibilidad ATS", en: "ATS compatibility" },
  "page.ats.sub": {
    es: "Compara una oferta con un currículum y comprueba qué palabras clave faltan y si el CV pasaría un filtro ATS.",
    en: "Compare a job post with a CV and check missing keywords and whether the CV would pass an ATS filter.",
  },
  "page.ranking.title": { es: "Ranking de candidatos", en: "Candidate ranking" },
  "page.ranking.sub": {
    es: "Pega una oferta y varios currículums para ordenarlos según su encaje con el puesto.",
    en: "Paste a job post and several CVs to rank them by fit with the role.",
  },
  "page.entrevista.title": { es: "Preguntas de entrevista", en: "Interview questions" },
  "page.entrevista.sub": {
    es: "Preguntas por competencia para entrevistas estructuradas, y una lista de preguntas que conviene evitar.",
    en: "Competency-based questions for structured interviews, plus a list of questions to avoid.",
  },
  "page.plantillas.title": { es: "Plantillas de email", en: "Email templates" },
  "page.plantillas.sub": {
    es: "Redacta emails a tus candidatos en segundos: invitación, información, oferta o rechazo.",
    en: "Write candidate emails in seconds: invitation, info request, offer or rejection.",
  },
  "page.compare.title": { es: "Comparador de versiones", en: "Version comparator" },
  "page.compare.sub": {
    es: "Compara dos versiones de una oferta y comprueba cuál es más inclusiva.",
    en: "Compare two versions of an offer and see which is more inclusive.",
  },
  "page.history.title": { es: "Historial", en: "History" },
  "page.history.sub": {
    es: "Tus análisis guardados y estadísticas. Se almacenan en la base de datos si está configurada, o en este navegador.",
    en: "Your saved analyses and stats. Stored in the database if configured, or in this browser.",
  },
  "page.boolean.title": { es: "Buscador booleano", en: "Boolean search builder" },
  "page.boolean.sub": {
    es: "Genera cadenas de búsqueda booleana para sourcing en LinkedIn o Google.",
    en: "Build boolean search strings for sourcing on LinkedIn or Google.",
  },
};

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string>) => string;
}

const LanguageContext = createContext<Ctx>({
  lang: "es",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = (typeof window !== "undefined" &&
      localStorage.getItem("joblens:lang")) as Lang | null;
    if (saved === "es" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("joblens:lang", l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string>) => {
      let s = DICT[key]?.[lang] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
      return s;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
