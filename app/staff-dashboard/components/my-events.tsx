"use client";

import Image from "next/image";
import Sidebar from "./sidebar";
import Header from "./header";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

export default function MyEvents() {
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  // TOKEN FUNCTION
  const getToken = () => {
    let raw =
      localStorage.getItem("staffToken") ||
      localStorage.getItem("hostToken") ||
      localStorage.getItem("token");

    try {
      const parsed = JSON.parse(raw || "{}");
      return parsed?.token || parsed;
    } catch {
      return raw;
    }
  };

  // =====================================================
  // 🔥 UPDATED API: GET /users/me/events/cards
  // =====================================================
  const fetchStaffEvents = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const response = await axios.get(
        `${API_BASE_URL}/users/me/events/cards`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        }
      );

      // ✅ Correct path (matches your backend response)
      const events =
        response?.data?.data?.events || response?.data?.events || [];

      setAllEvents(events);
    } catch (err: any) {
      console.error("❌ Error fetching staff events:", err);
      toast.error(err?.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffEvents();
  }, []);

  // 🔍 FILTER LOGIC
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allEvents]);

  // 🔢 PAGINATION
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + eventsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#101010] font-sans">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 dark:bg-[#101010] mt-14 sm:mt-1 min-h-screen">
        {/* Header Hidden on Mobile */}
        <div className="hidden sm:block">
          <Header title="My Events" />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 md:px-8 py-4">
          {/* Search Bar */}
          <div className="flex items-center w-full sm:w-auto flex-grow border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2 bg-gray-50 dark:bg-[#101010]">
            <Image
              src="/images/search-icon.png"
              alt="Search"
              width={18}
              height={18}
              className="mr-3"
            />
            <input
              type="text"
              placeholder="Search by Event Name"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
            />
          </div>

          {/* Filter Button */}
          <button className="sm:ml-4 w-full sm:w-auto px-6 py-2 rounded-full bg-[#D19537] text-white font-medium hover:bg-[#b67e2c] transition">
            Filter
          </button>
        </div>

        {/* Events Section */}
        <section className="px-4 sm:px-6 md:px-8 py-8">
          <h2 className="text-[18px] font-semibold mb-6">Upcoming Events</h2>

          {/* Loading State */}
          {loading && (
            <p className="text-gray-500 text-sm mt-4">Loading events...</p>
          )}

          {/* No Events */}
          {!loading && allEvents.length === 0 && (
            <p className="text-gray-500 text-sm mt-4">
              No events available for this staff.
            </p>
          )}

          {/* Events Grid */}
          {!loading && paginatedEvents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center">
              {paginatedEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-[#101010] rounded-2xl shadow-sm overflow-hidden flex flex-col sm:flex-row max-w-[520px] w-full border border-gray-100 dark:border-gray-800"
                >
                  {/* Image */}
                  <div className="w-full sm:w-[220px] h-[200px] sm:h-[300px] overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={220}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between p-4 sm:p-5 sm:w-[300px]">
                    <div>
                      <h3 className="text-[16px] font-semibold text-gray-900 dark:text-white leading-tight mb-2">
                        {event.title}
                      </h3>

                      <p className="text-[13px] text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {event.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-gray-700 dark:text-gray-300 mb-3">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/icons/location-icon.png"
                            alt="Location"
                            width={15}
                            height={15}
                          />
                          <span>{event.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Image
                            src="/icons/calendar-icon.png"
                            alt="Date"
                            width={15}
                            height={15}
                          />
                          <span>{event.date}</span>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2 text-[13px] text-gray-700 dark:text-gray-300 mb-4">
                        <Image
                          src="/icons/time-icon.png"
                          alt="Time"
                          width={15}
                          height={15}
                        />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    {/* Button */}
                    <Link href={`/ticket-check-staff?id=${event.id}`}>
                      <button className="mt-auto w-full rounded-md bg-[#D19537] text-white text-[14px] font-medium py-2.5 hover:bg-[#b67e2c] transition-all">
                        Check Ticket
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex justify-center mt-10 gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 h-9 rounded-md text-sm font-medium border border-gray-200 transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-md text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-[#D19537] text-white"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 h-9 rounded-md text-sm font-medium border border-gray-200 transition ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

//code before integration

// "use client";

// import Image from "next/image";
// import Sidebar from "./sidebar";
// import Header from "./header";
// import Link from "next/link";
// import { useState, useMemo } from "react";

// export default function MyEvents() {
//   const allEvents = [
//     {
//       id: 1,
//       image: "/images/concert-event.png",
//       host: "Eric Gryzbowski",
//       title: "Starry Nights Music Fest",
//       description:
//         "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
//       location: "California",
//       date: "13 June 2025",
//       audience: "150 Audience",
//       time: "08:00 PM - 09:00 PM",
//     },
//     {
//       id: 2,
//       image: "/images/concert-event.png",
//       host: "Eric Gryzbowski",
//       title: "Ocean Waves Festival",
//       description:
//         "Feel the ocean breeze while enjoying live performances by top DJs and artists.",
//       location: "Online",
//       date: "20 July 2025",
//       audience: "300 Audience",
//       time: "07:00 PM - 11:00 PM",
//     },
//     {
//       id: 3,
//       image: "/images/concert-event.png",
//       host: "Eric Gryzbowski",
//       title: "Tech Summit 2025",
//       description:
//         "Join industry experts to explore the future of innovation and digital transformation.",
//       location: "California",
//       date: "10 Aug 2025",
//       audience: "500 Audience",
//       time: "10:00 AM - 05:00 PM",
//     },
//     {
//       id: 4,
//       image: "/images/concert-event.png",
//       host: "Eric Gryzbowski",
//       title: "Art & Culture Gala",
//       description:
//         "Celebrate creativity with art exhibits, live painting, and musical performances.",
//       location: "California",
//       date: "5 Sept 2025",
//       audience: "200 Audience",
//       time: "06:00 PM - 10:00 PM",
//     },
//     {
//       id: 5,
//       image: "/images/concert-event.png",
//       host: "Eric Gryzbowski",
//       title: "Food Lovers Expo",
//       description:
//         "Taste flavors from around the world with top chefs and food stalls.",
//       location: "Online",
//       date: "1 Oct 2025",
//       audience: "250 Audience",
//       time: "01:00 PM - 06:00 PM",
//     },
//     {
//       id: 6,
//       image: "/images/concert-event.png",
//       host: "Eric Gryzbowski",
//       title: "Starry Nights Music Fest",
//       description:
//         "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
//       location: "California",
//       date: "13 June 2025",
//       audience: "150 Audience",
//       time: "08:00 PM - 09:00 PM",
//     },
//   ];

//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const eventsPerPage = 4;

//   // 🔍 Filter Events
//   const filteredEvents = useMemo(() => {
//     return allEvents.filter((event) =>
//       event.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [searchQuery, allEvents]);

//   // 🔢 Pagination Logic
//   const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
//   const startIndex = (currentPage - 1) * eventsPerPage;
//   const paginatedEvents = filteredEvents.slice(
//     startIndex,
//     startIndex + eventsPerPage
//   );

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <div className="flex min-h-screen bg-white dark:bg-[#101010] font-sans">
//       <Sidebar />

//       {/* Main Content */}
//       <main className="flex-1 bg-gray-50 dark:bg-[#101010] mt-14 sm:mt-1 min-h-screen">
//         {/* ✅ Hide header only on mobile */}
//         <div className="hidden sm:block">
//           <Header title="My Events" />
//         </div>

//         {/* Search + Filter */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 md:px-8 py-4 border-gray-100">
//           {/* Search Bar */}
//           <div className="flex items-center w-full sm:w-auto flex-grow border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2 bg-gray-50 dark:bg-[#101010]">
//             <Image
//               src="/images/search-icon.png"
//               alt="Search"
//               width={18}
//               height={18}
//               className="mr-3"
//             />
//             <input
//               type="text"
//               placeholder="Search by Event Name"
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
//             />
//           </div>

//           {/* Filter Button */}
//           <button className="sm:ml-4 w-full sm:w-auto px-6 py-2 rounded-full bg-[#D19537] text-white font-medium hover:bg-[#b67e2c] transition">
//             Filter
//           </button>
//         </div>

//         {/* Upcoming Events */}
//         <section className="px-4 sm:px-6 md:px-8 py-8">
//           <h2 className="text-[18px] font-semibold mb-6">Upcoming Events</h2>

//           {paginatedEvents.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center">
//               {paginatedEvents.map((event) => (
//                 <div
//                   key={event.id}
//                   className="bg-white dark:bg-[#101010] rounded-2xl shadow-sm overflow-hidden flex flex-col sm:flex-row max-w-[520px] w-full border border-gray-100 dark:border-gray-800"
//                 >
//                   {/* Image Section */}
//                   <div className="w-full sm:w-[220px] h-[200px] sm:h-[300px] overflow-hidden">
//                     <Image
//                       src={event.image || "/placeholder.svg"}
//                       alt={event.title}
//                       width={220}
//                       height={200}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>

//                   {/* Content Section */}
//                   <div className="flex flex-col justify-between p-4 sm:p-5 sm:w-[300px]">
//                     <div>
//                       <h3 className="text-[16px] font-semibold text-gray-900 dark:text-white leading-tight mb-2">
//                         {event.title}
//                       </h3>
//                       <p className="text-[13px] text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
//                         {event.description}
//                       </p>

//                       {/* Meta Info */}
//                       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-gray-700 dark:text-gray-300 mb-3">
//                         <div className="flex items-center gap-2">
//                           <Image
//                             src="/icons/location-icon.png"
//                             alt="Location"
//                             width={15}
//                             height={15}
//                           />
//                           <span>{event.location}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Image
//                             src="/icons/calendar-icon.png"
//                             alt="Date"
//                             width={15}
//                             height={15}
//                           />
//                           <span>{event.date}</span>
//                         </div>
//                       </div>

//                       {/* Time */}
//                       <div className="flex items-center gap-2 text-[13px] text-gray-700 dark:text-gray-300 mb-4">
//                         <Image
//                           src="/icons/time-icon.png"
//                           alt="Time"
//                           width={15}
//                           height={15}
//                         />
//                         <span>{event.time}</span>
//                       </div>
//                     </div>

//                     {/* Button */}
//                     <Link href="/ticket-check-staff">
//                       <button className="mt-auto w-full rounded-md bg-[#D19537] text-white text-[14px] font-medium py-2.5 hover:bg-[#b67e2c] transition-all">
//                         Check Ticket
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500 text-sm mt-4">
//               No events found matching your search.
//             </p>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center mt-10 gap-2 flex-wrap">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-4 h-9 rounded-md text-sm font-medium border border-gray-200 transition ${
//                   currentPage === 1
//                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     : "bg-white text-gray-700 hover:bg-gray-100"
//                 }`}
//               >
//                 Previous
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <button
//                     key={page}
//                     onClick={() => handlePageChange(page)}
//                     className={`w-9 h-9 rounded-md text-sm font-medium transition ${
//                       currentPage === page
//                         ? "bg-[#D19537] text-white"
//                         : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 )
//               )}

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-4 h-9 rounded-md text-sm font-medium border border-gray-200 transition ${
//                   currentPage === totalPages
//                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     : "bg-white text-gray-700 hover:bg-gray-100"
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }
