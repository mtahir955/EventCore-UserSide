"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../host-dashboard/components/sidebar";
import { MyEventsCard } from "../host-dashboard/components/my-events-card";
import Link from "next/link";
import { Menu, X, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

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
    date: "2025-11-12",
    audience: 5000,
    time: "19:00",
  },
  {
    imageSrc: "/images/event-2.png",
    price: "0",
    hostby: "ITU CS Department",
    title: "Tech Conference Pakistan",
    description:
      "A gathering of tech enthusiasts discussing AI, Blockchain, and Web3.",
    location: "Islamabad Convention Hall",
    date: "2025-11-25",
    audience: 1200,
    time: "10:00",
  },
  {
    imageSrc: "/images/event-1.png",
    price: "1000",
    hostby: "Startup Lahore",
    title: "Startup Meetup 2025",
    description:
      "Connect with founders, investors, and innovators across Pakistan.",
    location: "Lahore Innovation Hub",
    date: "2025-12-18",
    audience: 800,
    time: "15:00",
  },
  {
    imageSrc: "/images/event-2.png",
    price: "500",
    hostby: "Foodies United",
    title: "Karachi Food Festival",
    description:
      "Experience cuisines from across Pakistan with live cooking stations.",
    location: "Karachi Beach Arena",
    date: "2025-12-05",
    audience: 3000,
    time: "12:00",
  },
  {
    imageSrc: "/images/event-1.png",
    price: "0",
    hostby: "Art Council",
    title: "Art Exhibition 2025",
    description: "Showcasing creative art pieces from young Pakistani artists.",
    location: "Multan Art Gallery",
    date: "2026-01-10",
    audience: 600,
    time: "11:00",
  },
  {
    imageSrc: "/images/event-2.png",
    price: "2000",
    hostby: "Pakistan Sports Board",
    title: "National Sports Gala",
    description: "A nationwide competition featuring top athletes and teams.",
    location: "Faisalabad Sports Complex",
    date: "2026-02-20",
    audience: 7000,
    time: "09:00",
  },
];

