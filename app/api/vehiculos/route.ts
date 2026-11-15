import { NextResponse, type NextRequest } from "next/server";
import { getVehicles } from "@/lib/vehicles";
import { parseFilters } from "@/lib/filters";

// GET /api/vehiculos?q=toyota&brand=Toyota&bodyType=suv&minPrice=10000&maxPrice=30000&minYear=2020&sort=price-asc
// GET /api/vehiculos?ids=toyota-corolla-2022,honda-crv-2023
export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const filters = parseFilters(params);
  const data = getVehicles(filters);

  return NextResponse.json({ data, total: data.length });
}