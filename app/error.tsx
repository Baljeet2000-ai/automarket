"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorState from "@/components/ui/ErrorState";

export default function ErrorPage({
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
    // refresh() vuelve a pedir los datos al servidor; reset() reintenta el render.
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <ErrorState
      title="Ocurrió un error inesperado"
      message="No pudimos mostrar esta página. Puedes intentarlo de nuevo o volver al inicio."
      digest={error.digest}
      onRetry={retry}
    />
  );
}