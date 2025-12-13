"use client";

import { Sidebar } from "../host-dashboard/components/sidebar";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import LogoutModalHost from "@/components/modals/LogoutModalHost";
import AddCreditModal from "../host-dashboard/components/AddCreditModal";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type Buyer = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  city: string;
  gender: string;

  // Credit system
  creditBalance?: number;
};

/* ─────────────────────────────────────────
   MOCK BUYERS (TENANT USERS)
   Replace later with GET /host/buyers
───────────────────────────────────────── */
const mockBuyers: Buyer[] = [
  {
    id: "u1",
    name: "Daniel Carter",
    avatar: "/images/avatars/daniel-carter-large.png",
    email: "daniel@gmail.com",
    phone: "+1 555 892 111",
    city: "Los Angeles",
    gender: "Male",
    creditBalance: 120,
  },
  {
    id: "u2",
    name: "Sarah Mitchell",
    avatar: "/placeholder.svg",
    email: "sarah@gmail.com",
    phone: "+1 555 892 222",
    city: "San Diego",
    gender: "Female",
    creditBalance: 0,
  },
  {
    id: "u3",
    name: "Emily Carter",
    avatar: "/placeholder.svg",
    email: "emily@gmail.com",
    phone: "+1 555 892 333",
    city: "New York",
    gender: "Female",
    creditBalance: 50,
  },
  {
    id: "u4",
    name: "Nathan Blake",
    avatar: "/placeholder.svg",
    email: "nathan@gmail.com",
    phone: "+1 555 892 444",
    city: "Chicago",
    gender: "Male",
    creditBalance: 0,
  },
  {
    id: "u5",
    name: "Nathan Blake",
    avatar: "/placeholder.svg",
    email: "nathan@gmail.com",
    phone: "+1 555 892 444",
    city: "Chicago",
    gender: "Male",
    creditBalance: 0,
  },
  {
    id: "u6",
    name: "Nathan Blake",
    avatar: "/placeholder.svg",
    email: "nathan@gmail.com",
    phone: "+1 555 892 444",
    city: "Chicago",
    gender: "Male",
    creditBalance: 0,
  },
];

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

  /* ─────────────────────────────────────────
     SEARCH FILTER
  ───────────────────────────────────────── */
  const filteredBuyers = searchQuery
    ? mockBuyers.filter((b) => {
        const q = searchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.phone.toLowerCase().includes(q)
        );
      })
    : mockBuyers;

  /* ─────────────────────────────────────────
     PAGINATION
  ───────────────────────────────────────── */
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentEntries = filteredBuyers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBuyers.length / entriesPerPage);

  // Dummy notifications
  const notifications = [
    { id: 1, message: "Your event 'Tech Summit' was approved!" },
    { id: 2, message: "You sold 3 tickets for 'Lahore Music Fest'." },
    { id: 3, message: "New user message received." },
  ];

  /* ─────────────────────────────────────────
     CLICK OUTSIDE HANDLER
  ───────────────────────────────────────── */
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
      setShowNotifications(false);
      setShowProfileDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <main className="flex-1 overflow-auto lg:ml-[250px] dark:bg-[#101010]">
        {/* Header */}
        <header className="hidden md:flex items-center justify-between px-8 pt-8 pb-4">
          <h1 className="text-[32px] font-semibold tracking-[-0.02em]">
            Customers
          </h1>
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
        <div className="px-8 sm:mt-8 mt-20 mb-6 flex flex-col sm:flex-row gap-4">
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

        {/* Table */}
        <div className="mx-4 sm:mx-8 bg-white dark:bg-[#101010] rounded-xl shadow-sm overflow-hidden">
          {/* DESKTOP HEADER */}
          <div
            className="
      hidden md:grid
      grid-cols-[280px_250px_200px_180px_120px_60px]
      px-6 py-4 font-semibold text-sm
    "
            style={{ backgroundColor: "#F5EDE5" }}
          >
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>City</div>
            <div>Gender</div>
            <div />
          </div>

          {/* ROWS */}
          {currentEntries.map((b) => (
            <div
              key={b.id}
              className="
        border-b

        /* MOBILE */
        p-4 space-y-3

        /* DESKTOP */
        md:grid md:grid-cols-[280px_250px_200px_180px_120px_60px]
        md:px-6 md:py-4 md:space-y-0
        hover:bg-gray-50 dark:hover:bg-gray-900
      "
            >
              {/* NAME + MENU */}
              <div className="flex items-center justify-between md:justify-start md:gap-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={b.avatar}
                    alt={b.name}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">{b.name}</p>
                    <p className="text-xs text-gray-500 md:hidden">{b.email}</p>
                  </div>
                </div>

                {/* MOBILE MENU */}
                <div className="relative md:hidden">
                  <button
                    className="p-2 rounded-full hover:bg-gray-200"
                    onClick={() =>
                      setOpenMenuId(openMenuId === b.id ? null : b.id)
                    }
                  >
                    ⋯
                  </button>

                  {openMenuId === b.id && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          setSelectedBuyer(b);
                          setShowAddCreditModal(true);
                          setOpenMenuId(null);
                        }}
                      >
                        Add Credit
                      </button>

                      {b.creditBalance && b.creditBalance > 0 && (
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          Remove Credit
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* MOBILE INFO GRID */}
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
              <div className="hidden md:block">{b.email}</div>
              <div className="hidden md:block">{b.phone}</div>
              <div className="hidden md:block">{b.city}</div>
              <div className="hidden md:block">{b.gender}</div>

              {/* DESKTOP MENU */}
              <div className="hidden md:flex justify-center relative">
                <button
                  className="p-2 rounded-full hover:bg-gray-200"
                  onClick={() =>
                    setOpenMenuId(openMenuId === b.id ? null : b.id)
                  }
                >
                  ⋯
                </button>

                {openMenuId === b.id && (
                  <div className="absolute right-0 top-8 w-44 bg-white border rounded-lg shadow-lg z-50">
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => {
                        setSelectedBuyer(b);
                        setShowAddCreditModal(true);
                        setOpenMenuId(null);
                      }}
                    >
                      Add Credit
                    </button>

                    {b.creditBalance && b.creditBalance > 0 && (
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Remove Credit
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
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
        onSave={(data) => {
          console.log("ADD CREDIT:", data);
          setShowAddCreditModal(false);
        }}
      />
    </div>
  );
}
