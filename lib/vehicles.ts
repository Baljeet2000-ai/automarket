import vehiclesData from "@/data/vehicles.json";
import type { Vehicle, VehicleFilters } from "@/types/vehicle";

const vehicles = vehiclesData as Vehicle[];

/** Devuelve los vehículos que cumplen los filtros indicados. */
export function getVehicles(filters: VehicleFilters = {}): Vehicle[] {
  const { q, brand, bodyType, minPrice, maxPrice, minYear, maxYear, ids, sort } =
    filters;

  const term = q?.trim().toLowerCase();

  const result = vehicles.filter((v) => {
    if (ids && !ids.includes(v.id)) return false;
    if (brand && v.brand.toLowerCase() !== brand.toLowerCase()) return false;
    if (bodyType && v.bodyType !== bodyType) return false;
    if (minPrice !== undefined && v.price < minPrice) return false;
    if (maxPrice !== undefined && v.price > maxPrice) return false;
    if (minYear !== undefined && v.year < minYear) return false;
    if (maxYear !== undefined && v.year > maxYear) return false;
    if (term && !`${v.brand} ${v.model}`.toLowerCase().includes(term)) {
      return false;
    }
    return true;
  });

  switch (sort) {
    case "price-asc":
      return [...result].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...result].sort((a, b) => b.price - a.price);
    case "year-desc":
      return [...result].sort((a, b) => b.year - a.year);
    default:
      return result;
  }
}

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function getFeaturedVehicles(): Vehicle[] {
  return vehicles.filter((v) => v.featured);
}

/** Opciones para poblar los filtros del catálogo. */
export function getFilterOptions() {
  const brands = [...new Set(vehicles.map((v) => v.brand))].sort();
  const bodyTypes = [...new Set(vehicles.map((v) => v.bodyType))].sort();
  const prices = vehicles.map((v) => v.price);
  const years = vehicles.map((v) => v.year);

  return {
    brands,
    bodyTypes,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    minYear: Math.min(...years),
    maxYear: Math.max(...years),
  };
}