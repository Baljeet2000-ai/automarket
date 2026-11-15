import { NextResponse } from "next/server";
import { getVehicleById } from "@/lib/vehicles";
import { validatePurchaseRequest } from "@/lib/validators";

// POST /api/solicitudes
// 201: solicitud aceptada | 400: JSON inválido | 422: datos inválidos
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud no es un JSON válido." },
      { status: 400 }
    );
  }

  const result = validatePurchaseRequest(body, (id) =>
    Boolean(getVehicleById(id))
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: "Datos inválidos.", errors: result.errors },
      { status: 422 }
    );
  }

  const vehicle = getVehicleById(result.data.vehicleId)!;

  // Vercel no permite escribir archivos, así que la solicitud se valida y se
  // confirma, pero no se almacena en ninguna base de datos (ver README).
  const reference = `SOL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  return NextResponse.json(
    {
      data: {
        reference,
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        createdAt: new Date().toISOString(),
      },
    },
    { status: 201 }
  );
}