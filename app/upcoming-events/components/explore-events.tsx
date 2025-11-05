"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "./explore-card";
import { useRouter } from "next/navigation";
import Link from "next/link";

const events = [
  {
    title: "Starry Nights Music Fest",
    description:
      "Get ready to kick off the Christmas season in Mumbai with SOUND OF CHRISTMAS - your favourite LIVE Christmas concert!",
    image: "/images/event-venue-1.png",
    location: "California",
    date: "13 June 2025",
    audience: "150 Audience",
    time: "08:00 PM - 09:00 PM",
    price: "$99.99",
    host: "Eric Grusdonas",
  },
  {
    title: "Starry Nights Music Fest",
    description:
      "Get ready to kick off the Christmas season in Mumbai with SOUND OF CHRISTMAS - your favourite LIVE Christmas concert!",
    image: "/images/event-venue-2.png",
    location: "California",
    date: "13 June 2025",
    audience: "150 Audience",
    time: "08:00 PM - 09:00 PM",
    price: "$99.99",
    host: "Eric Grusdonas",
  },
];

export function ExploreEvents() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const router = useRouter();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">
          Explore More Events
        </h2>

        <div className="relative">
          <div className="grid grid-cols-2 gap-6">
            {events.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-black hover:bg-black/80 text-white rounded-full w-12 h-12"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-black hover:bg-black/80 text-white rounded-full w-12 h-12"
            onClick={goToNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}
