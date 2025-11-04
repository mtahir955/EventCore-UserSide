"use client";
import EventCard from "../components/eventcard/event-card";

export default function EventsGrid({
  activeTab,
  selectedRange,
}: {
  activeTab: "upcoming" | "previous";
  selectedRange?: { checkIn: number | null; checkOut: number | null };
}) {
  const allEvents = [
    { id: 1, date: 4, purchased: true, cta: "View Ticket" },
    { id: 2, date: 6, purchased: false, cta: "Join Event" },
    { id: 3, date: 10, purchased: true, cta: "View Ticket" },
    { id: 4, date: 14, purchased: false, cta: "Join Event" },
    { id: 5, date: 18, purchased: false, cta: "Join Event" },
    { id: 6, date: 22, purchased: false, cta: "Join Event" },
    { id: 7, date: 25, purchased: false, cta: "Join Event" },
  ];

  const filteredEvents =
    selectedRange?.checkIn && selectedRange?.checkOut
      ? allEvents.filter(
          (e) =>
            e.date >= selectedRange.checkIn! &&
            e.date <= selectedRange.checkOut!
        )
      : allEvents;

  return (
    <section className="mx-auto mt-6 sm:mt-8">
      <section className="mx-auto mt-6 mb-6 sm:mt-10 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
        {" "}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          All Events
        </h1>
        {/* <p className="mt-2 text-sm sm:text-base text-foreground/70 px-2">
          Keep track of all your upcoming events in one place — never miss a
          moment.
        </p> */}
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              purchased={event.purchased}
              cta={event.cta}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            No events in selected range.
          </p>
        )}
      </div>
    </section>
  );
}

// "use client";
// import EventCard from "../components/eventcard/event-card";

// export default function EventsGrid({ activeTab }: { activeTab: "upcoming" | "previous" }) {
//   // Dummy data for Upcoming Events
//   const upcomingEvents = [
//     { id: 1, purchased: true, cta: "View Ticket" },
//     { id: 2, purchased: false, cta: "Join Event" },
//     { id: 3, purchased: true, cta: "View Ticket" },
//     { id: 4, purchased: false, cta: "Join Event" },
//   ];

//   // Dummy data for Previous Events
//   const previousEvents = [
//     { id: 1, purchased: false, cta: "Event Ended" },
//     { id: 2, purchased: false, cta: "Event Ended" },
//     { id: 3, purchased: false, cta: "Event Ended" },
//     { id: 4, purchased: false, cta: "Event Ended" },
//   ];

//   const eventsToShow = activeTab === "upcoming" ? upcomingEvents : previousEvents;

//   return (
//     <section className="mx-auto mt-6 sm:mt-8">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//         {eventsToShow.map((event) => (
//           <EventCard
//             key={event.id}
//             purchased={event.purchased}
//             cta={event.cta}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }
