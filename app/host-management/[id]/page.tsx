"use client";

import { Sidebar } from "../../admin/components/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MyEventsCard } from "../../admin/components/my-events-card";
import Link from "next/link";
import { Bell, User } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  host: string;
  location: string;
  date: string;
  audience: string;
  time: string;
}

const events: Event[] = [
  {
    id: "1",
    title: "Starry Nights Music Fest",
    description:
      "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
    image: "/purple-lit-event-venue-with-tables.jpg",
    price: "$99.99",
    host: "Eric Gryzibowski",
    location: "California",
    date: "13 June 2025",
    audience: "150 Audience",
    time: "08:00 PM - 09:00 PM",
  },
  {
    id: "2",
    title: "Starry Nights Music Fest",
    description:
      "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
    image: "/red-stage-lights-concert.jpg",
    price: "$99.99",
    host: "Eric Gryzibowski",
    location: "California",
    date: "13 June 2025",
    audience: "150 Audience",
    time: "08:00 PM - 09:00 PM",
  },
  {
    id: "3",
    title: "Starry Nights Music Fest",
    description:
      "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
    image: "/purple-lit-event-venue-with-tables.jpg",
    price: "$99.99",
    host: "Eric Gryzibowski",
    location: "California",
    date: "13 June 2025",
    audience: "150 Audience",
    time: "08:00 PM - 09:00 PM",
  },
  {
    id: "4",
    title: "Starry Nights Music Fest",
    description:
      "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
    image: "/blue-silhouette-speaker-audience.jpg",
    price: "$99.99",
    host: "Eric Gryzibowski",
    location: "California",
    date: "13 June 2025",
    audience: "150 Audience",
    time: "08:00 PM - 09:00 PM",
  },
];

export default function HostDetailsPage() {
  const router = useRouter();
  const [isHostRequestModalOpen, setIsHostRequestModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar (responsive behavior handled inside component) */}
      <Sidebar activePage="Host Management" />

      <main className="flex-1 overflow-auto lg:ml-[250px]">
        {/* ===== Desktop Header ===== */}
        <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
          <h1 className="text-3xl font-semibold text-foreground">
            Host Management
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/push-notification">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
                <Bell className="h-6 w-6 text-gray-600" />
              </button>
            </Link>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              <User className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Spacer for mobile navbar */}
        <div className="lg:hidden h-[56px]" />

        {/* ===== Content ===== */}
        <div className="p-4 sm:p-6 md:p-8 pt-2 max-w-[1440px] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="hover:opacity-70 transition-opacity hover:cursor-pointer mb-4"
          >
            <Image
              src="/icons/back-arrow.png"
              alt="Back"
              width={12}
              height={12}
            />
          </button>

          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-4">
              <Image
                src="/avatars/daniel-carter.png"
                alt="Daniel Carter"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
              Daniel Carter
            </h2>
          </div>

          {/* Basic Information */}
          <div className="bg-background rounded-lg p-4 sm:p-6 mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-6">
              Basic Information
            </h3>

            {/* Info grid responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6 sm:gap-x-12 lg:gap-x-40">
              {[
                ["Email", "info@gmail.com"],
                ["Phone Number", "+44 7412 558492"],
                ["No. of Events Conducted", "20"],
                ["Tickets Sold", "20012"],
                ["Payment Method", "MasterCard"],
                ["Profile Status", "Banned"],
                ["Gender", "Male"],
                ["Address", "1234 Sunset Blvd, Los Angeles, CA 90026"],
              ].map(([label, value], index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between"
                >
                  <p className="text-sm sm:text-md text-muted-foreground mb-1 sm:mb-0">
                    {label}
                  </p>
                  <p
                    className={`text-base text-foreground ${
                      label === "Profile Status"
                        ? "text-[#b71c1c] font-medium"
                        : ""
                    } text-right sm:text-left`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {events.map((event) => (
              <Link key={event.id} href={`/host-management-details`}>
                <MyEventsCard imageSrc={event.image} price={event.price} />
              </Link>
            ))}
          </div>

          {/* Go Back Button */}
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={() => router.back()}
              className="px-10 sm:px-16 py-3 bg-[#D19537] text-white rounded-full font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}