"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../host-dashboard/components/sidebar";
import { StatCard } from "../host-dashboard/components/stat-card";
import { LineChartCard } from "../host-dashboard/components/charts/line-chart-card";
import { DonutChartCard } from "../host-dashboard/components/charts/donut-chart-card";
import { MyEventsCard } from "../host-dashboard/components/my-events-card";
import { WithdrawModal } from "../host-dashboard/components/withdraw-modal";
import { WithdrawSuccessModal } from "../host-dashboard/components/withdraw-success-modal";
import { X, LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import LogoutModalHost from "@/components/modals/LogoutModalHost";
import { HOST_Tenant_ID } from "@/config/hostTenantId";
import { syncThemeWithBackend } from "@/utils/themeManager";

export default function Page() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

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

  const dummyEvents = [
    {
      imageSrc: "/images/event-1.png",
      price: "1500",
      hostby: "Ali Khan",
      title: "Lahore Music Fest 2025",
      description:
        "Join us for an unforgettable night of music, food, and lights in Lahore.",
      location: "Lahore Expo Center",
      date: "12/11/2025",
      audience: 5000,
      time: "7:00 PM - 11:00 PM",
    },
    {
      imageSrc: "/images/event-2.png",
      price: "0",
      hostby: "ITU CS Department",
      title: "Tech Conference Pakistan",
      description:
        "A gathering of tech enthusiasts discussing AI, Blockchain, and Web3.",
      location: "Islamabad Convention Hall",
      date: "25/11/2025",
      audience: 1200,
      time: "10:00 AM - 5:00 PM",
    },
  ];

  const [hostName, setHostName] = useState("Host");
  const [hostSubdomain, setHostSubdomain] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("hostUser");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      // Host Name
      setHostName(user.userName || user.fullName || "Host");

      // Subdomain (optional)
      setHostSubdomain(user.subDomain || "");

      console.log("HOST DASHBOARD USER:", user);
      console.log("HOST SUBDOMAIN:", user?.subDomain);

      // Theme (optional)
      if (user.theme) {
        syncThemeWithBackend(user);
      }
    } else {
      // Force redirect if no host session found
      window.location.href = "/sign-in-host";
    }
  }, []);

  return (
    <main className="min-h-screen w-full bg-[var(--bg-base)] relative overflow-x-hidden">
      <Sidebar active="Dashboard" />

      <section className="flex-1 md:ml-[256px] bg-[#FAFAFB] dark:bg-[#121212] text-gray-900 dark:text-gray-100 min-h-screen transition-all duration-300">
        {/* Header */}
        <header className="hidden md:flex items-center justify-between px-8 pt-8 pb-4 relative">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-foreground">
              Dashboard
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-[24px] font-black -tracking-[0.02em]">
                Welcome {hostName}
              </p>

              <img
                src="/images/icons/wave.png"
                alt="wave"
                className="h-6 w-6"
              />
            </div>
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

            {/* Create events button */}
            <Link href="/my-events/create">
              <button className="h-11 rounded-xl px-6 font-semibold flex items-center justify-center gap-2 bg-[#D19537] text-white text-[14px] w-full sm:w-auto">
                Create
                <img
                  src="/images/icons/plus-icon.png"
                  alt="plus"
                  className="h-4 w-4"
                />
              </button>
            </Link>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-8 sm:mt-0 mt-20">
          <StatCard
            icon="/images/icons/1.png"
            label="Total Events"
            value="20+"
            accent="indigo"
          />
          <StatCard
            icon="/images/icons/4.png"
            label="Tickets Sold"
            value="12,00"
            accent="yellow"
          />
          <StatCard
            icon="/images/icons/2.png"
            label="Revenue"
            value="$67,000"
            accent="peach"
          />
          <StatCard
            icon="/images/icons/3.png"
            label="Upcoming Events"
            value="5"
            accent="indigo"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-8 mt-8">
          <div className="lg:col-span-7">
            <LineChartCard />
          </div>
          <div className="lg:col-span-5">
            <DonutChartCard />
          </div>
        </div>

        {/* Events */}
        <div className="px-4 md:px-8 mt-10 mb-12">
          <h2 className="text-lg md:text-[18px] font-semibold mb-4">
            Explore More Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {dummyEvents.map((event, index) => (
              <MyEventsCard key={index} {...event} isEditEvent />
            ))}
          </div>
        </div>
      </section>

      {/* Logout Modal */}
      <LogoutModalHost
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          localStorage.removeItem("hostToken");
          localStorage.removeItem("hostUser");
          localStorage.removeItem("hostTheme");
          localStorage.removeItem("hostTenantId");
          window.location.href = "/sign-in-host";
        }}
      />

      {/* Modals */}
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onRequest={() => {
          setWithdrawOpen(false);
          setSuccessOpen(true);
        }}
      />
      <WithdrawSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
    </main>
  );
}
