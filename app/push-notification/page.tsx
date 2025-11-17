"use client";

import { Sidebar } from "../admin/components/sidebar";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Bell, User, X, LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PushNotificationModal } from "../admin/components/push-notification-modal";
import { useTheme } from "next-themes";

const notifications = [
  {
    id: 1,
    icon: "/icons/new-organizer-icon.png",
    title: "New Organizer Registered",
    description:
      "John Events Co. has registered as an organizer. Review their profile before approval.",
  },
  {
    id: 2,
    icon: "/icons/organizer-approved-icon.png",
    title: "Organizer Approved",
    description:
      "BrightStar Events has been successfully approved and can now publish events.",
  },
  {
    id: 3,
    icon: "/icons/glyph.png",
    title: "New Attendee Signup",
    description:
      "Emily Davis has joined Event Core. Welcome them to our community.",
  },
  {
    id: 4,
    icon: "/icons/new-organizer-icon.png",
    title: "New Organizer Registered",
    description:
      "John Events Co. has registered as an organizer. Review their profile before approval.",
  },
  {
    id: 5,
    icon: "/icons/organizer-approved-icon.png",
    title: "Organizer Approved",
    description:
      "BrightStar Events has been successfully approved and can now publish events.",
  },
  {
    id: 6,
    icon: "/icons/glyph.png",
    title: "New Attendee Signup",
    description:
      "Emily Davis has joined Event Core. Welcome them to our community.",
  },
];

export default function PushNotificationPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const router = useRouter();

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
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      <Sidebar activePage="Push Notification Center" />

      <main className="flex-1 overflow-auto lg:ml-[250px] dark:bg-[#101010]">
        {/* ===== Header (Desktop) ===== */}
        <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
          <h1 className="text-3xl font-semibold text-foreground">
            Push Notification Center
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
            <div className="relative flex items-center gap-2" ref={profileRef}>
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

        {/* ===== Page Content ===== */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* ===== Push Notification Form ===== */}
          <div className="bg-background rounded-xl p-4 mt-14 sm:mt-0 sm:p-6 md:p-8 mb-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
              Push Notification Center
            </h2>

            <div className="space-y-5 sm:space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Set Title
                </label>
                <Input
                  type="text"
                  placeholder="Limited Time Offer!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-secondary border-border text-sm sm:text-base"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Get 30% off a one month plan. Don't miss out!"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-secondary border-border min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base"
                />
              </div>

              {/* Send Button */}
              <Button
                onClick={() => setIsOpenModal(true)}
                className="text-white font-medium w-full sm:w-auto px-10 sm:px-16 py-4 sm:py-6 rounded-lg transition-colors duration-200 hover:opacity-90 text-sm sm:text-base"
                style={{ backgroundColor: "rgba(209, 149, 55, 1)" }}
              >
                Send
              </Button>
            </div>
          </div>

          {/* ===== Notifications List ===== */}
          <div className="bg-background rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
              Notifications
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className="w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-lg hover:bg-secondary transition-colors text-left"
                  onClick={() => {
                    if (notification.title === "New Attendee Signup") {
                      router.push("/user-management");
                    } else {
                      router.push("");
                    }
                  }}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFF4E6] flex items-center justify-center flex-shrink-0">
                    <Image
                      src={notification.icon || "/placeholder.svg"}
                      alt={notification.title}
                      width={28}
                      height={28}
                      className="object-contain w-6 h-6 sm:w-7 sm:h-7"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-snug">
                      {notification.description}
                    </p>
                  </div>

                  {/* Chevron */}
                  <Image
                    src="/icons/chevron-right-icon.png"
                    alt="View details"
                    width={20}
                    height={20}
                    className="hidden sm:block opacity-100"
                  />
                </button>
              ))}
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

      {/* ===== Modal ===== */}
      <PushNotificationModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />
    </div>
  );
}
