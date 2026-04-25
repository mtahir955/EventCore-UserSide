"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { fetchEventSlugAvailability } from "@/lib/event-slugs";
import { StructuredLocationEditor } from "@/components/events/structured-location-editor";
import {
  DEFAULT_EVENT_TIMEZONE,
  EVENT_TIMEZONE_OPTIONS,
  PRIVATE_EVENT_OPTIONS,
  slugifyEventSlug,
  validateEventSlug,
} from "@/lib/event-publishing";
import {
  EMPTY_STRUCTURED_EVENT_LOCATION,
  StructuredEventLocation,
  normalizeStructuredEventLocation,
} from "@/lib/google-places";

interface TenantFeatures {
  serviceFee?: {
    enabled: boolean;
    type: string;
    value: number;
    defaultHandling?: {
      passToBuyer: boolean;
      absorbByTenant: boolean;
    };
  };
  creditSystem?: { enabled: boolean };
  paymentPlans?: { enabled: boolean };
  allowTransfers?: { enabled: boolean };
  showLoginHelp?: boolean;
}

type PublishingSettings = {
  customSlug: string;
  eventTimezone: string;
  goLiveDate: string;
  goLiveTime: string;
  lifecycleStatus: "DRAFT" | "PUBLISHED" | "UNPUBLISHED";
  isPrivate: boolean;
  privateEventType: "link-only" | "password-protected" | "invite-only";
  accessPassword: string;
  venueName: string;
  displayLocation: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  locationData: StructuredEventLocation;
  streamProvider: string;
  streamUrl: string;
  requiresTicketToWatch: boolean;
};

const defaultPublishingSettings: PublishingSettings = {
  customSlug: "",
  eventTimezone: DEFAULT_EVENT_TIMEZONE,
  goLiveDate: "",
  goLiveTime: "",
  lifecycleStatus: "DRAFT",
  isPrivate: false,
  privateEventType: "link-only",
  accessPassword: "",
  venueName: "",
  displayLocation: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  locationData: EMPTY_STRUCTURED_EVENT_LOCATION,
  streamProvider: "Vimeo",
  streamUrl: "",
  requiresTicketToWatch: true,
};

const STORAGE_KEY = "eventDraft";

