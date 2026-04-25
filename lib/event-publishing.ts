export type EventMode = "in-person" | "virtual" | "hybrid";
import { DEFAULT_EVENT_CATEGORY_OPTIONS } from "@/lib/event-categories";
import {
  buildLocationDisplayLabel,
  buildStructuredAddress,
  normalizeStructuredEventLocation,
} from "@/lib/google-places";
export type EventLifecycleStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "PUBLISHED"
  | "UNPUBLISHED";
export type EventPrivacyType =
  | "public"
  | "link-only"
  | "password-protected"
  | "invite-only";

export type EventAccessSnapshot = {
  canView: boolean;
  canPurchase: boolean;
  canWatch: boolean;
  requiresPassword: boolean;
  requiresInvite: boolean;
  hasTicket: boolean;
  isAuthorizedInvitee: boolean;
  reasonCode: string;
  message: string;
};

export type NormalizedEvent = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  mode: EventMode;
  lifecycleStatus: EventLifecycleStatus;
  privacyType: EventPrivacyType;
  isPrivate: boolean;
  eventTimezone: string;
  viewerTimezone: string;
  locationLabel: string;
  fullAddress: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  startAt: Date | null;
  endAt: Date | null;
  goLiveAt: Date | null;
  goLiveDate: string;
  goLiveTime: string;
  goLiveTimezone: string;
  bannerImage: string;
  streamProvider: string;
  streamUrl: string;
  requiresTicketToWatch: boolean;
  accessPassword: string;
  canWatchViaStream: boolean;
  urlPath: string;
  publicUrl: string;
  hostName: string;
  minTicketPrice: number;
  audienceCount: number;
  access: EventAccessSnapshot | null;
  tickets: any[];
  trainers: any[];
  raw: any;
};

export const DEFAULT_EVENT_TIMEZONE = "America/Los_Angeles";
export const DEFAULT_GO_LIVE_TIMEZONE = "America/Los_Angeles";

export const EVENT_TIMEZONE_OPTIONS = [
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Asia/Karachi", label: "Karachi" },
  { value: "Asia/Dubai", label: "Dubai" },
];

export const EVENT_CATEGORY_OPTIONS = DEFAULT_EVENT_CATEGORY_OPTIONS;

export const PRIVATE_EVENT_OPTIONS = [
  {
    value: "link-only",
    label: "Link-only private",
    description: "Hidden from listings and searchable pages.",
  },
  {
    value: "password-protected",
    label: "Password protected",
    description: "Requires a password before viewing or purchasing.",
  },
  {
    value: "invite-only",
    label: "Invite only",
    description: "Only approved users can view or purchase.",
  },
];

const lifecycleLabelMap: Record<EventLifecycleStatus, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  UNPUBLISHED: "Unpublished",
};

const privacyLabelMap: Record<EventPrivacyType, string> = {
  public: "Public",
  "link-only": "Link only",
  "password-protected": "Password protected",
  "invite-only": "Invite only",
};

const modeLabelMap: Record<EventMode, string> = {
  "in-person": "In person",
  virtual: "Virtual",
  hybrid: "Hybrid",
};

export const getBrowserTimeZone = () => {
  if (typeof window === "undefined") return DEFAULT_EVENT_TIMEZONE;

  return (
    Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_EVENT_TIMEZONE
  );
};

export const slugifyEventSlug = (value?: string | null) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

export const validateEventSlug = (slug: string) => {
  const normalized = slugifyEventSlug(slug);

  if (!normalized) {
    return { valid: false, normalized, error: "Custom URL is required." };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    return {
      valid: false,
      normalized,
      error:
        "Use lowercase letters, numbers, and hyphens only. Hyphens cannot start or end the slug.",
    };
  }

  return { valid: true, normalized, error: "" };
};

const firstString = (...values: any[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
};

const firstTruthy = (...values: any[]) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") return value;
  }

  return null;
};

const toBool = (value: any) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") {
    return ["true", "1", "yes", "y"].includes(value.toLowerCase());
  }

  return false;
};

