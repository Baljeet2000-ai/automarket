import Skeleton from "@/components/ui/Skeleton";

interface VehicleGridSkeletonProps {
  count?: number;
}

export default function VehicleGridSkeleton({
  count = 6,
}: VehicleGridSkeletonProps) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Cargando vehículos…</span>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200"
          >
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-6 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}