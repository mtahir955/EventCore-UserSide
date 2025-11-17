"use client";

import { Sidebar } from "../../admin/components/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { MyEventsCard } from "../../admin/components/my-events-card";
import Link from "next/link";
import { Bell, User, X, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  host: string;
  location: string;
  date: string;
  audience: string;
  time: string;
}

const events: Event[] = [
  {
    id: "1",
    title: "Starry Nights Music Fest",
    description:
      "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
    image: "/purple-lit-event-venue-with-tables.jpg",
    price: "$99.99",
    host: "Eric Gryzibowski",
    location: "California",
    date: "13 June 2025",
    audience: "150 Audience",
    time: "08:00 PM - 09:00 PM",
  },
  {
    id: "2",
    title: "Starry Nights Music Fest",
    description:
      "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
    image: "/red-stage-lights-concert.jpg",
    price: "$99.99",
    host: "Eric Gryzibowski",
    location: "California",
    date: "13 June 2025",
    audience: "150 Audience",
    time: "08:00 PM - 09:00 PM",
  },
  {
    id: "3",
    title: "Starry Nights Music Fest",
    description:
      "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
    image: "/purple-lit-event-venue-with-tables.jpg",
    price: "$99.99",
    host: "Eric Gryzibowski",
    location: "California",
    date: "13 June 2025",
    audience: "150 Audience",
    time: "08:00 PM - 09:00 PM",
  },
  {
    id: "4",
    title: "Starry Nights Music Fest",
    description:
      "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
    image: "/blue-silhouette-speaker-audience.jpg",
    price: "$99.99",
    host: "Eric Gryzibowski",
    location: "California",
    date: "13 June 2025",
    audience: "150 Audience",
    time: "08:00 PM - 09:00 PM",
  },
];

export default function HostDetailsPage() {
  const router = useRouter();
  const [isHostRequestModalOpen, setIsHostRequestModalOpen] = useState(false);

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
      {/* Sidebar (responsive behavior handled inside component) */}
      <Sidebar activePage="Tenant Host" />

      <main className="flex-1 overflow-auto lg:ml-[250px] dark:bg-[#101010]">
        {/* ===== Desktop Header ===== */}
        <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
          <h1 className="text-3xl font-semibold text-foreground">
            Tenant Host
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

        {/* Spacer for mobile navbar */}
        <div className="lg:hidden h-[56px]" />

        {/* ===== Content ===== */}
        <div className="p-4 sm:p-6 md:p-8 pt-2 max-w-[1440px] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="hover:opacity-70 transition-opacity hover:cursor-pointer mb-4"
          >
            <Image
              src="/icons/back-arrow.png"
              alt="Back"
              width={12}
              height={12}
            />
          </button>

          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-4">
              <Image
                src="/avatars/daniel-carter.png"
                alt="Daniel Carter"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
              Daniel Carter
            </h2>
          </div>

          {/* Basic Information */}
          <div className="bg-background rounded-lg p-4 sm:p-6 mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-6">
              Basic Information
            </h3>

            {/* Info grid responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6 sm:gap-x-12 lg:gap-x-40">
              {[
                ["Email", "info@gmail.com"],
                ["Phone Number", "+44 7412 558492"],
                ["No. of Events Conducted", "20"],
                ["Tickets Sold", "20012"],
                ["Payment Method", "MasterCard"],
                ["Profile Status", "Banned"],
                ["Gender", "Male"],
                ["Address", "1234 Sunset Blvd, Los Angeles, CA 90026"],
              ].map(([label, value], index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between"
                >
                  <p className="text-sm sm:text-md text-muted-foreground mb-1 sm:mb-0">
                    {label}
                  </p>
                  <p
                    className={`text-base text-foreground ${
                      label === "Profile Status"
                        ? "text-[#b71c1c] font-medium"
                        : ""
                    } text-right sm:text-left`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {events.map((event) => (
              <Link key={event.id} href={`/host-management-details`}>
                <MyEventsCard imageSrc={event.image} price={event.price} />
              </Link>
            ))}
          </div>

          {/* Go Back Button */}
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={() => router.back()}
              className="px-10 sm:px-16 py-3 bg-[#D19537] text-white rounded-full font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              Go Back
            </button>
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
    </div>
  );
}
