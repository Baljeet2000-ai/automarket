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
