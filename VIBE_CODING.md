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

**Desafíos:** _(completar si surge algo al correr el setup)_