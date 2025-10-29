"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Users, Clock } from "lucide-react";

type EventCardProps = {
  image: string;
  title: string;
  subtitle: string;
  price: string;
};

export function EventCard({ image, title, subtitle, price }: EventCardProps) {
  const router = useRouter();

  // Navigate to /details when the card is clicked
  const handleClick = () => {
    router.push("/details");
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border dark:border-gray-700 w-full cursor-pointer",
        "bg-white dark:bg-[#181818] transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-500/20 hover:scale-[1.01]"
      )}
    >
      <div className="relative h-[220px] sm:h-[280px] md:h-[330px] w-full">
        {/* event image */}
        <Image
          src={image || "/images/event-venue-1.png"}
          alt={title}
          fill
          className="object-cover"
          priority
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* price badge */}
        <div className="absolute left-3 sm:left-4 top-3 sm:top-4 rounded-full bg-white dark:bg-[#222222] text-gray-900 dark:text-gray-100 px-2 sm:px-3 py-[3px] sm:py-1 text-[10px] sm:text-[12px] font-semibold shadow">
          {price}
        </div>

        {/* favorite button (click disabled from triggering redirect) */}
        <button
          aria-label="Favorite event"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-3 sm:right-4 top-3 sm:top-4 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-white dark:bg-[#222222] flex items-center justify-center shadow hover:scale-105 transition-transform"
        >
          <Image
            src="/icons/star-1.png"
            alt="star"
            width={20}
            height={20}
            className="dark:invert"
          />
        </button>

        {/* text content */}
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-white">
          <p className="text-[10px] sm:text-[12px] opacity-80 mb-1">
            Host By : Eric Grzybowski
          </p>
          <h4 className="text-[15px] sm:text-[18px] font-semibold leading-tight">
            {title}
          </h4>
          <p className="mt-1 text-[12px] sm:text-[13px] opacity-90 line-clamp-2">
            {subtitle}
          </p>

          {/* event meta */}
          <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[12px] opacity-90">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>California</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span>13 June 2025</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-white" />
              <span>150 Audience</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-white" />
              <span>08:00 PM - 09:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
