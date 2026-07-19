// Email templates for communicating with candidates. Placeholders like
// {candidato} are replaced with the recruiter's values.

export interface EmailTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "invitacion",
    label: "Invitación a entrevista",
    subject: "Entrevista para {puesto} en {empresa}",
    body: `Hola {candidato}:

Gracias por tu interés en el puesto de {puesto} en {empresa}. Nos gustaría conocerte mejor y te invitamos a una entrevista.

Fecha propuesta: {fecha} a las {hora}. Si no te viene bien, dime qué otro momento te encaja y lo ajustamos.

Un saludo,
{remitente}`,
  },
  {
    id: "info",
    label: "Solicitud de información",
    subject: "Tu candidatura para {puesto}",
    body: `Hola {candidato}:

Estamos revisando tu candidatura para el puesto de {puesto} en {empresa}. Para continuar, necesitaríamos algún dato adicional sobre tu experiencia.

¿Podrías contarnos brevemente tu disponibilidad y tus expectativas para el puesto?

Gracias por tu tiempo.
{remitente}`,
  },
  {
    id: "oferta",
    label: "Oferta de trabajo",
    subject: "Oferta para el puesto de {puesto} en {empresa}",
    body: `Hola {candidato}:

Nos alegra comunicarte que queremos incorporarte como {puesto} en {empresa}.

Te enviaremos los detalles de la oferta por escrito. Quedamos a tu disposición para resolver cualquier duda antes de tu decisión.

¡Enhorabuena y bienvenida/o!
{remitente}`,
  },
  {
    id: "rechazo",
    label: "Rechazo respetuoso",
    subject: "Sobre tu candidatura para {puesto}",
    body: `Hola {candidato}:

Gracias por participar en el proceso de selección para {puesto} en {empresa} y por el tiempo que le has dedicado.

En esta ocasión hemos avanzado con otras candidaturas cuyo perfil se ajustaba algo más a las necesidades del puesto. Ha sido una decisión difícil y valoramos mucho tu interés.

Nos gustaría conservar tu candidatura para futuras oportunidades, si te parece bien. Te deseamos mucho éxito.

Un saludo,
{remitente}`,
  },
];

export const EMAIL_FIELDS = [
  { key: "candidato", label: "Candidato/a", placeholder: "Ana" },
  { key: "puesto", label: "Puesto", placeholder: "Desarrollador/a Frontend" },
  { key: "empresa", label: "Empresa", placeholder: "Nimbus" },
  { key: "fecha", label: "Fecha", placeholder: "el martes 22" },
  { key: "hora", label: "Hora", placeholder: "10:00" },
  { key: "remitente", label: "Tu nombre", placeholder: "Equipo de Selección" },
] as const;

export function fillTemplate(text: string, values: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    const v = values[key]?.trim();
    return v ? v : `{${key}}`;
  });
}
