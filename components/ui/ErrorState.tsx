import ButtonLink from "@/components/ui/ButtonLink";

interface ErrorStateProps {
  title: string;
  message: string;
  digest?: string;
  onRetry: () => void;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export default function ErrorState({
  title,
  message,
  digest,
  onRetry,
  secondaryHref = "/",
  secondaryLabel = "Volver al inicio",
}: ErrorStateProps) {
  return (
    <section role="alert" className="py-16 text-center">
      <p className="text-sm font-semibold text-red-600">Algo salió mal</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600">{message}</p>
      {digest && (
        <p className="mt-2 text-xs text-slate-500">Código de error: {digest}</p>
      )}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Intentar de nuevo
        </button>
        <ButtonLink href={secondaryHref} variant="secondary">
          {secondaryLabel}
        </ButtonLink>
      </div>
    </section>
  );
}