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
const GREEN = "16A34A";
const FONT = "Segoe UI";

const pptx = new pptxgen();
pptx.defineLayout({ name: "W16x9", width: 13.33, height: 7.5 });
pptx.layout = "W16x9";
pptx.author = "Juan Ignacio Guitart";
pptx.title = "RecruitKit — Herramientas para reclutadores";

const W = 13.33;
const H = 7.5;

function footer(slide, page) {
  slide.addShape(pptx.ShapeType.line, {
    x: 0.7, y: H - 0.6, w: W - 1.4, h: 0, line: { color: "E2E8F0", width: 1 },
  });
  slide.addText("RecruitKit · TFM · Juan Ignacio Guitart", {
    x: 0.7, y: H - 0.5, w: 9, h: 0.3, fontSize: 9, color: GRAY, fontFace: FONT,
  });
  slide.addText(String(page), {
    x: W - 1.2, y: H - 0.5, w: 0.6, h: 0.3, fontSize: 9, color: GRAY,
    align: "right", fontFace: FONT,
  });
}

function header(slide, title) {
  slide.addShape(pptx.ShapeType.rect, { x: 0.7, y: 0.62, w: 0.55, h: 0.12, fill: { color: BRAND } });
  slide.addText(title, {
    x: 0.7, y: 0.85, w: 12, h: 0.8, fontSize: 30, bold: true, color: DARK, fontFace: FONT,
  });
}

function logoBadge(slide, x, y, size) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w: size, h: size, rectRadius: size * 0.22, fill: { color: BRAND }, line: { type: "none" },
  });
  slide.addText("RK", {
    x, y, w: size, h: size, align: "center", valign: "middle",
    fontSize: size * 26, bold: true, color: "FFFFFF", fontFace: FONT,
  });
}

// ---------- Title ----------
function titleSlide() {
  const s = pptx.addSlide();
  s.background = { color: DARK };
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.28, h: H, fill: { color: BRAND } });
  s.addShape(pptx.ShapeType.rect, { x: 0.28, y: 0, w: 0.14, h: H, fill: { color: PINK } });
  logoBadge(s, 1.1, 1.2, 1.0);
  s.addText("RecruitKit", { x: 1.1, y: 2.5, w: 11.5, h: 1.2, fontSize: 54, bold: true, color: "FFFFFF", fontFace: FONT });
  s.addText("El kit de herramientas para una selección más justa y eficaz", {
    x: 1.1, y: 3.75, w: 11.5, h: 0.7, fontSize: 22, color: "CBD5E1", fontFace: FONT,
  });
  s.addText(
    [
      { text: "Analiza y redacta ofertas · Evalúa candidatos · Entrevista y comunica", options: { color: "94A3B8" } },
    ],
    { x: 1.1, y: 4.55, w: 11.5, h: 0.5, fontSize: 15, fontFace: FONT }
  );
  s.addText("Juan Ignacio Guitart   ·   TFM   ·   2026", {
    x: 1.1, y: 5.6, w: 11, h: 0.5, fontSize: 15, color: "64748B", fontFace: FONT,
  });
}

// ---------- Generic content ----------
function contentSlide(title, bullets, page) {
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  header(s, title);
  s.addText(
    bullets.map((b) => ({ text: b, options: { bullet: { indent: 18 }, breakLine: true, paraSpaceAfter: 10 } })),
    { x: 0.9, y: 1.9, w: 11.5, h: 4.4, fontSize: 19, color: SLATE, fontFace: FONT, valign: "top", lineSpacingMultiple: 1.15 }
  );
  footer(s, page);
}

