"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../components/sidebar";
import { X, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function TicketManager() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const [searchEvent, setSearchEvent] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [ticketType, setTicketType] = useState("All");
  const [ticketName, setTicketName] = useState("");
  const [editingTicket, setEditingTicket] = useState<string | null>(null);

  const [tickets, setTickets] = useState([
    {
      id: "1",
      name: "General Ticket",
      event: "Tech Conference 2025",
      date: "2025-12-05",
      price: 199.99,
      status: "Sold",
    },
    {
      id: "2",
      name: "VIP Ticket",
      event: "Lahore Music Fest",
      date: "2025-12-10",
      price: 299.99,
      status: "Unsold",
    },
  ]);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme, setTheme, theme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      )
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfileDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Edit state fields
  const [isRefundable, setIsRefundable] = useState(false);
  const [isEarlyBird, setIsEarlyBird] = useState(false);
  const [minOrder, setMinOrder] = useState(1);
  const [maxOrder, setMaxOrder] = useState(5);
  const [enableDiscount, setEnableDiscount] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");

  const handleEditTicket = (id: string) => {
    setEditingTicket(id);
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.event.toLowerCase().includes(searchEvent.toLowerCase()) &&
      (ticketType === "All" || t.name.includes(ticketType)) &&
      (ticketName === "" ||
        t.name.toLowerCase().includes(ticketName.toLowerCase())) &&
      (searchDate === "" || t.date === searchDate)
  );

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

  const [existingCoupons] = useState([
    { code: "SAVE10", discount: 10 },
    { code: "WELCOME15", discount: 15 },
    { code: "VIP20", discount: 20 },
  ]);

  const [showToast, setShowToast] = useState(false);

  const handleSaveChanges = () => {
    setEditingTicket(null);
    // Save logic here (API call or state update)
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // hide after 3s
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full sm:w-[1175px] sm:ml-[250px] bg-white font-sans dark:bg-[#101010]">
      <div className="md:block">
        <Sidebar active="Ticket Manager" />
      </div>

      <div className="flex-1 bg-gray-50 dark:bg-[#101010] w-full">
        {/* ✅ Header visible on tablet/desktop only */}
        <div className="hidden sm:block">
          {/* Desktop Header */}
          <header className="hidden md:flex items-center justify-between px-8 pt-8 pb-4">
            <h1 className="text-[32px] font-semibold tracking-[-0.02em]">
              Ticket Manager
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
                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 rounded-xl z-50 py-2">
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
          </header>
        </div>

        {/* 🔍 Search & Filters */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl mt-18 sm:mt-0 mx-8 p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Search Tickets</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by Event Name"
              value={searchEvent}
              onChange={(e) => setSearchEvent(e.target.value)}
              className="h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
            />

            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
            />

            <select
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
              className="h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
            >
              <option>All</option>
              <option>General</option>
              <option>VIP</option>
            </select>

            <input
              type="text"
              placeholder="Search by Ticket Name"
              value={ticketName}
              onChange={(e) => setTicketName(e.target.value)}
              className="h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
            />
          </div>
        </div>

        {/* 🎟 Ticket Table */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl mx-4 sm:mx-6 md:mx-8 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-all">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Tickets</h2>

          {/* 🖥 Desktop / Tablet Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Event</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                    >
                      <td className="py-3 text-sm">{ticket.name}</td>
                      <td className="py-3 text-sm">{ticket.event}</td>
                      <td className="py-3 text-sm">{ticket.date}</td>
                      <td className="py-3 text-sm">${ticket.price}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.status === "Sold"
                              ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                              : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleEditTicket(ticket.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#D19537] text-white text-sm font-medium hover:bg-[#e4a645]"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 📱 Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-[#101010] shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[15px] font-semibold">{ticket.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-medium ${
                        ticket.status === "Sold"
                          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                          : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-[13px] text-gray-600 dark:text-gray-300">
                    <p>
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        Event:
                      </span>{" "}
                      {ticket.event}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        Date:
                      </span>{" "}
                      {ticket.date}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        Price:
                      </span>{" "}
                      ${ticket.price}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleEditTicket(ticket.id)}
                      className="px-4 py-1.5 rounded-lg bg-[#D19537] text-white text-sm font-medium hover:bg-[#e4a645] transition"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-gray-500 text-sm">
                No tickets found.
              </p>
            )}
          </div>
        </div>

        {/* ✏️ Edit Ticket Section */}
        {editingTicket && (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl mx-4 sm:mx-6 md:mx-8 mt-6 sm:mt-8 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-lg sm:text-xl font-semibold">Edit Ticket</h2>
              <button
                onClick={() => setEditingTicket(null)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Edit Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Refundable */}
              <ToggleRow
                label="Refundable"
                enabled={isRefundable}
                onToggle={() => setIsRefundable(!isRefundable)}
              />

              {/* Early Bird */}
              <ToggleRow
                label="Early Bird Option"
                enabled={isEarlyBird}
                onToggle={() => setIsEarlyBird(!isEarlyBird)}
              />

              {/* Max Orders */}
              <div className="col-span-1 sm:col-span-2">
                <label className="text-sm font-medium mb-2 block">
                  Max Orders Range
                </label>
                <div className="flex flex-col xs:flex-row sm:flex-row sm:items-center gap-3">
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full sm:w-28 h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
                  />
                  <span className="text-gray-500 dark:text-gray-400 text-center sm:text-left">
                    to
                  </span>
                  <input
                    type="number"
                    value={maxOrder}
                    onChange={(e) => setMaxOrder(Number(e.target.value))}
                    className="w-full sm:w-28 h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
                  />
                </div>
              </div>

              {/* Enable Discount */}
              <div className="col-span-1 sm:col-span-2">
                <ToggleRow
                  label="Enable Discount & Coupon"
                  enabled={enableDiscount}
                  onToggle={() => setEnableDiscount(!enableDiscount)}
                />

                {enableDiscount && (
                  <div className="mt-4 space-y-4">
                    {/* Dropdown for existing coupons */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Existing Coupon (optional)
                      </label>
                      <select
                        onChange={(e) => {
                          const selected = existingCoupons.find(
                            (c) => c.code === e.target.value
                          );
                          if (selected) {
                            setCouponCode(selected.code);
                            setDiscountPercent(selected.discount.toString());
                          } else {
                            setCouponCode("");
                            setDiscountPercent("");
                          }
                        }}
                        value={couponCode || ""}
                        className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
                      >
                        <option value="">-- Select Coupon --</option>
                        {existingCoupons.map((coupon) => (
                          <option key={coupon.code} value={coupon.code}>
                            {coupon.code} - {coupon.discount}% Off
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Manual entry for coupon & discount */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Coupon Code
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Coupon Code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="h-10 w-full px-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          placeholder="Enter Discount %"
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(e.target.value)}
                          className="h-10 w-full px-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6 sm:mt-8">
              <button
                onClick={handleSaveChanges}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 rounded-lg bg-[#D19537] text-white text-sm font-semibold hover:bg-[#e4a645] transition"
              >
                Save Changes
              </button>
            </div>
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

        {/* ✅ Toast Notification */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
            <div className="flex items-center gap-3 bg-[#D19537] text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium dark:bg-[#e4a645] transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="white"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Ticket changes saved successfully!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Reusable Toggle Component
function ToggleRow({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010]">
      <span className="text-[14px] font-medium text-gray-800 dark:text-gray-200">
        {label}
      </span>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-[#D19537]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-[20px]" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
