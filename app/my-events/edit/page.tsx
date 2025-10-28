"use client";

import { useState, useRef } from "react";
import { Sidebar } from "../../host-dashboard/components/sidebar";
import { CircularProgress } from "../../host-dashboard/components/circular-progress";
import { StaffInfoModal } from "../../host-dashboard/components/staff-info-modal";
import { Menu } from "lucide-react";

export default function EditEventPage() {
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      avatar: "/images/avatars/daniel-carter.png",
    },
    {
      name: "Sarah Mitchell",
      email: "Info@gmail.com",
      ticketId: "TCK-992134",
      quantity: 4,
      avatar: "/images/avatars/sarah-mitchell.png",
    },
    {
      name: "Emily Carter",
      email: "Info@gmail.com",
      ticketId: "TCK-992134",
      quantity: 1,
      avatar: "/images/avatars/emily-carter.png",
    },
    {
      name: "Nathan Blake",
      email: "Info@gmail.com",
      ticketId: "TCK-992134",
      quantity: 2,
      avatar: "/images/avatars/nathan-blake.png",
    },
    {
      name: "Taylor Morgan",
      email: "Info@gmail.com",
      ticketId: "TCK-992134",
      quantity: 1,
      avatar: "/images/avatars/taylor-morgan.png",
    },
  ];

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex min-h-screen bg-[#FAFAFB] relative">
      {/* Sidebar */}
      <Sidebar
        active="My Events"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} className="text-black" />
          </button>
          <h3 className="text-lg font-semibold text-black">Events</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border h-9 w-9 flex justify-center items-center rounded-full">
            <img
              src="/images/icons/notification-new.png"
              alt="notification"
              className="h-4 w-4"
            />
          </div>
          <div className="bg-black border h-9 w-9 flex justify-center items-center rounded-full">
            <img
              src="/images/icons/profile-user.png"
              alt="profile"
              className="h-4 w-4"
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-[256px] pt-20 md:pt-0">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-6 border-b bg-white">
          <h1 className="text-2xl font-semibold">Events</h1>
          <div className="flex items-center gap-4">
            <div className="bg-white border h-10 w-10 flex justify-center items-center rounded-full">
              <img
                src="/images/icons/notification-new.png"
                alt="profile"
                className="rounded-full"
              />
            </div>
            <div className="bg-black border h-10 w-10 flex justify-center items-center rounded-full">
              <img
                src="/images/icons/profile-user.png"
                alt="profile"
                className="rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="px-1 md:px-8 py-6">
          {/* Top bar with back button and actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <div className="flex items-center gap-4">
              <button
                aria-label="Back"
                onClick={() => window.history.back()}
                className="h-8 w-8 grid place-items-center"
              >
                <img
                  src="/images/icons/back-arrow.png"
                  alt="Back"
                  className="h-6 w-6 sm:h-8 sm:w-8"
                />
              </button>
              <h2 className="text-lg sm:text-xl font-semibold">
                Edit Event Info
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-nowrap justify-start sm:justify-end">
              <button
                onClick={() => setIsStaffModalOpen(true)}
                className="flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-black whitespace-nowrap"
              >
                Staff Management
              </button>
              <button className="flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#D19537] whitespace-nowrap">
                Mark as Complete
              </button>
            </div>
          </div>

          {/* Hero Image (Editable) */}
          <div className="relative rounded-2xl overflow-hidden mb-6 h-[180px] sm:h-[200px]">
            {/* Event Banner */}
            <img
              src={previewImage || "/images/event-hero-banner.png"}
              alt="Event banner"
              className="h-full w-full object-cover transition-all duration-300"
            />

            {/* Edit Button */}
            <button
              aria-label="Edit banner"
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white grid place-items-center shadow-lg hover:scale-105 transition-transform"
            >
              <img
                src="/images/icons/edit-pencil-gold.png"
                alt="Edit"
                className="h-4 w-4 sm:h-5 sm:w-5"
              />
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setPreviewImage(event.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          {/* Event Form */}
          <div className="space-y-4 mb-6">
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

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
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

          {/* Ticket Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Total Tickets */}
            <div className="rounded-xl p-6 bg-white border border-[#F5EDE5] text-center flex flex-col items-center justify-center">
              <div className="text-sm font-medium mb-4">Total Tickets</div>
              <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] flex items-center justify-center">
                <CircularProgress value={120} max={120} color="#D19537" />
              </div>
            </div>

            {/* Booked Tickets */}
            <div className="rounded-xl p-6 bg-white border border-[#F5EDE5] text-center flex flex-col items-center justify-center">
              <div className="text-sm font-medium mb-4">Booked Tickets</div>
              <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] flex items-center justify-center">
                <CircularProgress value={91} max={120} color="#D19537" />
              </div>
            </div>

            {/* Remaining Tickets */}
            <div className="rounded-xl p-6 bg-white border border-[#F5EDE5] text-center flex flex-col items-center justify-center">
              <div className="text-sm font-medium mb-4">Remaining Tickets</div>
              <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] flex items-center justify-center">
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

      {/* StaffInfo Modal */}
      <StaffInfoModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        staff={staffMembers}
      />
    </div>
  );
}
