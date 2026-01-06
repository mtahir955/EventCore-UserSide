"use client";

import { useMemo, useState, useEffect } from "react";
import { PaymentWithdrawalModal } from "./Payment-withdrawal-modal";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

interface PaymentWithdrawalTableProps {
  status: "PENDING" | "DECLINED";
  data?: RefundRequest[];
  loading?: boolean;
}

export interface RefundRequest {
  refundRequestId: string;

  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;

  eventName: string;
  eventDate: string;
  amount: number;

  ticketId: string;
  ticketType: "General" | "VIP";
  ticketPrice: number;
  requestDate: string;
  paymentMethod: "Full Payment" | "Installments";
  refundAccount: string;

  status: "PENDING" | "APPROVED" | "DECLINED";
}

export function PaymentWithdrawalTable({
  status,
  data = [],
  loading,
}: PaymentWithdrawalTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<RefundRequest | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const filteredRequests = data.filter((req) => req.status === status);

  const totalPages = Math.ceil(filteredRequests.length / entriesPerPage);

  const [isCreditEnabled, setIsCreditEnabled] = useState<boolean>(false);

  const currentRows = useMemo(() => {
    const indexOfLast = currentPage * entriesPerPage;
    const indexOfFirst = indexOfLast - entriesPerPage;
    return filteredRequests.slice(indexOfFirst, indexOfLast);
  }, [currentPage, filteredRequests]);

  const handleAddCredit = async (payload: {
    refundRequestId: string;
    buyerEmail: string;
    amount: number;
    reason: string;
    expiresAt: string;
  }) => {
    if (!selected) return null;

    try {
      const token = localStorage.getItem("hostToken");
      if (!token) return null;

      const res = await axios.post(
        `${API_BASE_URL}/tickets/admin/refunds/${payload.refundRequestId}/credit`,
        {
          refundRequestId: payload.refundRequestId,
          amount: payload.amount,
          reason: payload.reason,
          expiryDate: payload.expiresAt,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": HOST_Tenant_ID,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const usdValue = res.data.data.usdValue ?? 0;
      const remaining = (selected.amount ?? 0) - usdValue;

      setSelected((prev) => (prev ? { ...prev, amount: remaining } : prev));
      return remaining;
    } catch (error: any) {
      console.error(
        "❌ Add credit failed",
        error?.response?.data || error.message
      );
      return null;
    }
  };

  const handleRefund = async (payload: {
    refundRequestId: string;
    buyerEmail: string;
    message: string;
    receiptFileName?: string;
    receiptFile?: File;
    amount: number;
  }) => {
    try {
      const token = localStorage.getItem("hostToken");
      if (!token) return;

      const formData = new FormData();
      formData.append("refundRequestId", payload.refundRequestId);
      formData.append("amount", payload.amount.toString());
      formData.append("message", payload.message);

      if (payload.receiptFile) {
        formData.append("receipt", payload.receiptFile);
      }

      await axios.post(
        `${API_BASE_URL}/tickets/admin/refunds/${payload.refundRequestId}/refund`,
        formData,
        {
          headers: {
            "x-tenant-id": HOST_Tenant_ID,
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      console.error("❌ Refund failed", error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const token = localStorage.getItem("hostToken");
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/tenants/my/features`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-id": HOST_Tenant_ID,
          },
        });

        setIsCreditEnabled(
          Boolean(res.data?.data?.features?.creditSystem?.enabled)
        );
      } catch (err) {
        setIsCreditEnabled(false);
      }
    };

    fetchFeatures();
  }, []);

  return (
    <div className="flex flex-col w-full gap-10">
      <div className="flex justify-center w-full">
        <div className="bg-background rounded-xl border border-border overflow-x-auto w-full max-w-7xl pb-6">
          <table className="w-full text-left">
            <thead>
              <tr
                className="border-b border-border"
                style={{ background: "rgba(245, 237, 229, 1)" }}
              >
                <th className="px-6 py-4 text-sm font-semibold text-foreground dark:text-black">
                  Buyer
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground dark:text-black">
                  Email
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground dark:text-black">
                  Phone
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground dark:text-black">
                  Event Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground dark:text-black">
                  Date
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground text-right dark:text-black">
                  Amount
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground text-center dark:text-black">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-sm text-muted-foreground"
                  >
                    Loading refund requests...
                  </td>
                </tr>
              ) : currentRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-sm text-muted-foreground"
                  >
                    No refund requests found.
                  </td>
                </tr>
              ) : (
                currentRows.map((req) => (
                  <tr
                    key={req.refundRequestId}
                    onClick={() => {
                      setSelected(req);
                      setIsModalOpen(true);
                    }}
                    className="border-b border-border last:border-b-0 hover:bg-secondary/50 cursor-pointer transition-colors"
                  >
                    {/* BUYER */}
                    <td className="px-6 py-4">
                      <div className="leading-tight">
                        <p className="text-sm font-medium text-foreground">
                          {req.buyerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {req.refundRequestId}
                        </p>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-6 py-4 text-sm">{req.buyerEmail}</td>

                    {/* PHONE */}
                    <td className="px-6 py-4 text-sm">{req.buyerPhone}</td>

                    {/* EVENT */}
                    {/* EVENT */}
                    <td className="px-6 py-4 text-sm max-w-[220px]">
                      <p className="truncate" title={req.eventName}>
                        {req.eventName}
                      </p>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4 text-sm">{req.eventDate}</td>

                    {/* AMOUNT */}
                    <td className="px-6 py-4 text-sm text-right font-medium">
                      ${req.amount.toFixed(2)}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
              ${
                req.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  : req.status === "APPROVED"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }
            `}
                      >
                        {req.status === "PENDING"
                          ? "Pending"
                          : req.status === "APPROVED"
                          ? "Approved"
                          : "Declined"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4 mb-2">
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

          {/* Modal */}
          {/* <PaymentWithdrawalModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            request={selected}
            onDecision={(payload) => console.log("DECISION:", payload)}
            // onSendReceipt={(payload) => console.log("RECEIPT:", payload)}
            onSendReceipt={handleRefund}
            // onAddCredit={(payload) => console.log("ADD CREDIT:", payload)}
            onAddCredit={handleAddCredit}
          /> */}
          <PaymentWithdrawalModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            request={selected}
            onDecision={(payload) => console.log("DECISION:", payload)}
            onSendReceipt={handleRefund}
            onAddCredit={handleAddCredit}
            creditEnabled={isCreditEnabled} // ✅ NEW
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

//   // 🔹 Pagination state (5 entries per page)
//   const [currentPage, setCurrentPage] = useState(1);
//   const entriesPerPage = 5;

//   const indexOfLast = currentPage * entriesPerPage;
//   const indexOfFirst = indexOfLast - entriesPerPage;

//   const currentHosts = hosts.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(hosts.length / entriesPerPage);

//   return (
//     <div className="flex flex-col w-full gap-10">
//       {/* ====================== Pending Withdrawal Requests Table ====================== */}
//       <div className="flex justify-center w-full">
//         <div className="bg-background rounded-xl border border-border overflow-x-auto w-full max-w-7xl pb-6">
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
//               {currentHosts.map((host, index) => (
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

//           {/* PAGINATION MUST BE HERE */}
//           {totalPages > 1 && (
//             <div className="flex justify-center gap-2 mt-4 mb-4">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((p) => p - 1)}
//                 className="px-3 py-1 border rounded disabled:opacity-40"
//               >
//                 Prev
//               </button>

//               {[...Array(totalPages)].map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`px-3 py-1 border rounded ${
//                     currentPage === i + 1
//                       ? "bg-black text-white dark:bg-white dark:text-black"
//                       : ""
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}

//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((p) => p + 1)}
//                 className="px-3 py-1 border rounded disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           )}

//           {/* 🔹 Modal */}
//           <PaymentWithdrawalModal
//             isOpen={ismodalopen}
//             onClose={() => setIsmodalopen(false)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
