import { Suspense } from "react";
import type { Metadata } from "next";
import PurchaseRequestForm from "@/components/forms/PurchaseRequestForm";
import Skeleton from "@/components/ui/Skeleton";
import { getVehicles } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Solicitud de compra",
  description: "Envía tu solicitud de compra y elige tu forma de pago.",
};

type SearchParams = Record<string, string | string[] | undefined>;

async function RequestContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const raw = params.vehiculo;
  const requestedId = Array.isArray(raw) ? raw[0] : raw;

  const options = getVehicles()
    .map((v) => ({
      id: v.id,
      label: `${v.brand} ${v.model} ${v.year}`,
      price: v.price,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const defaultVehicleId = options.some((o) => o.id === requestedId)
    ? requestedId
    : undefined;

  return (
    <PurchaseRequestForm
      vehicles={options}
      defaultVehicleId={defaultVehicleId}
    />
  );
}

export default function RequestPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          Solicitud de compra
        </h1>
        <p className="mt-1 text-slate-600">
          Completa tus datos y elige el vehículo que te interesa.
        </p>
      </header>

      <Suspense fallback={<Skeleton className="h-[34rem] w-full rounded-xl" />}>
        <RequestContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}