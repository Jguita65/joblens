# 🎬 Guion del vídeo — JobLens (2–4 minutos)

> **Duración objetivo:** 2:30–3:30 min.
> **Pantalla:** obligatoria (graba la pantalla mostrando la app).
> **Rostro:** opcional (puedes añadir tu cámara en una esquina, pero no es necesario).
> **Idioma:** español.

---

## 0. Antes de grabar (checklist)

- [ ] Arranca la app: `npm run dev` (o abre la URL de producción).
- [ ] Ten a mano una oferta de ejemplo (puedes usar el botón **"Cargar ejemplo"**).
- [ ] Cierra pestañas y notificaciones que distraigan.
- [ ] Comprueba el micrófono (habla claro y sin prisa).
- [ ] Resolución recomendada: 1920×1080. Zoom del navegador al 100–110 %.

---

## 1. Presentación (0:00 – 0:25)

> **[EN PANTALLA: la pantalla de login de JobLens]**

**Guion:**
> "Hola, soy Juan Ignacio Guitart y este es mi proyecto: **JobLens**, un
> analizador de sesgos en ofertas de empleo. Ayuda a los equipos de selección a
> detectar lenguaje excluyente en las descripciones de puestos y a reescribirlo
> de forma más inclusiva."

---

## 2. El problema y el login (0:25 – 0:50)

> **[EN PANTALLA: señala la caja de credenciales de prueba; inicia sesión]**

**Guion:**
> "Muchas ofertas contienen, sin querer, sesgos de género, edad, capacitismo o
> jerga tipo 'ninja' o 'rockstar' que reducen la diversidad de candidaturas.
> Inicio sesión con la cuenta de prueba —todo funciona incluso sin base de datos,
> gracias a una sesión JWT."

*(Escribe `test@test.com` / `test1234` o usa los valores precargados y pulsa
"Iniciar sesión".)*

---

## 3. Recorrido por las funcionalidades (0:50 – 2:10)

### 3.1 Analizar una oferta

> **[EN PANTALLA: pulsa "Cargar ejemplo" y luego "Analizar"]**

**Guion:**
> "Pego una oferta y pulso Analizar. Al instante, JobLens **resalta cada
> fragmento problemático con un color por categoría**."

### 3.2 El texto resaltado

> **[EN PANTALLA: pasa el ratón por encima de varios términos resaltados]**

**Guion:**
> "Aquí vemos términos como 'se busca hombre' en Género, 'joven' en Edad,
> 'sin discapacidad' en Capacitismo o 'ninja' y 'crack' en jerga excluyente.
> Si paso el ratón, veo la explicación y la sugerencia."

### 3.3 El panel de hallazgos y el índice

> **[EN PANTALLA: señala el medidor de índice y desplázate por el panel de hallazgos]**

**Guion:**
> "A la derecha tengo el **Índice de inclusividad**, de 0 a 100. Esta oferta
> puntúa muy bajo. Y debajo, la **lista de hallazgos**: cada uno con su categoría,
> severidad, por qué es problemático y **cómo reescribirlo** de forma inclusiva."

### 3.4 Guardar e historial

> **[EN PANTALLA: pulsa "Guardar análisis" y luego ve a "Historial"]**

**Guion:**
> "Guardo el análisis y me voy al **Historial**, donde quedan todos mis análisis
> anteriores. Si hay base de datos configurada se guardan en Postgres; si no, en
> el propio navegador. La app nunca se rompe por falta de base de datos."

---

## 4. Detalles técnicos (2:10 – 2:50)

> **[EN PANTALLA: opcional — muestra brevemente `src/lib/lexicon.json` y `analyzer.ts`]**

**Guion:**
> "Por dentro, el análisis se apoya en un **lexicón curado bilingüe** en JSON, con
> unas cincuenta reglas, cada una con su patrón, severidad, explicación y
> sugerencia. Está construido con **Next.js 15, TypeScript, Tailwind, Auth.js y
> Prisma**, con **tests en Vitest** para el motor, y desplegado en **Vercel**."

---

## 5. Cierre y enlaces (2:50 – 3:15)

> **[EN PANTALLA: vuelve al dashboard o muestra el repo de GitHub]**

**Guion:**
> "Y esto es JobLens: una herramienta sencilla para escribir ofertas de empleo
> más justas e inclusivas. Tenéis el código en GitHub y la app desplegada en los
> enlaces de la descripción. ¡Gracias por ver el vídeo!"

**Enlaces para mostrar / mencionar:**
- Repositorio: https://github.com/Jguita65/joblens
- App: https://joblens-puce.vercel.app

---

## Consejos de grabación

- **Habla despacio** y haz una pausa breve entre secciones.
- **Mueve el ratón despacio** hacia lo que mencionas; ayuda a seguir la acción.
- Si te trabas, **para y repite la frase**: luego se recorta en edición.
- Herramientas de captura: **OBS Studio** (gratis), Loom, o la grabación nativa
  (Windows: `Win + Alt + R`; macOS: `Cmd + Shift + 5`).
- Exporta en 1080p, formato MP4.
- Revisa que **se oye bien** antes de dar por buena la toma.
