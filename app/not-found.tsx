import ButtonLink from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <section className="py-16 text-center">
      <p className="text-sm font-semibold text-blue-700">Error 404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
        Página no encontrada
      </h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600">
        La página que buscas no existe o fue movida. Puedes volver al inicio o
        explorar el catálogo de vehículos.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <ButtonLink href="/">Volver al inicio</ButtonLink>
        <ButtonLink href="/vehiculos" variant="secondary">
          Ver catálogo
        </ButtonLink>
      </div>
    </section>
  );
}