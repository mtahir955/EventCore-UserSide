"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { HelpLineModal } from "./help-line-modal";
import { MessageSuccessModal } from "./message-success-modal";
import { Menu, X, Sun, Moon, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

type NavItem = {
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
};

export function Sidebar({ active = "Dashboard" }: { active?: string }) {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [messageSuccessOpen, setMessageSuccessOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const items: NavItem[] = [
    {
      label: "Dashboard",
      icon: "/images/icons/dashboard-icon.png",
      href: "/host-dashboard",
    },
    { label: "My Events", icon: "/images/icons/10.png", href: "/my-events" },
    {
      label: "Payment Setup",
      icon: "/images/icons/11.png",
      href: "/payment-setup",
    },
    {
      label: "Ticket Check",
      icon: "/images/icons/5.png",
      href: "/ticket-check-host",
    },
    {
      label: "Completed Events",
      icon: "/images/icons/12.png",
      href: "/completed-events",
    },
    {
      label: "Transfer Requests",
      icon: "/images/icons/14.png",
      href: "/transfer-requests",
    },
    {
      label: "Help Line",
      icon: "/images/icons/13.png",
      onClick: () => setShowHelpModal(true),
    },
  ];

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
    <>
      {/* --- Unified Mobile Navbar --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#101010] border-b flex items-center justify-between px-4 py-3">
        {/* Left: Hamburger */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-foreground focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Center: Active Page Title */}
        <h1 className="text-[16px] font-semibold text-center truncate">
          {active}
        </h1>

        {/* Right section */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-4 relative">
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

      {/* --- Sidebar (Desktop fixed + Mobile slide-in) --- */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full border-r bg-card z-40 transform transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{ width: 256 }}
        aria-label="Sidebar"
      >
        {/* Brand (Desktop only) */}
        <div className="px-6 mt-10 mb-6 hidden md:flex items-center justify-between">
          <div className="text-3xl font-bold tracking-tight text-foreground">
            Event Core
          </div>
        </div>

        {/* Nav Items */}
        <nav className="px-4 mt-20 md:mt-2">
          <ul className="flex flex-col gap-2">
            {items.map((item) => {
              const isActive = item.label === active;
              const Element = item.href ? "a" : "button";

              return (
                <li key={item.label}>
                  <Element
                    {...(item.href
                      ? { href: item.href }
                      : { onClick: item.onClick, type: "button" })}
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 text-[14px] font-medium w-full text-left"
                    )}
                    style={{
                      background: isActive
                        ? "var(--brand-soft)"
                        : "transparent",
                      color: "var(--sidebar-fg, var(--foreground))",
                      borderLeft: isActive ? "4px solid #D19537" : "none",
                    }}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e: React.MouseEvent) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                      setIsSidebarOpen(false); // auto-close on mobile
                    }}
                  >
                    <img
                      src={
                        isActive
                          ? `/images/icons/orange-sidebar-icons/${item.icon
                              .split("/")
                              .pop()}`
                          : item.icon || "/placeholder.svg"
                      }
                      alt={item.label}
                      className={`h-5 w-5 transition ${
                        theme === "dark" && !isActive
                          ? "invert brightness-50"
                          : ""
                      }`}
                    />

                    {item.label}
                  </Element>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* --- Bottom Section (Logout + Theme Toggle) --- */}
        <div className="absolute left-0 right-0 bottom-6 px-4 space-y-3">
          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-[14px]"
            style={{ background: "#E8E8E866", color: "var(--foreground)" }}
          >
            <img
              src="/images/icons/logout-icon-dark.png"
              alt="logout"
              className="h-5 w-5"
            />
            Logout
          </button>
        </div>
      </aside>

      {/* --- Overlay (for mobile) --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

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

      {/* --- Modals --- */}
      <HelpLineModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        setMessageSuccessOpen={setMessageSuccessOpen}
      />
      <MessageSuccessModal
        isOpen={messageSuccessOpen}
        onClose={() => setMessageSuccessOpen(false)}
      />
    </>
  );
}
