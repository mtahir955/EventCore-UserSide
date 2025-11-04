"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../host-dashboard/components/sidebar";
import { MyEventsCard } from "../host-dashboard/components/my-events-card";
import { Menu, X, LogOut, Moon, Sun } from "lucide-react"; // for hamburger icon
import Link from "next/link";
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const { resolvedTheme, theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-[#FAFAFB]">
      {/* Sidebar */}
      <Sidebar
        active="Completed Events"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 mt-20 sm:mt-0 overflow-auto dark:bg-[#101010]">
        {/* Header */}
        <header className="hidden md:flex items-center justify-between px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 bg-[#FAFAFB] dark:bg-[#101010]">
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

          {/* Right section */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4 relative">
              {/* Light/Dark toggle */}
              {/* <Button
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
              </Button> */}

              {/* Mobile toggle */}
              {/* <button
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
              </button> */}
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

        {/* Search and Filters */}
        <div className="px-4 sm:px-6 md:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div
              className="flex-1 rounded-xl border px-4 h-12 flex gap-3 items-center text-[14px] bg-white dark:bg-[#101010]"
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
