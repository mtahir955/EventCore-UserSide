"use client";

import { cn } from "@/lib/utils";

interface EventItem {
  id: string;
  name: string;
  date: string;
  location: string;
  ticketPrice: number;
  status: "Upcoming" | "Previous";
  ticketsSold: number;
}

const mockEvents: EventItem[] = [
  {
    id: "1",
    name: "Summer Beats Festival",
    date: "2025-07-12",
    location: "California",
    ticketPrice: 120,
    status: "Upcoming",
    ticketsSold: 320,
  },
  {
    id: "2",
    name: "Starry Nights",
    date: "2025-05-01",
    location: "New York",
    ticketPrice: 150,
    status: "Previous",
    ticketsSold: 540,
  },
];

export function TenantEventsTable({
  onRowClick,
}: {
  onRowClick: (event: EventItem) => void;
}) {
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
          {mockEvents.map((event) => (
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
