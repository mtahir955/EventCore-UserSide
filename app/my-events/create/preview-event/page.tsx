"use client";

import { EventSuccessModal } from "../../../host-dashboard/components/event-success-modal";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { EditStaffModal } from "../../../host-dashboard/components/edit-staff-modal";
import { Facebook, Instagram, Linkedin, CalendarClock, Link2 } from "lucide-react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import {
  formatEventDateLabel,
  formatEventTimeLabel,
  formatGoLiveLabel,
  getModeLabel,
  normalizeEvent,
  validateEventSlug,
} from "@/lib/event-publishing";
import {
  buildStructuredAddress,
  normalizeStructuredEventLocation,
} from "@/lib/google-places";
import { serializeEventTrainersForFormData } from "@/lib/trainer-library";
import {
  EventLifecycleBadge,
  EventModeBadge,
  EventPrivacyBadge,
} from "@/components/events/event-badges";

type SetImagesPageProps = {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
};

const STORAGE_KEY = "eventDraft";

const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const buildNormalizedLocation = (eventSettings: any) =>
  normalizeStructuredEventLocation({
    ...(eventSettings?.locationData || {}),
    venueName: eventSettings?.venueName,
    displayLocation: eventSettings?.displayLocation,
    addressLine1: eventSettings?.addressLine1,
    addressLine2: eventSettings?.addressLine2,
    city: eventSettings?.city,
    state: eventSettings?.state,
    postalCode: eventSettings?.postalCode,
    country: eventSettings?.country,
  });

const buildFullAddress = (eventSettings: any) =>
  buildStructuredAddress(buildNormalizedLocation(eventSettings));

