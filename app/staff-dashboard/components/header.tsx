"use client";

import { useState, useRef, useEffect } from "react";
import { X, LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import LogoutModal from "@/components/modals/LogoutModal";

export default function Header({ title }: { title: string }) {
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

  const [staffName, setStaffName] = useState("Staff");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem("staffUser");

    // 🔐 Guard against invalid values
    if (!raw || raw === "undefined" || raw === "null") {
      setStaffName("Staff");
      return;
    }

    try {
      const user = JSON.parse(raw);

      const name =
        user?.fullName ||
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
        user?.userName ||
        user?.email ||
        "Staff";

      setStaffName(name);
    } catch (err) {
      console.error("Invalid staffUser JSON", err);
      setStaffName("Staff");
    }
  }, []);

  return (
    <header className="flex items-center justify-between border-gray-100 px-8 py-4">
      <h2 className="text-3xl font-bold text-black dark:text-white">{title}</h2>
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

          {/* Staff Name + Icon + Dropdown */}
          <div className="relative flex items-center gap-2" ref={profileRef}>
            {/* Staff Name */}
            <span className="hidden sm:block font-semibold text-black dark:text-white">
              {staffName}
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
                  <Link href="/my-events-staff">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                      My Events
                    </button>
                  </Link>

                  <Link href="/ticket-check-staff">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                      Ticket Check
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
      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/sign-in-staff";
        }}
      />
    </header>
  );
}
