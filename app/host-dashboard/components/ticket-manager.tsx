"use client";

import {
  useState,
  useRef,
  useEffect,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { Sidebar } from "../components/sidebar";
import { MoreVertical, X, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import LogoutModalHost from "@/components/modals/LogoutModalHost";
// import axios from "axios";
import toast from "react-hot-toast";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";
import { apiClient } from "@/lib/apiClient";
import {
  DEFAULT_TICKET_EXPORT_COLUMN_KEYS,
  TICKET_EXPORT_COLUMNS,
  downloadCsvExport,
} from "@/lib/hostDashboardAnalytics";

type TicketManagerProps = {
  eventId?: string;
  eventTitle?: string;
  eventScoped?: boolean;
};

type TenantTicketAction =
  | "Check In"
  | "Transfer"
  | "Cancel / Refund"
  | "Change Ticket Type"
  | "Update Rank"
  | "Assign Agent ID"
  | "View Ticket"
  | "View Receipt"
  | "View History"
  | "Add Note"
  | "Reclaim Ticket"
  | "Force Claim";

type EventTicketCustomer = {
  id: string;
  customerId: string;
  name: string;
  email: string;
  ticketId: string;
  ticketName: string;
  ticketType: string;
  quantity: number;
  status: string;
  rank: string;
  agentId: string;
  registeredAt: string;
  receiptId: string;
};

type EventTicketLocalState = {
  status?: string;
  checkedIn?: boolean;
  ticketType?: string;
  rank?: string;
  agentId?: string;
  notes?: string[];
  history?: string[];
};

const tenantTicketActions: TenantTicketAction[] = [
  "Check In",
  "Transfer",
  "Cancel / Refund",
  "Change Ticket Type",
  "Update Rank",
  "Assign Agent ID",
  "View Ticket",
  "View Receipt",
  "View History",
  "Add Note",
  "Reclaim Ticket",
  "Force Claim",
];

const getTicketEventId = (ticket: any) =>
  String(ticket?.eventId ?? ticket?.event?.id ?? ticket?.event?._id ?? "");

export default function TicketManager({
  eventId,
  eventTitle,
  eventScoped = false,
}: TicketManagerProps = {}) {
  const isEventScoped = Boolean(eventScoped && eventId);
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
  const [eventTicketRows, setEventTicketRows] = useState<EventTicketCustomer[]>(
    []
  );
  const [eventTicketsLoading, setEventTicketsLoading] = useState(false);
  const [eventTicketSearch, setEventTicketSearch] = useState("");
  const [eventTicketStatus, setEventTicketStatus] = useState("All");
  const [eventCustomersPage, setEventCustomersPage] = useState(1);
  const [eventCustomersTotalPages, setEventCustomersTotalPages] = useState(1);
  const [selectedEventTicket, setSelectedEventTicket] =
    useState<EventTicketCustomer | null>(null);
  const [activeTenantAction, setActiveTenantAction] =
    useState<TenantTicketAction | null>(null);
  const [tenantActionFields, setTenantActionFields] = useState({
    transferEmail: "",
    ticketType: "",
    rank: "",
    agentId: "",
    note: "",
  });
  const [eventTicketLocalState, setEventTicketLocalState] = useState<
    Record<string, EventTicketLocalState>
  >({});
  const [eventTicketStateHydrated, setEventTicketStateHydrated] =
    useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme, setTheme, theme } = useTheme();

  // ✅ NEW: allowTransfers feature flag
  const [allowTransfers, setAllowTransfers] = useState<boolean>(false);
  const [allowForceClaim, setAllowForceClaim] = useState<boolean>(false);
  const [allowReclaimTicket, setAllowReclaimTicket] = useState<boolean>(true);

  // ✅ NEW: fetch tenant features (allowTransfers)
  // useEffect(() => {
  //   const fetchFeatures = async () => {
  //     try {
  //       const token = localStorage.getItem("hostToken");
  //       if (!token) return;

  //       const res = await axios.get(`${API_BASE_URL}/tenants/my/features`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "x-tenant-id": HOST_Tenant_ID,
  //         },
  //       });

  //       setAllowTransfers(
  //         Boolean(res.data?.data?.features?.allowTransfers?.enabled)
  //       );
  //     } catch (err) {
  //       console.error("Failed to fetch tenant features:", err);
  //       setAllowTransfers(false);
  //     }
  //   };

  //   fetchFeatures();
  // }, []);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await apiClient.get(`/tenants/my/features`);
        const features = res.data?.data?.features ?? {};
        setAllowTransfers(Boolean(features?.allowTransfers?.enabled));
        setAllowForceClaim(
          Boolean(
            features?.forceClaim?.enabled ||
              features?.forceClaimTickets?.enabled ||
              features?.allowForceClaim?.enabled
          )
        );
        setAllowReclaimTicket(features?.reclaimTickets?.enabled !== false);
      } catch (err) {
        console.error("Failed to fetch tenant features:", err);
        setAllowTransfers(false);
        setAllowForceClaim(false);
        setAllowReclaimTicket(true);
      }
    };

    fetchFeatures();
  }, []);

  // ✅ NEW: if transfers are not allowed, force transferable OFF
  useEffect(() => {
    if (!allowTransfers) {
      setTransferable(false);
      setTicketEditTransferable(false);
    }
  }, [allowTransfers]);

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

  const handleEditTicket = (id: string) => {
    setEditingTicket(id);

    const t = tickets.find((x) => x.id === id);

    if (t) {
      setTicketName(t.name);
      setTicketType(t.type);
      setTicketPrice(Number(t.price));

      // ✅ NEW: only allow editing transferable when feature is enabled
      setTransferable(allowTransfers ? t.isTransferable : false);

      setIsRefundable(t.isRefundable);
      setIsEarlyBird(t.earlyBirdOption);
      setEarlyBirdQuantity(t.earlyBirdQuantity ?? null);
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

  const [showToast, setShowToast] = useState(false);

  const handleSaveChanges = async () => {
    if (!editingTicket) {
      toast.error("No ticket selected!");
      return;
    }

    // const token = localStorage.getItem("hostToken");
    // if (!token) {
    //   toast.error("You are not logged in!");
    //   return;
    // }

    const payload = {
      name: ticketName,
      type: ticketType.toLowerCase(), // "general" | "vip"
      price: ticketPrice.toString(), // backend needs string

      // ✅ NEW: if feature disabled, always force false
      isTransferable: allowTransfers ? transferable : false,

      isRefundable: isRefundable,
      earlyBirdOption: isEarlyBird,
      earlyBirdQuantity: isEarlyBird ? earlyBirdQuantity : null,
      minOrder,
      maxOrder,
    };

    // try {
    //   const response = await axios.put(
    //     `${API_BASE_URL}/tickets/${editingTicket}`,
    //     payload,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "X-Tenant-ID": HOST_Tenant_ID,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    try {
      const response = await apiClient.put(
        `/tickets/${editingTicket}`,
        payload
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
      // const token = localStorage.getItem("hostToken");

      // if (!token) {
      //   toast.error("You are not logged in!");
      //   return;
      // }

      // const response = await axios.get(`${API_BASE_URL}/tickets`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "X-Tenant-ID": HOST_Tenant_ID,
      //   },
      // });
      const response = await apiClient.get(
        isEventScoped ? `/tickets/event/${eventId}` : `/tickets`
      );

      console.log("API Tickets:", response.data);

      // 🟢 Correct extraction of tickets array
      const apiTickets = Array.isArray(response.data?.data?.tickets)
        ? response.data.data.tickets
        : Array.isArray(response.data?.tickets)
          ? response.data.tickets
          : [];

      setTickets(
        isEventScoped
          ? apiTickets.filter((ticket: any) => {
              const ticketEventId = getTicketEventId(ticket);
              return !ticketEventId || ticketEventId === eventId;
            })
          : apiTickets
      );
    } catch (error) {
      console.error("Ticket Fetch Error:", error);
      toast.error("Failed to load tickets!");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [eventId, isEventScoped]);

  const eventProfileStorageKey = eventId
    ? `tenant-event-ticket-state:${eventId}`
    : "";

  useEffect(() => {
    if (!isEventScoped || !eventProfileStorageKey) return;

    setEventTicketStateHydrated(false);
    try {
      const saved = localStorage.getItem(eventProfileStorageKey);
      setEventTicketLocalState(saved ? JSON.parse(saved) : {});
    } catch {
      setEventTicketLocalState({});
    } finally {
      setEventTicketStateHydrated(true);
    }
  }, [eventProfileStorageKey, isEventScoped]);

  useEffect(() => {
    if (!isEventScoped || !eventProfileStorageKey || !eventTicketStateHydrated)
      return;
    localStorage.setItem(
      eventProfileStorageKey,
      JSON.stringify(eventTicketLocalState)
    );
  }, [
    eventProfileStorageKey,
    eventTicketLocalState,
    eventTicketStateHydrated,
    isEventScoped,
  ]);

  const fetchEventTicketRows = async () => {
    if (!eventId) return;

    try {
      setEventTicketsLoading(true);
      const res = await apiClient.get(`/events/${eventId}/customers`, {
        params: { page: eventCustomersPage, limit: ticketsPerPage },
      });

      const customersRaw = res.data?.data?.customers ?? [];
      const totalPages =
        res.data?.data?.pagination?.totalPages ??
        res.data?.pagination?.totalPages ??
        1;

      const normalizedCustomers = customersRaw.map((customer: any) => {
        const ticketId = String(
          customer.ticketId ??
            customer.ticket?.id ??
            customer.ticket?._id ??
            customer.id ??
            ""
        );
        const customerId = String(
          customer.customerId ??
            customer.userId ??
            customer.user?.id ??
            customer.id ??
            ticketId
        );
        const rowId = `${customerId}-${ticketId || "ticket"}`;

        return {
          id: rowId,
          customerId,
          name:
            customer.fullName ??
            customer.name ??
            customer.user?.fullName ??
            "Unknown attendee",
          email: customer.email ?? customer.user?.email ?? "N/A",
          ticketId: ticketId || "N/A",
          ticketName:
            customer.ticketName ??
            customer.ticket?.name ??
            customer.ticketType ??
            "Assigned ticket",
          ticketType:
            customer.ticketType ??
            customer.ticket?.type ??
            customer.type ??
            "General",
          quantity: Number(customer.quantity ?? 1),
          status: customer.status ?? "Registered",
          rank: customer.rank ?? customer.user?.rank ?? "",
          agentId: customer.agentId ?? customer.user?.agentId ?? "",
          registeredAt:
            customer.registeredAt ??
            customer.createdAt ??
            customer.purchaseDate ??
            "",
          receiptId:
            customer.receiptId ??
            customer.orderId ??
            customer.paymentId ??
            customer.invoiceId ??
            "N/A",
        };
      });

      setEventTicketRows(normalizedCustomers);
      setEventCustomersTotalPages(totalPages);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to load event tickets"
      );
      setEventTicketRows([]);
    } finally {
      setEventTicketsLoading(false);
    }
  };

  useEffect(() => {
    if (!isEventScoped) return;
    fetchEventTicketRows();
  }, [eventId, eventCustomersPage, isEventScoped]);

  const getDisplayTicket = (ticket: EventTicketCustomer) => {
    const local = eventTicketLocalState[ticket.id] ?? {};
    return {
      ...ticket,
      status: local.status ?? ticket.status,
      checkedIn: local.checkedIn ?? false,
      ticketType: local.ticketType ?? ticket.ticketType,
      rank: local.rank ?? ticket.rank,
      agentId: local.agentId ?? ticket.agentId,
      notes: local.notes ?? [],
      history: local.history ?? ["Registered"],
    };
  };

  const filteredEventTicketRows = eventTicketRows
    .map(getDisplayTicket)
    .filter((ticket) => {
      const query = eventTicketSearch.trim().toLowerCase();
      const matchesQuery =
        !query ||
        ticket.name.toLowerCase().includes(query) ||
        ticket.email.toLowerCase().includes(query) ||
        ticket.ticketId.toLowerCase().includes(query);
      const matchesStatus =
        eventTicketStatus === "All" ||
        ticket.status.toLowerCase() === eventTicketStatus.toLowerCase();

      return matchesQuery && matchesStatus;
    });

  const openTenantAction = (
    action: TenantTicketAction,
    ticket: EventTicketCustomer
  ) => {
    const displayTicket = getDisplayTicket(ticket);
    setSelectedEventTicket(ticket);
    setActiveTenantAction(action);
    setTenantActionFields({
      transferEmail: "",
      ticketType: displayTicket.ticketType,
      rank: displayTicket.rank,
      agentId: displayTicket.agentId,
      note: "",
    });
  };

  const closeTenantAction = () => {
    setSelectedEventTicket(null);
    setActiveTenantAction(null);
  };

  const appendTicketHistory = (
    current: EventTicketLocalState,
    message: string
  ) => ({
    ...current,
    history: [...(current.history ?? ["Registered"]), message],
  });

  const applyTenantAction = () => {
    if (!selectedEventTicket || !activeTenantAction) return;

    const ticketKey = selectedEventTicket.id;
    const timestamp = new Date().toLocaleString();

    setEventTicketLocalState((current) => {
      const existing = current[ticketKey] ?? {};
      let next = appendTicketHistory(
        existing,
        `${activeTenantAction} updated on ${timestamp}`
      );

      if (activeTenantAction === "Check In") {
        next = { ...next, checkedIn: true, status: "Checked In" };
      }

      if (activeTenantAction === "Transfer") {
        next = {
          ...next,
          status: tenantActionFields.transferEmail
            ? `Transfer pending to ${tenantActionFields.transferEmail}`
            : "Transfer pending",
        };
      }

      if (activeTenantAction === "Cancel / Refund") {
        next = { ...next, status: "Cancelled / Refund pending" };
      }

      if (activeTenantAction === "Change Ticket Type") {
        next = { ...next, ticketType: tenantActionFields.ticketType };
      }

      if (activeTenantAction === "Update Rank") {
        next = { ...next, rank: tenantActionFields.rank };
      }

      if (activeTenantAction === "Assign Agent ID") {
        next = { ...next, agentId: tenantActionFields.agentId };
      }

      if (activeTenantAction === "Add Note") {
        next = {
          ...next,
          notes: tenantActionFields.note
            ? [...(existing.notes ?? []), tenantActionFields.note]
            : existing.notes ?? [],
        };
      }

      if (activeTenantAction === "Reclaim Ticket") {
        next = { ...next, status: "Reclaim requested" };
      }

      if (activeTenantAction === "Force Claim") {
        next = { ...next, status: "Force claimed" };
      }

      return { ...current, [ticketKey]: next };
    });

    toast.success(`${activeTenantAction} saved in the event ticket view`);
    closeTenantAction();
  };

  const selectedDisplayTicket = selectedEventTicket
    ? getDisplayTicket(selectedEventTicket)
    : null;

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
              {isEventScoped ? "Event Tickets" : "Ticket Manager"}
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

          {/* Bottom Divider Line */}
          <div className="border-b border-gray-200 dark:border-gray-800"></div>
        </div>

        {isEventScoped ? (
          <EventScopedTicketOperations
            activeTenantAction={activeTenantAction}
            allowForceClaim={allowForceClaim}
            allowReclaimTicket={allowReclaimTicket}
            closeTenantAction={closeTenantAction}
            eventCustomersPage={eventCustomersPage}
            eventCustomersTotalPages={eventCustomersTotalPages}
            eventId={eventId}
            eventTicketSearch={eventTicketSearch}
            eventTicketStatus={eventTicketStatus}
            eventTicketsLoading={eventTicketsLoading}
            eventTitle={eventTitle}
            filteredEventTicketRows={filteredEventTicketRows}
            openTenantAction={openTenantAction}
            selectedDisplayTicket={selectedDisplayTicket}
            setEventCustomersPage={setEventCustomersPage}
            setEventTicketSearch={setEventTicketSearch}
            setEventTicketStatus={setEventTicketStatus}
            setTenantActionFields={setTenantActionFields}
            tenantActionFields={tenantActionFields}
            tickets={tickets}
            applyTenantAction={applyTenantAction}
          />
        ) : (
          <>

        {/* 🔍 Search & Filters */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl mt-18 sm:mt-6 mx-8 p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Search Tickets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Tickets</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                Export uses the active ticket filters.
              </p>
            </div>
            <TicketExportControls
              rows={filteredTickets}
              filename="ticket-manager-export"
            />
          </div>

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

              {/* ✅ Transferable Toggle (FEATURE CONTROLLED) */}
              {allowTransfers && (
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
              )}
            </div>

            {/* Edit Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Refundable */}
              <ToggleRow
                label="Refundable"
                enabled={isRefundable}
                onToggle={() => setIsRefundable(!isRefundable)}
              />
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

          </>
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

function TicketExportControls({
  rows,
  filename,
  buttonClassName = "",
}: {
  rows: any[];
  filename: string;
  buttonClassName?: string;
}) {
  const [selectedColumnKeys, setSelectedColumnKeys] = useState<string[]>(
    DEFAULT_TICKET_EXPORT_COLUMN_KEYS
  );

  const selectedColumns = TICKET_EXPORT_COLUMNS.filter((column) =>
    selectedColumnKeys.includes(column.key)
  );

  const toggleColumn = (key: string) => {
    setSelectedColumnKeys((current) =>
      current.includes(key)
        ? current.filter((columnKey) => columnKey !== key)
        : [...current, key]
    );
  };

  const handleExport = () => {
    if (!rows.length) {
      toast.error("No ticket data available to export.");
      return;
    }

    if (!selectedColumns.length) {
      toast.error("Select at least one export column.");
      return;
    }

    const safeFilename = `${filename}-${new Date()
      .toISOString()
      .slice(0, 10)}`.replace(/[^a-z0-9-_]/gi, "-");

    downloadCsvExport(rows, selectedColumns, safeFilename);
    toast.success(`Exported ${rows.length} ticket row${rows.length === 1 ? "" : "s"}.`);
  };

  return (
    <div className="relative flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-end">
      <details className="group">
        <summary className="flex h-10 cursor-pointer list-none items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">
          Columns ({selectedColumns.length})
        </summary>
        <div className="absolute right-0 z-40 mt-2 max-h-80 w-72 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-[#1a1a1a]">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() =>
                setSelectedColumnKeys(DEFAULT_TICKET_EXPORT_COLUMN_KEYS)
              }
              className="text-xs font-semibold text-[#D19537]"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={() => setSelectedColumnKeys([])}
              className="text-xs font-semibold text-gray-500"
            >
              Clear
            </button>
          </div>

          <div className="space-y-2">
            {TICKET_EXPORT_COLUMNS.map((column) => (
              <label
                key={column.key}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-200"
              >
                <input
                  type="checkbox"
                  checked={selectedColumnKeys.includes(column.key)}
                  onChange={() => toggleColumn(column.key)}
                  className="h-4 w-4 accent-[#D19537]"
                />
                <span>{column.label}</span>
              </label>
            ))}
          </div>
        </div>
      </details>

      <button
        type="button"
        onClick={handleExport}
        className={`rounded-lg bg-[#D19537] px-4 py-2 text-sm font-semibold text-white ${buttonClassName}`}
      >
        Export CSV
      </button>
    </div>
  );
}

function EventScopedTicketOperations({
  activeTenantAction,
  allowForceClaim,
  allowReclaimTicket,
  applyTenantAction,
  closeTenantAction,
  eventCustomersPage,
  eventCustomersTotalPages,
  eventId,
  eventTicketSearch,
  eventTicketStatus,
  eventTicketsLoading,
  eventTitle,
  filteredEventTicketRows,
  openTenantAction,
  selectedDisplayTicket,
  setEventCustomersPage,
  setEventTicketSearch,
  setEventTicketStatus,
  setTenantActionFields,
  tenantActionFields,
  tickets,
}: {
  activeTenantAction: TenantTicketAction | null;
  allowForceClaim: boolean;
  allowReclaimTicket: boolean;
  applyTenantAction: () => void;
  closeTenantAction: () => void;
  eventCustomersPage: number;
  eventCustomersTotalPages: number;
  eventId?: string;
  eventTicketSearch: string;
  eventTicketStatus: string;
  eventTicketsLoading: boolean;
  eventTitle?: string;
  filteredEventTicketRows: Array<
    EventTicketCustomer & {
      checkedIn: boolean;
      notes: string[];
      history: string[];
    }
  >;
  openTenantAction: (
    action: TenantTicketAction,
    ticket: EventTicketCustomer
  ) => void;
  selectedDisplayTicket:
    | (EventTicketCustomer & {
        checkedIn: boolean;
        notes: string[];
        history: string[];
      })
    | null;
  setEventCustomersPage: Dispatch<SetStateAction<number>>;
  setEventTicketSearch: Dispatch<SetStateAction<string>>;
  setEventTicketStatus: Dispatch<SetStateAction<string>>;
  setTenantActionFields: Dispatch<
    SetStateAction<{
      transferEmail: string;
      ticketType: string;
      rank: string;
      agentId: string;
      note: string;
    }>
  >;
  tenantActionFields: {
    transferEmail: string;
    ticketType: string;
    rank: string;
    agentId: string;
    note: string;
  };
  tickets: any[];
}) {
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [actionMenuPosition, setActionMenuPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const openActionTicket =
    filteredEventTicketRows.find((ticket) => ticket.id === openActionMenuId) ??
    null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setOpenActionMenuId(null);
        setActionMenuPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      setOpenActionMenuId(null);
      setActionMenuPosition(null);
    };

    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  const toggleActionMenu = (
    ticket: EventTicketCustomer,
    button: HTMLButtonElement
  ) => {
    if (openActionMenuId === ticket.id) {
      setOpenActionMenuId(null);
      setActionMenuPosition(null);
      return;
    }

    const rect = button.getBoundingClientRect();
    const menuWidth = 224;
    const menuMaxHeight = 288;
    const left = Math.min(
      window.innerWidth - menuWidth - 12,
      Math.max(12, rect.right - menuWidth)
    );
    const top =
      rect.bottom + 8 + menuMaxHeight > window.innerHeight
        ? Math.max(12, rect.top - menuMaxHeight - 8)
        : rect.bottom + 8;

    setOpenActionMenuId(ticket.id);
    setActionMenuPosition({ left, top });
  };

  return (
    <>
      <div className="mx-4 mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-[#1a1a1a] sm:mx-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <button
              onClick={() => window.history.back()}
              className="mb-3 text-sm font-semibold text-[#D19537]"
            >
              Back to events
            </button>
            <h2 className="text-xl font-semibold">
              {eventTitle || "Selected event"} tickets
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              Event scoped tenant operations only apply to event ID{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {eventId}
              </span>
              .
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-[360px]">
            <div className="rounded-lg bg-[#FAFAFB] p-3 dark:bg-[#101010]">
              <p className="text-gray-500 dark:text-gray-400">Loaded rows</p>
              <p className="mt-1 text-lg font-semibold">
                {filteredEventTicketRows.length}
              </p>
            </div>
            <div className="rounded-lg bg-[#FAFAFB] p-3 dark:bg-[#101010]">
              <p className="text-gray-500 dark:text-gray-400">Ticket types</p>
              <p className="mt-1 text-lg font-semibold">{tickets.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search name, email, or ticket ID"
            value={eventTicketSearch}
            onChange={(e) => setEventTicketSearch(e.target.value)}
            className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none dark:border-gray-700 dark:bg-[#101010]"
          />
          <select
            value={eventTicketStatus}
            onChange={(e) => setEventTicketStatus(e.target.value)}
            className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none dark:border-gray-700 dark:bg-[#101010]"
          >
            <option>All</option>
            <option>Registered</option>
            <option>Checked In</option>
            <option>Cancelled / Refund pending</option>
            <option>Reclaim requested</option>
            <option>Force claimed</option>
          </select>
          <Link href="/ticket-manager">
            <button className="h-11 w-full rounded-lg border border-[#D19537] px-4 text-sm font-semibold text-[#D19537]">
              Open global ticket manager
            </button>
          </Link>
          <TicketExportControls
            rows={filteredEventTicketRows.map((row) => ({
              ...row,
              eventId,
              eventName: eventTitle,
            }))}
            filename={`event-${eventId || "tickets"}-export`}
            buttonClassName="h-11 w-full"
          />
        </div>
      </div>

      <div className="mx-3 mt-6 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-[#1a1a1a] sm:mx-8 sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Event ticket operations</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Tenant-only actions are shown per ticket row.
            </p>
          </div>
          <span className="rounded-full bg-[#D19537]/15 px-3 py-1 text-xs font-semibold text-[#D19537]">
            Event scoped
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm xl:min-w-0">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                <th className="pb-3">Attendee</th>
                <th className="pb-3">Ticket</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Rank</th>
                <th className="pb-3">Agent ID</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventTicketsLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-sm text-gray-500"
                  >
                    Loading event tickets...
                  </td>
                </tr>
              ) : filteredEventTicketRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-sm text-gray-500"
                  >
                    No tickets found for this event.
                  </td>
                </tr>
              ) : (
                filteredEventTicketRows.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-gray-100 align-top dark:border-gray-800"
                  >
                    <td className="py-4 pr-4">
                      <p className="text-sm font-semibold">{ticket.name}</p>
                      <p className="text-xs text-gray-500">{ticket.email}</p>
                    </td>
                    <td className="max-w-[300px] py-4 pr-4 text-sm">
                      <p className="font-medium">{ticket.ticketName}</p>
                      <p className="break-all text-xs text-gray-500">
                        {ticket.ticketId} - {ticket.ticketType}
                      </p>
                    </td>
                    <td className="py-4 pr-4 text-sm">{ticket.quantity}</td>
                    <td className="py-4 pr-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-[#101010] dark:text-gray-200">
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-sm">
                      {ticket.rank || "Not set"}
                    </td>
                    <td className="py-4 pr-4 text-sm">
                      {ticket.agentId || "Not assigned"}
                    </td>
                    <td className="py-4">
                      <div className="inline-flex justify-end">
                        <button
                          aria-label={`Open actions for ${ticket.name}`}
                          onMouseDown={(event) => event.stopPropagation()}
                          onClick={(event) =>
                            toggleActionMenu(ticket, event.currentTarget)
                          }
                          className="inline-flex items-center justify-center p-1 text-gray-600 hover:text-[#D19537] dark:text-gray-200 dark:hover:text-[#D19537]"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {openActionTicket && actionMenuPosition && (
          <div
            ref={actionMenuRef}
            onMouseDown={(event) => event.stopPropagation()}
            style={{
              left: actionMenuPosition.left,
              top: actionMenuPosition.top,
            }}
            className="fixed z-[80] max-h-72 w-56 overflow-y-auto overscroll-contain rounded-lg border border-gray-200 bg-white py-1 shadow-xl dark:border-gray-700 dark:bg-[#1a1a1a]"
          >
            {tenantTicketActions.map((action) => {
              const disabled =
                (action === "Force Claim" && !allowForceClaim) ||
                (action === "Reclaim Ticket" && !allowReclaimTicket);

              return (
                <button
                  key={action}
                  disabled={disabled}
                  onClick={() => {
                    openTenantAction(action, openActionTicket);
                    setOpenActionMenuId(null);
                    setActionMenuPosition(null);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium ${
                    disabled
                      ? "cursor-not-allowed text-gray-400"
                      : "text-gray-700 hover:bg-[#D19537]/10 hover:text-[#D19537] dark:text-white"
                  }`}
                >
                  {action}
                </button>
              );
            })}
          </div>
        )}

        {eventCustomersTotalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              disabled={eventCustomersPage === 1}
              onClick={() => setEventCustomersPage((p) => p - 1)}
              className="rounded-md border px-4 py-2 disabled:opacity-40 dark:border-gray-700"
            >
              Prev
            </button>
            {Array.from({ length: eventCustomersTotalPages }, (_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  onClick={() => setEventCustomersPage(page)}
                  className={`rounded-md border px-4 py-2 ${
                    eventCustomersPage === page
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "dark:border-gray-700 dark:bg-[#181818]"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              disabled={eventCustomersPage === eventCustomersTotalPages}
              onClick={() => setEventCustomersPage((p) => p + 1)}
              className="rounded-md border px-4 py-2 disabled:opacity-40 dark:border-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {activeTenantAction && selectedDisplayTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-[#1a1a1a]">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{activeTenantAction}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  {selectedDisplayTicket.name} - {selectedDisplayTicket.ticketId}
                </p>
              </div>
              <button
                onClick={closeTenantAction}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <InfoField label="Event ID" value={eventId || "N/A"} />
              <InfoField
                label="Receipt ID"
                value={selectedDisplayTicket.receiptId}
              />
              <InfoField
                label="Current status"
                value={selectedDisplayTicket.status}
              />
              <InfoField
                label="Registered"
                value={selectedDisplayTicket.registeredAt || "N/A"}
              />
            </div>

            {activeTenantAction === "Transfer" && (
              <ActionField label="Transfer to email">
                <input
                  type="email"
                  value={tenantActionFields.transferEmail}
                  onChange={(e) =>
                    setTenantActionFields((fields) => ({
                      ...fields,
                      transferEmail: e.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                  placeholder="customer@example.com"
                />
              </ActionField>
            )}

            {activeTenantAction === "Change Ticket Type" && (
              <ActionField label="New ticket type">
                <select
                  value={tenantActionFields.ticketType}
                  onChange={(e) =>
                    setTenantActionFields((fields) => ({
                      ...fields,
                      ticketType: e.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                >
                  {tickets.length > 0 ? (
                    tickets.map((ticket: any) => (
                      <option
                        key={ticket.id ?? ticket.name}
                        value={ticket.type ?? ticket.name}
                      >
                        {ticket.name ?? ticket.type}{" "}
                        {ticket.price ? `- $${ticket.price}` : ""}
                      </option>
                    ))
                  ) : (
                    <option>{selectedDisplayTicket.ticketType}</option>
                  )}
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  Difference charge or refund will be handled by the connected
                  backend flow when available.
                </p>
              </ActionField>
            )}

            {activeTenantAction === "Update Rank" && (
              <ActionField label="Rank">
                <input
                  type="text"
                  value={tenantActionFields.rank}
                  onChange={(e) =>
                    setTenantActionFields((fields) => ({
                      ...fields,
                      rank: e.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                  placeholder="VIP, Gold, Tier 1"
                />
              </ActionField>
            )}

            {activeTenantAction === "Assign Agent ID" && (
              <ActionField label="Agent ID">
                <input
                  type="text"
                  value={tenantActionFields.agentId}
                  onChange={(e) =>
                    setTenantActionFields((fields) => ({
                      ...fields,
                      agentId: e.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                  placeholder="AG-1001"
                />
              </ActionField>
            )}

            {activeTenantAction === "Add Note" && (
              <ActionField label="Internal note">
                <textarea
                  value={tenantActionFields.note}
                  onChange={(e) =>
                    setTenantActionFields((fields) => ({
                      ...fields,
                      note: e.target.value,
                    }))
                  }
                  className="min-h-[110px] w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-[#101010]"
                  placeholder="Add a tenant-only note"
                />
              </ActionField>
            )}

            {activeTenantAction === "View Ticket" && (
              <DetailList
                items={[
                  ["Ticket ID", selectedDisplayTicket.ticketId],
                  ["Ticket Type", selectedDisplayTicket.ticketType],
                  ["Quantity", String(selectedDisplayTicket.quantity)],
                  ["Checked In", selectedDisplayTicket.checkedIn ? "Yes" : "No"],
                ]}
              />
            )}

            {activeTenantAction === "View Receipt" && (
              <DetailList
                items={[
                  ["Receipt ID", selectedDisplayTicket.receiptId],
                  ["Attendee", selectedDisplayTicket.name],
                  ["Email", selectedDisplayTicket.email],
                  ["Event ID", eventId || "N/A"],
                ]}
              />
            )}

            {activeTenantAction === "View History" && (
              <div className="mt-5 rounded-lg border p-4 dark:border-gray-700">
                <h4 className="mb-3 font-semibold">History</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {selectedDisplayTicket.history.map((item, index) => (
                    <p key={`${item}-${index}`}>{item}</p>
                  ))}
                </div>
              </div>
            )}

            {selectedDisplayTicket.notes.length > 0 && (
              <div className="mt-5 rounded-lg border p-4 dark:border-gray-700">
                <h4 className="mb-3 font-semibold">Internal notes</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {selectedDisplayTicket.notes.map((note, index) => (
                    <p key={`${note}-${index}`}>{note}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={closeTenantAction}
                className="rounded-lg border px-5 py-2 text-sm font-semibold dark:border-gray-700"
              >
                Close
              </button>
              {!["View Ticket", "View Receipt", "View History"].includes(
                activeTenantAction
              ) && (
                <button
                  onClick={applyTenantAction}
                  className="rounded-lg bg-[#D19537] px-5 py-2 text-sm font-semibold text-white"
                >
                  Save action
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#FAFAFB] p-3 dark:bg-[#101010]">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 break-words font-semibold">{value}</p>
    </div>
  );
}

function ActionField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="mt-5">
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      {children}
    </div>
  );
}

function DetailList({ items }: { items: string[][] }) {
  return (
    <div className="mt-5 rounded-lg border p-4 dark:border-gray-700">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <InfoField key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Sidebar } from "../components/sidebar";
// import { X, LogOut, Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";
// import Link from "next/link";
// import LogoutModalHost from "@/components/modals/LogoutModalHost";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// export default function TicketManager() {
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);

//   const [searchEvent, setSearchEvent] = useState("");
//   const [searchDate, setSearchDate] = useState("");
//   const [ticketType, setTicketType] = useState("All");
//   const [ticketName, setTicketName] = useState("");
//   const [editingTicket, setEditingTicket] = useState<string | null>(null);

//   // -----------------------------
//   // EDITABLE Ticket Fields
//   // -----------------------------

//   const [ticketEditName, setTicketEditName] = useState("");
//   const [ticketEditType, setTicketEditType] = useState("General");
//   const [ticketEditPrice, setTicketEditPrice] = useState(0);
//   const [ticketEditTransferable, setTicketEditTransferable] = useState(false);

//   // Ticket Price (number)
//   const [ticketPrice, setTicketPrice] = useState(0);

//   // Transferable (boolean)
//   const [transferable, setTransferable] = useState(false);

//   const [tickets, setTickets] = useState<any[]>([]);

//   const notificationsRef = useRef<HTMLDivElement>(null);
//   const profileRef = useRef<HTMLDivElement>(null);
//   const { resolvedTheme, setTheme, theme } = useTheme();

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         notificationsRef.current &&
//         !notificationsRef.current.contains(e.target as Node)
//       )
//         setShowNotifications(false);
//       if (profileRef.current && !profileRef.current.contains(e.target as Node))
//         setShowProfileDropdown(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ✅ Edit state fields
//   const [isRefundable, setIsRefundable] = useState(false);
//   const [isEarlyBird, setIsEarlyBird] = useState(false);
//   const [minOrder, setMinOrder] = useState(1);
//   const [maxOrder, setMaxOrder] = useState(5);

//   const handleEditTicket = (id: string) => {
//     setEditingTicket(id);

//     const t = tickets.find((x) => x.id === id);

//     if (t) {
//       setTicketName(t.name);
//       setTicketType(t.type);
//       setTicketPrice(Number(t.price));
//       setTransferable(t.isTransferable);
//       setIsRefundable(t.isRefundable);
//       setIsEarlyBird(t.earlyBirdOption);
//       setEarlyBirdQuantity(t.earlyBirdQuantity ?? null);
//     }
//   };

//   const filteredTickets = Array.isArray(tickets)
//     ? tickets.filter((t) => {
//         const matchesEvent =
//           searchEvent.trim() === "" ||
//           t.event?.id?.toLowerCase().includes(searchEvent.toLowerCase());

//         const matchesType =
//           ticketType === "All" ||
//           t.type?.toLowerCase() === ticketType.toLowerCase();

//         const matchesName =
//           ticketName.trim() === "" ||
//           t.name?.toLowerCase().includes(ticketName.toLowerCase());

//         const matchesDate =
//           searchDate.trim() === "" ||
//           (t.dateTime && t.dateTime.startsWith(searchDate));

//         return matchesEvent && matchesType && matchesName && matchesDate;
//       })
//     : [];

//   // Dummy notifications
//   const notifications = [
//     { id: 1, message: "Your event 'Tech Summit' was approved!" },
//     { id: 2, message: "You sold 3 tickets for 'Lahore Music Fest'." },
//     { id: 3, message: "New user message received." },
//   ];

//   // Click outside handler
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         notificationsRef.current &&
//         !notificationsRef.current.contains(e.target as Node)
//       ) {
//         setShowNotifications(false);
//       }
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(e.target as Node)
//       ) {
//         setShowProfileDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const [showToast, setShowToast] = useState(false);

//   const handleSaveChanges = async () => {
//     if (!editingTicket) {
//       toast.error("No ticket selected!");
//       return;
//     }

//     const token = localStorage.getItem("hostToken");
//     if (!token) {
//       toast.error("You are not logged in!");
//       return;
//     }

//     const payload = {
//       name: ticketName,
//       type: ticketType.toLowerCase(), // "general" | "vip"
//       price: ticketPrice.toString(), // backend needs string
//       isTransferable: transferable,
//       isRefundable: isRefundable,
//       earlyBirdOption: isEarlyBird,
//       earlyBirdQuantity: isEarlyBird ? earlyBirdQuantity : null,
//       minOrder,
//       maxOrder,
//     };

//     try {
//       const response = await axios.put(
//         `${API_BASE_URL}/tickets/${editingTicket}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Tenant-ID": HOST_Tenant_ID,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("UPDATE SUCCESS", response.data);

//       toast.success("Ticket updated successfully!", {
//         position: "bottom-right",
//       });

//       // Refresh updated tickets
//       await fetchTickets();

//       // Close modal
//       setEditingTicket(null);
//     } catch (error: any) {
//       console.error("Ticket update error:", error);
//       toast.error(error?.response?.data?.message || "Failed to update ticket", {
//         position: "bottom-right",
//       });
//     }
//   };

//   const [earlyBirdQuantity, setEarlyBirdQuantity] = useState<number | null>(
//     null
//   );

//   const [hostName, setHostName] = useState("Host");

//   useEffect(() => {
//     const savedUser = localStorage.getItem("hostUser");

//     if (savedUser) {
//       const user = JSON.parse(savedUser);

//       // Host Name
//       setHostName(user.userName || user.fullName || "Host");

//       // Subdomain (optional)
//       // setHostSubdomain(user.subDomain || "");

//       console.log("HOST DASHBOARD USER:", user);
//       console.log("HOST SUBDOMAIN:", user?.subDomain);

//       // Theme (optional)
//       if (user.theme) {
//         // syncThemeWithBackend(user);
//       }
//     } else {
//       // Force redirect if no host session found
//       window.location.href = "/sign-in-host";
//     }
//   }, []);

//   const [currentPage, setCurrentPage] = useState(1);
//   const ticketsPerPage = 5;

//   // Calculate slice indices
//   const indexOfLast = currentPage * ticketsPerPage;
//   const indexOfFirst = indexOfLast - ticketsPerPage;

//   // Tickets for current page
//   const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);

//   // Total number of pages
//   const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

//   // 🔥 Fetch Tickets From API
//   const fetchTickets = async () => {
//     try {
//       const token = localStorage.getItem("hostToken");

//       if (!token) {
//         toast.error("You are not logged in!");
//         return;
//       }

//       const response = await axios.get(`${API_BASE_URL}/tickets`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-Tenant-ID": HOST_Tenant_ID,
//         },
//       });

//       console.log("API Tickets:", response.data);

//       // 🟢 Correct extraction of tickets array
//       const apiTickets = Array.isArray(response.data?.data?.tickets)
//         ? response.data.data.tickets
//         : [];

//       setTickets(apiTickets);

//     } catch (error) {
//       console.error("Ticket Fetch Error:", error);
//       toast.error("Failed to load tickets!");
//     }
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen w-full sm:w-[1175px] sm:ml-[250px] bg-white font-sans dark:bg-[#101010]">
//       <div className="md:block">
//         <Sidebar active="Ticket Manager" />
//       </div>

//       <div className="flex-1 bg-gray-50 dark:bg-[#101010] w-full">
//         {/* ✅ Header visible on tablet/desktop only */}
//         <div className="hidden sm:block">
//           {/* Desktop Header */}
//           <header className="hidden md:flex items-center justify-between px-8 pt-8 pb-4">
//             <h1 className="text-[32px] font-semibold tracking-[-0.02em]">
//               Ticket Manager
//             </h1>
//             {/* Right section */}
//             <div className="flex flex-col items-end gap-3">
//               <div className="flex items-center gap-4 relative">
//                 {/* Light/Dark toggle */}
//                 {/* <Button
//                   onClick={() =>
//                     setTheme(resolvedTheme === "light" ? "dark" : "light")
//                   }
//                   variant="ghost"
//                   size="sm"
//                   className="hidden lg:flex text-gray-600 dark:text-gray-300 gap-2 hover:text-[#0077F7]"
//                 >
//                   {theme === "light" ? (
//                     <>
//                       <Moon className="h-4 w-4" /> Dark Mode
//                     </>
//                   ) : (
//                     <>
//                       <Sun className="h-4 w-4" /> Light Mode
//                     </>
//                   )}
//                 </Button> */}

//                 {/* Mobile toggle */}
//                 {/* <button
//                   onClick={() =>
//                     setTheme(resolvedTheme === "light" ? "dark" : "light")
//                   }
//                   className="lg:hidden p-1 text-gray-700 dark:text-gray-300 hover:text-[#0077F7] flex-shrink-0"
//                 >
//                   {theme === "light" ? (
//                     <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
//                   ) : (
//                     <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
//                   )}
//                 </button> */}
//                 {/* Notification icon */}
//                 <div ref={notificationsRef} className="relative">
//                   <button
//                     onClick={() => {
//                       setShowNotifications(!showNotifications);
//                       setShowProfileDropdown(false);
//                     }}
//                     className="bg-black dark:bg-black border h-9 w-9 flex justify-center items-center rounded-full relative hover:opacity-90"
//                   >
//                     <img
//                       src="/icons/Vector.png"
//                       alt="notification"
//                       className="h-4 w-4"
//                     />
//                     {/* Counter badge */}
//                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
//                       {notifications.length}
//                     </span>
//                   </button>

//                   {/* Notification popup */}
//                   {showNotifications && (
//                     <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 rounded-xl z-50 p-3">
//                       <h4 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
//                         Notifications
//                       </h4>
//                       <div className="space-y-2 max-h-64 overflow-y-auto">
//                         {notifications.length > 0 ? (
//                           notifications.map((n) => (
//                             <div
//                               key={n.id}
//                               className="text-sm bg-gray-50 dark:bg-[#1f1e1e] rounded-lg p-2 hover:bg-gray-100 transition"
//                             >
//                               {n.message}
//                             </div>
//                           ))
//                         ) : (
//                           <p className="text-sm text-gray-500 text-center py-4">
//                             No new notifications
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Profile Name + Icon + Dropdown */}
//                 <div
//                   className="relative flex items-center gap-2"
//                   ref={profileRef}
//                 >
//                   {/* Host Name */}
//                   <span className="hidden sm:block font-semibold text-black dark:text-white">
//                     {hostName}
//                   </span>

//                   {/* Profile Icon Wrapper */}
//                   <div className="relative">
//                     <button
//                       onClick={() => {
//                         setShowProfileDropdown(!showProfileDropdown);
//                         setShowNotifications(false);
//                       }}
//                       className="bg-black border h-9 w-9 flex justify-center items-center rounded-full hover:opacity-90"
//                     >
//                       <img
//                         src="/images/icons/profile-user.png"
//                         alt="profile"
//                         className="h-4 w-4"
//                       />
//                     </button>

//                     {/* Dropdown */}
//                     {showProfileDropdown && (
//                       <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl z-50 py-2">
//                         <Link href="/my-events">
//                           <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
//                             My Events
//                           </button>
//                         </Link>

//                         <Link href="/ticket-manager">
//                           <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
//                             Ticket Manager
//                           </button>
//                         </Link>

//                         <Link href="/host-payments">
//                           <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
//                             Payments
//                           </button>
//                         </Link>

//                         <Link href="/host-settings">
//                           <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
//                             System Settings
//                           </button>
//                         </Link>

//                         <button
//                           onClick={() => setShowLogoutModal(true)}
//                           className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg"
//                         >
//                           Logout
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </header>

//           {/* Bottom Divider Line */}
//         <div className="border-b border-gray-200 dark:border-gray-800"></div>
//         </div>

//         {/* 🔍 Search & Filters */}
//         <div className="bg-white dark:bg-[#1a1a1a] rounded-xl mt-18 sm:mt-6 mx-8 p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
//           <h2 className="text-lg font-semibold mb-4">Search Tickets</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* <input
//               type="text"
//               placeholder="Search by Event Name"
//               value={searchEvent}
//               onChange={(e) => setSearchEvent(e.target.value)}
//               className="h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
//             />

//             <input
//               type="date"
//               value={searchDate}
//               onChange={(e) => setSearchDate(e.target.value)}
//               className="h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
//             /> */}

//             <select
//               value={ticketType}
//               onChange={(e) => setTicketType(e.target.value)}
//               className="h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
//             >
//               <option>All</option>
//               <option>General</option>
//               <option>VIP</option>
//             </select>

//             <input
//               type="text"
//               placeholder="Search by Ticket Name"
//               value={ticketName}
//               onChange={(e) => setTicketName(e.target.value)}
//               className="h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#101010] text-sm outline-none"
//             />
//           </div>
//         </div>

//         {/* 🎟 Ticket Table */}
//         <div className="bg-white dark:bg-[#1a1a1a] rounded-xl mx-4 sm:mx-6 md:mx-8 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-all">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">Tickets</h2>

//           {/* 🖥 Desktop / Tablet Table View */}
//           <div className="hidden sm:block overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
//                   <th className="pb-3">Ticket Name</th>
//                   <th className="pb-3">Type</th>
//                   <th className="pb-3">Event</th>
//                   <th className="pb-3">Date & Time</th>
//                   <th className="pb-3">Price</th>
//                   <th className="pb-3">Transfer Status</th>

//                   <th className="pb-3 text-right">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentTickets.length > 0 ? (
//                   currentTickets.map((ticket) => (
//                     <tr
//                       key={ticket.id}
//                       className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
//                     >
//                       {/* Ticket Name */}
//                       <td className="py-3 text-sm font-semibold">
//                         {ticket.name}
//                       </td>

//                       {/* Ticket Type */}
//                       <td className="py-3 text-sm">
//                         <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D19537]/15 text-[#D19537]">
//                           {ticket.type}
//                         </span>
//                       </td>

//                       {/* Event Name */}
//                       <td className="py-3 text-sm">{ticket.eventName}</td>

//                       {/* Date & Time */}
//                       <td className="py-3 text-sm">
//                         {ticket.dateTime || "N/A"}
//                       </td>

//                       {/* Price */}
//                       <td className="py-3 text-sm">${ticket.price}</td>

//                       {/* Transferable Status */}
//                       <td className="py-3 text-sm">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                             ticket.isTransferable
//                               ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
//                               : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
//                           }`}
//                         >
//                           {ticket.isTransferable
//                             ? "Transferable"
//                             : "Untransferable"}
//                         </span>
//                       </td>

//                       {/* Action */}
//                       <td className="py-3 text-right">
//                         <button
//                           onClick={() => handleEditTicket(ticket.id)}
//                           className="px-4 py-1.5 rounded-lg bg-[#D19537] text-white text-sm font-medium hover:bg-[#e4a645]"
//                         >
//                           Edit
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={7} className="text-center py-6 text-gray-500">
//                       No tickets found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* 📱 Mobile Card View */}
//           <div className="sm:hidden space-y-4">
//             {currentTickets.length > 0 ? (
//               currentTickets.map((ticket) => (
//                 <div
//                   key={ticket.id}
//                   className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-[#101010] shadow-sm"
//                 >
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="text-[15px] font-semibold">{ticket.name}</h3>

//                     <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-[#D19537]/15 text-[#D19537]">
//                       {ticket.type}
//                     </span>
//                   </div>

//                   {/* Details */}
//                   <div className="space-y-1 text-[13px] text-gray-600 dark:text-gray-300">
//                     <p>
//                       <span className="font-medium">Event:</span>{" "}
//                       {ticket.event?.id}
//                     </p>

//                     <p>
//                       <span className="font-medium">Date & Time:</span>{" "}
//                       {ticket.dateTime || "N/A"}
//                     </p>

//                     <p>
//                       <span className="font-medium">Price:</span> $
//                       {ticket.price}
//                     </p>

//                     <p>
//                       <span className="font-medium">Status:</span>{" "}
//                       {ticket.isTransferable ? (
//                         <span className="text-green-600 font-semibold">
//                           Transferable
//                         </span>
//                       ) : (
//                         <span className="text-red-500 font-semibold">
//                           Untransferable
//                         </span>
//                       )}
//                     </p>
//                   </div>

//                   <div className="mt-3 flex justify-end">
//                     <button
//                       onClick={() => handleEditTicket(ticket.id)}
//                       className="px-4 py-1.5 rounded-lg bg-[#D19537] text-white text-sm font-medium hover:bg-[#e4a645]"
//                     >
//                       Edit
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center py-6 text-gray-500 text-sm">
//                 No tickets found.
//               </p>
//             )}
//           </div>
//         </div>

//         {totalPages > 1 && (
//           <div className="flex justify-center gap-2 mt-6">
//             {/* Prev */}
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
//             >
//               Prev
//             </button>

//             {/* Page Numbers */}
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-4 py-2 border rounded-md ${
//                   currentPage === i + 1
//                     ? "bg-black text-white dark:bg-white dark:text-black"
//                     : "dark:border-gray-700 dark:bg-[#181818]"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             {/* Next */}
//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {/* ✏️ Edit Ticket Section */}
//         {editingTicket && (
//           <div className="bg-white dark:bg-[#1a1a1a] rounded-xl mx-4 sm:mx-6 md:mx-8 mt-6 sm:mt-8 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-all">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
//               <h2 className="text-lg sm:text-xl font-semibold">Edit Ticket</h2>
//               <button
//                 onClick={() => setEditingTicket(null)}
//                 className="text-gray-500 hover:text-red-500 transition"
//               >
//                 <X className="h-5 w-5 sm:h-6 sm:w-6" />
//               </button>
//             </div>

//             {/* ----------------------------- */}
//             {/* ROW 1: Ticket Name + Ticket Type */}
//             {/* ----------------------------- */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//               {/* Ticket Name */}
//               <div>
//                 <label className="text-sm font-medium mb-1 block">
//                   Ticket Name
//                 </label>
//                 <input
//                   type="text"
//                   className="h-10 w-full px-3 rounded-lg border dark:border-gray-700 dark:bg-[#101010]"
//                   value={ticketName}
//                   onChange={(e) => setTicketName(e.target.value)}
//                 />
//               </div>

//               {/* Ticket Type */}
//               <div>
//                 <label className="text-sm font-medium mb-1 block">
//                   Ticket Type
//                 </label>
//                 <select
//                   className="h-10 w-full px-3 rounded-lg border dark:border-gray-700 dark:bg-[#101010]"
//                   value={ticketType}
//                   onChange={(e) => setTicketType(e.target.value)}
//                 >
//                   <option value="General">General</option>
//                   <option value="VIP">VIP</option>
//                 </select>
//               </div>
//             </div>

//             {/* ----------------------------- */}
//             {/* ROW 2: Price + Transferable Toggle */}
//             {/* ----------------------------- */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//               {/* Ticket Price */}
//               <div>
//                 <label className="text-sm font-medium mb-1 block">
//                   Ticket Price
//                 </label>
//                 <input
//                   type="number"
//                   className="h-10 w-full px-3 rounded-lg border dark:border-gray-700 dark:bg-[#101010]"
//                   value={ticketPrice}
//                   onChange={(e) => setTicketPrice(Number(e.target.value))}
//                 />
//               </div>

//               {/* Transferable Toggle */}
//               <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010]">
//                 <span className="text-[14px] font-medium text-gray-800 dark:text-gray-200">
//                   Transferable Ticket
//                 </span>

//                 <button
//                   onClick={() => setTransferable(!transferable)}
//                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                     transferable ? "bg-[#D19537]" : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white transition-transform ${
//                       transferable ? "translate-x-[20px]" : "translate-x-0"
//                     }`}
//                   />
//                 </button>
//               </div>
//             </div>

//             {/* Edit Fields Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//               {/* Refundable */}
//               <ToggleRow
//                 label="Refundable"
//                 enabled={isRefundable}
//                 onToggle={() => setIsRefundable(!isRefundable)}
//               />
//             </div>

//             {/* Save Button */}
//             <div className="flex justify-end mt-6 sm:mt-8">
//               <button
//                 onClick={handleSaveChanges}
//                 className="w-full sm:w-auto px-6 sm:px-8 py-2.5 rounded-lg bg-[#D19537] text-white text-sm font-semibold hover:bg-[#e4a645] transition"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Logout Modal */}
//         <LogoutModalHost
//           isOpen={showLogoutModal}
//           onClose={() => setShowLogoutModal(false)}
//           onLogout={() => {
//             localStorage.clear();
//             window.location.href = "/sign-in-host";
//           }}
//         />

//         {/* ✅ Toast Notification */}
//         {/* {showToast && (
//           <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
//             <div className="flex items-center gap-3 bg-[#D19537] text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium dark:bg-[#e4a645] transition-all">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={2}
//                 stroke="white"
//                 className="w-5 h-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//               <span>Ticket changes saved successfully!</span>
//             </div>
//           </div>
//         )} */}
//       </div>
//     </div>
//   );
// }

// // ✅ Reusable Toggle Component
// function ToggleRow({
//   label,
//   enabled,
//   onToggle,
// }: {
//   label: string;
//   enabled: boolean;
//   onToggle: () => void;
// }) {
//   return (
//     <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 bg-[#FAFAFB] dark:bg-[#101010]">
//       <span className="text-[14px] font-medium text-gray-800 dark:text-gray-200">
//         {label}
//       </span>
//       <button
//         onClick={onToggle}
//         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//           enabled ? "bg-[#D19537]" : "bg-gray-300"
//         }`}
//       >
//         <span
//           className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white transition-transform ${
//             enabled ? "translate-x-[20px]" : "translate-x-0"
//           }`}
//         />
//       </button>
//     </div>
//   );
// }
