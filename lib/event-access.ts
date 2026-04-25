import { apiClient } from "@/lib/apiClient";

type StoredEventAccessGrant = {
  accessToken: string;
  expiresAt: string;
};

const EVENT_ACCESS_PREFIX = "event-access:";

const readGrant = (key: string): StoredEventAccessGrant | null => {
  if (typeof window === "undefined") return null;

  const rawValue = localStorage.getItem(key);
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue);
    if (!parsed?.accessToken || !parsed?.expiresAt) return null;

    const expiresAt = new Date(parsed.expiresAt);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
      localStorage.removeItem(key);
      return null;
    }

    return {
      accessToken: String(parsed.accessToken),
      expiresAt: String(parsed.expiresAt),
    };
  } catch {
    return null;
  }
};

export const getEventAccessStorageKeys = (identifiers: {
  eventId?: string | null;
  eventSlug?: string | null;
}) =>
  [
    identifiers.eventId ? `${EVENT_ACCESS_PREFIX}id:${identifiers.eventId}` : "",
    identifiers.eventSlug
      ? `${EVENT_ACCESS_PREFIX}slug:${identifiers.eventSlug}`
      : "",
    identifiers.eventId || identifiers.eventSlug
      ? `${EVENT_ACCESS_PREFIX}${identifiers.eventSlug || identifiers.eventId}`
      : "",
  ].filter(Boolean);

export const getStoredEventAccessGrant = (identifiers: {
  eventId?: string | null;
  eventSlug?: string | null;
}) => {
  for (const key of getEventAccessStorageKeys(identifiers)) {
    const grant = readGrant(key);
    if (grant) return grant;
  }

  if (typeof window === "undefined") return null;

  for (const key of getEventAccessStorageKeys(identifiers)) {
    const legacy = localStorage.getItem(key);
    if (legacy && legacy.trim()) {
      return {
        accessToken: legacy.trim(),
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      };
    }
  }

  return null;
};

export const hasStoredEventAccessGrant = (identifiers: {
  eventId?: string | null;
  eventSlug?: string | null;
}) => Boolean(getStoredEventAccessGrant(identifiers));

const normalizeIdentifier = (value?: string | null) =>
  String(value || "").trim().toLowerCase();

export const hasBuyerOwnedEvent = (
  events: any[],
  identifiers: {
    eventId?: string | null;
    eventSlug?: string | null;
  }
) => {
  const targetId = normalizeIdentifier(identifiers.eventId);
  const targetSlug = normalizeIdentifier(identifiers.eventSlug);

  return events.some((entry: any) => {
    const entryId = normalizeIdentifier(entry?.id || entry?.eventId);
    const entrySlug = normalizeIdentifier(
      entry?.slug || entry?.eventSlug || entry?.customSlug
    );

    return (targetId && entryId === targetId) || (targetSlug && entrySlug === targetSlug);
  });
};

export const fetchBuyerOwnedEvents = async () => {
  const response = await apiClient.get("/users/events/mine");
  return response.data?.data?.events || response.data?.events || [];
};

export const fetchBuyerVirtualAccess = async (eventId: string) => {
  const response = await apiClient.get(`/users/events/${eventId}/virtual-access`);
  return response.data?.data || response.data || null;
};

export const storeEventAccessGrant = (
  identifiers: {
    eventId?: string | null;
    eventSlug?: string | null;
  },
  grant: StoredEventAccessGrant
) => {
  if (typeof window === "undefined") return;

  const serializedGrant = JSON.stringify(grant);
  for (const key of getEventAccessStorageKeys(identifiers)) {
    localStorage.setItem(key, serializedGrant);
  }
};
