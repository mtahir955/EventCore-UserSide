"use client";

import { Sidebar } from "../admin/components/sidebar";
import { Bell, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import LogoutModal from "@/components/modals/LogoutModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig"; // ADD THIS IMPORT
import { setThemeGlobal } from "@/utils/themeManager";
import { SAAS_Tenant_ID } from "@/config/sasTenantId";
import useAuthInterceptor from "@/utils/useAuthInterceptor";

export default function SystemSettingsPage() {
  // STATES
  // These 3 fields come from backend and are LOCKED
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [subdomain, setSubdomain] = useState("");

  useAuthInterceptor("admin"); // <— activates 401 redirect for this user role

  // Fixed values (cannot be changed)
  const systemLanguage = "English";
  const currency = "USD ($)";
  const timeZone = "US / EST";
  const dateFormat = "DD/MM/YYYY";

  // Only editable field: Theme
  const [adminTheme, setAdminTheme] = useState("Light Theme");

  // Modals
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { setTheme } = useTheme();

  const TENANT_ID = "5448a824-4d14-4727-88a8-846f8a92f23a";

  // APPLY THEME ON CHANGE

  useEffect(() => {
    setTheme(adminTheme === "Dark Theme" ? "dark" : "light");
  }, [adminTheme]);

  // FETCH ADMIN SETTINGS FROM BACKEND

  useEffect(() => {
    const savedUser = localStorage.getItem("adminUser");
    const savedTheme = localStorage.getItem("adminTheme");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      setAdminName(user.userName || "");
      setEmail(user.email || "");
      setSubdomain(user.subDomain || "");
    }

    // Apply saved theme
    if (savedTheme === "dark") {
      setAdminTheme("Dark Theme");
      setTheme("dark");
    } else {
      setAdminTheme("Light Theme");
      setTheme("light");
    }
  }, []);

  // PASSWORD CHANGE SUBMIT HANDLER

  const handlePasswordSubmit = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("No admin token found. Please log in again.", {
          style: {
            background: "#101010",
            color: "#fff",
            border: "1px solid #D19537",
          },
        });
        return;
      }

      await axios.put(
        `${API_BASE_URL}/auth/change-password`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-id": SAAS_Tenant_ID,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Password updated successfully!", {
        style: {
          background: "#101010",
          color: "#fff",
          border: "1px solid #D19537",
        },
      });

      setShowChangePasswordModal(false);
    } catch (error: any) {
      console.error("Password update error:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to update password. Please try again.";

      toast.error(message, {
        style: {
          background: "#101010",
          color: "#fff",
          border: "1px solid red",
        },
      });
    }
  };

  const handleThemeChange = async (selectedTheme: string) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      toast.error("No admin token found. Please login again.", {
        style: {
          background: "#101010",
          color: "#fff",
          border: "1px solid red",
        },
      });
      return;
    }

    const themeToSend = selectedTheme === "Dark Theme" ? "dark" : "light";

    try {
      await axios.put(
        `${API_BASE_URL}/users/me/theme`,
        { theme: themeToSend },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-id": SAAS_Tenant_ID,
            "Content-Type": "application/json",
          },
        }
      );

      // APPLY theme instantly
      setAdminTheme(selectedTheme);
      setThemeGlobal(themeToSend);

      toast.success("Theme updated successfully!", {
        style: {
          background: "#101010",
          color: "#fff",
          border: "1px solid #D19537",
        },
      });
    } catch (error: any) {
      console.error("Theme update failed:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to update theme. Please try again.";

      toast.error(message, {
        style: {
          background: "#101010",
          color: "#fff",
          border: "1px solid red",
        },
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFB] dark:bg-[#101010]">
      <Sidebar activePage="System Settings" />

      <div className="flex-1 overflow-auto md:ml-[250px]">
        {/* HEADER */}
        <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>

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
                    <Link href="/tenant-form">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                        Create Tenant
                      </button>
                    </Link>

                    <Link href="/host-management">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                        Tenant Host
                      </button>
                    </Link>

                    <Link href="/tenant-management">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                        Tenant Management
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

        {/* CONTENT */}
        <div className="p-6">
          <div className="bg-white mt-16 sm:mt-0 dark:bg-black/60 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              System Settings
            </h2>

            {/* FIXED ADMIN FIELDS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  value={adminName}
                  disabled
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Admin Email
                </label>
                <input
                  type="text"
                  value={email}
                  disabled
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Domain */}
            <div className="w-full sm:w-1/2 mb-8">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Admin Domain
              </label>
              <input
                type="text"
                value={subdomain}
                disabled
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Change Password Button */}
            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="px-4 py-2 bg-[#D19537] text-white rounded-lg hover:bg-[#c2872f]"
            >
              Change Password
            </button>

            {/* FIXED DROPDOWNS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              {/* LANGUAGE */}
              <div>
                <label className="text-sm dark:text-gray-300">
                  System Language
                </label>
                <input
                  type="text"
                  value={systemLanguage}
                  disabled
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="text-sm dark:text-gray-300">Currency</label>
                <input
                  type="text"
                  value={currency}
                  disabled
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Time Zone */}
              <div>
                <label className="text-sm dark:text-gray-300">Time Zone</label>
                <input
                  type="text"
                  value={timeZone}
                  disabled
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Date Format */}
              <div>
                <label className="text-sm dark:text-gray-300">
                  Date Format
                </label>
                <input
                  type="text"
                  value={dateFormat}
                  disabled
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 cursor-not-allowed"
                />
              </div>
            </div>

            {/* THEME */}

            <div className="mt-8 w-full sm:w-1/2">
              <label className="text-sm dark:text-gray-300">Admin Theme</label>

              <select
                value={adminTheme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#101010] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Light Theme">Light Theme</option>
                <option value="Dark Theme">Dark Theme</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/sign-in-admin";
        }}
      />

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
}
