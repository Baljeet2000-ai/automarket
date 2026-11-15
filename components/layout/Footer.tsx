import Link from "next/link";

async function CurrentYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © <CurrentYear /> AutoMarket. Proyecto académico de Kodigo.
        </p>
        <ul className="flex gap-4">
          <li>
            <Link href="/vehiculos" className="hover:text-blue-700">
              Catálogo
            </Link>
          </li>
          <li>
            <Link href="/favoritos" className="hover:text-blue-700">
              Favoritos
            </Link>
          </li>
          <li>
            <Link href="/solicitud" className="hover:text-blue-700">
              Solicitud
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}