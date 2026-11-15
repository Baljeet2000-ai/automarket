"use client";

import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="flex min-h-screen items-center justify-center bg-slate-50 px-4 font-sans text-slate-900">
        <section role="alert" className="max-w-md text-center">
          <p className="text-sm font-semibold text-red-600">Error crítico</p>
          <h1 className="mt-2 text-3xl font-bold">
            AutoMarket no está disponible
          </h1>
          <p className="mt-3 text-slate-600">
            Ocurrió un problema al cargar la aplicación. Intenta recargar la
            página.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-slate-400">
              Código de error: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            className="mt-8 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Recargar
          </button>
        </section>
      </body>
    </html>
  );
}