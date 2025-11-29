"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TransferTicketModal } from "../components/transfer-ticket-modal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CalendarModal } from "../../check-out/components/calendar-modal";

type TicketProps = {
  date: { day: string; month: string; weekday: string; time: string };
  title: string;
  location: string;
  type: string;
  price: string;
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
  cta = "View Ticket",
  ended = false,
  highlight = false,
  transferred = false,
}: TicketProps) {
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
              </div>
            </div>

            {/* Price + Buttons */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:gap-3 gap-2 mt-2 sm:mt-0">
              {!ended && (
                <button
                  onClick={() => setTransferModalOpen(true)}
                  className="rounded-full text-white px-3 sm:px-4 py-1 text-[11px] sm:text-[12px] bg-black dark:bg-[#0077F7] hover:bg-gray-800 dark:hover:bg-[#005fe0] transition"
                >
                  Transfer
                </button>
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
                  onClick={() => setIsShareModalOpen(true)}
                  className="h-8 sm:h-9 rounded-full px-4 text-[12px] sm:text-[14px] font-medium bg-[#0077F7] text-white hover:opacity-90 transition"
                >
                  {cta}
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

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        eventTitle="Starry Nights Music Fest"
        eventDescription="A magical evening under the stars with live bands, food stalls, and an electric crowd."
        eventImage="/images/hero-image.png"
        initialDate={new Date(2025, 5, 10)}
      />

      {/* Share Ticket Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="p-0 border-0 rounded-[20px] md:rounded-[24px] shadow-2xl w-[95vw] sm:w-[704px] max-w-[704px] h-auto sm:h-[650px] bg-white dark:bg-[#181818] text-black dark:text-gray-100 transition-colors duration-300"
        >
          <div className="relative">
            <DialogTitle className="sr-only">Share with friends</DialogTitle>
            <div className="h-[56px] sm:h-[40px] flex items-center justify-center">
              <h2 className="text-[18px] sm:text-[20px] font-semibold text-black dark:text-white">
                Share with friends
              </h2>
            </div>
          </div>

          {/* Blue Ticket Card */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="rounded-[20px] sm:rounded-[24px] p-6 sm:px-10 sm:pt-1 sm:pb-4 bg-[#0077F7]">
              <p className="text-[16px] sm:text-[18px] font-semibold text-center text-white">
                Download Your Tickets!
              </p>
              <p className="mt-1 text-sm text-center text-[#E6F0FF]">
                Starry Nights Music Fest
              </p>

              <div className="mt-3 sm:mt-4 flex items-center justify-center">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame%201-EsnnyeVb9lwC0UehvuRIFhcDpflOoj.png"
                  alt="Ticket QR"
                  className="h-[120px] sm:h-[160px] w-[160px] sm:w-[200px] object-contain"
                />
              </div>

              <p className="mt-3 sm:mt-4 text-center text-[10px] text-[#E6F0FF]">
                TCK-482917-AB56
              </p>

              <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-y-2 text-white text-[13px] sm:text-[15px] font-semibold">
                <p>1 Ticket</p>
                <p className="text-right">$205.35</p>
                <p>Location: California</p>
                <span />
                <p>Date: 4 June</p>
                <p className="text-right">Time: 8 pm</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-3 sm:gap-4">
              <button className="h-[36px] sm:h-[38px] rounded-[14px] sm:rounded-[16px] text-[14px] sm:text-[16px] font-medium bg-[#0077F7] text-white hover:bg-[#005fe0] transition">
                Download Ticket
              </button>
              <button
                className="h-[36px] sm:h-[38px] rounded-[14px] sm:rounded-[16px] text-[14px] sm:text-[16px] font-medium bg-black dark:bg-[#0077F7] text-white hover:opacity-90 transition"
                onClick={() => {
                  setIsCalendarOpen(true);
                  setIsShareModalOpen(false);
                }}
              >
                Add to Calendar
              </button>
            </div>

            {/* Social Icons */}
            <div className="mt-3 sm:mt-4 flex items-center justify-center gap-3 sm:gap-4">
              {[
                {
                  src: "logos_facebook-Jtw5MId1zN6F2CaO7jdeBLZnsp1Tfo.png",
                  alt: "Facebook",
                },
                {
                  src: "devicon_twitter-XIKmcJqnv48zaeoNmUGkIwXCyqTUUL.png",
                  alt: "Twitter",
                },
                {
                  src: "logos_whatsapp-icon-42dAiekQtKgMVQ4IshlAJYT8fk1Tzj.png",
                  alt: "WhatsApp",
                },
                {
                  src: "devicon_linkedin-M4x4xBEND56ARk8e2Pf80IJKHrpm8C.png",
                  alt: "LinkedIn",
                },
              ].map((icon, i) => (
                <span
                  key={i}
                  className="h-[36px] sm:h-[40px]  dark:bg-gray-400  w-[36px] sm:w-[40px] rounded-full grid place-items-center bg-[#F9FAFB]"
                >
                  <img
                    src={`https://hebbkx1anhila5yf.public.blob.vercel-storage.com/${icon.src}`}
                    alt={icon.alt}
                    className="h-[18px] sm:h-[20px] w-[18px] sm:w-[20px]object-contain"
                  />
                </span>
              ))}
            </div>

            {/* Event URL box */}
            <div className="mt-4 flex items-center justify-between rounded-[10px] sm:rounded-[12px] pl-4 sm:pl-5 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-[#222222] transition">
              <div>
                <p className="text-[13px] sm:text-[14px] font-medium text-black dark:text-white">
                  Event URL
                </p>
                <p className="mt-[2px] text-[12px] sm:text-[14px] text-black dark:text-gray-300 break-all">
                  https://eventcore.com/v2/events/928
                </p>
              </div>
              <button
                aria-label="Copy event URL"
                onClick={() =>
                  navigator.clipboard.writeText(
                    "https://eventcore.com/v2/events/928"
                  )
                }
                className="h-[40px] w-[40px] sm:h-[44px] sm:w-[45px] rounded-full grid place-items-center dark:hover:bg-[#333]"
              >
                <img
                  src="/icons/Copy.png"
                  alt="Copy"
                  className="h-[22px] sm:h-[24px] w-[22px] sm:w-[24px] dark:invert"
                />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
