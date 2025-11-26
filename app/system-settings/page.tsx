"use client";

import { Sidebar } from "../admin/components/sidebar";
import { Bell, User, ChevronDown, X, LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import LogoutModal from "@/components/modals/LogoutModal";

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

  // 🔹 Apply theme automatically when adminTheme changes
  useEffect(() => {
    if (adminTheme === "Dark Theme") setTheme("dark");
    else setTheme("light");
  }, [adminTheme, setTheme]);

  // 🔹 Close dropdown when clicking outside
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

  const [adminName, setAdminName] = useState("Admin");

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [subdomain, setSubdomain] = useState("eventcore.yourdomain.com");
  const handleSaveAdminInfo = () => {
    console.log({
      username: adminName,
      email,
      password,
      subdomain,
    });

    toast.success("Admin details updated successfully 🎉", {
      duration: 4000,
      position: "bottom-right",
      style: {
        background: "#101010",
        color: "#fff",
        border: "1px solid #D19537",
      },
      iconTheme: {
        primary: "#D19537",
        secondary: "#fff",
      },
    });
  };

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
        {/* Main Form */}
        <div className="p-4 sm:p-6 md:p-8 w-full">
          <div className="bg-white dark:bg-black/60 rounded-xl p-4 sm:p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6 sm:mb-8">
              System Settings
            </h2>

            <div className="space-y-8">
              {/* NEW ADMIN PROFILE FIELDS  */}

              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  {/* Username */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter admin username"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010]
      text-gray-900 dark:text-white border-gray-300 dark:border-gray-700
      focus:ring-2 focus:ring-[#D19537] outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Admin Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010]
      text-gray-900 dark:text-white border-gray-300 dark:border-gray-700
      focus:ring-2 focus:ring-[#D19537] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010]
      text-gray-900 dark:text-white border-gray-300 dark:border-gray-700
      focus:ring-2 focus:ring-[#D19537] outline-none"
                    />
                  </div>

                  {/* Subdomain */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Admin Domain <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subdomain"
                      placeholder="example.yourdomain.com"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010]
      text-gray-900 dark:text-white border-gray-300 dark:border-gray-700
      focus:ring-2 focus:ring-[#D19537] outline-none"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <button
                    onClick={handleSaveAdminInfo}
                    className="w-full sm:w-auto px-4 py-2 text-[14px] bg-[#D19537] text-white rounded-lg 
          hover:bg-[#c2872f] transition font-medium"
                  >
                    Save Changes
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
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 dark:bg-[#101010] dark:text-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[#D19537] focus:ring-1 focus:ring-[#D19537] outline-none transition"
                    >
                      <option value="Light Theme">Light Theme</option>
                      <option value="Dark Theme">Dark Theme</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                  </div>
                </div>
              </div>
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
          window.location.href = "/sign-in-admin";
        }}
      />
    </div>
  );
}
