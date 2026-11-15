import type {
  FieldErrors,
  PaymentMethod,
  PurchaseRequestInput,
} from "@/types/purchase-request";

export const MESSAGE_MAX_LENGTH = 500;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_REGEX = /^[\d\s+()-]+$/;
const PAYMENT_METHODS: PaymentMethod[] = ["contado", "financiamiento"];

type ValidationResult =
  | { ok: true; data: PurchaseRequestInput }
  | { ok: false; errors: FieldErrors };

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validatePurchaseRequest(
  input: unknown,
  isValidVehicleId: (id: string) => boolean
): ValidationResult {
  const raw =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const vehicleId = text(raw.vehicleId);
  const fullName = text(raw.fullName);
  const email = text(raw.email);
  const phone = text(raw.phone);
  const payment = text(raw.payment);
  const message = text(raw.message);

  const errors: FieldErrors = {};

  if (!vehicleId) {
    errors.vehicleId = "Selecciona un vehículo.";
  } else if (!isValidVehicleId(vehicleId)) {
    errors.vehicleId = "El vehículo seleccionado no existe.";
  }

  if (fullName.length < 3) {
    errors.fullName = "Escribe tu nombre completo (mínimo 3 caracteres).";
  } else if (fullName.length > 80) {
    errors.fullName = "El nombre no puede superar los 80 caracteres.";
  }

  if (!email) {
    errors.email = "Escribe tu correo electrónico.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Escribe un correo válido, por ejemplo nombre@correo.com.";
  }

  if (phone) {
    const digits = phone.replace(/\D/g, "").length;
    if (!PHONE_CHARS_REGEX.test(phone) || digits < 8 || digits > 15) {
      errors.phone = "Escribe un teléfono válido (entre 8 y 15 dígitos).";
    }
  }

  if (!PAYMENT_METHODS.includes(payment as PaymentMethod)) {
    errors.payment = "Elige una forma de pago.";
  }

  if (message.length > MESSAGE_MAX_LENGTH) {
    errors.message = `El mensaje no puede superar los ${MESSAGE_MAX_LENGTH} caracteres.`;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      vehicleId,
      fullName,
      email,
      phone,
      payment: payment as PaymentMethod,
      message,
    },
  };
}