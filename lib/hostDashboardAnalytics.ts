"use client";

export type TimeframePreset =
  | "last7"
  | "last30"
  | "last90"
  | "yearToDate"
  | "custom";

export type DashboardTimeframe = {
  preset: TimeframePreset;
  startDate: string;
  endDate: string;
};

export type TicketTypeBreakdown = {
  ticketType: string;
  ticketsSold: number;
  revenue: number;
  percentage?: number;
};

export type TicketExportColumn = {
  key: string;
  label: string;
  getValue: (row: any) => string | number | boolean | null | undefined;
};

export const DEFAULT_TIMEFRAME_PRESET: TimeframePreset = "last90";

export const TIMEFRAME_OPTIONS: Array<{
  value: TimeframePreset;
  label: string;
}> = [
  { value: "last7", label: "Last 7 days" },
  { value: "last30", label: "Last 30 days" },
  { value: "last90", label: "Last 90 days" },
  { value: "yearToDate", label: "Year to date" },
  { value: "custom", label: "Custom range" },
];

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const createTimeframe = (
  preset: TimeframePreset = DEFAULT_TIMEFRAME_PRESET,
  baseDate = new Date()
): DashboardTimeframe => {
  const today = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate()
  );

  if (preset === "last7") {
    return {
      preset,
      startDate: formatLocalDate(addDays(today, -6)),
      endDate: formatLocalDate(today),
    };
  }

  if (preset === "last30") {
    return {
      preset,
      startDate: formatLocalDate(addDays(today, -29)),
      endDate: formatLocalDate(today),
    };
  }

  if (preset === "yearToDate") {
    return {
      preset,
      startDate: formatLocalDate(new Date(today.getFullYear(), 0, 1)),
      endDate: formatLocalDate(today),
    };
  }

  return {
    preset,
    startDate: formatLocalDate(addDays(today, -89)),
    endDate: formatLocalDate(today),
  };
};

export const updateCustomTimeframe = (
  timeframe: DashboardTimeframe,
  patch: Partial<Pick<DashboardTimeframe, "startDate" | "endDate">>
): DashboardTimeframe => ({
  ...timeframe,
  ...patch,
  preset: "custom",
});

export const getTimeframeParams = (timeframe: DashboardTimeframe) => ({
  timeframe: timeframe.preset,
  startDate: timeframe.startDate,
  endDate: timeframe.endDate,
});

export const getTimeframeLabel = (timeframe: DashboardTimeframe) => {
  const option = TIMEFRAME_OPTIONS.find((item) => item.value === timeframe.preset);

  if (!option || timeframe.preset === "custom") {
    return `${timeframe.startDate} to ${timeframe.endDate}`;
  }

  return option.label;
};

export const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);

