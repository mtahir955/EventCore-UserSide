"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import {
  formatEventDateLabel,
  formatEventTimeLabel,
  normalizeEvent,
} from "@/lib/event-publishing";
import {
  EventLifecycleBadge,
  EventModeBadge,
  EventPrivacyBadge,
} from "@/components/events/event-badges";

interface EventCardProps {
  event: any;
}

export function EventCard({ event }: EventCardProps) {
  const router = useRouter();
  const normalizedEvent = normalizeEvent(event);

  return (
    <div
      onClick={() => router.push(normalizedEvent.urlPath)}
      className="relative rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(0,102,255,0.18)] bg-white dark:bg-[#101010]"
    >
      <div className="relative h-[330px] sm:h-[300px] md:h-[330px] w-full">
        <Image
          src={normalizedEvent.bannerImage || "/placeholder.svg"}
          alt={normalizedEvent.title}
          fill
          className="object-cover"
          unoptimized={false}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex flex-wrap gap-2">
          <EventLifecycleBadge status={normalizedEvent.lifecycleStatus} />
          <EventModeBadge mode={normalizedEvent.mode} />
          <EventPrivacyBadge privacyType={normalizedEvent.privacyType} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 line-clamp-2">
            {normalizedEvent.title}
          </h3>

          <p className="text-xs sm:text-sm mb-3 opacity-90 line-clamp-2 text-white/90">
            {normalizedEvent.shortDescription || normalizedEvent.description}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-white/90">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>
                {normalizedEvent.mode === "virtual"
                  ? "Online"
                  : normalizedEvent.locationLabel}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatEventDateLabel(normalizedEvent)}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatEventTimeLabel(normalizedEvent)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

