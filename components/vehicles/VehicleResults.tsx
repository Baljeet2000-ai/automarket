import ButtonLink from "@/components/ui/ButtonLink";
import { getVehicles } from "@/lib/vehicles";
import { parseFilters } from "@/lib/filters";
import VehicleGrid from "./VehicleGrid";

type SearchParams = Record<string, string | string[] | undefined>;

interface VehicleResultsProps {
  searchParams: Promise<SearchParams>;
}

export default async function VehicleResults({
  searchParams,
}: VehicleResultsProps) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const vehicles = getVehicles(filters);

  if (vehicles.length === 0) {
    return (
      <div className="rounded-xl bg-white px-6 py-12 text-center ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          No encontramos vehículos con esos filtros
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Prueba con otros criterios o limpia los filtros para ver todo el
          catálogo.
        </p>
        <div className="mt-6">
          <ButtonLink href="/vehiculos" variant="secondary">
            Limpiar filtros
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600" aria-live="polite">
        {vehicles.length}{" "}
        {vehicles.length === 1 ? "vehículo encontrado" : "vehículos encontrados"}
      </p>
      <VehicleGrid vehicles={vehicles} />
    </div>
  );
}