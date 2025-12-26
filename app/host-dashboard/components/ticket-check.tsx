"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../components/sidebar";
// import Header from "./header";
import Image from "next/image";
import { Menu, X, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";
import LogoutModalHost from "@/components/modals/LogoutModalHost";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

// const attendees = [
//   {
//     id: 1,
//     name: "Daniel Carter",
//     email: "Info@gmail.com",
//     ticketId: "TCK-992134",
//     address: "Washington DC, USA",
//     quantity: 2,
//     checkedInCount: 1,
//     remainingCount: 1,
//   },
//   {
//     id: 2,
//     name: "Sarah Mitchell",
//     email: "Info@gmail.com",
//     ticketId: "TCK-992135",
//     address: "Washington DC, USA",
//     quantity: 4,
//     checkedInCount: 4,
//     remainingCount: 0,
//   },
// ];

export default function TicketCheck() {
  const [ticketId, setTicketId] = useState("");
  const [showResult, setShowResult] = useState(true);
  const [showChecklist, setShowChecklist] = useState(false);

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

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const eventDropdownRef = useRef<HTMLDivElement>(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const [summary, setSummary] = useState({
    totalTickets: 0,
    checkedIn: 0,
    remaining: 0,
  });

  const [attendees, setAttendees] = useState<any[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(false);

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
  const [hostName, setHostName] = useState("Host");

  useEffect(() => {
    const savedUser = localStorage.getItem("hostUser");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      // Host Name
      setHostName(user.userName || user.fullName || "Host");

      console.log("HOST DASHBOARD USER:", user);
      console.log("HOST SUBDOMAIN:", user?.subDomain);
    } else {
      // Force redirect if no host session found
      window.location.href = "/sign-in-host";
    }
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const attendeesPerPage = 5;

  // Calculate indices
  const indexOfLast = currentPage * attendeesPerPage;
  const indexOfFirst = indexOfLast - attendeesPerPage;

  // Slice for current page
  const currentAttendees = attendees.slice(indexOfFirst, indexOfLast);

  // Total pages
  const totalPages = Math.ceil(attendees.length / attendeesPerPage);

  const [isScanning, setIsScanning] = useState(false);
  const [resultType, setResultType] = useState<"success" | "invalid" | null>(
    null
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("hostToken");

        const res = await fetch(`${API_BASE_URL}/events/ongoing-upcoming`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();

        if (json?.success) {
          setEvents(json.data || []);
          setSelectedEvent(json.data?.[0] || null); // auto-select first
        }
      } catch (error) {
        console.error("Failed to load events", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        eventDropdownRef.current &&
        !eventDropdownRef.current.contains(e.target as Node)
      ) {
        setShowEventDropdown(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const verifyTicket = async () => {
    if (!ticketId.trim()) return;

    try {
      setIsVerifying(true);
      setShowResult(false);

      const token = localStorage.getItem("hostToken");

      const res = await fetch(`${API_BASE_URL}/tickets/admin/mark-used`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": HOST_Tenant_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: selectedEvent?.id,
          fullTicketNumber: ticketId.trim(),
        }),
      });

      const json = await res.json();

      if (res.ok && json?.success) {
        setResultType("success");
        setVerificationMessage(
          json?.message || "Ticket verified & checked in successfully"
        );
      } else {
        setResultType("invalid");
        setVerificationMessage(
          json?.message || "Invalid or already used ticket"
        );
      }

      setShowResult(true);
    } catch (error) {
      console.error("Ticket verification failed", error);
      setResultType("invalid");
      setVerificationMessage("Verification failed. Try again.");
      setShowResult(true);
    } finally {
      setIsVerifying(false);
      setIsScanning(false);
    }
  };

  const fetchEventSummary = async (eventId: string) => {
    try {
      setSummaryLoading(true);

      const token = localStorage.getItem("hostToken");

      const res = await fetch(
        `${API_BASE_URL}/tickets/admin/event/${eventId}/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
            "Content-Type": "application/json",
          },
        }
      );

      const json = await res.json();

      if (json?.success) {
        setSummary(json.data.summary);
        setAttendees(json.data.attendees || []);
        setCurrentPage(1); // reset pagination
      }
    } catch (err) {
      console.error("Failed to load event summary", err);
    } finally {
      setSummaryLoading(false);
    }
  };

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
              onClick={() => {
                if (!showChecklist && selectedEvent?.id) {
                  fetchEventSummary(selectedEvent.id); // 🔥 API CALL
                }
                setShowChecklist(!showChecklist);
              }}
            >
              {showChecklist ? "Back to Scanner" : "View Summary"}
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
                  {/* <div className="event-dropdown">
                    <span className="event-dropdown-text">{selectedEvent}</span>
                    <Image
                      src="/images/chevron-down.png"
                      alt="Dropdown"
                      width={16}
                      height={16}
                      className="chevron-icon"
                    />
                  </div> */}

                  <div
                    ref={eventDropdownRef}
                    className="relative w-full sm:w-[260px]"
                  >
                    <button
                      onClick={() => setShowEventDropdown((p) => !p)}
                      className="w-full flex justify-between items-center border rounded-xl px-4 py-3"
                    >
                      <span className="font-medium">
                        {selectedEvent?.name || "Select Event"}
                      </span>
                      <span
                        className={`transition-transform ${
                          showEventDropdown ? "rotate-180" : ""
                        }`}
                      >
                        ▲
                      </span>
                    </button>

                    {showEventDropdown && (
                      <div className="absolute z-50 mt-2 w-full bg-white dark:bg-[#101010] border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {events.length === 0 ? (
                          <p className="p-3 text-sm text-gray-500">
                            No events found
                          </p>
                        ) : (
                          events.map((event) => (
                            <button
                              key={event.id}
                              onClick={() => {
                                setSelectedEvent(event);
                                setShowEventDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#1f1f1f]"
                            >
                              {event.name}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <div className="manual-entry">
                    <input
                      type="text"
                      placeholder="Manual Enter Ticket ID"
                      value={ticketId}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTicketId(value);

                        if (value.trim().length > 0) {
                          setIsScanning(true); // Start scanner animation
                        } else {
                          setIsScanning(false); // Stop scanner animation
                          setShowResult(false);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          verifyTicket(); // 🔥 REAL BACKEND CHECK
                        }
                      }}
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
                    <div
                      className={`scanner-line ${
                        isScanning ? "animate-scan" : "animate-none"
                      }`}
                    ></div>
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
                      {/* Success Icon */}
                      {resultType === "success" && (
                        <Image
                          src="/images/check-circle.png"
                          alt="Valid"
                          width={48}
                          height={48}
                          className="check-icon"
                        />
                      )}

                      {/* Invalid Icon */}
                      {resultType === "invalid" && (
                        <Image
                          src="/images/check-circle-red.png"
                          alt="Invalid"
                          width={48}
                          height={48}
                          className="check-icon"
                        />
                      )}

                      <div className="result-info">
                        {/* SUCCESS LABEL */}
                        {resultType === "success" && (
                          <>
                            <h3
                              className="result-status"
                              style={{ color: "#22C55E" }}
                            >
                              Valid Ticket
                            </h3>
                            <p className="text-[#3b3b3b] text-xl">
                              {verificationMessage}
                            </p>
                          </>
                        )}

                        {/* INVALID LABEL */}
                        {resultType === "invalid" && (
                          <>
                            <h3
                              className="result-status"
                              style={{ color: "#EF4444" }}
                            >
                              Invalid Ticket
                            </h3>
                            <p className="result-details">
                              Ticket code does not exist
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Show check-in only if success */}
                    {resultType === "success" && (
                      <button
                        className="checkin-btn"
                        onClick={verifyTicket}
                        disabled={isVerifying}
                      >
                        {isVerifying ? "Verifying..." : "Check-In"}
                      </button>
                    )}
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
                      <h3 className="summary-number">{summary.totalTickets}</h3>{" "}
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
                      <h3 className="summary-number">{summary.checkedIn}</h3>{" "}
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
                      <h3 className="summary-number">{summary.remaining}</h3>
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
                      <th>Address</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentAttendees.map((attendee) => (
                      <tr key={attendee.id}>
                        <td>
                          <div className="attendee-name-cell">
                            <span>{attendee.name}</span>
                          </div>
                        </td>

                        <td>{attendee.email}</td>
                        <td>{attendee.address}</td>
                        <td>{attendee.quantity}</td>

                        <td>
                          {attendee.remainingCount > 0 ? (
                            <span className="status-badge status-remaining">
                              Remaining ({attendee.remainingCount})
                            </span>
                          ) : (
                            <span className="status-badge status-checked">
                              Checked In
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  {/* Prev */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="pagination-btn"
                  >
                    Prev
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`pagination-btn ${
                        currentPage === i + 1 ? "pagination-active" : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
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
        </div>
      </div>
    </div>
  );
}