export default function PreviewEventPage({
  setActivePage,
}: SetImagesPageProps) {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
  const [draft, setDraft] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      setDraft(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load event draft for preview", e);
    }
  }, []);

  const details = draft?.details || {};
  const eventSettings = draft?.eventSettings || {};
  const trainers = draft?.trainers || [];
  const tickets = draft?.tickets || [];
  const bannerImage = draft?.bannerImage;

  const previewEvent = useMemo(
    () =>
      normalizeEvent(
        {
          ...details,
          ...eventSettings,
          bannerImage,
          tickets,
          trainers,
          fullAddress: buildFullAddress(eventSettings),
        },
        eventSettings?.eventTimezone
      ),
    [bannerImage, details, eventSettings, tickets, trainers]
  );

  const publishActionLabel =
    previewEvent.goLiveAt && previewEvent.goLiveAt > new Date()
      ? "Schedule Publish"
      : "Publish Event";

  const validatePublishDraft = () => {
    if (!details?.eventTitle?.trim()) return "Add an event title before publishing.";
    if (!details?.eventCategory?.trim()) return "Select an event category before publishing.";
    if (!details?.startDate || !details?.startTime || !details?.endTime) {
      return "Set the event date and times before publishing.";
    }
    if (!bannerImage) return "Upload a banner image before publishing.";
    if (!details?.shortDescription?.trim()) {
      return "Published events require a short description.";
    }
    if (!details?.eventDescription?.trim()) {
      return "Published events require a full description.";
    }

    const slugValidation = validateEventSlug(
      eventSettings?.customSlug || details?.eventTitle || ""
    );
    if (!slugValidation.valid) return slugValidation.error;

    if (
      (previewEvent.mode === "in-person" || previewEvent.mode === "hybrid") &&
      !buildFullAddress(eventSettings)
    ) {
      return "Physical and hybrid events need a complete address.";
    }

    if (
      previewEvent.isPrivate &&
      previewEvent.privacyType === "password-protected" &&
      !eventSettings?.accessPassword?.trim()
    ) {
      return "Password-protected events need an access password.";
    }

    if (
      (previewEvent.mode === "virtual" || previewEvent.mode === "hybrid") &&
      tickets.length === 0
    ) {
      return "Virtual and hybrid events must include at least one ticket.";
    }

    return "";
  };

  const buildFormData = (lifecycleStatus: "DRAFT" | "PUBLISHED" | "UNPUBLISHED") => {
    const formData = new FormData();
    const normalizedLocation = buildNormalizedLocation(eventSettings);
    const fullAddress = buildStructuredAddress(normalizedLocation);

    formData.append("eventTitle", details.eventTitle || "");
    formData.append("shortDescription", details.shortDescription || "");
    formData.append("eventDescription", details.eventDescription || "");
    formData.append("eventCategory", details.eventCategory || "");
    formData.append("eventType", details.eventType || "");
    formData.append("startDate", details.startDate || "");
    formData.append("endDate", details.endDate || "");
    formData.append("startTime", details.startTime || "");
    formData.append("endTime", details.endTime || "");
    formData.append(
      "eventLocation",
      details.eventType === "virtual"
        ? details.eventLocation || "Online"
        : normalizedLocation.displayLocation ||
            details.eventLocation ||
            fullAddress ||
            ""
    );
    formData.append("customSlug", eventSettings.customSlug || previewEvent.slug);
    formData.append("eventTimezone", eventSettings.eventTimezone || previewEvent.eventTimezone || "");
    formData.append("lifecycleStatus", lifecycleStatus);
    formData.append("isPrivate", String(Boolean(eventSettings.isPrivate)));
    formData.append(
      "privateEventType",
      eventSettings.isPrivate ? eventSettings.privateEventType || "link-only" : "public"
    );
    formData.append("accessPassword", eventSettings.accessPassword || "");
    formData.append("goLiveDate", eventSettings.goLiveDate || "");
    formData.append("goLiveTime", eventSettings.goLiveTime || "");
    formData.append("venueName", normalizedLocation.venueName || "");
    formData.append("displayLocation", normalizedLocation.displayLocation || "");
    formData.append("addressLine1", normalizedLocation.addressLine1 || "");
    formData.append("addressLine2", normalizedLocation.addressLine2 || "");
    formData.append("city", normalizedLocation.city || "");
    formData.append("state", normalizedLocation.state || "");
    formData.append("postalCode", normalizedLocation.postalCode || "");
    formData.append("country", normalizedLocation.country || "");
    formData.append("fullAddress", fullAddress);
    formData.append("locationData", JSON.stringify(normalizedLocation));
    formData.append("streamProvider", eventSettings.streamProvider || "");
    formData.append("streamUrl", eventSettings.streamUrl || "");
    formData.append(
      "requiresTicketToWatch",
      String(Boolean(eventSettings.requiresTicketToWatch))
    );

    formData.append(
      "eventSettings",
      JSON.stringify({
        ...eventSettings,
        venueName: normalizedLocation.venueName,
        displayLocation: normalizedLocation.displayLocation,
        addressLine1: normalizedLocation.addressLine1,
        addressLine2: normalizedLocation.addressLine2,
        city: normalizedLocation.city,
        state: normalizedLocation.state,
        postalCode: normalizedLocation.postalCode,
        country: normalizedLocation.country,
        locationData: normalizedLocation,
        serviceFee: {
          enabled: Boolean(draft?.eventSettings?.serviceFee?.enabled),
          handling: draft?.eventSettings?.serviceFee?.handling || null,
        },
      })
    );

    if (bannerImage) {
      const bannerFile = dataURLtoFile(bannerImage, "banner.jpg");
      formData.append("bannerImage", bannerFile);
    }

    serializeEventTrainersForFormData(formData, trainers);

    const ticketsSanitized = tickets.map((ticket: any) => {
      const { id, ...rest } = ticket;
      return rest;
    });

    formData.append("tickets", JSON.stringify(ticketsSanitized));

    return formData;
  };

  const saveDraftLocally = () => {
    try {
      const nextDraft = {
        ...draft,
        eventSettings: {
          ...eventSettings,
          lifecycleStatus: "DRAFT",
        },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDraft));
      setDraft(nextDraft);
      toast.success("Draft saved locally. You can publish it later.");
    } catch (error) {
      console.error("Failed to save local draft", error);
      toast.error("Failed to save the draft locally.");
    }
  };

  const submitEvent = async (lifecycleStatus: "DRAFT" | "PUBLISHED") => {
    if (!draft) return;

    if (lifecycleStatus === "PUBLISHED") {
      const publishError = validatePublishDraft();
      if (publishError) {
        toast.error(publishError);
        return;
      }
    }

    try {
      setSubmitting(true);
      const res = await apiClient.post(`/events`, buildFormData(lifecycleStatus));
      const createdEvent = res?.data?.data;

      if (createdEvent?.id || createdEvent?.eventId) {
        const eventId = createdEvent.id || createdEvent.eventId;
        localStorage.setItem("lastPublishedEventId", eventId);
      }

      if (lifecycleStatus === "DRAFT") {
        toast.success("Draft saved to the event system.");
      } else {
        toast.success(
          previewEvent.goLiveAt && previewEvent.goLiveAt > new Date()
            ? "Event scheduled successfully!"
            : "Event published successfully!"
        );
        localStorage.removeItem(STORAGE_KEY);
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      console.error(error);

      if (lifecycleStatus === "DRAFT") {
        saveDraftLocally();
        return;
      }

      toast.error(error?.response?.data?.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-6 md:py-8 w-full overflow-x-hidden">
        <div
          className="rounded-2xl p-6 sm:p-8 mx-auto bg-white dark:bg-[#191919] max-w-full"
          style={{ maxWidth: 1200 }}
        >
          <div className="w-full mb-6">
            <img
              src={bannerImage || "/images/event-venue.png"}
              alt="Event venue"
              className="w-full h-[220px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover rounded-lg"
            />
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <EventLifecycleBadge
              status={
                previewEvent.goLiveAt && previewEvent.goLiveAt > new Date()
                  ? "SCHEDULED"
                  : (eventSettings.lifecycleStatus || "DRAFT")
              }
            />
            <EventModeBadge mode={previewEvent.mode} />
            <EventPrivacyBadge privacyType={previewEvent.privacyType} />
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <div className="space-y-8 min-w-0">
              <div>
                <h1 className="text-[26px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-bold mb-4 leading-tight break-words">
                  {previewEvent.title}
                </h1>
                {previewEvent.shortDescription ? (
                  <p className="text-[15px] leading-7 text-gray-700 dark:text-gray-300">
                    {previewEvent.shortDescription}
                  </p>
                ) : null}
              </div>

              <section className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
                <h3 className="mb-4 text-[18px] sm:text-[20px] font-semibold">
                  Publishing Snapshot
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <PreviewRow
                    icon={<CalendarClock className="h-4 w-4" />}
                    label="Go live"
                    value={formatGoLiveLabel(previewEvent)}
                  />
                  <PreviewRow
                    icon={<Link2 className="h-4 w-4" />}
                    label="Custom URL"
                    value={`/event/${previewEvent.slug}`}
                  />
                  <PreviewRow label="Visibility" value={previewEvent.isPrivate ? "Private" : "Public"} />
                  <PreviewRow
                    label="Timezone"
                    value={
                      previewEvent.mode === "virtual"
                        ? `${previewEvent.viewerTimezone} for viewers`
                        : previewEvent.eventTimezone
                    }
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
                <h3 className="mb-4 text-[18px] sm:text-[20px] font-semibold">
                  Date & Time
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <PreviewRow label="Date" value={formatEventDateLabel(previewEvent)} />
                  <PreviewRow label="Time" value={formatEventTimeLabel(previewEvent)} />
                  <PreviewRow label="Mode" value={getModeLabel(previewEvent.mode)} />
                  <PreviewRow
                    label="Location"
                    value={
                      previewEvent.mode === "virtual"
                        ? "Online"
                        : previewEvent.locationLabel || "Venue TBA"
                    }
                  />
                </div>
                {previewEvent.fullAddress ? (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Full address:
                    </span>{" "}
                    {previewEvent.fullAddress}
                  </p>
                ) : null}
              </section>

              <section className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
                <h3 className="mb-4 text-[18px] sm:text-[20px] font-semibold">
                  Event Description
                </h3>
                <div className="space-y-4 text-[15px] sm:text-[16px] leading-relaxed text-gray-700 dark:text-gray-400">
                  <p>{details.eventDescription || "No description added yet."}</p>
                </div>
              </section>
            </div>

            <div className="space-y-8 min-w-0">
              {(previewEvent.mode === "virtual" || previewEvent.mode === "hybrid") && (
                <section className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
                  <h3 className="mb-4 text-xl font-bold">Livestream</h3>
                  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <PreviewRow
                      label="Provider"
                      value={eventSettings.streamProvider || "Vimeo"}
                    />
                    <PreviewRow
                      label="Stream URL"
                      value={eventSettings.streamUrl || "Not added yet"}
                    />
                    <PreviewRow
                      label="Watch access"
                      value={
                        eventSettings.requiresTicketToWatch
                          ? "Logged-in ticket holders only"
                          : "Open access"
                      }
                    />
                  </div>
                </section>
              )}

              <section className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
                <h3 className="mb-4 text-xl font-bold">Tickets</h3>

                <div className="space-y-3">
                  {tickets.length > 0 ? (
                    tickets.map((ticket: any) => (
                      <div
                        className="flex items-center justify-between w-full break-words"
                        key={ticket.id}
                      >
                        <span className="text-[15px] sm:text-[16px] break-words flex items-center gap-2">
                          {ticket.name}
                          {ticket.type ? (
                            <span className="px-2 py-1 text-[11px] font-semibold rounded-md bg-[#D19537]/15 text-[#D19537] uppercase break-words">
                              {ticket.type}
                            </span>
                          ) : null}
                          {ticket.attendanceMode ? (
                            <span className="px-2 py-1 text-[11px] font-semibold rounded-md bg-blue-100 text-blue-700 uppercase break-words">
                              {ticket.attendanceMode}
                            </span>
                          ) : null}
                        </span>

                        <span className="text-[15px] sm:text-[16px] font-semibold">
                          ${ticket.price}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No tickets configured yet.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
                <h3 className="mb-4 text-xl font-bold">Trainers</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full min-w-0">
                  {trainers.length > 0 ? (
                    trainers.map((trainer: any, i: number) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-[#191919] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 flex flex-col items-center text-center transition hover:shadow-md hover:-translate-y-1 duration-300 w-full min-w-0"
                      >
                        {trainer.image && (
                          <img
                            src={trainer.image}
                            alt={trainer.name}
                            className="h-12 w-12 rounded-full object-cover mb-3"
                          />
                        )}

                        <h4 className="text-lg font-semibold break-words break-all w-full">
                          {trainer.name}
                        </h4>

                        <p className="text-sm text-[#D19537] mb-2 break-words break-all w-full">
                          {trainer.title || trainer.role || trainer.designation}
                        </p>

                        {(trainer.bio || trainer.description) ? (
                          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                            {trainer.bio || trainer.description}
                          </p>
                        ) : null}

                        <div className="flex items-center gap-3 w-full justify-center">
                          {trainer.socials?.facebook || trainer.facebook ? (
                            <a
                              href={trainer.socials?.facebook || trainer.facebook}
                              target="_blank"
                              className="h-8 w-8 rounded-full bg-gray-100 grid place-items-center hover:bg-[#0077F7] hover:text-white transition"
                            >
                              <Facebook className="h-4 w-4" />
                            </a>
                          ) : null}
                          {trainer.socials?.instagram || trainer.instagram ? (
                            <a
                              href={trainer.socials?.instagram || trainer.instagram}
                              target="_blank"
                              className="h-8 w-8 rounded-full bg-gray-100 grid place-items-center hover:bg-[#0077F7]"
                            >
                              <Instagram className="h-4 w-4" />
                            </a>
                          ) : null}
                          {trainer.socials?.linkedin || trainer.linkedin ? (
                            <a
                              href={trainer.socials?.linkedin || trainer.linkedin}
                              target="_blank"
                              className="h-8 w-8 rounded-full bg-gray-100 grid place-items-center hover:bg-[#0077F7]"
                            >
                              <Linkedin className="h-4 w-4" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No trainers added yet.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-8 py-6 bg-white dark:bg-[#191919] border-t mt-6 w-full">
          <div className="text-sm text-gray-500">
            Publish validation now checks custom URL, summary, description,
            address, privacy settings, and livestream ticket requirements.
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              className="w-full sm:w-auto px-8 py-3 rounded-lg font-medium text-[15px] sm:text-[16px]"
              style={{ backgroundColor: "#FFF4E6", color: "#D19537" }}
              onClick={() => setActivePage("set-ticketingdetails")}
            >
              Go Back
            </button>

            <button
              type="button"
              className="w-full sm:w-auto px-8 py-3 rounded-lg font-medium text-[15px] sm:text-[16px] bg-black text-white"
              onClick={() => submitEvent("DRAFT")}
              disabled={submitting}
            >
              Save Draft
            </button>

            <button
              type="button"
              className="w-full sm:w-auto px-8 py-3 rounded-lg text-white font-medium text-[15px] sm:text-[16px]"
              style={{ backgroundColor: "#D19537" }}
              onClick={(e) => {
                e.preventDefault();
                submitEvent("PUBLISHED");
              }}
              disabled={submitting}
            >
              {submitting ? "Saving..." : publishActionLabel}
            </button>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <EventSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          setIseditstaffmodalopen={setIsEditStaffModalOpen}
        />
      )}

      <EditStaffModal
        isOpen={isEditStaffModalOpen}
        onClose={() => setIsEditStaffModalOpen(false)}
      />
    </>
  );
}

function PreviewRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-[#141414]">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100">
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}
