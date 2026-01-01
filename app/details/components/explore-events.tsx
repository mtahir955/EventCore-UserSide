"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "./event-card";
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

        <Link href="/events">
          <Button
            className="
      rounded-full
      px-7 py-3
      text-sm font-semibold
      bg-[#0077F7]
      text-white
      hover:bg-[#0077F7]/90
      active:scale-95
      transition-all
      shadow-md
    "
          >
            Explore Events
          </Button>
        </Link>
      </div>
    </section>
  );
}
