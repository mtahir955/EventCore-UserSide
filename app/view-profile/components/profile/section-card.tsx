import type { ReactNode } from "react";

export default function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
      <div className="mt-4 sm:mt-6">{children}</div>
    </section>
  );
}
