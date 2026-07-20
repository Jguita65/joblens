// Generates slides.pptx (PowerPoint) for the project delivery.
// Run with: npm run slides:pptx

import pptxgen from "pptxgenjs";

const BRAND = "4F46E5";
const VIOLET = "8B5CF6";
const PINK = "EC4899";
const DARK = "0F172A";
const SLATE = "334155";
const GRAY = "64748B";
const LIGHT = "F1F5F9";
const FONT = "Segoe UI";

const pptx = new pptxgen();
pptx.defineLayout({ name: "W16x9", width: 13.33, height: 7.5 });
pptx.layout = "W16x9";
pptx.author = "Juan Ignacio Guitart";
pptx.title = "RecruitKit — Herramientas para reclutadores";

const W = 13.33;
const H = 7.5;

function footer(slide, page) {
  slide.addText("RecruitKit · TFM · Juan Ignacio Guitart", {
    x: 0.7, y: H - 0.5, w: 8, h: 0.3, fontSize: 9, color: GRAY, fontFace: FONT,
  });
  slide.addText(String(page), {
    x: W - 1.2, y: H - 0.5, w: 0.6, h: 0.3, fontSize: 9, color: GRAY,
    align: "right", fontFace: FONT,
  });
}

function logoBadge(slide, x, y, size) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w: size, h: size, rectRadius: size * 0.22,
    fill: { color: BRAND }, line: { type: "none" },
  });
  slide.addText("RK", {
    x, y, w: size, h: size, align: "center", valign: "middle",
    fontSize: size * 26, bold: true, color: "FFFFFF", fontFace: FONT,
  });
}

// ---- Title slide ----
function titleSlide() {
  const s = pptx.addSlide();
  s.background = { color: DARK };
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.28, h: H, fill: { color: BRAND } });
  s.addShape(pptx.ShapeType.rect, { x: 0.28, y: 0, w: 0.14, h: H, fill: { color: PINK } });
  logoBadge(s, 1.1, 1.5, 1.1);
  s.addText("RecruitKit", {
    x: 1.1, y: 2.9, w: 11, h: 1.2, fontSize: 54, bold: true, color: "FFFFFF", fontFace: FONT,
  });
  s.addText("Herramientas para una selección más justa y eficaz", {
    x: 1.1, y: 4.1, w: 11, h: 0.7, fontSize: 22, color: "CBD5E1", fontFace: FONT,
  });
  s.addText("Juan Ignacio Guitart   ·   TFM   ·   2026", {
    x: 1.1, y: 5.2, w: 11, h: 0.5, fontSize: 16, color: "94A3B8", fontFace: FONT,
  });
}

// ---- Content slide ----
function contentSlide(title, bullets, page) {
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pptx.ShapeType.rect, { x: 0.7, y: 0.62, w: 0.55, h: 0.12, fill: { color: BRAND } });
  s.addText(title, {
    x: 0.7, y: 0.85, w: 12, h: 0.8, fontSize: 30, bold: true, color: DARK, fontFace: FONT,
  });
  s.addText(
    bullets.map((b) => ({
      text: b,
      options: { bullet: { indent: 18 }, breakLine: true, paraSpaceAfter: 10 },
    })),
    {
      x: 0.9, y: 1.9, w: 11.5, h: 4.6, fontSize: 19, color: SLATE, fontFace: FONT,
      valign: "top", lineSpacingMultiple: 1.15,
    }
  );
  footer(s, page);
}

// ---- Tools grid slide ----
function toolsSlide(page) {
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pptx.ShapeType.rect, { x: 0.7, y: 0.62, w: 0.55, h: 0.12, fill: { color: BRAND } });
  s.addText("Las herramientas", {
    x: 0.7, y: 0.85, w: 12, h: 0.8, fontSize: 30, bold: true, color: DARK, fontFace: FONT,
  });

  const tools = [
    ["🎯", "Analizador de sesgos", BRAND],
    ["📝", "Generador de ofertas", VIOLET],
    ["📄", "Compatibilidad ATS", "0EA5E9"],
    ["🏆", "Ranking de candidatos", "F59E0B"],
    ["🔎", "Buscador booleano", "14B8A6"],
    ["💬", "Preguntas de entrevista", PINK],
    ["✉️", "Plantillas de email", "6366F1"],
    ["⚖️", "Comparador e historial", "64748B"],
  ];

  const cols = 4, rows = 2;
  const bw = 2.75, bh = 1.9, gapX = 0.3, gapY = 0.45;
  const totalW = cols * bw + (cols - 1) * gapX;
  const startX = (W - totalW) / 2;
  const startY = 2.1;

  tools.forEach((t, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    const x = startX + c * (bw + gapX);
    const y = startY + r * (bh + gapY);
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w: bw, h: bh, rectRadius: 0.12,
      fill: { color: LIGHT }, line: { color: "E2E8F0", width: 1 },
    });
    s.addShape(pptx.ShapeType.rect, { x, y, w: 0.1, h: bh, fill: { color: t[2] } });
    s.addText(t[0], { x: x + 0.15, y: y + 0.2, w: bw - 0.3, h: 0.7, fontSize: 26, align: "left", fontFace: "Segoe UI Emoji" });
    s.addText(t[1], {
      x: x + 0.2, y: y + 0.95, w: bw - 0.35, h: 0.8, fontSize: 15, bold: true,
      color: DARK, fontFace: FONT, valign: "top",
    });
  });
  footer(s, page);
}

