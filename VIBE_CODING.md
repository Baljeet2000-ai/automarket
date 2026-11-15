# Bitácora de Vibe Coding: AutoMarket

**Herramienta de IA:** Claude (Anthropic)
**Rol:** yo dirijo, valido e itero; la IA genera código por etapas.

---

## Etapa 1: Planificación y arquitectura

**Prompt principal:**
Prompt estructurado en 5 secciones (contexto, requisitos técnicos, entregables, rúbrica y forma de trabajo)
derivado de las instrucciones de la actividad. Pedí propuesta de estructura, modelo de datos y plan
de commits antes de escribir código.

**Iteraciones:**
1. La IA propuso Supabase + Route Handlers.
2. Decidí no usar Supabase y quedarme solo con Route Handlers y datos en un archivo JSON.
3. La IA ajustó la propuesta y me advirtió de una limitación de Vercel (sistema de archivos de solo lectura).

**Decisiones técnicas:**
- Datos en `data/vehicles.json`, leídos con funciones en `lib/vehicles.ts`.
- Server Components para inicio, catálogo y detalle (menos JS en el cliente).
- Favoritos en `localStorage` porque Vercel no permite escribir archivos en producción.
- Solicitudes: validación en servidor con Route Handler y confirmación con referencia, sin persistencia.
- Filtros del catálogo mediante `searchParams` en la URL (compartibles).

**Desafíos y cómo se resolvieron:**
- Persistencia sin base de datos en Vercel: se resolvió usando `localStorage` y documentando el límite.

---

## Etapa 2: Setup del proyecto

**Prompt:** "Aprobado" (aprobación de la propuesta de la etapa 1).

**Resultado:** proyecto creado con `create-next-app` (App Router, TypeScript, Tailwind, ESLint,
sin carpeta `src`), estructura de carpetas base, `.env.example`, README y esta bitácora.

**Decisiones técnicas:**
- Sin carpeta `src/` para mantener `app/` en la raíz, simple y alineado con la documentación de Next.js.
- `.env.example` con una sola variable opcional, ya que no hay claves secretas.

**Desafíos:** 
- Intenté copiar `.env.example` antes de crearlo: la IA me dio su contenido en el chat, pero el archivo
  no existe hasta crearlo manualmente. Lo resolví creándolo con `Set-Content` en PowerShell.
---

## Etapa 3: Layout con navbar responsive y footer

**Prompt:** "siguiente" (continuación del plan aprobado en la etapa 1).

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

**Prompt:** "siguiente".

**Resultado:** `types/vehicle.ts`, `data/vehicles.json` (12 vehículos), `lib/vehicles.ts`
(`getVehicles` con filtros, `getVehicleById`, `getFeaturedVehicles`, `getFilterOptions`) y `lib/format.ts`.

**Decisiones técnicas:**
- El JSON se importa como módulo (no con `fs`) para que funcione en Vercel y con Cache Components.
- La lógica de filtrado vive en funciones puras reutilizadas por Server Components y Route Handlers.
- IDs tipo slug para URLs legibles.


---

## Etapa 5: Route Handlers de vehículos con filtros

**Prompt:** "siguiente".

**Resultado:** `GET /api/vehiculos` (filtros por q, brand, bodyType, rango de precio y año, orden e ids)
y `GET /api/vehiculos/[id]` con 404 JSON si no existe. Función `parseFilters` en `lib/filters.ts`.

**Decisiones técnicas:**
- `parseFilters` se comparte entre la API y el catálogo para no duplicar lógica.
- Los parámetros numéricos inválidos se ignoran para que la API sea tolerante.
- `params` se resuelve con `await` porque en Next.js 16 es una Promise.
- Respuestas con forma consistente (`{ data, total }` / `{ error }`) y códigos HTTP correctos.


## Etapa 6: Página de inicio con vehículos destacados

**Prompt:** "siguiente".

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

**Prompt:** "Siguiente".

**Resultado:** página `/vehiculos` con resultados filtrables por URL, contador de resultados,
estado vacío con botón para limpiar filtros, `Skeleton`, `VehicleGridSkeleton` y `loading.tsx`.

**Decisiones técnicas:**
- Con Cache Components, `searchParams` se lee dentro de un componente asíncrono (`VehicleResults`)
  envuelto en `<Suspense>`; la página en sí es un cascarón estático.
- Filtros por parámetros de URL (compartibles y compatibles con el historial del navegador),
  reutilizando `parseFilters` y `getVehicles`.
- El skeleton replica la forma de la tarjeta para evitar saltos de diseño.


---

## Etapa 8: Filtros por marca, tipo, precio y año

**Prompt:** "Siguiente".

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

---

## Etapa 9: Página de detalle con ruta dinámica

**Prompt:** "Siguiente".

**Resultado:** `/vehiculos/[id]` con migas de pan, imagen, precio, ficha técnica (`VehicleSpecs`),
botón de solicitud, vehículos relacionados, `generateMetadata`, `loading.tsx` y `not-found.tsx` propio.

**Decisiones técnicas:**
- `generateStaticParams` para prerenderizar una página por vehículo; compatible con Cache Components.
- `notFound()` con un `not-found.tsx` específico para IDs inexistentes (404 real).
- Metadata dinámica por vehículo.
- Todo Server Component; el botón de favoritos (etapa 10) será el único componente cliente.
- Los vehículos relacionados reutilizan `VehicleGrid` y `getVehicles`.


---

## Etapa 10: Favoritos con localStorage y página /favoritos

**Prompt:** "Siguiente".

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


---

## Etapa 11: Formulario y Route Handler de solicitud de compra

**Prompt:** "Siguiente".

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
  que la moví a a la ubicación correcta. Aprendizaje: leer el código de estado en la terminal y
  verificar la estructura de carpetas antes de sospechar del código.


  ---

## Etapa 12: error.tsx global y por ruta

**Prompt:** "Siguiente".

**Resultado:** `ErrorState` reutilizable, `app/error.tsx`, `app/vehiculos/error.tsx` (cubre catálogo
y detalle) y `app/global-error.tsx` para fallos del layout raíz.

**Decisiones técnicas:**
- Jerarquía de límites de error: mensaje específico en `/vehiculos`, general en `app/`, crítico en `global-error`.
- Reintento con `router.refresh()` + `reset()` dentro de `startTransition`, para volver a pedir los datos al servidor.
- `useEffect` para registrar el error en consola; se muestra el `digest` sin exponer detalles internos.
- `global-error.tsx` incluye `html`, `body` y los estilos, porque sustituye al layout.

