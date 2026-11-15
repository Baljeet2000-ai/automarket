import ButtonLink from "@/components/ui/ButtonLink";

export default function VehicleNotFound() {
  return (
    <section className="py-16 text-center">
      <p className="text-sm font-semibold text-blue-700">Error 404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        Vehículo no encontrado
      </h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600">
        Es posible que ya no esté disponible o que el enlace sea incorrecto.
        Revisa el catálogo para ver las opciones actuales.
      </p>
      <div className="mt-8">
        <ButtonLink href="/vehiculos">Ver catálogo</ButtonLink>
      </div>
    </section>
  );
}