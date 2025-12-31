"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ConfirmationModal } from "./confirmation-modal";
import { useState } from "react";

interface Event {
  name: string;
  date: string;
  status: "Active" | "Completed" | "Upcoming";
}

export function RecentEventsTable({ events }: { events: any[] }) {
  const [isdeletemodalopen, setisdeletemodalopen] = useState(false);

  return (
    <div className="bg-background rounded-xl p-6 shadow-sm w-full">
      <h2 className="text-xl font-bold text-foreground mb-6 text-left">
        Ongoing Events
      </h2>

      <div className="border rounded-xl w-full overflow-hidden">
        <div className="w-full md:overflow-x-visible">
          <table className="w-full text-center border-collapse text-[12px] sm:text-[13px] md:text-sm scale-[1] sm:scale-[0.95] md:scale-100 origin-top">
            <thead>
              <tr style={{ backgroundColor: "rgba(245, 237, 229, 1)" }}>
                {["Event Name", "Date", "Status", "Action"].map(
                  (header, idx) => (
                    <th
                      key={idx}
                      className="py-2 sm:py-4 px-1 sm:px-4 font-semibold dark:text-black text-foreground align-middle whitespace-nowrap"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {events.map((event, index) => (
                <tr
                  key={index}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  {/* Event Name */}
                  <td className="py-3 sm:py-4 px-1 sm:px-4 text-[8px] sm:text-[14px] text-foreground sm:align-middle">
                    {event.name}
                  </td>

                  {/* Date */}
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-[8px] sm:text-[14px] text-foreground align-middle">
                    {event.date}
                  </td>

                  {/* Status */}
                  <td className="py-3 sm:py-4 px-2 sm:px-4 align-middle">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center px-1 sm:px-3 py-[2px] sm:py-1 rounded-full text-[8px] sm:text-[14px] font-medium w-[70px] sm:w-[90px] text-center",
                        event.status === "Active" &&
                          "bg-green-100 text-green-700",
                        event.status === "Completed" &&
                          "bg-gray-100 text-gray-700",
                        event.status === "Upcoming" &&
                          "bg-blue-100 text-blue-700"
                      )}
                    >
                      {event.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 sm:py-4 px-2 sm:px-4 align-middle">
                    <div className="flex justify-center items-center gap-2 sm:gap-3">
                      <Link href="/recent-event-details">
                        <button className="hover:opacity-70 transition-opacity hover:cursor-pointer">
                          <Image
                            src="/icons/eye-icon.png"
                            alt="View"
                            width={18}
                            height={18}
                          />
                        </button>
                      </Link>
                      <button
                        className="hover:opacity-70 transition-opacity hover:cursor-pointer"
                        onClick={() => setisdeletemodalopen(true)}
                      >
                        <Image
                          src="/icons/trash-icon.png"
                          alt="Delete"
                          width={13}
                          height={13}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isdeletemodalopen}
        onClose={() => setisdeletemodalopen(false)}
        onConfirm={() => setisdeletemodalopen(false)}
      />
    </div>
  );
}