import Image from "next/image"

export default function Header({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between border-b border-gray-100 px-8 py-4">
      <h2 className="text-3xl font-bold text-black">{title}</h2>
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 hover:bg-gray-100">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/streamline_notification-alarm-2-RLHabfgcsHuMg4zK1SGDZx4PHbCduL.png"
            alt="Notifications"
            width={22}
            height={22}
            className="h-5 w-5"
          />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-park-twotone_user-v4ka4ClrgGwoq3YXmLCKojK3azxf3E.png"
            alt="User"
            width={20}
            height={20}
            className="h-5 w-5"
          />
        </button>
      </div>
    </header>
  )
}
