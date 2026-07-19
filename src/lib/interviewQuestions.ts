// Curated interview question bank, grouped by competency, plus questions that
// should be avoided because they are discriminatory or legally risky.

export interface Competency {
  id: string;
  label: string;
  icon: string;
  questions: string[];
}

export const COMPETENCIES: Competency[] = [
  {
    id: "teamwork",
    label: "Trabajo en equipo",
    icon: "🤝",
    questions: [
      "Cuéntame una situación en la que tuviste que colaborar con un equipo para lograr un objetivo. ¿Cuál fue tu papel?",
      "¿Cómo gestionas un desacuerdo con un compañero de trabajo?",
      "Describe una ocasión en la que ayudaste a alguien del equipo a mejorar.",
    ],
  },
  {
    id: "problem",
    label: "Resolución de problemas",
    icon: "🧩",
    questions: [
      "Háblame de un problema complejo al que te enfrentaste. ¿Cómo lo abordaste?",
      "¿Cómo decides qué hacer cuando no tienes toda la información?",
      "Cuéntame una decisión difícil que tomaste y qué aprendiste de ella.",
    ],
  },
  {
    id: "leadership",
    label: "Liderazgo",
    icon: "🧭",
    questions: [
      "Describe una situación en la que lideraste una iniciativa o proyecto.",
      "¿Cómo motivas a un equipo cuando la moral está baja?",
      "Cuéntame una vez que tuviste que dar feedback difícil. ¿Cómo lo hiciste?",
    ],
  },
  {
    id: "communication",
    label: "Comunicación",
    icon: "💬",
    questions: [
      "¿Cómo explicas un tema técnico o complejo a alguien sin ese contexto?",
      "Cuéntame una situación en la que un malentendido causó un problema. ¿Cómo lo resolviste?",
      "¿Cómo te aseguras de que tu mensaje se ha entendido?",
    ],
  },
  {
    id: "adaptability",
    label: "Adaptabilidad",
    icon: "🌱",
    questions: [
      "Cuéntame una vez que cambiaron las prioridades de golpe. ¿Cómo reaccionaste?",
      "¿Cómo te pones al día cuando entras en un proyecto o tecnología nuevos?",
      "Describe una ocasión en la que tuviste que salir de tu zona de confort.",
    ],
  },
  {
    id: "results",
    label: "Orientación a resultados",
    icon: "🎯",
    questions: [
      "Cuéntame un objetivo ambicioso que lograste. ¿Cómo lo conseguiste?",
      "¿Cómo priorizas cuando tienes más trabajo del que puedes abarcar?",
      "Describe una ocasión en la que no alcanzaste un objetivo. ¿Qué hiciste después?",
    ],
  },
];

export interface AvoidQuestion {
  question: string;
  reason: string;
}

export const AVOID: AvoidQuestion[] = [
  {
    question: "¿Qué edad tienes? / ¿En qué año naciste?",
    reason: "La edad no debe influir en la selección: es discriminación por edad.",
  },
  {
    question: "¿Estás casado/a? ¿Tienes pareja?",
    reason: "El estado civil es un dato personal irrelevante para el puesto.",
  },
  {
    question: "¿Tienes hijos o piensas tenerlos?",
    reason: "Preguntar por maternidad/paternidad es discriminatorio y afecta sobre todo a mujeres.",
  },
  {
    question: "¿De dónde eres? ¿Cuál es tu nacionalidad?",
    reason: "Salvo requisito legal, basta con el permiso de trabajo; preguntar el origen discrimina.",
  },
  {
    question: "¿Tienes alguna discapacidad o problema de salud?",
    reason: "Solo cabe preguntar por la capacidad de realizar funciones esenciales, no por la salud.",
  },
  {
    question: "¿Practicas alguna religión?",
    reason: "Las creencias son un dato protegido y ajeno al desempeño del puesto.",
  },
];
