"use client";

import Image from "next/image";
import Sidebar from "./sidebar";
import Header from "./header";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState("User");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const getToken = () => {
    let raw =
      localStorage.getItem("staffToken") ||
      localStorage.getItem("hostToken") ||
      localStorage.getItem("token");

    try {
      const p = JSON.parse(raw || "{}");
      return p?.token || p;
    } catch {
      return raw;
    }
  };

  // ============================================
  // 🔥 UPDATED API CALL
  // GET /users/me/dashboard/events
  // ============================================
  const fetchEventsList = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const response = await axios.get(
        `${API_BASE_URL}/users/me/dashboard/events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        }
      );

      const data =
        response.data?.events || response.data?.data || response.data || [];

      // 🔄 Normalize backend → frontend keys
      const formatted = data.map((e: any) => ({
        name: e.eventName,
        date: e.eventDate,
        address: e.eventAddress,
        status: e.status,
      }));

      setEvents(formatted);
    } catch (err: any) {
      console.error("❌ Failed to fetch events:", err);
      toast.error(err?.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsList();
  }, []);

  // PAGINATION
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;

  const currentEvents = events.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(events.length / entriesPerPage);

  useEffect(() => {
    const rawUser =
      localStorage.getItem("staffUser") || localStorage.getItem("hostUser");

    if (rawUser) {
      try {
        const user = JSON.parse(rawUser);

        setUserName(user.fullName || user.userName || "User");
      } catch (err) {
        console.error("Invalid user object in storage");
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#101010] font-sans overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 bg-gray-50 dark:bg-[#101010] min-h-screen pb-10">
        <Header title="Dashboard" />

        {/* Welcome Banner */}
        <div className="mx-4 sm:mx-6 md:mx-8 mt-8 md:mt-6 flex flex-row items-center justify-between rounded-2xl bg-[#F5EDE5] p-4 sm:p-6 md:p-8 w-[300px] sm:w-auto gap-4">
          <div>
            <h3 className="mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-black">
              Welcome Back, {userName}
            </h3>

            <p className="text-sm sm:text-base md:text-lg text-gray-700">
              You&apos;ve made great progress this week. Keep it up!
            </p>
          </div>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%207-yy9Z2BEyyIOj2EOr1lMnkChoXNQo78.png"
            alt="Tickets"
            width={180}
            height={120}
            className="h-[90px] sm:h-[100px] md:h-[120px] w-[130px] sm:w-[160px] md:w-[180px] object-contain"
          />
        </div>

        {/* Stats */}
        <div className="mx-4 sm:mx-6 md:mx-8 mt-6 mr-[410px] grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center md:justify-items-stretch">
          <div className="w-[300px] sm:w-full rounded-2xl bg-white dark:bg-black p-5 sm:p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-50 dark:bg-[#101010] p-4 mt-1">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_3857838-W26EJe0hBtwACW7UFPz0DwV3xqruzC.png"
                  width={24}
                  height={24}
                  alt=""
                />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                  150
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-white">
                  Pending Events
                </div>
              </div>
            </div>
          </div>

          <div className="w-[300px] sm:w-full rounded-2xl bg-white dark:bg-black p-5 sm:p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-50 dark:bg-[#101010] p-4 mt-1">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_11785545-eCq9B27XM2g0TeMb4b7SzjJYt8YmsQ.png"
                  width={24}
                  height={24}
                  alt=""
                />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                  720
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-white">
                  Events Completed
                </div>
              </div>
            </div>
          </div>

          <div className="w-[300px] sm:w-full rounded-2xl bg-white dark:bg-black p-5 sm:p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-orange-50 dark:bg-[#101010] p-4 mt-1">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_9221356-UwRank2CWVKZz8Ms2Q7vaXqTV4FbaL.png"
                  width={24}
                  height={24}
                  alt=""
                />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                  12,00
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-white">
                  Total Tickets Checked
                </div>
              </div>
            </div>
          </div>

          {/* <div className="w-[300px] sm:w-full rounded-2xl bg-white dark:bg-black p-5 sm:p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-orange-50 dark:bg-[#101010] p-4 mt-1">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Layer_1-SjePEeKaLr3vHm9MtrA2kHBiAjjFkI.png"
                  width={24}
                  height={24}
                  alt=""
                />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                  20sec
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-white">
                  Average Check-in Time
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Events Table */}
        <div className="mx-4 sm:mx-6 md:mx-8 mb-10 mt-6 rounded-2xl bg-white dark:bg-[#101010] shadow-sm ring-1 ring-gray-100">
          <div className="overflow-x-auto w-full sm:overflow-visible">
            <table className="min-w-[700px] w-full text-sm sm:text-base">
              <thead>
                <tr className="bg-[#F5EDE5]">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    Event Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {/* LOADING */}
                {loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-500 dark:text-white"
                    >
                      Loading events...
                    </td>
                  </tr>
                )}

                {/* NO EVENTS */}
                {!loading && events.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-500 dark:text-white"
                    >
                      No events found.
                    </td>
                  </tr>
                )}

                {/* EVENTS */}
                {!loading &&
                  currentEvents.map((event, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 dark:text-white">
                        {event.name}
                      </td>
                      <td className="px-6 py-4 dark:text-white">
                        {event.date}
                      </td>
                      <td className="px-6 py-4 dark:text-white">
                        {event.address}
                      </td>
                      <td className="px-6 py-4 dark:text-white">
                        {event.status}
                      </td>
                      <td className="px-6 py-4">
                        {event.status === "Upcoming" ? (
                          <Link href="/ticket-check-staff">
                            <button className="rounded-full bg-[#D19537] px-5 py-2 text-sm font-medium text-white hover:bg-[#b8802f]">
                              Start Checking
                            </button>
                          </Link>
                        ) : (
                          <button className="rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-600">
                            Expired
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center px-4 py-4 space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-600 dark:bg-[#181818]"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === i + 1
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "dark:border-gray-600 dark:bg-[#181818]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-600 dark:bg-[#181818]"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
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
// import { useState } from "react";

// export default function Dashboard() {
//   const events = [
//     {
//       name: "Starry Nights Music",
//       date: "13/06/2025",
//       address: "Washington DC, USA",
//       status: "Upcoming",
//     },
//     {
//       name: "Starry Nights Music",
//       date: "13/06/2025",
//       address: "Washington DC, USA",
//       status: "Upcoming",
//     },
//     {
//       name: "Starry Nights Music",
//       date: "13/06/2025",
//       address: "Washington DC, USA",
//       status: "Cancelled",
//     },
//     {
//       name: "Starry Nights Music",
//       date: "13/06/2025",
//       address: "Washington DC, USA",
//       status: "Upcoming",
//     },
//     {
//       name: "Starry Nights Music",
//       date: "13/06/2025",
//       address: "Washington DC, USA",
//       status: "Cancelled",
//     },
//     {
//       name: "Starry Nights Music",
//       date: "13/06/2025",
//       address: "Washington DC, USA",
//       status: "Upcoming",
//     },
//     {
//       name: "Starry Nights Music",
//       date: "13/06/2025",
//       address: "Washington DC, USA",
//       status: "Upcoming",
//     },
//   ];

//   // 🔹 PAGINATION LOGIC
//   const [currentPage, setCurrentPage] = useState(1);
//   const entriesPerPage = 5;

//   const indexOfLast = currentPage * entriesPerPage;
//   const indexOfFirst = indexOfLast - entriesPerPage;

//   const currentEvents = events.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(events.length / entriesPerPage);

//   return (
//     <div className="flex min-h-screen bg-white dark:bg-[#101010] font-sans overflow-x-hidden">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <main className="flex-1 bg-gray-50 dark:bg-[#101010] min-h-screen pb-10">
//         <Header title="Dashboard" />

//         {/* Welcome Banner */}
//         <div className="mx-4 sm:mx-6 md:mx-8 mt-8 md:mt-6 flex flex-row items-center justify-between rounded-2xl bg-[#F5EDE5] p-4 sm:p-6 md:p-8 w-[300px] sm:w-auto gap-4">
//           <div className="flex flex-col justify-center text-left">
//             <h3 className="mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-black">
//               Welcome Back, User Name
//             </h3>
//             <p className="text-sm sm:text-base md:text-lg text-gray-700">
//               You&apos;ve made great progress this week. Keep it up!
//             </p>
//           </div>
//           <Image
//             src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%207-yy9Z2BEyyIOj2EOr1lMnkChoXNQo78.png"
//             alt="Tickets"
//             width={180}
//             height={120}
//             className="h-[90px] sm:h-[100px] md:h-[120px] w-[130px] sm:w-[160px] md:w-[180px] object-contain"
//           />
//         </div>

//         {/* Stats Cards */}
// <div className="mx-4 sm:mx-6 md:mx-8 mt-6 mr-[410px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-center md:justify-items-stretch">
//   {/* Cards */}
//   <div className="w-[300px] sm:w-full rounded-2xl bg-white dark:bg-black p-5 sm:p-6 shadow-sm ring-1 ring-gray-100">
//     <div className="flex items-start gap-4">
//       <div className="rounded-full bg-blue-50 dark:bg-[#101010] p-4 mt-1">
//         <Image
//           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_3857838-W26EJe0hBtwACW7UFPz0DwV3xqruzC.png"
//           width={24}
//           height={24}
//           alt=""
//         />
//       </div>
//       <div>
//         <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
//           150
//         </div>
//         <div className="mt-1 text-sm text-gray-600 dark:text-white">
//           Pending Events
//         </div>
//       </div>
//     </div>
//   </div>

//   <div className="w-[300px] sm:w-full rounded-2xl bg-white dark:bg-black p-5 sm:p-6 shadow-sm ring-1 ring-gray-100">
//     <div className="flex items-start gap-4">
//       <div className="rounded-full bg-blue-50 dark:bg-[#101010] p-4 mt-1">
//         <Image
//           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_11785545-eCq9B27XM2g0TeMb4b7SzjJYt8YmsQ.png"
//           width={24}
//           height={24}
//           alt=""
//         />
//       </div>
//       <div>
//         <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
//           720
//         </div>
//         <div className="mt-1 text-sm text-gray-600 dark:text-white">
//           Events Completed
//         </div>
//       </div>
//     </div>
//   </div>

//   <div className="w-[300px] sm:w-full rounded-2xl bg-white dark:bg-black p-5 sm:p-6 shadow-sm ring-1 ring-gray-100">
//     <div className="flex items-start gap-4">
//       <div className="rounded-full bg-orange-50 dark:bg-[#101010] p-4 mt-1">
//         <Image
//           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_9221356-UwRank2CWVKZz8Ms2Q7vaXqTV4FbaL.png"
//           width={24}
//           height={24}
//           alt=""
//         />
//       </div>
//       <div>
//         <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
//           12,00
//         </div>
//         <div className="mt-1 text-sm text-gray-600 dark:text-white">
//           Total Tickets Checked
//         </div>
//       </div>
//     </div>
//   </div>

//   <div className="w-[300px] sm:w-full rounded-2xl bg-white dark:bg-black p-5 sm:p-6 shadow-sm ring-1 ring-gray-100">
//     <div className="flex items-start gap-4">
//       <div className="rounded-full bg-orange-50 dark:bg-[#101010] p-4 mt-1">
//         <Image
//           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Layer_1-SjePEeKaLr3vHm9MtrA2kHBiAjjFkI.png"
//           width={24}
//           height={24}
//           alt=""
//         />
//       </div>
//       <div>
//         <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
//           20sec
//         </div>
//         <div className="mt-1 text-sm text-gray-600 dark:text-white">
//           Average Check-in Time
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//         {/* Events Table */}
//         <div className="mx-4 sm:mx-6 md:mx-8 mb-10 mt-6 rounded-2xl bg-white dark:bg-[#101010] shadow-sm ring-1 ring-gray-100">
//           {/* ⭐ MOBILE TABLE SCROLL WRAPPER — only this will scroll */}
//           <div className="overflow-x-auto w-full sm:overflow-visible">
//             <table className="min-w-[700px] w-full text-sm sm:text-base">
//               <thead>
//                 <tr className="bg-[#F5EDE5]">
//                   <th className="px-4 sm:px-6 py-4 text-left font-semibold text-gray-900">
//                     Event Name
//                   </th>
//                   <th className="px-4 sm:px-6 py-4 text-left font-semibold text-gray-900">
//                     Date
//                   </th>
//                   <th className="px-4 sm:px-6 py-4 text-left font-semibold text-gray-900">
//                     Address
//                   </th>
//                   <th className="px-4 sm:px-6 py-4 text-left font-semibold text-gray-900">
//                     Status
//                   </th>
//                   <th className="px-4 sm:px-6 py-4 text-left font-semibold text-gray-900">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-100">
//                 {currentEvents.map((event, index) => (
//                   <tr
//                     key={index}
//                     className="hover:bg-gray-50 dark:hover:bg-gray-800"
//                   >
//                     <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-white">
//                       {event.name}
//                     </td>
//                     <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-white">
//                       {event.date}
//                     </td>
//                     <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-white">
//                       {event.address}
//                     </td>
//                     <td className="px-4 sm:px-6 py-4">
//                       {event.status === "Upcoming" ? (
//                         <span className="text-gray-900 dark:text-white">
//                           {event.status}
//                         </span>
//                       ) : (
//                         <span className="text-red-600">{event.status}</span>
//                       )}
//                     </td>
//                     <td className="px-4 sm:px-6 py-4">
//                       {event.status === "Upcoming" ? (
//                         <Link href="/ticket-check-staff">
//                           <button className="rounded-full bg-[#D19537] px-5 py-2 text-sm font-medium text-white hover:bg-[#b8802f]">
//                             Start Checking
//                           </button>
//                         </Link>
//                       ) : (
//                         <button className="rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-600">
//                           Expire
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center px-4 py-4 space-x-2">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((p) => p - 1)}
//                   className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-600 dark:bg-[#181818]"
//                 >
//                   Prev
//                 </button>

//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`px-4 py-2 border rounded-md ${
//                       currentPage === i + 1
//                         ? "bg-black text-white dark:bg-white dark:text-black"
//                         : "dark:border-gray-600 dark:bg-[#181818]"
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}

//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage((p) => p + 1)}
//                   className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-600 dark:bg-[#181818]"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
