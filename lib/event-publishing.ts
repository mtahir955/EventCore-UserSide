type AnyRecord = Record<string, any>;

export type EventAccessState =
  | "available"
  | "unavailable"
  | "password-required"
  | "invite-only"
  | "sold-out"
  | "sales-closed"
  | "ended"
  | "cancelled";

export type NormalizedEvent = {
  raw: AnyRecord | null;
  id: string;
  slug: string;
  title: string;
  mode: "in-person" | "virtual";
  locationLabel: string;
  urlPath: string;
  accessPassword: string;
  requiresPassword: boolean;
  inviteOnly: boolean;
  isPrivate: boolean;
  isPublished: boolean;
  isCancelled: boolean;
  isSoldOut: boolean;
  salesClosed: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  dateLabel: string;
  timeLabel: string;
};

const asRecord = (value: unknown): AnyRecord =>
  value && typeof value === "object" ? (value as AnyRecord) : {};

const readNested = (source: AnyRecord, path: string): unknown =>
  path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as AnyRecord)[key];
  }, source);

const pickFirstString = (
  source: AnyRecord,
  paths: string[],
  fallback = ""
): string => {
  for (const path of paths) {
    const value = readNested(source, path);

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return fallback;
};

const pickFirstBoolean = (source: AnyRecord, paths: string[]): boolean | null => {
  for (const path of paths) {
    const value = readNested(source, path);

    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "yes", "1", "active", "enabled"].includes(normalized)) {
        return true;
      }
      if (["false", "no", "0", "inactive", "disabled"].includes(normalized)) {
        return false;
      }
    }
  }

  return null;
};

const buildDateTime = (dateValue?: string, timeValue?: string): Date | null => {
  const datePart = dateValue?.trim();
  const timePart = timeValue?.trim();

  if (!datePart && !timePart) return null;

  const candidate = [datePart, timePart].filter(Boolean).join(" ");
  const parsed = new Date(candidate);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseDateCandidate = (
  value: unknown,
  options?: { dateValue?: string; timeValue?: string }
): Date | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value.trim());
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  if (options?.dateValue || options?.timeValue) {
    return buildDateTime(options.dateValue, options.timeValue);
  }

  return null;
};

const formatDatePart = (value: Date | null): string => {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
};

const formatTimePart = (value: Date | null): string => {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
};

const buildTimeLabel = (startTime: string, endTime: string): string => {
  if (startTime && endTime) return `${startTime} - ${endTime}`;
  return startTime || endTime || "";
};

const inferMode = (source: AnyRecord): "in-person" | "virtual" => {
  const rawMode = pickFirstString(source, [
    "mode",
    "eventMode",
    "eventType",
    "type",
    "deliveryType",
  ]).toLowerCase();

  return rawMode.includes("virtual") || rawMode.includes("online")
    ? "virtual"
    : "in-person";
};

const inferLocationLabel = (source: AnyRecord, mode: "in-person" | "virtual"): string => {
  if (mode === "virtual") {
    return pickFirstString(source, [
      "virtualLocation",
      "meetingLink",
      "location",
      "venueName",
    ], "Online");
  }

  return pickFirstString(source, [
    "location",
    "venueName",
    "venue.name",
    "address.full",
    "address.line1",
    "eventLocation",
  ], "Location to be announced");
};

const inferPublished = (source: AnyRecord): boolean => {
  const explicit = pickFirstBoolean(source, [
    "isPublished",
    "published",
    "isPublic",
    "isLive",
    "active",
  ]);

  if (explicit !== null) return explicit;

  const status = pickFirstString(source, ["status", "publishStatus"]).toLowerCase();
  if (!status) return true;

  if (["draft", "unpublished", "archived"].includes(status)) return false;
  return true;
};

const inferCancelled = (source: AnyRecord): boolean => {
  const explicit = pickFirstBoolean(source, ["isCancelled", "cancelled"]);
  if (explicit !== null) return explicit;

  const status = pickFirstString(source, ["status"]).toLowerCase();
  return status === "cancelled";
};

const inferSoldOut = (source: AnyRecord): boolean => {
  const explicit = pickFirstBoolean(source, [
    "isSoldOut",
    "soldOut",
    "ticketing.soldOut",
  ]);

  if (explicit !== null) return explicit;

  const status = pickFirstString(source, ["status"]).toLowerCase();
  return status === "sold-out";
};

