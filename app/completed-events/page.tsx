"use client";

import { useState } from "react";
import { Sidebar } from "../host-dashboard/components/sidebar";
import { MyEventsCard } from "../host-dashboard/components/my-events-card";
import { Menu } from "lucide-react"; // for hamburger icon

type Props = {
  imageSrc: string;
  price: string;
  hostby: string;
  title: string;
  description: string;
  location: string;
  date: string;
  audience: number;
  time: string;
};

const dummyEvents: Props[] = [
  {
    imageSrc: "/images/event-1.png",
    price: "1500",
    hostby: "Ali Khan",
    title: "Lahore Music Fest 2025",
    description:
      "Join us for an unforgettable night of music, food, and lights in Lahore.",
    location: "Lahore Expo Center",
    date: "12/11/2025",
    audience: 5000,
    time: "7:00 PM - 11:00 PM",
  },
  {
    imageSrc: "/images/event-2.png",
    price: "0",
    hostby: "ITU CS Department",
    title: "Tech Conference Pakistan",
    description:
      "A gathering of tech enthusiasts discussing AI, Blockchain, and Web3.",
    location: "Islamabad Convention Hall",
    date: "25/11/2025",
    audience: 1200,
    time: "10:00 AM - 5:00 PM",
  },
  {
    imageSrc: "/images/event-1.png",
    price: "1000",
    hostby: "Startup Lahore",
    title: "Startup Meetup 2025",
    description:
      "Connect with founders, investors, and innovators across Pakistan.",
    location: "Lahore Innovation Hub",
    date: "18/12/2025",
    audience: 800,
    time: "3:00 PM - 9:00 PM",
  },
  {
    imageSrc: "/images/event-2.png",
    price: "500",
    hostby: "Foodies United",
    title: "Karachi Food Festival",
    description:
      "Experience cuisines from across Pakistan with live cooking stations.",
    location: "Karachi Beach Arena",
    date: "05/12/2025",
    audience: 3000,
    time: "12:00 PM - 10:00 PM",
  },
  {
    imageSrc: "/images/event-1.png",
    price: "0",
    hostby: "Art Council",
    title: "Art Exhibition 2025",
    description: "Showcasing creative art pieces from young Pakistani artists.",
    location: "Multan Art Gallery",
    date: "10/01/2026",
    audience: 600,
    time: "11:00 AM - 6:00 PM",
  },
  {
    imageSrc: "/images/event-2.png",
    price: "2000",
    hostby: "Pakistan Sports Board",
    title: "National Sports Gala",
    description: "A nationwide competition featuring top athletes and teams.",
    location: "Faisalabad Sports Complex",
    date: "20/02/2026",
    audience: 7000,
    time: "9:00 AM - 8:00 PM",
  },
];

export default function CompletedEventsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(dummyEvents);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

  const handleSearch = () => {
    const query = searchInput.trim().toLowerCase();

    if (query === "") {
      setFilteredEvents(dummyEvents);
      return;
    }

    const filtered = dummyEvents.filter((event) =>
      event.title.toLowerCase().includes(query)
    );

    setFilteredEvents(filtered);
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFB]">
      {/* Sidebar */}
      <Sidebar
        active="Completed Events"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 mt-20 sm:mt-0 overflow-auto">
        {/* Header */}
        <header className="hidden md:flex items-center justify-between px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 bg-[#FAFAFB]">
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu className="w-6 h-6 text-gray-800" />
            </button>

            <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold tracking-[-0.02em]">
              Completed Events
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-white border h-9 w-9 flex justify-center items-center rounded-full">
              <img
                src="/images/icons/notification-new.png"
                alt="notification"
                className="h-4 w-4"
              />
            </div>
            <div className="bg-black border h-9 w-9 flex justify-center items-center rounded-full">
              <img
                src="/images/icons/profile-user.png"
                alt="profile"
                className="h-4 w-4"
              />
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="px-4 sm:px-6 md:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div
              className="flex-1 rounded-xl border px-4 h-12 flex gap-3 items-center text-[14px] bg-white"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <img
                src="/images/icons/search-icon.png"
                alt=""
                className="h-5 w-5"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput(value);
                  if (value === "") {
                    setFilteredEvents(dummyEvents);
                  }
                }}
                placeholder="Search Name Or ID"
                className="flex-1 outline-none py-3 bg-transparent placeholder:opacity-60"
                aria-label="Search Name Or ID"
              />
            </div>

            <button
              onClick={handleSearch}
              className="h-11 rounded-xl px-6 text-[14px] font-semibold flex items-center justify-center"
              style={{
                background: "var(--brand, #D19537)",
                color: "var(--brand-on, #FFFFFF)",
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="px-4 sm:px-6 md:px-8 mt-6 pb-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <MyEventsCard
                key={index}
                imageSrc={event.imageSrc}
                price={event.price}
                isEditEvent={false}
                hostby={event.hostby}
                title={event.title}
                description={event.description}
                location={event.location}
                date={event.date}
                audience={event.audience}
                time={event.time}
              />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500 mt-10">
              No events found.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
