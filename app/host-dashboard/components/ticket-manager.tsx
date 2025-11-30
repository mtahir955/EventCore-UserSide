"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../components/sidebar";
import { X, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import LogoutModalHost from "@/components/modals/LogoutModalHost";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

export default function TicketManager() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const [searchEvent, setSearchEvent] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [ticketType, setTicketType] = useState("All");
  const [ticketName, setTicketName] = useState("");
  const [editingTicket, setEditingTicket] = useState<string | null>(null);

  // -----------------------------
  // EDITABLE Ticket Fields
  // -----------------------------

  const [ticketEditName, setTicketEditName] = useState("");
  const [ticketEditType, setTicketEditType] = useState("General");
  const [ticketEditPrice, setTicketEditPrice] = useState(0);
  const [ticketEditTransferable, setTicketEditTransferable] = useState(false);

  // Ticket Price (number)
  const [ticketPrice, setTicketPrice] = useState(0);

  // Transferable (boolean)
  const [transferable, setTransferable] = useState(false);

  const [tickets, setTickets] = useState<any[]>([]);

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

    const t = tickets.find((x) => x.id === id);

    if (t) {
      setTicketName(t.name);
      setTicketType(t.type);
      setTicketPrice(Number(t.price));
      setTransferable(t.isTransferable);
      setIsRefundable(t.isRefundable);
      setIsEarlyBird(t.earlyBirdOption);
      setEarlyBirdQuantity(t.earlyBirdQuantity ?? null);

      setEnableDiscount(!!t.discount);
      setDiscountPercent(t.discount?.toString() || "");
      setCouponCode(t.couponCode || "");
    }
  };

  const filteredTickets = Array.isArray(tickets)
    ? tickets.filter((t) => {
        const matchesEvent =
          searchEvent.trim() === "" ||
          t.event?.id?.toLowerCase().includes(searchEvent.toLowerCase());

        const matchesType =
          ticketType === "All" ||
          t.type?.toLowerCase() === ticketType.toLowerCase();

        const matchesName =
          ticketName.trim() === "" ||
          t.name?.toLowerCase().includes(ticketName.toLowerCase());

        const matchesDate =
          searchDate.trim() === "" ||
          (t.dateTime && t.dateTime.startsWith(searchDate));

        return matchesEvent && matchesType && matchesName && matchesDate;
      })
    : [];

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

  const handleSaveChanges = async () => {
    if (!editingTicket) {
      toast.error("No ticket selected!");
      return;
    }

    const token = localStorage.getItem("hostToken");
    if (!token) {
      toast.error("You are not logged in!");
      return;
    }

    const payload = {
      name: ticketName,
      type: ticketType.toLowerCase(), // "general" | "vip"
      price: ticketPrice.toString(), // backend needs string
      isTransferable: transferable,
      isRefundable: isRefundable,
      earlyBirdOption: isEarlyBird,
      earlyBirdQuantity: isEarlyBird ? earlyBirdQuantity : null,
      couponCode: enableDiscount ? couponCode : null,
      discount: enableDiscount ? discountPercent : null,
      minOrder,
      maxOrder,
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/tickets/${editingTicket}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("UPDATE SUCCESS", response.data);

      toast.success("Ticket updated successfully!", {
        position: "bottom-right",
      });

      // Refresh updated tickets
      await fetchTickets();

      // Close modal
      setEditingTicket(null);
    } catch (error: any) {
      console.error("Ticket update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update ticket", {
        position: "bottom-right",
      });
    }
  };

  const [earlyBirdQuantity, setEarlyBirdQuantity] = useState<number | null>(
    null
  );

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
  const ticketsPerPage = 5;

  // Calculate slice indices
  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;

  // Tickets for current page
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);

  // Total number of pages
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  // 🔥 Fetch Tickets From API
  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("hostToken");

      if (!token) {
        toast.error("You are not logged in!");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": HOST_Tenant_ID,
        },
      });

      console.log("API Tickets:", response.data);

      // 🟢 Correct extraction of tickets array
      const apiTickets = Array.isArray(response.data?.data?.tickets)
        ? response.data.data.tickets
        : [];

      setTickets(apiTickets);
    } catch (error) {
      console.error("Ticket Fetch Error:", error);
      toast.error("Failed to load tickets!");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

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
                  <th className="pb-3">Ticket Name</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Event</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Transfer Status</th>

                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentTickets.length > 0 ? (
                  currentTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                    >
                      {/* Ticket Name */}
                      <td className="py-3 text-sm font-semibold">
                        {ticket.name}
                      </td>

                      {/* Ticket Type */}
                      <td className="py-3 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D19537]/15 text-[#D19537]">
                          {ticket.type}
                        </span>
                      </td>

                      {/* Event Name */}
                      <td className="py-3 text-sm">{ticket.eventName}</td>

                      {/* Date & Time */}
                      <td className="py-3 text-sm">
                        {ticket.dateTime || "N/A"}
                      </td>

                      {/* Price */}
                      <td className="py-3 text-sm">${ticket.price}</td>

                      {/* Transferable Status */}
                      <td className="py-3 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ticket.isTransferable
                              ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                              : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                          }`}
                        >
                          {ticket.isTransferable
                            ? "Transferable"
                            : "Untransferable"}
                        </span>
                      </td>

                      {/* Action */}
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
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 📱 Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {currentTickets.length > 0 ? (
              currentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-[#101010] shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[15px] font-semibold">{ticket.name}</h3>

                    <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-[#D19537]/15 text-[#D19537]">
                      {ticket.type}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1 text-[13px] text-gray-600 dark:text-gray-300">
                    <p>
                      <span className="font-medium">Event:</span>{" "}
                      {ticket.event?.id}
                    </p>

                    <p>
                      <span className="font-medium">Date & Time:</span>{" "}
                      {ticket.dateTime || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium">Price:</span> $
                      {ticket.price}
                    </p>

                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {ticket.isTransferable ? (
                        <span className="text-green-600 font-semibold">
                          Transferable
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Untransferable
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleEditTicket(ticket.id)}
                      className="px-4 py-1.5 rounded-lg bg-[#D19537] text-white text-sm font-medium hover:bg-[#e4a645]"
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

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {/* Prev */}
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

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
            >
              Next
            </button>
          </div>
        )}

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

            {/* ----------------------------- */}
            {/* ROW 1: Ticket Name + Ticket Type */}
            {/* ----------------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Ticket Name */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Ticket Name
                </label>
                <input
                  type="text"
                  className="h-10 w-full px-3 rounded-lg border dark:border-gray-700 dark:bg-[#101010]"
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                />
              </div>

              {/* Ticket Type */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Ticket Type
                </label>
                <select
                  className="h-10 w-full px-3 rounded-lg border dark:border-gray-700 dark:bg-[#101010]"
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                >
                  <option value="General">General</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>

            {/* ----------------------------- */}
            {/* ROW 2: Price + Transferable Toggle */}
            {/* ----------------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Ticket Price */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Ticket Price
                </label>
                <input
                  type="number"
                  className="h-10 w-full px-3 rounded-lg border dark:border-gray-700 dark:bg-[#101010]"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(Number(e.target.value))}
                />
              </div>

              {/* Transferable Toggle */}
              <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010]">
                <span className="text-[14px] font-medium text-gray-800 dark:text-gray-200">
                  Transferable Ticket
                </span>

                <button
                  onClick={() => setTransferable(!transferable)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    transferable ? "bg-[#D19537]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white transition-transform ${
                      transferable ? "translate-x-[20px]" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
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
                onToggle={() => {
                  setIsEarlyBird(!isEarlyBird);
                  setEarlyBirdQuantity(!isEarlyBird ? 0 : null); // default 10 when ON
                }}
              />

              {isEarlyBird && (
                <div className="col-span-1 sm:col-span-2">
                  <label className="text-sm font-medium mb-2 block">
                    Early Bird Quantity (Limited Seats)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={earlyBirdQuantity ?? ""}
                    onChange={(e) =>
                      setEarlyBirdQuantity(Number(e.target.value))
                    }
                    placeholder="Enter Early Bird Quantity"
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
                  />
                </div>
              )}

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
        <LogoutModalHost
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onLogout={() => {
            localStorage.clear();
            window.location.href = "/sign-in-host";
          }}
        />

        {/* ✅ Toast Notification */}
        {/* {showToast && (
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
        )} */}
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
