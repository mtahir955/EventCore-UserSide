"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "./event-card";

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
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#101010] transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-12 transition-colors">
          Explore More Events
        </h2>

        <div className="relative">
          {/* Responsive grid — single column on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {events.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>

          {/* Navigation arrows (hidden on mobile) */}
          <div className="hidden sm:flex">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-black dark:bg-gray-200 hover:bg-black/80 dark:hover:bg-gray-300 text-white dark:text-black rounded-full w-10 sm:w-12 h-10 sm:h-12 transition-colors"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-black dark:bg-gray-200 hover:bg-black/80 dark:hover:bg-gray-300 text-white dark:text-black rounded-full w-10 sm:w-12 h-10 sm:h-12 transition-colors"
              onClick={goToNext}
            >
              <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
