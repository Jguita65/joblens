# Guion del vídeo — RecruitKit (2–4 minutos)

> **Duración objetivo:** 2:30–3:30 min.
> **Pantalla:** obligatoria (graba la pantalla mostrando la app).
> **Rostro:** opcional (puedes añadir tu cámara en una esquina).
> **Idioma:** español.

---

## 0. Antes de grabar (checklist)

- [ ] Arranca la app (`npm run dev`) o abre la URL de producción.
- [ ] Inicia sesión con la cuenta de prueba para tenerla lista.
- [ ] Si vas a enseñar la IA, comprueba que responde (Ollama local o Groq en la web).
- [ ] Cierra pestañas y notificaciones que distraigan.
- [ ] Resolución 1920×1080, zoom del navegador al 100–110 %.

---

## 1. Presentación (0:00 – 0:25)

> **[EN PANTALLA: login de RecruitKit]**

> "Hola, soy Juan Ignacio Guitart y este es mi proyecto: **RecruitKit**, un kit de
> herramientas para reclutadores. Reúne en un panel varias herramientas para hacer
> una selección más justa y eficaz: desde analizar y redactar ofertas hasta
> evaluar candidatos, preparar entrevistas y comunicarse con ellos."

*(Inicia sesión con `test@test.com` / `test1234`.)*

---

## 2. El panel de inicio (0:25 – 0:45)

> **[EN PANTALLA: el panel /inicio con las tarjetas de herramientas]**

> "Al entrar llego al panel, con todas las herramientas a un clic. Arriba puedo
> cambiar el **idioma** (español/inglés) y el **tema** claro u oscuro. Empecemos
> por la herramienta principal: el analizador de sesgos."

---

## 3. Analizador de sesgos (0:45 – 1:45)

> **[EN PANTALLA: "Cargar ejemplo" → el análisis aparece en vivo]**

> "Pego una oferta y, al instante, RecruitKit **resalta los fragmentos
> problemáticos con un color por categoría**: género, edad, capacitismo, jerga…
> A la derecha tengo el **Índice de inclusividad**, de 0 a 100, y la lista de
> **hallazgos**, cada uno con su explicación y una **sugerencia de reescritura**."

> **[EN PANTALLA: pestaña "Reescritura"; pulsa "Reescribir con IA"]**

> "Puedo aplicar las sugerencias una a una, o usar la **reescritura con IA**, que
> genera una versión inclusiva del texto completo. Y en la pestaña de **buenas
> prácticas** me dice qué falta: rango salarial, flexibilidad, igualdad…"

---

## 4. El resto de herramientas (1:45 – 2:30)

> **[EN PANTALLA: recorre rápido el menú "Herramientas"]**

> "El kit cubre todo el proceso:
> - El **generador de ofertas**, que crea una oferta inclusiva desde un formulario.
> - La **compatibilidad ATS**, que compara una oferta con un CV.
> - El **ranking de candidatos**, que ordena varios CV por su encaje.
> - El **buscador booleano**, para sourcing en LinkedIn.
> - Las **preguntas de entrevista** y las **plantillas de email** al candidato."

*(Muestra 1-2 de ellas brevemente, p. ej. el ranking y el buscador booleano.)*

---

## 5. Detalles técnicos (2:30 – 3:00)

> "Por dentro, el análisis se apoya en un **lexicón curado** en JSON; la IA es
> **opcional** (Ollama en local o un proveedor hospedado). Está hecho con
> **Next.js 15, TypeScript, Tailwind, Auth.js y Prisma**, con **tests en Vitest**,
> y funciona **con o sin base de datos**. Desplegado en **Vercel**."

---

## 6. Cierre (3:00 – 3:20)

> **[EN PANTALLA: vuelve al panel o al repo de GitHub]**

> "Y esto es RecruitKit: un kit de herramientas para una selección más justa y
> eficaz. Tenéis el código y la app en los enlaces de la descripción. ¡Gracias!"

**Enlaces:**
- Repositorio: https://github.com/Jguita65/joblens
- App: https://joblens-puce.vercel.app

---

## Consejos de grabación

- **Habla despacio** y haz una pausa entre secciones.
- **Mueve el ratón despacio** hacia lo que mencionas.
- Si te trabas, para y repite la frase (se recorta en edición).
- Captura con **OBS Studio** (gratis) o la grabación nativa de Windows (`Win + Alt + R`).
- Exporta en 1080p, formato MP4, y revisa que se oye bien.