// ---------- Value / benefits ----------
function valueSlide(page) {
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  header(s, "La solución: RecruitKit");
  s.addText("Un panel con varias herramientas que cubren el proceso de selección, con foco en la inclusividad.", {
    x: 0.9, y: 1.7, w: 11.5, h: 0.6, fontSize: 17, color: SLATE, fontFace: FONT,
  });
  const cards = [
    ["⚖️", "Más justo", "Detecta y corrige sesgos; fomenta la diversidad.", BRAND],
    ["⏱️", "Más eficaz", "Redacta, filtra y comunica en menos tiempo.", VIOLET],
    ["🔒", "Sin ataduras", "Funciona con o sin base de datos y con IA opcional.", "14B8A6"],
    ["🌍", "Accesible", "Español e inglés, claro/oscuro, desplegado gratis.", PINK],
  ];
  const bw = 2.75, bh = 2.6, gap = 0.3;
  const startX = (W - (4 * bw + 3 * gap)) / 2;
  cards.forEach((c, i) => {
    const x = startX + i * (bw + gap), y = 2.6;
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: bw, h: bh, rectRadius: 0.12, fill: { color: LIGHT }, line: { color: "E2E8F0", width: 1 } });
    s.addShape(pptx.ShapeType.rect, { x, y, w: bw, h: 0.12, fill: { color: c[3] } });
    s.addText(c[0], { x, y: y + 0.25, w: bw, h: 0.7, align: "center", fontSize: 30, fontFace: "Segoe UI Emoji" });
    s.addText(c[1], { x, y: y + 1.05, w: bw, h: 0.4, align: "center", fontSize: 17, bold: true, color: DARK, fontFace: FONT });
    s.addText(c[2], { x: x + 0.2, y: y + 1.5, w: bw - 0.4, h: 0.9, align: "center", fontSize: 12.5, color: GRAY, fontFace: FONT, valign: "top" });
  });
  footer(s, page);
}

// ---------- Tools grid ----------
function toolsSlide(page) {
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  header(s, "Las herramientas");
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
  const cols = 4, bw = 2.75, bh = 1.9, gapX = 0.3, gapY = 0.45;
  const startX = (W - (cols * bw + (cols - 1) * gapX)) / 2, startY = 2.1;
  tools.forEach((t, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    const x = startX + c * (bw + gapX), y = startY + r * (bh + gapY);
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: bw, h: bh, rectRadius: 0.12, fill: { color: LIGHT }, line: { color: "E2E8F0", width: 1 } });
    s.addShape(pptx.ShapeType.rect, { x, y, w: 0.1, h: bh, fill: { color: t[2] } });
    s.addText(t[0], { x: x + 0.15, y: y + 0.2, w: bw - 0.3, h: 0.7, fontSize: 26, fontFace: "Segoe UI Emoji" });
    s.addText(t[1], { x: x + 0.2, y: y + 0.95, w: bw - 0.35, h: 0.8, fontSize: 15, bold: true, color: DARK, fontFace: FONT, valign: "top" });
  });
  footer(s, page);
}

// ---------- AI features ----------
function aiFeaturesSlide(page) {
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  header(s, "Funciones potenciadas por IA");
  s.addText("Integradas con la API de Groq (en la nube) o con Ollama en local.", {
    x: 0.9, y: 1.65, w: 11.5, h: 0.5, fontSize: 16, color: GRAY, fontFace: FONT,
  });
  const cards = [
    ["✨", "Reescritura inclusiva", "Convierte una oferta sesgada en una versión neutra y natural."],
    ["📝", "Redacción de ofertas", "Escribe una oferta completa y atractiva a partir de unos datos."],
    ["🧑‍💼", "Análisis de candidato", "Resume fortalezas, carencias y una recomendación (CV ↔ oferta)."],
  ];
  const bw = 3.7, bh = 2.9, gap = 0.35;
  const startX = (W - (3 * bw + 2 * gap)) / 2, y = 2.5;
  cards.forEach((c, i) => {
    const x = startX + i * (bw + gap);
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: bw, h: bh, rectRadius: 0.14, fill: { color: "EEF2FF" }, line: { color: "C7D2FE", width: 1 } });
    s.addText(c[0], { x, y: y + 0.35, w: bw, h: 0.8, align: "center", fontSize: 34, fontFace: "Segoe UI Emoji" });
    s.addText(c[1], { x: x + 0.2, y: y + 1.35, w: bw - 0.4, h: 0.6, align: "center", fontSize: 17, bold: true, color: BRAND, fontFace: FONT });
    s.addText(c[2], { x: x + 0.3, y: y + 1.95, w: bw - 0.6, h: 0.9, align: "center", fontSize: 13, color: SLATE, fontFace: FONT, valign: "top" });
  });
  footer(s, page);
}

