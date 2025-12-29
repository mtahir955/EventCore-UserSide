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
  PaymentElement,
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

/* ─────────────────────────────────────────
   STRIPE CARD PAYMENT COMPONENT (DIRECT)
   (Kept as-is for your working full payment)
──────────────────────────────────────────*/

/* ─────────────────────────────────────────
   STRIPE BNPL PAYMENT COMPONENT (PaymentElement)
──────────────────────────────────────────*/
// function StripeBNPLPaymentForm({ clientSecret }: any) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);

//   const handlePay = async () => {
//     if (!stripe || !elements) return;

//     setLoading(true);
//     toast.loading("Redirecting to payment provider...", { id: "bnpl-pay" });

//     try {
//       const returnUrl = `${window.location.origin}/check-out/payment?bnpl_return=1`;

//       const { error, paymentIntent } = await stripe.confirmPayment({
//         elements,
//         confirmParams: { return_url: returnUrl },
//         redirect: "if_required",
//       });

//       if (error) {
//         toast.error(error.message || "Payment failed", { id: "bnpl-pay" });
//         setLoading(false);
//         return;
//       }

//       // Some methods may confirm without redirect
//       if (paymentIntent && paymentIntent.status === "succeeded") {
//         toast.success("Payment Successful! 🎉", { id: "bnpl-pay" });

//         // save paymentIntent
//         localStorage.setItem(
//           "lastPaymentResponse",
//           JSON.stringify(paymentIntent)
//         );

//         // confirm with backend (same as card)
//         try {
//           const token = getAuthToken();
//           if (!token) {
//             toast.error("Auth token missing");
//             setLoading(false);
//             return;
//           }

