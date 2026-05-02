export type CheckoutFieldSection = "basic" | "contact";

export type CheckoutFieldKey =
  | "firstName"
  | "lastName"
  | "email"
  | "gender"
  | "phone"
  | "city"
  | "pincode"
  | "address"
  | "website";

export type CheckoutFieldDefinition = {
  key: CheckoutFieldKey;
  label: string;
  section: CheckoutFieldSection;
  placeholder: string;
  requiredByDefault: boolean;
  optionalLabel?: string;
};

export type CheckoutFieldConfig = {
  key: CheckoutFieldKey;
  label: string;
  section: CheckoutFieldSection;
  placeholder: string;
  required: boolean;
  enabled: boolean;
};

export type TicketSaleStatus =
  | "on-sale"
  | "sales-not-started"
  | "sales-closed"
  | "sold-out";

export type NormalizedCommerceTicket = {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  attendanceMode: "in-person" | "virtual" | null;
  quantity: number | null;
  soldQuantity: number;
  remainingQuantity: number | null;
  minOrder: number;
  maxOrder: number | null;
  saleStartAt: Date | null;
  saleEndAt: Date | null;
  saleStatus: TicketSaleStatus;
  saleStatusLabel: string;
  saleStatusDetail: string;
  transferable: boolean;
  refundable: boolean;
  paymentPlanEnabled: boolean;
  creditEligible: boolean;
  transferEligible: boolean;
  checkoutFields: CheckoutFieldConfig[];
  addOnIds: string[];
  raw: any;
};

export type NormalizedAddOn = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number | null;
  soldQuantity: number;
  remainingQuantity: number | null;
  saleStartAt: Date | null;
  saleEndAt: Date | null;
  saleStatus: TicketSaleStatus;
  saleStatusLabel: string;
  saleStatusDetail: string;
  applicableTicketTypeIds: string[];
  transferable: boolean;
  creditEligible: boolean;
  paymentPlanEligible: boolean;
  raw: any;
};

export const CHECKOUT_FIELD_DEFINITIONS: Record<
  CheckoutFieldKey,
  CheckoutFieldDefinition
> = {
  firstName: {
    key: "firstName",
    label: "First Name",
    section: "basic",
    placeholder: "Enter first name",
    requiredByDefault: true,
  },
  lastName: {
    key: "lastName",
    label: "Last Name",
    section: "basic",
    placeholder: "Enter last name",
    requiredByDefault: true,
  },
  email: {
    key: "email",
    label: "Email",
    section: "basic",
    placeholder: "Enter email address",
    requiredByDefault: true,
  },
  gender: {
    key: "gender",
    label: "Gender",
    section: "basic",
    placeholder: "Select gender",
    requiredByDefault: false,
    optionalLabel: "Optional",
  },
  phone: {
    key: "phone",
    label: "Phone Number",
    section: "contact",
    placeholder: "125-559-8852",
    requiredByDefault: true,
  },
  city: {
    key: "city",
    label: "City/Town",
    section: "contact",
    placeholder: "Enter city",
    requiredByDefault: true,
  },
  pincode: {
    key: "pincode",
    label: "Pincode",
    section: "contact",
    placeholder: "Enter pincode",
    requiredByDefault: true,
  },
  address: {
    key: "address",
    label: "Address",
    section: "contact",
    placeholder: "Enter address",
    requiredByDefault: true,
  },
  website: {
    key: "website",
    label: "Website",
    section: "contact",
    placeholder: "Enter website URL",
    requiredByDefault: false,
    optionalLabel: "Optional",
  },
};

export const DEFAULT_CHECKOUT_FIELD_ORDER: CheckoutFieldKey[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "city",
  "pincode",
  "address",
  "website",
];

const firstDefined = (...values: any[]) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const firstString = (...values: any[]) => {
  const value = firstDefined(...values);
  return typeof value === "string" ? value.trim() : value ? String(value).trim() : "";
};

