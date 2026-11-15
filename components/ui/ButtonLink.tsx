import Link from "next/link";

type Variant = "primary" | "secondary";

const styles: Record<Variant, string> = {
  primary: "bg-blue-700 text-white hover:bg-blue-800",
  secondary:
    "bg-white text-blue-700 ring-1 ring-inset ring-blue-200 hover:bg-blue-50",
};

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}