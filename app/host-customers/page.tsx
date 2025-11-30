"use client";

import { Sidebar } from "../host-dashboard/components/sidebar";
import { UserInfoModal } from "../host-dashboard/components/user-info-modal";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import LogoutModalHost from "@/components/modals/LogoutModalHost";

type Customer = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  event: string;
  ticketId: string;
  ticketQuantity: number;
  gender: string;
  category: "General" | "VIP";
  phone: string;
  address: string;
};

// 🟧 Updated mock data with Category + Ticket Quantity
const mockData: Customer[] = [
  {
    id: "1",
    name: "Daniel Carter",
    avatar: "/images/avatars/daniel-carter-large.png",
    email: "info@gmail.com",
    event: "Starry Nights",
    ticketId: "TCK-992134",
    ticketQuantity: 2,
    gender: "Male",
    category: "General",
    phone: "+44 7412 558492",
    address: "1234 Sunset Blvd, Los Angeles, CA 90026",
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    avatar: "/placeholder.svg",
    email: "info@gmail.com",
    event: "Starry Nights",
    ticketId: "TCK-883421",
    ticketQuantity: 4,
    gender: "Female",
    category: "VIP",
    phone: "+44 7412 558493",
    address: "5678 Ocean Ave, Santa Monica, CA 90401",
  },
  {
    id: "3",
    name: "Emily Carter",
    avatar: "/placeholder.svg",
    email: "info@gmail.com",
    event: "Music Galaxy",
    ticketId: "TCK-552342",
    ticketQuantity: 1,
    gender: "Female",
    category: "General",
    phone: "+44 7412 558494",
    address: "9012 Hollywood Blvd, Hollywood, CA 90028",
  },
  {
    id: "4",
    name: "Nathan Blake",
    avatar: "/placeholder.svg",
    email: "info@gmail.com",
    event: "Tech Expo",
    ticketId: "TCK-763223",
    ticketQuantity: 3,
    gender: "Male",
    category: "VIP",
    phone: "+44 7412 558495",
    address: "3456 Venice Blvd, Venice, CA 90291",
  },
  {
    id: "5",
    name: "Taylor Morgan",
    avatar: "/placeholder.svg",
    email: "info@gmail.com",
    event: "Summer Jam",
    ticketId: "TCK-991234",
    ticketQuantity: 1,
    gender: "Non-binary",
    category: "General",
    phone: "+44 7412 558496",
    address: "Beverly Hills, CA 90210",
  },
  {
    id: "6",
    name: "Taylor Morgan",
    avatar: "/placeholder.svg",
    email: "info@gmail.com",
    event: "Summer Jam",
    ticketId: "TCK-991234",
    ticketQuantity: 1,
    gender: "Non-binary",
    category: "General",
    phone: "+44 7412 558496",
    address: "Beverly Hills, CA 90210",
  },
  {
    id: "7",
    name: "Taylor Morgan",
    avatar: "/placeholder.svg",
    email: "info@gmail.com",
    event: "Summer Jam",
    ticketId: "TCK-991234",
    ticketQuantity: 1,
    gender: "Non-binary",
    category: "General",
    phone: "+44 7412 558496",
    address: "Beverly Hills, CA 90210",
  },
];

export default function CustomersPage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔍 Filtering logic
  const filteredData = searchQuery
    ? mockData.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.ticketId.toLowerCase().includes(q)
        );
      })
    : mockData;

  const handleRowClick = (customer: Customer) => {
    setSelectedUser(customer);
    setIsModalOpen(true);
  };

  const handleSearch = () => setSearchQuery(searchInput);
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  // notifications + profile dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, message: "Your event 'Tech Summit' was approved!" },
    { id: 2, message: "You sold 3 tickets for 'Lahore Music Fest'." },
    { id: 3, message: "New user message received." },
  ];

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

  const { theme, setTheme } = useTheme();
  const [hostName, setHostName] = useState("Host");

  useEffect(() => {
      const savedUser = localStorage.getItem("hostUser");
  
      if (savedUser) {
        const user = JSON.parse(savedUser);
  
        // Host Name
        setHostName(user.userName || user.fullName || "Host");
  
        // Subdomain (optional)
        // setHostSubdomain(user.subDomain || "");
  
        console.log("HOST DASHBOARD USER:", user);
        console.log("HOST SUBDOMAIN:", user?.subDomain);
  
        // Theme (optional)
        if (user.theme) {
          // syncThemeWithBackend(user);
        }
      } else {
        // Force redirect if no host session found
        window.location.href = "/sign-in-host";
      }
    }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  // Pagination calculations
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;

  // Slice the filtered results
  const currentEntries = filteredData.slice(indexOfFirst, indexOfLast);

  // Total pages
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  return (
    <div className="relative bg-[#FAFAFB] dark:bg-[#101010] w-full min-h-screen flex overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar
        active="Customers"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-[260px] h-full bg-white shadow-lg z-50">
            <Sidebar active="Customers" />
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1 lg:ml-[256px] sm:w-[1168px] mt-14 sm:mt-0 dark:bg-[#101010] overflow-x-hidden">
        {/* Header */}
        <header className="hidden md:flex items-center justify-between px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 bg-[#FAFAFB] dark:bg-[#101010]">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-foreground">
              Customers
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
          </div>
        </header>

        {/* Search Bar */}
        <div className="px-8 py-6 bg-[#FAFAFB] dark:bg-[#101010]">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search name, email or ticket ID..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (!e.target.value) setSearchQuery("");
                }}
                className="w-full h-12 pl-12 pr-10 rounded-xl border text-[14px]"
              />
              {searchInput && (
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={handleClearSearch}
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={handleSearch}
              className="h-12 px-8 rounded-xl text-white font-medium"
              style={{ backgroundColor: "#D19537" }}
            >
              Search
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="px-8 pb-10">
          <div className="bg-white dark:bg-[#101010] rounded-xl shadow-sm">
            {/* WRAPPER: Scroll only on mobile */}
            <div className="overflow-x-auto md:overflow-visible w-full">
              {/* TABLE HEADER */}
              <div
                className="min-w-[1050px] grid grid-cols-[160px_200px_150px_150px_120px_120px_120px] px-6 py-4 font-semibold text-[14px] text-center"
                style={{ backgroundColor: "#F5EDE5" }}
              >
                <div className="dark:text-black">Customer Name</div>
                <div className="dark:text-black">Email</div>
                <div className="dark:text-black">Event</div>
                <div className="dark:text-black">Ticket ID</div>
                <div className="dark:text-black">Gender</div>
                <div className="dark:text-black">Category</div>
                <div className="dark:text-black">Tickets Qty</div>
              </div>

              {/* TABLE BODY */}
              {currentEntries.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleRowClick(c)}
                  className="min-w-[1050px] grid grid-cols-[160px_200px_150px_150px_120px_120px_120px] px-6 py-4 text-[14px] border-b text-center hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Image
                      src={c.avatar}
                      alt={c.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span>{c.name}</span>
                  </div>

                  <div>{c.email}</div>
                  <div>{c.event}</div>
                  <div>{c.ticketId}</div>
                  <div>{c.gender}</div>
                  <div>{c.category}</div>
                  <div>{c.ticketQuantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4 mb-6">
            {/* Prev Button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === i + 1
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "dark:border-gray-700 dark:bg-[#181818]"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next Button */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
            >
              Next
            </button>
          </div>
        )}
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
