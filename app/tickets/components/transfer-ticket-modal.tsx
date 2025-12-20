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
    </>
  );
}
