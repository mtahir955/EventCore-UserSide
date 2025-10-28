export default function Legend() {
  return (
    <div className="flex items-center gap-6">
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="inline-block h-3 w-3 rounded-full bg-[var(--color-accent)]" />
        In Person
      </span>
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="inline-block h-3 w-3 rounded-full bg-[var(--color-brand-green)]" />
        Virtual
      </span>
    </div>
  )
}
