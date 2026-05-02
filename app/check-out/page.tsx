"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import OrderSummary from "../check-out/components/checkout/order-summary";
import BasicInformation from "../check-out/components/checkout/form-sections/basic-information";
import ContactDetails from "../check-out/components/checkout/form-sections/contact-details";
import PaymentDetails from "../check-out/components/checkout/form-sections/payment-details";
import { apiClient } from "@/lib/apiClient";
import {
  getActivePaymentCard,
  getSavedPaymentCards,
  sanitizeProfilePaymentDetails,
} from "@/lib/paymentCards";
import { resolveCheckoutFields } from "@/lib/event-commerce";

type CheckoutProfile = {
  basicInfo?: Record<string, any>;
  contactDetails?: Record<string, any>;
  paymentDetails?: Record<string, any>;
};

const checkoutProfileToAnswers = (profile?: CheckoutProfile | null) => ({
  firstName: profile?.basicInfo?.firstName || "",
  lastName: profile?.basicInfo?.lastName || "",
  email: profile?.basicInfo?.email || profile?.basicInfo?.username || "",
  gender: profile?.basicInfo?.gender || "",
  phone: profile?.contactDetails?.phoneNumber || profile?.contactDetails?.phone || "",
  phoneCountryCode: profile?.contactDetails?.phoneCountryCode || "+1",
  city: profile?.contactDetails?.city || profile?.contactDetails?.town || "",
  pincode:
    profile?.contactDetails?.pincode ||
    profile?.contactDetails?.postalCode ||
    profile?.contactDetails?.zipCode ||
    "",
  address: profile?.contactDetails?.address || "",
  website: profile?.contactDetails?.website || "",
});

