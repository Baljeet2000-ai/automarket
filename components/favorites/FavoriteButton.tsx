"use client";

import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  vehicleId: string;
  name: string;
  variant?: "icon" | "full";
}

export default function FavoriteButton({
  vehicleId,
  name,
  variant = "icon",
}: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(vehicleId);

  const heart = (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggle(vehicleId)}
        aria-pressed={active}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold ring-1 ring-inset transition-colors ${
          active
            ? "bg-red-50 text-red-600 ring-red-200 hover:bg-red-100"
            : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-50"
        }`}
      >
        {heart}
        {active ? "Quitar de favoritos" : "Guardar en favoritos"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(vehicleId)}
      aria-pressed={active}
      aria-label={
        active
          ? `Quitar ${name} de favoritos`
          : `Guardar ${name} en favoritos`
      }
      className={`rounded-full bg-white/90 p-2.5 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-white ${
        active ? "text-red-500" : "text-slate-500 hover:text-red-500"
      }`}
    >
      {heart}
    </button>
  );
}