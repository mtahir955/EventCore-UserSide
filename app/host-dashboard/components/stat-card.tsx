type StatCardProps = {
  icon: string;
  label: string;
  value: string;
  accent?: "indigo" | "peach" | "yellow";
};

export function StatCard({ icon, label, value, accent }: StatCardProps) {
  const accentBg =
    accent === "indigo"
      ? "var(--stat-indigo)"
      : accent === "peach"
      ? "var(--stat-peach)"
      : accent === "yellow"
      ? "var(--brand-soft)"
      : "var(--stat-peach)";
  return (
    <div className="rounded-2xl border bg-card px-5 py-7">
      <div className="flex items-center gap-5">
        <div
          className="h-14 w-14 rounded-full grid place-items-center"
          style={{ background: accentBg }}
          aria-hidden
        >
          <img src={icon || "/placeholder.svg"} alt="" className="h-6 w-6" />
        </div>
        <div className="text-left space-y-0.5">
          <div className="text-[24px] font-semibold leading-none">{value}</div>
          <div className="text-[12px] text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}
