import Link from "next/link";
import ButtonLink from "@/components/ui/ButtonLink";
import VehicleGrid from "@/components/vehicles/VehicleGrid";
import { getFeaturedVehicles } from "@/lib/vehicles";
import { bodyTypeLabels } from "@/lib/format";

const categories = ["sedan", "suv", "pickup", "hatchback", "deportivo"];

export default function HomePage() {
  const featured = getFeaturedVehicles();

  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 px-6 py-14 text-center text-white sm:px-12 sm:py-20">
        <h1 className="text-3xl font-bold sm:text-5xl">
          Encuentra el vehículo ideal para ti
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-blue-50 sm:text-lg">
          Explora nuestro catálogo, filtra por marca, tipo y precio, guarda tus
          favoritos y envía tu solicitud de compra en minutos.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/vehiculos" variant="secondary">
            Ver catálogo
          </ButtonLink>
          <Link
            href="/solicitud"
            className="text-sm font-semibold text-white underline-offset-4 hover:underline"
          >
            Enviar una solicitud
          </Link>
        </div>
      </section>

      {/* Categorías */}
      <section aria-labelledby="categorias">
        <h2 id="categorias" className="text-2xl font-bold text-slate-900">
          Explora por tipo
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {categories.map((type) => (
            <li key={type}>
              <Link
                href={`/vehiculos?bodyType=${type}`}
                className="inline-block rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-blue-50 hover:text-blue-700 hover:ring-blue-200"
              >
                {bodyTypeLabels[type]}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Destacados */}
      <section aria-labelledby="destacados">
        <div className="flex items-end justify-between">
          <h2 id="destacados" className="text-2xl font-bold text-slate-900">
            Vehículos destacados
          </h2>
          <Link
            href="/vehiculos"
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            Ver todos →
          </Link>
        </div>
        <div className="mt-6">
          <VehicleGrid
            vehicles={featured}
            className="sm:grid-cols-2 lg:grid-cols-4"
          />
        </div>
      </section>
    </div>
  );
}