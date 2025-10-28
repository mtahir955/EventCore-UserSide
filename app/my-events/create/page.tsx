"use client";

import { Sidebar } from "../../host-dashboard/components/sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SetImagesPage from "./set-images/page";
import TicketingDetailsPage from "./ticketing-details/page";
import PreviewEventPage from "./preview-event/page";

export default function CreateEventPage() {
  const [eventType, setEventType] = useState<"in-person" | "virtual">(
    "in-person"
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [eventLocation, setEventLocation] = useState("");
  const [ActivePage, setActivePage] = useState("create");
  const [isOpen, setIsOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSelect = (time: string) => {
    setStartTime(time);
    setIsOpen(false);
  };

  const stepOrder = [
    "create",
    "set-images",
    "set-ticketingdetails",
    "preview-event",
  ];

  const steplist = [
    { num: 1, label: "Event Details", active: ActivePage === "create" },
    { num: 2, label: "Set Images", active: ActivePage === "set-images" },
    {
      num: 3,
      label: "Ticketing Details",
      active: ActivePage === "set-ticketingdetails",
    },
    { num: 4, label: "Preview Event", active: ActivePage === "preview-event" },
  ].map((step, index) => {
    const currentIndex = stepOrder.indexOf(ActivePage);
    return { ...step, isdone: index < currentIndex };
  });

  const handleSaveAndContinue = () => {
    // validation
    if (
      !eventTitle ||
      !eventDescription ||
      !eventDate ||
      !startTime ||
      !endTime ||
      !eventLocation
    ) {
      setError("Please fill all required fields before continuing.");
      return;
    }
    setError("");
    setActivePage("set-images");
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFB]">
      <Sidebar active="My Events" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:ml-[256px]">
        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:pt-8 md:pb-6 bg-white border-b md:border-none">
          <h1 className="text-[20px] sm:text-[26px] md:text-[32px] leading-none font-semibold tracking-[-0.02em]">
            Events
          </h1>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-white border h-8 w-8 md:h-10 md:w-10 flex justify-center items-center rounded-full p-1">
              <img
                src="/images/icons/notification-new.png"
                alt="notification"
                className="rounded-full"
              />
            </div>
            <div className="bg-black border h-8 w-8 md:h-10 md:w-10 flex justify-center items-center rounded-full p-1">
              <img
                src="/images/icons/profile-user.png"
                alt="profile"
                className="rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Back Button + Step Bar */}
        <div className="px-4 sm:px-6 md:px-8 mt-4 md:mt-6 mb-6">
          <div className="relative flex items-center mb-2">
            <button
              onClick={() => window.history.back()}
              className="absolute left-0 flex items-center justify-center"
            >
              <img
                src="/images/icons/back-arrow.png"
                alt="Back"
                className="h-6 w-6 md:h-8 md:w-8"
              />
            </button>
            <h2 className="text-[20px] md:text-[24px] font-semibold absolute left-1/2 -translate-x-1/2">
              Create Event
            </h2>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mt-6 sm:mt-8">
            {steplist.map((step) => (
              <div
                key={step.num}
                className="flex flex-col w-full items-center gap-3"
              >
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[14px] sm:text-[15px] md:text-[16px] font-semibold"
                  style={{
                    background: step.isdone
                      ? "#d19537"
                      : step.active
                      ? "#000000"
                      : "#D1D1D1",
                    color: "#FFFFFF",
                  }}
                >
                  {step.num}
                </div>
                <div
                  className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-center"
                  style={{ color: step.active ? "#000000" : "#A0A0A0" }}
                >
                  {step.label}
                </div>
                {step.active && (
                  <div
                    className="h-1 w-full rounded-full"
                    style={{ background: "#D19537", marginTop: -8 }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        {ActivePage === "create" && (
          <div className="px-4 sm:px-6 md:px-8 pb-8">
            <div className="rounded-2xl p-4 sm:p-6 md:p-8 bg-white max-w-[1200px] mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h3 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold mb-2">
                  Create New Event
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#666666]">
                  Share your event details with Event Core and let the
                  excitement unfold!
                </p>
              </div>

              {/* Event Details */}
              <div className="mb-10">
                <h4 className="text-[18px] sm:text-[20px] font-bold mb-6">
                  Event Details
                </h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[14px] font-medium mb-2">
                      Event Title <span className="text-[#D6111A]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Write title here..."
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] border-[#E5E5E5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium mb-2">
                      Event Description{" "}
                      <span className="text-[#D6111A]">*</span>
                    </label>
                    <textarea
                      placeholder="Describe here..."
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      className="w-full h-32 px-4 py-3 rounded-lg border text-[14px] outline-none resize-none bg-[#FAFAFB] border-[#E5E5E5]"
                    />
                  </div>
                </div>
              </div>

              {/* Event Time & Date */}
              <div className="mb-10">
                <h4 className="text-[18px] sm:text-[20px] font-bold mb-6">
                  Event Time & Date
                </h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[14px] font-medium mb-3">
                      Event Type <span className="text-[#D6111A]">*</span>
                    </label>
                    <div className="flex items-center gap-6 sm:gap-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="eventType"
                          checked={eventType === "in-person"}
                          onChange={() => setEventType("in-person")}
                          className="w-5 h-5 accent-black"
                        />
                        <span className="text-[14px]">In-Person</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="eventType"
                          checked={eventType === "virtual"}
                          onChange={() => setEventType("virtual")}
                          className="w-5 h-5 accent-black"
                        />
                        <span className="text-[14px]">Virtual</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Date */}
                    <div>
                      <label className="block text-[14px] font-medium mb-2">
                        Enter Date <span className="text-[#D6111A]">*</span>
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] border-[#E5E5E5]"
                      />
                    </div>

                    {/* Start Time */}
                    <div>
                      <label className="block text-[14px] font-medium mb-2">
                        Start Time <span className="text-[#D6111A]">*</span>
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] border-[#E5E5E5]"
                      />
                    </div>

                    {/* End Time */}
                    <div>
                      <label className="block text-[14px] font-medium mb-2">
                        End Time <span className="text-[#D6111A]">*</span>
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] border-[#E5E5E5]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-10">
                <h4 className="text-[18px] sm:text-[20px] font-bold mb-6">
                  Select Location
                </h4>
                <div>
                  <label className="block text-[14px] font-medium mb-2">
                    Event Location <span className="text-[#D6111A]">*</span>
                  </label>
                  <select
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] border-[#E5E5E5]"
                  >
                    <option value="">Please select one</option>
                    <option value="location1">Location 1</option>
                    <option value="location2">Location 2</option>
                    <option value="location3">Location 3</option>
                  </select>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-[#D6111A] text-[13px] font-medium mb-4">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4">
                <button
                  onClick={() => window.history.back()}
                  className="h-12 px-6 sm:px-8 rounded-xl text-[14px] font-semibold bg-[#FFF5E6] text-[#D19537]"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveAndContinue}
                  className="h-12 px-6 sm:px-8 rounded-xl text-[14px] font-semibold bg-[#D19537] text-white"
                >
                  Save & Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {ActivePage === "set-images" && (
          <SetImagesPage setActivePage={setActivePage} />
        )}
        {ActivePage === "set-ticketingdetails" && (
          <TicketingDetailsPage setActivePage={setActivePage} />
        )}
        {ActivePage === "preview-event" && (
          <PreviewEventPage setActivePage={setActivePage} />
        )}
      </main>
    </div>
  );
}
