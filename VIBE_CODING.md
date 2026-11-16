# Bitácora de Vibe Coding: AutoMarket

**Herramienta de IA:** Claude (Anthropic), usado como copiloto de desarrollo en un chat.
**Rol:** yo dirijo, valido e itero; la IA genera código por etapas.
**Repositorio:** https://github.com/Baljeet2000-ai/automarket
**Producción:** https://automarket-orcin.vercel.app

## Resumen del proceso

**Metodología:** le pedí a la IA que, a partir de las capturas con las instrucciones de la actividad,
generara un prompt estructurado que cubriera todos los requisitos, la rúbrica y los entregables.
Usé ese prompt como mensaje inicial. Con él, la IA propuso arquitectura, modelo de datos y plan de
commits, que yo revisé y ajusté antes de que se escribiera código. Luego trabajamos en 15 etapas
pequeñas: en cada una la IA entregaba el código, yo lo probaba y, cuando algo fallaba, reportaba el
error con capturas para que la IA lo corrigiera.

**Sobre los prompts de cada etapa:** el alcance de cada etapa quedó definido en el plan que aprobé en
la etapa 1 y en la sección 5 del prompt inicial. Por eso, cuando todo salía bien, mi indicación era
avanzar ("Siguiente"). Los mensajes más detallados aparecen donde hubo errores, dudas o decisiones.

| Etapa | Qué se construyó |
|---|---|
| 1 | Planificación y arquitectura |
| 2 | Setup del proyecto |
| 3 | Layout con navbar responsive y footer |
| 4 | Dataset JSON y funciones de lectura |
| 5 | Route Handlers de vehículos |
| 6 | Página de inicio y tarjetas |
| 7 | Catálogo con skeleton de carga |
| 8 | Filtros en la URL |
| 9 | Detalle con ruta dinámica |
| 10 | Favoritos con localStorage |
| 11 | Formulario y API de solicitud |
| 12 | Páginas de error |
| 13 | Pulido responsive y accesibilidad |
| 14 | Despliegue en Vercel |
| 15 | Documentación y revisión final |

**Decisiones que tomé yo:** el tema de la aplicación (compra de vehículos); descartar Supabase y usar
solo Route Handlers con datos en un archivo JSON; aprobar o ajustar cada etapa antes de seguir. La IA
propuso el nombre, la paleta, la arquitectura y el plan de etapas, y yo los aprobé.

---

## Etapa 1: Planificación y arquitectura

**Prompt principal:** "Me ayudarás a crear un proyecto para un curso de Kodigo. Te adjunto las imágenes
con las instrucciones. A partir de las imágenes, genérame un prompt que cubra todo lo que hay que hacer
para que luego pueda pasártelo. Quiero hacer una aplicación de compra de vehículos."
El prompt resultante (5 secciones: contexto, requisitos técnicos, entregables, rúbrica y forma de trabajo)
está completo en el apéndice. Pedía una propuesta de estructura, modelo de datos y plan de commits
antes de escribir código.

**Iteraciones:**
1. Pregunté si debía pasarle el prompt por partes. La IA recomendó pasarlo completo, porque el propio
   prompt la obliga a trabajar por etapas y a esperar mi aprobación.
2. La IA propuso una arquitectura con Supabase + Route Handlers.
3. Mi mensaje: "No usemos Supabase, usemos solo Route Handlers con datos en un archivo JSON".
4. La IA ajustó la propuesta y me advirtió de una limitación de Vercel: el sistema de archivos es de
   solo lectura en producción.
5. Respondí "Aprobado".

**Decisiones técnicas:**
- Datos en `data/vehicles.json`, leídos con funciones en `lib/vehicles.ts`.
- Server Components para inicio, catálogo y detalle (menos JavaScript en el cliente).
- Favoritos en `localStorage` porque Vercel no permite escribir archivos en producción.
- Solicitudes: validación en servidor con Route Handler y confirmación con referencia, sin persistencia.
- Filtros del catálogo mediante `searchParams` en la URL (compartibles).

