import Link from "next/link";
import type { Vehicle } from "@/types/vehicle";
import {
  bodyTypeLabels,
  formatMileage,
  formatPrice,
  fuelLabels,
  transmissionLabels,
} from "@/lib/format";
import Badge from "@/components/ui/Badge";
import VehicleImage from "./VehicleImage";

interface VehicleCardProps {
  vehicle: Vehicle;
  /** Espacio para acciones (por ejemplo, el botón de favoritos). */
  action?: React.ReactNode;
}

export default function VehicleCard({ vehicle, action }: VehicleCardProps) {
  const name = `${vehicle.brand} ${vehicle.model}`;

  return (
    <article className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
      <Link href={`/vehiculos/${vehicle.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <VehicleImage src={vehicle.image} alt={`${name} ${vehicle.year}`} />
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700">
              {name}
            </h3>
            <p className="text-sm text-slate-500">
              {vehicle.year} · {formatMileage(vehicle.mileage)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge tone="blue">{bodyTypeLabels[vehicle.bodyType]}</Badge>
            <Badge>{fuelLabels[vehicle.fuel]}</Badge>
            <Badge>{transmissionLabels[vehicle.transmission]}</Badge>
          </div>

          <p className="text-xl font-bold text-blue-700">
            {formatPrice(vehicle.price)}
          </p>
        </div>
      </Link>

      {action && <div className="absolute right-3 top-3">{action}</div>}
    </article>
  );
}