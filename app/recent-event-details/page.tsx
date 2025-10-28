"use client";

import { Sidebar } from "../admin/components/sidebar";
import { CircularProgress } from "../admin/components/circular-progress";
import { useState } from "react";
import { Bell, User } from "lucide-react";
import Link from "next/link";

export default function CompletedEventsEdit() {
  const [isHostRequestModalOpen, setIsHostRequestModalOpen] = useState(false); // Added modal state
  const staffMembers = [
    {
      fullName: "Daniel Carter",
      email: "info@gmail.com",
      phoneNumber: "+44 7412 558492",
      role: "Both",
    },
    {
      fullName: "Daniel Carter",
      email: "info@gmail.com",
      phoneNumber: "+44 7412 558492",
      role: "Ticket Check",
    },
  ];
  const attendees = [
    {
      name: "Daniel Carter",
      email: "Info@gmail.com",
      ticketId: "TCK-992134",
      quantity: 2,
      avatar: "/images/daniel-carter-img.png",
    },
    {
      name: "Sarah Mitchell",
      email: "Info@gmail.com",
      ticketId: "TCK-992134",
      quantity: 4,
      avatar: "/images/daniel-carter-img.png",
    },
    {
      name: "Emily Carter",
      email: "Info@gmail.com",
      ticketId: "TCK-992134",
      quantity: 1,
      avatar: "/images/daniel-carter-img.png",
    },
    {
      name: "Nathan Blake",
      email: "Info@gmail.com",
      ticketId: "TCK-992134",
      quantity: 2,
      avatar: "/images/daniel-carter-img.png",
    },
    {
      name: "Taylor Morgan",
      email: "Info@gmail.com",
      ticketId: "TCK-992134",
      quantity: 1,
      avatar: "/images/daniel-carter-img.png",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAFAFB]">
      <Sidebar activePage="Host Management" />

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <h1 className="text-3xl font-semibold">Host Management</h1>
          <div className="flex items-center gap-4">
            <Link href="/push-notification">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
                <Bell className="h-6 w-6 text-gray-600" />
              </button>
            </Link>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              <User className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="px-8 pb-6">
          {/* Top bar with back button and action buttons */}
          {/* Hero image with back button overlay */}
          <div className="relative rounded-xl overflow-hidden mb-6 h-[200px]">
            <img
              src="/images/event-banner.png"
              alt="Event banner"
              className="h-full w-full object-cover"
            />
            <button
              aria-label="Back"
              onClick={() => window.history.back()}
              className="absolute top-3 left-3 h-10 w-10 grid place-items-center bg-white/70 rounded-full hover:bg-white transition"
            >
              <img
                src="/icons/back-button.png"
                alt="Back"
                className="h-8 w-8"
              />
            </button>
          </div>

          {/* Event form */}
          <div className="space-y-4 mb-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Name
              </label>
              <input
                type="text"
                defaultValue="Starry Nights Music Fest"
                className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white text-sm"
              />
            </div>

            {/* Location and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  defaultValue="California"
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="text"
                  defaultValue="13/06/2025"
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white text-sm"
                />
              </div>
            </div>

            {/* Start Time and End Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Time
                </label>
                <input
                  type="text"
                  defaultValue="08:00 PM"
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Time
                </label>
                <input
                  type="text"
                  defaultValue="08:00 PM"
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Ticket statistics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl p-6 bg-white border border-[#F5EDE5]">
              <div className="text-center">
                <div className="text-sm font-medium mb-4">Total Tickets</div>
                <CircularProgress value={120} max={120} color="#D19537" />
              </div>
            </div>
            <div className="rounded-xl p-6 bg-white border border-[#F5EDE5]">
              <div className="text-center">
                <div className="text-sm font-medium mb-4">Booked Tickets</div>
                <CircularProgress value={91} max={120} color="#D19537" />
              </div>
            </div>
            <div className="rounded-xl p-6 bg-white border border-[#F5EDE5]">
              <div className="text-center">
                <div className="text-sm font-medium mb-4">
                  Remaining Tickets
                </div>
                <CircularProgress value={29} max={120} color="#D19537" />
              </div>
            </div>
          </div>

          {/* Attendees table */}
          <div className="rounded-xl overflow-hidden border border-[#F5EDE5]">
            {/* Table header */}
            <div className="grid grid-cols-4 px-6 py-4 text-sm font-medium bg-[#F5EDE5]">
              <div>Name</div>
              <div>Email</div>
              <div>Ticket ID</div>
              <div>Quantity</div>
            </div>

            {/* Table rows */}
            {attendees.map((attendee, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 px-6 py-4 text-sm border-t border-[#F5EDE5] bg-white"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={attendee.avatar || "/placeholder.svg"}
                    alt={attendee.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span>{attendee.name}</span>
                </div>
                <div className="flex items-center">{attendee.email}</div>
                <div className="flex items-center">{attendee.ticketId}</div>
                <div className="flex items-center">{attendee.quantity}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
