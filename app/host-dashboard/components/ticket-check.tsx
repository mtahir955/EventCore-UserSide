"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../components/sidebar";
// import Header from "./header";
import Image from "next/image";
import { Menu, X, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";

const attendees = [
  {
    id: 1,
    name: "Daniel Carter",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%20427326245-oVTfNgNqoEaWlr3G9Um3EioZtlScTJ.png",
    email: "Info@gmail.com",
    ticketId: "TCK-992134",
    address: "Washington DC, USA",
    quantity: 2,
    status: "Remaining",
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "Info@gmail.com",
    ticketId: "TCK-992134",
    address: "Washington DC, USA",
    quantity: 4,
    status: "Checked In",
  },
  {
    id: 3,
    name: "Emily Carter",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "Info@gmail.com",
    ticketId: "TCK-992134",
    address: "Washington DC, USA",
    quantity: 1,
    status: "Checked In",
  },
  {
    id: 4,
    name: "Nathan Blake",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "Info@gmail.com",
    ticketId: "TCK-992134",
    address: "Washington DC, USA",
    quantity: 2,
    status: "Remaining",
  },
  {
    id: 5,
    name: "Taylor Morgan",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "Info@gmail.com",
    ticketId: "TCK-992134",
    address: "Washington DC, USA",
    quantity: 1,
    status: "Remaining",
  },
  {
    id: 6,
    name: "Taylor Morgan",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "Info@gmail.com",
    ticketId: "TCK-992134",
    address: "Washington DC, USA",
    quantity: 2,
    status: "Checked In",
  },
  {
    id: 7,
    name: "Daniel Carter",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%20427326245-oVTfNgNqoEaWlr3G9Um3EioZtlScTJ.png",
    email: "Info@gmail.com",
    ticketId: "TCK-992134",
    address: "Washington DC, USA",
    quantity: 2,
    status: "Remaining",
  },
  {
    id: 8,
    name: "Daniel Carter",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%20427326245-oVTfNgNqoEaWlr3G9Um3EioZtlScTJ.png",
    email: "Info@gmail.com",
    ticketId: "TCK-992134",
    address: "Washington DC, USA",
    quantity: 4,
    status: "Checked In",
  },
  {
    id: 9,
    name: "Sarah Mitchell",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "Info@gmail.com",
    ticketId: "TCK-992134",
    address: "Washington DC, USA",
    quantity: 1,
    status: "Checked In",
  },
];

export default function TicketCheck() {
  const [selectedEvent, setSelectedEvent] = useState(
    "Starry Nights Music Fest"
  );
  const [ticketId, setTicketId] = useState("");
  const [showResult, setShowResult] = useState(true);
  const [showChecklist, setShowChecklist] = useState(false);

  const totalTickets = attendees.reduce(
    (sum, attendee) => sum + attendee.quantity,
    0
  );
  const checkedIn = attendees
    .filter((a) => a.status === "Checked In")
    .reduce((sum, a) => sum + a.quantity, 0);
  const remaining = totalTickets - checkedIn;

  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const { resolvedTheme, theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full sm:w-[1175px] sm:ml-[250px] bg-white font-sans">
      {/* Sidebar */}
      <div className=" md:block">
        <Sidebar active="Ticket Check" />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 dark:bg-[#101010] w-full">
        {/* ✅ Header visible on tablet/desktop only */}
        <div className="hidden sm:block">
          {/* Desktop Header */}
          <header className="hidden md:flex items-center justify-between px-8 pt-8 pb-4">
            <h1 className="text-[32px] font-semibold tracking-[-0.02em]">
              Ticket Check
            </h1>
            {/* Right section */}
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-4 relative">
                {/* Light/Dark toggle */}
                {/* <Button
                  onClick={() =>
                    setTheme(resolvedTheme === "light" ? "dark" : "light")
                  }
                  variant="ghost"
                  size="sm"
                  className="hidden lg:flex text-gray-600 dark:text-gray-300 gap-2 hover:text-[#0077F7]"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="h-4 w-4" /> Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" /> Light Mode
                    </>
                  )}
                </Button> */}

                {/* Mobile toggle */}
                {/* <button
                  onClick={() =>
                    setTheme(resolvedTheme === "light" ? "dark" : "light")
                  }
                  className="lg:hidden p-1 text-gray-700 dark:text-gray-300 hover:text-[#0077F7] flex-shrink-0"
                >
                  {theme === "light" ? (
                    <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </button> */}
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

                {/* Profile icon + dropdown */}
                <div ref={profileRef} className="relative">
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

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 rounded-xl z-50 py-2">
                      <Link href="/my-events">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          My Events
                        </button>
                      </Link>
                      <Link href="/payment-setup">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          Payment Setup
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
          </header>
        </div>

        {/* ✅ Optional mobile navbar */}
        <div className="sm:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
          <h1 className="text-lg font-semibold text-gray-800">Ticket Check</h1>
          <Image
            src="/images/search-icon.png"
            alt="Search"
            width={20}
            height={20}
            className="opacity-70"
          />
        </div>

        <div className="ticket-check-content px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          {/* everything else remains the same */}

          {/* Header Section */}
          <div className="ticket-check-header">
            <div>
              <h1 className="ticket-check-title">Ticket Check</h1>
            </div>
            <button
              className="view-checklist-btn"
              onClick={() => setShowChecklist(!showChecklist)}
            >
              {showChecklist ? "Back to Scanner" : "View Check List"}
            </button>
          </div>

          {/* <div>
            <h2 className="verification-title">Ticket Verification</h2>
            <p className="verification-subtitle">
              Scan QR codes or enter Tickets IDs to verify
            </p> */}

          {/* Event Selection and Manual Entry */}
          {/* <div className="verification-controls">
              <div className="event-dropdown">
                <span className="event-dropdown-text">{selectedEvent}</span>
                <Image
                  src="/images/chevron-down.png"
                  alt="Dropdown"
                  width={16}
                  height={16}
                  className="chevron-icon"
                />
              </div>

              <div className="manual-entry">
                <input
                  type="text"
                  placeholder="Manual Enter Ticket ID"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="ticket-id-input"
                />
                <Image
                  src="/images/search-icon.png"
                  alt="Search"
                  width={20}
                  height={20}
                  className="search-icon"
                />
              </div>
            </div>
          </div> */}

          {!showChecklist ? (
            <>
              {/* Ticket Verification Section */}
              <div className="ticket-verification-section">
                <h2 className="verification-title">Ticket Verification</h2>
                <p className="verification-subtitle">
                  Scan QR codes or enter Tickets IDs to verify
                </p>

                {/* Event Selection and Manual Entry */}
                <div className="verification-controls">
                  <div className="event-dropdown">
                    <span className="event-dropdown-text">{selectedEvent}</span>
                    <Image
                      src="/images/chevron-down.png"
                      alt="Dropdown"
                      width={16}
                      height={16}
                      className="chevron-icon"
                    />
                  </div>

                  <div className="manual-entry">
                    <input
                      type="text"
                      placeholder="Manual Enter Ticket ID"
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      className="ticket-id-input"
                    />
                    <Image
                      src="/images/search-icon.png"
                      alt="Search"
                      width={20}
                      height={20}
                      className="search-icon"
                    />
                  </div>
                </div>

                {/* QR Scanner Visualization */}
                <div className="qr-scanner-container">
                  <div className="qr-scanner-frame">
                    <Image
                      src="/images/qr-code.png"
                      alt="QR Code"
                      width={280}
                      height={280}
                      className="qr-code-image"
                    />
                    <div className="scanner-line"></div>
                    <Image
                      src="/images/scanner-frame.png"
                      alt="Scanner Frame"
                      width={320}
                      height={320}
                      className="scanner-frame-overlay"
                    />
                  </div>
                </div>
              </div>

              {/* Verification Result */}
              {showResult && (
                <div className="verification-result-section">
                  <h2 className="result-title">Verification Result</h2>

                  <div className="result-card">
                    <div className="result-content">
                      <Image
                        src="/images/check-circle.png"
                        alt="Valid"
                        width={48}
                        height={48}
                        className="check-icon"
                      />
                      <div className="result-info">
                        <h3 className="result-status">Valid Ticket</h3>
                        <p className="result-details">
                          JohnDoe-TCK-992134, VIP Ticket
                        </p>
                      </div>
                    </div>
                    <button className="checkin-btn">Check-In</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="checklist-view">
              {/* Event Summary Section */}
              <div className="event-summary-section">
                <h2 className="summary-title">Event Summary</h2>
                <p className="summary-subtitle">
                  Live event attendance tracking
                </p>

                <div className="summary-cards">
                  <div className="summary-card">
                    <div
                      className="summary-icon-wrapper"
                      style={{ backgroundColor: "#EEF2FF" }}
                    >
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_9221356-Vbeg3I6OBGkBct2RAZmvUjpRCS6kev.png"
                        alt="Total Tickets"
                        width={30}
                        height={30}
                      />
                    </div>
                    <div className="summary-info">
                      <h3 className="summary-number">{totalTickets}</h3>
                      <p className="summary-label">Total Tickets</p>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div
                      className="summary-icon-wrapper"
                      style={{ backgroundColor: "#DBEAFE" }}
                    >
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%2813%29-ly9MGXSS3x9SGleSpNZioF7RMY8A4J.png"
                        alt="Checked-In"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="summary-info">
                      <h3 className="summary-number">{checkedIn}</h3>
                      <p className="summary-label">Checked-In</p>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div
                      className="summary-icon-wrapper"
                      style={{ backgroundColor: "#FEF3C7" }}
                    >
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Layer_1-I3nUERkpxzu5BKAh2N6ObfjN6uH7BH.png"
                        alt="Remaining"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="summary-info">
                      <h3 className="summary-number">{remaining}</h3>
                      <p className="summary-label">Remaining</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendee Table */}
              <div className="attendee-table-container">
                <table className="attendee-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Ticket ID</th>
                      <th>Address</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((attendee) => (
                      <tr key={attendee.id}>
                        <td>
                          <div className="attendee-name-cell">
                            <Image
                              src={attendee.avatar || "/placeholder.svg"}
                              alt={attendee.name}
                              width={40}
                              height={40}
                              className="attendee-avatar"
                            />
                            <span>{attendee.name}</span>
                          </div>
                        </td>
                        <td>{attendee.email}</td>
                        <td>{attendee.ticketId}</td>
                        <td>{attendee.address}</td>
                        <td>{attendee.quantity}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              attendee.status === "Checked In"
                                ? "status-checked"
                                : "status-remaining"
                            }`}
                          >
                            {attendee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Logout Modal */}
          {showLogoutModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
                onClick={() => setShowLogoutModal(false)}
              />
              <div
                className="relative flex w-[90%] flex-col items-center justify-center bg-white dark:bg-[#101010] p-8 shadow-xl sm:w-[500px]"
                style={{ height: "auto", borderRadius: "16px" }}
              >
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
                >
                  <X className="size-4" />
                </button>
                <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-gray-300">
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#D19537]">
                    <LogOut className="size-6 text-white" />
                  </div>
                </div>
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
                  Are you sure you want to log out?
                </h2>
                <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
                  {"You'll be signed out from your account."}
                </p>
                <div className="flex w-full flex-col gap-4 sm:flex-row">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="h-14 w-full bg-gray-100 font-medium text-[#D19537] transition-colors hover:bg-gray-200 sm:w-[212px]"
                    style={{ borderRadius: "50px" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      console.log("Logging out...");
                      setShowLogoutModal(false);
                    }}
                    className="h-14 w-full bg-[#D19537] font-medium text-white transition-colors hover:bg-[#e99714] sm:w-[212px]"
                    style={{ borderRadius: "50px" }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
