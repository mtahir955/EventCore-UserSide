"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TransferTicketModal } from "../components/transfer-ticket-modal";
import { RefundRequestModal } from "../components/refund-request-modal";

type TicketProps = {
  date: { day: string; month: string; weekday: string; time: string };
  title: string;
  location: string;
  type: string;
  price: string;
  quantity: number; // ✅ NEW
  cta?: string;
  ended?: boolean;
  highlight?: boolean;
  transferred?: boolean;
};

export function TicketCard({
  date,
  title,
  location,
  type,
  price,
  quantity,
  cta = "View Ticket",
  ended = false,
  highlight = false,
  transferred = false,
}: TicketProps) {
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  const handleDownloadTickets = () => {
    // Example: backend-generated PDF/ZIP per order
    // Replace with your real API endpoint
    const downloadUrl = `/api/tickets/download?title=${encodeURIComponent(
      title
    )}`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${title}-tickets.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Ticket card */}
      <div
        className={cn(
          "rounded-xl border border-border dark:border-gray-700 bg-card dark:bg-[#181818] text-card-foreground dark:text-gray-100 overflow-hidden flex flex-col sm:flex-row transition-colors duration-300 hover:shadow-lg dark:hover:shadow-blue-500/10"
        )}
      >
        {/* Left date rail */}
        <div
          className={cn(
            "w-full sm:w-[120px] shrink-0 text-center p-3 sm:p-4 flex sm:block items-center justify-around sm:justify-center",
            highlight
              ? "bg-[#0077F7] text-white"
              : "bg-[#EDEDED] text-black dark:bg-[#222222] dark:text-gray-100"
          )}
        >
          <div className="text-[18px] sm:text-[22px] font-semibold">
            {date.day}
          </div>
          <div className="text-[11px] sm:text-[12px] uppercase tracking-wide">
            {date.month}
          </div>
          <div className="hidden sm:block mt-6 text-[11px] font-medium">
            {date.weekday}
          </div>
          <div className="hidden sm:block text-[11px] font-medium">
            {date.time}
          </div>
          {/* Mobile-only stacked date */}
          <div className="block sm:hidden text-[10px] font-medium">
            {date.weekday}, {date.time}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-[16px] sm:text-[20px] font-semibold leading-tight">
                {title}
              </h3>

              <div className="mt-2 space-y-1 sm:space-y-2 text-[13px] sm:text-[14px]">
                {/* Location */}
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/location.png"
                    width={15}
                    height={15}
                    alt=""
                    className="dark:invert"
                  />
                  <span>{location}</span>
                </div>

                {/* Ticket Type */}
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/ticket.png"
                    width={15}
                    height={15}
                    alt=""
                    className="dark:invert"
                  />
                  <span>{type}</span>
                </div>
                {/* Ticket Quantity */}
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/ticket.png"
                    width={15}
                    height={15}
                    alt=""
                    className="dark:invert"
                  />
                  <span>
                    {quantity} {quantity === 1 ? "Ticket" : "Tickets"}
                  </span>
                </div>
              </div>
            </div>

            {/* Price + Buttons */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:gap-3 gap-2 mt-2 sm:mt-0">
              {!ended && (
                <div className="relative flex items-center gap-2">
                  {/* Transfer */}
                  <button
                    onClick={() => setTransferModalOpen(true)}
                    className="rounded-full text-white px-3 sm:px-4 py-1 text-[11px] sm:text-[12px] bg-black dark:bg-[#0077F7]"
                  >
                    Transfer
                  </button>

                  {/* 3-dot menu */}
                  <button
                    onClick={() => setMenuOpen((p) => !p)}
                    className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
                  >
                    ⋯
                  </button>

                  {/* Dropdown */}
                  {menuOpen && (
                    <div className="absolute right-0 top-9 w-44 bg-white dark:bg-[#1f1f1f] border rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => {
                          setRefundModalOpen(true);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Request Refund
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="text-[16px] sm:text-[22px] font-semibold">
                {price}
              </div>
              {/* Ticket Status Button */}
              {transferred ? (
                <span className="h-8 sm:h-9 rounded-full px-4 text-[12px] sm:text-[14px] font-semibold bg-purple-600 text-white grid place-items-center">
                  Transferred
                </span>
              ) : ended ? (
                <span className="h-8 sm:h-9 rounded-full px-4 text-[12px] sm:text-[14px] font-semibold bg-gray-300 dark:bg-[#333] text-gray-700 dark:text-gray-400 grid place-items-center">
                  Event Ended
                </span>
              ) : (
                <button
                  disabled={ended || transferred}
                  onClick={handleDownloadTickets}
                  className={`h-8 sm:h-9 rounded-full px-4 text-[12px] sm:text-[14px] font-medium transition
    ${
      ended || transferred
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#0077F7] text-white hover:opacity-90"
    }
  `}
                >
                  Download Tickets
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      <TransferTicketModal
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
        ticket={{ date, title, location, type, price }}
      />

      <RefundRequestModal
        open={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        onSubmit={(data) => {
          console.log("REFUND REQUEST:", {
            ticketTitle: title,
            ...data,
          });

          // later:
          // axios.post("/tickets/refund-request", payload)
        }}
      />
    </>
  );
}
