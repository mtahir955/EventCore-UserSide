"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../../host-dashboard/components/sidebar";
import { CircularProgress } from "../../host-dashboard/components/circular-progress";
import { StaffInfoModal } from "../../host-dashboard/components/staff-info-modal";
import { Menu } from "lucide-react";
import Link from "next/link";
import { X, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function EditEventPage() {
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const [hostName, setHostName] = useState("Host");

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
      <main className="flex-1 md:ml-[256px] pt-20 md:pt-0 dark:bg-[#101010]">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-6 border-b bg-white dark:bg-[#101010]">
          <h1 className="text-2xl font-semibold">Events</h1>
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
                className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
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
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="text"
                  defaultValue="13/06/2025"
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
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
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Time
                </label>
                <input
                  type="text"
                  defaultValue="08:00 PM"
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Ticket Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Total Tickets */}
            <div className="rounded-xl p-6 bg-white dark:bg-[#101010] border border-[#F5EDE5] text-center flex flex-col items-center justify-center">
              <div className="text-sm font-medium mb-4">Total Tickets</div>
              <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] flex items-center justify-center">
                <CircularProgress value={120} max={120} color="#D19537" />
              </div>
            </div>

            {/* Booked Tickets */}
            <div className="rounded-xl p-6 bg-white dark:bg-[#101010] border border-[#F5EDE5] text-center flex flex-col items-center justify-center">
              <div className="text-sm font-medium mb-4">Booked Tickets</div>
              <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] flex items-center justify-center">
                <CircularProgress value={91} max={120} color="#D19537" />
              </div>
            </div>

            {/* Remaining Tickets */}
            <div className="rounded-xl p-6 bg-white dark:bg-[#101010] border border-[#F5EDE5] text-center flex flex-col items-center justify-center">
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
                className="grid grid-cols-4 gap-18 sm:grid-cols-4 px-4 sm:px-6 py-4 text-sm border-t border-[#F5EDE5] bg-white dark:bg-[#101010]"
              >
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <img
                    src={attendee.avatar}
                    alt={attendee.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="font-medium">{attendee.name}</span>
                </div>
                <div className="text-gray-700 dark:text-white mr-6 sm:ml-[-36px] sm:flex sm:items-center">
                  {attendee.email}
                </div>
                <div className="text-gray-700 dark:text-white ml-6 sm:ml-[-36px] sm:flex sm:items-center">
                  {attendee.ticketId}
                </div>
                <div className="text-gray-700 dark:text-white sm:flex sm:items-center">
                  {attendee.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

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

      {/* StaffInfo Modal */}
      <StaffInfoModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        staff={staffMembers}
      />
    </div>
  );
}
