"use client";

import { X } from "lucide-react";

export function EventRevenueModal({
  isOpen,
  event,
  onClose,
}: {
  isOpen: boolean;
  event: any;
  onClose: () => void;
}) {
  if (!isOpen || !event) return null;

  const totalRevenue = event.ticketsSold * event.ticketPrice;
  const eventCoreShare = totalRevenue * 0.1;
  const organizerEarning = totalRevenue - eventCoreShare;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Event Revenue
            </h2>
            <p className="text-sm text-muted-foreground">{event.name}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-secondary transition"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-secondary/40 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Tickets Sold</p>
              <p className="text-xl font-semibold text-foreground">
                {event.ticketsSold}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Total Revenue
              </p>
              <p className="text-xl font-semibold text-foreground">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="rounded-xl border border-border p-4 space-y-4">
            {/* EventCore – PRIMARY */}
            <div className="flex items-center justify-between">
              <span className="text-md font-medium text-muted-foreground">
                Platform (10%)
              </span>
              <span className="text-md font-bold text-[#D19537]">
                ${eventCoreShare.toFixed(2)}
              </span>
            </div>

            <div className="h-px bg-border" />

            {/* Organizer – SECONDARY */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground text-xl font-medium">
                Organizer Earnings
              </span>
              <span className=" text-xl font-medium text-foreground">
                ${organizerEarning.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="
              px-5 py-2.5
              rounded-lg
              bg-[#D19537]
              text-white
              text-sm
              font-medium
              hover:bg-[#e6ab4b]
              transition
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
