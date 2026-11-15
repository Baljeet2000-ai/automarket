import Skeleton from "@/components/ui/Skeleton";
import VehicleGridSkeleton from "@/components/vehicles/VehicleGridSkeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>
      <VehicleGridSkeleton count={3} />
    </div>
  );
}