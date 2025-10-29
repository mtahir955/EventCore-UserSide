"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpLineModal } from "../../host-dashboard/components/help-line-modal";
import { MessageSuccessModal } from "../../host-dashboard/components/message-success-modal";
import { Menu, Bell, User, Sun, Moon, X, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [messageSuccessOpen, setMessageSuccessOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  const navItems = [
    {
      name: "Dashboard",
      icon: "/icons/sidebar/1.png",
      orangeicon: "/icons/sidebar-orange/1.png",
      href: "/staff-dashboard",
    },
    {
      name: "My Events",
      icon: "/icons/sidebar/7.png",
      orangeicon: "/icons/sidebar-orange/2.png",
      href: "/my-events-staff",
    },
    {
      name: "Ticket Check",
      icon: "/icons/sidebar/5.png",
      orangeicon: "/icons/sidebar-orange/4.png",
      href: "/ticket-check-staff",
    },
    {
      name: "Profile & Settings",
      icon: "/icons/sidebar/2.png",
      orangeicon: "/icons/sidebar-orange/5.png",
      href: "/profile-settings-staff",
    },
  ];

  return (
    <>
      {/* ======= MOBILE NAVBAR ======= */}
      <div className="md:hidden fixed top-0 left-0 w-full z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setShowSidebar(!showSidebar)}>
          <Menu className="h-6 w-6 text-gray-800" />
        </button>

        <h2 className="text-[18px] font-semibold text-gray-900">
          {navItems.find((i) => pathname === i.href)?.name || "Dashboard"}
        </h2>

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
                className="bg-white border h-9 w-9 flex justify-center items-center rounded-full relative hover:bg-gray-100"
              >
                <img
                  src="/images/icons/notification-new.png"
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
                <div
                  className="
      absolute right-0 mt-2 
      w-[70vw] sm:w-72 
      bg-white dark:bg-[#1f1f1f]
      shadow-lg border border-gray-200 dark:border-gray-700 
      rounded-xl z-50 p-3 
      max-h-[70vh] overflow-y-auto
      sm:max-h-64
    "
                >
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Notifications
                  </h4>
                  <div className="space-y-2">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="text-sm bg-gray-50 dark:bg-[#2a2a2a] rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-[#333] transition"
                        >
                          {n.message}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
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
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-200 rounded-xl z-50 py-2">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======= SIDEBAR ======= */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-[260px] bg-white border-r border-gray-100 p-6 z-50 transform transition-transform duration-300 ease-in-out 
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 flex flex-col justify-between`}
      >
        {/* Top Section (Logo + Nav) */}
        <div className="overflow-y-auto flex-1">
          {/* Logo */}
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-[26px] font-bold text-black">Event Core</h1>
            <button
              className="md:hidden text-gray-600 text-[22px]"
              onClick={() => setShowSidebar(false)}
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setShowSidebar(false)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive ? "bg-[#F5EDE5]" : "hover:bg-gray-50"
                  }`}
                >
                  <Image
                    src={isActive ? item.orangeicon : item.icon}
                    alt={item.name}
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                  <span
                    className={`font-medium ${
                      isActive ? "text-[#D19537]" : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* Help & Support */}
            <button
              onClick={() => {
                setShowHelpModal(true);
                setShowSidebar(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-gray-50"
            >
              <svg
                className="h-5 w-5 text-gray-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="font-medium text-gray-700">Help & Support</span>
            </button>
          </nav>
        </div>

        {/* Bottom Section (Logout + Theme Toggle) */}
        <div className="mt-6 space-y-3 border-t border-gray-100 pt-4">
          {/* Logout */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-[14px]"
            style={{ background: "#E8E8E866", color: "var(--foreground)" }}
          >
            <img
              src="/images/icons/logout-icon-dark.png"
              alt="logout"
              className="h-5 w-5"
            />
            Logout
          </button>

          {/* Theme Toggle Buttons */}
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-all duration-150 ${
                theme === "light"
                  ? "bg-[#D19537] text-white border-[#D19537]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <Sun size={16} />
              Light
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-all duration-150 ${
                theme === "dark"
                  ? "bg-[#D19537] text-white border-[#D19537]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <Moon size={16} />
              Dark
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div
            className="relative flex w-[90%] flex-col items-center justify-center bg-white p-8 shadow-xl sm:w-[500px]"
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
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
              Are you sure you want to log out?
            </h2>
            <p className="mb-8 text-center text-gray-600">
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

      {/* --- MODALS --- */}
      <HelpLineModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        setMessageSuccessOpen={setMessageSuccessOpen}
      />
      <MessageSuccessModal
        isOpen={messageSuccessOpen}
        onClose={() => setMessageSuccessOpen(false)}
      />

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </>
  );
}
