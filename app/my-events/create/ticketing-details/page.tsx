"use client";

import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import {
  CHECKOUT_FIELD_DEFINITIONS,
  DEFAULT_CHECKOUT_FIELD_ORDER,
  type CheckoutFieldKey,
} from "@/lib/event-commerce";

interface Ticket {
  clientReferenceId: string;
  name: string;
  price: string;
  type: string;
  description: string;
  quantity: string;
  totalQuantity: string;
  saleStartAt: string;
  saleEndAt: string;
  minOrder: string;
  maxOrder: string;
  attendanceMode?: "in-person" | "virtual";
  transferable: boolean;
  refundable: boolean;
  paymentPlanEnabled: boolean;
  checkoutFields: CheckoutFieldKey[];
  addOnIds: string[];
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: string;
  quantity: string;
  saleStartAt: string;
  saleEndAt: string;
  applicableTicketTypeIds: string[];
  transferable: boolean;
  creditEligible: boolean;
  paymentPlanEligible: boolean;
}

type SetImagesPageProps = {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
};

type EventDraft = {
  details?: {
    eventType?: string;
  };
  eventType?: "ticketed" | "free";
  tickets?: Ticket[];
  addOns?: AddOn[];
  eventSettings?: Record<string, any>;
};

const STORAGE_KEY = "eventDraft";
const DEFAULT_EVENT_CHECKOUT_FIELDS = DEFAULT_CHECKOUT_FIELD_ORDER.filter(
  (field) => field !== "gender"
);

const createEmptyTicket = (): Ticket => ({
  clientReferenceId: crypto.randomUUID(),
  name: "",
  price: "",
  type: "",
  description: "",
  quantity: "",
  totalQuantity: "",
  saleStartAt: "",
  saleEndAt: "",
  minOrder: "1",
  maxOrder: "10",
  attendanceMode: "in-person",
  transferable: true,
  refundable: false,
  paymentPlanEnabled: false,
  checkoutFields: [],
  addOnIds: [],
});

const createEmptyAddOn = (): AddOn => ({
  id: "",
  name: "",
  description: "",
  price: "",
  quantity: "",
  saleStartAt: "",
  saleEndAt: "",
  applicableTicketTypeIds: [],
  transferable: false,
  creditEligible: false,
  paymentPlanEligible: false,
});

const readDraft = (): EventDraft => {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (error) {
    console.error("Failed to read event draft", error);
    return {};
  }
};

const persistDraft = (patch: Partial<EventDraft>) => {
  if (typeof window === "undefined") return;

  try {
    const existing = readDraft();
    const nextDraft = {
      ...existing,
      ...patch,
      eventSettings: {
        ...(existing.eventSettings || {}),
        ...(patch.eventSettings || {}),
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDraft));
  } catch (error) {
    console.error("Failed to save event draft", error);
  }
};

const toggleArrayValue = <T,>(values: T[], value: T) =>
  values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value];