const toNumber = (value: any, fallback = 0) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const toBool = (value: any) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") {
    return ["true", "1", "yes", "y", "enabled", "on"].includes(
      value.toLowerCase().trim()
    );
  }

  return false;
};

const safeDate = (value: any) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeFieldKey = (value: any): CheckoutFieldKey | null => {
  const normalized = String(value || "")
    .trim()
    .replace(/[_\s-]+/g, "")
    .toLowerCase();

  const entry = Object.values(CHECKOUT_FIELD_DEFINITIONS).find(
    (field) => field.key.toLowerCase() === normalized
  );

  return entry?.key || null;
};

const buildDefaultCheckoutFields = () =>
  DEFAULT_CHECKOUT_FIELD_ORDER.map((key) => {
    const definition = CHECKOUT_FIELD_DEFINITIONS[key];
    return {
      key,
      label: definition.label,
      section: definition.section,
      placeholder: definition.placeholder,
      required: definition.requiredByDefault,
      enabled: true,
    } satisfies CheckoutFieldConfig;
  });

const normalizeCheckoutFieldEntry = (
  raw: any
): CheckoutFieldConfig | null => {
  if (!raw && raw !== false) return null;

  if (typeof raw === "string") {
    const key = normalizeFieldKey(raw);
    if (!key) return null;
    const definition = CHECKOUT_FIELD_DEFINITIONS[key];

    return {
      key,
      label: definition.label,
      section: definition.section,
      placeholder: definition.placeholder,
      required: definition.requiredByDefault,
      enabled: true,
    };
  }

  const key = normalizeFieldKey(
    raw.key ?? raw.name ?? raw.field ?? raw.id ?? raw.value
  );
  if (!key) return null;

  const definition = CHECKOUT_FIELD_DEFINITIONS[key];

  return {
    key,
    label: firstString(raw.label, definition.label) || definition.label,
    section:
      raw.section === "contact" || raw.group === "contact"
        ? "contact"
        : definition.section,
    placeholder:
      firstString(raw.placeholder, definition.placeholder) || definition.placeholder,
    required:
      raw.required === undefined
        ? definition.requiredByDefault
        : Boolean(raw.required),
    enabled: raw.enabled === undefined ? true : Boolean(raw.enabled),
  };
};

const extractCheckoutFieldEntries = (raw: any): CheckoutFieldConfig[] => {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw
      .map(normalizeCheckoutFieldEntry)
      .filter(Boolean) as CheckoutFieldConfig[];
  }

  if (Array.isArray(raw.fields)) {
    return raw.fields
      .map(normalizeCheckoutFieldEntry)
      .filter(Boolean) as CheckoutFieldConfig[];
  }

  if (Array.isArray(raw.enabled)) {
    return raw.enabled
      .map((entry: any) =>
        normalizeCheckoutFieldEntry({ key: entry, enabled: true })
      )
      .filter(Boolean) as CheckoutFieldConfig[];
  }

  if (typeof raw === "object") {
    return Object.entries(raw)
      .map(([key, value]) => {
        if (typeof value === "boolean") {
          return normalizeCheckoutFieldEntry({ key, enabled: value });
        }

        if (value && typeof value === "object") {
          return normalizeCheckoutFieldEntry({ key, ...value });
        }

        return normalizeCheckoutFieldEntry({ key, enabled: Boolean(value) });
      })
      .filter(Boolean) as CheckoutFieldConfig[];
  }

  return [];
};

export const resolveCheckoutFields = (
  eventConfig?: any,
  ticketConfigs: any[] = []
) => {
  const eventFields = extractCheckoutFieldEntries(eventConfig);
  const merged = new Map<CheckoutFieldKey, CheckoutFieldConfig>();

  const seedFields = eventFields.length > 0 ? eventFields : buildDefaultCheckoutFields();
  seedFields.forEach((field) => {
    if (!field.enabled) return;
    merged.set(field.key, field);
  });

  ticketConfigs.forEach((config) => {
    extractCheckoutFieldEntries(config).forEach((field) => {
      if (!field.enabled) return;
      const current = merged.get(field.key);
      merged.set(field.key, {
        ...(current || field),
        ...field,
        required: Boolean(current?.required || field.required),
        enabled: true,
      });
    });
  });

  return DEFAULT_CHECKOUT_FIELD_ORDER.map((key) => merged.get(key)).filter(
    Boolean
  ) as CheckoutFieldConfig[];
};