**Desafíos y cómo se resolvieron:**
- Persistencia sin base de datos en Vercel: se resolvió usando `localStorage` y documentando el límite.

---

## Etapa 2: Setup del proyecto

**Prompt:** "Aprobado" (aprobación de la propuesta de la etapa 1). Después reporté los errores de los
comandos con capturas, y confirmé: "npm run dev funciona bien y el push de GitHub salió bien".

**Resultado:** proyecto creado con `create-next-app` (App Router, TypeScript, Tailwind, ESLint, sin
carpeta `src`), estructura de carpetas base, `.env.example`, README y esta bitácora.

**Decisiones técnicas:**
- Sin carpeta `src/` para mantener `app/` en la raíz, simple y alineado con la documentación de Next.js.
- `.env.example` con una sola variable opcional, ya que no hay claves secretas.

**Desafíos y cómo se resolvieron:**
- Los comandos que me dio la IA estaban escritos para Bash (`mkdir -p`), pero trabajo en PowerShell en
  Windows y fallaron con el error "PositionalParameterNotFound". Se lo reporté con la captura y la IA me
  dio el equivalente con `New-Item -ItemType Directory -Force`. Desde entonces me dio todos los comandos
  en PowerShell. Aprendizaje: indicar mi sistema operativo y terminal desde el inicio.
- Intenté copiar `.env.example` antes de crearlo: la IA me dio su contenido en el chat, pero el archivo
  no existe hasta crearlo manualmente. Lo resolví creándolo con `Set-Content` en PowerShell.

---

## Etapa 3: Layout con navbar responsive y footer

**Prompt:** "Siguiente" (avance a la etapa 3 según el plan aprobado). Después reporté un error con captura:
"la página funciona solo que tira este error".

**Resultado:** `layout.tsx` con fuente Inter, metadata con plantilla de título, `Navbar` con menú
hamburguesa en móvil y enlace activo, `Footer`, y página de inicio temporal.

**Decisiones técnicas:**
- Solo `Navbar` es Client Component (`useState` y `usePathname`); `Footer` y `layout` son Server Components.
- Se reemplazó `globals.css` para quitar el modo oscuro automático del template, que chocaba con el diseño.
- Diseño mobile-first con Tailwind (`md:` para escritorio) y atributos ARIA en el menú móvil.

**Desafíos y cómo se resolvieron:**
- Next.js 16.4.6 mostró el error "Next.js encountered the unstable value `new Date()` while prerendering"
  en el Footer. Mi proyecto tiene Cache Components activado, que exige decidir cuándo se calculan
  los valores que cambian entre renders. Le pasé la captura a la IA, que propuso aislar el año en
  un componente con la directiva `"use cache"`. Alternativas descartadas: `connection()`
  (renderizaría todo bajo demanda sin necesidad) y mover el footer a un Client Component.

---

## Etapa 4: Dataset JSON y funciones de lectura

**Prompt:** "Siguiente". Después pregunté: "Para la parte de las imágenes, ¿debo buscarlas yo y ponerles
el nombre a cada una para que sea el mismo del JSON?" y "¿Y si la única opción de guardado es JPEG?".

**Resultado:** `types/vehicle.ts`, `data/vehicles.json` (12 vehículos), `lib/vehicles.ts`
(`getVehicles` con filtros, `getVehicleById`, `getFeaturedVehicles`, `getFilterOptions`) y `lib/format.ts`.

**Decisiones técnicas:**
- El JSON se importa como módulo (no con `fs`) para que funcione en Vercel y con Cache Components.
- La lógica de filtrado vive en funciones puras reutilizadas por Server Components y Route Handlers.
- IDs tipo slug para URLs legibles.

**Desafíos y cómo se resolvieron:**
- Las imágenes debía conseguirlas yo y nombrarlas igual que en el JSON. La IA me indicó usar bancos de
  imágenes libres y, como solo podía guardarlas como `.jpeg`, me dio dos opciones: renombrar los archivos
  a `.jpg` con PowerShell o cambiar las rutas del JSON a `.jpeg`.

---

## Etapa 5: Route Handlers de vehículos con filtros

