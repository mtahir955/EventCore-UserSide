"use client";

import { useState } from "react";
import Image from "next/image";

interface Host {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  eventName: string;
  amount: number;
  avatar: string;
}

const successfulWithdrawals: Host[] = [
  {
    id: "h1",
    name: "Daniel Carter",
    email: "info@gmail.com",
    date: "12 Nov 2025",
    time: "07:00 PM",
    eventName: "Starry Nights Music Fest",
    avatar: "/avatars/avatar-1.png",
    amount: 1500,
  },
  {
    id: "h2",
    name: "Sarah Mitchell",
    email: "host@gmail.com",
    date: "18 Nov 2025",
    time: "06:30 PM",
    eventName: "Good Life Trainings Meetup",
    avatar: "/avatars/avatar-1.png",
    amount: 2300,
  },
  {
    id: "h4",
    name: "Emily Carter",
    email: "emily@gmail.com",
    date: "20 Nov 2025",
    time: "05:00 PM",
    eventName: "Tech Innovators Expo",
    avatar: "/avatars/avatar-1.png",
    amount: 3200,
  },
  {
    id: "h5",
    name: "Emily Carter",
    email: "emily@gmail.com",
    date: "20 Nov 2025",
    time: "05:00 PM",
    eventName: "Tech Innovators Expo",
    avatar: "/avatars/avatar-1.png",
    amount: 3200,
  },
  {
    id: "h6",
    name: "Emily Carter",
    email: "emily@gmail.com",
    date: "20 Nov 2025",
    time: "05:00 PM",
    eventName: "Tech Innovators Expo",
    avatar: "/avatars/avatar-1.png",
    amount: 3200,
  },
];

export function PaymentSuccessTable() {
  // SEPARATE PAGINATION FOR THIS TABLE
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;

  const currentEntries = successfulWithdrawals.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(successfulWithdrawals.length / entriesPerPage);

  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto rounded-xl border border-border bg-white dark:bg-[#1a1a1a] pb-6">
        <table className="w-full text-center">
          <thead>
            <tr
              className="border-b border-border"
              style={{ background: "rgba(245, 237, 229, 1)" }}
            >
              <th className="px-6 py-4 text-sm font-semibold">Name</th>
              <th className="px-6 py-4 text-sm font-semibold">Email</th>
              <th className="px-6 py-4 text-sm font-semibold">Date & Time</th>
              <th className="px-6 py-4 text-sm font-semibold">Event Name</th>
              <th className="px-6 py-4 text-sm font-semibold">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {currentEntries.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
              >
                <td className="pl-10 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={row.avatar}
                      width={40}
                      height={40}
                      alt={row.name}
                      className="rounded-full"
                    />
                    <span>{row.name}</span>
                  </div>
                </td>
                <td>{row.email}</td>
                <td>
                  {row.date}
                  <br />
                  <span className="text-xs opacity-70">{row.time}</span>
                </td>
                <td>{row.eventName}</td>
                <td>${row.amount}</td>
                <td>
                  <span className="px-4 py-1.5 bg-green-600 text-white rounded-full">
                    Successful
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* PAGINATION MUST BE HERE */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4 mb-4">
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
//   return (
//     <div className="flex flex-col w-full gap-10">
//       <div className="flex flex-col w-full">
//         <div className="flex justify-center w-full">
//           <div className="bg-background rounded-xl border border-border overflow-hidden overflow-x-auto w-full max-w-7xl">
//             <table className="w-full text-center">
//               <thead>
//                 <tr
//                   className="border-b border-border"
//                   style={{ background: "rgba(245, 237, 229, 1)" }}
//                 >
//                   <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
//                     Name
//                   </th>
//                   <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
//                     Email
//                   </th>
//                   <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
//                     Date & Time
//                   </th>
//                   <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
//                     Event Name
//                   </th>
//                   <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
//                     Amount
//                   </th>
//                   <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
//                     Status
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {successfulWithdrawals.map((history, index) => (
//                   <tr
//                     key={`${history.id}-${index}`}
//                     className="border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors"
//                   >
//                     {/* NAME + AVATAR */}
//                     <td className="pl-10 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full overflow-hidden">
//                           <Image
//                             src={history.avatar}
//                             alt={history.name}
//                             width={40}
//                             height={40}
//                             className="object-cover"
//                           />
//                         </div>
//                         <span className="text-sm text-foreground font-medium">
//                           {history.name}
//                         </span>
//                       </div>
//                     </td>

//                     {/* EMAIL */}
//                     <td className="px-6 py-4 text-sm text-foreground">
//                       {history.email}
//                     </td>

//                     {/* DATE & TIME */}
//                     <td className="px-6 py-4 text-sm text-foreground">
//                       {history.date} <br />
//                       <span className="text-xs text-muted-foreground">
//                         {history.time}
//                       </span>
//                     </td>

//                     {/* EVENT NAME */}
//                     <td className="px-6 py-4 text-sm text-foreground">
//                       {history.eventName}
//                     </td>

//                     {/* AMOUNT */}
//                     <td className="px-6 py-4 text-sm text-foreground">
//                       ${history.amount}
//                     </td>

//                     {/* STATUS BADGE */}
//                     <td className="px-6 py-4">
//                       <span className="rounded-full bg-green-600 text-white px-4 py-1.5 text-sm font-medium">
//                         Successful
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
