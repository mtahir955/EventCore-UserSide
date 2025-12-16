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

/* ─────────────────────────────────────────
   STRIPE CARD PAYMENT COMPONENT
──────────────────────────────────────────*/

function StripePaymentForm({ clientSecret }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    const card = elements.getElement(CardElement);
    if (!card) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      toast.error(result.error.message || "Payment failed");
      setLoading(false);
      return;
    }

    // ⭐ SUCCESSFUL PAYMENT
    if (result.paymentIntent.status === "succeeded") {
      toast.success("Payment Successful! 🎉");

      const paymentIntent = result.paymentIntent;

      // ⭐ SAVE paymentIntent for later use
      localStorage.setItem(
        "lastPaymentResponse",
        JSON.stringify(paymentIntent)
      );

      // ⭐ CALL /payments/confirm API
      try {
        const token = getAuthToken();

        if (!token) {
          toast.error("Auth token missing");
          console.log("❌ TOKEN IS NULL, confirm API cannot work");
          return;
        }

        const confirmRes = await axios.post(
          `${API_BASE_URL}/payments/confirm`,
          {
            // purchaseId: localStorage.getItem("purchaseId"), // 👈 FROM initiate API
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

        console.log("📤 Sending Confirm Payload:", {
          paymentIntentId: paymentIntent.id,
          paymentResponse: paymentIntent,
        });
        console.log("📤 Using Token:", token);
        console.log("📤 Tenant:", HOST_Tenant_ID);

        console.log("🔥 PAYMENT CONFIRMED RESPONSE:", confirmRes.data);

        // Store for success page usage
        localStorage.setItem(
          "confirmedPurchase",
          JSON.stringify(confirmRes.data)
        );

        toast.success("Payment confirmed!");

        setTimeout(() => {
          window.location.href = "/check-out/payment";
        }, 30000);
      } catch (err: any) {
        console.error("❌ Confirm API error:", err);
        toast.error("Payment confirmed but backend failed.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="mt-4 space-y-4">
      <CardElement className="border rounded-md p-3 bg-white text-black" />

      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full h-11 bg-blue-600 text-white rounded-lg"
      >
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
}

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

  const selectedTicket = tickets.find((t) => t.id === type);
  const price = selectedTicket ? selectedTicket.price : 0;

  const serviceFee = 3.75;

  const total = useMemo(
    () => price * qty + serviceFee,
    [price, qty]
  );

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

    const token = getToken();
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    try {
      // 1️⃣ get publishable key
      const pubRes = await axios.get(
        `${API_BASE_URL}/payments/config/publishable-key`
      );
      const publishableKey = pubRes.data.data.publishableKey;

      if (!publishableKey) {
        toast.error("Stripe key missing");
        return;
      }

      setStripePromise(loadStripe(publishableKey));

      // 2️⃣ initiate payment
      const body = { ticketId: type, quantity: qty };

      const res = await axios.post(`${API_BASE_URL}/payments/initiate`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": HOST_Tenant_ID,
        },
      });

      const secret = res.data.data.clientSecret;
      setClientSecret(secret);

      toast.success("Payment session created");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0077F71A] dark:bg-[#101010] rounded-2xl flex justify-center py-8 px-4">
      <div className="w-full max-w-md space-y-4">
        {/* Event Details */}
        <div className="rounded-[12px] border bg-white dark:bg-[#1a1a1a] p-4">
          <div className="relative mb-3 overflow-hidden rounded-[12px]">
            {/* <Image
              src={eventData?.bannerImage || "/images/event.jpg"}
              alt="Event Image"
              width={360}
              height={200}
              className="h-[120px] w-full object-cover"
            /> */}
            Event Detials
          </div>

          <p className="text-lg font-medium">
            {eventData?.title || "Loading..."}
          </p>

          {/* <p className="text-gray-500">
            {selectedTicket
              ? formatter.format(selectedTicket.price)
              : formatter.format(0)}
          </p> */}

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
              <button onClick={() => setQty(qty + 1)}>
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

        {/* INITIATE PAYMENT */}
        {!clientSecret && (
          <Button
            className="w-full h-11 bg-blue-600 text-white rounded-lg"
            onClick={handlePaymentInitiate}
          >
            Continue to Payment
          </Button>
        )}

        {/* STRIPE CARD FORM */}
        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripePaymentForm clientSecret={clientSecret} />
          </Elements>
        )}
      </div>
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import { useMemo, useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { useSearchParams } from "next/navigation";
// import { loadStripe } from "@stripe/stripe-js";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// const formatter = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "USD",
// });

// export default function OrderSummary() {
//   const searchParams = useSearchParams();
//   const eventId = searchParams.get("id");

//   const [eventData, setEventData] = useState<any>(null);
//   const [loadingEvent, setLoadingEvent] = useState(true);

//   const [tickets, setTickets] = useState<any[]>([]);
//   const [type, setType] = useState<string>(""); // ticketId will be stored
//   const [qty, setQty] = useState(1);

//   const [showCoupon, setShowCoupon] = useState(false);
//   const [couponCode, setCouponCode] = useState("");
//   const [couponMessage, setCouponMessage] = useState("");
//   const [couponSuccess, setCouponSuccess] = useState(false);

//   // Get selected ticket
//   const selectedTicket = tickets.find((t) => t.id === type);
//   const price = selectedTicket ? selectedTicket.price : 0;

//   const serviceFee = 3.75;
//   const processingFee = 1.61;
//   const discount = couponSuccess ? 20 : 0;

//   const total = useMemo(
//     () => price * qty + serviceFee + processingFee - discount,
//     [price, qty, discount]
//   );

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

//   // ⭐ Fetch event details
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
//       .catch((err) => console.error("❌ Error fetching event:", err))
//       .finally(() => setLoadingEvent(false));
//   }, [eventId]);

//   // ⭐ Fetch tickets for this event
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
//         if (res.data?.data?.tickets) {
//           setTickets(res.data.data.tickets);
//         }
//       })
//       .catch((err) => console.error("❌ Error fetching tickets:", err));
//   }, [eventId]);

//   // Coupon Logic
//   const handleApplyCoupon = () => {
//     if (!couponCode.trim()) {
//       setCouponSuccess(false);
//       setCouponMessage("Please enter a coupon code.");
//       return;
//     }

//     if (couponCode.trim().toUpperCase() === "SAVE20") {
//       setCouponSuccess(true);
//       setCouponMessage("✅ Coupon applied successfully! You saved $20.");
//     } else {
//       setCouponSuccess(false);
//       setCouponMessage("❌ Invalid coupon code.");
//     }
//   };

//   // ⭐ MAIN PAYMENT LOGIC ⭐
//   const initiatePayment = async () => {
//     try {
//       const token = getToken();
//       if (!token) {
//         console.error("❌ No token found");
//         return;
//       }

//       // -----------------------------------------
//       // 1️⃣ GET publishable key
//       // -----------------------------------------
//       const publishableRes = await axios.get(
//         `${API_BASE_URL}/payments/config/publishable-key`
//       );

//       const publishableKey = publishableRes.data?.data?.publishableKey;

//       if (!publishableKey) {
//         console.error("❌ No publishable key received");
//         return;
//       }

//       localStorage.setItem("stripePublishableKey", publishableKey);

//       // -----------------------------------------
//       // 2️⃣ INITIATE payment
//       // -----------------------------------------
//       const initiateBody = {
//         ticketId: type, // selected ticket
//         quantity: qty,
//         couponCode: couponSuccess ? couponCode : undefined,
//       };

//       const initRes = await axios.post(
//         `${API_BASE_URL}/payments/initiate`,
//         initiateBody,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Tenant-ID": HOST_Tenant_ID,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const paymentData = initRes.data.data;
//       const clientSecret = paymentData.clientSecret;

//       // -----------------------------------------
//       // 3️⃣ Load Stripe dynamically
//       // -----------------------------------------
//       const stripe = await loadStripe(publishableKey);
//       if (!stripe) {
//         console.error("❌ Stripe failed to load");
//         return;
//       }

//       // -----------------------------------------
//       // 4️⃣ Redirect to Stripe checkout
//       // -----------------------------------------
//       const result = await stripe.redirectToCheckout({
//         clientSecret: clientSecret,
//       });

//       if (result?.error) {
//         console.error("❌ Stripe error:", result.error.message);
//       }
//     } catch (err) {
//       console.error("❌ PAYMENT ERROR:", err);
//     }
//   };

//   // ⭐ Validate form before payment
//   const handlePayNow = () => {
//     const inputs = document.querySelectorAll(
//       "input[required], textarea[required], select[required]"
//     );

//     let hasEmpty = false;

//     inputs.forEach((input) => {
//       const el = input as any;
//       if (!el.value.trim()) {
//         el.classList.add("border-red-500");
//         hasEmpty = true;
//       } else {
//         el.classList.remove("border-red-500");
//       }
//     });

//     if (!hasEmpty) initiatePayment();
//   };

//   return (
//     <div className="min-h-screen bg-[#0077F71A] dark:bg-[#101010] rounded-2xl flex justify-center py-8 px-4">
//       <div className="w-full max-w-md space-y-4 overflow-y-auto">
// {/* Event Details */}
// <div className="rounded-[12px] border bg-white dark:bg-[#1a1a1a] p-4">
//   <div className="relative mb-3 overflow-hidden rounded-[12px]">
//     <Image
//       src={eventData?.bannerImage || "/images/event.jpg"}
//       alt="Event Image"
//       width={360}
//       height={200}
//       className="h-[120px] w-full object-cover"
//     />
//   </div>

//   <p className="text-lg font-medium">
//     {eventData?.title || "Loading..."}
//   </p>

//   <p className="text-gray-500">
//     {selectedTicket
//       ? formatter.format(selectedTicket.price)
//       : formatter.format(0)}
//   </p>

//   <p className="text-sm text-gray-400 mt-2">
//     {eventData?.date?.fullDate}
//   </p>
//   <p className="text-sm text-gray-400">{eventData?.location}</p>
// </div>

// {/* Ticket selection */}
// <div className="rounded-[12px] border bg-white dark:bg-[#1a1a1a] p-4">
//   <fieldset className="space-y-3">
//     {tickets.length > 0 ? (
//       tickets.map((ticket: any) => (
//         <label
//           key={ticket.id}
//           className="flex justify-between cursor-pointer"
//         >
//           <div className="flex items-center gap-3">
//             <input
//               type="radio"
//               name="ticket"
//               checked={type === ticket.id}
//               onChange={() => setType(ticket.id)}
//               required
//             />
//             <span>{ticket.name}</span>
//           </div>

//           <span>{formatter.format(ticket.price)}</span>
//         </label>
//       ))
//     ) : (
//       <p className="text-sm text-gray-500">Loading tickets...</p>
//     )}
//   </fieldset>

//   {/* Quantity */}
//   <div className="mt-4 flex justify-between items-center">
//     <span>No of Tickets</span>
//     <div className="flex items-center gap-3">
//       <button onClick={() => setQty(Math.max(1, qty - 1))}>
//         <Image
//           src="/images/icon-minus.png"
//           alt="-"
//           width={20}
//           height={20}
//         />
//       </button>
//       <span>{qty}</span>
//       <button onClick={() => setQty(qty + 1)}>
//         <Image
//           src="/images/icon-plus.png"
//           alt="+"
//           width={20}
//           height={20}
//         />
//       </button>
//     </div>
//   </div>
// </div>

//         {/* Coupon */}
//         <div className="rounded-[12px] border p-4 bg-white dark:bg-[#1a1a1a]">
//           <label className="font-medium">Add Coupon Code</label>
//           <div className="flex gap-3 mt-2">
//             <input
//               value={couponCode}
//               onChange={(e) => setCouponCode(e.target.value)}
//               className="flex-1 border p-2 rounded-md bg-white dark:bg-[#101010]"
//               placeholder="Enter coupon"
//             />
//             <button
//               onClick={handleApplyCoupon}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md"
//             >
//               Apply
//             </button>
//           </div>
//           {couponMessage && (
//             <p
//               className={`text-sm mt-2 ${
//                 couponSuccess ? "text-green-600" : "text-red-500"
//               }`}
//             >
//               {couponMessage}
//             </p>
//           )}
//         </div>

//         {/* Payment summary */}
//         <div className="rounded-[12px] border p-4 bg-white dark:bg-[#1a1a1a]">
//           <h3 className="font-medium mb-3">Payment Details</h3>

//           <Row label="Tickets" value={formatter.format(price * qty)} />
//           <Row label="Service Fee" value={formatter.format(serviceFee)} />
//           <Row label="Processing Fee" value={formatter.format(processingFee)} />
//           {couponSuccess && (
//             <Row label="Discount" value={`-${formatter.format(discount)}`} />
//           )}

//           <div className="border-t mt-2" />
//           <Row label="Total" value={formatter.format(total)} bold />
//         </div>

//         {/* Pay Now */}
//         <Button
//           className="w-full h-11 bg-blue-600 text-white rounded-lg"
//           onClick={handlePayNow}
//         >
//           Pay Now
//         </Button>
//       </div>
//     </div>
//   );
// }

// function Row({ label, value, bold = false }: any) {
//   return (
//     <div className="flex justify-between text-sm mt-1">
//       <span className={bold ? "font-semibold" : ""}>{label}</span>
//       <span className={bold ? "font-semibold" : ""}>{value}</span>
//     </div>
//   );
// }

//code before integrate the stripe using decument send by mansoor

// "use client";

// import Image from "next/image";
// import { useMemo, useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { useSearchParams } from "next/navigation";
// import { loadStripe } from "@stripe/stripe-js";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// const formatter = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "USD",
// });

// // Stripe loader
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// );

// export default function OrderSummary() {
//   const searchParams = useSearchParams();
//   const eventId = searchParams.get("id");

//   const [eventData, setEventData] = useState<any>(null);
//   const [loadingEvent, setLoadingEvent] = useState(true);

//   const [type, setType] = useState<"general" | "vip">("general");
//   const [qty, setQty] = useState(1);
//   const [showCoupon, setShowCoupon] = useState(false);
//   const [couponCode, setCouponCode] = useState("");
//   const [couponMessage, setCouponMessage] = useState("");
//   const [couponSuccess, setCouponSuccess] = useState(false);

//   const [tickets, setTickets] = useState<any[]>([]);

//   // Default prices before API loads
//   const selectedTicket = tickets.find((t) => t.id === type);
//   const price = selectedTicket ? selectedTicket.price : 0;
//   const serviceFee = 3.75;
//   const processingFee = 1.61;
//   const discount = couponSuccess ? 20 : 0;

//   const total = useMemo(
//     () => price * qty + serviceFee + processingFee - discount,
//     [price, qty, discount]
//   );

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

//   // ⭐ Fetch event details for order summary (same as detail page)
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
//       .then((res) => {
//         setEventData(res.data.data);
//       })
//       .catch((err) => {
//         console.error("❌ Error fetching order event:", err);
//       })
//       .finally(() => setLoadingEvent(false));
//   }, [eventId]);

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
//         if (res.data?.data?.tickets) {
//           setTickets(res.data.data.tickets);
//         }
//       })
//       .catch((err) => {
//         console.error("❌ Error fetching tickets:", err);
//       });
//   }, [eventId]);

//   // Apply coupon logic
//   const handleApplyCoupon = () => {
//     if (!couponCode.trim()) {
//       setCouponSuccess(false);
//       setCouponMessage("Please enter a coupon code.");
//       return;
//     }

//     if (couponCode.trim().toUpperCase() === "SAVE20") {
//       setCouponSuccess(true);
//       setCouponMessage("✅ Coupon applied successfully! You saved $20.");
//     } else {
//       setCouponSuccess(false);
//       setCouponMessage("❌ Invalid coupon code.");
//     }
//   };

//   // Stripe Checkout Logic
//   const startStripeCheckout = async () => {
//     const stripe = await stripePromise;

//     const emailElement = document.querySelector("input[name='email']");
//     const email = emailElement ? emailElement.value : "";

//     const body = {
//       total,
//       qty,
//       ticketType: type,
//       customer: { email },
//     };

//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/create-checkout-session`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       }
//     );

//     const data = await res.json();
//     stripe?.redirectToCheckout({ sessionId: data.id });
//   };

//   const handlePayNow = () => {
//     const inputs = document.querySelectorAll(
//       "input[required], textarea[required], select[required]"
//     );

//     let hasEmpty = false;

//     inputs.forEach((input) => {
//       const el = input as any;
//       if (!el.value.trim()) {
//         el.classList.add("border-red-500");
//         hasEmpty = true;
//       } else {
//         el.classList.remove("border-red-500");
//       }
//     });

//     if (!hasEmpty) startStripeCheckout();
//   };

//   return (
//     <div className="min-h-screen bg-[#0077F71A] dark:bg-[#101010] rounded-2xl flex justify-center py-8 px-4">
//       <div className="w-full max-w-md space-y-4 overflow-y-auto">
//         {/* Event Details */}
//         <div className="rounded-[12px] border bg-white dark:bg-[#1a1a1a] p-4">
//           <div className="relative mb-3 overflow-hidden rounded-[12px]">
//             <Image
//               src={
//                 eventData?.bannerImage
//                   ? eventData.bannerImage
//                   : "/images/event.jpg"
//               }
//               alt="Event Image"
//               width={360}
//               height={200}
//               className="h-[120px] w-full object-cover"
//             />
//           </div>

//           <p className="text-lg font-medium">
//             {eventData?.title || "Loading..."}
//           </p>

//           <p className="text-gray-500">
//             {eventData?.ticketPricing?.length
//               ? formatter.format(eventData.ticketPricing[0].price)
//               : formatter.format(price)}
//           </p>

//           {/* EXTRA DETAILS (Optional to show — does NOT change UI) */}
//           <p className="text-sm text-gray-400 mt-2">
//             {eventData?.date?.fullDate}
//           </p>
//           <p className="text-sm text-gray-400">{eventData?.location}</p>
//         </div>

//         {/* Ticket selection */}
//         <div className="rounded-[12px] border bg-white dark:bg-[#1a1a1a] p-4">
//           <fieldset className="space-y-3">
//             {tickets.length > 0 ? (
//               tickets.map((ticket: any, index: number) => (
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
//               // Fallback if no tickets exist
//               <>
//                 <label className="flex justify-between cursor-pointer">
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="radio"
//                       name="ticket"
//                       checked={type === "general"}
//                       onChange={() => setType("general")}
//                       required
//                     />
//                     <span>General Ticket</span>
//                   </div>
//                   <span>{formatter.format(199.99)}</span>
//                 </label>
//               </>
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

//               <button onClick={() => setQty(qty + 1)}>
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

//         {/* Coupon */}
//         <div className="rounded-[12px] border p-4 bg-white dark:bg-[#1a1a1a]">
//           <label className="font-medium">Add Coupon Code</label>
//           <div className="flex gap-3 mt-2">
//             <input
//               value={couponCode}
//               onChange={(e) => setCouponCode(e.target.value)}
//               className="flex-1 border p-2 rounded-md bg-white dark:bg-[#101010]"
//               placeholder="Enter coupon"
//             />
//             <button
//               onClick={handleApplyCoupon}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md"
//             >
//               Apply
//             </button>
//           </div>
//           {couponMessage && (
//             <p
//               className={`text-sm mt-2 ${
//                 couponSuccess ? "text-green-600" : "text-red-500"
//               }`}
//             >
//               {couponMessage}
//             </p>
//           )}
//         </div>

//         {/* Payment summary */}
//         <div className="rounded-[12px] border p-4 bg-white dark:bg-[#1a1a1a]">
//           <h3 className="font-medium mb-3">Payment Details</h3>

//           <Row label="Tickets" value={formatter.format(price * qty)} />
//           <Row label="Service Fee" value={formatter.format(serviceFee)} />
//           <Row label="Processing Fee" value={formatter.format(processingFee)} />
//           {couponSuccess && (
//             <Row label="Discount" value={`-${formatter.format(discount)}`} />
//           )}

//           <div className="border-t mt-2" />

//           <Row label="Total" value={formatter.format(total)} bold />
//         </div>

//         {/* Pay Now */}
//         <Button
//           className="w-full h-11 bg-blue-600 text-white rounded-lg"
//           onClick={handlePayNow}
//         >
//           Pay Now
//         </Button>
//       </div>
//     </div>
//   );
// }

// function Row({ label, value, bold = false }: any) {
//   return (
//     <div className="flex justify-between text-sm mt-1">
//       <span className={bold ? "font-semibold" : ""}>{label}</span>
//       <span className={bold ? "font-semibold" : ""}>{value}</span>
//     </div>
//   );
// }

// //code before integrate the stripe

// "use client";

// import Image from "next/image";
// import { useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// const formatter = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "USD",
// });

// export default function OrderSummary() {
//   const [type, setType] = useState<"general" | "vip">("general");
//   const [qty, setQty] = useState(1);
//   const [showCoupon, setShowCoupon] = useState(false);
//   const [couponCode, setCouponCode] = useState("");
//   const [couponMessage, setCouponMessage] = useState("");
//   const [couponSuccess, setCouponSuccess] = useState(false);

//   const router = useRouter();

//   const price = type === "general" ? 199.99 : 299.99;
//   const serviceFee = 3.75;
//   const processingFee = 1.61;

//   const discount = couponSuccess ? 20 : 0; // Example: 20 USD discount for valid coupon
//   const total = useMemo(
//     () => price * qty + serviceFee + processingFee - discount,
//     [price, qty, discount]
//   );

//   const handleApplyCoupon = () => {
//     if (!couponCode.trim()) {
//       setCouponSuccess(false);
//       setCouponMessage("Please enter a coupon code.");
//       return;
//     }

//     if (couponCode.trim().toUpperCase() === "SAVE20") {
//       setCouponSuccess(true);
//       setCouponMessage("✅ Coupon applied successfully! You saved $20.");
//     } else {
//       setCouponSuccess(false);
//       setCouponMessage("❌ Invalid coupon code.");
//     }
//   };

//   const handlePayNow = () => {
//     const inputs = document.querySelectorAll(
//       "input[required], textarea[required], select[required]"
//     );
//     let hasEmpty = false;

//     inputs.forEach((input) => {
//       const el = input as
//         | HTMLInputElement
//         | HTMLTextAreaElement
//         | HTMLSelectElement;
//       if (!el.value.trim()) {
//         el.classList.add("border-red-500");
//         hasEmpty = true;
//       } else {
//         el.classList.remove("border-red-500");
//       }
//     });

//     if (!hasEmpty) router.push("/check-out/payment");
//   };

//   // Example Early Bird Settings
//   const earlyBirdLimit = 10; // Only first 10 seats are early bird
//   const isEarlyBirdUser = qty <= earlyBirdLimit;

//   return (
//     <div className="min-h-screen bg-[#0077F71A] dark:bg-[#101010] rounded-2xl flex justify-center py-8 px-4 transition-colors duration-300">
//       <div className="w-full max-w-md space-y-4 overflow-y-auto text-gray-900 dark:text-gray-100">
//         {/* Event card */}
//         <div className="rounded-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] p-4 shadow-sm transition-colors">
//           <div className="relative mb-3 overflow-hidden rounded-[12px]">
//             <Image
//               src="/images/event.jpg"
//               alt="Starry Nights Music Fest"
//               width={360}
//               height={200}
//               className="h-[120px] w-full object-cover"
//               priority
//             />
//             <Image
//               src="/images/icon-close.png"
//               alt="Remove"
//               width={26}
//               height={26}
//               className="absolute right-3 top-3 h-[26px] w-[26px] cursor-pointer"
//             />
//           </div>
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">
//                 Starry Nights Music Fest
//               </p>
//               <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                 {formatter.format(price)}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Ticket type + qty */}
//         <div className="rounded-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] p-4 transition-colors">
//           <fieldset className="space-y-3">
//             <label className="flex cursor-pointer items-center justify-between rounded-md px-1 py-1 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
//               <div className="flex items-center gap-3">
//                 <input
//                   type="radio"
//                   name="ticket"
//                   className="h-4 w-4 accent-blue-500"
//                   checked={type === "general"}
//                   onChange={() => setType("general")}
//                   required
//                 />
//                 <span className="text-[15px]">General Ticket</span>
//               </div>
//               <div className="text-right">
//                 <div className="text-[15px]">
//                   {formatter.format(199.99)}{" "}
//                   <span className="text-gray-400 line-through">$299.99</span>
//                 </div>
//               </div>
//             </label>

//             <label className="flex cursor-pointer items-center justify-between rounded-md px-1 py-1 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
//               <div className="flex items-center gap-3">
//                 <input
//                   type="radio"
//                   name="ticket"
//                   className="h-4 w-4 accent-blue-500"
//                   checked={type === "vip"}
//                   onChange={() => setType("vip")}
//                   required
//                 />
//                 <span className="text-[15px]">VIP Ticket</span>
//               </div>
//               <div className="text-right">
//                 <div className="text-[15px]">
//                   {formatter.format(299.99)}{" "}
//                   <span className="text-gray-400 line-through">$399.99</span>
//                 </div>
//               </div>
//             </label>
//           </fieldset>

//           {/* Quantity stepper */}
//           <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
//             <div className="flex items-center justify-between">
//               <span className="text-[15px]">No of Tickets</span>
//               <div className="flex items-center gap-3">
//                 <button
//                   aria-label="decrease"
//                   onClick={() => setQty((q) => Math.max(1, q - 1))}
//                   className="h-6 w-6"
//                 >
//                   <Image
//                     src="/images/icon-minus.png"
//                     alt="-"
//                     width={26}
//                     height={26}
//                   />
//                 </button>
//                 <span className="w-6 text-center text-[15px]">{qty}</span>
//                 <button
//                   aria-label="increase"
//                   onClick={() => setQty((q) => q + 1)}
//                   className="h-6 w-6"
//                 >
//                   <Image
//                     src="/images/icon-plus.png"
//                     alt="+"
//                     width={26}
//                     height={26}
//                   />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 💸 Add Coupon Section */}
//         <div className="rounded-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] p-4 transition-colors">
//           <div className="flex items-center justify-between mb-3">
//             <label className="text-[15px] font-medium text-gray-800 dark:text-gray-100">
//               Add Coupon Code
//             </label>
//             <button
//               onClick={() => setShowCoupon(!showCoupon)}
//               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                 showCoupon ? "bg-[#0077F7]" : "bg-gray-300"
//               }`}
//             >
//               <span
//                 className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white transition-transform ${
//                   showCoupon ? "translate-x-[20px]" : "translate-x-0"
//                 }`}
//               />
//             </button>
//           </div>

//           {showCoupon && (
//             <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3 w-full transition-all">
//               {/* Coupon Input */}
//               <input
//                 type="text"
//                 placeholder="Enter your coupon code"
//                 value={couponCode}
//                 onChange={(e) => setCouponCode(e.target.value)}
//                 className="w-full sm:flex-1 h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-[14px] outline-none"
//               />

//               {/* Apply Button */}
//               <button
//                 onClick={handleApplyCoupon}
//                 className="w-full sm:w-auto h-11 px-6 rounded-lg bg-[#0077F7] text-white text-[14px] font-medium text-center"
//               >
//                 Apply
//               </button>
//             </div>
//           )}

//           {couponMessage && (
//             <p
//               className={`mt-2 text-[13px] ${
//                 couponSuccess ? "text-green-600" : "text-red-500"
//               }`}
//             >
//               {couponMessage}
//             </p>
//           )}
//         </div>

//         {/* Payment breakdown */}
//         <div className="rounded-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] p-4 relative transition-colors">
//           <h3 className="mb-2 text-[15px] font-medium text-gray-900 dark:text-gray-100">
//             Payment Details
//           </h3>
//           <div className="space-y-2 text-sm">
//             <Row label="Ticket" value={formatter.format(price * qty)} />
//             {/* Early Bird Info */}
//             <Row
//               label="You are Early Bird"
//               value={isEarlyBirdUser ? "Yes" : "No"}
//             />
//             <Row label="Service Fee" value={formatter.format(serviceFee)} />
//             <Row
//               label="Processing Fee"
//               value={formatter.format(processingFee)}
//             />
//             {couponSuccess && (
//               <Row label="Discount" value={`-${formatter.format(discount)}`} />
//             )}
//             <div className="border-t border-gray-200 dark:border-gray-700 pt-2"></div>
//             <Row label="Total" value={formatter.format(total)} bold />
//           </div>
//         </div>

//         {/* Pay Now Button */}
//         <Button
//           className="w-full h-11 rounded-[10px] bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
//           onClick={handlePayNow}
//         >
//           Pay Now
//         </Button>
//       </div>
//     </div>
//   );
// }

// function Row({
//   label,
//   value,
//   bold = false,
// }: {
//   label: string;
//   value: string;
//   bold?: boolean;
// }) {
//   return (
//     <div className="flex items-center justify-between">
//       <span
//         className={
//           bold
//             ? "font-semibold text-gray-900 dark:text-gray-100"
//             : "text-gray-600 dark:text-gray-300"
//         }
//       >
//         {label}
//       </span>
//       <span
//         className={
//           bold
//             ? "font-semibold text-gray-900 dark:text-gray-100"
//             : "text-gray-800 dark:text-gray-200"
//         }
//       >
//         {value}
//       </span>
//     </div>
//   );
// }
