# AutoMarket

Marketplace de compra de vehículos construido con Next.js 16 (App Router), TypeScript y Tailwind CSS.
Proyecto de la actividad evaluada de Kodigo: "Implementación de Aplicación Next.js mediante Vibe Coding".

🔗 **Demo en producción:** _(pendiente de despliegue)_

## Funcionalidades

- Catálogo de vehículos con búsqueda y filtros (marca, tipo, precio, año).
- Detalle de cada vehículo con ruta dinámica.
- Favoritos guardados en el navegador.
- Formulario de solicitud de compra con validación en servidor.
- Diseño responsive, estados de carga y manejo de errores.

## Tecnologías

- Next.js 16 (App Router) + React
- TypeScript
- Tailwind CSS
- Route Handlers como API interna; datos en `data/vehicles.json`

## Instalación

```bash
git clone <URL-DEL-REPOSITORIO>
cd automarket
npm install
cp .env.example .env.local
npm run dev
```

La app queda disponible en http://localhost:3000.

## Variables de entorno

| Variable | Descripción | Obligatoria |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio, usada en metadata y enlaces | No |

## Scripts

- `npm run dev`: servidor de desarrollo
- `npm run build`: build de producción
- `npm run start`: servidor de producción
- `npm run lint`: revisión con ESLint

## Decisiones y límites conocidos

Vercel no permite escribir archivos en tiempo de ejecución, por lo que los favoritos se guardan
en `localStorage` y las solicitudes de compra se validan y confirman sin persistirse en base de datos.
Más detalle en [`VIBE_CODING.md`](./VIBE_CODING.md).

## Proceso de desarrollo

Este proyecto se construyó con la metodología Vibe Coding (IA como copiloto).
La bitácora completa está en [`VIBE_CODING.md`](./VIBE_CODING.md).