//           const confirmRes = await axios.post(
//             `${API_BASE_URL}/payments/confirm`,
//             {
//               paymentIntentId: paymentIntent.id,
//               paymentResponse: paymentIntent,
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "X-Tenant-ID": HOST_Tenant_ID,
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           localStorage.setItem(
//             "confirmedPurchase",
//             JSON.stringify(confirmRes.data)
//           );
//           toast.success("Payment confirmed!");

//           setTimeout(() => {
//             window.location.href = "/check-out/payment";
//           }, 1200);
//         } catch (err: any) {
//           console.error("❌ BNPL confirm API error:", err);
//           toast.error("Payment confirmed but backend failed.");
//         }
//       } else {
//         // BNPL often redirects; user returns to return_url after approval.
//         toast.success("Continue payment in provider window.", {
//           id: "bnpl-pay",
//         });
//       }
//     } catch (e: any) {
//       toast.error(e?.message || "BNPL payment failed", { id: "bnpl-pay" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mt-4 space-y-4">
//       <div className="border rounded-md p-3 bg-white text-black">
//         <PaymentElement />
//       </div>

//       <Button
//         onClick={handlePay}
//         disabled={loading}
//         className="w-full h-11 bg-blue-600 text-white rounded-lg"
//       >
//         {loading ? "Processing..." : "Pay Now"}
//       </Button>
//     </div>
//   );
// }

function StripeUnifiedPaymentForm({
  clientSecret,
  bnplMethods = [],
}: {
  clientSecret: string;
  bnplMethods?: any[];
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/check-out/payment`,
        },
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        setLoading(false);
        return;
      }

      // For CARD → succeeds instantly
      if (paymentIntent?.status === "succeeded") {
        const token = getAuthToken();
        if (!token) {
          toast.error("Authentication required. Please log in again.");
          setLoading(false);
          return;
        }

        try {
          const confirmResponse = await axios.post(
            `${API_BASE_URL}/payments/confirm`,
            { paymentIntentId: paymentIntent.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Tenant-ID": HOST_Tenant_ID,
              },
            }
          );

          // Store confirmed purchase for success page
          localStorage.setItem(
            "confirmedPurchase",
            JSON.stringify(confirmResponse.data)
          );

          toast.success("Payment successful!");
          window.location.href = "/check-out/payment";
        } catch (error: any) {
          console.error("Payment confirmation error:", error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Payment succeeded but confirmation failed. Please contact support with payment ID: " +
              paymentIntent.id;
          toast.error(errorMessage);
          // Don't redirect - let user retry or contact support
          setLoading(false);
          return;
        }
      } else if (!paymentIntent && !error) {
        // Redirect is happening (PayPal, BNPL) - Stripe will handle redirect
        toast.loading("Redirecting to payment provider...", {
          id: "redirect-payment",
        });
        // Don't set loading to false - let redirect happen
        return;
      } else {
        // Other status (processing, requires_action, etc.)
        // These are handled by Stripe redirects automatically
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(
        err?.message || "An unexpected error occurred during payment"
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select your payment method below. BNPL options will appear if
          available for your order and country.
        </p>
        <div className="border rounded-lg p-4 bg-white dark:bg-[#1a1a1a]">
          <PaymentElement
            options={{
              layout: "accordion", // Expandable accordion layout - shows more methods
              defaultValues: {
                billingDetails: {
                  address: {
                    country: "US", // Default, will be auto-detected
                  },
                },
              },
              fields: {
                billingDetails: {
                  address: {
                    country: "auto", // Auto-detect country
                  },
                },
              },
              // Show all available payment methods
              paymentMethodOrder: undefined, // Let Stripe decide based on availability
            }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Click on payment methods to expand and see more options. After
          submission, you will be redirected to securely complete next steps.
        </p>
      </div>
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full h-11 bg-blue-600 text-white rounded-lg"
      >
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}

/* ─────────────────────────────────────────
   INSTALLMENT PAYMENT COMPONENT (1st payment + confirm)
──────────────────────────────────────────*/
function StripeInstallmentPaymentForm({
  clientSecret,
  installmentPurchaseId,
  setupIntentClientSecret,
  enableAutoPay,
}: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleInstallmentPay = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    toast.loading("Processing first installment...", { id: "inst-pay" });

    try {
      const card = elements.getElement(CardElement);
      if (!card) {
        toast.error("Card input missing", { id: "inst-pay" });
        setLoading(false);
        return;
      }

      // 1) Pay first installment via PaymentIntent clientSecret
      const payRes = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (payRes.error) {
        toast.error(payRes.error.message || "Installment payment failed", {
          id: "inst-pay",
        });
        setLoading(false);
        return;
      }

      const paymentIntent = payRes.paymentIntent;
      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        toast.error("Installment payment not completed", { id: "inst-pay" });
        setLoading(false);
        return;
      }

      // 2) Confirm with backend installment confirm endpoint
      const token = getAuthToken();
      if (!token) {
        toast.error("Auth token missing", { id: "inst-pay" });
        setLoading(false);
        return;
      }

      await axios.post(
        `${API_BASE_URL}/payments/installments/purchase/${installmentPurchaseId}/confirm`,
        { stripePaymentIntentId: paymentIntent.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
            "Content-Type": "application/json",
          },
        }
      );

      // 3) Save card for auto-pay (optional) using SetupIntent
      if (enableAutoPay && setupIntentClientSecret) {
        const setupRes = await stripe.confirmCardSetup(
          setupIntentClientSecret,
          {
            payment_method: { card },
          }
        );

        if (setupRes.error) {
          // We won't fail checkout if saving card fails; just inform.
          toast.error(setupRes.error.message || "Card saving failed", {
            id: "inst-pay",
          });
        }
      }

      toast.success("First installment paid! Tickets issued 🎉", {
        id: "inst-pay",
      });

      setTimeout(() => {
        window.location.href = "/check-out/payment";
      }, 1200);
    } catch (err: any) {
      console.error("❌ Installment payment error:", err);
      toast.error(
        err?.response?.data?.message || "Installment payment failed",
        {
          id: "inst-pay",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <CardElement className="border rounded-md p-3 bg-white text-black" />

      <Button
        onClick={handleInstallmentPay}
        disabled={loading}
        className="w-full h-11 bg-blue-600 text-white rounded-lg"
      >
        {loading ? "Processing..." : "Pay First Installment"}
      </Button>
    </div>
  );
}

const MAX_TICKETS_PER_ORDER = 10;

type PaymentMode = "stripe";

// type PaymentMode = "card" | "bnpl" | "installment";
// type BNPLProvider = "klarna" | "afterpay_clearpay" | "affirm";

// type FullPaymentProvider =
//   | "card"
//   | "google_pay"
//   | "apple_pay"
//   | "paypal"
//   | "link";

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

  const selectedTicket = tickets.find((t) => t.id === type);
  const price = selectedTicket ? selectedTicket.price : 0;

  // const serviceFee = 3.75;
  // const total = useMemo(() => price * qty + serviceFee, [price, qty]);

  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");

  // NEW: payment method support
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("stripe");

  // const [availableMethods, setAvailableMethods] = useState<any[]>([]);
  // const [bnplProvider, setBnplProvider] = useState<BNPLProvider>("klarna");

  // const [fullPaymentProvider, setFullPaymentProvider] =
  //   useState<FullPaymentProvider>("card");

  // Stripe BNPL options (Klarna, Afterpay, Affirm) - from Stripe dashboard
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<any[]>(
    []
  );
  const [bnplMethods, setBnplMethods] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ───────── SERVICE FEE DERIVED STATE ─────────
  const serviceFeeConfig = eventData?.features?.serviceFee;
  const serviceFeeHandling = eventData?.eventSettings?.serviceFee?.handling;

  // Show service fee ONLY when PASS_TO_BUYER
  const showServiceFee =
    serviceFeeHandling === "PASS_TO_BUYER" && serviceFeeConfig?.enabled;

  // Calculate service fee dynamically
  const calculatedServiceFee = useMemo(() => {
    if (!showServiceFee || !serviceFeeConfig) return 0;

    if (serviceFeeConfig.type === "flat") {
      return serviceFeeConfig.value;
    }

    if (serviceFeeConfig.type === "percentage") {
      return (price * qty * serviceFeeConfig.value) / 100;
    }

    return 0;
  }, [showServiceFee, serviceFeeConfig, price, qty]);

  const total = useMemo(
    () => price * qty + calculatedServiceFee,
    [price, qty, calculatedServiceFee]
  );

  // ───────── BUYER CREDITS ─────────
  const [creditPoints, setCreditPoints] = useState<number>(0);
  const [creditUsd, setCreditUsd] = useState<number>(0);
  const [creditExpiry, setCreditExpiry] = useState<string | null>(null);
  const [creditCurrency, setCreditCurrency] = useState<string>("USD");
  const [loadingCredits, setLoadingCredits] = useState(false);

  // ✅ NEW: toggle for using credits
  const [useCredits, setUseCredits] = useState<boolean>(false);

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

  // Check authentication status
  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  /* ─────────────── FETCH BUYER CREDITS ───────────────*/
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchBuyerCredits = async () => {
      try {
        setLoadingCredits(true);

        const res = await axios.get(`${API_BASE_URL}/users/buyer/credits`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        });

        const data = res?.data?.data;

        setCreditPoints(Number(data?.balance || 0)); // points
        setCreditUsd(Number(data?.usdEquivalent || 0)); // USD
        setCreditExpiry(data?.earliestExpiry || null);
        setCreditCurrency(data?.currency || "USD");
      } catch (err) {
        // Fail-safe
        setCreditPoints(0);
        setCreditUsd(0);
        setCreditExpiry(null);
        setCreditCurrency("USD");
      } finally {
        setLoadingCredits(false);
      }
    };

    fetchBuyerCredits();
  }, []);

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

  /* ─────────────── FETCH AVAILABLE PAYMENT METHODS (Stripe BNPL) ───────────────*/
  useEffect(() => {
    if (!total || total <= 0) return;

    // Try to detect country from browser or use default
    // You can also get this from user profile or IP geolocation
    const userCountry =
      navigator.language?.split("-")[1]?.toUpperCase() || "US";

    console.log(
      "🔄 Fetching Stripe payment methods for amount:",
      total,
      "country:",
      userCountry
    );

    axios
      .get(
        `${API_BASE_URL}/payments/available-methods?amount=${total}&country=${userCountry}`,
        {
          headers: {
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        }
      )
      .then((res) => {
        const methods =
          res.data?.data?.paymentMethods || res.data?.paymentMethods || [];
        console.log("✅ Available payment methods:", methods);

        setAvailablePaymentMethods(methods);

        // Filter BNPL methods (Klarna, Afterpay, Affirm) - only show available ones
        const bnpl = methods.filter(
          (m: any) =>
            m.available &&
            (m.type === "klarna" ||
              m.type === "afterpay_clearpay" ||
              m.type === "affirm")
        );
        console.log("📦 BNPL methods available:", bnpl);
        setBnplMethods(bnpl);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch payment methods:", err);
        setAvailablePaymentMethods([]);
        setBnplMethods([]);
      });
  }, [total]);

  // const fullPaymentMethods = useMemo(
  //   () => availableMethods.filter((m) => m.available && !m.minAmount),
  //   [availableMethods]
  // );

  // const bnplPaymentMethods = useMemo(
  //   () => availableMethods.filter((m) => m.available && m.minAmount),
  //   [availableMethods]
  // );

  // const bnplAvailable = useMemo(() => {
  //   return availableMethods?.some(
  //     (m: any) =>
  //       m.available &&
  //       (m.type === "klarna" ||
  //         m.type === "afterpay_clearpay" ||
  //         m.type === "affirm")
  //   );
  // }, [availableMethods]);

  // const allowedBnplProviders = useMemo(() => {
  //   const allowed: BNPLProvider[] = [];
  //   for (const m of availableMethods || []) {
  //     if (!m?.available) continue;
  //     if (m.type === "klarna") allowed.push("klarna");
  //     if (m.type === "afterpay_clearpay") allowed.push("afterpay_clearpay");
  //     if (m.type === "affirm") allowed.push("affirm");
  //   }
  //   return allowed;
  // }, [availableMethods]);

  // useEffect(() => {
  //   // Keep a safe provider selected if availability changes
  //   if (!allowedBnplProviders.includes(bnplProvider)) {
  //     if (allowedBnplProviders.length > 0)
  //       setBnplProvider(allowedBnplProviders[0]);
  //   }
  // }, [allowedBnplProviders, bnplProvider]);

  // Reset payment state when user switches mode / ticket / qty
  useEffect(() => {
    setClientSecret("");
  }, [paymentMode, type, qty]);

  const shouldSendServiceFee = showServiceFee && calculatedServiceFee > 0;

  /* ─────────────── INITIATE DIRECT / BNPL PAYMENT ───────────────*/
  const handlePaymentInitiate = async () => {
    const token = getToken();
    if (!token) {
      toast.error(
        "You must be logged in to proceed with payment. Please sign in first."
      );
      // Redirect to sign-in page after a short delay
      setTimeout(() => {
        window.location.href = "/sign-up";
      }, 2000);
      return;
    }

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

    try {
      setInitiatingPayment(true);

      // 1) Get Stripe publishable key
      const pubRes = await axios.get(
        `${API_BASE_URL}/payments/config/publishable-key`,
        {
          headers: { "X-Tenant-ID": HOST_Tenant_ID },
        }
      );

      const publishableKey = pubRes.data?.data?.publishableKey;

      if (!publishableKey) {
        toast.error("Stripe key missing");
        return;
      }

      setStripePromise(loadStripe(publishableKey));

      // 2) Initiate payment (ONLY required fields)
      const body: any = {
        ticketId: type,
        quantity: qty,
        useCredits: useCredits, // 👈 THIS IS THE KEY LINE
      };

      // ✅ Send serviceFee ONLY when included in subtotal
      if (shouldSendServiceFee) {
        body.serviceFee = Number(calculatedServiceFee.toFixed(2));
      }

      // if (paymentMode === "card") {
      //   body.paymentMethodType = fullPaymentProvider;
      // }

      // if (paymentMode === "bnpl") {
      //   body.paymentMethodType = bnplProvider;
      // }

      const res = await axios.post(`${API_BASE_URL}/payments/initiate`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": HOST_Tenant_ID,
          "Content-Type": "application/json",
        },
      });

      const secret = res.data?.data?.clientSecret;
      if (!secret) {
        toast.error("Client secret missing");
        return;
      }

      setClientSecret(secret);
      toast.success("Payment session created");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Payment initiation failed", {
        id: "init-payment",
      });
    } finally {
      setInitiatingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0077F71A] dark:bg-[#101010] rounded-2xl flex justify-center py-8 px-4">
      <div className="w-full max-w-md space-y-4">
        {/* Event Details */}
        <div className="rounded-[12px] border bg-white dark:bg-[#1a1a1a] p-4">
          <div className="relative mb-3 overflow-hidden rounded-[12px]">
            Event Detials
          </div>

          <p className="text-lg font-medium">
            {eventData?.title || "Loading..."}
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

        {/* ─────────────────────────────────────────
    CREDIT BALANCE CARD
────────────────────────────────────────── */}
        <div
          className={`rounded-xl border p-4 shadow-sm cursor-pointer transition
    ${
      useCredits
        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
        : "bg-white dark:bg-[#1a1a1a]"
    }`}
          onClick={() => {
            if (creditPoints > 0) {
              setUseCredits((prev) => !prev);
            }
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useCredits}
                disabled={creditPoints === 0}
                onChange={(e) => setUseCredits(e.target.checked)}
              />
              <span className="font-medium">Use Available Credits</span>
            </div>

            {useCredits && (
              <span className="text-xs font-medium text-blue-600">Applied</span>
            )}
          </div>

          <div className="rounded-lg border bg-gray-50 dark:bg-[#111] p-4 mb-3 space-y-2">
            {/* POINTS */}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 flex justify-between">
              <span>Current Credit Points</span>
              <span className="font-semibold text-black dark:text-white">
                {loadingCredits ? "Loading..." : creditPoints.toLocaleString()}
              </span>
            </p>

            {/* USD */}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 flex justify-between">
              <span>USD Equivalent</span>
              <span className="font-semibold text-black dark:text-white">
                {loadingCredits
                  ? "—"
                  : new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: creditCurrency,
                    }).format(creditUsd)}
              </span>
            </p>

            {/* EXPIRY */}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 flex justify-between">
              <span>Expires On</span>
              <span className="font-semibold text-black dark:text-white">
                {creditPoints > 0 && creditExpiry
                  ? new Date(creditExpiry).toLocaleDateString()
                  : "N/A"}
              </span>
            </p>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            {creditPoints > 0
              ? `Your promotional credits will expire on ${new Date(
                  creditExpiry as string
                ).toLocaleDateString()}.`
              : "You currently have no promotional credits available."}
          </p>
        </div>

        {/* Summary */}
        <div className="rounded-xl border bg-white dark:bg-[#1a1a1a] p-4">
          <p className="flex justify-between">
            <span>Ticket Subtotal:</span>
            <span>{formatter.format(price * qty)}</span>
          </p>

          {/* SERVICE FEE — ONLY WHEN PASS_TO_BUYER */}
          {showServiceFee && (
            <p className="flex justify-between mt-1">
              <span>
                Service Fee{" "}
                {serviceFeeConfig?.type === "percentage"
                  ? `(${serviceFeeConfig.value}%)`
                  : ""}
                :
              </span>
              <span>{formatter.format(calculatedServiceFee)}</span>
            </p>
          )}

          <hr className="my-2" />

          <p className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>{formatter.format(total)}</span>
          </p>
        </div>

        {/* ─────────────────────────────────────────
            PAYMENT METHOD SELECTOR (NEW)
        ────────────────────────────────────────── */}
        {/* <div className="rounded-xl border bg-white dark:bg-[#1a1a1a] p-4 space-y-3">
          <p className="font-medium">Choose Payment Method</p>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMode === "card"}
              onChange={() => setPaymentMode("card")}
            />
            <span>Pay in Full</span>
          </label>

          {paymentMode === "card" && (
            <div className="pl-6"> */}
        {/* <p className="text-sm text-gray-500 mb-1">
                Select payment method
              </p> */}

        {/* <select
                className="w-full border rounded-lg p-2 bg-white dark:bg-[#101010]"
                value={fullPaymentProvider}
                onChange={(e) =>
                  setFullPaymentProvider(e.target.value as FullPaymentProvider)
                }
              >
                {fullPaymentMethods.map((m) => (
                  <option key={m.type} value={m.type}>
                    {m.displayName}
                  </option>
                ))}
              </select> */}
        {/* </div>
          )}

          {bnplAvailable && (
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMode === "bnpl"}
                  onChange={() => setPaymentMode("bnpl")}
                />
                <span>Buy Now, Pay Later (BNPL)</span>
              </label>
              {paymentMode === "bnpl" && (
                <div className="pl-6"> */}
        {/* <p className="text-sm text-gray-500 mb-1">
                    Select BNPL provider
                  </p> */}

        {/* <select
                    className="w-full border rounded-lg p-2 bg-white dark:bg-[#101010]"
                    value={bnplProvider}
                    onChange={(e) =>
                      setBnplProvider(e.target.value as BNPLProvider)
                    }
                  >
                    {bnplPaymentMethods.map((m) => (
                      <option key={m.type} value={m.type}>
                        {m.displayName}
                      </option>
                    ))}
                  </select> */}
        {/* </div>
              )}
            </div>
          )}

          {installmentPlans.length > 0 && (
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMode === "installment"}
                  onChange={() => setPaymentMode("installment")}
                />
                <span>Pay in Installments</span>
              </label>

              {paymentMode === "installment" && (
                <div className="pl-6 space-y-3">
                  <p className="text-sm text-gray-500">
                    Select Installment Plan
                  </p>

                  <select
                    className="w-full border rounded-lg p-2 bg-white dark:bg-[#101010]"
                    value={selectedPlanId || ""}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a plan
                    </option>
                    {installmentPlans.map((plan: any) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} ({plan.numInstallments} payments)
                      </option>
                    ))}
                  </select>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={enableAutoPay}
                      onChange={(e) => setEnableAutoPay(e.target.checked)}
                    />
                    Enable Auto-Pay for future installments
                  </label>
                </div>
              )}
            </div>
          )}
        </div> */}

        <div className="rounded-xl border bg-white dark:bg-[#1a1a1a] p-4 space-y-3">
          <p className="font-medium">Payment Options</p>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMode === "stripe"}
              onChange={() => setPaymentMode("stripe")}
            />
            <span>Pay Now (Card, Wallets Or Buy Now Pay Later)</span>
          </label>

          {/* Show BNPL options from Stripe */}
          {/* {bnplMethods.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Buy Now, Pay Later Options:
              </p>
              <div className="space-y-2 pl-4">
                {bnplMethods.map((method: any) => (
                  <div
                    key={method.type}
                    className="flex items-center gap-2 text-sm"
                  >
                    {method.logoUrl && (
                      <img
                        src={method.logoUrl}
                        alt={method.displayName}
                        className="h-6 w-auto"
                      />
                    )}
                    <span>{method.displayName}</span>
                    {method.description && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        - {method.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 pl-4">
                BNPL options (Klarna, Afterpay, Affirm) will appear
                automatically in the payment form when you proceed.
              </p>
            </div>
          )} */}

          {/* {paymentMode === "stripe" && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Available payment methods (Card, Apple Pay, Google Pay, PayPal,
              BNPL) will appear automatically.
            </p>
          )} */}
        </div>

        {/* ─────────────────────────────────────────
            AUTHENTICATION WARNING
        ────────────────────────────────────────── */}
        {!isAuthenticated && (
          <div className="rounded-xl border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">
              ⚠️ Login Required
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              You must be logged in to proceed with payment. Please{" "}
              <a
                href="/sign-up"
                className="underline font-medium hover:text-yellow-900 dark:hover:text-yellow-100"
              >
                sign in
              </a>{" "}
              or{" "}
              <a
                href="/sign-up"
                className="underline font-medium hover:text-yellow-900 dark:hover:text-yellow-100"
              >
                create an account
              </a>{" "}
              to continue.
            </p>
          </div>
        )}

        {/* ─────────────────────────────────────────
            INITIATE PAYMENT BUTTONS
        ────────────────────────────────────────── */}
        {!clientSecret && paymentMode !== "installment" && (
          <Button
            className="w-full h-11 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePaymentInitiate}
            disabled={initiatingPayment || !isAuthenticated}
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
            ) : !isAuthenticated ? (
              "Please Sign In to Continue"
            ) : (
              "Continue to Payment"
            )}
          </Button>
        )}

        {/* ─────────────────────────────────────────
            STRIPE FORMS
        ────────────────────────────────────────── */}
        {/* {clientSecret && stripePromise && paymentMode === "card" && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripePaymentForm clientSecret={clientSecret} />
          </Elements>
        )}

        {clientSecret && stripePromise && paymentMode === "bnpl" && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeBNPLPaymentForm clientSecret={clientSecret} />
          </Elements>
        )} */}

        {clientSecret && stripePromise && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
              },
            }}
          >
            <StripeUnifiedPaymentForm
              clientSecret={clientSecret}
              bnplMethods={bnplMethods}
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
