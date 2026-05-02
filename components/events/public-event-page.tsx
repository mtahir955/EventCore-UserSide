"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, Clock, FileText, MapPin, PlayCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import AuthRequiredModal from "@/components/modals/AuthRequiredModal";
import { CountdownTimer } from "@/app/details/components/countdown-timer";
import { CalendarModal } from "@/app/details/components/calendar-modal";
import { EventCard } from "@/app/events/components/event-card";
import { apiClient } from "@/lib/apiClient";
import { API_BASE_URL } from "@/config/apiConfig";
import {
  fetchBuyerOwnedEvents,
  getStoredEventAccessGrant,
  hasBuyerOwnedEvent,
  storeEventAccessGrant,
} from "@/lib/event-access";
import {
  canAppearInPublicListings,
  formatEventDateLabel,
  formatEventTimeLabel,
  getEventAccessState,
  normalizeEvent,
} from "@/lib/event-publishing";
import {
  EventLifecycleBadge,
  EventModeBadge,
  EventPrivacyBadge,
} from "@/components/events/event-badges";
import {
  normalizeCommerceTicket,
  normalizeEventAddOns,
} from "@/lib/event-commerce";

const safeUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const base = (API_BASE_URL || "").replace(/\/$/, "");
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
};

const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return [
    "buyerToken",
    "userToken",
    "staffToken",
    "hostToken",
    "token",
  ].some((key) => !!localStorage.getItem(key));
};

const toVimeoEmbedUrl = (input?: string) => {
  const raw = String(input || "").trim();
  if (!raw) return "";
  if (raw.includes("player.vimeo.com")) return raw;

  const match = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (!match) return raw;
  return `https://player.vimeo.com/video/${match[1]}`;
};

