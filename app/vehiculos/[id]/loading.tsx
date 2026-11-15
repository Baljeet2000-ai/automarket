import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="space-y-8">
      <span className="sr-only">Cargando vehículo…</span>
      <Skeleton className="h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        <div className="space-y-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-9 w-1/3" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}