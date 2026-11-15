interface AlertProps {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}

export default function Alert({ title, children, action }: AlertProps) {
  return (
    <div
      role="alert"
      className="rounded-xl bg-red-50 p-5 text-red-800 ring-1 ring-red-200"
    >
      <h2 className="font-semibold">{title}</h2>
      {children && <p className="mt-1 text-sm">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}