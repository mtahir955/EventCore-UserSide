"use client";

import { Sidebar } from "../host-dashboard/components/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { PaymentWithdrawalTable } from "../admin/components/payment-withdrawal-table";
import { Bell, User, X, LogOut, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { PaymentSuccessTable } from "../admin/components/payment-success-table";
import LogoutModalHost from "@/components/modals/LogoutModalHost";
import axios from "axios";
import type { RefundRequest } from "../admin/components/payment-withdrawal-table";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

interface WithdrawalRequest {
  id: string;
  name: string;
  avatar: string;
  email: string;
  category: string;
  address: string;
  amount: number;
}

const withdrawalRequests: WithdrawalRequest[] = [
  {
    id: "1",
    name: "Daniel Carter",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
  {
    id: "3",
    name: "Emily Carter",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
  {
    id: "4",
    name: "Nathan Blake",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
  {
    id: "5",
    name: "Taylor Morgan",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
];

type RefundTab = "PENDING" | "APPROVED" | "DECLINED";

export default function PaymentWithdrawalPage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [activeTab, setActiveTab] = useState<RefundTab>("PENDING");

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dropdowns
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);

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

  const [hostName, setHostName] = useState("Host");

  useEffect(() => {
    const savedUser = localStorage.getItem("hostUser");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      // Host Name
      setHostName(user.userName || user.fullName || "Host");

      console.log("HOST DASHBOARD USER:", user);
      console.log("HOST SUBDOMAIN:", user?.subDomain);
    } else {
      // Force redirect if no host session found
      window.location.href = "/sign-in-host";
    }
  }, []);

  const fetchRefundRequests = async (status?: RefundTab) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("hostToken");
      if (!token) {
        console.error("Host token missing");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/tickets/admin/refund-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
          },
          params: {
            page,
            limit,
            status,
          },
        }
      );

      setRefundRequests(response.data?.data?.items || []);
    } catch (error: any) {
      console.error(
        "Failed to fetch refund requests",
        error?.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefundRequests(activeTab);
  }, [activeTab, page]);

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      <Sidebar
        active="Refund Requests"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />
      {/* Main Section */}
      <main className="flex-1 overflow-auto lg:ml-[250px] dark:bg-[#101010]">
        {/* ===== Header ===== */}
        <header className="hidden md:flex items-center justify-between px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 bg-[#FAFAFB] dark:bg-[#101010]">
          <div className="flex items-center gap-4">
            {/* Hamburger icon on tablet (hidden on lg) */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu className="w-6 h-6 text-gray-800" />
            </button>

            <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-foreground">
              Refund Requests
            </h1>
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
              {/* <div ref={notificationsRef} className="relative">
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
                  /> */}
                  {/* Counter badge */}
                  {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </button> */}

                {/* Notification popup */}
                {/* {showNotifications && (
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
              </div> */}

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

                      <Link href="/ticket-manager">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          Ticket Manager
                        </button>
                      </Link>

                      <Link href="/host-payments">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          Payments
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
          </div>
        </header>

        {/* Bottom Divider Line */}
        <div className="border-b border-gray-200 dark:border-gray-800"></div>

        {/* Mobile Header Spacer */}
        <div className="lg:hidden h-[56px]" />

        {/* ===== Page Content ===== */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* ===== Payment Withdrawal Table ===== */}
          <div className="px-6 pt-6 pb-4 border-b dark:border-gray-800">
            <h1 className="text-2xl font-semibold text-foreground">
              Refund Requests
            </h1>

            {/* ===== TABS ===== */}
            <div className="flex gap-3 mt-6">
              {[
                { key: "PENDING", label: "Pending" },
                { key: "APPROVED", label: "Successful" },
                { key: "DECLINED", label: "Declined" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as RefundTab)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition
                  ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#1f1f1f] dark:text-gray-300"
                  }
                `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ===== TAB CONTENT ===== */}
          <div className="p-6">
            {activeTab === "PENDING" && (
              <div className="rounded-xl border bg-white dark:bg-[#1a1a1a]">
                <PaymentWithdrawalTable
                  status="PENDING"
                  data={refundRequests}
                  loading={loading}
                />
              </div>
            )}

            {activeTab === "APPROVED" && (
              <div className="rounded-xl border bg-white dark:bg-[#1a1a1a]">
                <PaymentSuccessTable data={refundRequests} loading={loading} />
              </div>
            )}

            {activeTab === "DECLINED" && (
              <div className="rounded-xl border bg-white dark:bg-[#1a1a1a]">
                <PaymentWithdrawalTable
                  status="DECLINED"
                  data={refundRequests}
                  loading={loading}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      <LogoutModalHost
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/sign-in-host";
        }}
      />
    </div>
  );
}
