"use client";

import { useState } from "react";
import { Header } from "../../../components/header";
import { EventCard } from "../components/event-card";
import { Footer } from "../../../components/footer";
import { Button } from "@/components/ui/button";

const events = [
  {
    id: 1,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
    host: "Eric Gryzbowski",
    title: "Starry Nights Music Fest",
    description:
      "A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze.",
    location: "California",
    date: "13 June 2025",
    audience: 150,
    time: "08:00 PM - 09:00 PM",
    price: "$99.99",
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 2,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
    host: "Eric Gryzbowski",
    title: `Music Event #${i + 2}`,
    description:
      "A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze.",
    location: "California",
    date: "13 June 2025",
    audience: 150,
    time: "08:00 PM - 09:00 PM",
    price: "$99.99",
  })),
];

export function EventsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

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

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Interested Events
        </h1>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2 mb-8">
          {currentEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <Button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`w-20 sm:w-24 h-9 sm:h-10 rounded-md transition-colors ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed"
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
              className={`w-8 sm:w-10 h-8 sm:h-10 rounded-md transition-all duration-200 ${
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
            className={`w-20 sm:w-24 h-9 sm:h-10 rounded-md transition-colors ${
              currentPage === totalPages
                ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed"
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
