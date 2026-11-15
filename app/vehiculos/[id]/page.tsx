import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ButtonLink from "@/components/ui/ButtonLink";
import Badge from "@/components/ui/Badge";
import VehicleImage from "@/components/vehicles/VehicleImage";
import VehicleSpecs from "@/components/vehicles/VehicleSpecs";
import VehicleGrid from "@/components/vehicles/VehicleGrid";
import { getVehicleById, getVehicles } from "@/lib/vehicles";
import { bodyTypeLabels, fuelLabels, formatPrice } from "@/lib/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Prerenderiza una página por cada vehículo del catálogo.
export function generateStaticParams() {
  return getVehicles().map((vehicle) => ({ id: vehicle.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = getVehicleById(id);

  if (!vehicle) return { title: "Vehículo no encontrado" };

  return {
    title: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    description: vehicle.description,
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const vehicle = getVehicleById(id);

  if (!vehicle) notFound();

  const name = `${vehicle.brand} ${vehicle.model}`;
  const related = getVehicles({ bodyType: vehicle.bodyType })
    .filter((v) => v.id !== vehicle.id)
    .slice(0, 3);

  return (
    <div className="space-y-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-blue-700">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/vehiculos" className="hover:text-blue-700">
              Catálogo
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-slate-900">
            {name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
          <VehicleImage
            src={vehicle.image}
            alt={`${name} ${vehicle.year}`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="blue">{bodyTypeLabels[vehicle.bodyType]}</Badge>
              <Badge>{fuelLabels[vehicle.fuel]}</Badge>
              {vehicle.featured && <Badge tone="green">Destacado</Badge>}
            </div>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              {name}{" "}
              <span className="font-normal text-slate-500">{vehicle.year}</span>
            </h1>
            <p className="mt-3 text-3xl font-bold text-blue-700">
              {formatPrice(vehicle.price)}
            </p>
          </div>

          <p className="text-slate-700">{vehicle.description}</p>

          <VehicleSpecs vehicle={vehicle} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={`/solicitud?vehiculo=${vehicle.id}`}
              className="sm:flex-1"
            >
              Solicitar compra
            </ButtonLink>
            <ButtonLink href="/vehiculos" variant="secondary">
              Volver al catálogo
            </ButtonLink>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionados">
          <h2 id="relacionados" className="text-2xl font-bold text-slate-900">
            Otros {bodyTypeLabels[vehicle.bodyType].toLowerCase()}s que podrían
            interesarte
          </h2>
          <div className="mt-6">
            <VehicleGrid vehicles={related} />
          </div>
        </section>
      )}
    </div>
  );
}