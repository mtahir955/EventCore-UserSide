import Image from "next/image";
import { MapPin, Calendar, Users, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  cta: string;
}

export default function ExploreCard({
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
    <div className="relative overflow-hidden rounded-2xl group cursor-pointer">
      <Link href="/events">
      <div className="relative h-[220px] sm:h-[280px] md:h-[330px]">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover rounded-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl" />

        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white px-2 sm:px-3 py-[2px] sm:py-1 rounded-full">
          <span className="text-xs sm:text-sm font-semibold text-gray-900">
            {price}
          </span>
        </div>

        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-[10px] sm:text-xs text-white">
              Host By: {host}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/90 hover:bg-white rounded-full w-6 sm:w-8 h-6 sm:h-8"
            >
              <Star className="w-3 sm:w-4 h-3 sm:h-4 text-gray-700" />
            </Button>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
            {title}
          </h3>
          <p className="text-[11px] sm:text-sm text-white/90 line-clamp-2">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3 text-white text-[10px] sm:text-xs">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{audience}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{time}</span>
            </div>
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
}

