// Sample job offers used by the "Biblioteca de ejemplos" in the analyzer.

export interface Example {
  id: string;
  label: string;
  hint: string;
  text: string;
}

export const EXAMPLES: Example[] = [
  {
    id: "sesgada",
    label: "Oferta muy sesgada",
    hint: "Comercial · lenguaje excluyente",
    text: `Se busca hombre joven y dinámico, un auténtico crack y ninja de las ventas, con máxima disponibilidad y capacidad de sacrificio.

Requisitos:
- Solo hombres, menores de 30 años, con buena presencia.
- Recién graduado, nativo digital y con energía juvenil.
- Nacionalidad española y sin cargas familiares.
- Resistencia al estrés extrema y pasión por el trabajo.
- Imprescindible adjuntar una fotografía reciente e indicar estado civil.
- Se valora perfil workaholic, able-bodied, dispuesto a work hard, play hard.`,
  },
  {
    id: "moderada",
    label: "Oferta con sesgos sutiles",
    hint: "Marketing · sesgos moderados",
    text: `Buscamos un rockstar del marketing digital para un entorno fast-paced.

- Perfil joven con energía y ganas de comerse el mundo.
- Nativo digital, acostumbrado a trabajar bajo presión.
- Disponibilidad total y actitud todoterreno.
- Se valora buena presencia para representar a la marca.`,
  },
  {
    id: "inclusiva",
    label: "Oferta inclusiva (buena)",
    hint: "Desarrollo · lenguaje cuidado",
    text: `Buscamos una persona desarrolladora de software para unirse a nuestro equipo.

- Experiencia de 2 años con JavaScript y React.
- Capacidad de trabajo en equipo y comunicación clara.
- Ofrecemos horario flexible y trabajo remoto.
- Valoramos la diversidad: fomentamos las candidaturas de cualquier perfil.`,
  },
];