const safeDate = (value?: string | number | Date | null) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const combineDateTime = (date?: string, time?: string) => {
  if (!date) return null;
  const normalizedTime = time?.trim() ? time : "00:00";
  return safeDate(`${date}T${normalizedTime}`);
};

const formatDatePartsInTimeZone = (date: Date, timeZone: string) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const readPart = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  return {
    date: `${readPart("year")}-${readPart("month")}-${readPart("day")}`,
    time: `${readPart("hour")}:${readPart("minute")}`,
  };
};

export const normalizeEventMode = (value?: string | null): EventMode => {
  const raw = String(value || "").toLowerCase().trim();

  if (raw === "hybrid") return "hybrid";
  if (["virtual", "online", "livestream"].includes(raw)) return "virtual";
  return "in-person";
};

export const normalizeEventPrivacy = (
  value?: string | null,
  isPrivate?: boolean
): EventPrivacyType => {
  const raw = String(value || "").toLowerCase().trim();
  const privateFlag = toBool(isPrivate);

  if (raw === "public" || (!privateFlag && !raw.includes("password") && !raw.includes("invite") && !raw.includes("link"))) {
    return "public";
  }

  if (raw.includes("password")) return "password-protected";
  if (raw.includes("invite")) return "invite-only";
  if (raw.includes("link")) return "link-only";
  if (privateFlag) return "link-only";
  return "public";
};

export const normalizeLifecycleStatus = (value?: string | null, raw?: any) => {
  const normalized = String(value || "").toUpperCase().trim();

  if (["DRAFT", "PUBLISHED", "UNPUBLISHED", "SCHEDULED"].includes(normalized)) {
    return normalized as EventLifecycleStatus;
  }

  if (toBool(raw?.isUnpublished)) return "UNPUBLISHED";
  if (toBool(raw?.isPublished) || raw?.publishedAt) return "PUBLISHED";
  if (raw?.goLiveAt || raw?.publishAt) return "SCHEDULED";
  return "DRAFT";
};

const buildAddress = (raw: any) => {
  const structured = normalizeStructuredEventLocation(
    raw?.locationData || raw?.details?.locationData
  );

  const structuredAddress = buildStructuredAddress(structured);
  if (structuredAddress) return structuredAddress;

  const candidates = [
    raw?.fullAddress,
    raw?.eventAddress,
    raw?.address,
    raw?.venueAddress,
    raw?.details?.fullAddress,
  ];

  const direct = firstString(...candidates);
  if (direct) return direct;

  return [
    raw?.addressLine1 || raw?.details?.addressLine1,
    raw?.addressLine2 || raw?.details?.addressLine2,
    raw?.city || raw?.details?.city,
    raw?.state || raw?.details?.state,
    raw?.postalCode || raw?.zipCode || raw?.details?.postalCode,
    raw?.country || raw?.details?.country,
  ]
    .filter(Boolean)
    .join(", ");
};

const normalizeAccessSnapshot = (rawAccess: any): EventAccessSnapshot | null => {
  if (!rawAccess || typeof rawAccess !== "object") return null;

  return {
    canView: Boolean(rawAccess.canView),
    canPurchase: Boolean(rawAccess.canPurchase),
    canWatch: Boolean(rawAccess.canWatch),
    requiresPassword: Boolean(rawAccess.requiresPassword),
    requiresInvite: Boolean(rawAccess.requiresInvite),
    hasTicket: Boolean(rawAccess.hasTicket),
    isAuthorizedInvitee: Boolean(rawAccess.isAuthorizedInvitee),
    reasonCode: firstString(rawAccess.reasonCode),
    message: firstString(rawAccess.message),
  };
};

const resolveGoLiveDateTime = (raw: any, goLiveTimezone: string) => {
  const goLiveAt = safeDate(
    firstTruthy(
      raw?.goLiveAt,
      raw?.publishAt,
      raw?.goLiveDateTime,
      raw?.details?.goLiveAt
    )
  );

  if (goLiveAt) {
    const parts = formatDatePartsInTimeZone(goLiveAt, goLiveTimezone);
    return {
      goLiveAt,
      goLiveDate: parts.date,
      goLiveTime: parts.time,
    };
  }

  const goLiveDate = firstString(
    raw?.goLiveDate,
    raw?.details?.goLiveDate,
    raw?.publishDate
  );
  const goLiveTime = firstString(
    raw?.goLiveTime,
    raw?.details?.goLiveTime,
    raw?.publishTime
  );

  return {
    goLiveAt: combineDateTime(goLiveDate, goLiveTime),
    goLiveDate,
    goLiveTime,
  };
};

