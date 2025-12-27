"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

// Stripe
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const getAuthToken = () => {
  if (typeof window === "undefined") return null;

  const keys = ["buyerToken", "staffToken", "hostToken", "token"];

  for (const key of keys) {
    const stored = localStorage.getItem(key);
    if (!stored) continue;

    try {
      const parsed = JSON.parse(stored);
      if (parsed?.token) return parsed.token;
      return stored; // raw token
    } catch {
      return stored; // raw token
    }
  }

  return null;
};

type PaymentMode = "direct" | "installment";

/* ─────────────────────────────────────────
   STRIPE CARD PAYMENT COMPONENT
──────────────────────────────────────────*/

function StripePaymentForm({
  clientSecret,
  mode,
  installmentPurchaseId,
  setupIntentClientSecret,
  enableAutoPay,
}: {
  clientSecret: string;
  mode: PaymentMode;
  installmentPurchaseId?: string;
  setupIntentClientSecret?: string;
  enableAutoPay?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setLoading(true);
    toast.loading("Processing payment securely...", { id: "stripe-pay" });

    try {
      // 1) Confirm payment (Direct or first installment payment)
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        toast.error(result.error.message || "Payment failed", {
          id: "stripe-pay",
        });
        setLoading(false);
        return;
      }

      if (result.paymentIntent?.status !== "succeeded") {
        toast.error("Payment not completed. Please try again.", {
          id: "stripe-pay",
        });
        setLoading(false);
        return;
      }

      toast.success("Payment Successful! 🎉", { id: "stripe-pay" });

      const paymentIntent = result.paymentIntent;

      // Save last stripe response (optional)
      localStorage.setItem(
        "lastPaymentResponse",
        JSON.stringify(paymentIntent)
      );

      const token = getAuthToken();
      if (!token) {
        toast.error("Auth token missing");
        setLoading(false);
        return;
      }

      // 2) Confirm on backend based on mode
      if (mode === "direct") {
        // ✅ Direct confirm
        const confirmRes = await axios.post(
          `${API_BASE_URL}/payments/confirm`,
          {
            paymentIntentId: paymentIntent.id,
            paymentResponse: paymentIntent,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": HOST_Tenant_ID,
              "Content-Type": "application/json",
            },
          }
        );

        localStorage.setItem(
          "confirmedPurchase",
          JSON.stringify(confirmRes.data)
        );
        toast.success("Payment confirmed!");

        setTimeout(() => {
          window.location.href = "/check-out/payment";
        }, 1200);
      } else {
        // ✅ Installment confirm (first installment)
        if (!installmentPurchaseId) {
          toast.error("Installment purchase id missing");
          setLoading(false);
          return;
        }

        await axios.post(
          `${API_BASE_URL}/payments/installments/purchase/${installmentPurchaseId}/confirm`,
          {
            stripePaymentIntentId: paymentIntent.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": HOST_Tenant_ID,
              "Content-Type": "application/json",
            },
          }
        );

        // 3) Optional: Save card for Auto-Pay using SetupIntent
        if (enableAutoPay && setupIntentClientSecret) {
          try {
            const setupRes = await stripe.confirmCardSetup(
              setupIntentClientSecret,
              {
                payment_method: {
                  card,
                },
              }
            );

            if (setupRes.error) {
              toast.error(
                setupRes.error.message || "Card saving failed (Auto-Pay)",
                { id: "auto-pay-setup" }
              );
            } else if (setupRes.setupIntent?.status === "succeeded") {
              toast.success("Auto-Pay enabled (card saved) ✅", {
                id: "auto-pay-setup",
              });
            }
          } catch (e: any) {
            toast.error("Auto-Pay setup failed", { id: "auto-pay-setup" });
          }
        }

        toast.success("Installment confirmed! Tickets will be issued.", {
          id: "installment-confirm",
        });

        setTimeout(() => {
          window.location.href = "/check-out/payment";
        }, 1200);
      }
    } catch (err: any) {
      console.error("❌ Payment flow error:", err);
      toast.error(err?.response?.data?.message || "Payment failed", {
        id: "stripe-pay",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <CardElement className="border rounded-md p-3 bg-white text-black" />

      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full h-11 bg-blue-600 text-white rounded-lg"
      >
        {loading
          ? "Processing..."
          : mode === "direct"
          ? "Pay Now"
          : "Pay First Installment"}
      </Button>
    </div>
  );
}

const MAX_TICKETS_PER_ORDER = 10;

/* ─────────────────────────────────────────
   MAIN ORDER SUMMARY PAGE
──────────────────────────────────────────*/
export default function OrderSummary() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");

  const [eventData, setEventData] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [type, setType] = useState<string>("");
  const [qty, setQty] = useState(1);

  const [initiatingPayment, setInitiatingPayment] = useState(false);

  // Payment mode
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("direct");

  // Installment plans
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  // Installment data returned from backend
  const [installmentPurchaseId, setInstallmentPurchaseId] =
    useState<string>("");
  const [setupIntentClientSecret, setSetupIntentClientSecret] =
    useState<string>("");
  const [installmentSchedule, setInstallmentSchedule] = useState<any[]>([]);
  const [enableAutoPay, setEnableAutoPay] = useState(true);

  const selectedTicket = tickets.find((t) => t.id === type);
  const price = selectedTicket ? selectedTicket.price : 0;

  const serviceFee = 3.75;

  const total = useMemo(() => price * qty + serviceFee, [price, qty]);

  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");

  const getToken = () => {
    if (typeof window === "undefined") return null;
    let raw =
      localStorage.getItem("buyerToken") ||
      localStorage.getItem("staffToken") ||
      localStorage.getItem("hostToken") ||
      localStorage.getItem("token");

    try {
      const parsed = JSON.parse(raw || "{}");
      return parsed?.token || parsed;
    } catch {
      return raw;
    }
  };

  /* ─────────────── FETCH EVENT ───────────────*/
  useEffect(() => {
    if (!eventId) return;

    const token = getToken();

    axios
      .get(`${API_BASE_URL}/events/public/${eventId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "X-Tenant-ID": HOST_Tenant_ID,
        },
      })
      .then((res) => setEventData(res.data.data))
      .catch(() => toast.error("Failed to load event"))
      .finally(() => setLoadingEvent(false));
  }, [eventId]);

  /* ─────────────── FETCH TICKETS ───────────────*/
  useEffect(() => {
    if (!eventId) return;
    const token = getToken();

    axios
      .get(`${API_BASE_URL}/tickets/event/${eventId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "X-Tenant-ID": HOST_Tenant_ID,
        },
      })
      .then((res) => {
        if (res.data?.data?.tickets) setTickets(res.data.data.tickets);
      })
      .catch(() => toast.error("Failed to load tickets"));
  }, [eventId]);

  /* ─────────────── FETCH INSTALLMENT PLANS ───────────────*/
  useEffect(() => {
    // Fetch plans once (public endpoint, requires tenant header)
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const res = await axios.get(
          `${API_BASE_URL}/payments/installments/plans`,
          {
            headers: {
              "X-Tenant-ID": HOST_Tenant_ID,
            },
          }
        );

        const list = res.data?.data || [];
        setPlans(Array.isArray(list) ? list : []);
      } catch (e: any) {
        // keep silent; installments just won't show
        setPlans([]);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  // If no plans available, force direct
  useEffect(() => {
    if (paymentMode === "installment" && plans.length === 0 && !loadingPlans) {
      setPaymentMode("direct");
      setSelectedPlanId("");
    }
  }, [paymentMode, plans, loadingPlans]);

  // Reset Stripe session if user changes mode/plan
  useEffect(() => {
    setClientSecret("");
    setInstallmentPurchaseId("");
    setSetupIntentClientSecret("");
    setInstallmentSchedule([]);
  }, [paymentMode, selectedPlanId]);

  /* ─────────────── INITIATE PAYMENT ───────────────*/
  const handlePaymentInitiate = async () => {
    if (!type) {
      toast.error("Please select a ticket");
      return;
    }

    if (qty < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (qty > MAX_TICKETS_PER_ORDER) {
      toast.error(
        `Maximum ${MAX_TICKETS_PER_ORDER} tickets are allowed per purchase`
      );
      return;
    }

    if (paymentMode === "installment" && !selectedPlanId) {
      toast.error("Please select an installment plan");
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    try {
      setInitiatingPayment(true);

      // 1) get publishable key
      const pubRes = await axios.get(
        `${API_BASE_URL}/payments/config/publishable-key`
      );
      const publishableKey = pubRes.data?.data?.publishableKey;

      if (!publishableKey) {
        toast.error("Stripe key missing");
        setInitiatingPayment(false);
        return;
      }

      setStripePromise(loadStripe(publishableKey));

      // 2) initiate based on mode
      if (paymentMode === "direct") {
        const body = { ticketId: type, quantity: qty };

        const res = await axios.post(
          `${API_BASE_URL}/payments/initiate`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": HOST_Tenant_ID,
            },
          }
        );

        const secret = res.data?.data?.clientSecret;
        if (!secret) {
          toast.error("Client secret missing");
          return;
        }

        setClientSecret(secret);
        toast.success("Payment session created");
      } else {
        // Installment initiation
        const body = {
          ticketId: type,
          paymentPlanId: selectedPlanId,
          quantity: qty,
          enableAutoPay,
          // couponCode: "SAVE20", // optional
        };

        const res = await axios.post(
          `${API_BASE_URL}/payments/installments/purchase`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": HOST_Tenant_ID,
              "Content-Type": "application/json",
            },
          }
        );

        const data = res.data?.data;
        const secret = data?.clientSecret;
        const ipId = data?.installmentPurchaseId;

        if (!secret || !ipId) {
          toast.error("Installment initiation failed (missing data)");
          return;
        }

        setInstallmentPurchaseId(ipId);
        setClientSecret(secret);
        setSetupIntentClientSecret(data?.setupIntentClientSecret || "");
        setInstallmentSchedule(
          Array.isArray(data?.schedule) ? data.schedule : []
        );

        toast.success("Installment plan initiated");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Payment initiation failed", {
        id: "init-payment",
      });
    } finally {
      setInitiatingPayment(false);
    }
  };

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  return (
    <div className="min-h-screen bg-[#0077F71A] dark:bg-[#101010] rounded-2xl flex justify-center py-8 px-4">
      <div className="w-full max-w-md space-y-4">
        {/* Event Details */}
        <div className="rounded-[12px] border bg-white dark:bg-[#1a1a1a] p-4">
          <div className="relative mb-3 overflow-hidden rounded-[12px]">
            Event Detials
          </div>

          <p className="text-lg font-medium">
            {eventData?.title || (loadingEvent ? "Loading..." : "Event")}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            {eventData?.date?.fullDate}
          </p>
          <p className="text-sm text-gray-400">{eventData?.location}</p>
        </div>

        {/* Ticket selection */}
        <div className="rounded-[12px] border bg-white dark:bg-[#1a1a1a] p-4">
          <fieldset className="space-y-3">
            {tickets.length > 0 ? (
              tickets.map((ticket: any) => (
                <label
                  key={ticket.id}
                  className="flex justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="ticket"
                      checked={type === ticket.id}
                      onChange={() => setType(ticket.id)}
                      required
                    />
                    <span>{ticket.name}</span>
                  </div>

                  <span>{formatter.format(ticket.price)}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">Loading tickets...</p>
            )}
          </fieldset>

          {/* Quantity */}
          <div className="mt-4 flex justify-between items-center">
            <span>No of Tickets</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>
                <Image
                  src="/images/icon-minus.png"
                  alt="-"
                  width={20}
                  height={20}
                />
              </button>
              <span>{qty}</span>
              <button
                onClick={() => {
                  if (qty >= MAX_TICKETS_PER_ORDER) {
                    toast.error(
                      `You can purchase a maximum of ${MAX_TICKETS_PER_ORDER} tickets at once`
                    );
                    return;
                  }
                  setQty(qty + 1);
                }}
              >
                <Image
                  src="/images/icon-plus.png"
                  alt="+"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>

        {/* PAYMENT MODE (Direct vs Installments) */}
        <div className="rounded-[12px] border bg-white dark:bg-[#1a1a1a] p-4 space-y-3">
          <p className="text-base font-semibold">Payment Method</p>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMode"
                checked={paymentMode === "direct"}
                onChange={() => setPaymentMode("direct")}
              />
              <span>Pay in Full</span>
            </label>

            <label
              className={`flex items-center gap-3 cursor-pointer ${
                plans.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMode"
                checked={paymentMode === "installment"}
                onChange={() => {
                  if (plans.length === 0) return;
                  setPaymentMode("installment");
                }}
                disabled={plans.length === 0}
              />
              <span>
                Pay in Installments{" "}
                {loadingPlans
                  ? "(Loading plans...)"
                  : plans.length === 0
                  ? "(Not available)"
                  : ""}
              </span>
            </label>
          </div>

          {/* Installment plan selection */}
          {paymentMode === "installment" && plans.length > 0 && (
            <div className="pt-2 space-y-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Select Payment Plan
              </p>

              <div className="space-y-2">
                {plans.map((plan: any) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`w-full text-left rounded-lg border px-3 py-3 transition
                      ${
                        selectedPlanId === plan.id
                          ? "border-blue-600 bg-blue-50 dark:bg-[#111827]"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111]"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {plan.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {plan.description}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                          {plan.numInstallments} installments • Every{" "}
                          {plan.intervalDays} days
                        </p>
                        {plan.interestType && plan.interestType !== "NONE" && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            Interest: {plan.interestType} ({plan.interestValue})
                          </p>
                        )}
                        {plan.allowEarlyPayoff && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            Early payoff available
                          </p>
                        )}
                      </div>

                      {selectedPlanId === plan.id && (
                        <span className="text-xs font-semibold text-blue-600">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={enableAutoPay}
                  onChange={(e) => setEnableAutoPay(e.target.checked)}
                />
                Enable Auto-Pay for future installments
              </label>

              {selectedPlan && (
                <div className="rounded-lg border bg-gray-50 dark:bg-[#111] p-3 text-sm text-gray-700 dark:text-gray-200">
                  <p className="font-medium">
                    Selected Plan: {selectedPlan.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                    {selectedPlan.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────
            CREDIT BALANCE CARD (DESIGN FROM IMAGE)
        ────────────────────────────────────────── */}
        <div className="rounded-xl border bg-white dark:bg-[#1a1a1a] p-4 shadow-sm">
          <div className="rounded-lg border bg-gray-50 dark:bg-[#111] p-4 mb-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Current Credit Balance:{" "}
              <span className="font-semibold text-black dark:text-white">
                $120.00
              </span>
            </p>

            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Expires:{" "}
              <span className="font-semibold text-black dark:text-white">
                12/30/2025
              </span>
            </p>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            Promo credit will expire on{" "}
            <span className="font-semibold text-black dark:text-white">
              12/30/2025
            </span>
            .
          </p>
        </div>

        {/* Summary */}
        <div className="rounded-xl border bg-white dark:bg-[#1a1a1a] p-4">
          <p className="flex justify-between">
            <span>Ticket Subtotal:</span>
            <span>{formatter.format(price * qty)}</span>
          </p>

          <p className="flex justify-between mt-1">
            <span>Service Fee:</span>
            <span>{formatter.format(serviceFee)}</span>
          </p>

          <hr className="my-2" />

          <p className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>{formatter.format(total)}</span>
          </p>
        </div>

        {/* Installment schedule preview (after initiation) */}
        {paymentMode === "installment" && installmentSchedule.length > 0 && (
          <div className="rounded-xl border bg-white dark:bg-[#1a1a1a] p-4">
            <p className="font-semibold mb-2">Payment Schedule</p>
            <div className="space-y-2">
              {installmentSchedule.map((item: any) => (
                <div
                  key={item.installmentNumber}
                  className="flex items-center justify-between text-sm border rounded-lg px-3 py-2 bg-gray-50 dark:bg-[#111]"
                >
                  <span className="font-medium">#{item.installmentNumber}</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {item.dueDate}
                  </span>
                  <span className="font-semibold">{item.totalAmount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INITIATE PAYMENT */}
        {!clientSecret && (
          <Button
            className="w-full h-11 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
            onClick={handlePaymentInitiate}
            disabled={initiatingPayment}
          >
            {initiatingPayment ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Initializing payment…
              </>
            ) : paymentMode === "direct" ? (
              "Continue to Payment"
            ) : (
              "Continue to First Installment"
            )}
          </Button>
        )}

        {/* STRIPE CARD FORM */}
        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripePaymentForm
              clientSecret={clientSecret}
              mode={paymentMode}
              installmentPurchaseId={installmentPurchaseId || undefined}
              setupIntentClientSecret={setupIntentClientSecret || undefined}
              enableAutoPay={enableAutoPay}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}

//before add the installemnts feature

// "use client";

// import Image from "next/image";
// import { useMemo, useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { useSearchParams } from "next/navigation";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// // Stripe
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// const formatter = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "USD",
// });

// const getAuthToken = () => {
//   if (typeof window === "undefined") return null;

//   const keys = ["buyerToken", "staffToken", "hostToken", "token"];

//   for (const key of keys) {
//     const stored = localStorage.getItem(key);
//     if (!stored) continue;

//     try {
//       const parsed = JSON.parse(stored);
//       if (parsed?.token) return parsed.token;
//       return stored; // raw token
//     } catch {
//       return stored; // raw token
//     }
//   }

//   return null;
// };

// /* ─────────────────────────────────────────
//    STRIPE CARD PAYMENT COMPONENT
// ──────────────────────────────────────────*/

// function StripePaymentForm({ clientSecret }: any) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);

//   const handlePayment = async () => {
//     if (!stripe || !elements) return;

//     setLoading(true);

//     const card = elements.getElement(CardElement);
//     if (!card) return;

//     toast.loading("Processing payment securely...", { id: "stripe-pay" });

//     const result = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: { card },
//     });

//     if (result.error) {
//       toast.error(result.error.message || "Payment failed", {
//         id: "stripe-pay",
//       });
//       setLoading(false);
//       return;
//     }

//     // ⭐ SUCCESSFUL PAYMENT
//     if (result.paymentIntent.status === "succeeded") {
//       toast.success("Payment Successful! 🎉");

//       const paymentIntent = result.paymentIntent;

//       // ⭐ SAVE paymentIntent for later use
//       localStorage.setItem(
//         "lastPaymentResponse",
//         JSON.stringify(paymentIntent)
//       );

//       // ⭐ CALL /payments/confirm API
//       try {
//         const token = getAuthToken();

//         if (!token) {
//           toast.error("Auth token missing");
//           console.log("❌ TOKEN IS NULL, confirm API cannot work");
//           return;
//         }

//         const confirmRes = await axios.post(
//           `${API_BASE_URL}/payments/confirm`,
//           {
//             // purchaseId: localStorage.getItem("purchaseId"), // 👈 FROM initiate API
//             paymentIntentId: paymentIntent.id,
//             paymentResponse: paymentIntent,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "X-Tenant-ID": HOST_Tenant_ID,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         console.log("📤 Sending Confirm Payload:", {
//           paymentIntentId: paymentIntent.id,
//           paymentResponse: paymentIntent,
//         });
//         console.log("📤 Using Token:", token);
//         console.log("📤 Tenant:", HOST_Tenant_ID);

//         console.log("🔥 PAYMENT CONFIRMED RESPONSE:", confirmRes.data);

//         // Store for success page usage
//         localStorage.setItem(
//           "confirmedPurchase",
//           JSON.stringify(confirmRes.data)
//         );

//         toast.success("Payment confirmed!");

//         setTimeout(() => {
//           window.location.href = "/check-out/payment";
//         }, 1200);
//       } catch (err: any) {
//         console.error("❌ Confirm API error:", err);
//         toast.error("Payment confirmed but backend failed.");
//       }
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="mt-4 space-y-4">
//       <CardElement className="border rounded-md p-3 bg-white text-black" />

//       <Button
//         onClick={handlePayment}
//         disabled={loading}
//         className="w-full h-11 bg-blue-600 text-white rounded-lg"
//       >
//         {loading ? "Processing..." : "Pay Now"}
//       </Button>
//     </div>
//   );
// }

// const MAX_TICKETS_PER_ORDER = 10;

// /* ─────────────────────────────────────────
//    MAIN ORDER SUMMARY PAGE
// ──────────────────────────────────────────*/
// export default function OrderSummary() {
//   const searchParams = useSearchParams();
//   const eventId = searchParams.get("id");

//   const [eventData, setEventData] = useState<any>(null);
//   const [tickets, setTickets] = useState<any[]>([]);
//   const [loadingEvent, setLoadingEvent] = useState(true);
//   const [type, setType] = useState<string>("");
//   const [qty, setQty] = useState(1);

//   const [initiatingPayment, setInitiatingPayment] = useState(false);

//   const selectedTicket = tickets.find((t) => t.id === type);
//   const price = selectedTicket ? selectedTicket.price : 0;

//   const serviceFee = 3.75;

//   const total = useMemo(() => price * qty + serviceFee, [price, qty]);

//   const [stripePromise, setStripePromise] = useState<any>(null);
//   const [clientSecret, setClientSecret] = useState("");

//   const getToken = () => {
//     if (typeof window === "undefined") return null;
//     let raw =
//       localStorage.getItem("buyerToken") ||
//       localStorage.getItem("staffToken") ||
//       localStorage.getItem("hostToken") ||
//       localStorage.getItem("token");

//     try {
//       const parsed = JSON.parse(raw || "{}");
//       return parsed?.token || parsed;
//     } catch {
//       return raw;
//     }
//   };

//   /* ─────────────── FETCH EVENT ───────────────*/
//   useEffect(() => {
//     if (!eventId) return;

//     const token = getToken();

//     axios
//       .get(`${API_BASE_URL}/events/public/${eventId}`, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : "",
//           "X-Tenant-ID": HOST_Tenant_ID,
//         },
//       })
//       .then((res) => setEventData(res.data.data))
//       .catch(() => toast.error("Failed to load event"))
//       .finally(() => setLoadingEvent(false));
//   }, [eventId]);

//   /* ─────────────── FETCH TICKETS ───────────────*/
//   useEffect(() => {
//     if (!eventId) return;
//     const token = getToken();

//     axios
//       .get(`${API_BASE_URL}/tickets/event/${eventId}`, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : "",
//           "X-Tenant-ID": HOST_Tenant_ID,
//         },
//       })
//       .then((res) => {
//         if (res.data?.data?.tickets) setTickets(res.data.data.tickets);
//       })
//       .catch(() => toast.error("Failed to load tickets"));
//   }, [eventId]);

//   /* ─────────────── INITIATE PAYMENT ───────────────*/
//   const handlePaymentInitiate = async () => {
//     if (!type) {
//       toast.error("Please select a ticket");
//       return;
//     }

//     if (qty < 1) {
//       toast.error("Quantity must be at least 1");
//       return;
//     }

//     if (qty > MAX_TICKETS_PER_ORDER) {
//       toast.error(
//         `Maximum ${MAX_TICKETS_PER_ORDER} tickets are allowed per purchase`
//       );
//       return;
//     }

//     const token = getToken();
//     if (!token) {
//       toast.error("You must be logged in");
//       return;
//     }
//     try {
//       setInitiatingPayment(true); // 🔄 START LOADER

//       // 1️⃣ get publishable key
//       const pubRes = await axios.get(
//         `${API_BASE_URL}/payments/config/publishable-key`
//       );
//       const publishableKey = pubRes.data.data.publishableKey;

//       if (!publishableKey) {
//         toast.error("Stripe key missing");
//         setInitiatingPayment(false);
//         return;
//       }

//       setStripePromise(loadStripe(publishableKey));

//       // 2️⃣ initiate payment
//       const body = { ticketId: type, quantity: qty };

//       const res = await axios.post(`${API_BASE_URL}/payments/initiate`, body, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-Tenant-ID": HOST_Tenant_ID,
//         },
//       });

//       const secret = res.data.data.clientSecret;
//       setClientSecret(secret);

//       toast.success("Payment session created");
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Payment initiation failed", {
//         id: "init-payment",
//       });
//     } finally {
//       setInitiatingPayment(false); // 🔄 STOP LOADER
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0077F71A] dark:bg-[#101010] rounded-2xl flex justify-center py-8 px-4">
//       <div className="w-full max-w-md space-y-4">
//         {/* Event Details */}
//         <div className="rounded-[12px] border bg-white dark:bg-[#1a1a1a] p-4">
//           <div className="relative mb-3 overflow-hidden rounded-[12px]">
//             {/* <Image
//               src={eventData?.bannerImage || "/images/event.jpg"}
//               alt="Event Image"
//               width={360}
//               height={200}
//               className="h-[120px] w-full object-cover"
//             /> */}
//             Event Detials
//           </div>

//           <p className="text-lg font-medium">
//             {eventData?.title || "Loading..."}
//           </p>

//           {/* <p className="text-gray-500">
//             {selectedTicket
//               ? formatter.format(selectedTicket.price)
//               : formatter.format(0)}
//           </p> */}

//           <p className="text-sm text-gray-400 mt-2">
//             {eventData?.date?.fullDate}
//           </p>
//           <p className="text-sm text-gray-400">{eventData?.location}</p>
//         </div>

//         {/* Ticket selection */}
//         <div className="rounded-[12px] border bg-white dark:bg-[#1a1a1a] p-4">
//           <fieldset className="space-y-3">
//             {tickets.length > 0 ? (
//               tickets.map((ticket: any) => (
//                 <label
//                   key={ticket.id}
//                   className="flex justify-between cursor-pointer"
//                 >
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="radio"
//                       name="ticket"
//                       checked={type === ticket.id}
//                       onChange={() => setType(ticket.id)}
//                       required
//                     />
//                     <span>{ticket.name}</span>
//                   </div>

//                   <span>{formatter.format(ticket.price)}</span>
//                 </label>
//               ))
//             ) : (
//               <p className="text-sm text-gray-500">Loading tickets...</p>
//             )}
//           </fieldset>

//           {/* Quantity */}
//           <div className="mt-4 flex justify-between items-center">
//             <span>No of Tickets</span>
//             <div className="flex items-center gap-3">
//               <button onClick={() => setQty(Math.max(1, qty - 1))}>
//                 <Image
//                   src="/images/icon-minus.png"
//                   alt="-"
//                   width={20}
//                   height={20}
//                 />
//               </button>
//               <span>{qty}</span>
//               <button
//                 onClick={() => {
//                   if (qty >= MAX_TICKETS_PER_ORDER) {
//                     toast.error(
//                       `You can purchase a maximum of ${MAX_TICKETS_PER_ORDER} tickets at once`
//                     );
//                     return;
//                   }
//                   setQty(qty + 1);
//                 }}
//               >
//                 <Image
//                   src="/images/icon-plus.png"
//                   alt="+"
//                   width={20}
//                   height={20}
//                 />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ─────────────────────────────────────────
//             CREDIT BALANCE CARD (DESIGN FROM IMAGE)
//         ────────────────────────────────────────── */}
//         <div className="rounded-xl border bg-white dark:bg-[#1a1a1a] p-4 shadow-sm">
//           <div className="rounded-lg border bg-gray-50 dark:bg-[#111] p-4 mb-3">
//             <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
//               Current Credit Balance:{" "}
//               <span className="font-semibold text-black dark:text-white">
//                 $120.00
//               </span>
//             </p>

//             <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">
//               Expires:{" "}
//               <span className="font-semibold text-black dark:text-white">
//                 12/30/2025
//               </span>
//             </p>
//           </div>

//           <p className="text-sm text-gray-600 dark:text-gray-300">
//             Promo credit will expire on{" "}
//             <span className="font-semibold text-black dark:text-white">
//               12/30/2025
//             </span>
//             .
//           </p>
//         </div>

//         {/* Summary */}
//         <div className="rounded-xl border bg-white dark:bg-[#1a1a1a] p-4">
//           <p className="flex justify-between">
//             <span>Ticket Subtotal:</span>
//             <span>{formatter.format(price * qty)}</span>
//           </p>

//           <p className="flex justify-between mt-1">
//             <span>Service Fee:</span>
//             <span>{formatter.format(serviceFee)}</span>
//           </p>

//           <hr className="my-2" />

//           <p className="flex justify-between font-semibold">
//             <span>Total:</span>
//             <span>{formatter.format(total)}</span>
//           </p>
//         </div>

//         {/* INITIATE PAYMENT */}
//         {/* {!clientSecret && (
//           <Button
//             className="w-full h-11 bg-blue-600 text-white rounded-lg"
//             onClick={handlePaymentInitiate}
//           >
//             Continue to Payment
//           </Button>
//         )} */}

//         {!clientSecret && (
//           <Button
//             className="w-full h-11 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
//             onClick={handlePaymentInitiate}
//             disabled={initiatingPayment}
//           >
//             {initiatingPayment ? (
//               <>
//                 <svg
//                   className="h-4 w-4 animate-spin text-white"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                   />
//                 </svg>
//                 Initializing payment…
//               </>
//             ) : (
//               "Continue to Payment"
//             )}
//           </Button>
//         )}

//         {/* STRIPE CARD FORM */}
//         {clientSecret && stripePromise && (
//           <Elements stripe={stripePromise} options={{ clientSecret }}>
//             <StripePaymentForm clientSecret={clientSecret} />
//           </Elements>
//         )}
//       </div>
//     </div>
//   );
// }