export const normalizeAttendanceMode = (
  value: any
): "in-person" | "virtual" | null => {
  const raw = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  if (!raw) return null;
  if (
    raw.includes("virtual") ||
    raw.includes("online") ||
    raw.includes("stream") ||
    raw.includes("remote")
  ) {
    return "virtual";
  }

  if (
    raw.includes("in-person") ||
    raw.includes("inperson") ||
    raw.includes("venue") ||
    raw.includes("onsite") ||
    raw.includes("physical")
  ) {
    return "in-person";
  }

  return null;
};

const readSaleWindow = (raw: any) => ({
  saleStartAt: safeDate(
    firstDefined(
      raw?.saleStartAt,
      raw?.saleStart,
      raw?.salesStartAt,
      raw?.sales?.startAt,
      raw?.saleWindow?.startAt,
      raw?.saleWindow?.start,
      raw?.details?.saleStartAt
    )
  ),
  saleEndAt: safeDate(
    firstDefined(
      raw?.saleEndAt,
      raw?.saleEnd,
      raw?.salesEndAt,
      raw?.sales?.endAt,
      raw?.saleWindow?.endAt,
      raw?.saleWindow?.end,
      raw?.details?.saleEndAt
    )
  ),
});

const readInventory = (raw: any) => {
  const quantityValue = firstDefined(
    raw?.quantity,
    raw?.totalQuantity,
    raw?.inventory?.quantity,
    raw?.inventory?.total,
    raw?.capacity
  );
  const soldQuantity = toNumber(
    firstDefined(
      raw?.soldQuantity,
      raw?.sold,
      raw?.quantitySold,
      raw?.inventory?.sold,
      raw?.stats?.sold
    )
  );
  const remainingValue = firstDefined(
    raw?.remainingQuantity,
    raw?.remaining,
    raw?.availableQuantity,
    raw?.inventory?.remaining,
    raw?.inventory?.available
  );
  const quantity =
    quantityValue === undefined || quantityValue === null || quantityValue === ""
      ? null
      : toNumber(quantityValue);
  const remainingQuantity =
    remainingValue === undefined || remainingValue === null || remainingValue === ""
      ? quantity === null
        ? null
        : Math.max(quantity - soldQuantity, 0)
      : toNumber(remainingValue);

  return {
    quantity,
    soldQuantity,
    remainingQuantity:
      remainingQuantity === null ? null : Math.max(remainingQuantity, 0),
  };
};

export const formatSalesDateTime = (value: Date | null) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
};

const buildSaleState = (raw: any, now = new Date()) => {
  const { quantity, soldQuantity, remainingQuantity } = readInventory(raw);
  const { saleStartAt, saleEndAt } = readSaleWindow(raw);

  if (quantity !== null && (remainingQuantity ?? quantity - soldQuantity) <= 0) {
    return {
      quantity,
      soldQuantity,
      remainingQuantity,
      saleStartAt,
      saleEndAt,
      saleStatus: "sold-out" as const,
      saleStatusLabel: "Sold out",
      saleStatusDetail:
        quantity !== null ? `${quantity.toLocaleString()} total claimed.` : "",
    };
  }

  if (saleStartAt && saleStartAt > now) {
    return {
      quantity,
      soldQuantity,
      remainingQuantity,
      saleStartAt,
      saleEndAt,
      saleStatus: "sales-not-started" as const,
      saleStatusLabel: "Sales not started",
      saleStatusDetail: `Sales start on ${formatSalesDateTime(saleStartAt)}.`,
    };
  }

  if (saleEndAt && saleEndAt < now) {
    return {
      quantity,
      soldQuantity,
      remainingQuantity,
      saleStartAt,
      saleEndAt,
      saleStatus: "sales-closed" as const,
      saleStatusLabel: "Sales closed",
      saleStatusDetail: `Sales closed on ${formatSalesDateTime(saleEndAt)}.`,
    };
  }

  const availabilityLabel =
    remainingQuantity === null
      ? "Available now"
      : `${remainingQuantity.toLocaleString()} remaining`;

  return {
    quantity,
    soldQuantity,
    remainingQuantity,
    saleStartAt,
    saleEndAt,
    saleStatus: "on-sale" as const,
    saleStatusLabel: "On sale",
    saleStatusDetail: availabilityLabel,
  };
};

