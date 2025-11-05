"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { CalendarModal } from "../../../check-out/components/calendar-modal";

export default function TicketDialog({ cta }: { cta: string }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <Dialog>
      {/* Ticket Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogTrigger asChild>
          <button
            className="rounded-xl bg-[#0077F7] w-full px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white shadow hover:bg-[#0066D6] transition"
            aria-label="View Ticket"
          >
            {cta}
          </button>
        </DialogTrigger>

        <DialogContent
          aria-describedby={undefined}
          className="p-0 border-0 rounded-[20px] sm:rounded-[24px] shadow-2xl overflow-hidden"
          style={{
            width: "95%",
            maxWidth: 504,
            height: "auto",
            background: "#FFFFFF",
          }}
        >
          {/* Header */}
          <div className="relative">
            <DialogTitle className="sr-only">Share with friends</DialogTitle>
            <div className="h-[50px] sm:h-[40px] flex items-center justify-center">
              <h2 className="text-[16px] sm:text-[20px] font-semibold text-black">
                Share with friends
              </h2>
            </div>
            {/* <DialogClose asChild>
              <button
                aria-label="Close ticket modal"
                className="absolute right-4 sm:right-6 top-2 sm:top-3 h-6 sm:h-8 w-6 sm:w-8 grid place-items-center"
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Close%20button-eiE6Hp4abZSO6Pe4Me1UMHR3rwCewz.png"
                  alt="Close"
                  className="h-4 sm:h-[34px] w-4 sm:w-[34px]"
                />
              </button>
            </DialogClose> */}
          </div>

          {/* Blue Ticket */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="rounded-[16px] sm:rounded-[24px] h-auto sm:h-[350px] px-5 sm:px-10 pt-2 sm:pt-1 pb-4 bg-[#0077F7]">
              <p className="text-[14px] sm:text-[18px] font-semibold text-center text-white">
                Download Your Tickets!
              </p>
              <p className="mt-1 text-[11px] sm:text-sm text-center text-[#E6F0FF]">
                Starry Nights Music Fest
              </p>

              {/* QR */}
              <div className="mt-3 sm:mt-2 flex items-center justify-center">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/frame%201-EsnnyeVb9lwC0UehvuRIFhcDpflOoj.png"
                  alt="Ticket QR code"
                  className="h-[120px] sm:h-[160px] w-[150px] sm:w-[200px] object-contain"
                />
              </div>

              <p className="mt-3 sm:mt-4 text-center text-[9px] sm:text-[10px] text-[#E6F0FF]">
                TCK-482917-AB56
              </p>

              {/* Ticket Info */}
              <div className="mt-2 grid grid-cols-2 gap-y-1 sm:gap-y-2 text-[12px] sm:text-[15px] font-semibold text-white">
                <p>1 Ticket</p>
                <p className="text-right">$205.35</p>
                <p>Location: California</p>
                <span />
                <p>Date: 4 June</p>
                <p className="text-right">Time: 8 pm</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3 sm:gap-4">
              <button className="h-[36px] sm:h-[38px] rounded-[12px] sm:rounded-[16px] text-[13px] sm:text-[16px] font-medium bg-[#0077F7] text-white hover:bg-[#0066D6] transition">
                Download Ticket
              </button>
              {/* <button
                className="h-[36px] sm:h-[38px] rounded-[12px] sm:rounded-[16px] text-[13px] sm:text-[16px] font-medium bg-black text-white"
                onClick={() => {
                  setIsShareModalOpen(false);
                  setTimeout(() => setIsCalendarOpen(true), 150);
                }}
              >
                Add to Calendar
              </button> */}
            </div>

            {/* Social Icons */}
            <div className="mt-2 sm:mt-3 flex items-center justify-center gap-3 sm:gap-4">
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
                  className="h-[32px] sm:h-[40px] w-[32px] sm:w-[40px] rounded-full grid place-items-center bg-[#F9FAFB]"
                >
                  <img
                    src={`https://hebbkx1anhila5yf.public.blob.vercel-storage.com/${icon.src}`}
                    alt={icon.alt}
                    className="h-[16px] sm:h-[20px] w-[16px] sm:w-[20px] object-contain"
                  />
                </span>
              ))}
            </div>

            {/* Event URL copy box */}
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 rounded-[12px] pl-4 sm:pl-5 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 shadow-sm bg-white">
              <div className="flex-1">
                <p className="text-[12px] sm:text-[14px] font-medium text-black">
                  Event URL
                </p>
                <p className="mt-[2px] text-[12px] sm:text-[14px] text-black truncate">
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
                className="h-[38px] sm:h-[44px] w-[40px] sm:w-[45px] rounded-full grid place-items-center border bg-gray-50 hover:bg-gray-100 transition"
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy%20icon-hLC2rCxtTJjCbcRBhJtTz8ILcRgA3h.png"
                  alt="Copy"
                  className="h-[18px] sm:h-[24px] w-[18px] sm:w-[24px]"
                />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendar Modal */}
      {/* <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        eventTitle="Starry Nights Music Fest"
        eventDescription="A magical evening under the stars with live bands, food stalls, and an electric crowd."
        eventImage="/images/hero-image.png"
        initialDate={new Date(2025, 5, 10)}
      /> */}
    </Dialog>
  );
}
