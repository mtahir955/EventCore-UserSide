"use client";

import Image from "next/image";
import { useState } from "react";
import { PaymentWithdrawalModal } from "./Payment-withdrawal-modal";

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

const hosts: Host[] = [
  {
    id: "1",
    name: "Daniel Carter",
    email: "danielc@gmail.com",
    date: "12 Nov 2025",
    time: "07:00 PM",
    eventName: "Starry Nights Music Fest",
    avatar: "/avatars/avatar-1.png",
    amount: 2500,
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    email: "sarahm@gmail.com",
    date: "18 Nov 2025",
    time: "06:30 PM",
    eventName: "Good Life Trainings Meetup",
    avatar: "/avatars/avatar-1.png",
    amount: 4200,
  },
  {
    id: "3",
    name: "Emily Carter",
    email: "emilyc@gmail.com",
    date: "20 Nov 2025",
    time: "05:00 PM",
    eventName: "Tech Innovators Expo",
    avatar: "/avatars/avatar-1.png",
    amount: 3900,
  },
  {
    id: "4",
    name: "Nathan Blake",
    email: "nathanb@gmail.com",
    date: "25 Nov 2025",
    time: "08:00 PM",
    eventName: "Cultural Food & Music Night",
    avatar: "/avatars/avatar-1.png",
    amount: 1800,
  },
  {
    id: "5",
    name: "Taylor Morgan",
    email: "taylorm@gmail.com",
    date: "30 Nov 2025",
    time: "04:00 PM",
    eventName: "Business Leadership Summit",
    avatar: "/avatars/avatar-1.png",
    amount: 2100,
  },
];

