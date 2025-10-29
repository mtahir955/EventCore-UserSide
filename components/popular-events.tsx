"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MapPin, Calendar, Users, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const allEvents = [
  {
    id: 1,
    image: "/images/elegant-venue.jpeg",
    price: "$99.99",
    host: "Eric Grzybowski",
    title: "Starry Nights Music Fest",
    description:
      "A magical evening under the stars with live bands, food stalls, and an eclectic crowd that will amaze.",
    location: "California",
    date: "13 June 2025",
    audience: "150 Audience",
    time: "08:00 PM - 09:00 PM",
    type: "This week",
  },
  {
    id: 2,
    image: "/images/concert-crowd.png",
    price: "$120.00",
    host: "Alex Morrison",
    title: "Live Rock Bash",
    description:
      "Experience electrifying performances from top bands in an unforgettable night of rock and roll.",
    location: "New York",
    date: "21 Oct 2025",
    audience: "500 Audience",
    time: "07:30 PM - 10:00 PM",
    type: "Today",
  },
  {
    id: 3,
    image: "/images/speaker-presentation.png",
    price: "$49.00",
    host: "Dr. Hannah Lee",
    title: "Business Growth Seminar",
    description:
      "Join industry leaders for insights on scaling your business successfully this quarter.",
    location: "Online",
    date: "22 Oct 2025",
    audience: "1000+ Virtual",
    time: "05:00 PM - 06:30 PM",
    type: "Online",
  },
  {
    id: 4,
    image: "/images/elegant-venue.jpeg",
    price: "$89.50",
    host: "Michael James",
    title: "Tomorrowland Dance Party",
    description:
      "Get ready to dance the night away with world-class DJs and neon vibes.",
    location: "Los Angeles",
    date: "22 Oct 2025",
    audience: "300 Audience",
    time: "09:00 PM - 12:00 AM",
    type: "Tomorrow",
  },
  {
    id: 5,
    image: "/images/concert-crowd.png",
    price: "$59.00",
    host: "Sophia Turner",
    title: "Sunday Jazz Vibes",
    description:
      "Unwind with smooth jazz tunes and fine dining under the city skyline.",
    location: "Chicago",
    date: "19 Oct 2025",
    audience: "250 Audience",
    time: "06:00 PM - 08:00 PM",
    type: "This week",
  },
  {
    id: 6,
    image: "/images/elegant-venue.jpeg",
    price: "$75.00",
    host: "Riley Carter",
    title: "Mindful Meditation Session",
    description:
      "A guided mindfulness experience to relax your body and refresh your mind.",
    location: "Online",
    date: "18 Oct 2025",
    audience: "400 Online",
    time: "09:00 AM - 10:30 AM",
    type: "Online",
  },
];

export function PopularEvents({
  searchQuery,
}: {
  searchQuery: { eventName: string; location: string; date: string | null };
}) {
  const [activeFilter, setActiveFilter] = useState("All Events");
  const [filteredEvents, setFilteredEvents] = useState(allEvents);
  const filters = ["All Events", "Today", "This week", "Tomorrow", "Online"];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollDir, setScrollDir] = useState(1);

  // Auto-scroll animation
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let frame: number;
    const speed = 0.3;
    const animate = () => {
      el.scrollLeft += scrollDir * speed;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
        setScrollDir(-1);
      else if (el.scrollLeft <= 0) setScrollDir(1);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [scrollDir]);

  // Apply type filter (Today, This week, etc.)
  useEffect(() => {
    let filtered = allEvents;
    if (activeFilter !== "All Events") {
      filtered = filtered.filter(
        (event) => event.type.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    // Apply search filter (event name, location, date)
    if (searchQuery) {
      const { eventName, location, date } = searchQuery;
      filtered = filtered.filter((event) => {
        const matchesName =
          !eventName ||
          event.title.toLowerCase().includes(eventName.toLowerCase());
        const matchesLocation =
          !location ||
          event.location.toLowerCase().includes(location.toLowerCase());
        const matchesDate =
          !date || event.date.toLowerCase().includes(date.toLowerCase());
        return matchesName && matchesLocation && matchesDate;
      });
    }

    setFilteredEvents(filtered);
  }, [activeFilter, searchQuery]);

  const router = useRouter();

  const handleEventClick = (id: number) => {
    router.push(`/details?id=${id}`); // or `/details/${id}` if using dynamic route
  };

  return (
    <section className="w-full bg-white dark:bg-[#101010] py-16 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#000000] dark:text-white mb-3">
            Popular{" "}
            <span className="text-[#89FC00] italic font-bold">Events</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-base">
            Discover the most talked-about events everyone's attending — don't
            miss out!
          </p>
        </div>

        {/* Filter tabs */}
        <div className="relative w-full overflow-x-hidden mb-12 flex justify-center">
          <div
            ref={scrollRef}
            className="flex items-center justify-start md:justify-center gap-4 sm:gap-6 md:gap-8 px-4 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-shrink-0 px-6 py-2 font-light rounded-full transition-colors whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-[#0077F7] text-white"
                    : "bg-gray-100 dark:bg-[#1E1E1E] text-[#000000] dark:text-white hover:text-[#0077F7] dark:hover:text-[#89FC00]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 px-1 sm:px-6 md:px-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event.id)}
                className="relative overflow-hidden rounded-2xl group cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <div className="relative h-[300px] sm:h-[300px] md:h-[330px]">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl" />

                  {/* Price */}
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-[#1E1E1E]/95 px-3 py-1 rounded-full">
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                      {event.price}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-4 left-3 right-3">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-white text-xs sm:text-sm">
                        <span>Host By: {event.host}</span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-white/90 dark:bg-[#1E1E1E]/80 hover:bg-white dark:hover:bg-[#2A2A2A] rounded-full w-7 h-7 sm:w-8 sm:h-8"
                      >
                        <Star className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      </Button>
                    </div>
                    <h3 className="text-white text-lg sm:text-xl font-bold mb-1 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3 text-white text-[11px] sm:text-xs">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                      <Calendar className="w-3 h-3 ml-3" />
                      <span>{event.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
              No events found for your search.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