export const normalizeEvent = (raw: any, viewerTimezone = getBrowserTimeZone()) => {
  const title = firstString(raw?.title, raw?.eventTitle, raw?.details?.eventTitle);
  const description = firstString(
    raw?.eventDescription,
    raw?.description?.text,
    raw?.description?.paragraphs?.join("\n\n"),
    raw?.description,
    raw?.details?.eventDescription
  );
  const shortDescription =
    firstString(
      raw?.shortDescription,
      raw?.summary,
      raw?.shortDesc,
      raw?.details?.shortDescription
    ) || description.slice(0, 140);
  const mode = normalizeEventMode(
    firstString(raw?.eventType, raw?.mode, raw?.details?.eventType)
  );
  const eventTimezone = firstString(
    raw?.eventTimezone,
    raw?.timezone,
    raw?.timeZone,
    raw?.details?.eventTimezone
  ) || DEFAULT_EVENT_TIMEZONE;
  const privacyType = normalizeEventPrivacy(
    firstString(
      raw?.privateEventType,
      raw?.privacyType,
      raw?.accessType,
      raw?.details?.privateEventType
    ),
    firstTruthy(raw?.isPrivate, raw?.details?.isPrivate)
  );
  const isPrivate = privacyType !== "public";
  const goLiveTimezone =
    firstString(raw?.goLiveTimezone, raw?.publishTimezone) ||
    DEFAULT_GO_LIVE_TIMEZONE;
  const slug = slugifyEventSlug(
    firstString(raw?.slug, raw?.customSlug, raw?.details?.customSlug, title)
  );
  const lifecycleStatus = normalizeLifecycleStatus(
    firstString(raw?.lifecycleStatus, raw?.publishStatus, raw?.status),
    raw
  );
  const address = buildAddress(raw);
  const streamUrl = firstString(
    raw?.streamUrl,
    raw?.vimeoUrl,
    raw?.streamingUrl,
    raw?.details?.streamUrl
  );
  const startDate = firstString(
    raw?.startDate,
    raw?.date?.isoDate,
    raw?.details?.startDate
  );
  const endDate = firstString(raw?.endDate, raw?.details?.endDate) || startDate;
  const startTime = firstString(
    raw?.startTime,
    raw?.date?.startTime,
    raw?.details?.startTime
  );
  const endTime = firstString(
    raw?.endTime,
    raw?.date?.endTime,
    raw?.details?.endTime
  );
  const startAt =
    safeDate(
      firstTruthy(
        raw?.startAt,
        raw?.startDateTime,
        raw?.date?.timestamp,
        raw?.eventStartAt,
        raw?.details?.startDateTime
      )
    ) || combineDateTime(startDate, startTime);
  const endAt =
    safeDate(firstTruthy(raw?.endAt, raw?.endDateTime, raw?.eventEndAt)) ||
    combineDateTime(endDate, endTime);
  const { goLiveAt, goLiveDate, goLiveTime } = resolveGoLiveDateTime(
    raw,
    goLiveTimezone
  );
  const structuredLocation = normalizeStructuredEventLocation(
    raw?.locationData || raw?.details?.locationData
  );
  const locationLabel =
    mode === "virtual"
      ? firstString(raw?.location, raw?.eventLocation, "Online")
      : firstString(
          raw?.eventLocation,
          raw?.location,
          structuredLocation.displayLocation,
          buildLocationDisplayLabel(structuredLocation),
          raw?.venueName,
          address,
          mode === "hybrid" ? "Venue + livestream" : "Venue TBA"
        );

  const access = normalizeAccessSnapshot(raw?.access);

  return {
    id: String(firstTruthy(raw?.id, raw?.eventId, raw?._id) || ""),
    slug,
    title: title || "Untitled event",
    shortDescription,
    description,
    category: firstString(raw?.eventCategory, raw?.category, raw?.details?.eventCategory),
    mode,
    lifecycleStatus,
    privacyType,
    isPrivate,
    eventTimezone,
    viewerTimezone,
    locationLabel,
    fullAddress: address,
    startDate,
    endDate,
    startTime,
    endTime,
    startAt,
    endAt,
    goLiveAt,
    goLiveDate,
    goLiveTime,
    goLiveTimezone,
    bannerImage: firstString(raw?.bannerImage, raw?.image, raw?.heroImage),
    streamProvider: firstString(
      raw?.streamProvider,
      raw?.streamingProvider,
      streamUrl ? "Vimeo" : ""
    ),
    streamUrl,
    requiresTicketToWatch: firstTruthy(
      raw?.requiresTicketToWatch,
      raw?.mustHaveTicket,
      raw?.ticketRequiredToWatch,
      raw?.details?.requiresTicketToWatch
    )
      ? true
      : mode !== "in-person",
    accessPassword: firstString(
      raw?.accessPassword,
      raw?.password,
      raw?.eventPassword,
      raw?.details?.accessPassword
    ),
    canWatchViaStream: mode !== "in-person" && Boolean(streamUrl),
    urlPath: slug ? `/event/${slug}` : `/details?id=${raw?.id || raw?.eventId || ""}`,
    publicUrl: firstString(raw?.publicUrl),
    hostName: firstString(raw?.hostName, raw?.host, raw?.organizerName),
    minTicketPrice: Number(firstTruthy(raw?.minTicketPrice, raw?.price, 0) || 0),
    audienceCount: Number(firstTruthy(raw?.audienceCount, raw?.audience, 0) || 0),
    access,
    tickets: Array.isArray(raw?.tickets) ? raw.tickets : [],
    trainers: Array.isArray(raw?.trainers) ? raw.trainers : [],
    raw,
  };
};