**Prompt:** "Siguiente" (avance a la etapa 5 según el plan aprobado).

**Resultado:** `GET /api/vehiculos` (filtros por q, brand, bodyType, rango de precio y año, orden e ids)
y `GET /api/vehiculos/[id]` con 404 JSON si no existe. Función `parseFilters` en `lib/filters.ts`.

**Decisiones técnicas:**
- `parseFilters` se comparte entre la API y el catálogo para no duplicar lógica.
- Los parámetros numéricos inválidos se ignoran para que la API sea tolerante.
- `params` se resuelve con `await` porque en Next.js 16 es una Promise.
- Respuestas con forma consistente (`{ data, total }` / `{ error }`) y códigos HTTP correctos.

**Desafíos y cómo se resolvieron:** sin incidentes.

---

## Etapa 6: Página de inicio con vehículos destacados

**Prompt:** "Siguiente" (avance a la etapa 6 según el plan aprobado). Después reporté con capturas:
"Cuando presiono vehículos y regreso a Inicio, la imagen se ve así, con el fondo negro" y, tras el primer
arreglo, "Sigue viéndose negro al regresar a Inicio desde otro botón".

**Resultado:** componentes UI (`ButtonLink`, `Badge`), `VehicleImage` (con imagen de respaldo),
`VehicleCard`, `VehicleGrid` y la página de inicio con hero, categorías y destacados.

**Decisiones técnicas:**
- Solo `VehicleImage` es Client Component (`useState` para detectar imágenes rotas); el resto es Server.
- `next/image` con `fill` y `sizes` para imágenes optimizadas y responsive.
- La tarjeta tiene una prop `action` reservada para el botón de favoritos (etapa 10).
- La página se prerenderiza porque los datos salen de un JSON importado.

**Desafíos y cómo se resolvieron:**
- Al navegar a una ruta aún inexistente y volver al Inicio, el fondo quedaba negro y los títulos
  invisibles. Mi primer intento (con la IA) fue declarar `color-scheme: light` y fijar los colores
  en el `<body>`, pero no lo resolvió. Al seguir reportándolo con capturas, la IA identificó la causa
  real: la página 404 por defecto de Next.js inyecta estilos propios (fondo negro en modo oscuro del
  sistema) que persisten tras la navegación del lado del cliente y pesan más que las clases de Tailwind.
  Se resolvió creando un `app/not-found.tsx` personalizado.
  Aprendizaje: validar el diagnóstico de la IA probándolo, e insistir con evidencia cuando el primer
  arreglo no funciona.
- VS Code mostró errores "Cannot find module" y advertencias "Unknown at rule @theme/@apply".
  Con la IA entendí que eran falsos positivos del editor: el servidor de TypeScript estaba desactualizado
  (se reinició) y el validador CSS integrado no reconoce Tailwind v4. La verificación real se hizo
  con `npx tsc --noEmit`.

---

## Etapa 7: Catálogo con skeleton de carga

**Prompt:** "Siguiente" (avance a la etapa 7 según el plan aprobado). Antes de continuar le consulté:
"En esta etapa no había hecho ningún commit ni añadí nada al VIBE_CODING.md, ¿qué debo hacer?".

**Resultado:** página `/vehiculos` con resultados filtrables por URL, contador de resultados,
estado vacío con botón para limpiar filtros, `Skeleton`, `VehicleGridSkeleton` y `loading.tsx`.

**Decisiones técnicas:**
- Con Cache Components, `searchParams` se lee dentro de un componente asíncrono (`VehicleResults`)
  envuelto en `<Suspense>`; la página en sí es un cascarón estático.
- Filtros por parámetros de URL (compartibles y compatibles con el historial del navegador),
  reutilizando `parseFilters` y `getVehicles`.
- El skeleton replica la forma de la tarjeta para evitar saltos de diseño.

**Desafíos y cómo se resolvieron:**
- Durante las etapas 3 a 6 no hice commits ni actualicé esta bitácora. La IA me propuso separar los
  cambios acumulados en commits por etapa, agrupando los archivos de cada una, y completar la bitácora
  con el detalle real, incluidos los errores. Por eso el historial de esas etapas se creó de una sola vez.
  Aprendizaje: hacer commit y actualizar la bitácora al cerrar cada etapa.

