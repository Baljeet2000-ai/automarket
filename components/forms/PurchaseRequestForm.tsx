"use client";

import { useRef, useState } from "react";
import Alert from "@/components/ui/Alert";
import ButtonLink from "@/components/ui/ButtonLink";
import FormField from "@/components/ui/FormField";
import { formatPrice } from "@/lib/format";
import { MESSAGE_MAX_LENGTH, validatePurchaseRequest } from "@/lib/validators";
import type {
  FieldErrors,
  PurchaseConfirmation,
  PurchaseRequestInput,
} from "@/types/purchase-request";

interface VehicleOption {
  id: string;
  label: string;
  price: number;
}

interface PurchaseRequestFormProps {
  vehicles: VehicleOption[];
  defaultVehicleId?: string;
}

type Status = "idle" | "submitting" | "success";

const FIELD_ORDER: (keyof PurchaseRequestInput)[] = [
  "vehicleId",
  "fullName",
  "email",
  "phone",
  "payment",
  "message",
];

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
      : "border-slate-300 focus:border-blue-600 focus:ring-blue-200"
  }`;
}

export default function PurchaseRequestForm({
  vehicles,
  defaultVehicleId,
}: PurchaseRequestFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const initialValues: PurchaseRequestInput = {
    vehicleId: defaultVehicleId ?? "",
    fullName: "",
    email: "",
    phone: "",
    payment: "",
    message: "",
  };

  const [values, setValues] = useState<PurchaseRequestInput>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<PurchaseConfirmation | null>(
    null
  );

  const selectedVehicle = vehicles.find((v) => v.id === values.vehicleId);

  function setField<K extends keyof PurchaseRequestInput>(
    field: K,
    value: PurchaseRequestInput[K]
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function focusFirstError(fieldErrors: FieldErrors) {
    const first = FIELD_ORDER.find((field) => fieldErrors[field]);
    if (!first) return;
    formRef.current
      ?.querySelector<HTMLElement>(`[name="${first}"]`)
      ?.focus();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const result = validatePurchaseRequest(values, (id) =>
      vehicles.some((v) => v.id === id)
    );

    if (!result.ok) {
      setErrors(result.errors);
      focusFirstError(result.errors);
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const json = await res.json().catch(() => null);

      if (res.status === 201 && json?.data) {
        setConfirmation(json.data as PurchaseConfirmation);
        setStatus("success");
        return;
      }

      if (res.status === 422 && json?.errors) {
        setErrors(json.errors as FieldErrors);
        focusFirstError(json.errors as FieldErrors);
        setStatus("idle");
        return;
      }

      throw new Error(`Respuesta inesperada (${res.status})`);
    } catch {
      setServerError(
        "No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo."
      );
      setStatus("idle");
    }
  }

  function handleReset() {
    setValues(initialValues);
    setErrors({});
    setServerError(null);
    setConfirmation(null);
    setStatus("idle");
  }

  if (status === "success" && confirmation) {
    return (
      <div
        role="status"
        className="rounded-xl bg-emerald-50 p-6 text-emerald-900 ring-1 ring-emerald-200"
      >
        <h2 className="text-xl font-bold">¡Solicitud enviada!</h2>
        <p className="mt-2 text-sm">
          Registramos tu interés en <strong>{confirmation.vehicleName}</strong>.
          Guarda tu número de referencia:
        </p>
        <p className="mt-3 inline-block rounded-lg bg-white px-4 py-2 font-mono text-lg font-semibold tracking-wider">
          {confirmation.reference}
        </p>
        <p className="mt-4 text-xs text-emerald-800">
          Este proyecto es una demostración académica: la solicitud se valida y
          se confirma, pero no se almacena.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/vehiculos">Seguir explorando</ButtonLink>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-300 hover:bg-emerald-100"
          >
            Enviar otra solicitud
          </button>
        </div>
      </div>
    );
  }

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-xl bg-white p-5 ring-1 ring-slate-200 sm:p-6"
    >
      {serverError && <Alert title="Error al enviar">{serverError}</Alert>}

      {hasErrors && (
        <p role="alert" className="text-sm font-medium text-red-700">
          Revisa los campos marcados antes de enviar.
        </p>
      )}

      <FormField
        id="vehicleId"
        label="Vehículo"
        required
        error={errors.vehicleId}
      >
        <select
          id="vehicleId"
          name="vehicleId"
          value={values.vehicleId}
          onChange={(e) => setField("vehicleId", e.target.value)}
          aria-invalid={Boolean(errors.vehicleId)}
          aria-describedby={errors.vehicleId ? "vehicleId-error" : undefined}
          className={inputClass(Boolean(errors.vehicleId))}
        >
          <option value="">Selecciona un vehículo</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
        {selectedVehicle && (
          <p className="mt-1 text-sm font-semibold text-blue-700">
            Precio: {formatPrice(selectedVehicle.price)}
          </p>
        )}
      </FormField>

      <FormField
        id="fullName"
        label="Nombre completo"
        required
        error={errors.fullName}
      >
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          value={values.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          className={inputClass(Boolean(errors.fullName))}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="email"
          label="Correo electrónico"
          required
          error={errors.email}
        >
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass(Boolean(errors.email))}
          />
        </FormField>

        <FormField
          id="phone"
          label="Teléfono (opcional)"
          error={errors.phone}
          hint="Incluye el código de país si es necesario."
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => setField("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={
              errors.phone ? "phone-error" : "phone-hint"
            }
            className={inputClass(Boolean(errors.phone))}
          />
        </FormField>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-700">
          Forma de pago{" "}
          <span aria-hidden="true" className="text-red-600">
            *
          </span>
        </legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          {(
            [
              { value: "contado", label: "Al contado" },
              { value: "financiamiento", label: "Financiamiento" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm text-slate-800"
            >
              <input
                type="radio"
                name="payment"
                value={option.value}
                checked={values.payment === option.value}
                onChange={() => setField("payment", option.value)}
                aria-describedby={errors.payment ? "payment-error" : undefined}
                className="h-4 w-4 border-slate-300 text-blue-700 focus:ring-blue-200"
              />
              {option.label}
            </label>
          ))}
        </div>
        {errors.payment && (
          <p id="payment-error" className="mt-1 text-sm text-red-600">
            {errors.payment}
          </p>
        )}
      </fieldset>

      <FormField
        id="message"
        label="Mensaje (opcional)"
        error={errors.message}
        hint={`${values.message.length}/${MESSAGE_MAX_LENGTH} caracteres`}
      >
        <textarea
          id="message"
          name="message"
          rows={4}
          value={values.message}
          onChange={(e) => setField("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : "message-hint"}
          className={inputClass(Boolean(errors.message))}
        />
      </FormField>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  );
}