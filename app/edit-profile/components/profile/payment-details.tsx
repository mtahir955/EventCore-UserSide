"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  getActivePaymentCard,
  getSavedPaymentCards,
  getStandbyPaymentCards,
  serializePaymentDetailsWithCards,
  type SavedPaymentCard,
} from "@/lib/paymentCards";
import {
  buildPaymentDetailsFromApi,
  confirmSavedCardSetup,
  createSavedCardSetupIntent,
  deleteSavedCard,
  fetchStripePublishableKey,
  setDefaultSavedCard,
} from "@/lib/paymentMethodApi";

interface PaymentDetailsProps {
  existing?: Record<string, any>;
  onPaymentDetailsChange?: (paymentDetails: Record<string, any>) => void;
}

type Notice = {
  tone: "info" | "success" | "error";
  text: string;
};

const noticeToneClasses: Record<Notice["tone"], string> = {
  info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-100",
  success:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-100",
  error: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-100",
};

const WalletCard = ({
  card,
  isDefault,
  isBusy,
  onSetDefault,
  onRemove,
}: {
  card: SavedPaymentCard;
  isDefault?: boolean;
  isBusy?: boolean;
  onSetDefault?: () => void;
  onRemove: () => void;
}) => (
  <div
    className={`rounded-lg border p-4 transition-colors ${
      isDefault
        ? "border-[#0077F7] bg-blue-50 dark:bg-blue-900/20"
        : "border-gray-300 bg-white dark:border-gray-700 dark:bg-[#101010]"
    }`}
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold capitalize text-gray-900 dark:text-gray-100">
            {card.brand}
          </span>
          {isDefault && (
            <span className="rounded-full bg-[#0077F7] px-2 py-0.5 text-[11px] font-medium text-white">
              Default
            </span>
          )}
          {card.status ? (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {card.status}
            </span>
          ) : null}
        </div>

        <p className="mt-2 text-lg font-semibold tracking-wide text-gray-900 dark:text-gray-100">
          {card.maskedNumber}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          {card.expiry && <span>Expires {card.expiry}</span>}
          {card.deletionBlockedReason && (
            <span className="text-red-600 dark:text-red-300">
              {card.deletionBlockedReason}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {!isDefault && onSetDefault && (
          <button
            type="button"
            onClick={onSetDefault}
            disabled={isBusy}
            className="h-9 rounded-lg border border-[#0077F7] px-3 text-xs font-medium text-[#0077F7] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-blue-900/20"
          >
            {isBusy ? "Updating..." : "Make Default"}
          </button>
        )}

        <button
          type="button"
          onClick={onRemove}
          disabled={isBusy || card.canDelete === false}
          className="h-9 rounded-lg border border-red-200 px-3 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-900/20"
        >
          {card.canDelete === false ? "Delete Blocked" : isBusy ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

function AddCardForm({
  cardCount,
  makeDefault,
  onMakeDefaultChange,
  onCancel,
  onSaved,
}: {
  cardCount: number;
  makeDefault: boolean;
  onMakeDefaultChange: (value: boolean) => void;
  onCancel: () => void;
  onSaved: (result: Record<string, any>, setAsDefault: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const defaultLocked = cardCount === 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is still loading. Please try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Secure card input is not ready yet.");
      return;
    }

    const setAsDefault = defaultLocked || makeDefault;

    try {
      setSubmitting(true);

      const setupIntent = await createSavedCardSetupIntent({
        saveForFuture: true,
        setAsDefault,
      });

      const clientSecret = setupIntent?.clientSecret;
      if (!clientSecret) {
        throw new Error("Card setup could not be started.");
      }

      const setupResult = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (setupResult.error) {
        throw new Error(setupResult.error.message || "Card setup failed.");
      }

      const setupIntentId = setupResult.setupIntent?.id;
      if (!setupIntentId) {
        throw new Error("Stripe did not return a setup reference.");
      }

      const confirmation = await confirmSavedCardSetup({
        setupIntentId,
        setAsDefault,
      });

      onSaved(confirmation, setAsDefault);
      toast.success("Card saved successfully.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to save card."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-700 dark:bg-[#101010]">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: "16px",
                color: "#111827",
                "::placeholder": {
                  color: "#6b7280",
                },
              },
            },
          }}
        />
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-dashed border-gray-300 bg-white p-3 text-sm dark:border-gray-700 dark:bg-[#101010]">
        <input
          type="checkbox"
          className="mt-1"
          checked={defaultLocked || makeDefault}
          disabled={defaultLocked}
          onChange={(event) => onMakeDefaultChange(event.target.checked)}
        />
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            Set as default payment card
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {defaultLocked
              ? "Your first saved card becomes the default automatically."
              : "The default card will be selected automatically for future purchases."}
          </p>
        </div>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0077F7] px-4 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Card Securely"}
        </button>
      </div>
    </form>
  );
}

export default function PaymentDetails({
  existing,
  onPaymentDetailsChange,
}: PaymentDetailsProps) {
  const [paymentDetailsSource, setPaymentDetailsSource] = useState<Record<string, any>>(
    existing || {}
  );
  const [cards, setCards] = useState<SavedPaymentCard[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [makeNewCardDefault, setMakeNewCardDefault] = useState(false);
  const [busyCardId, setBusyCardId] = useState<string | null>(null);

  useEffect(() => {
    const nextSource = existing || {};
    const nextCards = getSavedPaymentCards(nextSource);

    setPaymentDetailsSource(nextSource);
    setCards(nextCards);
    setMakeNewCardDefault(nextCards.length === 0);
    setNotice(null);
  }, [existing]);

  const activeCard = getActivePaymentCard(cards);
  const standbyCards = getStandbyPaymentCards(cards);

  const applyCardState = (
    nextCards: SavedPaymentCard[],
    apiData?: Record<string, any>,
    successMessage?: string
  ) => {
    const fallbackDetails = serializePaymentDetailsWithCards(
      paymentDetailsSource,
      nextCards
    );
    const nextPaymentDetails = buildPaymentDetailsFromApi(apiData, fallbackDetails);
    const normalizedCards = getSavedPaymentCards(nextPaymentDetails);

    setPaymentDetailsSource(nextPaymentDetails);
    setCards(normalizedCards);
    setMakeNewCardDefault(normalizedCards.length === 0);
    onPaymentDetailsChange?.(nextPaymentDetails);

    if (successMessage) {
      setNotice({
        tone: "success",
        text: successMessage,
      });
    }
  };

  const ensureStripeReady = async () => {
    if (stripePromise) return true;

    try {
      setLoadingStripe(true);
      const publishableKey = await fetchStripePublishableKey();
      if (!publishableKey) {
        throw new Error("Stripe publishable key is missing.");
      }

      setStripePromise(loadStripe(publishableKey));
      return true;
    } catch (error: any) {
      setNotice({
        tone: "error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Secure card setup is not available right now.",
      });
      return false;
    } finally {
      setLoadingStripe(false);
    }
  };

  const handleOpenAddCard = async () => {
    setNotice({
      tone: "info",
      text: "Card details are collected by Stripe. We only keep Stripe references and safe card metadata.",
    });

    setAddCardOpen(true);
    await ensureStripeReady();
  };

  const handleSetDefault = async (cardId: string) => {
    try {
      setBusyCardId(cardId);
      const fallbackCards = cards.map((card) => ({
        ...card,
        isDefault: card.id === cardId,
      }));

      const responseData = await setDefaultSavedCard(cardId);
      applyCardState(fallbackCards, responseData, "Default card updated.");
    } catch (error: any) {
      setNotice({
        tone: "error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update the default card.",
      });
    } finally {
      setBusyCardId(null);
    }
  };

  const handleRemove = async (card: SavedPaymentCard) => {
    if (card.canDelete === false) {
      setNotice({
        tone: "error",
        text:
          card.deletionBlockedReason ||
          "This card cannot be deleted right now.",
      });
      return;
    }

    try {
      setBusyCardId(card.id);

      const fallbackCards = cards
        .filter((entry) => entry.id !== card.id)
        .map((entry, index, remaining) => ({
          ...entry,
          isDefault:
            remaining.length > 0
              ? remaining.some((item) => item.isDefault)
                ? entry.isDefault
                : index === 0
              : false,
        }));

      const responseData = await deleteSavedCard(card.id);
      applyCardState(fallbackCards, responseData, "Saved card deleted.");
    } catch (error: any) {
      setNotice({
        tone: "error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete the card.",
      });
    } finally {
      setBusyCardId(null);
    }
  };

  const handleCardSaved = (
    apiData: Record<string, any>,
    setAsDefault: boolean
  ) => {
    const optimisticCards = cards
      .map((card) => ({
        ...card,
        isDefault: setAsDefault ? false : card.isDefault,
      }))
      .concat(
        buildPaymentDetailsFromApi(apiData, paymentDetailsSource)
          ? getSavedPaymentCards(buildPaymentDetailsFromApi(apiData, paymentDetailsSource))
              .filter(
                (card) => !cards.some((existingCard) => existingCard.id === card.id)
              )
          : []
      );

    applyCardState(optimisticCards, apiData, "Saved card wallet updated.");
    setAddCardOpen(false);
  };

  return (
    <div className="space-y-5 text-gray-900 transition-colors duration-300 dark:text-gray-100">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold">Saved Card Wallet</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your default card and secondary saved cards with Stripe-backed
            vaulting.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddCard}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0077F7] px-4 text-sm font-medium text-white transition hover:bg-blue-600"
        >
          Add New Card
        </button>
      </div>

      {notice && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${noticeToneClasses[notice.tone]}`}>
          {notice.text}
        </div>
      )}

      {addCardOpen && (
        <div className="space-y-4 rounded-xl border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-[#141414]">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Add a new saved card
            </h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Card details go directly to Stripe. This frontend stores only safe
              metadata and Stripe reference IDs.
            </p>
          </div>

          {loadingStripe ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-5 text-sm text-gray-600 dark:border-gray-700 dark:bg-[#101010] dark:text-gray-400">
              Loading secure card form...
            </div>
          ) : stripePromise ? (
            <Elements stripe={stripePromise}>
              <AddCardForm
                cardCount={cards.length}
                makeDefault={makeNewCardDefault}
                onMakeDefaultChange={setMakeNewCardDefault}
                onCancel={() => setAddCardOpen(false)}
                onSaved={handleCardSaved}
              />
            </Elements>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-5 text-sm text-gray-600 dark:border-gray-700 dark:bg-[#101010] dark:text-gray-400">
              Secure card entry is not ready yet.
            </div>
          )}
        </div>
      )}

      {activeCard ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Default card
          </p>
          <WalletCard
            card={activeCard}
            isDefault
            isBusy={busyCardId === activeCard.id}
            onRemove={() => handleRemove(activeCard)}
          />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-5 text-sm text-gray-600 dark:border-gray-700 dark:bg-[#101010] dark:text-gray-400">
          No saved cards were found for this account.
        </div>
      )}

      {standbyCards.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Secondary cards
          </p>
          <div className="space-y-3">
            {standbyCards.map((card) => (
              <WalletCard
                key={card.id}
                card={card}
                isBusy={busyCardId === card.id}
                onSetDefault={() => handleSetDefault(card.id)}
                onRemove={() => handleRemove(card)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