---

## Etapa 8: Filtros por marca, tipo, precio y año

**Prompt:** "Siguiente" (avance a la etapa 8 según el plan aprobado).

**Resultado:** `FilterBar` (Client Component) con búsqueda por texto con debounce, selectores de
marca, tipo, precio máximo, año mínimo y orden, botón para limpiar y estado "Actualizando…".
Componente reutilizable `Select`.

**Decisiones técnicas:**
- Los filtros viven en la URL (`useSearchParams` + `router.replace`): compartibles, compatibles con
  atrás/adelante y sin duplicar estado; la página Server se actualiza con los nuevos `searchParams`.
- `useState` + `useEffect` solo para el texto de búsqueda (debounce de 400 ms).
- `useTransition` para mostrar el estado pendiente sin bloquear la interfaz.
- Las opciones de los filtros se calculan en el servidor y se pasan como props.
- `FilterBar` va dentro de `<Suspense>` porque `useSearchParams` es dato de la petición.

**Desafíos y cómo se resolvieron:** sin incidentes.

---

## Etapa 9: Página de detalle con ruta dinámica

**Prompt:** "Siguiente" (avance a la etapa 9 según el plan aprobado).

**Resultado:** `/vehiculos/[id]` con migas de pan, imagen, precio, ficha técnica (`VehicleSpecs`),
botón de solicitud, vehículos relacionados, `generateMetadata`, `loading.tsx` y `not-found.tsx` propio.

**Decisiones técnicas:**
- `generateStaticParams` para prerenderizar una página por vehículo; compatible con Cache Components.
- `notFound()` con un `not-found.tsx` específico para IDs inexistentes (404 real).
- Metadata dinámica por vehículo.
- Todo Server Component; el botón de favoritos (etapa 10) será el único componente cliente.
- Los vehículos relacionados reutilizan `VehicleGrid` y `getVehicles`.

**Desafíos y cómo se resolvieron:** sin incidentes.

---

## Etapa 10: Favoritos con localStorage y página /favoritos

**Prompt:** "Siguiente" (avance a la etapa 10 según el plan aprobado).

**Resultado:** hook `useFavorites`, `FavoriteButton` (variantes icono y completo), contador en el
navbar, página `/favoritos` con `FavoritesList` (consume `GET /api/vehiculos?ids=` con `fetch`),
estados de carga, error con reintento y lista vacía, y componente `Alert`.

**Decisiones técnicas:**
- Favoritos en `localStorage` (Vercel no permite escribir archivos y no hay base de datos).
- `useSyncExternalStore` para leer el almacenamiento: sin errores de hidratación y con todos los
  botones, el contador y las pestañas sincronizados.
- `useState` + `useEffect` con `AbortController` para consumir la API desde `FavoritesList`.
- El estado "cargando" se deriva comparando la clave de la petición, evitando `setState` síncrono en el efecto.
- El botón de favoritos se inyecta mediante la prop `action` de la tarjeta, fuera del `Link`.

**Desafíos y cómo se resolvieron:** sin incidentes.

---

## Etapa 11: Formulario y Route Handler de solicitud de compra

**Prompt:** "Siguiente" (avance a la etapa 11 según el plan aprobado). Después reporté con captura:
"Con el servidor andando y con los campos llenos y correctos me da este error al presionar Enviar
solicitud", y luego los registros de la terminal y el listado de archivos que pidió la IA.

**Resultado:** `POST /api/solicitudes` con validación (201, 400, 422), formulario `/solicitud`
con selección de vehículo (preseleccionado desde `?vehiculo=`), validación en cliente y servidor,
errores por campo, estado de envío, alerta de error de red y confirmación con número de referencia.

**Decisiones técnicas:**
- Validación única en `lib/validators.ts`, usada en cliente y servidor; recibe una función para
  verificar el vehículo y así no incluir el JSON de datos en el bundle del cliente.
