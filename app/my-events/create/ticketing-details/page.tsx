"use client";

import { useState } from "react";

interface Ticket {
  id: string;
  name: string;
  price: string;
}

type SetImagesPageProps = {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
};

export default function TicketingDetailsPage({
  setActivePage,
}: SetImagesPageProps) {
  const [eventType, setEventType] = useState<"ticketed" | "free">("ticketed");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentTicket, setCurrentTicket] = useState({ name: "", price: "" });
  const [error, setError] = useState("");

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
        },
      ]);
      setCurrentTicket({ name: "", price: "" });
      setError("");
    } else {
      setError("Please fill in both ticket name and price.");
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 pb-8">
      <div className="rounded-2xl p-4 sm:p-6 md:p-8 bg-white max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold mb-2">
            Ticketing Details
          </h3>
          <p className="text-[13px] sm:text-[14px] md:text-[16px] font-medium text-[#666666]">
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
              className="rounded-xl border-2 p-6 sm:p-8 flex flex-col items-center justify-center gap-3 sm:gap-4 transition-all"
              style={{
                borderColor: eventType === "ticketed" ? "#D19537" : "#E8E8E8",
                background: "#FFFFFF",
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
              className="rounded-xl border-2 p-6 sm:p-8 flex flex-col items-center justify-center gap-3 sm:gap-4 transition-all"
              style={{
                borderColor: eventType === "free" ? "#D19537" : "#E8E8E8",
                background: "#FFFFFF",
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

        {/* Ticket form */}
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
                  className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] border-[#E8E8E8]"
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
                  className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] border-[#E8E8E8]"
                />
              </div>
            </div>

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

            {tickets.length > 0 && (
              <div className="mt-6 space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border bg-[#FAFAFB] border-[#E8E8E8]"
                  >
                    <div className="mb-2 sm:mb-0">
                      <div className="text-[14px] font-semibold">
                        {ticket.name}
                      </div>
                      <div className="text-[13px] sm:text-[14px] text-[#666666]">
                        {ticket.price}
                      </div>
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
