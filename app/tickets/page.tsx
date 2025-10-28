import { Header } from "../../components/header";
import { TicketCard } from "../tickets/components/ticket-card";
import { EventCard } from "../tickets/components/event-card";
import { Footer } from "../../components/footer";

export default function Page() {
  return (
    <main className="bg-background text-foreground dark:bg-[#101010] dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Container */}
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 min-h-[1065px]">
        {/* Page heading */}
        <section className="px-4 sm:px-6 mt-6 text-center">
          <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-gray-900 dark:text-white">
            Tickets
          </h1>
          <p className="mt-2 text-[14px] sm:text-[15px] md:text-[16px] text-muted-foreground dark:text-gray-400">
            All your event memories start here — see your tickets, times, and
            details at a glance.
          </p>
        </section>

        {/* Tickets grid */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <TicketCard
            date={{
              day: "03",
              month: "June",
              weekday: "SUN",
              time: "08:00 PM",
            }}
            title="Starry Nights Music Fest"
            host="Eric Grzybowski"
            location="California"
            type="1 General Ticket"
            price="$205.35"
            highlight
          />
          <TicketCard
            date={{
              day: "03",
              month: "June",
              weekday: "SUN",
              time: "08:00 PM",
            }}
            title="Starry Nights Music Fest"
            host="Eric Grzybowski"
            location="California"
            type="1 General Ticket"
            price="$205.35"
            highlight
          />
          <TicketCard
            date={{
              day: "03",
              month: "June",
              weekday: "SUN",
              time: "08:00 PM",
            }}
            title="Starry Nights Music Fest"
            host="Eric Grzybowski"
            location="California"
            type="1 General Ticket"
            price="$205.35"
          />
          <TicketCard
            date={{
              day: "03",
              month: "June",
              weekday: "SUN",
              time: "08:00 PM",
            }}
            title="Starry Nights Music Fest"
            host="Eric Grzybowski"
            location="California"
            type="1 General Ticket"
            price="$205.35"
            ended
          />
        </section>

        {/* Explore more */}
        <section className="mt-12 px-2 sm:px-4 md:px-6">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold mb-6 text-center md:text-left text-gray-900 dark:text-white">
            Explore More Events
          </h2>

          {/* Event Cards (stacked on mobile, 2 columns on desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <EventCard
              image="/images/event-1.png"
              title="Starry Nights Music Fest"
              subtitle="A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze."
              price="$99.99"
            />
            <EventCard
              image="/images/event-2.png"
              title="Starry Nights Music Fest"
              subtitle="A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze."
              price="$99.99"
            />
          </div>

          {/* Carousel arrows */}
          <div className="relative mt-6 flex items-center justify-center md:justify-between px-2">
            <button
              aria-label="Previous"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-border dark:border-gray-700 bg-white dark:bg-[#181818] text-lg text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-border dark:border-gray-700 bg-white dark:bg-[#181818] text-lg text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              ›
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
