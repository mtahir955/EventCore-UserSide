"use client";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { Sidebar } from "../components/sidebar";
import StaffSidebar from "@/app/staff-dashboard/components/sidebar";
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
  DEFAULT_TIMEFRAME_PRESET,
  DEFAULT_TICKET_EXPORT_COLUMN_KEYS,
  TICKET_EXPORT_COLUMNS,
  createTimeframe,
  downloadCsvExport,
  getTimeframeParams,
} from "@/lib/hostDashboardAnalytics";
import {
  formatSalesDateTime,
  normalizeCommerceTicket,
} from "@/lib/event-commerce";

type TicketManagerProps = {
  eventId?: string;
  eventTitle?: string;
  eventScoped?: boolean;
  dashboardMode?: "host" | "staff";
};

type TenantTicketAction =
  | "Check In"
  | "Uncheck"
  | "Transfer"
  | "Cancel / Refund"
  | "Change Ticket Type"
  | "Update Rank"
  | "Assign Agent ID"
  | "View Ticket"
  | "View Receipt"
  | "View History"
  | "Add Note"
  | "Edit Note"
  | "Reclaim Ticket"
  | "Force Reclaim";

type EventTicketCustomer = {
  [key: string]: any;
  id: string;
  ticketPurchaseId: string;
  customerId: string;
  name: string;
  email: string;
  ticketId: string;
  ticketTypeId: string;
  ticketName: string;
  ticketType: string;
  quantity: number;
  status: string;
  checkedIn: boolean;
  rank: string;
  agentId: string;
  registeredAt: string;
  receiptId: string;
  orderId: string;
  notesCount: number;
  lastHistoryStatus: string;
  wasReclaimed?: boolean;
  permissions: {
    canCheckIn?: boolean;
    canUncheck?: boolean;
    canViewTicket?: boolean;
    canViewReceipt?: boolean;
    canViewHistory?: boolean;
    canTransfer?: boolean;
    canCancelRefund?: boolean;
    canChangeTicketType?: boolean;
    canUpdateRank?: boolean;
    canAssignAgentId?: boolean;
    canAddNote?: boolean;
    canReclaim?: boolean;
    canForceClaim?: boolean;
  };
};

type TicketHistoryItem = {
  id: string;
  label: string;
  description: string;
  ticketId: string;
  eventId: string;
  orderId: string;
  actionType: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  reason: string;
  performedByUserId: string;
  performedBy: string;
  performedByRole: string;
  performedAt: string;
  source: string;
  createdAt: string;
};

type TicketNote = {
  noteId: string;
  note: string;
  visibility: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
};

type TenantActionDetails = {
  ticket: Record<string, any> | null;
  receipt: Record<string, any> | null;
  history: TicketHistoryItem[];
  notes: TicketNote[];
};

type TenantActionFields = {
  transferEmail: string;
  ticketType: string;
  rank: string;
  agentId: string;
  note: string;
  reason: string;
  refundType: string;
  refundAmount: string;
  notifyCustomer: boolean;
  notifyRecipient: boolean;
  adjustmentMode: string;
  paymentMethodId: string;
  claimForCustomerId: string;
  editNoteId: string;
  uncheckByRole: string;
  uncheckAt: string;
};

const tenantTicketActions: TenantTicketAction[] = [
  "Check In",
  "Uncheck",
  "Transfer",
  "Cancel / Refund",
  "Change Ticket Type",
  "Update Rank",
  "Assign Agent ID",
  "View Ticket",
  "View Receipt",
  "View History",
  "Add Note",
  "Edit Note",
  "Reclaim Ticket",
  "Force Reclaim",
];

const staffTicketActions: TenantTicketAction[] = [
  "Check In",
  "Uncheck",
  "View Ticket",
  "View Receipt",
  "View History",
  "Add Note",
  "Edit Note",
];

const uncheckRoleOptions = ["Host/Tenant", "Staff"] as const;

const TICKET_RANK_OPTIONS = [
  { label: "Bronze", apiValue: "Standard" },
  { label: "Silver", apiValue: "VIP" },
  { label: "Gold", apiValue: "Guest" },
  { label: "Emerald", apiValue: "Staff" },
  { label: "Executive Emerald", apiValue: "Speaker" },
  { label: "Diamond", apiValue: "Sponsor" },
  { label: "Blue Diamond", apiValue: "Exhibitor" },
  { label: "Red Diamond", apiValue: "Internal" },
  { label: "Purple Diamond", apiValue: "Internal" },
  { label: "Black Diamond", apiValue: "Internal" },
] as const;

type TicketRankOption = (typeof TICKET_RANK_OPTIONS)[number]["label"];
type BackendTicketRank = (typeof TICKET_RANK_OPTIONS)[number]["apiValue"];

const DEFAULT_TICKET_RANK: TicketRankOption = "Bronze";
const DEFAULT_BACKEND_TICKET_RANK: BackendTicketRank = "Standard";

const getTicketEventId = (ticket: any) =>
  String(ticket?.eventId ?? ticket?.event?.id ?? ticket?.event?._id ?? "");

const getStringValue = (value: any, fallback = "") =>
  value === null || value === undefined ? fallback : String(value);

const getTicketRankOption = (rank: any) => {
  const normalizedRank = getStringValue(rank).trim().toLowerCase();

  return TICKET_RANK_OPTIONS.find(
    (option) =>
      option.label.toLowerCase() === normalizedRank ||
      option.apiValue.toLowerCase() === normalizedRank
  );
};

const getAllowedTicketRank = (rank: any): TicketRankOption =>
  getTicketRankOption(rank)?.label ?? DEFAULT_TICKET_RANK;

const getBackendTicketRankValue = (rank: any): BackendTicketRank =>
  getTicketRankOption(rank)?.apiValue ?? DEFAULT_BACKEND_TICKET_RANK;

const formatTicketRankLabel = (rank: any) =>
  getTicketRankOption(rank)?.label || getStringValue(rank, "Not set");

const formatDateTime = (value: any) => {
  const dateValue = getStringValue(value);
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleString();
};

