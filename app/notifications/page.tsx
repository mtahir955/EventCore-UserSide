"use client";

import { Header } from "../../components/header";
import { NotificationItem } from "../notifications/components/notification-item";
import { Footer } from "../../components/footer";

export default function Page() {
  const items = [
    {
      title: "Event Added Successfully",
      description:
        "You’ve added Starry Nights Music Fest to your calendar. Don’t miss it!",
      iconUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%283%29-K07IdrQjINxelE3l07eemdklNBnJts.png",
    },
    {
      title: "Ticket Confirmed",
      description:
        "Your ticket for Starry Nights Music is booked. Check your email for details.",
      iconUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%282%29-QVD30IfC2om2MxWbbkB2Z87s8FQeuJ.png",
    },
    {
      title: "Upcoming Event Reminder",
      description:
        "Starry Nights Music Fest has been canceled/postponed. Check the event page for updates.",
      iconUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%286%29-kIwlczJYVvac8iCdBbY9glk339j7u0.png",
    },
    {
      title: "Complete Your Purchase",
      description:
        "Your ticket for [Event Name] is waiting. Complete payment before it expires.",
      iconUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%284%29-vdNFR9oyztbi2NmXZITrtaWWC1ehdS.png",
    },
    {
      title: "Sold Out!",
      description:
        "Sorry, [Event Name] is now sold out. Check out similar events happening soon.",
      iconUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%285%29-A3mi2ahLSWY4LcbD3HISNSdxWRTMIL.png",
    },
    {
      title: "Event Added Successfully",
      description:
        "You’ve added Starry Nights Music Fest to your calendar. Don’t miss it!",
      iconUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%283%29-K07IdrQjINxelE3l07eemdklNBnJts.png",
    },
    {
      title: "Ticket Confirmed",
      description:
        "Your ticket for Starry Nights Music is booked. Check your email for details.",
      iconUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%282%29-QVD30IfC2om2MxWbbkB2Z87s8FQeuJ.png",
    },
    {
      title: "Complete Your Purchase",
      description:
        "Your ticket for [Event Name] is waiting. Complete payment before it expires.",
      iconUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%284%29-vdNFR9oyztbi2NmXZITrtaWWC1ehdS.png",
    },
    {
      title: "Upcoming Event Reminder",
      description:
        "Starry Nights Music Fest has been canceled/postponed. Check the event page for updates.",
      iconUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%286%29-kIwlczJYVvac8iCdBbY9glk339j7u0.png",
    },
    {
      title: "Event Added Successfully",
      description:
        "You’ve added Starry Nights Music Fest to your calendar. Don’t miss it!",
      iconUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%283%29-K07IdrQjINxelE3l07eemdklNBnJts.png",
    },
    {
      title: "Ticket Confirmed",
      description:
        "Your ticket for Starry Nights Music is booked. Check your email for details.",
      iconUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%282%29-QVD30IfC2om2MxWbbkB2Z87s8FQeuJ.png",
    },
    {
      title: "Sold Out!",
      description:
        "Sorry, [Event Name] is now sold out. Check out similar events happening soon.",
      iconUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%285%29-A3mi2ahLSWY4LcbD3HISNSdxWRTMIL.png",
    },
  ];

  return (
    <div className="notification-page flex flex-col min-h-screen bg-white dark:bg-[#101010] transition-colors duration-300">
      <Header />

      <main className="flex-grow bg-white dark:bg-[#101010] text-black dark:text-gray-100">
        {/* Title Section */}
        <section className="text-center px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <h1 className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold">
            Notifications
          </h1>
          <p className="mt-2 text-sm sm:text-base md:text-[16px] text-gray-700 dark:text-gray-400 max-w-[600px] mx-auto">
            Stay updated with event alerts, reminders, and important updates —
            all in one place.
          </p>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 mb-4 sm:mb-6" />

        {/* Notifications List */}
        <section
          aria-label="Notifications"
          className="space-y-2 sm:space-y-3 dark:text-white px-4 sm:px-6 lg:px-8"
        >
          {items.map((item, idx) => (
            <NotificationItem
              key={`${item.title}-${idx}`}
              title={item.title}
              description={item.description}
              iconUrl={item.iconUrl}
            />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