// ---------- AI architecture (Groq) ----------
function aiArchSlide(page) {
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  header(s, "Arquitectura de IA · Groq + Ollama");

  const box = (x, y, w, h, title, sub, color, fill) => {
    s.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color, width: 1.5 } });
    s.addText(title, { x: x + 0.1, y: y + 0.15, w: w - 0.2, h: 0.4, align: "center", fontSize: 14, bold: true, color: DARK, fontFace: FONT });
    if (sub) s.addText(sub, { x: x + 0.1, y: y + 0.6, w: w - 0.2, h: 0.5, align: "center", fontSize: 11, color: GRAY, fontFace: FONT });
  };
  const arrow = (x1, y1, x2, y2) => {
    const x = Math.min(x1, x2), y = Math.min(y1, y2);
    const w = Math.max(Math.abs(x2 - x1), 0.01), h = Math.max(Math.abs(y2 - y1), 0.01);
    s.addShape(pptx.ShapeType.line, {
      x, y, w, h, flipH: x2 < x1, flipV: y2 < y1,
      line: { color: BRAND, width: 2, endArrowType: "triangle" },
    });
  };

  box(0.8, 2.7, 2.5, 1.2, "Usuario", "Navegador", GRAY, LIGHT);
  box(4.2, 2.7, 3.2, 1.2, "RecruitKit", "Next.js en Vercel · /api/ai", BRAND, "EEF2FF");
  box(8.5, 1.65, 4.0, 1.2, "Groq API (nube)", "IA para todos en la web", "16A34A", "F0FDF4");
  box(8.5, 3.75, 4.0, 1.2, "Ollama (local)", "privado, sin coste", VIOLET, "F5F3FF");

  arrow(3.3, 3.3, 4.2, 3.3);
  arrow(7.4, 3.1, 8.5, 2.25);
  arrow(7.4, 3.5, 8.5, 4.35);

  s.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 5.4, w: 11.7, h: 0.9, rectRadius: 0.1, fill: { color: "FFF7ED" }, line: { color: "FED7AA", width: 1 } });
  s.addText(
    [
      { text: "Degradación elegante: ", options: { bold: true, color: "9A3412" } },
      { text: "si no hay IA disponible, la app usa la reescritura determinista del lexicón. La clave de la API vive solo en el servidor.", options: { color: SLATE } },
    ],
    { x: 1.0, y: 5.55, w: 11.3, h: 0.6, fontSize: 13, fontFace: FONT, valign: "middle" }
  );
  footer(s, page);
}

