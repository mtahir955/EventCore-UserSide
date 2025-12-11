"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "../host-dashboard/components/sidebar";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import LogoutModalHost from "@/components/modals/LogoutModalHost";
import Link from "next/link";

export default function EventSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { resolvedTheme, theme, setTheme } = useTheme();

  // Tabs
  const [activeTab, setActiveTab] = useState<
    "general" | "advanced" | "payments"
  >("general");

  // General tab checkboxes
  const [passServiceFee, setPassServiceFee] = useState(false);
  const [allowCredits, setAllowCredits] = useState(false);
  const [allowTransfer, setAllowTransfer] = useState(false);

  // Advanced (dummy)
  const [autoApprove, setAutoApprove] = useState(false);
  const [limitPerUser, setLimitPerUser] = useState(false);

  // Payments (dummy)
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [refundAllowed, setRefundAllowed] = useState(false);

  // Host name
  const [hostName, setHostName] = useState("Host");

  useEffect(() => {
    const savedUser = localStorage.getItem("hostUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setHostName(user.userName || user.fullName || "Host");
    } else {
      window.location.href = "/sign-in-host";
    }
  }, []);

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

  return (
    <div className="relative bg-[#FAFAFB] w-full min-h-screen flex flex-col lg:flex-row dark:bg-[#101010]">
      {/* Sidebar */}
      <Sidebar
        active="Event Settings"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      {/* Drawer for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-[260px] h-full bg-white dark:bg-[#101010] shadow-lg z-50">
            <Sidebar active="Event Settings" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-[256px] mt-14 sm:mt-0 h-full">
        {/* HEADER (same as Transfer Requests page) */}
        <header className="hidden md:flex items-center justify-between px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 bg-[#FAFAFB] dark:bg-[#101010]">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-foreground">
              Event Settings
            </h1>
          </div>

          {/* Right section */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4 relative">
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

                      <Link href="/ticket-manager">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          Ticket Manager
                        </button>
                      </Link>

                      <Link href="/host-payments">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          Payments
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

        {/* Page Content */}
        <div className="px-4 sm:px-6 md:px-8 py-6">
          {/* Tabs */}
          <div className="flex gap-6 border-b pb-3 mb-6 dark:border-gray-700">
            {["general", "advanced", "payments"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 font-medium text-[15px] tracking-wide ${
                  activeTab === tab
                    ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab(tab as any)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="space-y-5">
            {/* GENERAL TAB UI */}
            {activeTab === "general" && (
              <>
                <SettingToggle
                  label="Pass service fee to customer"
                  checked={passServiceFee}
                  onToggle={() => setPassServiceFee(!passServiceFee)}
                />

                <SettingToggle
                  label="Allow credits to be used for this event"
                  checked={allowCredits}
                  onToggle={() => setAllowCredits(!allowCredits)}
                />

                <SettingToggle
                  label="Allow ticket transfer between users"
                  checked={allowTransfer}
                  onToggle={() => setAllowTransfer(!allowTransfer)}
                />
              </>
            )}

            {/* ADVANCED */}
            {activeTab === "advanced" && (
              <>
                <SettingToggle
                  label="Automatically approve event registrations"
                  checked={autoApprove}
                  onToggle={() => setAutoApprove(!autoApprove)}
                />

                <SettingToggle
                  label="Limit number of tickets per user"
                  checked={limitPerUser}
                  onToggle={() => setLimitPerUser(!limitPerUser)}
                />
              </>
            )}

            {/* PAYMENTS */}
            {activeTab === "payments" && (
              <>
                <SettingToggle
                  label="Enable Stripe payments for this event"
                  checked={stripeEnabled}
                  onToggle={() => setStripeEnabled(!stripeEnabled)}
                />

                <SettingToggle
                  label="Allow users to request refunds"
                  checked={refundAllowed}
                  onToggle={() => setRefundAllowed(!refundAllowed)}
                />
              </>
            )}
          </div>

          {/* SAVE BUTTON */}
          <div className="mt-8">
            <button
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-medium text-[15px] hover:opacity-90"
              style={{ backgroundColor: "#D19537" }}
            >
              Save Settings
            </button>
          </div>
        </div>
      </main>

      <LogoutModalHost
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/sign-in-host";
        }}
      />
    </div>
  );
}

// Reusable Checkbox With Styling
function SettingToggle({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      {/* Checkbox */}
      <div
        onClick={onToggle}
        className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all
          ${
            checked
              ? "bg-[#D19537] border-[#D19537]"
              : "border-gray-400 dark:border-gray-600 bg-white dark:bg-[#181818]"
          }
          group-hover:border-[#D19537]
        `}
      >
        {/* Tick mark (hidden until checked) */}
        {checked && (
          <svg
            className="text-white"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5 10L8.5 13.5L15 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Label */}
      <span className="text-[16px] text-gray-800 dark:text-gray-200">
        {label}
      </span>
    </label>
  );
}
