// import EventCard from "../components/eventcard/event-card";

// export default function EventsGrid() {
//   return (
//     <section className="mx-auto mt-6 sm:mt-8">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//         <EventCard purchased cta="View Ticket" />
//         <EventCard cta="Join Event" />
//         <EventCard purchased cta="View Ticket" />
//         <EventCard cta="View Ticket" />
//       </div>
//     </section>
//   );
// }

"use client";
import EventCard from "../components/eventcard/event-card";

export default function EventsGrid({ activeTab }: { activeTab: "upcoming" | "previous" }) {
  // Dummy data for Upcoming Events
  const upcomingEvents = [
    { id: 1, purchased: true, cta: "View Ticket" },
    { id: 2, purchased: false, cta: "Join Event" },
    { id: 3, purchased: true, cta: "View Ticket" },
    { id: 4, purchased: false, cta: "Join Event" },
  ];

  // Dummy data for Previous Events
  const previousEvents = [
    { id: 1, purchased: false, cta: "Event Ended" },
    { id: 2, purchased: false, cta: "Event Ended" },
    { id: 3, purchased: false, cta: "Event Ended" },
    { id: 4, purchased: false, cta: "Event Ended" },
  ];

  const eventsToShow = activeTab === "upcoming" ? upcomingEvents : previousEvents;

  return (
    <section className="mx-auto mt-6 sm:mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {eventsToShow.map((event) => (
          <EventCard
            key={event.id}
            purchased={event.purchased}
            cta={event.cta}
          />
        ))}
      </div>
    </section>
  );
}

