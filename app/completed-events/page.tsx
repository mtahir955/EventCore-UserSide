"use client";

import { useEffect, useState, useRef } from "react";
import { Sidebar } from "../host-dashboard/components/sidebar";
import { MyCompEventsCard } from "../host-dashboard/components/my-comp-events-card";
import { Menu } from "lucide-react";
import LogoutModalHost from "@/components/modals/LogoutModalHost";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";
import Link from "next/link";

/* ✅ NORMALIZED UI TYPE */
type CompletedEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  imageSrc: string;
  price: string;
};

export default function CompletedEventsPage() {
  const [events, setEvents] = useState<CompletedEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CompletedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [hostName, setHostName] = useState("Host");

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

  /* 🔥 FETCH COMPLETED EVENTS */
  useEffect(() => {
    const fetchCompletedEvents = async () => {
      try {
        const token = localStorage.getItem("hostToken");

        const res = await fetch(`${API_BASE_URL}/events?completed=true`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();

        if (json?.success) {
          const mapped: CompletedEvent[] = (json.data || []).map((e: any) => ({
            id: e.id,
            title: e.eventTitle,
            description: e.eventDescription,
            location: e.eventLocation,
            date: e.startDate,
            time: e.startTime,
            // imageSrc: e.bannerImage || "/placeholder.svg",
            imageSrc: e.bannerImage
              ? `${API_BASE_URL}${e.bannerImage}`
              : "/placeholder.svg",

            price: "0",
          }));

          setEvents(mapped);
          setFilteredEvents(mapped);
        }
      } catch (err) {
        console.error("Failed to load completed events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedEvents();
  }, []);

  /* 🔎 SEARCH */
  const handleSearch = () => {
    const q = searchInput.trim().toLowerCase();

    if (!q) {
      setFilteredEvents(events);
      return;
    }

    setFilteredEvents(
      events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)
      )
    );
  };

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading completed events...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFB] dark:bg-[#101010]">
      <Sidebar
        active="Completed Events"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      <main className="flex-1 lg:ml-64 mt-20 sm:mt-0">
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
              {/* <div ref={notificationsRef} className="relative">
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
                  /> */}
              {/* Counter badge */}
              {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </button> */}

              {/* Notification popup */}
              {/* {showNotifications && (
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
              </div> */}

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

                      <Link href="/ticket-manager">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          Ticket Manager
                        </button>
                      </Link>

                      <Link href="/host-payments">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          Payments
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

        {/* Bottom Divider Line */}
        <div className="border-b border-gray-200 dark:border-gray-800"></div>

        {/* Search */}
        <div className="px-6 mt-4 flex gap-3">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or ID"
            className="flex-1 h-11 px-4 rounded-xl border"
          />
          <button
            onClick={handleSearch}
            className="h-11 px-6 rounded-xl bg-[#D19537] text-white font-semibold"
          >
            Search
          </button>
        </div>

        {/* Events Grid */}
        <div className="px-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentEvents.length > 0 ? (
            currentEvents.map((event) => (
              <MyCompEventsCard
                key={event.id}
                id={event.id}
                imageSrc={event.imageSrc}
                price={event.price}
                isEditEvent={false}
                title={event.title}
                description={event.description}
                location={event.location}
                date={event.date}
                time={event.time}
              />
            ))
          ) : (
            <p className="text-center col-span-full mt-10 text-gray-500">
              No completed events found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-md border ${
                  currentPage === i + 1 ? "bg-black text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>

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

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Sidebar } from "../host-dashboard/components/sidebar";
// import { MyCompEventsCard } from "../host-dashboard/components/my-comp-events-card";
// import { Menu, X, LogOut, Moon, Sun } from "lucide-react"; // for hamburger icon
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { useTheme } from "next-themes";
// import LogoutModalHost from "@/components/modals/LogoutModalHost";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// type EventApi = {
//   id: string;
//   title: string;
//   description: string;
//   location: string;
//   startDateTime: string;
//   price: string;
//   banner?: string;
// };

// type Props = {
//   imageSrc: string;
//   price: string;
//   hostby: string;
//   title: string;
//   description: string;
//   location: string;
//   date: string;
//   audience: number;
//   time: string;
// };

// const dummyEvents: Props[] = [
//   {
//     imageSrc: "/images/event-1.png",
//     price: "1500",
//     hostby: "Ali Khan",
//     title: "Lahore Music Fest 2025",
//     description:
//       "Join us for an unforgettable night of music, food, and lights in Lahore.",
//     location: "Lahore Expo Center",
//     date: "12/11/2025",
//     audience: 5000,
//     time: "7:00 PM - 11:00 PM",
//   },
//   {
//     imageSrc: "/images/event-2.png",
//     price: "0",
//     hostby: "ITU CS Department",
//     title: "Tech Conference Pakistan",
//     description:
//       "A gathering of tech enthusiasts discussing AI, Blockchain, and Web3.",
//     location: "Islamabad Convention Hall",
//     date: "25/11/2025",
//     audience: 1200,
//     time: "10:00 AM - 5:00 PM",
//   },
//   {
//     imageSrc: "/images/event-1.png",
//     price: "1000",
//     hostby: "Startup Lahore",
//     title: "Startup Meetup 2025",
//     description:
//       "Connect with founders, investors, and innovators across Pakistan.",
//     location: "Lahore Innovation Hub",
//     date: "18/12/2025",
//     audience: 800,
//     time: "3:00 PM - 9:00 PM",
//   },
//   {
//     imageSrc: "/images/event-2.png",
//     price: "500",
//     hostby: "Foodies United",
//     title: "Karachi Food Festival",
//     description:
//       "Experience cuisines from across Pakistan with live cooking stations.",
//     location: "Karachi Beach Arena",
//     date: "05/12/2025",
//     audience: 3000,
//     time: "12:00 PM - 10:00 PM",
//   },
//   {
//     imageSrc: "/images/event-1.png",
//     price: "0",
//     hostby: "Art Council",
//     title: "Art Exhibition 2025",
//     description: "Showcasing creative art pieces from young Pakistani artists.",
//     location: "Multan Art Gallery",
//     date: "10/01/2026",
//     audience: 600,
//     time: "11:00 AM - 6:00 PM",
//   },
//   {
//     imageSrc: "/images/event-2.png",
//     price: "2000",
//     hostby: "Pakistan Sports Board",
//     title: "National Sports Gala",
//     description: "A nationwide competition featuring top athletes and teams.",
//     location: "Faisalabad Sports Complex",
//     date: "20/02/2026",
//     audience: 7000,
//     time: "9:00 AM - 8:00 PM",
//   },
//   {
//     imageSrc: "/images/event-2.png",
//     price: "2000",
//     hostby: "Pakistan Sports Board",
//     title: "National Sports Gala",
//     description: "A nationwide competition featuring top athletes and teams.",
//     location: "Faisalabad Sports Complex",
//     date: "20/02/2026",
//     audience: 7000,
//     time: "9:00 AM - 8:00 PM",
//   },
//   {
//     imageSrc: "/images/event-2.png",
//     price: "2000",
//     hostby: "Pakistan Sports Board",
//     title: "National Sports Gala",
//     description: "A nationwide competition featuring top athletes and teams.",
//     location: "Faisalabad Sports Complex",
//     date: "20/02/2026",
//     audience: 7000,
//     time: "9:00 AM - 8:00 PM",
//   },
// ];

// export default function CompletedEventsPage() {

//     const [events, setEvents] = useState<EventApi[]>([]);
//   const [filteredEvents, setFilteredEvents] = useState<EventApi[]>([]);
//     const [loading, setLoading] = useState(true);

//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   const [searchInput, setSearchInput] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

//   const handleSearch = () => {
//     const query = searchInput.trim().toLowerCase();

//     if (query === "") {
//       setFilteredEvents(dummyEvents);
//       return;
//     }

//     const filtered = dummyEvents.filter((event) =>
//       event.title.toLowerCase().includes(query)
//     );

//     setFilteredEvents(filtered);
//   };

//   // Dropdowns
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);

//   const notificationsRef = useRef<HTMLDivElement>(null);
//   const profileRef = useRef<HTMLDivElement>(null);

//   // Dummy notifications
//   const notifications = [
//     { id: 1, message: "Your event 'Tech Summit' was approved!" },
//     { id: 2, message: "You sold 3 tickets for 'Lahore Music Fest'." },
//     { id: 3, message: "New user message received." },
//   ];

//   // Click outside handler
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         notificationsRef.current &&
//         !notificationsRef.current.contains(e.target as Node)
//       ) {
//         setShowNotifications(false);
//       }
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(e.target as Node)
//       ) {
//         setShowProfileDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const { resolvedTheme, theme, setTheme } = useTheme();
//   const [hostName, setHostName] = useState("Host");

//   useEffect(() => {
//     const savedUser = localStorage.getItem("hostUser");

//     if (savedUser) {
//       const user = JSON.parse(savedUser);

//       // Host Name
//       setHostName(user.userName || user.fullName || "Host");

//       console.log("HOST DASHBOARD USER:", user);
//       console.log("HOST SUBDOMAIN:", user?.subDomain);
//     } else {
//       // Force redirect if no host session found
//       window.location.href = "/sign-in-host";
//     }
//   }, []);

//   const [currentPage, setCurrentPage] = useState(1);
//   const eventsPerPage = 6;

//   const indexOfLast = currentPage * eventsPerPage;
//   const indexOfFirst = indexOfLast - eventsPerPage;

//   const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

//   return (
//     <div className="flex min-h-screen bg-[#FAFAFB]">
//       {/* Sidebar */}
//       <Sidebar
//         active="Completed Events"
//         isOpen={sidebarOpen}
//         onToggle={setSidebarOpen}
//       />

//       {/* Main Content */}
//       <main className="flex-1 lg:ml-64 mt-20 sm:mt-0 overflow-auto dark:bg-[#101010]">
//         {/* Header */}
// <header className="hidden md:flex items-center justify-between px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 bg-[#FAFAFB] dark:bg-[#101010]">
//   <div className="flex items-center gap-4">
//     {/* Hamburger for mobile */}
//     <button
//       className="lg:hidden p-2 rounded-md hover:bg-gray-100"
//       onClick={() => setSidebarOpen(true)}
//       aria-label="Open sidebar menu"
//     >
//       <Menu className="w-6 h-6 text-gray-800" />
//     </button>

//     <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold tracking-[-0.02em]">
//       Completed Events
//     </h1>
//   </div>

//   {/* Right section */}
//   <div className="flex flex-col items-end gap-3">
//     <div className="flex items-center gap-4 relative">
//       {/* Light/Dark toggle */}
//       {/* <Button
//         onClick={() =>
//           setTheme(resolvedTheme === "light" ? "dark" : "light")
//         }
//         variant="ghost"
//         size="sm"
//         className="hidden lg:flex text-gray-600 dark:text-gray-300 gap-2 hover:text-[#0077F7]"
//       >
//         {theme === "light" ? (
//           <>
//             <Moon className="h-4 w-4" /> Dark Mode
//           </>
//         ) : (
//           <>
//             <Sun className="h-4 w-4" /> Light Mode
//           </>
//         )}
//       </Button> */}

//       {/* Mobile toggle */}
//       {/* <button
//         onClick={() =>
//           setTheme(resolvedTheme === "light" ? "dark" : "light")
//         }
//         className="lg:hidden p-1 text-gray-700 dark:text-gray-300 hover:text-[#0077F7] flex-shrink-0"
//       >
//         {theme === "light" ? (
//           <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
//         ) : (
//           <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
//         )}
//       </button> */}
//       {/* Notification icon */}
//       <div ref={notificationsRef} className="relative">
//         <button
//           onClick={() => {
//             setShowNotifications(!showNotifications);
//             setShowProfileDropdown(false);
//           }}
//           className="bg-black dark:bg-black border h-9 w-9 flex justify-center items-center rounded-full relative hover:opacity-90"
//         >
//           <img
//             src="/icons/Vector.png"
//             alt="notification"
//             className="h-4 w-4"
//           />
//           {/* Counter badge */}
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
//             {notifications.length}
//           </span>
//         </button>

//         {/* Notification popup */}
//         {showNotifications && (
//           <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 rounded-xl z-50 p-3">
//             <h4 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
//               Notifications
//             </h4>
//             <div className="space-y-2 max-h-64 overflow-y-auto">
//               {notifications.length > 0 ? (
//                 notifications.map((n) => (
//                   <div
//                     key={n.id}
//                     className="text-sm bg-gray-50 dark:bg-[#1f1e1e] rounded-lg p-2 hover:bg-gray-100 transition"
//                   >
//                     {n.message}
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-gray-500 text-center py-4">
//                   No new notifications
//                 </p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Profile Name + Icon + Dropdown */}
//       <div
//         className="relative flex items-center gap-2"
//         ref={profileRef}
//       >
//         {/* Host Name */}
//         <span className="hidden sm:block font-semibold text-black dark:text-white">
//           {hostName}
//         </span>

//         {/* Profile Icon Wrapper */}
//         <div className="relative">
//           <button
//             onClick={() => {
//               setShowProfileDropdown(!showProfileDropdown);
//               setShowNotifications(false);
//             }}
//             className="bg-black border h-9 w-9 flex justify-center items-center rounded-full hover:opacity-90"
//           >
//             <img
//               src="/images/icons/profile-user.png"
//               alt="profile"
//               className="h-4 w-4"
//             />
//           </button>

//           {/* Dropdown */}
//           {showProfileDropdown && (
//             <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl z-50 py-2">
//               <Link href="/my-events">
//                 <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
//                   My Events
//                 </button>
//               </Link>

//               <Link href="/ticket-manager">
//                 <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
//                   Ticket Manager
//                 </button>
//               </Link>

//               <Link href="/host-payments">
//                 <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
//                   Payments
//                 </button>
//               </Link>

//               <Link href="/host-settings">
//                 <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
//                   System Settings
//                 </button>
//               </Link>

//               <button
//                 onClick={() => setShowLogoutModal(true)}
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// </header>

//         {/* Bottom Divider Line */}
//         <div className="border-b border-gray-200 dark:border-gray-800"></div>

//         {/* Search and Filters */}
//         <div className="px-4 sm:px-6 md:px-8 mt-4">
//           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
//             <div
//               className="flex-1 rounded-xl border px-4 h-12 flex gap-3 items-center text-[14px] bg-white dark:bg-[#101010]"
//               style={{ borderColor: "rgba(0,0,0,0.08)" }}
//             >
//               <img
//                 src="/images/icons/search-icon.png"
//                 alt=""
//                 className="h-5 w-5"
//               />
//               <input
//                 type="text"
//                 value={searchInput}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   setSearchInput(value);
//                   if (value === "") {
//                     setFilteredEvents(dummyEvents);
//                   }
//                 }}
//                 placeholder="Search Name Or ID"
//                 className="flex-1 outline-none py-3 bg-transparent placeholder:opacity-60"
//                 aria-label="Search Name Or ID"
//               />
//             </div>

//             <button
//               onClick={handleSearch}
//               className="h-11 rounded-xl px-6 text-[14px] font-semibold flex items-center justify-center"
//               style={{
//                 background: "var(--brand, #D19537)",
//                 color: "var(--brand-on, #FFFFFF)",
//               }}
//             >
//               Search
//             </button>
//           </div>
//         </div>

//         {/* Events Grid */}
//         <div className="px-4 sm:px-6 md:px-8 mt-6 pb-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
//           {currentEvents.length > 0 ? (
//             currentEvents.map((event, index) => (
//               <MyCompEventsCard
//                 key={index}
//                 imageSrc={event.imageSrc}
//                 price={event.price}
//                 isEditEvent={false}
//                 hostby={event.hostby}
//                 title={event.title}
//                 description={event.description}
//                 location={event.location}
//                 date={event.date}
//                 audience={event.audience}
//                 time={event.time}
//               />
//             ))
//           ) : (
//             <p className="text-center col-span-full text-gray-500 mt-10">
//               No events found.
//             </p>
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center gap-2 mt-4 mb-10">
//             {/* Prev */}
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
//             >
//               Prev
//             </button>

//             {/* Page Numbers */}
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-4 py-2 border rounded-md ${
//                   currentPage === i + 1
//                     ? "bg-black text-white dark:bg-white dark:text-black"
//                     : "dark:border-gray-700 dark:bg-[#181818]"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             {/* Next */}
//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </main>

//       {/* Logout Modal */}
//       <LogoutModalHost
//         isOpen={showLogoutModal}
//         onClose={() => setShowLogoutModal(false)}
//         onLogout={() => {
//           localStorage.clear();
//           window.location.href = "/sign-in-host";
//         }}
//       />
//     </div>
//   );
// }
