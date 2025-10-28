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
    <div
      className="
      relative rounded-2xl overflow-hidden group cursor-pointer 
      transition-all duration-500 hover:scale-[1.01] 
      hover:shadow-[0_0_20px_rgba(0,102,255,0.25)] 
      bg-white dark:bg-[#101010]"
    >
      {/* Image */}
      <div className="relative h-[330px] sm:h-[300px] md:h-[330px] w-full">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Price */}
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-full px-4 py-1 text-sm font-semibold shadow-md">
          {event.price}
        </div>

        {/* Card Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white">
          {/* Host + Favorite */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm text-white/80">
              Host By: {event.host}
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="bg-white/90 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 rounded-full w-8 h-8 transition"
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

          {/* Title */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-none">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm mb-3 opacity-90 line-clamp-2 text-white/90">
            {event.description}
          </p>

          {/* Details */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-white/90">
            <div className="flex items-center gap-1">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_9148972%20%281%29-niKbAE1FXafr663Dpe02Hq5jsucn2v.png"
                alt="Location"
                width={14}
                height={14}
              />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center gap-1">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_2740596%20%283%29-nZQjNBO19UvXEtuJCxjfqlAELcFrNG.png"
                alt="Date"
                width={14}
                height={14}
              />
              <span>{event.date}</span>
            </div>

            <div className="flex items-center gap-1">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_10426399%20%282%29-QiwAzsLc6djdb6eTlrIiLBWgHHp2LU.png"
                alt="Audience"
                width={14}
                height={14}
              />
              <span>{event.audience} Audience</span>
            </div>

            <div className="flex items-center gap-1">
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
