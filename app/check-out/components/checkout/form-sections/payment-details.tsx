"use client";

import { useMemo } from "react";
import SectionShell from "./section-shell";
import {
  getActivePaymentCard,
  getSavedPaymentCards,
  getStandbyPaymentCards,
} from "@/lib/paymentCards";

type PaymentDetailsProps = {
  profile?: {
    paymentDetails?: Record<string, any>;
  } | null;
  selectedOption: string;
  onSelectedOptionChange: (value: string) => void;
  saveNewCardForFuture: boolean;
  onSaveNewCardForFutureChange: (value: boolean) => void;
};

export default function PaymentDetails({
  profile,
  selectedOption,
  onSelectedOptionChange,
  saveNewCardForFuture,
  onSaveNewCardForFutureChange,
}: PaymentDetailsProps) {
  const storedCards = useMemo(
    () => getSavedPaymentCards(profile?.paymentDetails),
    [profile]
  );
  const activeCard = getActivePaymentCard(storedCards);
  const standbyCards = getStandbyPaymentCards(storedCards);

  return (
    <SectionShell title="Payment Details">
      <div className="space-y-4 text-gray-900 dark:text-gray-100">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose a saved card if one is available, or continue with Stripe to
          enter a new card, wallet, or buy now pay later option.
        </p>

        {activeCard ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Default card
              </p>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                  selectedOption === activeCard.id
                    ? "border-[#0077F7] bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 bg-white dark:border-gray-700 dark:bg-[#101010]"
                }`}
              >
                <input
                  type="radio"
                  name="storedPaymentCard"
                  className="mt-1"
                  checked={selectedOption === activeCard.id}
                  onChange={() => onSelectedOptionChange(activeCard.id)}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold capitalize">
                      {activeCard.brand}
                    </span>
                    {activeCard.last4 && (
                      <span className="text-sm">
                        ending in {activeCard.last4}
                      </span>
                    )}
                    <span className="rounded-full bg-[#0077F7] px-2 py-0.5 text-[11px] text-white">
                      Default
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {[
                      activeCard.expiry && `Expires ${activeCard.expiry}`,
                    ]
                      .filter(Boolean)
                      .join(" / ")}
                  </div>
                </div>
              </label>

            </div>

            {standbyCards.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Secondary cards
                </p>
                <div className="space-y-3">
                  {standbyCards.map((card) => (
                    <label
                      key={card.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                        selectedOption === card.id
                          ? "border-[#0077F7] bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 bg-white dark:border-gray-700 dark:bg-[#101010]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="storedPaymentCard"
                        className="mt-1"
                        checked={selectedOption === card.id}
                        onChange={() => onSelectedOptionChange(card.id)}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold capitalize">
                            {card.brand}
                          </span>
                          {card.last4 && (
                            <span className="text-sm">
                              ending in {card.last4}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {[
                            card.expiry && `Expires ${card.expiry}`,
                          ]
                            .filter(Boolean)
                            .join(" / ")}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-[#101010] dark:text-gray-400">
            No saved cards were found for this account.
          </div>
        )}

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-700 dark:bg-[#101010]">
          <input
            type="radio"
            name="storedPaymentCard"
            className="mt-1"
            checked={selectedOption === "new"}
            onChange={() => onSelectedOptionChange("new")}
          />
          <div>
            <p className="text-sm font-semibold">Use another payment method</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Stripe will securely collect payment details after you continue.
            </p>
          </div>
        </label>

        {selectedOption === "new" && (
          <label className="flex items-start gap-3 rounded-lg border border-dashed border-gray-300 bg-white p-3 text-sm dark:border-gray-700 dark:bg-[#101010]">
            <input
              type="checkbox"
              className="mt-1"
              checked={saveNewCardForFuture}
              onChange={(event) =>
                onSaveNewCardForFutureChange(event.target.checked)
              }
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Save this card for future purchases
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Stripe will vault the card. We only keep safe card metadata and
                Stripe reference IDs.
              </p>
            </div>
          </label>
        )}
      </div>
    </SectionShell>
  );
}


// "use client";

// import { useState } from "react";
// import SectionShell from "./section-shell";
// import Image from "next/image";

// export default function PaymentDetails() {
//   // Stripe default
//   const [paymentMethod, setPaymentMethod] = useState<string>("stripe");

//   const [form, setForm] = useState({
//     name: "",
//     cardNumber: "",
//     expiry: "",
//     cvc: "",
//   });

//   const [isDefault, setIsDefault] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <SectionShell title="Payment Details">
//       <div className="grid grid-cols-1 gap-6 text-gray-900 dark:text-gray-100">
//         {/* ------------------------------------ */}
//         {/* PAYMENT METHOD SELECTION (2 OPTIONS) */}
//         {/* ------------------------------------ */}
//         <div>
//           <h3 className="mb-2 text-sm text-gray-700 dark:text-gray-200">
//             Select Payment Method:
//           </h3>

//           <div className="grid grid-cols-2 gap-3">
//             {/* Mastercard */}
//             <button
//               onClick={() => setPaymentMethod("mastercard")}
//               className={`flex flex-col items-center justify-center gap-2 border rounded-xl py-3 
//               dark:bg-[#101010]
//               ${
//                 paymentMethod === "mastercard"
//                   ? "border-[#0077F7] ring-2 ring-[#0077F7]"
//                   : "border-gray-300 dark:border-gray-700"
//               }`}
//             >
//               <Image
//                 src="/images/mastercard-icon.png"
//                 width={40}
//                 height={40}
//                 alt="Mastercard"
//               />
//               <span className="text-sm">Mastercard</span>
//             </button>

//             {/* Stripe (DEFAULT) */}
//             <button
//               onClick={() => setPaymentMethod("stripe")}
//               className={`flex flex-col items-center justify-center gap-2 border rounded-xl py-3 
//               dark:bg-[#101010]
//               ${
//                 paymentMethod === "stripe"
//                   ? "border-[#0077F7] ring-2 ring-[#0077F7]"
//                   : "border-gray-300 dark:border-gray-700"
//               }`}
//             >
//               <Image
//                 src="/images/stripe.png"
//                 width={40}
//                 height={40}
//                 alt="Stripe"
//               />
//               <span className="text-sm">Stripe</span>
//             </button>
//           </div>
//         </div>

//         {/* ------------------------------------ */}
//         {/* CARD FIELDS (Only For Mastercard / Stripe) */}
//         {/* ------------------------------------ */}
//         {(paymentMethod === "mastercard" || paymentMethod === "stripe") && (
//           <>
//             {/* Name on Card */}
//             <div className="space-y-2">
//               <label className="text-sm text-gray-700 dark:text-gray-200">
//                 Name on Card:
//               </label>
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter Name"
//                 className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>

//             {/* Card Number */}
//             <div className="space-y-2">
//               <label className="text-sm text-gray-700 dark:text-gray-200">
//                 Card Number:
//               </label>
//               <input
//                 name="cardNumber"
//                 value={form.cardNumber}
//                 onChange={handleChange}
//                 required
//                 placeholder="0000-0000-0000-0000"
//                 className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>

//             {/* Expiry + CVC */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label className="text-sm text-gray-700 dark:text-gray-200">
//                   Expire Date:
//                 </label>
//                 <input
//                   name="expiry"
//                   value={form.expiry}
//                   onChange={handleChange}
//                   required
//                   placeholder="MM/YY"
//                   className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-gray-700 dark:text-gray-200">
//                   CVC:
//                 </label>
//                 <input
//                   name="cvc"
//                   value={form.cvc}
//                   onChange={handleChange}
//                   required
//                   placeholder="123"
//                   className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary"
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {/* ------------------------------------ */}
//         {/* DEFAULT SWITCH */}
//         {/* ------------------------------------ */}
//         <label className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
//           {/* Toggle Switch */}
//           <div
//             onClick={() => setIsDefault(!isDefault)}
//             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 
//       ${isDefault ? "bg-[#0077F7]" : "bg-gray-300 dark:bg-gray-700"}
//     `}
//           >
//             <span
//               className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-200 shadow transition-transform duration-300
//         ${isDefault ? "translate-x-5" : "translate-x-1"}
//       `}
//             />
//           </div>

//           {/* Responsive text */}
//           <span className="text-[13px] sm:text-sm leading-snug max-w-[80%]">
//             Set as default payment option for future purchases.
//           </span>
//         </label>
//       </div>
//     </SectionShell>
//   );
// }
