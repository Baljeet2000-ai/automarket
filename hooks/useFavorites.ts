"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "automarket:favoritos";
const CHANGE_EVENT = "automarket:favoritos-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback); // cambios desde otras pestañas
  window.addEventListener(CHANGE_EVENT, callback); // cambios en esta pestaña
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

// En el servidor no existe localStorage: se parte de una lista vacía.
function getServerSnapshot(): string {
  return "[]";
}

function parseIds(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

const noopSubscribe = () => () => {};

export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ids = useMemo(() => parseIds(raw), [raw]);

  // false durante el render del servidor y la hidratación; true ya en el navegador.
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  const toggle = useCallback((id: string) => {
    const current = parseIds(getSnapshot());
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Si el navegador bloquea el almacenamiento, no se guarda nada.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, ready, count: ids.length, isFavorite, toggle };
}