- Códigos HTTP diferenciados y manejados por el formulario (201 / 422 / error de red).
- Formulario controlado con `useState`; foco automático al primer campo con error.
- Las solicitudes no se persisten (Vercel no permite escribir archivos); la confirmación lo aclara.
- Se descartó el historial de "Mis solicitudes" de la propuesta inicial para mantener el alcance acotado.

**Desafíos y cómo se resolvieron:**
- El formulario mostraba "No pudimos enviar tu solicitud" con los datos correctos. Revisando la
  terminal de `npm run dev` vi `POST /api/solicitudes 404`, lo que indicó que Next.js no encontraba
  la ruta (un fallo de código habría dado 500). Al listar los archivos con `Get-ChildItem` descubrí
  que el Route Handler había quedado dentro de `app/api/vehiculos/solicitudes/` en lugar de
  `app/api/solicitudes/`. En App Router la URL de una API depende de la estructura de carpetas, así
  que lo moví a la ubicación correcta. Aprendizaje: leer el código de estado en la terminal y
  verificar la estructura de carpetas antes de sospechar del código.

---

## Etapa 12: error.tsx global y por ruta

**Prompt:** "Siguiente" (avance a la etapa 12 según el plan aprobado).

**Resultado:** `ErrorState` reutilizable, `app/error.tsx`, `app/vehiculos/error.tsx` (cubre catálogo
y detalle) y `app/global-error.tsx` para fallos del layout raíz.

**Decisiones técnicas:**
- Jerarquía de límites de error: mensaje específico en `/vehiculos`, general en `app/`, crítico en `global-error`.
- Reintento con `router.refresh()` + `reset()` dentro de `startTransition`, para volver a pedir los datos al servidor.
- `useEffect` para registrar el error en consola; se muestra el `digest` sin exponer detalles internos.
- `global-error.tsx` incluye `html`, `body` y los estilos, porque sustituye al layout.

**Desafíos y cómo se resolvieron:** sin incidentes.

---

## Etapa 13: Pulido responsive y accesibilidad

**Prompt:** "Siguiente" (avance a la etapa 13 según el plan aprobado).

**Resultado:** foco visible global, enlace "Saltar al contenido", `aria-current` en el menú, mejoras
de contraste (hero y código de error), filtros en dos columnas en móvil, botón de favoritos más
grande y soporte para `prefers-reduced-motion`. Verificación con teclado, tres anchos de pantalla
y zoom al 200 %.

**Decisiones técnicas:**
- Estilo de foco en `@layer base` para no entrar en conflicto con las utilidades de Tailwind.
- Contraste revisado contra el mínimo de 4.5:1 (WCAG AA).
- Pruebas manuales en 360, 768 y 1280 px.

**Desafíos y cómo se resolvieron:** sin incidentes.

---

## Etapa 14: Despliegue en Vercel

**Prompt:** "Siguiente". Después le pregunté: "Nunca he usado Vercel, ¿qué debo hacer?", "¿La URL
pública es la de Vercel?" y compartí una captura del formulario de variables de entorno con la
pregunta "¿Así?".

**Resultado:** aplicación desplegada en Vercel y conectada al repositorio de GitHub, con despliegue
automático en cada push a `main`. URL pública: https://automarket-orcin.vercel.app
Probé la URL en una ventana de incógnito y todo funciona.

**Decisiones técnicas:**
- `metadataBase` configurado con `NEXT_PUBLIC_SITE_URL` para que la variable documentada tenga uso real.
- `npm run lint` y `npm run build` ejecutados en local antes de desplegar.
- La variable de entorno se creó como tipo "Config" y no "Secret": es una URL pública y las variables
  `NEXT_PUBLIC_` llegan al navegador de todos modos.
- La variable se configuró después del primer despliegue, cuando ya se conocía la URL.

**Desafíos y cómo se resolvieron:**
- Al revisar el repositorio antes de desplegar, `git ls-files | Select-String "env"` no devolvió nada:
  el `.env.example` (entregable de la actividad) nunca se había subido, porque el `.gitignore`
  generado por `create-next-app` ignora `.env*`. Se resolvió agregando la excepción `!.env.example`.
  Aprendizaje: verificar con `git ls-files` lo que realmente está en el repositorio, no solo lo que
  existe en la carpeta.