const toNumber = (value: any) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const firstDefined = (...values: any[]) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const toText = (value: any) => {
  if (value === undefined || value === null || value === "") return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? value.join("; ") : "N/A";
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${key}: ${String(item ?? "")}`)
      .join("; ");
  }

  return String(value);
};

const splitName = (row: any) => {
  const fullName = toText(
    firstDefined(
      row.fullName,
      row.name,
      row.customerName,
      row.customer?.name,
      row.user?.fullName,
      row.user?.name
    )
  );

  if (fullName === "N/A") {
    return { firstName: "N/A", lastName: "N/A" };
  }

  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? "N/A",
    lastName: parts.slice(1).join(" ") || "N/A",
  };
};

const getFirstName = (row: any) =>
  toText(firstDefined(row.firstName, row.customer?.firstName, row.user?.firstName, splitName(row).firstName));

const getLastName = (row: any) =>
  toText(firstDefined(row.lastName, row.customer?.lastName, row.user?.lastName, splitName(row).lastName));

const getPayment = (row: any) =>
  firstDefined(row.payment, row.billing, row.order?.payment, row.receipt?.payment, {});

const getTicket = (row: any) => firstDefined(row.ticket, row.order?.ticket, {});

const getEvent = (row: any) => firstDefined(row.event, row.order?.event, {});

export const TICKET_EXPORT_COLUMNS: TicketExportColumn[] = [
  {
    key: "firstName",
    label: "First Name",
    getValue: getFirstName,
  },
  {
    key: "lastName",
    label: "Last Name",
    getValue: getLastName,
  },
  {
    key: "email",
    label: "Email",
    getValue: (row) =>
      firstDefined(row.email, row.customer?.email, row.user?.email, row.attendee?.email),
  },
  {
    key: "phoneNumber",
    label: "Phone Number",
    getValue: (row) =>
      firstDefined(
        row.phoneNumber,
        row.phone,
        row.customer?.phoneNumber,
        row.customer?.phone,
        row.user?.phoneNumber,
        row.user?.phone
      ),
  },
  {
    key: "ticketType",
    label: "Ticket Type",
    getValue: (row) =>
      firstDefined(row.ticketType, row.type, getTicket(row)?.type, getTicket(row)?.name, row.ticketName),
  },
  {
    key: "ticketNumber",
    label: "Ticket Number",
    getValue: (row) =>
      firstDefined(row.ticketNumber, row.ticketNo, row.ticketId, row.id, getTicket(row)?.id, getTicket(row)?._id),
  },
  {
    key: "ticketStatus",
    label: "Ticket Status",
    getValue: (row) => firstDefined(row.status, row.ticketStatus, getTicket(row)?.status),
  },
  {
    key: "orderDate",
    label: "Order Date",
    getValue: (row) =>
      firstDefined(
        row.orderDate,
        row.purchaseDate,
        row.purchasedAt,
        row.registeredAt,
        row.createdAt,
        row.dateTime,
        row.order?.createdAt
      ),
  },
  {
    key: "ticketPrice",
    label: "Ticket Price",
    getValue: (row) =>
      firstDefined(row.ticketPrice, row.price, getTicket(row)?.price, row.order?.ticketPrice),
  },
  {
    key: "serviceFee",
    label: "Service Fee",
    getValue: (row) =>
      firstDefined(row.serviceFee, row.fees?.service, row.order?.serviceFee, getPayment(row)?.serviceFee),
  },
  {
    key: "processingFee",
    label: "Processing Fee",
    getValue: (row) =>
      firstDefined(row.processingFee, row.fees?.processing, row.order?.processingFee, getPayment(row)?.processingFee),
  },
  {
    key: "customOrderFormAnswers",
    label: "Custom Order Form Answers",
    getValue: (row) =>
      firstDefined(
        row.customOrderFormAnswers,
        row.customAnswers,
        row.orderFormAnswers,
        row.answers,
        row.order?.customOrderFormAnswers
      ),
  },
  {
    key: "billingAmount",
    label: "Billing Amount",
    getValue: (row) =>
      firstDefined(
        row.billingAmount,
        row.totalAmount,
        row.amount,
        row.order?.billingAmount,
        getPayment(row)?.amount
      ),
  },
  {
    key: "cardLast4",
    label: "Card Number (Last 4)",
    getValue: (row) =>
      firstDefined(
        row.cardLast4,
        row.cardNumberLast4,
        row.last4,
        getPayment(row)?.cardLast4,
        getPayment(row)?.card?.last4
      ),
  },
  {
    key: "cardholderName",
    label: "Cardholder Name",
    getValue: (row) =>
      firstDefined(row.cardholderName, row.cardHolderName, getPayment(row)?.cardholderName, getPayment(row)?.card?.name),
  },
  {
    key: "note",
    label: "Note",
    getValue: (row) => firstDefined(row.note, row.notes, row.internalNote, row.history),
  },
  {
    key: "event",
    label: "Event",
    getValue: (row) =>
      firstDefined(row.eventName, row.eventTitle, getEvent(row)?.name, getEvent(row)?.title, getEvent(row)?.id),
  },
  {
    key: "eventId",
    label: "Event ID",
    getValue: (row) => firstDefined(row.eventId, getEvent(row)?.id, getEvent(row)?._id),
  },
  {
    key: "checkInStatus",
    label: "Check In Status",
    getValue: (row) =>
      firstDefined(row.checkInStatus, row.checkedIn, row.checkIn?.status, row.checkIn?.checkedIn),
  },
  {
    key: "transferStatus",
    label: "Transfer Status",
    getValue: (row) =>
      firstDefined(row.transferStatus, row.transfer?.status, row.isTransferable),
  },
  {
    key: "refundStatus",
    label: "Refund Status",
    getValue: (row) =>
      firstDefined(row.refundStatus, row.refund?.status, row.isRefundable),
  },
  {
    key: "receiptId",
    label: "Receipt ID",
    getValue: (row) => firstDefined(row.receiptId, row.invoiceId, row.paymentId, row.receipt?.id),
  },
  {
    key: "orderId",
    label: "Order ID",
    getValue: (row) => firstDefined(row.orderId, row.order?.id, row.order?._id),
  },
  {
    key: "quantity",
    label: "Quantity",
    getValue: (row) => firstDefined(row.quantity, row.qty, row.order?.quantity),
  },
  {
    key: "rank",
    label: "Rank",
    getValue: (row) => firstDefined(row.rank, row.user?.rank),
  },
  {
    key: "agentId",
    label: "Agent ID",
    getValue: (row) => firstDefined(row.agentId, row.user?.agentId),
  },
];

export const DEFAULT_TICKET_EXPORT_COLUMN_KEYS = TICKET_EXPORT_COLUMNS.map(
  (column) => column.key
);

const escapeCsvCell = (value: any) => {
  const text = toText(value).replace(/\r?\n/g, " ");
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
};

export const buildTicketCsv = (
  rows: any[],
  columns: TicketExportColumn[]
) => {
  const header = columns.map((column) => escapeCsvCell(column.label)).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((column) => escapeCsvCell(column.getValue(row)))
        .join(",")
    )
    .join("\n");

  return [header, body].filter(Boolean).join("\n");
};

export const downloadCsvExport = (
  rows: any[],
  columns: TicketExportColumn[],
  filename: string
) => {
  const csv = buildTicketCsv(rows, columns);
  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const normalizeBreakdownItem = (item: any): TicketTypeBreakdown => ({
  ticketType: toText(
    firstDefined(item.ticketType, item.type, item.name, item.label, item.ticketName)
  ),
  ticketsSold: toNumber(
    firstDefined(item.ticketsSold, item.ticketCount, item.count, item.quantity, item.sold)
  ),
  revenue: toNumber(firstDefined(item.revenue, item.amount, item.totalRevenue, item.sales)),
  percentage:
    firstDefined(item.percentage, item.percent) === undefined
      ? undefined
      : toNumber(firstDefined(item.percentage, item.percent)),
});

const readBreakdownArray = (...values: any[]) => {
  const source = values.find((value) => Array.isArray(value));
  return Array.isArray(source) ? source.map(normalizeBreakdownItem) : [];
};

const mergeBreakdowns = (
  primary: TicketTypeBreakdown[],
  secondary: TicketTypeBreakdown[]
) => {
  const map = new Map<string, TicketTypeBreakdown>();

  [...primary, ...secondary].forEach((item) => {
    const key = item.ticketType || "Unknown";
    const current = map.get(key) ?? {
      ticketType: key,
      ticketsSold: 0,
      revenue: 0,
      percentage: item.percentage,
    };

    map.set(key, {
      ticketType: key,
      ticketsSold: current.ticketsSold || item.ticketsSold,
      revenue: current.revenue || item.revenue,
      percentage: current.percentage ?? item.percentage,
    });
  });

  return Array.from(map.values());
};

export const normalizeTicketTypeBreakdowns = (data: any) => {
  const ticketBreakdown = readBreakdownArray(
    data?.ticketTypeBreakdown,
    data?.ticketBreakdown,
    data?.ticketsByType,
    data?.stats?.ticketTypeBreakdown,
    data?.stats?.ticketsByType,
    data?.analytics?.ticketTypeBreakdown,
    data?.analytics?.ticketBreakdownByType,
    data?.reports?.ticketTypeBreakdown,
    data?.breakdowns?.ticketTypes
  );

  const revenueBreakdown = readBreakdownArray(
    data?.revenueByTicketType,
    data?.revenueBreakdown,
    data?.stats?.revenueByTicketType,
    data?.analytics?.revenueByTicketType,
    data?.analytics?.revenueBreakdownByType,
    data?.reports?.revenueByTicketType,
    data?.breakdowns?.revenueByTicketType
  );

  const combined = mergeBreakdowns(ticketBreakdown, revenueBreakdown);

  return {
    ticketBreakdown: combined.filter((item) => item.ticketsSold > 0 || item.revenue > 0),
    revenueBreakdown: combined.filter((item) => item.revenue > 0 || item.ticketsSold > 0),
  };
};
