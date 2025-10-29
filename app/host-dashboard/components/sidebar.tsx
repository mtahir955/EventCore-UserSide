"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { HelpLineModal } from "./help-line-modal";
import { MessageSuccessModal } from "./message-success-modal";
import { Menu, X, Sun, Moon, LogOut } from "lucide-react";

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
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  return (
    <>
      {/* --- Unified Mobile Navbar --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b flex items-center justify-between px-4 py-3">
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
                      alt=""
                      className="h-5 w-5"
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

          {/* Light/Dark Toggle Row */}
          <div className="flex justify-center items-center gap-3 mt-2">
            {/* Light Mode */}
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-all duration-150",
                theme === "light"
                  ? "bg-[#D19537] text-white border-[#D19537]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              )}
            >
              <Sun size={16} />
              Light
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-all duration-150",
                theme === "dark"
                  ? "bg-[#D19537] text-white border-[#D19537]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              )}
            >
              <Moon size={16} />
              Dark
            </button>
          </div>
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
