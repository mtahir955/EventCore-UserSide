"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../host-dashboard/components/sidebar";
import { MyEventsCard } from "../host-dashboard/components/my-events-card";
import Link from "next/link";
import { Menu, X, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import LogoutModalHost from "@/components/modals/LogoutModalHost";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";
import toast from "react-hot-toast";

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

// const dummyEvents: Props[] = [
//   {
//     imageSrc: "/images/event-1.png",
//     price: "1500",
//     hostby: "Ali Khan",
//     title: "Lahore Music Fest 2025",
//     description:
//       "Join us for an unforgettable night of music, food, and lights in Lahore.",
//     location: "Lahore Expo Center",
//     date: "2025-11-12",
//     audience: 5000,
//     time: "19:00",
//   },
//   {
//     imageSrc: "/images/event-2.png",
//     price: "0",
//     hostby: "ITU CS Department",
//     title: "Tech Conference Pakistan",
//     description:
//       "A gathering of tech enthusiasts discussing AI, Blockchain, and Web3.",
//     location: "Islamabad Convention Hall",
//     date: "2025-11-25",
//     audience: 1200,
//     time: "10:00",
//   },
//   {
//     imageSrc: "/images/event-1.png",
//     price: "1000",
//     hostby: "Startup Lahore",
//     title: "Startup Meetup 2025",
//     description:
//       "Connect with founders, investors, and innovators across Pakistan.",
//     location: "Lahore Innovation Hub",
//     date: "2025-12-18",
//     audience: 800,
//     time: "15:00",
//   },
//   {
//     imageSrc: "/images/event-2.png",
//     price: "500",
//     hostby: "Foodies United",
//     title: "Karachi Food Festival",
//     description:
//       "Experience cuisines from across Pakistan with live cooking stations.",
//     location: "Karachi Beach Arena",
//     date: "2025-12-05",
//     audience: 3000,
//     time: "12:00",
//   },
//   {
//     imageSrc: "/images/event-1.png",
//     price: "0",
//     hostby: "Art Council",
//     title: "Art Exhibition 2025",
//     description: "Showcasing creative art pieces from young Pakistani artists.",
//     location: "Multan Art Gallery",
//     date: "2026-01-10",
//     audience: 600,
//     time: "11:00",
//   },
//   {
//     imageSrc: "/images/event-2.png",
//     price: "2000",
//     hostby: "Pakistan Sports Board",
//     title: "National Sports Gala",
//     description: "A nationwide competition featuring top athletes and teams.",
//     location: "Faisalabad Sports Complex",
//     date: "2026-02-20",
//     audience: 7000,
//     time: "09:00",
//   },
//   {
//     imageSrc: "/images/event-2.png",
//     price: "2000",
//     hostby: "Pakistan Sports Board",
//     title: "National Sports Gala",
//     description: "A nationwide competition featuring top athletes and teams.",
//     location: "Faisalabad Sports Complex",
//     date: "2026-02-20",
//     audience: 7000,
//     time: "09:00",
//   },
//   {
//     imageSrc: "/images/event-2.png",
//     price: "2000",
//     hostby: "Pakistan Sports Board",
//     title: "National Sports Gala",
//     description: "A nationwide competition featuring top athletes and teams.",
//     location: "Faisalabad Sports Complex",
//     date: "2026-02-20",
//     audience: 7000,
//     time: "09:00",
//   },
// ];

export default function MyEventsPage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minTicket, setMinTicket] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Props[]>([]);
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
    let results = events.filter((event) => {
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
    setCurrentPage(1); // ⭐ Reset pagination
  };

  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setMinTicket("");
    setDate("");
    setTime("");
    setFilteredEvents(events);
    setCurrentPage(1); // ⭐ Reset pagination
  };

  const { resolvedTheme, theme, setTheme } = useTheme();
  const [hostName, setHostName] = useState("Host");

  useEffect(() => {
    const savedUser = localStorage.getItem("hostUser");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      // Host Name
      setHostName(user.userName || user.fullName || "Host");

      // Subdomain (optional)
      // setHostSubdomain(user.subDomain || "");

      console.log("HOST DASHBOARD USER:", user);
      console.log("HOST SUBDOMAIN:", user?.subDomain);

      // Theme (optional)
      if (user.theme) {
        // syncThemeWithBackend(user);
      }
    } else {
      // Force redirect if no host session found
      window.location.href = "/sign-in-host";
    }
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;

  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredEvents, totalPages]);

  const [events, setEvents] = useState<Props[]>([]);

  const fetchEvents = async () => {
    try {
      let rawToken =
        localStorage.getItem("hostToken") ||
        localStorage.getItem("hostUser") ||
        localStorage.getItem("token");

      let token = null;

      // Universal token cleaner
      try {
        const parsed = JSON.parse(rawToken || "{}");
        token = parsed?.token || parsed;
      } catch {
        token = rawToken;
      }

      if (!token) {
        toast.error("Missing authentication token");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/events`, {
        headers: {
          "X-Tenant-ID": HOST_Tenant_ID,
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("EVENTS FROM BACKEND:", response.data);

      // REPLACE your mapped events array with this:
      const mapped = response.data?.data?.map((ev: any) => ({
        id: ev.id, // ⭐ IMPORTANT
        imageSrc: ev.bannerImage || "/images/event-1.png",
        price: ev.tickets?.[0]?.price || "0",
        hostby: ev.hostName || "Unknown",
        title: ev.eventTitle,
        description: ev.eventDescription,
        location: ev.eventLocation,
        date: ev.startDate,
        time: ev.startTime,
        audience: ev.audienceCount || 0,
      }));

      setEvents(mapped || []);
      setFilteredEvents(mapped || []);
    } catch (err) {
      console.log("Failed to fetch events:", err);
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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

              {/* Profile Name + Icon + Dropdown */}
              <div
                className="relative flex items-center gap-2"
                ref={profileRef}
              >
                {/* Host Name */}
                <span className="hidden sm:block font-semibold text-black dark:text-white">
                  {hostName}
                </span>

                {/* Profile Icon Wrapper */}
                <div className="relative">
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

                  {/* Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl z-50 py-2">
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

                      <Link href="/host-settings">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          System Settings
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
          {currentEvents.length > 0 ? (
            currentEvents.map((event, index) => (
              <MyEventsCard
                key={index}
                id={event.id} // ⭐ ADDED ID
                imageSrc={event.imageSrc}
                price={event.price}
                isEditEvent={true}
                title={event.title}
                description={event.description}
                location={event.location}
                date={event.date}
                time={event.time}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 mt-8">
              No events found.
            </p>
          )}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4 mb-6">
            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === i + 1
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "dark:border-gray-700 dark:bg-[#181818]"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Logout Modal */}
      <LogoutModalHost
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/sign-in-host";
        }}
      />
    </div>
  );
}
