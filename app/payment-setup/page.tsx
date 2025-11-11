"use client";

import PaymentSuccessModal from "../host-dashboard/components/payment-success-modal";
import { Sidebar } from "../host-dashboard/components/sidebar";
import { Switch } from "@/components/ui/switch";
import WithdrawSuccessModal from "../host-dashboard/components/withdraw-success-modal";
import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, Moon, Sun } from "lucide-react"; // for hamburger icon
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function PaymentSetupPage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isDefaultPayment, setIsDefaultPayment] = useState(true);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar state

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

  return (
    <div className="relative w-full min-h-screen bg-[#FAFAFB] flex flex-col lg:flex-row">
      {/* Sidebar for large screens */}
      <div className="">
        <Sidebar active="Payment Setup" />
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Scrim */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Sidebar Drawer */}
          <div className="relative w-[260px] h-full bg-white shadow-lg z-50">
            <Sidebar active="Payment Setup" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full lg:ml-[256px] min-h-screen mt-20 sm:mt-0 pb-20 dark:bg-[#101010]">
        {/* Header */}
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
              Payment Setup
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

        {/* Contact Details */}
        <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
          <div className="bg-white dark:bg-[#101010] dark:border rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm">
            <h2 className="text-[20px] sm:text-[22px] md:text-[24px] font-semibold mb-6">
              Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {/* Phone */}
              <div>
                <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                  Phone Number:
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-3 bg-[#FAFAFB] dark:bg-[#101010] rounded-lg border border-[#EFEFEF] w-full sm:w-auto">
                    <img
                      src="/images/icons/us-flag.png"
                      alt="US"
                      className="h-4 w-4 rounded-full"
                    />
                    <span className="text-[14px]">+1</span>
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      className="ml-1"
                    >
                      <path
                        d="M1 1L5 5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    defaultValue="125-559-8852"
                    className="flex-1 w-full px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                  City/Town:
                </label>
                <input
                  type="text"
                  defaultValue="California"
                  className="w-full px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                  Pincode:
                </label>
                <input
                  type="text"
                  defaultValue="78080"
                  className="w-full px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                Address:
              </label>
              <input
                type="text"
                defaultValue="245 Event Street, Downtown Cityview, NY 10016, USA"
                className="w-full px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                Website [Optional]:
              </label>
              <input
                type="text"
                defaultValue="https://viagoevents.com/"
                className="w-full px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
              />
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
          <div className="bg-white dark:bg-[#101010] dark:border rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm">
            <h2 className="text-[20px] sm:text-[22px] md:text-[24px] font-semibold mb-6">
              Payment Details
            </h2>

            <div className="mb-6">
              <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                Name On Card:
              </label>
              <input
                type="text"
                defaultValue="Jasmine Marina"
                className="w-full px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                Card Number:
              </label>
              <input
                type="text"
                defaultValue="1253-5594-8845-2777"
                className="w-full px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                  Expire Date:
                </label>
                <input
                  type="text"
                  defaultValue="04/29"
                  className="w-full px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
                />
              </div>

              <div>
                <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                  CVC:
                </label>
                <input
                  type="text"
                  defaultValue="720"
                  className="w-full px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
                />
              </div>
            </div>

            <div className="flex items-start sm:items-center gap-3 mb-8">
              <Switch
                checked={isDefaultPayment}
                onCheckedChange={setIsDefaultPayment}
              />
              <span className="text-[13px] sm:text-[14px] text-gray-600 leading-snug">
                Set as default payment option to use in future.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end mt-5">
            <button
              className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl text-white font-medium text-[14px] hover:opacity-90 transition-opacity"
              style={{ background: "#D19537" }}
              onClick={() => setSuccessOpen(true)}
            >
              Save Changes
            </button>
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

      {/* Modals */}
      <PaymentSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
      <WithdrawSuccessModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
      />
    </div>
  );
}
