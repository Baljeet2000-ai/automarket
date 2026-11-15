interface BadgeProps {
  children: React.ReactNode;
  tone?: "neutral" | "blue" | "green";
}

const tones = {
  neutral: "bg-slate-100 text-slate-700",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
};

export default function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}