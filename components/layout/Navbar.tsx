"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/vehiculos", label: "Vehículos" },
  { href: "/favoritos", label: "Favoritos" },
  { href: "/solicitud", label: "Solicitud" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Navegación principal"
      >
        <Link
          href="/"
          className="text-xl font-bold text-blue-700"
          onClick={() => setOpen(false)}
        >
          Auto<span className="text-slate-800">Market</span>
        </Link>

        {/* Menú de escritorio */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón de menú móvil */}
        <button
          type="button"
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((prev) => !prev)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Menú móvil */}
      {open && (
        <ul
          id="menu-movil"
          className="space-y-1 border-t border-slate-200 bg-white px-4 py-3 md:hidden"
        >
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}