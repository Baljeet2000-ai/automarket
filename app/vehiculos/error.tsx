"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorState from "@/components/ui/ErrorState";

export default function VehiclesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <ErrorState
      title="No pudimos cargar los vehículos"
      message="Hubo un problema al obtener la información del catálogo. Inténtalo de nuevo en unos segundos."
      digest={error.digest}
      onRetry={retry}
      secondaryHref="/"
      secondaryLabel="Volver al inicio"
    />
  );
}