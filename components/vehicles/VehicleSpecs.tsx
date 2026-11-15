import type { Vehicle } from "@/types/vehicle";
import {
  bodyTypeLabels,
  formatMileage,
  fuelLabels,
  transmissionLabels,
} from "@/lib/format";

export default function VehicleSpecs({ vehicle }: { vehicle: Vehicle }) {
  const specs = [
    { label: "Marca", value: vehicle.brand },
    { label: "Modelo", value: vehicle.model },
    { label: "Año", value: String(vehicle.year) },
    { label: "Kilometraje", value: formatMileage(vehicle.mileage) },
    { label: "Tipo", value: bodyTypeLabels[vehicle.bodyType] },
    { label: "Combustible", value: fuelLabels[vehicle.fuel] },
    { label: "Transmisión", value: transmissionLabels[vehicle.transmission] },
    { label: "Color", value: vehicle.color },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200 sm:grid-cols-4 lg:grid-cols-2">
      {specs.map((spec) => (
        <div key={spec.label}>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {spec.label}
          </dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}