"use client";

import { Sidebar } from "../host-dashboard/components/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { PaymentWithdrawalTable } from "../admin/components/payment-withdrawal-table";
import { Bell, User, X, LogOut, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { PaymentSuccessTable } from "../admin/components/payment-success-table";

interface WithdrawalRequest {
  id: string;
  name: string;
  avatar: string;
  email: string;
  category: string;
  address: string;
  amount: number;
}

const withdrawalRequests: WithdrawalRequest[] = [
  {
    id: "1",
    name: "Daniel Carter",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
  {
    id: "3",
    name: "Emily Carter",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
  {
    id: "4",
    name: "Nathan Blake",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
  {
    id: "5",
    name: "Taylor Morgan",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
];

export default function PaymentWithdrawalPage() {
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dropdowns
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      <Sidebar
        active="Payment"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />
      {/* Main Section */}
      <main className="flex-1 overflow-auto lg:ml-[250px] dark:bg-[#101010]">
        {/* ===== Header ===== */}
        <header className="hidden md:flex items-center justify-between px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 bg-[#FAFAFB] dark:bg-[#101010]">
          <div className="flex items-center gap-4">
            {/* Hamburger icon on tablet (hidden on lg) */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu className="w-6 h-6 text-gray-800" />
            </button>

            <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-foreground">
              Payments
            </h1>
          </div>

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

        {/* Mobile Header Spacer */}
        <div className="lg:hidden h-[56px]" />

        {/* ===== Page Content ===== */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* ===== Stats Cards ===== */}
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-4 
              gap-4 
              md:gap-6 
              mb-8
            "
          >
            {/* Total Events Card */}
            <div className="flex items-center gap-4 rounded-lg bg-background p-4 sm:p-5 md:p-6 shadow-sm">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-blue-50">
                <Image
                  alt="Total Events"
                  src="/icons/calendar-active-icon.png"
                  width={28}
                  height={28}
                  className="h-6 w-6 sm:h-7 sm:w-7"
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  720
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Total Events
                </p>
              </div>
            </div>

            {/* Tickets Sold Card */}
            <div className="flex items-center gap-4 rounded-lg bg-background p-4 sm:p-5 md:p-6 shadow-sm">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-orange-50">
                <Image
                  src="/icons/ticket-icon.png"
                  alt="Tickets Sold"
                  width={28}
                  height={28}
                  className="h-6 w-6 sm:h-7 sm:w-7"
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  12,00
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Tickets Sold
                </p>
              </div>
            </div>

            {/* Revenue Card */}
            <div className="flex items-center gap-4 rounded-lg bg-background p-4 sm:p-5 md:p-6 shadow-sm">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-pink-50">
                <Image
                  src="/icons/revenue-icon.png"
                  alt="Revenue"
                  width={28}
                  height={28}
                  className="h-6 w-6 sm:h-7 sm:w-7"
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  $67,000
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Revenue
                </p>
              </div>
            </div>

            {/* Active Events Card */}
            <div className="flex items-center gap-4 rounded-lg bg-background p-4 sm:p-5 md:p-6 shadow-sm">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-blue-50">
                <Image
                  src="/icons/calendar-check-icon.png"
                  alt="Active Events"
                  width={28}
                  height={28}
                  className="h-6 w-6 sm:h-7 sm:w-7"
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  150
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Active Events
                </p>
              </div>
            </div>
          </div>

          {/* ===== Payment Withdrawal Table ===== */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Payment Requests
            </h3>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] shadow-sm">
              <PaymentWithdrawalTable />
            </div>
          </div>

          {/* ===== Payment Withdrawal Table ===== */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Payments History
            </h3>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] shadow-sm">
              <PaymentSuccessTable />
            </div>
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
    </div>
  );
}
