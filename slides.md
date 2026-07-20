---
marp: true
title: RecruitKit — Herramientas para reclutadores
paginate: true
---

<!--
Estas slides existen en dos formatos:
- slides.md (este archivo, editable en texto / Marp).
- slides.pptx (PowerPoint, para entregar). Se genera con: npm run slides:pptx
Sustituye los bloques «[CAPTURA: ...]» por capturas reales si lo deseas.
-->

# RecruitKit

## Herramientas para una selección más justa y eficaz

**Juan Ignacio Guitart** · TFM · 2026

---

## El problema

- Las **ofertas de empleo** contienen, a menudo sin querer, lenguaje sesgado
  (género, edad, capacitismo, jerga) que reduce la diversidad de candidaturas y
  puede ser ilegal.
- El **proceso de selección** está fragmentado: redactar la oferta, filtrar CVs,
  buscar candidatos, entrevistar y comunicar… en herramientas dispersas.

---

## La solución

**RecruitKit**: un panel con varias herramientas que cubren el proceso de
selección, con foco en la inclusividad.

- Análisis **local y determinista** + **IA opcional**.
- Interfaz en **español e inglés**.
- Desplegable **gratis**, sin infraestructura obligatoria.

---

## Las herramientas

- 🎯 **Analizador de sesgos**
- 📝 **Generador de ofertas**
- 📄 **Compatibilidad ATS** (oferta ↔ CV)
- 🏆 **Ranking de candidatos**
- 🔎 **Buscador booleano** (sourcing)
- 💬 **Preguntas de entrevista**
- ✉️ **Plantillas de email**
- ⚖️ **Comparador** y 🗂️ **Historial**

---

## Analizador de sesgos

- Resalta los fragmentos problemáticos **por categoría** y explica cada hallazgo.
- **Índice de inclusividad** de 0 a 100.
- Detección de **buenas prácticas** (salario, flexibilidad, igualdad…).
- **Reescritura**: aplica las sugerencias una a una o toda de golpe.

[CAPTURA: analizador con texto resaltado, índice y hallazgos]

---

## Reescritura con IA (opcional)

- Motor local determinista **+ IA opcional** para una reescritura más natural.
- Dos modos:
  - **Ollama local** (privado, en tu equipo).
  - **Proveedor hospedado** compatible con OpenAI (Groq) → IA para todos en la web.
- **Degradación elegante**: sin IA, se usa la reescritura determinista.

---

## Del lado del candidato y sourcing

- **Compatibilidad ATS**: encaje oferta ↔ CV y palabras clave que faltan.
- **Ranking de candidatos**: ordena varios CV por su encaje con la oferta.
- **Buscador booleano**: cadenas para **LinkedIn** y **Google X-ray**.

---

## Entrevista y comunicación

- **Banco de preguntas por competencia** para entrevistas estructuradas.
- Lista de **preguntas a evitar** (legalmente sensibles: edad, estado civil…).
- **Plantillas de email**: invitación, información, oferta y rechazo.

---

## Stack técnico

- **Next.js 15** · **React 19** · **TypeScript**
- **Tailwind CSS** · **Auth.js (NextAuth v5)** — sesión JWT
- **Prisma + PostgreSQL** (opcional)
- **Vitest** (tests del motor) · **docx** (informes Word)
- **Ollama / Groq** (IA opcional) · Despliegue en **Vercel**

---

## Decisiones técnicas

- **Motor de análisis local y determinista** (lexicón curado, sin "caja negra").
- **Degradación elegante**: BBDD opcional (con `localStorage` de reserva) e IA
  opcional (deja de funcionar sin romper la app).
- **Auth con JWT** sin base de datos y usuario semilla.
- **i18n ES/EN** y modo claro/oscuro.
- **Tests del motor** para ampliar el lexicón sin regresiones.

---

## Enlaces

- 💻 **Repositorio:** https://github.com/Jguita65/joblens
- 🌐 **App:** https://joblens-puce.vercel.app
- 🔑 **Cuenta de prueba:** `test@test.com` / `test1234`

---

# ¡Gracias!

**Juan Ignacio Guitart**
juanignacioguitart@gmail.com
