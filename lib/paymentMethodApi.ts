import { apiClient } from "@/lib/apiClient";
import {
  getSavedPaymentCards,
  serializePaymentDetailsWithCards,
  type SavedPaymentCard,
} from "@/lib/paymentCards";

type AnyRecord = Record<string, any>;

const extractPaymentDetailsSource = (data?: AnyRecord | null) => {
  if (!data || typeof data !== "object") return {};

  if (data.paymentDetails && typeof data.paymentDetails === "object") {
    return data.paymentDetails;
  }

  if (data.profile?.paymentDetails && typeof data.profile.paymentDetails === "object") {
    return data.profile.paymentDetails;
  }

  if (data.buyer?.paymentDetails && typeof data.buyer.paymentDetails === "object") {
    return data.buyer.paymentDetails;
  }

  const cards =
    data.savedCards ||
    data.savedPaymentMethods ||
    data.paymentMethods ||
    data.cards ||
    (data.savedCard ? [data.savedCard] : []);

  return Array.isArray(cards) ? { savedCards: cards } : {};
};

export const buildPaymentDetailsFromApi = (
  data?: AnyRecord | null,
  fallbackDetails?: Record<string, any>
) => {
  const source = extractPaymentDetailsSource(data);
  const cards = getSavedPaymentCards(source);

  return serializePaymentDetailsWithCards(
    source && Object.keys(source).length ? source : fallbackDetails,
    cards
  );
};

export const buildSavedCardsFromApi = (
  data?: AnyRecord | null,
  fallbackDetails?: Record<string, any>
): SavedPaymentCard[] =>
  getSavedPaymentCards(buildPaymentDetailsFromApi(data, fallbackDetails));

export const fetchStripePublishableKey = async () => {
  const response = await apiClient.get("/payments/config/publishable-key");
  return response.data?.data?.publishableKey || "";
};

export const createSavedCardSetupIntent = async (payload: AnyRecord) => {
  const response = await apiClient.post("/payments/methods/setup-intent", payload);
  return response.data?.data || {};
};

export const confirmSavedCardSetup = async (payload: AnyRecord) => {
  const response = await apiClient.post("/payments/methods/confirm-save", payload);
  return response.data?.data || {};
};

export const setDefaultSavedCard = async (paymentMethodId: string) => {
  const response = await apiClient.patch(
    `/payments/methods/${paymentMethodId}/default`,
    { isDefault: true }
  );
  return response.data?.data || {};
};

export const deleteSavedCard = async (paymentMethodId: string) => {
  const response = await apiClient.delete(`/payments/methods/${paymentMethodId}`);
  return response.data?.data || {};
};

export const syncBuyerProfilePaymentDetails = (
  paymentDetails: Record<string, any>
) => {
  if (typeof window === "undefined") return null;

  let currentProfile: AnyRecord = {};

  try {
    currentProfile = JSON.parse(localStorage.getItem("buyerProfile") || "{}");
  } catch {
    currentProfile = {};
  }

  const nextProfile = {
    ...currentProfile,
    paymentDetails,
  };

  localStorage.setItem("buyerProfile", JSON.stringify(nextProfile));
  return nextProfile;
};
