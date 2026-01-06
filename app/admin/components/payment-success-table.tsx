"use client";

import { useMemo, useState } from "react";
import type { RefundRequest } from "./payment-withdrawal-table";

interface PaymentSuccessTableProps {
  data?: RefundRequest[];
  loading?: boolean;
}

export function PaymentSuccessTable({ data = [] }: PaymentSuccessTableProps) {
  const successfulEntries = useMemo(
    () => data.filter((r) => r.status === "APPROVED"),
    [data]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const totalPages = Math.ceil(successfulEntries.length / entriesPerPage);

  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return successfulEntries.slice(start, start + entriesPerPage);
  }, [currentPage, successfulEntries]);

  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto rounded-xl border border-border bg-background pb-6">
        <table className="w-full text-left">
          <thead>
            <tr
              className="border-b border-border"
              style={{ background: "rgba(245, 237, 229, 1)" }}
            >
              <th className="px-6 py-4 text-sm font-semibold dark:text-black">
                Buyer
              </th>
              <th className="px-6 py-4 text-sm font-semibold dark:text-black">
                Email
              </th>
              <th className="px-6 py-4 text-sm font-semibold dark:text-black">
                Phone
              </th>
              <th className="px-6 py-4 text-sm font-semibold dark:text-black">
                Event Name
              </th>
              <th className="px-6 py-4 text-sm font-semibold dark:text-black">
                Date
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-right dark:text-black">
                Amount
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-center dark:text-black">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-sm text-muted-foreground"
                >
                  No approved refunds found.
                </td>
              </tr>
            ) : (
              currentRows.map((row) => (
                <tr
                  key={row.refundRequestId}
                  className="border-b border-border hover:bg-secondary/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium">{row.buyerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.refundRequestId}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm">{row.buyerEmail}</td>
                  <td className="px-6 py-4 text-sm">{row.buyerPhone}</td>
                  <td className="px-6 py-4 text-sm max-w-[220px]">
                    <p className="truncate" title={row.eventName}>
                      {row.eventName}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm">{row.eventDate}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium">
                    ${row.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Approved
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import { useMemo, useState } from "react";
// import type { RefundRequest } from "./payment-withdrawal-table";

// interface PaymentSuccessTableProps {
//   data?: RefundRequest[];
//   loading?: boolean;
// }

// /* ---------------- DUMMY APPROVED DATA ---------------- */
// const DUMMY_APPROVED_REFUNDS: RefundRequest[] = [
//   {
//     id: "RF-101",
//     buyerName: "Daniel Carter",
//     buyerEmail: "danielc@gmail.com",
//     buyerPhone: "+44 7412 558492",

//     eventName: "Starry Nights Music Fest",
//     eventDate: "12 Nov 2025",
//     amount: 205.35,

//     ticketId: "TCK-482917-AB56",
//     ticketType: "VIP",
//     ticketPrice: 205.35,
//     requestDate: "10 Nov 2025",
//     paymentMethod: "Full Payment",
//     refundAccount: "PK92SCBL0000001234567890",

//     status: "APPROVED",
//   },
//   {
//     id: "RF-102",
//     buyerName: "Sarah Mitchell",
//     buyerEmail: "sarahm@gmail.com",
//     buyerPhone: "+1 305 555 0142",

//     eventName: "Good Life Trainings Meetup",
//     eventDate: "18 Nov 2025",
//     amount: 99.99,

//     ticketId: "TCK-781245-ZX11",
//     ticketType: "General",
//     ticketPrice: 99.99,
//     requestDate: "17 Nov 2025",
//     paymentMethod: "Installments",
//     refundAccount: "PK15HBL0000009876543210",

//     status: "APPROVED",
//   },
// ];
// /* ---------------------------------------------------- */

// export function PaymentSuccessTable({ data = [] }: PaymentSuccessTableProps) {
//   // 👉 Use real data if available, otherwise fallback to dummy
//   const sourceData = data.length > 0 ? data : DUMMY_APPROVED_REFUNDS;

//   const successfulEntries = useMemo(
//     () => sourceData.filter((r) => r.status === "APPROVED"),
//     [sourceData]
//   );

//   const [currentPage, setCurrentPage] = useState(1);
//   const entriesPerPage = 5;

//   const totalPages = Math.ceil(successfulEntries.length / entriesPerPage);

//   const currentRows = useMemo(() => {
//     const start = (currentPage - 1) * entriesPerPage;
//     return successfulEntries.slice(start, start + entriesPerPage);
//   }, [currentPage, successfulEntries]);

//   return (
//     <div className="flex flex-col w-full">
//       <div className="overflow-x-auto rounded-xl border border-border bg-background pb-6">
//         <table className="w-full text-left">
//           <thead>
//             <tr
//               className="border-b border-border"
//               style={{ background: "rgba(245, 237, 229, 1)" }}
//             >
//               <th className="px-6 py-4 text-sm font-semibold dark:text-black">
//                 Buyer
//               </th>
//               <th className="px-6 py-4 text-sm font-semibold dark:text-black">
//                 Email
//               </th>
//               <th className="px-6 py-4 text-sm font-semibold dark:text-black">
//                 Phone
//               </th>
//               <th className="px-6 py-4 text-sm font-semibold dark:text-black">
//                 Event Name
//               </th>
//               <th className="px-6 py-4 text-sm font-semibold dark:text-black">
//                 Date
//               </th>
//               <th className="px-6 py-4 text-sm font-semibold text-right dark:text-black">
//                 Amount
//               </th>
//               <th className="px-6 py-4 text-sm font-semibold text-center dark:text-black">
//                 Status
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentRows.map((row) => (
//               <tr
//                 key={row.id}
//                 className="border-b border-border hover:bg-secondary/40 transition-colors"
//               >
//                 {/* Buyer */}
//                 <td className="px-6 py-4">
//                   <p className="font-medium">{row.buyerName}</p>
//                   <p className="text-xs text-muted-foreground">{row.id}</p>
//                 </td>

//                 {/* Email */}
//                 <td className="px-6 py-4 text-sm">{row.buyerEmail}</td>

//                 {/* Phone */}
//                 <td className="px-6 py-4 text-sm">{row.buyerPhone}</td>

//                 {/* Event */}
//                 {/* EVENT */}
//                 <td className="px-6 py-4 text-sm max-w-[220px]">
//                   <p className="truncate" title={row.eventName}>
//                     {row.eventName}
//                   </p>
//                 </td>

//                 {/* Date */}
//                 <td className="px-6 py-4 text-sm">{row.eventDate}</td>

//                 {/* Amount */}
//                 <td className="px-6 py-4 text-sm text-right font-medium">
//                   ${row.amount.toFixed(2)}
//                 </td>

//                 {/* Status */}
//                 <td className="px-6 py-4 text-center">
//                   <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
//                     Approved
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {totalPages > 1 && (
//           <div className="flex justify-center gap-2 mt-4">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               className="px-3 py-1 border rounded disabled:opacity-40"
//             >
//               Prev
//             </button>

//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-3 py-1 border rounded ${
//                   currentPage === i + 1
//                     ? "bg-black text-white dark:bg-white dark:text-black"
//                     : ""
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               className="px-3 py-1 border rounded disabled:opacity-40"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import Image from "next/image";

// interface Host {
//   id: string;
//   name: string;
//   email: string;
//   date: string;
//   time: string;
//   eventName: string;
//   amount: number;
//   avatar: string;
// }

// const successfulWithdrawals: Host[] = [
//   {
//     id: "h1",
//     name: "Daniel Carter",
//     email: "info@gmail.com",
//     date: "12 Nov 2025",
//     time: "07:00 PM",
//     eventName: "Starry Nights Music Fest",
//     avatar: "/avatars/avatar-1.png",
//     amount: 1500,
//   },
//   {
//     id: "h2",
//     name: "Sarah Mitchell",
//     email: "host@gmail.com",
//     date: "18 Nov 2025",
//     time: "06:30 PM",
//     eventName: "Good Life Trainings Meetup",
//     avatar: "/avatars/avatar-1.png",
//     amount: 2300,
//   },
//   {
//     id: "h4",
//     name: "Emily Carter",
//     email: "emily@gmail.com",
//     date: "20 Nov 2025",
//     time: "05:00 PM",
//     eventName: "Tech Innovators Expo",
//     avatar: "/avatars/avatar-1.png",
//     amount: 3200,
//   },
//   {
//     id: "h5",
//     name: "Emily Carter",
//     email: "emily@gmail.com",
//     date: "20 Nov 2025",
//     time: "05:00 PM",
//     eventName: "Tech Innovators Expo",
//     avatar: "/avatars/avatar-1.png",
//     amount: 3200,
//   },
//   {
//     id: "h6",
//     name: "Emily Carter",
//     email: "emily@gmail.com",
//     date: "20 Nov 2025",
//     time: "05:00 PM",
//     eventName: "Tech Innovators Expo",
//     avatar: "/avatars/avatar-1.png",
//     amount: 3200,
//   },
// ];

// export function PaymentSuccessTable() {
//   // SEPARATE PAGINATION FOR THIS TABLE
//   const [currentPage, setCurrentPage] = useState(1);
//   const entriesPerPage = 5;

//   const indexOfLast = currentPage * entriesPerPage;
//   const indexOfFirst = indexOfLast - entriesPerPage;

//   const currentEntries = successfulWithdrawals.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(successfulWithdrawals.length / entriesPerPage);

//   return (
//     <div className="flex flex-col w-full">
//       <div className="overflow-x-auto rounded-xl border border-border bg-white dark:bg-[#1a1a1a] pb-6">
//         <table className="w-full text-center">
//           <thead>
//             <tr
//               className="border-b border-border"
//               style={{ background: "rgba(245, 237, 229, 1)" }}
//             >
//               <th className="px-6 py-4 text-sm font-semibold dark:text-black">Name</th>
//               <th className="px-6 py-4 text-sm font-semibold dark:text-black">Email</th>
//               <th className="px-6 py-4 text-sm font-semibold dark:text-black">Date & Time</th>
//               <th className="px-6 py-4 text-sm font-semibold dark:text-black">Event Name</th>
//               <th className="px-6 py-4 text-sm font-semibold dark:text-black">Amount</th>
//               <th className="px-6 py-4 text-sm font-semibold dark:text-black">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentEntries.map((row, i) => (
//               <tr
//                 key={i}
//                 className="border-b border-border hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
//               >
//                 <td className="pl-10 py-4">
//                   <div className="flex items-center gap-3">
//                     <Image
//                       src={row.avatar}
//                       width={40}
//                       height={40}
//                       alt={row.name}
//                       className="rounded-full"
//                     />
//                     <span>{row.name}</span>
//                   </div>
//                 </td>
//                 <td>{row.email}</td>
//                 <td>
//                   {row.date}
//                   <br />
//                   <span className="text-xs opacity-70">{row.time}</span>
//                 </td>
//                 <td>{row.eventName}</td>
//                 <td>${row.amount}</td>
//                 <td>
//                   <span className="px-4 py-1.5 bg-green-600 text-white rounded-full">
//                     Successful
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {/* PAGINATION MUST BE HERE */}
//         {totalPages > 1 && (
//           <div className="flex justify-center gap-2 mt-4 mb-4">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               className="px-3 py-1 border rounded disabled:opacity-40"
//             >
//               Prev
//             </button>

//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-3 py-1 border rounded ${
//                   currentPage === i + 1
//                     ? "bg-black text-white dark:bg-white dark:text-black"
//                     : ""
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               className="px-3 py-1 border rounded disabled:opacity-40"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
