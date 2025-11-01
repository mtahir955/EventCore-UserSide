"use client";

import { Sidebar } from "../admin/components/sidebar";
import { CircularProgress } from "../admin/components/circular-progress";
import { useState, useRef, useEffect } from "react";
import { UserInfoModal } from "../admin/components/user-info-modal";
import { Bell, User, X, LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function CompletedEventsEdit() {
  const [ispopupModalOpen, setispopupModalOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
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
      <main className="flex-1 overflow-auto lg:ml-[250px] dark:bg-[#101010]">
        {/* ===== Header ===== */}
        <header className="hidden lg:flex items-center justify-between px-8 py-6 border-b border-border bg-white dark:bg-[#101010] sticky top-0 z-30">
          <h1 className="text-3xl font-semibold">Host Management</h1>
          <div className="flex items-center gap-4">
            {/* Light/Dark toggle */}
            <Button
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
            </Button>

            {/* Mobile toggle */}
            <button
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
            </button>
            <Link href="/push-notification">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </Link>
            {/* Profile icon + dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
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
                  <Link href="/host-management">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                      Host Management
                    </button>
                  </Link>
                  <Link href="/host-request">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                      Host Request
                    </button>
                  </Link>
                  <Link href="/payment-withdrawal">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                      Payment Withdrawal
                    </button>
                  </Link>
                  <Link href="/system-settings">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                      System Settings
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
                className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
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

            {/* Start & End Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  defaultValue="09:00 PM"
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                />
              </div>
            </div>
          </div>

          {/* ===== Ticket Statistics ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-xl p-6 bg-white dark:bg-[#101010] border border-[#F5EDE5]">
              <div className="text-center">
                <div className="text-sm font-medium mb-4">Total Tickets</div>
                <CircularProgress value={120} max={120} color="#D19537" />
              </div>
            </div>

            <div className="rounded-xl p-6 bg-white dark:bg-[#101010] border border-[#F5EDE5]">
              <div className="text-center">
                <div className="text-sm font-medium mb-4">Booked Tickets</div>
                <CircularProgress value={91} max={120} color="#D19537" />
              </div>
            </div>

            <div className="rounded-xl p-6 bg-white dark:bg-[#101010] border border-[#F5EDE5]">
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

      {/* Modal */}
      <UserInfoModal
        isOpen={ispopupModalOpen}
        onClose={() => setispopupModalOpen(false)}
      />
    </div>
  );
}
