"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../admin/components/sidebar";
import HostManagementForm from "./components/host-management-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Bell, User, X, LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import LogoutModal from "@/components/modals/LogoutModal";

export default function Home() {
  const [isDark, setIsDark] = useState(false);

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
  const [adminName, setAdminName] = useState("Admin");

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar activePage="Create Tenant" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="hidden sm:ml-[250px] lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
            <h1 className="text-3xl font-semibold text-foreground">
              Tenant Form
            </h1>

            <div className="flex items-center gap-4">
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
              <Link href="/push-notification">
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
              </Link>
              {/* Profile Name + Icon + Dropdown */}
              <div
                className="relative flex items-center gap-2"
                ref={profileRef}
              >
                {/* Admin Name */}
                <span className="hidden sm:block font-semibold text-black dark:text-white">
                  {adminName}
                </span>

                {/* Profile Icon Wrapper for relative dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="bg-black border h-9 w-9 flex justify-center items-center rounded-full hover:opacity-90"
                  >
                    <img
                      src="/images/icons/profile-user.png"
                      alt="profile"
                      className="h-4 w-4"
                    />
                  </button>

                  {/* Dropdown — Positioned relative to icon */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl z-50 py-2">
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
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto bg-neutral-100">
            <HostManagementForm />
          </div>

          {/* Theme Toggle */}
          {/* <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          </div> */}
        </div>
      </div>
      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/sign-in-admin";
        }}
      />
    </div>
  );
}
