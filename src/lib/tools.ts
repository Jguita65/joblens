// Registry of the tools in the suite. Used by the home hub and the navbar.

export interface Tool {
  href: string;
  icon: string;
  title: string;
  description: string;
}

export const TOOLS: Tool[] = [
  {
    href: "/dashboard",
    icon: "🎯",
    title: "Analizador de sesgos",
    description: "Detecta lenguaje excluyente en tus ofertas y reescríbelo de forma inclusiva.",
  },
  {
    href: "/generador",
    icon: "📝",
    title: "Generador de ofertas",
    description: "Crea una oferta inclusiva y bien estructurada rellenando un formulario.",
  },
  {
    href: "/ats",
    icon: "📄",
    title: "Compatibilidad ATS",
    description: "Compara una oferta con un CV y descubre qué palabras clave faltan.",
  },
  {
    href: "/ranking",
    icon: "🏆",
    title: "Ranking de candidatos",
    description: "Ordena varios currículums según su encaje con la oferta.",
  },
  {
    href: "/entrevista",
    icon: "💬",
    title: "Preguntas de entrevista",
    description: "Banco de preguntas por competencia y preguntas que conviene evitar.",
  },
  {
    href: "/plantillas",
    icon: "✉️",
    title: "Plantillas de email",
    description: "Genera emails a candidatos: invitación, oferta o rechazo.",
  },
  {
    href: "/compare",
    icon: "⚖️",
    title: "Comparador de versiones",
    description: "Compara dos versiones de una oferta y comprueba cuál es mejor.",
  },
  {
    href: "/history",
    icon: "🗂️",
    title: "Historial",
    description: "Tus análisis guardados, estadísticas y evolución.",
  },
];
