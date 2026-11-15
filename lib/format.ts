export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMileage(km: number): string {
  return `${new Intl.NumberFormat("es-SV").format(km)} km`;
}

export const bodyTypeLabels: Record<string, string> = {
  sedan: "Sedán",
  suv: "SUV",
  pickup: "Pickup",
  hatchback: "Hatchback",
  deportivo: "Deportivo",
};

export const fuelLabels: Record<string, string> = {
  gasolina: "Gasolina",
  diesel: "Diésel",
  hibrido: "Híbrido",
  electrico: "Eléctrico",
};

export const transmissionLabels: Record<string, string> = {
  manual: "Manual",
  automatica: "Automática",
};