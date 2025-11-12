"use client";

import { useState } from "react";

interface Ticket {
  id: string;
  name: string;
  price: string;
  couponCode?: string;
  discount?: string;
}

type SetImagesPageProps = {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
};

export default function TicketingDetailsPage({
  setActivePage,
}: SetImagesPageProps) {
  const [eventType, setEventType] = useState<"ticketed" | "free">("ticketed");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentTicket, setCurrentTicket] = useState({
    name: "",
    price: "",
    couponCode: "",
    discount: "",
  });
  const [error, setError] = useState("");
  const [enableCoupon, setEnableCoupon] = useState(false);

  const handleGoBack = () => setActivePage("set-images");

  const handleSaveAndContinue = () => {
    if (eventType === "ticketed" && tickets.length === 0) {
      setError("Please add at least one ticket before continuing.");
      return;
    }
    setError("");
    setActivePage("preview-event");
  };

  const handleAddTicket = () => {
    if (currentTicket.name.trim() && currentTicket.price.trim()) {
      setTickets([
        ...tickets,
        {
          id: Date.now().toString(),
          name: currentTicket.name,
          price: currentTicket.price,
          couponCode: enableCoupon ? currentTicket.couponCode : undefined,
          discount: enableCoupon ? currentTicket.discount : "",
        },
      ]);
      setCurrentTicket({ name: "", price: "", couponCode: "", discount: "" });
      setEnableCoupon(false);
      setError("");
    } else {
      setError("Please fill in both ticket name and price.");
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 pb-8">
      <div className="rounded-2xl p-4 sm:p-6 md:p-8 bg-white dark:bg-[#101010] dark:border max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold mb-2">
            Ticketing Details
          </h3>
          <p className="text-[13px] sm:text-[14px] md:text-[16px] font-medium text-[#666666] dark:text-gray-300">
            View and manage all information about your event tickets, including
            pricing, availability, and attendee info.
          </p>
        </div>

        {/* Event Type */}
        <div className="mb-10">
          <h4 className="text-[18px] sm:text-[20px] font-bold mb-6">
            What type of event are you running?
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Ticketed */}
            <button
              onClick={() => setEventType("ticketed")}
              className="rounded-xl border-2 p-6 sm:p-8 flex flex-col items-center bg-white dark:bg-[#101010] justify-center gap-3 sm:gap-4 transition-all"
              style={{
                borderColor: eventType === "ticketed" ? "#D19537" : "#E8E8E8",
                minHeight: 160,
              }}
            >
              <img
                src="/images/icons/ticketed-event-icon.png"
                alt="Ticketed Event"
                className="w-12 h-12 sm:w-16 sm:h-16"
              />
              <div className="text-center">
                <div
                  className="text-[16px] sm:text-[18px] font-bold mb-1"
                  style={{ color: "#D19537" }}
                >
                  Ticketed Event
                </div>
                <div
                  className="text-[13px] sm:text-[14px]"
                  style={{ color: "#D19537" }}
                >
                  My event requires tickets for entry
                </div>
              </div>
            </button>

            {/* Free */}
            <button
              onClick={() => setEventType("free")}
              className="rounded-xl border-2 p-6 sm:p-8 flex flex-col items-center bg-white dark:bg-[#101010] justify-center gap-3 sm:gap-4 transition-all"
              style={{
                borderColor: eventType === "free" ? "#D19537" : "#E8E8E8",
                minHeight: 160,
              }}
            >
              <img
                src="/images/icons/free-event-icon.png"
                alt="Free Event"
                className="w-12 h-12 sm:w-16 sm:h-16"
              />
              <div className="text-center">
                <div
                  className="text-[16px] sm:text-[18px] font-bold mb-1"
                  style={{ color: "#666666" }}
                >
                  Free Event
                </div>
                <div
                  className="text-[13px] sm:text-[14px]"
                  style={{ color: "#666666" }}
                >
                  I'm running a free event
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Ticket Form */}
        {eventType === "ticketed" && (
          <div className="mb-10">
            <h4 className="text-[18px] sm:text-[20px] font-bold mb-6">
              What tickets are you selling?
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <label className="block text-[14px] font-medium mb-2">
                  Ticket Name <span className="text-[#D6111A]">*</span>
                </label>
                <input
                  type="text"
                  value={currentTicket.name}
                  onChange={(e) =>
                    setCurrentTicket({ ...currentTicket, name: e.target.value })
                  }
                  placeholder="Ticket Name e.g. General Ticket"
                  className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium mb-2">
                  Ticket Price <span className="text-[#D6111A]">*</span>
                </label>
                <input
                  type="text"
                  value={currentTicket.price}
                  onChange={(e) =>
                    setCurrentTicket({
                      ...currentTicket,
                      price: e.target.value,
                    })
                  }
                  placeholder="$00.00"
                  className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
                />
              </div>
            </div>

            {/* Coupon Toggle */}
            <div className="mb-6 flex items-center justify-between border border-[#E8E8E8] rounded-lg px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010]">
              <span className="text-[14px] font-medium text-gray-800 dark:text-gray-200">
                Add Coupon & Discount
              </span>
              <button
                onClick={() => setEnableCoupon(!enableCoupon)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enableCoupon ? "bg-[#D19537]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white transition-transform ${
                    enableCoupon ? "translate-x-[20px]" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Coupon + Discount Inputs (Visible when toggled on) */}
            {enableCoupon && (
              <div className="mb-6 transition-all">
                <label className="block text-[14px] font-medium mb-2">
                  Coupon Code & Discount (%)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Coupon Code */}
                  <input
                    type="text"
                    value={currentTicket.couponCode}
                    onChange={(e) =>
                      setCurrentTicket({
                        ...currentTicket,
                        couponCode: e.target.value,
                      })
                    }
                    placeholder="Enter coupon code e.g. SAVE20"
                    className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
                  />

                  {/* Discount Percentage */}
                  <input
                    type="number"
                    value={currentTicket.discount || ""}
                    onChange={(e) =>
                      setCurrentTicket({
                        ...currentTicket,
                        discount: e.target.value,
                      })
                    }
                    placeholder="Discount % e.g. 10"
                    className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
                  />
                </div>
              </div>
            )}

            {/* Add Ticket Button */}
            <div className="flex justify-end">
              <button
                onClick={handleAddTicket}
                className="h-10 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold flex items-center gap-2 bg-[#D19537] text-white"
              >
                Add
                <img
                  src="/images/icons/plus-icon.png"
                  alt="add"
                  className="w-4 h-4"
                />
              </button>
            </div>

            {/* Ticket List */}
            {tickets.length > 0 && (
              <div className="mt-6 space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
                  >
                    <div className="mb-2 sm:mb-0">
                      <div className="text-[14px] font-semibold">
                        {ticket.name}
                      </div>
                      <div className="text-[13px] sm:text-[14px] text-[#666666]">
                        {ticket.price}
                      </div>

                      {/* Show coupon + discount if present */}
                      {(ticket.couponCode || ticket.discount) && (
                        <div className="text-[13px] text-[#D19537]">
                          {ticket.couponCode && (
                            <>Coupon: {ticket.couponCode}</>
                          )}
                          {ticket.discount && (
                            <> | Discount: {ticket.discount}%</>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setTickets(tickets.filter((t) => t.id !== ticket.id))
                      }
                      className="text-[13px] sm:text-[14px] font-medium text-[#D6111A]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="text-[#D6111A] text-[13px] font-medium mt-2 mb-4">
            {error}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-6">
        <button
          onClick={handleGoBack}
          className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#FFF5E6] text-[#D19537]"
        >
          Go Back
        </button>
        <button
          onClick={handleSaveAndContinue}
          className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#D19537] text-white"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}
