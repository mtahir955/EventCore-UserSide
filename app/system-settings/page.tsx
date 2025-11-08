"use client";

import { Sidebar } from "../admin/components/sidebar";
import { Bell, User, ChevronDown, X, LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function SystemSettingsPage() {
  const [require2FA, setRequire2FA] = useState(true);
  const [allowSignup, setAllowSignup] = useState(true);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState("5");
  const [passwordPolicyExpanded, setPasswordPolicyExpanded] = useState(false);
  const [systemLanguage, setSystemLanguage] = useState("English");
  const [currency, setCurrency] = useState("USD ($)");
  const [timeZone, setTimeZone] = useState("CET- Central European Time");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [adminTheme, setAdminTheme] = useState("Light Theme");
  const [defaultTheme, setDefaultTheme] = useState("Light Theme");

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
    <div className="flex min-h-screen bg-[#FAFAFB]">
      {/* Sidebar */}
      <Sidebar activePage="System Settings" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-[250px] dark:bg-[#101010]">
        {" "}
        {/* Header */}
        <header className="flex sm:h-[89px] h-16 flex-wrap items-center justify-between border-b border-gray-200 bg-white dark:bg-[#101010] px-4 sm:px-6 md:px-8 py-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            System Settings
          </h1>

          <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
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
        </header>
        {/* Main Form */}
        <div className="p-4 sm:p-6 md:p-8 w-full">
          <div className="bg-white dark:bg-black/60 rounded-xl p-4 sm:p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6 sm:mb-8">
              General Settings
            </h2>

            <div className="space-y-8">
              {/* === 2FA Section === */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* 2FA */}
                  <div className="flex flex-col gap-y-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      Two Factor Authentication (2FA)
                    </h3>
                    <div className="flex items-center justify-between border-b pb-3 md:border-0 md:pb-0">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Require Two Factor Authentication
                      </span>
                      <button
                        onClick={() => setRequire2FA(!require2FA)}
                        className={`flex items-center h-6 w-11 rounded-full transition-colors duration-300 ${
                          require2FA ? "bg-[#D19537]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`h-[23px] w-[23px] rounded-full bg-white transition-transform duration-300 ${
                            require2FA ? "translate-x-[20px]" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Login Attempts */}
                  <div className="flex flex-col gap-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Login Attempts before Account Lockout
                    </label>
                    <div className="relative">
                      <select
                        value={loginAttempts}
                        onChange={(e) => setLoginAttempts(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 dark:bg-[#101010] dark:text-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#D19537] focus:ring-1 focus:ring-[#D19537] outline-none"
                      >
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* === Password Policy === */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-300">
                  Password Policy
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-[#101010] px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600">
                      Uppercase Letter
                    </button>
                    <button className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600">
                      Lowercase Letter
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      setPasswordPolicyExpanded(!passwordPolicyExpanded)
                    }
                    className="p-1 hover:bg-gray-100 rounded-md self-end sm:self-auto"
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-gray-600 transition-transform ${
                        passwordPolicyExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* === Dropdown Groups === */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* System Language */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    System Language
                  </label>
                  <div className="relative">
                    <select
                      value={systemLanguage}
                      onChange={(e) => setSystemLanguage(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 dark:bg-[#101010] dark:text-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#D19537] focus:ring-1 focus:ring-[#D19537] outline-none"
                    >
                      <option value="English">English</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                  </div>
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    Currency
                  </label>
                  <div className="relative">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 dark:bg-[#101010] dark:text-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#D19537] focus:ring-1 focus:ring-[#D19537] outline-none"
                    >
                      <option value="USD ($)">USD ($)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* === Time Zone & Date Format === */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Time Zone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    Time Zone
                  </label>
                  <div className="relative">
                    <select
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 dark:bg-[#101010] dark:text-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#D19537] focus:ring-1 focus:ring-[#D19537] outline-none"
                    >
                      <option value="CET- Central European Time">
                        CET - Central European Time
                      </option>
                      <option value="EST- Eastern Standard Time">
                        EST - Eastern Standard Time
                      </option>
                      <option value="PST- Pacific Standard Time">
                        PST - Pacific Standard Time
                      </option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                  </div>
                </div>

                {/* Date Format */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    Date and Time Format
                  </label>
                  <div className="relative">
                    <select
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 dark:bg-[#101010] dark:text-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#D19537] focus:ring-1 focus:ring-[#D19537] outline-none"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* === Admin Theme & Signup === */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Admin Theme */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    Admin Dashboard Theme
                  </label>
                  <div className="relative">
                    <select
                      value={adminTheme}
                      onChange={(e) => setAdminTheme(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 dark:bg-[#101010] dark:text-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#D19537] focus:ring-1 focus:ring-[#D19537] outline-none"
                    >
                      <option value="Light Theme">Light Theme</option>
                      <option value="Dark Theme">Dark Theme</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                  </div>
                </div>

                {/* User Signup */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    User Sign up
                  </label>

                  {/* Make whole div clickable */}
                  <div
                    onClick={() => setAllowSignup(!allowSignup)}
                    className="flex items-center justify-between rounded-lg border border-gray-300 bg-white dark:bg-[#101010] px-4 py-2.5 cursor-pointer select-none transition-colors"
                  >
                    <span className="text-sm text-gray-700 dark:text-white">
                      Allow new users to sign up
                    </span>

                    {/* Toggle switch */}
                    <div
                      className={`flex items-center h-6 w-11 rounded-full transition-colors duration-300 ${
                        allowSignup ? "bg-[#D19537]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`h-[23px] w-[23px] rounded-full bg-white shadow-sm transition-transform duration-300 ${
                          allowSignup ? "translate-x-[20px]" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* === Default Theme & Notifications === */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Default Theme */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    Default Theme for Users
                  </label>
                  <div className="relative">
                    <select
                      value={defaultTheme}
                      onChange={(e) => setDefaultTheme(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 dark:bg-[#101010] dark:text-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#D19537] focus:ring-1 focus:ring-[#D19537] outline-none"
                    >
                      <option value="Light Theme">Light Theme</option>
                      <option value="Dark Theme">Dark Theme</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                  </div>
                </div>

                {/* Notifications */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    Notifications
                  </label>

                  {/* Make entire box clickable */}
                  <div
                    onClick={() => setAllowNotifications(!allowNotifications)}
                    className="flex items-center justify-between rounded-lg border border-gray-300 bg-white dark:bg-[#101010] px-4 py-2.5 cursor-pointer select-none transition-colors"
                  >
                    <span className="text-sm text-gray-700 dark:text-white">
                      Allow system notifications
                    </span>

                    {/* Toggle Switch */}
                    <div
                      className={`flex items-center h-6 w-11 rounded-full transition-colors duration-300 ${
                        allowNotifications ? "bg-[#D19537]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`h-[23px] w-[23px] rounded-full bg-white shadow-sm transition-transform duration-300 ${
                          allowNotifications
                            ? "translate-x-[20px]"
                            : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
