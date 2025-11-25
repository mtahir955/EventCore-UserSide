"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import Image from "next/image";

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

  const [currentPage, setCurrentPage] = useState(1);
  const attendeesPerPage = 5;

  // Calculate indices
  const indexOfLast = currentPage * attendeesPerPage;
  const indexOfFirst = indexOfLast - attendeesPerPage;

  // Slice for current page
  const currentAttendees = attendees.slice(indexOfFirst, indexOfLast);

  // Total pages
  const totalPages = Math.ceil(attendees.length / attendeesPerPage);

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
                    {currentAttendees.map((attendee) => (
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