- Era mi primera vez usando Vercel. La IA me guió paso a paso; en la interfaz actual las variables de
  entorno están dentro de "Environments", no en un apartado propio, y lo resolví enviando capturas.

---

## Etapa 15: Documentación y revisión final

**Prompt:** "Siguiente". Después le pedí revisar esta bitácora una vez terminada.

**Resultado:** README completo (rutas, API, instalación, variables de entorno, decisiones y límites),
bitácora completa y revisión del proyecto contra los criterios de la rúbrica.

**Decisiones técnicas:**
- El README documenta de forma explícita que las solicitudes no se almacenan, para no prometer más
  de lo que la aplicación hace.
- Verificación de instalación clonando el repositorio en una carpeta limpia y ejecutando `npm run build`.

**Desafíos y cómo se resolvieron:**
- Hice el commit de la documentación estando dentro de la carpeta del clon de prueba en lugar de la del
  proyecto original, y Git respondió "nothing to commit, working tree clean". La IA me indicó que la ruta
  de la terminal correspondía al clon y me hizo volver a la carpeta original. Aprendizaje: revisar la
  ruta de la terminal antes de ejecutar comandos de Git.

---

## Apéndice: prompt inicial

Este es el prompt estructurado que la IA generó a partir de las capturas de la actividad y que pasé
completo al inicio de la conversación. Menciona Supabase porque era la propuesta original; más tarde
decidí descartarlo y usar solo Route Handlers con datos en un archivo JSON (ver etapa 1).

<details>
<summary>Ver el prompt completo</summary>

```
Actúa como mi copiloto de desarrollo (Vibe Coding) para una actividad evaluada de un curso de Kodigo. Vas a ayudarme a construir desde cero una aplicación web de COMPRA DE VEHÍCULOS con Next.js. Yo dirijo, valido e itero; tú generas el código por etapas.

## 1. Contexto de la actividad
- Objetivo: construir una app funcional con Next.js usando el flujo de Vibe Coding (IA como copiloto), demostrando que dirijo, valido e itero sobre el código generado.
- Temática (definida por mí): marketplace de compra de vehículos. Los usuarios pueden explorar un catálogo, filtrar, ver detalles, guardar favoritos y enviar una solicitud de compra o contacto.
- Se evalúa un resultado de calidad profesional, con control sobre la arquitectura.

## 2. Requisitos técnicos obligatorios
1. Next.js 16 o superior con App Router.
2. TypeScript en todo el proyecto.
3. Tailwind CSS para los estilos.
4. Mínimo 4 páginas/rutas distintas con App Router. Propuesta:
   - `/` Inicio (hero + vehículos destacados)
   - `/vehiculos` Catálogo con búsqueda y filtros (marca, tipo, rango de precio, año)
   - `/vehiculos/[id]` Detalle del vehículo (ruta dinámica)
   - `/favoritos` Vehículos guardados
   - `/comprar` o `/solicitud` Formulario de solicitud de compra
5. Consumo de al menos una API (interna o externa) mediante:
   - Route Handlers (`app/api/...`) y/o
   - Supabase como servicio serverless (tablas: `vehicles`, `favorites`, `purchase_requests`).
   Si es posible, usa ambos: Supabase como base de datos y Route Handlers para la lógica de solicitudes.
6. Uso combinado y correcto de Server Components y Client Components:
   - Server Components por defecto (listados, detalle, fetch de datos).
   - Client Components solo donde haya interactividad (filtros, favoritos, formulario) con `"use client"`.
7. Manejo de estado con hooks de React: `useState` y `useEffect` (ej.: filtros, favoritos, envío del formulario).
8. Diseño responsive para móvil y escritorio, coherente e intuitivo, con componentes UI reutilizables.
9. Estados de carga y error:
   - `loading.tsx` (y/o skeletons) en las rutas con datos.
   - `error.tsx` y `not-found.tsx` donde corresponda.
   - Mensajes de error claros en formularios y llamadas a la API.
10. Variables de entorno en `.env.local` (nunca subir claves al repo). Incluir `.env.example` con todas las variables documentadas (por ejemplo `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
11. Despliegue público en Vercel.
12. Repositorio público en GitHub con historial de commits descriptivos que evidencie el proceso iterativo.

