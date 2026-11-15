export type BodyType = "sedan" | "suv" | "pickup" | "hatchback" | "deportivo";
export type FuelType = "gasolina" | "diesel" | "hibrido" | "electrico";
export type Transmission = "manual" | "automatica";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  bodyType: BodyType;
  fuel: FuelType;
  transmission: Transmission;
  mileage: number;
  color: string;
  description: string;
  image: string;
  featured: boolean;
}

export interface VehicleFilters {
  q?: string;
  brand?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  ids?: string[];
  sort?: "price-asc" | "price-desc" | "year-desc" | "recientes";
}