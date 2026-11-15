export type PaymentMethod = "contado" | "financiamiento";

export interface PurchaseRequestInput {
  vehicleId: string;
  fullName: string;
  email: string;
  phone: string;
  payment: PaymentMethod | "";
  message: string;
}

export type FieldErrors = Partial<Record<keyof PurchaseRequestInput, string>>;

export interface PurchaseConfirmation {
  reference: string;
  vehicleId: string;
  vehicleName: string;
  createdAt: string;
}