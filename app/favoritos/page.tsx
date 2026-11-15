import type { Metadata } from "next";
import FavoritesList from "@/components/favorites/FavoritesList";

export const metadata: Metadata = {
  title: "Mis favoritos",
  description: "Los vehículos que guardaste para revisar más tarde.",
};

export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Mis favoritos</h1>
        <p className="mt-1 text-slate-600">
          Los vehículos que guardaste en este navegador.
        </p>
      </header>

      <FavoritesList />
    </div>
  );
}