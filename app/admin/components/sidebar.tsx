"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Menu, Bell, User, Sun, Moon, X, LogOut } from "lucide-react";
import { useTheme } from "next-themes";

interface SidebarProps {
  className?: string;
  activePage?: string;
}

const menuItems = [
  {
    name: "Dashboard",
    icon: "/icons/sidebar/1.png",
    orangeicon: "/icons/sidebar-orange/1.png",
    whiteicon: "/icons/sidebar-white/1.png",
    href: "/admin",
  },
  {
    name: "User Management",
    icon: "/icons/sidebar/3.png",
    orangeicon: "/icons/sidebar-orange/7.png",
    whiteicon: "/icons/sidebar-white/2.png",
    href: "/user-management",
  },
  {
    name: "Host Management",
    icon: "/icons/sidebar/4.png",
    orangeicon: "/icons/sidebar-orange/2.png",
    whiteicon: "/icons/sidebar-white/3.png",
    href: "/host-management",
  },
  {
    name: "Host Request",
    icon: "/icons/sidebar/5.png",
    orangeicon: "/icons/sidebar-orange/3.png",
    whiteicon: "/icons/sidebar-white/4.png",
    href: "/host-request",
  },
  {
    name: "Profile & Settings",
    icon: "/icons/sidebar/2.png",
    orangeicon: "/icons/sidebar-orange/5.png",
    whiteicon: "/icons/sidebar-white/7.png",
    href: "/profile-settings-admin",
  },
  {
    name: "Payment Withdrawal",
    icon: "/icons/sidebar/7.png",
    orangeicon: "/icons/sidebar-orange/6.png",
    whiteicon: "/icons/sidebar-white/5.png",
    href: "/payment-withdrawal",
  },
  {
    name: "Push Notification Center",
    icon: "/icons/sidebar/6.png",
    orangeicon: "/icons/sidebar-orange/4.png",
    whiteicon: "/icons/sidebar-white/6.png",
    href: "/push-notification",
  },
  {
    name: "System Settings",
    icon: "/icons/sidebar/2.png",
    orangeicon: "/icons/sidebar-orange/5.png",
    whiteicon: "/icons/sidebar-white/7.png",
    href: "/system-settings",
  },
];

export function Sidebar({ className, activePage = "Dashboard" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      {/* ===== Mobile Navbar ===== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-background border-b border-border px-4 py-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-muted focus:outline-none"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        <h2 className="text-base font-semibold text-foreground truncate">
          {activePage}
        </h2>

        <div className="flex items-center gap-4">
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
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
              <Bell className="h-4 w-4 text-gray-600" />
            </button>
          </Link>
          {/* Profile icon + dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
              }}
              className="bg-black border h-7 w-7 flex justify-center items-center rounded-full hover:opacity-90"
            >
              <img
                src="/images/icons/profile-user.png"
                alt="profile"
                className="h-4 w-4"
              />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-200 rounded-xl z-50 py-2">
                <Link href="/host-management">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    Host Management
                  </button>
                </Link>
                <Link href="/host-request">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    Host Request
                  </button>
                </Link>
                <Link href="/payment-withdrawal">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    Payment Withdrawal
                  </button>
                </Link>
                <Link href="/system-settings">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    System Settings
                  </button>
                </Link>
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
      </header>

      {/* ===== Sidebar ===== */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-background border-r border-border flex flex-col transition-transform duration-200 ease-in-out z-50",
          "lg:translate-x-0 lg:w-[250px]",
          isOpen ? "translate-x-0 w-[250px]" : "-translate-x-full w-[250px]",
          className
        )}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h1 className="sm:text-3xl text-2xl font-bold text-foreground">
            Event Core
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-muted"
          >
            ✕
          </button>
        </div>

        {/* Nav Menu */}
        <nav className="flex-1 px-3 overflow-y-auto mt-2">
          {menuItems.map((item, index) => {
            const isActive = item.name === activePage;
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-4 mb-1 transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground font-medium border-l-4 border-[#D19537]"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <Image
                  src={
                    theme === "dark"
                      ? item.whiteicon
                      : isActive
                      ? item.orangeicon
                      : item.icon
                  }
                  alt={item.name}
                  width={20}
                  height={20}
                />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ===== Bottom Section (Logout + Theme Toggle Row) ===== */}
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

      {/* ===== Overlay for mobile ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