export const normalizeCommerceTicket = (
  raw: any,
  options?: {
    eventMode?: string | null;
    now?: Date;
  }
): NormalizedCommerceTicket => {
  const saleState = buildSaleState(raw, options?.now);
  const id = firstString(raw?.id, raw?._id, raw?.ticketId) || crypto.randomUUID();
  const checkoutFields = resolveCheckoutFields(
    undefined,
    [raw?.checkoutFields ?? raw?.orderFormFields ?? raw?.metadata?.checkoutFields]
  );

  return {
    id,
    name:
      firstString(raw?.name, raw?.ticketName, raw?.title) ||
      firstString(raw?.type, raw?.category, "Ticket"),
    type: firstString(raw?.type, raw?.category, raw?.ticketType, "General"),
    price: toNumber(firstDefined(raw?.price, raw?.amount, raw?.ticketPrice)),
    description: firstString(
      raw?.description,
      raw?.ticketDescription,
      raw?.details?.description,
      raw?.metadata?.description
    ),
    attendanceMode:
      normalizeAttendanceMode(
        firstDefined(
          raw?.attendanceMode,
          raw?.deliveryMode,
          raw?.accessMode,
          raw?.ticketMode,
          raw?.metadata?.attendanceMode,
          raw?.details?.attendanceMode
        )
      ) ||
      (options?.eventMode === "virtual"
        ? "virtual"
        : options?.eventMode === "in-person"
          ? "in-person"
          : null),
    quantity: saleState.quantity,
    soldQuantity: saleState.soldQuantity,
    remainingQuantity: saleState.remainingQuantity,
    minOrder: Math.max(
      1,
      toNumber(firstDefined(raw?.minOrder, raw?.minimumOrder, raw?.minPerOrder), 1)
    ),
    maxOrder:
      firstDefined(raw?.maxOrder, raw?.maximumOrder, raw?.maxPerOrder) === undefined
        ? null
        : Math.max(
            1,
            toNumber(firstDefined(raw?.maxOrder, raw?.maximumOrder, raw?.maxPerOrder), 1)
          ),
    saleStartAt: saleState.saleStartAt,
    saleEndAt: saleState.saleEndAt,
    saleStatus: saleState.saleStatus,
    saleStatusLabel: saleState.saleStatusLabel,
    saleStatusDetail: saleState.saleStatusDetail,
    transferable: toBool(
      firstDefined(raw?.transferable, raw?.isTransferable, raw?.canTransfer)
    ),
    refundable: toBool(
      firstDefined(raw?.refundable, raw?.isRefundable, raw?.canRefund)
    ),
    paymentPlanEnabled: toBool(
      firstDefined(
        raw?.paymentPlanEnabled,
        raw?.allowPaymentPlan,
        raw?.paymentPlans?.enabled
      )
    ),
    creditEligible: toBool(
      firstDefined(raw?.creditEligible, raw?.isCreditEligible, raw?.allowCredits)
    ),
    transferEligible: toBool(
      firstDefined(
        raw?.transferEligible,
        raw?.isTransferEligible,
        raw?.transferable,
        raw?.isTransferable
      )
    ),
    checkoutFields,
    addOnIds: Array.isArray(raw?.addOnIds)
      ? raw.addOnIds.map((entry: any) => String(entry))
      : Array.isArray(raw?.addons)
        ? raw.addons.map((entry: any) => String(entry?.id ?? entry))
        : [],
    raw,
  };
};