export const getLifecycleLabel = (status: EventLifecycleStatus) =>
  lifecycleLabelMap[status] || status;

export const getPrivacyLabel = (privacyType: EventPrivacyType) =>
  privacyLabelMap[privacyType] || privacyType;

export const getModeLabel = (mode: EventMode) => modeLabelMap[mode] || mode;

export const getDisplayTimezone = (event: NormalizedEvent) =>
  event.mode === "virtual" ? event.viewerTimezone : event.eventTimezone;

export const formatEventDateLabel = (event: NormalizedEvent) => {
  if (event.startAt) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: getDisplayTimezone(event),
    });

    if (event.endAt && event.endDate && event.endDate !== event.startDate) {
      return `${formatter.format(event.startAt)} - ${formatter.format(event.endAt)}`;
    }

    return formatter.format(event.startAt);
  }

  if (event.startDate && event.endDate && event.startDate !== event.endDate) {
    return `${event.startDate} - ${event.endDate}`;
  }

  return event.startDate || "Date TBA";
};

export const formatEventTimeLabel = (event: NormalizedEvent) => {
  if (event.startAt) {
    const timezone = getDisplayTimezone(event);
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
      timeZoneName: "short",
    });

    const startLabel = formatter.format(event.startAt);
    if (!event.endAt) return startLabel;

    const endLabel = formatter.format(event.endAt);
    return `${startLabel} - ${endLabel}`;
  }

  const timezone = event.mode === "virtual" ? event.viewerTimezone : event.eventTimezone;
  const suffix = timezone ? ` (${timezone})` : "";

  if (event.startTime && event.endTime) {
    return `${event.startTime} - ${event.endTime}${suffix}`;
  }

  return event.startTime ? `${event.startTime}${suffix}` : "Time TBA";
};

export const formatGoLiveLabel = (event: NormalizedEvent) => {
  if (!event.goLiveAt) return "Publishes immediately";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: event.goLiveTimezone || DEFAULT_GO_LIVE_TIMEZONE,
    timeZoneName: "short",
  }).format(event.goLiveAt);
};

