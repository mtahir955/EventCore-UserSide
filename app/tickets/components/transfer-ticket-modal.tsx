"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { TransferSuccessModal } from "../components/transfer-success-modal";

type TransferTicketModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: {
    date: { day: string; month: string; weekday: string; time: string };
    title: string;
    location: string;
    type: string;
    price: string;
  };
};

export function TransferTicketModal({
  open,
  onOpenChange,
  ticket,
}: TransferTicketModalProps) {
  const [ticketCount, setTicketCount] = useState(1);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const fields = [
    {
      label: "Full Name",
      placeholder: "Enter Your Name",
      type: "text",
      name: "fullName",
      required: true,
    },
    {
      label: "Phone Number",
      placeholder: "Enter Your Number",
      type: "tel",
      name: "phone",
      required: true,
    },
    {
      label: "Email:",
      placeholder: "Enter Your Email",
      type: "email",
      name: "email",
      required: true,
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true); // triggers validation display

    // Check all required fields
    const allFilled = fields.every(
      (f) =>
        !f.required ||
        (formData[f.name as keyof typeof formData] &&
          formData[f.name as keyof typeof formData].trim() !== "")
    );

    if (!allFilled) return; // stop if any required field is empty

    setSuccessOpen(true);
    onOpenChange(false);
  };

  return (
    <>
      {/* Transfer Ticket Modal */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="p-0 rounded-[20px] md:rounded-[24px] border-0 shadow-xl w-[90vw] max-w-[420px] md:max-w-[504px] bg-white dark:bg-[#181818] text-black dark:text-gray-100 transition-colors duration-300"
          showCloseButton={false}
          style={{ height: "auto", maxHeight: "99vh" }}
        >
          {/* Header */}
          <div className="relative flex items-center justify-center border-b border-gray-200 dark:border-gray-700 py-3 md:py-2">
            <DialogTitle className="text-[18px] md:text-[22px] font-semibold text-black dark:text-white">
              Transfer Ticket
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-3 top-2 md:right-4 md:top-3 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Close"
            >
              <X className="h-5 w-5 md:h-6 md:w-6 dark:text-gray-300" />
            </button>
          </div>

          {/* Content */}
          <div className="px-3 md:px-6 py-2 md:py-1 space-y-1">
            {/* Ticket summary card */}
            <div className="flex gap-3 md:gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#222222] p-3 md:p-4 items-start transition-colors">
              {/* Date badge */}
              <div className="w-[80px] h-[100px] md:w-[100px] shrink-0 text-center rounded-lg bg-[#0077F7] text-white flex flex-col items-center justify-center p-2 md:p-3">
                <div className="text-[15px] md:text-[16px] font-semibold">
                  {ticket.date.day}
                </div>
                <div className="text-[10px] uppercase tracking-wide">
                  {ticket.date.month}
                </div>
                <div className="mt-1 text-[9px] font-medium">
                  {ticket.date.weekday}
                </div>
                <div className="text-[9px] font-medium">
                  {ticket.date.time.split(" ")[0]}
                </div>
                <div className="text-[9px] font-medium">
                  {ticket.date.time.split(" ")[1]}
                </div>
              </div>

              {/* Ticket details */}
              <div className="flex-1 flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-[15px] md:text-[16px] font-semibold text-black dark:text-white">
                    {ticket.title}
                  </h3>

                  <div className="mt-2 space-y-1 text-[12px] text-black dark:text-gray-200">
                    <div className="flex items-center gap-1.5">
                      <Image
                        src="/icons/location.png"
                        width={14}
                        height={14}
                        alt=""
                        className="dark:invert"
                      />
                      <span>{ticket.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Image
                        src="/icons/ticket.png"
                        width={14}
                        height={14}
                        alt=""
                        className="dark:invert"
                      />
                      <span>{ticket.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-[15px] md:text-[16px] font-semibold text-black dark:text-white">
                    {ticket.price}
                  </div>
                  <button
                    onClick={() => {
                      setIsCalendarOpen(true);
                      setIsShareModalOpen(true);
                    }}
                    className="h-8 md:h-7 rounded-full bg-[#0077F7] px-3 md:px-5 text-[11px] md:text-[12px] font-medium text-white hover:opacity-90"
                  >
                    View Ticket
                  </button>
                </div>
              </div>
            </div>

            {/* Form fields */}
            <form
              id="transferForm"
              onSubmit={handleTransfer}
              className="space-y-2"
            >
              {fields.map((field, i) => {
                const value = formData[field.name as keyof typeof formData];
                const isError =
                  submitted &&
                  field.required &&
                  (!value || value.trim() === "");

                return (
                  <div key={i}>
                    <label className="block text-[12px] font-medium text-black dark:text-gray-200 mb-1">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={value}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={`w-full h-9 md:h-10 rounded-lg border ${
                        isError
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-700 focus:ring-[#0077F7]"
                      } dark:border-gray-700 bg-white dark:bg-[#222222] px-4 text-[13px] md:text-[14px] text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2`}
                    />
                    {isError && (
                      <p className="text-[11px] text-red-500 mt-1"></p>
                    )}
                  </div>
                );
              })}

              {/* Optional message */}
              <div>
                <label className="block text-[12px] font-medium text-black dark:text-gray-200 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Start Typing Your Message"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222222] px-4 py-3 text-[13px] md:text-[14px] text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0077F7] resize-none"
                />
              </div>

              {/* Ticket Counter */}
              <div className="flex items-center justify-between">
                <label className="block text-[12px] font-medium text-black dark:text-gray-200">
                  No of Tickets <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222222] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
                  >
                    <Image
                      src="/images/remove-button.png"
                      width={16}
                      height={16}
                      alt=""
                      className="dark:invert"
                    />
                  </button>
                  <span className="text-[13px] md:text-[14px] font-semibold text-black dark:text-white w-6 text-center">
                    {ticketCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTicketCount(ticketCount + 1)}
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0077F7] text-white hover:opacity-90 transition"
                  >
                    <Image
                      src="/images/add-button.png"
                      width={16}
                      height={16}
                      alt=""
                      className="dark:invert-0"
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Footer buttons */}
          <div className="flex flex-row gap-2 border-t border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-9 md:h-10 rounded-full bg-black dark:bg-[#222222] text-white text-[13px] md:text-[14px] font-semibold hover:opacity-90"
            >
              Cancel
            </button>

            {/* ✅ Use type="submit" so handleTransfer runs */}
            <button
              type="submit"
              form="transferForm" // link to the form id below
              className="flex-1 h-9 md:h-10 rounded-full bg-[#0077F7] text-white text-[13px] md:text-[14px] font-semibold hover:bg-[#005fe0] transition"
            >
              Transfer Ticket
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success modal */}
      <TransferSuccessModal open={successOpen} onOpenChange={setSuccessOpen} />

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
            <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3 sm:gap-4">
              <button className="h-[36px] sm:h-[38px] rounded-[14px] sm:rounded-[16px] text-[14px] sm:text-[16px] font-medium bg-[#0077F7] text-white hover:bg-[#005fe0] transition">
                Download Ticket
              </button>
              {/* <button
                className="h-[36px] sm:h-[38px] rounded-[14px] sm:rounded-[16px] text-[14px] sm:text-[16px] font-medium bg-black dark:bg-[#0077F7] text-white hover:opacity-90 transition"
                onClick={() => {
                  setIsCalendarOpen(true);
                  setIsShareModalOpen(false);
                  setTransferModalOpen(false);
                }}
              >
                Add to Calendar
              </button> */}
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