## 3. Entregables
- Repositorio público en GitHub con: código completo, commits descriptivos (por ejemplo `feat: agrega catálogo con filtros`), `.env.example` y `README.md` (instalación, uso, variables de entorno y enlace al despliegue).
- Documento `VIBE_CODING.md` en la raíz que registre:
  - Los prompts principales utilizados.
  - Las iteraciones realizadas con la IA.
  - Las decisiones técnicas tomadas y su justificación.
  - Los desafíos encontrados y cómo se resolvieron con apoyo de IA.
- URL pública de la app en producción (Vercel).

## 4. Rúbrica (apunta al puntaje máximo en cada criterio)
- Estructura y arquitectura Next.js (2 pts): App Router bien configurado, Server/Client Components bien diferenciados, rutas organizadas, código limpio con convenciones de Next.js.
- Flujo de Vibe Coding documentado (2 pts): bitácora completa con prompts estructurados, iteraciones documentadas, decisiones técnicas justificadas y evidencia clara del desarrollo asistido por IA.
- Funcionalidad e integración de datos (2.5 pts): todas las rutas funcionales, API integrada correctamente, manejo de estado apropiado, loading y error states implementados.
- Diseño y experiencia de usuario (1.5 pts): responsive, coherente, intuitivo, buenos componentes UI, experiencia fluida en móvil y escritorio.
- Despliegue y repositorio (2 pts): app desplegada y accesible, repo organizado, commits descriptivos, README completo y `.env.example` bien documentado.

## 5. Cómo quiero que trabajemos
1. Antes de programar, propón: estructura de carpetas, modelo de datos (esquema SQL de Supabase con datos de ejemplo de ~12 vehículos), lista de componentes y plan de commits. Espera mi aprobación.
2. Trabaja por etapas pequeñas (setup, layout y navegación, catálogo, detalle, favoritos, formulario, loading/error, pulido responsive, documentación). Al final de cada etapa dame:
   - El código completo de los archivos creados o modificados.
   - El mensaje de commit sugerido.
   - Una entrada lista para pegar en `VIBE_CODING.md` (prompt usado, resultado, decisión técnica y problema resuelto, si lo hubo).
3. Explica brevemente por qué tomas cada decisión de arquitectura (por ejemplo, por qué algo es Server o Client Component), para que yo pueda justificarla.
4. Yo haré los pasos que requieren mis cuentas (crear el proyecto en Supabase, repo en GitHub, deploy en Vercel). Guíame con instrucciones paso a paso cuando llegue ese momento.
5. Al final, revisa el proyecto contra la rúbrica y dime qué falta para cumplir cada criterio.

Idioma de la interfaz: español. Comentarios en el código y documentación: español.

Empieza con el punto 1 de la sección 5 (propuesta de estructura, modelo de datos y plan de commits).
```

</details>

---

## Reflexión final

- **Qué funcionó bien:** trabajar por etapas pequeñas; pedir la arquitectura antes del código; probar cada
  etapa antes de seguir; reportar los errores con capturas y datos concretos (la terminal, el listado de
  archivos), que fue lo que permitió encontrar las causas reales.
- **Dónde tuve que corregir a la IA:** comandos de Bash en un entorno PowerShell; el primer diagnóstico
  del fondo negro era incompleto; un archivo quedó en la ruta equivocada y el `.env.example` quedó fuera del
  repositorio por el `.gitignore`.
- **Qué haría distinto:** indicar mi sistema operativo desde el primer prompt; hacer commit y actualizar
  la bitácora al cerrar cada etapa, en lugar de acumularlos; y verificar con `git ls-files` lo que realmente
  queda en el repositorio antes de desplegar.