export function normalizeEvent(event: unknown): NormalizedEvent {
  const source = asRecord(event);
  const dateInfo = asRecord(source.date);
  const ticketingInfo = asRecord(source.ticketing);
  const accessInfo = asRecord(source.access);

  const id = pickFirstString(source, ["id", "_id", "eventId", "event.id"]);
  const slug = pickFirstString(source, [
    "slug",
    "eventSlug",
    "seo.slug",
    "share.slug",
  ]);
  const title = pickFirstString(source, ["title", "name", "eventName"], "Event");
  const mode = inferMode(source);

  const dateLabel =
    pickFirstString(dateInfo, ["fullDate", "displayDate", "date"]) ||
    pickFirstString(source, ["fullDate", "displayDate"]);
  const startTime = pickFirstString(dateInfo, ["startTime", "start"]);
  const endTime = pickFirstString(dateInfo, ["endTime", "end"]);
  const rawTimeLabel =
    pickFirstString(dateInfo, ["time", "displayTime"]) ||
    pickFirstString(source, ["time", "displayTime"]);
  const timeLabel = rawTimeLabel || buildTimeLabel(startTime, endTime);

  const startsAt =
    parseDateCandidate(dateInfo.timestamp, {
      dateValue: dateLabel,
      timeValue: startTime,
    }) ||
    parseDateCandidate(readNested(source, "startsAt")) ||
    parseDateCandidate(readNested(source, "startDateTime")) ||
    parseDateCandidate(readNested(source, "startDate"), {
      timeValue: startTime,
    });
  const endsAt =
    parseDateCandidate(readNested(dateInfo, "endTimestamp"), {
      dateValue: dateLabel,
      timeValue: endTime,
    }) ||
    parseDateCandidate(readNested(source, "endsAt")) ||
    parseDateCandidate(readNested(source, "endDateTime")) ||
    parseDateCandidate(readNested(source, "endDate"), {
      timeValue: endTime,
    });

  const accessPassword = pickFirstString(source, [
    "accessPassword",
    "password",
    "eventPassword",
    "access.password",
  ]);

  const requiresPassword =
    accessPassword.length > 0 ||
    pickFirstBoolean(source, [
      "requiresPassword",
      "passwordProtected",
      "isPasswordProtected",
      "access.passwordProtected",
    ]) === true;

  const inviteOnly =
    pickFirstBoolean(source, [
      "inviteOnly",
      "isInviteOnly",
      "access.inviteOnly",
      "audience.inviteOnly",
    ]) === true ||
    pickFirstString(source, ["visibility", "accessType"]).toLowerCase() ===
      "invite-only";

  const isPrivate =
    pickFirstBoolean(source, [
      "isPrivate",
      "privateEvent",
      "access.private",
      "access.isPrivate",
    ]) === true ||
    pickFirstString(source, ["visibility", "accessType"]).toLowerCase() ===
      "private";

  const salesClosedExplicit =
    pickFirstBoolean(source, [
      "registrationClosed",
      "salesClosed",
      "isSalesClosed",
      "checkoutDisabled",
      "isCheckoutDisabled",
      "ticketing.salesClosed",
    ]) === true;

  const salesEndDate =
    parseDateCandidate(readNested(ticketingInfo, "salesEnd")) ||
    parseDateCandidate(readNested(ticketingInfo, "salesEndAt")) ||
    parseDateCandidate(readNested(source, "salesEnd")) ||
    parseDateCandidate(readNested(source, "salesEndAt"));

  const now = new Date();
  const salesClosed =
    salesClosedExplicit || (!!salesEndDate && salesEndDate.getTime() < now.getTime());

  return {
    raw: Object.keys(source).length ? source : null,
    id,
    slug,
    title,
    mode,
    locationLabel: inferLocationLabel(source, mode),
    urlPath: id
      ? `/details?id=${encodeURIComponent(id)}`
      : slug
        ? `/details?slug=${encodeURIComponent(slug)}`
        : "",
    accessPassword,
    requiresPassword,
    inviteOnly,
    isPrivate,
    isPublished: inferPublished(source),
    isCancelled: inferCancelled(source),
    isSoldOut: inferSoldOut(source),
    salesClosed,
    startsAt,
    endsAt,
    dateLabel: dateLabel || formatDatePart(startsAt),
    timeLabel: timeLabel || buildTimeLabel(formatTimePart(startsAt), formatTimePart(endsAt)),
  };
}

export function formatEventDateLabel(event: NormalizedEvent): string {
  if (event.dateLabel && event.timeLabel) {
    return `${event.dateLabel} | ${event.timeLabel}`;
  }

  if (event.dateLabel) return event.dateLabel;
  if (event.timeLabel) return event.timeLabel;

  const fallbackDate = formatDatePart(event.startsAt);
  const fallbackTime = buildTimeLabel(
    formatTimePart(event.startsAt),
    formatTimePart(event.endsAt)
  );

  if (fallbackDate && fallbackTime) {
    return `${fallbackDate} | ${fallbackTime}`;
  }

  return fallbackDate || fallbackTime || "Date to be announced";
}

export function getEventAccessState(
  event: NormalizedEvent,
  options?: {
    hasPasswordAccess?: boolean;
    isAuthorizedInvitee?: boolean;
  }
): {
  state: EventAccessState;
  canPurchase: boolean;
  message: string;
} {
  if (!event.raw) {
    return {
      state: "unavailable",
      canPurchase: false,
      message: "This event could not be loaded.",
    };
  }

  if (!event.isPublished) {
    return {
      state: "unavailable",
      canPurchase: false,
      message: "This event is not published yet.",
    };
  }

  if (event.isCancelled) {
    return {
      state: "cancelled",
      canPurchase: false,
      message: "This event has been cancelled.",
    };
  }

  if (event.isSoldOut) {
    return {
      state: "sold-out",
      canPurchase: false,
      message: "This event is sold out.",
    };
  }

  if (event.salesClosed) {
    return {
      state: "sales-closed",
      canPurchase: false,
      message: "Ticket sales have closed for this event.",
    };
  }

  if (event.endsAt && event.endsAt.getTime() < Date.now()) {
    return {
      state: "ended",
      canPurchase: false,
      message: "This event has already ended.",
    };
  }

  if (event.inviteOnly && !options?.isAuthorizedInvitee) {
    return {
      state: "invite-only",
      canPurchase: false,
      message: "This event is only available to invited attendees.",
    };
  }

  if ((event.requiresPassword || event.isPrivate) && !options?.hasPasswordAccess) {
    return {
      state: "password-required",
      canPurchase: false,
      message: "This event is password protected.",
    };
  }

  return {
    state: "available",
    canPurchase: true,
    message: "",
  };
}
