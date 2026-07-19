---
marp: true
title: RecruitKit — Herramientas para reclutadores
paginate: true
---

<!--
CÓMO USAR ESTAS SLIDES
- Puedes presentarlas con Marp (https://marp.app) — extensión de VS Code
  "Marp for VS Code" → exportar a PDF/HTML/PPTX.
- O copiarlas a cualquier editor de diapositivas.
- CÓMO INSERTAR CAPTURAS REALES: donde veas «[CAPTURA: ...]», haz una captura
  de pantalla de la app (login, análisis, historial) y sustituye el texto por:
      ![ancho:900px](ruta/a/tu-captura.png)
  Guarda las imágenes en una carpeta ./slides-img/ dentro del repo.
-->

# 🔍 RecruitKit

## Herramientas para una selección más justa y eficaz

**Juan Ignacio Guitart** · TFM

---

## El problema

Las ofertas de empleo contienen, a menudo sin intención, **lenguaje sesgado o
excluyente**:

- 👤 **Género**: "se busca hombre", "salesman"
- 📅 **Edad**: "joven", "recién graduado", "nativo digital"
- ♿ **Capacitismo**: "sin discapacidad", "buena presencia"
- 🎸 **Jerga/hype**: "ninja", "rockstar", "crack"
- 🚫 **Requisitos discriminatorios**: foto obligatoria, estado civil
- 🔥 **Exigencia irreal**: "máxima disponibilidad", "resistencia al estrés extrema"

> Este lenguaje **reduce la diversidad** de candidaturas y puede ser **ilegal**.

---

## La solución

**RecruitKit** detecta y explica el lenguaje sesgado, y propone **reescrituras
inclusivas** — en tiempo real, sin coste y sin enviar datos a terceros.

- ✅ Resaltado por categoría (un color por tipo de sesgo)
- ✅ Explicación + sugerencia por cada hallazgo
- ✅ **Índice de inclusividad** (0–100)
- ✅ Historial de análisis

---

## Cómo funciona

1. El usuario **inicia sesión**.
2. **Pega** la oferta y pulsa **Analizar**.
3. El motor compara el texto con un **lexicón curado bilingüe** (ES/EN, ~50
   patrones con severidad, explicación y sugerencia).
4. Se calcula el **índice**: `100 − Σ penalización(severidad)`, acotado a [0, 100].
5. El usuario **guarda** el análisis (Postgres o `localStorage`).

> El análisis se apoya en un lexicón de reglas, sin servicios externos.

---

## Demo

[CAPTURA: pantalla de análisis con el texto resaltado, el medidor de índice
(0/100) y el panel de hallazgos por categoría]

[CAPTURA: pantalla de historial con un análisis guardado]

*(Sustituye estos bloques por tus capturas reales — ver nota al inicio.)*

---

## Stack técnico

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS**
- **Auth.js (NextAuth v5)** — Credentials + sesión **JWT**
- **Prisma 6 + PostgreSQL** (opcional)
- **Vitest** para el motor
- Despliegue en **Vercel**

---

## Decisiones técnicas

- **Motor basado en un lexicón**: reglas transparentes y reproducibles, sin
  servicios externos.
- **Lexicón en JSON versionado**: separar *datos* de *lógica* lo hace extensible
  sin tocar código.
- **Degradación elegante**: sin `DATABASE_URL` la app usa `localStorage`; el
  deploy nunca se rompe por falta de base de datos.
- **Auth con JWT**: login funcional sin base de datos, con un usuario semilla.
- **Regex con lookarounds Unicode**: detección precisa en ES/EN sin falsos
  positivos dentro de palabras.

---

## Aprendizajes

- Diseñar para la **degradación** (DB opcional) obliga a separar responsabilidades.
- Un **lexicón curado** bien estructurado aporta transparencia y control, y es
  fácil de auditar y ampliar.
- El patrón *split config* de **Auth.js v5** permite middleware en el *edge* sin
  arrastrar dependencias de Node.
- Los **tests del motor** dan confianza para extender el lexicón sin regresiones.

---

## Enlaces

- 💻 **Repositorio:** https://github.com/Jguita65/joblens
- 🌐 **App en producción:** https://joblens-puce.vercel.app
- 🎬 **Guion del vídeo:** `guion-video.md`
- 🔑 **Cuenta de prueba:** `test@test.com` / `test1234`

---

# ¡Gracias! 🙌

**Juan Ignacio Guitart**
juanignacioguitart@gmail.com
