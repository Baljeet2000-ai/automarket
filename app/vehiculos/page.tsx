import { Suspense } from "react";
import type { Metadata } from "next";
import VehicleResults from "@/components/vehicles/VehicleResults";
import VehicleGridSkeleton from "@/components/vehicles/VehicleGridSkeleton";

export const metadata: Metadata = {
  title: "Catálogo de vehículos",
  description:
    "Explora todos los vehículos disponibles y filtra por marca, tipo, precio y año.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          Catálogo de vehículos
        </h1>
        <p className="mt-1 text-slate-600">
          Encuentra el vehículo que se ajusta a lo que buscas.
        </p>
      </header>

      <Suspense fallback={<VehicleGridSkeleton />}>
        <VehicleResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}