export default function EventSettingsPageInline({
  setActivePage,
}: {
  setActivePage: (page: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "general" | "publishing" | "payments"
  >("publishing");
  const [features, setFeatures] = useState<TenantFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [passFee, setPassFee] = useState(false);
  const [absorbFee, setAbsorbFee] = useState(false);
  const [eventType, setEventType] = useState<
    "in-person" | "virtual" | "hybrid"
  >("in-person");
  const [eventTitle, setEventTitle] = useState("");
  const [publishingSettings, setPublishingSettings] = useState<PublishingSettings>(
    defaultPublishingSettings
  );
  const [slugError, setSlugError] = useState("");
  const [slugSuggestion, setSlugSuggestion] = useState("");
  const [checkingSlug, setCheckingSlug] = useState(false);

  const serviceFeeEnabled = features?.serviceFee?.enabled === true;

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const featureRes = await apiClient.get(`/tenants/my/features`);

        setFeatures(featureRes.data?.data?.features || {});
      } catch (err) {
        console.error("Failed to load event settings context", err);
        setFeatures({});
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  useEffect(() => {
    if (!serviceFeeEnabled) {
      setPassFee(false);
      setAbsorbFee(false);
    }
  }, [serviceFeeEnabled]);

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const details = existing?.details || {};
      const storedSettings = existing?.eventSettings || {};

      setEventTitle(details?.eventTitle || "");
      if (details?.eventType === "virtual" || details?.eventType === "hybrid") {
        setEventType(details.eventType);
      } else {
        setEventType("in-person");
      }

      setPublishingSettings((current) => {
        const normalizedLocation = normalizeStructuredEventLocation(
          storedSettings?.locationData || details?.locationData || {}
        );

        return {
          ...current,
          ...storedSettings,
          customSlug:
            storedSettings?.customSlug ||
            slugifyEventSlug(details?.eventTitle || current.customSlug),
          eventTimezone:
            storedSettings?.eventTimezone ||
            details?.eventTimezone ||
            DEFAULT_EVENT_TIMEZONE,
          venueName: storedSettings?.venueName || normalizedLocation.venueName || "",
          displayLocation:
            storedSettings?.displayLocation ||
            details?.eventLocation ||
            normalizedLocation.displayLocation ||
            "",
          addressLine1:
            storedSettings?.addressLine1 || normalizedLocation.addressLine1 || "",
          addressLine2:
            storedSettings?.addressLine2 || normalizedLocation.addressLine2 || "",
          city: storedSettings?.city || normalizedLocation.city || "",
          state: storedSettings?.state || normalizedLocation.state || "",
          postalCode:
            storedSettings?.postalCode || normalizedLocation.postalCode || "",
          country:
            storedSettings?.country ||
            normalizedLocation.country ||
            current.country,
          locationData: normalizedLocation,
          streamProvider: storedSettings?.streamProvider || "Vimeo",
          requiresTicketToWatch:
            storedSettings?.requiresTicketToWatch !== undefined
              ? Boolean(storedSettings.requiresTicketToWatch)
              : true,
        };
      });

      if (storedSettings?.serviceFee?.handling === "PASS_TO_BUYER") {
        setPassFee(true);
      }
      if (storedSettings?.serviceFee?.handling === "ABSORB_TO_HOST") {
        setAbsorbFee(true);
      }
    } catch (err) {
      console.error("Failed to hydrate event settings draft", err);
    }
  }, []);

  useEffect(() => {
    setPublishingSettings((current) => {
      if (current.customSlug) return current;
      return {
        ...current,
        customSlug: slugifyEventSlug(eventTitle),
      };
    });
  }, [eventTitle]);

  useEffect(() => {
    const { normalized, error } = validateEventSlug(publishingSettings.customSlug);
    if (error) {
      setCheckingSlug(false);
      setSlugSuggestion("");
      setSlugError(error);
      return;
    }

    if (!normalized) {
      setCheckingSlug(false);
      setSlugSuggestion("");
      setSlugError("");
      return;
    }

    let cancelled = false;
    setCheckingSlug(true);

    const timeoutId = window.setTimeout(async () => {
      try {
        const availability = await fetchEventSlugAvailability(normalized);
        if (cancelled) return;

        setSlugSuggestion(availability.suggestedSlug || "");
        setSlugError(
          availability.available
            ? ""
            : availability.reason === "ALREADY_EXISTS"
            ? "This custom URL is already in use for another event."
            : "This custom URL is unavailable right now."
        );
      } catch (availabilityError) {
        if (cancelled) return;
        setSlugSuggestion("");
        setSlugError("");
      } finally {
        if (!cancelled) {
          setCheckingSlug(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [publishingSettings.customSlug]);

  const currentHostname = useMemo(() => {
    if (typeof window === "undefined") return "tenant.eventcoresolutions.com";
    return window.location.host || "tenant.eventcoresolutions.com";
  }, []);

  const finalUrlPreview = useMemo(() => {
    const normalized = slugifyEventSlug(publishingSettings.customSlug || eventTitle);
    return normalized ? `${currentHostname}/event/${normalized}` : `${currentHostname}/event/...`;
  }, [currentHostname, eventTitle, publishingSettings.customSlug]);

  const requiresAddress = eventType === "in-person" || eventType === "hybrid";
  const requiresStream = eventType === "virtual" || eventType === "hybrid";

  const updatePublishingSettings = <K extends keyof PublishingSettings>(
    key: K,
    value: PublishingSettings[K]
  ) => {
    setPublishingSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleGoBack = () => setActivePage("create");

  const handleSaveAndContinue = () => {
    const normalizedLocation = normalizeStructuredEventLocation({
      ...publishingSettings.locationData,
      venueName: publishingSettings.venueName,
      displayLocation: publishingSettings.displayLocation,
      addressLine1: publishingSettings.addressLine1,
      addressLine2: publishingSettings.addressLine2,
      city: publishingSettings.city,
      state: publishingSettings.state,
      postalCode: publishingSettings.postalCode,
      country: publishingSettings.country,
    });

    const slugValidation = validateEventSlug(
      publishingSettings.customSlug || slugifyEventSlug(eventTitle)
    );

    if (!slugValidation.valid) {
      setActiveTab("publishing");
      setSlugError(slugValidation.error);
      return;
    }

    if (
      publishingSettings.isPrivate &&
      publishingSettings.privateEventType === "password-protected" &&
      !publishingSettings.accessPassword.trim()
    ) {
      setActiveTab("publishing");
      setSlugError("Set an event password before continuing.");
      return;
    }

    if (
      requiresAddress &&
      (!normalizedLocation.addressLine1.trim() ||
        !normalizedLocation.city.trim() ||
        !normalizedLocation.country.trim())
    ) {
      setActiveTab("publishing");
      setSlugError("Physical and hybrid events need a full address.");
      return;
    }

    if (checkingSlug || slugError) {
      setActiveTab("publishing");
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const updated = {
        ...existing,
        eventSettings: {
          ...publishingSettings,
          venueName: normalizedLocation.venueName,
          displayLocation: normalizedLocation.displayLocation,
          addressLine1: normalizedLocation.addressLine1,
          addressLine2: normalizedLocation.addressLine2,
          city: normalizedLocation.city,
          state: normalizedLocation.state,
          postalCode: normalizedLocation.postalCode,
          country: normalizedLocation.country,
          locationData: normalizedLocation,
          customSlug: slugValidation.normalized,
          serviceFee: {
            enabled: serviceFeeEnabled,
            handling: passFee
              ? "PASS_TO_BUYER"
              : absorbFee
              ? "ABSORB_TO_HOST"
              : null,
          },
        },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setActivePage("set-ticketingdetailsT");
    } catch (err) {
      console.error("Failed to save event settings", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-sm text-gray-500">
        Loading feature permissions...
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 pb-12">
      <div className="mb-8">
        <h2 className="text-[26px] font-semibold">Event Settings</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Configure publishing, privacy, address, streaming, and payment behavior
          for this event.
        </p>
      </div>

      <div className="flex gap-6 border-b pb-3 mb-6 dark:border-gray-700">
        {(["publishing", "general", "payments"] as const).map((tab) => (
          <button
            key={tab}
            className={`pb-2 font-medium text-sm ${
              activeTab === tab
                ? "border-b-2 border-black dark:border-white"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === "publishing" && (
        <div className="space-y-8">
          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Publishing Lifecycle</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Events start as drafts, can auto-publish at a scheduled go-live
                time, and can later be unpublished without deleting internal data.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FieldShell label="Default status">
                <select
                  value={publishingSettings.lifecycleStatus}
                  onChange={(e) =>
                    updatePublishingSettings(
                      "lifecycleStatus",
                      e.target.value as PublishingSettings["lifecycleStatus"]
                    )
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="UNPUBLISHED">Unpublished</option>
                </select>
              </FieldShell>

              <FieldShell label="Go-live date">
                <input
                  type="date"
                  value={publishingSettings.goLiveDate}
                  onChange={(e) =>
                    updatePublishingSettings("goLiveDate", e.target.value)
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                />
              </FieldShell>

              <FieldShell label="Go-live time">
                <input
                  type="time"
                  value={publishingSettings.goLiveTime}
                  onChange={(e) =>
                    updatePublishingSettings("goLiveTime", e.target.value)
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                />
              </FieldShell>
            </div>

            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Go-live uses Pacific Time by default. Scheduled events auto-publish
              when the go-live moment arrives.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Custom Event URL</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Each event gets a tenant-specific URL. Slugs are lowercase,
                hyphenated, and unique within the tenant.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <FieldShell label="Custom slug" required>
                <input
                  type="text"
                  value={publishingSettings.customSlug}
                  onChange={(e) =>
                    updatePublishingSettings("customSlug", slugifyEventSlug(e.target.value))
                  }
                  placeholder="summer-gala-2026"
                  className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                />
              </FieldShell>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() =>
                    updatePublishingSettings("customSlug", slugifyEventSlug(eventTitle))
                  }
                  className="h-12 rounded-lg bg-[#FFF5E6] px-4 text-sm font-semibold text-[#D19537]"
                >
                  Use title
                </button>
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:bg-[#151515] dark:text-gray-200">
              {finalUrlPreview}
            </div>

            {slugError ? (
              <>
                <p className="mt-2 text-sm text-[#D6111A]">{slugError}</p>
                {slugSuggestion ? (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Try this instead: {slugSuggestion}
                  </p>
                ) : null}
              </>
            ) : checkingSlug ? (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Checking slug availability...
              </p>
            ) : slugSuggestion ? (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Suggested available slug: {slugSuggestion}
              </p>
            ) : (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Lowercase letters, numbers, and hyphens only.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Privacy & Access</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Private events stay out of public listings. Choose how guests get
                access.
              </p>
            </div>

            <label className="mb-5 flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
              <div>
                <p className="font-medium">Private event</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Off by default. Turn on to hide the event from public search and
                  listing pages.
                </p>
              </div>
              <input
                type="checkbox"
                checked={publishingSettings.isPrivate}
                onChange={(e) =>
                  updatePublishingSettings("isPrivate", e.target.checked)
                }
                className="h-5 w-5 accent-[#D19537]"
              />
            </label>

            {publishingSettings.isPrivate && (
              <div className="space-y-3">
                {PRIVATE_EVENT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`block rounded-xl border p-4 ${
                      publishingSettings.privateEventType === option.value
                        ? "border-[#D19537] bg-[#FFF9F1] dark:bg-[#241b0b]"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="private-event-type"
                        checked={publishingSettings.privateEventType === option.value}
                        onChange={() =>
                          updatePublishingSettings(
                            "privateEventType",
                            option.value as PublishingSettings["privateEventType"]
                          )
                        }
                        className="mt-1 accent-[#D19537]"
                      />
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}

                {publishingSettings.privateEventType === "password-protected" && (
                  <FieldShell label="Event password" required>
                    <input
                      type="text"
                      value={publishingSettings.accessPassword}
                      onChange={(e) =>
                        updatePublishingSettings("accessPassword", e.target.value)
                      }
                      className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                      placeholder="Enter access password"
                    />
                  </FieldShell>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Time Zone & Venue</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                In-person and hybrid events display in the event timezone. Virtual
                events display in the purchaser&apos;s local timezone.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FieldShell label="Event timezone">
                <select
                  value={publishingSettings.eventTimezone}
                  onChange={(e) =>
                    updatePublishingSettings("eventTimezone", e.target.value)
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                >
                  {EVENT_TIMEZONE_OPTIONS.map((timezone) => (
                    <option key={timezone.value} value={timezone.value}>
                      {timezone.label}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:bg-[#151515] dark:text-gray-300">
                {eventType === "virtual"
                  ? "Virtual events will show in the buyer's own timezone on the public page."
                  : "This timezone will be used across the event page, go-live schedule, and host dashboards."}
              </div>
            </div>

            {requiresAddress && (
              <div className="mt-5">
                <StructuredLocationEditor
                  label="Venue and address"
                  required
                  value={normalizeStructuredEventLocation({
                    ...publishingSettings.locationData,
                    venueName: publishingSettings.venueName,
                    displayLocation: publishingSettings.displayLocation,
                    addressLine1: publishingSettings.addressLine1,
                    addressLine2: publishingSettings.addressLine2,
                    city: publishingSettings.city,
                    state: publishingSettings.state,
                    postalCode: publishingSettings.postalCode,
                    country: publishingSettings.country,
                  })}
                  onChange={(nextLocation) =>
                    setPublishingSettings((current) => ({
                      ...current,
                      venueName: nextLocation.venueName,
                      displayLocation: nextLocation.displayLocation,
                      addressLine1: nextLocation.addressLine1,
                      addressLine2: nextLocation.addressLine2,
                      city: nextLocation.city,
                      state: nextLocation.state,
                      postalCode: nextLocation.postalCode,
                      country: nextLocation.country,
                      locationData: nextLocation,
                    }))
                  }
                  helperText="Use Google Places first, then adjust any field manually if the venue needs a custom override."
                />
              </div>
            )}
          </section>

          {requiresStream && (
            <section className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Livestream Settings</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Virtual and hybrid events can stream on-platform. Vimeo is the
                  default provider.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FieldShell label="Streaming provider">
                  <select
                    value={publishingSettings.streamProvider}
                    onChange={(e) =>
                      updatePublishingSettings("streamProvider", e.target.value)
                    }
                    className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  >
                    <option value="Vimeo">Vimeo</option>
                  </select>
                </FieldShell>

                <FieldShell label="Stream URL">
                  <input
                    type="url"
                    value={publishingSettings.streamUrl}
                    onChange={(e) =>
                      updatePublishingSettings("streamUrl", e.target.value)
                    }
                    className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                    placeholder="https://vimeo.com/..."
                  />
                </FieldShell>
              </div>

              <label className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
                <div>
                  <p className="font-medium">Require a ticket to watch</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Required for livestreamed events so only logged-in ticket
                    holders can watch.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={publishingSettings.requiresTicketToWatch}
                  onChange={(e) =>
                    updatePublishingSettings(
                      "requiresTicketToWatch",
                      e.target.checked
                    )
                  }
                  className="h-5 w-5 accent-[#D19537]"
                />
              </label>
            </section>
          )}
        </div>
      )}

      {activeTab === "general" && (
        <div className="space-y-5">
          <FeatureRow
            label="Service fee enabled"
            enabled={features?.serviceFee?.enabled}
          />
          <FeatureRow
            label="Allow credit"
            enabled={features?.creditSystem?.enabled}
          />
          <FeatureRow
            label="Payment plans"
            enabled={features?.paymentPlans?.enabled}
          />
          <FeatureRow
            label="Ticket transfers"
            enabled={features?.allowTransfers?.enabled}
          />
        </div>
      )}

      {activeTab === "payments" && (
        <div className="space-y-5">
          {!serviceFeeEnabled ? (
            <p className="text-sm text-gray-500">
              Service fee option is not enabled for your account.
            </p>
          ) : (
            <>
              <SettingToggle
                label="Pass service fee to buyer"
                checked={passFee}
                onToggle={() => {
                  setPassFee(!passFee);
                  if (!passFee) setAbsorbFee(false);
                }}
              />

              <SettingToggle
                label="Absorb service fee from earnings"
                checked={absorbFee}
                onToggle={() => {
                  setAbsorbFee(!absorbFee);
                  if (!absorbFee) setPassFee(false);
                }}
              />

              <p className="text-xs text-gray-500 ml-1">
                Choose how the service fee is handled for this event.
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-10">
        <button
          onClick={handleGoBack}
          className="h-11 px-6 rounded-xl bg-[#FFF5E6] text-[#D19537] font-semibold"
        >
          Go Back
        </button>

        <button
          onClick={handleSaveAndContinue}
          className="h-11 px-6 rounded-xl bg-[#D19537] text-white font-semibold"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}

function FeatureRow({ label, enabled }: { label: string; enabled?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`h-5 w-5 rounded-md border flex items-center justify-center ${
          enabled
            ? "bg-[#D19537] border-[#D19537]"
            : "border-gray-400 dark:border-gray-600"
        }`}
      >
        {enabled && (
          <svg width="14" height="14" viewBox="0 0 20 20">
            <path
              d="M5 10L8.5 13.5L15 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <span className="text-[15px] text-gray-800 dark:text-gray-200">
        {label}
      </span>
    </div>
  );
}

function SettingToggle({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={onToggle}
        className={`h-5 w-5 rounded-md border flex items-center justify-center ${
          checked
            ? "bg-[#D19537] border-[#D19537]"
            : "border-gray-400 dark:border-gray-600 bg-white dark:bg-[#181818]"
        }`}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 20 20">
            <path
              d="M5 10L8.5 13.5L15 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <span className="text-[15px] text-gray-800 dark:text-gray-200">
        {label}
      </span>
    </label>
  );
}

function FieldShell({
  label,
  children,
  required,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label} {required ? <span className="text-[#D6111A]">*</span> : null}
      </label>
      {children}
    </div>
  );
}
