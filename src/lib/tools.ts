// Registry of the tools in the suite. Used by the home hub and the navbar.

export interface Tool {
  href: string;
  icon: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
}

export const TOOLS: Tool[] = [
  {
    href: "/dashboard",
    icon: "🎯",
    title: { es: "Analizador de sesgos", en: "Bias analyzer" },
    description: {
      es: "Detecta lenguaje excluyente en tus ofertas y reescríbelo de forma inclusiva.",
      en: "Detect exclusionary language in your offers and rewrite it inclusively.",
    },
  },
  {
    href: "/generador",
    icon: "📝",
    title: { es: "Generador de ofertas", en: "Offer generator" },
    description: {
      es: "Crea una oferta inclusiva y bien estructurada rellenando un formulario.",
      en: "Build an inclusive, well-structured offer from a simple form.",
    },
  },
  {
    href: "/ats",
    icon: "📄",
    title: { es: "Compatibilidad ATS", en: "ATS compatibility" },
    description: {
      es: "Compara una oferta con un CV y descubre qué palabras clave faltan.",
      en: "Compare an offer with a CV and find the missing keywords.",
    },
  },
  {
    href: "/ranking",
    icon: "🏆",
    title: { es: "Ranking de candidatos", en: "Candidate ranking" },
    description: {
      es: "Ordena varios currículums según su encaje con la oferta.",
      en: "Rank several CVs by how well they fit the offer.",
    },
  },
  {
    href: "/boolean",
    icon: "🔎",
    title: { es: "Buscador booleano", en: "Boolean search" },
    description: {
      es: "Genera cadenas de búsqueda para sourcing en LinkedIn o Google.",
      en: "Generate search strings for sourcing on LinkedIn or Google.",
    },
  },
  {
    href: "/entrevista",
    icon: "💬",
    title: { es: "Preguntas de entrevista", en: "Interview questions" },
    description: {
      es: "Banco de preguntas por competencia y preguntas que conviene evitar.",
      en: "Competency question bank and questions you should avoid.",
    },
  },
  {
    href: "/plantillas",
    icon: "✉️",
    title: { es: "Plantillas de email", en: "Email templates" },
    description: {
      es: "Genera emails a candidatos: invitación, oferta o rechazo.",
      en: "Generate candidate emails: invitation, offer or rejection.",
    },
  },
  {
    href: "/compare",
    icon: "⚖️",
    title: { es: "Comparador de versiones", en: "Version comparator" },
    description: {
      es: "Compara dos versiones de una oferta y comprueba cuál es mejor.",
      en: "Compare two versions of an offer and see which is better.",
    },
  },
  {
    href: "/history",
    icon: "🗂️",
    title: { es: "Historial", en: "History" },
    description: {
      es: "Tus análisis guardados, estadísticas y evolución.",
      en: "Your saved analyses, stats and trend.",
    },
  },
];
