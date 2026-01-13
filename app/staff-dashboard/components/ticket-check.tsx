"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import Image from "next/image";
// import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";
import { apiClient } from "@/lib/apiClient";

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

type StaffEvent = {
  eventId: string;
  eventName: string;
  eventDate: string; // ISO
  eventAddress: string;
  status: string;
  role: string;
};

export default function TicketCheck() {
  // ===================== STAFF EVENTS (DROPDOWN) =====================
  const [events, setEvents] = useState<StaffEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string>("");
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<StaffEvent | null>(null);

  // fallback display text (until API loads)
  const selectedEventLabel = selectedEvent?.eventName || "Select Event";

  // ===================== EXISTING STATE =====================
  const [ticketId, setTicketId] = useState("");
  const [showResult, setShowResult] = useState(true);
  const [showChecklist, setShowChecklist] = useState(false);

  const [verificationMessage, setVerificationMessage] = useState("");

  const [summary, setSummary] = useState({
    totalTickets: 0,
    checkedIn: 0,
    remaining: 0,
  });

  const [attendees, setAttendees] = useState<any[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const totalTickets = attendees.reduce(
    (sum, attendee) => sum + attendee.quantity,
    0
  );
  const checkedIn = attendees
    .filter((a) => a.status === "Checked In")
    .reduce((sum, a) => sum + a.quantity, 0);
  const remaining = totalTickets - checkedIn;

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

  // ===================== HELPERS =====================

  // const getAuthToken = (): string | null => {
  //   // Staff apps often store staffToken; fallback to token patterns used elsewhere
  //   const raw =
  //     localStorage.getItem("staffToken") ||
  //     localStorage.getItem("token") ||
  //     localStorage.getItem("staffUser") ||
  //     localStorage.getItem("user");

  //   if (!raw) return null;

  //   try {
  //     const parsed = JSON.parse(raw);
  //     if (typeof parsed === "string") return parsed;
  //     if (parsed?.token) return parsed.token;
  //     if (parsed?.accessToken) return parsed.accessToken;
  //     return null;
  //   } catch {
  //     return raw; // plain token string
  //   }
  // };

  const formatEventMeta = (ev: StaffEvent) => {
    // keeps UI simple; you can style later if you want
    const date = ev?.eventDate ? new Date(ev.eventDate) : null;
    const dateText = date
      ? date.toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
    const address = ev?.eventAddress ? ` • ${ev.eventAddress}` : "";
    return `${dateText}${address}`;
  };

  // ===================== FETCH STAFF EVENTS =====================

  useEffect(() => {
    const fetchStaffEvents = async () => {
      setEventsLoading(true);
      setEventsError("");

      try {
        // const token = getAuthToken();
        // if (!token) {
        //   setEventsError("Authentication token missing.");
        //   setEvents([]);
        //   return;
        // }

        // const res = await axios.get(
        //   `${API_BASE_URL}/users/me/dashboard/events`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //       "x-tenant-id": HOST_Tenant_ID,
        //     },
        //   }
        // );
        const res = await apiClient.get("/users/me/dashboard/events");

        const list: StaffEvent[] = Array.isArray(res?.data?.data)
          ? res.data.data
          : [];

        setEvents(list);

        // auto-select first event if none selected
        if (!selectedEvent && list.length > 0) {
          setSelectedEvent(list[0]);
        }
      } catch (err: any) {
        console.error("Failed to load staff events", err);
        setEventsError(
          err?.response?.data?.message || "Failed to load your assigned events."
        );
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchStaffEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===================== CLOSE DROPDOWN ON OUTSIDE CLICK =====================
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!isEventDropdownOpen) return;
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsEventDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isEventDropdownOpen]);

  // if checklist open, close dropdown to avoid overlap
  useEffect(() => {
    if (showChecklist) setIsEventDropdownOpen(false);
  }, [showChecklist]);

  // Reset pagination if checklist toggled
  useEffect(() => {
    setCurrentPage(1);
  }, [showChecklist]);

  // If you want, later you can filter attendees by selectedEvent.eventId (when backend gives you)
  const selectedEventId = useMemo(
    () => selectedEvent?.eventId || null,
    [selectedEvent]
  );

  const verifyTicket = async () => {
    if (!ticketId.trim() || !selectedEvent?.eventId) return;

    try {
      setIsScanning(true);
      setShowResult(false);

      // const token = getAuthToken();

      // if (!token) {
      //   setResultType("invalid");
      //   setVerificationMessage("Authentication token missing");
      //   setShowResult(true);
      //   return;
      // }

      // const res = await fetch(`${API_BASE_URL}/tickets/admin/mark-used`, {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "X-Tenant-ID": HOST_Tenant_ID,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     eventId: selectedEvent.eventId,
      //     fullTicketNumber: ticketId.trim(),
      //   }),
      // });

      // const json = await res.json();

      // if (res.ok && json?.success) {
      //   setResultType("success");
      //   setVerificationMessage(
      //     json.message || "Ticket checked in successfully"
      //   );
      // } else {
      //   setResultType("invalid");
      //   setVerificationMessage(json?.message || "Invalid ticket");
      // }

      // setShowResult(true);
      const res = await apiClient.post("/tickets/admin/mark-used", {
        eventId: selectedEvent.eventId,
        fullTicketNumber: ticketId.trim(),
      });

      const json = res.data;

      if (json?.success) {
        setResultType("success");
        setVerificationMessage(
          json.message || "Ticket checked in successfully"
        );
      } else {
        setResultType("invalid");
        setVerificationMessage(json?.message || "Invalid ticket");
      }

      setShowResult(true);
    } catch (err) {
      console.error("Ticket verification failed", err);
      setResultType("invalid");
      setVerificationMessage("Verification failed. Try again.");
      setShowResult(true);
    } finally {
      setIsScanning(false);
    }
  };

  const fetchEventSummary = async (eventId: string) => {
    try {
      setSummaryLoading(true);

      // const token = getAuthToken();
      // if (!token) return;

      // const res = await fetch(
      //   `${API_BASE_URL}/tickets/staff/event/${eventId}/summary`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "X-Tenant-ID": HOST_Tenant_ID,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      // const json = await res.json();

      // if (json?.success) {
      //   setSummary(json.data.summary);
      //   setAttendees(json.data.attendees || []);
      //   setCurrentPage(1); // reset pagination
      // }\
      const res = await apiClient.get(
        `/tickets/staff/event/${eventId}/summary`
      );
      const json = res.data;

      if (json?.success) {
        setSummary(json.data.summary);
        setAttendees(json.data.attendees || []);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Failed to load event summary", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-white font-sans">
      {/* Sidebar */}
      <div className=" md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 dark:bg-[#101010] w-full">
        {/* ✅ Header visible on tablet/desktop only */}
        <div className="hidden sm:block">
          <Header title="Ticket Check" />
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
          {/* Header Section */}
          <div className="ticket-check-header">
            <div>
              <h1 className="ticket-check-title">Ticket Check</h1>
            </div>
            <button
              className="view-checklist-btn"
              onClick={() => {
                if (!showChecklist && selectedEvent?.eventId) {
                  fetchEventSummary(selectedEvent.eventId); // 🔥 BACKEND CALL
                }
                setShowChecklist(!showChecklist);
              }}
            >
              {showChecklist ? "Back to Scanner" : "View Summary"}
            </button>
          </div>

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
                  {/* ✅ DROPDOWN (NOW DYNAMIC FROM API) */}
                  <div
                    ref={dropdownRef}
                    className="relative event-dropdown"
                    onClick={() => setIsEventDropdownOpen((p) => !p)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsEventDropdownOpen((p) => !p);
                      }
                      if (e.key === "Escape") setIsEventDropdownOpen(false);
                    }}
                  >
                    <span className="event-dropdown-text">
                      {eventsLoading ? "Loading events..." : selectedEventLabel}
                    </span>

                    <Image
                      src="/images/chevron-down.png"
                      alt="Dropdown"
                      width={16}
                      height={16}
                      className="chevron-icon"
                    />

                    {/* Dropdown Menu */}
                    {isEventDropdownOpen && (
                      <div className="absolute z-50 mt-2 w-full rounded-xl border bg-white shadow-lg overflow-hidden">
                        {eventsError ? (
                          <div className="px-4 py-3 text-sm text-red-600">
                            {eventsError}
                          </div>
                        ) : events.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            No events assigned yet.
                          </div>
                        ) : (
                          <ul className="max-h-72 overflow-auto">
                            {events.map((ev) => {
                              const isActive = ev.eventId === selectedEventId;
                              return (
                                <li
                                  key={ev.eventId}
                                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                                    isActive ? "bg-gray-50" : ""
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(ev);
                                    setIsEventDropdownOpen(false);
                                    // If you want: reset scanner state on event change
                                    setTicketId("");
                                    setShowResult(false);
                                    setResultType(null);
                                    setIsScanning(false);
                                  }}
                                >
                                  <div className="text-sm font-medium text-gray-900">
                                    {ev.eventName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatEventMeta(ev)}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
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
                          setIsScanning(true);
                        } else {
                          setIsScanning(false);
                          setShowResult(false);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          verifyTicket(); // ✅ REAL BACKEND CHECK
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
                      onClick={verifyTicket} // ✅ Optional click support
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
                        {/* ✅ SUCCESS */}
                        {resultType === "success" && (
                          <>
                            <h3
                              className="result-status"
                              style={{ color: "#22C55E" }}
                            >
                              Valid Ticket
                            </h3>
                            <p className="result-details">
                              {verificationMessage ||
                                "Ticket verified successfully"}
                            </p>
                          </>
                        )}

                        {/* ❌ INVALID */}
                        {resultType === "invalid" && (
                          <>
                            <h3
                              className="result-status"
                              style={{ color: "#EF4444" }}
                            >
                              Invalid Ticket
                            </h3>
                            <p className="result-details">
                              {verificationMessage ||
                                "Invalid or already used ticket"}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* ✅ Check-In button (optional re-check / manual trigger) */}
                    {resultType === "success" && (
                      <button className="checkin-btn" onClick={verifyTicket}>
                        Check-In
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
                      <h3 className="summary-number">{summary.totalTickets}</h3>
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
                      <h3 className="summary-number">{summary.checkedIn}</h3>
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
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import Sidebar from "./sidebar";
// import Header from "./header";
// import Image from "next/image";

// const attendees = [
//   {
//     id: 1,
//     name: "Daniel Carter",
//     avatar:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%20427326245-oVTfNgNqoEaWlr3G9Um3EioZtlScTJ.png",
//     email: "Info@gmail.com",
//     ticketId: "TCK-992134",
//     address: "Washington DC, USA",
//     quantity: 2,
//     status: "Remaining",
//   },
//   {
//     id: 2,
//     name: "Sarah Mitchell",
//     avatar: "/placeholder.svg?height=40&width=40",
//     email: "Info@gmail.com",
//     ticketId: "TCK-992134",
//     address: "Washington DC, USA",
//     quantity: 4,
//     status: "Checked In",
//   },
//   {
//     id: 3,
//     name: "Emily Carter",
//     avatar: "/placeholder.svg?height=40&width=40",
//     email: "Info@gmail.com",
//     ticketId: "TCK-992134",
//     address: "Washington DC, USA",
//     quantity: 1,
//     status: "Checked In",
//   },
//   {
//     id: 4,
//     name: "Nathan Blake",
//     avatar: "/placeholder.svg?height=40&width=40",
//     email: "Info@gmail.com",
//     ticketId: "TCK-992134",
//     address: "Washington DC, USA",
//     quantity: 2,
//     status: "Remaining",
//   },
//   {
//     id: 5,
//     name: "Taylor Morgan",
//     avatar: "/placeholder.svg?height=40&width=40",
//     email: "Info@gmail.com",
//     ticketId: "TCK-992134",
//     address: "Washington DC, USA",
//     quantity: 1,
//     status: "Remaining",
//   },
//   {
//     id: 6,
//     name: "Taylor Morgan",
//     avatar: "/placeholder.svg?height=40&width=40",
//     email: "Info@gmail.com",
//     ticketId: "TCK-992134",
//     address: "Washington DC, USA",
//     quantity: 2,
//     status: "Checked In",
//   },
//   {
//     id: 7,
//     name: "Daniel Carter",
//     avatar:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%20427326245-oVTfNgNqoEaWlr3G9Um3EioZtlScTJ.png",
//     email: "Info@gmail.com",
//     ticketId: "TCK-992134",
//     address: "Washington DC, USA",
//     quantity: 2,
//     status: "Remaining",
//   },
//   {
//     id: 8,
//     name: "Daniel Carter",
//     avatar:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%20427326245-oVTfNgNqoEaWlr3G9Um3EioZtlScTJ.png",
//     email: "Info@gmail.com",
//     ticketId: "TCK-992134",
//     address: "Washington DC, USA",
//     quantity: 4,
//     status: "Checked In",
//   },
//   {
//     id: 9,
//     name: "Sarah Mitchell",
//     avatar: "/placeholder.svg?height=40&width=40",
//     email: "Info@gmail.com",
//     ticketId: "TCK-992134",
//     address: "Washington DC, USA",
//     quantity: 1,
//     status: "Checked In",
//   },
// ];

// export default function TicketCheck() {
//   const [selectedEvent, setSelectedEvent] = useState(
//     "Starry Nights Music Fest"
//   );
//   const [ticketId, setTicketId] = useState("");
//   const [showResult, setShowResult] = useState(true);
//   const [showChecklist, setShowChecklist] = useState(false);

//   const totalTickets = attendees.reduce(
//     (sum, attendee) => sum + attendee.quantity,
//     0
//   );
//   const checkedIn = attendees
//     .filter((a) => a.status === "Checked In")
//     .reduce((sum, a) => sum + a.quantity, 0);
//   const remaining = totalTickets - checkedIn;

//   const [currentPage, setCurrentPage] = useState(1);
//   const attendeesPerPage = 5;

//   // Calculate indices
//   const indexOfLast = currentPage * attendeesPerPage;
//   const indexOfFirst = indexOfLast - attendeesPerPage;

//   // Slice for current page
//   const currentAttendees = attendees.slice(indexOfFirst, indexOfLast);

//   // Total pages
//   const totalPages = Math.ceil(attendees.length / attendeesPerPage);

//   const [isScanning, setIsScanning] = useState(false);
//   const [resultType, setResultType] = useState<"success" | "invalid" | null>(
//     null
//   );

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen w-full bg-white font-sans">
//       {/* Sidebar */}
//       <div className=" md:block">
//         <Sidebar />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 bg-gray-50 dark:bg-[#101010] w-full">
//         {/* ✅ Header visible on tablet/desktop only */}
//         <div className="hidden sm:block">
//           <Header title="Ticket Check" />
//         </div>

//         {/* ✅ Optional mobile navbar */}
//         <div className="sm:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
//           <h1 className="text-lg font-semibold text-gray-800">Ticket Check</h1>
//           <Image
//             src="/images/search-icon.png"
//             alt="Search"
//             width={20}
//             height={20}
//             className="opacity-70"
//           />
//         </div>

//         <div className="ticket-check-content px-4 sm:px-6 md:px-8 py-6 sm:py-8">
//           {/* everything else remains the same */}

//           {/* Header Section */}
//           <div className="ticket-check-header">
//             <div>
//               <h1 className="ticket-check-title">Ticket Check</h1>
//             </div>
//             <button
//               className="view-checklist-btn"
//               onClick={() => setShowChecklist(!showChecklist)}
//             >
//               {showChecklist ? "Back to Scanner" : "View Check List"}
//             </button>
//           </div>
//           {!showChecklist ? (
//             <>
//               {/* Ticket Verification Section */}
//               <div className="ticket-verification-section">
//                 <h2 className="verification-title">Ticket Verification</h2>
//                 <p className="verification-subtitle">
//                   Scan QR codes or enter Tickets IDs to verify
//                 </p>

//                 {/* Event Selection and Manual Entry */}
//                 <div className="verification-controls">
//                   <div className="event-dropdown">
//                     <span className="event-dropdown-text">{selectedEvent}</span>
//                     <Image
//                       src="/images/chevron-down.png"
//                       alt="Dropdown"
//                       width={16}
//                       height={16}
//                       className="chevron-icon"
//                     />
//                   </div>

//                   <div className="manual-entry">
//                     <input
//                       type="text"
//                       placeholder="Manual Enter Ticket ID"
//                       value={ticketId}
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         setTicketId(value);

//                         if (value.trim().length > 0) {
//                           setIsScanning(true); // Start scanner animation
//                         } else {
//                           setIsScanning(false); // Stop scanner animation
//                           setShowResult(false);
//                         }
//                       }}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           const found = attendees.find(
//                             (a) =>
//                               a.ticketId.toLowerCase() ===
//                               ticketId.toLowerCase()
//                           );

//                           setIsScanning(false); // stop animation after checking

//                           if (found) {
//                             setResultType("success");
//                           } else {
//                             setResultType("invalid");
//                           }

//                           setShowResult(true);
//                         }
//                       }}
//                       className="ticket-id-input"
//                     />

//                     <Image
//                       src="/images/search-icon.png"
//                       alt="Search"
//                       width={20}
//                       height={20}
//                       className="search-icon"
//                     />
//                   </div>
//                 </div>

//                 {/* QR Scanner Visualization */}
//                 <div className="qr-scanner-container">
//                   <div className="qr-scanner-frame">
//                     <Image
//                       src="/images/qr-code.png"
//                       alt="QR Code"
//                       width={280}
//                       height={280}
//                       className="qr-code-image"
//                     />
//                     <div
//                       className={`scanner-line ${
//                         isScanning ? "animate-scan" : "animate-none"
//                       }`}
//                     ></div>
//                     <Image
//                       src="/images/scanner-frame.png"
//                       alt="Scanner Frame"
//                       width={320}
//                       height={320}
//                       className="scanner-frame-overlay"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Verification Result */}
//               {showResult && (
//                 <div className="verification-result-section">
//                   <h2 className="result-title">Verification Result</h2>

//                   <div className="result-card">
//                     <div className="result-content">
//                       {/* Success Icon */}
//                       {resultType === "success" && (
//                         <Image
//                           src="/images/check-circle.png"
//                           alt="Valid"
//                           width={48}
//                           height={48}
//                           className="check-icon"
//                         />
//                       )}

//                       {/* Invalid Icon */}
//                       {resultType === "invalid" && (
//                         <Image
//                           src="/images/check-circle-red.png"
//                           alt="Invalid"
//                           width={48}
//                           height={48}
//                           className="check-icon"
//                         />
//                       )}

//                       <div className="result-info">
//                         {/* SUCCESS LABEL */}
//                         {resultType === "success" && (
//                           <>
//                             <h3
//                               className="result-status"
//                               style={{ color: "#22C55E" }}
//                             >
//                               Valid Ticket
//                             </h3>
//                             <p className="result-details">
//                               {ticketId}, Valid Ticket
//                             </p>
//                           </>
//                         )}

//                         {/* INVALID LABEL */}
//                         {resultType === "invalid" && (
//                           <>
//                             <h3
//                               className="result-status"
//                               style={{ color: "#EF4444" }}
//                             >
//                               Invalid Ticket
//                             </h3>
//                             <p className="result-details">
//                               Ticket code does not exist
//                             </p>
//                           </>
//                         )}
//                       </div>
//                     </div>

//                     {/* Show check-in only if success */}
//                     {resultType === "success" && (
//                       <button className="checkin-btn">Check-In</button>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="checklist-view">
//               {/* Event Summary Section */}
//               <div className="event-summary-section">
//                 <h2 className="summary-title">Event Summary</h2>
//                 <p className="summary-subtitle">
//                   Live event attendance tracking
//                 </p>

//                 <div className="summary-cards">
//                   <div className="summary-card">
//                     <div
//                       className="summary-icon-wrapper"
//                       style={{ backgroundColor: "#EEF2FF" }}
//                     >
//                       <Image
//                         src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fi_9221356-Vbeg3I6OBGkBct2RAZmvUjpRCS6kev.png"
//                         alt="Total Tickets"
//                         width={30}
//                         height={30}
//                       />
//                     </div>
//                     <div className="summary-info">
//                       <h3 className="summary-number">{totalTickets}</h3>
//                       <p className="summary-label">Total Tickets</p>
//                     </div>
//                   </div>

//                   <div className="summary-card">
//                     <div
//                       className="summary-icon-wrapper"
//                       style={{ backgroundColor: "#DBEAFE" }}
//                     >
//                       <Image
//                         src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%2813%29-ly9MGXSS3x9SGleSpNZioF7RMY8A4J.png"
//                         alt="Checked-In"
//                         width={32}
//                         height={32}
//                       />
//                     </div>
//                     <div className="summary-info">
//                       <h3 className="summary-number">{checkedIn}</h3>
//                       <p className="summary-label">Checked-In</p>
//                     </div>
//                   </div>

//                   <div className="summary-card">
//                     <div
//                       className="summary-icon-wrapper"
//                       style={{ backgroundColor: "#FEF3C7" }}
//                     >
//                       <Image
//                         src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Layer_1-I3nUERkpxzu5BKAh2N6ObfjN6uH7BH.png"
//                         alt="Remaining"
//                         width={32}
//                         height={32}
//                       />
//                     </div>
//                     <div className="summary-info">
//                       <h3 className="summary-number">{remaining}</h3>
//                       <p className="summary-label">Remaining</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Attendee Table */}
//               <div className="attendee-table-container">
//                 <table className="attendee-table">
//                   <thead>
//                     <tr>
//                       <th>Name</th>
//                       <th>Email</th>
//                       <th>Ticket ID</th>
//                       <th>Address</th>
//                       <th>Quantity</th>
//                       <th>Status</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {currentAttendees.map((attendee) => (
//                       <tr key={attendee.id}>
//                         <td>
//                           <div className="attendee-name-cell">
//                             <Image
//                               src={attendee.avatar || "/placeholder.svg"}
//                               alt={attendee.name}
//                               width={40}
//                               height={40}
//                               className="attendee-avatar"
//                             />
//                             <span>{attendee.name}</span>
//                           </div>
//                         </td>

//                         <td>{attendee.email}</td>
//                         <td>{attendee.ticketId}</td>
//                         <td>{attendee.address}</td>
//                         <td>{attendee.quantity}</td>

//                         <td>
//                           <span
//                             className={`status-badge ${
//                               attendee.status === "Checked In"
//                                 ? "status-checked"
//                                 : "status-remaining"
//                             }`}
//                           >
//                             {attendee.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="pagination-wrapper">
//                   {/* Prev */}
//                   <button
//                     disabled={currentPage === 1}
//                     onClick={() => setCurrentPage((p) => p - 1)}
//                     className="pagination-btn"
//                   >
//                     Prev
//                   </button>

//                   {/* Page Numbers */}
//                   {[...Array(totalPages)].map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setCurrentPage(i + 1)}
//                       className={`pagination-btn ${
//                         currentPage === i + 1 ? "pagination-active" : ""
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}

//                   {/* Next */}
//                   <button
//                     disabled={currentPage === totalPages}
//                     onClick={() => setCurrentPage((p) => p + 1)}
//                     className="pagination-btn"
//                   >
//                     Next
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