// ---- Section / closing slide ----
function closingSlide() {
  const s = pptx.addSlide();
  s.background = { color: DARK };
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.28, h: H, fill: { color: PINK } });
  s.addShape(pptx.ShapeType.rect, { x: 0.28, y: 0, w: 0.14, h: H, fill: { color: BRAND } });
  s.addText("¡Gracias!", {
    x: 1.1, y: 2.6, w: 11, h: 1.2, fontSize: 48, bold: true, color: "FFFFFF", fontFace: FONT,
  });
  s.addText("Juan Ignacio Guitart", {
    x: 1.1, y: 3.9, w: 11, h: 0.6, fontSize: 20, color: "CBD5E1", fontFace: FONT,
  });
  s.addText("juanignacioguitart@gmail.com", {
    x: 1.1, y: 4.5, w: 11, h: 0.5, fontSize: 16, color: "94A3B8", fontFace: FONT,
  });
}

// ---- Build the deck ----
titleSlide();

contentSlide(
  "El problema",
  [
    "Las ofertas de empleo contienen, a menudo sin querer, lenguaje sesgado (género, edad, capacitismo, jerga) que reduce la diversidad y puede ser ilegal.",
    "El proceso de selección está fragmentado: redactar la oferta, filtrar CVs, buscar candidatos, entrevistar y comunicar… en herramientas dispersas.",
  ],
  2
);

contentSlide(
  "La solución",
  [
    "RecruitKit: un panel con varias herramientas que cubren el proceso de selección, con foco en la inclusividad.",
    "Análisis local y determinista, con IA opcional.",
    "Interfaz en español e inglés.",
    "Desplegable gratis, sin infraestructura obligatoria.",
  ],
  3
);

toolsSlide(4);

contentSlide(
  "Analizador de sesgos",
  [
    "Resalta los fragmentos problemáticos por categoría y explica cada hallazgo.",
    "Índice de inclusividad de 0 a 100.",
    "Detección de buenas prácticas: salario, flexibilidad, igualdad…",
    "Reescritura: aplica las sugerencias una a una o toda de golpe.",
  ],
  5
);

contentSlide(
  "Reescritura con IA (opcional)",
  [
    "Motor local determinista, con IA opcional para una reescritura más natural.",
    "Ollama local (privado, en tu equipo).",
    "Proveedor hospedado compatible con OpenAI (Groq): IA para todos en la web.",
    "Degradación elegante: sin IA, se usa la reescritura determinista.",
  ],
  6
);

contentSlide(
  "Del lado del candidato y sourcing",
  [
    "Compatibilidad ATS: encaje oferta ↔ CV y palabras clave que faltan.",
    "Ranking de candidatos: ordena varios CV por su encaje con la oferta.",
    "Buscador booleano: cadenas para LinkedIn y Google X-ray.",
  ],
  7
);

contentSlide(
  "Entrevista y comunicación",
  [
    "Banco de preguntas por competencia para entrevistas estructuradas.",
    "Lista de preguntas a evitar (legalmente sensibles: edad, estado civil…).",
    "Plantillas de email: invitación, información, oferta y rechazo.",
  ],
  8
);

contentSlide(
  "Stack técnico",
  [
    "Next.js 15 · React 19 · TypeScript.",
    "Tailwind CSS · Auth.js (NextAuth v5) con sesión JWT.",
    "Prisma + PostgreSQL (opcional).",
    "Vitest (tests del motor) · docx (informes Word).",
    "Ollama / Groq (IA opcional) · Despliegue en Vercel.",
  ],
  9
);

contentSlide(
  "Decisiones técnicas",
  [
    "Motor de análisis local y determinista (lexicón curado, sin \"caja negra\").",
    "Degradación elegante: BBDD e IA opcionales; la app nunca depende de ellas.",
    "Auth con JWT sin base de datos y usuario semilla.",
    "i18n español/inglés y modo claro/oscuro.",
    "Tests del motor para ampliar el lexicón sin regresiones.",
  ],
  10
);

contentSlide(
  "Enlaces",
  [
    "Repositorio: https://github.com/Jguita65/joblens",
    "App: https://joblens-puce.vercel.app",
    "Cuenta de prueba: test@test.com / test1234",
  ],
  11
);

closingSlide();

await pptx.writeFile({ fileName: "slides.pptx" });
console.log("slides.pptx generado.");
