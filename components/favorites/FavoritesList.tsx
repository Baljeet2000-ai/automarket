"use client";

import { useEffect, useState } from "react";
import Alert from "@/components/ui/Alert";
import ButtonLink from "@/components/ui/ButtonLink";
import VehicleGrid from "@/components/vehicles/VehicleGrid";
import VehicleGridSkeleton from "@/components/vehicles/VehicleGridSkeleton";
import { useFavorites } from "@/hooks/useFavorites";
import type { Vehicle } from "@/types/vehicle";

interface Result {
  key: string;
  vehicles: Vehicle[];
  error: boolean;
}

export default function FavoritesList() {
  const { ids, ready } = useFavorites();
  const [result, setResult] = useState<Result | null>(null);
  const [attempt, setAttempt] = useState(0);

  const idsKey = ids.join(",");
  const requestKey = `${idsKey}|${attempt}`;

  useEffect(() => {
    if (!ready || !idsKey) return;

    const controller = new AbortController();

    fetch(`/api/vehiculos?ids=${encodeURIComponent(idsKey)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json() as Promise<{ data: Vehicle[] }>;
      })
      .then((json) =>
        setResult({ key: requestKey, vehicles: json.data, error: false })
      )
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setResult({ key: requestKey, vehicles: [], error: true });
      });

    // Si cambian los favoritos a mitad de la petición, se cancela la anterior.
    return () => controller.abort();
  }, [ready, idsKey, requestKey]);

  // Antes de hidratar no sabemos qué hay guardado: mostramos el skeleton.
  if (!ready) return <VehicleGridSkeleton count={3} />;

  if (ids.length === 0) {
    return (
      <div className="rounded-xl bg-white px-6 py-12 text-center ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          Aún no tienes favoritos
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Pulsa el corazón en cualquier vehículo para guardarlo aquí.
        </p>
        <div className="mt-6">
          <ButtonLink href="/vehiculos">Explorar catálogo</ButtonLink>
        </div>
      </div>
    );
  }

  // Si quitaste un favorito, ya tenemos los datos de los demás: no hace falta esperar.
  const covered =
    result !== null &&
    !result.error &&
    ids.every((id) => result.vehicles.some((v) => v.id === id));

  if (covered) {
    const shown = result.vehicles.filter((v) => ids.includes(v.id));
    return <VehicleGrid vehicles={shown} />;
  }

  if (result?.key === requestKey && result.error) {
    return (
      <Alert
        title="No pudimos cargar tus favoritos"
        action={
          <button
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            Reintentar
          </button>
        }
      >
        Hubo un problema al consultar el servidor. Revisa tu conexión e
        inténtalo de nuevo.
      </Alert>
    );
  }

  return <VehicleGridSkeleton count={Math.min(ids.length, 6)} />;
}