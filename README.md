# 🔍 JobLens — Analizador de sesgos en ofertas de empleo

JobLens es una aplicación web que ayuda a reclutadores y equipos de RR. HH. a
**detectar lenguaje sesgado o excluyente** en las descripciones de puestos y a
**reescribirlo de forma inclusiva**. El análisis es **100 % local, determinista
y sin claves de API**: se apoya en un lexicón curado bilingüe (español e inglés),
por lo que la demo nunca falla y el despliegue es gratuito.

---

## a. Descripción general

Pegas el texto de una oferta de empleo, pulsas **Analizar** y JobLens te devuelve:

- El **texto original** con los fragmentos problemáticos **resaltados por categoría**
  (un color por categoría).
- Un **panel de hallazgos**: término detectado, categoría, severidad, por qué es
  problemático y una **sugerencia de reescritura**.
- Un **Índice de inclusividad** de 0 a 100 (100 = sin problemas detectados).

Puedes **guardar** cada análisis y consultar tu **historial**.

### Categorías de sesgo detectadas

| Categoría | Ejemplos |
|-----------|----------|
| **Género** | "se busca hombre", "solo hombres", "salesman", "manpower" |
| **Edad** | "joven", "recién graduado", "nativo digital", "menores de 30 años" |
| **Capacitismo** | "sin discapacidad", "buena presencia", "able-bodied" |
| **Jerga excluyente / hype** | "ninja", "rockstar", "crack", "guerrero", "workaholic" |
| **Requisitos discriminatorios** | foto obligatoria, estado civil, nacionalidad, "sin cargas familiares" |
| **Exigencia irreal** | "máxima disponibilidad", "resistencia al estrés extrema", "work hard, play hard" |

El lexicón vive en [`src/lib/lexicon.json`](src/lib/lexicon.json) (≈50 entradas,
ES/EN) y es **fácilmente extensible**: cada entrada define patrón (regex), categoría,
severidad, explicación y sugerencia.

---

## b. Stack tecnológico

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS 3**
- **Auth.js (NextAuth v5)** — Credentials provider con sesión **JWT** (funciona sin base de datos)
- **Prisma 6** + **PostgreSQL** (opcional)
- **Vitest** (tests del motor de análisis)
- Despliegue en **Vercel**

---

## c. Instalación y ejecución paso a paso

Requisitos: **Node.js 18.18+** (recomendado 20 o 24) y npm.

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jguita65/joblens.git
cd joblens

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de entorno
cp .env.example .env
#   Edita .env y define AUTH_SECRET. Genera una clave con:
#   npx auth secret        (o)   openssl rand -base64 32

# 4. Arrancar en desarrollo
npm run dev
#   Abre http://localhost:3000

# 5. Ejecutar los tests del motor
npm test

