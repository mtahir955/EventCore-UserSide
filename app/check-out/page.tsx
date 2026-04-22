"use client";

import { useEffect, useRef, useState } from "react";
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

type CheckoutProfile = {
  basicInfo?: Record<string, any>;
  contactDetails?: Record<string, any>;
  paymentDetails?: Record<string, any>;
};

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
  const [checkoutProfile, setCheckoutProfile] =
    useState<CheckoutProfile | null>(null);
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

      if (!hasAuthToken()) return;

      try {
        const res = await apiClient.get("/users/buyer/profile");
        const mergedProfile = sanitizeProfilePaymentDetails(
          mergeCheckoutProfile(localProfile, res.data?.data, userData)
        );

        setCheckoutProfile(mergedProfile);
        localStorage.setItem("buyerProfile", JSON.stringify(mergedProfile));
      } catch (error) {
        console.error("Checkout profile prefill failed:", error);
      }
    };

    loadCheckoutProfile();
  }, []);

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
            <BasicInformation profile={checkoutProfile} />
            <ContactDetails profile={checkoutProfile} />
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
