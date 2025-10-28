"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface Event {
  id: number;
  image: string;
  host: string;
  title: string;
  description: string;
  location: string;
  date: string;
  audience: number;
  time: string;
  price: string;
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isInterested, setIsInterested] = useState(false);

  return (
    <div className="relative rounded-lg overflow-hidden group w-full transition-all duration-300 bg-white dark:bg-[#101010]">
      {/* Event Image */}
      <div className="relative h-[330px] sm:h-[300px] md:h-[320px]">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover rounded-lg"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-lg" />

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-full px-4 py-1 text-xs sm:text-sm font-semibold shadow-md">
          {event.price}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-[10px] sm:text-xs text-white/90">
              Host By: {event.host}
            </span>

            {/* Star / Favorite Button */}
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/90 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 rounded-full w-7 h-7 sm:w-8 sm:h-8 transition"
              onClick={() => setIsInterested(!isInterested)}
            >
              <Star
                className={`w-4 h-4 ${
                  isInterested
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              />
            </Button>
          </div>

          <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-none">
            {event.title}
          </h3>
          <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-white/90 line-clamp-2">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-[10px] sm:text-sm text-white/90">
            <div className="flex items-center gap-1 sm:gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_9148972%20%281%29-niKbAE1FXafr663Dpe02Hq5jsucn2v.png"
                alt="Location"
                width={14}
                height={14}
              />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_2740596%20%283%29-nZQjNBO19UvXEtuJCxjfqlAELcFrNG.png"
                alt="Date"
                width={14}
                height={14}
              />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_10426399%20%282%29-QiwAzsLc6djdb6eTlrIiLBWgHHp2LU.png"
                alt="Audience"
                width={14}
                height={14}
              />
              <span>{event.audience} Audience</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_2740596%20%282%29-Drq4FDLvg6cxCV8MTfDSZf6PNIOzGp.png"
                alt="Time"
                width={14}
                height={14}
              />
              <span>{event.time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
