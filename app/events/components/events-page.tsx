"use client";

import { useState, useMemo } from "react";
import { Header } from "../../../components/header";
import { EventCard } from "../components/event-card";
import { Footer } from "../../../components/footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allEvents = [
  {
    id: 1,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
    host: "Eric Gryzbowski",
    title: "Starry Nights Music Fest",
    description:
      "A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze.",
    location: "california",
    date: "13 June 2025",
    audience: 150,
    time: "08:00 PM - 09:00 PM",
    price: "$99.99",
    status: "upcoming",
    mode: "offline",
    priceType: "paid",
  },
  {
    id: 2,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
    host: "Samantha Grey",
    title: "Live Rock Bash",
    description: "Join the biggest rock event in Texas!",
    location: "texas",
    date: "25 Oct 2025",
    audience: 400,
    time: "07:00 PM - 10:00 PM",
    price: "Free",
    status: "ongoing",
    mode: "offline",
    priceType: "free",
  },
  {
    id: 3,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
    host: "Dr. Amanda Cruz",
    title: "Online Business Growth Summit",
    description:
      "Learn the secrets of scaling your business from experts worldwide.",
    location: "new-york",
    date: "21 Oct 2025",
    audience: 1200,
    time: "05:00 PM - 07:00 PM",
    price: "$49.00",
    status: "upcoming",
    mode: "online",
    priceType: "paid",
  },
  {
    id: 4,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
    host: "Michael Dean",
    title: "Downtown Jazz Festival",
    description: "An elegant evening of jazz music and cultural performances.",
    location: "california",
    date: "10 May 2025",
    audience: 200,
    time: "06:00 PM - 08:00 PM",
    price: "$79.00",
    status: "past",
    mode: "offline",
    priceType: "paid",
  },
  {
    id: 5,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
    host: "Alex Parker",
    title: "Tech Future Virtual Expo",
    description: "Explore AI and blockchain innovations with top speakers.",
    location: "texas",
    date: "18 Nov 2025",
    audience: 300,
    time: "04:00 PM - 06:00 PM",
    price: "Free",
    status: "upcoming",
    mode: "online",
    priceType: "free",
  },
  {
    id: 6,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
    host: "Jessica Miller",
    title: "Startup Networking Meetup",
    description:
      "A casual offline meetup for founders, investors, and developers.",
    location: "new-york",
    date: "14 Oct 2025",
    audience: 80,
    time: "03:00 PM - 05:00 PM",
    price: "$29.00",
    status: "ongoing",
    mode: "hybrid",
    priceType: "paid",
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: i + 7,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
    host: "Eric Gryzbowski",
    title: `Music Event #${i + 7}`,
    description:
      "A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze.",
    location: i % 2 === 0 ? "texas" : "california",
    date: "13 June 2025",
    audience: 150,
    time: "08:00 PM - 09:00 PM",
    price: "$99.99",
    status: i % 3 === 0 ? "upcoming" : "past",
    mode: i % 2 === 0 ? "online" : "offline",
    priceType: "paid",
  })),
];

export function EventsPage() {
  const [filters, setFilters] = useState({
    status: "all",
    location: "all",
    price: "all",
    mode: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchStatus =
        filters.status === "all" ? true : event.status === filters.status;
      const matchLocation =
        filters.location === "all" ? true : event.location === filters.location;
      const matchPrice =
        filters.price === "all" ? true : event.priceType === filters.price;
      const matchMode =
        filters.mode === "all" ? true : event.mode === filters.mode;

      return matchStatus && matchLocation && matchPrice && matchMode;
    });
  }, [filters]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#101010] text-black dark:text-gray-100 transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">
          Events
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Event Status */}
          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-full border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
              <SelectValue placeholder="Event Status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border-gray-200 dark:border-gray-700">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="past">Past</SelectItem>
            </SelectContent>
          </Select>

          {/* Location */}
          <Select
            value={filters.location}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, location: value }))
            }
          >
            <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-full border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border-gray-200 dark:border-gray-700">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="california">California</SelectItem>
              <SelectItem value="new-york">New York</SelectItem>
              <SelectItem value="texas">Texas</SelectItem>
            </SelectContent>
          </Select>

          {/* Price */}
          <Select
            value={filters.price}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, price: value }))
            }
          >
            <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-full border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border-gray-200 dark:border-gray-700">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          {/* Mode */}
          <Select
            value={filters.mode}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, mode: value }))
            }
          >
            <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-full border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border-gray-200 dark:border-gray-700">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {currentEvents.length > 0 ? (
            currentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 col-span-full py-10">
              No events found for the selected filters.
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-4">
          <Button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`w-24 h-10 text-sm sm:text-base rounded-md transition-colors ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-[#0066FF] hover:bg-[#0052CC] text-white"
            }`}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              variant={currentPage === index + 1 ? "default" : "ghost"}
              size="icon"
              className={`w-10 h-10 rounded-md transition-colors ${
                currentPage === index + 1
                  ? "bg-[#0066FF] text-white hover:bg-[#0052CC]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {index + 1}
            </Button>
          ))}

          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`w-24 h-10 text-sm sm:text-base rounded-md transition-colors ${
              currentPage === totalPages
                ? "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-[#0066FF] hover:bg-[#0052CC] text-white"
            }`}
          >
            Next
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
