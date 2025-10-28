"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCarouselProps {
  images: string[];
}

export function EventCarousel({ images }: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const goToNext = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-[#101010] transition-colors duration-300">
      {/* Carousel Image */}
      <Image
        src={images[currentIndex] || "/placeholder.svg"}
        alt="Event"
        fill
        className="object-cover"
      />

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/10 dark:bg-[#101010]/40 transition-colors duration-300" />

      {/* Navigation Buttons (visible from tablet up) */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 
          bg-black/50 hover:bg-black/70 dark:bg-gray-200/70 dark:hover:bg-gray-300/80 
          text-white dark:text-black rounded-full w-8 sm:w-10 h-8 sm:h-10 transition-colors"
        onClick={goToPrevious}
      >
        <ChevronLeft className="w-4 sm:w-6 h-4 sm:h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 
          bg-black/50 hover:bg-black/70 dark:bg-gray-200/70 dark:hover:bg-gray-300/80 
          text-white dark:text-black rounded-full w-8 sm:w-10 h-8 sm:h-10 transition-colors"
        onClick={goToNext}
      >
        <ChevronRight className="w-4 sm:w-6 h-4 sm:h-6" />
      </Button>

      {/* Mobile indicator dots */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
        {images.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full cursor-pointer transition-all ${
              idx === currentIndex
                ? "bg-white dark:bg-gray-100"
                : "bg-white/50 dark:bg-gray-500/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
