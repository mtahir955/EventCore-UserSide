"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, LogOut } from "lucide-react";
import { useTheme } from "next-themes";

export function Header() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { resolvedTheme, theme, setTheme } = useTheme();

  const menuItemsProfile = [
    {
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-icon-hpLk6uI2OKdzKYaF7al9JgxYBvGPvw.png",
      label: "My Profile",
      href: "/view-profile",
    },
    {
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user-edit-icon-GdOLUB07c9156QpFykQCeE3T3BmUaQ.png",
      label: "Edit account",
      href: "/edit-profile",
    },
    {
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ticket-icon-UCFZYJF7qiaJCM33FtP2mbaaGBEXA9.png",
      label: "Tickets",
      href: "/tickets",
    },
    {
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Calendar-icon-ilbfRcUhzwNOhOz3QBIziWCZOK4uDV.png",
      label: "Calendar",
      href: "/upcoming-events",
    },
    {
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/notifications-icon-YNBdsbLEdRySLL7MtsqsOP5jYisuIh.png",
      label: "Notifications",
      href: "/notifications",
    },
    // {
    //   icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logout-icon-oSPWMhCaqEy8zFT4DOBc9DY2pUNhYW.png",
    //   label: "Logout",
    //   // href: "#",
    //   isLogout: true,
    //   onClick: () => setShowLogoutModal(true),
    // },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "About", href: "/about-us" },
    { label: "Contact us", href: "/contact-us" },
  ];

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Prevent hydration mismatch by deferring icon render
    return <div className="w-6 h-6" />;
  }

  return (
    <>
      {/* Top banner */}
      <div className="w-full bg-[#0077F7] py-2 text-center">
        <p className="sm:text-sm text-[12px] text-white font-light">
          Signup today to get amazing discounts and exclusive perks!
        </p>
      </div>

      <header className="w-full bg-white border-b border-gray-200 dark:bg-[#101010]  dark:border-[#333] dark:text-gray-100 transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between py-3 px-2 sm:px-6 md:px-8">
          {/* Logo */}
          <Link href="/#" className="flex items-center flex-shrink-0">
            <Image
              src="/images/header-logo.png"
              alt="Good Life Trainings"
              width={160}
              height={50}
              className="h-10 sm:h-12 w-auto sm:ml-8  transition-all"
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-16 ml-[100px]">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-light transition-colors ${
                  pathname === item.href
                    ? "text-[#0077F7]"
                    : "text-black dark:text-gray-200 hover:text-[#0077F7]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right-side controls */}
          <div
            ref={dropdownRef}
            className="flex items-center gap-2 sm:gap-5 md:gap-6 relative"
          >
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

            {/* Star */}
            <Link href="/interested" className="flex-shrink-0">
              <button className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#2E2E2E] rounded-full transition-colors">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Star%201-KuLCEwN2eSN8JadnILyztdDuDq6Imj.png"
                  alt="Favorites"
                  width={22}
                  height={22}
                  className="sm:w-6 sm:h-6 dark:invert"
                />
              </button>
            </Link>

            {/* Profile dropdown trigger */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 dark:hover:bg-[#2E2E2E] rounded-full px-2 sm:px-3 py-1 transition-colors flex-shrink-0"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-img-IlvMGJzzN77BPcgfbFQVybIIXKKBsA.jpg"
                alt="Profile"
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
              <svg
                width="10"
                height="6"
                viewBox="0 0 12 8"
                fill="none"
                className={`hidden md:block transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Desktop Login */}
            <Link href="/sign-up">
            <Button className="hidden lg:inline-flex bg-[#0077F7] hover:bg-[#0066D6] text-white px-6 py-2 rounded-full font-medium dark:bg-[#3399FF] dark:hover:bg-[#4DA3FF]">
              Login
            </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="block lg:hidden p-1 sm:p-2 flex-shrink-0"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800 dark:text-gray-100" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800 dark:text-gray-100" />
              )}
            </button>

            {/* Profile dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-12 sm:top-14 bg-white dark:bg-[#2A2A2A] rounded-lg shadow-lg border border-gray-200 dark:border-[#3A3A3A] w-[260px] sm:w-[272px] z-50 transition-colors">
                <div className="p-4 border-b border-gray-100 dark:border-[#3A3A3A]">
                  <div className="flex items-center gap-3">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-img-IlvMGJzzN77BPcgfbFQVybIIXKKBsA.jpg"
                      alt="User profile"
                      width={44}
                      height={44}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        User name
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-[#00C851]" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Active Now
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  {menuItemsProfile.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                        item.isLogout
                          ? "hover:bg-blue-50 dark:hover:bg-[#353535] text-gray-900 dark:text-gray-100"
                          : "hover:bg-gray-50 dark:hover:bg-[#353535] text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <Image
                        src={item.icon || "/placeholder.svg"}
                        alt={item.label}
                        width={17}
                        height={17}
                        className="flex-shrink-0 dark:invert"
                      />
                      <span className="text-[14px] font-medium">
                        {item.label}
                      </span>
                    </a>
                  ))}
                </div>
                <Button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile dropdown navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#2A2A2A] border-t border-gray-100 dark:border-[#333] px-5 py-4 space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block text-sm transition-colors ${
                  pathname === item.href
                    ? "text-[#0077F7]"
                    : "text-gray-700 dark:text-gray-300 hover:text-[#0077F7]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/sign-up">
            <Button className="w-full bg-[#0077F7] hover:bg-[#0066D6] dark:bg-[#3399FF] dark:hover:bg-[#4DA3FF] text-white rounded-full">
              Login
            </Button>
            </Link>
          </div>
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
              <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-blue-300">
                <div className="flex size-12 items-center justify-center rounded-full bg-[#0077F7]">
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
                  className="h-14 w-full bg-gray-100 font-medium text-[#0077F7] transition-colors hover:bg-gray-200 sm:w-[212px]"
                  style={{ borderRadius: "50px" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Logging out...");
                    setShowLogoutModal(false);
                  }}
                  className="h-14 w-full bg-[#0077F7] font-medium text-white transition-colors hover:bg-blue-600 sm:w-[212px]"
                  style={{ borderRadius: "50px" }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