async function fetchPublicEventByIdentifiers(
  eventId?: string | null,
  eventSlug?: string | null
) {
  const attempts: Array<() => Promise<any>> = [];

  if (eventId) {
    attempts.push(() => apiClient.get(`/events/public/${eventId}`));
  }

  if (eventSlug) {
    attempts.push(() => apiClient.get(`/events/public/slug/${eventSlug}`));
  }

  let lastError: any = null;

  for (const attempt of attempts) {
    try {
      const res = await attempt();
      return res.data?.data || res.data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export function PublicEventPage({
  eventId,
  eventSlug,
}: {
  eventId?: string | null;
  eventSlug?: string | null;
}) {
  type CalendarEntryState = {
    calendarId: string | null;
    pinnedDate: string | null;
    isPinned: boolean;
  };

  const router = useRouter();
  const [eventData, setEventData] = useState<any>(null);
  const [relatedEvents, setRelatedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [hasPasswordAccess, setHasPasswordAccess] = useState(false);
  const [hasTicketAccess, setHasTicketAccess] = useState(false);
  const [accessSnapshot, setAccessSnapshot] = useState<any>(null);
  const [calendarEntry, setCalendarEntry] = useState<CalendarEntryState>({
    calendarId: null,
    pinnedDate: null,
    isPinned: false,
  });

  useEffect(() => {
    let cancelled = false;

    const loadEvent = async () => {
      try {
        setLoading(true);
        setLoadError("");
        setHasPasswordAccess(false);
        setHasTicketAccess(false);
        setAccessSnapshot(null);
        const data = await fetchPublicEventByIdentifiers(eventId, eventSlug);
        if (!cancelled) {
          setEventData(data);
          setAccessSnapshot(data?.access || null);
        }
      } catch (error) {
        console.error("Failed to load public event", error);
        if (!cancelled) {
          setLoadError("We couldn't load this event.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadEvent();
    return () => {
      cancelled = true;
    };
  }, [eventId, eventSlug]);

  const event = useMemo(() => normalizeEvent(eventData), [eventData]);
  const commerceTickets = useMemo(
    () =>
      event.tickets.map((ticket: any) =>
        normalizeCommerceTicket(ticket, {
          eventMode: event.mode,
        })
      ),
    [event.mode, event.tickets]
  );
  const eventAddOns = useMemo(() => normalizeEventAddOns(eventData), [eventData]);
  const hasPurchasableTicket = useMemo(
    () => commerceTickets.some((ticket) => ticket.saleStatus === "on-sale"),
    [commerceTickets]
  );
  const eventKey = event.slug || event.id || eventSlug || eventId || "";
  const eventImage = safeUrl(event.bannerImage) || "/images/hero-image.png";
  const calendarDate = event.startAt || event.goLiveAt || undefined;

  useEffect(() => {
    const storedGrant = getStoredEventAccessGrant({
      eventId: event.id || eventId,
      eventSlug: event.slug || eventSlug,
    });

    if (storedGrant) {
      setHasPasswordAccess(true);
    }
  }, [event.id, event.slug, eventId, eventSlug, eventKey]);

  useEffect(() => {
    let cancelled = false;

    const loadUserAccess = async () => {
      if (!isLoggedIn() || !event.id) return;

      try {
        const entries = await fetchBuyerOwnedEvents();
        const hasAccess = hasBuyerOwnedEvent(entries, {
          eventId: event.id,
          eventSlug: event.slug,
        });

        if (!cancelled) {
          setAccessSnapshot((current: any) => ({
            ...(current || {}),
            hasTicket: hasAccess,
          }));
          setHasTicketAccess(hasAccess);
        }
      } catch (error) {
        console.error("Failed to load event access", error);
      }
    };

    loadUserAccess();
    return () => {
      cancelled = true;
    };
  }, [event.id, event.slug]);

  useEffect(() => {
    let cancelled = false;

    const resetCalendarEntry = () => {
      if (!cancelled) {
        setCalendarEntry({
          calendarId: null,
          pinnedDate: null,
          isPinned: false,
        });
      }
    };

    const loadCalendarEntry = async () => {
      if (!isLoggedIn() || (!event.id && !event.slug)) {
        resetCalendarEntry();
        return;
      }

      try {
        const response = await apiClient.get("/users/calendar");
        const entries = response.data?.data?.entries || [];

        const matchedEntry = entries.find((entry: any) => {
          const entryEventId = String(
            entry?.event?.id || entry?.eventId || entry?.event?._id || ""
          );
          const entryEventSlug = String(
            entry?.event?.slug ||
              entry?.eventSlug ||
              entry?.event?.customSlug ||
              ""
          )
            .trim()
            .toLowerCase();
          const currentEventId = String(event.id || "");
          const currentEventSlug = String(event.slug || "")
            .trim()
            .toLowerCase();

          return (
            (currentEventId && entryEventId === currentEventId) ||
            (currentEventSlug && entryEventSlug === currentEventSlug)
          );
        });

        if (!cancelled) {
          setCalendarEntry({
            calendarId: matchedEntry?.id ? String(matchedEntry.id) : null,
            pinnedDate:
              matchedEntry?.selectedDate ||
              matchedEntry?.reminderDate ||
              matchedEntry?.date ||
              null,
            isPinned: Boolean(matchedEntry?.id),
          });
        }
      } catch (error) {
        console.error("Failed to load calendar reminder", error);
        resetCalendarEntry();
      }
    };

    loadCalendarEntry();

    return () => {
      cancelled = true;
    };
  }, [event.id, event.slug]);

  useEffect(() => {
    let cancelled = false;

    const loadRelatedEvents = async () => {
      try {
        setRelatedLoading(true);

        const response = await apiClient.get("/events/upcoming");
        const entries = response.data?.data?.events || response.data?.events || [];

        const nextEvents = entries
          .filter((entry: any) => {
            const normalizedEntry = normalizeEvent(entry);

            if (!canAppearInPublicListings(normalizedEntry)) return false;
            if (event.id && normalizedEntry.id === event.id) return false;
            if (event.slug && normalizedEntry.slug === event.slug) return false;
            return true;
          })
          .slice(0, 3);

        if (!cancelled) {
          setRelatedEvents(nextEvents);
        }
      } catch (error) {
        console.error("Failed to load related events", error);
        if (!cancelled) {
          setRelatedEvents([]);
        }
      } finally {
        if (!cancelled) {
          setRelatedLoading(false);
        }
      }
    };

    loadRelatedEvents();

    return () => {
      cancelled = true;
    };
  }, [event.id, event.slug]);

  const accessState = getEventAccessState(event, {
    hasPasswordAccess,
    isAuthorizedInvitee: Boolean(
      accessSnapshot?.isAuthorizedInvitee || accessSnapshot?.hasTicket || hasTicketAccess
    ),
    accessOverride: accessSnapshot,
  });

  const canPurchase =
    accessState.canPurchase &&
    !hasTicketAccess &&
    hasPurchasableTicket &&
    (event.lifecycleStatus === "PUBLISHED" || canAppearInPublicListings(event));

  const canWatch =
    accessState.canView &&
    event.canWatchViaStream &&
    (!event.requiresTicketToWatch || hasTicketAccess);
  const shouldShowPasswordPrompt =
    !accessState.canView &&
    (
      accessState.state === "password-required" ||
      event.privacyType === "password-protected" ||
      Boolean(accessSnapshot?.requiresPassword) ||
      /password/i.test(accessState.message || "")
    );

  const handleCheckout = () => {
    if (!isLoggedIn()) {
      setAuthModalOpen(true);
      return;
    }

    const params = new URLSearchParams();
    if (event.id) params.set("id", event.id);
    if (event.slug) params.set("slug", event.slug);
    router.push(`/check-out?${params.toString()}`);
  };

  const handleUnlockPassword = () => {
    const submitPassword = async () => {
      if (!passwordInput.trim() || !event.id) return;

      try {
        const res = await apiClient.post(
          `/events/${event.id}/access/password/verify`,
          {
            password: passwordInput.trim(),
          }
        );

        const verificationData = res.data?.data || {};

        storeEventAccessGrant(
          {
            eventId: event.id,
            eventSlug: event.slug || eventSlug,
          },
          {
            accessToken: verificationData.accessToken || "verified",
            expiresAt:
              verificationData.expiresAt ||
              new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          }
        );

        setHasPasswordAccess(true);
        setAccessSnapshot((current: any) => ({
          ...(current || {}),
          ...verificationData,
          canView: verificationData.canView ?? true,
          canPurchase: verificationData.canPurchase ?? true,
          requiresPassword: false,
          reasonCode: "OK",
          message: "",
        }));
        setLoadError("");
      } catch (error: any) {
        setLoadError(
          error?.response?.data?.message || "That password is incorrect."
        );
      }
    };

    submitPassword();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#101010] text-black dark:text-white">
        <Header />
        <main className="mx-auto max-w-[1440px] px-6 py-16">
          <p className="text-sm text-gray-500">Loading event...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (loadError && !eventData) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#101010] text-black dark:text-white">
        <Header />
        <main className="mx-auto max-w-[1440px] px-6 py-16">
          <div className="rounded-2xl border border-gray-200 p-6 dark:border-gray-800">
            <h1 className="text-2xl font-semibold">Event unavailable</h1>
            <p className="mt-3 text-sm text-gray-500">{loadError}</p>
            <Link href="/events" className="mt-5 inline-block text-sm font-semibold text-[#0077F7]">
              Browse events
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#101010] text-black dark:text-white transition-colors duration-300">
      <Header />

      <main>
        <section className="relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-8">
          <div className="relative h-[220px] sm:h-[300px] md:h-[420px] rounded-2xl overflow-hidden">
            <Image
              src={safeUrl(event.bannerImage) || "/images/hero-image.png"}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/35" />

            {event.startAt ? (
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <CountdownTimer targetDate={event.startAt} />
              </div>
            ) : null}
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="mb-4 flex flex-wrap gap-3">
                  <EventLifecycleBadge status={event.lifecycleStatus} />
                  <EventModeBadge mode={event.mode} />
                  <EventPrivacyBadge privacyType={event.privacyType} />
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  {event.title}
                </h1>

                {event.shortDescription ? (
                  <p className="mb-6 text-base leading-7 text-gray-700 dark:text-gray-300">
                    {event.shortDescription}
                  </p>
                ) : null}

                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Date and Time
                  </h2>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">
                        {event.mode === "virtual" ? "Online" : event.locationLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">
                        {formatEventDateLabel(event)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">
                        {formatEventTimeLabel(event)}
                      </span>
                    </div>
                  </div>

                  {event.fullAddress && event.mode !== "virtual" ? (
                    <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:bg-[#161616] dark:text-gray-300">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Address:
                      </span>{" "}
                      {event.fullAddress}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={() => setCalendarModalOpen(true)}
                      disabled={!event.id || !calendarDate}
                      className="bg-[#0077F7] text-white hover:bg-[#0066D6] disabled:opacity-60"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {calendarEntry.isPinned ? "Update Calendar" : "Add to Calendar"}
                    </Button>

                    <Button
                      type="button"
                      asChild
                      variant="outline"
                      className="border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:bg-[#101010] dark:text-white dark:hover:bg-[#171717]"
                    >
                      <Link href="/terms-of-services">
                        <FileText className="mr-2 h-4 w-4" />
                        Terms of Services
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {!accessState.canView ? (
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
                  <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                    Access Required
                  </h2>
                  <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
                    {accessState.message}
                  </p>

                  {shouldShowPasswordPrompt ? (
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Enter event password"
                        className="h-11 flex-1 rounded-lg border border-amber-300 bg-white px-4 text-sm text-black"
                      />
                      <Button
                        onClick={handleUnlockPassword}
                        className="h-11 bg-[#0077F7] text-white"
                      >
                        Unlock Event
                      </Button>
                    </div>
                  ) : null}
                </section>
              ) : (
                <section className="space-y-8">
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
                      Event Description
                    </h2>
                    <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                      <p>{event.description || "No description available."}</p>
                    </div>
                  </div>

                  {event.canWatchViaStream ? (
                    <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
                      <div className="mb-4 flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-[#0077F7]" />
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                          Virtual Access
                        </h2>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The virtual watch link is hidden from the public event page and
                        only appears inside the logged-in purchaser&apos;s ticket area
                        after checkout.
                      </p>
                    </div>
                  ) : null}
                </section>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
                <h3 className="text-xl font-bold mb-4">Tickets</h3>

                <div className="space-y-3">
                  {commerceTickets.length > 0 ? (
                    commerceTickets.map((ticket: any, index: number) => (
                      <div
                        key={ticket.id || ticket.ticketId || index}
                        className="rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800"
                      >
                        <div className="min-w-0 pr-4">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {ticket.name || "Ticket"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {ticket.type || "General"}
                          </p>
                          {ticket.description ? (
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              {ticket.description}
                            </p>
                          ) : null}
                          <p
                            className={`mt-2 text-xs font-medium ${
                              ticket.saleStatus === "on-sale"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : ticket.saleStatus === "sold-out"
                                  ? "text-rose-600 dark:text-rose-400"
                                  : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {ticket.saleStatusLabel}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {ticket.saleStatusDetail}
                          </p>
                          {ticket.quantity !== null ? (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {ticket.remainingQuantity} available of {ticket.quantity}
                            </p>
                          ) : null}
                          {ticket.saleStartAt || ticket.saleEndAt ? (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {ticket.saleStartAt
                                ? `Starts ${ticket.saleStartAt.toLocaleString()}`
                                : "On sale now"}
                              {" • "}
                              {ticket.saleEndAt
                                ? `Ends ${ticket.saleEndAt.toLocaleString()}`
                                : "No scheduled close"}
                            </p>
                          ) : null}
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">${ticket.price || 0}</span>
                          <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                            {ticket.transferable ? "Transferable" : "Non-transferable"}
                            {" • "}
                            {ticket.refundable ? "Refundable" : "No refunds"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Tickets are not available.</p>
                  )}
                </div>

                {eventAddOns.length > 0 ? (
                  <div className="mt-5 rounded-xl bg-gray-50 px-4 py-4 dark:bg-[#161616]">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Available add-ons
                    </p>
                    <div className="mt-3 space-y-3">
                      {eventAddOns.map((addOn) => (
                        <div
                          key={addOn.id}
                          className="flex items-start justify-between gap-4 text-sm"
                        >
                          <div className="min-w-0 pr-4">
                            <p className="font-medium">{addOn.name}</p>
                            {addOn.description ? (
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {addOn.description}
                              </p>
                            ) : null}
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {addOn.saleStatusDetail}
                            </p>
                          </div>
                          <span className="font-semibold">${addOn.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {accessState.state === "unpublished" ? (
                  <div className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:bg-rose-950/20 dark:text-rose-100">
                    Event no longer available.
                  </div>
                ) : canPurchase ? (
                  <Button
                    onClick={handleCheckout}
                    className="mt-5 w-full bg-[#0077F7] hover:bg-[#0066D6] text-white"
                  >
                    Lock me in!
                  </Button>
                ) : hasTicketAccess ? (
                  <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-100">
                    You already have access to this event.
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:bg-[#161616] dark:text-gray-300">
                    {accessState.message || "Purchases are currently unavailable."}
                  </div>
                )}
              </div>

              {event.trainers.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Trainers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.trainers.map((trainer: any, i: number) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-[#191919] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 text-center"
                      >
                        <img
                          src={safeUrl(trainer.image) || "/placeholder.svg"}
                          className="h-12 w-12 rounded-full mx-auto mb-3 object-cover"
                          alt={trainer.name}
                        />

                        <h4 className="text-lg font-semibold">{trainer.name}</h4>
                        <p className="text-sm text-[#D19537] mb-2">
                          {trainer.title || trainer.role || trainer.designation}
                        </p>
                        {(trainer.bio || trainer.description) ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {trainer.bio || trainer.description}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 pb-10 md:pb-16">
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#121212] md:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                  Explore More Events
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Keep the momentum going with more upcoming experiences.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                asChild
                className="w-full border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:bg-[#101010] dark:text-white dark:hover:bg-[#171717] sm:w-auto"
              >
                <Link href="/events">
                  Explore Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {relatedLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading more events...
              </p>
            ) : relatedEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {relatedEvents.map((relatedEvent) => (
                  <EventCard
                    key={
                      relatedEvent.id ||
                      relatedEvent._id ||
                      relatedEvent.slug ||
                      relatedEvent.eventId
                    }
                    event={relatedEvent}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-gray-50 px-5 py-6 text-sm text-gray-600 dark:bg-[#161616] dark:text-gray-300">
                No additional public events are available right now.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <CalendarModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        eventTitle={event.title}
        eventDescription={event.shortDescription || event.description}
        eventImage={eventImage}
        eventId={event.id}
        initialDate={calendarDate}
        initialPinnedDate={calendarEntry.pinnedDate}
        initialCalendarId={calendarEntry.calendarId}
        initialIsPinned={calendarEntry.isPinned}
        onCalendarUpdated={(data) => {
          setCalendarEntry({
            calendarId: data.calendarId,
            pinnedDate: data.pinnedDate,
            isPinned: data.hasPinned,
          });
        }}
      />

      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