export default function TicketingDetailsPage({
  setActivePage,
}: SetImagesPageProps) {
  const [eventType, setEventType] = useState<"ticketed" | "free">("ticketed");
  const [eventMode, setEventMode] = useState<"in-person" | "virtual" | "hybrid">(
    "in-person"
  );
  const [isStreamingEvent, setIsStreamingEvent] = useState(false);
  const [allowTransfers, setAllowTransfers] = useState(false);
  const [allowRefunds, setAllowRefunds] = useState(false);
  const [allowPaymentPlans, setAllowPaymentPlans] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [eventCheckoutFields, setEventCheckoutFields] = useState<CheckoutFieldKey[]>(
    DEFAULT_EVENT_CHECKOUT_FIELDS
  );
  const [currentTicket, setCurrentTicket] = useState<Ticket>(createEmptyTicket());
  const [currentAddOn, setCurrentAddOn] = useState<AddOn>(createEmptyAddOn());
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await apiClient.get(`/tenants/my/features`);
        const features = res.data?.data?.features ?? {};

        setAllowTransfers(Boolean(features?.allowTransfers?.enabled));
        setAllowRefunds(Boolean(features?.allowRefunds?.enabled));
        setAllowPaymentPlans(Boolean(features?.paymentPlans?.enabled));
      } catch (err) {
        console.error("Failed to load tenant features", err);
        setAllowTransfers(false);
        setAllowRefunds(false);
        setAllowPaymentPlans(false);
      }
    };

    fetchFeatures();
  }, []);

  useEffect(() => {
    const draft = readDraft();
    const details = draft.details || {};
    const eventSettings = draft.eventSettings || {};

    if (details.eventType === "virtual" || details.eventType === "hybrid") {
      setEventMode(details.eventType);
    }

    const streamingEnabled = Boolean(
      eventSettings.streamUrl || eventSettings.vimeoUrl
    );

    setIsStreamingEvent(
      streamingEnabled &&
        (details.eventType === "virtual" || details.eventType === "hybrid")
    );

    if (draft.eventType === "free" || draft.eventType === "ticketed") {
      setEventType(
        streamingEnabled &&
          (details.eventType === "virtual" || details.eventType === "hybrid")
          ? "ticketed"
          : draft.eventType
      );
    }

    if (Array.isArray(draft.tickets)) {
      setTickets(
        draft.tickets.map((ticket) => ({
          ...createEmptyTicket(),
          ...ticket,
          clientReferenceId: ticket.clientReferenceId || crypto.randomUUID(),
          checkoutFields: Array.isArray(ticket.checkoutFields)
            ? ticket.checkoutFields
            : [],
          addOnIds: Array.isArray(ticket.addOnIds) ? ticket.addOnIds : [],
        }))
      );
    }

    if (Array.isArray(draft.addOns)) {
      setAddOns(
        draft.addOns.map((addOn) => ({
          ...createEmptyAddOn(),
          ...addOn,
          id: addOn.id || crypto.randomUUID(),
          applicableTicketTypeIds: Array.isArray(addOn.applicableTicketTypeIds)
            ? addOn.applicableTicketTypeIds
            : Array.isArray(addOn.applicableTicketTypeIds)
              ? addOn.applicableTicketTypeIds
              : [],
        }))
      );
    }

    if (Array.isArray(eventSettings.checkoutFields)) {
      setEventCheckoutFields(
        eventSettings.checkoutFields.filter((field: any) =>
          DEFAULT_CHECKOUT_FIELD_ORDER.includes(field)
        )
      );
    }
  }, []);

  useEffect(() => {
    if (!allowTransfers) {
      setCurrentTicket((ticket) => ({ ...ticket, transferable: false }));
      setCurrentAddOn((addOn) => ({ ...addOn, transferable: false }));
    }

    if (!allowRefunds) {
      setCurrentTicket((ticket) => ({ ...ticket, refundable: false }));
    }

    if (!allowPaymentPlans) {
      setCurrentTicket((ticket) => ({ ...ticket, paymentPlanEnabled: false }));
      setCurrentAddOn((addOn) => ({ ...addOn, paymentPlanEligible: false }));
    }
  }, [allowPaymentPlans, allowRefunds, allowTransfers]);

  const ticketTypeOptions = useMemo(
    () =>
      tickets.map((ticket) => ({
        id: ticket.clientReferenceId,
        label: `${ticket.name || "Untitled"}${ticket.type ? ` (${ticket.type})` : ""}`,
      })),
    [tickets]
  );

  const handleGoBack = () => setActivePage("set-images");

  const saveCommerceDraft = (
    nextTickets: Ticket[],
    nextAddOns: AddOn[] = addOns,
    nextEventType: "ticketed" | "free" = eventType,
    nextCheckoutFields: CheckoutFieldKey[] = eventCheckoutFields
  ) => {
    persistDraft({
      eventType: nextEventType,
      tickets: nextTickets,
      addOns: nextAddOns,
      eventSettings: {
        ...readDraft().eventSettings,
        checkoutFields: nextCheckoutFields,
      },
    });
  };

  const validateTicket = (ticket: Ticket) => {
    if (!ticket.name.trim() || !ticket.price.trim() || !ticket.type.trim()) {
      return "Please fill in ticket name, price, and type.";
    }

    if (!ticket.quantity.trim()) {
      return "Please set a ticket quantity.";
    }

    if (
      ticket.saleStartAt &&
      ticket.saleEndAt &&
      new Date(ticket.saleEndAt) < new Date(ticket.saleStartAt)
    ) {
      return "Ticket sale end must be after the sale start.";
    }

    if (Number(ticket.maxOrder || 0) < Number(ticket.minOrder || 1)) {
      return "Ticket max order cannot be lower than min order.";
    }

    return "";
  };

  const validateAddOn = (addOn: AddOn) => {
    if (!addOn.name.trim() || !addOn.price.trim()) {
      return "Please fill in add-on name and price.";
    }

    if (!addOn.quantity.trim()) {
      return "Please set an add-on quantity.";
    }

    if (
      addOn.saleStartAt &&
      addOn.saleEndAt &&
      new Date(addOn.saleEndAt) < new Date(addOn.saleStartAt)
    ) {
      return "Add-on sale end must be after the sale start.";
    }

    return "";
  };

  const handleAddTicket = () => {
    const validationError = validateTicket(currentTicket);
    if (validationError) {
      setError(validationError);
      return;
    }

    const nextTicket: Ticket = {
      ...currentTicket,
      clientReferenceId: crypto.randomUUID(),
      attendanceMode:
        eventMode === "hybrid" ? currentTicket.attendanceMode : undefined,
      transferable: allowTransfers ? currentTicket.transferable : false,
      refundable: allowRefunds ? currentTicket.refundable : false,
      paymentPlanEnabled: allowPaymentPlans
        ? currentTicket.paymentPlanEnabled
        : false,
    };

    const nextTickets = [...tickets, nextTicket];
    setTickets(nextTickets);
    saveCommerceDraft(nextTickets);
    setCurrentTicket(createEmptyTicket());
    setError("");
  };

  const handleAddAddOn = () => {
    const validationError = validateAddOn(currentAddOn);
    if (validationError) {
      setError(validationError);
      return;
    }

    const nextAddOn: AddOn = {
      ...currentAddOn,
      id: crypto.randomUUID(),
      transferable: allowTransfers ? currentAddOn.transferable : false,
      paymentPlanEligible: allowPaymentPlans
        ? currentAddOn.paymentPlanEligible
        : false,
    };

    const nextAddOns = [...addOns, nextAddOn];
    setAddOns(nextAddOns);
    saveCommerceDraft(tickets, nextAddOns);
    setCurrentAddOn(createEmptyAddOn());
    setError("");
  };

  const handleSaveAndContinue = () => {
    if (isStreamingEvent && eventType !== "ticketed") {
      setError(
        "Livestreamed virtual and hybrid events must have at least one ticket."
      );
      return;
    }

    if (eventType === "ticketed" && tickets.length === 0) {
      setError("Please add at least one ticket before continuing.");
      return;
    }

    setError("");
    saveCommerceDraft(tickets, addOns, eventType, eventCheckoutFields);
    setActivePage("preview-event");
  };

  const removeTicket = (ticketClientReferenceId: string) => {
    const nextTickets = tickets.filter((ticket) => ticket.clientReferenceId !== ticketClientReferenceId);
    const nextAddOns = addOns.map((addOn) => ({
      ...addOn,
      applicableTicketTypeIds: addOn.applicableTicketTypeIds.filter((id) => id !== ticketClientReferenceId),
    }));

    setTickets(nextTickets);
    setAddOns(nextAddOns);
    saveCommerceDraft(nextTickets, nextAddOns);
  };

  const removeAddOn = (addOnId: string) => {
    const nextAddOns = addOns.filter((addOn) => addOn.id !== addOnId);
    const nextTickets = tickets.map((ticket) => ({
      ...ticket,
      addOnIds: ticket.addOnIds.filter((id) => id !== addOnId),
    }));

    setAddOns(nextAddOns);
    setTickets(nextTickets);
    saveCommerceDraft(nextTickets, nextAddOns);
  };

  return (
    <div className="px-4 pb-8 sm:px-6 md:px-8">
      <div className="mx-auto max-w-[1200px] rounded-2xl bg-white p-4 dark:border dark:bg-[#101010] sm:p-6 md:p-8">
        <div className="mb-8">
          <h3 className="text-[22px] font-bold sm:text-[26px] md:text-[28px]">
            Ticketing Details
          </h3>
          <p className="mt-2 text-[13px] font-medium text-[#666666] dark:text-gray-300 sm:text-[14px] md:text-[16px]">
            Set up ticket inventory, sale windows, purchase rules, add-ons, and
            the attendee information you want at checkout.
          </p>
        </div>

        <div className="mb-10">
          <h4 className="mb-6 text-[18px] font-bold sm:text-[20px]">
            What type of event are you running?
          </h4>

          {isStreamingEvent && (
            <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-100">
              This {eventMode} event includes an on-platform livestream, so it
              must stay ticketed to unlock viewing access.
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <button
              onClick={() => {
                setEventType("ticketed");
                saveCommerceDraft(tickets, addOns, "ticketed");
              }}
              className="flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-xl border-2 bg-white p-6 transition-all dark:bg-[#101010] sm:p-8"
              style={{
                borderColor: eventType === "ticketed" ? "#D19537" : "#E8E8E8",
              }}
            >
              <img
                src="/images/icons/ticketed-event-icon.png"
                alt="Ticketed Event"
                className="h-12 w-12 sm:h-16 sm:w-16"
              />
              <div className="text-center">
                <div
                  className="mb-1 text-[16px] font-bold sm:text-[18px]"
                  style={{ color: "#D19537" }}
                >
                  Ticketed Event
                </div>
                <div className="text-[13px] sm:text-[14px]" style={{ color: "#D19537" }}>
                  My event requires tickets for entry
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setEventType("free");
                saveCommerceDraft(tickets, addOns, "free");
              }}
              disabled={isStreamingEvent}
              className="flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-xl border-2 bg-white p-6 transition-all dark:bg-[#101010] sm:p-8"
              style={{
                borderColor: eventType === "free" ? "#D19537" : "#E8E8E8",
                opacity: isStreamingEvent ? 0.55 : 1,
              }}
            >
              <img
                src="/images/icons/free-event-icon.png"
                alt="Free Event"
                className="h-12 w-12 sm:h-16 sm:w-16"
              />
              <div className="text-center">
                <div
                  className="mb-1 text-[16px] font-bold sm:text-[18px]"
                  style={{ color: "#666666" }}
                >
                  Free Event
                </div>
                <div className="text-[13px] sm:text-[14px]" style={{ color: "#666666" }}>
                  {isStreamingEvent
                    ? "Unavailable for livestreamed events"
                    : "I'm running a free event"}
                </div>
              </div>
            </button>
          </div>
        </div>

        <section className="mb-10 rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Checkout Fields</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose the attendee details collected for this event by default.
              Ticket-specific selections below can add more fields when needed.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {DEFAULT_CHECKOUT_FIELD_ORDER.map((fieldKey) => {
              const definition = CHECKOUT_FIELD_DEFINITIONS[fieldKey];
              const checked = eventCheckoutFields.includes(fieldKey);

              return (
                <label
                  key={fieldKey}
                  className="flex items-start gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[#D19537]"
                    checked={checked}
                    onChange={() => {
                      const nextFields = toggleArrayValue(eventCheckoutFields, fieldKey);
                      setEventCheckoutFields(nextFields);
                      saveCommerceDraft(tickets, addOns, eventType, nextFields);
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {definition.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {definition.section === "basic"
                        ? "Shown in Basic Information"
                        : "Shown in Contact Details"}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {eventType === "ticketed" && (
          <>
            <section className="mb-10 rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
              <div className="mb-4">
                <h4 className="text-lg font-semibold">Add Ticket Type</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tickets can now carry inventory, sale schedules, descriptions,
                  and per-ticket purchase rules.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Ticket Name</label>
                  <input
                    type="text"
                    placeholder="Ticket name"
                    value={currentTicket.name}
                    onChange={(e) =>
                      setCurrentTicket((ticket) => ({ ...ticket, name: e.target.value }))
                    }
                    className="h-12 rounded-lg border px-4 dark:border-gray-700 dark:bg-[#101010]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Ticket Price</label>
                  <input
                    type="text"
                    placeholder="$00.00"
                    value={currentTicket.price ? `$${currentTicket.price}` : ""}
                    onChange={(e) =>
                      setCurrentTicket((ticket) => ({
                        ...ticket,
                        price: e.target.value.replace(/[^0-9.]/g, ""),
                      }))
                    }
                    className="h-12 rounded-lg border px-4 dark:border-gray-700 dark:bg-[#101010]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Ticket Label</label>
                  <input
                    type="text"
                    placeholder="Ticket label e.g. General, VIP, Early Bird"
                    value={currentTicket.type}
                    onChange={(e) =>
                      setCurrentTicket((ticket) => ({ ...ticket, type: e.target.value }))
                    }
                    className="h-12 rounded-lg border px-4 dark:border-gray-700 dark:bg-[#101010]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Inventory Quantity</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Inventory quantity"
                    value={currentTicket.quantity}
                    onChange={(e) =>
                      setCurrentTicket((ticket) => ({
                        ...ticket,
                        quantity: e.target.value.replace(/[^0-9]/g, ""),
                      }))
                    }
                    className="h-12 rounded-lg border px-4 dark:border-gray-700 dark:bg-[#101010]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Ticket Sale Start Time</label>
                  <input
                    type="datetime-local"
                    value={currentTicket.saleStartAt}
                    onChange={(e) =>
                      setCurrentTicket((ticket) => ({
                        ...ticket,
                        saleStartAt: e.target.value,
                      }))
                    }
                    className="h-12 rounded-lg border px-4 dark:border-gray-700 dark:bg-[#101010]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Ticket Sale End Time</label>
                  <input
                    type="datetime-local"
                    value={currentTicket.saleEndAt}
                    onChange={(e) =>
                      setCurrentTicket((ticket) => ({
                        ...ticket,
                        saleEndAt: e.target.value,
                      }))
                    }
                    className="h-12 rounded-lg border px-4 dark:border-gray-700 dark:bg-[#101010]"
                  />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label className="mb-1 font-medium">Ticket Description</label>
                  <textarea
                    placeholder="Ticket description"
                    value={currentTicket.description}
                    onChange={(e) =>
                      setCurrentTicket((ticket) => ({
                        ...ticket,
                        description: e.target.value,
                      }))
                    }
                    className="min-h-[110px] rounded-lg border p-4 dark:border-gray-700 dark:bg-[#101010]"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Minimum Order</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Min order"
                    value={currentTicket.minOrder}
                    onChange={(e) =>
                      setCurrentTicket((ticket) => ({
                        ...ticket,
                        minOrder: e.target.value.replace(/[^0-9]/g, "") || "1",
                      }))
                    }
                    className="h-12 rounded-lg border px-4 dark:border-gray-700 dark:bg-[#101010]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Maximum Order</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Max order"
                    value={currentTicket.maxOrder}
                    onChange={(e) =>
                      setCurrentTicket((ticket) => ({
                        ...ticket,
                        maxOrder: e.target.value.replace(/[^0-9]/g, "") || "1",
                      }))
                    }
                    className="h-12 rounded-lg border px-4 dark:border-gray-700 dark:bg-[#101010]"
                  />
                </div>
              </div>

              {eventMode === "hybrid" ? (
                <select
                  value={currentTicket.attendanceMode}
                  onChange={(e) =>
                    setCurrentTicket((ticket) => ({
                      ...ticket,
                      attendanceMode: e.target.value as "in-person" | "virtual",
                    }))
                  }
                  className="mt-4 h-12 w-full rounded-lg border bg-white px-4 text-black dark:border-gray-700 dark:bg-[#101010] dark:text-white"
                >
                  <option value="in-person">In-person access</option>
                  <option value="virtual">Virtual access</option>
                </select>
              ) : null}

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <ToggleCard
                  label="Transferable"
                  helper="Allow ticket transfers for this type."
                  checked={allowTransfers ? currentTicket.transferable : false}
                  disabled={!allowTransfers}
                  onToggle={() =>
                    setCurrentTicket((ticket) => ({
                      ...ticket,
                      transferable: !ticket.transferable,
                    }))
                  }
                />
                <ToggleCard
                  label="Refundable"
                  helper="Enable refund requests for this ticket type."
                  checked={allowRefunds ? currentTicket.refundable : false}
                  disabled={!allowRefunds}
                  onToggle={() =>
                    setCurrentTicket((ticket) => ({
                      ...ticket,
                      refundable: !ticket.refundable,
                    }))
                  }
                />
                <ToggleCard
                  label="Payment Plan"
                  helper="Allow installment plan eligibility on this ticket."
                  checked={
                    allowPaymentPlans ? currentTicket.paymentPlanEnabled : false
                  }
                  disabled={!allowPaymentPlans}
                  onToggle={() =>
                    setCurrentTicket((ticket) => ({
                      ...ticket,
                      paymentPlanEnabled: !ticket.paymentPlanEnabled,
                    }))
                  }
                />
              </div>

              <div className="mt-5 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Extra checkout fields for this ticket type
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Leave all unchecked to use the event defaults only.
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {DEFAULT_CHECKOUT_FIELD_ORDER.map((fieldKey) => (
                    <label key={fieldKey} className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#D19537]"
                        checked={currentTicket.checkoutFields.includes(fieldKey)}
                        onChange={() =>
                          setCurrentTicket((ticket) => ({
                            ...ticket,
                            checkoutFields: toggleArrayValue(
                              ticket.checkoutFields,
                              fieldKey
                            ),
                          }))
                        }
                      />
                      <span>{CHECKOUT_FIELD_DEFINITIONS[fieldKey].label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {addOns.length > 0 && (
                <div className="mt-5 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Eligible add-ons
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {addOns.map((addOn) => (
                      <label key={addOn.id} className="flex items-start gap-3 text-sm">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 accent-[#D19537]"
                          checked={currentTicket.addOnIds.includes(addOn.id)}
                          onChange={() =>
                            setCurrentTicket((ticket) => ({
                              ...ticket,
                              addOnIds: toggleArrayValue(ticket.addOnIds, addOn.id),
                            }))
                          }
                        />
                        <div>
                          <p className="font-medium">{addOn.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ${addOn.price || "0"} each
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAddTicket}
                  className="flex h-10 items-center gap-2 rounded-xl bg-[#D19537] px-6 text-[13px] font-semibold text-white sm:h-12 sm:px-8 sm:text-[14px]"
                >
                  Add Ticket
                  <img
                    src="/images/icons/plus-icon.png"
                    alt="add"
                    className="h-4 w-4"
                  />
                </button>
              </div>

              {tickets.length > 0 && (
                <div className="mt-6 space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.clientReferenceId}
                      className="rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] p-4 dark:bg-[#101010]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[14px] font-semibold">{ticket.name}</span>
                            <span className="rounded-md bg-[#D19537]/15 px-2 py-1 text-[11px] font-semibold uppercase text-[#D19537]">
                              {ticket.type}
                            </span>
                            {ticket.attendanceMode ? (
                              <span className="rounded-md bg-blue-100 px-2 py-1 text-[11px] font-semibold uppercase text-blue-700">
                                {ticket.attendanceMode}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-[13px] text-[#666666] dark:text-gray-300">
                            ${ticket.price} each • Qty {ticket.quantity} • Orders{" "}
                            {ticket.minOrder}-{ticket.maxOrder}
                          </p>
                          {ticket.description ? (
                            <p className="text-[13px] text-[#666666] dark:text-gray-300">
                              {ticket.description}
                            </p>
                          ) : null}
                          <p className="text-[12px] text-gray-500 dark:text-gray-400">
                            {ticket.saleStartAt
                              ? `Sales start ${new Date(ticket.saleStartAt).toLocaleString()}`
                              : "Sales start immediately"}
                            {" • "}
                            {ticket.saleEndAt
                              ? `close ${new Date(ticket.saleEndAt).toLocaleString()}`
                              : "no scheduled close"}
                          </p>
                          <p className="text-[12px] text-gray-500 dark:text-gray-400">
                            Transfer {ticket.transferable ? "on" : "off"} • Refund{" "}
                            {ticket.refundable ? "on" : "off"} • Payment plan{" "}
                            {ticket.paymentPlanEnabled ? "on" : "off"}
                          </p>
                        </div>

                        <button
                          onClick={() => removeTicket(ticket.clientReferenceId)}
                          className="text-[13px] font-medium text-[#D6111A]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mb-10 rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
              <div className="mb-4">
                <h4 className="text-lg font-semibold">Add-ons</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create optional extras for the event or target them to specific
                  ticket types.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Add-on name"
                  value={currentAddOn.name}
                  onChange={(e) =>
                    setCurrentAddOn((addOn) => ({ ...addOn, name: e.target.value }))
                  }
                  className="h-12 rounded-lg border px-4 dark:border-gray-700 dark:bg-[#101010]"
                />
                <input
                  type="text"
                  placeholder="$00.00"
                  value={currentAddOn.price ? `$${currentAddOn.price}` : ""}
                  onChange={(e) =>
                    setCurrentAddOn((addOn) => ({
                      ...addOn,
                      price: e.target.value.replace(/[^0-9.]/g, ""),
                    }))
                  }
                  className="h-12 rounded-lg border px-4 dark:border-gray-700 dark:bg-[#101010]"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Inventory quantity"
                  value={currentAddOn.quantity}
                  onChange={(e) =>
                    setCurrentAddOn((addOn) => ({
                      ...addOn,
                      quantity: e.target.value.replace(/[^0-9]/g, ""),
                    }))
                  }
                  className="h-12 rounded-lg border px-4 dark:border-gray-700 dark:bg-[#101010]"
                />
                <textarea
                  placeholder="Add-on description"
                  value={currentAddOn.description}
                  onChange={(e) =>
                    setCurrentAddOn((addOn) => ({
                      ...addOn,
                      description: e.target.value,
                    }))
                  }
                  className="min-h-[110px] rounded-lg border p-4 dark:border-gray-700 dark:bg-[#101010]"
                />
                <input
                  type="datetime-local"
                  value={currentAddOn.saleStartAt}
                  onChange={(e) =>
                    setCurrentAddOn((addOn) => ({
                      ...addOn,
                      saleStartAt: e.target.value,
                    }))
                  }
                  className="h-12 rounded-lg border px-4 dark:border-gray-700 dark:bg-[#101010]"
                />
                <input
                  type="datetime-local"
                  value={currentAddOn.saleEndAt}
                  onChange={(e) =>
                    setCurrentAddOn((addOn) => ({
                      ...addOn,
                      saleEndAt: e.target.value,
                    }))
                  }
                  className="h-12 rounded-lg border px-4 dark:border-gray-700 dark:bg-[#101010]"
                />
              </div>

              {ticketTypeOptions.length > 0 && (
                <div className="mt-5 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Applies to
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave everything unchecked to offer this add-on across the whole
                    event.
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {ticketTypeOptions.map((ticketOption) => (
                      <label key={ticketOption.id} className="flex items-start gap-3 text-sm">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 accent-[#D19537]"
                          checked={currentAddOn.applicableTicketTypeIds.includes(
                            ticketOption.id
                          )}
                          onChange={() =>
                            setCurrentAddOn((addOn) => ({
                              ...addOn,
                              applicableTicketTypeIds: toggleArrayValue(
                                addOn.applicableTicketTypeIds,
                                ticketOption.id
                              ),
                            }))
                          }
                        />
                        <span>{ticketOption.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <ToggleCard
                  label="Transfer eligible"
                  helper="Show as transferable if backend supports it."
                  checked={allowTransfers ? currentAddOn.transferable : false}
                  disabled={!allowTransfers}
                  onToggle={() =>
                    setCurrentAddOn((addOn) => ({
                      ...addOn,
                      transferable: !addOn.transferable,
                    }))
                  }
                />
                <ToggleCard
                  label="Credit eligible"
                  helper="Allow buyer credits to be applied to this add-on."
                  checked={currentAddOn.creditEligible}
                  onToggle={() =>
                    setCurrentAddOn((addOn) => ({
                      ...addOn,
                      creditEligible: !addOn.creditEligible,
                    }))
                  }
                />
                <ToggleCard
                  label="Payment plan eligible"
                  helper="Keep this add-on available inside installment checkout."
                  checked={
                    allowPaymentPlans ? currentAddOn.paymentPlanEligible : false
                  }
                  disabled={!allowPaymentPlans}
                  onToggle={() =>
                    setCurrentAddOn((addOn) => ({
                      ...addOn,
                      paymentPlanEligible: !addOn.paymentPlanEligible,
                    }))
                  }
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAddAddOn}
                  className="rounded-xl bg-[#D19537] px-6 py-3 text-sm font-semibold text-white"
                >
                  Add Add-on
                </button>
              </div>

              {addOns.length > 0 && (
                <div className="mt-6 space-y-3">
                  {addOns.map((addOn) => (
                    <div
                      key={addOn.id}
                      className="rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] p-4 dark:bg-[#101010]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[14px] font-semibold">{addOn.name}</span>
                            <span className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                              ${addOn.price}
                            </span>
                          </div>
                          {addOn.description ? (
                            <p className="text-[13px] text-[#666666] dark:text-gray-300">
                              {addOn.description}
                            </p>
                          ) : null}
                          <p className="text-[12px] text-gray-500 dark:text-gray-400">
                            Qty {addOn.quantity} •{" "}
                            {addOn.applicableTicketTypeIds.length > 0
                              ? `${addOn.applicableTicketTypeIds.length} ticket type(s)`
                              : "Available event-wide"}
                          </p>
                          <p className="text-[12px] text-gray-500 dark:text-gray-400">
                            Transfer {addOn.transferable ? "on" : "off"} • Credits{" "}
                            {addOn.creditEligible ? "on" : "off"} • Payment plan{" "}
                            {addOn.paymentPlanEligible ? "on" : "off"}
                          </p>
                        </div>

                        <button
                          onClick={() => removeAddOn(addOn.id)}
                          className="text-[13px] font-medium text-[#D6111A]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <button
          onClick={handleGoBack}
          className="h-11 rounded-xl bg-[#FFF5E6] px-6 font-semibold text-[#D19537]"
        >
          Go Back
        </button>
        <button
          onClick={handleSaveAndContinue}
          className="h-11 rounded-xl bg-[#D19537] px-6 font-semibold text-white"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}

function ToggleCard({
  label,
  helper,
  checked,
  disabled,
  onToggle,
}: {
  label: string;
  helper: string;
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={`rounded-xl border px-4 py-3 text-left transition ${
        checked
          ? "border-[#D19537] bg-[#FFF8EF]"
          : "border-gray-200 bg-white dark:border-gray-800 dark:bg-[#101010]"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helper}</p>
        </div>
        <span
          className={`inline-flex h-6 w-11 items-center rounded-full ${
            checked ? "bg-[#D19537]" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-[22px] w-[22px] rounded-full bg-white transition-transform ${
              checked ? "translate-x-[20px]" : "translate-x-0"
            }`}
          />
        </span>
      </div>
    </button>
  );
}
