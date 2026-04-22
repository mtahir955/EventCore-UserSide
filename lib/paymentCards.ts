export type SavedPaymentCard = {
  id: string;
  paymentMethodId: string;
  stripeCustomerId?: string;
  brand: string;
  last4: string;
  maskedNumber: string;
  expiry: string;
  expMonth?: number;
  expYear?: number;
  nameOnCard?: string;
  isDefault: boolean;
  status?: string;
  canDelete?: boolean;
  deletionBlockedReason?: string;
  original?: Record<string, any>;
};

const CARD_COLLECTION_KEYS = [
  "cards",
  "savedCards",
  "savedPaymentMethods",
  "storedCards",
  "paymentMethods",
] as const;

const SENSITIVE_CARD_KEYS = new Set([
  "cardNumber",
  "number",
  "cvc",
  "cvv",
  "securityCode",
]);

const TOP_LEVEL_CARD_FIELDS = new Set([
  "id",
  "paymentMethodId",
  "stripePaymentMethodId",
  "stripeCustomerId",
  "sourceId",
  "brand",
  "cardBrand",
  "network",
  "last4",
  "cardLast4",
  "maskedNumber",
  "expiry",
  "expireDate",
  "expMonth",
  "expYear",
  "expiryMonth",
  "expiryYear",
  "status",
  "canDelete",
  "deletionBlockedReason",
  "nameOnCard",
  "cardholderName",
  "cardHolderName",
  "isDefault",
  "default",
  "isPrimary",
]);

export const getCardLast4 = (value?: unknown) => {
  const digits = String(value || "").replace(/\D/g, "");
  return digits ? digits.slice(-4) : "";
};

export const maskCardNumber = (value?: unknown, fallbackLast4?: string) => {
  const last4 = getCardLast4(value) || getCardLast4(fallbackLast4);
  return last4 ? `**** **** **** ${last4}` : "**** **** ****";
};

const parseExpiryParts = (value?: unknown) => {
  const text = String(value || "").trim();
  if (!text) return { expMonth: undefined, expYear: undefined };

  const match = text.match(/^(\d{1,2})\s*\/\s*(\d{2,4})$/);
  if (!match) return { expMonth: undefined, expYear: undefined };

  const month = Number(match[1]);
  const year = Number(match[2]);

  if (!Number.isFinite(month) || month < 1 || month > 12) {
    return { expMonth: undefined, expYear: undefined };
  }

  if (!Number.isFinite(year)) {
    return { expMonth: undefined, expYear: undefined };
  }

  return {
    expMonth: month,
    expYear: year < 100 ? 2000 + year : year,
  };
};

const getExpiry = (card: any) => {
  const explicit = card?.expiry || card?.expireDate || card?.card?.expiry;
  if (explicit) return String(explicit);

  const month = card?.expMonth || card?.expiryMonth || card?.card?.expMonth;
  const year = card?.expYear || card?.expiryYear || card?.card?.expYear;

  if (!month || !year) return "";

  const normalizedMonth = String(month).padStart(2, "0");
  const normalizedYear = String(year);

  return `${normalizedMonth}/${normalizedYear.slice(-2)}`;
};

const getExpiryMonth = (card: any) => {
  const explicitMonth =
    card?.expMonth || card?.expiryMonth || card?.exp_month || card?.card?.expMonth;
  if (explicitMonth) {
    const parsed = Number(explicitMonth);
    if (Number.isFinite(parsed)) return parsed;
  }

  return parseExpiryParts(card?.expiry || card?.expireDate || card?.card?.expiry)
    .expMonth;
};

const getExpiryYear = (card: any) => {
  const explicitYear =
    card?.expYear || card?.expiryYear || card?.exp_year || card?.card?.expYear;
  if (explicitYear) {
    const parsed = Number(explicitYear);
    if (Number.isFinite(parsed)) return parsed;
  }

  return parseExpiryParts(card?.expiry || card?.expireDate || card?.card?.expiry)
    .expYear;
};

export const normalizePaymentCard = (
  card: any,
  index: number
): SavedPaymentCard | null => {
  const last4 =
    card?.last4 ||
    card?.cardLast4 ||
    card?.card?.last4 ||
    getCardLast4(card?.cardNumber || card?.number || card?.card?.number);

  const nameOnCard =
    card?.nameOnCard ||
    card?.cardholderName ||
    card?.cardHolderName ||
    card?.name ||
    card?.billingDetails?.name ||
    "";

  const brand =
    card?.brand || card?.cardBrand || card?.network || card?.card?.brand || "Card";

  const expiry = getExpiry(card);
  const expMonth = getExpiryMonth(card);
  const expYear = getExpiryYear(card);
  const paymentMethodId =
    card?.paymentMethodId ||
    card?.id ||
    card?.stripePaymentMethodId ||
    card?.sourceId ||
    "";

  if (!last4 && !expiry && !paymentMethodId) {
    return null;
  }

  return {
    id: paymentMethodId || `stored-card-${index}`,
    paymentMethodId: paymentMethodId || `stored-card-${index}`,
    stripeCustomerId:
      card?.stripeCustomerId || card?.stripeCustomerID || card?.customerId,
    brand,
    last4,
    maskedNumber: maskCardNumber(card?.cardNumber || card?.number, last4),
    expiry,
    expMonth,
    expYear,
    nameOnCard,
    isDefault: Boolean(card?.isDefault ?? card?.default ?? card?.isPrimary),
    status: card?.status,
    canDelete:
      typeof card?.canDelete === "boolean"
        ? card.canDelete
        : typeof card?.deletionBlocked === "boolean"
          ? !card.deletionBlocked
          : undefined,
    deletionBlockedReason:
      card?.deletionBlockedReason || card?.deleteBlockedReason || card?.reason,
    original: card && typeof card === "object" ? card : undefined,
  };
};