export default function MyEventsPage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minTicket, setMinTicket] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(dummyEvents);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dropdowns
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Dummy notifications
  const notifications = [
    { id: 1, message: "Your event 'Tech Summit' was approved!" },
    { id: 2, message: "You sold 3 tickets for 'Lahore Music Fest'." },
    { id: 3, message: "New user message received." },
  ];

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilter = () => {
    let results = dummyEvents.filter((event) => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesLocation =
        !location ||
        event.location.toLowerCase().includes(location.toLowerCase());
      const matchesTicket =
        !minTicket || parseFloat(event.price) >= parseFloat(minTicket);
      const matchesDate = !date || event.date >= date;
      const matchesTime = !time || event.time >= time;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesTicket &&
        matchesDate &&
        matchesTime
      );
    });

    setFilteredEvents(results);
  };

  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setMinTicket("");
    setDate("");
    setTime("");
    setFilteredEvents(dummyEvents);
  };

  const { resolvedTheme, theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-[#FAFAFB] relative">
      {/* Sidebar */}
      <Sidebar
        active="My Events"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} className="text-black" />
          </button>
          <h3 className="text-lg font-semibold text-black">Events</h3>
        </div>

        <div className="flex items-center gap-3">
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
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-[256px] pt-20 md:pt-0 overflow-auto dark:bg-[#101010]">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 pt-8 pb-4">
          <h1 className="text-[32px] font-semibold tracking-[-0.02em]">
            Events
          </h1>
          {/* Right section */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4 relative">
              {/* Light/Dark toggle */}
              <Button
                onClick={() =>
                  setTheme(resolvedTheme === "light" ? "dark" : "light")
                }
                variant="ghost"
                size="sm"
                className="hidden lg:flex text-gray-600 dark:text-gray-300 gap-2 hover:text-[#0077F7]"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="h-4 w-4" /> Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" /> Light Mode
                  </>
                )}
              </Button>

              {/* Mobile toggle */}
              <button
                onClick={() =>
                  setTheme(resolvedTheme === "light" ? "dark" : "light")
                }
                className="lg:hidden p-1 text-gray-700 dark:text-gray-300 hover:text-[#0077F7] flex-shrink-0"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
              {/* Notification icon */}
              <div ref={notificationsRef} className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileDropdown(false);
                  }}
                  className="bg-black dark:bg-black border h-9 w-9 flex justify-center items-center rounded-full relative hover:opacity-90"
                >
                  <img
                    src="/icons/Vector.png"
                    alt="notification"
                    className="h-4 w-4"
                  />
                  {/* Counter badge */}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </button>

                {/* Notification popup */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 rounded-xl z-50 p-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
                      Notifications
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className="text-sm bg-gray-50 dark:bg-[#1f1e1e] rounded-lg p-2 hover:bg-gray-100 transition"
                          >
                            {n.message}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No new notifications
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile icon + dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => {
                    setShowProfileDropdown(!showProfileDropdown);
                    setShowNotifications(false);
                  }}
                  className="bg-black border h-9 w-9 flex justify-center items-center rounded-full hover:opacity-90"
                >
                  <img
                    src="/images/icons/profile-user.png"
                    alt="profile"
                    className="h-4 w-4"
                  />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 rounded-xl z-50 py-2">
                    <Link href="/my-events">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                        My Events
                      </button>
                    </Link>
                    <Link href="/payment-setup">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                        Payment Setup
                      </button>
                    </Link>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Filters Section */}
        <div className="px-4 md:px-8 mt-4">
          {/* Create + Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:w-[820px] rounded-xl border px-4 h-12 flex items-center gap-2 bg-white dark:bg-[#101010]">
                <img
                  src="/images/icons/search-icon.png"
                  alt="search"
                  className="h-5 w-5"
                />
                <input
                  type="text"
                  placeholder="Search Name Or ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent outline-none text-[14px]"
                />
              </div>
              <button
                onClick={handleFilter}
                className="h-11 px-6 rounded-xl text-[14px] font-semibold bg-[#D19537] text-white"
              >
                Search
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/my-events/create">
                <button className="h-11 rounded-xl px-6 font-semibold flex items-center justify-center gap-2 bg-[#D19537] text-white text-[14px] w-full sm:w-auto">
                  Create
                  <img
                    src="/images/icons/plus-icon.png"
                    alt="plus"
                    className="h-4 w-4"
                  />
                </button>
              </Link>
              <div className="w-10 h-10 flex justify-center items-center border rounded-full bg-[#d19537]">
                <img
                  src="/images/icons/settings-icon.png"
                  alt="settings"
                  className="h-4 w-4"
                />
              </div>
            </div>
          </div>

          {/* Filter Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <input
              type="text"
              placeholder="Nearest Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-11 rounded-full border px-5 text-[14px] font-medium bg-white dark:bg-[#101010] outline-none placeholder:text-gray-500"
            />
            <input
              type="number"
              placeholder="Min. Ticket"
              value={minTicket}
              onChange={(e) => setMinTicket(e.target.value)}
              className="h-11 rounded-full border px-5 text-[14px] font-medium bg-white dark:bg-[#101010] outline-none placeholder:text-gray-500"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 rounded-full border px-5 text-[14px] font-medium bg-white dark:bg-[#101010] outline-none text-gray-700"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-11 rounded-full border px-5 text-[14px] font-medium bg-white dark:bg-[#101010] outline-none text-gray-700"
            />
          </div>

          {/* Reset Button */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={resetFilters}
              className="h-11 px-6 rounded-xl text-[14px] font-semibold border bg-white text-gray-800"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="px-4 md:px-8 mt-6 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <MyEventsCard
                key={index}
                imageSrc={event.imageSrc}
                price={event.price}
                isEditEvent={true}
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
            <p className="col-span-full text-center text-gray-500 mt-8">
              No events found.
            </p>
          )}
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div
            className="relative flex w-[90%] flex-col items-center justify-center bg-white dark:bg-[#101010] p-8 shadow-xl sm:w-[500px]"
            style={{ height: "auto", borderRadius: "16px" }}
          >
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
            >
              <X className="size-4" />
            </button>
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-gray-300">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#D19537]">
                <LogOut className="size-6 text-white" />
              </div>
            </div>
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
              Are you sure you want to log out?
            </h2>
            <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
              {"You'll be signed out from your account."}
            </p>
            <div className="flex w-full flex-col gap-4 sm:flex-row">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="h-14 w-full bg-gray-100 font-medium text-[#D19537] transition-colors hover:bg-gray-200 sm:w-[212px]"
                style={{ borderRadius: "50px" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Logging out...");
                  setShowLogoutModal(false);
                }}
                className="h-14 w-full bg-[#D19537] font-medium text-white transition-colors hover:bg-[#e99714] sm:w-[212px]"
                style={{ borderRadius: "50px" }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
