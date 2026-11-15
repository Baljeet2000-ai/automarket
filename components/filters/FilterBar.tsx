"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Select from "@/components/ui/Select";
import { bodyTypeLabels, formatPrice } from "@/lib/format";

interface FilterOptions {
  brands: string[];
  bodyTypes: string[];
  minYear: number;
  maxYear: number;
}

const PRICE_STEPS = [15000, 20000, 25000, 30000, 35000, 40000];

const SORT_OPTIONS = [
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "year-desc", label: "Más recientes" },
];

const FILTER_KEYS = ["q", "brand", "bodyType", "maxPrice", "minYear", "sort"];

export default function FilterBar({ options }: { options: FilterOptions }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // El texto de búsqueda es el único valor con estado local (para el debounce).
  const urlQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(urlQ);
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ);

  // Si la URL cambia desde fuera (atrás/adelante, "Limpiar filtros"), sincroniza el input.
  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ);
    setQ(urlQ);
  }

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  // Debounce: espera 400 ms después de la última tecla antes de actualizar la URL.
  useEffect(() => {
    if (q.trim() === urlQ) return;
    const timer = setTimeout(() => {
      updateParams({ q: q.trim() || undefined });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, urlQ]);

  const hasFilters = FILTER_KEYS.some((key) => searchParams.has(key));

  function clearFilters() {
    setQ("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  const years = Array.from(
    { length: options.maxYear - options.minYear + 1 },
    (_, i) => String(options.maxYear - i)
  );

  return (
    <section
      aria-label="Filtros del catálogo"
      aria-busy={isPending}
      className="space-y-4 rounded-xl bg-white p-4 ring-1 ring-slate-200"
    >
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600">
          Buscar por marca o modelo
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej.: Toyota, Corolla…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </label>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Select
          label="Marca"
          placeholder="Todas"
          value={searchParams.get("brand") ?? ""}
          onChange={(v) => updateParams({ brand: v || undefined })}
          options={options.brands.map((b) => ({ value: b, label: b }))}
        />
        <Select
          label="Tipo"
          placeholder="Todos"
          value={searchParams.get("bodyType") ?? ""}
          onChange={(v) => updateParams({ bodyType: v || undefined })}
          options={options.bodyTypes.map((t) => ({
            value: t,
            label: bodyTypeLabels[t] ?? t,
          }))}
        />
        <Select
          label="Precio máximo"
          placeholder="Sin límite"
          value={searchParams.get("maxPrice") ?? ""}
          onChange={(v) => updateParams({ maxPrice: v || undefined })}
          options={PRICE_STEPS.map((p) => ({
            value: String(p),
            label: `Hasta ${formatPrice(p)}`,
          }))}
        />
        <Select
          label="Año"
          placeholder="Cualquiera"
          value={searchParams.get("minYear") ?? ""}
          onChange={(v) => updateParams({ minYear: v || undefined })}
          options={years.map((y) => ({ value: y, label: `Desde ${y}` }))}
        />
        <Select
          label="Ordenar por"
          placeholder="Relevancia"
          value={searchParams.get("sort") ?? ""}
          onChange={(v) => updateParams({ sort: v || undefined })}
          options={SORT_OPTIONS}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500" aria-live="polite">
          {isPending ? "Actualizando resultados…" : ""}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="font-semibold text-blue-700 hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </section>
  );
}