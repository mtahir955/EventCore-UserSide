"use client";

import { Sidebar } from "../../host-dashboard/components/sidebar";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import SetImagesPage from "./set-images/page";
import TicketingDetailsPage from "./ticketing-details/page";
import AddTrainersSection from "./add-trainers/page";
import PreviewEventPage from "./preview-event/page";
import Link from "next/link";
import { X, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LogoutModalHost from "@/components/modals/LogoutModalHost";
import EventSettingsPageInline from "./event-settings-inline";

const STORAGE_KEY = "eventDraft";

export default function CreateEventPage() {
  const [eventType, setEventType] = useState<"in-person" | "virtual">(
    "in-person"
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [eventLocation, setEventLocation] = useState("");
  const [ActivePage, setActivePage] = useState("create");
  const [isOpen, setIsOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [error, setError] = useState("");

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { resolvedTheme, theme, setTheme } = useTheme();

  // Dropdowns
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Dummy notifications
  const notifications = [
    { id: 1, message: "Your event 'Tech Summit' was approved!" },
    { id: 2, message: "You sold 3 tickets for 'Lahore Music Fest'." },
    { id: 3, message: "New user message received." },
  ];

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const router = useRouter();

  const handleSelect = (time: string) => {
    setStartTime(time);
    setIsOpen(false);
  };

  const stepOrder = [
    "create",
    "set-eventsettings", // NEW STEP INSERTED
    "set-ticketingdetailsT",
    "set-images",
    "set-ticketingdetails",
    "preview-event",
  ];

  const steplist = [
    { num: 1, label: "Event Details", active: ActivePage === "create" },
    {
      num: 2,
      label: "Event Settings",
      active: ActivePage === "set-eventsettings",
    },
    {
      num: 3,
      label: "Add Trainers",
      active: ActivePage === "set-ticketingdetailsT",
    },
    { num: 4, label: "Set Images", active: ActivePage === "set-images" },
    {
      num: 5,
      label: "Ticketing Details",
      active: ActivePage === "set-ticketingdetails",
    },
    { num: 6, label: "Preview Event", active: ActivePage === "preview-event" },
  ].map((step, index) => {
    const currentIndex = stepOrder.indexOf(ActivePage);
    return { ...step, isdone: index < currentIndex };
  });

  const saveEventDetailsToLocalStorage = () => {
    if (typeof window === "undefined") return;

    const details = {
      eventTitle,
      eventDescription,
      eventCategory,
      startDate,
      endDate,
      startTime,
      endTime,
      eventLocation,
      eventType,
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
      ) as any;

      const updated = {
        ...existing,
        details,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save event details to localStorage", e);
    }
  };

  const handleSaveAndContinue = () => {
    // validation
    if (
      !eventTitle ||
      !eventDescription ||
      !eventCategory || // ⬅ ADDED
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime ||
      !eventLocation
    ) {
      setError("Please fill all required fields before continuing.");
      return;
    }
    setError("");

    // ✅ Save to localStorage before moving to next step
    saveEventDetailsToLocalStorage();

    setActivePage("set-eventsettings");
  };

  const [hostName, setHostName] = useState("Host");

  useEffect(() => {
    const savedUser = localStorage.getItem("hostUser");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      // Host Name
      setHostName(user.userName || user.fullName || "Host");

      console.log("HOST DASHBOARD USER:", user);
      console.log("HOST SUBDOMAIN:", user?.subDomain);

      // Theme (optional)
      if (user.theme) {
        // syncThemeWithBackend(user);
      }
    } else {
      // Force redirect if no host session found
      window.location.href = "/sign-in-host";
    }
  }, []);

  // ✅ Hydrate event details from localStorage (if draft exists)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const data = JSON.parse(saved);
      if (data.details) {
        setEventTitle(data.details.eventTitle || "");
        setEventDescription(data.details.eventDescription || "");
        setEventCategory(data.details.eventCategory || "");
        setStartDate(data.details.startDate || "");
        setEndDate(data.details.endDate || "");
        setStartTime(data.details.startTime || "00:00");
        setEndTime(data.details.endTime || "00:00");
        setEventLocation(data.details.eventLocation || "");
        if (data.details.eventType === "virtual") {
          setEventType("virtual");
        } else if (data.details.eventType === "in-person") {
          setEventType("in-person");
        }
      }
    } catch (e) {
      console.error("Failed to load event draft from localStorage", e);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FAFAFB]">
      <Sidebar active="My Events" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:ml-[256px] dark:bg-[#101010]">
        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:pt-8 md:pb-6 bg-white dark:bg-[#101010] border-b md:border-none">
          <h1 className="text-[20px] sm:text-[26px] md:text-[32px] leading-none font-semibold tracking-[-0.02em]">
            Events
          </h1>
          {/* Right section */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4 relative">
              {/* Notification icon */}
              <div ref={notificationsRef} className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileDropdown(false);
                  }}
                  className="bg-black dark:bg-black border h-9 w-9 flex justify-center items-center rounded-full relative hover:opacity-90"
                >
                  <img
                    src="/icons/Vector.png"
                    alt="notification"
                    className="h-4 w-4"
                  />
                  {/* Counter badge */}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </button>

                {/* Notification popup */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 rounded-xl z-50 p-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
                      Notifications
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className="text-sm bg-gray-50 dark:bg-[#1f1e1e] rounded-lg p-2 hover:bg-gray-100 transition"
                          >
                            {n.message}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No new notifications
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Name + Icon + Dropdown */}
              <div
                className="relative flex items-center gap-2"
                ref={profileRef}
              >
                {/* Host Name */}
                <span className="hidden sm:block font-semibold text-black dark:text-white">
                  {hostName}
                </span>

                {/* Profile Icon Wrapper */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(!showProfileDropdown);
                      setShowNotifications(false);
                    }}
                    className="bg-black border h-9 w-9 flex justify-center items-center rounded-full hover:opacity-90"
                  >
                    <img
                      src="/images/icons/profile-user.png"
                      alt="profile"
                      className="h-4 w-4"
                    />
                  </button>

                  {/* Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl z-50 py-2">
                      <Link href="/my-events">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          My Events
                        </button>
                      </Link>

                      <Link href="/ticket-manager">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          Ticket Manager
                        </button>
                      </Link>

                      <Link href="/host-payments">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          Payments
                        </button>
                      </Link>

                      <Link href="/host-settings">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          System Settings
                        </button>
                      </Link>

                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Bottom Divider Line */}
        <div className="border-b border-gray-200 dark:border-gray-800"></div>

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
            <div className="rounded-2xl p-4 sm:p-6 md:p-8 bg-white dark:bg-[#101010] dark:border max-w-[1200px] mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h3 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold mb-2">
                  Create New Event
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#666666] dark:text-gray-300">
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
                      className="w-full h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E5E5E5]"
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
                      className="w-full h-32 px-4 py-3 rounded-lg border text-[14px] outline-none resize-none dark:bg-[#101010] bg-[#FAFAFB] border-[#E5E5E5]"
                    />
                  </div>
                </div>
              </div>

              {/* Event Categories */}
              <div className="mb-10">
                <h4 className="text-[18px] sm:text-[20px] font-bold mb-6">
                  Event Categories
                </h4>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[14px] font-medium mb-2">
                      Select Event Category{" "}
                      <span className="text-[#D6111A]">*</span>
                    </label>

                    <Select
                      value={eventCategory}
                      onValueChange={setEventCategory}
                    >
                      <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-lg border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>

                      <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <SelectItem value="trainings">Trainings</SelectItem>
                        <SelectItem value="escapes">Escapes</SelectItem>
                        <SelectItem value="traincations">
                          Traincations
                        </SelectItem>
                        <SelectItem value="excursions">Excursions</SelectItem>
                        <SelectItem value="roomBlocks">
                          Training Room Blocks
                        </SelectItem>
                      </SelectContent>
                    </Select>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div>
                      <label className="block text-[14px] font-medium mb-2">
                        Start Date <span className="text-[#D6111A]">*</span>
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E5E5E5]"
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-[14px] font-medium mb-2">
                        End Date <span className="text-[#D6111A]">*</span>
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate} // optional: prevent selecting date earlier than start
                        className="w-full h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E5E5E5]"
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
                        className="w-full h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E5E5E5]"
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
                        className="w-full h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E5E5E5]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-10 w-full">
                <h4 className="text-[18px] sm:text-[20px] font-bold mb-6">
                  Select Location
                </h4>

                <div className="w-full">
                  <label className="block text-[14px] font-medium mb-2">
                    Event Location <span className="text-[#D6111A]">*</span>
                  </label>

                  <select
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="
        w-full 
        sm:w-[510px] 
        h-12 
        px-4 
        rounded-lg 
        border 
        text-[14px] 
        outline-none 
        bg-[#FAFAFB] 
        dark:bg-[#101010] 
        border-[#E5E5E5]
      "
                  >
                    <option value="">Please select one</option>

                    {/* US STATES LIST */}
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="Arizona">Arizona</option>
                    <option value="Arkansas">Arkansas</option>
                    <option value="California">California</option>
                    <option value="Colorado">Colorado</option>
                    <option value="Connecticut">Connecticut</option>
                    <option value="Delaware">Delaware</option>
                    <option value="District of Columbia">
                      District of Columbia
                    </option>
                    <option value="Florida">Florida</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Hawaii">Hawaii</option>
                    <option value="Idaho">Idaho</option>
                    <option value="Illinois">Illinois</option>
                    <option value="Indiana">Indiana</option>
                    <option value="Iowa">Iowa</option>
                    <option value="Kansas">Kansas</option>
                    <option value="Kentucky">Kentucky</option>
                    <option value="Louisiana">Louisiana</option>
                    <option value="Maine">Maine</option>
                    <option value="Maryland">Maryland</option>
                    <option value="Massachusetts">Massachusetts</option>
                    <option value="Michigan">Michigan</option>
                    <option value="Minnesota">Minnesota</option>
                    <option value="Mississippi">Mississippi</option>
                    <option value="Missouri">Missouri</option>
                    <option value="Montana">Montana</option>
                    <option value="Nebraska">Nebraska</option>
                    <option value="Nevada">Nevada</option>
                    <option value="New Hampshire">New Hampshire</option>
                    <option value="New Jersey">New Jersey</option>
                    <option value="New Mexico">New Mexico</option>
                    <option value="New York">New York</option>
                    <option value="North Carolina">North Carolina</option>
                    <option value="North Dakota">North Dakota</option>
                    <option value="Ohio">Ohio</option>
                    <option value="Oklahoma">Oklahoma</option>
                    <option value="Oregon">Oregon</option>
                    <option value="Pennsylvania">Pennsylvania</option>
                    <option value="Rhode Island">Rhode Island</option>
                    <option value="South Carolina">South Carolina</option>
                    <option value="South Dakota">South Dakota</option>
                    <option value="Tennessee">Tennessee</option>
                    <option value="Texas">Texas</option>
                    <option value="Utah">Utah</option>
                    <option value="Vermont">Vermont</option>
                    <option value="Virginia">Virginia</option>
                    <option value="Washington">Washington</option>
                    <option value="West Virginia">West Virginia</option>
                    <option value="Wisconsin">Wisconsin</option>
                    <option value="Wyoming">Wyoming</option>
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

        {/* Logout Modal */}
        <LogoutModalHost
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onLogout={() => {
            localStorage.clear();
            window.location.href = "/sign-in-host";
          }}
        />

        {/* Inline steps */}
        {ActivePage === "set-ticketingdetailsT" && (
          <AddTrainersSection setActivePage={setActivePage} />
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
        {ActivePage === "set-eventsettings" && (
          <EventSettingsPageInline setActivePage={setActivePage} />
        )}
      </main>
    </div>
  );
}
