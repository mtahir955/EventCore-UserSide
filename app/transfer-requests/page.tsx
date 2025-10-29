"use client";

import { Sidebar } from "../host-dashboard/components/sidebar";
import { UserInfoModal } from "../host-dashboard/components/user-info-modal";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Menu, X, LogOut } from "lucide-react"; // for mobile hamburger

type TransferRequest = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  event: string;
  ticketId: string;
  ticketTransfer: number;
  phone: string;
  gender: string;
  address: string;
};

const mockData: TransferRequest[] = [
  {
    id: "1",
    name: "Daniel Carter",
    avatar: "/images/avatars/daniel-carter-large.png",
    email: "info@gmail.com",
    event: "Starry Nights",
    ticketId: "TCK-992134",
    ticketTransfer: 2,
    phone: "+44 7412 558492",
    gender: "Male",
    address: "1234 Sunset Blvd, Los Angeles, CA 90026",
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    avatar: "/placeholder.svg?height=96&width=96",
    email: "info@gmail.com",
    event: "Starry Nights",
    ticketId: "TCK-992134",
    ticketTransfer: 4,
    phone: "+44 7412 558493",
    gender: "Female",
    address: "5678 Ocean Ave, Santa Monica, CA 90401",
  },
  {
    id: "3",
    name: "Emily Carter",
    avatar: "/placeholder.svg?height=96&width=96",
    email: "info@gmail.com",
    event: "Starry Nights",
    ticketId: "TCK-992134",
    ticketTransfer: 1,
    phone: "+44 7412 558494",
    gender: "Female",
    address: "9012 Hollywood Blvd, Hollywood, CA 90028",
  },
  {
    id: "4",
    name: "Nathan Blake",
    avatar: "/placeholder.svg?height=96&width=96",
    email: "info@gmail.com",
    event: "Starry Nights",
    ticketId: "TCK-992134",
    ticketTransfer: 2,
    phone: "+44 7412 558495",
    gender: "Male",
    address: "3456 Venice Blvd, Venice, CA 90291",
  },
  {
    id: "5",
    name: "Taylor Morgan",
    avatar: "/placeholder.svg?height=96&width=96",
    email: "info@gmail.com",
    event: "Starry Nights",
    ticketId: "TCK-992134",
    ticketTransfer: 1,
    phone: "+44 7412 558496",
    gender: "Non-binary",
    address: "7890 Beverly Hills, CA 90210",
  },
];

export default function TransferRequestsPage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TransferRequest | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredData = searchQuery
    ? mockData.filter((request) => {
        const query = searchQuery.toLowerCase();
        return (
          request.name.toLowerCase().includes(query) ||
          request.ticketId.toLowerCase().includes(query)
        );
      })
    : mockData;

  const handleAccept = (id: string) => console.log("Accepted:", id);
  const handleReject = (id: string) => console.log("Rejected:", id);

  const handleRowClick = (request: TransferRequest) => {
    setSelectedUser(request);
    setIsModalOpen(true);
  };

  const handleSearch = () => setSearchQuery(searchInput);
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

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

  return (
    <div className="relative bg-[#FAFAFB] w-full min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar (desktop only) */}
      {/* Sidebar */}
      <Sidebar
        active="Transfer Requests"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      {/* Sidebar drawer (mobile/tablet) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-[260px] h-full bg-white shadow-lg z-50">
            <Sidebar active="Transfer Requests" />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-[256px] mt-14 sm:mt-0 h-full">
        {/* Header */}
        <header className="hidden md:flex items-center justify-between px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 bg-[#FAFAFB]">
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
              Transfer Requests
            </h1>
          </div>

          {/* Right section */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4 relative">
              {/* Notification icon */}
              <div ref={notificationsRef} className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileDropdown(false);
                  }}
                  className="bg-white border h-9 w-9 flex justify-center items-center rounded-full relative hover:bg-gray-100"
                >
                  <img
                    src="/images/icons/notification-new.png"
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
                  <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg border border-gray-200 rounded-xl z-50 p-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Notifications
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className="text-sm bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition"
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

              {/* Profile icon + dropdown */}
              <div ref={profileRef} className="relative">
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

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-200 rounded-xl z-50 py-2">
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6 bg-[#FAFAFB]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search Name Or ID"
                value={searchInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput(value);
                  if (value === "") setSearchQuery("");
                }}
                className="w-full h-12 pl-12 pr-10 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537] focus:border-transparent"
              />
              {searchInput && (
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  onClick={handleClearSearch}
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="h-12 px-6 sm:px-8 rounded-xl text-white font-medium text-[14px] transition-colors hover:opacity-90"
              style={{ backgroundColor: "#D19537" }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="px-4 sm:px-6 md:px-8 pb-8">
          <div className="bg-white rounded-xl shadow-sm">
            {/* Scrollable table container */}
            <div className="overflow-x-auto">
              {/* Table Header */}
              <div
                className="min-w-[1050px] grid grid-cols-[160px_150px_150px_150px_150px_1fr] place-items-center gap-4 px-6 py-4 text-[14px] font-semibold text-foreground"
                style={{ backgroundColor: "#F5EDE5" }}
              >
                <div>Name</div>
                <div>Email</div>
                <div>Event</div>
                <div>Ticket ID</div>
                <div>Ticket Transfer</div>
                <div className="text-right">Action</div>
              </div>

              {/* Table Body */}
              <div className="min-w-[800px]">
                {filteredData.map((request) => (
                  <div
                    key={request.id}
                    className="grid grid-cols-[160px_150px_150px_150px_150px_1fr] place-items-center gap-4 px-6 py-4 text-[13px] sm:text-[14px] text-foreground border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(request)}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={request.avatar || "/placeholder.svg"}
                        alt={request.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span className="font-medium whitespace-nowrap">
                        {request.name}
                      </span>
                    </div>
                    <div className="truncate">{request.email}</div>
                    <div className="truncate">{request.event}</div>
                    <div className="truncate">{request.ticketId}</div>
                    <div>{request.ticketTransfer}</div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(request.id);
                        }}
                        className="px-5 sm:px-6 py-2 rounded-full text-white font-medium text-[12px] sm:text-[13px] transition-colors hover:opacity-90"
                        style={{ backgroundColor: "#D19537" }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(request.id);
                        }}
                        className="px-5 sm:px-6 py-2 rounded-full font-medium text-[12px] sm:text-[13px] transition-colors hover:opacity-90"
                        style={{ backgroundColor: "#F5EDE5", color: "#D19537" }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
            className="relative flex w-[90%] flex-col items-center justify-center bg-white p-8 shadow-xl sm:w-[500px]"
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
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
              Are you sure you want to log out?
            </h2>
            <p className="mb-8 text-center text-gray-600">
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

      {selectedUser && (
        <UserInfoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={{
            name: selectedUser.name,
            email: selectedUser.email,
            phone: selectedUser.phone,
            gender: selectedUser.gender,
            address: selectedUser.address,
            avatar: selectedUser.avatar,
          }}
          onAccept={() => handleAccept(selectedUser.id)}
          onReject={() => handleReject(selectedUser.id)}
        />
      )}
    </div>
  );
}
