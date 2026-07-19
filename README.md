# JobLens

Herramienta web para escribir mejores procesos de selección. Tiene dos partes:

- **Analizador de sesgos**: detecta lenguaje sesgado o excluyente en las
  descripciones de puestos (género, edad, capacitismo, jerga, requisitos
  discriminatorios, exigencia irreal) y propone cómo reescribirlo.
- **Compatibilidad ATS**: compara una oferta con un currículum, calcula el
  encaje de palabras clave y avisa de si el CV pasaría un filtro ATS.

El análisis se ejecuta en el propio servidor con un lexicón curado, sin llamar a
servicios externos ni usar claves de API.

## Descripción

Al pegar una oferta, la app resalta los fragmentos problemáticos por categoría,
muestra un panel con cada hallazgo (término, motivo y sugerencia) y calcula un
índice de inclusividad de 0 a 100. Desde ahí puedes aplicar las correcciones,
generar una versión reescrita, revisar buenas prácticas, comparar dos versiones,
guardar el análisis en tu historial o exportar un informe en Word o PDF.

La herramienta ATS añade el punto de vista de la candidatura: pega la oferta y tu
CV para ver qué palabras clave te faltan y si el formato del currículum es
compatible con los sistemas de seguimiento de candidatos.

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
    dashboard/      analizador de sesgos
    ats/            compatibilidad oferta ↔ CV
    compare/        comparador de versiones
    history/        historial + estadísticas
    login/  register/
  components/       UI (analizador, ATS, historial, gráficos, logo…)
  lib/
    lexicon.json    lexicón de sesgos
    analyzer.ts     motor de análisis y reescritura
    ats.ts          motor de matching ATS
    goodPractices.ts detección de buenas prácticas
    report.ts       informes Word / PDF
    auth.ts  users.ts  prisma.ts  history-client.ts
prisma/
  schema.prisma     modelos User y Analysis
```

## Funcionalidades

- Análisis de sesgos en tiempo real con resaltado por categoría e índice de
  inclusividad.
- Reescritura inclusiva: aplica las sugerencias una a una o todas de golpe.
- Detección de buenas prácticas (salario, flexibilidad, igualdad, formación,
  beneficios, lenguaje inclusivo) con medidor de completitud.
- Compatibilidad ATS: encaje de palabras clave oferta ↔ CV y comprobaciones de
  formato del currículum.
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
