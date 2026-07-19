# RecruitKit

Kit de herramientas web para reclutadores, con foco en una selección más justa y
eficaz. Reúne varias herramientas en un panel:

- **Analizador de sesgos**: detecta lenguaje excluyente en las ofertas (género,
  edad, capacitismo, jerga, requisitos discriminatorios, exigencia irreal) y
  propone reescribirlo.
- **Generador de ofertas**: crea una oferta inclusiva y bien estructurada a
  partir de un formulario, analizada al momento.
- **Compatibilidad ATS**: compara una oferta con un CV y calcula el encaje de
  palabras clave y la compatibilidad del currículum.
- **Ranking de candidatos**: ordena varios CV según su encaje con la oferta.
- **Preguntas de entrevista**: banco por competencia y preguntas a evitar.
- **Plantillas de email**: invitación, oferta o rechazo, listas para enviar.
- **Comparador de versiones** e **historial** con estadísticas.

Los análisis se ejecutan en el propio servidor con un lexicón curado, sin llamar
a servicios externos ni usar claves de API.

## Descripción

Tras iniciar sesión llegas a un panel con todas las herramientas. En el
analizador, al pegar una oferta se resaltan los fragmentos problemáticos por
categoría, se lista cada hallazgo (término, motivo y sugerencia) y se calcula un
índice de inclusividad de 0 a 100; desde ahí puedes aplicar correcciones,
generar una versión reescrita, revisar buenas prácticas o exportar un informe en
Word o PDF. El resto de herramientas cubren el resto del proceso: redactar la
oferta, evaluar y ordenar candidaturas, preparar entrevistas y comunicarte con
las personas candidatas.

### Categorías de sesgo

| Categoría | Ejemplos |
|-----------|----------|
| Género | "se busca hombre", "solo hombres", "salesman" |
| Edad | "joven", "recién graduado", "menores de 30 años" |
| Capacitismo | "sin discapacidad", "buena presencia", "able-bodied" |
| Jerga / hype | "ninja", "rockstar", "crack", "workaholic" |
| Requisitos discriminatorios | foto obligatoria, estado civil, nacionalidad |
| Exigencia irreal | "máxima disponibilidad", "resistencia al estrés extrema" |

El lexicón está en [`src/lib/lexicon.json`](src/lib/lexicon.json) y es fácil de
ampliar: cada entrada tiene patrón, categoría, severidad, explicación,
sugerencia y su reemplazo inclusivo.

## Stack

- Next.js 15 (App Router) y React 19
- TypeScript
- Tailwind CSS
- Auth.js (NextAuth v5), sesión JWT
- Prisma + PostgreSQL (opcional)
- docx (exportación a Word)
- Vitest (tests del motor)
- Desplegado en Vercel

## Instalación

Necesitas Node.js 18.18 o superior.

```bash
git clone https://github.com/Jguita65/joblens.git
cd joblens
npm install

# variables de entorno
cp .env.example .env
# edita .env y define AUTH_SECRET (npx auth secret genera una)

npm run dev        # http://localhost:3000
npm test           # tests del motor
npm run build      # build de producción
```

Si no defines `DATABASE_URL`, la app funciona igual y guarda el historial en el
navegador (`localStorage`).

## Estructura

```
src/
  app/
    api/            rutas: auth, register, analyses
    inicio/         panel con todas las herramientas
    dashboard/      analizador de sesgos
    generador/      generador de ofertas
    ats/            compatibilidad oferta ↔ CV
    ranking/        ranking de candidatos
    entrevista/     preguntas de entrevista
    plantillas/     plantillas de email
    compare/        comparador de versiones
    history/        historial + estadísticas
    login/  register/
  components/       UI de cada herramienta, navegación, logo…
  lib/
    tools.ts        registro de herramientas del panel
    lexicon.json    lexicón de sesgos
    analyzer.ts     motor de análisis y reescritura
    ats.ts          motor de matching ATS
    goodPractices.ts detección de buenas prácticas
    offerTemplate.ts  generación de ofertas
    interviewQuestions.ts  banco de preguntas
    emailTemplates.ts  plantillas de email
    report.ts       informes Word / PDF
    auth.ts  users.ts  prisma.ts  history-client.ts
prisma/
  schema.prisma     modelos User y Analysis
```

## Funcionalidades

- Panel de inicio con acceso a todas las herramientas.
- Análisis de sesgos en tiempo real con resaltado por categoría e índice de
  inclusividad, reescritura inclusiva (aplicable una a una o entera) y detección
  de buenas prácticas.
- Generador de ofertas: formulario → oferta inclusiva analizada al momento.
- Compatibilidad ATS: encaje de palabras clave oferta ↔ CV y comprobaciones de
  formato del currículum.
- Ranking de candidatos: ordena varios CV por su encaje con la oferta.
- Preguntas de entrevista por competencia y lista de preguntas a evitar.
- Plantillas de email a candidatos (invitación, información, oferta, rechazo).
- Comparador de dos versiones de una oferta.
- Exportación de informes en Word (.docx) y PDF.
- Historial con estadísticas y evolución, búsqueda y orden.
- Registro e inicio de sesión, modo claro/oscuro.

## Usuario de prueba

```
Email:       test@test.com
Contraseña:  test1234
```

Funciona en cualquier entorno, incluso sin base de datos. La contraseña se guarda
como hash bcrypt, nunca en texto plano; puedes sobrescribirlo con
`AUTH_TEST_PASSWORD_HASH`. El registro de nuevos usuarios solo persiste si hay
`DATABASE_URL`.

## Variables de entorno

Copia [`.env.example`](.env.example) a `.env`:

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `AUTH_SECRET` | Sí (producción) | Firma los JWT de sesión. `npx auth secret`. |
| `AUTH_TEST_PASSWORD_HASH` | No | Hash bcrypt de la contraseña de prueba. |
| `DATABASE_URL` | No | Conexión a Postgres. Sin ella, el historial usa `localStorage`. |

Con base de datos:

```bash
npx prisma db push     # crea las tablas
npx prisma db seed     # crea test@test.com
```

## Despliegue

Producción: **https://joblens-puce.vercel.app**

Para desplegar en Vercel basta con importar el repositorio y definir
`AUTH_SECRET` (y `DATABASE_URL` si quieres persistencia). El build ya ejecuta
`prisma generate`.

## Documentación del proyecto

- Presentación: [`slides.md`](slides.md)
- Guion del vídeo: [`guion-video.md`](guion-video.md)
