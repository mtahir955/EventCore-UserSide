"use client";

import { Sidebar } from "../admin/components/sidebar";
import { CircularProgress } from "../admin/components/circular-progress";
import { useState } from "react";
import { UserInfoModal } from "../admin/components/user-info-modal";
import { Bell, User } from "lucide-react";
import Link from "next/link";

export default function CompletedEventsEdit() {
  const [ispopupModalOpen, setispopupModalOpen] = useState(false);

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
      {/* Sidebar */}
      <Sidebar activePage="Host Management" />

      {/* ===== Main Area ===== */}
      <main className="flex-1 overflow-auto lg:ml-[250px]">
        {/* ===== Header ===== */}
        <header className="hidden lg:flex items-center justify-between px-8 py-6 border-b border-border bg-white sticky top-0 z-30">
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

        {/* Mobile Header Placeholder */}
        <div className="lg:hidden h-[56px]" />

        {/* ===== Page Content ===== */}
        <div className="px-4 sm:px-6 md:px-8 pb-6 space-y-8">
          {/* Hero image */}
          <div className="relative rounded-xl overflow-hidden h-[180px] sm:h-[200px] mb-6">
            <img
              src="/images/event-banner.png"
              alt="Event banner"
              className="h-full w-full object-cover"
            />
            <button
              aria-label="Back"
              onClick={() => window.history.back()}
              className="absolute top-3 left-3 h-9 w-9 sm:h-10 sm:w-10 grid place-items-center bg-white/70 rounded-full hover:bg-white transition"
            >
              <img
                src="/icons/back-button.png"
                alt="Back"
                className="h-6 w-6 sm:h-8 sm:w-8"
              />
            </button>
          </div>

          {/* ===== Event Details Form ===== */}
          <div className="space-y-4">
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

            {/* Location & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Start & End Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  defaultValue="09:00 PM"
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* ===== Ticket Statistics ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Attendees Table */}
          <div className="rounded-xl overflow-hidden border border-[#F5EDE5]">
            {/* Table Header */}
            <div className="flex sm:grid sm:grid-cols-4 px-6 py-4 text-sm font-semibold bg-[#F5EDE5] text-black ">
              <div className="flex-1">Name</div>
              <div className="flex-1">Email</div>
              <div className="flex-1">Ticket ID</div>
              <div className="flex-1 text-right sm:text-left">Quantity</div>
            </div>

            {/* Mobile Table Header */}
            <div className="hidden sm:hidden px-4 py-3 text-[15px] font-semibold bg-[#F5EDE5]">
              Attendees
            </div>

            {attendees.map((attendee, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 gap-18 sm:grid-cols-4 px-4 sm:px-6 py-4 text-sm border-t border-[#F5EDE5] bg-white"
              >
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <img
                    src={attendee.avatar}
                    alt={attendee.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="font-medium">{attendee.name}</span>
                </div>
                <div className="text-gray-700 mr-6 sm:ml-[-36px] sm:flex sm:items-center">
                  {attendee.email}
                </div>
                <div className="text-gray-700 ml-6 sm:ml-[-36px] sm:flex sm:items-center">
                  {attendee.ticketId}
                </div>
                <div className="text-gray-700 sm:flex sm:items-center">
                  {attendee.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      <UserInfoModal
        isOpen={ispopupModalOpen}
        onClose={() => setispopupModalOpen(false)}
      />
    </div>
  );
}
