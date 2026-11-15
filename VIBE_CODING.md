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