// Assembles an inclusive, well-structured job offer from a set of fields.

export interface OfferFields {
  puesto: string;
  empresa: string;
  modalidad: "Presencial" | "Híbrido" | "Remoto" | "";
  ubicacion: string;
  salarioMin: string;
  salarioMax: string;
  responsabilidades: string;
  requisitos: string;
  beneficios: string;
  igualdad: boolean;
}

export const EMPTY_OFFER: OfferFields = {
  puesto: "",
  empresa: "",
  modalidad: "",
  ubicacion: "",
  salarioMin: "",
  salarioMax: "",
  responsabilidades: "",
  requisitos: "",
  beneficios: "",
  igualdad: true,
};

function bullets(text: string): string {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => (l.startsWith("-") ? l : `- ${l}`))
    .join("\n");
}

export function buildOffer(f: OfferFields): string {
  const parts: string[] = [];
  const puesto = f.puesto.trim() || "[puesto]";

  const intro = f.empresa.trim()
    ? `En ${f.empresa.trim()} buscamos una persona para el puesto de ${puesto}.`
    : `Buscamos una persona para el puesto de ${puesto}.`;
  parts.push(intro);

  const cond: string[] = [];
  if (f.modalidad) cond.push(`Modalidad: ${f.modalidad.toLowerCase()}`);
  if (f.ubicacion.trim()) cond.push(`Ubicación: ${f.ubicacion.trim()}`);
  if (f.salarioMin.trim() || f.salarioMax.trim()) {
    const min = f.salarioMin.trim();
    const max = f.salarioMax.trim();
    const rango =
      min && max ? `${min}–${max} €` : `${min || max} €`;
    cond.push(`Salario: ${rango} brutos anuales`);
  }
  if (cond.length) parts.push(cond.join(" · "));

  if (f.responsabilidades.trim()) {
    parts.push(`Responsabilidades:\n${bullets(f.responsabilidades)}`);
  }
  if (f.requisitos.trim()) {
    parts.push(`Requisitos:\n${bullets(f.requisitos)}`);
  }
  if (f.beneficios.trim()) {
    parts.push(`Qué ofrecemos:\n${bullets(f.beneficios)}`);
  }

  if (f.igualdad) {
    parts.push(
      "Fomentamos la igualdad de oportunidades y valoramos la diversidad: animamos a presentar su candidatura a cualquier persona, con independencia de su género, edad, origen o discapacidad."
    );
  }

  return parts.join("\n\n");
}
