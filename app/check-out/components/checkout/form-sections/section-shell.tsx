import type { PropsWithChildren } from "react"

export default function SectionShell({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <section className="rounded-[12px] border border-token-border bg-token-card p-6">
      <h2 className="mb-4 text-xl font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  )
}
