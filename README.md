# AutoMarket

Marketplace de compra de vehículos construido con **Next.js 16 (App Router)**, **TypeScript** y **Tailwind CSS**.
Proyecto de la actividad evaluada de Kodigo: _Implementación de Aplicación Next.js mediante Vibe Coding_.

🔗 **Demo en producción:** https://automarket-orcin.vercel.app

## Funcionalidades

- Catálogo de vehículos con búsqueda y filtros por marca, tipo, precio máximo y año, más ordenamiento.
  Los filtros viven en la URL, por lo que cada búsqueda se puede compartir.
- Página de detalle de cada vehículo (ruta dinámica) con ficha técnica y vehículos relacionados.
- Favoritos guardados en el navegador, con contador en el menú.
- Formulario de solicitud de compra con validación en cliente y servidor.
- Diseño responsive, estados de carga (skeletons) y manejo de errores en cada nivel.

## Tecnologías

- Next.js 16 (App Router, Server y Client Components, Cache Components)
- React y TypeScript
- Tailwind CSS
- Route Handlers como API interna; datos en `data/vehicles.json`
- Despliegue en Vercel

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Inicio: hero, categorías y vehículos destacados |
| `/vehiculos` | Catálogo con filtros y orden |
| `/vehiculos/[id]` | Detalle de un vehículo |
| `/favoritos` | Vehículos guardados por el usuario |
| `/solicitud` | Formulario de solicitud de compra |

## API interna

| Método y ruta | Descripción |
|---|---|
| `GET /api/vehiculos` | Lista vehículos. Admite `q`, `brand`, `bodyType`, `minPrice`, `maxPrice`, `minYear`, `maxYear`, `sort` e `ids` (separados por coma) |
| `GET /api/vehiculos/[id]` | Devuelve un vehículo o `404` si no existe |
| `POST /api/solicitudes` | Valida y confirma una solicitud. Responde `201`, `400` (JSON inválido) o `422` (datos inválidos) |

Ejemplo:

```bash
curl "https://automarket-orcin.vercel.app/api/vehiculos?bodyType=suv&sort=price-asc"
```

## Instalación

Requiere Node.js 20.9 o superior.

```bash
git clone https://github.com/Baljeet2000-ai/automarket.git
cd automarket
npm install
cp .env.example .env.local
npm run dev
```

La app queda disponible en http://localhost:3000.

## Variables de entorno

| Variable | Descripción | Obligatoria |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio, usada como `metadataBase`. En local: `http://localhost:3000` | No |

## Scripts

- `npm run dev`: servidor de desarrollo
- `npm run build`: build de producción
- `npm run start`: servidor de producción
- `npm run lint`: revisión con ESLint

## Estructura del proyecto

```
app/                 Rutas (App Router), Route Handlers, loading/error/not-found
components/          Componentes de UI, layout, vehículos, filtros, favoritos y formularios
hooks/               useFavorites (localStorage)
lib/                 Lectura de datos, filtros, validación y formato
data/vehicles.json   Catálogo de vehículos
types/               Tipos de TypeScript
public/vehiculos/    Imágenes de los vehículos
```

## Decisiones técnicas y límites conocidos

- **Server Components por defecto**; Client Components solo donde hay interactividad (menú, filtros,
  favoritos, formulario).
- **Filtros en la URL** con `useSearchParams` y `router.replace`, con debounce para el texto de búsqueda.
- **Sin base de datos:** Vercel no permite escribir archivos en tiempo de ejecución. Por eso los favoritos
  se guardan en `localStorage` y las solicitudes de compra se validan y se confirman con un número de
  referencia, pero **no se almacenan**.
- La validación del formulario es la misma función en cliente y servidor.

## Proceso de desarrollo

Este proyecto se construyó con la metodología Vibe Coding, usando Claude como copiloto de desarrollo.
La bitácora completa (prompts, iteraciones, decisiones técnicas y desafíos) está en
[`VIBE_CODING.md`](./VIBE_CODING.md).