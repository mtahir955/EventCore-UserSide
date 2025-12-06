"use client";

import { Header } from "../../components/header";
import { TicketCard } from "../tickets/components/ticket-card";
import { EventCard } from "../tickets/components/event-card";
import { Footer } from "../../components/footer";
import { useState, useEffect } from "react";
import { useTicketsStore } from "@/store/ticketsStore";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

export default function Page() {
  const { tickets, setTickets } = useTicketsStore();
  const [activeTab, setActiveTab] = useState("Active");

  // ⭐ FETCH REAL TICKETS FROM BACKEND
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("buyerToken");
        if (!token) {
          console.log("❌ No buyer token found");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/users/tickets/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        });

        if (res.data?.tickets) {
          setTickets(res.data.tickets);
        }
      } catch (err) {
        console.log("❌ Error fetching tickets:", err);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === "Active") return !ticket.ended && !ticket.transferred;
    if (activeTab === "Ended") return ticket.ended;
    if (activeTab === "Transferred") return ticket.transferred;
    return true;
  });

  // 🔹 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 4;

  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  return (
    <main className="bg-background text-foreground dark:bg-[#101010] dark:text-gray-100 transition-colors duration-300">
      <Header />

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

        {/* Ticket Categories */}
        <div className="mt-6 flex justify-center sm:justify-start gap-3">
          {["Active", "Ended", "Transferred"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1); // Reset pagination
              }}
              className={`
                px-5 py-2 rounded-full text-sm font-medium transition-all
                ${
                  activeTab === tab
                    ? "bg-[#0077F7] text-white shadow-md"
                    : "bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tickets Grid */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {currentTickets.map((t, index) => (
            <TicketCard
              key={index}
              date={t.date}
              title={t.title}
              location={t.location}
              type={t.type}
              price={t.price}
              highlight={t.highlight}
              ended={t.ended}
              transferred={t.transferred}
            />
          ))}
        </section>

        {/* ⭐ Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
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
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "dark:border-gray-700 dark:bg-[#181818]"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-600 dark:bg-[#181818]"
            >
              Next
            </button>
          </div>
        )}

        {/* Explore More Events Section */}
        <section className="mt-12 px-2 sm:px-4 md:px-6">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold mb-6 text-center md:text-left text-gray-900 dark:text-white">
            Explore More Events
          </h2>

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

          <div className="relative mt-6 flex items-center justify-center md:justify-between px-2">
            <button
              aria-label="Previous"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border dark:border-gray-700 bg-white dark:bg-[#181818] text-lg text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border dark:border-gray-700 bg-white dark:bg-[#181818] text-lg text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              ›
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

// //code before integartion

// "use client";

// import { Header } from "../../components/header";
// import { TicketCard } from "../tickets/components/ticket-card";
// import { EventCard } from "../tickets/components/event-card";
// import { Footer } from "../../components/footer";
// import { useState, useEffect } from "react";
// import { useTicketsStore } from "@/store/ticketsStore";

// export default function Page() {
//   // 🔹 Ticket Data (same as you already have)
//   const { tickets, setTickets } = useTicketsStore();

//   useEffect(() => {
//     setTickets([
//       // ⭐ ACTIVE TICKETS
//       {
//         date: { day: "03", month: "June", weekday: "SUN", time: "08:00 PM" },
//         title: "Starry Nights Music Fest",
//         location: "California",
//         type: "1 General Ticket",
//         price: "$205.35",
//         highlight: true,
//       },
//       {
//         date: { day: "12", month: "July", weekday: "FRI", time: "09:30 PM" },
//         title: "Summer Beats Festival",
//         location: "Miami",
//         type: "2 VIP Tickets",
//         price: "$350.00",
//         highlight: true,
//       },
//       {
//         date: { day: "03", month: "June", weekday: "SUN", time: "08:00 PM" },
//         title: "Starry Nights Music Fest",
//         location: "California",
//         type: "1 General Ticket",
//         price: "$205.35",
//         highlight: true,
//       },
//       {
//         date: { day: "12", month: "July", weekday: "FRI", time: "09:30 PM" },
//         title: "Summer Beats Festival",
//         location: "Miami",
//         type: "2 VIP Tickets",
//         price: "$350.00",
//         highlight: true,
//       },
//       {
//         date: { day: "03", month: "June", weekday: "SUN", time: "08:00 PM" },
//         title: "Starry Nights Music Fest",
//         location: "California",
//         type: "1 General Ticket",
//         price: "$205.35",
//         highlight: true,
//       },
//       {
//         date: { day: "12", month: "July", weekday: "FRI", time: "09:30 PM" },
//         title: "Summer Beats Festival",
//         location: "Miami",
//         type: "2 VIP Tickets",
//         price: "$350.00",
//         highlight: true,
//       },

//       // ⭐ ACTIVE + TRANSFERRED
//       {
//         date: { day: "19", month: "August", weekday: "MON", time: "07:00 PM" },
//         title: "Beach Glow Party",
//         location: "Santa Monica",
//         type: "1 VIP Ticket",
//         price: "$150.00",
//         highlight: true,
//         transferred: true, // 🔥 added
//       },
//       {
//         date: { day: "27", month: "June", weekday: "THU", time: "06:00 PM" },
//         title: "Food Carnival Special",
//         location: "New York",
//         type: "1 General Ticket",
//         price: "$60.00",
//         highlight: true,
//         transferred: true, // 🔥 added
//       },
//       {
//         date: { day: "19", month: "August", weekday: "MON", time: "07:00 PM" },
//         title: "Beach Glow Party",
//         location: "Santa Monica",
//         type: "1 VIP Ticket",
//         price: "$150.00",
//         highlight: true,
//         transferred: true, // 🔥 added
//       },
//       {
//         date: { day: "27", month: "June", weekday: "THU", time: "06:00 PM" },
//         title: "Food Carnival Special",
//         location: "New York",
//         type: "1 General Ticket",
//         price: "$60.00",
//         highlight: true,
//         transferred: true, // 🔥 added
//       },

//       // ⭐ ENDED TICKETS
//       {
//         date: { day: "03", month: "June", weekday: "SUN", time: "08:00 PM" },
//         title: "Starry Nights Music Fest",
//         location: "California",
//         type: "1 General Ticket",
//         price: "$205.35",
//         ended: true,
//       },
//       {
//         date: { day: "11", month: "May", weekday: "SAT", time: "05:00 PM" },
//         title: "Old Memories Live Concert",
//         location: "Chicago",
//         type: "1 General Entry",
//         price: "$90.00",
//         ended: true,
//       },
//       {
//         date: { day: "03", month: "June", weekday: "SUN", time: "08:00 PM" },
//         title: "Starry Nights Music Fest",
//         location: "California",
//         type: "1 General Ticket",
//         price: "$205.35",
//         ended: true,
//       },
//       {
//         date: { day: "11", month: "May", weekday: "SAT", time: "05:00 PM" },
//         title: "Old Memories Live Concert",
//         location: "Chicago",
//         type: "1 General Entry",
//         price: "$90.00",
//         ended: true,
//       },
//       {
//         date: { day: "03", month: "June", weekday: "SUN", time: "08:00 PM" },
//         title: "Starry Nights Music Fest",
//         location: "California",
//         type: "1 General Ticket",
//         price: "$205.35",
//         ended: true,
//       },
//       {
//         date: { day: "11", month: "May", weekday: "SAT", time: "05:00 PM" },
//         title: "Old Memories Live Concert",
//         location: "Chicago",
//         type: "1 General Entry",
//         price: "$90.00",
//         ended: true,
//       },

//       // ⭐ ENDED + TRANSFERRED
//       {
//         date: { day: "22", month: "April", weekday: "MON", time: "07:45 PM" },
//         title: "Night Jazz Festival",
//         location: "Los Angeles",
//         type: "1 VIP Ticket",
//         price: "$180.00",
//         ended: true,
//         transferred: true, // 🔥 added
//       },
//       {
//         date: { day: "05", month: "March", weekday: "TUE", time: "09:15 PM" },
//         title: "Music Under The Stars",
//         location: "Houston",
//         type: "1 General Ticket",
//         price: "$89.00",
//         ended: true,
//         transferred: true, // 🔥 added
//       },
//       {
//         date: { day: "22", month: "April", weekday: "MON", time: "07:45 PM" },
//         title: "Night Jazz Festival",
//         location: "Los Angeles",
//         type: "1 VIP Ticket",
//         price: "$180.00",
//         ended: true,
//         transferred: true, // 🔥 added
//       },
//       {
//         date: { day: "05", month: "March", weekday: "TUE", time: "09:15 PM" },
//         title: "Music Under The Stars",
//         location: "Houston",
//         type: "1 General Ticket",
//         price: "$89.00",
//         ended: true,
//         transferred: true, // 🔥 added
//       },
//     ]);
//   }, []);

//   const [activeTab, setActiveTab] = useState("Active");

//   const filteredTickets = tickets.filter((ticket) => {
//     if (activeTab === "Active") return !ticket.ended && !ticket.transferred;
//     if (activeTab === "Ended") return ticket.ended;
//     if (activeTab === "Transferred") return ticket.transferred;
//     return true;
//   });

//   // 🔹 Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const ticketsPerPage = 4;

//   const indexOfLast = currentPage * ticketsPerPage;
//   const indexOfFirst = indexOfLast - ticketsPerPage;
//   const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

//   return (
//     <main className="bg-background text-foreground dark:bg-[#101010] dark:text-gray-100 transition-colors duration-300">
//       <Header />

//       <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 min-h-[1065px]">
//         {/* Page heading */}
//         <section className="px-4 sm:px-6 mt-6 text-center">
//           <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-gray-900 dark:text-white">
//             Tickets
//           </h1>
//           <p className="mt-2 text-[14px] sm:text-[15px] md:text-[16px] text-muted-foreground dark:text-gray-400">
//             All your event memories start here — see your tickets, times, and
//             details at a glance.
//           </p>
//         </section>

//         {/* Ticket Categories */}
//         <div className="mt-6 flex justify-center sm:justify-start gap-3">
//           {["Active", "Ended", "Transferred"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`
//         px-5 py-2 rounded-full text-sm font-medium transition-all
//         ${
//           activeTab === tab
//             ? "bg-[#0077F7] text-white shadow-md"
//             : "bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
//         }
//       `}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Tickets Grid (Paginated) */}
//         <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//           {currentTickets.map((t, index) => (
//             <TicketCard
//               key={index}
//               date={t.date}
//               title={t.title}
//               location={t.location}
//               type={t.type}
//               price={t.price}
//               highlight={t.highlight}
//               ended={t.ended}
//               transferred={t.transferred}
//             />
//           ))}
//         </section>

//         {/* ⭐ PAGINATION BEFORE EXPLORE MORE SECTION */}
//         {totalPages > 1 && (
//           <div className="flex justify-center mt-8 space-x-2">
//             {/* Prev */}
//             <button
//               onClick={() => setCurrentPage((p) => p - 1)}
//               disabled={currentPage === 1}
//               className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-600 dark:bg-[#181818]"
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
//                     ? "bg-black dark:bg-white text-white dark:text-black"
//                     : "dark:border-gray-700 dark:bg-[#181818]"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             {/* Next */}
//             <button
//               onClick={() => setCurrentPage((p) => p + 1)}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-600 dark:bg-[#181818]"
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {/* ------------------------------ */}
//         {/* ⭐ Explore More Events Section */}
//         {/* ------------------------------ */}

//         <section className="mt-12 px-2 sm:px-4 md:px-6">
//           <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold mb-6 text-center md:text-left text-gray-900 dark:text-white">
//             Explore More Events
//           </h2>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//             <EventCard
//               image="/images/event-1.png"
//               title="Starry Nights Music Fest"
//               subtitle="A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze."
//               price="$99.99"
//             />
//             <EventCard
//               image="/images/event-2.png"
//               title="Starry Nights Music Fest"
//               subtitle="A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze."
//               price="$99.99"
//             />
//           </div>

//           <div className="relative mt-6 flex items-center justify-center md:justify-between px-2">
//             <button
//               aria-label="Previous"
//               className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border dark:border-gray-700 bg-white dark:bg-[#181818] text-lg text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//             >
//               ‹
//             </button>
//             <button
//               aria-label="Next"
//               className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border dark:border-gray-700 bg-white dark:bg-[#181818] text-lg text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//             >
//               ›
//             </button>
//           </div>
//         </section>
//       </div>

//       <Footer />
//     </main>
//   );
// }
