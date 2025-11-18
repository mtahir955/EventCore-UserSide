"use client";

import Image from "next/image";
import { MapPin, Calendar, Users, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  audience: string;
  time: string;
  price: string;
  host: string;
}

export function EventCard({
  title,
  description,
  image,
  location,
  date,
  audience,
  time,
  price,
  host,
}: EventCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl group cursor-pointer bg-white dark:bg-[#101010] transition-colors duration-300">
      {/* Image Section */}
      <div className="relative h-[240px] sm:h-[300px] md:h-[330px]">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover rounded-2xl"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl dark:from-[#101010]/90 dark:via-[#101010]/40 dark:to-transparent" />

        {/* Price Tag */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white dark:bg-[#1a1a1a] px-2 sm:px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
            {price}
          </span>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">

          <h3 className="text-lg sm:text-xl font-bold text-white dark:text-gray-100 mb-1 sm:mb-2">
            {title}
          </h3>
          <p className="text-[11px] sm:text-sm text-white/90 dark:text-gray-300 line-clamp-2">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-white text-[10px] sm:text-xs dark:text-gray-300">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white dark:text-gray-300" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white dark:text-gray-300" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white dark:text-gray-300" />
              <span>{time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
