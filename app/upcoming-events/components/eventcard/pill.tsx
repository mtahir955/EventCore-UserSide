export default function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 sm:gap-2">{children}</span>
  );
}