async function fetchCheckoutEventByIdentifiers(
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

const parseStoredJson = (key: string) => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const hasAuthToken = () => {
  if (typeof window === "undefined") return false;

  return [
    "buyerToken",
    "userToken",
    "staffToken",
    "hostToken",
    "token",
  ].some((key) => !!localStorage.getItem(key));
};

const userDataToProfile = (userData: any): CheckoutProfile => ({
  basicInfo: {
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    fullName: userData?.fullName || userData?.name || userData?.userName,
    email: userData?.email || userData?.username,
    gender: userData?.gender,
  },
  contactDetails: {
    phoneCountryCode: userData?.phoneCountryCode,
    phoneNumber: userData?.phoneNumber,
    phone: userData?.phone,
    city: userData?.city || userData?.town,
    pincode: userData?.pincode || userData?.postalCode || userData?.zipCode,
    address: userData?.address,
    website: userData?.website,
  },
});

const mergeCheckoutProfile = (
  savedProfile?: CheckoutProfile | null,
  serverProfile?: CheckoutProfile | null,
  userData?: any
): CheckoutProfile => {
  const userProfile = userDataToProfile(userData || {});

  return {
    ...(savedProfile || {}),
    ...(serverProfile || {}),
    basicInfo: {
      ...(userProfile.basicInfo || {}),
      ...(savedProfile?.basicInfo || {}),
      ...(serverProfile?.basicInfo || {}),
    },
    contactDetails: {
      ...(userProfile.contactDetails || {}),
      ...(savedProfile?.contactDetails || {}),
      ...(serverProfile?.contactDetails || {}),
    },
    paymentDetails: {
      ...(savedProfile?.paymentDetails || {}),
      ...(serverProfile?.paymentDetails || {}),
    },
  };
};

export default function Page() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const eventSlug = searchParams.get("slug");
  const [checkoutProfile, setCheckoutProfile] =
    useState<CheckoutProfile | null>(null);
  const [checkoutAnswers, setCheckoutAnswers] = useState<Record<string, string>>(
    {}
  );
  const [eventData, setEventData] = useState<any>(null);
  const [selectedTicketCheckoutConfigs, setSelectedTicketCheckoutConfigs] = useState<
    any[]
  >([]);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("new");
  const [saveNewCardForFuture, setSaveNewCardForFuture] = useState(false);
  const paymentSelectionInitializedRef = useRef(false);

  const handleSelectedPaymentOptionChange = (value: string) => {
    paymentSelectionInitializedRef.current = true;
    setSelectedPaymentOption(value);
  };

  useEffect(() => {
    const loadCheckoutProfile = async () => {
      const savedProfile = sanitizeProfilePaymentDetails(
        parseStoredJson("buyerProfile")
      );
      const userData =
        parseStoredJson("userData") || parseStoredJson("buyerUser");
      const localProfile = mergeCheckoutProfile(savedProfile, null, userData);

      setCheckoutProfile(localProfile);
      setCheckoutAnswers((current) => ({
        ...checkoutProfileToAnswers(localProfile),
        ...current,
      }));

      if (!hasAuthToken()) return;

      try {
        const res = await apiClient.get("/users/buyer/profile");
        const mergedProfile = sanitizeProfilePaymentDetails(
          mergeCheckoutProfile(localProfile, res.data?.data, userData)
        );

        setCheckoutProfile(mergedProfile);
        setCheckoutAnswers((current) => {
          const nextAnswers = checkoutProfileToAnswers(mergedProfile);
          const mergedAnswers: Record<string, string> = { ...current };

          Object.entries(nextAnswers).forEach(([key, value]) => {
            if (!mergedAnswers[key]) {
              mergedAnswers[key] = value;
            }
          });

          return mergedAnswers;
        });
        localStorage.setItem("buyerProfile", JSON.stringify(mergedProfile));
      } catch (error) {
        console.error("Checkout profile prefill failed:", error);
      }
    };

    loadCheckoutProfile();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadEvent = async () => {
      if (!eventId && !eventSlug) return;

      try {
        const data = await fetchCheckoutEventByIdentifiers(eventId, eventSlug);
        if (!cancelled) {
          setEventData(data);
        }
      } catch (error) {
        console.error("Checkout event schema prefill failed:", error);
      }
    };

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, [eventId, eventSlug]);

  useEffect(() => {
    const storedCards = getSavedPaymentCards(checkoutProfile?.paymentDetails);

    if (!storedCards.length) {
      if (selectedPaymentOption !== "new") {
        setSelectedPaymentOption("new");
      }
      return;
    }

    const hasSelectedCard = storedCards.some(
      (card) => card.id === selectedPaymentOption
    );

    if (!paymentSelectionInitializedRef.current) {
      setSelectedPaymentOption(
        getActivePaymentCard(storedCards)?.id || storedCards[0].id
      );
      return;
    }

    if (selectedPaymentOption !== "new" && !hasSelectedCard) {
      setSelectedPaymentOption(
        getActivePaymentCard(storedCards)?.id || storedCards[0].id
      );
    }
  }, [checkoutProfile, selectedPaymentOption]);

  const checkoutFields = useMemo(
    () =>
      resolveCheckoutFields(
        eventData?.eventSettings?.checkoutFields ?? eventData?.checkoutFields,
        selectedTicketCheckoutConfigs
      ),
    [eventData, selectedTicketCheckoutConfigs]
  );

  return (
    <main className="bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Main Checkout Section */}
      <section className="mx-auto w-full max-w-[1440px] px-6 md:px-10 pb-12">
        {/* Two-column layout */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
          {/* Left column - Forms */}
          <div className="space-y-8">
            <BasicInformation
              fields={checkoutFields}
              values={checkoutAnswers}
              onChange={(field, value) =>
                setCheckoutAnswers((current) => ({ ...current, [field]: value }))
              }
            />
            <ContactDetails
              fields={checkoutFields}
              values={checkoutAnswers}
              onChange={(field, value) =>
                setCheckoutAnswers((current) => ({ ...current, [field]: value }))
              }
            />
            <PaymentDetails
              profile={checkoutProfile}
              selectedOption={selectedPaymentOption}
              onSelectedOptionChange={handleSelectedPaymentOptionChange}
              saveNewCardForFuture={saveNewCardForFuture}
              onSaveNewCardForFutureChange={setSaveNewCardForFuture}
            />
          </div>

          {/* Right column - Order Summary */}
          <aside className="lg:pt-2">
            <OrderSummary
              profile={checkoutProfile}
              checkoutFields={checkoutFields}
              checkoutAnswers={checkoutAnswers}
              onSelectedTicketCheckoutConfigsChange={setSelectedTicketCheckoutConfigs}
              selectedPaymentOption={selectedPaymentOption}
              onSelectedPaymentOptionChange={handleSelectedPaymentOptionChange}
              saveNewCardForFuture={saveNewCardForFuture}
              onSaveNewCardForFutureChange={setSaveNewCardForFuture}
            />
          </aside>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