export const getEventAccessState = (
  event: NormalizedEvent,
  options?: {
    hasPasswordAccess?: boolean;
    isAuthorizedInvitee?: boolean;
    accessOverride?: Partial<EventAccessSnapshot> | null;
    now?: Date;
  }
) => {
  const now = options?.now || new Date();
  const fallbackAccessibleState = {
    state: "accessible",
    canView: true,
    canPurchase: event.lifecycleStatus === "PUBLISHED",
    canWatch: event.canWatchViaStream && !event.requiresTicketToWatch,
    message: "",
  };

  if (event.lifecycleStatus === "DRAFT") {
    return {
      state: "draft",
      canView: false,
      canPurchase: false,
      canWatch: false,
      message: "This event is still in draft and is not public yet.",
    };
  }

  if (event.lifecycleStatus === "UNPUBLISHED") {
    return {
      state: "unpublished",
      canView: false,
      canPurchase: false,
      canWatch: false,
      message: "Event no longer available.",
    };
  }

  if (event.goLiveAt && event.goLiveAt > now) {
    return {
      state: "scheduled",
      canView: !event.isPrivate,
      canPurchase: false,
      canWatch: false,
      message: `This event goes live on ${formatGoLiveLabel(event)}.`,
    };
  }

  const access = options?.accessOverride
    ? {
        ...event.access,
        ...options.accessOverride,
      }
    : event.access;

  if (access) {
    const inviteAuthorized =
      Boolean(options?.isAuthorizedInvitee) || Boolean(access.isAuthorizedInvitee);

    if (access.requiresPassword && !options?.hasPasswordAccess) {
      return {
        state: "password-required",
        canView: false,
        canPurchase: false,
        canWatch: false,
        message: access.message || "Enter the event password to continue.",
      };
    }

    if (access.requiresInvite && !inviteAuthorized && !access.canView && !access.canPurchase) {
      return {
        state: "invite-only",
        canView: false,
        canPurchase: false,
        canWatch: false,
        message: access.message || "Only invited guests can view and purchase this event.",
      };
    }

    if (!access.canView && !access.canPurchase && !access.canWatch) {
      return {
        state: access.reasonCode ? access.reasonCode.toLowerCase() : "restricted",
        canView: false,
        canPurchase: false,
        canWatch: false,
        message: access.message || "This event is not currently available.",
      };
    }

    return {
      state: "accessible",
      canView: access.canView || Boolean(options?.hasPasswordAccess) || inviteAuthorized,
      canPurchase:
        access.canPurchase || Boolean(options?.hasPasswordAccess) || inviteAuthorized,
      canWatch: access.canWatch,
      message: access.message || "",
    };
  }

  if (event.privacyType === "password-protected" && !options?.hasPasswordAccess) {
    return {
      state: "password-required",
      canView: false,
      canPurchase: false,
      canWatch: false,
      message: "Enter the event password to continue.",
    };
  }

  if (event.privacyType === "invite-only" && !options?.isAuthorizedInvitee) {
    return {
      state: "invite-only",
      canView: false,
      canPurchase: false,
      canWatch: false,
      message: "Only invited guests can view and purchase this event.",
    };
  }

  return fallbackAccessibleState;
};

export const canAppearInPublicListings = (event: NormalizedEvent) => {
  if (event.lifecycleStatus !== "PUBLISHED") return false;
  if (event.goLiveAt && event.goLiveAt > new Date()) return false;
  return event.privacyType === "public";
};

export const buildTenantScopedEventUrl = (
  slug: string,
  tenantSubdomain?: string | null
) => {
  const normalizedSlug = slugifyEventSlug(slug);
  if (!normalizedSlug) return "";

  if (typeof window === "undefined") return `/event/${normalizedSlug}`;

  const { protocol, host } = window.location;
  if (!tenantSubdomain) return `${protocol}//${host}/event/${normalizedSlug}`;
  return `${protocol}//${tenantSubdomain}.${host.split(".").slice(-2).join(".")}/event/${normalizedSlug}`;
};