// ---------- Stack (pills) ----------
function stackSlide(page) {
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  header(s, "Stack técnico");

  const layers = [
    ["Frontend", ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS"], BRAND],
    ["Auth", ["Auth.js (NextAuth v5)", "Sesión JWT"], VIOLET],
    ["Datos", ["Prisma", "PostgreSQL (opcional)", "localStorage"], "0EA5E9"],
    ["IA", ["Groq API", "Ollama (local)"], GREEN],
    ["Calidad", ["Vitest", "docx", "ESLint"], "F59E0B"],
    ["Deploy", ["Vercel"], PINK],
  ];

  let y = 1.9;
  const rowH = 0.78;
  layers.forEach(([label, items, color]) => {
    s.addText(label, { x: 0.8, y, w: 1.9, h: 0.5, fontSize: 15, bold: true, color, fontFace: FONT, valign: "middle" });
    let x = 2.9;
    items.forEach((it) => {
      const w = Math.min(4.2, 0.5 + it.length * 0.105);
      s.addShape(pptx.ShapeType.roundRect, { x, y: y + 0.02, w, h: 0.46, rectRadius: 0.23, fill: { color: LIGHT }, line: { color: "E2E8F0", width: 1 } });
      s.addText(it, { x, y: y + 0.02, w, h: 0.46, align: "center", valign: "middle", fontSize: 12.5, color: SLATE, fontFace: FONT });
      x += w + 0.2;
    });
    y += rowH;
  });
  footer(s, page);
}

function closingSlide() {
  const s = pptx.addSlide();
  s.background = { color: DARK };
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.28, h: H, fill: { color: PINK } });
  s.addShape(pptx.ShapeType.rect, { x: 0.28, y: 0, w: 0.14, h: H, fill: { color: BRAND } });
  s.addText("¡Gracias!", { x: 1.1, y: 2.6, w: 11, h: 1.2, fontSize: 48, bold: true, color: "FFFFFF", fontFace: FONT });
  s.addText("Juan Ignacio Guitart", { x: 1.1, y: 3.9, w: 11, h: 0.6, fontSize: 20, color: "CBD5E1", fontFace: FONT });
  s.addText("juanignacioguitart@gmail.com", { x: 1.1, y: 4.5, w: 11, h: 0.5, fontSize: 16, color: "94A3B8", fontFace: FONT });
}

// ---------- Build ----------
titleSlide();

contentSlide(
  "El problema",
  [
    "Las ofertas de empleo contienen, a menudo sin querer, lenguaje sesgado (género, edad, capacitismo, jerga) que reduce la diversidad de candidaturas y puede ser ilegal.",
    "El proceso de selección está fragmentado: redactar la oferta, filtrar CVs, buscar candidatos, entrevistar y comunicar… en herramientas dispersas.",
    "Faltan herramientas sencillas que unifiquen el proceso con criterios de inclusividad.",
  ],
  2
);

valueSlide(3);
toolsSlide(4);

contentSlide(
  "Analizador de sesgos",
  [
    "Resalta los fragmentos problemáticos por categoría y explica cada hallazgo.",
    "Índice de inclusividad de 0 a 100 y detección de buenas prácticas.",
    "Reescritura: aplica las sugerencias una a una, toda de golpe o con IA.",
    "Exporta un informe profesional en Word o PDF.",
  ],
  5
);

aiFeaturesSlide(6);
aiArchSlide(7);

contentSlide(
  "Del lado del candidato y sourcing",
  [
    "Compatibilidad ATS: encaje oferta ↔ CV, palabras clave que faltan y análisis del candidato con IA.",
    "Ranking de candidatos: ordena varios CV por su encaje con la oferta.",
    "Buscador booleano: cadenas para LinkedIn y Google X-ray.",
  ],
  8
);

contentSlide(
  "Entrevista y comunicación",
  [
    "Banco de preguntas por competencia para entrevistas estructuradas.",
    "Lista de preguntas a evitar (legalmente sensibles: edad, estado civil…).",
    "Plantillas de email: invitación, información, oferta y rechazo.",
  ],
  9
);

stackSlide(10);

contentSlide(
  "Decisiones técnicas",
  [
    "Motor de análisis local y determinista (lexicón curado, sin \"caja negra\").",
    "IA opcional y desacoplada: Groq en la nube o Ollama en local, con degradación elegante.",
    "Degradación elegante también en datos: base de datos opcional (localStorage de reserva).",
    "Auth con JWT sin base de datos; i18n español/inglés; tests del motor con Vitest.",
  ],
  11
);

contentSlide(
  "Enlaces",
  [
    "Repositorio: https://github.com/Jguita65/joblens",
    "App: https://joblens-puce.vercel.app",
    "Cuenta de prueba: test@test.com / test1234",
  ],
  12
);

closingSlide();

await pptx.writeFile({ fileName: "slides.pptx" });
console.log("slides.pptx generado.");
