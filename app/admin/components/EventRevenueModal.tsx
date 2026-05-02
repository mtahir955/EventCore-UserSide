"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { SAAS_Tenant_ID } from "@/config/sasTenantId";
import apiClient from "@/lib/apiClient";
import {
  formatCurrency,
  normalizeAddOnBreakdowns,
  normalizeTicketTypeBreakdowns,
  type TicketTypeBreakdown,
} from "@/lib/hostDashboardAnalytics";

interface EventRevenueModalProps {
  isOpen: boolean;
  event: any;
  onClose: () => void;
}

type RevenueSummary = {
  eventId: string;
  eventName: string;
  ticketsSold: number;
  totalRevenue: number;
  organizerEarning: number;
  currency: string;
  ticketTypeBreakdown: TicketTypeBreakdown[];
  revenueTypeBreakdown: TicketTypeBreakdown[];
  addOnBreakdown: TicketTypeBreakdown[];
  addOnRevenueBreakdown: TicketTypeBreakdown[];
};

export function EventRevenueModal({
  isOpen,
  event,
  onClose,
}: EventRevenueModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<RevenueSummary | null>(null);

  useEffect(() => {
    if (!isOpen || !event?.id) return;

    const fetchRevenue = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔐 Get admin token
        // const token =
        //   typeof window !== "undefined"
        //     ? localStorage.getItem("adminToken")
        //     : null;

        // if (!token) {
        //   setError("Authentication token missing");
        //   return;
        // }

        // 🏷️ Get selected tenantId (saved from HostManagementTable)
        const tenantId =
          typeof window !== "undefined"
            ? localStorage.getItem("selectedTenantId")
            : null;

        if (!tenantId) {
          setError("Tenant not selected");
          return;
        }

        // const res = await axios.get(
        //   `${API_BASE_URL}/events/${event.id}/revenue-summary`,
        //   {
        //     params: {
        //       tenantId, // ✅ DYNAMIC TENANT ID
        //     },
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //       "x-tenant-id": SAAS_Tenant_ID, // SaaS validation header
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );
        const res = await apiClient.get(`/events/${event.id}/revenue-summary`, {
          params: { tenantId }, // keep this (it’s NOT the SaaS tenant header)
        });

        const apiData = res.data?.data;
        const ticketBreakdowns = normalizeTicketTypeBreakdowns(apiData);
        const addOnBreakdowns = normalizeAddOnBreakdowns(apiData);

        setSummary({
          eventId: apiData.eventId,
          eventName: apiData.eventName,
          ticketsSold: apiData.ticketsSold ?? 0,
          totalRevenue: apiData.totalRevenue ?? 0,
          organizerEarning: apiData.organizer?.amount ?? 0,
          currency: apiData.currency ?? "USD",
          ticketTypeBreakdown: ticketBreakdowns.ticketBreakdown,
          revenueTypeBreakdown: ticketBreakdowns.revenueBreakdown,
          addOnBreakdown: addOnBreakdowns.addOnBreakdown,
          addOnRevenueBreakdown: addOnBreakdowns.revenueBreakdown,
        });
      } catch (err) {
        console.error("Revenue summary error:", err);
        setError("Failed to load revenue summary");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [isOpen, event?.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold">Event Revenue</h2>
            <p className="text-sm text-muted-foreground">
              {summary?.eventName || event?.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {loading && (
            <p className="text-center text-sm text-muted-foreground">
              Loading revenue summary...
            </p>
          )}

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          {summary && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Tickets Sold
                  </p>
                  <p className="text-xl font-semibold">{summary.ticketsSold}</p>
                </div>

                <div className="rounded-xl border p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Revenue
                  </p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(summary.totalRevenue, summary.currency)}
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="rounded-xl border p-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Organizer Earnings
                  </span>
                  <span className="font-medium">
                    {formatCurrency(summary.organizerEarning, summary.currency)}
                  </span>
                </div>
              </div>

              <RevenueBreakdownList
                title="Tickets by type"
                emptyText="No ticket type data for this range."
                items={summary.ticketTypeBreakdown}
                getValue={(item) => item.ticketsSold.toLocaleString()}
              />

              <RevenueBreakdownList
                title="Revenue by type"
                emptyText="No revenue breakdown for this range."
                items={summary.revenueTypeBreakdown}
                getValue={(item) => formatCurrency(item.revenue, summary.currency)}
              />

              <RevenueBreakdownList
                title="Add-ons sold"
                emptyText="No add-on sales for this range."
                items={summary.addOnBreakdown}
                getValue={(item) => item.ticketsSold.toLocaleString()}
              />

              <RevenueBreakdownList
                title="Add-on revenue"
                emptyText="No add-on revenue for this range."
                items={summary.addOnRevenueBreakdown}
                getValue={(item) => formatCurrency(item.revenue, summary.currency)}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function RevenueBreakdownList({
  title,
  emptyText,
  items,
  getValue,
}: {
  title: string;
  emptyText: string;
  items: TicketTypeBreakdown[];
  getValue: (item: TicketTypeBreakdown) => string;
}) {
  return (
    <div className="rounded-xl border p-4">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${title}-${item.ticketType}`}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="truncate text-muted-foreground">
                {item.ticketType}
              </span>
              <span className="font-semibold">{getValue(item)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// "use client";

// import { X } from "lucide-react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { SAAS_Tenant_ID } from "@/config/sasTenantId";

// interface EventRevenueModalProps {
//   isOpen: boolean;
//   event: any;
//   onClose: () => void;
// }

// export function EventRevenueModal({
//   isOpen,
//   event,
//   onClose,
// }: EventRevenueModalProps) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [summary, setSummary] = useState<any>(null);

//   useEffect(() => {
//     if (!isOpen || !event?.id) return;

//     const fetchRevenue = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // ✅ Get token safely on client
//         const token =
//           typeof window !== "undefined"
//             ? localStorage.getItem("adminToken")
//             : null;

//         if (!token) {
//           setError("Authentication token missing");
//           return;
//         }

//         const res = await axios.get(
//           `${API_BASE_URL}/events/${event.id}/revenue-summary?tenantId=b1437327-ed11-4b0d-9fcc-a5c0282d1e17`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`, // ✅ TOKEN ADDED
//               "x-tenant-id": SAAS_Tenant_ID,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         setSummary(res.data?.data);
//       } catch (err: any) {
//         console.error("Revenue summary error:", err);
//         setError("Failed to load revenue summary");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRevenue();
//   }, [isOpen, event]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="relative w-full max-w-md rounded-2xl border border-border bg-background shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-border">
//           <div>
//             <h2 className="text-lg font-semibold">Event Revenue</h2>
//             <p className="text-sm text-muted-foreground">
//               {summary?.eventName || event?.name}
//             </p>
//           </div>

//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-secondary rounded-full"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-5">
//           {loading && (
//             <p className="text-center text-sm text-muted-foreground">
//               Loading revenue summary...
//             </p>
//           )}

//           {error && (
//             <p className="text-center text-sm text-red-500">{error}</p>
//           )}

//           {summary && (
//             <>
//               {/* Summary Cards */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="rounded-xl border p-4 text-center">
//                   <p className="text-xs text-muted-foreground mb-1">
//                     Tickets Sold
//                   </p>
//                   <p className="text-xl font-semibold">
//                     {summary.ticketsSold}
//                   </p>
//                 </div>

//                 <div className="rounded-xl border p-4 text-center">
//                   <p className="text-xs text-muted-foreground mb-1">
//                     Total Revenue
//                   </p>
//                   <p className="text-xl font-semibold">
//                     ${summary.totalRevenue.toFixed(2)}
//                   </p>
//                 </div>
//               </div>

//               {/* Breakdown */}
//               <div className="rounded-xl border p-4 space-y-4">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">
//                     EventCore ({summary.platformFeePercent}%)
//                   </span>
//                   <span className="font-bold text-blue-600">
//                     ${summary.platformShare.toFixed(2)}
//                   </span>
//                 </div>

//                 <div className="h-px bg-border" />

//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted-foreground">
//                     Organizer Earnings
//                   </span>
//                   <span className="font-medium">
//                     ${summary.organizerEarning.toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

//code before integration

// "use client";

// import { X } from "lucide-react";

// export function EventRevenueModal({
//   isOpen,
//   event,
//   onClose,
// }: {
//   isOpen: boolean;
//   event: any;
//   onClose: () => void;
// }) {
//   if (!isOpen || !event) return null;

//   const totalRevenue = event.ticketsSold * event.ticketPrice;
//   const eventCoreShare = totalRevenue * 0.1;
//   const organizerEarning = totalRevenue - eventCoreShare;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="relative w-full max-w-md rounded-2xl border border-border bg-background shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-border">
//           <div>
//             <h2 className="text-lg font-semibold text-foreground">
//               Event Revenue
//             </h2>
//             <p className="text-sm text-muted-foreground">{event.name}</p>
//           </div>

//           <button
//             onClick={onClose}
//             className="rounded-full p-2 hover:bg-secondary transition"
//           >
//             <X className="h-5 w-5 text-muted-foreground" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-5">
//           {/* Summary Cards */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="rounded-xl border border-border bg-secondary/40 p-4 text-center">
//               <p className="text-xs text-muted-foreground mb-1">Tickets Sold</p>
//               <p className="text-xl font-semibold text-foreground">
//                 {event.ticketsSold}
//               </p>
//             </div>

//             <div className="rounded-xl border border-border bg-secondary/40 p-4 text-center">
//               <p className="text-xs text-muted-foreground mb-1">
//                 Total Revenue
//               </p>
//               <p className="text-xl font-semibold text-foreground">
//                 ${totalRevenue.toFixed(2)}
//               </p>
//             </div>
//           </div>

//           {/* Breakdown */}
//           <div className="rounded-xl border border-border p-4 space-y-4">
//             {/* EventCore – PRIMARY */}
//             <div className="flex items-center justify-between">
//               <span className="text-xl font-medium text-muted-foreground">
//                 EventCore (10%)
//               </span>
//               <span className="text-xl font-bold text-[#0077F7]">
//                 ${eventCoreShare.toFixed(2)}
//               </span>
//             </div>

//             <div className="h-px bg-border" />

//             {/* Organizer – SECONDARY */}
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-muted-foreground text-md">Organizer Earnings</span>
//               <span className="font-medium text-foreground">
//                 ${organizerEarning.toFixed(2)}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-border flex justify-end">
//           <button
//             onClick={onClose}
//             className="
//               px-5 py-2.5
//               rounded-lg
//               bg-[#0077F7]
//               text-white
//               text-sm
//               font-medium
//               hover:bg-blue-600
//               transition
//             "
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
