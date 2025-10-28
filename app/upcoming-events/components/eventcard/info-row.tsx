export default function InfoRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-5 text-[11px] sm:text-sm text-foreground/70">
      {children}
    </div>
  );
}


