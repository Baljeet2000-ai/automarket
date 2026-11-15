import type { Vehicle } from "@/types/vehicle";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import VehicleCard from "./VehicleCard";

interface VehicleGridProps {
  vehicles: Vehicle[];
  className?: string;
}

export default function VehicleGrid({
  vehicles,
  className = "sm:grid-cols-2 lg:grid-cols-3",
}: VehicleGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-6 ${className}`}>
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          action={
            <FavoriteButton
              vehicleId={vehicle.id}
              name={`${vehicle.brand} ${vehicle.model}`}
            />
          }
        />
      ))}
    </div>
  );
}