export const getPaymentCardCollectionKey = (paymentDetails?: Record<string, any>) =>
  CARD_COLLECTION_KEYS.find((key) => Array.isArray(paymentDetails?.[key]));

export const getSavedPaymentCards = (
  paymentDetails?: Record<string, any>
): SavedPaymentCard[] => {
  const collectionKey = getPaymentCardCollectionKey(paymentDetails);
  const sourceCards = collectionKey ? paymentDetails?.[collectionKey] : undefined;

  const cards = Array.isArray(sourceCards)
    ? sourceCards
        .map((card: any, index: number) => normalizePaymentCard(card, index))
        .filter(Boolean)
    : [normalizePaymentCard(paymentDetails, 0)].filter(Boolean);

  const normalized = cards as SavedPaymentCard[];
  if (!normalized.length) return [];

  const hasDefault = normalized.some((card) => card.isDefault);
  return normalized.map((card, index) => ({
    ...card,
    isDefault: hasDefault ? card.isDefault : index === 0,
  }));
};

export const getActivePaymentCard = (cards: SavedPaymentCard[]) =>
  cards.find((card) => card.isDefault) || cards[0] || null;

export const getSavedPaymentMethodId = (card?: SavedPaymentCard | null) =>
  card?.paymentMethodId || card?.id || "";

export const getStandbyPaymentCards = (cards: SavedPaymentCard[]) => {
  const activeCard = getActivePaymentCard(cards);
  return cards.filter((card) => card.id !== activeCard?.id);
};

export const stripSensitivePaymentFields = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map((item) => stripSensitivePaymentFields(item));
  }

  if (!value || typeof value !== "object") return value;

  return Object.entries(value).reduce<Record<string, any>>((acc, [key, item]) => {
    if (SENSITIVE_CARD_KEYS.has(key)) return acc;
    acc[key] = stripSensitivePaymentFields(item);
    return acc;
  }, {});
};

const stripTopLevelPaymentCardFields = (value: Record<string, any>) =>
  Object.entries(value).reduce<Record<string, any>>((acc, [key, item]) => {
    if (TOP_LEVEL_CARD_FIELDS.has(key)) return acc;
    acc[key] = item;
    return acc;
  }, {});

const cardToSafePayload = (card: SavedPaymentCard) => {
  const stripped = stripSensitivePaymentFields(card.original || {});

  return {
    ...stripped,
    id: card.id,
    paymentMethodId: card.paymentMethodId,
    stripeCustomerId: card.stripeCustomerId,
    brand: card.brand,
    last4: card.last4,
    maskedNumber: card.maskedNumber,
    expiry: card.expiry,
    expMonth: card.expMonth,
    expYear: card.expYear,
    nameOnCard: card.nameOnCard,
    isDefault: card.isDefault,
    status: card.status,
    canDelete: card.canDelete,
    deletionBlockedReason: card.deletionBlockedReason,
  };
};

export const serializePaymentDetailsWithCards = (
  sourceDetails: Record<string, any> | undefined,
  cards: SavedPaymentCard[]
) => {
  const base = stripSensitivePaymentFields(sourceDetails || {});
  const collectionKey = getPaymentCardCollectionKey(sourceDetails || {});
  const safeCards = cards.map(cardToSafePayload);

  if (collectionKey) {
    return {
      ...stripTopLevelPaymentCardFields(base),
      [collectionKey]: safeCards,
    };
  }

  if (!safeCards.length) return stripTopLevelPaymentCardFields(base);

  const [activeCard, ...standbyCards] = safeCards;
  return standbyCards.length
    ? { ...base, ...activeCard, savedCards: safeCards }
    : { ...base, ...activeCard };
};

export const sanitizeProfilePaymentDetails = <T extends Record<string, any> | null>(
  profile: T
): T => {
  if (!profile) return profile;

  const paymentDetails = profile.paymentDetails || {};

  return {
    ...profile,
    paymentDetails: serializePaymentDetailsWithCards(
      paymentDetails,
      getSavedPaymentCards(paymentDetails)
    ),
  } as T;
};
