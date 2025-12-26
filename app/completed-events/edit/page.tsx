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
import LogoutModalHost from "@/components/modals/LogoutModalHost";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

export default function EditEventPage() {
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hostName, setHostName] = useState("Host");

  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");

  useEffect(() => {
    if (!eventId) return;

    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem("hostToken");

        const res = await fetch(`${API_BASE_URL}/events/${eventId}/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();

        if (json?.success) {
          setEvent(json.data);
        }
      } catch (err) {
        console.error("Failed to load event details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen">
        Event not found
      </div>
    );
  }

  /* ================= SAFE DATA ================= */

  const attendees = Array.isArray(event.attendees) ? event.attendees : [];

  /* ================= PAGINATION ================= */

  const attendeesPerPage = 5;

  const indexOfLast = currentPage * attendeesPerPage;
  const indexOfFirst = indexOfLast - attendeesPerPage;

  const currentAttendees = attendees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(attendees.length / attendeesPerPage);

  return (
    <div className="flex min-h-screen bg-[#FAFAFB] relative">
      {/* Sidebar */}
      <Sidebar
        active="Completed Events"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      {/* Main content */}
      <main className="flex-1 md:ml-[256px] pt-20 md:pt-0 dark:bg-[#101010]">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-6 border-b bg-white dark:bg-[#101010]">
          <h1 className="text-2xl font-semibold">Completed Events</h1>
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

        {/* Bottom Divider Line */}
        <div className="border-b border-gray-200 dark:border-gray-800"></div>

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
                Completed Events
              </h2>
            </div>
          </div>

          {/* Hero Image (Editable) */}
          <div className="relative rounded-2xl overflow-hidden mb-6 h-[180px] sm:h-[200px]">
            {/* Event Banner */}
            <img
              src={
                previewImage || event.bannerImage || "/images/event-banner.png"
              }
              alt="Event banner"
              className="h-full w-full object-cover"
            />

            {/* Edit Button
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
            </button> */}

            {/* Hidden File Input */}
            {/* <input
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
            /> */}
          </div>

          {/* Event Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Name
              </label>
              <input
                type="text"
                value={event.title}
                className="w-full px-4 py-3 rounded-lg border"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={event.location}
                  className="w-full px-4 py-3 rounded-lg border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="text"
                  value={event.startDate}
                  className="w-full px-4 py-3 rounded-lg border"
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
                  value={event.startTime}
                  className="w-full px-4 py-3 rounded-lg border"
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

          {/* Attendees Table */}
          <div className="rounded-xl overflow-hidden border border-[#F5EDE5]">
            {/* Table Header */}
            <div className="flex sm:grid sm:grid-cols-4 px-6 py-4 text-sm font-semibold bg-[#F5EDE5] text-black">
              <div className="flex-1">Name</div>
              <div className="flex-1">Email</div>
              <div className="flex-1">Address</div>
              <div className="flex-1 text-right sm:text-left">Quantity</div>
            </div>

            {/* Mobile Table Title */}
            <div className="hidden sm:hidden px-4 py-3 text-[15px] font-semibold bg-[#F5EDE5]">
              Attendees
            </div>

            {/* ⭐ PAGINATED DATA */}
            {currentAttendees.map((attendee, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 gap-18 sm:grid-cols-4 px-4 sm:px-6 py-4 text-sm border-t border-[#F5EDE5] bg-white dark:bg-[#101010]"
              >
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <span className="font-medium">{attendee.name}</span>
                </div>

                <div className="text-gray-700 dark:text-white mr-6 sm:ml-[-36px] sm:flex sm:items-center">
                  {attendee.email}
                </div>

                <div className="text-gray-700 dark:text-white ml-6 sm:ml-[-36px] sm:flex sm:items-center">
                  {attendee.address || "N/A"}
                </div>

                <div className="text-gray-700 dark:text-white sm:flex sm:items-center">
                  {attendee.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4 mb-6">
              {/* Prev Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
              >
                Prev
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 border rounded-md ${
                    currentPage === i + 1
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "dark:border-gray-700 dark:bg-[#181818]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Logout Modal */}
      <LogoutModalHost
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/sign-in-host";
        }}
      />

      {/* StaffInfo Modal */}
      <StaffInfoModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        staff={staffMembers}
      />
    </div>
  );
}
