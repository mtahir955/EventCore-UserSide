export default function CalendarBadge({
  label,
  tone = "accent",
}: {
  label: string;
  tone?: "accent" | "green";
}) {
  return (
    <span
      className={`rounded-full px-2.5 sm:px-3 py-[2px] sm:py-1 text-[10px] sm:text-xs font-medium`}
      style={{
        background:
          tone === "accent"
            ? "var(--color-accent)"
            : "var(--color-brand-green)",
        color: "#000",
      }}
    >
      {label}
    </span>
  );
}
