"use client";

import { useState, useRef, useEffect } from "react";
import { X, LogOut, Moon, Sun, Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

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

  return (
    <header className="flex items-center justify-between border-gray-100 px-8 py-4">
      <h2 className="text-3xl font-bold text-black dark:text-white">{title}</h2>
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
      </div>
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
    </header>
  );
}
