import {
  getActivePaymentCard,
  getSavedPaymentCards,
  getStandbyPaymentCards,
  type SavedPaymentCard,
} from "@/lib/paymentCards";

const WalletCard = ({
  card,
  isActive,
}: {
  card: SavedPaymentCard;
  isActive?: boolean;
}) => (
  <div
    className={`rounded-lg border p-4 ${
      isActive
        ? "border-[#0077F7] bg-blue-50 dark:bg-blue-900/20"
        : "border-gray-300 bg-white dark:border-gray-700 dark:bg-[#101010]"
    }`}
  >
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold capitalize">
            {card.brand}
          </span>
          {isActive && (
            <span className="rounded-full bg-[#0077F7] px-2 py-0.5 text-[11px] font-medium text-white">
              Default
            </span>
          )}
        </div>

        <p className="mt-2 text-lg font-semibold tracking-wide">
          {card.maskedNumber}
        </p>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 sm:text-right">
        {card.expiry && <p>Expires {card.expiry}</p>}
      </div>
    </div>
  </div>
);

export default function PaymentDetails({ data }: { data?: Record<string, any> }) {
  const cards = getSavedPaymentCards(data);
  const activeCard = getActivePaymentCard(cards);
  const standbyCards = getStandbyPaymentCards(cards);

  return (
    <div className="space-y-5 text-gray-900 dark:text-gray-100">
      <div>
        <h3 className="text-base font-semibold">Saved Card Wallet</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Your default card and secondary saved cards.
        </p>
      </div>

      {activeCard ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Default card
          </p>
          <WalletCard card={activeCard} isActive />
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
              <WalletCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