# 6. Compilar para producción
npm run build
npm start
```

> **Nota (Windows):** si `node`/`npm` no están en el PATH, usa la ruta completa
> `C:\Program Files\nodejs\npm`.

La aplicación funciona **sin base de datos**: en ese caso el historial se guarda
en `localStorage` del navegador. Si defines `DATABASE_URL`, el historial y el
registro de usuarios se persisten en Postgres (ver secciones **f** y **g**).

---

## d. Estructura del proyecto

```
joblens/
├── prisma/
│   ├── schema.prisma        # Modelos User y Analysis (Postgres, opcional)
│   └── seed.mjs             # Siembra el usuario de prueba si hay DB
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts   # Handlers de Auth.js
│   │   │   ├── register/route.ts             # Alta de usuarios (requiere DB)
│   │   │   └── analyses/route.ts             # Historial (GET/POST/DELETE)
│   │   ├── dashboard/page.tsx                # Analizador (protegido)
│   │   ├── history/page.tsx                  # Historial (protegido)
│   │   ├── login/page.tsx                    # Inicio de sesión
│   │   ├── register/page.tsx                 # Registro
│   │   ├── layout.tsx  ·  page.tsx  ·  globals.css
│   ├── components/
│   │   ├── AnalyzerClient.tsx    # Lógica de la pantalla de análisis
│   │   ├── HighlightedText.tsx   # Resaltado por categoría
│   │   ├── FindingsPanel.tsx     # Panel lateral de hallazgos
│   │   ├── ScoreGauge.tsx        # Medidor del índice de inclusividad
│   │   ├── HistoryClient.tsx     # Lista de historial
│   │   ├── Navbar.tsx  ·  Providers.tsx
│   ├── lib/
│   │   ├── lexicon.json          # 🧠 Lexicón curado bilingüe (extensible)
│   │   ├── analyzer.ts           # Motor determinista (scoring + detección)
│   │   ├── analyzer.test.ts      # Tests de Vitest
│   │   ├── auth.ts  ·  auth.config.ts        # Configuración de Auth.js
│   │   ├── users.ts  ·  prisma.ts            # Usuarios y DB opcional
│   │   ├── history-client.ts     # Persistencia con degradación (DB/localStorage)
│   │   └── types.ts
│   ├── middleware.ts             # Protege /dashboard y /history
│   └── types/                    # Tipos ambientales
├── .env.example
├── next.config.mjs · tailwind.config.ts · vitest.config.ts · tsconfig.json
└── README.md · slides.md · guion-video.md
```

---

## e. Funcionalidades principales

1. **Registro / inicio de sesión** (Auth.js, sesión JWT).
2. **Análisis de ofertas**: resaltado por categoría + panel de hallazgos con
   explicación y sugerencia de reescritura.
3. **Índice de inclusividad** (0–100) con etiqueta cualitativa.
4. **Guardar análisis** y **consultar historial**.
5. **Degradación elegante**: sin `DATABASE_URL`, la app usa `localStorage`; con
   ella, persiste en Postgres.
6. **Motor 100 % local y testeado** (Vitest), sin dependencias externas ni API keys.

---

## f. Usuario y contraseña de prueba

Funciona en **cualquier entorno**, incluso sin base de datos:

```
Email:       test@test.com
Contraseña:  test1234
```

La contraseña se almacena como **hash bcrypt** (nunca en texto plano). Puedes
sobrescribir el hash con la variable `AUTH_TEST_PASSWORD_HASH`.

> El **registro de nuevos usuarios** solo persiste si hay `DATABASE_URL`. Sin base
> de datos, utiliza la cuenta de prueba.

---

## g. Variables de entorno

Copia [`.env.example`](.env.example) a `.env`:

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `AUTH_SECRET` | Sí (en producción) | Clave para firmar los JWT de sesión. Genera con `npx auth secret`. |
| `AUTH_TEST_PASSWORD_HASH` | No | Hash bcrypt de la contraseña del usuario de prueba. Si falta, se usa el hash de `test1234`. |
| `DATABASE_URL` | No | Cadena de conexión a Postgres. Si falta, el historial va a `localStorage` y la app **sigue funcionando**. |

Con base de datos, prepara el esquema y (opcional) siembra el usuario de prueba:

```bash
npx prisma db push     # crea las tablas
npx prisma db seed     # crea test@test.com en la DB (idempotente)
```

---

## h. URL de despliegue

🌐 **Producción:** **https://joblens-puce.vercel.app**

Cuenta de prueba: `test@test.com` / `test1234`.

### Desplegar en Vercel

1. Importa el repo en Vercel (o usa la CLI: `vercel --prod`).
2. Define las variables de entorno en el dashboard de Vercel:
   - `AUTH_SECRET` (obligatoria).
   - `DATABASE_URL` (opcional; si no la pones, el historial usa `localStorage`).
3. El comando de build (`npm run build`) ya ejecuta `prisma generate`.

---

## i. Enlaces a slides y guion del vídeo

- 🖥️ **Slides de presentación:** [`slides.md`](slides.md)
- 🎬 **Guion del vídeo:** [`guion-video.md`](guion-video.md)

---

## Licencia

Proyecto académico (TFM). Uso educativo.
