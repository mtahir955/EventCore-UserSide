"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/config/apiConfig";
import { SAAS_Tenant_ID } from "@/config/sasTenantId";

interface EventItem {
  id: string;
  name: string;
  date: string;
  location: string;
  ticketPrice: number;
  status: "Upcoming" | "Previous";
}

export function TenantEventsTable({
  tenantId,
  onRowClick,
}: {
  tenantId: string;
  onRowClick: (event: EventItem) => void;
}) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("adminToken");
        if (!token) {
          setError("Authentication required");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/tenants/${tenantId}/events`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": SAAS_Tenant_ID,
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`);
        }

        const json = await res.json();
        const rawEvents = json.data || json.items || json || [];

        const mapped = rawEvents.map((e: any) => ({
          id: e.id,
          name: e.name || e.title,
          date: e.startDate || e.date,
          location: e.location?.city || e.location || "-",
          ticketPrice: e.minTicketPrice || 0,
          status: new Date(e.startDate) > new Date() ? "Upcoming" : "Previous",
        }));

        setEvents(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    if (tenantId) fetchEvents();
  }, [tenantId]);

  return (
    <div className="bg-background rounded-xl border border-border overflow-x-auto">
      <table className="w-full text-center">
        <thead>
          <tr
            className="border-b border-border"
            style={{ background: "rgba(245, 237, 229, 1)" }}
          >
            <th className="px-6 py-4 text-sm font-semibold">Event Name</th>
            <th className="px-6 py-4 text-sm font-semibold">Date</th>
            <th className="px-6 py-4 text-sm font-semibold">Location</th>
            <th className="px-6 py-4 text-sm font-semibold">Ticket Price</th>
            <th className="px-6 py-4 text-sm font-semibold">Status</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={5} className="py-6 text-muted-foreground">
                Loading events...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={5} className="py-6 text-red-600">
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && events.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-muted-foreground">
                No events found
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            events.map((event) => (
              <tr
                key={event.id}
                onClick={() => onRowClick(event)}
                className="border-b border-border hover:bg-secondary/50 cursor-pointer transition"
              >
                <td className="px-6 py-4 font-medium">{event.name}</td>
                <td className="px-6 py-4">{event.date}</td>
                <td className="px-6 py-4">{event.location}</td>
                <td className="px-6 py-4">${event.ticketPrice}</td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium",
                      event.status === "Upcoming"
                        ? "bg-[#e8f5e9] text-[#1b5e20]"
                        : "bg-[#eeeeee] text-[#424242]"
                    )}
                  >
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

// "use client";

// import { cn } from "@/lib/utils";

// interface EventItem {
//   id: string;
//   name: string;
//   date: string;
//   location: string;
//   ticketPrice: number;
//   status: "Upcoming" | "Previous";
//   ticketsSold: number;
// }

// const mockEvents: EventItem[] = [
//   {
//     id: "1",
//     name: "Summer Beats Festival",
//     date: "2025-07-12",
//     location: "California",
//     ticketPrice: 120,
//     status: "Upcoming",
//     ticketsSold: 320,
//   },
//   {
//     id: "2",
//     name: "Starry Nights",
//     date: "2025-05-01",
//     location: "New York",
//     ticketPrice: 150,
//     status: "Previous",
//     ticketsSold: 540,
//   },
// ];

// export function TenantEventsTable({
//   onRowClick,
// }: {
//   onRowClick: (event: EventItem) => void;
// }) {
//   return (
//     <div className="bg-background rounded-xl border border-border overflow-x-auto">
//       <table className="w-full text-center">
//         <thead>
//           <tr
//             className="border-b border-border"
//             style={{ background: "rgba(245, 237, 229, 1)" }}
//           >
//             <th className="px-6 py-4 text-sm font-semibold">Event Name</th>
//             <th className="px-6 py-4 text-sm font-semibold">Date</th>
//             <th className="px-6 py-4 text-sm font-semibold">Location</th>
//             <th className="px-6 py-4 text-sm font-semibold">Ticket Price</th>
//             <th className="px-6 py-4 text-sm font-semibold">Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {mockEvents.map((event) => (
//             <tr
//               key={event.id}
//               onClick={() => onRowClick(event)}
//               className="border-b border-border hover:bg-secondary/50 cursor-pointer transition"
//             >
//               <td className="px-6 py-4 font-medium">{event.name}</td>
//               <td className="px-6 py-4">{event.date}</td>
//               <td className="px-6 py-4">{event.location}</td>
//               <td className="px-6 py-4">${event.ticketPrice}</td>
//               <td className="px-6 py-4">
//                 <span
//                   className={cn(
//                     "px-3 py-1.5 rounded-full text-xs font-medium",
//                     event.status === "Upcoming"
//                       ? "bg-[#e8f5e9] text-[#1b5e20]"
//                       : "bg-[#eeeeee] text-[#424242]"
//                   )}
//                 >
//                   {event.status}
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
