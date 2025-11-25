"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EventCard from "../components/eventcard/event-card";

export default function EventsGrid({
  activeTab,
  selectedRange,
}: {
  activeTab: "upcoming" | "previous";
  selectedRange?: { checkIn: number | null; checkOut: number | null };
}) {
  const router = useRouter();

  // 🔹 Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  // ✔ Full event list
  const allEvents = [
    {
      id: 1,
      title: "Starry Nights Music Fest",
      type: "in-person" as const,
      date: 4,
      location: "California",
      description:
        "A magical evening under the stars with live bands and food stalls.",
      audience: 150,
      time: "08:00 PM - 09:00 PM",
      purchased: true,
      cta: "View Ticket",
    },
    {
      id: 2,
      title: "Food Carnival",
      type: "virtual" as const,
      date: 6,
      location: "Miami",
      description:
        "Taste dishes from all around the world at this fun food fest.",
      audience: 300,
      time: "12:00 PM - 05:00 PM",
      purchased: false,
      cta: "Join Event",
    },
    {
      id: 3,
      title: "Tech Expo",
      type: "in-person" as const,
      date: 10,
      location: "Austin",
      description: "Discover the latest innovations in technology and AI.",
      audience: 500,
      time: "09:00 AM - 06:00 PM",
      purchased: true,
      cta: "View Ticket",
    },
    {
      id: 4,
      title: "Wellness Retreat",
      type: "virtual" as const,
      date: 14,
      location: "Denver",
      description: "Join mindfulness and yoga sessions from home.",
      audience: 120,
      time: "07:00 AM - 11:00 AM",
      purchased: false,
      cta: "Join Event",
    },
    {
      id: 5,
      title: "AI Conference",
      type: "virtual" as const,
      date: 18,
      location: "San Francisco",
      description: "Experts discuss the future of artificial intelligence.",
      audience: 1000,
      time: "10:00 AM - 04:00 PM",
      purchased: false,
      cta: "Join Event",
    },
    {
      id: 6,
      title: "Fashion Week",
      type: "in-person" as const,
      date: 22,
      location: "Paris",
      description: "Witness global designers showcase the latest trends.",
      audience: 400,
      time: "06:00 PM - 10:00 PM",
      purchased: false,
      cta: "Join Event",
    },
    {
      id: 7,
      title: "Charity Gala",
      type: "virtual" as const,
      date: 25,
      location: "London",
      description: "An inspiring event raising funds for education.",
      audience: 200,
      time: "08:00 PM - 11:00 PM",
      purchased: false,
      cta: "Join Event",
    },
  ];

  // 🔹 Apply date filter if selected
  const filteredEvents =
    selectedRange?.checkIn && selectedRange?.checkOut
      ? allEvents.filter(
          (e) =>
            e.date >= selectedRange.checkIn! &&
            e.date <= selectedRange.checkOut!
        )
      : allEvents;

  // 🔹 Pagination calculations
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // 🔹 CTA Button Logic
  const handleCTAClick = (event: { id: number; cta: string }) => {
    if (event.cta === "Join Event") {
      router.push(`/checkout?eventId=${event.id}`);
    } else if (event.cta === "View Ticket") {
      router.push(`/my-tickets/${event.id}`);
    }
  };

  return (
    <section className="mx-auto mt-6 sm:mt-8">
      {/* Divider */}
      <section className="mx-auto mt-6 mb-6 sm:mt-10 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          All Events
        </h1>
      </section>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {currentEvents.length > 0 ? (
          currentEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              cta={event.cta}
              purchased={event.purchased}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            No events in selected range.
          </p>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {/* Prev */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-40"
          >
            Prev
          </button>

          {/* Page numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded-md ${
                currentPage === i + 1
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