export function PaymentWithdrawalTable() {
  const [ismodalopen, setIsmodalopen] = useState(false);

  // 🔹 Pagination state (5 entries per page)
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;

  const currentHosts = hosts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(hosts.length / entriesPerPage);

  return (
    <div className="flex flex-col w-full gap-10">
      {/* ====================== Pending Withdrawal Requests Table ====================== */}
      <div className="flex justify-center w-full">
        <div className="bg-background rounded-xl border border-border overflow-x-auto w-full max-w-7xl pb-6">
          <table className="w-full text-center">
            <thead>
              <tr
                className="border-b border-border"
                style={{ background: "rgba(245, 237, 229, 1)" }}
              >
                <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                  Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                  Event Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                  Amount
                </th>
                <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {currentHosts.map((host, index) => (
                <tr
                  key={`${host.id}-${index}`}
                  onClick={() => setIsmodalopen(true)}
                  className="border-b border-border last:border-b-0 hover:bg-secondary/50 cursor-pointer transition-colors"
                >
                  {/* USER NAME + AVATAR */}
                  <td className="pl-10 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={host.avatar}
                          alt={host.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-foreground font-medium">
                        {host.name}
                      </span>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-sm text-foreground">
                    {host.email}
                  </td>

                  {/* DATE + TIME */}
                  <td className="px-6 py-4 text-sm text-foreground">
                    {host.date} <br />
                    <span className="text-xs text-muted-foreground">
                      {host.time}
                    </span>
                  </td>

                  {/* EVENT NAME */}
                  <td className="px-6 py-4 text-sm text-foreground">
                    {host.eventName}
                  </td>

                  {/* AMOUNT */}
                  <td className="px-6 py-4 text-sm text-foreground">
                    ${host.amount}
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        className="rounded-full px-6 py-1.5 text-sm font-medium text-white"
                        style={{ background: "rgba(209, 149, 55, 1)" }}
                      >
                        Accept
                      </button>
                      <button className="rounded-full bg-accent px-6 py-1.5 text-sm font-medium text-accent-foreground">
                        Reject
                      </button>
                    </div>
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

          {/* 🔹 Modal */}
          <PaymentWithdrawalModal
            isOpen={ismodalopen}
            onClose={() => setIsmodalopen(false)}
          />
        </div>
      </div>
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { PaymentWithdrawalModal } from "./Payment-withdrawal-modal";

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

// const hosts: Host[] = [
//   {
//     id: "1",
//     name: "Daniel Carter",
//     email: "danielc@gmail.com",
//     date: "12 Nov 2025",
//     time: "07:00 PM",
//     eventName: "Starry Nights Music Fest",
//     avatar: "/avatars/avatar-1.png",
//     amount: 2500,
//   },
//   {
//     id: "2",
//     name: "Sarah Mitchell",
//     email: "sarahm@gmail.com",
//     date: "18 Nov 2025",
//     time: "06:30 PM",
//     eventName: "Good Life Trainings Meetup",
//     avatar: "/avatars/avatar-1.png",
//     amount: 4200,
//   },
//   {
//     id: "3",
//     name: "Emily Carter",
//     email: "emilyc@gmail.com",
//     date: "20 Nov 2025",
//     time: "05:00 PM",
//     eventName: "Tech Innovators Expo",
//     avatar: "/avatars/avatar-1.png",
//     amount: 3900,
//   },
//   {
//     id: "4",
//     name: "Nathan Blake",
//     email: "nathanb@gmail.com",
//     date: "25 Nov 2025",
//     time: "08:00 PM",
//     eventName: "Cultural Food & Music Night",
//     avatar: "/avatars/avatar-1.png",
//     amount: 1800,
//   },
//   {
//     id: "5",
//     name: "Taylor Morgan",
//     email: "taylorm@gmail.com",
//     date: "30 Nov 2025",
//     time: "04:00 PM",
//     eventName: "Business Leadership Summit",
//     avatar: "/avatars/avatar-1.png",
//     amount: 2100,
//   },
// ];

// export function PaymentWithdrawalTable() {
//   const [ismodalopen, setIsmodalopen] = useState(false);

//   return (
//     <div className="flex flex-col w-full gap-10">
//       {/* ====================== Pending Withdrawal Requests Table ====================== */}
//       <div className="flex justify-center w-full">
//         <div className="bg-background rounded-xl border border-border overflow-hidden overflow-x-auto w-full max-w-7xl">
//           <table className="w-full text-center">
//             <thead>
//               <tr
//                 className="border-b border-border"
//                 style={{ background: "rgba(245, 237, 229, 1)" }}
//               >
//                 <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
//                   Name
//                 </th>
//                 <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
//                   Email
//                 </th>
//                 <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
//                   Date & Time
//                 </th>
//                 <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
//                   Event Name
//                 </th>
//                 <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
//                   Amount
//                 </th>
//                 <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
//                   Action
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {hosts.map((host, index) => (
//                 <tr
//                   key={`${host.id}-${index}`}
//                   onClick={() => setIsmodalopen(true)}
//                   className="border-b border-border last:border-b-0 hover:bg-secondary/50 cursor-pointer transition-colors"
//                 >
//                   {/* USER NAME + AVATAR */}
//                   <td className="pl-10 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full overflow-hidden">
//                         <Image
//                           src={host.avatar}
//                           alt={host.name}
//                           width={40}
//                           height={40}
//                           className="object-cover"
//                         />
//                       </div>
//                       <span className="text-sm text-foreground font-medium">
//                         {host.name}
//                       </span>
//                     </div>
//                   </td>

//                   {/* EMAIL */}
//                   <td className="px-6 py-4 text-sm text-foreground">
//                     {host.email}
//                   </td>

//                   {/* DATE + TIME */}
//                   <td className="px-6 py-4 text-sm text-foreground">
//                     {host.date} <br />
//                     <span className="text-xs text-muted-foreground">
//                       {host.time}
//                     </span>
//                   </td>

//                   {/* EVENT NAME */}
//                   <td className="px-6 py-4 text-sm text-foreground">
//                     {host.eventName}
//                   </td>

//                   {/* AMOUNT */}
//                   <td className="px-6 py-4 text-sm text-foreground">
//                     ${host.amount}
//                   </td>

//                   {/* ACTION BUTTONS */}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2 justify-center">
//                       <button
//                         className="rounded-full px-6 py-1.5 text-sm font-medium text-white"
//                         style={{ background: "rgba(209, 149, 55, 1)" }}
//                       >
//                         Accept
//                       </button>
//                       <button className="rounded-full bg-accent px-6 py-1.5 text-sm font-medium text-accent-foreground">
//                         Reject
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <PaymentWithdrawalModal
//             isOpen={ismodalopen}
//             onClose={() => setIsmodalopen(false)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
