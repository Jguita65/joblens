---
marp: true
title: RecruitKit — Herramientas para reclutadores
paginate: true
---

<!--
Fuente editable de la presentación. El entregable es slides.pptx (PowerPoint),
que se genera con: npm run slides:pptx
-->

# RecruitKit

## El kit de herramientas para una selección más justa y eficaz

Analiza y redacta ofertas · Evalúa candidatos · Entrevista y comunica

**Juan Ignacio Guitart** · TFM · 2026

---

## El problema

- Las **ofertas de empleo** contienen, a menudo sin querer, lenguaje sesgado
  (género, edad, capacitismo, jerga) que reduce la diversidad y puede ser ilegal.
- El **proceso de selección** está fragmentado: redactar, filtrar CVs, buscar
  candidatos, entrevistar y comunicar… en herramientas dispersas.
- Faltan herramientas sencillas que unifiquen el proceso con criterios de
  inclusividad.

---

## La solución: RecruitKit

Un panel con varias herramientas que cubren el proceso de selección.

- ⚖️ **Más justo** — detecta y corrige sesgos; fomenta la diversidad.
- ⏱️ **Más eficaz** — redacta, filtra y comunica en menos tiempo.
- 🔒 **Sin ataduras** — funciona con o sin base de datos y con IA opcional.
- 🌍 **Accesible** — español e inglés, claro/oscuro, desplegado gratis.

---

## Las herramientas

- 🎯 Analizador de sesgos · 📝 Generador de ofertas
- 📄 Compatibilidad ATS · 🏆 Ranking de candidatos
- 🔎 Buscador booleano · 💬 Preguntas de entrevista
- ✉️ Plantillas de email · ⚖️ Comparador e historial

---

## Analizador de sesgos

- Resalta los fragmentos problemáticos **por categoría** y explica cada hallazgo.
- **Índice de inclusividad** (0–100) y detección de buenas prácticas.
- **Reescritura**: aplica las sugerencias una a una, toda de golpe o con IA.
- Exporta un informe profesional en **Word o PDF**.

---

## Funciones potenciadas por IA

Integradas con la **API de Groq** (en la nube) o con **Ollama** en local.

- ✨ **Reescritura inclusiva** — convierte una oferta sesgada en una versión neutra.
- 📝 **Redacción de ofertas** — escribe una oferta completa desde unos datos.
- 🧑‍💼 **Análisis de candidato** — fortalezas, carencias y recomendación (CV ↔ oferta).

---

## Arquitectura de IA · Groq + Ollama

```
Usuario → RecruitKit (Next.js / Vercel, /api/ai) → Groq API (nube)  → IA para todos
                                                 → Ollama (local)   → privado, sin coste
```

- La **clave de la API vive solo en el servidor**.
- **Degradación elegante**: sin IA, se usa la reescritura determinista del lexicón.

---

## Del lado del candidato y sourcing

- **Compatibilidad ATS**: encaje oferta ↔ CV, palabras clave que faltan y
  **análisis del candidato con IA**.
- **Ranking de candidatos**: ordena varios CV por su encaje con la oferta.
- **Buscador booleano**: cadenas para LinkedIn y Google X-ray.

---

## Entrevista y comunicación

- **Banco de preguntas por competencia** para entrevistas estructuradas.
- Lista de **preguntas a evitar** (legalmente sensibles: edad, estado civil…).
- **Plantillas de email**: invitación, información, oferta y rechazo.

---

## Stack técnico

- **Frontend:** Next.js 15 · React 19 · TypeScript · Tailwind CSS
- **Auth:** Auth.js (NextAuth v5) · sesión JWT
- **Datos:** Prisma · PostgreSQL (opcional) · localStorage
- **IA:** Groq API · Ollama (local)
- **Calidad:** Vitest · docx · ESLint
- **Deploy:** Vercel

---

## Decisiones técnicas

- **Motor de análisis local y determinista** (lexicón curado, sin "caja negra").
- **IA opcional y desacoplada**: Groq o Ollama, con degradación elegante.
- **Degradación también en datos**: base de datos opcional (`localStorage` de reserva).
- **Auth con JWT** sin base de datos · **i18n ES/EN** · **tests** con Vitest.

---

## Enlaces

- 💻 **Repositorio:** https://github.com/Jguita65/joblens
- 🌐 **App:** https://joblens-puce.vercel.app
- 🔑 **Cuenta de prueba:** `test@test.com` / `test1234`

---

# ¡Gracias!

**Juan Ignacio Guitart**
juanignacioguitart@gmail.com
