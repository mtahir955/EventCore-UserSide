"use client";

import { Sidebar } from "../host-dashboard/components/sidebar";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import LogoutModalHost from "@/components/modals/LogoutModalHost";
import AddCreditModal from "../host-dashboard/components/AddCreditModal";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";
import { createPortal } from "react-dom";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type Buyer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  gender: string;

  creditBalance?: number;
  earliestCreditExpiry?: string; // ✅ ADD THIS
  creditReason?: string; // ✅ ADD THIS
};

export default function BuyersPage() {
  const { theme } = useTheme();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [hostName, setHostName] = useState("Host");

  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const entriesPerPage = 5;

  const [creditMode, setCreditMode] = useState<"add" | "update">("add");

  const [isCreditSystemEnabled, setIsCreditSystemEnabled] = useState(false);

  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
    buyerId: string;
  } | null>(null);

  /* ─────────────────────────────────────────
     AUTH CHECK
  ───────────────────────────────────────── */
  useEffect(() => {
    const savedUser = localStorage.getItem("hostUser");
    if (!savedUser) {
      window.location.href = "/sign-in-host";
      return;
    }

    const user = JSON.parse(savedUser);
    setHostName(user.userName || user.fullName || "Host");
  }, []);

  useEffect(() => {
    const fetchTenantFeatures = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/tenants/my/features`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        });

        const creditEnabled =
          res?.data?.data?.features?.creditSystem?.enabled === true;

        setIsCreditSystemEnabled(creditEnabled);
      } catch (err) {
        console.error("Failed to load tenant features", err);
        // ❗ Fail-safe: hide credit actions if feature fetch fails
        setIsCreditSystemEnabled(false);
      }
    };

    fetchTenantFeatures();
  }, []);

  /* ─────────────────────────────────────────
     PAGINATION
  ───────────────────────────────────────── */
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Dummy notifications
  const notifications = [
    { id: 1, message: "Your event 'Tech Summit' was approved!" },
    { id: 2, message: "You sold 3 tickets for 'Lahore Music Fest'." },
    { id: 3, message: "New user message received." },
  ];

  const getToken = () => {
    if (typeof window === "undefined") return null;

    const raw =
      localStorage.getItem("hostToken") || localStorage.getItem("token");

    try {
      const parsed = JSON.parse(raw || "{}");
      return parsed?.token || parsed;
    } catch {
      return raw;
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = getToken();
      if (!token) return;

      try {
        setLoading(true);

        const res = await axios.get(`${API_BASE_URL}/users/customers`, {
          params: {
            page: currentPage,
            limit: entriesPerPage,
            search: searchQuery || undefined,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        });

        setBuyers(res.data.data.customers);
        setTotalPages(res.data.data.pagination.totalPages);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage, searchQuery]);

  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* ─────────────────────────────────────────
     CLICK OUTSIDE HANDLER
  ───────────────────────────────────────── */
  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (!openMenuId) return;
      if (showAddCreditModal) return;

      const currentMenu = menuRefs.current[openMenuId];
      if (currentMenu && currentMenu.contains(e.target as Node)) {
        return; // ✅ clicked inside menu
      }

      setOpenMenuId(null);
      setShowNotifications(false);
      setShowProfileDropdown(false);
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [openMenuId, showAddCreditModal]);

  const handleAddCredit = async (data: {
    amount: number;
    reason: string;
    expiresAt: string;
    customerId: string;
  }) => {
    // ✅ EXPIRY DATE VALIDATION (ADD HERE)
    if (new Date(data.expiresAt) <= new Date()) {
      toast.error("Expiry date must be in the future");
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    try {
      toast.loading("Adding credit...", { id: "add-credit" });

      const res = await axios.post(
        `${API_BASE_URL}/users/customers/credits`,
        {
          customerId: data.customerId,
          amount: data.amount,
          reason: data.reason,
          expiresAt: data.expiresAt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Credit added successfully", { id: "add-credit" });

      // ✅ Update customer credit in UI instantly
      setBuyers((prev) =>
        prev.map((b) =>
          b.id === data.customerId
            ? {
                ...b,
                creditBalance: res.data.data.creditBalance,
                earliestCreditExpiry: res.data.data.expiresAt,
                creditReason: res.data.data.reason,
              }
            : b
        )
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add credit", {
        id: "add-credit",
      });
    }
  };

  const handleUpdateCredit = async (data: {
    amount: number;
    reason: string;
    expiresAt: string;
    customerId: string;
  }) => {
    const token = getToken();
    if (!token) return toast.error("Unauthorized");

    try {
      toast.loading("Updating credit...", { id: "update-credit" });

      const res = await axios.put(
        `${API_BASE_URL}/users/customers/credits`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        }
      );

      toast.success("Credit updated", { id: "update-credit" });

      setBuyers((prev) =>
        prev.map((b) =>
          b.id === data.customerId
            ? {
                ...b,
                creditBalance: res.data.data.creditBalance,
                earliestCreditExpiry: res.data.data.expiresAt,
                creditReason: res.data.data.reason,
              }
            : b
        )
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update credit", {
        id: "update-credit",
      });
    }
  };

  const handleRemoveCredit = async (customerId: string) => {
    const token = getToken();
    if (!token) return toast.error("Unauthorized");

    try {
      toast.loading("Removing credit...", { id: "remove-credit" });

      await axios.delete(`${API_BASE_URL}/users/customers/credits`, {
        data: { customerId },
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": HOST_Tenant_ID,
        },
      });

      toast.success("Credit removed", { id: "remove-credit" });

      setBuyers((prev) =>
        prev.map((b) =>
          b.id === customerId
            ? {
                ...b,
                creditBalance: 0,
                earliestCreditExpiry: undefined,
                creditReason: undefined,
              }
            : b
        )
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove credit", {
        id: "remove-credit",
      });
    }
  };

  useEffect(() => {
    if (!isCreditSystemEnabled) {
      setOpenMenuId(null);
    }
  }, [isCreditSystemEnabled]);

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <div className="relative bg-[#FAFAFB] dark:bg-[#101010] min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        active="Customers"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      {/* Main */}
      <main className="flex-1 lg:ml-[238px] dark:bg-[#101010]">
        {/* Header */}
        <header className="hidden md:flex items-center justify-between px-8 pt-8 pb-4">
          <h1 className="text-[32px] font-semibold tracking-[-0.02em]">
            Customers
          </h1>
          {/* Right section */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4 relative">
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

        <div className="border-b border-gray-200 dark:border-gray-800" />

        {/* Search */}
        <div className="px-8 sm:mt-20 lg:mt-8 mt-20 mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search name, email or phone..."
            className="h-12 w-full rounded-xl border px-4"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (!e.target.value) setSearchQuery("");
            }}
          />

          <button
            onClick={() => setSearchQuery(searchInput)}
            className="h-12 w-full sm:w-auto px-8 rounded-xl text-white bg-[#D19537]"
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="p-6 text-center text-sm text-gray-500">
            Loading customers...
          </div>
        )}

        {/* Table */}
        <div className="mx-4 sm:mx-8 bg-white dark:bg-[#101010] rounded-xl shadow-sm overflow-x-auto">
          {/* DESKTOP HEADER */}
          <div
            className="
      hidden md:grid
      grid-cols-[280px_250px_200px_180px_120px_60px]
      px-6 py-4 font-semibold text-sm
    "
            style={{ backgroundColor: "#F5EDE5" }}
          >
            <div className="dark:text-black">Name</div>
            <div className="dark:text-black">Email</div>
            <div className="dark:text-black">Phone</div>
            <div className="dark:text-black">City</div>
            <div className="dark:text-black">Gender</div>
            <div />
          </div>

          {/* ROWS */}
          {buyers.map((b) => {
            const hasCredits = (b.creditBalance ?? 0) > 0;

            return (
              <div
                key={b.id}
                className="
    relative
    overflow-visible
    border-b
    p-4 space-y-3
    md:grid md:grid-cols-[280px_250px_200px_180px_120px_60px]
    md:px-6 md:py-4 md:space-y-0
    hover:bg-gray-50 dark:hover:bg-gray-900
  "
              >
                {/* NAME + MENU */}
                <div className="flex items-center justify-between md:justify-start md:gap-3">
                  <div>
                    <p className="font-medium">{b.name}</p>
                    <p className="text-xs text-gray-500 md:hidden">{b.email}</p>
                  </div>

                  {/* MOBILE MENU */}
                  <div className="relative md:hidden">
                    {isCreditSystemEnabled && (
                      <button
                        className="p-2 rounded-full dark:bg-[#101010] hover:bg-gray-200 dark:hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();

                          const rect = (
                            e.currentTarget as HTMLElement
                          ).getBoundingClientRect();

                          setMenuPosition({
                            top: rect.bottom + 6,
                            left: rect.left - 120, // adjust alignment
                            buyerId: b.id,
                          });

                          setOpenMenuId(b.id);
                        }}
                      >
                        ⋯
                      </button>
                    )}
                  </div>
                </div>

                {/* MOBILE INFO */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:hidden">
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p>{b.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">City</p>
                    <p>{b.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Gender</p>
                    <p>{b.gender}</p>
                  </div>
                </div>

                {/* DESKTOP COLUMNS */}
                <div className="hidden md:block break-all max-w-[250px]">
                  {b.email}
                </div>

                <div className="hidden md:block break-words">{b.phone}</div>

                <div className="hidden md:block">{b.city}</div>
                <div className="hidden md:block">{b.gender}</div>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex justify-center relative">
                  {isCreditSystemEnabled && (
                    <button
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();

                        const rect = (
                          e.currentTarget as HTMLElement
                        ).getBoundingClientRect();

                        setMenuPosition({
                          top: rect.bottom + 6,
                          left: rect.left - 120, // adjust alignment
                          buyerId: b.id,
                        });

                        setOpenMenuId(b.id);
                      }}
                    >
                      ⋯
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 mb-8">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="
        px-4 py-2 rounded-md border text-sm
        disabled:opacity-40 disabled:cursor-not-allowed
        hover:bg-gray-100 dark:hover:bg-gray-800
      "
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
            px-4 py-2 rounded-md border text-sm
            ${
              currentPage === page
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }
          `}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="
        px-4 py-2 rounded-md border text-sm
        disabled:opacity-40 disabled:cursor-not-allowed
        hover:bg-gray-100 dark:hover:bg-gray-800
      "
            >
              Next
            </button>
          </div>
        )}
      </main>

      {openMenuId &&
        menuPosition &&
        createPortal(
          (() => {
            const buyer = buyers.find((b) => b.id === openMenuId);
            const credit = buyer?.creditBalance ?? 0;

            return (
              <div
                style={{
                  position: "fixed",
                  top: menuPosition.top,
                  left: menuPosition.left,
                }}
                className="w-44 bg-white dark:bg-[#101010] border rounded-lg shadow-xl z-[99999]"
                onPointerDown={(e) => e.stopPropagation()}
              >
                {credit === 0 && (
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={() => {
                      if (!buyer) return;
                      setSelectedBuyer(buyer);
                      setCreditMode("add");
                      setShowAddCreditModal(true);
                      setOpenMenuId(null);
                    }}
                  >
                    Add Credit
                  </button>
                )}

                {credit > 0 && (
                  <>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                      onClick={() => {
                        if (!buyer) return;
                        setSelectedBuyer(buyer);
                        setCreditMode("update");
                        setShowAddCreditModal(true);
                        setOpenMenuId(null);
                      }}
                    >
                      Update Credit
                    </button>

                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg"
                      onClick={() => {
                        handleRemoveCredit(openMenuId);
                        setOpenMenuId(null);
                      }}
                    >
                      Remove Credit
                    </button>
                  </>
                )}
              </div>
            );
          })(),
          document.body
        )}

      {/* Modals */}
      <LogoutModalHost
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/sign-in-host";
        }}
      />

      <AddCreditModal
        isOpen={showAddCreditModal}
        onClose={() => setShowAddCreditModal(false)}
        customer={selectedBuyer}
        mode={creditMode}
        initialCredit={
          creditMode === "update" &&
          selectedBuyer?.creditBalance &&
          selectedBuyer?.earliestCreditExpiry
            ? {
                amount: selectedBuyer.creditBalance,
                reason: selectedBuyer.creditReason || "", // ✅ REAL DATA
                expiresAt: selectedBuyer.earliestCreditExpiry,
              }
            : null
        }
        onSave={(data) => {
          creditMode === "update"
            ? handleUpdateCredit(data)
            : handleAddCredit(data);

          setShowAddCreditModal(false);
        }}
      />
    </div>
  );
}