export const normalizeEventTickets = (tickets: any[], eventMode?: string | null) =>
  Array.isArray(tickets)
    ? tickets.map((ticket) =>
        normalizeCommerceTicket(ticket, {
          eventMode,
        })
      )
    : [];

export const normalizeCommerceAddOn = (
  raw: any,
  options?: {
    now?: Date;
  }
): NormalizedAddOn => {
  const saleState = buildSaleState(raw, options?.now);
  const id = firstString(raw?.id, raw?._id, raw?.addOnId) || crypto.randomUUID();
  const ticketTypeIds = Array.isArray(raw?.applicableTicketTypeIds)
    ? raw.applicableTicketTypeIds
    : Array.isArray(raw?.ticketTypeIds)
      ? raw.ticketTypeIds
      : Array.isArray(raw?.ticketTypes)
        ? raw.ticketTypes.map((entry: any) => entry?.id ?? entry)
        : [];

  return {
    id,
    name: firstString(raw?.name, raw?.title, raw?.label, "Add-on"),
    description: firstString(raw?.description, raw?.details?.description),
    price: toNumber(firstDefined(raw?.price, raw?.amount)),
    quantity: saleState.quantity,
    soldQuantity: saleState.soldQuantity,
    remainingQuantity: saleState.remainingQuantity,
    saleStartAt: saleState.saleStartAt,
    saleEndAt: saleState.saleEndAt,
    saleStatus: saleState.saleStatus,
    saleStatusLabel: saleState.saleStatusLabel,
    saleStatusDetail: saleState.saleStatusDetail,
    applicableTicketTypeIds: ticketTypeIds.map((entry: any) => String(entry)),
    transferable: toBool(
      firstDefined(raw?.transferable, raw?.isTransferable, raw?.transferEligible)
    ),
    creditEligible: toBool(
      firstDefined(raw?.creditEligible, raw?.isCreditEligible, raw?.allowCredits)
    ),
    paymentPlanEligible: toBool(
      firstDefined(raw?.paymentPlanEligible, raw?.allowPaymentPlan)
    ),
    raw,
  };
};

export const normalizeEventAddOns = (eventData: any) => {
  const rawAddOns = firstDefined(
    eventData?.addOns,
    eventData?.addons,
    eventData?.eventSettings?.addOns,
    eventData?.eventSettings?.addons,
    eventData?.raw?.addOns
  );

  return Array.isArray(rawAddOns)
    ? rawAddOns.map((entry) => normalizeCommerceAddOn(entry))
    : [];
};

export const getAddOnEligibility = (
  addOn: NormalizedAddOn,
  selectedTickets: Array<{
    id: string;
    type?: string;
    quantity?: number;
    raw?: any;
  }>
) => {
  if (!addOn.applicableTicketTypeIds.length) {
    return {
      eligible: true,
      maxSelectable: selectedTickets.reduce(
        (sum, ticket) => sum + Number(ticket.quantity || 0),
        0
      ),
    };
  }

  const eligibleQuantity = selectedTickets.reduce((sum, ticket) => {
    const ticketTypeId = String(
      ticket.raw?.id ??
        ticket.raw?._id ??
        ticket.raw?.ticketTypeId ??
        ticket.id ??
        ticket.type ??
        ""
    );

    return addOn.applicableTicketTypeIds.includes(ticketTypeId)
      ? sum + Number(ticket.quantity || 0)
      : sum;
  }, 0);

  return {
    eligible: eligibleQuantity > 0,
    maxSelectable: eligibleQuantity,
  };
};

export const normalizeRevenueBucketLabel = (item: any) =>
  firstString(
    item?.ticketType,
    item?.type,
    item?.name,
    item?.label,
    item?.bucket,
    item?.category
  ) || "N/A";
