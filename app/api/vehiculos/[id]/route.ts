import { NextResponse } from "next/server";
import { getVehicleById } from "@/lib/vehicles";

// GET /api/vehiculos/toyota-corolla-2022
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vehicle = getVehicleById(id);

  if (!vehicle) {
    return NextResponse.json(
      { error: "Vehículo no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: vehicle });
}