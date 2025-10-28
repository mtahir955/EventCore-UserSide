type Props = {
  imageSrc: string
  title: string
  price: string
}

export function EventCard({ imageSrc, title, price }: Props) {
  return (
    <div className="rounded-2xl border overflow-hidden">
      <div className="relative h-[202px]">
        <img src={imageSrc || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
        {/* Top-right controls */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            aria-label="Edit event"
            className="h-8 w-8 rounded-full grid place-items-center shadow-md"
            style={{ background: "var(--card)" }}
          >
            <img src="/images/icons/pencil.png" className="h-4 w-4" alt="" />
          </button>
          <div
            className="h-7 px-3 rounded-full text-[12px] grid place-items-center font-semibold"
            style={{ background: "var(--brand)", color: "var(--brand-on)" }}
          >
            {price}
          </div>
        </div>
      </div>
      <div className="px-4 py-3">
        <div className="text-[14px] font-semibold">{title}</div>
        <div className="text-[12px] text-muted-foreground">Aug 1 • 7:00 PM</div>
      </div>
    </div>
  )
}
