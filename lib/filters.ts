import type { VehicleFilters } from "@/types/vehicle";

type RawParams = Record<string, string | string[] | undefined>;

const validSorts = ["price-asc", "price-desc", "year-desc"] as const;

function first(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v && v.trim() !== "" ? v.trim() : undefined;
}

function toNumber(value: string | string[] | undefined): number | undefined {
  const v = first(value);
  if (v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Convierte parámetros de URL (query string o searchParams) en filtros tipados. */
export function parseFilters(params: RawParams): VehicleFilters {
  const sort = first(params.sort);
  const ids = first(params.ids);

  return {
    q: first(params.q),
    brand: first(params.brand),
    bodyType: first(params.bodyType),
    minPrice: toNumber(params.minPrice),
    maxPrice: toNumber(params.maxPrice),
    minYear: toNumber(params.minYear),
    maxYear: toNumber(params.maxYear),
    ids: ids ? ids.split(",").filter(Boolean) : undefined,
    sort: validSorts.find((s) => s === sort),
  };
}