const formatLocalDateTimeInputValue = (value: any) => {
  const dateValue = getStringValue(value);
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const getAuditValue = (value: any) => {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
};

const formatReceiptAmount = (currency: any, amount: any) => {
  if (amount === null || amount === undefined || amount === "") return "N/A";

  const currencyLabel = getStringValue(currency).toUpperCase();
  return `${currencyLabel ? `${currencyLabel} ` : ""}${amount}`;
};

const formatHistoryLabel = (item: any) => {
  if (item?.label) return getStringValue(item.label);

  return getStringValue(item?.action ?? item?.type, "Updated")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatHistoryDescription = (item: any) => {
  if (item?.description) return getStringValue(item.description);

  const action = getStringValue(item?.action ?? item?.type).toUpperCase();
  const oldValues = item?.oldValues ?? {};
  const newValues = item?.newValues ?? {};

  if (action === "REGISTERED") {
    return [
      newValues.fullTicketNumber
        ? `Ticket ${newValues.fullTicketNumber} registered`
        : "Ticket registered",
      newValues.buyerId ? `Buyer ${newValues.buyerId}` : "",
    ]
      .filter(Boolean)
      .join(" for ");
  }

  if (action === "TICKET_TYPE_CHANGED") {
    const fromTicket = oldValues.ticketType || oldValues.ticketName;
    const toTicket = newValues.ticketType || newValues.ticketName;
    const priceText =
      oldValues.price !== undefined && newValues.price !== undefined
        ? `Price ${oldValues.price} to ${newValues.price}`
        : "";
    const amountText =
      item?.amountDelta !== undefined ? `Amount delta ${item.amountDelta}` : "";
    const noteText = item?.note ? `Note: ${item.note}` : "";

    return [
      fromTicket && toTicket
        ? `Changed from ${fromTicket} to ${toTicket}`
        : "Ticket type changed",
      priceText,
      amountText,
      noteText,
    ]
      .filter(Boolean)
      .join(". ");
  }

  if (action === "NOTE_ADDED") {
    return item?.note || newValues.note
      ? `Note: ${item?.note ?? newValues.note}`
      : "Internal note added";
  }

  return item?.note ? `Note: ${item.note}` : "";
};

const getTenantActionLoadingKey = (
  ticket: EventTicketCustomer,
  action: TenantTicketAction
) => `${ticket.id}:${action}`;

type TicketExportFormat = "csv" | "xlsx";

type BackendTicketExportConfig = {
  endpoint: string;
  exportDataEndpoint?: string;
  buildPayload: (
    columnKeys: string[],
    format: TicketExportFormat
  ) => Record<string, any>;
  buildExportDataParams?: () => Record<string, any>;
};

const getDefaultExportTimeframeParams = () =>
  getTimeframeParams(createTimeframe(DEFAULT_TIMEFRAME_PRESET));

const getSafeExportFilename = (filename: string, format: TicketExportFormat) =>
  `${filename}-${new Date().toISOString().slice(0, 10)}`
    .replace(/[^a-z0-9-_]/gi, "-")
    .replace(new RegExp(`-${format}$`, "i"), "");

const getFilenameFromContentDisposition = (contentDisposition: any) => {
  const header = getStringValue(contentDisposition);
  if (!header) return "";

  const encodedMatch = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (encodedMatch?.[1]) {
    try {
      return decodeURIComponent(encodedMatch[1].replace(/"/g, ""));
    } catch {
      return encodedMatch[1].replace(/"/g, "");
    }
  }

  const quotedMatch = header.match(/filename="?([^";]+)"?/i);
  return quotedMatch?.[1]?.trim() ?? "";
};

const downloadBlobFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadFromUrl = (url: string, filename?: string) => {
  const link = document.createElement("a");
  link.href = url;
  if (filename) link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const readBlobJson = async (blob: Blob) => {
  try {
    return JSON.parse(await blob.text());
  } catch {
    return null;
  }
};

const getResponseHeader = (headers: any, key: string) =>
  headers?.get?.(key) ??
  headers?.[key] ??
  headers?.[key.toLowerCase()] ??
  headers?.[key.toUpperCase()];

const isJsonBlobResponse = (blob: Blob, headers: any) => {
  const contentType = getStringValue(getResponseHeader(headers, "content-type"));
  return blob.type.includes("application/json") || contentType.includes("application/json");
};

const getExportErrorMessage = async (error: any) => {
  const data = error?.response?.data;

  if (data instanceof Blob) {
    const json = await readBlobJson(data);
    return (
      json?.message ||
      json?.error?.message ||
      json?.error ||
      error?.message ||
      "Ticket export failed."
    );
  }

  return (
    data?.message ||
    data?.error?.message ||
    data?.error ||
    error?.message ||
    "Ticket export failed."
  );
};

const isExportEndpointUnavailable = (error: any) =>
  [404, 405, 501].includes(Number(error?.response?.status));

const fetchPaginatedExportRows = async (
  endpoint: string,
  baseParams: Record<string, any>
) => {
  const rows: any[] = [];
  const limit = 500;
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage && page <= 100) {
    const res = await apiClient.get(endpoint, {
      params: {
        ...baseParams,
        page,
        limit,
      },
    });
    const data = res.data?.data ?? res.data ?? {};
    const pageRows = Array.isArray(data.rows)
      ? data.rows
      : Array.isArray(data.tickets)
        ? data.tickets
        : Array.isArray(data.customers)
          ? data.customers
          : [];
    const pagination = data.pagination ?? {};

    rows.push(...pageRows);

    const totalPages = Number(pagination.totalPages ?? page);
    hasNextPage =
      Boolean(pagination.hasNextPage) ||
      (Number.isFinite(totalPages) && page < totalPages);
    page += 1;
  }

  return rows;
};

export default function TicketManager({
  eventId,
  eventTitle,
  eventScoped = false,
  dashboardMode = "host",
}: TicketManagerProps = {}) {
  const isEventScoped = Boolean(eventScoped && eventId);
  const isStaffDashboard = dashboardMode === "staff";
  const actionOptions = isStaffDashboard ? staffTicketActions : tenantTicketActions;
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
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketQuantityInput, setTicketQuantityInput] = useState("");
  const [ticketSaleStartAt, setTicketSaleStartAt] = useState("");
  const [ticketSaleEndAt, setTicketSaleEndAt] = useState("");
  const [ticketPaymentPlanEnabled, setTicketPaymentPlanEnabled] =
    useState(false);

  // Transferable (boolean)
  const [transferable, setTransferable] = useState(false);

  const [tickets, setTickets] = useState<any[]>([]);
  const [eventTicketRows, setEventTicketRows] = useState<EventTicketCustomer[]>(
    []
  );
  const [eventTicketsLoading, setEventTicketsLoading] = useState(false);
  const [eventTicketSearch, setEventTicketSearch] = useState("");
  const [eventTicketStatus, setEventTicketStatus] = useState("All");
  const [eventTicketTypeId, setEventTicketTypeId] = useState("All");
  const [eventCustomersPage, setEventCustomersPage] = useState(1);
  const [eventCustomersTotalPages, setEventCustomersTotalPages] = useState(1);
  const [selectedEventTicket, setSelectedEventTicket] =
    useState<EventTicketCustomer | null>(null);
  const [activeTenantAction, setActiveTenantAction] =
    useState<TenantTicketAction | null>(null);
  const [tenantActionFields, setTenantActionFields] = useState<TenantActionFields>({
    transferEmail: "",
    ticketType: "",
    rank: DEFAULT_TICKET_RANK,
    agentId: "",
    note: "",
    reason: "",
    refundType: "full",
    refundAmount: "",
    notifyCustomer: true,
    notifyRecipient: true,
    adjustmentMode: "charge_difference",
    paymentMethodId: "",
    claimForCustomerId: "",
    editNoteId: "",
    uncheckByRole: isStaffDashboard ? "Staff" : "Host/Tenant",
    uncheckAt: "",
  });
  const [tenantActionLoadingKey, setTenantActionLoadingKey] = useState<
    string | null
  >(null);
  const [tenantActionDetailLoading, setTenantActionDetailLoading] =
    useState(false);
  const [tenantActionError, setTenantActionError] = useState("");
  const [tenantActionDetails, setTenantActionDetails] =
    useState<TenantActionDetails>({
      ticket: null,
      receipt: null,
      history: [],
      notes: [],
    });

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme, setTheme, theme } = useTheme();

  // ✅ NEW: allowTransfers feature flag
  const [allowTransfers, setAllowTransfers] = useState<boolean>(false);
  const [allowRefunds, setAllowRefunds] = useState<boolean>(false);
  const [allowForceClaim, setAllowForceClaim] = useState<boolean>(false);
  const [allowReclaimTicket, setAllowReclaimTicket] = useState<boolean>(true);
  const [allowTicketNotes, setAllowTicketNotes] = useState<boolean>(true);
  const [allowTicketHistory, setAllowTicketHistory] = useState<boolean>(true);

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
        setAllowRefunds(Boolean(features?.allowRefunds?.enabled));
        setAllowForceClaim(
          Boolean(
            features?.forceClaim?.enabled ||
              features?.forceClaimTickets?.enabled ||
              features?.allowForceClaim?.enabled
          )
        );
        setAllowReclaimTicket(features?.reclaimTickets?.enabled !== false);
        setAllowTicketNotes(features?.ticketNotes?.enabled !== false);
        setAllowTicketHistory(features?.ticketHistory?.enabled !== false);
      } catch (err) {
        console.error("Failed to fetch tenant features:", err);
        setAllowTransfers(false);
        setAllowRefunds(false);
        setAllowForceClaim(false);
        setAllowReclaimTicket(true);
        setAllowTicketNotes(true);
        setAllowTicketHistory(true);
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
    const normalizedTicket =
      ticketInventoryById[String(id)] ||
      (t
        ? normalizeCommerceTicket(t, {
            eventMode: t?.event?.eventType ?? t?.eventType ?? null,
          })
        : null);

    if (t) {
      setTicketName(t.name);
      setTicketType(t.type);
      setTicketPrice(Number(normalizedTicket?.price ?? t.price));
      setTicketDescription(normalizedTicket?.description || "");
      setTicketQuantityInput(
        normalizedTicket?.quantity === null
          ? ""
          : String(normalizedTicket?.quantity ?? t.quantity ?? "")
      );
      setTicketSaleStartAt(
        formatLocalDateTimeInputValue(normalizedTicket?.saleStartAt)
      );
      setTicketSaleEndAt(
        formatLocalDateTimeInputValue(normalizedTicket?.saleEndAt)
      );
      setTicketPaymentPlanEnabled(
        Boolean(
          normalizedTicket?.paymentPlanEnabled ??
            t?.paymentPlanEnabled ??
            t?.allowPaymentPlan
        )
      );
      setMinOrder(normalizedTicket?.minOrder ?? 1);
      setMaxOrder(normalizedTicket?.maxOrder ?? 5);

      // ✅ NEW: only allow editing transferable when feature is enabled
      setTransferable(
        allowTransfers
          ? Boolean(normalizedTicket?.transferable ?? t.isTransferable)
          : false
      );

      setIsRefundable(Boolean(normalizedTicket?.refundable ?? t.isRefundable));
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

    const selectedTicket =
      tickets.find((ticket) => String(ticket.id) === String(editingTicket)) || null;
    const currentInventory = selectedTicket
      ? ticketInventoryById[String(selectedTicket.id)] ||
        normalizeCommerceTicket(selectedTicket, {
          eventMode:
            selectedTicket?.event?.eventType ?? selectedTicket?.eventType ?? null,
        })
      : null;
    const soldQuantity = Number(currentInventory?.soldQuantity || 0);
    const nextQuantity =
      ticketQuantityInput.trim() === "" ? null : Number(ticketQuantityInput);

    if (nextQuantity !== null && (!Number.isFinite(nextQuantity) || nextQuantity < 0)) {
      toast.error("Quantity must be a valid positive number.");
      return;
    }

    if (nextQuantity !== null && nextQuantity < soldQuantity) {
      toast.error(
        `Quantity cannot be lower than ${soldQuantity} because those tickets are already sold.`
      );
      return;
    }

    if (
      ticketSaleStartAt &&
      ticketSaleEndAt &&
      new Date(ticketSaleEndAt) < new Date(ticketSaleStartAt)
    ) {
      toast.error("Sale end must be after the sale start.");
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
      description: ticketDescription,
      quantity: nextQuantity,
      totalQuantity: nextQuantity,
      saleStartAt: ticketSaleStartAt || null,
      saleEndAt: ticketSaleEndAt || null,

      // ✅ NEW: if feature disabled, always force false
      isTransferable: allowTransfers ? transferable : false,

      isRefundable: allowRefunds ? isRefundable : false,
      paymentPlanEnabled: ticketPaymentPlanEnabled,
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

  const [hostName, setHostName] = useState(
    isStaffDashboard ? "Staff" : "Host"
  );

  useEffect(() => {
    const userStorageKey = isStaffDashboard ? "staffUser" : "hostUser";
    const tokenStorageKey = isStaffDashboard ? "staffToken" : "hostToken";
    const loginPath = isStaffDashboard ? "/sign-in-staff" : "/sign-in-host";
    const fallbackName = isStaffDashboard ? "Staff" : "Host";
    const savedUser = localStorage.getItem(userStorageKey);
    const savedToken =
      localStorage.getItem(tokenStorageKey) || localStorage.getItem("token");

    if (!savedUser && !savedToken) {
      window.location.href = loginPath;
      return;
    }

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        setHostName(user.userName || user.fullName || user.name || fallbackName);

        console.log(
          `${isStaffDashboard ? "STAFF" : "HOST"} TICKET MANAGER USER:`,
          user
        );
        console.log("USER SUBDOMAIN:", user?.subDomain);

        if (user.theme) {
          // syncThemeWithBackend(user);
        }
      } catch {
        setHostName(fallbackName);
      }
    } else {
      setHostName(fallbackName);
    }
  }, [isStaffDashboard]);

  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;

  // Calculate slice indices
  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;

  // Tickets for current page
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);

  // Total number of pages
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const ticketInventoryById = useMemo(() => {
    const rows = Array.isArray(eventTicketRows) ? eventTicketRows : [];

    return tickets.reduce<Record<string, ReturnType<typeof normalizeCommerceTicket>>>(
      (accumulator, ticket) => {
        const ticketId = String(ticket?.id ?? ticket?._id ?? "");
        const ticketName = getStringValue(ticket?.name).toLowerCase();
        const ticketType = getStringValue(ticket?.type).toLowerCase();
        const soldQuantity = rows
          .filter((row) => {
            const rowTypeId = String(row.ticketTypeId || "");
            const rowTicketId = String(row.ticketId || "");
            const rowTicketName = getStringValue(row.ticketName).toLowerCase();
            const rowTicketType = getStringValue(row.ticketType).toLowerCase();

            return (
              (ticketId && rowTypeId === ticketId) ||
              (ticketId && rowTicketId === ticketId) ||
              (ticketName && rowTicketName === ticketName) ||
              (ticketType && rowTicketType === ticketType)
            );
          })
          .reduce((sum, row) => sum + Number(row.quantity || 0), 0);

        accumulator[ticketId || ticket.name || crypto.randomUUID()] =
          normalizeCommerceTicket(
            {
              ...ticket,
              soldQuantity:
                soldQuantity ||
                ticket?.soldQuantity ||
                ticket?.sold ||
                ticket?.quantitySold ||
                0,
            },
            {
              eventMode: ticket?.event?.eventType ?? ticket?.eventType ?? null,
            }
          );

        return accumulator;
      },
      {}
    );
  }, [eventTicketRows, tickets]);

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

  const normalizeEventTicketRow = (ticket: any): EventTicketCustomer => {
    const ticketPurchaseId = getStringValue(
      ticket.ticketPurchaseId ??
        ticket.issuedTicketId ??
        ticket.ticketId ??
        ticket.issuedTicket?.id ??
        ticket.ticket?.purchaseId ??
        ticket.ticket?.ticketPurchaseId ??
        ticket.id ??
        ticket._id
    );
    const ticketTypeId = getStringValue(
      ticket.ticketTypeId ??
        ticket.ticket?.ticketTypeId ??
        ticket.ticket?.id ??
        ticket.ticket?._id ??
        ticket.typeId
    );
    const customerId = getStringValue(
        ticket.customerId ??
        ticket.userId ??
        ticket.buyer?.id ??
        ticket.buyer?._id ??
        ticket.customer?.id ??
        ticket.customer?._id ??
        ticket.user?.id ??
        ticket.user?._id,
      ticketPurchaseId
    );
    const rowId = getStringValue(
      ticket.issuedTicketId ?? ticket.id ?? ticket._id ?? ticketPurchaseId,
      `${customerId}-${ticketTypeId || "ticket"}`
    );
    const permissions = ticket.permissions ?? {};
    const availableActions = ticket.availableActions ?? {};

    return {
      id: rowId,
      ticketPurchaseId,
      customerId,
      name:
        ticket.customerName ??
        ticket.fullName ??
        ticket.name ??
        ticket.buyer?.name ??
        ticket.buyer?.fullName ??
        ticket.customer?.fullName ??
        ticket.customer?.name ??
        ticket.user?.fullName ??
        ticket.user?.name ??
        "Unknown attendee",
      email:
        ticket.customerEmail ??
        ticket.email ??
        ticket.buyer?.email ??
        ticket.customer?.email ??
        ticket.user?.email ??
        "N/A",
      firstName:
        ticket.firstName ??
        ticket.customer?.firstName ??
        ticket.user?.firstName ??
        ticket.buyer?.firstName,
      lastName:
        ticket.lastName ??
        ticket.customer?.lastName ??
        ticket.user?.lastName ??
        ticket.buyer?.lastName,
      phoneNumber:
        ticket.phoneNumber ??
        ticket.phone ??
        ticket.customer?.phoneNumber ??
        ticket.customer?.phone ??
        ticket.user?.phoneNumber ??
        ticket.user?.phone,
      ticketNumber:
        ticket.ticketNumber ??
        ticket.fullTicketNumber ??
        ticket.ticket?.ticketNumber ??
        ticket.ticket?.fullTicketNumber,
      ticketStatus: ticket.ticketStatus ?? ticket.status,
      orderDate:
        ticket.orderDate ??
        ticket.registeredAt ??
        ticket.createdAt ??
        ticket.purchaseDate,
      ticketPrice:
        ticket.ticketPrice ??
        ticket.price ??
        ticket.ticket?.price ??
        ticket.purchase?.ticketPrice,
      serviceFee:
        ticket.serviceFee ??
        ticket.fees?.service ??
        ticket.order?.serviceFee ??
        ticket.purchase?.serviceFee,
      processingFee:
        ticket.processingFee ??
        ticket.fees?.processing ??
        ticket.order?.processingFee ??
        ticket.purchase?.processingFee,
      customOrderFormAnswers:
        ticket.customOrderFormAnswers ??
        ticket.customAnswers ??
        ticket.orderFormAnswers ??
        ticket.answers ??
        ticket.order?.customOrderFormAnswers,
      billingAmount:
        ticket.billingAmount ??
        ticket.totalAmount ??
        ticket.amount ??
        ticket.order?.billingAmount ??
        ticket.purchase?.billingAmount,
      cardLast4:
        ticket.cardLast4 ??
        ticket.cardNumberLast4 ??
        ticket.last4 ??
        ticket.payment?.cardLast4 ??
        ticket.payment?.card?.last4,
      cardholderName:
        ticket.cardholderName ??
        ticket.cardHolderName ??
        ticket.payment?.cardholderName ??
        ticket.payment?.card?.name,
      note:
        ticket.note ??
        ticket.notes ??
        ticket.internalNote ??
        ticket.latestNote,
      ticketId:
        getStringValue(ticket.fullTicketNumber ?? ticket.ticketNumber) ||
        ticketPurchaseId ||
        "N/A",
      ticketTypeId,
      ticketName:
        ticket.ticketName ??
        ticket.ticket?.name ??
        ticket.metadata?.ticketName ??
        ticket.ticketType ??
        "Assigned ticket",
      ticketType:
        ticket.ticketType ??
        ticket.ticket?.type ??
        ticket.metadata?.ticketType ??
        ticket.type ??
        "General",
      quantity: Number(ticket.quantity ?? ticket.purchase?.ticketQuantity ?? 1),
      status: ticket.status ?? ticket.lastHistoryStatus ?? "Registered",
      checkedIn: Boolean(
        ticket.checkedIn ??
          ticket.usedAt ??
          String(ticket.status ?? "").toLowerCase() === "checked in"
      ),
      checkInStatus:
        ticket.checkInStatus ??
        (ticket.checkedIn ? "Checked in" : "Not checked in"),
      transferStatus:
        ticket.transferStatus ??
        ticket.transfer?.status ??
        (ticket.isTransferable ? "Transferable" : "Not transferred"),
      refundStatus:
        ticket.refundStatus ??
        ticket.refund?.status ??
        (ticket.isRefundable ? "Refundable" : "Not refunded"),
      isTransferable: ticket.isTransferable,
      isRefundable: ticket.isRefundable,
      wasReclaimed: ticket.wasReclaimed === true || ticket.wasReclaimed === "true" || String(ticket.status ?? "").toLowerCase() === "reclaimed",
      eventId: ticket.eventId ?? ticket.event?.id ?? ticket.event?._id ?? eventId,
      eventName:
        ticket.eventName ??
        ticket.eventTitle ??
        ticket.event?.name ??
        ticket.event?.title ??
        eventTitle,
      rank: getStringValue(
        ticket.rank ?? ticket.buyer?.rank ?? ticket.customer?.rank ?? ticket.user?.rank
      ),
      agentId: getStringValue(
        ticket.agentId ??
          ticket.buyer?.agentId ??
          ticket.customer?.agentId ??
          ticket.user?.agentId
      ),
      registeredAt: getStringValue(
        ticket.registeredAt ?? ticket.createdAt ?? ticket.purchaseDate
      ),
      receiptId: getStringValue(
        ticket.receiptId ??
          ticket.receipt?.id ??
          ticket.orderId ??
          ticket.purchase?.confirmationNumber ??
          ticket.purchaseId ??
          ticket.paymentId,
        "N/A"
      ),
      orderId: getStringValue(
        ticket.orderId ?? ticket.receipt?.orderId ?? ticket.purchase?.id ?? ticket.purchaseId,
        "N/A"
      ),
      notesCount: Number(
        ticket.notesCount ??
          ticket.notes?.count ??
          (Array.isArray(ticket.notes) ? ticket.notes.length : 0)
      ),
      lastHistoryStatus: getStringValue(ticket.lastHistoryStatus ?? ticket.status),
      permissions: {
        canCheckIn:
          permissions.canCheckIn ?? availableActions.checkIn ?? ticket.canCheckIn,
        canUncheck:
          permissions.canUncheck ??
          permissions.canUncheckIn ??
          availableActions.uncheck ??
          availableActions.uncheckIn ??
          ticket.canUncheck ??
          ticket.canUncheckIn,
        canViewTicket:
          permissions.canViewTicket ??
          availableActions.viewTicket ??
          ticket.canViewTicket,
        canViewReceipt:
          permissions.canViewReceipt ??
          availableActions.viewReceipt ??
          ticket.canViewReceipt,
        canViewHistory:
          permissions.canViewHistory ??
          availableActions.viewHistory ??
          ticket.canViewHistory,
        canTransfer:
          permissions.canTransfer ?? availableActions.transfer ?? ticket.canTransfer,
        canCancelRefund:
          permissions.canCancelRefund ??
          availableActions.cancelRefund ??
          permissions.canRefund ??
          ticket.canCancelRefund,
        canChangeTicketType:
          permissions.canChangeTicketType ??
          availableActions.changeTicketType ??
          ticket.canChangeTicketType,
        canUpdateRank:
          permissions.canUpdateRank ?? availableActions.updateRank ?? ticket.canUpdateRank,
        canAssignAgentId:
          permissions.canAssignAgentId ??
          permissions.canAssignAgentID ??
          availableActions.assignAgentId ??
          ticket.canAssignAgentId,
        canAddNote:
          permissions.canAddNote ?? availableActions.addNote ?? ticket.canAddNote,
        canReclaim:
          permissions.canReclaim ?? availableActions.reclaim ?? ticket.canReclaim,
        canForceClaim:
          permissions.canForceClaim ??
          availableActions.forceClaim ??
          ticket.canForceClaim,
      },
    };
  };

  const fetchEventTicketRows = async () => {
    if (!eventId) return;

    try {
      setEventTicketsLoading(true);
      const params = {
        page: eventCustomersPage,
        limit: ticketsPerPage,
        ...(eventTicketSearch.trim()
          ? { search: eventTicketSearch.trim() }
          : {}),
        ...(eventTicketStatus !== "All" ? { status: eventTicketStatus } : {}),
        ...(eventTicketTypeId !== "All" ? { ticketTypeId: eventTicketTypeId } : {}),
      };

      let res;
      try {
        res = await apiClient.get(`/events/${eventId}/tickets/manage`, {
          params,
        });
      } catch (manageErr: any) {
        if (manageErr?.response?.status !== 404) throw manageErr;
        res = await apiClient.get(`/events/${eventId}/customers`, {
          params,
        });
      }

      const responseData = res.data?.data ?? res.data ?? {};
      const customersRaw =
        responseData.tickets ?? responseData.customers ?? responseData.rows ?? [];
      const totalPages =
        responseData?.pagination?.totalPages ??
        res.data?.pagination?.totalPages ??
        1;

      const normalizedCustomers = Array.isArray(customersRaw)
        ? customersRaw.map(normalizeEventTicketRow)
        : [];

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
  }, [
    eventId,
    eventCustomersPage,
    eventTicketSearch,
    eventTicketStatus,
    eventTicketTypeId,
    isEventScoped,
  ]);

  useEffect(() => {
    if (!isEventScoped) return;
    setEventCustomersPage(1);
  }, [eventTicketSearch, eventTicketStatus, eventTicketTypeId, isEventScoped]);

  const getDisplayTicket = (ticket: EventTicketCustomer) => {
    return {
      ...ticket,
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
      const matchesTicketType =
        eventTicketTypeId === "All" ||
        ticket.ticketTypeId === eventTicketTypeId ||
        ticket.ticketType.toLowerCase() === eventTicketTypeId.toLowerCase();

      return matchesQuery && matchesStatus && matchesTicketType;
    });

  const openTenantAction = (
    action: TenantTicketAction,
    ticket: EventTicketCustomer
  ) => {
    const displayTicket = getDisplayTicket(ticket);
    setSelectedEventTicket(ticket);
    setActiveTenantAction(action);
    setTenantActionError("");
    setTenantActionDetails({ ticket: null, receipt: null, history: [], notes: [] });
    setTenantActionFields({
      transferEmail: "",
      ticketType: displayTicket.ticketTypeId || displayTicket.ticketType,
      rank: getAllowedTicketRank(displayTicket.rank),
      agentId: displayTicket.agentId,
      note: "",
      reason: "",
      refundType: "full",
      refundAmount: "",
      notifyCustomer: true,
      notifyRecipient: true,
      adjustmentMode: "charge_difference",
      paymentMethodId: "",
      claimForCustomerId: displayTicket.customerId,
      editNoteId: "",
      uncheckByRole: isStaffDashboard ? "Staff" : "Host/Tenant",
      uncheckAt: action === "Uncheck" ? new Date().toISOString() : "",
    });
    loadTenantActionData(action, displayTicket);
  };

  const closeTenantAction = () => {
    setSelectedEventTicket(null);
    setActiveTenantAction(null);
    setTenantActionError("");
    setTenantActionDetails({ ticket: null, receipt: null, history: [], notes: [] });
  };

  const permissionEnabled = (value: boolean | undefined) => value !== false;

  const canRunTenantAction = (
    action: TenantTicketAction,
    ticket: EventTicketCustomer
  ) => {
    const permissions = ticket.permissions ?? {};
    const status = ticket.status.toLowerCase();
    const isUnused = status === "unused";
    const isCancelled = status === "cancelled" || status === "canceled";

    switch (action) {
      case "Check In":
        return !ticket.checkedIn && !isCancelled && permissionEnabled(permissions.canCheckIn);
      case "Uncheck":
        return !isUnused && permissionEnabled(permissions.canUncheck);
      case "Transfer":
        return allowTransfers && permissionEnabled(permissions.canTransfer);
      case "Cancel / Refund":
        return allowRefunds && permissionEnabled(permissions.canCancelRefund);
      case "Change Ticket Type":
        return permissionEnabled(permissions.canChangeTicketType);
      case "Update Rank":
        return permissionEnabled(permissions.canUpdateRank);
      case "Assign Agent ID":
        return permissionEnabled(permissions.canAssignAgentId);
      case "Add Note":
      case "Edit Note":
        return allowTicketNotes && permissionEnabled(permissions.canAddNote);
      case "View Ticket":
        return permissionEnabled(permissions.canViewTicket);
      case "View Receipt":
        return permissionEnabled(permissions.canViewReceipt);
      case "View History":
        return allowTicketHistory && permissionEnabled(permissions.canViewHistory);
      case "Reclaim Ticket":
        return allowReclaimTicket && permissionEnabled(permissions.canReclaim);
      case "Force Reclaim":
        return allowForceClaim && 
               permissionEnabled(permissions.canForceClaim) &&
               ticket.wasReclaimed === true;
      default:
        return true;
    }
  };

  const getCurrentTenantUserId = () => {
    if (typeof window === "undefined") return "";

    const storageKeys = ["hostUser", "staffUser", "adminUser", "userData"];
    for (const key of storageKeys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw);
        const user = parsed?.user ?? parsed;
        const id = user?.id ?? user?._id ?? user?.userId;
        if (id) return String(id);
      } catch {
        continue;
      }
    }

    return "";
  };

  const loadTenantActionData = async (
    action: TenantTicketAction,
    ticket: EventTicketCustomer
  ) => {
    if (!eventId || !ticket.ticketPurchaseId) return;

    const shouldLoadTicket = action === "View Ticket";
    const shouldLoadReceipt = action === "View Receipt";
    const shouldLoadHistory = action === "View History";
    const shouldLoadNotes = action === "Add Note" || action === "Edit Note";

    if (!shouldLoadTicket && !shouldLoadReceipt && !shouldLoadHistory && !shouldLoadNotes) {
      return;
    }

    try {
      setTenantActionDetailLoading(true);
      setTenantActionError("");

      const nextDetails: TenantActionDetails = {
        ticket: null,
        receipt: null,
        history: [],
        notes: [],
      };

      if (shouldLoadTicket) {
        const res = await apiClient.get(
          `/events/${eventId}/tickets/${ticket.ticketPurchaseId}`
        );
        nextDetails.ticket = res.data?.data ?? res.data ?? null;
      }

      if (shouldLoadReceipt) {
        const res = await apiClient.get(
          `/events/${eventId}/tickets/${ticket.ticketPurchaseId}/receipt`
        );
        nextDetails.receipt = res.data?.data ?? res.data ?? null;
      }

      if (shouldLoadHistory) {
        const res = await apiClient.get(
          `/events/${eventId}/tickets/${ticket.ticketPurchaseId}/history`
        );
        const history = res.data?.data?.history ?? res.data?.history ?? [];
        nextDetails.history = Array.isArray(history)
          ? history.map((item: any, index: number) => ({
              id: getStringValue(
                item.id ?? item._id ?? `${item.action ?? "history"}-${item.createdAt ?? index}`,
                `history-${index}`
              ),
              label: formatHistoryLabel(item),
              description: formatHistoryDescription(item),
              ticketId: getStringValue(
                item.ticketId ?? item.ticketPurchaseId ?? item.ticket?.id
              ),
              eventId: getStringValue(item.eventId ?? item.event?.id),
              orderId: getStringValue(item.orderId ?? item.order?.id),
              actionType: getStringValue(item.actionType ?? item.action ?? item.type),
              fieldChanged: getStringValue(
                item.fieldChanged ?? item.field ?? item.changedField
              ),
              oldValue: getAuditValue(item.oldValue ?? item.oldValues),
              newValue: getAuditValue(item.newValue ?? item.newValues),
              reason: getStringValue(item.reason ?? item.note),
              performedByUserId: getStringValue(
                item.performedByUserId ?? item.userId ?? item.performedBy?.id
              ),
              performedBy: getStringValue(
                item.performedBy?.name ?? item.performedBy
              ),
              performedByRole: getStringValue(item.performedByRole ?? item.role),
              performedAt: getStringValue(item.performedAt ?? item.createdAt),
              source: getStringValue(item.source),
              createdAt: getStringValue(item.createdAt ?? item.performedAt),
            }))
          : [];
      }

      if (shouldLoadNotes) {
        const res = await apiClient.get(
          `/events/${eventId}/tickets/${ticket.ticketPurchaseId}/notes`
        );
        const notes = res.data?.data?.notes ?? res.data?.notes ?? [];
        nextDetails.notes = Array.isArray(notes)
          ? notes.map((item: any, index: number) => ({
              noteId: getStringValue(item.noteId ?? item.id ?? item._id, `note-${index}`),
              note: getStringValue(item.note),
              visibility: getStringValue(item.visibility, "internal"),
              createdBy: getStringValue(item.createdBy, "N/A"),
              createdAt: getStringValue(item.createdAt),
              updatedAt: item.updatedAt ? getStringValue(item.updatedAt) : undefined,
            }))
          : [];

        if (action === "Edit Note" && nextDetails.notes.length > 0) {
          const firstNote = nextDetails.notes[0];
          setTenantActionFields((fields) => ({
            ...fields,
            editNoteId: firstNote.noteId,
            note: firstNote.note,
          }));
        }
      }

      setTenantActionDetails(nextDetails);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || `Failed to load ${action.toLowerCase()}`;
      setTenantActionError(message);
      toast.error(message);
    } finally {
      setTenantActionDetailLoading(false);
    }
  };

  const applyTenantAction = async () => {
    if (!selectedEventTicket || !activeTenantAction || !eventId) return;

    const ticketPurchaseId = selectedEventTicket.ticketPurchaseId;
    const currentActionKey = getTenantActionLoadingKey(
      selectedEventTicket,
      activeTenantAction
    );

    try {
      setTenantActionLoadingKey(currentActionKey);
      setTenantActionError("");

      let response;
      const actionSource = isStaffDashboard ? "staff-dashboard" : "tenant-dashboard";

      if (activeTenantAction === "Check In") {
        response = await apiClient.post(
          `/events/${eventId}/tickets/${ticketPurchaseId}/check-in`,
          {
            checkedInBy: getCurrentTenantUserId() || undefined,
            source: actionSource,
            note:
              tenantActionFields.note ||
              tenantActionFields.reason ||
              "Checked in manually by tenant",
          }
        );
      }

      if (activeTenantAction === "Uncheck") {
        if (!tenantActionFields.reason.trim()) {
          toast.error("Enter a reason before unchecking this ticket.");
          return;
        }

        response = await apiClient.post(
          `/events/${eventId}/tickets/${ticketPurchaseId}/uncheck`,
          {
            status: "unused",
            uncheckByRole: tenantActionFields.uncheckByRole,
            uncheckAt: tenantActionFields.uncheckAt || new Date().toISOString(),
            reason: tenantActionFields.reason.trim(),
            source: actionSource,
          }
        );
      }

      if (activeTenantAction === "Transfer") {
        if (!tenantActionFields.transferEmail.trim()) {
          toast.error("Enter the recipient email.");
          return;
        }

        response = await apiClient.post(
          `/events/${eventId}/tickets/${ticketPurchaseId}/transfer`,
          {
            toEmail: tenantActionFields.transferEmail.trim(),
            reason: tenantActionFields.reason || "Customer requested transfer",
            notifyRecipient: tenantActionFields.notifyRecipient,
          }
        );
      }

      if (activeTenantAction === "Cancel / Refund") {
        response = await apiClient.post(
          `/events/${eventId}/tickets/${ticketPurchaseId}/cancel-refund`,
          {
            refundType: tenantActionFields.refundType,
            refundAmount:
              tenantActionFields.refundType === "partial" &&
              tenantActionFields.refundAmount
                ? Number(tenantActionFields.refundAmount)
                : null,
            reason:
              tenantActionFields.reason || "Customer requested cancellation",
            notifyCustomer: tenantActionFields.notifyCustomer,
          }
        );
      }

      if (activeTenantAction === "Change Ticket Type") {
        response = await apiClient.patch(
          `/events/${eventId}/tickets/${ticketPurchaseId}/type`,
          {
            newTicketTypeId: tenantActionFields.ticketType,
            adjustmentMode: tenantActionFields.adjustmentMode,
            paymentMethodId: tenantActionFields.paymentMethodId || undefined,
            reason: tenantActionFields.reason || "Tenant changed ticket type",
          }
        );
      }

      if (activeTenantAction === "Update Rank") {
        response = await apiClient.patch(
          `/events/${eventId}/customers/${selectedEventTicket.customerId}/rank`,
          {
            rank: getBackendTicketRankValue(tenantActionFields.rank),
            reason: tenantActionFields.reason || "Tenant updated customer rank",
          }
        );
      }

      if (activeTenantAction === "Assign Agent ID") {
        response = await apiClient.patch(
          `/events/${eventId}/customers/${selectedEventTicket.customerId}/agent`,
          {
            agentId: tenantActionFields.agentId,
            reason: tenantActionFields.reason || "Assigned by tenant",
          }
        );
      }

      if (activeTenantAction === "Add Note") {
        if (!tenantActionFields.note.trim()) {
          toast.error("Add a note before saving.");
          return;
        }

        response = await apiClient.post(
          `/events/${eventId}/tickets/${ticketPurchaseId}/notes`,
          {
            note: tenantActionFields.note.trim(),
            visibility: "internal",
          }
        );
      }

      if (activeTenantAction === "Edit Note") {
        if (!tenantActionFields.editNoteId) {
          toast.error("Select a note to edit.");
          return;
        }

        response = await apiClient.patch(
          `/events/${eventId}/tickets/${ticketPurchaseId}/notes/${tenantActionFields.editNoteId}`,
          {
            note: tenantActionFields.note.trim(),
          }
        );
      }

      if (activeTenantAction === "Reclaim Ticket") {
        response = await apiClient.post(
          `/events/${eventId}/tickets/${ticketPurchaseId}/reclaim`,
          {
            reason: tenantActionFields.reason || "Ticket reclaimed by tenant",
            notifyCustomer: tenantActionFields.notifyCustomer,
          }
        );
      }

      if (activeTenantAction === "Force Reclaim") {
        response = await apiClient.post(
          `/events/${eventId}/tickets/${ticketPurchaseId}/force-claim`,
          {
            claimForCustomerId: tenantActionFields.claimForCustomerId,
            reason: tenantActionFields.reason || "Manual tenant override",
            notifyCustomer: tenantActionFields.notifyCustomer,
          }
        );
      }

      toast.success(
        response?.data?.message || `${activeTenantAction} completed successfully`
      );
      if (activeTenantAction === "Uncheck") {
        setEventTicketRows((rows) =>
          rows.map((ticket) =>
            ticket.id === selectedEventTicket.id
              ? {
                  ...ticket,
                  checkedIn: false,
                  status: "Unused",
                  lastHistoryStatus: "Unused",
                }
              : ticket
          )
        );
      }
      await fetchEventTicketRows();
      closeTenantAction();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || `${activeTenantAction} failed`;
      setTenantActionError(message);
      toast.error(message);
    } finally {
      setTenantActionLoadingKey(null);
    }
  };

  const selectedDisplayTicket = selectedEventTicket
    ? getDisplayTicket(selectedEventTicket)
    : null;

  return (
    <div
      className={`min-h-screen w-full bg-white font-sans dark:bg-[#101010] ${
        isStaffDashboard
          ? "flex flex-col md:flex-row"
          : "flex flex-col md:block md:pl-64"
      }`}
    >
      <div className="md:block md:shrink-0">
        {isStaffDashboard ? <StaffSidebar /> : <Sidebar active="Ticket Manager" />}
      </div>

      <div className="min-w-0 flex-1 bg-gray-50 pt-16 dark:bg-[#101010] md:pt-0">
        {/* ✅ Header visible on tablet/desktop only */}
        <div className="hidden sm:block">
          {/* Desktop Header */}
          <header className="hidden md:flex items-center justify-between gap-4 px-4 pt-6 pb-4 sm:px-6 lg:px-8">
            <h1 className="min-w-0 text-2xl font-semibold tracking-[-0.02em] sm:text-[32px]">
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
                    {/* Profile Name */}
                    <span className="hidden sm:block font-semibold text-black dark:text-white">
                      {isStaffDashboard ? "Staff" : hostName}
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
                        <Link href={isStaffDashboard ? "/my-events-staff" : "/my-events"}>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                            My Events
                          </button>
                        </Link>

                        {!isStaffDashboard && (
                          <Link href="/ticket-manager">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                              Ticket Manager
                            </button>
                          </Link>
                        )}

                        {!isStaffDashboard && (
                          <Link href="/host-payments">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                              Payments
                            </button>
                          </Link>
                        )}

                        {!isStaffDashboard && (
                          <Link href="/host-settings">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                              System Settings
                            </button>
                          </Link>
                        )}

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
            closeTenantAction={closeTenantAction}
            canRunTenantAction={canRunTenantAction}
            eventCustomersPage={eventCustomersPage}
            eventCustomersTotalPages={eventCustomersTotalPages}
            eventId={eventId}
            eventTicketSearch={eventTicketSearch}
            eventTicketStatus={eventTicketStatus}
            eventTicketTypeId={eventTicketTypeId}
            eventTicketsLoading={eventTicketsLoading}
            eventTitle={eventTitle}
            filteredEventTicketRows={filteredEventTicketRows}
            openTenantAction={openTenantAction}
            selectedDisplayTicket={selectedDisplayTicket}
            setEventCustomersPage={setEventCustomersPage}
            setEventTicketSearch={setEventTicketSearch}
            setEventTicketStatus={setEventTicketStatus}
            setEventTicketTypeId={setEventTicketTypeId}
            setTenantActionFields={setTenantActionFields}
            tenantActionFields={tenantActionFields}
            tenantActionDetailLoading={tenantActionDetailLoading}
            tenantActionDetails={tenantActionDetails}
            tenantActionError={tenantActionError}
            tenantActionLoadingKey={tenantActionLoadingKey}
            tickets={tickets}
            applyTenantAction={applyTenantAction}
            actionOptions={actionOptions}
            dashboardMode={dashboardMode}
          />
        ) : (
          <>

        {/* 🔍 Search & Filters */}
        <div className="mx-4 mb-8 mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#1a1a1a] sm:mx-6 sm:mt-6 sm:p-6 lg:mx-8">
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
              backendExport={{
                endpoint: "/tickets/export",
                exportDataEndpoint: "/tickets/export-data",
                buildPayload: (columnKeys, format) => ({
                  format,
                  scope: "global",
                  ...getDefaultExportTimeframeParams(),
                  filters: {
                    ticketType,
                    ticketName,
                    eventId: null,
                    status: "All",
                    search: ticketName.trim(),
                  },
                  columns: columnKeys,
                }),
                buildExportDataParams: () => ({
                  ...getDefaultExportTimeframeParams(),
                  ticketType,
                  status: "All",
                  search: ticketName.trim(),
                }),
              }}
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
                  <th className="pb-3">Inventory</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Sale Status</th>

                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentTickets.length > 0 ? (
                  currentTickets.map((ticket) => {
                    const ticketCommerce =
                      ticketInventoryById[String(ticket.id)] ||
                      normalizeCommerceTicket(ticket, {
                        eventMode: ticket?.event?.eventType ?? ticket?.eventType ?? null,
                      });

                    return (
                      <tr
                        key={ticket.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                      >
                        <td className="py-3 text-sm font-semibold">
                          <div className="space-y-1">
                            <p>{ticket.name}</p>
                            {ticketCommerce.description ? (
                              <p className="max-w-[220px] text-xs font-normal text-gray-500">
                                {ticketCommerce.description}
                              </p>
                            ) : null}
                          </div>
                        </td>

                        <td className="py-3 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D19537]/15 text-[#D19537]">
                            {ticket.type}
                          </span>
                        </td>

                        <td className="py-3 text-sm">{ticket.eventName}</td>

                        <td className="py-3 text-sm">
                          <div className="space-y-1">
                            <p>{ticket.dateTime || "N/A"}</p>
                            <p className="text-xs text-gray-500">
                              {ticketCommerce.saleStartAt || ticketCommerce.saleEndAt
                                ? `${formatSalesDateTime(ticketCommerce.saleStartAt)} to ${formatSalesDateTime(ticketCommerce.saleEndAt)}`
                                : "Sales always open"}
                            </p>
                          </div>
                        </td>

                        <td className="py-3 text-sm">
                          <div className="space-y-1">
                            <p>
                              Total:{" "}
                              {ticketCommerce.quantity === null
                                ? "Unlimited"
                                : ticketCommerce.quantity}
                            </p>
                            <p className="text-xs text-gray-500">
                              Sold: {ticketCommerce.soldQuantity} • Remaining:{" "}
                              {ticketCommerce.remainingQuantity === null
                                ? "Unlimited"
                                : ticketCommerce.remainingQuantity}
                            </p>
                          </div>
                        </td>

                        <td className="py-3 text-sm">${ticket.price}</td>

                        <td className="py-3 text-sm">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                ticketCommerce.saleStatus === "on-sale"
                                  ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                                  : ticketCommerce.saleStatus === "sold-out"
                                    ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
                              }`}
                            >
                              {ticketCommerce.saleStatusLabel}
                            </span>
                            <p className="max-w-[210px] text-xs text-gray-500">
                              {ticketCommerce.saleStatusDetail}
                            </p>
                          </div>
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-500">
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
              currentTickets.map((ticket) => {
                const ticketCommerce =
                  ticketInventoryById[String(ticket.id)] ||
                  normalizeCommerceTicket(ticket, {
                    eventMode: ticket?.event?.eventType ?? ticket?.eventType ?? null,
                  });

                return (
                  <div
                    key={ticket.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-[#101010] shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2 gap-3">
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-semibold">{ticket.name}</h3>
                        {ticketCommerce.description ? (
                          <p className="mt-1 text-xs text-gray-500">
                            {ticketCommerce.description}
                          </p>
                        ) : null}
                      </div>

                      <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-[#D19537]/15 text-[#D19537]">
                        {ticket.type}
                      </span>
                    </div>

                    <div className="space-y-1 text-[13px] text-gray-600 dark:text-gray-300">
                      <p>
                        <span className="font-medium">Event:</span>{" "}
                        {ticket.eventName || ticket.event?.id || "N/A"}
                      </p>

                      <p>
                        <span className="font-medium">Date & Time:</span>{" "}
                        {ticket.dateTime || "N/A"}
                      </p>

                      <p>
                        <span className="font-medium">Inventory:</span>{" "}
                        {ticketCommerce.quantity === null
                          ? "Unlimited"
                          : ticketCommerce.quantity}{" "}
                        total • {ticketCommerce.soldQuantity} sold •{" "}
                        {ticketCommerce.remainingQuantity === null
                          ? "Unlimited"
                          : ticketCommerce.remainingQuantity}{" "}
                        remaining
                      </p>

                      <p>
                        <span className="font-medium">Sales:</span>{" "}
                        {ticketCommerce.saleStatusLabel} -{" "}
                        {ticketCommerce.saleStatusDetail}
                      </p>

                      <p>
                        <span className="font-medium">Price:</span> ${ticket.price}
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
                );
              })
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
            {(() => {
              const ticketCommerce =
                ticketInventoryById[String(editingTicket)] || null;

              return ticketCommerce ? (
                <div className="mb-5 grid gap-3 rounded-xl border border-[#D19537]/30 bg-[#FFF8EF] p-4 text-sm text-gray-700 dark:border-[#D19537]/20 dark:bg-[#101010] dark:text-gray-200 md:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Total quantity
                    </p>
                    <p className="mt-1 font-semibold">
                      {ticketCommerce.quantity === null
                        ? "Unlimited"
                        : ticketCommerce.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Sold
                    </p>
                    <p className="mt-1 font-semibold">{ticketCommerce.soldQuantity}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Remaining
                    </p>
                    <p className="mt-1 font-semibold">
                      {ticketCommerce.remainingQuantity === null
                        ? "Unlimited"
                        : ticketCommerce.remainingQuantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Sale status
                    </p>
                    <p className="mt-1 font-semibold">{ticketCommerce.saleStatusLabel}</p>
                  </div>
                  <p className="md:col-span-4 text-xs text-gray-500">
                    Quantity cannot be reduced below sold count. Sales window:{" "}
                    {ticketCommerce.saleStartAt || ticketCommerce.saleEndAt
                      ? `${formatSalesDateTime(ticketCommerce.saleStartAt)} to ${formatSalesDateTime(ticketCommerce.saleEndAt)}`
                      : "Always open"}
                  </p>
                </div>
              ) : null;
            })()}

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

            <div className="mb-6">
              <label className="text-sm font-medium mb-1 block">
                Description
              </label>
              <textarea
                className="min-h-[110px] w-full rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-[#101010]"
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Add ticket details, perks, or purchase notes"
              />
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
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Total Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  className="h-10 w-full px-3 rounded-lg border dark:border-gray-700 dark:bg-[#101010]"
                  value={ticketQuantityInput}
                  onChange={(e) => setTicketQuantityInput(e.target.value)}
                  placeholder="Leave blank for unlimited"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Sale Start
                </label>
                <input
                  type="datetime-local"
                  className="h-10 w-full px-3 rounded-lg border dark:border-gray-700 dark:bg-[#101010]"
                  value={ticketSaleStartAt}
                  onChange={(e) => setTicketSaleStartAt(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Sale End
                </label>
                <input
                  type="datetime-local"
                  className="h-10 w-full px-3 rounded-lg border dark:border-gray-700 dark:bg-[#101010]"
                  value={ticketSaleEndAt}
                  onChange={(e) => setTicketSaleEndAt(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Min per order
                </label>
                <input
                  type="number"
                  min="1"
                  className="h-10 w-full px-3 rounded-lg border dark:border-gray-700 dark:bg-[#101010]"
                  value={minOrder}
                  onChange={(e) => setMinOrder(Math.max(1, Number(e.target.value) || 1))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Max per order
                </label>
                <input
                  type="number"
                  min="1"
                  className="h-10 w-full px-3 rounded-lg border dark:border-gray-700 dark:bg-[#101010]"
                  value={maxOrder}
                  onChange={(e) => setMaxOrder(Math.max(1, Number(e.target.value) || 1))}
                />
              </div>
            </div>

            {/* Edit Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {allowRefunds ? (
                <ToggleRow
                  label="Refundable"
                  enabled={isRefundable}
                  onToggle={() => setIsRefundable(!isRefundable)}
                />
              ) : null}
              <ToggleRow
                label="Payment Plan"
                enabled={ticketPaymentPlanEnabled}
                onToggle={() =>
                  setTicketPaymentPlanEnabled(!ticketPaymentPlanEnabled)
                }
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
            window.location.href = isStaffDashboard ? "/sign-in-staff" : "/sign-in-host";
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
  backendExport,
  buttonClassName = "",
}: {
  rows: any[];
  filename: string;
  backendExport?: BackendTicketExportConfig;
  buttonClassName?: string;
}) {
  const [selectedColumnKeys, setSelectedColumnKeys] = useState<string[]>(
    DEFAULT_TICKET_EXPORT_COLUMN_KEYS
  );
  const [exportFormat, setExportFormat] = useState<TicketExportFormat>("csv");
  const [isExporting, setIsExporting] = useState(false);

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

  const exportLoadedRowsAsCsv = () => {
    const safeFilename = getSafeExportFilename(filename, "csv");

    downloadCsvExport(rows, selectedColumns, safeFilename);
    toast.success(`Exported ${rows.length} ticket row${rows.length === 1 ? "" : "s"}.`);
  };

  const exportFromBackend = async () => {
    if (!backendExport) return false;

    const safeFilename = getSafeExportFilename(filename, exportFormat);

    try {
      const res = await apiClient.post(
        backendExport.endpoint,
        backendExport.buildPayload(selectedColumnKeys, exportFormat),
        { responseType: "blob" }
      );
      const blob =
        res.data instanceof Blob
          ? res.data
          : new Blob([res.data], {
              type: getStringValue(getResponseHeader(res.headers, "content-type")),
            });

      if (isJsonBlobResponse(blob, res.headers)) {
        const json = await readBlobJson(blob);
        const data = json?.data ?? {};

        if (data.rowCount === 0) {
          toast.error("No ticket data available to export.");
          return true;
        }

        if (data.downloadUrl) {
          downloadFromUrl(data.downloadUrl, data.filename);
          toast.success(
            `Exported ${data.rowCount ?? rows.length} ticket row${
              data.rowCount === 1 ? "" : "s"
            }.`
          );
          return true;
        }

        throw new Error(
          json?.message ||
            json?.error?.message ||
            "Backend export response did not include a downloadable file."
        );
      }

      const headerFilename = getFilenameFromContentDisposition(
        getResponseHeader(res.headers, "content-disposition")
      );
      downloadBlobFile(blob, headerFilename || `${safeFilename}.${exportFormat}`);
      toast.success("Ticket export downloaded.");
      return true;
    } catch (error: any) {
      if (!isExportEndpointUnavailable(error)) {
        throw new Error(await getExportErrorMessage(error));
      }

      if (!backendExport.exportDataEndpoint) return false;

      if (exportFormat !== "csv") {
        throw new Error("XLSX export requires the backend file export endpoint.");
      }

      try {
        const exportRows = await fetchPaginatedExportRows(
          backendExport.exportDataEndpoint,
          backendExport.buildExportDataParams?.() ?? {}
        );

        if (!exportRows.length) {
          toast.error("No ticket data available to export.");
          return true;
        }

        downloadCsvExport(exportRows, selectedColumns, getSafeExportFilename(filename, "csv"));
        toast.success(
          `Exported ${exportRows.length} ticket row${
            exportRows.length === 1 ? "" : "s"
          }.`
        );
        return true;
      } catch (exportDataError: any) {
        if (isExportEndpointUnavailable(exportDataError)) return false;
        throw new Error(await getExportErrorMessage(exportDataError));
      }
    }
  };

  const handleExport = async () => {
    if (!rows.length) {
      toast.error("No ticket data available to export.");
      return;
    }

    if (!selectedColumns.length) {
      toast.error("Select at least one export column.");
      return;
    }

    setIsExporting(true);

    try {
      const downloadedFromBackend = await exportFromBackend();

      if (!downloadedFromBackend) {
        if (exportFormat !== "csv") {
          toast.error("XLSX export is not available for the loaded-row fallback.");
          return;
        }

        exportLoadedRowsAsCsv();
      }
    } catch (error: any) {
      toast.error(error?.message || "Ticket export failed.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-end">
      <select
        value={exportFormat}
        onChange={(event) => setExportFormat(event.target.value as TicketExportFormat)}
        className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 outline-none dark:border-gray-700 dark:bg-[#101010] dark:text-gray-200"
      >
        <option value="csv">CSV</option>
        <option value="xlsx">XLSX</option>
      </select>

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
        disabled={isExporting}
        className={`rounded-lg bg-[#D19537] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${buttonClassName}`}
      >
        {isExporting ? "Exporting..." : `Export ${exportFormat.toUpperCase()}`}
      </button>
    </div>
  );
}

function EventScopedTicketOperations({
  activeTenantAction,
  actionOptions,
  applyTenantAction,
  canRunTenantAction,
  closeTenantAction,
  dashboardMode,
  eventCustomersPage,
  eventCustomersTotalPages,
  eventId,
  eventTicketSearch,
  eventTicketStatus,
  eventTicketTypeId,
  eventTicketsLoading,
  eventTitle,
  filteredEventTicketRows,
  openTenantAction,
  selectedDisplayTicket,
  setEventCustomersPage,
  setEventTicketSearch,
  setEventTicketStatus,
  setEventTicketTypeId,
  setTenantActionFields,
  tenantActionFields,
  tenantActionDetailLoading,
  tenantActionDetails,
  tenantActionError,
  tenantActionLoadingKey,
  tickets,
}: {
  activeTenantAction: TenantTicketAction | null;
  actionOptions: TenantTicketAction[];
  applyTenantAction: () => Promise<void>;
  canRunTenantAction: (
    action: TenantTicketAction,
    ticket: EventTicketCustomer
  ) => boolean;
  closeTenantAction: () => void;
  dashboardMode: "host" | "staff";
  eventCustomersPage: number;
  eventCustomersTotalPages: number;
  eventId?: string;
  eventTicketSearch: string;
  eventTicketStatus: string;
  eventTicketTypeId: string;
  eventTicketsLoading: boolean;
  eventTitle?: string;
  filteredEventTicketRows: EventTicketCustomer[];
  openTenantAction: (
    action: TenantTicketAction,
    ticket: EventTicketCustomer
  ) => void;
  selectedDisplayTicket: EventTicketCustomer | null;
  setEventCustomersPage: Dispatch<SetStateAction<number>>;
  setEventTicketSearch: Dispatch<SetStateAction<string>>;
  setEventTicketStatus: Dispatch<SetStateAction<string>>;
  setEventTicketTypeId: Dispatch<SetStateAction<string>>;
  setTenantActionFields: Dispatch<SetStateAction<TenantActionFields>>;
  tenantActionFields: TenantActionFields;
  tenantActionDetailLoading: boolean;
  tenantActionDetails: TenantActionDetails;
  tenantActionError: string;
  tenantActionLoadingKey: string | null;
  tickets: any[];
}) {
  const isStaffDashboard = dashboardMode === "staff";
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

  const selectedTicketType = tickets.find((ticket: any) => {
    const typeId = String(ticket.id ?? ticket._id ?? ticket.type ?? "");
    return typeId === eventTicketTypeId || ticket.type === eventTicketTypeId;
  });
  const selectedTicketTypeFilter =
    eventTicketTypeId === "All"
      ? "All"
      : getStringValue(
          selectedTicketType?.type ?? selectedTicketType?.name,
          eventTicketTypeId
        );

  return (
    <>
      <div className="mx-3 mt-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#1a1a1a] sm:mx-6 sm:mt-6 sm:p-5 lg:mx-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <button
              onClick={() => window.history.back()}
              className="mb-3 text-sm font-semibold text-[#D19537]"
            >
              Back to events
            </button>
            <h2 className="break-words text-lg font-semibold sm:text-xl">
              {eventTitle || "Selected event"} tickets
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              {isStaffDashboard
                ? "Staff scoped operations only apply to event ID"
                : "Event scoped tenant operations only apply to event ID"}{" "}
              <span className="break-all font-semibold text-gray-900 dark:text-white">
                {eventId}
              </span>
              .
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 text-sm lg:w-auto lg:min-w-[360px]">
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

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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
            <option>Unused</option>
            <option>Transfer Pending</option>
            <option>Cancelled</option>
            <option>Reclaimed</option>
            <option>Force Reclaimed</option>
          </select>
          <select
            value={eventTicketTypeId}
            onChange={(e) => setEventTicketTypeId(e.target.value)}
            className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none dark:border-gray-700 dark:bg-[#101010]"
          >
            <option value="All">All ticket types</option>
            {tickets.map((ticket: any) => {
              const typeId = String(ticket.id ?? ticket._id ?? ticket.type ?? "");

              return (
                <option key={typeId || ticket.name} value={typeId || ticket.type}>
                  {ticket.name ?? ticket.type ?? "Ticket type"}
                </option>
              );
            })}
          </select>
          {!isStaffDashboard && (
            <Link className="md:col-span-2 xl:col-span-1" href="/ticket-manager">
              <button className="h-11 w-full rounded-lg border border-[#D19537] px-4 text-sm font-semibold text-[#D19537]">
                Open global ticket manager
              </button>
            </Link>
          )}
          <div className="md:col-span-2 xl:col-span-2">
            <TicketExportControls
              rows={filteredEventTicketRows.map((row) => ({
                ...row,
                eventId,
                eventName: eventTitle,
              }))}
              filename={`event-${eventId || "tickets"}-export`}
              backendExport={
                eventId
                  ? {
                      endpoint: `/events/${eventId}/tickets/export`,
                      exportDataEndpoint: `/events/${eventId}/tickets/export-data`,
                      buildPayload: (columnKeys, format) => ({
                        format,
                        ...getDefaultExportTimeframeParams(),
                        filters: {
                          status: eventTicketStatus,
                          search: eventTicketSearch.trim(),
                          ticketType: selectedTicketTypeFilter,
                        },
                        columns: columnKeys,
                      }),
                      buildExportDataParams: () => ({
                        ...getDefaultExportTimeframeParams(),
                        status: eventTicketStatus,
                        search: eventTicketSearch.trim(),
                        ticketType: selectedTicketTypeFilter,
                      }),
                    }
                  : undefined
              }
              buttonClassName="h-11 w-full"
            />
          </div>
        </div>
      </div>

      <div className="mx-3 mt-5 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-[#1a1a1a] sm:mx-6 sm:p-5 lg:mx-8 lg:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Event ticket operations</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {isStaffDashboard
                ? "Staff actions are shown per ticket row."
                : "Tenant-only actions are shown per ticket row."}
            </p>
          </div>
          <span className="rounded-full bg-[#D19537]/15 px-3 py-1 text-xs font-semibold text-[#D19537]">
            {isStaffDashboard ? "Staff scoped" : "Event scoped"}
          </span>
        </div>

        <div className="space-y-3 md:hidden">
          {eventTicketsLoading ? (
            <div className="rounded-lg border border-gray-100 p-4 text-center text-sm text-gray-500 dark:border-gray-800">
              Loading event tickets...
            </div>
          ) : filteredEventTicketRows.length === 0 ? (
            <div className="rounded-lg border border-gray-100 p-4 text-center text-sm text-gray-500 dark:border-gray-800">
              No tickets found for this event.
            </div>
          ) : (
            filteredEventTicketRows.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-lg border border-gray-100 p-4 dark:border-gray-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold">{ticket.name}</p>
                    <p className="break-all text-xs text-gray-500">{ticket.email}</p>
                  </div>
                  <button
                    aria-label={`Open actions for ${ticket.name}`}
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) =>
                      toggleActionMenu(ticket, event.currentTarget)
                    }
                    className="inline-flex shrink-0 items-center justify-center p-1 text-gray-600 hover:text-[#D19537] dark:text-gray-200 dark:hover:text-[#D19537]"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Ticket</p>
                    <p className="break-words font-medium">{ticket.ticketName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Qty</p>
                    <p className="font-medium">{ticket.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="font-medium">{ticket.status || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rank</p>
                    <p className="font-medium">{formatTicketRankLabel(ticket.rank)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Agent ID</p>
                    <p className="break-words font-medium">
                      {ticket.agentId || "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="break-words font-medium">{ticket.ticketType || "N/A"}</p>
                  </div>
                </div>
                <p className="mt-3 break-all text-xs text-gray-500">
                  {ticket.ticketId}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
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
                      {formatTicketRankLabel(ticket.rank)}
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
            {actionOptions.map((action) => {
              const disabled =
                !canRunTenantAction(action, openActionTicket) ||
                tenantActionLoadingKey ===
                  getTenantActionLoadingKey(openActionTicket, action);

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
          <div className="mt-6 flex flex-wrap justify-center gap-2">
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

            {tenantActionError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {tenantActionError}
              </div>
            )}

            {activeTenantAction === "Check In" && (
              <ActionField label="Check-in note">
                <textarea
                  value={tenantActionFields.note}
                  onChange={(e) =>
                    setTenantActionFields((fields) => ({
                      ...fields,
                      note: e.target.value,
                    }))
                  }
                  className="min-h-[90px] w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-[#101010]"
                  placeholder="Checked in manually by tenant"
                />
              </ActionField>
            )}

            {activeTenantAction === "Uncheck" && (
              <>
                <ActionField label="Who can uncheck this">
                  <select
                    value={tenantActionFields.uncheckByRole}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        uncheckByRole: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                  >
                    {uncheckRoleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </ActionField>
                <ActionField label="Date and time">
                  <input
                    type="text"
                    value={formatDateTime(tenantActionFields.uncheckAt)}
                    readOnly
                    className="h-10 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-[#101010] dark:text-gray-200"
                  />
                </ActionField>
                <ActionField label="Reason">
                  <textarea
                    value={tenantActionFields.reason}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        reason: e.target.value,
                      }))
                    }
                    className="min-h-[100px] w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-[#101010]"
                    placeholder="Explain why this ticket is being marked unused"
                  />
                </ActionField>
              </>
            )}

            {activeTenantAction === "Transfer" && (
              <>
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
                <ActionField label="Reason">
                  <input
                    type="text"
                    value={tenantActionFields.reason}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        reason: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                    placeholder="Customer requested transfer"
                  />
                </ActionField>
                <ToggleField
                  checked={tenantActionFields.notifyRecipient}
                  label="Notify recipient"
                  onChange={(checked) =>
                    setTenantActionFields((fields) => ({
                      ...fields,
                      notifyRecipient: checked,
                    }))
                  }
                />
              </>
            )}

            {activeTenantAction === "Cancel / Refund" && (
              <>
                <ActionField label="Refund type">
                  <select
                    value={tenantActionFields.refundType}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        refundType: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                  >
                    <option value="full">Full</option>
                    <option value="partial">Partial</option>
                  </select>
                </ActionField>
                {tenantActionFields.refundType === "partial" && (
                  <ActionField label="Refund amount">
                    <input
                      type="number"
                      min="0"
                      value={tenantActionFields.refundAmount}
                      onChange={(e) =>
                        setTenantActionFields((fields) => ({
                          ...fields,
                          refundAmount: e.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                      placeholder="25"
                    />
                  </ActionField>
                )}
                <ActionField label="Reason">
                  <input
                    type="text"
                    value={tenantActionFields.reason}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        reason: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                    placeholder="Customer requested cancellation"
                  />
                </ActionField>
                <ToggleField
                  checked={tenantActionFields.notifyCustomer}
                  label="Notify customer"
                  onChange={(checked) =>
                    setTenantActionFields((fields) => ({
                      ...fields,
                      notifyCustomer: checked,
                    }))
                  }
                />
              </>
            )}

            {activeTenantAction === "Change Ticket Type" && (
              <>
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
                      tickets.map((ticket: any) => {
                        const typeId = String(ticket.id ?? ticket._id ?? ticket.type ?? "");

                        return (
                          <option
                            key={typeId || ticket.name}
                            value={typeId || ticket.type || ticket.name}
                          >
                            {ticket.name ?? ticket.type}{" "}
                            {ticket.price ? `- $${ticket.price}` : ""}
                          </option>
                        );
                      })
                    ) : (
                      <option value={selectedDisplayTicket.ticketTypeId}>
                        {selectedDisplayTicket.ticketType}
                      </option>
                    )}
                  </select>
                </ActionField>
                <ActionField label="Adjustment mode">
                  <select
                    value={tenantActionFields.adjustmentMode}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        adjustmentMode: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                  >
                    <option value="charge_difference">Charge difference</option>
                    <option value="refund_difference">Refund difference</option>
                    <option value="no_charge">No charge</option>
                    <option value="manual_offline">Manual offline</option>
                  </select>
                </ActionField>
                <ActionField label="Payment method ID">
                  <input
                    type="text"
                    value={tenantActionFields.paymentMethodId}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        paymentMethodId: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                    placeholder="pm_123"
                  />
                </ActionField>
                <ActionField label="Reason">
                  <input
                    type="text"
                    value={tenantActionFields.reason}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        reason: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                    placeholder="Customer upgraded to VIP"
                  />
                </ActionField>
              </>
            )}

            {activeTenantAction === "Update Rank" && (
              <>
                <ActionField label="Rank">
                  <select
                    value={tenantActionFields.rank}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        rank: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                  >
                    {TICKET_RANK_OPTIONS.map((rank) => (
                      <option key={rank.label} value={rank.label}>
                        {rank.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Saved to API as "{getBackendTicketRankValue(tenantActionFields.rank)}"
                    for backend compatibility.
                  </p>
                </ActionField>
                <ActionField label="Reason">
                  <input
                    type="text"
                    value={tenantActionFields.reason}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        reason: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                    placeholder="Tenant upgraded customer rank"
                  />
                </ActionField>
              </>
            )}

            {activeTenantAction === "Assign Agent ID" && (
              <>
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
                <ActionField label="Reason">
                  <input
                    type="text"
                    value={tenantActionFields.reason}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        reason: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                    placeholder="Assigned by tenant"
                  />
                </ActionField>
              </>
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

            {activeTenantAction === "Edit Note" && (
              <>
                {tenantActionDetailLoading ? (
                  <p className="mt-5 text-sm text-gray-500">Loading notes...</p>
                ) : tenantActionDetails.notes.length === 0 ? (
                  <p className="mt-5 text-sm text-gray-500">
                    No internal notes are available to edit.
                  </p>
                ) : (
                  <>
                    <ActionField label="Select note">
                      <select
                        value={tenantActionFields.editNoteId}
                        onChange={(e) => {
                          const selectedNote = tenantActionDetails.notes.find(
                            (note) => note.noteId === e.target.value
                          );

                          setTenantActionFields((fields) => ({
                            ...fields,
                            editNoteId: e.target.value,
                            note: selectedNote?.note ?? "",
                          }));
                        }}
                        className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                      >
                        {tenantActionDetails.notes.map((note) => (
                          <option key={note.noteId} value={note.noteId}>
                            {note.note.slice(0, 60) || note.noteId}
                          </option>
                        ))}
                      </select>
                    </ActionField>
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
                        placeholder="Update the tenant-only note"
                      />
                    </ActionField>
                  </>
                )}
              </>
            )}

            {activeTenantAction === "Reclaim Ticket" && (
              <>
                <ActionField label="Reason">
                  <input
                    type="text"
                    value={tenantActionFields.reason}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        reason: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                    placeholder="Ticket was transferred incorrectly"
                  />
                </ActionField>
                <ToggleField
                  checked={tenantActionFields.notifyCustomer}
                  label="Notify customer"
                  onChange={(checked) =>
                    setTenantActionFields((fields) => ({
                      ...fields,
                      notifyCustomer: checked,
                    }))
                  }
                />
              </>
            )}

            {activeTenantAction === "Force Reclaim" && (
              <>
                <ActionField label="Claim for customer ID">
                  <input
                    type="text"
                    value={tenantActionFields.claimForCustomerId}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        claimForCustomerId: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                    placeholder="user_456"
                  />
                </ActionField>
                <ActionField label="Reason">
                  <input
                    type="text"
                    value={tenantActionFields.reason}
                    onChange={(e) =>
                      setTenantActionFields((fields) => ({
                        ...fields,
                        reason: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border px-3 text-sm dark:border-gray-700 dark:bg-[#101010]"
                    placeholder="Manual tenant override"
                  />
                </ActionField>
                <ToggleField
                  checked={tenantActionFields.notifyCustomer}
                  label="Notify customer"
                  onChange={(checked) =>
                    setTenantActionFields((fields) => ({
                      ...fields,
                      notifyCustomer: checked,
                    }))
                  }
                />
              </>
            )}

            {activeTenantAction === "View Ticket" && (
              tenantActionDetailLoading ? (
                <p className="mt-5 text-sm text-gray-500">Loading ticket...</p>
              ) : (
                <DetailList
                  items={[
                    [
                      "Ticket ID",
                      getStringValue(
                        tenantActionDetails.ticket?.ticketPurchaseId,
                        selectedDisplayTicket.ticketId
                      ),
                    ],
                    [
                      "Ticket Type",
                      getStringValue(
                        tenantActionDetails.ticket?.ticketType,
                        selectedDisplayTicket.ticketType
                      ),
                    ],
                    [
                      "Ticket Name",
                      getStringValue(
                        tenantActionDetails.ticket?.ticketName,
                        selectedDisplayTicket.ticketName
                      ),
                    ],
                    [
                      "Quantity",
                      getStringValue(
                        tenantActionDetails.ticket?.quantity,
                        String(selectedDisplayTicket.quantity)
                      ),
                    ],
                    [
                      "Checked In",
                      tenantActionDetails.ticket?.checkedIn ??
                      selectedDisplayTicket.checkedIn
                        ? "Yes"
                        : "No",
                    ],
                    [
                      "Checked In At",
                      getStringValue(
                        tenantActionDetails.ticket?.checkedInAt ??
                          tenantActionDetails.ticket?.usedAt,
                        "N/A"
                      ),
                    ],
                    [
                      "Checked In By",
                      getStringValue(
                        tenantActionDetails.ticket?.checkedInBy ??
                          tenantActionDetails.ticket?.usedBy,
                        "N/A"
                      ),
                    ],
                    [
                      "Status",
                      getStringValue(
                        tenantActionDetails.ticket?.status,
                        selectedDisplayTicket.status
                      ),
                    ],
                    [
                      "Event ID",
                      getStringValue(
                        tenantActionDetails.ticket?.eventId,
                        selectedDisplayTicket.eventId ?? eventId ?? "N/A"
                      ),
                    ],
                    [
                      "Order ID",
                      getStringValue(
                        tenantActionDetails.ticket?.orderId,
                        selectedDisplayTicket.orderId
                      ),
                    ],
                    [
                      "QR Code",
                      getStringValue(tenantActionDetails.ticket?.qrCodeUrl, "N/A"),
                    ],
                  ]}
                />
              )
            )}

            {activeTenantAction === "View Receipt" && (
              tenantActionDetailLoading ? (
                <p className="mt-5 text-sm text-gray-500">Loading receipt...</p>
              ) : (
                <DetailList
                  items={[
                    [
                      "Receipt ID",
                      getStringValue(
                        tenantActionDetails.receipt?.receiptId ??
                          tenantActionDetails.receipt?.purchase?.confirmationNumber,
                        selectedDisplayTicket.receiptId
                      ),
                    ],
                    [
                      "Order ID",
                      getStringValue(
                        tenantActionDetails.receipt?.orderId ??
                          tenantActionDetails.receipt?.purchase?.id,
                        selectedDisplayTicket.orderId
                      ),
                    ],
                    [
                      "Attendee",
                      getStringValue(
                        tenantActionDetails.receipt?.customerName ??
                          tenantActionDetails.receipt?.buyer?.name,
                        selectedDisplayTicket.name
                      ),
                    ],
                    [
                      "Email",
                      getStringValue(
                        tenantActionDetails.receipt?.customerEmail ??
                          tenantActionDetails.receipt?.buyer?.email,
                        selectedDisplayTicket.email
                      ),
                    ],
                    [
                      "Total",
                      formatReceiptAmount(
                        tenantActionDetails.receipt?.currency ??
                          tenantActionDetails.receipt?.purchase?.currency,
                        tenantActionDetails.receipt?.total ??
                          tenantActionDetails.receipt?.purchase?.totalAmount
                      ),
                    ],
                    [
                      "Payment Status",
                      getStringValue(
                        tenantActionDetails.receipt?.paymentStatus ??
                          tenantActionDetails.receipt?.purchase?.status,
                        "N/A"
                      ),
                    ],
                    [
                      "Paid At",
                      getStringValue(
                        tenantActionDetails.receipt?.paidAt ??
                          tenantActionDetails.receipt?.purchase?.paidAt,
                        "N/A"
                      ),
                    ],
                  ]}
                />
              )
            )}

            {activeTenantAction === "View History" && (
              <div className="mt-5 rounded-lg border p-4 dark:border-gray-700">
                <h4 className="mb-3 font-semibold">History</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {tenantActionDetailLoading ? (
                    <p>Loading history...</p>
                  ) : tenantActionDetails.history.length === 0 ? (
                    <p>No history found.</p>
                  ) : (
                    tenantActionDetails.history.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg bg-[#FAFAFB] p-3 dark:bg-[#101010]"
                      >
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {item.label}
                        </p>
                        {item.description && <p>{item.description}</p>}
                        <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                          <InfoField label="Ticket ID" value={item.ticketId || "N/A"} />
                          <InfoField label="Event ID" value={item.eventId || "N/A"} />
                          <InfoField label="Order ID" value={item.orderId || "N/A"} />
                          <InfoField
                            label="Action Type"
                            value={item.actionType || "N/A"}
                          />
                          <InfoField
                            label="Field Changed"
                            value={item.fieldChanged || "N/A"}
                          />
                          <InfoField label="Old Value" value={item.oldValue || "N/A"} />
                          <InfoField label="New Value" value={item.newValue || "N/A"} />
                          <InfoField label="Reason" value={item.reason || "N/A"} />
                          <InfoField
                            label="Performed By User ID"
                            value={item.performedByUserId || "N/A"}
                          />
                          <InfoField
                            label="Performed By Role"
                            value={item.performedByRole || "N/A"}
                          />
                          <InfoField
                            label="Performed At"
                            value={formatDateTime(item.performedAt || item.createdAt)}
                          />
                          <InfoField label="Source" value={item.source || "N/A"} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {(activeTenantAction === "Add Note" ||
              activeTenantAction === "Edit Note") &&
              tenantActionDetails.notes.length > 0 && (
              <div className="mt-5 rounded-lg border p-4 dark:border-gray-700">
                <h4 className="mb-3 font-semibold">Internal notes</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {tenantActionDetails.notes.map((note) => (
                    <div
                      key={note.noteId}
                      className="rounded-lg bg-[#FAFAFB] p-3 dark:bg-[#101010]"
                    >
                      <p>{note.note}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {note.visibility} - {note.createdAt || "N/A"}
                      </p>
                    </div>
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
                  disabled={
                    tenantActionLoadingKey ===
                    getTenantActionLoadingKey(selectedDisplayTicket, activeTenantAction)
                  }
                  className="rounded-lg bg-[#D19537] px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {tenantActionLoadingKey ===
                  getTenantActionLoadingKey(selectedDisplayTicket, activeTenantAction)
                    ? "Saving..."
                    : "Save action"}
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

function ToggleField({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="mt-5 flex items-center justify-between rounded-lg border px-4 py-3 dark:border-gray-700">
      <span className="text-sm font-semibold">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-[#D19537]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-[22px] w-[22px] rounded-full bg-white transition-transform ${
            checked ? "translate-x-[20px]" : "translate-x-0"
          }`}
        />
      </button>
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
